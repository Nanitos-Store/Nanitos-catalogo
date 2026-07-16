'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useCarrito } from './CarritoProvider';
import FormularioRegistro, { leerClienteLocal } from './FormularioRegistro';
import { registrarPedidoGrupo } from '@/app/acciones/cliente';
import { enlaceWhatsApp, mensajePedidoCarrito } from '@/lib/whatsapp';
import { leerUtms, trackEvento } from '@/lib/meta';
import type { ClienteLocal, Modalidad, Pais } from '@/lib/tipos';

const OPCIONES_MODALIDAD: { valor: Modalidad; texto: string }[] = [
  { valor: 'docena', texto: 'Docena' },
  { valor: 'caja', texto: 'Caja' },
  { valor: 'ambas', texto: 'Conocer ambas' },
];

function identificadorPedido() {
  const utms = leerUtms();
  if (utms.utm_campaign) {
    const corto = utms.utm_campaign.replace(/[^a-z0-9]/gi, '').slice(0, 8).toLowerCase();
    if (corto) return `web-camp-${corto}`;
  }
  return 'web-catalogo';
}

/** Hoja del pedido: todos los productos agregados, un solo WhatsApp. */
export default function HojaCarrito({ pais }: { pais: Pais | null }) {
  const carrito = useCarrito();
  const [pideRegistro, setPideRegistro] = useState(false);
  const [enviando, setEnviando] = useState(false);

  if (!carrito.abierto) return null;

  const enviarPedido = async (cliente: ClienteLocal) => {
    setEnviando(true);
    const mensaje = mensajePedidoCarrito({
      nombre: cliente.nombre,
      ciudad: cliente.ciudad,
      pais: cliente.pais,
      items: carrito.items,
      identificador: identificadorPedido(),
    });
    trackEvento('Lead', {
      content_type: 'product_group',
      content_ids: carrito.items.map((i) => i.codigo ?? i.slug),
      contents: carrito.items.map((i) => ({
        id: i.codigo ?? i.slug,
        quantity: i.cantidad,
        modalidad: i.modalidad,
      })),
      num_items: carrito.items.length,
      pais: cliente.pais,
    });
    try {
      await registrarPedidoGrupo({
        clienteId: cliente.id,
        items: carrito.items.map((i) => ({
          productoId: i.productoId,
          modalidad: i.modalidad,
          cantidad: i.cantidad,
        })),
        mensaje,
        utm: leerUtms(),
      });
    } catch {
      // el log nunca debe frenar el pedido
    }
    setEnviando(false);
    setPideRegistro(false);
    carrito.cerrar();
    carrito.vaciar();
    window.open(enlaceWhatsApp(mensaje), '_blank', 'noopener');
  };

  const clicEnviar = () => {
    const cliente = leerClienteLocal();
    if (cliente) {
      void enviarPedido(cliente);
    } else {
      setPideRegistro(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-tinta/50 sm:items-center"
      onClick={() => !enviando && carrito.cerrar()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mi pedido"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl"
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-bold">🛒 Mi pedido</h3>
          <button
            onClick={() => carrito.cerrar()}
            aria-label="Cerrar"
            className="rounded-full bg-tinta/5 px-3 py-1.5 font-bold"
          >
            ✕
          </button>
        </div>

        {carrito.items.length === 0 ? (
          <p className="py-8 text-center text-tinta/60">
            Tu pedido está vacío. Agrega productos desde el catálogo. 🧸
          </p>
        ) : (
          <>
            <ul className="space-y-3">
              {carrito.items.map((item) => (
                <li
                  key={item.productoId}
                  className="rounded-2xl bg-crema p-3 ring-1 ring-tinta/5"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white">
                      {item.imagen && (
                        <Image
                          src={item.imagen}
                          alt={item.nombre}
                          fill
                          sizes="56px"
                          className="object-contain"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold leading-tight">{item.nombre}</p>
                      {item.codigo && (
                        <p className="text-xs text-tinta/50">Cód. {item.codigo}</p>
                      )}
                    </div>
                    <button
                      onClick={() => carrito.quitar(item.productoId)}
                      aria-label={`Quitar ${item.nombre}`}
                      className="rounded-full bg-coral/10 px-2.5 py-1 text-sm font-bold text-coral"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {OPCIONES_MODALIDAD.map((op) => (
                      <button
                        key={op.valor}
                        onClick={() => carrito.cambiarModalidad(item.productoId, op.valor)}
                        aria-pressed={item.modalidad === op.valor}
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                          item.modalidad === op.valor
                            ? 'bg-celeste text-white'
                            : 'bg-white text-tinta/60 ring-1 ring-tinta/10'
                        }`}
                      >
                        {op.texto}
                      </button>
                    ))}
                    {item.modalidad !== 'ambas' && (
                      <div className="ml-auto flex items-center gap-1">
                        <button
                          onClick={() =>
                            carrito.cambiarCantidad(item.productoId, item.cantidad - 1)
                          }
                          aria-label="Menos"
                          className="h-8 w-8 rounded-full bg-white font-bold ring-1 ring-tinta/10"
                        >
                          −
                        </button>
                        <span className="w-7 text-center text-sm font-bold">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() =>
                            carrito.cambiarCantidad(item.productoId, item.cantidad + 1)
                          }
                          aria-label="Más"
                          className="h-8 w-8 rounded-full bg-white font-bold ring-1 ring-tinta/10"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {!pideRegistro ? (
              <button
                onClick={clicEnviar}
                disabled={enviando}
                className="mt-4 w-full rounded-xl bg-whatsapp py-3.5 font-bold text-white disabled:opacity-60"
              >
                {enviando ? 'Abriendo WhatsApp…' : 'Enviar pedido por WhatsApp'}
              </button>
            ) : (
              <div className="mt-4 border-t border-tinta/10 pt-4">
                <FormularioRegistro
                  paisInicial={pais ?? 'BO'}
                  onListo={(cliente) => void enviarPedido(cliente)}
                />
              </div>
            )}
            <p className="mt-2 text-center text-xs text-tinta/50">
              Enviamos el detalle a Valeria y coordinamos contigo por WhatsApp.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
