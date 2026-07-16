import Image from 'next/image';
import Link from 'next/link';
import { ConmutadorPais } from './SelectorPais';
import Buscador from './Buscador';
import { BotonCarritoHeader } from './BotonAgregarCarrito';
import type { Pais } from '@/lib/tipos';

export default function Header({ pais }: { pais: Pais | null }) {
  return (
    <header className="sticky top-0 z-40 border-b border-tinta/5 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2.5">
        <Link href="/" className="shrink-0" aria-label="Ñañitos — inicio">
          <Image
            src="/brand/logo-nanitos.png"
            alt="Ñañitos, tu importadora de frontera"
            width={128}
            height={45}
            priority
          />
        </Link>
        <div className="hidden flex-1 sm:block">
          <Buscador />
        </div>
        <nav className="ml-auto flex items-center gap-2">
          <Link
            href="/catalogo"
            className="hidden rounded-full bg-celeste px-4 py-2 text-sm font-bold text-white hover:bg-celeste/90 sm:block"
          >
            Catálogo
          </Link>
          <ConmutadorPais paisActual={pais} />
          <BotonCarritoHeader />
        </nav>
      </div>
      <div className="border-t border-tinta/5 px-4 py-2 sm:hidden">
        <Buscador />
      </div>
    </header>
  );
}
