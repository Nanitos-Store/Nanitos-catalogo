import { formatearPrecio, puedeMostrarPrecio } from '@/lib/precios';
import type { Producto } from '@/lib/tipos';

/**
 * Aplica la política de precios: solo muestra valores con
 * mostrar_precio = true Y precio_verificado = true.
 * El precio POR CAJA es el protagonista; la docena va como secundario.
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

  const tieneCaja = producto.vende_por_caja && producto.precio_caja != null;
  const tieneDocena = producto.vende_por_docena && producto.precio_docena != null;

  return (
    <div className={detalle ? 'space-y-1' : 'space-y-0.5'}>
      {tieneCaja && (
        <p>
          <span className={`font-bold text-coral ${detalle ? 'text-2xl' : 'text-lg'}`}>
            {formatearPrecio(producto.precio_caja as number, producto.moneda)}
          </span>
          <span className={`text-tinta/60 ${detalle ? 'text-sm' : 'text-xs'}`}>
            {' '}c/u por caja
          </span>
        </p>
      )}
      {tieneDocena && (
        <p className={detalle ? 'text-sm' : 'text-xs'}>
          <span className="text-tinta/60">Docena:</span>{' '}
          <span className="font-bold">
            {formatearPrecio(producto.precio_docena as number, producto.moneda)}
          </span>
          <span className="text-tinta/50"> c/u</span>
        </p>
      )}
    </div>
  );
}
