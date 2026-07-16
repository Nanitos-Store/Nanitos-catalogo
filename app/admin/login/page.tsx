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

  const entrarConGoogle = async () => {
    setError(null);
    const supabase = crearClienteNavegador();
    if (!supabase) {
      setError('El sitio aún no está conectado a Supabase.');
      return;
    }
    const { error: errorOauth } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent('/admin')}`,
      },
    });
    if (errorOauth) setError('Google no está disponible. Usa correo y contraseña.');
  };

  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-sm flex-col justify-center px-4">
      <div className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-tinta/5">
        <div className="mb-4 flex justify-center">
          <Image src="/brand/logo-nanitos.png" alt="Ñañitos" width={160} height={57} />
        </div>
        <h1 className="mb-4 text-center text-xl font-bold">Panel de administración</h1>
        <button
          type="button"
          onClick={() => void entrarConGoogle()}
          className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-tinta/15 bg-white py-3 font-bold shadow-sm hover:border-celeste"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18A10.97 10.97 0 0 0 1 12c0 1.77.42 3.45 1.18 4.94l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
          </svg>
          Entrar con Google
        </button>
        <p className="mb-3 text-center text-xs text-tinta/50">
          Solo cuentas autorizadas por Ñañitos pueden entrar al panel.
        </p>
        <div className="mb-3 flex items-center gap-2 text-xs text-tinta/40">
          <span className="h-px flex-1 bg-tinta/10" />
          o con correo y contraseña
          <span className="h-px flex-1 bg-tinta/10" />
        </div>
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
