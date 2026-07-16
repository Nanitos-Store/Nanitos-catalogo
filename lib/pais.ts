import type { Pais } from './tipos';

export const COOKIE_PAIS = 'nanitos_pais';
export const COOKIE_CLIENTE = 'nanitos_cliente_id';
export const STORAGE_CLIENTE = 'nanitos_cliente';

export const COPY_LOGISTICA: Record<Pais, string> = {
  BO: 'Estamos en Bermejo y realizamos envíos a nivel nacional. Coordinamos el despacho por la empresa de transporte de tu preferencia.',
  AR: 'Nuestra tienda está en Bermejo, Bolivia, muy cerca de la frontera. No realizamos envíos directos a Argentina: puedes retirar tu pedido en Bermejo o coordinarlo con tu pasero o comisionista de confianza. Te ayudamos con toda la información para que el proceso sea simple.',
};

export function esPais(valor: string | undefined | null): valor is Pais {
  return valor === 'BO' || valor === 'AR';
}
