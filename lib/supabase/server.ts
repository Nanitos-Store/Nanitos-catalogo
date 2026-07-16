import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

type CookieParaEscribir = { name: string; value: string; options?: CookieOptions };

/**
 * Cliente de Supabase para Server Components / Server Actions (clave anónima).
 * Devuelve null si las variables de entorno aún no están configuradas para que
 * el sitio pueda renderizar en modo "sin datos" durante la instalación.
 */
export function crearClienteServidor() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;

  const cookieStore = cookies();
  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieParaEscribir[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Ignorado en Server Components (solo escribe en Server Actions / Route Handlers)
        }
      },
    },
  });
}
