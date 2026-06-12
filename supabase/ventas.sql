-- Upgrade del esquema para el flujo de ventas Hotmart (api/hotmart-webhook.ts).
-- Ejecutar UNA VEZ en el SQL Editor de Supabase, DESPUÉS de leads.sql.

-- ── 1. La tabla `leads` aprende a distinguir lead de alumno ──────────
-- status: 'lead' (capturado) → 'active' (compró) → 'refunded' (reembolso/chargeback)
alter table public.leads add column if not exists status text not null default 'lead';
alter table public.leads add column if not exists purchased_at timestamptz;

-- Gamificación del Personal OS: todo registro nuevo arranca en cero.
alter table public.leads add column if not exists os_score integer not null default 0;
alter table public.leads add column if not exists os_state text not null default 'ZONA DE PELIGRO';

-- Blindaje de la anon key (pública en el bundle JS): el navegador solo
-- puede crear leads vírgenes — activar alumnos es exclusivo del webhook.
drop policy if exists "anon can insert leads" on public.leads;
create policy "anon can insert leads"
  on public.leads
  for insert
  to anon
  with check (
    status = 'lead'
    and purchased_at is null
    and os_score = 0
    and os_state = 'ZONA DE PELIGRO'
  );

-- ── 2. Registro de auditoría de cada postback de Hotmart ─────────────
-- Idempotencia por (transaction, event): los reintentos del mismo evento
-- fallan con 23505 y el webhook corta sin duplicar el email — pero el
-- PURCHASE_REFUNDED (misma transaction que el APPROVED) SÍ entra y
-- revoca el acceso.
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  transaction text not null,
  email text not null,
  buyer_name text,
  product_id text,
  price_value numeric,
  price_currency text,
  event text not null,             -- PURCHASE_APPROVED | PURCHASE_REFUNDED | ...
  raw jsonb,                       -- payload completo de Hotmart (debug/reproceso)
  created_at timestamptz not null default now()
);

-- Migración de instalaciones previas: soltar el unique de una sola columna.
alter table public.purchases drop constraint if exists purchases_transaction_key;
create unique index if not exists purchases_tx_event_uidx
  on public.purchases (transaction, event);

-- Seguridad: RLS activo y SIN políticas => la anon key del navegador no
-- puede ni leer ni escribir. Solo la service role key (servidor) entra.
alter table public.purchases enable row level security;

-- Consulta rápida de operador: ¿quiénes son mis alumnos activos?
--   select email, purchased_at from public.leads where status = 'active' order by purchased_at;
