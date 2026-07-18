'use server';

import { cookies } from 'next/headers';
import { crearClienteAdmin } from '@/lib/supabase/admin';
import {
  COOKIE_NOMBRE_ADMIN,
  COOKIE_SESION_ADMIN,
  crearTokenAdmin,
  opcionesCookieSesion,
  sesionAdminActual,
} from '@/lib/admin-sesion';

interface Resultado {
  ok: boolean;
  error?: string;
  nombre?: string;
}

/** Login maestro del footer: valida contra cuentas_admin (hash bcrypt en BD). */
export async function iniciarSesionAdmin(datos: {
  usuario: string;
  password: string;
}): Promise<Resultado> {
  const usuario = datos.usuario.trim();
  if (!usuario || !datos.password) {
    return { ok: false, error: 'Completa usuario y contraseña.' };
  }
  const supabase = crearClienteAdmin();
  if (!supabase) {
    return { ok: false, error: 'El sitio aún no está conectado a la base de datos.' };
  }
  const { data, error } = await supabase.rpc('admin_verificar', {
    p_usuario: usuario,
    p_password: datos.password,
  });
  if (error || !data) {
    return { ok: false, error: 'Usuario o contraseña incorrectos.' };
  }
  const nombre = data as string;
  const jar = cookies();
  jar.set(COOKIE_SESION_ADMIN, crearTokenAdmin(usuario, nombre), opcionesCookieSesion());
  jar.set(COOKIE_NOMBRE_ADMIN, nombre, { ...opcionesCookieSesion(), httpOnly: false });
  return { ok: true, nombre };
}

export async function cerrarSesionAdmin(): Promise<void> {
  const jar = cookies();
  jar.delete(COOKIE_SESION_ADMIN);
  jar.delete(COOKIE_NOMBRE_ADMIN);
}

/** Cambio de contraseña exigiendo la anterior. */
export async function cambiarPasswordAdmin(datos: {
  anterior: string;
  nueva: string;
}): Promise<Resultado> {
  const sesion = sesionAdminActual();
  if (!sesion) return { ok: false, error: 'Tu sesión expiró. Vuelve a entrar.' };
  if (datos.nueva.length < 6) {
    return { ok: false, error: 'La nueva contraseña necesita al menos 6 caracteres.' };
  }
  const supabase = crearClienteAdmin();
  if (!supabase) {
    return { ok: false, error: 'El sitio aún no está conectado a la base de datos.' };
  }
  const { data, error } = await supabase.rpc('admin_cambiar_password', {
    p_usuario: sesion.usuario,
    p_anterior: datos.anterior,
    p_nueva: datos.nueva,
  });
  if (error || data !== true) {
    return { ok: false, error: 'La contraseña anterior no coincide.' };
  }
  return { ok: true };
}
