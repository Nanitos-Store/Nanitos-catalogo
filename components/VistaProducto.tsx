'use client';

import { useEffect } from 'react';
import { trackEvento } from '@/lib/meta';

/** Dispara ViewContent (Pixel + CAPI) al abrir la página de producto. */
export default function VistaProducto({
  nombre,
  codigo,
  categoria,
}: {
  nombre: string;
  codigo: string | null;
  categoria: string | null;
}) {
  useEffect(() => {
    trackEvento('ViewContent', {
      content_name: nombre,
      content_category: categoria ?? undefined,
      content_ids: codigo ? [codigo] : undefined,
      content_type: 'product',
    });
  }, [nombre, codigo, categoria]);
  return null;
}
