import { crearClienteServidor } from '@/lib/supabase/server';
import { crearClienteAdmin } from '@/lib/supabase/admin';
import { sesionAdminActual } from '@/lib/admin-sesion';
import GestorPremium from '@/components/admin/GestorPremium';
import type { Cliente, CuentaPremium, DeseoPremium } from '@/lib/tipos';

export const dynamic = 'force-dynamic';

export default async function PremiumAdmin() {
  // La cuenta maestra usa service role; un admin de Supabase usa su sesión
  const supabase = sesionAdminActual() ? crearClienteAdmin() : crearClienteServidor();
  const admin = crearClienteAdmin();
  if (!supabase || !admin) return null;

  const [solicitudesRes, cuentasRes, deseosRes] = await Promise.all([
    supabase
      .from('clientes')
      .select('*')
      .eq('es_premium', true)
      .order('created_at', { ascending: false }),
    admin
      .from('cuentas_premium')
      .select('*, clientes(*)')
      .order('created_at', { ascending: false }),
    admin
      .from('lista_deseos')
      .select('*, cuentas_premium(usuario, nombre)')
      .order('created_at', { ascending: false })
      .limit(200),
  ]);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">⭐ Premium</h1>
      <GestorPremium
        solicitudes={(solicitudesRes.data ?? []) as Cliente[]}
        cuentas={(cuentasRes.data ?? []) as CuentaPremium[]}
        deseos={(deseosRes.data ?? []) as DeseoPremium[]}
      />
    </div>
  );
}
