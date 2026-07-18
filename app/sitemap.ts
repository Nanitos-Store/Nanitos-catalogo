import type { MetadataRoute } from 'next';
import { crearClienteServidor } from '@/lib/supabase/server';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const estaticas: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/catalogo`, changeFrequency: 'daily', priority: 0.9 },
  ];

  const supabase = crearClienteServidor();
  if (!supabase) return estaticas;

  const hoy = new Date().toISOString().slice(0, 10);
  const [productosRes, campanasRes] = await Promise.all([
    supabase
      .from('productos')
      .select('slug, updated_at')
      .eq('disponible', true)
      .or(`fecha_publica.is.null,fecha_publica.lte.${hoy}`),
    supabase.from('campanas').select('slug').eq('activa', true),
  ]);

  const productos = (productosRes.data ?? []).map((p) => ({
    url: `${SITE_URL}/producto/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : undefined,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const campanas = (campanasRes.data ?? []).map((c) => ({
    url: `${SITE_URL}/campana/${c.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...estaticas, ...productos, ...campanas];
}
