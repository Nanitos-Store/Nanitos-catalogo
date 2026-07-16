'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import type { ProductoImagen } from '@/lib/tipos';

/**
 * Galería con swipe horizontal (scroll-snap), miniaturas y lightbox:
 * al tocar la foto se abre a pantalla completa y un segundo toque hace
 * zoom SOLO sobre la imagen (no sobre la página).
 */
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
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);

  const cerrar = useCallback(() => {
    setLightbox(null);
    setZoom(null);
  }, []);

  useEffect(() => {
    if (lightbox === null) return;
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrar();
      if (e.key === 'ArrowRight') setLightbox((i) => ((i ?? 0) + 1) % ordenadas.length);
      if (e.key === 'ArrowLeft')
        setLightbox((i) => ((i ?? 0) - 1 + ordenadas.length) % ordenadas.length);
    };
    document.addEventListener('keydown', alTeclear);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', alTeclear);
      document.body.style.overflow = '';
    };
  }, [lightbox, ordenadas.length, cerrar]);

  if (ordenadas.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-3xl bg-white text-6xl">
        🧸
      </div>
    );
  }

  const alternarZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoom) {
      setZoom(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setZoom({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

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
          <button
            key={img.id}
            onClick={() => setLightbox(i)}
            aria-label={`Ampliar foto ${i + 1} de ${nombre}`}
            className="relative aspect-square w-full shrink-0 cursor-zoom-in snap-center"
          >
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
            <span className="absolute bottom-2 right-2 rounded-full bg-tinta/60 px-2.5 py-1 text-xs font-bold text-white">
              🔍 Ampliar
            </span>
          </button>
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

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[60] flex flex-col bg-tinta/95"
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ampliada de ${nombre}`}
        >
          <div className="flex items-center justify-between p-3">
            <span className="text-sm font-bold text-white/80">
              {lightbox + 1} / {ordenadas.length} · toca la foto para{' '}
              {zoom ? 'alejar' : 'acercar'}
            </span>
            <button
              onClick={cerrar}
              aria-label="Cerrar"
              className="rounded-full bg-white/15 px-4 py-2 font-bold text-white"
            >
              ✕
            </button>
          </div>
          <div
            className={`relative flex-1 overflow-hidden ${zoom ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
            onClick={alternarZoom}
          >
            <Image
              src={ordenadas[lightbox].url}
              alt={ordenadas[lightbox].alt ?? nombre}
              fill
              sizes="100vw"
              className="object-contain transition-transform duration-300"
              style={
                zoom
                  ? {
                      transform: 'scale(2.4)',
                      transformOrigin: `${zoom.x}% ${zoom.y}%`,
                    }
                  : undefined
              }
            />
          </div>
          {ordenadas.length > 1 && (
            <div className="flex items-center justify-center gap-6 p-4">
              <button
                onClick={() => {
                  setZoom(null);
                  setLightbox((lightbox - 1 + ordenadas.length) % ordenadas.length);
                }}
                aria-label="Foto anterior"
                className="h-12 w-12 rounded-full bg-white/15 text-xl font-bold text-white"
              >
                ←
              </button>
              <button
                onClick={() => {
                  setZoom(null);
                  setLightbox((lightbox + 1) % ordenadas.length);
                }}
                aria-label="Foto siguiente"
                className="h-12 w-12 rounded-full bg-white/15 text-xl font-bold text-white"
              >
                →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
