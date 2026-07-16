'use client';

import { useCarrito } from './CarritoProvider';
import type { Modalidad } from '@/lib/tipos';

/** CTA "Agregar al pedido": suma el producto al carrito y abre la hoja. */
export default function BotonAgregarCarrito({
  productoId,
  slug,
  nombre,
  codigo,
  imagen,
  modalidadInicial = 'docena',
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
  return (
    <button
      onClick={() =>
        carrito.agregar({
          productoId,
          slug,
          nombre,
          codigo,
          imagen,
          modalidad: modalidadInicial,
        })
      }
      className={`boton w-full rounded-xl bg-whatsapp font-bold text-white shadow-md transition hover:brightness-105 ${
        compacto ? 'px-3 py-2 text-sm' : 'px-4 py-3 text-base'
      }`}
    >
      Agregar al pedido
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
