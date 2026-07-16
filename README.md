# ÑAÑITOS — Catálogo mayorista con cierre por WhatsApp

Catálogo navegable mobile-first para Juguetería Ñañitos (Bermejo, Bolivia).
No es un ecommerce: el único objetivo de conversión es el clic a WhatsApp con
contexto (producto + modalidad + datos del cliente).

Stack: **Next.js 14 (App Router) + TypeScript + Tailwind CSS + Supabase + Vercel**.

## 1. Instalación local

```bash
npm install
cp .env.example .env.local   # completa las variables (ver abajo)
npm run dev                  # http://localhost:3000
```

El sitio renderiza sin Supabase configurado (muestra un aviso de instalación),
pero para ver el catálogo necesitas los pasos 2 y 3.

## 2. Supabase

1. Crea el proyecto en [supabase.com](https://supabase.com) → New Project →
   nombre `nanitos`, región `sa-east-1` (São Paulo).
2. En **SQL Editor**, ejecuta en orden:
   - `supabase/migrations/0001_esquema_inicial.sql` (tablas + RLS + bucket Storage)
   - `supabase/seed.sql` (10 categorías, 56 productos del catálogo, 2 campañas)
3. Crea el superadmin:
   - Authentication → Users → **Add user** (email de DÚO + contraseña, con
     "Auto Confirm User").
   - Edita y ejecuta `supabase/seed_superadmin.sql` con ese email.
4. Copia las credenciales (Settings → API) a `.env.local`:

| Variable | Dónde está |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key ⚠️ solo servidor, nunca al frontend |

### Imágenes del seed

Las 56 fotos iniciales viven en `/public/productos/*.webp` (recortadas y
optimizadas del catálogo PDF) y se sirven por Vercel con `next/image`.
Las fotos que suban las administradoras desde el panel van al bucket
`productos` de Supabase Storage con compresión client-side. Para reemplazar
una foto del seed: editar el producto en `/admin/productos` y subir la nueva.

## 3. Variables de entorno

Ver `.env.example`. Resumen:

- `NEXT_PUBLIC_WHATSAPP_NUMBER=59174508045` — número que recibe los leads.
- `GATE_CONSULTA` / `NEXT_PUBLIC_GATE_CONSULTA` — `true` exige el registro
  único también en el botón flotante de consulta (default: `false`).
- `NEXT_PUBLIC_META_PIXEL_ID` y `META_CAPI_TOKEN` — tracking de Meta
  (Pixel browser + Conversions API con deduplicación por event_id).
- `NEXT_PUBLIC_SITE_URL` — URL pública (OG, sitemap).

## 4. Deploy en Vercel

1. Importa este repo en [vercel.com](https://vercel.com) (framework: Next.js,
   sin configuración extra).
2. Settings → Environment Variables: carga TODAS las variables de
   `.env.example` con los valores reales (marcar `SUPABASE_SERVICE_ROLE_KEY`
   y `META_CAPI_TOKEN` solo como server-side, jamás `NEXT_PUBLIC_`).
3. Deploy. El dominio final se configura en Settings → Domains cuando el
   cliente lo defina (mientras tanto, el subdominio `*.vercel.app`).

## 5. Estructura

```
app/
  page.tsx                  # home: campaña activa, categorías, destacados…
  catalogo/                 # filtros combinables + infinite scroll por cursor
  producto/[slug]/          # ISR 300s, galería, política de precios, CTA pedido
  campana/[slug]/           # landing de campaña por país
  admin/                    # panel protegido (login + (panel)/…)
  api/meta-capi/            # Conversions API con dedup por event_id
  acciones/cliente.ts       # server actions: registro único + log de pedidos
components/                 # UI pública y de admin
lib/                        # supabase (server/client/admin), whatsapp, precios…
supabase/
  migrations/               # esquema + RLS + bucket
  seed.sql                  # categorías + 56 productos + campañas
  seed_superadmin.sql       # perfil superadmin
public/productos/           # imágenes WebP del seed
public/brand/               # logo (provisional, extraído del catálogo)
```

## 6. Reglas de negocio clave

- **Política de precios**: ningún precio es visible sin `mostrar_precio = true`
  **y** `precio_verificado = true`. Todo el seed entra sin verificar: se
  verifica desde `/admin/productos` con el botón "Guardar y marcar verificado".
- **Registro único**: el formulario se pide una sola vez; se persiste en
  localStorage + cookie y el server action hace upsert por WhatsApp.
- **Argentina**: la web nunca afirma que se envía a Argentina; el bloque de
  logística muestra la condición de retiro en Bermejo / pasero antes del CTA.
- **Campañas**: los banners del home salen de la tabla `campanas` filtrando
  por país y fechas — se activan/desactivan desde el admin sin redeploy.

## 7. Pendientes que dependen del cliente

Buscar `[INSERTAR:` en el código:

- Horarios de atención (footer).
- Enlaces de redes sociales (footer).
- Fotos reales de la tienda y del equipo (home, bloque de confianza).
- Email del superadmin (`supabase/seed_superadmin.sql`).
- Pixel ID y token CAPI reales.
- Logo y banner oficiales en `/public/brand/` (hoy hay una versión provisional
  extraída del catálogo PDF).
- Dominio final en Vercel.
