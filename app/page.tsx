import Image from 'next/image';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { crearClienteServidor } from '@/lib/supabase/server';
import { COOKIE_PAIS, esPais } from '@/lib/pais';
import TarjetaProducto from '@/components/TarjetaProducto';
import BloqueLogistica from '@/components/BloqueLogistica';
import type { Campana, Categoria, Pais, Producto } from '@/lib/tipos';

export const revalidate = 300;
export const dynamic = 'force-dynamic';

async function obtenerDatos(pais: Pais | null) {
  const supabase = crearClienteServidor();
  if (!supabase) {
    return { categorias: [], destacados: [], ofertas: [], campana: null };
  }
  const hoy = new Date().toISOString().slice(0, 10);

  const [categoriasRes, destacadosRes, ofertasRes, campanasRes] = await Promise.all([
    supabase.from('categorias').select('*').order('orden'),
    supabase
      .from('productos')
      .select('*, categorias(*), producto_imagenes(*)')
      .eq('disponible', true)
      .eq('destacado', true)
      .order('orden')
      .limit(8),
    supabase
      .from('productos')
      .select('*, categorias(*), producto_imagenes(*)')
      .eq('disponible', true)
      .eq('en_oferta', true)
      .order('orden')
      .limit(4),
    supabase
      .from('campanas')
      .select('*')
      .eq('activa', true)
      .lte('fecha_inicio', hoy)
      .gte('fecha_fin', hoy),
  ]);

  const campanas = (campanasRes.data ?? []) as Campana[];
  const campana =
    campanas.find((c) => c.pais_objetivo === pais) ??
    campanas.find((c) => c.pais_objetivo === 'ambos') ??
    campanas[0] ??
    null;

  return {
    categorias: (categoriasRes.data ?? []) as Categoria[],
    destacados: (destacadosRes.data ?? []) as Producto[],
    ofertas: (ofertasRes.data ?? []) as Producto[],
    campana,
  };
}

const PASOS_COMPRA = [
  { icono: '🧸', titulo: 'Elige el producto', texto: 'Navega el catálogo y encuentra los diseños que llaman la atención.' },
  { icono: '💬', titulo: 'Escríbenos por WhatsApp', texto: 'Con un clic te atendemos con el detalle de tu pedido.' },
  { icono: '🚚', titulo: 'Coordinamos envío o retiro', texto: 'Despachamos a todo Bolivia o coordinamos tu retiro en Bermejo.' },
];

export default async function Home() {
  const cookiePais = cookies().get(COOKIE_PAIS)?.value;
  const pais: Pais | null = esPais(cookiePais) ? cookiePais : null;
  const { categorias, destacados, ofertas, campana } = await obtenerDatos(pais);

  return (
    <div className="mx-auto max-w-5xl px-4">
      {/* Banner de campaña activa (tabla campanas — nada hardcodeado) */}
      {campana ? (
        <Link
          href={`/campana/${campana.slug}`}
          className="mt-4 block animate-aparecer overflow-hidden rounded-3xl bg-gradient-to-r from-celeste to-verde p-6 text-white shadow-lg transition hover:shadow-xl sm:p-10"
        >
          <h1 className="text-2xl font-bold sm:text-4xl">{campana.titulo}</h1>
          {campana.subtitulo && (
            <p className="mt-2 max-w-xl text-sm text-white/90 sm:text-base">
              {campana.subtitulo}
            </p>
          )}
          <span className="mt-4 inline-block rounded-full bg-white px-5 py-2 font-bold text-celeste">
            Ver productos →
          </span>
        </Link>
      ) : (
        <div className="mt-4 animate-aparecer rounded-3xl bg-gradient-to-r from-celeste to-verde p-6 text-white shadow-lg sm:p-10">
          <h1 className="text-2xl font-bold sm:text-4xl">
            Juguetes y novedades por docena y por caja
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/90 sm:text-base">
            Tu importadora de frontera en Bermejo, Bolivia. Peluches, mochilas y
            los diseños que la gente pregunta.
          </p>
          <Link
            href="/catalogo"
            className="mt-4 inline-block rounded-full bg-white px-5 py-2 font-bold text-celeste"
          >
            Ver catálogo →
          </Link>
        </div>
      )}

      {/* Categorías */}
      <section className="mt-8">
        <h2 className="mb-3 text-xl font-bold">Explora por categoría</h2>
        {categorias.length === 0 ? (
          <p className="rounded-2xl bg-white p-4 text-sm text-tinta/60">
            Conecta Supabase y ejecuta las migraciones + seed para ver el
            catálogo. Instrucciones en el README.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {categorias.map((c) => (
              <Link
                key={c.id}
                href={`/catalogo?categoria=${c.slug}`}
                className="flex items-center gap-2 rounded-2xl bg-white p-3 text-sm font-bold shadow-sm ring-1 ring-tinta/5 transition hover:ring-celeste"
              >
                <span className="text-xl">{c.icono}</span>
                <span className="leading-tight">{c.nombre}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Destacados */}
      {destacados.length > 0 && (
        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold">Los que la gente pregunta 🔥</h2>
            <Link href="/catalogo" className="text-sm font-bold text-celeste">
              Ver todo →
            </Link>
          </div>
          <div className="aparicion-escalonada grid grid-cols-2 gap-3 sm:grid-cols-4">
            {destacados.map((p, i) => (
              <TarjetaProducto key={p.id} producto={p} pais={pais} prioridad={i < 2} />
            ))}
          </div>
        </section>
      )}

      {/* Ofertas */}
      {ofertas.length > 0 && (
        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold text-coral">Ofertas especiales</h2>
            <Link href="/catalogo?oferta=1" className="text-sm font-bold text-celeste">
              Ver todas →
            </Link>
          </div>
          <div className="aparicion-escalonada grid grid-cols-2 gap-3 sm:grid-cols-4">
            {ofertas.map((p) => (
              <TarjetaProducto key={p.id} producto={p} pais={pais} />
            ))}
          </div>
        </section>
      )}

      {/* Cómo comprar */}
      <section className="mt-10">
        <h2 className="mb-3 text-xl font-bold">Cómo comprar</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {PASOS_COMPRA.map((paso, i) => (
            <div key={paso.titulo} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-tinta/5">
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amarillo font-bold">
                  {i + 1}
                </span>
                <span className="text-2xl">{paso.icono}</span>
              </div>
              <h3 className="font-bold">{paso.titulo}</h3>
              <p className="mt-1 text-sm text-tinta/70">{paso.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Docena vs caja */}
      <section className="mt-10 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-celeste/10 p-5">
          <h3 className="text-lg font-bold">📦 ¿Docena o caja?</h3>
          <p className="mt-2 text-sm">
            <strong>Por docena</strong> pides 12 unidades del mismo producto:
            perfecto para empezar o combinar variedad.
          </p>
          <p className="mt-2 text-sm">
            <strong>Por caja</strong> accedes al mejor precio por unidad: cada
            producto indica cuántas unidades trae su caja.
          </p>
        </div>
        <BloqueLogistica pais={pais} />
      </section>

      {/* Confianza */}
      <section className="mt-10 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-tinta/5">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Image
            src="/brand/logo-nanitos.png"
            alt="Ñañitos, tu importadora de frontera"
            width={180}
            height={64}
          />
          <div>
            <h2 className="text-lg font-bold">Una tienda real, con atención real</h2>
            <p className="mt-1 text-sm text-tinta/70">
              Estamos en Calle Colorados, frente al Hotel La Costa, en Bermejo.
              Puedes visitarnos, escribirnos por WhatsApp o seguirnos en redes.
              [INSERTAR: fotos reales de la tienda y del equipo]
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
