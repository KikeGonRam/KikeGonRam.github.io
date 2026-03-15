/* ══════════════════════════════════════════
   LUIS GONZÁLEZ RAMÍREZ — Portfolio JS v3
   Boot · Particles · Glitch · All interactions
   ══════════════════════════════════════════ */

// ══ BOOT SCREEN ══
const bootLines = [
  '[ OK ] Iniciando sistema...',
  '[ OK ] Cargando módulos de seguridad...',
  '[ OK ] Conectando con bausen.mx...',
  '[ OK ] Verificando credenciales...',
  '[ OK ] Cargando stack: Java · Spring · Next.js...',
  '[ OK ] Inicializando base de datos MySQL...',
  '[ OK ] Montando portfolio v3.0...',
  '[ OK ] Sistema listo.'
];

const loader   = document.getElementById('loader');
const bootEl   = document.getElementById('boot-lines');
const bootBar  = document.getElementById('boot-bar');
const bootPct  = document.getElementById('boot-pct');

let lineIdx = 0;
let pct = 0;

function nextLine() {
  if (lineIdx < bootLines.length) {
    const p = document.createElement('p');
    const color = bootLines[lineIdx].startsWith('[ OK ]') ? '#00ff9d' : '#00d4ff';
    p.innerHTML = `<span style="color:${color}">${bootLines[lineIdx]}</span>`;
    bootEl.appendChild(p);
    lineIdx++;
    const step = Math.floor(100 / bootLines.length);
    pct = Math.min(pct + step + Math.random() * 5, lineIdx === bootLines.length ? 100 : 95);
    bootBar.style.width = pct + '%';
    bootPct.textContent = Math.floor(pct) + '%';
    const delay = lineIdx < bootLines.length ? 220 + Math.random() * 180 : 400;
    if (lineIdx < bootLines.length) setTimeout(nextLine, delay);
    else setTimeout(finishBoot, 600);
  }
}

function finishBoot() {
  bootBar.style.width = '100%';
  bootPct.textContent = '100%';
  setTimeout(() => {
    loader.classList.add('done');
    document.body.style.overflow = 'auto';
    startEverything();
  }, 400);
}

document.body.style.overflow = 'hidden';
setTimeout(nextLine, 300);

// ══ START AFTER BOOT ══
function startEverything() {
  initParticles();
  initScrollReveal();
  initSkillBars();
  initMetricBars();
  initCounters();
  initNavbar();
  initTyping();
  initUptime();
  fetchGitHub();
  initSendBtn();
  initCursor();
  duplicateTicker();
  updateClock();
  setInterval(updateClock, 1000);
}

// ══ TICKER ══
function duplicateTicker() {
  const t = document.getElementById('ticker-inner');
  if (t) t.innerHTML += t.innerHTML;
}

// ══ CLOCK ══
function updateClock() {
  const el = document.getElementById('live-clock');
  if (!el) return;
  const d = new Date();
  el.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} CST`;
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

// ══ PARTICLES ══
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles, mouse = { x: null, y: null, r: 120 };

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); buildParticles(); });

  function buildParticles() {
    const count = Math.floor((W * H) / 14000);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4,
      r: Math.random() * 1.8 + .6,
      alpha: Math.random() * .5 + .2
    }));
  }
  buildParticles();

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

      // Mouse repel
      if (mouse.x !== null) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < mouse.r) {
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

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${(1 - dist/100) * 0.15})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

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

// ══ SKILL BARS ══
function initSkillBars() {
  const clusters = document.querySelectorAll('.skill-cluster');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.sc-bar div').forEach((bar, i) => {
          const p = bar.style.getPropertyValue('--p');
          setTimeout(() => { bar.style.width = p; }, i * 100);
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  clusters.forEach(c => obs.observe(c));
}

// ══ METRIC BARS ══
function initMetricBars() {
  const bars = document.querySelectorAll('.mb-fill');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const w = getComputedStyle(entry.target).getPropertyValue('--w').trim();
        setTimeout(() => { entry.target.style.width = w; }, 400);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  bars.forEach(b => obs.observe(b));
}

// ══ COUNTERS ══
function initCounters() {
  const els = document.querySelectorAll('.metric-val');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        if (!isNaN(target)) {
          let cur = 0;
          const step = Math.max(1, Math.ceil(target / 40));
          const t = setInterval(() => {
            cur += step;
            if (cur >= target) { clearInterval(t); el.textContent = target; }
            else el.textContent = cur;
          }, 40);
        }
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.6 });
  els.forEach(v => obs.observe(v));
}

// ══ NAVBAR ══
function initNavbar() {
  const nav = document.getElementById('navbar');
  const burger = document.getElementById('nav-burger');
  const links  = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      nav.style.background = 'rgba(3,8,16,0.98)';
      nav.style.boxShadow  = '0 1px 24px rgba(0,0,0,.6)';
    } else {
      nav.style.background = 'rgba(3,8,16,0.92)';
      nav.style.boxShadow  = 'none';
    }
  }, { passive: true });

  if (burger) {
    burger.addEventListener('click', () => {
      links.classList.toggle('open');
    });
  }

  // Active link
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 100) current = s.id;
    });
    navLinks.forEach(a => {
      a.style.color = (a.getAttribute('href') === `#${current}`) ? 'var(--cyan)' : '';
    });
  }, { passive: true });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) {
        e.preventDefault();
        window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
        links.classList.remove('open');
      }
    });
  });
}

// ══ TYPING EFFECT ══
function initTyping() {
  const el = document.getElementById('hero-typing');
  if (!el) return;
  const words = [
    'Software Developer',
    'Full-Stack Engineer',
    'Bausen · Infraestructura',
    'Next.js + Spring Boot',
    'Código en producción',
    'UTVT IDGS-84'
  ];
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

// ══ GITHUB API ══
function fetchGitHub() {
  fetch('https://api.github.com/users/KikeGonRam')
    .then(r => r.json())
    .then(data => {
      const repos = document.getElementById('gh-repos');
      const followers = document.getElementById('gh-followers');
      const gists = document.getElementById('gh-gists');
      if (repos && data.public_repos !== undefined) repos.textContent = data.public_repos;
      if (followers && data.followers !== undefined) followers.textContent = data.followers;
      if (gists && data.public_gists !== undefined) gists.textContent = data.public_gists;
    })
    .catch(() => {
      ['gh-repos','gh-followers','gh-gists'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '--';
      });
    });
}

// ══ SEND BUTTON ══
function initSendBtn() {
  const btn = document.getElementById('send-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    btn.innerHTML = '<i class="fas fa-check"></i><span class="mono">message_sent = true ✓</span>';
    btn.style.background = '#00a854';
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i><span class="mono">send_message()</span>';
      btn.style.background = 'var(--cyan)';
      btn.style.color = '#011824';
    }, 3000);
  });
}

// ══ CUSTOM CURSOR ══
function initCursor() {
  if (window.innerWidth <= 900 || 'ontouchstart' in window) return;

  const dot = document.createElement('div');
  dot.style.cssText = 'position:fixed;width:5px;height:5px;border-radius:50%;background:var(--cyan);pointer-events:none;z-index:99999;transform:translate(-50%,-50%);transition:transform .08s;will-change:left,top;';
  const ring = document.createElement('div');
  ring.style.cssText = 'position:fixed;width:28px;height:28px;border-radius:50%;border:1.5px solid rgba(0,212,255,.4);pointer-events:none;z-index:99998;transform:translate(-50%,-50%);transition:left .12s,top .12s,transform .22s,border-color .2s;will-change:left,top;';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  document.addEventListener('mousemove', e => {
    dot.style.left = ring.style.left = e.clientX + 'px';
    dot.style.top  = ring.style.top  = e.clientY + 'px';
  });

  document.querySelectorAll('a,button,.project-card,.pf-card,.skill-cluster,.cert-card,.hb-chip').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.transform = 'translate(-50%,-50%) scale(2.2)';
      ring.style.borderColor = 'rgba(0,212,255,.75)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.transform = 'translate(-50%,-50%) scale(1)';
      ring.style.borderColor = 'rgba(0,212,255,.4)';
    });
  });
}