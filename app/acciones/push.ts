'use server';

import { crearClienteAdmin } from '@/lib/supabase/admin';
import { sesionPremiumActual } from '@/lib/premium-sesion';

interface Resultado {
  ok: boolean;
  error?: string;
}

export interface SuscripcionNavegador {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

/** Guarda la suscripción push del dispositivo del cliente Premium. */
export async function guardarSuscripcionPush(
  suscripcion: SuscripcionNavegador
): Promise<Resultado> {
  const sesion = sesionPremiumActual();
  if (!sesion) return { ok: false, error: 'Inicia sesión Premium para activar avisos.' };
  if (!suscripcion?.endpoint || !suscripcion.keys?.p256dh || !suscripcion.keys?.auth) {
    return { ok: false, error: 'Suscripción inválida.' };
  }
  const supabase = crearClienteAdmin();
  if (!supabase) return { ok: false, error: 'Sin conexión a la base de datos.' };
  const { error } = await supabase.from('suscripciones_push').upsert(
    {
      cuenta_premium_id: sesion.cuentaId,
      endpoint: suscripcion.endpoint,
      p256dh: suscripcion.keys.p256dh,
      auth: suscripcion.keys.auth,
    },
    { onConflict: 'endpoint' }
  );
  if (error) return { ok: false, error: 'No se pudo guardar la suscripción.' };
  return { ok: true };
}

/** Elimina la suscripción de este dispositivo (al desactivar los avisos). */
export async function eliminarSuscripcionPush(endpoint: string): Promise<Resultado> {
  const sesion = sesionPremiumActual();
  if (!sesion) return { ok: false };
  const supabase = crearClienteAdmin();
  if (!supabase) return { ok: false };
  await supabase
    .from('suscripciones_push')
    .delete()
    .eq('endpoint', endpoint)
    .eq('cuenta_premium_id', sesion.cuentaId);
  return { ok: true };
}
