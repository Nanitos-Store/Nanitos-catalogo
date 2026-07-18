'use client';

import { useState } from 'react';
import { registrarCliente } from '@/app/acciones/cliente';
import { DIVISIONES, ETIQUETA_DIVISION } from '@/lib/geografia';
import { STORAGE_CLIENTE } from '@/lib/pais';
import type { ClienteLocal, Pais } from '@/lib/tipos';

export function leerClienteLocal(): ClienteLocal | null {
  try {
    const crudo = localStorage.getItem(STORAGE_CLIENTE);
    if (!crudo) return null;
    const cliente = JSON.parse(crudo) as ClienteLocal;
    // Los registros del formato anterior (sin teléfono) deben re-registrarse
    return cliente?.id && cliente?.telefono ? cliente : null;
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
 * Registro único obligatorio antes de enviar el pedido por WhatsApp:
 * nombre completo, teléfono, país (AR/BO) y departamento/provincia dinámico.
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
  const [telefono, setTelefono] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const cambiarPais = (nuevo: Pais) => {
    setPais(nuevo);
    setDepartamento('');
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    const resultado = await registrarCliente({ nombre, telefono, pais, departamento });
    setEnviando(false);
    if (!resultado.ok || !resultado.cliente) {
      setError(resultado.error ?? 'No pudimos guardar tus datos. Intenta de nuevo.');
      return;
    }
    guardarClienteLocal(resultado.cliente);
    onListo(resultado.cliente);
  };

  const prefijo = pais === 'BO' ? '+591' : '+54';
  const campo = 'w-full rounded-xl border border-tinta/15 px-3 py-2.5';

  return (
    <form onSubmit={enviar} className="space-y-3">
      <p className="text-sm text-tinta/70">
        Completa tus datos una sola vez: en tus próximos pedidos irás directo a
        WhatsApp. 😉
      </p>

      <div>
        <label className="mb-1 block text-sm font-bold" htmlFor="reg-nombre">
          Nombre completo
        </label>
        <input
          id="reg-nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          autoComplete="name"
          className={campo}
          placeholder="Tu nombre y apellido"
        />
      </div>

      <div>
        <span className="mb-1 block text-sm font-bold">País</span>
        <div className="flex gap-2">
          {(['BO', 'AR'] as Pais[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => cambiarPais(p)}
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
        <label className="mb-1 block text-sm font-bold" htmlFor="reg-division">
          {ETIQUETA_DIVISION[pais]}
        </label>
        <select
          id="reg-division"
          value={departamento}
          onChange={(e) => setDepartamento(e.target.value)}
          required
          className={`${campo} bg-white`}
        >
          <option value="" disabled>
            Elige tu {ETIQUETA_DIVISION[pais].toLowerCase()}…
          </option>
          {DIVISIONES[pais].map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold" htmlFor="reg-telefono">
          Número de teléfono / WhatsApp
        </label>
        <div className="flex">
          <span className="flex items-center rounded-l-xl border border-r-0 border-tinta/15 bg-tinta/5 px-3 text-sm font-bold">
            {prefijo}
          </span>
          <input
            id="reg-telefono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
            inputMode="tel"
            autoComplete="tel"
            className="w-full rounded-r-xl border border-tinta/15 px-3 py-2.5"
            placeholder={pais === 'BO' ? '62404153' : '3874001122'}
          />
        </div>
        <p className="mt-1 text-xs text-tinta/50">
          Con este número registramos tu pedido y te contactamos si hace falta.
        </p>
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
