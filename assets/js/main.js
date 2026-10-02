/* ============================================================
   Isabel & Amaro · 2027
   ------------------------------------------------------------
   TODO lo que hay que cambiar está en el objeto BODA de abajo.
   El resto del archivo no hace falta tocarlo.
   ============================================================ */

const BODA = {
  // Fecha y hora de la ceremonia (hora de España).
  // Formato: AAAA-MM-DDTHH:MM:SS+02:00  (+02:00 en verano, +01:00 en invierno)
  fecha: '2027-06-12T12:00:00+02:00',

  // Duración aproximada, para la invitación de calendario (de la ceremonia al último autobús)
  duracionHoras: 14,

  // Lugar que aparece en la invitación de calendario
  lugar: 'Granada',

  // Enlace al formulario de confirmación (Google Forms, Typeform…)
  formulario: 'https://forms.gle/CAMBIAR-ESTE-ENLACE',

  // Fecha límite para confirmar (texto libre)
  limiteConfirmacion: '1 de abril de 2027',

  // Dirección de cada lugar, tal y como se buscaría en Google Maps.
  // Se usa para el mapa incrustado y para el enlace «Cómo llegar».
  direcciones: {
    ceremony:  'Granada centro',
    reception: 'Granada centro'
  },

  // Número de cuenta para el regalo y nombre del titular (si se deja vacío, no se muestra)
  iban: 'ES00 0000 0000 0000 0000 0000',
  titular: '',

  // WhatsApp de contacto, con prefijo de país y sin espacios, p. ej. '34600111222'
  // (si se deja vacío, el texto aparece sin enlace)
  whatsapp: ''
};

/* ------------------------------------------------------------ */

const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ---------- 1. Rellenar datos configurables ----------------- */
(function aplicarConfig(){
  const fecha = new Date(BODA.fecha);

  if (!isNaN(fecha)) {
    const opciones = { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Madrid' };
    const largo = fecha.toLocaleDateString('es-ES', opciones);
    const completo = fecha.toLocaleDateString('es-ES', { ...opciones, weekday: 'long' });
    $$('[data-date-long]').forEach(el => { el.textContent = largo; });
    $$('[data-date-full]').forEach(el => { el.textContent = completo.charAt(0).toUpperCase() + completo.slice(1); });
    document.documentElement.setAttribute('data-wedding-date', BODA.fecha);
  }

  // Mientras el formulario no sea real, el botón no lleva a ningún sitio falso
  const btn = $('#rsvpBtn');
  const formulario = String(BODA.formulario || '');
  if (btn) {
    if (formulario && !/CAMBIAR/i.test(formulario)) btn.href = formulario;
    else {
      btn.removeAttribute('href');
      btn.removeAttribute('target');
      btn.setAttribute('aria-disabled', 'true');
      btn.textContent = 'Formulario disponible muy pronto';
    }
  }

  $$('[data-rsvp-deadline]').forEach(el => { el.textContent = BODA.limiteConfirmacion; });

  // Mapas incrustados y enlaces «Cómo llegar» a partir de la misma dirección
  $$('[data-map-embed]').forEach(el => {
    const dir = BODA.direcciones[el.dataset.mapEmbed];
    if (!dir) return;
    const url = `https://maps.google.com/maps?q=${encodeURIComponent(dir)}&output=embed`;
    if (el.getAttribute('src') !== url) el.src = url;
  });
  $$('[data-map-route]').forEach(el => {
    const dir = BODA.direcciones[el.dataset.mapRoute];
    if (dir) el.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dir)}`;
  });

  // Un IBAN de ejemplo (solo ceros) no se muestra ni se puede copiar
  const iban = $('#iban');
  const ibanReal = /[1-9]/.test(String(BODA.iban || '').replace(/^\D+/, ''));
  if (iban) iban.textContent = ibanReal ? BODA.iban : 'Muy pronto lo tendréis aquí';
  if (!ibanReal) $('#copyIban')?.setAttribute('hidden', '');

  const titular = $('[data-titular]');
  if (titular && BODA.titular) {
    titular.textContent = BODA.titular;
    $('[data-titular-row]')?.removeAttribute('hidden');
  }

  // Sin número de WhatsApp, el enlace se queda como texto normal
  const whatsapp = String(BODA.whatsapp || '').replace(/\D/g, '');
  $$('[data-whatsapp]').forEach(el => {
    if (whatsapp) el.href = `https://wa.me/${whatsapp}`;
    else el.replaceWith(document.createTextNode(el.textContent));
  });
})();

/* ---------- 2. Añadir al calendario ------------------------- */
(function calendario(){
  const google = $('#calGoogle');
  const ics = $('#calIcs');
  const inicio = new Date(BODA.fecha);
  if (isNaN(inicio) || (!google && !ics)) return;

  const fin = new Date(inicio.getTime() + BODA.duracionHoras * 3600 * 1000);
  const utc = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const titulo = 'Boda de Isabel y Amaro';
  const detalles = `Toda la información: ${location.href.split('#')[0]}`;

  if (google) {
    google.href = 'https://calendar.google.com/calendar/render?' + new URLSearchParams({
      action: 'TEMPLATE',
      text: titulo,
      dates: `${utc(inicio)}/${utc(fin)}`,
      details: detalles,
      location: BODA.lugar
    });
  }

  if (ics) {
    const escapar = s => String(s).replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
    const texto = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Isabel y Amaro//Boda//ES',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:boda-isabel-amaro-${utc(inicio)}@isabel-amaro`,
      `DTSTAMP:${utc(new Date())}`,
      `DTSTART:${utc(inicio)}`,
      `DTEND:${utc(fin)}`,
      `SUMMARY:${escapar(titulo)}`,
      `LOCATION:${escapar(BODA.lugar)}`,
      `DESCRIPTION:${escapar(detalles)}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    ics.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(texto);
  }
})();

/* ---------- 3. Cuenta atrás --------------------------------- */
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
      box.innerHTML = '<p class="countdown__today">¡Hoy es el día!</p>';
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

/* ---------- 4. Menú móvil ----------------------------------- */
(function menuMovil(){
  const toggle = $('#navToggle');
  const menu   = $('#navMenu');
  if (!toggle || !menu) return;

  const etiqueta = $('[data-toggle-label]', toggle);
  const marcar = abierto => {
    menu.classList.toggle('is-open', abierto);
    toggle.setAttribute('aria-expanded', String(abierto));
    if (etiqueta) etiqueta.textContent = abierto ? 'Cerrar menú' : 'Abrir menú';
  };
  const cerrar = () => marcar(false);

  toggle.addEventListener('click', () => marcar(!menu.classList.contains('is-open')));

  $$('a', menu).forEach(a => a.addEventListener('click', cerrar));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrar(); });
  // Un toque fuera del menú lo cierra
  document.addEventListener('click', e => {
    if (menu.classList.contains('is-open') && !menu.contains(e.target) && !toggle.contains(e.target)) cerrar();
  });
  window.addEventListener('resize', () => { if (innerWidth > 960) cerrar(); });
})();

/* ---------- 5. Fondo del nav al hacer scroll ---------------- */
(function navPegajoso(){
  const nav = $('#nav');
  if (!nav) return;
  const alternar = () => nav.classList.toggle('is-stuck', scrollY > 24);
  alternar();
  addEventListener('scroll', alternar, { passive: true });
})();

/* ---------- 6. Botón de confirmar del menú ----------------- */
// Solo aparece cuando el botón de la portada no está a la vista.
(function ctaDelMenu(){
  const nav = $('#nav');
  const delHero = $('.hero .btn');
  if (!nav || !delHero || !('IntersectionObserver' in window)) return;

  nav.classList.add('js-cta');
  new IntersectionObserver(([e]) => {
    nav.classList.toggle('has-cta', e.intersectionRatio < .5);
  }, { threshold: [0, .5, 1] }).observe(delHero);
})();

/* ---------- 7. Sección activa en el menú -------------------- */
(function seccionActiva(){
  // Una sola sección activa: la que cruza la línea a media pantalla.
  // Las que no están en el menú (bienvenida, confirmación) no marcan ninguna.
  const enlaces = $$('.nav__menu a[href^="#"]');
  const secciones = $$('main section[id]');
  if (!enlaces.length || !secciones.length) return;

  let pendiente = false;
  function actualizar(){
    pendiente = false;
    const linea = innerHeight * .45;
    const actual = secciones.filter(s => s.getBoundingClientRect().top <= linea).pop();
    const id = actual && actual.getBoundingClientRect().bottom > linea ? actual.id : '';
    enlaces.forEach(a => {
      const activo = a.getAttribute('href') === '#' + id;
      a.classList.toggle('is-active', activo);
      if (activo) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
  }
  const pedir = () => { if (!pendiente) { pendiente = true; requestAnimationFrame(actualizar); } };
  addEventListener('scroll', pedir, { passive: true });
  addEventListener('resize', pedir);
  actualizar();
})();

/* ---------- 8. Copiar el IBAN ------------------------------- */
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
      aviso.textContent = 'Número copiado';
      clearTimeout(btn._t);
      btn._t = setTimeout(() => { aviso.textContent = ''; }, 2500);
    }
  });
})();

/* ---------- 9. Enlaces aún sin dirección ------------------ */
// Un enlace que se abriría en otra pestaña pero sigue en "#" es un hueco
// pendiente (p. ej. reservas de hotel): se oculta hasta que tenga URL real.
$$('a[href="#"][target="_blank"]').forEach(a => { a.hidden = true; });

/* ---------- 10. Imprimir con las preguntas desplegadas ------- */
addEventListener('beforeprint', () => { $$('details').forEach(d => { d.open = true; }); });
