import Link from 'next/link';
import { redirect } from 'next/navigation';
import { crearClienteServidor } from '@/lib/supabase/server';
import { sesionAdminActual } from '@/lib/admin-sesion';
import BotonSalir from '@/components/admin/BotonSalir';
import type { Perfil } from '@/lib/tipos';

export const metadata = { title: 'Admin' };
export const dynamic = 'force-dynamic';

const NAV = [
  { href: '/admin', texto: '📊 Inicio' },
  { href: '/admin/productos', texto: '🧸 Productos' },
  { href: '/admin/premium', texto: '⭐ Premium' },
  { href: '/admin/campanas', texto: '📣 Campañas' },
  { href: '/admin/clientes', texto: '👥 Clientes' },
  { href: '/admin/pedidos', texto: '🧾 Pedidos' },
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  // Camino 1: sesión maestra del footer (cuenta nanitos-boss)
  const sesionMaestra = sesionAdminActual();

  let perfil: Perfil | null = null;
  if (sesionMaestra) {
    perfil = {
      id: 'cuenta-maestra',
      nombre: sesionMaestra.nombre,
      rol: 'superadmin',
      activo: true,
      created_at: '',
    };
  } else {
    // Camino 2: Supabase Auth (correo/contraseña o Google) + tabla perfiles
    const supabase = crearClienteServidor();
    if (!supabase) redirect('/');

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect('/admin/login');

    const { data } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    perfil = data as Perfil | null;
  }

  if (!perfil || !perfil.activo) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-xl font-bold">Sin acceso al panel</h1>
        <p className="mt-2 text-tinta/70">
          Tu cuenta no tiene un perfil de administración activo. Habla con la
          persona superadmin de Ñañitos.
        </p>
        <div className="mt-4 flex justify-center">
          <BotonSalir />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-4">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <nav className="sin-scrollbar flex flex-1 gap-2 overflow-x-auto">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm ring-1 ring-tinta/10 hover:ring-celeste"
            >
              {item.texto}
            </Link>
          ))}
          {perfil.rol === 'superadmin' && (
            <Link
              href="/admin/administradores"
              className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm ring-1 ring-tinta/10 hover:ring-celeste"
            >
              🔑 Administradores
            </Link>
          )}
        </nav>
        <BotonSalir />
      </div>
      {children}
    </div>
  );
}
