import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

/**
 * Meta Conversions API: duplica ViewContent y Lead server-side con
 * deduplicación por event_id compartido con el Pixel del navegador.
 */
export async function POST(request: NextRequest) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;
  if (!pixelId || !token) {
    return NextResponse.json({ ok: false, motivo: 'capi_no_configurado' });
  }

  let cuerpo: {
    event_name?: string;
    event_id?: string;
    event_source_url?: string;
    custom_data?: Record<string, unknown>;
    fbp?: string;
    fbc?: string;
  };
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const eventosPermitidos = ['PageView', 'ViewContent', 'Search', 'Lead'];
  if (!cuerpo.event_name || !eventosPermitidos.includes(cuerpo.event_name)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? undefined;
  const userAgent = request.headers.get('user-agent') ?? undefined;

  const userData: Record<string, unknown> = {
    client_ip_address: ip,
    client_user_agent: userAgent,
  };
  if (cuerpo.fbp) userData.fbp = cuerpo.fbp;
  if (cuerpo.fbc) userData.fbc = cuerpo.fbc;
  // external_id opcional a partir de la IP+UA (hasheado, como exige Meta)
  if (ip && userAgent) {
    userData.external_id = createHash('sha256').update(`${ip}${userAgent}`).digest('hex');
  }

  const payload = {
    data: [
      {
        event_name: cuerpo.event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: cuerpo.event_id,
        event_source_url: cuerpo.event_source_url,
        action_source: 'website',
        user_data: userData,
        custom_data: cuerpo.custom_data ?? {},
      },
    ],
  };

  try {
    const respuesta = await fetch(
      `https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
    return NextResponse.json({ ok: respuesta.ok });
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
