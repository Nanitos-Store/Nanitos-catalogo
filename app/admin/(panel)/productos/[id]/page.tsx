import { notFound } from 'next/navigation';
import { crearClienteServidor } from '@/lib/supabase/server';
import FormProducto from '@/components/admin/FormProducto';
import type { Categoria, Producto } from '@/lib/tipos';

export const dynamic = 'force-dynamic';

export default async function EditarProducto({ params }: { params: { id: string } }) {
  const supabase = crearClienteServidor();
  if (!supabase) notFound();

  const [productoRes, categoriasRes] = await Promise.all([
    supabase
      .from('productos')
      .select('*, producto_imagenes(*)')
      .eq('id', params.id)
      .maybeSingle(),
    supabase.from('categorias').select('*').order('orden'),
  ]);

  const producto = productoRes.data as Producto | null;
  if (!producto) notFound();

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Editar producto</h1>
      <FormProducto
        producto={producto}
        categorias={(categoriasRes.data ?? []) as Categoria[]}
      />
    </div>
  );
}
