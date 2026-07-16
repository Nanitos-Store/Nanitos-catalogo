-- ÑAÑITOS — El registro único ahora se identifica por correo (Google),
-- sin pedir número de teléfono. Ejecutar DESPUÉS de 0002.

-- El WhatsApp del cliente pasa a ser opcional (ya no se pide en el formulario;
-- la tienda lo ve cuando el cliente escribe por WhatsApp)
alter table public.clientes
  alter column whatsapp drop not null;

-- El upsert del registro único ahora usa el correo como identificador
create unique index if not exists clientes_email_unico_idx
  on public.clientes (email);
