import { crearClienteServidor } from '@/lib/supabase/server';
import BotonExportarCsv from '@/components/admin/BotonExportarCsv';
import type { Cliente } from '@/lib/tipos';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function ClientesAdmin({ searchParams }: Props) {
  const supabase = crearClienteServidor();
  if (!supabase) return null;

  const q = typeof searchParams.q === 'string' ? searchParams.q : '';
  let query = supabase
    .from('clientes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);
  if (q) query = query.or(`nombre.ilike.%${q}%,whatsapp.ilike.%${q}%,ciudad.ilike.%${q}%`);
  const { data } = await query;
  const clientes = (data ?? []) as Cliente[];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <div className="ml-auto">
          <BotonExportarCsv tabla="clientes" />
        </div>
      </div>
      <form className="mb-3 flex gap-2" action="/admin/clientes">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Buscar por nombre, WhatsApp o ciudad…"
          className="flex-1 rounded-xl border border-tinta/15 bg-white px-4 py-2.5"
        />
        <button className="rounded-xl bg-tinta px-5 font-bold text-white">Buscar</button>
      </form>
      <ul className="space-y-2">
        {clientes.map((c) => (
          <li key={c.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-tinta/5">
            <div className="flex flex-wrap items-center gap-2">
              <div className="min-w-0 flex-1">
                <p className="font-bold">
                  {c.nombre}
                  {c.es_premium && (
                    <span className="ml-2 rounded-full bg-amarillo/20 px-2 py-0.5 text-xs font-bold text-naranja">
                      ⭐ Premium
                    </span>
                  )}
                </p>
                <p className="text-sm text-tinta/60">
                  {c.pais === 'BO' ? '🇧🇴' : '🇦🇷'} {c.ciudad ?? 'sin ciudad'} ·{' '}
                  {new Date(c.created_at).toLocaleDateString('es-BO')}
                </p>
                {c.es_premium && (
                  <p className="text-sm text-tinta/60">
                    🏪 {c.nombre_tienda ?? 'sin nombre de tienda'}
                    {c.fanpage && <> · 📱 {c.fanpage}</>}
                    {c.rubro && <> · {c.rubro}</>}
                  </p>
                )}
              </div>
              <a
                href={`https://wa.me/${c.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-whatsapp px-4 py-1.5 text-sm font-bold text-white"
              >
                +{c.whatsapp}
              </a>
            </div>
          </li>
        ))}
        {clientes.length === 0 && (
          <p className="rounded-2xl bg-white p-6 text-center text-tinta/60">
            Todavía no hay clientes registrados.
          </p>
        )}
      </ul>
    </div>
  );
}
