# ÑAÑITOS — Catálogo mayorista con cierre por WhatsApp

## Qué es este proyecto
Juguetería Ñañitos es una importadora en Bermejo, Bolivia (Calle Colorados, frente al Hotel
La Costa) que vende juguetes, mochilas, peluches, marcadores, neceseres y productos de
temporada POR DOCENA y POR CAJA, a compradores de Bolivia (Bermejo, Tarija, Yacuiba,
Santa Cruz) y del norte argentino (Orán, Tartagal, Salta, Jujuy).

Esta web NO es un ecommerce con carrito ni pasarela de pago. Es un CATÁLOGO NAVEGABLE
que califica al comprador antes de que llegue a WhatsApp. El único objetivo de conversión
es: clic a WhatsApp con contexto (producto + modalidad + datos del cliente).

WhatsApp de ventas: +591 74508045 (configurado en NEXT_PUBLIC_WHATSAPP_NUMBER).

## Stack (obligatorio, no cambiar)
- Next.js 14+ App Router + TypeScript
- Tailwind CSS
- Supabase: Postgres + Storage (imágenes) + Auth (admins)
- Deploy: Vercel (serverless functions para CAPI)
- Imágenes vía next/image con optimización
- ISR (revalidación incremental) en páginas de producto — hay 500+ productos
- Mobile-first ESTRICTO. Presupuesto: LCP < 2,5s en 3G rápido. Sin librerías pesadas de UI.

## Modelo de datos (Supabase)

### productos
id uuid pk, slug text unique, nombre text, descripcion text, categoria_id fk,
personajes text[] (ej. Kuromi, Stitch, Labubu, Capibara, BT21, K-Pop, Brain Rot),
temporada text[] (regreso_clases, verano, san_valentin, mundial_2026, navidad, dia_del_nino),
codigo text (ej. GO003 — código interno del catálogo),
vende_por_docena bool, vende_por_caja bool,
precio_docena numeric null, precio_caja numeric null,
unidad_precio text (por_unidad | por_paquete | por_docena),
moneda text (USD | BOB),
unidades_por_caja int null,
mostrar_precio bool DEFAULT false,
precio_verificado bool DEFAULT false,
en_oferta bool, etiqueta_oferta text null,
disponible bool, destacado bool, orden int,
created_at, updated_at

### producto_imagenes
id, producto_id fk, url (Supabase Storage o /productos/*.webp del seed), alt, orden,
es_principal bool, blur_data_url text null (placeholder base64)

### categorias
id, slug, nombre, icono, orden
Seed inicial: Mochilas / Marcadores y escolar / Peluches / Salvavidas y verano /
Neceseres y organizadores / Mundial 2026 / Juguetes / Regalos / Tendencias /
Económicos (10–25 Bs)

### campanas
id, nombre, titulo, subtitulo, pais_objetivo (AR | BO | ambos),
fecha_inicio, fecha_fin, activa bool, imagen_url, producto_ids uuid[]
Los banners de home se alimentan de esta tabla — nada hardcodeado.

### clientes  ← registro único de compradores
id uuid pk, nombre text, email text, whatsapp text, pais text (BO | AR),
ciudad text, origen text (identificador del primer touchpoint, ej. web-catalogo),
created_at
Índice único en whatsapp. RLS: insert público (vía server action con validación),
select/update solo admins.

### pedidos  ← log de cada clic "Hacer pedido"
id uuid pk, cliente_id fk, producto_id fk, modalidad text (docena | caja | ambas),
mensaje_enviado text, utm jsonb null, created_at
RLS: insert vía server action, lectura solo admins.

### perfiles  ← roles de administración
id uuid pk = auth.users.id, nombre text, rol text (admin | superadmin), activo bool,
created_at
Solo un superadmin puede crear/desactivar otros admins.

## POLÍTICA DE PRECIOS (crítica — los precios cambian seguido)
1. Ningún precio se muestra si mostrar_precio = false → la card muestra
   "Consultar precio por WhatsApp".
2. Ningún precio se muestra si precio_verificado = false, aunque mostrar_precio sea true.
3. Todo dato de seed entra con precio_verificado = false.
4. El admin debe poder actualizar precio + marcar verificado en UNA sola acción.

## FLUJO DE REGISTRO + WHATSAPP (corazón del proyecto)

### Navegación libre
Cualquier visitante navega el catálogo completo sin registrarse. NUNCA bloquear la
navegación con un formulario.

### Registro único (una sola vez en la vida del cliente)
Al hacer clic en "Hacer pedido" por primera vez, se abre un bottom sheet (móvil) /
modal (desktop) con UN solo paso:
- Nombre
- WhatsApp (con selector de código de país BO +591 / AR +54 prellenado según el
  selector de país ya elegido)
- Correo electrónico
- País (prellenado con el selector de país del sitio)
- Ciudad
Al enviar: se guarda en tabla clientes (server action), se guarda un token/id en
localStorage + cookie, y se abre WhatsApp con el mensaje prellenado.
En visitas y pedidos posteriores NO se vuelve a pedir nada: se detecta el registro
local y el clic va directo a WhatsApp. Prever un fallback: si el cliente borra
localStorage, se le pide de nuevo y el server action hace upsert por whatsapp.

### Botón "Hacer pedido" (CTA principal, en card y en página de producto)
Selector de modalidad Docena / Caja / Quiero conocer ambas antes del CTA.
Mensaje wa.me prellenado (codificar emojis y saltos de línea con encodeURIComponent):

  Hola 👋 Soy {nombre} de {ciudad}, {pais}.
  Me interesa: {nombre_producto} (Cód. {codigo})
  Modalidad: {por docena | por caja | quiero conocer ambas}
  Vi el producto en la web de Ñañitos. [web-catalogo]

Cada clic registra una fila en pedidos y dispara evento Lead (Pixel + CAPI).

### Botón flotante de WhatsApp (consulta directa)
Botón verde flotante global (esquina inferior derecha, siempre visible, no tapa CTAs).
Al tocarlo se abre un mini-popover con el texto:
  "¿Tienes una duda? Toma una captura del producto y envíanosla por WhatsApp
   para ayudarte más rápido 📲"
y un botón "Abrir WhatsApp" → wa.me con:
  Hola 👋 Tengo una consulta sobre un producto. [web-consulta]
REGLA CONFIGURABLE: variable de entorno GATE_CONSULTA=true|false decide si el botón
flotante también exige el registro único antes de abrir WhatsApp.
Default: GATE_CONSULTA=false (la consulta directa no se bloquea con formulario;
el pedido sí requiere registro). El cliente puede cambiarlo sin tocar código.

## SELECTOR DE PAÍS (BO / AR)
Primera visita: barra simple "¿Desde dónde nos visitas? 🇧🇴 Bolivia / 🇦🇷 Argentina".
Persistir en localStorage + cookie. Cambia banners de campaña y el bloque de logística.

## LOGÍSTICA POR PAÍS (componente reutilizable — copy EXACTO)
Bolivia:
  "Estamos en Bermejo y realizamos envíos a nivel nacional. Coordinamos el despacho
   por la empresa de transporte de tu preferencia."
Argentina:
  "Nuestra tienda está en Bermejo, Bolivia, muy cerca de la frontera. No realizamos
   envíos directos a Argentina: puedes retirar tu pedido en Bermejo o coordinarlo con
   tu pasero o comisionista de confianza. Te ayudamos con toda la información para
   que el proceso sea simple."
REGLA DURA: la web JAMÁS afirma que Ñañitos envía a Argentina. El visitante argentino
debe ver esta condición ANTES del clic a WhatsApp.

## PÁGINAS
- / (home): header con logo + buscador + botón WhatsApp; selector de país; banner de
  campaña activa (tabla campanas); grilla de categorías; destacados/ofertas;
  "Cómo comprar" en 3 pasos (Elige el producto → Escríbenos por WhatsApp →
  Coordinamos envío o retiro); bloque docena vs caja; bloque logística según país;
  bloque confianza (fotos reales, dirección); footer.
- /catalogo: grilla con filtros combinables (categoría, personaje, temporada,
  modalidad, solo ofertas, solo disponibles), buscador ILIKE/trigram, paginación o
  infinite scroll performante (nunca cargar 500 productos de una), filtros en query
  params (URLs compartibles: /catalogo?categoria=mochilas&pais=AR).
- /producto/[slug]: galería swipe, nombre, descripción, personajes, presentaciones
  con unidades_por_caja, precio según política o "Consultar", selector de modalidad,
  CTA Hacer pedido, relacionados, metadatos OG completos (los links se comparten por
  WhatsApp — la preview con foto es parte de la venta).
- /campana/[slug]: hero de campaña, productos asociados, bloque logística del país
  objetivo, CTA WhatsApp.
- /admin: panel protegido (ver sección Admin).

## PANEL ADMIN (/admin — Supabase Auth email+password)
Lo operan personas NO técnicas desde el celular en la tienda. Simple, grande, táctil.
- CRUD de productos con subida de fotos desde el teléfono (compresión client-side
  antes de subir, ej. browser-image-compression)
- Edición rápida en lista: toggle disponible, toggle en_oferta, precio inline con
  botón único "Guardar y marcar verificado"
- Filtro "precios sin verificar"
- Gestión de campañas/banners (activar por fechas, sin redeploy)
- Gestión de clientes y pedidos (lista, búsqueda, export CSV)
- Gestión de administradores (solo rol superadmin): invitar por email (crea usuario
  vía service role en server action), activar/desactivar. La service role key vive
  SOLO en variables de entorno del servidor.

## TRACKING
- Meta Pixel (NEXT_PUBLIC_META_PIXEL_ID): PageView, ViewContent (producto, con
  content_name + content_category), Search, Lead en cada clic a WhatsApp (con
  producto y modalidad como parámetros).
- CAPI vía route handler en Vercel duplicando ViewContent y Lead con deduplicación
  por event_id. Token por variable de entorno META_CAPI_TOKEN.
- Persistir UTMs de llegada en sessionStorage, adjuntarlas a eventos y a la columna
  utm de pedidos.

## IDENTIDAD VISUAL
Paleta (derivada del logo — AJUSTAR cuando DÚO entregue la paleta oficial):
- Azul celeste primario: #29ABE2
- Verde: #7AC143
- Amarillo: #FFC425
- Naranja: #F7941D
- Rojo/coral (ofertas): #E8434C
- Azul oscuro (texto/contornos): #1B2A4A
- Fondo: blanco / crema #FAF8F5
- WhatsApp: #25D366 (botones de WhatsApp SIEMPRE en este verde reconocible)
Tipografía redondeada y amigable, alta legibilidad móvil (Baloo 2 para títulos +
Nunito para cuerpo, vía next/font/google).
El producto es SIEMPRE el protagonista: fotos grandes, fondos limpios, poco texto
sobre imágenes. Comercial y alegre sin verse infantil-básico.
Assets en /public/brand/: logo-nanitos.png, banner-olas.png.

## VOZ Y COPY (reglas estrictas — validar en cada texto que se escriba)
- Español NEUTRO: "puedes", "quieres", "escríbenos". PROHIBIDO voseo argentino
  ("podés", "querés", "decime") en cualquier texto de la web.
- Tono amigable, familiar, directo. Nunca corporativo ni técnico.
- PALABRAS PROHIBIDAS en todo copy público: revender, negocio, lote, stock (salvo
  necesidad real), rotación, valor percibido, "producto que se vende solo",
  "se mueve", "mira esto", "muchas personas", "ideal para tu negocio".
- Prohibido inventar escasez: nada de "últimas unidades", "se agota", "queda poco".
- La palabra "original" SOLO en productos con autenticidad confirmada.
- "Ñañilovers" (la comunidad) puede usarse con moderación en banners/títulos.
- Frases válidas: "diseños que llaman la atención", "modelos surtidos",
  "disponible por docena y caja", "la gente los pregunta".

## SEO / ACCESIBILIDAD
Metadatos por página y producto, sitemap.xml dinámico, robots.txt.
Schema.org Product SIN offers/price cuando el precio no se muestra.
Keywords naturales: "juguetes por docena Bolivia", "importadora de juguetes Bermejo",
"juguetes por mayor Salta/Orán/Tartagal", "mochilas escolares por caja".
Alt en todas las imágenes, contraste AA, targets táctiles ≥ 44px.

## CRITERIOS DE ACEPTACIÓN (verificar antes de dar por cerrada cada fase)
- [ ] En móvil: encontrar un producto por categoría y llegar a WhatsApp con mensaje
      prellenado correcto en ≤ 3 taps desde el catálogo (cliente ya registrado).
- [ ] Ningún precio sin precio_verificado = true visible en producción.
- [ ] El visitante argentino ve la condición de retiro/pasero antes del CTA.
- [ ] El registro se pide UNA sola vez; visitas posteriores van directo a WhatsApp.
- [ ] Un admin puede cambiar precio y disponibilidad desde el celular sin ayuda.
- [ ] Un superadmin puede agregar y desactivar otros admins desde /admin.
- [ ] Evento Lead dispara en cada clic a WhatsApp con producto y modalidad,
      deduplicado entre Pixel y CAPI.
- [ ] Ningún texto contiene palabras prohibidas ni voseo argentino.
- [ ] LCP < 2,5s en móvil sobre catálogo y producto.
- [ ] Banners de campaña se activan/desactivan por fecha desde la BD, sin redeploy.

## CONVENCIONES DE TRABAJO
- Commits pequeños y descriptivos en español.
- Placeholders siempre como [INSERTAR: descripción] — nunca Lorem Ipsum.
- Cada migración SQL en /supabase/migrations con nombre descriptivo.
- Nunca exponer SUPABASE_SERVICE_ROLE_KEY ni META_CAPI_TOKEN al cliente.
