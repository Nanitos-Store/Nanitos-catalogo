-- Crea el perfil de superadmin para un usuario ya existente en Supabase Auth.
--
-- PASOS:
-- 1. En el dashboard de Supabase → Authentication → Users → "Add user":
--    crea el usuario con email [INSERTAR: email de DÚO] y una contraseña segura
--    (marca "Auto Confirm User").
-- 2. Ejecuta este script: toma ese usuario por email y le crea el perfil.

insert into public.perfiles (id, nombre, rol, activo)
select id, 'DÚO Marketing', 'superadmin', true
from auth.users
where email = '[INSERTAR: email de DÚO]'
on conflict (id) do update set rol = 'superadmin', activo = true;
