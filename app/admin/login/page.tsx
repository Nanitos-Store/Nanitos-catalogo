'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { crearClienteNavegador } from '@/lib/supabase/client';

export default function LoginAdmin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    const supabase = crearClienteNavegador();
    if (!supabase) {
      setError('El sitio aún no está conectado a Supabase.');
      setEnviando(false);
      return;
    }
    const { error: errorAuth } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setEnviando(false);
    if (errorAuth) {
      setError('Correo o contraseña incorrectos.');
      return;
    }
    router.push('/admin');
    router.refresh();
  };

  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-sm flex-col justify-center px-4">
      <div className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-tinta/5">
        <div className="mb-4 flex justify-center">
          <Image src="/brand/logo-nanitos.png" alt="Ñañitos" width={160} height={57} />
        </div>
        <h1 className="mb-4 text-center text-xl font-bold">Panel de administración</h1>
        <form onSubmit={entrar} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="Correo electrónico"
            className="w-full rounded-xl border border-tinta/15 px-4 py-3"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="Contraseña"
            className="w-full rounded-xl border border-tinta/15 px-4 py-3"
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
      </div>
    </div>
  );
}
