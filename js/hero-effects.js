// ══ TICKER ══
// Se duplica el contenido para que el scroll infinito no deje huecos.
// La copia usa class en vez de id: duplicar un id rompe getElementById
// y dejaba el segundo reloj congelado en --:--:--.
function duplicateTicker() {
  const t = document.getElementById('ticker-inner');
  if (!t) return;
  const clone = t.cloneNode(true);
  clone.removeAttribute('id');
  clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
  t.append(...clone.childNodes);
}

// ══ CLOCK ══
function updateClock() {
  const els = document.querySelectorAll('.live-clock');
  if (!els.length) return;
  const d = new Date();
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} CST`;
  els.forEach(el => { el.textContent = time; });
}
function pad(n) { return String(n).padStart(2, '0'); }

// ══ UPTIME ══
function initUptime() {
  const el = document.getElementById('uptime-val');
  if (!el) return;
  const start = new Date('2025-08-15').getTime();
  function update() {
    const diff = Date.now() - start;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    el.textContent = `${d}d ${h}h ${m}m`;
  }
  update();
  setInterval(update, 60000);
}

// ══ TYPING EFFECT ══
function initTyping() {
  const el = document.getElementById('hero-typing');
  if (!el) return;
  const words = [
    'Software Developer',
    'Next.js + Spring Boot',
    'Código en producción',
    'UTVT'
  ];

  // Con "reducir movimiento" activo se muestra el texto fijo, sin tecleo.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = words[0];
    return;
  }

  let wi = 0, ci = 0, deleting = false;

  function type() {
    const word = words[wi];
    if (!deleting) {
      el.textContent = word.substring(0, ci + 1);
      ci++;
      if (ci === word.length) { deleting = true; setTimeout(type, 1800); return; }
    } else {
      el.textContent = word.substring(0, ci - 1);
      ci--;
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
    }
    setTimeout(type, deleting ? 45 : 90);
  }
  type();
}
