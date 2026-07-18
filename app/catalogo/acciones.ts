'use server';

import { crearClienteServidor } from '@/lib/supabase/server';
import type { Producto } from '@/lib/tipos';

export interface FiltrosCatalogo {
  q?: string;
  categoria?: string;
  personaje?: string;
  temporada?: string;
  modalidad?: string;
  oferta?: boolean;
  disponibles?: boolean;
}

export interface Cursor {
  orden: number;
  id: string;
}

export interface PaginaCatalogo {
  productos: Producto[];
  siguiente: Cursor | null;
}

const TAMANO_PAGINA = 24;

/** Página de catálogo con filtros combinables y paginación por cursor (keyset). */
export async function cargarPaginaCatalogo(
  filtros: FiltrosCatalogo,
  cursor: Cursor | null
): Promise<PaginaCatalogo> {
  const supabase = crearClienteServidor();
  if (!supabase) return { productos: [], siguiente: null };

  const hoy = new Date().toISOString().slice(0, 10);
  let query = supabase
    .from('productos')
    .select('*, categorias!inner(*), producto_imagenes(*)')
    // Los lanzamientos con fecha futura solo se ven en la sección Premium
    .or(`fecha_publica.is.null,fecha_publica.lte.${hoy}`)
    .order('orden', { ascending: true })
    .order('id', { ascending: true })
    .limit(TAMANO_PAGINA);

  if (filtros.categoria) query = query.eq('categorias.slug', filtros.categoria);
  if (filtros.personaje) query = query.contains('personajes', [filtros.personaje]);
  if (filtros.temporada) query = query.contains('temporada', [filtros.temporada]);
  if (filtros.modalidad === 'docena') query = query.eq('vende_por_docena', true);
  if (filtros.modalidad === 'caja') query = query.eq('vende_por_caja', true);
  if (filtros.oferta) query = query.eq('en_oferta', true);
  if (filtros.disponibles !== false) query = query.eq('disponible', true);
  if (filtros.q) {
    const q = filtros.q.replace(/[%,()]/g, ' ').trim();
    if (q) query = query.or(`nombre.ilike.%${q}%,codigo.ilike.%${q}%`);
  }
  if (cursor) {
    query = query.or(
      `orden.gt.${cursor.orden},and(orden.eq.${cursor.orden},id.gt.${cursor.id})`
    );
  }

  const { data, error } = await query;
  if (error || !data) return { productos: [], siguiente: null };

  const productos = data as Producto[];
  const ultimo = productos[productos.length - 1];
  return {
    productos,
    siguiente:
      productos.length === TAMANO_PAGINA && ultimo
        ? { orden: ultimo.orden, id: ultimo.id }
        : null,
  };
}
