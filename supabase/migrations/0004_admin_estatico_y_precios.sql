-- ÑAÑITOS — Cuenta maestra de administración (login del footer) y
-- activación de los precios por caja del catálogo.
-- Ejecutar DESPUÉS de 0003.

create extension if not exists pgcrypto;

-- ==========================================================================
-- CUENTAS ADMIN (login estático del footer, independiente de Supabase Auth)
-- ==========================================================================
create table if not exists public.cuentas_admin (
  id uuid primary key default gen_random_uuid(),
  usuario text not null unique,
  password_hash text not null,
  nombre text not null,
  created_at timestamptz not null default now()
);

alter table public.cuentas_admin enable row level security;
-- Sin políticas: nadie accede directo (ni anon ni authenticated).
-- Solo se usa mediante las funciones security definer de abajo.

-- Verifica usuario y contraseña; devuelve el nombre del perfil si coinciden.
create or replace function public.admin_verificar(p_usuario text, p_password text)
returns text
language sql stable security definer set search_path = public as $$
  select nombre from public.cuentas_admin
  where usuario = p_usuario
    and password_hash = crypt(p_password, password_hash);
$$;

-- Cambia la contraseña exigiendo la anterior. Devuelve true si lo logró.
create or replace function public.admin_cambiar_password(
  p_usuario text, p_anterior text, p_nueva text
)
returns boolean
language plpgsql security definer set search_path = public as $$
begin
  if length(p_nueva) < 6 then
    return false;
  end if;
  update public.cuentas_admin
  set password_hash = crypt(p_nueva, gen_salt('bf'))
  where usuario = p_usuario
    and password_hash = crypt(p_anterior, password_hash);
  return found;
end;
$$;

-- Bloquear la ejecución anónima directa de las funciones NO es necesario:
-- ambas exigen conocer la contraseña actual para devolver algo útil.

-- Cuenta maestra inicial (cambiar la contraseña desde el perfil al entrar)
insert into public.cuentas_admin (usuario, password_hash, nombre)
values ('nanitos-boss', crypt('123456', gen_salt('bf')), 'Priscila')
on conflict (usuario) do nothing;

-- ==========================================================================
-- PRECIOS: mostrar el precio por caja del catálogo PDF en la web
-- ==========================================================================
update public.productos
set mostrar_precio = true,
    precio_verificado = true
where precio_caja is not null;
