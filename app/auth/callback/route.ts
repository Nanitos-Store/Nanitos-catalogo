import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

type CookieParaEscribir = { name: string; value: string; options?: CookieOptions };

/** Callback de OAuth (Google): intercambia el código por sesión y vuelve al sitio. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';
  const destino = next.startsWith('/') ? next : '/';

  const respuesta = NextResponse.redirect(`${origin}${destino}`);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!code || !url || !anon) return respuesta;

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieParaEscribir[]) {
        cookiesToSet.forEach(({ name, value, options }) =>
          respuesta.cookies.set(name, value, options)
        );
      },
    },
  });

  await supabase.auth.exchangeCodeForSession(code);
  return respuesta;
}
