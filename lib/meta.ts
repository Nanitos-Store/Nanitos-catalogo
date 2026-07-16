'use client';

/**
 * Tracking Meta: Pixel en el navegador + duplicado server-side vía /api/meta-capi
 * con deduplicación por event_id compartido.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function leerUtms(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(sessionStorage.getItem('nanitos_utm') ?? '{}');
  } catch {
    return {};
  }
}

function generarEventId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function leerCookie(nombre: string) {
  if (typeof document === 'undefined') return undefined;
  const valor = document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${nombre}=`))
    ?.split('=')[1];
  return valor || undefined;
}

async function enviarCapi(evento: string, eventId: string, datos: Record<string, unknown>) {
  try {
    await fetch('/api/meta-capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        event_name: evento,
        event_id: eventId,
        event_source_url: window.location.href,
        custom_data: { ...datos, ...leerUtms() },
        fbp: leerCookie('_fbp'),
        fbc: leerCookie('_fbc'),
      }),
    });
  } catch {
    // el tracking nunca debe romper la navegación
  }
}

/** Dispara un evento en Pixel + CAPI con deduplicación. */
export function trackEvento(evento: string, datos: Record<string, unknown> = {}) {
  const eventId = generarEventId();
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', evento, { ...datos, ...leerUtms() }, { eventID: eventId });
  }
  void enviarCapi(evento, eventId, datos);
  return eventId;
}
