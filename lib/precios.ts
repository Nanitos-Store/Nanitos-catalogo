import type { Producto } from './tipos';

/**
 * POLÍTICA DE PRECIOS:
 * un precio solo es visible si mostrar_precio = true Y precio_verificado = true.
 */
export function puedeMostrarPrecio(p: Pick<Producto, 'mostrar_precio' | 'precio_verificado'>) {
  return p.mostrar_precio && p.precio_verificado;
}

export function formatearPrecio(valor: number, moneda: 'USD' | 'BOB') {
  const simbolo = moneda === 'USD' ? 'US$' : 'Bs';
  return `${simbolo} ${valor.toLocaleString('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Descuento activo: producto en oferta con porcentaje entero definido. */
export function descuentoActivo(
  p: Pick<Producto, 'en_oferta' | 'descuento_pct'>
): number | null {
  return p.en_oferta && p.descuento_pct ? p.descuento_pct : null;
}

export function aplicarDescuento(valor: number, pct: number) {
  return Math.round(valor * (1 - pct / 100) * 100) / 100;
}
