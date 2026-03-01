// ═══════════════════════════════════════════════════════════════════
// GALAXY BACKGROUND
// ═══════════════════════════════════════════════════════════════════
(function initGalaxy() {
  const canvas = document.getElementById('galaxy-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', () => { resize(); stars.forEach(s => { s.ox = s.x = Math.random()*W; s.oy = s.y = Math.random()*H; }); });
  let mouseX = -9999, mouseY = -9999;
  window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
  const STAR_COUNT = 280;
  const stars = Array.from({ length: STAR_COUNT }, () => {
    const x = Math.random()*window.innerWidth, y = Math.random()*window.innerHeight;
    return { ox:x,oy:y,x,y,vx:0,vy:0,r:Math.random()*1.7+0.3,alpha:Math.random()*0.6+0.3,twinkleSpeed:Math.random()*0.9+0.3,twinkleOffset:Math.random()*Math.PI*2,hue:190+Math.random()*45,mass:Math.random()*0.4+0.6 };
  });
  const NEBULAS=[{cx:.18,cy:.28,rx:.32,ry:.22,color:'91,200,245',alpha:.042},{cx:.76,cy:.65,rx:.28,ry:.20,color:'100,160,255',alpha:.035},{cx:.50,cy:.50,rx:.42,ry:.30,color:'60,100,200',alpha:.022},{cx:.86,cy:.18,rx:.20,ry:.16,color:'120,200,255',alpha:.032},{cx:.12,cy:.76,rx:.22,ry:.18,color:'80,140,230',alpha:.028}];
  const ORBS=[{cx:.20,cy:.35,r:95,color:'80,160,255',alpha:.055},{cx:.80,cy:.62,r:75,color:'91,200,245',alpha:.065},{cx:.50,cy:.18,r:60,color:'130,190,255',alpha:.048}];
  const shooters=[];
  function spawnShooter(){shooters.push({x:Math.random()*.65,y:Math.random()*.45,len:90+Math.random()*130,speed:.0016+Math.random()*.002,progress:0,alpha:.65+Math.random()*.35,angle:Math.PI/5+(Math.random()-.5)*.3});}
  setInterval(()=>{if(shooters.length<3)spawnShooter();},3000); spawnShooter();
  const REPEL_RADIUS=120,REPEL_FORCE=6.5,FRICTION=.88,RETURN_FORCE=.045; let t=0;
  function draw(){
    requestAnimationFrame(draw); t+=.005;
    const bg=ctx.createLinearGradient(0,0,W*.5,H);
    bg.addColorStop(0,'#07070a'); bg.addColorStop(.5,'#080810'); bg.addColorStop(1,'#07070a');
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
    NEBULAS.forEach(n=>{
      const g=ctx.createRadialGradient(n.cx*W,n.cy*H,0,n.cx*W,n.cy*H,Math.max(n.rx*W,n.ry*H));
      g.addColorStop(0,`rgba(${n.color},${n.alpha})`); g.addColorStop(.5,`rgba(${n.color},${n.alpha*.4})`); g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.save(); ctx.scale(1,n.ry/n.rx); ctx.beginPath(); ctx.arc(n.cx*W,(n.cy*H)*(n.rx/n.ry),n.rx*W,0,Math.PI*2); ctx.fillStyle=g; ctx.fill(); ctx.restore();
    });
    ORBS.forEach(o=>{
      const g=ctx.createRadialGradient(o.cx*W,o.cy*H,0,o.cx*W,o.cy*H,o.r);
      g.addColorStop(0,`rgba(${o.color},${o.alpha})`); g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.arc(o.cx*W,o.cy*H,o.r,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
    });
    stars.forEach(s=>{
      const dx=mouseX-s.x,dy=mouseY-s.y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<REPEL_RADIUS&&d>0){const f=(1-d/REPEL_RADIUS)*REPEL_FORCE;s.vx-=(dx/d)*f;s.vy-=(dy/d)*f;}
      s.vx+=(s.ox-s.x)*RETURN_FORCE; s.vy+=(s.oy-s.y)*RETURN_FORCE;
      s.vx*=FRICTION; s.vy*=FRICTION; s.x+=s.vx; s.y+=s.vy;
      const tw=Math.sin(t*s.twinkleSpeed+s.twinkleOffset)*.5+.5;
      const a=s.alpha*(0.6+tw*0.4);
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle=`hsla(${s.hue},80%,85%,${a})`; ctx.fill();
    });
    for(let i=shooters.length-1;i>=0;i--){
      const sh=shooters[i]; sh.progress+=sh.speed;
      const sx=sh.x*W+Math.cos(sh.angle)*sh.progress*W*1.5,sy=sh.y*H+Math.sin(sh.angle)*sh.progress*H*1.5;
      const ex=sx-Math.cos(sh.angle)*sh.len,ey=sy-Math.sin(sh.angle)*sh.len;
      const g=ctx.createLinearGradient(ex,ey,sx,sy);
      g.addColorStop(0,'rgba(91,200,245,0)'); g.addColorStop(1,`rgba(91,200,245,${sh.alpha*(1-sh.progress)})`);
      ctx.beginPath(); ctx.moveTo(ex,ey); ctx.lineTo(sx,sy);
      ctx.strokeStyle=g; ctx.lineWidth=1.2; ctx.stroke();
      if(sh.progress>1)shooters.splice(i,1);
    }
  }
  draw();
})();

// ═══════════════════════════════════════════════════════════════════
// CINEMATIC VIDEO LOADER
// ═══════════════════════════════════════════════════════════════════
function initVideoLoader() {
  const loader   = document.getElementById('loader');
  const video    = document.getElementById('ld-video');
  const text1    = document.getElementById('ldText1');   // "ENTERING THE UNIVERSE..."
  const text2    = document.getElementById('ldText2');   // "WELCOME TO MY UNIVERSE"
  const boot1    = document.getElementById('ldBoot1');
  const boot2    = document.getElementById('ldBoot2');
  const boot3    = document.getElementById('ldBoot3');
  const boot4    = document.getElementById('ldBoot4');

  if (!loader || !video) return;

  // Play video — muted first (browser requires it), unmute on first interaction
  if (video) {
    video.muted = true;
    video.loop = true;
    video.play().catch(function() {});
    // Unmute as soon as user touches anything
    var unmute = function() {
      video.muted = false;
      video.volume = 1.0;
      document.removeEventListener('click', unmute);
      document.removeEventListener('keydown', unmute);
    };
    document.addEventListener('click', unmute);
    document.addEventListener('keydown', unmute);
  }
  startLoaderTimers();

  // All timers start AFTER user clicks enter (so they're in sync with video)
  function startLoaderTimers() {
    var bl = [boot1, boot2, boot3, boot4];
    [200, 900, 1800, 3400].forEach(function(d, i) {
      if (!bl[i]) return;
      setTimeout(function() { bl[i].classList.add('ld-boot-visible'); }, d);
    });
    setTimeout(function() { if (text1) text1.classList.add('ld-visible'); }, 3000);
    setTimeout(function() {
      if (text1) { text1.classList.add('ld-hide'); text1.classList.remove('ld-visible'); }
      setTimeout(function() { if (text2) text2.classList.add('ld-visible'); }, 500);
    }, 6000);
    setTimeout(launch, 8000);
  }

}

// ═══════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════
const TECH_LINKS = {
  'HTML':'https://developer.mozilla.org/en-US/docs/Web/HTML',
  'CSS':'https://developer.mozilla.org/en-US/docs/Web/CSS',
  'JavaScript':'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  'JS':'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  'PHP':'https://www.php.net','MySQL':'https://www.mysql.com',
  'Three.js':'https://threejs.org','TypeScript':'https://www.typescriptlang.org',
  'Node.js':'https://nodejs.org','Vue.js':'https://vuejs.org',
  'Next.js':'https://nextjs.org','SQL Server':'https://www.microsoft.com/sql-server','TBD':null
};

const PROJECTS=[
  {name:'Coffee Shop',category:'Front-End',desc:'A fully responsive coffee shop website with animated menu, parallax hero section, smooth scroll interactions and a functional cart — built with pure HTML and CSS.',stack:['HTML','CSS'],demo:'https://moncef37i.github.io/Coffee-shop/',github:'https://github.com/Moncef37i/Coffee-shop',screenshot:'images/coffee.png'},
  {name:'Car Rental',category:'Front-End',desc:'A complete car rental platform with vehicle catalogue, daily pricing in DA, reservation system and a clean responsive layout with smooth card interactions.',stack:['HTML','CSS','JavaScript'],demo:'https://moncef37i.github.io/Location-de-voiture/',github:'https://github.com/Moncef37i/Location-de-voiture',screenshot:'images/carrental.png'},
  {name:'Portfolio',category:'Full-Stack',desc:'This portfolio — a cinematic Three.js-powered site with custom GLSL shader, animated star field and smooth scroll interactions.',stack:['HTML','CSS','JavaScript','Three.js'],demo:'https://moncef37i.github.io/portfolio/',github:'https://github.com/Moncef37i/portfolio',screenshot:'images/portfolio.png'},
  {name:'Task Manager',category:'Full-Stack',desc:'A Kanban-style task management app with drag-and-drop boards, priority tagging, due dates, team avatars and status columns: To Do, Doing, Done.',stack:['PHP','MySQL','JavaScript','CSS'],demo:'#',github:'https://github.com/Moncef37i',screenshot:'images/taskmanager.jpg'},
  {name:'E-Commerce Store',category:'Full-Stack',desc:'Full-stack online shop with product catalogue, category filtering, flash sales countdown, shopping cart, user authentication and complete admin dashboard.',stack:['PHP','MySQL','JavaScript','CSS','HTML'],demo:'#',github:'https://github.com/Moncef37i',screenshot:'images/ecommerce.png'},
  {name:'Coming Soon',category:'In Progress',desc:'A new project is currently in development. Something exciting is on the way — stay tuned and check back soon.',stack:['TBD'],demo:'#',github:'https://github.com/Moncef37i',screenshot:'images/comingsoon.jpg'}
];

// ═══════════════════════════════════════════════════════════════════
// CURSOR
// ═══════════════════════════════════════════════════════════════════
const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
const curEl=document.getElementById('cur'), curDot=document.getElementById('curDot');
let mx=0,my=0,tx=0,ty=0,cursorVisible=false;
if(!isTouchDevice){
  document.addEventListener('mousemove',e=>{
    mx=e.clientX; my=e.clientY;
    curDot.style.left=mx+'px'; curDot.style.top=my+'px';
    if(!cursorVisible){cursorVisible=true;curEl.classList.add('visible');curDot.classList.add('visible');}
  });
  (function animCursor(){tx+=(mx-tx)*.12;ty+=(my-ty)*.12;curEl.style.left=tx+'px';curEl.style.top=ty+'px';requestAnimationFrame(animCursor);})();
}
function bindHover(){
  if(isTouchDevice) return;
  document.querySelectorAll('a,button,.nav-email,.hr-skill,.proj-card,.pd-btn,.icon-back-btn,.pd-back,.social-item,.cv-side,.pd-stack-tag,.ab-contact-email,.ab-contact-social,.proj-h-screenshot,.proj-see-all-btn,.proj-h-btn').forEach(el=>{
    el.addEventListener('mouseenter',()=>curEl.classList.add('hover'));
    el.addEventListener('mouseleave',()=>curEl.classList.remove('hover'));
  });
}

// ═══════════════════════════════════════════════════════════════════
// LOGO
// ═══════════════════════════════════════════════════════════════════
const smLogo=document.getElementById('smLogo'); let smHovered=false;
function buildLetters(text,visible){
  smLogo.innerHTML=''; [...text].forEach((ch,i)=>{
    const s=document.createElement('span'); s.className='logo-letter'+(visible?' vis':'');
    s.textContent=ch===' '?'\u00A0':ch; s.style.transitionDelay=visible?(i*40)+'ms':'0ms'; smLogo.appendChild(s);
  });
}
smLogo.addEventListener('mouseenter',()=>{smHovered=true;buildLetters('SOUILAH MONCEF',false);requestAnimationFrame(()=>requestAnimationFrame(()=>{smLogo.querySelectorAll('.logo-letter').forEach(l=>l.classList.add('vis'));}));});
smLogo.addEventListener('mouseleave',()=>{smHovered=false;smLogo.querySelectorAll('.logo-letter').forEach(l=>{l.style.transitionDelay='0ms';l.classList.remove('vis');});setTimeout(()=>{if(!smHovered)buildLetters('SM',true);},200);});

// ═══════════════════════════════════════════════════════════════════
// LAUNCH — reveal portfolio after loader
// ═══════════════════════════════════════════════════════════════════
function launch() {
  const loader = document.getElementById('loader');
  const app    = document.getElementById('app');
  const flash  = document.getElementById('ld-flash');
  const vid    = document.getElementById('ld-video');
  if (!loader) return;

  // Step 1: video zooms in + text fades (0.55s)
  loader.classList.add('ld-exit');

  // Step 2: white flash at peak of zoom (0.45s in)
  setTimeout(() => {
    if (flash) flash.classList.add('ld-flash-on');
  }, 450);

  // Step 3: stop video at flash peak
  setTimeout(() => {
    if (vid) { vid.pause(); vid.src = ''; }
  }, 500);

  // Step 4: show portfolio under the flash
  setTimeout(() => {
    loader.style.display = 'none';
    if (app) {
      app.style.display = 'block';
      app.style.opacity = '0';
    }
    initCardThumbs();
    buildProjectCards();
    initScrollSystem();
    initScrollReveal();
    initGlobe();
    buildQuote();
    bindHover();
  }, 520);

  // Step 5: flash fades out revealing portfolio
  setTimeout(() => {
    if (flash) {
      flash.classList.remove('ld-flash-on');
      flash.classList.add('ld-flash-out');
    }
    if (app) {
      app.style.transition = 'opacity 1.1s cubic-bezier(.4,0,.2,1)';
      app.style.opacity = '1';
    }
  }, 560);

  // Step 6: clean up flash
  setTimeout(() => {
    if (flash) flash.style.display = 'none';
    if (app) app.classList.add('show');
  }, 1800);
}

// ═══════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════
function copyEmail(){navigator.clipboard.writeText('souilahmoncef99@gmail.com').then(()=>{const b=document.getElementById('emailBtn');b.classList.add('copied');setTimeout(()=>b.classList.remove('copied'),2000);});}
function downloadCV(e){if(e)e.preventDefault();alert('Add your CV file as "cv_souilah_moncef.pdf" next to this HTML file!');}
window.copyAbEmail=function(e){
  e.preventDefault();
  navigator.clipboard.writeText('souilahmoncef99@gmail.com').then(()=>{
    const c=document.getElementById('abEmailCopied'); if(!c)return;
    c.classList.add('show'); setTimeout(()=>c.classList.remove('show'),2000);
  }).catch(()=>{});
};

// ═══════════════════════════════════════════════════════════════════
// QUOTE
// ═══════════════════════════════════════════════════════════════════
const FULL_QUOTE="I am an Independent Developer from Algeria, passionate about building clean, scalable, and impactful digital experiences. I work with MySQL, PHP, HTML, CSS, JavaScript, and Three.js to craft both functional and visually engaging applications. With a competitive programming mindset, I enjoy solving complex problems and turning ideas into efficient, high-performance solutions. I am driven by curiosity, continuous learning, and the challenge of pushing my limits every day. For me, development is not just about writing code — it's about creating experiences, optimizing performance, and building projects that truly make a difference.";
function buildQuote(){
  const el=document.getElementById('abQuoteText');
  if(!el||el.dataset.built)return; el.dataset.built='1'; el.textContent=FULL_QUOTE;
}

// ═══════════════════════════════════════════════════════════════════
// BUILD HORIZONTAL PROJECT CARDS
// ═══════════════════════════════════════════════════════════════════
function buildProjectCards(){
  const track=document.getElementById('projHscrollTrack'); if(!track)return;
  track.innerHTML='';
  PROJECTS.forEach((p,i)=>{
    const card=document.createElement('div'); card.className='proj-h-card';
    const tags=p.stack.map(t=>{const url=TECH_LINKS[t];return url?`<a class="pd-stack-tag" href="${url}" target="_blank" rel="noopener">${t}</a>`:`<span class="pd-stack-tag">${t}</span>`;}).join('');
    const demoDisabled=p.demo==='#';
    card.innerHTML=`
      <div class="proj-h-num">${String(i+1).padStart(2,'0')}</div>
      <div class="proj-h-top">
        <div class="proj-h-category">${p.category}</div>
        <div class="proj-h-name">${p.name}</div>
      </div>
      <div class="proj-h-tools-label">Tools and features</div>
      <div class="proj-h-tags">${tags}</div>
      <div class="proj-h-screenshot" data-idx="${i}">
        <img src="${p.screenshot}" alt="${p.name}" onload="this.classList.add('loaded')" onerror="this.style.display='none'">
        <div class="proj-h-corner tl"></div><div class="proj-h-corner tr"></div>
        <div class="proj-h-corner bl"></div><div class="proj-h-corner br"></div>
      </div>
      <div class="proj-h-actions">
        <a class="proj-h-btn proj-h-btn-primary" href="${p.demo}" ${!demoDisabled?'target="_blank" rel="noopener"':''} ${demoDisabled?'onclick="return false;" style="opacity:.4;pointer-events:none;"':''}>
          <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>Live Demo
        </a>
        <a class="proj-h-btn proj-h-btn-outline" href="${p.github}" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>GitHub
        </a>
      </div>
    `;
    const ss=card.querySelector('.proj-h-screenshot');
    ss.style.cursor='zoom-in';
    ss.onclick=()=>window.openScreenshot&&window.openScreenshot(p.screenshot);
    track.appendChild(card);
  });
  initHorizontalScroll();
  bindHover();
}

// ═══════════════════════════════════════════════════════════════════
// HORIZONTAL SCROLL
// ═══════════════════════════════════════════════════════════════════
function initHorizontalScroll(){
  const wrapper=document.getElementById('projHscrollWrapper');
  const track=document.getElementById('projHscrollTrack');
  if(!wrapper||!track)return;
  let hPos=0;
  function getMax(){ return Math.max(0,track.scrollWidth-wrapper.clientWidth); }
  wrapper.addEventListener('wheel',e=>{
    const max=getMax(); if(max<=0)return;
    if((e.deltaY>0&&hPos<max)||(e.deltaY<0&&hPos>0)){
      e.preventDefault(); hPos=Math.max(0,Math.min(max,hPos+e.deltaY*1.5));
      track.style.transform=`translateX(-${hPos}px)`;
    }
  },{passive:false});
  let tStartX=0,tStartH=0;
  wrapper.addEventListener('touchstart',e=>{tStartX=e.touches[0].clientX;tStartH=hPos;},{passive:true});
  wrapper.addEventListener('touchmove',e=>{
    const dx=tStartX-e.touches[0].clientX;
    hPos=Math.max(0,Math.min(getMax(),tStartH+dx));
    track.style.transform=`translateX(-${hPos}px)`;
  },{passive:true});
}

// ═══════════════════════════════════════════════════════════════════
// SCROLL SYSTEM — progress bar + active nav
// ═══════════════════════════════════════════════════════════════════
// FIXED: About Me + Tech Stack + Strengths → navAbout
const SECTION_NAV_MAP = {
  'section-home':     'navHome',
  'section-about':    'navAbout',   // FIXED: was navHome
  'section-techstack':'navAbout',
  'section-strengths':'navAbout',
  'section-projects': 'navProjects',
  'section-contact':  'navContact',
};

function initScrollSystem(){
  const sc=document.getElementById('scroll-container');
  const pt=document.getElementById('progress-top');
  if(!sc)return;

  sc.addEventListener('scroll',()=>{
    // Progress bar
    const max=sc.scrollHeight-sc.clientHeight;
    const pct=max>0?(sc.scrollTop/max*100):0;
    if(pt)pt.style.setProperty('--progress',pct+'%');

    // Active nav — find which section is most in view
    const scrollMid=sc.scrollTop+sc.clientHeight*0.4;
    let activeSection=null;
    Object.keys(SECTION_NAV_MAP).forEach(id=>{
      const el=document.getElementById(id);
      if(!el)return;
      if(el.offsetTop<=scrollMid) activeSection=id;
    });
    const activeNav=activeSection?SECTION_NAV_MAP[activeSection]:null;
    document.querySelectorAll('.nav-link').forEach(l=>l.classList.remove('active'));
    if(activeNav){ const el=document.getElementById(activeNav); if(el)el.classList.add('active'); }
  },{passive:true});

  document.getElementById('navHome')?.classList.add('active');
}

// ═══════════════════════════════════════════════════════════════════
// SMOOTH SCROLL TO SECTION — FIXED: now truly smooth
// ═══════════════════════════════════════════════════════════════════
function scrollToSection(name){
  const sc=document.getElementById('scroll-container');
  const map={
    home:'section-home',
    about:'section-about',
    techstack:'section-techstack',
    projects:'section-projects',
    contact:'section-contact'
  };
  const id=map[name]||('section-'+name);
  const el=document.getElementById(id);
  if(!el||!sc)return;

  const targetScrollTop = el.offsetTop;
  const startScrollTop = sc.scrollTop;
  const distance = targetScrollTop - startScrollTop;
  const duration = Math.min(1200, Math.max(500, Math.abs(distance) * 0.6));
  const startTime = performance.now();

  function easeInOutCubic(t) {
    return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
  }

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeInOutCubic(progress);
    sc.scrollTop = startScrollTop + distance * ease;
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// ═══════════════════════════════════════════════════════════════════
// BIDIRECTIONAL SCROLL REVEAL
// ═══════════════════════════════════════════════════════════════════
function initScrollReveal(){
  const sc=document.getElementById('scroll-container');
  const sections = [...document.querySelectorAll('.scroll-section:not(.section-home)')];
  const innerEls = [...document.querySelectorAll('.ab-big-title,.ab-quote-wrap,.ab-globe-wrap,.ab-strength-card')];

  // Track section visibility state
  const sectionStates = new Map(); // id -> 'above' | 'visible' | 'below'
  sections.forEach(el => sectionStates.set(el.id, 'below'));

  function updateSections() {
    const viewTop = sc.scrollTop;
    const viewBottom = viewTop + sc.clientHeight;
    const threshold = sc.clientHeight * 0.15;

    sections.forEach(el => {
      const elTop = el.offsetTop;
      const elBottom = elTop + el.offsetHeight;
      const prevState = sectionStates.get(el.id);

      // Determine new state
      let newState;
      if (elBottom < viewTop + threshold) {
        newState = 'above';
      } else if (elTop > viewBottom - threshold) {
        newState = 'below';
      } else {
        newState = 'visible';
      }

      if (newState === prevState) return;
      sectionStates.set(el.id, newState);

      // Remove all state classes first
      el.classList.remove('section-visible', 'section-exit-up', 'section-exit-down');

      if (newState === 'visible') {
        // Small delay so transition fires
        requestAnimationFrame(() => el.classList.add('section-visible'));
      } else if (newState === 'above') {
        // Was visible, now scrolled past upward — exit up
        el.classList.add('section-exit-up');
      } else if (newState === 'below') {
        // Was visible or above, now scrolled down past — reset to below
        el.classList.add('section-exit-down');
      }
    });
  }

  // Inner element intersection observer (bidirectional)
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      const el = e.target;
      if (e.isIntersecting) {
        // Entering view
        if (el.classList.contains('ab-strength-card')) {
          const cards = [...document.querySelectorAll('.ab-strength-card')];
          const delay = cards.indexOf(el) * 110;
          setTimeout(() => {
            el.classList.remove('ab-exit');
            el.classList.add('ab-visible');
          }, delay);
        } else {
          el.classList.remove('ab-exit');
          requestAnimationFrame(() => el.classList.add('ab-visible'));
        }
      } else {
        // Leaving view — reset for re-animation
        el.classList.remove('ab-visible');
        el.classList.add('ab-exit');
        // After exit transition, fully reset
        setTimeout(() => {
          el.classList.remove('ab-exit');
        }, 500);
      }
    });
  }, { root: sc, threshold: 0.1 });

  innerEls.forEach(el => io.observe(el));

  // Listen to scroll for section bidirectional
  sc.addEventListener('scroll', updateSections, { passive: true });
  // Initial check
  setTimeout(updateSections, 100);
}

// ═══════════════════════════════════════════════════════════════════
// FULL PROJECTS OVERLAY
// ═══════════════════════════════════════════════════════════════════
function openProjectsFull(){
  const o=document.getElementById('page-projects-full'); if(!o)return;
  o.style.display='flex'; requestAnimationFrame(()=>o.classList.add('visible'));
  document.getElementById('proj-detail-view').style.display='none';
  document.getElementById('proj-grid-view').style.display='flex';
  initCardThumbs();
}
function closeProjectsFull(){
  const o=document.getElementById('page-projects-full'); if(!o)return;
  o.classList.remove('visible'); setTimeout(()=>o.style.display='none',400);
}
window.closeProjectsFull=closeProjectsFull;

function initCardThumbs(){
  PROJECTS.forEach((p,i)=>{
    if(!p.screenshot)return;
    const img=document.getElementById('pc-ti-'+i);
    const fb=document.getElementById('pc-fb-'+i); if(!img)return;
    img.className='pc-thumb-img'; img.src=p.screenshot;
    img.onload=()=>{img.classList.add('loaded');if(fb)fb.style.display='none';};
    img.onerror=()=>{img.style.display='none';};
  });
}

function openDetail(i){
  const p=PROJECTS[i];
  document.getElementById('pd-crumb-name').textContent=p.name;
  document.getElementById('pd-index').textContent='PROJECT '+String(i+1).padStart(2,'0');
  const parts=p.name.split(' ');
  document.getElementById('pd-name').innerHTML='<span>'+parts[0]+'</span> '+parts.slice(1).join(' ');
  document.getElementById('pd-desc').textContent=p.desc;
  document.getElementById('pd-stack').innerHTML=p.stack.map(t=>{const url=TECH_LINKS[t];return url?`<a class="pd-stack-tag" href="${url}" target="_blank" rel="noopener">${t}</a>`:`<span class="pd-stack-tag">${t}</span>`;}).join('');
  document.getElementById('pd-demo').href=p.demo;
  document.getElementById('pd-github').href=p.github;
  const imgEl=document.getElementById('pd-screenshot-img'),ph=document.getElementById('pd-shot-placeholder');
  if(p.screenshot){imgEl.style.display='block';imgEl.classList.remove('loaded');imgEl.src=p.screenshot;imgEl.onload=()=>imgEl.classList.add('loaded');ph.style.display='none';imgEl.style.cursor='zoom-in';imgEl.onclick=()=>window.openScreenshot&&window.openScreenshot(p.screenshot);}
  else{imgEl.style.display='none';imgEl.src='';ph.style.display='flex';imgEl.onclick=null;}
  document.getElementById('proj-grid-view').style.display='none';
  const dv=document.getElementById('proj-detail-view');
  dv.style.display='flex'; dv.classList.remove('animating'); void dv.offsetWidth; dv.classList.add('animating');
  setTimeout(()=>dv.classList.remove('animating'),800); bindHover();
}
function closeDetail(){document.getElementById('proj-detail-view').style.display='none';document.getElementById('proj-grid-view').style.display='flex';}

// ═══════════════════════════════════════════════════════════════════
// LIGHTBOX
// ═══════════════════════════════════════════════════════════════════
window.openScreenshot=function(src){
  if(!src)return;
  let lb=document.getElementById('screenshotLightbox');
  if(!lb){
    lb=document.createElement('div'); lb.id='screenshotLightbox';
    lb.innerHTML=`<div class="slb-bg"></div><div class="slb-inner"><img id="slbImg" src=""><button class="slb-close" onclick="closeScreenshot()">&#10005;</button></div>`;
    document.body.appendChild(lb);
    lb.querySelector('.slb-bg').addEventListener('click',closeScreenshot);
    if(!isTouchDevice){const cl=lb.querySelector('.slb-close');cl.addEventListener('mouseenter',()=>curEl.classList.add('hover'));cl.addEventListener('mouseleave',()=>curEl.classList.remove('hover'));}
  }
  document.getElementById('slbImg').src=src;
  lb.classList.add('slb-open'); document.body.style.overflow='hidden';
};
window.closeScreenshot=function(){
  const lb=document.getElementById('screenshotLightbox'); if(lb)lb.classList.remove('slb-open');
  document.body.style.overflow='';
};
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeScreenshot();});

// ═══════════════════════════════════════════════════════════════════
// GLOBE — 3D tech stack (unchanged)
// ═══════════════════════════════════════════════════════════════════
const SKILLS=[
  {name:'HTML',color:'#e34f26',url:'https://developer.mozilla.org/en-US/docs/Web/HTML',svg:'<path fill="#e34f26" d="M1.5 0l1.74 19.54L12 22l8.73-2.43L22.5 0zm17.01 4.54l-.31 3.48H8.13l.21 2.38h9.65l-.96 10.79L12 22.5l-4.99-1.3-.34-3.85h3.22l.17 1.96L12 20l1.94-.52.19-2.13H7.58l-.6-6.7h10.05l.31-3.48H6.46L6.16 4.54z"/>'},
  {name:'CSS',color:'#1572b6',url:'https://developer.mozilla.org/en-US/docs/Web/CSS',svg:'<path fill="#1572b6" d="M1.5 0l1.74 19.54L12 22l8.73-2.43L22.5 0zm14.1 16.97l-3.6 1-.01.01-3.61-1-.25-2.8H11.4l.13 1.47 1.47.4 1.47-.4.15-1.73H8.09l-.63-7.07h9.08l-.21 2.37H9.99l.14 1.54h6.22l-.65 7.21z"/>'},
  {name:'JavaScript',color:'#f7df1e',url:'https://developer.mozilla.org/en-US/docs/Web/JavaScript',svg:'<rect width="24" height="24" fill="#f7df1e" rx="2"/><path fill="#000" d="M6 17.5c.3.9.9 1.5 2 1.5 1.2 0 1.8-.6 1.8-1.5 0-1-.6-1.4-1.7-1.9l-.6-.2c-1.7-.7-2.8-1.6-2.8-3.4 0-1.7 1.3-3 3.3-3 1.4 0 2.5.5 3.2 1.8l-1.8 1.1c-.4-.7-.8-1-1.4-1-.7 0-1.1.4-1.1 1 0 .7.4 1 1.5 1.5l.6.2c2 .9 3.1 1.7 3.1 3.6 0 2.1-1.6 3.2-3.8 3.2-2.1 0-3.5-1-4.2-2.4zm8.5.2c.4 1 .9 1.8 2.1 1.8 1.1 0 1.7-.4 1.7-2.1V12h2.2v5.5c0 3.4-2 4.5-3.9 4.5-2 0-3.2-1-3.8-2.3z"/>'},
  {name:'Three.js',color:'#ffffff',url:'https://threejs.org',svg:'<path fill="#fff" d="M3 2l18 10-18 10V2zm2 3.2v13.6l12.3-6.8L5 5.2z"/>'},
  {name:'PHP',color:'#8993be',url:'https://www.php.net',svg:'<ellipse fill="#8993be" cx="12" cy="12" rx="11" ry="7"/><path fill="#fff" d="M7 14.5l.5-3h1.7c.9 0 1.3.4 1.1 1.1L9.9 14H9l.3-1.3H8.7L8.2 14.5H7zm1-3.5l-.2 1h.6c.4 0 .6-.1.6-.4 0-.2-.1-.6-.5-.6H8zm3.5 3.5l.8-4h1l-.2 1h1c.8 0 1.1.4.9 1.1l-.3 1.4h-1l.3-1.3c.1-.3 0-.4-.2-.4h-.8l-.5 2.2h-1zm5-3.5l-.2 1h.6c.4 0 .6-.1.6-.4 0-.2-.1-.6-.5-.6h-.5zm-.5 2l-.3 1.5h-1l.8-4h1.7c.9 0 1.3.4 1.1 1.1-.3 1-.9 1.4-1.8 1.4h-.5z"/>'},
  {name:'MySQL',color:'#00758f',url:'https://www.mysql.com',svg:'<path fill="#00758f" d="M2 5.5C2 4.1 6.5 3 12 3s10 1.1 10 2.5v13c0 1.4-4.5 2.5-10 2.5S2 19.9 2 18.5v-13z"/><path fill="#f29111" d="M2 9c0 1.4 4.5 2.5 10 2.5S22 10.4 22 9"/><path fill="#f29111" d="M2 13c0 1.4 4.5 2.5 10 2.5S22 14.4 22 13"/><ellipse fill="#f29111" cx="12" cy="5.5" rx="10" ry="2.5"/>'},
  {name:'Git',color:'#f05032',url:'https://git-scm.com',svg:'<path fill="#f05032" d="M22.2 10.8l-9-9a1.4 1.4 0 00-2 0l-2 2 2.5 2.5a1.7 1.7 0 012.1 2.1l2.4 2.4a1.7 1.7 0 011.8 2.8 1.7 1.7 0 01-2.9-1.8l-2.2-2.2v5.8a1.7 1.7 0 11-2 0V9.3a1.7 1.7 0 01-.9-2.8L7.5 4 1.8 9.8a1.4 1.4 0 000 2l9 9a1.4 1.4 0 002 0l9.4-9.4a1.4 1.4 0 000-2z"/>'},
  {name:'GitHub',color:'#ffffff',url:'https://github.com',svg:'<path fill="#fff" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>'},
  {name:'VS Code',color:'#007acc',url:'https://code.visualstudio.com',svg:'<path fill="#007acc" d="M17 1.4L9.1 9 4.5 5.2 2 6.5v11l2.5 1.3 4.6-3.8L17 22.6 22 20V4L17 1.4zM20 17.6l-7.3-5.6 7.3-5.6v11.2z"/>'},
  {name:'Figma',color:'#a259ff',url:'https://figma.com',svg:'<path fill="#1abcfe" d="M12 12a4 4 0 118 0 4 4 0 01-8 0z"/><path fill="#0acf83" d="M4 20a4 4 0 018 0v-4H8a4 4 0 00-4 4z"/><path fill="#ff7262" d="M8 4H4a4 4 0 000 8h4V4z"/><path fill="#f24e1e" d="M12 4H8v8h4a4 4 0 000-8z"/><path fill="#a259ff" d="M16 4h-4v8a4 4 0 000-8z"/>'},
  {name:'Tailwind',color:'#38bdf8',url:'https://tailwindcss.com',svg:'<path fill="#38bdf8" d="M12 6C9.6 6 8.1 7.2 7.5 9.6c.9-1.2 1.95-1.65 3.15-1.35.685.171 1.174.668 1.715 1.219C13.28 10.48 14.21 11.5 16.5 11.5c2.4 0 3.9-1.2 4.5-3.6-.9 1.2-1.95 1.65-3.15 1.35-.685-.171-1.174-.668-1.715-1.219C15.22 7.02 14.29 6 12 6zm-4.5 6C5.1 12 3.6 13.2 3 15.6c.9-1.2 1.95-1.65 3.15-1.35.685.171 1.174.668 1.715 1.219C8.78 16.48 9.71 17.5 12 17.5c2.4 0 3.9-1.2 4.5-3.6-.9 1.2-1.95 1.65-3.15 1.35-.685-.171-1.174-.668-1.715-1.219C11.72 13.02 10.79 12 7.5 12z"/>'},
  {name:'C++',color:'#00599c',url:'https://isocpp.org',svg:'<path fill="#00599c" d="M14.5 2.5A9.5 9.5 0 1 1 5 7.4L6.6 9A7.5 7.5 0 1 0 14.5 4.5V2.5z"/><text x="3.5" y="16" font-family="monospace" font-size="8" font-weight="bold" fill="#00599c">C++</text>'},
  {name:'Linux',color:'#fcc624',url:'https://www.linux.org',svg:'<path fill="#fcc624" d="M12 2C9 2 7 5 7 8c0 1.5.4 3 1 4.1C7.1 13.3 6 15 6 17c0 2 .8 3.5 2 4.2.5.3 1.3.6 2.5.7L12 22l1.5-.1c1.2-.1 2-.4 2.5-.7 1.2-.7 2-2.2 2-4.2 0-2-1.1-3.7-2-4.9.6-1.1 1-2.6 1-4.1 0-3-2-6-5-6zm-2 10c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/>'},
  {name:'Vercel',color:'#ffffff',url:'https://vercel.com',svg:'<path fill="#fff" d="M12 3L24 21H0L12 3z"/>'},
  {name:'Canva',color:'#00c4cc',url:'https://www.canva.com',svg:'<circle cx="12" cy="12" r="10" fill="#00c4cc"/><path fill="#fff" d="M14.8 8.5c-1 0-2 .6-2.8 1.8-.8-1.2-1.8-1.8-2.8-1.8-1.8 0-3.2 1.8-3.2 4s1.4 4 3.2 4c1 0 2-.6 2.8-1.8.8 1.2 1.8 1.8 2.8 1.8 1.8 0 3.2-1.8 3.2-4s-1.4-4-3.2-4z"/>'},
  {name:'GSAP',color:'#88ce02',url:'https://greensock.com/gsap/',svg:'<rect width="24" height="24" rx="4" fill="#0e100f"/><path fill="#88ce02" d="M12 5a7 7 0 100 14A7 7 0 0012 5zm0 2.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9z"/><circle cx="12" cy="12" r="2" fill="#88ce02"/>'},
  {name:'Apache',color:'#d22128',url:'https://httpd.apache.org',svg:'<path fill="#d22128" d="M12 2L2 7l2 13 8 2 8-2 2-13L12 2zm0 3l6 3-1.5 9.5L12 19l-4.5-1.5L6 8l6-3z"/>'},
  {name:'Composer',color:'#6c3483',url:'https://getcomposer.org',svg:'<rect width="24" height="24" rx="4" fill="#6c3483"/><path fill="#fff" d="M7 8c0-2.8 2.2-5 5-5s5 2.2 5 5c0 1.5-.7 2.9-1.7 3.8L17 21H7l1.7-9.2C7.7 10.9 7 9.5 7 8zm5-3a3 3 0 100 6 3 3 0 000-6z"/>'},
  {name:'TypeScript',color:'#3178c6',url:'https://www.typescriptlang.org',svg:'<rect width="24" height="24" rx="2" fill="#3178c6"/><path fill="#fff" d="M13.5 15.5v1.8c.3.2.7.3 1.1.3 1.5 0 2.4-.8 2.4-2.1 0-1.1-.6-1.7-1.9-2.2-.8-.3-1-.6-1-.9 0-.4.3-.6.8-.6.4 0 .8.2 1.1.5l1-.9c-.5-.6-1.2-.9-2.1-.9-1.3 0-2.2.8-2.2 1.9 0 1 .6 1.6 1.7 2.1.9.4 1.2.7 1.2 1.1 0 .4-.4.7-.9.7-.5 0-1-.3-1.2-.8zM5 13h2.5v6h1.6v-6H11v-1.4H5V13z"/>'},
  {name:'Node.js',color:'#8cc84b',url:'https://nodejs.org',svg:'<path fill="#8cc84b" d="M12 1.8L2 7.5v9l10 5.7 10-5.7v-9L12 1.8zm0 2.3l7.5 4.3-7.5 4.3-7.5-4.3L12 4.1zM4 9.8l7 4v7.5L4 17.2V9.8zm16 0v7.4l-7 4V13.8l7-4z"/>'},
  {name:'Vue.js',color:'#42b883',url:'https://vuejs.org',svg:'<path fill="#42b883" d="M2 3l10 17L22 3h-4.5L12 13.5 6.5 3H2z"/><path fill="#35495e" d="M6.5 3L12 13.5 17.5 3h-4L12 8.5 10.5 3H6.5z"/>'},
  {name:'Next.js',color:'#ffffff',url:'https://nextjs.org',svg:'<rect width="24" height="24" rx="12" fill="#000"/><path fill="#fff" d="M9.5 7v7.5l7-7.5H14V7H9.5zm0 10h1.5v-4l6 4H19L9.5 17z"/>'},
  {name:'SQL Server',color:'#cc2927',url:'https://www.microsoft.com/sql-server',svg:'<path fill="#cc2927" d="M12 3C7 3 3 4.3 3 6v12c0 1.7 4 3 9 3s9-1.3 9-3V6c0-1.7-4-3-9-3z"/><ellipse fill="#e87a7a" cx="12" cy="6" rx="9" ry="3"/><path fill="none" stroke="#e87a7a" stroke-width=".8" d="M3 10c0 1.7 4 3 9 3s9-1.3 9-3M3 14c0 1.7 4 3 9 3s9-1.3 9-3"/>'},
];

function initGlobe(){
  const canvas=document.getElementById('globeCanvas'); if(!canvas)return;
  const ctx=canvas.getContext('2d');
  function setSize(){canvas.width=canvas.parentElement.clientWidth;canvas.height=canvas.parentElement.clientHeight;}
  setSize(); window.addEventListener('resize',setSize);
  const ICON_SIZE=128;
  function fibSphere(n){const pts=[],G=Math.PI*(3-Math.sqrt(5));for(let i=0;i<n;i++){const y=1-(i/(n-1))*2,r=Math.sqrt(1-y*y),t=G*i;pts.push([Math.cos(t)*r,y,Math.sin(t)*r]);}return pts;}
  function renderIcons(size){return SKILLS.map(sk=>{const oc=document.createElement('canvas');oc.width=oc.height=size;const c=oc.getContext('2d');const svgStr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}">${sk.svg}</svg>`;const blob=new Blob([svgStr],{type:'image/svg+xml'});const url=URL.createObjectURL(blob);const img=new Image();img.src=url;img.onload=()=>{c.drawImage(img,0,0,size,size);URL.revokeObjectURL(url);};return{img,name:sk.name,color:sk.color,url:sk.url};});}
  const icons=renderIcons(ICON_SIZE),pts=fibSphere(SKILLS.length);
  let rotY=0,rotX=0.3,isDragging=false,lastMX=0,lastMY=0,velX=0,velY=0.005,hoveredIdx=-1;
  canvas.addEventListener('mousedown',e=>{isDragging=true;lastMX=e.clientX;lastMY=e.clientY;velX=0;velY=0;});
  window.addEventListener('mouseup',()=>isDragging=false);
  window.addEventListener('mousemove',e=>{if(!isDragging)return;const dx=e.clientX-lastMX,dy=e.clientY-lastMY;velY=-dx*0.01;velX=-dy*0.01;rotY+=velY;rotX+=velX;lastMX=e.clientX;lastMY=e.clientY;});
  let lastTX=0,lastTY=0;
  canvas.addEventListener('touchstart',e=>{isDragging=true;lastTX=e.touches[0].clientX;lastTY=e.touches[0].clientY;velX=0;velY=0;});
  canvas.addEventListener('touchend',()=>isDragging=false);
  canvas.addEventListener('touchmove',e=>{const dx=e.touches[0].clientX-lastTX,dy=e.touches[0].clientY-lastTY;velY=-dx*0.012;velX=-dy*0.012;rotY+=velY;rotX+=velX;lastTX=e.touches[0].clientX;lastTY=e.touches[0].clientY;e.preventDefault();},{passive:false});
  canvas.addEventListener('mousemove',e=>{if(isDragging){hoveredIdx=-1;return;}const rect=canvas.getBoundingClientRect();const mx=e.clientX-rect.left,my=e.clientY-rect.top;hoveredIdx=-1;const cx=canvas.width/2,cy=canvas.height/2,R=Math.min(canvas.width,canvas.height)*0.48;pts.forEach(([x,y,z],i)=>{const{sx,sy,d}=proj(x,y,z);if(d<0)return;const px=cx+sx*R,py=cy+sy*R;if(Math.hypot(mx-px,my-py)<28){hoveredIdx=i;canvas.style.cursor='pointer';}});if(hoveredIdx===-1)canvas.style.cursor='grab';});
  canvas.addEventListener('click',e=>{if(hoveredIdx>=0&&SKILLS[hoveredIdx].url)window.open(SKILLS[hoveredIdx].url,'_blank');});
  function proj(x,y,z){const cy=Math.cos(rotY),sy=Math.sin(rotY);let x1=x*cy-z*sy,z1=x*sy+z*cy;const cx=Math.cos(rotX),sx2=Math.sin(rotX);let y1=y*cx-z1*sx2,z2=y*sx2+z1*cx;return{sx:x1,sy:y1,d:z2};}
  function drawGrid(cx,cy,R){ctx.save();for(let lat=0;lat<10;lat++){const phi=(lat/10)*Math.PI,yr=Math.cos(phi),xr=Math.sin(phi);ctx.beginPath();let first=true;for(let j=0;j<=80;j++){const t=(j/80)*Math.PI*2;const{sx,sy,d}=proj(xr*Math.cos(t),yr,xr*Math.sin(t));if(d<-0.05){first=true;ctx.stroke();ctx.beginPath();continue;}ctx.strokeStyle=`rgba(91,200,245,${0.08+(d+1)/2*0.1})`;ctx.lineWidth=0.7;const px=cx+sx*R,py=cy+sy*R;if(first){ctx.moveTo(px,py);first=false;}else ctx.lineTo(px,py);}ctx.stroke();}for(let lng=0;lng<16;lng++){const theta=(lng/16)*Math.PI*2;ctx.beginPath();let first=true;for(let j=0;j<=40;j++){const phi=(j/40)*Math.PI;const{sx,sy,d}=proj(Math.sin(phi)*Math.cos(theta),Math.cos(phi),Math.sin(phi)*Math.sin(theta));if(d<-0.05){first=true;ctx.stroke();ctx.beginPath();continue;}ctx.strokeStyle=`rgba(91,200,245,${0.07+(d+1)/2*0.09})`;ctx.lineWidth=0.7;const px=cx+sx*R,py=cy+sy*R;if(first){ctx.moveTo(px,py);first=false;}else ctx.lineTo(px,py);}ctx.stroke();}const grd=ctx.createRadialGradient(cx,cy,R*0.85,cx,cy,R*1.15);grd.addColorStop(0,'rgba(91,200,245,0)');grd.addColorStop(0.5,'rgba(91,200,245,0.04)');grd.addColorStop(1,'rgba(91,200,245,0)');ctx.beginPath();ctx.arc(cx,cy,R*1.1,0,Math.PI*2);ctx.fillStyle=grd;ctx.fill();ctx.restore();}
  function drawSkills(cx,cy,R){const items=pts.map(([x,y,z],i)=>{const{sx,sy,d}=proj(x,y,z);return{sx,sy,d,i};}).sort((a,b)=>a.d-b.d);items.forEach(({sx,sy,d,i})=>{if(d<-0.1)return;const t=(d+1)/2;if(t<0.05)return;const alpha=Math.pow(t,1.2),scale=0.5+t*0.5;const px=cx+sx*R,py=cy+sy*R;const isHov=(i===hoveredIdx),iconR=R*0.085*scale*(isHov?1.25:1);ctx.save();ctx.globalAlpha=alpha;if(isHov){const grd=ctx.createRadialGradient(px,py,0,px,py,iconR*3);grd.addColorStop(0,'rgba(91,200,245,0.35)');grd.addColorStop(1,'rgba(91,200,245,0)');ctx.beginPath();ctx.arc(px,py,iconR*3,0,Math.PI*2);ctx.fillStyle=grd;ctx.fill();}ctx.beginPath();ctx.arc(px,py,iconR,0,Math.PI*2);ctx.fillStyle=SKILLS[i].color+'18';ctx.strokeStyle=isHov?'rgba(91,200,245,0.9)':SKILLS[i].color+'66';ctx.lineWidth=(isHov?2:1.2)*scale;ctx.fill();ctx.stroke();const ic=icons[i];if(ic.img.complete&&ic.img.naturalWidth){const s=iconR*1.35;ctx.drawImage(ic.img,px-s/2,py-s/2,s,s);}else{ctx.beginPath();ctx.arc(px,py,iconR*0.5,0,Math.PI*2);ctx.fillStyle=SKILLS[i].color;ctx.fill();}const fs=Math.max(9,R*0.048*scale*(isHov?1.1:1));ctx.fillStyle=isHov?'#5bc8f5':'#ffffff';ctx.font=`${isHov?'600':'400'} ${fs}px Outfit,sans-serif`;ctx.textAlign='center';ctx.textBaseline='top';ctx.shadowColor='rgba(0,0,0,0.8)';ctx.shadowBlur=4;ctx.fillText(SKILLS[i].name,px,py+iconR+3*scale);ctx.shadowBlur=0;ctx.restore();});}
  let raf;
  function loop(){raf=requestAnimationFrame(loop);const w=canvas.width,h=canvas.height;if(!w||!h)return;ctx.clearRect(0,0,w,h);const cx=w/2,cy=h/2,R=Math.min(w,h)*0.48;if(!isDragging){rotY+=velY;velY+=(-0.005-velY)*0.02;velX*=0.95;rotX+=velX;rotX+=(0.3-rotX)*0.01;}drawGrid(cx,cy,R);drawSkills(cx,cy,R);}
  loop();
}

// ═══════════════════════════════════════════════════════════════════
// START — called after all functions are defined
// ═══════════════════════════════════════════════════════════════════
initVideoLoader();