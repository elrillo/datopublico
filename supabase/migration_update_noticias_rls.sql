-- Drop the old policy
drop policy if exists "Escritura de noticias solo para admins" on noticias;

-- Create new policy allowing Admin, Editor, and Writer to manage news
create policy "Gestión de noticias para staff"
on noticias for all
to authenticated
using (public.has_role(auth.uid(), 'writer'))
with check (public.has_role(auth.uid(), 'writer'));
