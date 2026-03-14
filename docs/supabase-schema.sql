-- SLATE Supabase Schema (v1)
-- Run in Supabase SQL editor.

create extension if not exists pgcrypto;

-- Keep statuses explicit for predictable UI state transitions.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'lecture_status') then
    create type lecture_status as enum (
      'uploaded',
      'transcribing',
      'transcribed',
      'transforming',
      'transformed',
      'failed'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'source_type') then
    create type source_type as enum ('audio', 'transcript');
  end if;

  if not exists (select 1 from pg_type where typname = 'network_mode') then
    create type network_mode as enum ('normal', 'adaptive');
  end if;
end $$;

create table if not exists public.lectures (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  title text not null,
  source_type source_type not null default 'audio',
  audio_path text,
  language text not null default 'en',
  transcript text,
  network_mode network_mode not null default 'normal',
  stt_provider text,
  transform_provider text,
  status lecture_status not null default 'uploaded',
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lecture_outputs (
  id uuid primary key default gen_random_uuid(),
  lecture_id uuid not null unique references public.lectures(id) on delete cascade,
  summary text,
  notes_md text,
  mermaid_code text,
  quiz_json jsonb not null default '[]'::jsonb,
  flashcards_json jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lectures_user_created_idx
  on public.lectures(user_id, created_at desc);

create index if not exists lectures_status_idx
  on public.lectures(status);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_lectures_updated_at on public.lectures;
create trigger trg_lectures_updated_at
before update on public.lectures
for each row execute function public.set_updated_at();

drop trigger if exists trg_lecture_outputs_updated_at on public.lecture_outputs;
create trigger trg_lecture_outputs_updated_at
before update on public.lecture_outputs
for each row execute function public.set_updated_at();

alter table public.lectures enable row level security;
alter table public.lecture_outputs enable row level security;

-- User can manage only their own lectures.
drop policy if exists lectures_select_own on public.lectures;
create policy lectures_select_own on public.lectures
for select using (auth.uid() = user_id);

drop policy if exists lectures_insert_own on public.lectures;
create policy lectures_insert_own on public.lectures
for insert with check (auth.uid() = user_id);

drop policy if exists lectures_update_own on public.lectures;
create policy lectures_update_own on public.lectures
for update using (auth.uid() = user_id);

drop policy if exists lectures_delete_own on public.lectures;
create policy lectures_delete_own on public.lectures
for delete using (auth.uid() = user_id);

-- Output access follows lecture ownership.
drop policy if exists outputs_select_own on public.lecture_outputs;
create policy outputs_select_own on public.lecture_outputs
for select using (
  exists (
    select 1
    from public.lectures l
    where l.id = lecture_outputs.lecture_id
      and l.user_id = auth.uid()
  )
);

drop policy if exists outputs_insert_own on public.lecture_outputs;
create policy outputs_insert_own on public.lecture_outputs
for insert with check (
  exists (
    select 1
    from public.lectures l
    where l.id = lecture_outputs.lecture_id
      and l.user_id = auth.uid()
  )
);

drop policy if exists outputs_update_own on public.lecture_outputs;
create policy outputs_update_own on public.lecture_outputs
for update using (
  exists (
    select 1
    from public.lectures l
    where l.id = lecture_outputs.lecture_id
      and l.user_id = auth.uid()
  )
);

drop policy if exists outputs_delete_own on public.lecture_outputs;
create policy outputs_delete_own on public.lecture_outputs
for delete using (
  exists (
    select 1
    from public.lectures l
    where l.id = lecture_outputs.lecture_id
      and l.user_id = auth.uid()
  )
);

-- Storage bucket for audio uploads.
insert into storage.buckets (id, name, public)
values ('lecture-audio', 'lecture-audio', false)
on conflict (id) do nothing;
