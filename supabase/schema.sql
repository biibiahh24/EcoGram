-- EcoGram: primeira etapa de dados reais (aplicar somente em projeto Supabase próprio)
-- A versão publicada continua intacta até a configuração e validação desta migração.
-- Dados públicos de perfil: não armazenar e-mail, senha ou dados privados nesta tabela.
begin;

create table if not exists public.ecogram_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  display_name text not null,
  bio text not null default '',
  avatar_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ecogram_username_format check (username ~ '^[a-zA-Z0-9_]{3,20}$'),
  constraint ecogram_display_name_length check (char_length(display_name) between 2 and 60),
  constraint ecogram_bio_length check (char_length(bio) <= 300),
  constraint ecogram_avatar_path_length check (avatar_path is null or char_length(avatar_path) <= 512)
);
create unique index if not exists ecogram_profiles_username_unique
  on public.ecogram_profiles (lower(username));

create table if not exists public.ecogram_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.ecogram_profiles(id) on delete cascade,
  body text not null,
  image_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ecogram_post_body_length check (char_length(trim(body)) between 1 and 1500),
  constraint ecogram_image_path_length check (image_path is null or char_length(image_path) <= 512)
);
create index if not exists ecogram_posts_created_at_idx
  on public.ecogram_posts(created_at desc, id desc);
create index if not exists ecogram_posts_author_idx
  on public.ecogram_posts(author_id, created_at desc);

alter table public.ecogram_profiles enable row level security;
alter table public.ecogram_posts enable row level security;

-- Leitura pública: a rede social exibe nomes públicos, biografia e publicações.
create policy "ecogram_profiles_read" on public.ecogram_profiles
  for select to anon, authenticated using (true);
create policy "ecogram_profiles_insert_own" on public.ecogram_profiles
  for insert to authenticated
  with check ((select auth.uid()) = id);
create policy "ecogram_profiles_update_own" on public.ecogram_profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);
create policy "ecogram_profiles_delete_own" on public.ecogram_profiles
  for delete to authenticated using ((select auth.uid()) = id);

create policy "ecogram_posts_read" on public.ecogram_posts
  for select to anon, authenticated using (true);
create policy "ecogram_posts_insert_own" on public.ecogram_posts
  for insert to authenticated
  with check ((select auth.uid()) = author_id);
create policy "ecogram_posts_update_own" on public.ecogram_posts
  for update to authenticated
  using ((select auth.uid()) = author_id)
  with check ((select auth.uid()) = author_id);
create policy "ecogram_posts_delete_own" on public.ecogram_posts
  for delete to authenticated using ((select auth.uid()) = author_id);

-- Em projetos com Data API e privilégios por tabela explícitos:
grant usage on schema public to anon, authenticated;
grant select on public.ecogram_profiles, public.ecogram_posts to anon;
grant select, insert, update, delete on public.ecogram_profiles, public.ecogram_posts to authenticated;

-- Não há policies de UPDATE/DELETE para visitantes não autenticados.
-- Nunca compartilhar service_role ou secret keys com o navegador.
commit;
