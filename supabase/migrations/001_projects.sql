-- =============================================================
-- DOJ MEDIA — Projects CMS Migration
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor).
-- =============================================================

-- 1. Projects table
create table if not exists projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  slug        text not null unique,
  category    text not null,
  description text not null,
  cover_image text,
  gallery     jsonb not null default '[]'::jsonb,
  video_url   text,
  project_url text,
  tools       jsonb not null default '[]'::jsonb,
  year        integer,
  featured    boolean not null default false,
  published   boolean not null default false,
  hue         integer not null default 200,
  alt         text not null default '',
  services    jsonb not null default '[]'::jsonb,
  approach    text not null default '',
  outcome     text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 2. Indexes
create index if not exists idx_projects_slug     on projects (slug);
create index if not exists idx_projects_category  on projects (category);
create index if not exists idx_projects_published on projects (published);
create index if not exists idx_projects_featured  on projects (featured);
create index if not exists idx_projects_created   on projects (created_at desc);

-- 3. Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on projects;
create trigger set_updated_at
  before update on projects
  for each row
  execute function update_updated_at();

-- 4. Row-Level Security
alter table projects enable row level security;

-- Public can read published projects
create policy "Public can read published projects"
  on projects for select
  using (published = true);

-- Authenticated users can read all projects
create policy "Authenticated users can read all projects"
  on projects for select
  to authenticated
  using (true);

-- Authenticated users can insert projects
create policy "Authenticated users can insert projects"
  on projects for insert
  to authenticated
  with check (true);

-- Authenticated users can update projects
create policy "Authenticated users can update projects"
  on projects for update
  to authenticated
  using (true)
  with check (true);

-- Authenticated users can delete projects
create policy "Authenticated users can delete projects"
  on projects for delete
  to authenticated
  using (true);

-- 5. Storage bucket for project media
-- NOTE: If you cannot run bucket creation via SQL, create it manually:
--   Dashboard > Storage > New bucket > name: "project-media", Public: ON
insert into storage.buckets (id, name, public)
  values ('project-media', 'project-media', true)
  on conflict (id) do nothing;

-- 6. Storage RLS policies
-- Public can view files in project-media
create policy "Public can view project media"
  on storage.objects for select
  using (bucket_id = 'project-media');

-- Authenticated users can upload to project-media
create policy "Authenticated users can upload project media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-media');

-- Authenticated users can update files in project-media
create policy "Authenticated users can update project media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'project-media');

-- Authenticated users can delete files in project-media
create policy "Authenticated users can delete project media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-media');
