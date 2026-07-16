import { formatearPrecio, puedeMostrarPrecio } from '@/lib/precios';
import type { Producto } from '@/lib/tipos';

/**
 * Aplica la política de precios: solo muestra valores con
 * mostrar_precio = true Y precio_verificado = true.
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

  return (
    <div className={detalle ? 'space-y-1' : 'space-y-0.5 text-sm'}>
      {producto.vende_por_docena && producto.precio_docena != null && (
        <p>
          <span className="text-tinta/60">Docena:</span>{' '}
          <span className="font-bold">
            {formatearPrecio(producto.precio_docena, producto.moneda)}
          </span>
          <span className="text-xs text-tinta/50"> c/u</span>
        </p>
      )}
      {producto.vende_por_caja && producto.precio_caja != null && (
        <p>
          <span className="text-tinta/60">Caja:</span>{' '}
          <span className="font-bold text-coral">
            {formatearPrecio(producto.precio_caja, producto.moneda)}
          </span>
          <span className="text-xs text-tinta/50"> c/u</span>
        </p>
      )}
    </div>
  );
}
