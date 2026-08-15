// ══ NAVBAR ══
function initNavbar() {
  const nav = document.getElementById('navbar');
  const burger = document.getElementById('nav-burger');
  const links  = document.getElementById('nav-links');

  function setMenu(open) {
    links.classList.toggle('open', open);
    if (burger) {
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    }
  }

  if (burger) {
    burger.addEventListener('click', () => {
      setMenu(!links.classList.contains('open'));
    });
  }

  // Escape cierra el menú móvil
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && links.classList.contains('open')) {
      setMenu(false);
      burger?.focus();
    }
  });

  // Fondo del navbar + link activo, en un solo listener throttleado por frame
  // (antes eran dos listeners recalculando en cada evento de scroll).
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  let ticking = false;
  let lastCurrent = null;

  function onScroll() {
    const y = window.scrollY;

    const scrolled = y > 80;
    nav.style.background = scrolled ? 'rgba(3,8,16,0.98)' : 'rgba(3,8,16,0.92)';
    nav.style.boxShadow  = scrolled ? '0 1px 24px rgba(0,0,0,.6)' : 'none';

    let current = '';
    sections.forEach(s => {
      if (y >= s.offsetTop - 100) current = s.id;
    });

    // Solo toca el DOM de los links cuando la sección realmente cambió
    if (current !== lastCurrent) {
      lastCurrent = current;
      navLinks.forEach(a => {
        const active = a.getAttribute('href') === `#${current}`;
        a.style.color = active ? 'var(--cyan)' : '';
        if (active) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) {
        e.preventDefault();
        window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
        setMenu(false);
      }
    });
  });
}

