import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { crearClienteServidor } from '@/lib/supabase/server';
import { COOKIE_PAIS, esPais } from '@/lib/pais';
import TarjetaProducto from '@/components/TarjetaProducto';
import BloqueLogistica from '@/components/BloqueLogistica';
import { enlaceWhatsApp, mensajeConsulta } from '@/lib/whatsapp';
import type { Campana, Pais, Producto } from '@/lib/tipos';

export const revalidate = 300;

interface Props {
  params: { slug: string };
}

async function obtenerCampana(slug: string) {
  const supabase = crearClienteServidor();
  if (!supabase) return null;
  const { data } = await supabase
    .from('campanas')
    .select('*')
    .eq('slug', slug)
    .eq('activa', true)
    .maybeSingle();
  return (data as Campana | null) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const campana = await obtenerCampana(params.slug);
  if (!campana) return { title: 'Campaña no encontrada' };
  return { title: campana.titulo, description: campana.subtitulo ?? undefined };
}

export default async function PaginaCampana({ params }: Props) {
  const campana = await obtenerCampana(params.slug);
  if (!campana) notFound();

  const cookiePais = cookies().get(COOKIE_PAIS)?.value;
  const paisVisitante: Pais | null = esPais(cookiePais) ? cookiePais : null;
  // El bloque de logística responde al país objetivo de la campaña
  const paisLogistica: Pais =
    campana.pais_objetivo === 'ambos'
      ? paisVisitante ?? 'BO'
      : campana.pais_objetivo;

  const supabase = crearClienteServidor();
  const productosRes =
    supabase && campana.producto_ids.length > 0
      ? await supabase
          .from('productos')
          .select('*, categorias(*), producto_imagenes(*)')
          .in('id', campana.producto_ids)
          .eq('disponible', true)
          .order('orden')
      : { data: [] };
  const productos = (productosRes.data ?? []) as Producto[];

  return (
    <div className="mx-auto max-w-5xl px-4 py-4">
      <section className="rounded-3xl bg-gradient-to-r from-naranja to-coral p-6 text-white shadow-lg sm:p-10">
        <h1 className="text-2xl font-bold sm:text-4xl">{campana.titulo}</h1>
        {campana.subtitulo && (
          <p className="mt-2 max-w-2xl text-sm text-white/90 sm:text-base">
            {campana.subtitulo}
          </p>
        )}
      </section>

      <div className="mt-4">
        <BloqueLogistica pais={paisLogistica} />
      </div>

      {productos.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 text-xl font-bold">Productos de la campaña</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {productos.map((p) => (
              <TarjetaProducto key={p.id} producto={p} pais={paisVisitante} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-8 text-center">
        <a
          href={enlaceWhatsApp(mensajeConsulta())}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full bg-whatsapp px-8 py-3 font-bold text-white shadow-md"
        >
          Escríbenos por WhatsApp
        </a>
      </div>
    </div>
  );
}
