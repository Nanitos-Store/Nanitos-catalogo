import 'server-only';
import { createClient } from '@supabase/supabase-js';

/**
 * Cliente con service role — SOLO para server actions y route handlers.
 * Salta RLS: usar únicamente con validación previa de datos o de rol.
 * La clave vive solo en variables de entorno del servidor.
 */
export function crearClienteAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRole) return null;
  return createClient(url, serviceRole, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
