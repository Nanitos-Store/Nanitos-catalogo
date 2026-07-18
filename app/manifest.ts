import type { MetadataRoute } from 'next';

/** La web se puede instalar como app en el celular y el escritorio. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ñañitos — Tu importadora de frontera',
    short_name: 'Ñañitos',
    description:
      'Juguetes, peluches y novedades por docena y por caja desde Bermejo, Bolivia.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAF8F5',
    theme_color: '#29ABE2',
    icons: [
      { src: '/brand/icono-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/brand/icono-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
