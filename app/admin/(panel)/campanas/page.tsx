import { crearClienteServidor } from '@/lib/supabase/server';
import GestorCampanas from '@/components/admin/GestorCampanas';
import type { Campana, Producto } from '@/lib/tipos';

export const dynamic = 'force-dynamic';

export default async function CampanasAdmin() {
  const supabase = crearClienteServidor();
  if (!supabase) return null;

  const [campanasRes, productosRes] = await Promise.all([
    supabase.from('campanas').select('*').order('fecha_inicio', { ascending: false }),
    supabase.from('productos').select('id, nombre, codigo').order('nombre'),
  ]);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Campañas y banners</h1>
      <GestorCampanas
        campanas={(campanasRes.data ?? []) as Campana[]}
        productos={(productosRes.data ?? []) as Pick<Producto, 'id' | 'nombre' | 'codigo'>[]}
      />
    </div>
  );
}
