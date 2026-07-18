export type Pais = 'BO' | 'AR';

export type Modalidad = 'docena' | 'caja' | 'ambas';

export interface Categoria {
  id: string;
  slug: string;
  nombre: string;
  icono: string | null;
  orden: number;
}

export interface ProductoImagen {
  id: string;
  producto_id: string;
  url: string;
  alt: string | null;
  orden: number;
  es_principal: boolean;
  blur_data_url: string | null;
}

export interface Producto {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string | null;
  categoria_id: string | null;
  personajes: string[];
  temporada: string[];
  codigo: string | null;
  vende_por_docena: boolean;
  vende_por_caja: boolean;
  precio_docena: number | null;
  precio_caja: number | null;
  unidad_precio: 'por_unidad' | 'por_paquete' | 'por_docena';
  moneda: 'USD' | 'BOB';
  unidades_por_caja: number | null;
  mostrar_precio: boolean;
  precio_verificado: boolean;
  en_oferta: boolean;
  etiqueta_oferta: string | null;
  disponible: boolean;
  destacado: boolean;
  orden: number;
  stock_cajas: number | null;
  /** Porcentaje entero de descuento visible al público (1-90). */
  descuento_pct: number | null;
  /** Fecha en que pasa a ser público; futura = solo sección Premium. */
  fecha_publica: string | null;
  categorias?: Categoria | null;
  producto_imagenes?: ProductoImagen[];
}

export interface CuentaPremium {
  id: string;
  usuario: string;
  nombre: string;
  cliente_id: string | null;
  activo: boolean;
  created_at: string;
  clientes?: Cliente | null;
}

export interface DeseoPremium {
  id: string;
  cuenta_premium_id: string;
  producto: string;
  detalle: string | null;
  created_at: string;
  cuentas_premium?: Pick<CuentaPremium, 'usuario' | 'nombre'> | null;
}

export interface Campana {
  id: string;
  nombre: string;
  slug: string;
  titulo: string;
  subtitulo: string | null;
  pais_objetivo: 'AR' | 'BO' | 'ambos';
  fecha_inicio: string | null;
  fecha_fin: string | null;
  activa: boolean;
  imagen_url: string | null;
  producto_ids: string[];
}

export interface Cliente {
  id: string;
  nombre: string;
  email: string | null;
  whatsapp: string;
  pais: Pais;
  ciudad: string | null;
  origen: string;
  es_premium: boolean;
  nombre_tienda: string | null;
  fanpage: string | null;
  rubro: string | null;
  created_at: string;
}

export interface Pedido {
  id: string;
  cliente_id: string | null;
  producto_id: string | null;
  modalidad: Modalidad;
  cantidad: number;
  grupo_id: string | null;
  mensaje_enviado: string | null;
  utm: Record<string, string> | null;
  created_at: string;
  clientes?: Cliente | null;
  productos?: Producto | null;
}

/** Ítem del carrito de pedido (persistido en localStorage). */
export interface ItemCarrito {
  productoId: string;
  slug: string;
  nombre: string;
  codigo: string | null;
  imagen: string | null;
  modalidad: Modalidad;
  cantidad: number;
}

export interface Perfil {
  id: string;
  nombre: string | null;
  rol: 'admin' | 'superadmin';
  activo: boolean;
  created_at: string;
}

export interface ClienteLocal {
  id: string;
  nombre: string;
  /** Departamento (BO) o provincia (AR). */
  ciudad: string;
  pais: Pais;
  /** Número tal como lo escribió el cliente, con prefijo normalizado. */
  telefono: string;
}
