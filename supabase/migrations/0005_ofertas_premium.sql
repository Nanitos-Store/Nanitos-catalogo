-- ÑAÑITOS — Descuentos con porcentaje, lanzamientos anticipados Premium,
-- cuentas Premium con login propio y lista de deseos.
-- Ejecutar DESPUÉS de 0004.

-- ==========================================================================
-- PRODUCTOS: porcentaje de descuento y fecha de publicación general
-- ==========================================================================
alter table public.productos
  add column if not exists descuento_pct int
    check (descuento_pct is null or (descuento_pct between 1 and 90)),
  -- fecha en la que el producto pasa a ser visible para todo el público;
  -- mientras sea futura, solo la sección Premium lo muestra
  add column if not exists fecha_publica date;

-- ==========================================================================
-- CLIENTES: estado de la solicitud premium
-- (es_premium = solicitó; la cuenta activa vive en cuentas_premium)
-- ==========================================================================

-- ==========================================================================
-- CUENTAS PREMIUM (login propio de la sección premium)
-- ==========================================================================
create table if not exists public.cuentas_premium (
  id uuid primary key default gen_random_uuid(),
  usuario text not null unique,
  password_hash text not null,
  nombre text not null,
  cliente_id uuid references public.clientes(id),
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.cuentas_premium enable row level security;
-- Sin políticas: solo funciones security definer y service role.

create or replace function public.premium_verificar(p_usuario text, p_password text)
returns json
language sql stable security definer set search_path = public, extensions as $$
  select json_build_object('id', id, 'nombre', nombre)
  from public.cuentas_premium
  where usuario = p_usuario
    and activo = true
    and password_hash = extensions.crypt(p_password, password_hash);
$$;

create or replace function public.premium_cambiar_password(
  p_usuario text, p_anterior text, p_nueva text
)
returns boolean
language plpgsql security definer set search_path = public, extensions as $$
begin
  if length(p_nueva) < 6 then
    return false;
  end if;
  update public.cuentas_premium
  set password_hash = extensions.crypt(p_nueva, extensions.gen_salt('bf'))
  where usuario = p_usuario
    and activo = true
    and password_hash = extensions.crypt(p_anterior, password_hash);
  return found;
end;
$$;

-- Creación de cuentas: SOLO service role (el panel de Priscila).
create or replace function public.premium_crear(
  p_usuario text, p_password text, p_nombre text, p_cliente_id uuid default null
)
returns uuid
language plpgsql security definer set search_path = public, extensions as $$
declare
  v_id uuid;
begin
  insert into public.cuentas_premium (usuario, password_hash, nombre, cliente_id)
  values (p_usuario, extensions.crypt(p_password, extensions.gen_salt('bf')), p_nombre, p_cliente_id)
  returning id into v_id;
  return v_id;
end;
$$;

revoke execute on function public.premium_crear(text, text, text, uuid)
  from public, anon, authenticated;

-- ==========================================================================
-- LISTA DE DESEOS (los premium proponen productos para futuras importaciones)
-- ==========================================================================
create table if not exists public.lista_deseos (
  id uuid primary key default gen_random_uuid(),
  cuenta_premium_id uuid not null references public.cuentas_premium(id) on delete cascade,
  producto text not null,
  detalle text,
  created_at timestamptz not null default now()
);

create index if not exists lista_deseos_cuenta_idx on public.lista_deseos(cuenta_premium_id);

alter table public.lista_deseos enable row level security;
-- Sin políticas: se opera vía server actions con la sesión premium firmada.
