import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { crearClienteServidor } from '@/lib/supabase/server';
import { sesionPremiumActual } from '@/lib/premium-sesion';
import { COOKIE_PAIS, esPais } from '@/lib/pais';
import { puedeMostrarPrecio } from '@/lib/precios';
import GaleriaProducto from '@/components/GaleriaProducto';
import PrecioProducto from '@/components/PrecioProducto';
import BotonAgregarCarrito from '@/components/BotonAgregarCarrito';
import BloqueLogistica from '@/components/BloqueLogistica';
import TarjetaProducto from '@/components/TarjetaProducto';
import VistaProducto from '@/components/VistaProducto';
import type { Pais, Producto } from '@/lib/tipos';

// ISR: con 500+ productos, cada página se revalida sola cada 5 minutos
export const revalidate = 300;

interface Props {
  params: { slug: string };
}

async function obtenerProducto(slug: string) {
  const supabase = crearClienteServidor();
  if (!supabase) return null;
  const { data } = await supabase
    .from('productos')
    .select('*, categorias(*), producto_imagenes(*)')
    .eq('slug', slug)
    .maybeSingle();
  return (data as Producto | null) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const producto = await obtenerProducto(params.slug);
  if (!producto) return { title: 'Producto no encontrado' };
  const imagen =
    producto.producto_imagenes?.find((i) => i.es_principal) ??
    producto.producto_imagenes?.[0];
  const descripcion =
    producto.descripcion ??
    `${producto.nombre} disponible por docena y por caja en Ñañitos, Bermejo.`;
  return {
    title: `${producto.nombre} por docena y caja`,
    description: descripcion,
    openGraph: {
      title: `${producto.nombre} | Ñañitos`,
      description: descripcion,
      type: 'website',
      images: imagen ? [{ url: imagen.url, width: 1024, height: 1024 }] : undefined,
    },
  };
}

export default async function PaginaProducto({ params }: Props) {
  const producto = await obtenerProducto(params.slug);
  if (!producto) notFound();

  // Lanzamiento anticipado: antes de su fecha pública solo lo ve Premium
  const hoy = new Date().toISOString().slice(0, 10);
  if (producto.fecha_publica && producto.fecha_publica > hoy && !sesionPremiumActual()) {
    notFound();
  }

  const cookiePais = cookies().get(COOKIE_PAIS)?.value;
  const pais: Pais | null = esPais(cookiePais) ? cookiePais : null;

  const supabase = crearClienteServidor();
  const relacionadosRes =
    supabase && producto.categoria_id
      ? await supabase
          .from('productos')
          .select('*, categorias(*), producto_imagenes(*)')
          .eq('categoria_id', producto.categoria_id)
          .eq('disponible', true)
          .neq('id', producto.id)
          .or(`fecha_publica.is.null,fecha_publica.lte.${hoy}`)
          .order('destacado', { ascending: false })
          .limit(4)
      : { data: [] };
  const relacionados = (relacionadosRes.data ?? []) as Producto[];

  // Schema.org Product SIN offers cuando el precio no se muestra
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: producto.nombre,
    description: producto.descripcion ?? undefined,
    sku: producto.codigo ?? undefined,
    image: producto.producto_imagenes?.map((i) => i.url),
    brand: { '@type': 'Brand', name: 'Ñañitos' },
  };
  if (puedeMostrarPrecio(producto) && producto.precio_docena != null) {
    schema.offers = {
      '@type': 'Offer',
      priceCurrency: producto.moneda,
      price: producto.precio_docena,
      availability: producto.disponible
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    };
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <VistaProducto
        nombre={producto.nombre}
        codigo={producto.codigo}
        categoria={producto.categorias?.nombre ?? null}
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <GaleriaProducto
          imagenes={producto.producto_imagenes ?? []}
          nombre={producto.nombre}
        />
        <div className="space-y-4">
          <div>
            {producto.en_oferta && (
              <span className="mb-2 inline-block rounded-full bg-coral px-3 py-1 text-xs font-bold text-white">
                {producto.descuento_pct
                  ? `-${producto.descuento_pct}% de descuento`
                  : producto.etiqueta_oferta ?? '¡Oferta especial!'}
              </span>
            )}
            <h1 className="text-2xl font-bold leading-tight">{producto.nombre}</h1>
            {producto.codigo && (
              <p className="mt-1 text-sm text-tinta/60">Cód. {producto.codigo}</p>
            )}
          </div>

          {producto.descripcion && <p className="text-tinta/80">{producto.descripcion}</p>}

          {producto.personajes.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {producto.personajes.map((p) => (
                <span
                  key={p}
                  className="rounded-full bg-celeste/10 px-3 py-1 text-xs font-bold text-celeste"
                >
                  {p}
                </span>
              ))}
            </div>
          )}

          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-tinta/5">
            <PrecioProducto producto={producto} detalle />
            <div className="mt-3 space-y-1 text-sm text-tinta/70">
              {producto.vende_por_docena && <p>✔️ Se vende por docena (12 unidades)</p>}
              {producto.vende_por_caja && (
                <p>
                  ✔️ Se vende por caja
                  {producto.unidades_por_caja
                    ? ` de ${producto.unidades_por_caja.toLocaleString('es-BO')} unidades`
                    : ''}
                </p>
              )}
            </div>
          </div>

          <BloqueLogistica pais={pais} compacto />

          {producto.disponible ? (
            <BotonAgregarCarrito
              productoId={producto.id}
              slug={producto.slug}
              nombre={producto.nombre}
              codigo={producto.codigo}
              imagen={
                (producto.producto_imagenes?.find((i) => i.es_principal) ??
                  producto.producto_imagenes?.[0])?.url ?? null
              }
            />
          ) : (
            <p className="rounded-xl bg-tinta/5 p-3 text-center font-semibold text-tinta/60">
              Este producto no está disponible por ahora. Escríbenos por WhatsApp
              y te avisamos cuando vuelva.
            </p>
          )}
        </div>
      </div>

      {relacionados.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-xl font-bold">También te puede interesar</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {relacionados.map((p) => (
              <TarjetaProducto key={p.id} producto={p} pais={pais} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
