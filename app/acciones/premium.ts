'use server';

import { cookies } from 'next/headers';
import { crearClienteAdmin } from '@/lib/supabase/admin';
import {
  COOKIE_NOMBRE_PREMIUM,
  COOKIE_SESION_PREMIUM,
  crearTokenPremium,
  opcionesCookiePremium,
  sesionPremiumActual,
} from '@/lib/premium-sesion';
import type { DeseoPremium } from '@/lib/tipos';

interface Resultado {
  ok: boolean;
  error?: string;
  nombre?: string;
}

/** Login de la sección Premium. */
export async function iniciarSesionPremium(datos: {
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
  const { data, error } = await supabase.rpc('premium_verificar', {
    p_usuario: usuario,
    p_password: datos.password,
  });
  const cuenta = data as { id: string; nombre: string } | null;
  if (error || !cuenta?.id) {
    return { ok: false, error: 'Usuario o contraseña incorrectos.' };
  }
  const jar = cookies();
  jar.set(
    COOKIE_SESION_PREMIUM,
    crearTokenPremium(cuenta.id, usuario, cuenta.nombre),
    opcionesCookiePremium()
  );
  jar.set(COOKIE_NOMBRE_PREMIUM, cuenta.nombre, {
    ...opcionesCookiePremium(),
    httpOnly: false,
  });
  return { ok: true, nombre: cuenta.nombre };
}

export async function cerrarSesionPremium(): Promise<void> {
  const jar = cookies();
  jar.delete(COOKIE_SESION_PREMIUM);
  jar.delete(COOKIE_NOMBRE_PREMIUM);
}

export async function cambiarPasswordPremium(datos: {
  anterior: string;
  nueva: string;
}): Promise<Resultado> {
  const sesion = sesionPremiumActual();
  if (!sesion) return { ok: false, error: 'Tu sesión expiró. Vuelve a entrar.' };
  if (datos.nueva.length < 6) {
    return { ok: false, error: 'La nueva contraseña necesita al menos 6 caracteres.' };
  }
  const supabase = crearClienteAdmin();
  if (!supabase) {
    return { ok: false, error: 'El sitio aún no está conectado a la base de datos.' };
  }
  const { data, error } = await supabase.rpc('premium_cambiar_password', {
    p_usuario: sesion.usuario,
    p_anterior: datos.anterior,
    p_nueva: datos.nueva,
  });
  if (error || data !== true) {
    return { ok: false, error: 'La contraseña anterior no coincide.' };
  }
  return { ok: true };
}

/** Lista de deseos del premium con sesión activa. */
export async function agregarDeseo(datos: {
  producto: string;
  detalle: string;
}): Promise<Resultado & { deseos?: DeseoPremium[] }> {
  const sesion = sesionPremiumActual();
  if (!sesion) return { ok: false, error: 'Tu sesión expiró. Vuelve a entrar.' };
  const producto = datos.producto.trim();
  if (producto.length < 2) {
    return { ok: false, error: 'Escribe qué producto te gustaría que importemos.' };
  }
  const supabase = crearClienteAdmin();
  if (!supabase) return { ok: false, error: 'Sin conexión a la base de datos.' };
  const { error } = await supabase.from('lista_deseos').insert({
    cuenta_premium_id: sesion.cuentaId,
    producto,
    detalle: datos.detalle.trim() || null,
  });
  if (error) return { ok: false, error: 'No se pudo guardar. Intenta de nuevo.' };
  return { ok: true, deseos: await listarDeseos() };
}

export async function quitarDeseo(deseoId: string): Promise<Resultado & { deseos?: DeseoPremium[] }> {
  const sesion = sesionPremiumActual();
  if (!sesion) return { ok: false, error: 'Tu sesión expiró.' };
  const supabase = crearClienteAdmin();
  if (!supabase) return { ok: false, error: 'Sin conexión a la base de datos.' };
  await supabase
    .from('lista_deseos')
    .delete()
    .eq('id', deseoId)
    .eq('cuenta_premium_id', sesion.cuentaId);
  return { ok: true, deseos: await listarDeseos() };
}

export async function listarDeseos(): Promise<DeseoPremium[]> {
  const sesion = sesionPremiumActual();
  if (!sesion) return [];
  const supabase = crearClienteAdmin();
  if (!supabase) return [];
  const { data } = await supabase
    .from('lista_deseos')
    .select('*')
    .eq('cuenta_premium_id', sesion.cuentaId)
    .order('created_at', { ascending: false });
  return (data ?? []) as DeseoPremium[];
}
