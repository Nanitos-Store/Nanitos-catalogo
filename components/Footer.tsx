import Image from 'next/image';
import Link from 'next/link';
import { enlaceWhatsApp, mensajeConsulta, NUMERO_WHATSAPP } from '@/lib/whatsapp';

export default function Footer() {
  return (
    <footer className="mt-12 bg-tinta text-white">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <Image
            src="/brand/logo-nanitos.png"
            alt="Ñañitos"
            width={140}
            height={50}
            className="rounded bg-white/95 p-1"
          />
          <p className="mt-3 text-sm text-white/80">
            Tu importadora de frontera. Juguetes, peluches y novedades por docena
            y por caja.
          </p>
        </div>
        <div className="text-sm">
          <h3 className="mb-2 text-base font-bold text-amarillo">Visítanos</h3>
          <p>Calle Colorados, frente al Hotel La Costa</p>
          <p>Bermejo, Tarija — Bolivia</p>
          <p className="mt-2">Horarios: [INSERTAR: horarios de atención]</p>
          <a
            href={enlaceWhatsApp(mensajeConsulta())}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block rounded-full bg-whatsapp px-4 py-2 font-bold text-white"
          >
            WhatsApp +{NUMERO_WHATSAPP}
          </a>
        </div>
        <div className="text-sm">
          <h3 className="mb-2 text-base font-bold text-amarillo">Explora</h3>
          <ul className="space-y-1">
            <li><Link href="/catalogo" className="hover:underline">Catálogo completo</Link></li>
            <li><Link href="/catalogo?oferta=1" className="hover:underline">Ofertas</Link></li>
            <li><Link href="/catalogo?categoria=tendencias" className="hover:underline">Tendencias</Link></li>
            <li><Link href="/catalogo?categoria=economicos" className="hover:underline">Económicos</Link></li>
          </ul>
          <p className="mt-4 text-white/60">
            Redes: [INSERTAR: enlaces de Facebook, Instagram y TikTok]
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} Juguetería Ñañitos — Bermejo, Bolivia
      </div>
    </footer>
  );
}
