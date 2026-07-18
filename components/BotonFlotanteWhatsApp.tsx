'use client';

import { useState } from 'react';
import FormularioRegistro, { leerClienteLocal } from './FormularioRegistro';
import { enlaceWhatsApp, mensajeConsulta } from '@/lib/whatsapp';
import { trackEvento } from '@/lib/meta';
import type { Pais } from '@/lib/tipos';

const GATE_CONSULTA = process.env.NEXT_PUBLIC_GATE_CONSULTA === 'true';

/** Botón verde flotante de consulta directa (no tapa los CTA). */
export default function BotonFlotanteWhatsApp({ pais }: { pais: Pais | null }) {
  const [abierto, setAbierto] = useState(false);
  const [pideRegistro, setPideRegistro] = useState(false);

  const abrirWhatsApp = () => {
    trackEvento('Lead', { content_name: 'Consulta directa', tipo: 'web-consulta' });
    setAbierto(false);
    setPideRegistro(false);
    window.open(enlaceWhatsApp(mensajeConsulta()), '_blank', 'noopener');
  };

  const clicAbrir = () => {
    if (GATE_CONSULTA && !leerClienteLocal()) {
      setPideRegistro(true);
      return;
    }
    abrirWhatsApp();
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
      <a
        href="/#ubicacion"
        aria-label="Ver nuestra ubicación en el mapa"
        title="Cómo llegar a la tienda"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-celeste text-xl text-white shadow-xl transition hover:scale-105"
      >
        📍
      </a>
      {abierto && (
        <div className="w-72 rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-tinta/10">
          {!pideRegistro ? (
            <>
              <p className="text-sm">
                ¿Tienes una duda? Toma una captura del producto y envíanosla por
                WhatsApp para ayudarte más rápido 📲
              </p>
              <button
                onClick={clicAbrir}
                className="mt-3 w-full rounded-xl bg-whatsapp py-2.5 font-bold text-white"
              >
                Abrir WhatsApp
              </button>
            </>
          ) : (
            <FormularioRegistro paisInicial={pais ?? 'BO'} onListo={abrirWhatsApp} />
          )}
        </div>
      )}
      <button
        onClick={() => {
          setAbierto((v) => !v);
          setPideRegistro(false);
        }}
        aria-label="Consultar por WhatsApp"
        aria-expanded={abierto}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-xl transition hover:scale-105"
      >
        <svg viewBox="0 0 32 32" fill="currentColor" className="h-8 w-8" aria-hidden="true">
          <path d="M16 3C9.373 3 4 8.373 4 15c0 2.25.62 4.36 1.7 6.16L4 29l8.06-1.64A11.94 11.94 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 21.8c-1.8 0-3.5-.48-4.97-1.32l-.36-.2-4.78.97.99-4.66-.23-.38A9.77 9.77 0 0 1 6.2 15c0-5.4 4.4-9.8 9.8-9.8s9.8 4.4 9.8 9.8-4.4 9.8-9.8 9.8zm5.38-7.34c-.3-.15-1.74-.86-2.01-.96-.27-.1-.47-.15-.66.15-.2.3-.76.96-.93 1.15-.17.2-.34.22-.64.08-.3-.15-1.24-.46-2.37-1.46-.88-.78-1.47-1.75-1.64-2.04-.17-.3-.02-.46.13-.6.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.91-2.19-.24-.57-.48-.5-.66-.5h-.56c-.2 0-.51.07-.78.37-.27.3-1.02 1-1.02 2.44s1.05 2.83 1.2 3.02c.15.2 2.06 3.15 5 4.42.7.3 1.24.48 1.67.62.7.22 1.34.19 1.84.11.56-.08 1.74-.71 1.98-1.4.25-.68.25-1.27.17-1.4-.07-.12-.27-.2-.57-.34z" />
        </svg>
      </button>
    </div>
  );
}
