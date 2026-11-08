// Efectos interactivos compartidos por las demos (mismo lenguaje visual que el portfolio).
(() => {
  const calmo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fino = matchMedia('(pointer: fine)').matches;
  const $$ = (s) => [...document.querySelectorAll(s)];

  // Tarjetas con brillo
  $$('.card, .prod, .cat, .ben > div, .ph').forEach((el) => {
    el.classList.add('fx-g');
    const luz = document.createElement('span');
    luz.className = 'fx-luz';
    el.appendChild(luz);
  });
  $$('.ico, .ic, .cat i').forEach((el) => el.classList.add('fx-ico'));
  $$('.badges span, .chips span, .pts span, .zonas span').forEach((el) => el.classList.add('fx-chip'));

  // Aparición escalonada dentro de cada grilla
  $$('.reveal').forEach((el) => {
    const hermanos = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
    const i = hermanos.indexOf(el);
    if (i > 0 && hermanos.length > 2) {
      el.style.transitionDelay = `${(i % 4) * 90}ms`;
      el.addEventListener('transitionend', () => { el.style.transitionDelay = ''; }, { once: true });
    }
  });

  // Barra de progreso
  const barra = document.createElement('div');
  barra.className = 'fx-progreso';
  document.body.appendChild(barra);
  const progreso = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    barra.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
  };
  addEventListener('scroll', progreso, { passive: true });
  progreso();

  if (!fino || calmo) return;

  // Brillo + leve inclinación 3D siguiendo al mouse
  $$('.fx-g').forEach((el) => {
    const tilt = el.matches('.prod, .ph');
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--x', `${e.clientX - r.left}px`);
      el.style.setProperty('--y', `${e.clientY - r.top}px`);
      if (tilt) {
        el.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 8}deg`);
        el.style.setProperty('--rx', `${-((e.clientY - r.top) / r.height - 0.5) * 6}deg`);
      }
    });
    el.addEventListener('pointerleave', () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
  });

  // Luz en la portada
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.classList.add('fx-hero');
    const luz = document.createElement('span');
    luz.className = 'fx-luz-hero';
    hero.prepend(luz);
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty('--x', `${e.clientX - r.left}px`);
      hero.style.setProperty('--y', `${e.clientY - r.top}px`);
    });
  }
})();

// Los contactos de las demos usan un número ficticio: en vez de abrir WhatsApp o el teléfono, se avisa.
(() => {
  let toast, timer;
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href*="5491100000000"], a[href*=".demo/"]');
    if (!a) return;
    e.preventDefault();
    if (!toast) { toast = document.createElement('div'); toast.className = 'fx-toast'; toast.setAttribute('role', 'status'); document.body.appendChild(toast); }
    const tipo = a.href.startsWith('tel:') ? 'iniciaría una llamada al negocio' : a.href.includes('instagram.com') ? 'abriría el Instagram del negocio' : 'abriría el WhatsApp del negocio con un mensaje listo';
    toast.innerHTML = `<b>Proyecto demo:</b> en un sitio real este botón ${tipo}.`;
    toast.classList.add('ver');
    clearTimeout(timer); timer = setTimeout(() => toast.classList.remove('ver'), 3200);
  });
})();
