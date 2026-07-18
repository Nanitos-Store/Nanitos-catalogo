import type { Modalidad, Pais } from './tipos';

/** Ventas: pedidos y consultas del catálogo (atiende Valeria). */
export const NUMERO_WHATSAPP =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '59162404153';

/** Línea exclusiva para clientes Premium. */
export const NUMERO_WHATSAPP_PREMIUM =
  process.env.NEXT_PUBLIC_WHATSAPP_PREMIUM ?? '59174508045';

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

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jugueteriananitos.shop';

function textoCantidad(modalidad: Modalidad, cantidad: number) {
  if (modalidad === 'ambas') return 'consultar docena y caja';
  const unidad = modalidad === 'caja' ? 'caja' : 'docena';
  return cantidad === 1 ? `1 ${unidad}` : `${cantidad} ${unidad}s`;
}

/**
 * Mensaje del pedido por carrito. Cada línea lleva la URL directa a la foto
 * estática alojada en el sitio, para que el admin vea el producto sin abrir
 * la base de datos.
 */
export function mensajePedidoCarrito(opciones: {
  nombre: string;
  ciudad: string;
  pais: Pais;
  telefono: string;
  items: { nombre: string; slug: string; codigo: string | null; modalidad: Modalidad; cantidad: number }[];
}) {
  const { nombre, ciudad, pais, telefono, items } = opciones;
  const lineas = items
    .map((i) => {
      const codigo = i.codigo ?? i.nombre;
      const foto = `${SITE_URL}/productos/${i.slug}.webp`;
      return `- ${codigo} - ${textoCantidad(i.modalidad, i.cantidad)} - (Foto: ${foto})`;
    })
    .join('\n');
  return (
    `Hola, mi nombre es ${nombre}, soy de ${ciudad}, ${NOMBRE_PAIS[pais]}, mi número de contacto es +${telefono}.\n` +
    `\n` +
    `Quisiera comprar estos productos:\n` +
    `${lineas}\n` +
    `\n` +
    `Quedo atento a su respuesta para coordinar el pago y envío.`
  );
}

export function mensajeConsulta() {
  return 'Hola 👋 Tengo una consulta sobre un producto. [web-consulta]';
}

export function enlaceWhatsApp(mensaje: string) {
  return `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
}

export function enlaceWhatsAppPremium(mensaje: string) {
  return `https://wa.me/${NUMERO_WHATSAPP_PREMIUM}?text=${encodeURIComponent(mensaje)}`;
}
