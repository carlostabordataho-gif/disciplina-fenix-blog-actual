-- ─────────────────────────────────────────────────────────────────────
-- TABORDA SYSTEM — Setup completo de base de datos (leads + ventas).
-- = leads.sql + ventas.sql en un solo script idempotente (se puede
--   ejecutar varias veces sin romper nada).
--
-- CÓMO EJECUTARLO (30 segundos):
--   1. https://supabase.com/dashboard/project/dzqxqpewgzyklnrsestu/sql/new
--   2. Pegar TODO este archivo → botón RUN.
-- ─────────────────────────────────────────────────────────────────────

-- ── 1. Tabla de leads del funnel (RESET / Home / Comunidad) ──────────
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'unknown',
  created_at timestamptz not null default now()
);

-- Seguridad: el cliente anónimo SOLO puede insertar. Nunca leer ni borrar.
-- (La política de insert se crea en la sección 2c, DESPUÉS de añadir las
-- columnas de estado/gamificación que la política referencia.)
alter table public.leads enable row level security;

-- ── 2. Estado de alumno sobre `leads` (flujo de ventas Hotmart) ──────
-- status: 'lead' (capturado) → 'active' (compró) → 'refunded' (reembolso)
alter table public.leads add column if not exists status text not null default 'lead';
alter table public.leads add column if not exists purchased_at timestamptz;

-- ── 2b. Gamificación del Personal OS (dashboard del alumno) ──────────
-- Todo registro nuevo arranca la partida en cero: score 0 y estado
-- 'ZONA DE PELIGRO'. El webhook de Hotmart (api/hotmart-webhook.ts)
-- los re-inicializa explícitamente al activar a un alumno.
alter table public.leads add column if not exists os_score integer not null default 0;
alter table public.leads add column if not exists os_state text not null default 'ZONA DE PELIGRO';

-- ── 2c. Política de insert BLINDADA para el navegador ────────────────
-- La anon key viaja en el bundle JS público: sin este check, cualquiera
-- podría insertarse como alumno 'active' o con score inflado. El anon
-- solo puede crear leads vírgenes; activar alumnos es trabajo exclusivo
-- del webhook (service role key, que ignora RLS).
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

-- ── 3. Auditoría de postbacks de Hotmart (api/hotmart-webhook.ts) ────
-- Idempotencia por (transaction, event): los REINTENTOS del mismo evento
-- no duplican el email de bienvenida, pero el PURCHASE_REFUNDED — que
-- llega con la MISMA transaction que el APPROVED original — sí entra y
-- revoca el acceso. (Unique solo por transaction bloqueaba los reembolsos.)
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

-- RLS activo y SIN políticas => solo la service role key (servidor) entra.
alter table public.purchases enable row level security;
