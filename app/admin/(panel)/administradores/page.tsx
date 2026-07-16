import { redirect } from 'next/navigation';
import { crearClienteServidor } from '@/lib/supabase/server';
import GestorAdmins from '@/components/admin/GestorAdmins';
import type { Perfil } from '@/lib/tipos';

export const dynamic = 'force-dynamic';

export default async function AdministradoresPage() {
  const supabase = crearClienteServidor();
  if (!supabase) redirect('/admin');

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: propio } = await supabase
    .from('perfiles')
    .select('rol, activo')
    .eq('id', user?.id ?? '')
    .maybeSingle();

  // Visible SOLO para superadmin
  if (propio?.rol !== 'superadmin' || !propio.activo) redirect('/admin');

  const { data } = await supabase
    .from('perfiles')
    .select('*')
    .order('created_at');

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Administradores</h1>
      <GestorAdmins perfiles={(data ?? []) as Perfil[]} />
    </div>
  );
}
