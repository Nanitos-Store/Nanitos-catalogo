import 'server-only';
import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

/**
 * Sesión del login maestro del footer: token firmado (HMAC) guardado en una
 * cookie httpOnly. El secreto es la service role key, que solo vive en el
 * servidor.
 */

export const COOKIE_SESION_ADMIN = 'nanitos_admin_sesion';
export const COOKIE_NOMBRE_ADMIN = 'nanitos_admin_nombre';

const DURACION_SEGUNDOS = 60 * 60 * 24 * 14; // 14 días

function secreto() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
}

function firmar(payload: string) {
  return createHmac('sha256', secreto()).update(payload).digest('hex');
}

export function crearTokenAdmin(usuario: string, nombre: string) {
  const payload = Buffer.from(
    JSON.stringify({ u: usuario, n: nombre, exp: Date.now() + DURACION_SEGUNDOS * 1000 })
  ).toString('base64url');
  return `${payload}.${firmar(payload)}`;
}

export interface SesionAdmin {
  usuario: string;
  nombre: string;
}

export function verificarTokenAdmin(token: string | undefined): SesionAdmin | null {
  if (!token || !secreto()) return null;
  const [payload, firma] = token.split('.');
  if (!payload || !firma) return null;
  const esperada = firmar(payload);
  const a = Buffer.from(firma);
  const b = Buffer.from(esperada);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const datos = JSON.parse(Buffer.from(payload, 'base64url').toString()) as {
      u: string;
      n: string;
      exp: number;
    };
    if (!datos.u || Date.now() > datos.exp) return null;
    return { usuario: datos.u, nombre: datos.n };
  } catch {
    return null;
  }
}

/** Lee la sesión maestra desde las cookies del request actual. */
export function sesionAdminActual(): SesionAdmin | null {
  return verificarTokenAdmin(cookies().get(COOKIE_SESION_ADMIN)?.value);
}

export function opcionesCookieSesion() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    maxAge: DURACION_SEGUNDOS,
    path: '/',
  };
}
