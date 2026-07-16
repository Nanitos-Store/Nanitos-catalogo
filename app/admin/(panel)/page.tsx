import Link from 'next/link';
import { crearClienteServidor } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function DashboardAdmin() {
  const supabase = crearClienteServidor();
  if (!supabase) return null;

  const hace7dias = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [productos, sinVerificar, clientes, pedidos] = await Promise.all([
    supabase.from('productos').select('id', { count: 'exact', head: true }),
    supabase
      .from('productos')
      .select('id', { count: 'exact', head: true })
      .eq('precio_verificado', false),
    supabase.from('clientes').select('id', { count: 'exact', head: true }),
    supabase
      .from('pedidos')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', hace7dias),
  ]);

  const tarjetas = [
    { texto: 'Productos', valor: productos.count ?? 0, href: '/admin/productos' },
    {
      texto: 'Precios sin verificar',
      valor: sinVerificar.count ?? 0,
      href: '/admin/productos?filtro=sin-verificar',
      alerta: (sinVerificar.count ?? 0) > 0,
    },
    { texto: 'Clientes registrados', valor: clientes.count ?? 0, href: '/admin/clientes' },
    { texto: 'Pedidos (últimos 7 días)', valor: pedidos.count ?? 0, href: '/admin/pedidos' },
  ];

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Hola 👋</h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tarjetas.map((t) => (
          <Link
            key={t.texto}
            href={t.href}
            className={`rounded-2xl p-4 shadow-sm ring-1 transition hover:shadow-md ${
              t.alerta ? 'bg-coral/10 ring-coral/30' : 'bg-white ring-tinta/5'
            }`}
          >
            <p className={`text-3xl font-bold ${t.alerta ? 'text-coral' : ''}`}>{t.valor}</p>
            <p className="mt-1 text-sm text-tinta/70">{t.texto}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
