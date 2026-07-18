import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { crearClienteAdmin } from '@/lib/supabase/admin';
import { sesionPremiumActual } from '@/lib/premium-sesion';
import { listarDeseos } from '@/app/acciones/premium';
import { COOKIE_PAIS, esPais } from '@/lib/pais';
import FormularioPremium from '@/components/FormularioPremium';
import LoginPremium from '@/components/LoginPremium';
import PanelPremium from '@/components/PanelPremium';
import TarjetaProducto from '@/components/TarjetaProducto';
import type { Pais, Producto } from '@/lib/tipos';

export const metadata: Metadata = {
  title: 'Sección Premium Ñañilovers',
  description:
    'Acceso anticipado a novedades, preferencia de compra, precios más competitivos y tu lista de deseos para las próximas importaciones.',
};

export const dynamic = 'force-dynamic';

const BENEFICIOS = [
  { icono: '🚀', titulo: 'Acceso anticipado', texto: 'Ve y pide las novedades antes de que lleguen al catálogo público.' },
  { icono: '⚡', titulo: 'Preferencia de compra', texto: 'Tus pedidos se reservan y atienden primero.' },
  { icono: '💰', titulo: 'Precios más competitivos', texto: 'Condiciones pensadas para compradores frecuentes.' },
  { icono: '💡', titulo: 'Lista de deseos', texto: 'Propón productos y los consideramos en las próximas importaciones.' },
];

export default async function PaginaPremium() {
  const cookiePais = cookies().get(COOKIE_PAIS)?.value;
  const pais: Pais | null = esPais(cookiePais) ? cookiePais : null;
  const sesion = sesionPremiumActual();

  // Novedades anticipadas: productos con fecha de lanzamiento público futura
  let anticipados: Producto[] = [];
  let deseos: Awaited<ReturnType<typeof listarDeseos>> = [];
  if (sesion) {
    const supabase = crearClienteAdmin();
    if (supabase) {
      const hoy = new Date().toISOString().slice(0, 10);
      const { data } = await supabase
        .from('productos')
        .select('*, categorias(*), producto_imagenes(*)')
        .eq('disponible', true)
        .gt('fecha_publica', hoy)
        .order('fecha_publica');
      anticipados = (data ?? []) as Producto[];
    }
    deseos = await listarDeseos();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <section className="rounded-3xl bg-gradient-to-r from-amarillo to-naranja p-6 text-tinta shadow-lg sm:p-8">
        <h1 className="text-2xl font-bold sm:text-3xl">
          ⭐ Sección Premium Ñañilovers
        </h1>
        <p className="mt-2 text-sm sm:text-base">
          {sesion
            ? `Hola ${sesion.nombre} 👋 — esta es tu zona exclusiva.`
            : 'Un espacio exclusivo para quienes compran seguido: novedades antes que nadie y beneficios pensados para tu emprendimiento.'}
        </p>
      </section>

      {!sesion && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {BENEFICIOS.map((b) => (
            <div key={b.titulo} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-tinta/5">
              <p className="text-2xl">{b.icono}</p>
              <h2 className="mt-1 font-bold">{b.titulo}</h2>
              <p className="mt-1 text-sm text-tinta/70">{b.texto}</p>
            </div>
          ))}
        </div>
      )}

      {sesion ? (
        <div className="mt-4 space-y-4">
          <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-tinta/5">
            <h2 className="text-lg font-bold">🚀 Novedades en camino</h2>
            <p className="mt-1 text-sm text-tinta/70">
              Estos productos todavía no están en el catálogo público: puedes
              pedirlos desde ya y reservar tu parte antes de que lleguen.
            </p>
            {anticipados.length > 0 ? (
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {anticipados.map((p) => (
                  <TarjetaProducto key={p.id} producto={p} pais={pais} />
                ))}
              </div>
            ) : (
              <p className="mt-3 rounded-xl bg-crema p-4 text-sm text-tinta/60">
                Por ahora no hay lanzamientos anticipados — te avisamos cuando
                haya novedades en camino. 😉
              </p>
            )}
          </section>
          <PanelPremium nombre={sesion.nombre} deseosIniciales={deseos} />
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-tinta/5">
            <h2 className="mb-3 text-lg font-bold">Quiero mi cuenta Premium</h2>
            <FormularioPremium pais={pais} />
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-tinta/5">
            <LoginPremium />
            <p className="mt-3 text-xs text-tinta/50">
              Las cuentas Premium las activa la tienda después de revisar tu
              solicitud: te contactamos con tu usuario y contraseña.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
