'use client';

import { createBrowserClient } from '@supabase/ssr';

/** Cliente de Supabase para componentes del navegador (clave anónima). */
export function crearClienteNavegador() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createBrowserClient(url, anon);
}
