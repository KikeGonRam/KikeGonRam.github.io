// ══ PARTICLES ══
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  // Respeta a quien pidió menos animación en su sistema operativo.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMotion.matches) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles, rafId = null, running = false;
  const mouse = { x: null, y: null, r: 120 };

  const MAX_PARTICLES = 90;   // techo: el trazado de conexiones es O(n²)
  const LINK_DIST = 100;
  const LINK_DIST_SQ = LINK_DIST * LINK_DIST;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function buildParticles() {
    const count = Math.min(MAX_PARTICLES, Math.floor((W * H) / 14000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4,
      r: Math.random() * 1.8 + .6,
      alpha: Math.random() * .5 + .2
    }));
  }

  resize();
  buildParticles();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); buildParticles(); }, 150);
  });

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // Repele con el mouse
      if (mouse.x !== null) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.r && dist > 0) {
          const force = (mouse.r - dist) / mouse.r;
          p.x += dx / dist * force * 1.5;
          p.y += dy / dist * force * 1.5;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,255,${p.alpha})`;
      ctx.fill();
    });

    // Líneas entre partículas cercanas (se compara al cuadrado para evitar sqrt)
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distSq = dx*dx + dy*dy;
        if (distSq < LINK_DIST_SQ) {
          const alpha = (1 - Math.sqrt(distSq) / LINK_DIST) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }
    rafId = requestAnimationFrame(draw);
  }

  let inView = false;

  function start() { if (!running) { running = true; draw(); } }
  function stop()  { running = false; if (rafId) cancelAnimationFrame(rafId); rafId = null; }

  // Anima solo si el hero está a la vista Y la pestaña está activa.
  function sync() {
    (inView && !document.hidden) ? start() : stop();
  }

  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    sync();
  }, { threshold: 0 }).observe(canvas);

  document.addEventListener('visibilitychange', sync);
}
