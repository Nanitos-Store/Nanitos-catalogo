'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { ProductoImagen } from '@/lib/tipos';

/** Galería con swipe horizontal (scroll-snap) y miniaturas. */
export default function GaleriaProducto({
  imagenes,
  nombre,
}: {
  imagenes: ProductoImagen[];
  nombre: string;
}) {
  const ordenadas = [...imagenes].sort(
    (a, b) => Number(b.es_principal) - Number(a.es_principal) || a.orden - b.orden
  );
  const [activa, setActiva] = useState(0);

  if (ordenadas.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-3xl bg-white text-6xl">
        🧸
      </div>
    );
  }

  return (
    <div>
      <div
        className="sin-scrollbar flex snap-x snap-mandatory overflow-x-auto rounded-3xl bg-white"
        onScroll={(e) => {
          const el = e.currentTarget;
          setActiva(Math.round(el.scrollLeft / el.clientWidth));
        }}
      >
        {ordenadas.map((img, i) => (
          <div key={img.id} className="relative aspect-square w-full shrink-0 snap-center">
            <Image
              src={img.url}
              alt={img.alt ?? nombre}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-contain"
              priority={i === 0}
              placeholder={img.blur_data_url ? 'blur' : 'empty'}
              blurDataURL={img.blur_data_url ?? undefined}
            />
          </div>
        ))}
      </div>
      {ordenadas.length > 1 && (
        <div className="mt-2 flex justify-center gap-1.5" aria-hidden="true">
          {ordenadas.map((img, i) => (
            <span
              key={img.id}
              className={`h-2 w-2 rounded-full ${i === activa ? 'bg-celeste' : 'bg-tinta/20'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
