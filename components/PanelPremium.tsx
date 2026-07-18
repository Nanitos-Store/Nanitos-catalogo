'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  agregarDeseo,
  cambiarPasswordPremium,
  cerrarSesionPremium,
  quitarDeseo,
} from '@/app/acciones/premium';
import type { DeseoPremium } from '@/lib/tipos';

/** Herramientas del cliente Premium: lista de deseos, contraseña y salida. */
export default function PanelPremium({
  nombre,
  deseosIniciales,
}: {
  nombre: string;
  deseosIniciales: DeseoPremium[];
}) {
  const router = useRouter();
  const [deseos, setDeseos] = useState(deseosIniciales);
  const [producto, setProducto] = useState('');
  const [detalle, setDetalle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [anterior, setAnterior] = useState('');
  const [nueva, setNueva] = useState('');
  const [avisoPassword, setAvisoPassword] = useState<string | null>(null);

  const agregar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    const r = await agregarDeseo({ producto, detalle });
    setEnviando(false);
    if (!r.ok) {
      setError(r.error ?? 'No se pudo guardar.');
      return;
    }
    setDeseos(r.deseos ?? []);
    setProducto('');
    setDetalle('');
  };

  const quitar = async (id: string) => {
    const r = await quitarDeseo(id);
    if (r.ok) setDeseos(r.deseos ?? []);
  };

  const salir = async () => {
    await cerrarSesionPremium();
    router.refresh();
  };

  const cambiarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAvisoPassword(null);
    const r = await cambiarPasswordPremium({ anterior, nueva });
    setAvisoPassword(r.ok ? '✅ Contraseña actualizada.' : r.error ?? 'Error.');
    if (r.ok) {
      setAnterior('');
      setNueva('');
    }
  };

  const campo = 'w-full rounded-xl border border-tinta/15 px-3 py-2.5';

  return (
    <div className="space-y-4">
      {/* Lista de deseos */}
      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-tinta/5">
        <h2 className="text-lg font-bold">💡 Mi lista de deseos</h2>
        <p className="mt-1 text-sm text-tinta/70">
          Cuéntanos qué productos te gustaría que traigamos en las próximas
          importaciones: tu lista se toma en cuenta al armar los pedidos a
          fábrica.
        </p>
        <form onSubmit={agregar} className="mt-3 space-y-2">
          <input
            value={producto}
            onChange={(e) => setProducto(e.target.value)}
            required
            placeholder="Producto que te gustaría (ej. Peluche Labubu gigante)"
            className={campo}
          />
          <input
            value={detalle}
            onChange={(e) => setDetalle(e.target.value)}
            placeholder="Detalle opcional: color, tamaño, cantidad que comprarías…"
            className={campo}
          />
          {error && <p className="text-sm font-semibold text-coral">{error}</p>}
          <button
            type="submit"
            disabled={enviando}
            className="rounded-xl bg-naranja px-5 py-2.5 font-bold text-white disabled:opacity-60"
          >
            {enviando ? 'Guardando…' : '+ Agregar a mi lista'}
          </button>
        </form>
        <ul className="mt-3 space-y-2">
          {deseos.map((d) => (
            <li
              key={d.id}
              className="flex items-start gap-2 rounded-xl bg-crema p-3 text-sm ring-1 ring-tinta/5"
            >
              <div className="min-w-0 flex-1">
                <p className="font-bold">{d.producto}</p>
                {d.detalle && <p className="text-tinta/60">{d.detalle}</p>}
              </div>
              <button
                onClick={() => void quitar(d.id)}
                aria-label={`Quitar ${d.producto}`}
                className="rounded-full bg-coral/10 px-2.5 py-1 font-bold text-coral"
              >
                ✕
              </button>
            </li>
          ))}
          {deseos.length === 0 && (
            <p className="text-sm text-tinta/50">Todavía no agregaste deseos.</p>
          )}
        </ul>
      </div>

      {/* Cuenta */}
      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-tinta/5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-bold">⭐ Sesión de {nombre}</p>
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => setMostrarPassword((v) => !v)}
              className="rounded-full bg-tinta/5 px-4 py-1.5 text-sm font-bold"
            >
              🔑 Cambiar contraseña
            </button>
            <button
              onClick={() => void salir()}
              className="rounded-full bg-coral/10 px-4 py-1.5 text-sm font-bold text-coral"
            >
              Salir
            </button>
          </div>
        </div>
        {mostrarPassword && (
          <form onSubmit={cambiarPassword} className="mt-3 space-y-2">
            <input
              type="password"
              value={anterior}
              onChange={(e) => setAnterior(e.target.value)}
              required
              placeholder="Contraseña anterior"
              className={campo}
            />
            <input
              type="password"
              value={nueva}
              onChange={(e) => setNueva(e.target.value)}
              required
              minLength={6}
              placeholder="Contraseña nueva (mín. 6)"
              className={campo}
            />
            {avisoPassword && <p className="text-sm font-semibold">{avisoPassword}</p>}
            <button className="rounded-xl bg-celeste px-5 py-2.5 font-bold text-white">
              Guardar contraseña
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
