'use server';

import { revalidatePath } from 'next/cache';
import { crearClienteServidor } from '@/lib/supabase/server';
import { crearClienteAdmin } from '@/lib/supabase/admin';

interface Resultado {
  ok: boolean;
  error?: string;
}

/** Verifica sesión y devuelve el cliente del usuario (RLS aplica es_admin). */
async function clienteAutenticado() {
  const supabase = crearClienteServidor();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ? supabase : null;
}

function revalidarPublico() {
  revalidatePath('/', 'layout');
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
  disponible: boolean;
  destacado: boolean;
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

/** Verifica que quien llama es superadmin activo (consulta con su sesión). */
async function esSuperadmin(): Promise<boolean> {
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

/** Export CSV (clientes o pedidos) generado en el servidor. */
export async function exportarCsv(tabla: 'clientes' | 'pedidos'): Promise<string> {
  const supabase = await clienteAutenticado();
  if (!supabase) return '';
  if (tabla === 'clientes') {
    const { data } = await supabase
      .from('clientes')
      .select('nombre, whatsapp, email, pais, ciudad, origen, created_at')
      .order('created_at', { ascending: false });
    const filas = data ?? [];
    const cab = 'nombre,whatsapp,email,pais,ciudad,origen,fecha';
    return [
      cab,
      ...filas.map((c) =>
        [c.nombre, c.whatsapp, c.email ?? '', c.pais, c.ciudad ?? '', c.origen, c.created_at]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(',')
      ),
    ].join('\n');
  }
  const { data } = await supabase
    .from('pedidos')
    .select('created_at, modalidad, clientes(nombre, whatsapp, ciudad, pais), productos(nombre, codigo)')
    .order('created_at', { ascending: false });
  const filas = (data ?? []) as unknown as {
    created_at: string;
    modalidad: string;
    clientes: { nombre: string; whatsapp: string; ciudad: string | null; pais: string } | null;
    productos: { nombre: string; codigo: string | null } | null;
  }[];
  const cab = 'fecha,cliente,whatsapp,ciudad,pais,producto,codigo,modalidad';
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
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    ),
  ].join('\n');
}
