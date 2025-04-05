-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Create users table (managed by Supabase Auth)
create table if not exists auth.users (
  id uuid references auth.users not null primary key,
  email text
);

-- Create projects table
create table if not exists public.projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  description text,
  metric text,
  budget text,
  status text default 'Pending' check (status in ('Pending', 'Approved', 'Rejected')),
  nft_minted boolean default false,
  funded boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create verifiers table
create table if not exists public.verifiers (
  user_id uuid references auth.users primary key,
  is_verifier boolean default true not null
);

-- Set up Row Level Security (RLS)
alter table public.projects enable row level security;
alter table public.verifiers enable row level security;

-- Projects policies
create policy "Users can view their own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "Users can insert their own projects"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own projects"
  on public.projects for update
  using (auth.uid() = user_id);

-- Verifiers can view all projects
create policy "Verifiers can view all projects"
  on public.projects for select
  using (exists (
    select 1 from public.verifiers
    where user_id = auth.uid() and is_verifier = true
  ));

-- Verifiers can update project status
create policy "Verifiers can update project status"
  on public.projects for update
  using (exists (
    select 1 from public.verifiers
    where user_id = auth.uid() and is_verifier = true
  ));

-- Verifiers policies
create policy "Users can view verifier status"
  on public.verifiers for select
  using (true);

create policy "Only super admins can manage verifiers"
  on public.verifiers for all
  using (auth.uid() in (
    select user_id from public.verifiers
    where is_verifier = true
  ));
