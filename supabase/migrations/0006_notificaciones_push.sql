-- ÑAÑITOS — Suscripciones de notificaciones push (Web Push) de los Premium.
-- Ejecutar DESPUÉS de 0005.

create table if not exists public.suscripciones_push (
  id uuid primary key default gen_random_uuid(),
  cuenta_premium_id uuid references public.cuentas_premium(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

create index if not exists suscripciones_push_cuenta_idx
  on public.suscripciones_push(cuenta_premium_id);

alter table public.suscripciones_push enable row level security;
-- Sin políticas: se opera vía server actions (sesión premium firmada +
-- service role) y el envío sale del panel admin.
