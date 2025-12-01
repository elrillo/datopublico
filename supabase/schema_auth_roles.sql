-- Create a table for public profiles
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  role text check (role in ('admin', 'editor', 'writer', 'user')) default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    'user' -- Default role
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to check if a user has a specific role
create or replace function public.has_role(user_id uuid, required_role text)
returns boolean as $$
declare
  user_role text;
begin
  select role into user_role from public.profiles where id = user_id;
  
  if user_role = 'admin' then
    return true; -- Admin has access to everything
  elsif required_role = 'admin' then
    return false;
  elsif user_role = 'editor' and required_role in ('editor', 'writer', 'user') then
    return true;
  elsif user_role = 'writer' and required_role in ('writer', 'user') then
    return true;
  elsif user_role = 'user' and required_role = 'user' then
    return true;
  else
    return false;
  end if;
end;
$$ language plpgsql security definer;
