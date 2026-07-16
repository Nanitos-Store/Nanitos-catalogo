'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Categoria } from '@/lib/tipos';

const PERSONAJES = ['Labubu', 'Stitch', 'Capibara', 'Kuromi', 'Brain Rot', 'Snoopy'];

const TEMPORADAS: { valor: string; texto: string }[] = [
  { valor: 'regreso_clases', texto: 'Regreso a clases' },
  { valor: 'verano', texto: 'Verano' },
  { valor: 'mundial_2026', texto: 'Mundial 2026' },
  { valor: 'navidad', texto: 'Navidad' },
  { valor: 'dia_del_nino', texto: 'Día del Niño' },
  { valor: 'halloween', texto: 'Halloween' },
];

function Chip({
  activo,
  onClick,
  children,
}: {
  activo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={activo}
      className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
        activo
          ? 'border-celeste bg-celeste text-white'
          : 'border-tinta/15 bg-white text-tinta/80 hover:border-celeste'
      }`}
    >
      {children}
    </button>
  );
}

/** Filtros combinables persistidos en query params (URLs compartibles). */
export default function FiltrosCatalogo({ categorias }: { categorias: Categoria[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const alternar = (clave: string, valor: string) => {
    const nuevos = new URLSearchParams(params.toString());
    if (nuevos.get(clave) === valor) {
      nuevos.delete(clave);
    } else {
      nuevos.set(clave, valor);
    }
    router.push(`${pathname}?${nuevos.toString()}`);
  };

  const hayFiltros = ['categoria', 'personaje', 'temporada', 'modalidad', 'oferta', 'q']
    .some((k) => params.has(k));

  return (
    <div className="space-y-2">
      <div className="sin-scrollbar flex gap-2 overflow-x-auto pb-1">
        {categorias.map((c) => (
          <Chip
            key={c.id}
            activo={params.get('categoria') === c.slug}
            onClick={() => alternar('categoria', c.slug)}
          >
            {c.icono} {c.nombre}
          </Chip>
        ))}
      </div>
      <div className="sin-scrollbar flex gap-2 overflow-x-auto pb-1">
        {PERSONAJES.map((p) => (
          <Chip
            key={p}
            activo={params.get('personaje') === p}
            onClick={() => alternar('personaje', p)}
          >
            {p}
          </Chip>
        ))}
      </div>
      <div className="sin-scrollbar flex gap-2 overflow-x-auto pb-1">
        <Chip activo={params.get('oferta') === '1'} onClick={() => alternar('oferta', '1')}>
          🔥 Solo ofertas
        </Chip>
        <Chip
          activo={params.get('modalidad') === 'docena'}
          onClick={() => alternar('modalidad', 'docena')}
        >
          Por docena
        </Chip>
        <Chip
          activo={params.get('modalidad') === 'caja'}
          onClick={() => alternar('modalidad', 'caja')}
        >
          Por caja
        </Chip>
        {TEMPORADAS.map((t) => (
          <Chip
            key={t.valor}
            activo={params.get('temporada') === t.valor}
            onClick={() => alternar('temporada', t.valor)}
          >
            {t.texto}
          </Chip>
        ))}
        {hayFiltros && (
          <button
            onClick={() => router.push(pathname)}
            className="shrink-0 rounded-full px-3 py-1.5 text-sm font-bold text-coral"
          >
            Limpiar ✕
          </button>
        )}
      </div>
    </div>
  );
}
