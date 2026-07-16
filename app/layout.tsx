import type { Metadata } from 'next';
import { Baloo_2, Nunito } from 'next/font/google';
import { cookies } from 'next/headers';
import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BotonFlotanteWhatsApp from '@/components/BotonFlotanteWhatsApp';
import MetaPixel from '@/components/MetaPixel';
import CarritoProvider from '@/components/CarritoProvider';
import HojaCarrito from '@/components/HojaCarrito';
import { COOKIE_PAIS, esPais } from '@/lib/pais';
import './globals.css';

const baloo = Baloo_2({
  subsets: ['latin'],
  variable: '--font-baloo',
  display: 'swap',
});
const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Ñañitos — Juguetes por docena y por caja en Bermejo, Bolivia',
    template: '%s | Ñañitos',
  },
  description:
    'Importadora de juguetes en Bermejo, Bolivia. Peluches, mochilas, útiles escolares y novedades por docena y por caja. Atendemos a Bolivia y al norte argentino.',
  openGraph: {
    siteName: 'Ñañitos',
    locale: 'es_BO',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookiePais = cookies().get(COOKIE_PAIS)?.value;
  const pais = esPais(cookiePais) ? cookiePais : null;

  return (
    <html lang="es" className={`${baloo.variable} ${nunito.variable}`}>
      <body>
        <MetaPixel />
        <CarritoProvider>
          <Suspense>
            <Header pais={pais} />
          </Suspense>
          <main className="min-h-[60dvh]">{children}</main>
          <Footer />
          <BotonFlotanteWhatsApp pais={pais} />
          <HojaCarrito pais={pais} />
        </CarritoProvider>
      </body>
    </html>
  );
}
