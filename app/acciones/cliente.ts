'use server';

import { cookies } from 'next/headers';
import { crearClienteAdmin } from '@/lib/supabase/admin';
import { COOKIE_CLIENTE, esPais } from '@/lib/pais';
import type { Modalidad, Pais } from '@/lib/tipos';

const PREFIJOS: Record<Pais, string> = { BO: '591', AR: '54' };

function normalizarWhatsApp(entrada: string, pais: Pais): string | null {
  const digitos = entrada.replace(/\D/g, '');
  if (digitos.length < 8) return null;
  const prefijo = PREFIJOS[pais];
  const numero = digitos.startsWith(prefijo) ? digitos : `${prefijo}${digitos}`;
  // BO: 591 + 8 dígitos = 11 · AR: 54 + 10/11 dígitos (con o sin 9) = 12/13
  if (pais === 'BO' && numero.length !== 11) return null;
  if (pais === 'AR' && (numero.length < 12 || numero.length > 13)) return null;
  return numero;
}

export interface ResultadoRegistro {
  ok: boolean;
  error?: string;
  cliente?: { id: string; nombre: string; ciudad: string; pais: Pais };
}

/** Registro único del comprador: upsert por whatsapp. */
export async function registrarCliente(datos: {
  nombre: string;
  email: string;
  whatsapp: string;
  pais: string;
  ciudad: string;
}): Promise<ResultadoRegistro> {
  const nombre = datos.nombre.trim();
  const ciudad = datos.ciudad.trim();
  const email = datos.email.trim();
  if (nombre.length < 2) return { ok: false, error: 'Escribe tu nombre.' };
  if (ciudad.length < 2) return { ok: false, error: 'Escribe tu ciudad.' };
  if (!esPais(datos.pais)) return { ok: false, error: 'Elige tu país.' };
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, error: 'Revisa tu correo electrónico.' };
  }
  const whatsapp = normalizarWhatsApp(datos.whatsapp, datos.pais);
  if (!whatsapp) {
    return { ok: false, error: 'Revisa tu número de WhatsApp (con código de área).' };
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
        email: email || null,
        whatsapp,
        pais: datos.pais,
        ciudad,
        origen: 'web-catalogo',
      },
      { onConflict: 'whatsapp' }
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
