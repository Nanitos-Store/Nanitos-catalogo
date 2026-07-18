'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  cambiarPasswordAdmin,
  cerrarSesionAdmin,
  iniciarSesionAdmin,
} from '@/app/acciones/admin-sesion';

function leerNombreAdmin(): string | null {
  if (typeof document === 'undefined') return null;
  const valor = document.cookie
    .split('; ')
    .find((c) => c.startsWith('nanitos_admin_nombre='))
    ?.split('=')[1];
  return valor ? decodeURIComponent(valor) : null;
}

/**
 * Acceso discreto del footer: "login" abre el modal de inicio de sesión;
 * con sesión activa se convierte en el ícono de perfil (panel, cambio de
 * contraseña y salir).
 */
export default function LoginFooter() {
  const router = useRouter();
  const [nombre, setNombre] = useState<string | null>(null);
  const [modal, setModal] = useState<'login' | 'perfil' | 'password' | null>(null);
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [anterior, setAnterior] = useState('');
  const [nueva, setNueva] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    setNombre(leerNombreAdmin());
  }, []);

  const cerrarModal = () => {
    setModal(null);
    setError(null);
    setAviso(null);
    setPassword('');
    setAnterior('');
    setNueva('');
  };

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    const r = await iniciarSesionAdmin({ usuario, password });
    setEnviando(false);
    if (!r.ok || !r.nombre) {
      setError(r.error ?? 'No se pudo iniciar sesión.');
      return;
    }
    setNombre(r.nombre);
    cerrarModal();
    router.refresh();
  };

  const salir = async () => {
    await cerrarSesionAdmin();
    setNombre(null);
    cerrarModal();
    router.refresh();
  };

  const cambiarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    const r = await cambiarPasswordAdmin({ anterior, nueva });
    setEnviando(false);
    if (!r.ok) {
      setError(r.error ?? 'No se pudo cambiar la contraseña.');
      return;
    }
    setAviso('✅ Contraseña actualizada.');
    setAnterior('');
    setNueva('');
  };

  const campo = 'w-full rounded-xl border border-tinta/15 px-3 py-2.5 text-tinta';

  return (
    <>
      {nombre ? (
        <button
          onClick={() => setModal('perfil')}
          aria-label={`Perfil de ${nombre}`}
          title={nombre}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-sm hover:bg-white/25"
        >
          👤
        </button>
      ) : (
        <button
          onClick={() => setModal('login')}
          className="text-white/40 hover:text-white/70 hover:underline"
        >
          login
        </button>
      )}

      {modal && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-tinta/60 p-4"
          onClick={cerrarModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-white p-5 text-tinta shadow-2xl"
          >
            {modal === 'login' && (
              <>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-bold">Iniciar sesión</h3>
                  <button onClick={cerrarModal} aria-label="Cerrar" className="rounded-full bg-tinta/5 px-3 py-1.5 font-bold">
                    ✕
                  </button>
                </div>
                <form onSubmit={entrar} className="space-y-3">
                  <input
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    required
                    autoComplete="username"
                    placeholder="Usuario"
                    className={campo}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="Contraseña"
                    className={campo}
                  />
                  {error && <p className="text-sm font-semibold text-coral">{error}</p>}
                  <button
                    type="submit"
                    disabled={enviando}
                    className="w-full rounded-xl bg-celeste py-3 font-bold text-white disabled:opacity-60"
                  >
                    {enviando ? 'Entrando…' : 'Entrar'}
                  </button>
                </form>
              </>
            )}

            {modal === 'perfil' && (
              <>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-bold">👤 {nombre}</h3>
                  <button onClick={cerrarModal} aria-label="Cerrar" className="rounded-full bg-tinta/5 px-3 py-1.5 font-bold">
                    ✕
                  </button>
                </div>
                <div className="space-y-2">
                  <Link
                    href="/admin"
                    onClick={cerrarModal}
                    className="block w-full rounded-xl bg-celeste py-3 text-center font-bold text-white"
                  >
                    🧸 Panel de control
                  </Link>
                  <button
                    onClick={() => {
                      setModal('password');
                      setError(null);
                      setAviso(null);
                    }}
                    className="w-full rounded-xl bg-tinta/5 py-3 font-bold"
                  >
                    🔑 Cambiar contraseña
                  </button>
                  <button
                    onClick={() => void salir()}
                    className="w-full rounded-xl bg-coral/10 py-3 font-bold text-coral"
                  >
                    Salir
                  </button>
                </div>
              </>
            )}

            {modal === 'password' && (
              <>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-bold">Cambiar contraseña</h3>
                  <button onClick={cerrarModal} aria-label="Cerrar" className="rounded-full bg-tinta/5 px-3 py-1.5 font-bold">
                    ✕
                  </button>
                </div>
                <form onSubmit={cambiarPassword} className="space-y-3">
                  <input
                    type="password"
                    value={anterior}
                    onChange={(e) => setAnterior(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="Contraseña anterior"
                    className={campo}
                  />
                  <input
                    type="password"
                    value={nueva}
                    onChange={(e) => setNueva(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    placeholder="Contraseña nueva (mín. 6)"
                    className={campo}
                  />
                  {error && <p className="text-sm font-semibold text-coral">{error}</p>}
                  {aviso && <p className="text-sm font-semibold text-verde">{aviso}</p>}
                  <button
                    type="submit"
                    disabled={enviando}
                    className="w-full rounded-xl bg-celeste py-3 font-bold text-white disabled:opacity-60"
                  >
                    {enviando ? 'Guardando…' : 'Guardar contraseña'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setModal('perfil')}
                    className="w-full rounded-xl bg-tinta/5 py-2.5 font-bold"
                  >
                    ← Volver
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
