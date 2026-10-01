/* ============================================================
   Isabel & Amaro · 2027
   ------------------------------------------------------------
   TODO lo que hay que cambiar está en el objeto BODA de abajo.
   El resto del archivo no hace falta tocarlo.
   ============================================================ */

const BODA = {
  // Fecha y hora de la ceremonia (zona horaria de España).
  // Formato: AAAA-MM-DDTHH:MM:SS+02:00  (+02:00 en verano, +01:00 en invierno)
  fecha: '2027-06-12T12:00:00+02:00',

  // Enlace al formulario de confirmación (Google Forms, Typeform…)
  formulario: 'https://forms.gle/CAMBIAR-ESTE-ENLACE',

  // Número de cuenta para el regalo
  iban: 'ES00 0000 0000 0000 0000 0000',

  // Enlaces de Google Maps de cada lugar
  mapas: {
    ceremony:  'https://maps.google.com/?q=Granada',
    reception: 'https://maps.google.com/?q=Granada'
  },

  // Fecha límite para confirmar (texto libre)
  limiteConfirmacion: '1 de abril de 2027'
};

/* ------------------------------------------------------------ */

const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ---------- 1. Rellenar datos configurables ----------------- */
(function aplicarConfig(){
  const fecha = new Date(BODA.fecha);

  if (!isNaN(fecha)) {
    const largo = fecha.toLocaleDateString('es-ES', {
      day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Madrid'
    });
    $$('[data-date-long]').forEach(el => { el.textContent = largo; });
    document.documentElement.setAttribute('data-wedding-date', BODA.fecha);
  }

  const btn = $('#rsvpBtn');
  if (btn) btn.href = BODA.formulario;

  const iban = $('#iban');
  if (iban) iban.textContent = BODA.iban;

  $$('[data-rsvp-deadline]').forEach(el => { el.textContent = BODA.limiteConfirmacion; });

  $$('[data-map]').forEach(el => {
    const url = BODA.mapas[el.dataset.map];
    if (url) el.href = url;
  });
})();

/* ---------- 2. Cuenta atrás --------------------------------- */
(function cuentaAtras(){
  const box = $('#countdown');
  if (!box) return;

  const objetivo = new Date(BODA.fecha).getTime();
  if (isNaN(objetivo)) { box.hidden = true; return; }

  const campos = {
    days:    $('[data-cd="days"]',    box),
    hours:   $('[data-cd="hours"]',   box),
    minutes: $('[data-cd="minutes"]', box),
    seconds: $('[data-cd="seconds"]', box)
  };

  function pintar(){
    const resto = objetivo - Date.now();

    if (resto <= 0) {
      box.classList.add('is-past');
      box.innerHTML = '<p class="hero__eyebrow" style="margin:0">¡Hoy es el día!</p>';
      return true;
    }

    const s = Math.floor(resto / 1000);
    campos.days.textContent    = Math.floor(s / 86400);
    campos.hours.textContent   = String(Math.floor(s % 86400 / 3600)).padStart(2, '0');
    campos.minutes.textContent = String(Math.floor(s % 3600 / 60)).padStart(2, '0');
    campos.seconds.textContent = String(s % 60).padStart(2, '0');
    return false;
  }

  if (pintar()) return;
  const id = setInterval(() => { if (pintar()) clearInterval(id); }, 1000);
})();

/* ---------- 3. Menú móvil ----------------------------------- */
(function menuMovil(){
  const toggle = $('#navToggle');
  const menu   = $('#navMenu');
  if (!toggle || !menu) return;

  const cerrar = () => {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const abierto = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(abierto));
  });

  $$('a', menu).forEach(a => a.addEventListener('click', cerrar));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrar(); });
  window.addEventListener('resize', () => { if (innerWidth > 860) cerrar(); });
})();

/* ---------- 4. Sombra del nav al hacer scroll --------------- */
(function navPegajoso(){
  const nav = $('#nav');
  if (!nav) return;
  const alternar = () => nav.classList.toggle('is-stuck', scrollY > 24);
  alternar();
  addEventListener('scroll', alternar, { passive: true });
})();

/* ---------- 5. Sección activa en el menú -------------------- */
(function seccionActiva(){
  const enlaces = $$('.nav__menu a[href^="#"]');
  const secciones = enlaces
    .map(a => ({ enlace: a, seccion: $(a.getAttribute('href')) }))
    .filter(x => x.seccion);

  if (!secciones.length || !('IntersectionObserver' in window)) return;

  const obs = new IntersectionObserver(entradas => {
    entradas.forEach(e => {
      const par = secciones.find(x => x.seccion === e.target);
      if (par) par.enlace.classList.toggle('is-active', e.isIntersecting);
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  secciones.forEach(x => obs.observe(x.seccion));
})();

/* ---------- 6. Aparición al hacer scroll -------------------- */
(function aparecer(){
  const items = $$('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window) ||
      matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const obs = new IntersectionObserver((entradas, o) => {
    entradas.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-visible');
      o.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

  items.forEach(el => obs.observe(el));
})();

/* ---------- 7. Copiar el IBAN ------------------------------- */
(function copiarIban(){
  const btn  = $('#copyIban');
  const iban = $('#iban');
  const aviso = $('#copyHint');
  if (!btn || !iban) return;

  btn.addEventListener('click', async () => {
    const texto = iban.textContent.trim();
    try {
      await navigator.clipboard.writeText(texto);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = texto;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch { /* sin portapapeles */ }
      ta.remove();
    }
    if (aviso) {
      aviso.hidden = false;
      clearTimeout(btn._t);
      btn._t = setTimeout(() => { aviso.hidden = true; }, 2200);
    }
  });
})();
