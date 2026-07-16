'use client';

import { useEffect, useState } from 'react';
import { registrarCliente } from '@/app/acciones/cliente';
import { crearClienteNavegador } from '@/lib/supabase/client';
import { STORAGE_CLIENTE } from '@/lib/pais';
import type { ClienteLocal, Pais } from '@/lib/tipos';

export function leerClienteLocal(): ClienteLocal | null {
  try {
    const crudo = localStorage.getItem(STORAGE_CLIENTE);
    if (!crudo) return null;
    const cliente = JSON.parse(crudo) as ClienteLocal;
    return cliente?.id ? cliente : null;
  } catch {
    return null;
  }
}

export function guardarClienteLocal(cliente: ClienteLocal) {
  try {
    localStorage.setItem(STORAGE_CLIENTE, JSON.stringify(cliente));
  } catch {
    // localStorage puede no estar disponible
  }
}

/**
 * Registro único (una sola vez en la vida del cliente): un solo paso con
 * nombre, WhatsApp, correo, país y ciudad.
 */
export default function FormularioRegistro({
  paisInicial,
  onListo,
}: {
  paisInicial: Pais;
  onListo: (cliente: ClienteLocal) => void;
}) {
  const [pais, setPais] = useState<Pais>(paisInicial);
  const [nombre, setNombre] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [conGoogle, setConGoogle] = useState(false);

  // Si el visitante volvió de Google, prellenamos nombre y correo
  useEffect(() => {
    const supabase = crearClienteNavegador();
    if (!supabase) return;
    void supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setConGoogle(true);
      setEmail((previo) => previo || user.email || '');
      const nombreGoogle =
        (user.user_metadata?.full_name as string | undefined) ??
        (user.user_metadata?.name as string | undefined) ??
        '';
      if (nombreGoogle) setNombre((previo) => previo || nombreGoogle);
    });
  }, []);

  const rellenarConGoogle = async () => {
    const supabase = crearClienteNavegador();
    if (!supabase) {
      setError('El sitio aún no está conectado a la base de datos.');
      return;
    }
    const { error: errorOauth } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
          window.location.pathname
        )}`,
      },
    });
    if (errorOauth) {
      setError('No pudimos conectar con Google. Completa los datos manualmente.');
    }
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    const resultado = await registrarCliente({ nombre, email, whatsapp, pais, ciudad });
    setEnviando(false);
    if (!resultado.ok || !resultado.cliente) {
      setError(resultado.error ?? 'No pudimos guardar tus datos. Intenta de nuevo.');
      return;
    }
    guardarClienteLocal(resultado.cliente);
    onListo(resultado.cliente);
  };

  const prefijo = pais === 'BO' ? '+591' : '+54';

  return (
    <form onSubmit={enviar} className="space-y-3">
      <p className="text-sm text-tinta/70">
        Déjanos tus datos una sola vez y en tus próximos pedidos irás directo a
        WhatsApp. 😉
      </p>
      {!conGoogle && (
        <button
          type="button"
          onClick={() => void rellenarConGoogle()}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-tinta/15 bg-white py-2.5 font-bold hover:border-celeste"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18A10.97 10.97 0 0 0 1 12c0 1.77.42 3.45 1.18 4.94l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
          </svg>
          Rellenar con Google
        </button>
      )}
      {conGoogle && (
        <p className="rounded-xl bg-verde/10 px-3 py-2 text-sm font-semibold text-verde">
          ✅ Datos de Google cargados: completa tu WhatsApp y ciudad.
        </p>
      )}
      <div>
        <label className="mb-1 block text-sm font-bold" htmlFor="reg-nombre">Nombre</label>
        <input
          id="reg-nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          autoComplete="name"
          className="w-full rounded-xl border border-tinta/15 px-3 py-2.5"
          placeholder="Tu nombre"
        />
      </div>
      <div>
        <span className="mb-1 block text-sm font-bold">País</span>
        <div className="flex gap-2">
          {(['BO', 'AR'] as Pais[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPais(p)}
              aria-pressed={pais === p}
              className={`flex-1 rounded-xl border px-3 py-2.5 font-bold ${
                pais === p
                  ? 'border-celeste bg-celeste/10 text-celeste'
                  : 'border-tinta/15 text-tinta/70'
              }`}
            >
              {p === 'BO' ? '🇧🇴 Bolivia' : '🇦🇷 Argentina'}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-bold" htmlFor="reg-wa">WhatsApp</label>
        <div className="flex">
          <span className="flex items-center rounded-l-xl border border-r-0 border-tinta/15 bg-tinta/5 px-3 text-sm font-bold">
            {prefijo}
          </span>
          <input
            id="reg-wa"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            required
            inputMode="tel"
            autoComplete="tel"
            className="w-full rounded-r-xl border border-tinta/15 px-3 py-2.5"
            placeholder={pais === 'BO' ? '74508045' : '3874001122'}
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-bold" htmlFor="reg-email">Correo electrónico</label>
        <input
          id="reg-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full rounded-xl border border-tinta/15 px-3 py-2.5"
          placeholder="tucorreo@ejemplo.com"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-bold" htmlFor="reg-ciudad">Ciudad</label>
        <input
          id="reg-ciudad"
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
          required
          className="w-full rounded-xl border border-tinta/15 px-3 py-2.5"
          placeholder={pais === 'BO' ? 'Bermejo, Tarija, Yacuiba…' : 'Orán, Tartagal, Salta…'}
        />
      </div>
      {error && <p className="text-sm font-semibold text-coral">{error}</p>}
      <button
        type="submit"
        disabled={enviando}
        className="w-full rounded-xl bg-whatsapp py-3 font-bold text-white disabled:opacity-60"
      >
        {enviando ? 'Guardando…' : 'Continuar a WhatsApp'}
      </button>
    </form>
  );
}
