'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { alternarCampoProducto, guardarPrecioVerificado } from '@/app/admin/acciones';
import type { Producto } from '@/lib/tipos';

function Palanca({
  activo,
  texto,
  onCambio,
}: {
  activo: boolean;
  texto: string;
  onCambio: (valor: boolean) => void;
}) {
  return (
    <button
      onClick={() => onCambio(!activo)}
      aria-pressed={activo}
      className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
        activo ? 'bg-verde text-white' : 'bg-tinta/10 text-tinta/60'
      }`}
    >
      {texto}
    </button>
  );
}

function FilaProducto({ producto }: { producto: Producto }) {
  const [p, setP] = useState(producto);
  const [docena, setDocena] = useState(p.precio_docena?.toString() ?? '');
  const [caja, setCaja] = useState(p.precio_caja?.toString() ?? '');
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const imagen = p.producto_imagenes?.find((i) => i.es_principal) ?? p.producto_imagenes?.[0];

  const alternar = async (campo: 'disponible' | 'en_oferta' | 'mostrar_precio', valor: boolean) => {
    setP((prev) => ({ ...prev, [campo]: valor }));
    const r = await alternarCampoProducto(p.id, campo, valor);
    if (!r.ok) setP((prev) => ({ ...prev, [campo]: !valor }));
  };

  const guardarPrecio = async () => {
    setGuardando(true);
    setMensaje(null);
    const r = await guardarPrecioVerificado({
      productoId: p.id,
      precioDocena: docena ? Number(docena.replace(',', '.')) : null,
      precioCaja: caja ? Number(caja.replace(',', '.')) : null,
      mostrarPrecio: p.mostrar_precio,
    });
    setGuardando(false);
    if (r.ok) {
      setP((prev) => ({ ...prev, precio_verificado: true }));
      setMensaje('✅ Guardado y verificado');
    } else {
      setMensaje(r.error ?? 'Error al guardar');
    }
  };

  return (
    <li className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-tinta/5">
      <div className="flex items-start gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-crema">
          {imagen && (
            <Image src={imagen.url} alt={p.nombre} fill sizes="64px" className="object-contain" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <Link href={`/admin/productos/${p.id}`} className="font-bold leading-tight hover:underline">
            {p.nombre}
          </Link>
          <p className="text-xs text-tinta/60">
            {p.codigo ?? 'sin código'} · {p.categorias?.nombre ?? 'sin categoría'}
            {!p.precio_verificado && (
              <span className="ml-1 font-bold text-coral">· precio sin verificar</span>
            )}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Palanca activo={p.disponible} texto="Disponible" onCambio={(v) => alternar('disponible', v)} />
            <Palanca activo={p.en_oferta} texto="Oferta" onCambio={(v) => alternar('en_oferta', v)} />
            <Palanca
              activo={p.mostrar_precio}
              texto="Mostrar precio"
              onCambio={(v) => alternar('mostrar_precio', v)}
            />
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-1 text-sm">
          <span className="text-tinta/60">Docena $</span>
          <input
            value={docena}
            onChange={(e) => setDocena(e.target.value)}
            inputMode="decimal"
            className="w-20 rounded-lg border border-tinta/15 px-2 py-2 text-sm"
          />
        </label>
        <label className="flex items-center gap-1 text-sm">
          <span className="text-tinta/60">Caja $</span>
          <input
            value={caja}
            onChange={(e) => setCaja(e.target.value)}
            inputMode="decimal"
            className="w-20 rounded-lg border border-tinta/15 px-2 py-2 text-sm"
          />
        </label>
        <button
          onClick={guardarPrecio}
          disabled={guardando}
          className="rounded-xl bg-celeste px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
        >
          {guardando ? 'Guardando…' : 'Guardar y marcar verificado'}
        </button>
        {mensaje && <span className="text-xs font-semibold">{mensaje}</span>}
      </div>
    </li>
  );
}

export default function ListaProductosAdmin({ productos }: { productos: Producto[] }) {
  if (productos.length === 0) {
    return <p className="rounded-2xl bg-white p-6 text-center text-tinta/60">Sin resultados.</p>;
  }
  return (
    <ul className="space-y-3">
      {productos.map((p) => (
        <FilaProducto key={p.id} producto={p} />
      ))}
    </ul>
  );
}
