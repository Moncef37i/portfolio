// ═══════════════════════════════════════════════════════════════════
// GALAXY BACKGROUND — stars flee from mouse like balls
// ═══════════════════════════════════════════════════════════════════
(function initGalaxy() {
  const canvas = document.getElementById('galaxy-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); stars.forEach(s => { s.ox = s.x = Math.random() * W; s.oy = s.y = Math.random() * H; }); });

  // Mouse position (raw pixels for galaxy repulsion)
  let mouseX = -9999, mouseY = -9999;
  window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

  // ── Stars with physics ──
  const STAR_COUNT = 280;
  const stars = Array.from({ length: STAR_COUNT }, () => {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    return {
      ox: x, oy: y,       // origin (home position)
      x, y,               // current position
      vx: 0, vy: 0,       // velocity
      r: Math.random() * 1.7 + 0.3,
      alpha: Math.random() * 0.6 + 0.3,
      twinkleSpeed: Math.random() * 0.9 + 0.3,
      twinkleOffset: Math.random() * Math.PI * 2,
      hue: 190 + Math.random() * 45,  // cyan→blue
      mass: Math.random() * 0.4 + 0.6 // affects repulsion strength
    };
  });

  // ── Nebula clouds ──
  const NEBULAS = [
    { cx: 0.18, cy: 0.28, rx: 0.32, ry: 0.22, color: '91,200,245',  alpha: 0.042 },
    { cx: 0.76, cy: 0.65, rx: 0.28, ry: 0.20, color: '100,160,255', alpha: 0.035 },
    { cx: 0.50, cy: 0.50, rx: 0.42, ry: 0.30, color: '60,100,200',  alpha: 0.022 },
    { cx: 0.86, cy: 0.18, rx: 0.20, ry: 0.16, color: '120,200,255', alpha: 0.032 },
    { cx: 0.12, cy: 0.76, rx: 0.22, ry: 0.18, color: '80,140,230',  alpha: 0.028 },
  ];

  // ── Glowing orbs ──
  const ORBS = [
    { cx: 0.20, cy: 0.35, r: 95,  color: '80,160,255',  alpha: 0.055 },
    { cx: 0.80, cy: 0.62, r: 75,  color: '91,200,245',  alpha: 0.065 },
    { cx: 0.50, cy: 0.18, r: 60,  color: '130,190,255', alpha: 0.048 },
  ];

  // ── Shooting stars ──
  const shooters = [];
  function spawnShooter() {
    shooters.push({
      x: Math.random() * 0.65, y: Math.random() * 0.45,
      len: 90 + Math.random() * 130,
      speed: 0.0016 + Math.random() * 0.002,
      progress: 0,
      alpha: 0.65 + Math.random() * 0.35,
      angle: Math.PI / 5 + (Math.random() - 0.5) * 0.3
    });
  }
  setInterval(() => { if (shooters.length < 3) spawnShooter(); }, 3000);
  spawnShooter();

  const REPEL_RADIUS = 120;  // px — how far mouse repels stars
  const REPEL_FORCE  = 6.5;  // strength of push
  const FRICTION     = 0.88; // velocity damping
  const RETURN_FORCE = 0.045; // how fast stars go back home

  let t = 0;

  function draw() {
    requestAnimationFrame(draw);
    t += 0.005;

    // Deep space gradient background
    const bg = ctx.createLinearGradient(0, 0, W * 0.5, H);
    bg.addColorStop(0,   '#01040f');
    bg.addColorStop(0.4, '#020818');
    bg.addColorStop(0.7, '#030b1e');
    bg.addColorStop(1,   '#010612');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Nebula clouds
    NEBULAS.forEach((n, i) => {
      const pulse = Math.sin(t * 0.35 + i * 1.3) * 0.01 + n.alpha;
      const grd = ctx.createRadialGradient(
        n.cx * W, n.cy * H, 0,
        n.cx * W, n.cy * H, Math.max(n.rx * W, n.ry * H)
      );
      grd.addColorStop(0,   `rgba(${n.color},${pulse})`);
      grd.addColorStop(0.5, `rgba(${n.color},${pulse * 0.35})`);
      grd.addColorStop(1,   `rgba(${n.color},0)`);
      ctx.save();
      ctx.translate(n.cx * W, n.cy * H);
      ctx.scale(1, n.ry / n.rx);
      ctx.beginPath();
      ctx.arc(0, 0, n.rx * W, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
      ctx.restore();
    });

    // Glowing orbs
    ORBS.forEach((o, i) => {
      const pulse = Math.sin(t * 0.45 + i * 2.2) * 0.018 + o.alpha;
      const grd = ctx.createRadialGradient(o.cx * W, o.cy * H, 0, o.cx * W, o.cy * H, o.r);
      grd.addColorStop(0,   `rgba(${o.color},${pulse * 2.2})`);
      grd.addColorStop(0.3, `rgba(${o.color},${pulse})`);
      grd.addColorStop(1,   `rgba(${o.color},0)`);
      ctx.beginPath();
      ctx.arc(o.cx * W, o.cy * H, o.r, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
    });

    // Stars — physics update + draw
    stars.forEach(s => {
      // Repulsion from mouse
      const dx = s.x - mouseX;
      const dy = s.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < REPEL_RADIUS && dist > 0) {
        const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
        s.vx += (dx / dist) * force * REPEL_FORCE / s.mass;
        s.vy += (dy / dist) * force * REPEL_FORCE / s.mass;
      }

      // Return to home
      s.vx += (s.ox - s.x) * RETURN_FORCE;
      s.vy += (s.oy - s.y) * RETURN_FORCE;

      // Friction
      s.vx *= FRICTION;
      s.vy *= FRICTION;

      // Move
      s.x += s.vx;
      s.y += s.vy;

      // Draw star
      const twinkle = Math.sin(t * s.twinkleSpeed + s.twinkleOffset) * 0.3 + 0.7;
      const speed = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
      const a = Math.min(1, s.alpha * twinkle + speed * 0.04);

      // White core
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.fill();

      // Cyan glow halo
      const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3);
      grd.addColorStop(0, `hsla(${s.hue},90%,88%,${a * 0.7})`);
      grd.addColorStop(1, `hsla(${s.hue},90%,70%,0)`);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
    });

    // Shooting stars
    for (let i = shooters.length - 1; i >= 0; i--) {
      const s = shooters[i];
      s.progress += s.speed;
      if (s.progress >= 1) { shooters.splice(i, 1); continue; }
      const sx = s.x * W + Math.cos(s.angle) * s.progress * W * 0.55;
      const sy = s.y * H + Math.sin(s.angle) * s.progress * W * 0.55;
      const ex = sx - Math.cos(s.angle) * s.len;
      const ey = sy - Math.sin(s.angle) * s.len;
      const fade = s.progress < 0.2 ? s.progress / 0.2 : 1 - (s.progress - 0.2) / 0.8;
      const grd = ctx.createLinearGradient(sx, sy, ex, ey);
      grd.addColorStop(0,   `rgba(200,235,255,${s.alpha * fade})`);
      grd.addColorStop(0.4, `rgba(91,200,245,${s.alpha * fade * 0.4})`);
      grd.addColorStop(1,   'rgba(91,200,245,0)');
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.strokeStyle = grd;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(sx, sy, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220,245,255,${s.alpha * fade})`;
      ctx.fill();
    }
  }

  draw();
})();

// ═══════════════════════════════════════════════════════════════════
// TECH STACK LINKS
// ═══════════════════════════════════════════════════════════════════
const TECH_LINKS = {
  'HTML':       'https://developer.mozilla.org/en-US/docs/Web/HTML',
  'CSS':        'https://developer.mozilla.org/en-US/docs/Web/CSS',
  'JavaScript': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  'JS':         'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  'PHP':        'https://www.php.net',
  'MySQL':      'https://www.mysql.com',
  'Three.js':   'https://threejs.org',
  'TBD':        null
};

const PROJECTS = [
  { name: 'E-Commerce Platform', desc: 'Full-stack online shop with product listings, shopping cart, user authentication, order management, and a complete admin dashboard for inventory control.', stack: ['PHP', 'MySQL', 'JavaScript', 'CSS', 'HTML'], demo: '#', github: 'https://github.com/Moncef37i', screenshot: '' },
  { name: 'Portfolio Builder', desc: 'A drag-and-drop portfolio generator designed for creatives and freelancers. Users can build, customize, and export their personal portfolio site with zero coding.', stack: ['HTML', 'CSS', 'JavaScript'], demo: '#', github: 'https://github.com/Moncef37i', screenshot: '' },
  { name: 'Task Manager App', desc: 'A Kanban-style task management application with live status updates, team collaboration features, priority tagging, and a real-time activity feed.', stack: ['JavaScript', 'PHP', 'MySQL', 'CSS'], demo: '#', github: 'https://github.com/Moncef37i', screenshot: '' },
  { name: 'Restaurant Website', desc: 'Animated landing page for a restaurant with smooth scroll effects, a dynamic menu showcase, and an integrated online reservation system.', stack: ['HTML', 'CSS', 'JavaScript'], demo: '#', github: 'https://github.com/Moncef37i', screenshot: '' },
  { name: 'Blog CMS', desc: 'A custom Content Management System with markdown editor support, category management, built-in SEO tools, and a clean reader-facing blog interface.', stack: ['PHP', 'MySQL', 'CSS', 'HTML'], demo: '#', github: 'https://github.com/Moncef37i', screenshot: '' },
  { name: 'Coming Soon', desc: 'A new project is currently in development. Something exciting is on the way — stay tuned and check back soon.', stack: ['TBD'], demo: '#', github: 'https://github.com/Moncef37i', screenshot: '' }
];

// ═══════════════════════════════════════════════════════════════════
// GLOBAL STATE
// ═══════════════════════════════════════════════════════════════════
let targetMouseX = 0, targetMouseY = 0;
let wakeUpComplete = false;
let isWakingUp = true;
let globalTime = 0;
const sceneHome = {}, sceneAbout = {};

// ═══════════════════════════════════════════════════════════════════
// CURSOR
// ═══════════════════════════════════════════════════════════════════
const curEl = document.getElementById('cur');
const curDot = document.getElementById('curDot');
let mx = 0, my = 0, tx = 0, ty = 0;

let cursorVisible = false;
document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  curDot.style.left = mx + 'px';
  curDot.style.top = my + 'px';
  targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  if (!cursorVisible) {
    cursorVisible = true;
    curEl.classList.add('visible');
    curDot.classList.add('visible');
  }
});

(function animateCursor() {
  tx += (mx - tx) * 0.12;
  ty += (my - ty) * 0.12;
  curEl.style.left = tx + 'px';
  curEl.style.top = ty + 'px';
  requestAnimationFrame(animateCursor);
})();

function bindHover() {
  document.querySelectorAll('a, button, .nav-email, .hr-skill, .proj-card, .pd-btn, .icon-back-btn, .pd-back, .social-item, .cv-side, .pd-stack-tag').forEach(el => {
    el.addEventListener('mouseenter', () => curEl.classList.add('hover'));
    el.addEventListener('mouseleave', () => curEl.classList.remove('hover'));
  });
}
bindHover();

// ═══════════════════════════════════════════════════════════════════
// LOGO ANIMATION
// ═══════════════════════════════════════════════════════════════════
const smLogo = document.getElementById('smLogo');
let smHovered = false;

function buildLetters(text, visible) {
  smLogo.innerHTML = '';
  [...text].forEach((ch, i) => {
    const s = document.createElement('span');
    s.className = 'logo-letter' + (visible ? ' vis' : '');
    s.textContent = ch === ' ' ? '\u00A0' : ch;
    s.style.transitionDelay = visible ? (i * 40) + 'ms' : '0ms';
    smLogo.appendChild(s);
  });
}

smLogo.addEventListener('mouseenter', () => {
  smHovered = true;
  buildLetters('SOUILAH MONCEF', false);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    smLogo.querySelectorAll('.logo-letter').forEach(l => l.classList.add('vis'));
  }));
});

smLogo.addEventListener('mouseleave', () => {
  smHovered = false;
  smLogo.querySelectorAll('.logo-letter').forEach(l => {
    l.style.transitionDelay = '0ms';
    l.classList.remove('vis');
  });
  setTimeout(() => { if (!smHovered) buildLetters('SM', true); }, 200);
});

// ═══════════════════════════════════════════════════════════════════
// LOADER
// ═══════════════════════════════════════════════════════════════════
let pct = 0;
const ldFill    = document.getElementById('ldFill');
const ldPct     = document.getElementById('ldPct');
const ldTopline = document.getElementById('ldTopline');
const ldWelcome = document.getElementById('ldWelcome');

function tick() {
  pct = Math.min(100, pct + Math.max(0.5, (100 - pct) * 0.025));
  ldFill.style.width    = pct + '%';
  ldTopline.style.width = pct + '%';
  ldPct.textContent = Math.floor(pct);
  if (pct < 100) {
    setTimeout(tick, 25);
  } else {
    ldFill.style.width = '100%';
    ldPct.textContent  = '100';
    setTimeout(() => {
      ldWelcome.classList.add('show');
      setTimeout(launch, 1200);
    }, 300);
  }
}
setTimeout(tick, 400);
document.getElementById('navHome').classList.add('active');

function launch() {
  document.getElementById('loader').classList.add('ld-exit');
  setTimeout(() => {
    document.getElementById('app').classList.add('show');
    document.getElementById('loader').style.display = 'none';
    if (typeof THREE !== 'undefined') initThree();
    else {
      const w = setInterval(() => {
        if (typeof THREE !== 'undefined') { clearInterval(w); initThree(); }
      }, 50);
    }
  }, 800);
}

// ═══════════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════════
function goPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  if (name === 'home')     document.getElementById('navHome').classList.add('active');
  if (name === 'about')    document.getElementById('navAbout').classList.add('active');
  if (name === 'projects') {
    document.getElementById('navProjects').classList.add('active');
    document.getElementById('proj-detail-view').style.display = 'none';
    document.getElementById('proj-grid-view').style.display   = 'flex';
  }
}

function copyEmail() {
  navigator.clipboard.writeText('souilahmoncef99@gmail.com').then(() => {
    const b = document.getElementById('emailBtn');
    b.classList.add('copied');
    setTimeout(() => b.classList.remove('copied'), 2000);
  });
}

function downloadCV(e) {
  if (e) e.preventDefault();
  alert('Add your CV file as "cv_souilah_moncef.pdf" next to this HTML file!');
}

// ═══════════════════════════════════════════════════════════════════
// PROJECT DETAIL
// ═══════════════════════════════════════════════════════════════════
function openDetail(i) {
  const p = PROJECTS[i];
  document.getElementById('pd-crumb-name').textContent = p.name;
  document.getElementById('pd-index').textContent = 'PROJECT ' + String(i + 1).padStart(2, '0');
  const parts = p.name.split(' ');
  document.getElementById('pd-name').innerHTML = '<span>' + parts[0] + '</span> ' + parts.slice(1).join(' ');
  document.getElementById('pd-desc').textContent = p.desc;
  document.getElementById('pd-stack').innerHTML = p.stack.map(t => {
    const url = TECH_LINKS[t];
    if (url) return `<a class="pd-stack-tag pd-stack-link" href="${url}" target="_blank" rel="noopener">${t}</a>`;
    return `<span class="pd-stack-tag">${t}</span>`;
  }).join('');
  document.getElementById('pd-demo').href   = p.demo;
  document.getElementById('pd-github').href = p.github;
  const imgEl = document.getElementById('pd-screenshot-img');
  const ph    = document.getElementById('pd-shot-placeholder');
  if (p.screenshot) {
    imgEl.style.display = 'block';
    imgEl.classList.remove('loaded');
    imgEl.src = p.screenshot;
    imgEl.onload = () => imgEl.classList.add('loaded');
    ph.style.display = 'none';
  } else {
    imgEl.style.display = 'none';
    imgEl.src = '';
    ph.style.display = 'flex';
  }
  document.getElementById('proj-grid-view').style.display = 'none';
  const dv = document.getElementById('proj-detail-view');
  dv.style.display = 'flex';
  dv.classList.remove('animating');
  void dv.offsetWidth;
  dv.classList.add('animating');
  setTimeout(() => dv.classList.remove('animating'), 800);
  bindHover();
}

function closeDetail() {
  document.getElementById('proj-detail-view').style.display = 'none';
  document.getElementById('proj-grid-view').style.display   = 'flex';
}

// ═══════════════════════════════════════════════════════════════════
// SCENE SETUP
// ═══════════════════════════════════════════════════════════════════
function setupScene(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;

  const scene = new THREE.Scene();
  const w = canvas.clientWidth  || 500;
  const h = canvas.clientHeight || 700;

  const camera = new THREE.PerspectiveCamera(36, w / h, 0.1, 100);
  camera.position.set(0, 1.6, 2.8);
  camera.lookAt(0, 1.4, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
  renderer.toneMapping       = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.outputEncoding    = THREE.sRGBEncoding;

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.65));

  const key = new THREE.DirectionalLight(0xfff5e0, 1.4);
  key.position.set(2, 4, 4);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  scene.add(key);

  const fill = new THREE.DirectionalLight(0x5bc8f5, 0.5);
  fill.position.set(-3, 2, 2);
  scene.add(fill);

  const rim = new THREE.SpotLight(0x7dd8ff, 2.5);
  rim.position.set(0, 4, -4);
  rim.lookAt(0, 1.5, 0);
  scene.add(rim);

  const backLight = new THREE.PointLight(0x5bc8f5, 0, 12);
  backLight.position.set(0, 1.8, -2);
  scene.add(backLight);

  const eyeGlowL = new THREE.PointLight(0x5bc8f5, 0, 2);
  const eyeGlowR = new THREE.PointLight(0x5bc8f5, 0, 2);
  scene.add(eyeGlowL);
  scene.add(eyeGlowR);

  // Aura discs
  const discMat = new THREE.MeshBasicMaterial({
    color: 0x5bc8f5, transparent: true, opacity: 0.08,
    side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false
  });
  const disc = new THREE.Mesh(new THREE.CircleGeometry(1.1, 64), discMat);
  disc.position.set(0, 1.5, -0.6);
  scene.add(disc);

  const disc2Mat = new THREE.MeshBasicMaterial({
    color: 0x3a9fd4, transparent: true, opacity: 0.04,
    side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false
  });
  const disc2 = new THREE.Mesh(new THREE.CircleGeometry(1.9, 64), disc2Mat);
  disc2.position.set(0, 1.5, -0.85);
  scene.add(disc2);

  // Particles
  const count = 55;
  const pos   = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 2.8;
    pos[i * 3 + 1] = Math.random() * 3.0;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 1.2 - 0.3;
  }
  const partGeo = new THREE.BufferGeometry();
  partGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const partMat = new THREE.PointsMaterial({
    color: 0x5bc8f5, size: 0.016, transparent: true,
    opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false
  });
  const particles = new THREE.Points(partGeo, partMat);
  scene.add(particles);

  return {
    scene, camera, renderer, canvas,
    backLight, eyeGlowL, eyeGlowR,
    disc, disc2, discMat, disc2Mat,
    particles, partGeo,
    model: null, mixer: null,
    bones: {}, morphMeshes: [],
    targetScale: 1, headY: 1.6,
    animator: null
  };
}

// ═══════════════════════════════════════════════════════════════════
// GLB LOADER — Avaturn / Mixamo rig
// ═══════════════════════════════════════════════════════════════════
function loadGLB(sc, onDone) {
  const loader = new THREE.GLTFLoader();
  loader.load('model.glb',
    (gltf) => {
      const model = gltf.scene;

      // Fit to viewport
      const box    = new THREE.Box3().setFromObject(model);
      const size   = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const scale  = 2.2 / size.y;
      sc.targetScale = scale;

      model.scale.setScalar(scale);
      model.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);

      const totalH = size.y * scale;
      const headY  = totalH * 0.85;
      const chestY = totalH * 0.62;
      sc.headY = headY;

      // Camera frames upper body
      sc.camera.position.set(0, headY * 0.76, 2.1);
      sc.camera.lookAt(0, chestY, 0);
      sc.camera.updateProjectionMatrix();

      // Reposition scene elements to match model height
      sc.disc.position.set(0,  headY * 0.88, -0.55);
      sc.disc2.position.set(0, headY * 0.88, -0.82);
      sc.backLight.position.set(0, headY * 0.85, -1.8);

      // Traverse — materials + bones
      model.traverse((obj) => {
        if (obj.isMesh) {
          obj.castShadow    = true;
          obj.receiveShadow = true;
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach(mat => {
            if (mat.map) mat.map.encoding = THREE.sRGBEncoding;
            if (mat.isMeshStandardMaterial) mat.envMapIntensity = 0.35;
          });
          if (obj.morphTargetInfluences && obj.morphTargetInfluences.length > 0) {
            sc.morphMeshes.push(obj);
          }
        }

        // Exact Avaturn / Mixamo bone names
        if (obj.isBone) {
          switch (obj.name) {
            case 'Head':         sc.bones.head   = obj; break;
            case 'Neck':         sc.bones.neck   = obj; break;
            case 'Spine2':       sc.bones.chest  = obj; break;
            case 'Spine1':       sc.bones.spine1 = obj; break;
            case 'Spine':        sc.bones.spine  = obj; break;
            case 'Hips':         sc.bones.hips   = obj; break;
            case 'LeftArm':      sc.bones.armL   = obj; break;
            case 'RightArm':     sc.bones.armR   = obj; break;
            case 'LeftForeArm':  sc.bones.foreArmL = obj; break;
            case 'RightForeArm': sc.bones.foreArmR = obj; break;
          }
        }
      });

      // Eye glow positions
      sc.eyeGlowL.position.set(-0.06 * scale, headY * 0.975, 0.11 * scale);
      sc.eyeGlowR.position.set( 0.06 * scale, headY * 0.975, 0.11 * scale);

      sc.scene.add(model);
      sc.model = model;

      // Play embedded animation if any
      if (gltf.animations && gltf.animations.length > 0) {
        sc.mixer = new THREE.AnimationMixer(model);
        const clip   = THREE.AnimationClip.findByName(gltf.animations, 'idle') || gltf.animations[0];
        const action = sc.mixer.clipAction(clip);
        action.play();
      }

      console.log('Model loaded ✓  Bones:', Object.keys(sc.bones).join(', '));
      if (onDone) onDone();
    },
    (xhr) => {
      if (xhr.total) console.log('Loading:', Math.round(xhr.loaded / xhr.total * 100) + '%');
    },
    (err) => {
      console.error('GLB error — are you running a local server?', err);
      if (onDone) onDone();
    }
  );
}

// ═══════════════════════════════════════════════════════════════════
// AVATAR ANIMATOR
// ═══════════════════════════════════════════════════════════════════
class AvatarAnimator {
  constructor() {
    this.mouseSmooth = { x: 0, y: 0 };
    this.breathePhase = 0;
    this.armPhase = 0;
    this.blink = {
      isBlinking: false, phase: 0, value: 0,
      start: 0, next: Date.now() + 2000 + Math.random() * 2000
    };
    this.wake = { phase: 0, start: 0 };
    // phases: 0=init, 1=rising, 2=eye-flash, 3=settle, 4=idle
  }

  updateBlink() {
    const now = Date.now();
    if (!this.blink.isBlinking && now >= this.blink.next) {
      this.blink.isBlinking = true;
      this.blink.phase = 0;
      this.blink.start = now;
    }
    if (this.blink.isBlinking) {
      const e = now - this.blink.start;
      if (this.blink.phase === 0) {
        this.blink.value = Math.min(1, e / 75);
        if (this.blink.value >= 1) { this.blink.phase = 1; this.blink.start = now; }
      } else {
        this.blink.value = 1 - Math.min(1, (now - this.blink.start) / 115);
        if (this.blink.value <= 0) {
          this.blink.isBlinking = false;
          this.blink.value = 0;
          this.blink.next = now + 2500 + Math.random() * 3500;
        }
      }
    }
    return this.blink.value;
  }

  applyBlink(sc, value) {
    sc.morphMeshes.forEach(mesh => {
      if (!mesh.morphTargetDictionary) return;
      ['blink','eyeClose','eye_close','Blink','EyeClose','blink_l','blink_r','Blink_L','Blink_R'].forEach(k => {
        if (mesh.morphTargetDictionary[k] !== undefined)
          mesh.morphTargetInfluences[mesh.morphTargetDictionary[k]] = value;
      });
    });
  }

  updateWake(sc, now) {
    const w = this.wake;

    if (w.phase === 0) {
      if (sc.model) {
        sc.model.scale.setScalar(sc.targetScale * 0.05);
        if (sc.bones.head)  { sc.bones.head.rotation.x = 0.75; sc.bones.head.rotation.y = 0; }
        if (sc.bones.neck)  sc.bones.neck.rotation.x  = 0.35;
        if (sc.bones.spine) sc.bones.spine.rotation.x = 0.1;
        this.applyBlink(sc, 1);
        sc.eyeGlowL.intensity = 0;
        sc.eyeGlowR.intensity = 0;
        sc.backLight.intensity = 0;
      }
      w.phase = 1;
      w.start = now;

    } else if (w.phase === 1) {
      const p = Math.min(1, (now - w.start) / 2200);
      const e = 1 - Math.pow(1 - p, 3);
      if (sc.model) {
        sc.model.scale.setScalar(sc.targetScale * (0.05 + 0.95 * e));
        if (sc.bones.head)  { sc.bones.head.rotation.x = 0.75 * (1 - e) - (p > 0.85 ? (p - 0.85) * 0.2 : 0); }
        if (sc.bones.neck)  sc.bones.neck.rotation.x  = 0.35 * (1 - e);
        if (sc.bones.spine) sc.bones.spine.rotation.x = 0.1  * (1 - e);
        this.applyBlink(sc, 1);
        sc.backLight.intensity = e * 0.8;
      }
      if (p >= 1) { w.phase = 2; w.start = now; }

    } else if (w.phase === 2) {
      const p     = Math.min(1, (now - w.start) / 800);
      const flash = Math.sin(p * Math.PI) * 7;
      if (sc.model) {
        this.applyBlink(sc, 0);
        sc.eyeGlowL.intensity  = flash;
        sc.eyeGlowR.intensity  = flash;
        sc.backLight.intensity = 2.5 + flash * 2;
        const aura = 1 + p * 0.55;
        sc.disc.scale.setScalar(aura);
        sc.disc2.scale.setScalar(aura * 1.2);
        sc.discMat.opacity = 0.08 + p * 0.18;
      }
      if (p >= 1) {
        w.phase = 3; w.start = now;
        isWakingUp = false; wakeUpComplete = true;
      }

    } else if (w.phase === 3) {
      const p = Math.min(1, (now - w.start) / 600);
      sc.eyeGlowL.intensity = 0.3 * (1 - p);
      sc.eyeGlowR.intensity = 0.3 * (1 - p);
      sc.disc.scale.setScalar(1);
      sc.disc2.scale.setScalar(1);
      sc.discMat.opacity = 0.08;
      if (p >= 1) w.phase = 4;
    }
  }

  updateBreathing(sc, dt) {
    this.breathePhase += dt * 1.05;
    const b = Math.sin(this.breathePhase);
    if (sc.bones.chest)  sc.bones.chest.rotation.x  = b * 0.013;
    if (sc.bones.spine1) sc.bones.spine1.rotation.x = b * 0.007;
    if (sc.bones.spine)  sc.bones.spine.rotation.x  = b * 0.004;
    if (sc.bones.hips)   sc.bones.hips.position.y   = b * 0.006;
    const pulse = b * 0.5 + 0.5;
    sc.discMat.opacity   = 0.06 + pulse * 0.04;
    sc.disc2Mat.opacity  = 0.03 + pulse * 0.02;
    sc.backLight.intensity = 1.5 + pulse * 0.8;
  }

  updateArmSway(sc, dt) {
    this.armPhase += dt * 0.6;
    const s = Math.sin(this.armPhase) * 0.018;
    if (sc.bones.armL) sc.bones.armL.rotation.z = -s * 0.5;
    if (sc.bones.armR) sc.bones.armR.rotation.z =  s * 0.5;
  }

  updateMouseTracking(sc, isAbout) {
    this.mouseSmooth.x += (targetMouseX - this.mouseSmooth.x) * 0.07;
    this.mouseSmooth.y += (targetMouseY - this.mouseSmooth.y) * 0.07;
    if (!sc.bones.head) return;

    if (isAbout) {
      sc.bones.head.rotation.x += (0.04 - sc.bones.head.rotation.x) * 0.03;
      sc.bones.head.rotation.y += (0.18 - sc.bones.head.rotation.y) * 0.03;
      if (sc.bones.neck) {
        sc.bones.neck.rotation.x = sc.bones.head.rotation.x * 0.25;
        sc.bones.neck.rotation.y = sc.bones.head.rotation.y * 0.25;
      }
    } else {
      const lx = -this.mouseSmooth.y * 0.22;
      const ly =  this.mouseSmooth.x * 0.30;
      sc.bones.head.rotation.x += (lx - sc.bones.head.rotation.x) * 0.07;
      sc.bones.head.rotation.y += (ly - sc.bones.head.rotation.y) * 0.07;
      if (sc.bones.neck) {
        sc.bones.neck.rotation.x += (lx * 0.35 - sc.bones.neck.rotation.x) * 0.05;
        sc.bones.neck.rotation.y += (ly * 0.35 - sc.bones.neck.rotation.y) * 0.05;
      }
      if (sc.bones.spine) {
        sc.bones.spine.rotation.y += (ly * 0.1 - sc.bones.spine.rotation.y) * 0.03;
      }
    }
  }

  animate(sc, dt, now, isAbout) {
    if (!sc.model) return;
    if (sc.mixer) sc.mixer.update(dt);
    if (this.wake.phase < 4) {
      this.updateWake(sc, now);
    } else {
      this.updateBreathing(sc, dt);
      this.updateMouseTracking(sc, isAbout);
      this.updateArmSway(sc, dt);
      this.applyBlink(sc, this.updateBlink());
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
// INIT THREE.JS
// ═══════════════════════════════════════════════════════════════════
function initThree() {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/examples/js/loaders/GLTFLoader.min.js';
  script.onload = () => {
    const home  = setupScene('three-canvas');
    const about = setupScene('about-canvas');
    if (!home || !about) return;
    Object.assign(sceneHome,  home);
    Object.assign(sceneAbout, about);
    sceneHome.animator  = new AvatarAnimator();
    sceneAbout.animator = new AvatarAnimator();
    let loaded = 0;
    const onLoad = () => { if (++loaded === 2) startRenderLoop(); };
    loadGLB(sceneHome,  onLoad);
    loadGLB(sceneAbout, onLoad);
  };
  script.onerror = () => console.error('GLTFLoader failed — check CDN');
  document.head.appendChild(script);
}

// ═══════════════════════════════════════════════════════════════════
// RENDER LOOP
// ═══════════════════════════════════════════════════════════════════
function startRenderLoop() {
  let lastTime = performance.now();

  function resize(sc) {
    const w = sc.canvas.clientWidth, h = sc.canvas.clientHeight;
    if (sc.canvas.width !== w || sc.canvas.height !== h) {
      sc.renderer.setSize(w, h, false);
      sc.camera.aspect = w / h;
      sc.camera.updateProjectionMatrix();
    }
  }

  function tickParticles(sc, dt) {
    const pos = sc.partGeo.attributes.position.array;
    for (let i = 0; i < 55; i++) {
      pos[i * 3 + 1] += dt * (0.1 + (i % 5) * 0.03);
      if (pos[i * 3 + 1] > 3.0) pos[i * 3 + 1] = 0;
    }
    sc.partGeo.attributes.position.needsUpdate = true;
  }

  function loop() {
    requestAnimationFrame(loop);
    const now = performance.now();
    const dt  = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    globalTime += dt;

    resize(sceneHome);
    resize(sceneAbout);

    if (sceneHome.animator)  sceneHome.animator.animate(sceneHome,   dt, now, false);
    if (sceneAbout.animator) sceneAbout.animator.animate(sceneAbout, dt, now, true);

    tickParticles(sceneHome,  dt);
    tickParticles(sceneAbout, dt);

    sceneHome.renderer.render(sceneHome.scene,   sceneHome.camera);
    sceneAbout.renderer.render(sceneAbout.scene, sceneAbout.camera);
  }
  loop();
}

// ═══════════════════════════════════════════════════════════════════
// CLICK NOD
// ═══════════════════════════════════════════════════════════════════
['three-canvas', 'about-canvas'].forEach((id, idx) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('click', () => {
    const sc = idx === 0 ? sceneHome : sceneAbout;
    if (!sc || !wakeUpComplete || !sc.bones.head) return;
    const startRot = sc.bones.head.rotation.x;
    const t0 = performance.now();
    (function nod(t) {
      const p = (t - t0) / 380;
      if (p < 1) {
        sc.bones.head.rotation.x = startRot + Math.sin(p * Math.PI) * 0.2;
        requestAnimationFrame(nod);
      } else {
        sc.bones.head.rotation.x = startRot;
      }
    })(t0);
  });
});