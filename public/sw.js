/* Service worker de Ñañitos: recibe las notificaciones push. */

self.addEventListener('push', (event) => {
  let datos = {};
  try {
    datos = event.data ? event.data.json() : {};
  } catch (e) {
    datos = { body: event.data ? event.data.text() : '' };
  }
  event.waitUntil(
    self.registration.showNotification(datos.title || 'Ñañitos 🧸', {
      body: datos.body || '',
      icon: '/brand/icono-192.png',
      badge: '/brand/icono-192.png',
      data: { url: datos.url || '/premium' },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((ventanas) => {
      for (const ventana of ventanas) {
        if ('focus' in ventana) {
          ventana.navigate(url);
          return ventana.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
