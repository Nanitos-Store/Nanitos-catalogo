'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  cambiarEstadoCuentaPremium,
  crearCuentaPremium,
  eliminarCuentaPremium,
  enviarNotificacionPush,
} from '@/app/admin/acciones';
import type { Cliente, CuentaPremium, DeseoPremium } from '@/lib/tipos';

function SeccionNotificacion({ campo }: { campo: string }) {
  const [titulo, setTitulo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [url, setUrl] = useState('/premium');
  const [resultado, setResultado] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm('¿Enviar esta notificación a todos los dispositivos Premium suscritos?')) return;
    setEnviando(true);
    setResultado(null);
    const r = await enviarNotificacionPush({ titulo, mensaje, url });
    setEnviando(false);
    if (!r.ok) {
      setResultado(r.error ?? 'Error al enviar.');
      return;
    }
    setResultado(
      `✅ Enviada a ${r.enviadas} dispositivo${r.enviadas === 1 ? '' : 's'}${
        r.fallidas ? ` (${r.fallidas} no disponibles)` : ''
      }.`
    );
    setTitulo('');
    setMensaje('');
  };

  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-tinta/5">
      <h2 className="mb-1 text-lg font-bold">🔔 Enviar notificación push</h2>
      <p className="mb-3 text-sm text-tinta/70">
        Llega al celular o computadora de los clientes Premium que activaron los
        avisos (aunque tengan la web cerrada).
      </p>
      <form onSubmit={enviar} className="space-y-2">
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          maxLength={60}
          placeholder="Título (ej. ¡Llegaron los Labubu gigantes!)"
          className={campo}
        />
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          required
          maxLength={180}
          rows={2}
          placeholder="Mensaje corto (ej. Ya puedes reservar tu caja en la sección Premium.)"
          className={campo}
        />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enlace al tocar la notificación (ej. /premium)"
          className={campo}
        />
        {resultado && <p className="text-sm font-semibold">{resultado}</p>}
        <button
          type="submit"
          disabled={enviando}
          className="rounded-xl bg-naranja px-6 py-3 font-bold text-white disabled:opacity-60"
        >
          {enviando ? 'Enviando…' : 'Enviar notificación'}
        </button>
      </form>
    </section>
  );
}

function slugUsuario(texto: string) {
  return texto
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ñ/gi, 'n')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

export default function GestorPremium({
  solicitudes,
  cuentas,
  deseos,
}: {
  solicitudes: Cliente[];
  cuentas: CuentaPremium[];
  deseos: DeseoPremium[];
}) {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [clienteId, setClienteId] = useState<string>('');
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  // Solicitudes que todavía no tienen cuenta creada
  const conCuenta = new Set(cuentas.map((c) => c.cliente_id).filter(Boolean));
  const pendientes = solicitudes.filter((s) => !conCuenta.has(s.id));

  const usarSolicitud = (s: Cliente) => {
    setNombre(s.nombre_tienda ?? s.nombre);
    setUsuario(slugUsuario(s.nombre_tienda ?? s.nombre));
    setClienteId(s.id);
    setMensaje(null);
  };

  const crear = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setMensaje(null);
    const r = await crearCuentaPremium({
      usuario,
      password,
      nombre,
      clienteId: clienteId || null,
    });
    setEnviando(false);
    if (!r.ok) {
      setMensaje(r.error ?? 'Error al crear.');
      return;
    }
    setMensaje(
      `✅ Cuenta creada. Comparte con el cliente: usuario "${usuario.trim().toLowerCase()}" y la contraseña que definiste.`
    );
    setUsuario('');
    setPassword('');
    setNombre('');
    setClienteId('');
    router.refresh();
  };

  const cambiarEstado = async (cuenta: CuentaPremium) => {
    await cambiarEstadoCuentaPremium(cuenta.id, !cuenta.activo);
    router.refresh();
  };

  const eliminar = async (cuenta: CuentaPremium) => {
    if (
      !confirm(
        `¿Eliminar la cuenta Premium de "${cuenta.nombre}" (${cuenta.usuario})? Se borra también su lista de deseos y no se puede deshacer.`
      )
    )
      return;
    await eliminarCuentaPremium(cuenta.id);
    router.refresh();
  };

  const campo = 'w-full rounded-xl border border-tinta/15 px-4 py-3';

  return (
    <div className="space-y-5">
      {/* Notificación push */}
      <SeccionNotificacion campo={campo} />

      {/* Solicitudes pendientes */}
      <section>
        <h2 className="mb-2 text-lg font-bold">
          Solicitudes pendientes {pendientes.length > 0 && `(${pendientes.length})`}
        </h2>
        {pendientes.length === 0 ? (
          <p className="rounded-2xl bg-white p-4 text-sm text-tinta/60">
            No hay solicitudes nuevas.
          </p>
        ) : (
          <ul className="space-y-2">
            {pendientes.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center gap-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-tinta/5">
                <div className="min-w-0 flex-1">
                  <p className="font-bold">
                    {s.nombre}{' '}
                    <span className="font-normal text-tinta/60">
                      · 🏪 {s.nombre_tienda ?? 'sin nombre de tienda'}
                    </span>
                  </p>
                  <p className="text-sm text-tinta/60">
                    {s.pais === 'BO' ? '🇧🇴' : '🇦🇷'} {s.ciudad ?? ''}
                    {s.whatsapp && <> · +{s.whatsapp}</>}
                    {s.fanpage && <> · 📱 {s.fanpage}</>}
                  </p>
                </div>
                {s.whatsapp && (
                  <a
                    href={`https://wa.me/${s.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-whatsapp px-4 py-1.5 text-sm font-bold text-white"
                  >
                    Contactar
                  </a>
                )}
                <button
                  onClick={() => usarSolicitud(s)}
                  className="rounded-full bg-amarillo px-4 py-1.5 text-sm font-bold"
                >
                  Crear su cuenta ↓
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Crear cuenta */}
      <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-tinta/5">
        <h2 className="mb-3 text-lg font-bold">Crear cuenta Premium</h2>
        <form onSubmit={crear} className="grid gap-2 sm:grid-cols-3">
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            placeholder="Nombre del cliente o tienda"
            className={campo}
          />
          <input
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
            placeholder="Usuario (ej. jugueteria-estrella)"
            className={campo}
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="Contraseña inicial"
            className={campo}
          />
          <div className="sm:col-span-3">
            {mensaje && <p className="mb-2 text-sm font-semibold">{mensaje}</p>}
            <button
              type="submit"
              disabled={enviando}
              className="rounded-xl bg-celeste px-6 py-3 font-bold text-white disabled:opacity-60"
            >
              {enviando ? 'Creando…' : 'Crear cuenta Premium'}
            </button>
          </div>
        </form>
      </section>

      {/* Cuentas existentes */}
      <section>
        <h2 className="mb-2 text-lg font-bold">Cuentas Premium ({cuentas.length})</h2>
        <ul className="space-y-2">
          {cuentas.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center gap-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-tinta/5">
              <div className="min-w-0 flex-1">
                <p className="font-bold">
                  ⭐ {c.nombre} <span className="font-normal text-tinta/50">({c.usuario})</span>
                </p>
                {c.clientes && (
                  <p className="text-sm text-tinta/60">
                    Cliente: {c.clientes.nombre}
                    {c.clientes.whatsapp && <> · +{c.clientes.whatsapp}</>}
                  </p>
                )}
              </div>
              <button
                onClick={() => void cambiarEstado(c)}
                className={`rounded-full px-4 py-1.5 text-sm font-bold ${
                  c.activo ? 'bg-coral/10 text-coral' : 'bg-verde/15 text-verde'
                }`}
              >
                {c.activo ? 'Desactivar' : 'Activar'}
              </button>
              <button
                onClick={() => void eliminar(c)}
                className="rounded-full bg-coral px-4 py-1.5 text-sm font-bold text-white"
              >
                Eliminar
              </button>
            </li>
          ))}
          {cuentas.length === 0 && (
            <p className="rounded-2xl bg-white p-4 text-sm text-tinta/60">
              Todavía no hay cuentas Premium creadas.
            </p>
          )}
        </ul>
      </section>

      {/* Lista de deseos */}
      <section>
        <h2 className="mb-2 text-lg font-bold">💡 Lista de deseos de los Premium</h2>
        <ul className="space-y-2">
          {deseos.map((d) => (
            <li key={d.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-tinta/5">
              <p className="font-bold">{d.producto}</p>
              {d.detalle && <p className="text-sm text-tinta/70">{d.detalle}</p>}
              <p className="mt-1 text-xs text-tinta/50">
                Pedido por {d.cuentas_premium?.nombre ?? 'cuenta eliminada'} ·{' '}
                {new Date(d.created_at).toLocaleDateString('es-BO')}
              </p>
            </li>
          ))}
          {deseos.length === 0 && (
            <p className="rounded-2xl bg-white p-4 text-sm text-tinta/60">
              Todavía no hay deseos registrados.
            </p>
          )}
        </ul>
      </section>
    </div>
  );
}
