'use client';

import { useEffect, useState } from 'react';
import { eliminarSuscripcionPush, guardarSuscripcionPush } from '@/app/acciones/push';

const CLAVE_PUBLICA =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ??
  'BEjtynkMMyYMqEPdEUmN3c2LxH4-4XkBACZsVG_wv2USMNoIrCMTmo8vscRQekk2wa2iEseEIqu2YQKCxhYadAA';

function base64aUint8(base64: string) {
  const relleno = '='.repeat((4 - (base64.length % 4)) % 4);
  const normalizada = (base64 + relleno).replace(/-/g, '+').replace(/_/g, '/');
  const crudo = atob(normalizada);
  return Uint8Array.from(crudo.split('').map((c) => c.charCodeAt(0)));
}

/** Activa/desactiva las notificaciones push del dispositivo (solo Premium). */
export default function BotonNotificaciones() {
  const [soportado, setSoportado] = useState(false);
  const [suscrito, setSuscrito] = useState(false);
  const [trabajando, setTrabajando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    setSoportado(true);
    void navigator.serviceWorker.register('/sw.js').then(async (registro) => {
      const actual = await registro.pushManager.getSubscription();
      setSuscrito(Boolean(actual));
    });
  }, []);

  const activar = async () => {
    setTrabajando(true);
    setError(null);
    try {
      const permiso = await Notification.requestPermission();
      if (permiso !== 'granted') {
        setError('No diste permiso de notificaciones en el navegador.');
        setTrabajando(false);
        return;
      }
      const registro = await navigator.serviceWorker.ready;
      const suscripcion = await registro.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64aUint8(CLAVE_PUBLICA),
      });
      const json = suscripcion.toJSON();
      const r = await guardarSuscripcionPush({
        endpoint: suscripcion.endpoint,
        keys: { p256dh: json.keys?.p256dh ?? '', auth: json.keys?.auth ?? '' },
      });
      if (!r.ok) {
        setError(r.error ?? 'No se pudo activar.');
      } else {
        setSuscrito(true);
      }
    } catch {
      setError('Tu navegador no permitió la suscripción. Intenta de nuevo.');
    }
    setTrabajando(false);
  };

  const desactivar = async () => {
    setTrabajando(true);
    try {
      const registro = await navigator.serviceWorker.ready;
      const suscripcion = await registro.pushManager.getSubscription();
      if (suscripcion) {
        await eliminarSuscripcionPush(suscripcion.endpoint);
        await suscripcion.unsubscribe();
      }
      setSuscrito(false);
    } catch {
      // sin drama: el próximo envío limpia suscripciones muertas
    }
    setTrabajando(false);
  };

  if (!soportado) {
    return (
      <p className="text-sm text-tinta/60">
        🔔 Para recibir avisos en tu iPhone, primero instala la web en tu
        pantalla de inicio (Compartir → Añadir a pantalla de inicio) y abre la
        app desde ahí.
      </p>
    );
  }

  return (
    <div>
      <button
        onClick={() => void (suscrito ? desactivar() : activar())}
        disabled={trabajando}
        className={`rounded-full px-5 py-2.5 font-bold disabled:opacity-60 ${
          suscrito ? 'bg-verde/15 text-verde' : 'bg-amarillo text-tinta'
        }`}
      >
        {trabajando
          ? 'Un momento…'
          : suscrito
            ? '🔔 Avisos activados en este dispositivo'
            : '🔔 Activar avisos de novedades'}
      </button>
      {error && <p className="mt-1 text-sm font-semibold text-coral">{error}</p>}
    </div>
  );
}
