-- Ejecutar en el SQL Editor de Supabase (Dashboard > SQL > New query)

create table if not exists public.solicitudes_ayuda (
  id bigint generated always as identity primary key,
  nombre text not null,
  tipo text not null default 'Ayuda general',
  mensaje text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.mensajes_contacto (
  id bigint generated always as identity primary key,
  nombre text not null,
  contacto text,
  mensaje text not null,
  created_at timestamptz not null default now()
);

alter table public.solicitudes_ayuda enable row level security;
alter table public.mensajes_contacto enable row level security;

create policy "Permitir insert publico de solicitudes"
  on public.solicitudes_ayuda
  for insert
  to anon
  with check (true);

create policy "Permitir insert publico de contacto"
  on public.mensajes_contacto
  for insert
  to anon
  with check (true);
