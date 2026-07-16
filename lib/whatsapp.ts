import type { Modalidad, Pais } from './tipos';

export const NUMERO_WHATSAPP =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '59174508045';

const NOMBRE_PAIS: Record<Pais, string> = { BO: 'Bolivia', AR: 'Argentina' };

const TEXTO_MODALIDAD: Record<Modalidad, string> = {
  docena: 'por docena',
  caja: 'por caja',
  ambas: 'quiero conocer ambas',
};

export function mensajePedido(opciones: {
  nombre: string;
  ciudad: string;
  pais: Pais;
  producto: string;
  codigo: string | null;
  modalidad: Modalidad;
  identificador?: string;
}) {
  const { nombre, ciudad, pais, producto, codigo, modalidad } = opciones;
  const id = opciones.identificador ?? 'web-catalogo';
  const cod = codigo ? ` (Cód. ${codigo})` : '';
  return (
    `Hola 👋 Soy ${nombre} de ${ciudad}, ${NOMBRE_PAIS[pais]}.\n` +
    `Me interesa: ${producto}${cod}\n` +
    `Modalidad: ${TEXTO_MODALIDAD[modalidad]}\n` +
    `Vi el producto en la web de Ñañitos. [${id}]`
  );
}

export function mensajePedidoCarrito(opciones: {
  nombre: string;
  ciudad: string;
  pais: Pais;
  items: { nombre: string; codigo: string | null; modalidad: Modalidad; cantidad: number }[];
  identificador?: string;
}) {
  const { nombre, ciudad, pais, items } = opciones;
  const id = opciones.identificador ?? 'web-catalogo';
  const lineas = items
    .map((i) => {
      const cod = i.codigo ? ` (Cód. ${i.codigo})` : '';
      const cant = i.modalidad === 'ambas' ? '' : ` ×${i.cantidad}`;
      return `• ${i.nombre}${cod} — ${TEXTO_MODALIDAD[i.modalidad]}${cant}`;
    })
    .join('\n');
  return (
    `Hola 👋 Soy ${nombre} de ${ciudad}, ${NOMBRE_PAIS[pais]}.\n` +
    `Quiero hacer este pedido:\n${lineas}\n` +
    `Vi los productos en la web de Ñañitos. [${id}]`
  );
}

export function mensajeConsulta() {
  return 'Hola 👋 Tengo una consulta sobre un producto. [web-consulta]';
}

export function enlaceWhatsApp(mensaje: string) {
  return `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
}
