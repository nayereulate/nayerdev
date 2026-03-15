/* ═══════════════════════════════════════
   NAYER DEV — script.js v2.0
═══════════════════════════════════════ */

// ── MATRIX CANVAS ──
const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');
let matW, matH, drops;
const chars = '01アイウエオカキ@#$%{}[]<>ナイヤデブ01101001';

function initMatrix() {
  matW = canvas.width = window.innerWidth;
  matH = canvas.height = window.innerHeight;
  const cols = Math.floor(matW / 18);
  drops = Array.from({ length: cols }, () => Math.random() * -50);
}

function drawMatrix() {
  ctx.fillStyle = 'rgba(5,12,7,0.06)';
  ctx.fillRect(0, 0, matW, matH);
  ctx.font = '13px Space Mono, monospace';
  drops.forEach((y, i) => {
    const intensity = Math.random();
    ctx.fillStyle = intensity > 0.95
      ? `rgba(180,255,220,${intensity})`
      : `rgba(0,255,136,${0.3 + intensity * 0.5})`;
    const ch = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(ch, i * 18, y * 18);
    if (y * 18 > matH && Math.random() > 0.975) drops[i] = 0;
    drops[i] += 0.5;
  });
}

initMatrix();
window.addEventListener('resize', initMatrix);
setInterval(drawMatrix, 45);

// ── CUSTOM CURSOR ──
const cursor = document.getElementById('cursor');
const trail  = document.getElementById('cursor-trail');
let mx = 0, my = 0, tx = 0, ty = 0;

if (cursor && trail) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  function animTrail() {
    tx += (mx - tx) * 0.14;
    ty += (my - ty) * 0.14;
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    requestAnimationFrame(animTrail);
  }
  animTrail();

  document.querySelectorAll('a, button, .sv-card, .sitem, .red-card, .eco-card, .foto-frame').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

// ── NAV SCROLL ──
const nav = document.getElementById('nav');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const s = window.scrollY;
  nav.classList.toggle('scrolled', s > 40);
  lastScroll = s;
});

// ── HAMBURGER ──
const burger = document.getElementById('hamburger');
const mMenu  = document.getElementById('mobile-menu');
burger?.addEventListener('click', () => {
  burger.classList.toggle('open');
  mMenu.classList.toggle('open');
});
mMenu?.querySelectorAll('.mobile-link').forEach(l => {
  l.addEventListener('click', () => {
    burger.classList.remove('open');
    mMenu.classList.remove('open');
  });
});

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const el = document.querySelector(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── TERMINAL ──
const typingEl  = document.getElementById('typing-text');
const termOut   = document.getElementById('term-out');
const sequences = [
  {
    cmd: 'whoami',
    lines: [
      { t: '→ nayer_dev', c: 'tol-g' },
      { t: '→ dev | creador | founder', c: '' },
      { t: '→ Cochabamba, Bolivia 🇧🇴', c: '' },
    ]
  },
  {
    cmd: 'cat skills.txt',
    lines: [
      { t: 'python  javascript  react  node', c: 'tol-b' },
      { t: 'hacking  linux  kali  IA/GPT', c: 'tol-b' },
      { t: 'marketing  SaaS  startup  📈', c: 'tol-g' },
    ]
  },
  {
    cmd: './run vision.sh',
    lines: [
      { t: 'loading plan_maestro_nayerdev...', c: 'tol-y' },
      { t: '[✓] Bolivia → Perú → Colombia → LATAM', c: 'tol-g' },
      { t: '[✓] marketplace + SaaS + cursos', c: 'tol-g' },
    ]
  },
  {
    cmd: 'nayer --status',
    lines: [
      { t: '[✓] YouTube @nayerdev: activo', c: 'tol-g' },
      { t: '[✓] TikTok: 1,500+ seguidores', c: 'tol-g' },
      { t: '[✓] IA engine: 100% operativo', c: 'tol-g' },
    ]
  },
  {
    cmd: 'git log --oneline',
    lines: [
      { t: 'a3f9b12 lanzar canal YouTube hacker', c: '' },
      { t: '8cd2e45 crear primer curso Hotmart', c: '' },
      { t: '1f7a390 init marketplace Bolivia 🚀', c: 'tol-g' },
    ]
  }
];

let seqIdx = 0;

function typeCmd(seq) {
  if (!typingEl || !termOut) return;
  termOut.innerHTML = '';
  typingEl.textContent = '';
  let i = 0;
  const iv = setInterval(() => {
    if (i < seq.cmd.length) {
      typingEl.textContent += seq.cmd[i++];
    } else {
      clearInterval(iv);
      setTimeout(() => showLines(seq.lines), 350);
    }
  }, 55);
}

function showLines(lines) {
  lines.forEach((l, idx) => {
    setTimeout(() => {
      const d = document.createElement('div');
      d.className = 'tol' + (l.c ? ' ' + l.c : '');
      d.textContent = l.t;
      termOut.appendChild(d);
    }, idx * 180);
  });
  const wait = lines.length * 180 + 2000;
  setTimeout(() => {
    seqIdx = (seqIdx + 1) % sequences.length;
    typeCmd(sequences[seqIdx]);
  }, wait);
}

setTimeout(() => typeCmd(sequences[0]), 600);

// ── COUNTER ANIMATION ──
function countUp(el, target, dur = 1400) {
  const start = performance.now();
  const run = (now) => {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(eased * target).toLocaleString('es');
    if (p < 1) requestAnimationFrame(run);
    else el.textContent = target.toLocaleString('es');
  };
  requestAnimationFrame(run);
}

// ── REVEAL ON SCROLL ──
const revels = document.querySelectorAll('[data-reveal]');
const revObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      entry.target.querySelectorAll('[data-count]').forEach(c => {
        countUp(c, parseInt(c.dataset.count));
      });
      revObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revels.forEach(el => revObs.observe(el));

// ── ECOSISTEMA STAGGER ──
const ecoCards = document.querySelectorAll('.eco-card');
const ecoObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    ecoCards.forEach((c, i) => {
      setTimeout(() => c.classList.add('eco-visible'), i * 120);
    });
    ecoObs.disconnect();
  }
}, { threshold: 0.1 });
if (ecoCards.length) ecoObs.observe(ecoCards[0]);

// ── FOTO PARALLAX on mousemove ──
const fotoFrame = document.getElementById('foto-frame');
const fotoImg   = document.getElementById('mi-foto');
if (fotoFrame && fotoImg) {
  fotoFrame.addEventListener('mousemove', e => {
    const r = fotoFrame.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    fotoImg.style.transform = `scale(1.05) translate(${x * 8}px, ${y * 8}px)`;
    fotoFrame.style.boxShadow = `${-x * 20}px ${-y * 20}px 40px rgba(0,255,136,0.1)`;
  });
  fotoFrame.addEventListener('mouseleave', () => {
    fotoImg.style.transform = '';
    fotoFrame.style.boxShadow = '';
  });
}

// ── SERVICE CARD 3D TILT ──
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `perspective(600px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── GLITCH TITLE EFFECT ──
const nameEl = document.querySelector('.h-name');
if (nameEl) {
  const original = nameEl.textContent;
  const glitchChars = '@#$%&*01';
  let glitchTimeout;

  nameEl.addEventListener('mouseenter', () => {
    let count = 0;
    const iv = setInterval(() => {
      if (count++ > 8) { clearInterval(iv); nameEl.textContent = original; return; }
      nameEl.textContent = original.split('').map(c => {
        if (c === ' ' || c === '.') return c;
        return Math.random() > 0.6 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : c;
      }).join('');
    }, 60);
  });
  nameEl.addEventListener('mouseleave', () => {
    nameEl.textContent = original;
  });
}

// ── ACTIVE NAV ──
const allSections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let current = '';
  allSections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 140) current = s.id;
  });
  allNavLinks.forEach(a => {
    const isActive = a.getAttribute('href') === '#' + current;
    a.style.color = isActive ? 'var(--g)' : '';
    if (isActive) a.style.setProperty('--after-w', '100%');
  });
});

// ── TYPING EFFECT for hero desc on load ──
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
});

// ── PARTICLE CLICK ──
document.addEventListener('click', e => {
  if (window.innerWidth <= 768) return;
  for (let i = 0; i < 6; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position:fixed;left:${e.clientX}px;top:${e.clientY}px;
      width:4px;height:4px;background:var(--g);border-radius:50%;
      pointer-events:none;z-index:9999;
      transform:translate(-50%,-50%);
    `;
    document.body.appendChild(p);
    const angle = (i / 6) * Math.PI * 2;
    const dist = 30 + Math.random() * 40;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;
    p.animate([
      { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
      { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
    ], { duration: 500, easing: 'ease-out' }).onfinish = () => p.remove();
  }
});
