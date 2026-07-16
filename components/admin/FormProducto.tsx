'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { crearClienteNavegador } from '@/lib/supabase/client';
import { eliminarProducto, guardarProducto, type DatosProducto } from '@/app/admin/acciones';
import type { Categoria, Producto } from '@/lib/tipos';

function slugificar(texto: string) {
  return texto
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ñ/gi, 'n')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

const PERSONAJES_SUGERIDOS = ['Labubu', 'Stitch', 'Capibara', 'Kuromi', 'Brain Rot', 'Snoopy', 'BT21', 'K-Pop'];
const TEMPORADAS = ['regreso_clases', 'verano', 'san_valentin', 'mundial_2026', 'navidad', 'dia_del_nino', 'halloween'];

export default function FormProducto({
  producto,
  categorias,
}: {
  producto: Producto | null;
  categorias: Categoria[];
}) {
  const router = useRouter();
  const [datos, setDatos] = useState<DatosProducto>({
    nombre: producto?.nombre ?? '',
    slug: producto?.slug ?? '',
    descripcion: producto?.descripcion ?? '',
    categoria_id: producto?.categoria_id ?? categorias[0]?.id ?? null,
    codigo: producto?.codigo ?? '',
    personajes: producto?.personajes ?? [],
    temporada: producto?.temporada ?? [],
    precio_docena: producto?.precio_docena ?? null,
    precio_caja: producto?.precio_caja ?? null,
    unidades_por_caja: producto?.unidades_por_caja ?? null,
    moneda: producto?.moneda ?? 'USD',
    vende_por_docena: producto?.vende_por_docena ?? true,
    vende_por_caja: producto?.vende_por_caja ?? true,
    mostrar_precio: producto?.mostrar_precio ?? false,
    en_oferta: producto?.en_oferta ?? false,
    etiqueta_oferta: producto?.etiqueta_oferta ?? null,
    disponible: producto?.disponible ?? true,
    destacado: producto?.destacado ?? false,
    stock_cajas: producto?.stock_cajas ?? null,
  });
  const [imagenes, setImagenes] = useState<{ url: string }[]>(
    (producto?.producto_imagenes ?? [])
      .sort((a, b) => Number(b.es_principal) - Number(a.es_principal) || a.orden - b.orden)
      .map((i) => ({ url: i.url }))
  );
  const [subiendo, setSubiendo] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const actualizar = <K extends keyof DatosProducto>(k: K, v: DatosProducto[K]) =>
    setDatos((prev) => ({ ...prev, [k]: v }));

  const subirFotos = async (archivos: FileList | null) => {
    if (!archivos || archivos.length === 0) return;
    const supabase = crearClienteNavegador();
    if (!supabase) {
      setMensaje('Sin conexión a Supabase.');
      return;
    }
    setSubiendo(true);
    setMensaje(null);
    try {
      const nuevas: { url: string }[] = [];
      for (const archivo of Array.from(archivos)) {
        // Compresión client-side: fotos del celular → máx 1 MB / 1600 px
        const comprimido = await imageCompression(archivo, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1600,
          useWebWorker: true,
        });
        const ruta = `subidas/${Date.now()}-${slugificar(archivo.name)}.webp`;
        const { error } = await supabase.storage
          .from('productos')
          .upload(ruta, comprimido, { contentType: comprimido.type, upsert: false });
        if (error) throw error;
        const { data } = supabase.storage.from('productos').getPublicUrl(ruta);
        nuevas.push({ url: data.publicUrl });
      }
      setImagenes((prev) => [...prev, ...nuevas]);
    } catch {
      setMensaje('No se pudieron subir las fotos. Revisa tu conexión.');
    }
    setSubiendo(false);
  };

  const guardar = async () => {
    setGuardando(true);
    setMensaje(null);
    const r = await guardarProducto(producto?.id ?? null, datos, imagenes);
    setGuardando(false);
    if (r.ok) {
      router.push('/admin/productos');
      router.refresh();
    } else {
      setMensaje(r.error ?? 'Error al guardar.');
    }
  };

  const eliminar = async () => {
    if (!producto) return;
    if (!confirm(`¿Eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`)) return;
    const r = await eliminarProducto(producto.id);
    if (r.ok) {
      router.push('/admin/productos');
      router.refresh();
    } else {
      setMensaje(r.error ?? 'Error al eliminar.');
    }
  };

  const alternarLista = (lista: 'personajes' | 'temporada', valor: string) => {
    const actual = datos[lista];
    actualizar(
      lista,
      actual.includes(valor) ? actual.filter((v) => v !== valor) : [...actual, valor]
    );
  };

  const campo = 'w-full rounded-xl border border-tinta/15 px-4 py-3';

  return (
    <div className="mx-auto max-w-xl space-y-4 pb-10">
      <div>
        <label className="mb-1 block text-sm font-bold">Nombre</label>
        <input
          value={datos.nombre}
          onChange={(e) => {
            actualizar('nombre', e.target.value);
            if (!producto) actualizar('slug', slugificar(e.target.value));
          }}
          className={campo}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-bold">Código</label>
          <input
            value={datos.codigo}
            onChange={(e) => actualizar('codigo', e.target.value)}
            className={campo}
            placeholder="GO003"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-bold">Categoría</label>
          <select
            value={datos.categoria_id ?? ''}
            onChange={(e) => actualizar('categoria_id', e.target.value || null)}
            className={campo}
          >
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-bold">Descripción</label>
        <textarea
          value={datos.descripcion}
          onChange={(e) => actualizar('descripcion', e.target.value)}
          rows={3}
          className={campo}
        />
      </div>

      <div>
        <span className="mb-1 block text-sm font-bold">Fotos (la primera es la principal)</span>
        <div className="flex flex-wrap gap-2">
          {imagenes.map((img, i) => (
            <div key={img.url} className="relative h-20 w-20 overflow-hidden rounded-xl bg-white ring-1 ring-tinta/10">
              <Image src={img.url} alt="" fill sizes="80px" className="object-contain" />
              <button
                onClick={() => setImagenes((prev) => prev.filter((_, j) => j !== i))}
                aria-label="Quitar foto"
                className="absolute right-0 top-0 rounded-bl-lg bg-coral px-1.5 text-xs font-bold text-white"
              >
                ✕
              </button>
            </div>
          ))}
          <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-tinta/20 text-2xl text-tinta/40">
            {subiendo ? '⏳' : '+'}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => void subirFotos(e.target.files)}
              className="hidden"
            />
          </label>
        </div>
        <p className="mt-1 text-xs text-tinta/50">
          Puedes subir varias fotos desde el celular: se comprimen solas antes de subir.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="mb-1 block text-sm font-bold">Precio docena</label>
          <input
            value={datos.precio_docena ?? ''}
            onChange={(e) =>
              actualizar('precio_docena', e.target.value ? Number(e.target.value.replace(',', '.')) : null)
            }
            inputMode="decimal"
            className={campo}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-bold">Precio caja</label>
          <input
            value={datos.precio_caja ?? ''}
            onChange={(e) =>
              actualizar('precio_caja', e.target.value ? Number(e.target.value.replace(',', '.')) : null)
            }
            inputMode="decimal"
            className={campo}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-bold">Unid. por caja</label>
          <input
            value={datos.unidades_por_caja ?? ''}
            onChange={(e) =>
              actualizar('unidades_por_caja', e.target.value ? Number(e.target.value) : null)
            }
            inputMode="numeric"
            className={campo}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold">
          Stock (cajas en depósito — solo lo ves tú)
        </label>
        <input
          value={datos.stock_cajas ?? ''}
          onChange={(e) =>
            actualizar('stock_cajas', e.target.value ? Number(e.target.value) : null)
          }
          inputMode="numeric"
          className={campo}
          placeholder="Vacío = sin control de stock"
        />
        <p className="mt-1 text-xs text-tinta/50">
          Es un contador interno de referencia. Para ocultar el producto de la
          web usa el interruptor “Disponible”.
        </p>
      </div>

      <div>
        <span className="mb-1 block text-sm font-bold">Personajes</span>
        <div className="flex flex-wrap gap-1.5">
          {PERSONAJES_SUGERIDOS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => alternarLista('personajes', p)}
              className={`rounded-full px-3 py-1.5 text-sm font-bold ${
                datos.personajes.includes(p) ? 'bg-celeste text-white' : 'bg-white ring-1 ring-tinta/15'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="mb-1 block text-sm font-bold">Temporada</span>
        <div className="flex flex-wrap gap-1.5">
          {TEMPORADAS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => alternarLista('temporada', t)}
              className={`rounded-full px-3 py-1.5 text-sm font-bold ${
                datos.temporada.includes(t) ? 'bg-naranja text-white' : 'bg-white ring-1 ring-tinta/15'
              }`}
            >
              {t.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {(
          [
            ['vende_por_docena', 'Vende por docena'],
            ['vende_por_caja', 'Vende por caja'],
            ['mostrar_precio', 'Mostrar precio'],
            ['en_oferta', 'En oferta'],
            ['disponible', 'Disponible'],
            ['destacado', 'Destacado en home'],
          ] as [keyof DatosProducto, string][]
        ).map(([k, texto]) => (
          <label key={k} className="flex items-center gap-2 rounded-xl bg-white p-3 ring-1 ring-tinta/10">
            <input
              type="checkbox"
              checked={Boolean(datos[k])}
              onChange={(e) => actualizar(k, e.target.checked as never)}
              className="h-5 w-5 accent-celeste"
            />
            <span className="text-sm font-semibold">{texto}</span>
          </label>
        ))}
      </div>

      {datos.en_oferta && (
        <div>
          <label className="mb-1 block text-sm font-bold">Etiqueta de oferta</label>
          <input
            value={datos.etiqueta_oferta ?? ''}
            onChange={(e) => actualizar('etiqueta_oferta', e.target.value || null)}
            className={campo}
            placeholder="¡Oferta especial!"
          />
        </div>
      )}

      {mensaje && <p className="font-semibold text-coral">{mensaje}</p>}

      <div className="flex gap-2">
        <button
          onClick={guardar}
          disabled={guardando || subiendo}
          className="flex-1 rounded-xl bg-celeste py-3.5 font-bold text-white disabled:opacity-60"
        >
          {guardando ? 'Guardando…' : 'Guardar producto'}
        </button>
        {producto && (
          <button
            onClick={eliminar}
            className="rounded-xl bg-coral/10 px-4 font-bold text-coral"
          >
            Eliminar
          </button>
        )}
      </div>
      <p className="text-xs text-tinta/50">
        Al crear o editar, el precio queda marcado como “sin verificar” hasta que
        lo confirmes desde la lista con “Guardar y marcar verificado”.
      </p>
    </div>
  );
}
