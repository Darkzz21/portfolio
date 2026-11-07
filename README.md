# Portfolio de webs (Astro)

Portfolio personal con vista previa en vivo (escritorio y celular) de 4 sitios demo.

## Usar en tu compu
1. Node.js está en `D:\nodejs` (agregalo al PATH para usar `npm` desde cualquier terminal).
2. En esta carpeta: `npm install`
3. Probar: `npm run dev` (abre en http://localhost:4321)
4. Publicar: `npm run build` y subí el contenido de `dist/` a Netlify, GitHub Pages o Hostinger.

## Editar
- `src/pages/index.astro`: tu nombre, rol, links (LinkedIn, GitHub, email) y la lista `proyectos`.
- Demos: cada una es una carpeta en `public/demos/<nombre>/index.html`.
  Para sumar una, copiá la carpeta y agregá un objeto en el array `proyectos`.

## Demos (marcas y datos ficticios)
- Forja Supps: suplementos (`/demos/suplementos/`)
- Prisma Dental: consultorio odontológico (`/demos/odontologo/`)
- Nácar Estética: centro de estética (`/demos/estetica/`)
- HidroClima: plomería y aire acondicionado (`/demos/servicio-tecnico/`)

Fotos: Unsplash (uso libre), enlazadas directamente desde images.unsplash.com.
