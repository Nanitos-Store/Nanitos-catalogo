'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { cambiarEstadoAdmin, invitarAdmin } from '@/app/admin/acciones';
import type { Perfil } from '@/lib/tipos';

export default function GestorAdmins({ perfiles }: { perfiles: Perfil[] }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const invitar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setMensaje(null);
    const r = await invitarAdmin({ email, nombre, password });
    setEnviando(false);
    if (r.ok) {
      setMensaje('✅ Administrador creado. Comparte el correo y la contraseña.');
      setEmail('');
      setNombre('');
      setPassword('');
      router.refresh();
    } else {
      setMensaje(r.error ?? 'Error al crear.');
    }
  };

  const cambiarEstado = async (perfil: Perfil) => {
    await cambiarEstadoAdmin(perfil.id, !perfil.activo);
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={invitar} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-tinta/5">
        <h2 className="mb-3 text-lg font-bold">Invitar nuevo admin</h2>
        <div className="grid gap-2 sm:grid-cols-3">
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            placeholder="Nombre"
            className="rounded-xl border border-tinta/15 px-4 py-3"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Correo electrónico"
            className="rounded-xl border border-tinta/15 px-4 py-3"
          />
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            placeholder="Contraseña inicial"
            className="rounded-xl border border-tinta/15 px-4 py-3"
          />
        </div>
        {mensaje && <p className="mt-2 text-sm font-semibold">{mensaje}</p>}
        <button
          type="submit"
          disabled={enviando}
          className="mt-3 rounded-xl bg-celeste px-6 py-3 font-bold text-white disabled:opacity-60"
        >
          {enviando ? 'Creando…' : 'Crear admin'}
        </button>
      </form>

      <ul className="space-y-2">
        {perfiles.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center gap-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-tinta/5">
            <div className="min-w-0 flex-1">
              <p className="font-bold">{p.nombre ?? 'Sin nombre'}</p>
              <p className="text-xs text-tinta/60">
                {p.rol === 'superadmin' ? '🔑 Superadmin' : 'Admin'} ·{' '}
                {p.activo ? 'activo' : 'desactivado'}
              </p>
            </div>
            {p.rol !== 'superadmin' && (
              <button
                onClick={() => void cambiarEstado(p)}
                className={`rounded-full px-4 py-1.5 text-sm font-bold ${
                  p.activo ? 'bg-coral/10 text-coral' : 'bg-verde/15 text-verde'
                }`}
              >
                {p.activo ? 'Desactivar' : 'Activar'}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
