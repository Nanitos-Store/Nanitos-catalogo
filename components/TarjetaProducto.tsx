import Image from 'next/image';
import Link from 'next/link';
import PrecioProducto from './PrecioProducto';
import BotonAgregarCarrito from './BotonAgregarCarrito';
import type { Pais, Producto } from '@/lib/tipos';

export default function TarjetaProducto({
  producto,
  pais,
  prioridad = false,
}: {
  producto: Producto;
  pais: Pais | null;
  prioridad?: boolean;
}) {
  const imagen =
    producto.producto_imagenes?.find((i) => i.es_principal) ??
    producto.producto_imagenes?.[0];

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-tinta/5 transition hover:shadow-md">
      <Link href={`/producto/${producto.slug}`} className="relative block">
        {producto.en_oferta && (
          <span className="absolute left-2 top-2 z-10 rounded-full bg-coral px-2.5 py-1 text-xs font-bold text-white">
            {producto.etiqueta_oferta ?? '¡Oferta!'}
          </span>
        )}
        {!producto.disponible && (
          <span className="absolute right-2 top-2 z-10 rounded-full bg-tinta/70 px-2.5 py-1 text-xs font-bold text-white">
            Agotado
          </span>
        )}
        <div className="relative aspect-square bg-white">
          <Image
            src={imagen?.url ?? '/productos/placeholder.webp'}
            alt={imagen?.alt ?? producto.nombre}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain transition group-hover:scale-[1.03]"
            priority={prioridad}
            placeholder={imagen?.blur_data_url ? 'blur' : 'empty'}
            blurDataURL={imagen?.blur_data_url ?? undefined}
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link href={`/producto/${producto.slug}`}>
          <h3 className="line-clamp-2 text-sm font-bold leading-snug">
            {producto.nombre}
          </h3>
        </Link>
        <PrecioProducto producto={producto} />
        <p className="text-xs text-tinta/50">Por docena y por caja</p>
        <div className="mt-auto">
          <BotonAgregarCarrito
            productoId={producto.id}
            slug={producto.slug}
            nombre={producto.nombre}
            codigo={producto.codigo}
            imagen={imagen?.url ?? null}
            compacto
          />
        </div>
      </div>
    </article>
  );
}
