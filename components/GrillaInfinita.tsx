'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import TarjetaProducto from './TarjetaProducto';
import {
  cargarPaginaCatalogo,
  type Cursor,
  type FiltrosCatalogo,
} from '@/app/catalogo/acciones';
import type { Pais, Producto } from '@/lib/tipos';

/** Grilla con infinite scroll por cursor: nunca carga todo el catálogo de una. */
export default function GrillaInfinita({
  inicial,
  cursorInicial,
  filtros,
  pais,
}: {
  inicial: Producto[];
  cursorInicial: Cursor | null;
  filtros: FiltrosCatalogo;
  pais: Pais | null;
}) {
  const [productos, setProductos] = useState(inicial);
  const [cursor, setCursor] = useState(cursorInicial);
  const [cargando, setCargando] = useState(false);
  const centinela = useRef<HTMLDivElement>(null);

  // Reiniciar cuando cambian los filtros (nueva página server-rendered)
  useEffect(() => {
    setProductos(inicial);
    setCursor(cursorInicial);
  }, [inicial, cursorInicial]);

  const cargarMas = useCallback(async () => {
    if (!cursor || cargando) return;
    setCargando(true);
    const pagina = await cargarPaginaCatalogo(filtros, cursor);
    setProductos((previos) => {
      const vistos = new Set(previos.map((p) => p.id));
      return [...previos, ...pagina.productos.filter((p) => !vistos.has(p.id))];
    });
    setCursor(pagina.siguiente);
    setCargando(false);
  }, [cursor, cargando, filtros]);

  useEffect(() => {
    const nodo = centinela.current;
    if (!nodo || !cursor) return;
    const observador = new IntersectionObserver(
      (entradas) => {
        if (entradas[0].isIntersecting) void cargarMas();
      },
      { rootMargin: '600px' }
    );
    observador.observe(nodo);
    return () => observador.disconnect();
  }, [cargarMas, cursor]);

  if (productos.length === 0) {
    return (
      <p className="rounded-2xl bg-white p-6 text-center text-tinta/60">
        No encontramos productos con esos filtros. Prueba con otra combinación
        o escríbenos por WhatsApp: te ayudamos a encontrarlo. 😉
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {productos.map((p, i) => (
          <TarjetaProducto key={p.id} producto={p} pais={pais} prioridad={i < 2} />
        ))}
      </div>
      <div ref={centinela} className="h-4" />
      {cargando && (
        <p className="py-4 text-center text-sm text-tinta/50">Cargando más productos…</p>
      )}
    </>
  );
}
