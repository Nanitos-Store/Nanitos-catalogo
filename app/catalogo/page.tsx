import { cookies } from 'next/headers';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { crearClienteServidor } from '@/lib/supabase/server';
import { COOKIE_PAIS, esPais } from '@/lib/pais';
import FiltrosCatalogo from '@/components/FiltrosCatalogo';
import GrillaInfinita from '@/components/GrillaInfinita';
import BloqueLogistica from '@/components/BloqueLogistica';
import { cargarPaginaCatalogo, type FiltrosCatalogo as Filtros } from './acciones';
import type { Categoria, Pais } from '@/lib/tipos';

export const metadata: Metadata = {
  title: 'Catálogo mayorista — juguetes por docena y por caja',
  description:
    'Catálogo completo de Ñañitos: peluches, mochilas, útiles escolares, neceseres y novedades por docena y por caja desde Bermejo, Bolivia.',
};

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
}

function leerFiltros(searchParams: Props['searchParams']): Filtros {
  const leer = (k: string) => {
    const v = searchParams[k];
    return typeof v === 'string' && v ? v : undefined;
  };
  return {
    q: leer('q'),
    categoria: leer('categoria'),
    personaje: leer('personaje'),
    temporada: leer('temporada'),
    modalidad: leer('modalidad'),
    oferta: leer('oferta') === '1',
  };
}

export default async function PaginaCatalogo({ searchParams }: Props) {
  const cookiePais = cookies().get(COOKIE_PAIS)?.value;
  const pais: Pais | null = esPais(cookiePais) ? cookiePais : null;
  const filtros = leerFiltros(searchParams);

  const supabase = crearClienteServidor();
  const categoriasRes = supabase
    ? await supabase.from('categorias').select('*').order('orden')
    : { data: [] };
  const pagina = await cargarPaginaCatalogo(filtros, null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-4">
      <h1 className="mb-3 text-2xl font-bold">
        {filtros.q ? `Resultados para “${filtros.q}”` : 'Catálogo'}
      </h1>
      <Suspense>
        <FiltrosCatalogo categorias={(categoriasRes.data ?? []) as Categoria[]} />
      </Suspense>
      {pais === 'AR' && (
        <div className="mt-3">
          <BloqueLogistica pais="AR" compacto />
        </div>
      )}
      <div className="mt-4">
        <GrillaInfinita
          inicial={pagina.productos}
          cursorInicial={pagina.siguiente}
          filtros={filtros}
          pais={pais}
        />
      </div>
    </div>
  );
}
