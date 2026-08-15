// ══ SEND BUTTON ══
function initSendBtn() {
  const btn = document.getElementById('send-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const name = document.getElementById('c-name')?.value.trim() || '';
    const email = document.getElementById('c-email')?.value.trim() || '';
    const msg = document.getElementById('c-msg')?.value.trim() || '';
    if (!msg) {
      document.getElementById('c-msg')?.focus();
      return;
    }
    const subject = encodeURIComponent(`Contacto desde el portfolio — ${name || 'Sin nombre'}`);
    const body = encodeURIComponent(`Nombre: ${name}\nEmail: ${email}\n\n${msg}`);
    window.location.href = `mailto:kikeramirez160418@gmail.com?subject=${subject}&body=${body}`;
  });
}
