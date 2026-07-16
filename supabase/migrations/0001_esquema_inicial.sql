-- ÑAÑITOS — Esquema inicial: tablas, índices, RLS y bucket de Storage
-- Ejecutar en el SQL Editor de Supabase (o via supabase db push).

create extension if not exists pg_trgm;

-- ==========================================================================
-- CATEGORIAS
-- ==========================================================================
create table public.categorias (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nombre text not null,
  icono text,
  orden int not null default 0
);

-- ==========================================================================
-- PRODUCTOS
-- ==========================================================================
create table public.productos (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nombre text not null,
  descripcion text,
  categoria_id uuid references public.categorias(id),
  personajes text[] not null default '{}',
  temporada text[] not null default '{}',
  codigo text,
  vende_por_docena boolean not null default true,
  vende_por_caja boolean not null default true,
  precio_docena numeric,
  precio_caja numeric,
  unidad_precio text not null default 'por_unidad'
    check (unidad_precio in ('por_unidad','por_paquete','por_docena')),
  moneda text not null default 'USD' check (moneda in ('USD','BOB')),
  unidades_por_caja int,
  mostrar_precio boolean not null default false,
  precio_verificado boolean not null default false,
  en_oferta boolean not null default false,
  etiqueta_oferta text,
  disponible boolean not null default true,
  destacado boolean not null default false,
  orden int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index productos_categoria_idx on public.productos(categoria_id);
create index productos_disponible_idx on public.productos(disponible);
create index productos_nombre_trgm_idx on public.productos using gin (nombre gin_trgm_ops);
create index productos_personajes_idx on public.productos using gin (personajes);
create index productos_temporada_idx on public.productos using gin (temporada);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger productos_updated_at before update on public.productos
  for each row execute function public.set_updated_at();

-- ==========================================================================
-- PRODUCTO_IMAGENES
-- ==========================================================================
create table public.producto_imagenes (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid not null references public.productos(id) on delete cascade,
  url text not null,
  alt text,
  orden int not null default 0,
  es_principal boolean not null default false,
  blur_data_url text
);

create index producto_imagenes_producto_idx on public.producto_imagenes(producto_id);

-- ==========================================================================
-- CAMPANAS
-- ==========================================================================
create table public.campanas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  slug text not null unique,
  titulo text not null,
  subtitulo text,
  pais_objetivo text not null default 'ambos' check (pais_objetivo in ('AR','BO','ambos')),
  fecha_inicio date,
  fecha_fin date,
  activa boolean not null default true,
  imagen_url text,
  producto_ids uuid[] not null default '{}'
);

-- ==========================================================================
-- CLIENTES (registro único de compradores)
-- ==========================================================================
create table public.clientes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text,
  whatsapp text not null,
  pais text not null check (pais in ('BO','AR')),
  ciudad text,
  origen text not null default 'web-catalogo',
  created_at timestamptz not null default now()
);

create unique index clientes_whatsapp_idx on public.clientes(whatsapp);

-- ==========================================================================
-- PEDIDOS (log de cada clic "Hacer pedido")
-- ==========================================================================
create table public.pedidos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid references public.clientes(id),
  producto_id uuid references public.productos(id),
  modalidad text not null check (modalidad in ('docena','caja','ambas')),
  mensaje_enviado text,
  utm jsonb,
  created_at timestamptz not null default now()
);

create index pedidos_cliente_idx on public.pedidos(cliente_id);
create index pedidos_producto_idx on public.pedidos(producto_id);
create index pedidos_created_idx on public.pedidos(created_at desc);

-- ==========================================================================
-- PERFILES (roles de administración)
-- ==========================================================================
create table public.perfiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text,
  rol text not null default 'admin' check (rol in ('admin','superadmin')),
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

-- Helper: ¿el usuario autenticado es admin activo?
create or replace function public.es_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.perfiles
    where id = auth.uid() and activo = true
  );
$$;

create or replace function public.es_superadmin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.perfiles
    where id = auth.uid() and activo = true and rol = 'superadmin'
  );
$$;

-- ==========================================================================
-- RLS
-- ==========================================================================
alter table public.categorias enable row level security;
alter table public.productos enable row level security;
alter table public.producto_imagenes enable row level security;
alter table public.campanas enable row level security;
alter table public.clientes enable row level security;
alter table public.pedidos enable row level security;
alter table public.perfiles enable row level security;

-- Catálogo: lectura pública, escritura solo admins
create policy "categorias lectura publica" on public.categorias
  for select using (true);
create policy "categorias escritura admin" on public.categorias
  for all using (public.es_admin()) with check (public.es_admin());

create policy "productos lectura publica" on public.productos
  for select using (true);
create policy "productos escritura admin" on public.productos
  for all using (public.es_admin()) with check (public.es_admin());

create policy "imagenes lectura publica" on public.producto_imagenes
  for select using (true);
create policy "imagenes escritura admin" on public.producto_imagenes
  for all using (public.es_admin()) with check (public.es_admin());

create policy "campanas lectura publica" on public.campanas
  for select using (true);
create policy "campanas escritura admin" on public.campanas
  for all using (public.es_admin()) with check (public.es_admin());

-- Clientes: sin acceso anónimo. Insert/upsert se hace desde server actions con
-- service role (que salta RLS). Lectura/edición solo admins.
create policy "clientes lectura admin" on public.clientes
  for select using (public.es_admin());
create policy "clientes edicion admin" on public.clientes
  for update using (public.es_admin()) with check (public.es_admin());

-- Pedidos: insert vía server action (service role), lectura solo admins.
create policy "pedidos lectura admin" on public.pedidos
  for select using (public.es_admin());

-- Perfiles: cada admin ve su propio perfil; superadmin ve y gestiona todos.
create policy "perfil propio" on public.perfiles
  for select using (id = auth.uid());
create policy "perfiles lectura superadmin" on public.perfiles
  for select using (public.es_superadmin());
create policy "perfiles gestion superadmin" on public.perfiles
  for all using (public.es_superadmin()) with check (public.es_superadmin());

-- ==========================================================================
-- STORAGE: bucket "productos" (lectura pública, escritura autenticada)
-- ==========================================================================
insert into storage.buckets (id, name, public)
values ('productos', 'productos', true)
on conflict (id) do nothing;

create policy "productos storage lectura publica" on storage.objects
  for select using (bucket_id = 'productos');

create policy "productos storage escritura admin" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'productos' and public.es_admin());

create policy "productos storage update admin" on storage.objects
  for update to authenticated
  using (bucket_id = 'productos' and public.es_admin());

create policy "productos storage delete admin" on storage.objects
  for delete to authenticated
  using (bucket_id = 'productos' and public.es_admin());
