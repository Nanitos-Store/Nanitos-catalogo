import Link from 'next/link';

export default function NoEncontrado() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <p className="text-6xl">🧸</p>
      <h1 className="mt-4 text-2xl font-bold">No encontramos esa página</h1>
      <p className="mt-2 text-tinta/70">
        Puede que el producto haya cambiado de nombre o ya no esté publicado.
      </p>
      <Link
        href="/catalogo"
        className="mt-6 inline-block rounded-full bg-celeste px-6 py-3 font-bold text-white"
      >
        Ir al catálogo
      </Link>
    </div>
  );
}
