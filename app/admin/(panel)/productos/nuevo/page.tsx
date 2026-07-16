import { crearClienteServidor } from '@/lib/supabase/server';
import FormProducto from '@/components/admin/FormProducto';
import type { Categoria } from '@/lib/tipos';

export const dynamic = 'force-dynamic';

export default async function NuevoProducto() {
  const supabase = crearClienteServidor();
  const { data } = supabase
    ? await supabase.from('categorias').select('*').order('orden')
    : { data: [] };

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Nuevo producto</h1>
      <FormProducto producto={null} categorias={(data ?? []) as Categoria[]} />
    </div>
  );
}
