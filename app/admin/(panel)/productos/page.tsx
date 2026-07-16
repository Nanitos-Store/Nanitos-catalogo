import Link from 'next/link';
import { crearClienteServidor } from '@/lib/supabase/server';
import ListaProductosAdmin from '@/components/admin/ListaProductosAdmin';
import type { Producto } from '@/lib/tipos';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function ProductosAdmin({ searchParams }: Props) {
  const supabase = crearClienteServidor();
  if (!supabase) return null;

  const q = typeof searchParams.q === 'string' ? searchParams.q : '';
  const filtro = typeof searchParams.filtro === 'string' ? searchParams.filtro : '';

  let query = supabase
    .from('productos')
    .select('*, categorias(*), producto_imagenes(*)')
    .order('orden')
    .limit(200);
  if (q) query = query.or(`nombre.ilike.%${q}%,codigo.ilike.%${q}%`);
  if (filtro === 'sin-verificar') query = query.eq('precio_verificado', false);

  const { data } = await query;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="ml-auto rounded-full bg-celeste px-5 py-2.5 font-bold text-white"
        >
          + Nuevo producto
        </Link>
      </div>

      <form className="mb-3 flex flex-wrap gap-2" action="/admin/productos">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Buscar por nombre o código…"
          className="min-w-48 flex-1 rounded-xl border border-tinta/15 bg-white px-4 py-2.5"
        />
        {filtro && <input type="hidden" name="filtro" value={filtro} />}
        <button className="rounded-xl bg-tinta px-5 font-bold text-white">Buscar</button>
      </form>

      <div className="mb-4 flex gap-2 text-sm">
        <Link
          href="/admin/productos"
          className={`rounded-full px-4 py-1.5 font-bold ${
            filtro !== 'sin-verificar' ? 'bg-celeste text-white' : 'bg-white ring-1 ring-tinta/10'
          }`}
        >
          Todos
        </Link>
        <Link
          href="/admin/productos?filtro=sin-verificar"
          className={`rounded-full px-4 py-1.5 font-bold ${
            filtro === 'sin-verificar' ? 'bg-coral text-white' : 'bg-white ring-1 ring-tinta/10'
          }`}
        >
          ⚠️ Precios sin verificar
        </Link>
      </div>

      <ListaProductosAdmin productos={(data ?? []) as Producto[]} />
    </div>
  );
}
