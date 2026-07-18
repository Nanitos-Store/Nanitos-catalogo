'use client';

import { useRef, useState } from 'react';
import { useCarrito } from './CarritoProvider';
import type { Modalidad } from '@/lib/tipos';

/**
 * CTA "Añadir al carrito": suma el producto en segundo plano con una
 * confirmación breve en el propio botón, sin abrir la lista del carrito.
 */
export default function BotonAgregarCarrito({
  productoId,
  slug,
  nombre,
  codigo,
  imagen,
  modalidadInicial = 'caja',
  compacto = false,
}: {
  productoId: string;
  slug: string;
  nombre: string;
  codigo: string | null;
  imagen: string | null;
  modalidadInicial?: Modalidad;
  compacto?: boolean;
}) {
  const carrito = useCarrito();
  const [agregado, setAgregado] = useState(false);
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);

  const agregar = () => {
    carrito.agregar({
      productoId,
      slug,
      nombre,
      codigo,
      imagen,
      modalidad: modalidadInicial,
    });
    setAgregado(true);
    if (temporizador.current) clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => setAgregado(false), 1400);
  };

  return (
    <button
      onClick={agregar}
      className={`boton w-full rounded-xl font-bold text-white shadow-md transition hover:brightness-105 ${
        agregado ? 'bg-verde' : 'bg-whatsapp'
      } ${compacto ? 'px-3 py-2 text-sm' : 'px-4 py-3 text-base'}`}
    >
      {agregado ? '✓ Añadido' : 'Añadir al carrito'}
    </button>
  );
}

/** Ícono del carrito para el header, con contador de ítems. */
export function BotonCarritoHeader() {
  const carrito = useCarrito();
  const total = carrito.items.length;
  return (
    <button
      onClick={() => carrito.abrir()}
      aria-label={`Mi pedido (${total} productos)`}
      className="relative flex h-10 w-10 items-center justify-center rounded-full bg-amarillo/90 text-lg shadow-sm transition hover:scale-105"
    >
      🛒
      {total > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-coral px-1 text-xs font-bold text-white">
          {total}
        </span>
      )}
    </button>
  );
}
