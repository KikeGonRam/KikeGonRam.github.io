/* ══ INIT — arranca todo al cargar el DOM ══ */
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initScrollReveal();
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

  // Año del footer al día, sin tener que editarlo cada enero
  const year = document.getElementById('footer-year');
  if (year) year.textContent = new Date().getFullYear();
});
