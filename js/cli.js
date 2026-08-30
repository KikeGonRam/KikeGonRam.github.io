(function () {
  const trigger = document.getElementById('cli-trigger');
  const overlay = document.getElementById('cli-overlay');
  const closeBtn = document.getElementById('cli-close');
  const body = document.getElementById('cli-body');
  const input = document.getElementById('cli-input');
  const form = document.getElementById('cli-form');
  if (!trigger || !overlay || !body || !input || !form) return;

  const history = [];
  let historyIndex = -1;

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function print(html, cls) {
    const line = document.createElement('div');
    line.className = cls || 'cli-out';
    line.innerHTML = html;
    body.appendChild(line);
    body.scrollTop = body.scrollHeight;
  }

  function echo(cmd) {
    print('<span class="cli-p">luis@dev:~$</span> ' + escapeHtml(cmd), 'cli-line cli-prompt-echo');
  }

  function open() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    input.focus();
  }

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    trigger.focus();
  }

  const commands = {
    help: () => 'Comandos disponibles:\n' +
      '  <strong>whoami</strong>     - quien soy\n' +
      '  <strong>about</strong>      - sobre mi\n' +
      '  <strong>experience</strong> - experiencia profesional\n' +
      '  <strong>projects</strong>   - proyectos en produccion\n' +
      '  <strong>skills</strong>     - stack tecnico\n' +
      '  <strong>contact</strong>    - como contactarme\n' +
      '  <strong>cv</strong>         - abrir CV\n' +
      '  <strong>github</strong>     - abrir GitHub\n' +
      '  <strong>clear</strong>      - limpiar pantalla\n' +
      '  <strong>exit</strong>       - cerrar terminal',

    whoami: () => 'luis@dev - Luis Enrique Gonzalez Ramirez, Software Developer. Toluca, Mexico.',

    about: () => 'Desarrollador de software, T.S.U. titulado y actualmente cursando Ingenieria en\n' +
      'Desarrollo y Gestion de Software en la UTVT.\n' +
      'Full-stack con Java/Spring Boot, Next.js/TypeScript y una capa de datos/ML con PySpark.\n' +
      'Fuera del codigo: ciberseguridad, arquitectura de sistemas y redes.',

    experience: () => 'Software Developer - Infraestructura Digital Corporativa (Ago 2025 - Presente)\n' +
      '  Desarrollo del login principal del portal corporativo y mantenimiento en\n' +
      '  equipo de una plataforma de pagos institucional en produccion.\n\n' +
      'Desarrollador en Estadia (Abr 2025 - Ago 2025)\n' +
      '  Estadia profesional universitaria. Contratacion formalizada al termino.',

    projects: () => '~/payments-platform/   Plataforma de Pagos Institucional - Next.js, TypeScript, TLS\n' +
      '~/corporate-portal/    Portal Corporativo (Login)   - Next.js, TLS, Auth\n' +
      '~/urbanblade/          Web + Mobile + ML - ' +
        '<a href="https://github.com/KikeGonRam/barber" target="_blank" rel="noopener noreferrer">barber</a> . ' +
        '<a href="https://github.com/KikeGonRam/mobil" target="_blank" rel="noopener noreferrer">mobil</a> . ' +
        '<a href="https://github.com/KikeGonRam/spark" target="_blank" rel="noopener noreferrer">spark</a>\n' +
      'dbmonitor/             Observabilidad MySQL/MongoDB - ' +
        '<a href="https://github.com/KikeGonRam/dbmonitor" target="_blank" rel="noopener noreferrer">GitHub</a>\n' +
      'vulncore/              Escaner de vulnerabilidades - ' +
        '<a href="https://github.com/KikeGonRam/vulncore" target="_blank" rel="noopener noreferrer">GitHub</a>\n' +
      'evaluacion-docente-api/ API REST Spring Boot - ' +
        '<a href="https://github.com/KikeGonRam/evaluacion-docente-api" target="_blank" rel="noopener noreferrer">GitHub</a>',

    skills: () => 'backend/      Java . Spring Boot . Python . PHP/Laravel . REST APIs\n' +
      'frontend/     Next.js . React . TypeScript . Tailwind CSS\n' +
      'data & db/    MySQL . MongoDB . Redis . Pandas\n' +
      'security/     TLS/HTTPS . JWT . CVE Scanning (OSV/NVD) . RBAC\n' +
      'data & ml/    PySpark . Scikit-learn/PyTorch . XGBoost/LightGBM\n' +
      'devops/       Git . GitHub Actions . CI/CD . Docker',

    contact: () => 'email     kikeramirez160418@gmail.com\n' +
      'whatsapp  <a href="https://wa.me/527222501340" target="_blank" rel="noopener noreferrer">wa.me/527222501340</a>\n' +
      'github    <a href="https://github.com/KikeGonRam" target="_blank" rel="noopener noreferrer">github.com/KikeGonRam</a>',
  };

  function run(raw) {
    const cmd = raw.trim();
    if (!cmd) return;
    echo(raw);
    history.push(raw);
    historyIndex = history.length;

    const key = cmd.toLowerCase();
    if (key === 'clear') { body.innerHTML = ''; return; }
    if (key === 'exit') { close(); return; }
    if (key === 'cv') { print('Abriendo CV...'); window.open('cv.html', '_blank', 'noopener'); return; }
    if (key === 'github') { print('Abriendo GitHub...'); window.open('https://github.com/KikeGonRam', '_blank', 'noopener'); return; }
    if (key === 'sudo' || key.indexOf('sudo ') === 0) {
      print('Permiso denegado: hasta root respeta la produccion.', 'cli-err');
      return;
    }

    if (commands[key]) {
      print(commands[key](), 'cli-out');
    } else {
      print('bash: ' + escapeHtml(cmd) + ': comando no encontrado. Escribe <strong>help</strong>.', 'cli-err');
    }
  }

  trigger.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) close();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const val = input.value;
    input.value = '';
    run(val);
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) { historyIndex--; input.value = history[historyIndex]; }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < history.length - 1) { historyIndex++; input.value = history[historyIndex]; }
      else { historyIndex = history.length; input.value = ''; }
    }
  });
})();
