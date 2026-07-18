import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

type CookieParaEscribir = { name: string; value: string; options?: CookieOptions };

/** Protege todo /admin/* (excepto /admin/login) con Supabase Auth. */
export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const respuesta = NextResponse.next({ request });
  if (!url || !anon) {
    return NextResponse.redirect(new URL('/', request.url));
  }

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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Sesión del login maestro del footer (la firma se verifica en el layout,
  // que corre en Node; aquí solo decidimos la redirección)
  const sesionMaestra = Boolean(request.cookies.get('nanitos_admin_sesion')?.value);

  const esLogin = request.nextUrl.pathname === '/admin/login';
  if (!user && !sesionMaestra && !esLogin) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  if ((user || sesionMaestra) && esLogin) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }
  return respuesta;
}

export const config = {
  matcher: ['/admin/:path*'],
};
