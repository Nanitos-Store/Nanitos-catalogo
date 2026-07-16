'use server';

import { cookies } from 'next/headers';
import { crearClienteAdmin } from '@/lib/supabase/admin';
import { COOKIE_CLIENTE, esPais } from '@/lib/pais';
import type { Modalidad, Pais } from '@/lib/tipos';

export interface ResultadoRegistro {
  ok: boolean;
  error?: string;
  cliente?: { id: string; nombre: string; ciudad: string; pais: Pais };
}

/** Registro único del comprador: upsert por correo (viene de Google). */
export async function registrarCliente(datos: {
  nombre: string;
  email: string;
  pais: string;
  ciudad: string;
}): Promise<ResultadoRegistro> {
  const nombre = datos.nombre.trim();
  const ciudad = datos.ciudad.trim();
  const email = datos.email.trim().toLowerCase();
  if (nombre.length < 2) return { ok: false, error: 'Escribe tu nombre.' };
  if (ciudad.length < 2) return { ok: false, error: 'Escribe tu ciudad.' };
  if (!esPais(datos.pais)) return { ok: false, error: 'Elige tu país.' };
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, error: 'Conecta tu cuenta de Google para continuar.' };
  }

  const supabase = crearClienteAdmin();
  if (!supabase) {
    return { ok: false, error: 'El sitio aún no está conectado a la base de datos.' };
  }

  const { data, error } = await supabase
    .from('clientes')
    .upsert(
      {
        nombre,
        email,
        pais: datos.pais,
        ciudad,
        origen: 'web-catalogo',
      },
      { onConflict: 'email' }
    )
    .select('id, nombre, ciudad, pais')
    .single();

  if (error || !data) {
    return { ok: false, error: 'No pudimos guardar tus datos. Intenta de nuevo.' };
  }

  cookies().set(COOKIE_CLIENTE, data.id, {
    maxAge: 60 * 60 * 24 * 365 * 2,
    path: '/',
    sameSite: 'lax',
  });

  return {
    ok: true,
    cliente: {
      id: data.id,
      nombre: data.nombre,
      ciudad: data.ciudad ?? ciudad,
      pais: data.pais as Pais,
    },
  };
}

/** Log de cada clic "Hacer pedido" en la tabla pedidos. */
export async function registrarPedido(datos: {
  clienteId: string | null;
  productoId: string;
  modalidad: Modalidad;
  mensaje: string;
  utm?: Record<string, string> | null;
}): Promise<void> {
  const supabase = crearClienteAdmin();
  if (!supabase) return;
  await supabase.from('pedidos').insert({
    cliente_id: datos.clienteId,
    producto_id: datos.productoId,
    modalidad: datos.modalidad,
    mensaje_enviado: datos.mensaje,
    utm: datos.utm && Object.keys(datos.utm).length > 0 ? datos.utm : null,
  });
}

/** Log de un pedido por carrito: una fila por producto, unidas por grupo_id. */
export async function registrarPedidoGrupo(datos: {
  clienteId: string | null;
  items: { productoId: string; modalidad: Modalidad; cantidad: number }[];
  mensaje: string;
  utm?: Record<string, string> | null;
}): Promise<void> {
  const supabase = crearClienteAdmin();
  if (!supabase || datos.items.length === 0) return;
  const grupoId = crypto.randomUUID();
  const utm = datos.utm && Object.keys(datos.utm).length > 0 ? datos.utm : null;
  await supabase.from('pedidos').insert(
    datos.items.map((item) => ({
      cliente_id: datos.clienteId,
      producto_id: item.productoId,
      modalidad: item.modalidad,
      cantidad: Math.max(1, Math.min(99, Math.round(item.cantidad))),
      grupo_id: grupoId,
      mensaje_enviado: datos.mensaje,
      utm,
    }))
  );
}

/** Completa los datos Premium del cliente (tienda, fanpage, rubro). */
export async function actualizarPremium(datos: {
  clienteId: string;
  nombreTienda: string;
  fanpage: string;
  rubro: string;
}): Promise<{ ok: boolean; error?: string }> {
  const nombreTienda = datos.nombreTienda.trim();
  if (nombreTienda.length < 2) {
    return { ok: false, error: 'Escribe el nombre de tu tienda o emprendimiento.' };
  }
  const supabase = crearClienteAdmin();
  if (!supabase) {
    return { ok: false, error: 'El sitio aún no está conectado a la base de datos.' };
  }
  const { error } = await supabase
    .from('clientes')
    .update({
      es_premium: true,
      nombre_tienda: nombreTienda,
      fanpage: datos.fanpage.trim() || null,
      rubro: datos.rubro.trim() || null,
    })
    .eq('id', datos.clienteId);
  if (error) return { ok: false, error: 'No pudimos guardar tus datos. Intenta de nuevo.' };
  return { ok: true };
}
