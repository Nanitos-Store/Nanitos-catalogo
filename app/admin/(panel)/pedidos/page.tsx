import { crearClienteServidor } from '@/lib/supabase/server';
import BotonExportarCsv from '@/components/admin/BotonExportarCsv';
import type { Pedido } from '@/lib/tipos';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function PedidosAdmin({ searchParams }: Props) {
  const supabase = crearClienteServidor();
  if (!supabase) return null;

  const q = typeof searchParams.q === 'string' ? searchParams.q : '';
  const { data } = await supabase
    .from('pedidos')
    .select('*, clientes(*), productos(nombre, codigo, slug)')
    .order('created_at', { ascending: false })
    .limit(200);

  let pedidos = (data ?? []) as unknown as Pedido[];
  if (q) {
    const qb = q.toLowerCase();
    pedidos = pedidos.filter(
      (p) =>
        p.clientes?.nombre?.toLowerCase().includes(qb) ||
        p.clientes?.whatsapp?.includes(qb) ||
        p.clientes?.ciudad?.toLowerCase().includes(qb) ||
        p.productos?.nombre?.toLowerCase().includes(qb)
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <div className="ml-auto">
          <BotonExportarCsv tabla="pedidos" />
        </div>
      </div>
      <form className="mb-3 flex gap-2" action="/admin/pedidos">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Buscar por cliente, WhatsApp, ciudad o producto…"
          className="flex-1 rounded-xl border border-tinta/15 bg-white px-4 py-2.5"
        />
        <button className="rounded-xl bg-tinta px-5 font-bold text-white">Buscar</button>
      </form>
      <ul className="space-y-2">
        {pedidos.map((p) => (
          <li key={p.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-tinta/5">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-bold">{p.clientes?.nombre ?? 'Cliente eliminado'}</span>
              <span className="text-tinta/50">
                {p.clientes?.pais === 'BO' ? '🇧🇴' : '🇦🇷'} {p.clientes?.ciudad}
              </span>
              <span className="ml-auto text-xs text-tinta/50">
                {new Date(p.created_at).toLocaleString('es-BO')}
              </span>
            </div>
            <p className="mt-1 text-sm">
              🧸 <strong>{p.productos?.nombre ?? 'Producto eliminado'}</strong>{' '}
              {p.productos?.codigo && (
                <span className="text-tinta/50">({p.productos.codigo})</span>
              )}{' '}
              · <span className="font-semibold text-celeste">{p.modalidad}</span>
              {p.cantidad > 1 && <span className="font-semibold"> ×{p.cantidad}</span>}
              {p.grupo_id && (
                <span className="ml-1 rounded-full bg-tinta/5 px-2 py-0.5 text-xs text-tinta/50">
                  🛒 pedido #{p.grupo_id.slice(0, 6)}
                </span>
              )}
            </p>
            {p.clientes?.whatsapp && (
              <a
                href={`https://wa.me/${p.clientes.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block rounded-full bg-whatsapp px-4 py-1.5 text-sm font-bold text-white"
              >
                Responder por WhatsApp
              </a>
            )}
          </li>
        ))}
        {pedidos.length === 0 && (
          <p className="rounded-2xl bg-white p-6 text-center text-tinta/60">
            Todavía no hay pedidos registrados.
          </p>
        )}
      </ul>
    </div>
  );
}
