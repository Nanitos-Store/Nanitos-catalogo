'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { iniciarSesionPremium } from '@/app/acciones/premium';

/** Login de la cuenta Premium (creada por la tienda tras la solicitud). */
export default function LoginPremium() {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    const r = await iniciarSesionPremium({ usuario, password });
    setEnviando(false);
    if (!r.ok) {
      setError(r.error ?? 'No se pudo iniciar sesión.');
      return;
    }
    router.refresh();
  };

  return (
    <form onSubmit={entrar} className="space-y-3">
      <h2 className="text-lg font-bold">Ya tengo mi cuenta Premium</h2>
      <input
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        required
        autoComplete="username"
        placeholder="Usuario"
        className="w-full rounded-xl border border-tinta/15 px-3 py-2.5"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
        placeholder="Contraseña"
        className="w-full rounded-xl border border-tinta/15 px-3 py-2.5"
      />
      {error && <p className="text-sm font-semibold text-coral">{error}</p>}
      <button
        type="submit"
        disabled={enviando}
        className="w-full rounded-xl bg-amarillo py-3 font-bold text-tinta disabled:opacity-60"
      >
        {enviando ? 'Entrando…' : 'Entrar a mi sección Premium'}
      </button>
    </form>
  );
}
