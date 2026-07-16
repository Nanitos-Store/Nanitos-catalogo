'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { eliminarCampana, guardarCampana, type DatosCampana } from '@/app/admin/acciones';
import type { Campana, Producto } from '@/lib/tipos';

type ProductoMin = Pick<Producto, 'id' | 'nombre' | 'codigo'>;

function slugificar(texto: string) {
  return texto
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ñ/gi, 'n')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

const VACIA: DatosCampana = {
  nombre: '',
  slug: '',
  titulo: '',
  subtitulo: null,
  pais_objetivo: 'ambos',
  fecha_inicio: null,
  fecha_fin: null,
  activa: true,
  imagen_url: null,
  producto_ids: [],
};

export default function GestorCampanas({
  campanas,
  productos,
}: {
  campanas: Campana[];
  productos: ProductoMin[];
}) {
  const router = useRouter();
  const [editando, setEditando] = useState<string | 'nueva' | null>(null);
  const [datos, setDatos] = useState<DatosCampana>(VACIA);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const abrir = (c: Campana | null) => {
    setMensaje(null);
    if (c) {
      setEditando(c.id);
      setDatos({
        nombre: c.nombre,
        slug: c.slug,
        titulo: c.titulo,
        subtitulo: c.subtitulo,
        pais_objetivo: c.pais_objetivo,
        fecha_inicio: c.fecha_inicio,
        fecha_fin: c.fecha_fin,
        activa: c.activa,
        imagen_url: c.imagen_url,
        producto_ids: c.producto_ids,
      });
    } else {
      setEditando('nueva');
      setDatos(VACIA);
    }
  };

  const guardar = async () => {
    setGuardando(true);
    setMensaje(null);
    const r = await guardarCampana(editando === 'nueva' ? null : editando, datos);
    setGuardando(false);
    if (r.ok) {
      setEditando(null);
      router.refresh();
    } else {
      setMensaje(r.error ?? 'Error al guardar.');
    }
  };

  const eliminar = async (c: Campana) => {
    if (!confirm(`¿Eliminar la campaña "${c.nombre}"?`)) return;
    await eliminarCampana(c.id);
    router.refresh();
  };

  const campo = 'w-full rounded-xl border border-tinta/15 px-4 py-3';

  return (
    <div className="space-y-3">
      <button
        onClick={() => abrir(null)}
        className="rounded-full bg-celeste px-5 py-2.5 font-bold text-white"
      >
        + Nueva campaña
      </button>

      <ul className="space-y-2">
        {campanas.map((c) => {
          const hoy = new Date().toISOString().slice(0, 10);
          const vigente =
            c.activa &&
            (!c.fecha_inicio || c.fecha_inicio <= hoy) &&
            (!c.fecha_fin || c.fecha_fin >= hoy);
          return (
            <li key={c.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-tinta/5">
              <div className="flex flex-wrap items-center gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{c.nombre}</p>
                  <p className="text-xs text-tinta/60">
                    {c.pais_objetivo === 'ambos' ? '🇧🇴+🇦🇷' : c.pais_objetivo === 'BO' ? '🇧🇴' : '🇦🇷'} ·{' '}
                    {c.fecha_inicio ?? 'sin inicio'} → {c.fecha_fin ?? 'sin fin'} ·{' '}
                    {c.producto_ids.length} productos
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    vigente ? 'bg-verde/15 text-verde' : 'bg-tinta/10 text-tinta/50'
                  }`}
                >
                  {vigente ? 'Visible ahora' : c.activa ? 'Fuera de fecha' : 'Apagada'}
                </span>
                <button onClick={() => abrir(c)} className="rounded-full bg-tinta/5 px-4 py-1.5 text-sm font-bold">
                  Editar
                </button>
                <button onClick={() => void eliminar(c)} className="rounded-full bg-coral/10 px-4 py-1.5 text-sm font-bold text-coral">
                  Eliminar
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {editando && (
        <div className="rounded-3xl bg-white p-5 shadow-md ring-1 ring-tinta/10">
          <h2 className="mb-3 text-lg font-bold">
            {editando === 'nueva' ? 'Nueva campaña' : 'Editar campaña'}
          </h2>
          <div className="space-y-3">
            <input
              value={datos.nombre}
              onChange={(e) => {
                const v = e.target.value;
                setDatos((p) => ({
                  ...p,
                  nombre: v,
                  slug: editando === 'nueva' ? slugificar(v) : p.slug,
                }));
              }}
              placeholder="Nombre interno"
              className={campo}
            />
            <input
              value={datos.titulo}
              onChange={(e) => setDatos((p) => ({ ...p, titulo: e.target.value }))}
              placeholder="Título del banner"
              className={campo}
            />
            <textarea
              value={datos.subtitulo ?? ''}
              onChange={(e) => setDatos((p) => ({ ...p, subtitulo: e.target.value || null }))}
              placeholder="Subtítulo (opcional)"
              rows={2}
              className={campo}
            />
            <div className="grid grid-cols-3 gap-2">
              <select
                value={datos.pais_objetivo}
                onChange={(e) =>
                  setDatos((p) => ({ ...p, pais_objetivo: e.target.value as DatosCampana['pais_objetivo'] }))
                }
                className={campo}
              >
                <option value="ambos">🇧🇴 + 🇦🇷 Ambos</option>
                <option value="BO">🇧🇴 Bolivia</option>
                <option value="AR">🇦🇷 Argentina</option>
              </select>
              <input
                type="date"
                value={datos.fecha_inicio ?? ''}
                onChange={(e) => setDatos((p) => ({ ...p, fecha_inicio: e.target.value || null }))}
                className={campo}
              />
              <input
                type="date"
                value={datos.fecha_fin ?? ''}
                onChange={(e) => setDatos((p) => ({ ...p, fecha_fin: e.target.value || null }))}
                className={campo}
              />
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={datos.activa}
                onChange={(e) => setDatos((p) => ({ ...p, activa: e.target.checked }))}
                className="h-5 w-5 accent-celeste"
              />
              <span className="font-semibold">Campaña activa</span>
            </label>
            <div>
              <p className="mb-1 text-sm font-bold">Productos asociados</p>
              <div className="max-h-48 space-y-1 overflow-y-auto rounded-xl border border-tinta/10 p-2">
                {productos.map((prod) => (
                  <label key={prod.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={datos.producto_ids.includes(prod.id)}
                      onChange={(e) =>
                        setDatos((p) => ({
                          ...p,
                          producto_ids: e.target.checked
                            ? [...p.producto_ids, prod.id]
                            : p.producto_ids.filter((id) => id !== prod.id),
                        }))
                      }
                      className="h-4 w-4 accent-celeste"
                    />
                    {prod.nombre} <span className="text-tinta/40">({prod.codigo})</span>
                  </label>
                ))}
              </div>
            </div>
            {mensaje && <p className="font-semibold text-coral">{mensaje}</p>}
            <div className="flex gap-2">
              <button
                onClick={guardar}
                disabled={guardando}
                className="flex-1 rounded-xl bg-celeste py-3 font-bold text-white disabled:opacity-60"
              >
                {guardando ? 'Guardando…' : 'Guardar campaña'}
              </button>
              <button onClick={() => setEditando(null)} className="rounded-xl bg-tinta/5 px-4 font-bold">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
