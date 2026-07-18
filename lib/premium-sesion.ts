import 'server-only';
import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

/** Sesión de la cuenta Premium: token HMAC en cookie httpOnly. */

export const COOKIE_SESION_PREMIUM = 'nanitos_premium_sesion';
export const COOKIE_NOMBRE_PREMIUM = 'nanitos_premium_nombre';

const DURACION_SEGUNDOS = 60 * 60 * 24 * 30; // 30 días

function secreto() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
}

function firmar(payload: string) {
  return createHmac('sha256', `premium:${secreto()}`).update(payload).digest('hex');
}

export function crearTokenPremium(cuentaId: string, usuario: string, nombre: string) {
  const payload = Buffer.from(
    JSON.stringify({
      cid: cuentaId,
      u: usuario,
      n: nombre,
      exp: Date.now() + DURACION_SEGUNDOS * 1000,
    })
  ).toString('base64url');
  return `${payload}.${firmar(payload)}`;
}

export interface SesionPremium {
  cuentaId: string;
  usuario: string;
  nombre: string;
}

export function verificarTokenPremium(token: string | undefined): SesionPremium | null {
  if (!token || !secreto()) return null;
  const [payload, firma] = token.split('.');
  if (!payload || !firma) return null;
  const esperada = firmar(payload);
  const a = Buffer.from(firma);
  const b = Buffer.from(esperada);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const datos = JSON.parse(Buffer.from(payload, 'base64url').toString()) as {
      cid: string;
      u: string;
      n: string;
      exp: number;
    };
    if (!datos.cid || Date.now() > datos.exp) return null;
    return { cuentaId: datos.cid, usuario: datos.u, nombre: datos.n };
  } catch {
    return null;
  }
}

export function sesionPremiumActual(): SesionPremium | null {
  return verificarTokenPremium(cookies().get(COOKIE_SESION_PREMIUM)?.value);
}

export function opcionesCookiePremium() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    maxAge: DURACION_SEGUNDOS,
    path: '/',
  };
}
