-- Tabla de leads del funnel (RESET / Home / Comunidad).
-- Ejecutar UNA VEZ en el SQL Editor de Supabase (https://supabase.com/dashboard -> SQL Editor).

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'unknown',
  created_at timestamptz not null default now()
);

-- Seguridad: el cliente anónimo SOLO puede insertar. Nunca leer ni borrar.
alter table public.leads enable row level security;

drop policy if exists "anon can insert leads" on public.leads;
create policy "anon can insert leads"
  on public.leads
  for insert
  to anon
  with check (true);

-- (No se crea política de SELECT para anon: la lista de emails
--  solo es visible desde el dashboard de Supabase con la service key.)
