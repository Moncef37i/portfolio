const PROJECTS = [
  { name: 'E-Commerce Platform', desc: 'Full-stack online shop with product listings, shopping cart, user authentication, order management, and a complete admin dashboard for inventory control.', stack: ['PHP', 'MySQL', 'JavaScript', 'CSS', 'HTML'], demo: '#', github: 'https://github.com/Moncef37i' },
  { name: 'Portfolio Builder', desc: 'A drag-and-drop portfolio generator designed for creatives and freelancers. Users can build, customize, and export their personal portfolio site with zero coding.', stack: ['HTML', 'CSS', 'JavaScript'], demo: '#', github: 'https://github.com/Moncef37i' },
  { name: 'Task Manager App', desc: 'A Kanban-style task management application with live status updates, team collaboration features, priority tagging, and a real-time activity feed.', stack: ['JavaScript', 'PHP', 'MySQL', 'CSS'], demo: '#', github: 'https://github.com/Moncef37i' },
  { name: 'Restaurant Website', desc: 'Animated landing page for a restaurant with smooth scroll effects, a dynamic menu showcase, and an integrated online reservation system.', stack: ['HTML', 'CSS', 'JavaScript'], demo: '#', github: 'https://github.com/Moncef37i' },
  { name: 'Blog CMS', desc: 'A custom Content Management System with markdown editor support, category management, built-in SEO tools, and a clean reader-facing blog interface.', stack: ['PHP', 'MySQL', 'CSS', 'HTML'], demo: '#', github: 'https://github.com/Moncef37i' },
  { name: 'Coming Soon', desc: 'A new project is currently in development. Something exciting is on the way — stay tuned and check back soon.', stack: ['TBD'], demo: '#', github: 'https://github.com/Moncef37i' }
];

// ─── CURSOR ───────────────────────────────────────────────────────────────────
const curEl = document.getElementById('cur');
const curDot = document.getElementById('curDot');
let mx = 0, my = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  curDot.style.left = mx + 'px';
  curDot.style.top = my + 'px';
});

(function animateCursor() {
  tx += (mx - tx) * 0.12;
  ty += (my - ty) * 0.12;
  curEl.style.left = tx + 'px';
  curEl.style.top = ty + 'px';
  requestAnimationFrame(animateCursor);
})();

function bindHover() {
  document.querySelectorAll('a,button,.nav-email,.hr-skill,.proj-card,.pd-btn,.icon-back-btn,.pd-back').forEach(el => {
    el.addEventListener('mouseenter', () => curEl.classList.add('hover'));
    el.addEventListener('mouseleave', () => curEl.classList.remove('hover'));
  });
}
bindHover();

// ─── LOGO ANIMATION ───────────────────────────────────────────────────────────
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
  requestAnimationFrame(() => requestAnimationFrame(() =>
    smLogo.querySelectorAll('.logo-letter').forEach(l => l.classList.add('vis'))
  ));
});

smLogo.addEventListener('mouseleave', () => {
  smHovered = false;
  smLogo.querySelectorAll('.logo-letter').forEach(l => {
    l.style.transitionDelay = '0ms';
    l.classList.remove('vis');
  });
  setTimeout(() => { if (!smHovered) buildLetters('SM', true); }, 200);
});

// ─── LOADER ───────────────────────────────────────────────────────────────────
let pct = 0;
const ldFill = document.getElementById('ldFill');
const ldPct = document.getElementById('ldPct');
const ldTopline = document.getElementById('ldTopline');
const ldWelcome = document.getElementById('ldWelcome');

function tick() {
  pct = Math.min(100, pct + Math.max(0.5, (100 - pct) * 0.025));
  ldFill.style.width = pct + '%';
  ldTopline.style.width = pct + '%';
  ldPct.textContent = Math.floor(pct);
  if (pct < 100) {
    setTimeout(tick, 25);
  } else {
    ldFill.style.width = '100%';
    ldPct.textContent = '100';
    setTimeout(() => {
      ldWelcome.classList.add('show');
      setTimeout(launch, 1200);
    }, 300);
  }
}
setTimeout(tick, 400);

function launch() {
  document.getElementById('loader').classList.add('ld-exit');
  setTimeout(() => {
    document.getElementById('app').classList.add('show');
    document.getElementById('loader').style.display = 'none';
    initThree();
  }, 800);
}

// ─── PAGE NAVIGATION ──────────────────────────────────────────────────────────
let aboutLookAway = false;

function goPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  if (name === 'about') { document.getElementById('navAbout').classList.add('active'); aboutLookAway = true; }
  if (name === 'projects') {
    document.getElementById('navProjects').classList.add('active');
    document.getElementById('proj-detail-view').style.display = 'none';
    document.getElementById('proj-grid-view').style.display = 'flex';
  }
  if (name === 'home') aboutLookAway = false;
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

// ─── PROJECT DETAIL ───────────────────────────────────────────────────────────
function openDetail(i) {
  const p = PROJECTS[i];
  document.getElementById('pd-crumb-name').textContent = p.name;
  document.getElementById('pd-index').textContent = 'PROJECT ' + String(i + 1).padStart(2, '0');
  const parts = p.name.split(' ');
  document.getElementById('pd-name').innerHTML = '<span>' + parts[0] + '</span> ' + parts.slice(1).join(' ');
  document.getElementById('pd-desc').textContent = p.desc;
  document.getElementById('pd-stack').innerHTML = p.stack.map(t => `<span class="pd-stack-tag">${t}</span>`).join('');
  document.getElementById('pd-demo').href = p.demo;
  document.getElementById('pd-github').href = p.github;
  document.getElementById('proj-grid-view').style.display = 'none';
  document.getElementById('proj-detail-view').style.display = 'flex';
  bindHover();
}

function closeDetail() {
  document.getElementById('proj-detail-view').style.display = 'none';
  document.getElementById('proj-grid-view').style.display = 'flex';
}

// ─── THREE.JS AVATAR ──────────────────────────────────────────────────────────
let homeAvatarData = null, aboutAvatarData = null;
let isWakingUp = true, wakeUpProgress = 0;

class BlinkSystem {
  constructor() {
    this.nextBlink = Date.now() + 2000 + Math.random() * 3000;
    this.isBlinking = false;
    this.blinkStart = 0;
    this.blinkDuration = 150;
  }
  update(eL, eR) {
    if (!eL || !eR) return;
    const now = Date.now();
    if (!this.isBlinking && now >= this.nextBlink) { this.isBlinking = true; this.blinkStart = now; }
    if (this.isBlinking) {
      const p = (now - this.blinkStart) / this.blinkDuration;
      if (p >= 1) {
        this.isBlinking = false; eL.scale.y = 1; eR.scale.y = 1;
        this.nextBlink = now + 2000 + Math.random() * 4000;
      } else {
        const c = Math.sin(p * Math.PI);
        eL.scale.y = 1 - c * 0.9; eR.scale.y = 1 - c * 0.9;
      }
    }
  }
}

const homeBlink = new BlinkSystem();
const aboutBlink = new BlinkSystem();

function createStylizedAvatar() {
  const avatar = new THREE.Group();
  const skinMat = new THREE.MeshPhysicalMaterial({ color: 0xe8d5c4, roughness: 0.3, metalness: 0.1, clearcoat: 0.3, clearcoatRoughness: 0.2 });
  const hairDarkMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.7 });
  const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
  const eyeGlowMat = new THREE.MeshStandardMaterial({ color: 0x5bc8f5, emissive: 0x5bc8f5, emissiveIntensity: 2 });
  const facialHairMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.9 });

  const head = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), skinMat);
  head.scale.set(0.95, 1.15, 0.95); avatar.add(head);

  const hairTop = new THREE.Mesh(new THREE.SphereGeometry(1.02, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.35), hairDarkMat);
  hairTop.scale.set(0.96, 1.1, 0.96); hairTop.position.y = 0.05; avatar.add(hairTop);

  for (let i = 0; i < 3; i++) {
    const fl = new THREE.Mesh(
      new THREE.SphereGeometry(1.01 + i * 0.005, 32, 16, 0, Math.PI * 2, Math.PI * 0.35, Math.PI * 0.15),
      new THREE.MeshStandardMaterial({ color: new THREE.Color().lerpColors(new THREE.Color(0x333333), new THREE.Color(0x1a1a1a), i / 2), roughness: 0.8 })
    );
    fl.scale.set(0.97 + i * 0.01, 1.12, 0.97 + i * 0.01); fl.position.y = 0.02; avatar.add(fl);
  }

  const browGeo = new THREE.CapsuleGeometry(0.04, 0.25, 4, 8);
  const lBrow = new THREE.Mesh(browGeo, hairDarkMat); lBrow.position.set(-0.28, 0.35, 0.88); lBrow.rotation.z = 0.15; lBrow.rotation.x = -0.1; avatar.add(lBrow);
  const rBrow = new THREE.Mesh(browGeo, hairDarkMat); rBrow.position.set(0.28, 0.35, 0.88); rBrow.rotation.z = -0.15; rBrow.rotation.x = -0.1; avatar.add(rBrow);

  const eyesGroup = new THREE.Group(); eyesGroup.position.set(0, 0.08, 0.85); avatar.add(eyesGroup);

  const sGeo = new THREE.SphereGeometry(0.18, 32, 16);
  const lSock = new THREE.Mesh(sGeo, new THREE.MeshStandardMaterial({ color: 0xd4c4b5, roughness: 0.4 })); lSock.position.set(-0.3, 0, 0); lSock.scale.set(1, 0.6, 0.3); eyesGroup.add(lSock);
  const rSock = new THREE.Mesh(sGeo, new THREE.MeshStandardMaterial({ color: 0xd4c4b5, roughness: 0.4 })); rSock.position.set(0.3, 0, 0); rSock.scale.set(1, 0.6, 0.3); eyesGroup.add(rSock);

  const eGeo = new THREE.SphereGeometry(0.14, 32, 16);
  const lEye = new THREE.Mesh(eGeo, eyeWhiteMat); lEye.position.set(-0.3, 0, 0.02); lEye.scale.set(1, 0.7, 0.5); eyesGroup.add(lEye);
  const rEye = new THREE.Mesh(eGeo, eyeWhiteMat); rEye.position.set(0.3, 0, 0.02); rEye.scale.set(1, 0.7, 0.5); eyesGroup.add(rEye);

  const pGeo = new THREE.SphereGeometry(0.06, 16, 16);
  const lPupil = new THREE.Mesh(pGeo, eyeGlowMat); lPupil.position.set(-0.3, 0, 0.08); eyesGroup.add(lPupil);
  const rPupil = new THREE.Mesh(pGeo, eyeGlowMat); rPupil.position.set(0.3, 0, 0.08); eyesGroup.add(rPupil);

  const mG = new THREE.Group(); mG.position.set(0, -0.15, 0.92); avatar.add(mG);
  const mC = new THREE.Mesh(new THREE.CapsuleGeometry(0.035, 0.15, 4, 8), facialHairMat); mC.rotation.z = Math.PI / 2; mG.add(mC);
  const mL = new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.2, 4, 8), facialHairMat); mL.position.set(-0.18, 0.02, 0); mL.rotation.z = 0.3; mG.add(mL);
  const mR = new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.2, 4, 8), facialHairMat); mR.position.set(0.18, 0.02, 0); mR.rotation.z = -0.3; mG.add(mR);

  const gG = new THREE.Group(); gG.position.set(0, -0.55, 0.88); avatar.add(gG);
  gG.add(new THREE.Mesh(new THREE.CapsuleGeometry(0.025, 0.08, 4, 8), facialHairMat));
  const cB = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), facialHairMat); cB.position.set(0, -0.12, -0.02); cB.scale.set(0.8, 1, 0.6); gG.add(cB);

  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 16), skinMat); nose.position.set(0, -0.02, 0.98); nose.scale.set(0.7, 1, 0.8); avatar.add(nose);
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.025, 8, 32, Math.PI), new THREE.MeshStandardMaterial({ color: 0x8b7355, roughness: 0.6 }));
  mouth.rotation.x = Math.PI; mouth.position.set(0, -0.35, 0.9); mouth.rotation.z = Math.PI; avatar.add(mouth);

  const eaGeo = new THREE.SphereGeometry(0.12, 16, 16);
  const lEar = new THREE.Mesh(eaGeo, skinMat); lEar.position.set(-0.92, 0, 0); lEar.scale.set(0.25, 0.8, 0.4); avatar.add(lEar);
  const rEar = new THREE.Mesh(eaGeo, skinMat); rEar.position.set(0.92, 0, 0); rEar.scale.set(0.25, 0.8, 0.4); avatar.add(rEar);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 0.7, 32), skinMat); neck.position.y = -1.2; avatar.add(neck);

  const bG = new THREE.Group(); bG.position.y = -1.8; avatar.add(bG);
  const sh = new THREE.Mesh(new THREE.SphereGeometry(1.4, 32, 16), new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.7 }));
  sh.scale.set(1, 0.4, 0.5); bG.add(sh);

  avatar.add(new THREE.Mesh(new THREE.SphereGeometry(2.5, 32, 32), new THREE.MeshBasicMaterial({ color: 0x5bc8f5, transparent: true, opacity: 0.08, side: THREE.BackSide })));
  avatar.add(new THREE.Mesh(new THREE.SphereGeometry(3.5, 32, 32), new THREE.MeshBasicMaterial({ color: 0x5bc8f5, transparent: true, opacity: 0.03, side: THREE.BackSide })));

  return { mesh: avatar, eyesGroup, leftEye: lEye, rightEye: rEye };
}

function makeScene(canvasId) {
  const canvas = document.getElementById(canvasId);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.z = 4;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const kL = new THREE.DirectionalLight(0xffffff, 1.0); kL.position.set(2, 3, 5); scene.add(kL);
  const fL = new THREE.DirectionalLight(0x5bc8f5, 0.4); fL.position.set(-3, 1, 3); scene.add(fL);
  const rL = new THREE.SpotLight(0x00f5c4, 1.0); rL.position.set(0, 4, -4); rL.lookAt(0, 0, 0); scene.add(rL);

  const avatarData = createStylizedAvatar();
  avatarData.mesh.scale.set(0.9, 0.9, 0.9);
  scene.add(avatarData.mesh);
  return { scene, camera, renderer, avatarData, canvas };
}

function initThree() {
  const home = makeScene('three-canvas');
  const about = makeScene('about-canvas');
  homeAvatarData = home.avatarData;
  aboutAvatarData = about.avatarData;
  homeAvatarData.mesh.rotation.x = 0.8;
  aboutAvatarData.mesh.rotation.x = 0.8;

  let mouseX = 0, mouseY = 0, time = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function resizeCheck(s) {
    const w = s.canvas.clientWidth, h = s.canvas.clientHeight;
    if (s.canvas.width !== w || s.canvas.height !== h) {
      s.renderer.setSize(w, h, false);
      s.camera.aspect = w / h;
      s.camera.updateProjectionMatrix();
    }
  }

  const wu = setInterval(() => {
    if (wakeUpProgress < 1) {
      wakeUpProgress += 0.015;
      const e = 1 - Math.pow(1 - wakeUpProgress, 3);
      homeAvatarData.mesh.rotation.x = 0.8 * (1 - e);
      aboutAvatarData.mesh.rotation.x = 0.8 * (1 - e);
      const s = 0.9 * (0.2 + 0.9 * e);
      homeAvatarData.mesh.scale.set(s, s, s);
      aboutAvatarData.mesh.scale.set(s, s, s);
    } else { isWakingUp = false; clearInterval(wu); }
  }, 16);

  function animateAvatar(data, txx, tyy, damp, isAbout) {
    if (!data) return;
    const yaw = Math.max(-0.5, Math.min(0.5, txx * 0.6));
    const pitch = Math.max(-0.3, Math.min(0.3, -tyy * 0.4));
    if (!isWakingUp) {
      data.mesh.rotation.y += (yaw - data.mesh.rotation.y) * damp;
      data.mesh.rotation.x += (pitch - data.mesh.rotation.x) * damp;
    }
    data.eyesGroup.rotation.y += (txx * 0.4 - data.eyesGroup.rotation.y) * damp * 2;
    data.eyesGroup.rotation.x += (-tyy * 0.3 - data.eyesGroup.rotation.x) * damp * 2;
    data.mesh.position.y = Math.sin(time * 2) * 0.005;
    (isAbout ? aboutBlink : homeBlink).update(data.leftEye, data.rightEye);
  }

  (function animate() {
    requestAnimationFrame(animate);
    time += 0.016;
    resizeCheck(home); resizeCheck(about);
    animateAvatar(homeAvatarData, mouseX, mouseY, 0.08, false);
    animateAvatar(aboutAvatarData, aboutLookAway ? 0.7 : mouseX, aboutLookAway ? -0.1 : mouseY, 0.06, true);
    home.renderer.render(home.scene, home.camera);
    about.renderer.render(about.scene, about.camera);
  })();
}
