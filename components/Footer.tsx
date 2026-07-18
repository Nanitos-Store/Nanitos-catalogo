import Image from 'next/image';
import Link from 'next/link';
import LoginFooter from './LoginFooter';
import { enlaceWhatsApp, mensajeConsulta, NUMERO_WHATSAPP } from '@/lib/whatsapp';

export const REDES_SOCIALES = [
  {
    nombre: 'Instagram',
    url: 'https://www.instagram.com/jugueteria.nanitos/',
    icono: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.9.2 2.3.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1.1.4 2.3.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.9-.4 2.3-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1.1.4-2.3.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.9-.2-2.3-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1.1-.4-2.3-.1-1.2-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-1.2.2-1.9.4-2.3.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1.1-.4 2.3-.4 1.2-.1 1.6-.1 4.8-.1zm0 2c-3.1 0-3.5 0-4.7.1-1.1.1-1.5.2-1.8.3-.4.2-.7.4-.9.7-.3.3-.5.5-.7.9-.1.3-.3.7-.3 1.8-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1.1.2 1.5.3 1.8.2.4.4.7.7.9.3.3.5.5.9.7.3.1.7.3 1.8.3 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.5-.2 1.8-.3.4-.2.7-.4.9-.7.3-.3.5-.5.7-.9.1-.3.3-.7.3-1.8.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1.1-.2-1.5-.3-1.8-.2-.4-.4-.7-.7-.9-.3-.3-.5-.5-.9-.7-.3-.1-.7-.3-1.8-.3-1.2-.1-1.6-.1-4.7-.1zm0 3.4a5.4 5.4 0 1 1 0 10.8 5.4 5.4 0 0 1 0-10.8zm0 2a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8zm5.6-3.5a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6z" />
      </svg>
    ),
  },
  {
    nombre: 'Facebook',
    url: 'https://www.facebook.com/profile.php?id=61582108498282',
    icono: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.5-3.92 3.78-3.92 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.9h-2.33V22c4.78-.75 8.44-4.91 8.44-9.94z" />
      </svg>
    ),
  },
  {
    nombre: 'TikTok',
    url: 'https://www.tiktok.com/@jugueteria.nanitos',
    icono: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M19.6 7.1a5.1 5.1 0 0 1-3-1 5.14 5.14 0 0 1-2-3.1h-3.1v12.4a2.9 2.9 0 1 1-2.1-2.8V9.4a6 6 0 1 0 5.2 6V9.5a8.2 8.2 0 0 0 5 1.7z" />
      </svg>
    ),
  },
];

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
          <p>
            <a
              href="https://maps.app.goo.gl/eNGnLRsE3otx73kJ7"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-amarillo hover:underline"
            >
              📍 Ver en Google Maps
            </a>
          </p>
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
            <li>
              <Link href="/premium" className="font-bold text-amarillo hover:underline">
                ⭐ Cuenta Premium Ñañilovers
              </Link>
            </li>
          </ul>
          <div className="mt-4 flex gap-2">
            {REDES_SOCIALES.map((red) => (
              <a
                key={red.nombre}
                href={red.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ñañitos en ${red.nombre}`}
                title={red.nombre}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:scale-110 hover:bg-celeste"
              >
                {red.icono}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 border-t border-white/10 py-4 text-center text-xs text-white/60">
        <span>© {new Date().getFullYear()} Juguetería Ñañitos — Bermejo, Bolivia</span>
        <span aria-hidden="true">·</span>
        <LoginFooter />
      </div>
    </footer>
  );
}
