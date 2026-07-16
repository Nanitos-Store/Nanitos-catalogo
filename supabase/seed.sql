-- ÑAÑITOS — Seed inicial: categorías, productos del catálogo Emprendedor,
-- imágenes y campañas. Todos los precios entran SIN verificar y ocultos
-- (mostrar_precio = false, precio_verificado = false).

-- Categorías
insert into public.categorias (slug, nombre, icono, orden) values ('tendencias', 'Tendencias', '🔥', 1) on conflict (slug) do nothing;
insert into public.categorias (slug, nombre, icono, orden) values ('peluches', 'Peluches', '🧸', 2) on conflict (slug) do nothing;
insert into public.categorias (slug, nombre, icono, orden) values ('mochilas', 'Mochilas', '🎒', 3) on conflict (slug) do nothing;
insert into public.categorias (slug, nombre, icono, orden) values ('juguetes', 'Juguetes', '🪀', 4) on conflict (slug) do nothing;
insert into public.categorias (slug, nombre, icono, orden) values ('marcadores-escolar', 'Marcadores y escolar', '✏️', 5) on conflict (slug) do nothing;
insert into public.categorias (slug, nombre, icono, orden) values ('neceseres', 'Neceseres y organizadores', '👝', 6) on conflict (slug) do nothing;
insert into public.categorias (slug, nombre, icono, orden) values ('regalos', 'Regalos', '🎁', 7) on conflict (slug) do nothing;
insert into public.categorias (slug, nombre, icono, orden) values ('salvavidas-verano', 'Salvavidas y verano', '🏖️', 8) on conflict (slug) do nothing;
insert into public.categorias (slug, nombre, icono, orden) values ('mundial-2026', 'Mundial 2026', '⚽', 9) on conflict (slug) do nothing;
insert into public.categorias (slug, nombre, icono, orden) values ('economicos', 'Económicos (10–25 Bs)', '💰', 10) on conflict (slug) do nothing;

-- Productos
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('bolsa-peluche-labubu', 'Bolsa Peluche Labubu', 'Bolsa Peluche Labubu: con el diseño de Labubu, modelos surtidos con colores vivos y terminaciones de calidad. Perfecta para la temporada escolar y para quienes buscan diseños que llaman la atención. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'mochilas'),
   '{"Labubu"}', '{}', 'GO003',
   true, true, 1.8, 1.5, 'por_unidad',
   'USD', 240, false, false, false,
   null, true, true, 2)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/bolsa-peluche-labubu.webp', 'Bolsa Peluche Labubu — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAADQAQCdASoQABAAA4BaJYwAAudqrM4AAAD++LAzQ0Gu8Su2Ykj2Xyz2mxHafyrjKpdk398BViHecn1+KOvIAA77AXvxvkABm5MtQAAA'
from public.productos where slug = 'bolsa-peluche-labubu'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('almohada-stitch-con-manta', 'Almohada Stitch con Manta', 'Almohada Stitch con Manta: peluche suave y abrazable de Stitch, con acabados prolijos que lucen muy bien en vitrina. Un diseño que llama la atención y que la gente pregunta. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'peluches'),
   '{"Stitch"}', '{}', 'GO034',
   true, true, 6.9, 6.0, 'por_unidad',
   'USD', 50, false, false, false,
   null, true, false, 3)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/almohada-stitch-con-manta.webp', 'Almohada Stitch con Manta — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAABwAgCdASoQABAAA4BaJZgCdH8AGBt58XZvgofYAP74sFUCbTSKyzuPZEZT3eHyX5qxajDLKDeFy0vcyrN7vv0twVU/WNVyFzh6Yrt3PS/NVjMNKb3Y4790UbGdqZcAAAA='
from public.productos where slug = 'almohada-stitch-con-manta'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('peluche-collar-labubu', 'Peluche Collar Labubu', 'Peluche Collar Labubu: peluche suave y abrazable de Labubu, con acabados prolijos que lucen muy bien en vitrina. Un diseño que llama la atención y que la gente pregunta. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'peluches'),
   '{"Labubu"}', '{}', 'GO038',
   true, true, 1.5, 1.3, 'por_unidad',
   'USD', 360, false, false, false,
   null, true, false, 4)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/peluche-collar-labubu.webp', 'Peluche Collar Labubu — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAADwAQCdASoQABAAA4BaJQAAXPGotmPQxCAA/vfp5dSzUi+N7a6b+YcEn0cA+xr9V2EUg3YNFjUJNC6UfzkbZXwqgd3VdRqT3zDu2Cu/yHnAh8y6ON+D7sMsQ8B52yoAAAA='
from public.productos where slug = 'peluche-collar-labubu'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('peluche-labubu', 'Peluche Labubu', 'Peluche Labubu: peluche suave y abrazable de Labubu, con acabados prolijos que lucen muy bien en vitrina. Un diseño que llama la atención y que la gente pregunta. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'peluches'),
   '{"Labubu"}', '{}', 'GO040',
   true, true, 1.0, 0.9, 'por_unidad',
   'USD', 360, false, false, false,
   null, true, false, 5)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/peluche-labubu.webp', 'Peluche Labubu — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAABwAgCdASoQABAAA4BaJZQC7H8Agoi/l77aUf1UAP74sGsHZWn167HSTYrqseF4fOfUS7XCwQU5FP47FI2tp2F/5/kLM/2QKL+SnIGwABw08AAA'
from public.productos where slug = 'peluche-labubu'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('cocina-capi', 'Cocina Capi', 'Cocina Capi: diversión garantizada de Capibara. Un juguete entretenido, resistente y con gran presentación para exhibir. Modelos surtidos, disponible por docena y por caja.',
   (select id from public.categorias where slug = 'juguetes'),
   '{"Capibara"}', '{}', 'GO025',
   true, true, 1.7, 1.5, 'por_unidad',
   'USD', 120, false, false, false,
   null, true, false, 6)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/cocina-capi.webp', 'Cocina Capi — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRnIAAABXRUJQVlA4IGYAAAAQAgCdASoQABAAA4BaJQBOkERjAF/bBEUgAP7wtWi766unHxc3oJVe1cj1BVpSUxlFu5sP73euMvIo8DM/V+k6EmDTpLI98z1/gxWCwc2ZXySTp7sO4Xg4b7EZac9EvjdVNfAPYAA='
from public.productos where slug = 'cocina-capi'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('brazalete-stitch', 'Brazalete Stitch', 'Brazalete Stitch: peluche suave y abrazable de Stitch, con acabados prolijos que lucen muy bien en vitrina. Un diseño que llama la atención y que la gente pregunta. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'peluches'),
   '{"Stitch"}', '{}', 'GO090',
   true, true, 1.0, 0.8, 'por_unidad',
   'USD', 360, false, false, false,
   null, true, false, 7)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/brazalete-stitch.webp', 'Brazalete Stitch — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRm4AAABXRUJQVlA4IGIAAABQAgCdASoQABAAA4BaJZACxC8AGCbq1T8RqgAA/viyvIOFRAR7G4V66YS4LNlECUegSpOm62WOpOHz0BsCkUlf/wYRp1XKICMIZuGGIPccWiYPnDSyHqwU2QdcdZzOH4QAAA=='
from public.productos where slug = 'brazalete-stitch'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('mini-lampara-stitch', 'Mini Lampara Stitch', 'Mini Lampara Stitch: una opción de regalo de Stitch con excelente presentación. Diseños que llaman la atención, listos para exhibir. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'regalos'),
   '{"Stitch"}', '{}', 'GO-223',
   true, true, 2.0, 1.8, 'por_unidad',
   'USD', 120, false, false, false,
   null, true, false, 8)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/mini-lampara-stitch.webp', 'Mini Lampara Stitch — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAABQAgCdASoQABAAA4BaJYgCdDiAAUpWVCAfdtAA/vf5ZGVrDM0pviA+EtSp/9Wx0/be66wvycq04+kPy2CBcbPYCszz/Cn9Tmbwl8vFCoNSfIMFPIZtw3v5m8dO0AAA'
from public.productos where slug = 'mini-lampara-stitch'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('peluche-capibara-con-chalina', 'Peluche Capibara con Chalina', 'Peluche Capibara con Chalina: peluche suave y abrazable de Capibara, con acabados prolijos que lucen muy bien en vitrina. Un diseño que llama la atención y que la gente pregunta. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'peluches'),
   '{"Capibara"}', '{}', 'G0470',
   true, true, 1.0, 0.9, 'por_unidad',
   'USD', 360, false, false, false,
   null, true, false, 9)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/peluche-capibara-con-chalina.webp', 'Peluche Capibara con Chalina — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRnwAAABXRUJQVlA4IHAAAAAwAgCdASoQABAAA4BaJbACdADpIiapyrBeAAD+9/3Z4yY5eNLMkJZErOWv2TwjjzEWQr91FgkViP07SBh/26ZsTFTmMN2StbEBbksq8IlTnPb/Sh3PrJbdywCx7bJXD9FXCEsn/PGc2Qs8EFmdNAAA'
from public.productos where slug = 'peluche-capibara-con-chalina'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('anillo-3-mix', 'Anillo 3 Mix', 'Anillo 3 Mix: precio de entrada accesible con gran presentación de Capibara y Stitch y Labubu. Modelos surtidos, perfecto para completar tu pedido. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'economicos'),
   '{"Capibara","Stitch","Labubu"}', '{}', 'GO315',
   true, true, 0.16, 0.14, 'por_unidad',
   'USD', 5760, false, false, false,
   null, true, false, 10)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/anillo-3-mix.webp', 'Anillo 3 Mix — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAAAQAgCdASoQABAAA4BaJYwCdH8AGBT+g1sAAP74sES/VWg9NOzENmqhcACO6r0FPx31338ALGOoou2aA1fXsSAIAAA='
from public.productos where slug = 'anillo-3-mix'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('trabalavo-3-modelos-mix', 'Trabalavo 3 Modelos Mix', 'Trabalavo 3 Modelos Mix: una opción de regalo con excelente presentación. Diseños que llaman la atención, listos para exhibir. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'regalos'),
   '{}', '{}', 'GO-316',
   true, true, 1.0, 0.95, 'por_unidad',
   'USD', 720, false, false, false,
   null, true, false, 11)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/trabalavo-3-modelos-mix.webp', 'Trabalavo 3 Modelos Mix — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAADwAQCdASoQABAAA4BaJZQC7AEOzwyRwAAA/viwRKxG9EcdMeCr5CXvZPQA+kQDqcZEnEoa5oS4ZLXo+Jb4z7Q91eQcOkxw4caWscZGANJBwAAA'
from public.productos where slug = 'trabalavo-3-modelos-mix'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('set-de-joyeria-4-modelos', 'Set de Joyeria 4 Modelos', 'Set de Joyeria 4 Modelos: una opción de regalo con excelente presentación. Diseños que llaman la atención, listos para exhibir. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'regalos'),
   '{}', '{}', 'GO-317',
   true, true, 1.2, 1.0, 'por_unidad',
   'USD', 528, false, false, false,
   null, true, false, 12)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/set-de-joyeria-4-modelos.webp', 'Set de Joyeria 4 Modelos — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRnwAAABXRUJQVlA4IHAAAABwAgCdASoQABAAA4BaJZQCdAYx3yYfCOyZnUGAAP73QhEjJlTYTaWGzk4PAjsfguLtPKkmkRsAUQLuJEg+SaLC07zTZuOQCCv+Fkt7dZHrRsPIEJhodZaU45i7+NDdC5eEiE176Nv/zJoky0VUwAAA'
from public.productos where slug = 'set-de-joyeria-4-modelos'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('lente-de-sol-3-modelos-mix', 'Lente de Sol 3 Modelos Mix', 'Lente de Sol 3 Modelos Mix: perfecto para la temporada de sol. Modelos surtidos con colores alegres. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'salvavidas-verano'),
   '{}', '{"verano"}', 'GO-318',
   true, true, 1.0, 0.95, 'por_unidad',
   'USD', 720, false, false, false,
   null, true, false, 13)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/lente-de-sol-3-modelos-mix.webp', 'Lente de Sol 3 Modelos Mix — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAADwAQCdASoQABAAA4BaJQAO0aBj7wdsvDgA/vcsJ754OvbTxSMDB1jrCyuoO1Ddd3LdurYVKAGMrOyz2eD8h2P5+e50bT/eJs/HvELwlWqeufe7/ByoAA=='
from public.productos where slug = 'lente-de-sol-3-modelos-mix'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('lapicera-bryan-roth', 'Lapicera Bryan Roth', 'Lapicera Bryan Roth: útiles escolares de Brain Rot con diseños divertidos que los chicos piden. Presentación en caja exhibidora lista para mostrar. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'marcadores-escolar'),
   '{"Brain Rot"}', '{"regreso_clases"}', 'GO-450',
   true, true, 0.3, 0.25, 'por_unidad',
   'USD', 1296, false, false, false,
   null, true, false, 14)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/lapicera-bryan-roth.webp', 'Lapicera Bryan Roth — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAADwAQCdASoQABAAA4BaJYwAAv2runfxyAAA/vfwA/8F/ep0xhSnfA0QL+9kHBTVzieYREsFF1z6tW/8WOKS+fXusqPo6BHPx2IKhi4GbcsnRgkhkTQDZB7AAAA='
from public.productos where slug = 'lapicera-bryan-roth'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('lapicero-stitch', 'Lapicero Stitch', 'Lapicero Stitch: útiles escolares de Stitch con diseños divertidos que los chicos piden. Presentación en caja exhibidora lista para mostrar. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'marcadores-escolar'),
   '{"Stitch"}', '{"regreso_clases"}', 'GO-443',
   true, true, 0.3, 0.25, 'por_unidad',
   'USD', 1296, false, false, false,
   null, true, false, 15)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/lapicero-stitch.webp', 'Lapicero Stitch — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRnYAAABXRUJQVlA4IGoAAAAQAgCdASoQABAAA4BaJYgCsAEPAeZC6MdQAP7yjSZbS+H7WSh+pAF31cyKAffCB4JvXbGds/gOwOH5Eo7voFnhLMfwRiBsF39m383IEISpOtCAhxUax/d2eOcImOLMAUKySgB6HMwOAAAA'
from public.productos where slug = 'lapicero-stitch'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('lapicera-brain-rot', 'Lapicera Brain Rot', 'Lapicera Brain Rot: útiles escolares de Brain Rot con diseños divertidos que los chicos piden. Presentación en caja exhibidora lista para mostrar. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'marcadores-escolar'),
   '{"Brain Rot"}', '{"regreso_clases"}', 'GO-444',
   true, true, 0.25, 0.2, 'por_unidad',
   'USD', 1296, false, false, false,
   null, true, false, 16)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/lapicera-brain-rot.webp', 'Lapicera Brain Rot — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRoIAAABXRUJQVlA4IHYAAAAwAgCdASoQABAAA4BaJYwCdH8AGCFz2+EX6AD+4plVamc4NxXtnhl2lMZRdtlmdQcFpDdLGDug7ccBvcYMHr+WitdEf50oxynApzMdw9CThYVNgWkP8A7s2OSB1w8Br0OkZ8mBQoXBLBkzOXYKWWHzMma8kAAA'
from public.productos where slug = 'lapicera-brain-rot'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('ahorrador-stitch', 'Ahorrador Stitch', 'Ahorrador Stitch: diversión garantizada de Stitch. Un juguete entretenido, resistente y con gran presentación para exhibir. Modelos surtidos, disponible por docena y por caja.',
   (select id from public.categorias where slug = 'juguetes'),
   '{"Stitch"}', '{}', 'GO-320',
   true, true, 4.0, 3.5, 'por_unidad',
   'USD', 48, false, false, false,
   null, true, false, 17)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/ahorrador-stitch.webp', 'Ahorrador Stitch — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRnQAAABXRUJQVlA4IGgAAAAwAgCdASoQABAAA4BaJYgCdAYvXvtwMZVmEAD+8nNUyKqmN6mWSWXyeYYUtQBaoH0xLja9WxQ5Zi7zNPoszLnUlHVHLiOOUBFm4nfYu4dV8X4egSsAsqh2AlokE4t/6Tm+MxU0Cr0AAA=='
from public.productos where slug = 'ahorrador-stitch'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('ahorrador-labubu', 'Ahorrador Labubu', 'Ahorrador Labubu: diversión garantizada de Labubu. Un juguete entretenido, resistente y con gran presentación para exhibir. Modelos surtidos, disponible por docena y por caja.',
   (select id from public.categorias where slug = 'juguetes'),
   '{"Labubu"}', '{}', 'GO-321',
   true, true, 4.0, 3.5, 'por_unidad',
   'USD', 48, false, false, false,
   null, true, false, 18)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/ahorrador-labubu.webp', 'Ahorrador Labubu — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAADQAQCdASoQABAAA4BaJZACdAEOr5SWQAD+90ITyCy4KIcQAVPFIfCYVIxMQ+zUpuPZOB9TaHDOOZcXl/8OmTFg2W2NPuYDUeX0wD+A0hqn+6auXKcuzcSUimJEbckARkShivx8jrW68BQqAAA='
from public.productos where slug = 'ahorrador-labubu'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('ahorrador-capi', 'Ahorrador Capi', 'Ahorrador Capi: diversión garantizada de Capibara. Un juguete entretenido, resistente y con gran presentación para exhibir. Modelos surtidos, disponible por docena y por caja.',
   (select id from public.categorias where slug = 'juguetes'),
   '{"Capibara"}', '{}', 'GO-322',
   true, true, 4.0, 3.5, 'por_unidad',
   'USD', 48, false, false, false,
   null, true, false, 19)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/ahorrador-capi.webp', 'Ahorrador Capi — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRnAAAABXRUJQVlA4IGQAAABQAgCdASoQABAAA4BaJQBOj+ADFHe31OmyiAAA/vPQvCbvNE2Q9LM27JoYuJMW1NYR3DsnqSUDifKsnThI1d1UGE3cYrYxekBA5Ile4FpSq982VinpPNUURM+kTLDsiiPGAAAA'
from public.productos where slug = 'ahorrador-capi'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('pescamashi-1-cana', 'Pescamashi 1 Cana', 'Pescamashi 1 Cana: diversión garantizada. Un juguete entretenido, resistente y con gran presentación para exhibir. Modelos surtidos, disponible por docena y por caja.',
   (select id from public.categorias where slug = 'juguetes'),
   '{}', '{}', 'GO-389',
   true, true, 0.9, 0.8, 'por_unidad',
   'USD', null, false, false, false,
   null, true, false, 20)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/pescamashi-1-cana.webp', 'Pescamashi 1 Cana — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRmgAAABXRUJQVlA4IFwAAADQAQCdASoQABAAA4BaJYgCsAED/FWuwAD++BVi36fiKIr+weXm+wiWdPsqpUhAB+B2QExDbOLlJMaAT54VmSJLL0P3qSlS6qRPASr7zFvEjis2YwBTwA1VbQAAAA=='
from public.productos where slug = 'pescamashi-1-cana'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('pescamashi-2-canas', 'Pescamashi 2 Canas', 'Pescamashi 2 Canas: diversión garantizada. Un juguete entretenido, resistente y con gran presentación para exhibir. Modelos surtidos, disponible por docena y por caja.',
   (select id from public.categorias where slug = 'juguetes'),
   '{}', '{}', 'GO-390',
   true, true, 2.2, 1.95, 'por_unidad',
   'USD', 72, false, false, false,
   null, true, false, 21)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/pescamashi-2-canas.webp', 'Pescamashi 2 Canas — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRoQAAABXRUJQVlA4IHgAAABwAgCdASoQABAAA4BaJbACdH8AqQCoxm/GDKIAAP73XBgzjnklrgHeKvptI4TmZDZ5BKDuOL2TQTdQCNKdxA7gY11Ywc062G7xkmUs6NCSRd++ky5JtBsKxcLWer2788wZICI10IWhUjyDaFF+uDqnKyhhgZ1t4AA='
from public.productos where slug = 'pescamashi-2-canas'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('pescamashi-grande-en-blister', 'Pescamashi Grande en Blister', 'Pescamashi Grande en Blister: diversión garantizada. Un juguete entretenido, resistente y con gran presentación para exhibir. Modelos surtidos, disponible por docena y por caja.',
   (select id from public.categorias where slug = 'juguetes'),
   '{}', '{}', 'GO-391',
   true, true, 1.2, 1.0, 'por_unidad',
   'USD', 96, false, false, false,
   null, true, false, 22)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/pescamashi-grande-en-blister.webp', 'Pescamashi Grande en Blister — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAADQAQCdASoQABAAA4BaJZgCdADwz7JtAAD++LpjQDGsQmOzXggqAXtakvuiqbZuDMT+7zTmbiAo2/ajLdjWM5LCH46gZLNUAoAL8um8a7xZh7O6NJIAAA=='
from public.productos where slug = 'pescamashi-grande-en-blister'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('porta-cosmetiquera-peluche', 'Porta Cosmetiquera Peluche', 'Porta Cosmetiquera Peluche: organizador práctico de Kuromi y Stitch y Capibara con materiales brillantes y cierre reforzado. Un accesorio que combina utilidad y diseño. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'neceseres'),
   '{"Kuromi","Stitch","Capibara"}', '{}', 'GO-386',
   true, true, 1.5, 1.3, 'por_unidad',
   'USD', 240, false, false, false,
   null, true, false, 23)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/porta-cosmetiquera-peluche.webp', 'Porta Cosmetiquera Peluche — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAABQAgCdASoQABAAA4BaJYgC7H8AgqC/rTOHPZwA/viug7gz+Dt/+tShS+rO6OmdZn0lSZZyG2g6kOz3Llln+cHzMEZffed+d99gyx8EYQQyhrC8iDAAAA=='
from public.productos where slug = 'porta-cosmetiquera-peluche'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('pechador-labubu', 'Pechador Labubu', 'Pechador Labubu: diversión garantizada de Labubu. Un juguete entretenido, resistente y con gran presentación para exhibir. Modelos surtidos, disponible por docena y por caja.',
   (select id from public.categorias where slug = 'juguetes'),
   '{"Labubu"}', '{}', 'GO-587',
   true, true, 1.95, 1.7, 'por_unidad',
   'USD', 72, false, false, false,
   null, true, false, 24)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/pechador-labubu.webp', 'Pechador Labubu — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAAAQAgCdASoQABAAA4BaJQBdgCHgVJ0/IESIAP73QhNGnvVa+RfDpK8CF6BsM09Y9E6lLSo+HvY8H3WL4ais93AhqiybleqoXqRoK6CN/5MtpP5q7+huzD2MAAA='
from public.productos where slug = 'pechador-labubu'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('pistola-blister', 'Pistola Blister', 'Pistola Blister: diversión garantizada. Un juguete entretenido, resistente y con gran presentación para exhibir. Modelos surtidos, disponible por docena y por caja.',
   (select id from public.categorias where slug = 'juguetes'),
   '{}', '{}', 'GO-590',
   true, true, 1.2, 1.0, 'por_unidad',
   'USD', 180, false, false, false,
   null, true, false, 25)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/pistola-blister.webp', 'Pistola Blister — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRn4AAABXRUJQVlA4IHIAAABQAgCdASoQABAAA4BaJbACdH8AGJ0+B8O8sCgA/u5mOs+KWdxbQHNLtO4ZRuaOHEQua5DqJf3Db8D7X9+KNYSoyD94jNrJfR+TiiQWAAhw5zEEP3LZJ5/4J/vjvYchg8Kcs4yF3074I6W403NUnXcYgAA='
from public.productos where slug = 'pistola-blister'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('snoopy-bailador', 'Snoopy Bailador', 'Snoopy Bailador: diversión garantizada de Snoopy. Un juguete entretenido, resistente y con gran presentación para exhibir. Modelos surtidos, disponible por docena y por caja.',
   (select id from public.categorias where slug = 'juguetes'),
   '{"Snoopy"}', '{}', 'GO-617',
   true, true, 5.0, 4.5, 'por_unidad',
   'USD', 96, false, false, false,
   null, true, false, 26)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/snoopy-bailador.webp', 'Snoopy Bailador — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRpIAAABXRUJQVlA4IIYAAACQAgCdASoQABAAA4BaJbACdH8AgpC/36p6bZiIAAD+7j8i2Uvfi2qlBmFrouK17IiaBfCdW0HupnmIfjlLTLn4JU3SQxBQIOUst7FOwaHAIo7cYTlvYNMP4T393wLz4Q3+Z0FmWZ4PqHS/+mNbWacAgC15jLNzhpO2/l1TTqNGBqJet0tAAA=='
from public.productos where slug = 'snoopy-bailador'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('bailador-tung-tung', 'Bailador Tung Tung', 'Bailador Tung Tung: con el diseño de Brain Rot, uno de los diseños más pedidos del momento. La gente lo pregunta y se reconoce al instante. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'tendencias'),
   '{"Brain Rot"}', '{}', 'GO610',
   true, true, 2.8, 2.0, 'por_unidad',
   'USD', 60, false, false, false,
   null, true, false, 27)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/bailador-tung-tung.webp', 'Bailador Tung Tung — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRqQAAABXRUJQVlA4IJgAAADQAgCdASoQABAAA4BaJbACdDiKxyVHddscmOguSfQAAP72a3LfKb0dhtTJxMOIKgbvRA+/NB7QKJqbT3DseeV+QW0B1IaAA48sVjHUlBdy7qIiHUJuqu+89n1fFoUPxizW/Ih1Vps7/BXgerOqNyxocsJVa1U4c7ch85W762E13VUicrHAG4DJVe9/fFIvODxoXcwu+iHkAA=='
from public.productos where slug = 'bailador-tung-tung'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('microfono-brain-rot', 'Microfono Brain Rot', 'Microfono Brain Rot: con el diseño de Brain Rot, uno de los diseños más pedidos del momento. La gente lo pregunta y se reconoce al instante. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'tendencias'),
   '{"Brain Rot"}', '{}', 'GO611',
   true, true, 4.5, 4.0, 'por_unidad',
   'USD', 72, false, false, false,
   null, true, false, 28)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/microfono-brain-rot.webp', 'Microfono Brain Rot — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRqQAAABXRUJQVlA4IJgAAACwAgCdASoQABAAA4BaJbACdH8D2JCI2L/ZtAQAzSQA/mzzmK2LIv7aZLi3GEVUIdkfRxU32ePixy5OPtrU7sIGJ8Sh3D26sGtrD7mxUY8Cy4Hn2d8Jw/0tC4c2Pfk3xa2WrfIIN/wqXyiMDa4laTtUNybTLdUDAo0y36gsc8hBOSKzwzQ5435lN0zVDSjIRLuyN195Z5oAAA=='
from public.productos where slug = 'microfono-brain-rot'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('porta-cosmetiquera-kuromi-3-en-1', 'Porta Cosmetiquera Kuromi 3 en 1', 'Porta Cosmetiquera Kuromi 3 en 1: organizador práctico de Kuromi y Cinnamoroll con materiales brillantes y cierre reforzado. Un accesorio que combina utilidad y diseño. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'neceseres'),
   '{"Kuromi","Cinnamoroll"}', '{}', 'GO380',
   true, true, 2.4, 2.0, 'por_unidad',
   'USD', 240, false, false, false,
   null, true, true, 29)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/porta-cosmetiquera-kuromi-3-en-1.webp', 'Porta Cosmetiquera Kuromi 3 en 1 — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRnIAAABXRUJQVlA4IGYAAACwAgCdASoQABAAA4BaJYgCdH8GJ/i14d9H0QpczuAA/vf5d5wOb6DJGnUZ6QRYCUvMQIX/BCuXmcNQl+c1gUcXEWAQ1e5Y+cCppqnbflGx4luaaFHnedaL+SkHAuJoeNzLkP7BAAA='
from public.productos where slug = 'porta-cosmetiquera-kuromi-3-en-1'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('porta-cosmetiquera-stitch', 'Porta Cosmetiquera Stitch', 'Porta Cosmetiquera Stitch: organizador práctico de Stitch con materiales brillantes y cierre reforzado. Un accesorio que combina utilidad y diseño. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'neceseres'),
   '{"Stitch"}', '{}', 'GO383',
   true, true, 2.4, 2.0, 'por_unidad',
   'USD', 300, false, false, false,
   null, true, false, 30)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/porta-cosmetiquera-stitch.webp', 'Porta Cosmetiquera Stitch — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAADQAQCdASoQABAAA4BaJZgAAuc/C8WAAAD++LAzUfrGy38wDcskzLfRubp946LSfRDiaHSv/s66AxdkGzorKRMGRy75qrMi0BExxzs5ABM6yUeg4AA='
from public.productos where slug = 'porta-cosmetiquera-stitch'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('porta-cosmetiquera-capibara-3-en-1', 'Porta Cosmetiquera Capibara 3 en 1', 'Porta Cosmetiquera Capibara 3 en 1: organizador práctico de Capibara con materiales brillantes y cierre reforzado. Un accesorio que combina utilidad y diseño. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'neceseres'),
   '{"Capibara"}', '{}', 'GO385',
   true, true, 2.4, 2.0, 'por_unidad',
   'USD', 300, false, false, false,
   null, true, false, 31)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/porta-cosmetiquera-capibara-3-en-1.webp', 'Porta Cosmetiquera Capibara 3 en 1 — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRoAAAABXRUJQVlA4IHQAAAAwAgCdASoQABAAA4BaJYgCdAEQItEDgxdWoAD+8nNYzYYQ/vauximPVoovCQ8JVhPW6yMLJhRx/geh4JFz118y5+aKtFlIMqM3iWKvmXmMmszKcR7mG6qRZXSoFe/lOInrX0LpyJxl7wCY1WAYBCGlviFwAA=='
from public.productos where slug = 'porta-cosmetiquera-capibara-3-en-1'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('porta-cosmetiquera-4-en-1', 'Porta Cosmetiquera 4 en 1', 'Porta Cosmetiquera 4 en 1: organizador práctico de Stitch con materiales brillantes y cierre reforzado. Un accesorio que combina utilidad y diseño. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'neceseres'),
   '{"Stitch"}', '{}', 'GO384',
   true, true, 6.0, 5.0, 'por_unidad',
   'USD', 120, false, false, false,
   null, true, false, 32)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/porta-cosmetiquera-4-en-1.webp', 'Porta Cosmetiquera 4 en 1 — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAADwAQCdASoQABAAA4BaJZgAD4/Qa247SEAA/viwYZkZ6/E/5dpiCbJWcwZTFSn6CelP5u5yJOJ2OlnHi7H2Hyx4xaFL+HthRyHcWtfrYuTG/UnJDMGAAA=='
from public.productos where slug = 'porta-cosmetiquera-4-en-1'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('poppies-surtidos-4-modelos', 'Poppies Surtidos 4 Modelos', 'Poppies Surtidos 4 Modelos: diversión garantizada de Capibara y Stitch y Brain Rot. Un juguete entretenido, resistente y con gran presentación para exhibir. Modelos surtidos, disponible por docena y por caja.',
   (select id from public.categorias where slug = 'juguetes'),
   '{"Capibara","Stitch","Brain Rot"}', '{}', 'GO-629',
   true, true, 1.2, 1.0, 'por_unidad',
   'USD', 144, false, false, false,
   null, true, false, 33)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/poppies-surtidos-4-modelos.webp', 'Poppies Surtidos 4 Modelos — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRnoAAABXRUJQVlA4IG4AAADwAQCdASoQABAAA4BaJbAC7AEO93R0dAAA/vP8WYHJC+qLI0cxm1o9hsEQBYBSh1Zgz11Y71a6GTVO9CU4XUvqgk0qfJ+5KCN6OxNX6ftFBRQADghn5S3vu6syZlEdR/rntn14mSxlUQYf55wAAA=='
from public.productos where slug = 'poppies-surtidos-4-modelos'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('peluche-stitch', 'Peluche Stitch', 'Peluche Stitch: peluche suave y abrazable de Stitch, con acabados prolijos que lucen muy bien en vitrina. Un diseño que llama la atención y que la gente pregunta. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'peluches'),
   '{"Stitch"}', '{}', 'PL085',
   true, true, 2.1, 1.9, 'por_unidad',
   'USD', 240, false, false, false,
   null, true, false, 34)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/peluche-stitch.webp', 'Peluche Stitch — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRnAAAABXRUJQVlA4IGQAAAAwAgCdASoQABAAA4BaJbACdAEPEEQIhdR99AD+9+pgU/I281scBV66Np5LKWZXke/LJVmSoynBoGR2oqGcmXXoPDDQZUg/5VUI/jqS3iEuOZR7XaRMKpJFrI5NKDlAzcUzgAAA'
from public.productos where slug = 'peluche-stitch'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('peluche-labubu-mini', 'Peluche Labubu Mini', 'Peluche Labubu Mini: peluche suave y abrazable de Labubu, con acabados prolijos que lucen muy bien en vitrina. Un diseño que llama la atención y que la gente pregunta. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'peluches'),
   '{"Labubu"}', '{}', 'PL088',
   true, true, 1.0, 0.95, 'por_unidad',
   'USD', 360, false, false, false,
   null, true, false, 35)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/peluche-labubu-mini.webp', 'Peluche Labubu Mini — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAADwAQCdASoQABAAA4BaJQBdgCHUtitbCagA/vfoCRpWC7JaqtQN1MXvrTEve4ZWmF1g0iTiThyMS8P4xjkwK4TmLxMqOo9bhiryH/+wXPEGB1+ip2OdZAAA'
from public.productos where slug = 'peluche-labubu-mini'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('peluche-capibara-love', 'Peluche Capibara Love', 'Peluche Capibara Love: peluche suave y abrazable de Capibara, con acabados prolijos que lucen muy bien en vitrina. Un diseño que llama la atención y que la gente pregunta. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'peluches'),
   '{"Capibara"}', '{}', 'PL089',
   true, true, 1.0, 0.95, 'por_unidad',
   'USD', 360, false, false, false,
   null, true, true, 36)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/peluche-capibara-love.webp', 'Peluche Capibara Love — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRoIAAABXRUJQVlA4IHYAAAAwAgCdASoQABAAA4BaJbACdAEO5NO8b3OcAAD+9xoYEC9QB3/Emg+nT/TJ2dHod2VyLwnsX9UdddN6EvBoc54PGK2L4QJdCo9DV9UJrJfaxUKDqPergxYOkDIyE33/VpAMhhTRqK3pfGUoZEKn1J3Dy99tAAAA'
from public.productos where slug = 'peluche-capibara-love'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('brazalete-brain-rot', 'Brazalete Brain Rot', 'Brazalete Brain Rot: precio de entrada accesible con gran presentación de Brain Rot. Modelos surtidos, perfecto para completar tu pedido. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'economicos'),
   '{"Brain Rot"}', '{}', 'GO-253',
   true, true, 0.6, 0.5, 'por_unidad',
   'USD', 300, false, false, false,
   null, true, false, 37)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/brazalete-brain-rot.webp', 'Brazalete Brain Rot — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRnIAAABXRUJQVlA4IGYAAABQAgCdASoQABAAA4BaJbACdH8Agki/pR9zLPgA/viv+wiHdYS3iUdQmT0VclCoQD0MxKrxx3SvP6mi2GhnOrblBmXgsA2ls9Ty0fwhEzXx9dWO2hddQUDILZS4sLGLOKRIO+PWdAA='
from public.productos where slug = 'brazalete-brain-rot'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('set-de-maquillaje-maleta-stitch', 'Set de Maquillaje Maleta Stitch', 'Set de Maquillaje Maleta Stitch: una opción de regalo de Stitch con excelente presentación. Diseños que llaman la atención, listos para exhibir. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'regalos'),
   '{"Stitch"}', '{}', 'GO-256',
   true, true, 45.0, 40.0, 'por_unidad',
   'USD', 8, false, false, false,
   null, true, false, 38)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/set-de-maquillaje-maleta-stitch.webp', 'Set de Maquillaje Maleta Stitch — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRnoAAABXRUJQVlA4IG4AAAAQAgCdASoQABAAA4BaJQAECBc+u8Wf/sn4AP73H4zoS3E/Ixw0cFE8+Fp+vN70CLjpj6ca0Bg/6fOJl2CMiXxybmvPMSOg+RJ/ESpm29JJhAp6K+Pqn3MBSUOxZ/WifhrhnHUXPljVv8MC+gYAAA=='
from public.productos where slug = 'set-de-maquillaje-maleta-stitch'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('caminador-capi', 'Caminador Capi', 'Caminador Capi: diversión garantizada de Capibara. Un juguete entretenido, resistente y con gran presentación para exhibir. Modelos surtidos, disponible por docena y por caja.',
   (select id from public.categorias where slug = 'juguetes'),
   '{"Capibara"}', '{}', 'N58-4(5)',
   true, true, 0.9, 0.8, 'por_unidad',
   'USD', 288, false, false, false,
   null, true, false, 39)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/caminador-capi.webp', 'Caminador Capi — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRowAAABXRUJQVlA4IIAAAACQAgCdASoQABAAA4BaJbACdEf/i1r99kdiqRpeAAD+9/r0PKh0T46dTsQclJymh5YdTGOLv33fXxfEBXozHu5TGOZu1vb40PsgoS6cXiXRAFqk5R4ilRby6+tgtAgXyniaSjHabVKtCDWf/ZDZ8lNu9Srws8tG4JI58RejC0IAAA=='
from public.productos where slug = 'caminador-capi'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('bailador-tung-tun', 'Bailador Tung Tun', 'Bailador Tung Tun: con el diseño de Brain Rot, uno de los diseños más pedidos del momento. La gente lo pregunta y se reconoce al instante. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'tendencias'),
   '{"Brain Rot"}', '{}', 'N2510-6(2)',
   true, true, 2.8, 2.0, 'por_unidad',
   'USD', 96, false, false, false,
   null, true, true, 40)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/bailador-tung-tun.webp', 'Bailador Tung Tun — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRqQAAABXRUJQVlA4IJgAAAAQAwCdASoQABAAA4BaJbACdH8EwAbxaRHRgG6y+/7oPQAA/uirvJDothSMaGeC/npkOCDKbDbg1QEuQDEkKBKUllgGhHI0MsMIMVciNUQYf6ioxfJd07hnxLq0Lk+R2H/GTFqcELkGc0aeRYAmLYSalI+ZWsIKKAPyRp25yjIQFOwe9ww0J/pMmWVo2ImM6946wEycxYIAAA=='
from public.productos where slug = 'bailador-tung-tun'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('burbuja-capi', 'Burbuja Capi', 'Burbuja Capi: diversión garantizada de Capibara. Un juguete entretenido, resistente y con gran presentación para exhibir. Modelos surtidos, disponible por docena y por caja.',
   (select id from public.categorias where slug = 'juguetes'),
   '{"Capibara"}', '{}', 'N2510-6(3)',
   true, true, 2.8, 2.5, 'por_unidad',
   'USD', 72, false, false, false,
   null, true, false, 41)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/burbuja-capi.webp', 'Burbuja Capi — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRnwAAABXRUJQVlA4IHAAAADwAQCdASoQABAAA4BaJbACdAELz1u69+AA/vdeEI00sn1EnRgxsSi3qJBJwpfEX6/Zc0mHsaytQe6CVRJGbgegFTjmGf5T7Jj6Y//g45ACX8XxWWKMU8AIvM/+oD5I0b/TbePd+Uf7PjJTlkVd1gAA'
from public.productos where slug = 'burbuja-capi'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('stitch-bailador', 'Stitch Bailador', 'Stitch Bailador: diversión garantizada de Stitch. Un juguete entretenido, resistente y con gran presentación para exhibir. Modelos surtidos, disponible por docena y por caja.',
   (select id from public.categorias where slug = 'juguetes'),
   '{"Stitch"}', '{}', 'N2510-6(6)',
   true, true, 3.2, 2.8, 'por_unidad',
   'USD', 96, false, false, true,
   'Antes $4.50', true, true, 42)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/stitch-bailador.webp', 'Stitch Bailador — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRpAAAABXRUJQVlA4IIQAAABwAgCdASoQABAAA4BaJbACdH8AgrDAF6qK6bv0AP7rwgK5uh2PY8vypoV7a8cjKSLdxt2Eaz34QKkxWF9r+8QMfmhez8Hg1RJNZN6AKOp7OBvm1B5BImtmYmhze9LFAWc08YeG9hW8cZqF7al1GVcsE6fpR5d4kDZJUCSYX8bo7GAIAAA='
from public.productos where slug = 'stitch-bailador'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('arana-de-color', 'Arana de Color', 'Arana de Color: precio de entrada accesible con gran presentación. Modelos surtidos, perfecto para completar tu pedido. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'economicos'),
   '{}', '{}', 'N2510-11(1)',
   true, true, 0.4, 0.36, 'por_unidad',
   'USD', 288, false, false, false,
   null, true, false, 43)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/arana-de-color.webp', 'Arana de Color — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRnYAAABXRUJQVlA4IGoAAACwAgCdASoQABAAA4BaJagCdIE5IA9B0GQf2bLfPAAA/vJzkwL3Q4ab3kwfFBwfM+ULE9m5JQNDG3KqhSKIseBDHq4bcPMl9L567IHYE9Yk8A8qi8h1+y2rjem737ofSMku46WFmebAAAAA'
from public.productos where slug = 'arana-de-color'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('arana-negra', 'Arana Negra', 'Arana Negra: precio de entrada accesible con gran presentación. Modelos surtidos, perfecto para completar tu pedido. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'economicos'),
   '{}', '{}', 'N2510-11(2)',
   true, true, 0.4, 0.36, 'por_unidad',
   'USD', 288, false, false, false,
   null, true, false, 44)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/arana-negra.webp', 'Arana Negra — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRnQAAABXRUJQVlA4IGgAAADwAQCdASoQABAAA4BaJQBOj+ACUkYQ84AA/vi6Zo2HfAriOCMU+YntlIxgqZrYXZG3d6674CrkXftsS5RTzbSTCsxv7NpmUfOlFPcTV/p8NZY2v08FsGMIW0bDQBzKC5gwSskY/zogAA=='
from public.productos where slug = 'arana-negra'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('scushy-murcielago-negro', 'Scushy Murcielago Negro', 'Scushy Murcielago Negro: precio de entrada accesible con gran presentación. Modelos surtidos, perfecto para completar tu pedido. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'economicos'),
   '{}', '{"halloween"}', 'N2510-11(3)',
   true, true, 0.4, 0.35, 'por_unidad',
   'USD', 288, false, false, false,
   null, true, false, 45)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/scushy-murcielago-negro.webp', 'Scushy Murcielago Negro — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRpQAAABXRUJQVlA4IIgAAACQAgCdASoQABAAA4BaJbACdFQAFPiVBP93KBygAAD+9/uF1fuI7eozFl9Io3uL7/JDWAZSPhnfoYpiSKdyStjCtj3foeI/u9uFJgYOCCmLTWVy006igb7/rMX7oLXSw3DXqYmzqaAIFEdSgcXZuDU1T7FY4Zj3RyHvpjMtDDVML54m2hdFAAAA'
from public.productos where slug = 'scushy-murcielago-negro'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('scushy-halloween', 'Scushy Halloween', 'Scushy Halloween: precio de entrada accesible con gran presentación. Modelos surtidos, perfecto para completar tu pedido. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'economicos'),
   '{}', '{"halloween"}', 'N2510-11(4)',
   true, true, 0.4, 0.35, 'por_unidad',
   'USD', 288, false, false, false,
   null, true, false, 46)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/scushy-halloween.webp', 'Scushy Halloween — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRpgAAABXRUJQVlA4IIwAAACQAgCdASoQABAAA4BaJbACdH8AgqSufzaTd+znQAD+8H7GWkdkj/CovFuB5FgXCs4n/Nxd8Xdc9WM1WBsNQTqbl+4UYryiU/82O/4ZfX3Xvp/vrg06tDGE5mPKrEvCmSBsk2/jBfGO83foeGOFbg5q+hY68AvL9MQ/FAgPOZAMENakNaCVcY/QAB+AAA=='
from public.productos where slug = 'scushy-halloween'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('peluche-labubu-economico', 'Peluche Labubu Economico', 'Peluche Labubu Economico: peluche suave y abrazable de Labubu, con acabados prolijos que lucen muy bien en vitrina. Un diseño que llama la atención y que la gente pregunta. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'peluches'),
   '{"Labubu"}', '{}', 'N2511-2(8)',
   true, true, 1.1, 0.95, 'por_unidad',
   'USD', 360, false, false, false,
   null, true, true, 47)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/peluche-labubu-economico.webp', 'Peluche Labubu Economico — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRnoAAABXRUJQVlA4IG4AAAAQAgCdASoQABAAA4BaJYgAD5MtX4tc8DtIAP738WVF4TxKte+TEI1oQbtq96MGqpv4nO+yS5qjg2jqn1rXTVSEFEJ663zP+s178Z48r+Upg339mbsUt7FqOw9N92kj/Vv8gJ5eDyPNtnouWUtAAA=='
from public.productos where slug = 'peluche-labubu-economico'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('peluche-musical-brain-rot', 'Peluche Musical Brain Rot', 'Peluche Musical Brain Rot: peluche suave y abrazable de Brain Rot, con acabados prolijos que lucen muy bien en vitrina. Un diseño que llama la atención y que la gente pregunta. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'peluches'),
   '{"Brain Rot"}', '{}', 'N2511-3(3)',
   true, true, 1.2, 1.0, 'por_unidad',
   'USD', 300, false, false, false,
   null, true, false, 48)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/peluche-musical-brain-rot.webp', 'Peluche Musical Brain Rot — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAABwAgCdASoQABAAA4BaJQBOkBswSJf4vBRdE7HAAP74sAuVERzY/AlqI39yhvIO5BLxp6eoAH8yWts5Y8k0jVsqUrMGTrjiBhlnbBOxfA5I8IG3U7O+6AAA'
from public.productos where slug = 'peluche-musical-brain-rot'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('furia-nocturna-peluche', 'Furia Nocturna Peluche', 'Furia Nocturna Peluche: peluche suave y abrazable, con acabados prolijos que lucen muy bien en vitrina. Un diseño que llama la atención y que la gente pregunta. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'peluches'),
   '{}', '{}', 'N2511-4(2)',
   true, true, 2.0, 1.8, 'por_unidad',
   'USD', 480, false, false, false,
   null, true, false, 49)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/furia-nocturna-peluche.webp', 'Furia Nocturna Peluche — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRnoAAABXRUJQVlA4IG4AAAAwAgCdASoQABAAA4BaJZwAD4qQcC5HVmXAAAD++LGKJn3APYy3/vGcGdnB9FyTw/5T8ZvvDBlfEwP5mpJXhIIUx4AosYGdbuF5RB387LXd5RFuvBS5X8LQh1skSB4w3aPe0SFZMnygcSgjFwAAAA=='
from public.productos where slug = 'furia-nocturna-peluche'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('mochila-stitch-peluche', 'Mochila Stitch Peluche', 'Mochila Stitch Peluche: con el diseño de Stitch, modelos surtidos con colores vivos y terminaciones de calidad. Perfecta para la temporada escolar y para quienes buscan diseños que llaman la atención. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'mochilas'),
   '{"Stitch"}', '{}', 'N2511-4(3)',
   true, true, 2.8, 2.5, 'por_unidad',
   'USD', 240, false, false, false,
   null, true, true, 50)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/mochila-stitch-peluche.webp', 'Mochila Stitch Peluche — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAACwAQCdASoQABAAA4BaJZQAAubQntUEAP74sGsMMcVbwNRl4LfUqXprnWdjoJIG1wxJtIK0K4f3lMqCQOAAAaSAAowABVY4AAA='
from public.productos where slug = 'mochila-stitch-peluche'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('labubu-con-perlas-ultima-generacion', 'Labubu con Perlas Ultima Generacion', 'Labubu con Perlas Ultima Generacion: con el diseño de Labubu, uno de los diseños más pedidos del momento. La gente lo pregunta y se reconoce al instante. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'tendencias'),
   '{"Labubu"}', '{}', 'N2511-10(2)',
   true, true, 3.0, 2.8, 'por_unidad',
   'USD', 240, false, false, false,
   null, true, true, 51)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/labubu-con-perlas-ultima-generacion.webp', 'Labubu con Perlas Ultima Generacion — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRnYAAABXRUJQVlA4IGoAAAAwAgCdASoQABAAA4BaJZACdAEO5AFi3uSEKAD+9+pgVWlKsoKNcogi5oxoVct7RLX4/xZoJlT/jx1C65Kyfh3zmLrHk/pUHKtbVZ2DpVNC7YdVOJrVCn3thZvufZc31FpKAdmZjS3yAAAA'
from public.productos where slug = 'labubu-con-perlas-ultima-generacion'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('ligas-de-color-negro', 'Ligas de Color Negro', 'Ligas de Color Negro: precio de entrada accesible con gran presentación. Modelos surtidos, perfecto para completar tu pedido. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'economicos'),
   '{}', '{}', '393-1',
   true, true, 0.3, 0.25, 'por_unidad',
   'USD', 960, false, false, false,
   null, true, false, 52)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/ligas-de-color-negro.webp', 'Ligas de Color Negro — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRnQAAABXRUJQVlA4IGgAAACwAgCdASoQABAAA4BaJYgCdH8GJ/i10t96yTOEeQAA/vf+7Gv85NNsacs3U1YuXe9CSw+ah+0AsjW7JwtqTkklnuUVyVhKmg2bGZiqUoMp/cTz60RNS/5DiMRHquqfJthN0TzxPwAAAA=='
from public.productos where slug = 'ligas-de-color-negro'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('ligas-de-color-surtido', 'Ligas de Color Surtido', 'Ligas de Color Surtido: precio de entrada accesible con gran presentación. Modelos surtidos, perfecto para completar tu pedido. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'economicos'),
   '{}', '{}', '393-3',
   true, true, 0.5, 0.45, 'por_unidad',
   'USD', 600, false, false, false,
   null, true, false, 53)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/ligas-de-color-surtido.webp', 'Ligas de Color Surtido — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRooAAABXRUJQVlA4IH4AAADwAQCdASoQABAAA4BaJbACdAEO/gms0gAA/vJzkwL3Q4YUhA0DO+qGgC89MXjCHYPNxva2/5iBxYuuWQJaOUy35emlTpveaDwr1f79Qp2vLQXsZOjomJZBUrQCLuAWFIvnOxIxG9tf+LEUE+5sc9IswnfZ/1tjUxotIewAAAA='
from public.productos where slug = 'ligas-de-color-surtido'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('ligas-en-botellita', 'Ligas en Botellita', 'Ligas en Botellita: precio de entrada accesible con gran presentación. Modelos surtidos, perfecto para completar tu pedido. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'economicos'),
   '{}', '{}', '393-4',
   true, true, 0.55, 0.5, 'por_unidad',
   'USD', 768, false, false, false,
   null, true, false, 54)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/ligas-en-botellita.webp', 'Ligas en Botellita — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRogAAABXRUJQVlA4IHwAAABQAgCdASoQABAAA4BaJbAC7AYvhvsRXs60gcAA/tgbrN8geJti8KXPDte6KcyACOPI5RXeR6Qs+nJjFs8WDP6pv6FHpmDEpFTTNxGNt6+udVxwfrFchKmD3FQcJSH+n8fmeDEGKrlrW9B1WtqgZuyhs2GkfcKh3aAogAAA'
from public.productos where slug = 'ligas-en-botellita'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('muneco-brain-rot-en-blister', 'Muneco Brain Rot en Blister', 'Muneco Brain Rot en Blister: con el diseño de Brain Rot, uno de los diseños más pedidos del momento. La gente lo pregunta y se reconoce al instante. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'tendencias'),
   '{"Brain Rot"}', '{}', 'N259-8',
   true, true, 4.0, 3.5, 'por_unidad',
   'USD', 60, false, false, false,
   null, true, false, 55)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/muneco-brain-rot-en-blister.webp', 'Muneco Brain Rot en Blister — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRnoAAABXRUJQVlA4IG4AAABwAgCdASoQABAAA4BaJZACdIE3J/gbIObhrumIAP73XBiGORjf+RHXECGmYrfqIBCdluyGuJSpRyw1FAWsZ6CP1zBL1D/Ognk9kRh0oq5MNlLq+1NblOejo0ZhiDaVSa7JRadK2MBw8rUACqGAAA=='
from public.productos where slug = 'muneco-brain-rot-en-blister'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('scushy-capibara', 'Scushy Capibara', 'Scushy Capibara: precio de entrada accesible con gran presentación de Capibara. Modelos surtidos, perfecto para completar tu pedido. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'economicos'),
   '{"Capibara"}', '{}', 'N59-6(6)',
   true, true, 0.55, 0.5, 'por_unidad',
   'USD', 288, false, false, false,
   null, true, false, 56)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/scushy-capibara.webp', 'Scushy Capibara — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAABwAgCdASoQABAAA4BaJQBOj+AQVBf2iH2jH8UAAP74tzOAUxTF4vX3B9hxgDHefNmaLKja3r8+US8CD43vmrQ/atir3QykIIOmVb/Mpf/RFi6YyUfx7YaonAA='
from public.productos where slug = 'scushy-capibara'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);
insert into public.productos
  (slug, nombre, descripcion, categoria_id, personajes, temporada, codigo,
   vende_por_docena, vende_por_caja, precio_docena, precio_caja, unidad_precio,
   moneda, unidades_por_caja, mostrar_precio, precio_verificado, en_oferta,
   etiqueta_oferta, disponible, destacado, orden)
values
  ('peluche-llavero-stitch-futbolero', 'Peluche Llavero Stitch Futbolero', 'Peluche Llavero Stitch Futbolero: peluche suave y abrazable de Stitch, con acabados prolijos que lucen muy bien en vitrina. Un diseño que llama la atención y que la gente pregunta. Disponible por docena y por caja.',
   (select id from public.categorias where slug = 'peluches'),
   '{"Stitch"}', '{}', 'N2511-3(2)',
   true, true, 1.7, 1.5, 'por_unidad',
   'USD', 1200, false, false, false,
   null, true, false, 57)
on conflict (slug) do nothing;
insert into public.producto_imagenes (producto_id, url, alt, orden, es_principal, blur_data_url)
select id, '/productos/peluche-llavero-stitch-futbolero.webp', 'Peluche Llavero Stitch Futbolero — venta por docena y caja', 0, true, 'data:image/webp;base64,UklGRmgAAABXRUJQVlA4IFwAAABQAgCdASoQABAAA4BaJZQCdH8Agki/wshCwAAA/viwYZopddVyCo6vARdPgJnLxtF247Ae3dTCnGDNxiQrs8QetszzSxvffJfDqeQyMIhChSPuFvgUgQ9sLmAAAA=='
from public.productos where slug = 'peluche-llavero-stitch-futbolero'
and not exists (select 1 from public.producto_imagenes pi where pi.producto_id = productos.id);

-- Campañas
insert into public.campanas (nombre, slug, titulo, subtitulo, pais_objetivo, fecha_inicio, fecha_fin, activa, imagen_url, producto_ids)
values
  ('Día del Niño Argentina', 'dia-del-nino-argentina',
   'Se acerca el Día del Niño 🇦🇷', 'Prepara tu pedido con tiempo: peluches, juguetes y los diseños que todos piden. Retiro en Bermejo o coordinación con tu pasero de confianza.',
   'AR', '2026-07-01', '2026-08-03', true, null,
   (select coalesce(array_agg(id), '{}') from public.productos where slug in ('mochila-stitch-peluche','peluche-labubu-economico','furia-nocturna-peluche','stitch-bailador','peluche-musical-brain-rot','muneco-brain-rot-en-blister')))
on conflict (slug) do nothing;
insert into public.campanas (nombre, slug, titulo, subtitulo, pais_objetivo, fecha_inicio, fecha_fin, activa, imagen_url, producto_ids)
values
  ('Precio de caja desde la cuarta docena', 'precio-caja-cuarta-docena',
   'Precio de caja desde la 4.ª docena 🇧🇴', 'Pide cuatro docenas o más del mismo producto y accede al precio por caja. Envíos a todo el país desde Bermejo.',
   'BO', '2026-07-01', '2026-12-31', true, null,
   (select coalesce(array_agg(id), '{}') from public.productos where destacado = true))
on conflict (slug) do nothing;