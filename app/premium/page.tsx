import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { COOKIE_PAIS, esPais } from '@/lib/pais';
import FormularioPremium from '@/components/FormularioPremium';
import type { Pais } from '@/lib/tipos';

export const metadata: Metadata = {
  title: 'Cuenta Premium Ñañilovers',
  description:
    'Registra tu tienda o emprendimiento y recibe atención prioritaria, novedades antes que nadie y beneficios para compradores frecuentes.',
};

const BENEFICIOS = [
  { icono: '⚡', titulo: 'Atención prioritaria', texto: 'Tus consultas y pedidos se responden primero.' },
  { icono: '🆕', titulo: 'Novedades antes que nadie', texto: 'Te avisamos cuando llegan los diseños que la gente pregunta.' },
  { icono: '🎯', titulo: 'Ofertas a tu medida', texto: 'Promociones pensadas para compradores frecuentes como tú.' },
];

export default function PaginaPremium() {
  const cookiePais = cookies().get(COOKIE_PAIS)?.value;
  const pais: Pais | null = esPais(cookiePais) ? cookiePais : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <section className="rounded-3xl bg-gradient-to-r from-amarillo to-naranja p-6 text-tinta shadow-lg sm:p-8">
        <h1 className="text-2xl font-bold sm:text-3xl">⭐ Cuenta Premium Ñañilovers</h1>
        <p className="mt-2 text-sm sm:text-base">
          ¿Compras seguido para tu tienda o emprendimiento? Cuéntanos un poco más
          de ti y accede a beneficios exclusivos. Es gratis.
        </p>
      </section>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {BENEFICIOS.map((b) => (
          <div key={b.titulo} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-tinta/5">
            <p className="text-2xl">{b.icono}</p>
            <h2 className="mt-1 font-bold">{b.titulo}</h2>
            <p className="mt-1 text-sm text-tinta/70">{b.texto}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-tinta/5 sm:p-6">
        <FormularioPremium pais={pais} />
      </div>
    </div>
  );
}
