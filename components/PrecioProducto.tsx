import {
  aplicarDescuento,
  descuentoActivo,
  formatearPrecio,
  puedeMostrarPrecio,
} from '@/lib/precios';
import type { Producto } from '@/lib/tipos';

/**
 * Política de precios: solo se muestran con mostrar_precio Y precio_verificado.
 * El precio POR CAJA es el protagonista. Si hay oferta con porcentaje, el
 * cliente ve el precio original tachado, el precio con descuento y el %.
 */
export default function PrecioProducto({
  producto,
  detalle = false,
}: {
  producto: Producto;
  detalle?: boolean;
}) {
  if (!puedeMostrarPrecio(producto)) {
    return (
      <p className={`font-semibold text-celeste ${detalle ? 'text-lg' : 'text-sm'}`}>
        Consultar precio por WhatsApp
      </p>
    );
  }

  const pct = descuentoActivo(producto);
  const tieneCaja = producto.vende_por_caja && producto.precio_caja != null;
  const tieneDocena = producto.vende_por_docena && producto.precio_docena != null;

  const precioCaja = producto.precio_caja as number;
  const precioDocena = producto.precio_docena as number;

  return (
    <div className={detalle ? 'space-y-1' : 'space-y-0.5'}>
      {tieneCaja && (
        <p className="flex flex-wrap items-baseline gap-x-1.5">
          {pct ? (
            <>
              <span className={`text-tinta/40 line-through ${detalle ? 'text-base' : 'text-sm'}`}>
                {formatearPrecio(precioCaja, producto.moneda)}
              </span>
              <span className={`font-bold text-coral ${detalle ? 'text-2xl' : 'text-lg'}`}>
                {formatearPrecio(aplicarDescuento(precioCaja, pct), producto.moneda)}
              </span>
            </>
          ) : (
            <span className={`font-bold text-coral ${detalle ? 'text-2xl' : 'text-lg'}`}>
              {formatearPrecio(precioCaja, producto.moneda)}
            </span>
          )}
          <span className={`text-tinta/60 ${detalle ? 'text-sm' : 'text-xs'}`}>
            c/u por caja
          </span>
        </p>
      )}
      {tieneDocena && (
        <p className={detalle ? 'text-sm' : 'text-xs'}>
          <span className="text-tinta/60">Docena:</span>{' '}
          {pct ? (
            <>
              <span className="text-tinta/40 line-through">
                {formatearPrecio(precioDocena, producto.moneda)}
              </span>{' '}
              <span className="font-bold">
                {formatearPrecio(aplicarDescuento(precioDocena, pct), producto.moneda)}
              </span>
            </>
          ) : (
            <span className="font-bold">
              {formatearPrecio(precioDocena, producto.moneda)}
            </span>
          )}
          <span className="text-tinta/50"> c/u</span>
        </p>
      )}
    </div>
  );
}
