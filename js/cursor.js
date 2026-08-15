// ══ CURSOR PERSONALIZADO ══
function initCursor() {
  // En táctil o con movimiento reducido se usa el cursor nativo del sistema.
  // El tamaño de pantalla lo decide el CSS (@media), no el JS: así el cursor
  // reacciona si el usuario redimensiona, sin tener que recargar la página.
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!finePointer || reduceMotion) return;

  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  dot.setAttribute('aria-hidden', 'true');
  ring.setAttribute('aria-hidden', 'true');
  document.body.append(dot, ring);

  let mx = 0, my = 0;        // posición real del mouse
  let rx = 0, ry = 0;        // posición del anillo, interpolada hacia el mouse
  let visible = false;
  let rafId = null;

  const EASE = 0.18; // qué tan rápido alcanza el anillo al puntero

  function onMove(e) {
    mx = e.clientX;
    my = e.clientY;

    // El punto va pegado al mouse, sin retraso
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;

    if (!visible) {
      visible = true;
      rx = mx; ry = my;          // arranca donde está el mouse, no en 0,0
      dot.classList.add('is-active');
      ring.classList.add('is-active');
      loop();
    }
  }

  function loop() {
    rx += (mx - rx) * EASE;
    ry += (my - ry) * EASE;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;

    // Si ya alcanzó al puntero, deja de pedir frames hasta el próximo movimiento
    if (Math.abs(mx - rx) < 0.1 && Math.abs(my - ry) < 0.1) {
      rx = mx; ry = my;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      rafId = null;
      return;
    }
    rafId = requestAnimationFrame(loop);
  }

  document.addEventListener('mousemove', e => {
    onMove(e);
    if (rafId === null && visible) rafId = requestAnimationFrame(loop);
  }, { passive: true });

  // Al salir de la ventana se oculta, en vez de quedarse clavado en el borde
  document.addEventListener('mouseleave', () => {
    dot.classList.remove('is-active');
    ring.classList.remove('is-active');
  });
  document.addEventListener('mouseenter', () => {
    if (visible) {
      dot.classList.add('is-active');
      ring.classList.add('is-active');
    }
  });

  // Retroalimentación de clic
  document.addEventListener('mousedown', () => ring.classList.add('is-down'));
  document.addEventListener('mouseup',   () => ring.classList.remove('is-down'));

  // Estado hover por delegación: un solo par de listeners en lugar de
  // dos por cada enlace, botón y tarjeta de la página. Además funciona
  // con elementos que se agreguen después.
  const INTERACTIVE = 'a, button, .project-card, .pf-card, .skill-cluster, .hb-chip, .contact-item, .os-badge, .metric-card';
  const TEXT_FIELDS = 'input, textarea, [contenteditable="true"]';

  document.addEventListener('mouseover', e => {
    if (e.target.closest(TEXT_FIELDS))      ring.classList.add('is-text');
    else if (e.target.closest(INTERACTIVE)) ring.classList.add('is-hover');
  });

  document.addEventListener('mouseout', e => {
    if (e.target.closest(TEXT_FIELDS))      ring.classList.remove('is-text');
    else if (e.target.closest(INTERACTIVE)) ring.classList.remove('is-hover');
  });

  // Si la pestaña se va a segundo plano, corta la animación pendiente
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  });
}
