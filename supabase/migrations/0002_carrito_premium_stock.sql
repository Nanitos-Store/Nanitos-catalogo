-- ÑAÑITOS — Carrito multi-producto, cuenta Premium y stock por cajas.
-- Ejecutar en el SQL Editor de Supabase DESPUÉS de 0001_esquema_inicial.sql.

-- Cuenta Premium: datos del emprendimiento del comprador
alter table public.clientes
  add column if not exists es_premium boolean not null default false,
  add column if not exists nombre_tienda text,
  add column if not exists fanpage text,
  add column if not exists rubro text;

-- Pedidos por carrito: varios productos comparten un grupo_id,
-- y cada ítem guarda cuántas docenas/cajas se pidieron
alter table public.pedidos
  add column if not exists grupo_id uuid,
  add column if not exists cantidad int not null default 1;

create index if not exists pedidos_grupo_idx on public.pedidos(grupo_id);

-- Stock opcional por cajas (informativo para el admin;
-- la visibilidad pública se controla con "disponible")
alter table public.productos
  add column if not exists stock_cajas int;
