'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import FormularioRegistro, { leerClienteLocal } from './FormularioRegistro';
import { actualizarPremium } from '@/app/acciones/cliente';
import { trackEvento } from '@/lib/meta';
import type { ClienteLocal, Pais } from '@/lib/tipos';

/**
 * Formulario Premium: exige el registro único primero y luego pide los datos
 * del emprendimiento (tienda, fanpage, rubro).
 */
export default function FormularioPremium({ pais }: { pais: Pais | null }) {
  const [cliente, setCliente] = useState<ClienteLocal | null>(null);
  const [cargado, setCargado] = useState(false);
  const [nombreTienda, setNombreTienda] = useState('');
  const [fanpage, setFanpage] = useState('');
  const [rubro, setRubro] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    setCliente(leerClienteLocal());
    setCargado(true);
  }, []);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliente) return;
    setEnviando(true);
    setError(null);
    const r = await actualizarPremium({
      clienteId: cliente.id,
      nombreTienda,
      fanpage,
      rubro,
    });
    setEnviando(false);
    if (!r.ok) {
      setError(r.error ?? 'No pudimos guardar tus datos. Intenta de nuevo.');
      return;
    }
    trackEvento('Lead', { content_name: 'Cuenta Premium', tipo: 'premium' });
    setListo(true);
  };

  if (!cargado) return null;

  if (listo) {
    return (
      <div className="py-6 text-center">
        <p className="text-5xl">📝</p>
        <h2 className="mt-3 text-xl font-bold">¡Recibimos tu solicitud!</h2>
        <p className="mt-2 text-tinta/70">
          Guardamos los datos de tu emprendimiento,{' '}
          <strong>{cliente?.nombre}</strong>. En breve te contactaremos para
          activar tu cuenta Premium única, con la que entras a la sección de
          venta anticipada y lista de deseos.
        </p>
        <Link
          href="/catalogo"
          className="mt-4 inline-block rounded-full bg-celeste px-6 py-3 font-bold text-white"
        >
          Seguir explorando el catálogo
        </Link>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div>
        <h2 className="mb-3 text-lg font-bold">Primero, tus datos de contacto</h2>
        <FormularioRegistro
          paisInicial={pais ?? 'BO'}
          onListo={(nuevoCliente) => setCliente(nuevoCliente)}
        />
      </div>
    );
  }

  const campo = 'w-full rounded-xl border border-tinta/15 px-4 py-3';

  return (
    <form onSubmit={enviar} className="space-y-3">
      <h2 className="text-lg font-bold">Cuéntanos de tu emprendimiento</h2>
      <p className="text-sm text-tinta/70">
        Hola {cliente.nombre} 👋 — solo faltan estos datos:
      </p>
      <div>
        <label className="mb-1 block text-sm font-bold" htmlFor="prem-tienda">
          Nombre de tu tienda o emprendimiento
        </label>
        <input
          id="prem-tienda"
          value={nombreTienda}
          onChange={(e) => setNombreTienda(e.target.value)}
          required
          className={campo}
          placeholder="Ej. Juguetería Estrella"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-bold" htmlFor="prem-fanpage">
          Fanpage o red social (opcional)
        </label>
        <input
          id="prem-fanpage"
          value={fanpage}
          onChange={(e) => setFanpage(e.target.value)}
          className={campo}
          placeholder="Facebook, Instagram o TikTok de tu tienda"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-bold" htmlFor="prem-rubro">
          ¿Qué vendes principalmente? (opcional)
        </label>
        <input
          id="prem-rubro"
          value={rubro}
          onChange={(e) => setRubro(e.target.value)}
          className={campo}
          placeholder="Juguetes, ropa, regalos, variedades…"
        />
      </div>
      {error && <p className="text-sm font-semibold text-coral">{error}</p>}
      <button
        type="submit"
        disabled={enviando}
        className="w-full rounded-xl bg-naranja py-3 font-bold text-white disabled:opacity-60"
      >
        {enviando ? 'Guardando…' : 'Activar mi cuenta Premium ⭐'}
      </button>
    </form>
  );
}
