// ══ SCROLL REVEAL ══
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  els.forEach(el => obs.observe(el));
}

// ══ COUNTERS ══
// El HTML ya trae el número final (para quien no ejecute JS).
// Aquí solo se anima de 0 hasta ese valor cuando entra en pantalla.
function initCounters() {
  const els = document.querySelectorAll('.metric-val');
  if (!els.length) return;

  // Sin animación si el usuario pidió reducir movimiento: se queda el valor real.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      obs.unobserve(el);

      const target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target)) return;

      let cur = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      el.textContent = '0';
      const t = setInterval(() => {
        cur += step;
        if (cur >= target) { clearInterval(t); el.textContent = target; }
        else el.textContent = cur;
      }, 40);
    });
  }, { threshold: 0.6 });
  els.forEach(v => obs.observe(v));
}
