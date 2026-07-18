'use server';

import { revalidatePath } from 'next/cache';
import { crearClienteServidor } from '@/lib/supabase/server';
import { crearClienteAdmin } from '@/lib/supabase/admin';
import { sesionAdminActual } from '@/lib/admin-sesion';

interface Resultado {
  ok: boolean;
  error?: string;
}

/**
 * Devuelve un cliente de BD autorizado: la sesión maestra del footer usa el
 * service role; una sesión de Supabase Auth usa su propio cliente (RLS
 * aplica es_admin).
 */
async function clienteAutenticado() {
  if (sesionAdminActual()) {
    return crearClienteAdmin();
  }
  const supabase = crearClienteServidor();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ? supabase : null;
}

/**
 * Regeneración estática bajo demanda: al guardar un cambio en el panel se
 * revalida todo el árbol público (home, catálogo, productos, campañas) para
 * que el HTML estático se actualice de inmediato en Vercel.
 */
function revalidarPublico() {
  revalidatePath('/', 'layout');
  revalidatePath('/catalogo');
  revalidatePath('/producto/[slug]', 'page');
  revalidatePath('/campana/[slug]', 'page');
}

/** Edición rápida: precio + verificado en UNA sola acción. */
export async function guardarPrecioVerificado(datos: {
  productoId: string;
  precioDocena: number | null;
  precioCaja: number | null;
  mostrarPrecio: boolean;
}): Promise<Resultado> {
  const supabase = await clienteAutenticado();
  if (!supabase) return { ok: false, error: 'Sesión expirada.' };
  const { error } = await supabase
    .from('productos')
    .update({
      precio_docena: datos.precioDocena,
      precio_caja: datos.precioCaja,
      mostrar_precio: datos.mostrarPrecio,
      precio_verificado: true,
    })
    .eq('id', datos.productoId);
  if (error) return { ok: false, error: 'No se pudo guardar.' };
  revalidarPublico();
  return { ok: true };
}

export async function alternarCampoProducto(
  productoId: string,
  campo: 'disponible' | 'en_oferta' | 'destacado' | 'mostrar_precio',
  valor: boolean
): Promise<Resultado> {
  const supabase = await clienteAutenticado();
  if (!supabase) return { ok: false, error: 'Sesión expirada.' };
  const { error } = await supabase
    .from('productos')
    .update({ [campo]: valor })
    .eq('id', productoId);
  if (error) return { ok: false, error: 'No se pudo guardar.' };
  revalidarPublico();
  return { ok: true };
}

export interface DatosProducto {
  nombre: string;
  slug: string;
  descripcion: string;
  categoria_id: string | null;
  codigo: string;
  personajes: string[];
  temporada: string[];
  precio_docena: number | null;
  precio_caja: number | null;
  unidades_por_caja: number | null;
  moneda: 'USD' | 'BOB';
  vende_por_docena: boolean;
  vende_por_caja: boolean;
  mostrar_precio: boolean;
  en_oferta: boolean;
  etiqueta_oferta: string | null;
  descuento_pct: number | null;
  fecha_publica: string | null;
  disponible: boolean;
  destacado: boolean;
  stock_cajas: number | null;
}

export async function guardarProducto(
  productoId: string | null,
  datos: DatosProducto,
  imagenes: { url: string; blur?: string | null }[]
): Promise<Resultado & { id?: string }> {
  const supabase = await clienteAutenticado();
  if (!supabase) return { ok: false, error: 'Sesión expirada.' };
  if (!datos.nombre.trim() || !datos.slug.trim()) {
    return { ok: false, error: 'Nombre y slug son obligatorios.' };
  }

  let id = productoId;
  if (id) {
    const { error } = await supabase.from('productos').update(datos).eq('id', id);
    if (error) return { ok: false, error: 'No se pudo guardar el producto.' };
  } else {
    const { data, error } = await supabase
      .from('productos')
      .insert({ ...datos, precio_verificado: false })
      .select('id')
      .single();
    if (error || !data) return { ok: false, error: 'No se pudo crear el producto (¿slug repetido?).' };
    id = data.id;
  }

  if (imagenes.length > 0 && id) {
    const filas = imagenes.map((img, i) => ({
      producto_id: id,
      url: img.url,
      alt: `${datos.nombre} — venta por docena y caja`,
      orden: i,
      es_principal: i === 0,
      blur_data_url: img.blur ?? null,
    }));
    await supabase.from('producto_imagenes').delete().eq('producto_id', id);
    const { error } = await supabase.from('producto_imagenes').insert(filas);
    if (error) return { ok: false, error: 'Producto guardado, pero falló el guardado de fotos.' };
  }

  revalidarPublico();
  return { ok: true, id: id ?? undefined };
}

export async function eliminarProducto(productoId: string): Promise<Resultado> {
  const supabase = await clienteAutenticado();
  if (!supabase) return { ok: false, error: 'Sesión expirada.' };
  const { error } = await supabase.from('productos').delete().eq('id', productoId);
  if (error) return { ok: false, error: 'No se pudo eliminar.' };
  revalidarPublico();
  return { ok: true };
}

export interface DatosCampana {
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

export async function guardarCampana(
  campanaId: string | null,
  datos: DatosCampana
): Promise<Resultado> {
  const supabase = await clienteAutenticado();
  if (!supabase) return { ok: false, error: 'Sesión expirada.' };
  if (campanaId) {
    const { error } = await supabase.from('campanas').update(datos).eq('id', campanaId);
    if (error) return { ok: false, error: 'No se pudo guardar la campaña.' };
  } else {
    const { error } = await supabase.from('campanas').insert(datos);
    if (error) return { ok: false, error: 'No se pudo crear la campaña (¿slug repetido?).' };
  }
  revalidarPublico();
  return { ok: true };
}

export async function eliminarCampana(campanaId: string): Promise<Resultado> {
  const supabase = await clienteAutenticado();
  if (!supabase) return { ok: false, error: 'Sesión expirada.' };
  const { error } = await supabase.from('campanas').delete().eq('id', campanaId);
  if (error) return { ok: false, error: 'No se pudo eliminar.' };
  revalidarPublico();
  return { ok: true };
}

/** Verifica que quien llama es superadmin activo (sesión maestra o Supabase). */
async function esSuperadmin(): Promise<boolean> {
  if (sesionAdminActual()) return true;
  const supabase = crearClienteServidor();
  if (!supabase) return false;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase
    .from('perfiles')
    .select('rol, activo')
    .eq('id', user.id)
    .maybeSingle();
  return data?.rol === 'superadmin' && data?.activo === true;
}

/** Invita a un nuevo admin por email (service role, solo superadmin). */
export async function invitarAdmin(datos: {
  email: string;
  nombre: string;
  password: string;
}): Promise<Resultado> {
  if (!(await esSuperadmin())) {
    return { ok: false, error: 'Solo superadmin puede crear administradores.' };
  }
  if (datos.password.length < 8) {
    return { ok: false, error: 'La contraseña necesita al menos 8 caracteres.' };
  }
  const admin = crearClienteAdmin();
  if (!admin) return { ok: false, error: 'Falta SUPABASE_SERVICE_ROLE_KEY en el servidor.' };

  const { data, error } = await admin.auth.admin.createUser({
    email: datos.email.trim(),
    password: datos.password,
    email_confirm: true,
  });
  if (error || !data.user) {
    return { ok: false, error: 'No se pudo crear el usuario (¿correo ya registrado?).' };
  }
  const { error: errorPerfil } = await admin.from('perfiles').insert({
    id: data.user.id,
    nombre: datos.nombre.trim(),
    rol: 'admin',
    activo: true,
  });
  if (errorPerfil) return { ok: false, error: 'Usuario creado, pero falló el perfil.' };
  revalidatePath('/admin/administradores');
  return { ok: true };
}

export async function cambiarEstadoAdmin(
  perfilId: string,
  activo: boolean
): Promise<Resultado> {
  if (!(await esSuperadmin())) {
    return { ok: false, error: 'Solo superadmin puede gestionar administradores.' };
  }
  const admin = crearClienteAdmin();
  if (!admin) return { ok: false, error: 'Falta SUPABASE_SERVICE_ROLE_KEY en el servidor.' };
  const { error } = await admin
    .from('perfiles')
    .update({ activo })
    .eq('id', perfilId)
    .neq('rol', 'superadmin');
  if (error) return { ok: false, error: 'No se pudo actualizar.' };
  revalidatePath('/admin/administradores');
  return { ok: true };
}

/** Crea una cuenta Premium (solo superadmin / cuenta maestra). */
export async function crearCuentaPremium(datos: {
  usuario: string;
  password: string;
  nombre: string;
  clienteId: string | null;
}): Promise<Resultado> {
  if (!(await esSuperadmin())) {
    return { ok: false, error: 'Solo la cuenta principal puede crear cuentas Premium.' };
  }
  const usuario = datos.usuario.trim().toLowerCase();
  if (usuario.length < 3) return { ok: false, error: 'El usuario necesita al menos 3 caracteres.' };
  if (datos.password.length < 6) {
    return { ok: false, error: 'La contraseña necesita al menos 6 caracteres.' };
  }
  if (datos.nombre.trim().length < 2) return { ok: false, error: 'Escribe el nombre del cliente.' };

  const admin = crearClienteAdmin();
  if (!admin) return { ok: false, error: 'Falta SUPABASE_SERVICE_ROLE_KEY en el servidor.' };
  const { error } = await admin.rpc('premium_crear', {
    p_usuario: usuario,
    p_password: datos.password,
    p_nombre: datos.nombre.trim(),
    p_cliente_id: datos.clienteId,
  });
  if (error) return { ok: false, error: 'No se pudo crear (¿usuario repetido?).' };
  revalidatePath('/admin/premium');
  return { ok: true };
}

export async function cambiarEstadoCuentaPremium(
  cuentaId: string,
  activo: boolean
): Promise<Resultado> {
  if (!(await esSuperadmin())) {
    return { ok: false, error: 'Solo la cuenta principal puede gestionar cuentas Premium.' };
  }
  const admin = crearClienteAdmin();
  if (!admin) return { ok: false, error: 'Falta SUPABASE_SERVICE_ROLE_KEY en el servidor.' };
  const { error } = await admin
    .from('cuentas_premium')
    .update({ activo })
    .eq('id', cuentaId);
  if (error) return { ok: false, error: 'No se pudo actualizar.' };
  revalidatePath('/admin/premium');
  return { ok: true };
}

/** Elimina una cuenta Premium (y su lista de deseos, por cascada). */
export async function eliminarCuentaPremium(cuentaId: string): Promise<Resultado> {
  if (!(await esSuperadmin())) {
    return { ok: false, error: 'Solo la cuenta principal puede eliminar cuentas Premium.' };
  }
  const admin = crearClienteAdmin();
  if (!admin) return { ok: false, error: 'Falta SUPABASE_SERVICE_ROLE_KEY en el servidor.' };
  const { error } = await admin.from('cuentas_premium').delete().eq('id', cuentaId);
  if (error) return { ok: false, error: 'No se pudo eliminar.' };
  revalidatePath('/admin/premium');
  return { ok: true };
}

/**
 * Envía una notificación push a todos los dispositivos Premium suscritos.
 * Limpia automáticamente las suscripciones muertas (404/410).
 */
export async function enviarNotificacionPush(datos: {
  titulo: string;
  mensaje: string;
  url: string;
}): Promise<Resultado & { enviadas?: number; fallidas?: number }> {
  if (!(await esSuperadmin())) {
    return { ok: false, error: 'Solo la cuenta principal puede enviar notificaciones.' };
  }
  const titulo = datos.titulo.trim();
  const mensaje = datos.mensaje.trim();
  if (!titulo || !mensaje) {
    return { ok: false, error: 'Completa el título y el mensaje.' };
  }
  const publica = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privada = process.env.VAPID_PRIVATE_KEY;
  if (!publica || !privada) {
    return {
      ok: false,
      error: 'Faltan las claves VAPID en las variables de entorno del servidor.',
    };
  }
  const admin = crearClienteAdmin();
  if (!admin) return { ok: false, error: 'Falta SUPABASE_SERVICE_ROLE_KEY en el servidor.' };

  const { data: suscripciones } = await admin
    .from('suscripciones_push')
    .select('id, endpoint, p256dh, auth');
  if (!suscripciones || suscripciones.length === 0) {
    return { ok: false, error: 'Todavía no hay dispositivos suscritos.' };
  }

  // El "subject" debe ser EXACTAMENTE "mailto:correo@dominio.com" o una URL
  // https:// — sin comillas ni espacios extra. Si Vercel guardó un valor mal
  // formado, web-push lanza una excepción síncrona; la atajamos acá con un
  // mensaje claro en vez de dejar la petición colgada sin respuesta.
  const subjectCrudo = (process.env.VAPID_SUBJECT ?? 'mailto:duomarketing2024@gmail.com').trim();
  const subject = subjectCrudo.replace(/^["']|["']$/g, '');
  if (!/^mailto:.+@.+\..+$/i.test(subject) && !/^https:\/\/.+/i.test(subject)) {
    return {
      ok: false,
      error: `VAPID_SUBJECT tiene un formato inválido ("${subjectCrudo}"). Debe ser exactamente "mailto:correo@dominio.com", sin comillas ni espacios.`,
    };
  }

  const webpush = (await import('web-push')).default;
  try {
    webpush.setVapidDetails(subject, publica, privada);
  } catch (e) {
    return {
      ok: false,
      error: `No se pudieron aplicar las claves VAPID: ${(e as Error).message}`,
    };
  }

  const payload = JSON.stringify({
    title: titulo,
    body: mensaje,
    url: datos.url.trim() || '/premium',
  });

  let enviadas = 0;
  const muertas: string[] = [];
  await Promise.all(
    suscripciones.map(async (s) => {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          payload
        );
        enviadas++;
      } catch (error) {
        const codigo = (error as { statusCode?: number }).statusCode;
        if (codigo === 404 || codigo === 410) muertas.push(s.id);
      }
    })
  );
  if (muertas.length > 0) {
    await admin.from('suscripciones_push').delete().in('id', muertas);
  }
  if (enviadas === 0) {
    return {
      ok: false,
      error: 'No se pudo entregar a ningún dispositivo (revisa las claves VAPID).',
      fallidas: suscripciones.length,
    };
  }
  return { ok: true, enviadas, fallidas: suscripciones.length - enviadas };
}

/** Export CSV (clientes o pedidos) generado en el servidor. */
export async function exportarCsv(tabla: 'clientes' | 'pedidos'): Promise<string> {
  const supabase = await clienteAutenticado();
  if (!supabase) return '';
  if (tabla === 'clientes') {
    const { data } = await supabase
      .from('clientes')
      .select(
        'nombre, whatsapp, email, pais, ciudad, origen, es_premium, nombre_tienda, fanpage, rubro, created_at'
      )
      .order('created_at', { ascending: false });
    const filas = data ?? [];
    const cab = 'nombre,whatsapp,email,pais,ciudad,origen,premium,tienda,fanpage,rubro,fecha';
    return [
      cab,
      ...filas.map((c) =>
        [
          c.nombre,
          c.whatsapp,
          c.email ?? '',
          c.pais,
          c.ciudad ?? '',
          c.origen,
          c.es_premium ? 'si' : 'no',
          c.nombre_tienda ?? '',
          c.fanpage ?? '',
          c.rubro ?? '',
          c.created_at,
        ]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(',')
      ),
    ].join('\n');
  }
  const { data } = await supabase
    .from('pedidos')
    .select(
      'created_at, modalidad, cantidad, grupo_id, clientes(nombre, whatsapp, ciudad, pais), productos(nombre, codigo)'
    )
    .order('created_at', { ascending: false });
  const filas = (data ?? []) as unknown as {
    created_at: string;
    modalidad: string;
    cantidad: number;
    grupo_id: string | null;
    clientes: { nombre: string; whatsapp: string; ciudad: string | null; pais: string } | null;
    productos: { nombre: string; codigo: string | null } | null;
  }[];
  const cab = 'fecha,cliente,whatsapp,ciudad,pais,producto,codigo,modalidad,cantidad,grupo';
  return [
    cab,
    ...filas.map((p) =>
      [
        p.created_at,
        p.clientes?.nombre ?? '',
        p.clientes?.whatsapp ?? '',
        p.clientes?.ciudad ?? '',
        p.clientes?.pais ?? '',
        p.productos?.nombre ?? '',
        p.productos?.codigo ?? '',
        p.modalidad,
        p.cantidad ?? 1,
        p.grupo_id ?? '',
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    ),
  ].join('\n');
}
