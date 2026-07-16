'use client';

import { useState } from 'react';
import { registrarCliente } from '@/app/acciones/cliente';
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
