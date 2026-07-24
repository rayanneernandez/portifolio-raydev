/* ══════════════════════════════════════════════
   RAYANNE ERNANDEZ — orquestração geral
   ══════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

// no celular, a barra de endereço muda a altura da tela o tempo todo —
// sem isso, cada mudança recalcula o layout inteiro e os itens "pulam"
ScrollTrigger.config({ ignoreMobileResize: true });

let lenis;
let scrollVel = 0; // velocidade do scroll (usada nos marquees)

document.addEventListener('DOMContentLoaded', () => {
  applyI18n();       // traduz o HTML antes de qualquer medição/split
  initLang();
  initTheme();
  initLenis();
  initCursor();
  initNav();
  buildMarquees();
  buildProjects();
  initModal();
  buildCerts();
  buildSkillsFloat();
  splitLines();

  FX.initParticles();
  FX.initCodeCanvas();
  FX.initPose();

  initLoader();      // ao terminar, dispara a intro do hero
  initReveals();
  initStats();
  initScaleSection();
  initBallSection();
  initTimeline();
  initServices();
  initPoseTrigger();

  // recalcula tudo depois que imagens carregarem
  window.addEventListener('load', () => ScrollTrigger.refresh());

  // recalcula quando as fontes carregam (o texto re-quebra as linhas)
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

  // re-mede só quando a LARGURA muda (girar o celular, redimensionar janela);
  // mudanças de altura são a barra de endereço e não afetam as medidas
  if (window.visualViewport) {
    let vvTimer;
    let lastW = window.visualViewport.width;
    window.visualViewport.addEventListener('resize', () => {
      if (Math.abs(window.visualViewport.width - lastW) < 2) return;
      lastW = window.visualViewport.width;
      clearTimeout(vvTimer);
      vvTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
    });
  }
});

/* ─── IDIOMA (botão + dropdown) ─── */
function initLang() {
  const wrap = document.getElementById('langSwitch');
  const btn = document.getElementById('langBtn');
  const cur = document.getElementById('langCur');
  cur.textContent = LANG.toUpperCase();

  wrap.querySelectorAll('.lang__menu button').forEach(b => {
    b.classList.toggle('is-active', b.dataset.lang === LANG);
    b.addEventListener('click', () => {
      if (b.dataset.lang === LANG) { wrap.classList.remove('is-open'); return; }
      try { localStorage.setItem('lang', b.dataset.lang); } catch (e) { }
      location.reload(); // recarrega já no novo idioma (medições e efeitos recalculam)
    });
  });

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = wrap.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open);
  });
  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) wrap.classList.remove('is-open');
  });
}

/* ─── TEMA claro/noturno ─── */
function initTheme() {
  const apply = () => {
    const dark = document.documentElement.dataset.theme === 'dark';
    if (dark) delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = 'dark';
    try { localStorage.setItem('theme', dark ? 'light' : 'dark'); } catch (e) { }
    ScrollTrigger.refresh(); // re-registra cores/medidas dos tweens no novo tema
  };
  const b1 = document.getElementById('themeBtn');
  const b2 = document.getElementById('themeBtnMobile');
  if (b1) b1.addEventListener('click', apply);
  if (b2) b2.addEventListener('click', apply);
}

/* ─── LENIS (scroll suave) ─── */
function initLenis() {
  lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  lenis.on('scroll', (e) => {
    scrollVel = e.velocity || 0;
    ScrollTrigger.update();
  });
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // âncoras — pulo rápido com fade (sem passar por todas as transições)
  const fade = document.createElement('div');
  fade.className = 'page-fade';
  document.body.appendChild(fade);

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      fade.classList.add('is-on');
      setTimeout(() => {
        lenis.scrollTo(target, { offset: 0, immediate: true, force: true });
        ScrollTrigger.update();
        requestAnimationFrame(() => {
          requestAnimationFrame(() => fade.classList.remove('is-on'));
        });
      }, 280);
    });
  });
}

/* ─── CURSOR bolinha ─── */
function initCursor() {
  const dot = document.getElementById('cursorDot');
  if (matchMedia('(pointer: coarse)').matches) return;

  let mx = -100, my = -100;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  gsap.ticker.add(() => {
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
  });

  document.addEventListener('mouseover', e => {
    if (e.target.closest('a, button, .g-card, .m-card, .sk-bubble, [data-hover]')) dot.classList.add('is-hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('a, button, .g-card, .m-card, .sk-bubble, [data-hover]')) dot.classList.remove('is-hover');
  });
}

/* ─── NAV ─── */
function initNav() {
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobileMenu');
  let lastY = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 60);
    if (y > lastY && y > 300 && !menu.classList.contains('is-open')) nav.classList.add('is-hidden');
    else nav.classList.remove('is-hidden');
    lastY = y;
  }, { passive: true });

  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    if (open) lenis.stop(); else lenis.start();
  });

  // X pra fechar o menu mobile
  const close = document.getElementById('menuClose');
  if (close) close.addEventListener('click', closeMenu);
}
function closeMenu() {
  const menu = document.getElementById('mobileMenu');
  const burger = document.getElementById('burger');
  if (menu.classList.contains('is-open')) {
    menu.classList.remove('is-open');
    burger.classList.remove('is-open');
    lenis.start();
  }
}

/* ─── entrada direta no site (sem loader) ─── */
function initLoader() {
  heroIntro();
}

function heroIntro() {
  const tl = gsap.timeline();
  tl.fromTo('.hero__word', { yPercent: 115 }, { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: .12 })
    .to('.hero .reveal-up', { opacity: 1, y: 0, duration: .8, ease: 'power3.out', stagger: .12 }, '-=.6')
    .fromTo('.hero__scroll', { opacity: 0 }, { opacity: 1, duration: .6 }, '-=.3');
  return tl;
}

/* ─── reveals genéricos ─── */
function initReveals() {
  gsap.utils.toArray('.reveal-up').forEach(el => {
    if (el.closest('.hero')) return; // hero tem intro própria
    gsap.to(el, {
      opacity: 1, y: 0, duration: .95, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  gsap.utils.toArray('.split-lines').forEach(el => {
    const inners = el.querySelectorAll('.sl-inner');
    if (!inners.length) return;
    gsap.to(inners, {
      y: 0, duration: 1.05, ease: 'power4.out', stagger: .1,
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });
}

/* divide títulos em linhas animáveis (pelo <br>) */
function splitLines() {
  document.querySelectorAll('.split-lines').forEach(el => {
    const parts = el.innerHTML.split(/<br\s*\/?>/i);
    if (parts.length < 2) { el.classList.remove('split-lines'); el.classList.add('reveal-up'); return; }
    el.innerHTML = parts.map(p => `<span class="sl-line"><span class="sl-inner">${p}</span></span>`).join('');
  });
}

/* ─── contadores das stats — contam ao chegar no frame, toda vez ─── */
function initStats() {
  document.querySelectorAll('.stat__num[data-count]').forEach(el => {
    const target = +el.dataset.count;
    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: target, duration: 1.9, ease: 'power2.out', paused: true,
      onUpdate: () => { el.textContent = Math.round(obj.v); },
    });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      onEnter: () => tween.restart(),
      onEnterBack: () => tween.restart(),
      onLeaveBack: () => { tween.pause(0); el.textContent = '0'; },
    });
  });
}

/* ─── FRAME 2 · terminal que escala no scroll (wearemotto) ─── */
function initScaleSection() {
  const media = document.getElementById('scaleMedia');
  const heading = document.querySelector('.scale-heading');
  const phrase = document.getElementById('scalePhrase');
  const slot = document.getElementById('phraseSlot');
  const pin = document.querySelector('.scale-pin');

  const dock = { x: 0, y: 0, s: 0.12 };

  function measureDock() {
    // usa as medidas do PIN (e não innerWidth/innerHeight, que muda com a
    // barra de endereço do celular) — a mídia preenche o pin, então a
    // proporção certa do slot é a do próprio pin
    const pinR = pin.getBoundingClientRect();
    const slotH = parseFloat(getComputedStyle(slot).height) || 40;
    slot.style.width = (slotH * (pinR.width / Math.max(1, pinR.height))) + 'px';

    const slotR = slot.getBoundingClientRect();
    dock.s = slotR.height / Math.max(1, pinR.height);
    dock.x = (slotR.left + slotR.width / 2) - (pinR.left + pinR.width / 2);
    dock.y = (slotR.top + slotR.height / 2) - (pinR.top + pinR.height / 2);
  }
  measureDock();
  ScrollTrigger.addEventListener('refreshInit', measureDock);

  // começa um pouco abaixo do centro pra nunca encostar no título
  gsap.set(media, { scale: 0.32, y: '9vh', borderRadius: 24 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.scale-sec',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      invalidateOnRefresh: true,
    }
  });

  tl.to(heading, { opacity: 0, y: -40, duration: .09, ease: 'none' }, 0)
    .to(media, { scale: 1, y: 0, borderRadius: 0, duration: .38, ease: 'none' }, 0)
    .to({}, { duration: .14 }) // segura em tela cheia
    .add('dock')
    .to(media, {
      scale: () => dock.s,
      x: () => dock.x,
      y: () => dock.y,
      borderRadius: 14,
      duration: .34, ease: 'none'
    }, 'dock')
    .to(phrase, { opacity: 1, duration: .2, ease: 'none' }, 'dock+=.18')
    .to({}, { duration: .08 });
}

/* ─── SÍMBOLO @ + frases no escuro (djectstudio) ─── */
function initBallSection() {
  const ball = document.getElementById('theBall');
  const cover = document.getElementById('ballCover');
  const words = gsap.utils.toArray('.ball-word');
  const lineB = document.getElementById('ballLineB');
  const dot = document.getElementById('ballDot');
  const pin = document.querySelector('.ball-pin');

  // escala pro @ tomar a tela antes do escuro entrar
  const bigScale = () => (Math.max(innerWidth, innerHeight) / 120) * 2.2;

  // o @ termina pousando exatamente no ponto final da frase
  const dock = { x: 0, y: 0, s: .18 };
  function measureBallDock() {
    const pinR = pin.getBoundingClientRect();
    const dotR = dot.getBoundingClientRect();
    dock.s = Math.max(11, Math.min(dotR.width * 0.9, 30)) / 120; /* círculo do tamanho do ponto final */
    dock.x = (dotR.left + dotR.width / 2) - (pinR.left + pinR.width / 2);
    // o "." fica na base da linha de texto, não no meio da caixa
    dock.y = (dotR.top + dotR.height * 0.78) - (pinR.top + pinR.height / 2);
  }
  measureBallDock();
  ScrollTrigger.addEventListener('refreshInit', measureBallDock);

  gsap.set(ball, { xPercent: -50, yPercent: -50 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.ball-sec',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      invalidateOnRefresh: true,
    }
  });

  tl.fromTo(ball, { scale: .3, autoAlpha: 0, rotation: -12 }, { scale: 1, autoAlpha: 1, rotation: 0, duration: .1, ease: 'none' })
    .to('#ballLineA', { opacity: 0, scale: .92, duration: .08, ease: 'none' }, '<.04')
    // o círculo cresce até dominar a tela...
    .to(ball, { scale: bigScale, rotation: 10, duration: .22, ease: 'none' })
    // ...o símbolo some cedo pra não ficar desfocado no tamanho gigante
    .to(ball.querySelector('span'), { opacity: 0, duration: .04, ease: 'none' }, '<+.03')
    // ...e o escuro toma conta
    .to(cover, { opacity: 1, duration: .09, ease: 'none' }, '-=.1')
    // frases no escuro
    .fromTo(words[0], { opacity: 0, yPercent: 40 }, { opacity: 1, yPercent: 0, duration: .08, ease: 'none' })
    .to(words[0], { opacity: 0, yPercent: -40, duration: .08, ease: 'none' }, '+=.05')
    .fromTo(words[1], { opacity: 0, yPercent: 40 }, { opacity: 1, yPercent: 0, duration: .08, ease: 'none' })
    .to(words[1], { opacity: 0, yPercent: -40, duration: .08, ease: 'none' }, '+=.05')
    .fromTo(words[2], { opacity: 0, yPercent: 40 }, { opacity: 1, yPercent: 0, duration: .08, ease: 'none' })
    .to(words[2], { opacity: 0, yPercent: -40, duration: .08, ease: 'none' }, '+=.05')
    // o escuro sai, o @ encolhe e pousa como ponto final da frase
    .to(cover, { opacity: 0, duration: .1, ease: 'none' }, '+=.02')
    .fromTo(lineB, { opacity: 0 }, { opacity: 1, duration: .1, ease: 'none' }, '<')
    .to(ball, {
      scale: () => dock.s,
      x: () => dock.x,
      y: () => dock.y,
      rotation: 0,
      backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#6c4df6',
      duration: .18, ease: 'none'
    }, '<')
    .to(ball, { autoAlpha: 0, duration: .03, ease: 'none' })
    .to(dot, { opacity: 1, duration: .03, ease: 'none' }, '<')
    .to({}, { duration: .05 });
}

/* ─── TIMELINE horizontal + linha desenhada (danielsun) ─── */
function initTimeline() {
  const track = document.getElementById('tlTrack');
  const svg = document.getElementById('tlSvg');
  const pathEl = document.getElementById('tlPathEl');

  function buildPath() {
    const prevX = gsap.getProperty(track, 'x') || 0;
    gsap.set(track, { x: 0 });

    const trackR = track.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${trackR.width} ${trackR.height}`);
    svg.setAttribute('width', trackR.width);
    svg.setAttribute('height', trackR.height);

    const pts = [];
    track.querySelectorAll('.tl-badge').forEach(b => {
      const r = b.getBoundingClientRect();
      // a linha passa pelo centro das bolinhas (por trás), longe dos textos
      pts.push({ x: r.left - trackR.left + r.width / 2, y: r.top - trackR.top + r.height / 2 });
    });
    if (pts.length < 2) return;

    // linha "à mão" com onduladas entre os pontos
    let d = `M 0 ${pts[0].y}`;
    d += ` Q ${pts[0].x * 0.5} ${pts[0].y + 18}, ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      const mx = (a.x + b.x) / 2;
      const wob = (i % 2 === 0 ? 26 : -26);
      d += ` Q ${mx} ${((a.y + b.y) / 2) + wob}, ${b.x} ${b.y}`;
    }
    const last = pts[pts.length - 1];
    d += ` Q ${last.x + 90} ${last.y - 20}, ${last.x + 170} ${last.y - 6}`;
    pathEl.setAttribute('d', d);

    const len = pathEl.getTotalLength();
    pathEl.style.strokeDasharray = len;
    pathEl.dataset.len = len;

    gsap.set(track, { x: prevX });
  }

  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', () => {
    buildPath();
    const getDist = () => track.scrollWidth - innerWidth;

    const st = gsap.to(track, {
      x: () => -getDist(),
      ease: 'none',
      scrollTrigger: {
        trigger: '.timeline__viewport',
        start: 'top top',
        end: () => '+=' + getDist(),
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onRefreshInit: buildPath,
        onUpdate: (self) => {
          const len = +pathEl.dataset.len || 0;
          pathEl.style.strokeDashoffset = len * (1 - Math.min(1, self.progress * 1.15));
        }
      }
    });

    // estado inicial da linha
    pathEl.style.strokeDashoffset = pathEl.dataset.len || 0;

    return () => { st.scrollTrigger && st.scrollTrigger.kill(); st.kill(); };
  });

  mm.add('(max-width: 900px)', () => {
    // vertical: só revela os itens
    gsap.utils.toArray('.tl-item').forEach(item => {
      gsap.from(item, {
        opacity: 0, y: 40, duration: .8, ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 88%' }
      });
    });
  });
}

/* ─── MARQUEES de projetos (djectstudio) ─── */
function buildMarquees() {
  const make = (items) => items.map(it => `
    <div class="m-card" data-hover>
      <img src="${IMG_BASE}${it.img}" alt="${it.name}" loading="lazy"
           onerror="this.parentElement.classList.add('m-card--fallback'); this.replaceWith(Object.assign(document.createElement('span'),{textContent:'${it.name.replace(/'/g, '')}'}))" />
      <span class="m-card__name">${it.name}</span>
    </div>`).join('');

  const trackA = document.querySelector('#marqueeA .marquee__track');
  const trackB = document.querySelector('#marqueeB .marquee__track');
  trackA.innerHTML = make(MARQUEE_A) + make(MARQUEE_A);
  trackB.innerHTML = make(MARQUEE_B) + make(MARQUEE_B);

  runMarquee(trackA, -1); // esquerda
  runMarquee(trackB, 1);  // direita
}

function runMarquee(track, dir) {
  const marquee = track.parentElement;
  let x = 0;
  let dragging = false, lastPX = 0, dragVel = 0, inertia = 0;

  // arrastar com a mãozinha pra voltar/adiantar
  marquee.addEventListener('pointerdown', (e) => {
    dragging = true;
    lastPX = e.clientX;
    dragVel = 0;
    marquee.classList.add('is-drag');
    marquee.setPointerCapture(e.pointerId);
  });
  marquee.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastPX;
    lastPX = e.clientX;
    x += dx;
    dragVel = dx;
  });
  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    marquee.classList.remove('is-drag');
    inertia = dragVel * 1.4; // continua deslizando um pouco
  };
  marquee.addEventListener('pointerup', endDrag);
  marquee.addEventListener('pointercancel', endDrag);

  gsap.ticker.add(() => {
    const half = track.scrollWidth / 2;
    if (!half) return;
    if (!dragging) {
      const boost = Math.min(Math.abs(scrollVel) * 0.35, 14); // scroll acelera o marquee
      x += dir * (0.55 + boost) + inertia;
      inertia *= 0.94;
      if (Math.abs(inertia) < 0.05) inertia = 0;
    }
    // loop infinito (funciona nas duas direções)
    x = -((((-x) % half) + half) % half);
    track.style.transform = `translateX(${x}px)`;
  });
}

/* ─── grid de projetos (galeria clicável) ─── */
/* mostra só 2 linhas de cards por vez, o resto vai pra paginação por bolinhas */
let projPage = 0;

function buildProjects() {
  const grid = document.getElementById('projectsGrid');
  const dots = document.getElementById('projectsDots');

  // quantas colunas o grid está mostrando agora (segue o minmax(290px) do CSS)
  const colsPerRow = () => {
    const cs = getComputedStyle(grid);
    const gap = parseFloat(cs.columnGap) || 20;
    const inner = grid.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    return Math.max(1, Math.floor((inner + gap) / (290 + gap)));
  };
  const perPage = () => colsPerRow() * 2; // sempre 2 linhas

  const card = (p, i) => `
    <article class="g-card" data-idx="${i}" data-hover>
      <img src="${IMG_BASE}${p.images[0]}" alt="${p.name}" loading="lazy" draggable="false"
           onerror="this.parentElement.classList.add('g-card--fallback'); this.replaceWith(Object.assign(document.createElement('span'),{textContent:'${p.name.split('—')[0].replace(/'/g, '').trim()}'}))" />
      <div class="g-card__overlay">
        <h3>${p.name}</h3>
        <span class="g-card__photos"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> ${p.images.length} ${p.images.length > 1 ? t('ui.photos') : t('ui.photo')}</span>
      </div>
    </article>`;

  function render(animate) {
    const size = perPage();
    const pages = Math.max(1, Math.ceil(PROJECTS.length / size));
    projPage = Math.min(Math.max(projPage, 0), pages - 1);

    const start = projPage * size;
    grid.innerHTML = PROJECTS.slice(start, start + size)
      .map((p, k) => card(p, start + k)).join('');

    if (animate && window.gsap) {
      gsap.fromTo(grid.children,
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: .6, ease: 'power3.out', stagger: .06 });
    }

    dots.innerHTML = pages > 1
      ? Array.from({ length: pages }, (_, n) =>
          `<button class="projects__dot ${n === projPage ? 'is-active' : ''}" data-page="${n}" role="tab" aria-selected="${n === projPage}" aria-label="Página ${n + 1} de ${pages}"></button>`).join('')
      : '';
    dots.classList.toggle('is-hidden', pages <= 1);
  }

  render(false);

  grid.addEventListener('click', (e) => {
    const c = e.target.closest('.g-card');
    if (c) openModal(+c.dataset.idx);
  });

  dots.addEventListener('click', (e) => {
    const b = e.target.closest('.projects__dot');
    if (!b) return;
    projPage = +b.dataset.page;
    render(true);
  });

  // recalcula colunas/páginas quando a largura muda
  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => render(false), 200);
  });
}

/* ─── modal de fotos ─── */
let pmProject = null, pmIdx = 0;

function initModal() {
  const modal = document.getElementById('pmodal');
  modal.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeModal(); });
  document.getElementById('pmPrev').addEventListener('click', () => showPhoto(pmIdx - 1));
  document.getElementById('pmNext').addEventListener('click', () => showPhoto(pmIdx + 1));
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') showPhoto(pmIdx - 1);
    if (e.key === 'ArrowRight') showPhoto(pmIdx + 1);
  });
}

function openModal(idx) {
  pmProject = PROJECTS[idx];
  if (!pmProject) return;
  document.getElementById('pmName').textContent = pmProject.name;
  document.getElementById('pmDesc').textContent =
    (LANG === 'en' && pmProject.desc_en) || (LANG === 'es' && pmProject.desc_es) || pmProject.desc;
  document.getElementById('pmTags').innerHTML = pmProject.tags.map(t => `<span>${t}</span>`).join('');
  showPhoto(0);
  document.getElementById('pmodal').classList.add('is-open');
  lenis.stop();
}

function showPhoto(i) {
  const total = pmProject.images.length;
  pmIdx = Math.max(0, Math.min(i, total - 1));
  const img = document.getElementById('pmImg');
  img.src = IMG_BASE + pmProject.images[pmIdx];
  img.alt = `${pmProject.name} — foto ${pmIdx + 1}`;
  document.getElementById('pmCount').textContent = `${pmIdx + 1} / ${total}`;
  document.getElementById('pmPrev').toggleAttribute('disabled', pmIdx === 0);
  document.getElementById('pmNext').toggleAttribute('disabled', pmIdx === total - 1);
}

function closeModal() {
  document.getElementById('pmodal').classList.remove('is-open');
  lenis.start();
}

/* ─── certificações (tickets) ─── */
function buildCerts() {
  const grid = document.getElementById('certsGrid');
  // "cursando agora" (soon) sempre em primeiro; o resto mantém a ordem original
  const ordered = [...CERTS].sort((a, b) => (b.soon ? 1 : 0) - (a.soon ? 1 : 0));
  grid.innerHTML = ordered.map((c, i) => `
    <div class="cert-ticket ${c.soon ? 'cert-ticket--soon' : ''} reveal-up" data-hover>
      <div class="cert-ticket__band"><span>${c.year}</span></div>
      <div class="cert-ticket__body">
        <span class="cert-ticket__num">${t('ui.certNo')} ${String(i + 1).padStart(2, '0')}</span>
        <h3>${c.name}</h3>
        <p class="cert-ticket__inst">${c.inst}</p>
        ${c.link ? `<a class="cert-ticket__link" href="${c.link}" target="_blank" rel="noopener">${t('ui.viewCert')}</a>` : ''}
        ${c.soon ? `<span class="cert-ticket__badge">${t('ui.studying')}</span>` : ''}
      </div>
    </div>`).join('');

  // mantém o contador "certificações" (stat) sempre igual ao total real
  const certStat = document.querySelector('.stat__label[data-i18n="about.s3"]')
    ?.closest('.stat')?.querySelector('.stat__num');
  if (certStat) certStat.dataset.count = CERTS.length;
}

/* ─── skills flutuantes ─── */
function buildSkillsFloat() {
  const wrap = document.getElementById('skillsFloat');
  wrap.innerHTML = SKILL_ICONS.map((s, i) => {
    const dur = (4 + (i % 5) * 0.7).toFixed(1);
    const del = ((i * 0.37) % 2.2).toFixed(2);
    const icon = s.slug
      ? `<img src="img/icons/${s.slug}.svg" alt="${s.name}"
             onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'sk-bubble__fb',textContent:'${(s.fallback || s.name[0]).replace(/'/g, '')}'}))" />`
      : `<span class="sk-bubble__fb" style="--fbcolor:#${s.color}">${s.fallback}</span>`;
    return `
      <div class="sk-item" style="--dur:${dur}s; --del:-${del}s">
        <div class="sk-bubble" style="--sz:${s.sz}px" data-hover>
          ${icon}
          <span class="sk-bubble__label">${s.name}</span>
        </div>
      </div>`;
  }).join('');
}

/* ─── SERVIÇOS — títulos ficam, só a descrição sai (djectstudio) ─── */
function initServices() {
  const services = gsap.utils.toArray('.service');
  const mm = gsap.matchMedia();

  mm.add('(min-width: 1001px)', () => {
    const triggers = [];
    services.forEach((sv, i) => {
      const next = services[i + 1];
      if (!next) return; // o último mantém a descrição
      const parts = [sv.querySelector('.service__body p'), sv.querySelector('.service__tags')];
      const tw = gsap.to(parts, {
        opacity: 0, y: -26, ease: 'none',
        scrollTrigger: {
          trigger: next,             // some conforme o próximo card se aproxima
          start: 'top 85%',
          end: 'top 45%',
          scrub: true,
        }
      });
      triggers.push(tw);
    });
    return () => triggers.forEach(t => { t.scrollTrigger && t.scrollTrigger.kill(); t.kill(); });
  });

  mm.add('(max-width: 1000px)', () => {
    services.forEach(sv => {
      gsap.from(sv.querySelector('.service__body'), {
        opacity: 0, y: 36, duration: .8, ease: 'power3.out',
        scrollTrigger: { trigger: sv, start: 'top 85%' }
      });
    });
  });
}

/* ─── progresso do boneco de visão computacional ─── */
function initPoseTrigger() {
  FX.poseST = ScrollTrigger.create({
    trigger: '#experiencia',
    start: 'top 85%',
    end: 'bottom 15%',
  });
}
