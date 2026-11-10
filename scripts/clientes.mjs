// Genera un borrador por cliente a partir de una demo.
// Lee cada archivo clientes/<slug>.json (los que empiezan con "_" se ignoran)
// y escribe public/clientes/<slug>/index.html.
// Se ejecuta solo antes de cada build (npm run build) y a mano con: npm run clientes
import fs from 'node:fs';
import path from 'node:path';

const RAIZ = path.resolve(import.meta.dirname, '..');
const ENTRADA = path.join(RAIZ, 'clientes');
const SALIDA = path.join(RAIZ, 'public', 'clientes');
const DEMO_WA = '5491100000000';

// Para cada demo: qué textos de ejemplo se reemplazan por cada campo
// y qué colores de la demo corresponden a "principal" y "secundario".
const BASES = {
  odontologo: {
    textos: {
      // va primero: el párrafo contiene el nombre de la demo
      presentacion: ['La Dra. Lucía Ferrante es odontóloga egresada de la UBA, con 12 años de experiencia y especialización en ortodoncia. En Prisma Dental priorizamos explicarte cada paso y trabajar sin apuro.'],
      nombre: ['Consultorio Odontológico Prisma Dental', 'Prisma Dental'],
      barrio: ['Belgrano'],
      direccion: ['Av. Cabildo 2150, 3° B'],
      horario: ['Lunes a viernes de 9 a 20 h'],
      matricula: ['34.812'],
      obrasSociales: ['OSDE, Swiss Medical y Galeno'],
    },
    colores: { principal: ['2bb5a0'], secundario: ['0e5a8a'], secundarioOscuro: ['0a3d5c'] },
  },
  estetica: {
    textos: {
      logo: ['NÁCAR'],
      nombre: ['Nácar Estética'],
      barrio: ['Palermo'],
      direccion: ['Gurruchaga 1840'],
      horario: ['Martes a sábado de 10 a 20 h'],
    },
    colores: { principal: ['c7857a'], principalOscuro: ['b3695d'] },
  },
  suplementos: {
    textos: {
      logo: ['FORJA<span>SUPPS</span>'],
      nombre: ['Forja Supps'],
      barrio: ['Caballito'],
      direccion: ['Av. Rivadavia 5320'],
      horario: ['Lunes a sábado de 9 a 21 h'],
    },
    colores: { principal: ['ff6a1a'] },
  },
  'servicio-tecnico': {
    textos: {
      logo: ['HidroClima</div>'],
      nombre: ['HidroClima Servicios'],
      zona: ['Zona Norte'],
      horario: ['Lunes a sábado de 8 a 20 h, urgencias las 24 h.'],
      matricula: ['18.437'],
      barrios: ['<span>Vicente López</span><span>Olivos</span><span>Martínez</span><span>San Isidro</span><span>Núñez</span>'],
    },
    colores: { principal: ['0b64b0'], principalOscuro: ['084a85'], secundario: ['ff9f1c'] },
  },
  fletes: {
    textos: {
      logo: ['RUMBO<small>fletes</small>'],
      nombre: ['Rumbo Fletes y Mudanzas', 'Rumbo Fletes'],
      zona: ['Zona Oeste'],
      horario: ['Lunes a sábado de 7 a 20 h'],
      barrios: ['<span>Ramos Mejía</span><span>Haedo</span><span>Morón</span><span>Castelar</span><span>Ituzaingó</span><span>San Justo</span><span>Liniers</span>'],
    },
    colores: { principal: ['263238'], principalOscuro: ['1a2329'], secundario: ['ffb000'] },
  },
  depilacion: {
    textos: {
      logo: ['aura<span>láser</span>'],
      nombre: ['Aura Láser'],
      barrio: ['Recoleta'],
      direccion: ['Av. Santa Fe 1960'],
      horario: ['Lunes a sábado de 9 a 21 h'],
    },
    colores: { principal: ['6a4de0'], principalOscuro: ['4c37a3'] },
  },
  'estetica-integral': {
    textos: {
      logo: ['Lúa<span>studio</span>'],
      nombre: ['Lúa Studio'],
      barrio: ['Villa Crespo'],
      direccion: ['Av. Corrientes 5120'],
      horario: ['Lunes a sábado de 10 a 20 h'],
    },
    colores: { principal: ['c2376b'], principalOscuro: ['8b274d'] },
  },
};

// Cuenta de Instagram ficticia de cada demo
const IG_DEMO = { odontologo: 'prismadental.demo', estetica: 'nacarestetica.demo', suplementos: 'forjasupps.demo', 'servicio-tecnico': 'hidroclima.demo', fletes: 'rumbofletes.demo', depilacion: 'auralaser.demo', 'estetica-integral': 'luastudio.demo' };
// "@minegocio", "minegocio" o "https://instagram.com/minegocio/" -> "minegocio"
const usuarioIg = (s) => String(s).trim().replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/^@/, '').replace(/[/?#].*$/, '');

const slugify =(s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const hex = (c) => String(c).replace('#', '').toLowerCase();
const oscurecer = (c, k = 0.72) => hex(c).match(/../g).map((v) => Math.round(parseInt(v, 16) * k).toString(16).padStart(2, '0')).join('');
const escapar = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// "11 1234-5678" o "+54 9 11 1234 5678" -> WhatsApp 5491112345678, teléfono +541112345678
function telefonos(t) {
  let d = String(t).replace(/\D/g, '');
  if (d.startsWith('549')) d = d.slice(3);
  else if (d.startsWith('54')) d = d.slice(2);
  if (d.startsWith('0')) d = d.slice(1);
  // quita el 15 de celulares escritos a la antigua (ej: 11 15 3333-2222): solo si sobran 2 dígitos
  if (d.length === 12) {
    const m = [2, 3, 4].map((n) => d.slice(n, n + 2) === '15' && d.slice(0, n) + d.slice(n + 2)).find(Boolean);
    if (m) d = m;
  }
  if (d.length !== 10) throw new Error(`teléfono "${t}": se esperaban 10 dígitos con código de área (ej: 11 1234-5678)`);
  return { wa: `549${d}`, tel: `+54${d}` };
}

function generar(archivo) {
  const datos = JSON.parse(fs.readFileSync(archivo, 'utf8'));
  const slug = datos.slug || slugify(datos.nombre || path.basename(archivo, '.json'));
  const base = BASES[datos.demo];
  if (!base) throw new Error(`"demo" debe ser una de: ${Object.keys(BASES).join(', ')}`);
  if (!datos.nombre || !datos.whatsapp) throw new Error('faltan "nombre" y/o "whatsapp"');

  const sinCambiar = [];

  // 1) Lista de reemplazos de texto [original, nuevo]
  const textos = [];
  const valores = { ...datos, logo: datos.logo || datos.nombre };
  for (const [campo, originales] of Object.entries({ ...base.textos, ciudad: [', CABA'] })) {
    const crudo = valores[campo];
    if (crudo == null || crudo === '') { if (campo !== 'ciudad') sinCambiar.push(campo); continue; }
    let nuevo;
    if (campo === 'barrios') nuevo = [].concat(crudo).map((b) => `<span>${escapar(b)}</span>`).join('');
    else if (campo === 'logo' && datos.demo === 'suplementos') {
      const [a, ...b] = String(crudo).split(' ');
      nuevo = b.length ? `${escapar(a)}<span>${escapar(b.join(' '))}</span>` : escapar(a);
    } else if (campo === 'logo' && datos.demo === 'servicio-tecnico') nuevo = `${escapar(crudo)}</div>`;
    else if (campo === 'ciudad') nuevo = `, ${escapar(crudo)}`;
    else nuevo = escapar(crudo);
    for (const o of originales) {
      textos.push([o, nuevo]);
      // también dentro de URLs (ej. la dirección del mapa de Google)
      if (['nombre', 'barrio', 'direccion', 'zona', 'ciudad'].includes(campo)) {
        textos.push([encodeURIComponent(o), encodeURIComponent(campo === 'ciudad' ? `, ${crudo}` : crudo)]);
      }
    }
  }

  // 2) Colores (se reemplaza también la versión con transparencia, ej. #ff6a1a33)
  const c = datos.colores || {};
  const mapa = {
    principal: c.principal, principalOscuro: c.principal && oscurecer(c.principal),
    secundario: c.secundario, secundarioOscuro: c.secundario && oscurecer(c.secundario),
  };
  const colores = Object.entries(base.colores).filter(([rol]) => mapa[rol])
    .flatMap(([rol, originales]) => originales.map((o) => [new RegExp(`#${o}`, 'gi'), `#${hex(mapa[rol])}`]));

  const t = telefonos(datos.whatsapp);
  const origen = path.join(RAIZ, 'public', 'demos', datos.demo);
  fs.mkdirSync(path.join(SALIDA, slug), { recursive: true });

  // 3) Se procesan todas las páginas y estilos de la demo (las profesionales tienen varias)
  for (const archivo of fs.readdirSync(origen)) {
    let s = fs.readFileSync(path.join(origen, archivo), 'utf8');
    if (/\.(html|css)$/.test(archivo)) {
      for (const [o, n] of textos) s = s.split(o).join(n);
      for (const [re, n] of colores) s = s.replace(re, n);
    }
    if (archivo.endsWith('.html')) {
      // Contacto real del cliente (el aviso de "demo" deja de aparecer solo)
      s = s.split(`tel:+${DEMO_WA}`).join(`tel:${t.tel}`).split(`+${DEMO_WA}`).join(t.tel).split(DEMO_WA).join(t.wa);
      // Rutas: el borrador vive en /clientes/<slug>/ y usa los efectos de /demos/_fx/
      s = s.split('../_fx/').join('../../demos/_fx/');
      // Instagram del cliente, o se quitan los bloques de Instagram si no tiene
      s = datos.instagram
        ? s.split(IG_DEMO[datos.demo]).join(escapar(usuarioIg(datos.instagram)))
        : s.replace(/<!--ig-->[\s\S]*?<!--\/ig-->\n?/g, '');
      // Turnos online: link de Cal.com del cliente ("https://cal.com/usuario/evento" o "usuario/evento"); sin él, la sección queda oculta
      const cal = String(datos.turnos || '').trim().replace(/^(https?:\/\/)?(app\.|www\.)?cal\.com\//i, '').replace(/[?#].*$/, '').replace(/^\/|\/$/g, '');
      s = s.replace(/data-cal-link="[^"]*"/g, `data-cal-link="${escapar(cal)}"`);
      // Sin turnos online se quita el botón que lleva al calendario y WhatsApp vuelve a ser el botón principal
      if (!cal) s = s.replace(/<!--turnos-->[\s\S]*?<!--\/turnos--><a class="btn borde"/g, '<a class="btn"').replace(/<!--turnos-->[\s\S]*?<!--\/turnos-->/g, '');
      // Franja de borrador + no indexar en Google
      s = s.replace(/<div class="demo-ribbon">[\s\S]*?<\/div>/, `<div class="demo-ribbon">Borrador para ${escapar(datos.nombre)} · <a href="../../">diseñado por Flavio</a></div>`);
      s = s.replace('<meta charset="UTF-8">', '<meta charset="UTF-8">\n<meta name="robots" content="noindex">');
    }
    fs.writeFileSync(path.join(SALIDA, slug, archivo), s);
  }
  return { slug, sinCambiar };
}

if (!fs.existsSync(ENTRADA)) process.exit(0);
fs.rmSync(SALIDA, { recursive: true, force: true });
let errores = 0;
for (const f of fs.readdirSync(ENTRADA).filter((f) => f.endsWith('.json') && !f.startsWith('_'))) {
  try {
    const r = generar(path.join(ENTRADA, f));
    console.log(`✓ ${f} -> /portfolio/clientes/${r.slug}/` + (r.sinCambiar.length ? `  (quedaron los datos de la demo en: ${r.sinCambiar.join(', ')})` : ''));
  } catch (e) {
    errores++;
    console.error(`✗ ${f}: ${e.message}`);
  }
}
console.log('Recordá: catálogo, precios, reseñas y fotos siguen siendo los de la demo; ajustalos a mano si hace falta.');
if (errores) process.exit(1);
