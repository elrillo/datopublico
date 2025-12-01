-- Update the check constraint to include 'member' role
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_role_check
CHECK (role IN ('admin', 'editor', 'writer', 'member', 'user'));

-- Update the has_role function to handle 'member'
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
  elsif user_role = 'editor' and required_role in ('editor', 'writer', 'member', 'user') then
    return true;
  elsif user_role = 'writer' and required_role in ('writer', 'member', 'user') then
    return true;
  elsif user_role = 'member' and required_role in ('member', 'user') then
    return true;
  elsif user_role = 'user' and required_role = 'user' then
    return true;
  else
    return false;
  end if;
end;
$$ language plpgsql security definer;
