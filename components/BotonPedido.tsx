'use client';

import { useState } from 'react';
import FormularioRegistro, { leerClienteLocal } from './FormularioRegistro';
import { registrarPedido } from '@/app/acciones/cliente';
import { enlaceWhatsApp, mensajePedido } from '@/lib/whatsapp';
import { leerUtms, trackEvento } from '@/lib/meta';
import type { ClienteLocal, Modalidad, Pais } from '@/lib/tipos';

const OPCIONES_MODALIDAD: { valor: Modalidad; texto: string }[] = [
  { valor: 'docena', texto: 'Docena' },
  { valor: 'caja', texto: 'Caja' },
  { valor: 'ambas', texto: 'Quiero conocer ambas' },
];

function identificadorPedido() {
  const utms = leerUtms();
  if (utms.utm_campaign) {
    const corto = utms.utm_campaign.replace(/[^a-z0-9]/gi, '').slice(0, 8).toLowerCase();
    if (corto) return `web-camp-${corto}`;
  }
  return 'web-catalogo';
}

/**
 * CTA "Hacer pedido": abre bottom sheet con selector de modalidad; pide el
 * registro único solo la primera vez y luego va directo a WhatsApp.
 */
export default function BotonPedido({
  productoId,
  nombre,
  codigo,
  pais,
  categoria,
  modalidadInicial,
  compacto = false,
}: {
  productoId: string;
  nombre: string;
  codigo: string | null;
  pais: Pais | null;
  categoria?: string | null;
  modalidadInicial?: Modalidad;
  compacto?: boolean;
}) {
  const [abierto, setAbierto] = useState(false);
  const [modalidad, setModalidad] = useState<Modalidad | null>(modalidadInicial ?? null);
  const [cliente, setCliente] = useState<ClienteLocal | null>(null);
  const [pideRegistro, setPideRegistro] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const abrir = () => {
    setCliente(leerClienteLocal());
    setPideRegistro(false);
    setAbierto(true);
  };

  const enviarPedido = async (clienteListo: ClienteLocal, modalidadElegida: Modalidad) => {
    setEnviando(true);
    const mensaje = mensajePedido({
      nombre: clienteListo.nombre,
      ciudad: clienteListo.ciudad,
      pais: clienteListo.pais,
      producto: nombre,
      codigo,
      modalidad: modalidadElegida,
      identificador: identificadorPedido(),
    });
    trackEvento('Lead', {
      content_name: nombre,
      content_ids: codigo ? [codigo] : undefined,
      content_category: categoria ?? undefined,
      modalidad: modalidadElegida,
      pais: clienteListo.pais,
    });
    try {
      await registrarPedido({
        clienteId: clienteListo.id,
        productoId,
        modalidad: modalidadElegida,
        mensaje,
        utm: leerUtms(),
      });
    } catch {
      // el log nunca debe frenar el pedido
    }
    setEnviando(false);
    setAbierto(false);
    window.open(enlaceWhatsApp(mensaje), '_blank', 'noopener');
  };

  const confirmarModalidad = (m: Modalidad) => {
    setModalidad(m);
    if (cliente) {
      void enviarPedido(cliente, m);
    } else {
      setPideRegistro(true);
    }
  };

  return (
    <>
      <button
        onClick={abrir}
        className={`boton w-full rounded-xl bg-whatsapp font-bold text-white shadow-md transition hover:brightness-105 ${
          compacto ? 'px-3 py-2 text-sm' : 'px-4 py-3 text-base'
        }`}
      >
        Hacer pedido
      </button>

      {abierto && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-tinta/50 sm:items-center"
          onClick={() => !enviando && setAbierto(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Hacer pedido de ${nombre}`}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold leading-tight">{nombre}</h3>
                {codigo && <p className="text-sm text-tinta/60">Cód. {codigo}</p>}
              </div>
              <button
                onClick={() => setAbierto(false)}
                aria-label="Cerrar"
                className="rounded-full bg-tinta/5 px-3 py-1.5 font-bold"
              >
                ✕
              </button>
            </div>

            {!pideRegistro && (
              <div className="space-y-2">
                <p className="text-sm font-bold">¿Cómo lo quieres?</p>
                {OPCIONES_MODALIDAD.map((op) => (
                  <button
                    key={op.valor}
                    disabled={enviando}
                    onClick={() => confirmarModalidad(op.valor)}
                    className={`w-full rounded-xl border px-4 py-3 text-left font-semibold transition disabled:opacity-60 ${
                      modalidad === op.valor
                        ? 'border-celeste bg-celeste/10'
                        : 'border-tinta/15 hover:border-celeste'
                    }`}
                  >
                    {op.texto}
                  </button>
                ))}
                {enviando && (
                  <p className="text-center text-sm text-tinta/60">Abriendo WhatsApp…</p>
                )}
              </div>
            )}

            {pideRegistro && modalidad && (
              <FormularioRegistro
                paisInicial={pais ?? 'BO'}
                onListo={(nuevoCliente) => {
                  setCliente(nuevoCliente);
                  void enviarPedido(nuevoCliente, modalidad);
                }}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
