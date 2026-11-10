# Portfolio de webs (Astro)

Portfolio personal con vista previa en vivo (escritorio y celular) de 7 sitios demo.

## Usar en tu compu
1. Node.js está en `D:\nodejs` (agregalo al PATH para usar `npm` desde cualquier terminal).
2. En esta carpeta: `npm install`
3. Probar: `npm run dev` (abre en http://localhost:4321)
4. Publicar: hacé commit y push a `main`; GitHub Actions compila y publica en https://darkzz21.github.io/portfolio/

## Editar
- `src/pages/index.astro`: tu nombre, rol, links (LinkedIn, GitHub, email) y la lista `proyectos`.
- Demos: cada una es una carpeta en `public/demos/<nombre>/index.html`.
  Para sumar una, copiá la carpeta y agregá un objeto en el array `proyectos`.

## Demos (marcas y datos ficticios)
- Forja Supps: suplementos (`/demos/suplementos/`)
- Prisma Dental: consultorio odontológico (`/demos/odontologo/`)
- Nácar Estética: centro de estética (`/demos/estetica/`)
- HidroClima: plomería y aire acondicionado (`/demos/servicio-tecnico/`)
- Lúa Studio: uñas, pestañas y cejas, con armado de turno (`/demos/estetica-integral/`)
- Aura Láser: depilación láser (`/demos/depilacion/`)
- Rumbo Fletes: fletes y mudanzas, con cotizador (`/demos/fletes/`)

Fotos: Unsplash (uso libre), enlazadas directamente desde images.unsplash.com.

## Efectos de las demos
`public/demos/_fx/fx.css` y `fx.js` aplican los efectos interactivos a todas las demos.
Cada demo define su color con `--fx` en su `:root`. Los botones de contacto de las demos usan un
número ficticio y muestran un aviso en lugar de abrir WhatsApp.

## Compartir
`public/og.png` es la imagen que aparece al compartir el link (LinkedIn, WhatsApp).

## Borradores para clientes
1. Copiá `clientes/_ejemplo.json` como `clientes/<nombre-del-cliente>.json` y completá los datos.
   - `demo`: `odontologo`, `estetica`, `suplementos`, `servicio-tecnico`, `estetica-integral`, `depilacion` o `fletes`
   - Obligatorios: `nombre`, `whatsapp` (con código de área, ej. `11 1234-5678`)
   - Opcionales: `logo`, `barrio`, `ciudad`, `direccion`, `horario`, `matricula`,
     `instagram` (si no tiene, se quita esa sección), `presentacion` y `obrasSociales` (odontólogo), `zona` y `barrios` (servicio técnico y fletes),
     `colores.principal` y `colores.secundario` (ej. `#7c5cff`)
2. `npm run clientes` genera el borrador en `public/clientes/<slug>/` (también se genera solo al publicar).
3. Push a `main`: queda online en `https://darkzz21.github.io/portfolio/clientes/<slug>/`.

Los borradores no aparecen en el portfolio ni en Google (`noindex`). Catálogo, precios, reseñas y
fotos siguen siendo los de la demo: ajustalos a mano en el HTML generado o pedímelo.
