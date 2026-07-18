'use client';

import { useRouter } from 'next/navigation';
import { crearClienteNavegador } from '@/lib/supabase/client';
import { cerrarSesionAdmin } from '@/app/acciones/admin-sesion';

export default function BotonSalir() {
  const router = useRouter();
  const salir = async () => {
    await cerrarSesionAdmin();
    const supabase = crearClienteNavegador();
    await supabase?.auth.signOut();
    router.push('/');
    router.refresh();
  };
  return (
    <button
      onClick={salir}
      className="rounded-full bg-tinta/5 px-4 py-2 text-sm font-bold text-tinta/70 hover:bg-tinta/10"
    >
      Salir
    </button>
  );
}
