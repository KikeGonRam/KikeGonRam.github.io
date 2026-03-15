/* ══════════════════════════════════════════
   LUIS GONZÁLEZ RAMÍREZ — Portfolio JS
   Dashboard de Servidor · Interactions
   ══════════════════════════════════════════ */

// ── TICKER: duplicate for seamless loop ──
const tickerInner = document.getElementById('ticker-inner');
if (tickerInner) {
  tickerInner.innerHTML += tickerInner.innerHTML;
}

// ── LIVE CLOCK ──
function updateClock() {
  const el = document.getElementById('live-clock');
  if (!el) return;
  const now = new Date();
  const h   = String(now.getHours()).padStart(2, '0');
  const m   = String(now.getMinutes()).padStart(2, '0');
  const s   = String(now.getSeconds()).padStart(2, '0');
  el.textContent = `${h}:${m}:${s} CST`;
}
setInterval(updateClock, 1000);
updateClock();

// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ── SKILL BARS ──
const skillPanels = document.querySelectorAll('.skill-panel');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.sr-fill').forEach((bar, i) => {
        const w = bar.getAttribute('data-w');
        if (w) {
          setTimeout(() => { bar.style.width = w + '%'; }, i * 120);
        }
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.25 });

skillPanels.forEach(p => skillObserver.observe(p));

// ── METRIC BARS (animate when in view) ──
const metricBars = document.querySelectorAll('.mb-fill');
const mbObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const w  = getComputedStyle(el).getPropertyValue('--w').trim();
      setTimeout(() => { el.style.width = w; }, 300);
      mbObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
metricBars.forEach(b => mbObserver.observe(b));

// ── METRIC COUNTERS ──
const metricVals = document.querySelectorAll('.metric-val');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'));
      if (!isNaN(target)) {
        let current = 0;
        const step  = Math.max(1, Math.floor(target / 35));
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            clearInterval(timer);
            el.textContent = target;
          } else {
            el.textContent = current;
          }
        }, 40);
      }
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.6 });
metricVals.forEach(v => counterObserver.observe(v));

// ── NAVBAR SCROLL BEHAVIOR ──
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const current = window.scrollY;

  if (current > 80) {
    navbar.style.background = 'rgba(6,10,16,0.98)';
    navbar.style.boxShadow  = '0 1px 24px rgba(0,0,0,.55)';
  } else {
    navbar.style.background = 'rgba(6,10,16,0.92)';
    navbar.style.boxShadow  = 'none';
  }

  lastScroll = current;
});

// ── ACTIVE NAV LINK ──
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    const isActive = link.getAttribute('href') === `#${current}`;
    link.style.color = isActive ? 'var(--green)' : '';
  });
}, { passive: true });

// ── SEND BUTTON (UI feedback) ──
const sendBtn = document.getElementById('send-btn');
if (sendBtn) {
  sendBtn.addEventListener('click', () => {
    sendBtn.innerHTML = '<i class="fas fa-check"></i><span class="mono">message_sent = true ✓</span>';
    sendBtn.style.background = '#00a854';
    setTimeout(() => {
      sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i><span class="mono">send_message()</span>';
      sendBtn.style.background = 'var(--green)';
    }, 3000);
  });
}

// ── CUSTOM CURSOR (desktop only) ──
if (window.innerWidth > 900 && !('ontouchstart' in window)) {
  const dot = document.createElement('div');
  dot.style.cssText = `
    position: fixed; width: 5px; height: 5px; border-radius: 50%;
    background: var(--green); pointer-events: none; z-index: 99999;
    transform: translate(-50%, -50%); transition: transform .08s;
    will-change: left, top;
  `;
  const ring = document.createElement('div');
  ring.style.cssText = `
    position: fixed; width: 26px; height: 26px; border-radius: 50%;
    border: 1px solid rgba(0,212,106,.45); pointer-events: none; z-index: 99998;
    transform: translate(-50%, -50%); transition: left .1s ease, top .1s ease, transform .22s;
    will-change: left, top;
  `;
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  document.addEventListener('mousemove', e => {
    dot.style.left = e.clientX + 'px';
    dot.style.top  = e.clientY + 'px';
    ring.style.left = e.clientX + 'px';
    ring.style.top  = e.clientY + 'px';
  });

  const interactables = document.querySelectorAll('a, button, .project-card, .skill-panel, .contact-item, .os-badge');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.transform = 'translate(-50%, -50%) scale(2)';
      ring.style.borderColor = 'rgba(0,212,106,.7)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.transform = 'translate(-50%, -50%) scale(1)';
      ring.style.borderColor = 'rgba(0,212,106,.45)';
    });
  });
}

// ── PROJECT CARD: terminal header path glow on hover ──
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    const path = card.querySelector('.pc-path');
    if (path) path.style.color = 'var(--green)';
  });
  card.addEventListener('mouseleave', () => {
    const path = card.querySelector('.pc-path');
    if (path) path.style.color = '';
  });
});

// ── SMOOTH SCROLL for internal links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 84; // status-bar + navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});