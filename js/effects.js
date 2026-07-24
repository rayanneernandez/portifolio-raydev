/* ══════════════════════════════════════════════
   EFEITOS DE CANVAS
   1. Partículas "areia" que formam </> e se desfazem com o cursor (dobre.agency)
   2. Terminal de código digitando (o "vídeo" do frame 2)
   3. Boneco esqueleto de visão computacional que anda com o scroll (mantis.works)
   ══════════════════════════════════════════════ */

const FX = {};

/* pausa o desenho quando o elemento sai da tela (economia de CPU/GPU) */
FX.watchVisible = function (el, onChange) {
  const io = new IntersectionObserver((entries) => {
    onChange(entries[0].isIntersecting);
  }, { rootMargin: '80px' });
  io.observe(el);
};

/* ─────────────────────────────────────────────
   1 · PARTÍCULAS DO HERO
   ───────────────────────────────────────────── */
FX.initParticles = function () {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, DPR;
  let particles = [];
  let glyphCount = 1;
  const mouse = { x: -9999, y: -9999, r: 95 };
  const pulses = []; // rajadas automáticas que "sopram" os símbolos
  const isTouch = matchMedia('(pointer: coarse)').matches;

  // símbolos de código espalhados pelo frame (x/y em fração da tela)
  function glyphLayout(small) {
    const main = { text: '</>', x: .5, y: .44, size: Math.min(W * (small ? .34 : .26), H * .5), gap: small ? 5 : 4, amp: 4 };
    if (small) {
      // no celular: símbolos maiores e nos cantos, longe do nome
      return [main,
        { text: '{ }', x: .17, y: .16, size: W * .18, gap: 3, amp: 9 },
        { text: ';', x: .85, y: .21, size: W * .2, gap: 3, amp: 10 },
        { text: '( )', x: .18, y: .8, size: W * .15, gap: 3, amp: 8 },
        { text: '=>', x: .8, y: .78, size: W * .16, gap: 3, amp: 11 },
      ];
    }
    return [main,
      { text: '{ }', x: .12, y: .2, size: W * .06, gap: 3, amp: 9 },
      { text: '=>', x: .88, y: .26, size: W * .055, gap: 3, amp: 11 },
      { text: ';', x: .09, y: .74, size: W * .075, gap: 3, amp: 10 },
      { text: '( )', x: .87, y: .78, size: W * .05, gap: 3, amp: 8 },
    ];
  }

  function sampleGlyph(g, gid, targets) {
    // desenha só a região do símbolo e amostra os pixels dela
    const pad = g.size;
    const bx = Math.max(0, Math.floor(g.x * W - pad * 1.6));
    const by = Math.max(0, Math.floor(g.y * H - pad));
    const bw = Math.min(W - bx, Math.ceil(pad * 3.2));
    const bh = Math.min(H - by, Math.ceil(pad * 2));
    if (bw <= 0 || bh <= 0) return;

    const off = document.createElement('canvas');
    off.width = bw; off.height = bh;
    const octx = off.getContext('2d');
    octx.font = `700 ${g.size}px 'Space Grotesk', sans-serif`;
    octx.textAlign = 'center';
    octx.textBaseline = 'middle';
    octx.fillStyle = '#000';
    octx.fillText(g.text, g.x * W - bx, g.y * H - by);

    const data = octx.getImageData(0, 0, bw, bh).data;
    for (let y = 0; y < bh; y += g.gap) {
      for (let x = 0; x < bw; x += g.gap) {
        if (data[(y * bw + x) * 4 + 3] > 128) {
          targets.push({ x: x + bx, y: y + by, gid, amp: g.amp });
        }
      }
    }
  }

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    const glyphs = glyphLayout(W < 700);
    glyphCount = glyphs.length;
    const targets = [];
    glyphs.forEach((g, gid) => sampleGlyph(g, gid, targets));

    const small = W < 700;
    particles = targets.map(t => ({
      x: Math.random() * W,
      y: Math.random() * H,
      hx: t.x,
      hy: t.y,
      gid: t.gid,
      amp: t.amp,
      vx: 0,
      vy: 0,
      size: small ? Math.random() * 1.6 + 1.2 : Math.random() * 1.4 + 0.8,
      tone: Math.random(),
    }));
  }

  let visible = true;
  FX.watchVisible(canvas, v => { visible = v; });

  // rajadas automáticas: de tempos em tempos um símbolo se desfarela sozinho
  setInterval(() => {
    if (!visible || glyphCount < 2) return;
    const glyphs = glyphLayout(W < 700);
    const g = glyphs[1 + Math.floor(Math.random() * (glyphs.length - 1))];
    pulses.push({
      x: g.x * W + (Math.random() - .5) * g.size,
      y: g.y * H + (Math.random() - .5) * g.size * .6,
      r: Math.max(70, g.size * 1.1),
      life: 1,
    });
  }, 2600);

  function tick(now) {
    if (!visible) { requestAnimationFrame(tick); return; }
    ctx.clearRect(0, 0, W, H);
    const mr = mouse.r;

    // decaimento das rajadas
    for (let i = pulses.length - 1; i >= 0; i--) {
      pulses[i].life -= 0.025;
      if (pulses[i].life <= 0) pulses.splice(i, 1);
    }

    // cada símbolo flutua sozinho, num ritmo próprio
    const drift = [];
    for (let g = 0; g < glyphCount; g++) {
      drift.push({
        x: Math.sin(now * 0.00035 + g * 1.9) * (g === 0 ? 3 : 1),
        y: Math.cos(now * 0.00028 + g * 1.3) * (g === 0 ? 2 : 1),
      });
    }

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // repulsão do cursor (efeito areia se desfazendo)
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < mr * mr && d2 > 0.01) {
        const d = Math.sqrt(d2);
        const force = (mr - d) / mr;
        p.vx += (dx / d) * force * 3.2;
        p.vy += (dy / d) * force * 3.2;
      }

      // repulsão das rajadas automáticas
      for (let k = 0; k < pulses.length; k++) {
        const pl = pulses[k];
        const px = p.x - pl.x;
        const py = p.y - pl.y;
        const pd2 = px * px + py * py;
        if (pd2 < pl.r * pl.r && pd2 > 0.01) {
          const pd = Math.sqrt(pd2);
          const f = ((pl.r - pd) / pl.r) * pl.life * 1.9;
          p.vx += (px / pd) * f;
          p.vy += (py / pd) * f;
        }
      }

      // mola de volta pra "casa" (remonta a forma) — a casa flutua junto com o símbolo
      const d = drift[p.gid] || drift[0];
      p.vx += (p.hx + d.x * (p.amp / 4) - p.x) * 0.02;
      p.vy += (p.hy + d.y * (p.amp / 4) - p.y) * 0.02;
      p.vx *= 0.88;
      p.vy *= 0.88;
      p.x += p.vx;
      p.y += p.vy;

      const moving = Math.abs(p.vx) + Math.abs(p.vy) > 1.6;
      ctx.fillStyle = moving
        ? accentCol
        : (p.tone > 0.86 ? accentSoftCol : baseCol);
      ctx.fillRect(p.x, p.y, p.size, p.size);
    }
    requestAnimationFrame(tick);
  }

  // cores acompanham o tema claro/noturno
  let baseCol, accentCol, accentSoftCol;
  function themeColors() {
    const dark = document.documentElement.dataset.theme === 'dark';
    baseCol = dark ? 'rgba(242, 241, 236, .55)' : 'rgba(17, 17, 16, .5)';
    accentCol = dark ? 'rgba(139, 112, 255, .9)' : 'rgba(108, 77, 246, .85)';
    accentSoftCol = dark ? 'rgba(139, 112, 255, .6)' : 'rgba(108, 77, 246, .55)';
  }
  themeColors();
  new MutationObserver(themeColors).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  window.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  window.addEventListener('touchmove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.touches[0].clientX - rect.left;
    mouse.y = e.touches[0].clientY - rect.top;
  }, { passive: true });
  window.addEventListener('touchend', () => { mouse.x = -9999; mouse.y = -9999; });

  // em touch, uma "rajada" automática de vez em quando pra dar vida
  if (isTouch) {
    setInterval(() => {
      mouse.x = W * (0.25 + Math.random() * 0.5);
      mouse.y = H * (0.3 + Math.random() * 0.35);
      setTimeout(() => { mouse.x = -9999; mouse.y = -9999; }, 500);
    }, 3800);
  }

  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 200); });

  // espera a fonte carregar pra desenhar o símbolo certo
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { resize(); requestAnimationFrame(tick); });
  } else {
    resize(); requestAnimationFrame(tick);
  }
};

/* ─────────────────────────────────────────────
   2 · TERMINAL DE CÓDIGO (o "vídeo")
   ───────────────────────────────────────────── */
FX.initCodeCanvas = function () {
  const canvas = document.getElementById('codeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const CODE = [
    [['kw', 'const '], ['var', 'dev'], ['pt', ' = {']],
    [['pt', '  '], ['key', 'nome'], ['pt', ': '], ['str', '"Rayanne Ernandez"'], ['pt', ',']],
    [['pt', '  '], ['key', 'stack'], ['pt', ': ['], ['str', '"React"'], ['pt', ', '], ['str', '"Node"'], ['pt', ', '], ['str', '"Python"'], ['pt', '],']],
    [['pt', '  '], ['key', 'foco'], ['pt', ': '], ['str', '"IA & Visão Computacional"'], ['pt', ',']],
    [['pt', '  '], ['key', 'cafe'], ['pt', ': '], ['num', 'Infinity'], ['pt', ',']],
    [['pt', '  '], ['key', 'aprendendo'], ['pt', ': '], ['num', 'true']],
    [['pt', '};']],
    [],
    [['cm', '// transformando ideias em produtos']],
    [['kw', 'while '], ['pt', '('], ['var', 'dev'], ['pt', '.'], ['key', 'viva'], ['pt', ') {']],
    [['pt', '  '], ['kw', 'await '], ['var', 'dev'], ['pt', '.'], ['fn', 'construir'], ['pt', '('], ['var', 'ideias'], ['pt', ');']],
    [['pt', '  '], ['var', 'dev'], ['pt', '.'], ['fn', 'aprender'], ['pt', '('], ['str', '"sempre"'], ['pt', ');']],
    [['pt', '}']],
  ];

  const COLORS = {
    kw: '#c792ea', var: '#82aaff', key: '#f0f0f5', str: '#c3e88d',
    num: '#f78c6c', pt: '#8a8a99', cm: '#5c5c6b', fn: '#ffcb6b',
  };

  let W, H, DPR, fontSize, lineH, padX, padY;
  let charCount = 0;   // total de chars digitados
  let lastStep = 0;
  const totalChars = CODE.reduce((s, l) => s + Math.max(1, l.reduce((a, t) => a + t[1].length, 0)), 0);

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth || 800;
    H = canvas.clientHeight || 500;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    fontSize = Math.max(13, Math.min(W / 42, 24));
    lineH = fontSize * 1.75;
    padX = fontSize * 1.6;
    padY = fontSize * 1.6;
  }

  let visible = true;
  FX.watchVisible(canvas, v => { visible = v; });

  function draw(now) {
    if (!visible) { requestAnimationFrame(draw); return; }
    // velocidade de digitação
    if (now - lastStep > 34) {
      charCount += 1;
      lastStep = now;
      if (charCount > totalChars + 55) charCount = 0; // pausa e reinicia
    }

    ctx.fillStyle = '#101013';
    ctx.fillRect(0, 0, W, H);

    // linhas de grade sutis
    ctx.strokeStyle = 'rgba(255,255,255,.025)';
    ctx.lineWidth = 1;
    for (let gy = 0; gy < H; gy += 34) {
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
    }

    ctx.font = `500 ${fontSize}px 'JetBrains Mono', monospace`;
    ctx.textBaseline = 'top';

    let remaining = charCount;
    let cursorX = padX, cursorY = padY;

    for (let li = 0; li < CODE.length; li++) {
      if (remaining <= 0) break;
      const line = CODE[li];
      let x = padX;
      const y = padY + li * lineH;

      // número da linha
      ctx.fillStyle = 'rgba(255,255,255,.14)';
      ctx.fillText(String(li + 1).padStart(2, ' '), padX - fontSize * 1.1, y);

      const lineLen = Math.max(1, line.reduce((a, t) => a + t[1].length, 0));
      let shown = Math.min(remaining, lineLen);
      remaining -= lineLen;

      for (const [type, text] of line) {
        if (shown <= 0) break;
        const part = text.slice(0, shown);
        shown -= part.length;
        ctx.fillStyle = COLORS[type] || '#fff';
        ctx.fillText(part, x + fontSize * 1.4, y);
        x += ctx.measureText(part).width;
      }
      cursorX = x + fontSize * 1.4;
      cursorY = y;
    }

    // cursor piscando
    if (Math.floor(now / 450) % 2 === 0) {
      ctx.fillStyle = '#6c4df6';
      ctx.fillRect(cursorX + 3, cursorY, fontSize * 0.55, fontSize * 1.15);
    }

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(draw);
};

/* ─────────────────────────────────────────────
   3 · BONECO DE VISÃO COMPUTACIONAL
   esqueleto com keypoints que anda conforme o scroll
   ───────────────────────────────────────────── */
FX.initPose = function () {
  const canvas = document.getElementById('poseCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, DPR;
  FX.poseST = null; // ScrollTrigger criado em main.js
  let smooth = 0;

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  // gera as juntas de um ciclo de caminhada procedural
  function pose(phase, cx, cy, s) {
    const bob = Math.sin(phase * 2) * s * 0.045;
    const hip = { x: cx, y: cy + bob };
    const neck = { x: cx + Math.sin(phase) * s * 0.02, y: hip.y - s * 0.62 };
    const head = { x: neck.x + Math.sin(phase) * s * 0.03, y: neck.y - s * 0.3 };

    function leg(off) {
      const a = Math.sin(phase + off) * 0.62;            // coxa
      const kneeBend = Math.max(0, -Math.sin(phase + off - 0.6)) * 0.9 + 0.15;
      const knee = { x: hip.x + Math.sin(a) * s * 0.42, y: hip.y + Math.cos(a) * s * 0.42 };
      const ca = a + kneeBend;
      const foot = { x: knee.x + Math.sin(ca) * s * 0.42, y: knee.y + Math.cos(ca) * s * 0.42 };
      return [knee, foot];
    }
    function arm(off) {
      const a = Math.sin(phase + off) * 0.55;
      const sh = { x: neck.x, y: neck.y + s * 0.06 };
      const elbow = { x: sh.x + Math.sin(a) * s * 0.32, y: sh.y + Math.cos(a) * s * 0.32 };
      const ea = a - 0.45;
      const hand = { x: elbow.x + Math.sin(ea) * s * 0.3, y: elbow.y + Math.cos(ea) * s * 0.3 };
      return [sh, elbow, hand];
    }

    const [kneeL, footL] = leg(0);
    const [kneeR, footR] = leg(Math.PI);
    const [shL, elbL, handL] = arm(Math.PI);
    const [shR, elbR, handR] = arm(0);

    return { head, neck, hip, kneeL, footL, kneeR, footR, shL, elbL, handL, shR, elbR, handR };
  }

  function dot(p, r, color) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
  function bone(a, b, color, w) {
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = w;
    ctx.stroke();
  }

  let visible = true;
  FX.watchVisible(canvas, v => { visible = v; });

  function draw(now) {
    if (!visible) { requestAnimationFrame(draw); return; }
    ctx.clearRect(0, 0, W, H);
    const target = FX.poseST ? FX.poseST.progress : 0;
    smooth += (target - smooth) * 0.06;

    // grade de fundo estilo "análise"
    ctx.strokeStyle = 'rgba(245,244,240,.045)';
    ctx.lineWidth = 1;
    const grid = 60;
    for (let x = 0; x < W; x += grid) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += grid) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    const small = W < 700;
    const s = small ? Math.min(H * 0.22, 190) : Math.min(H * 0.3, 290);
    const margin = s * 0.9;
    // em telas largas o boneco caminha no espaço livre à direita dos cards
    const startX = W > 1100 ? W * 0.66 : margin;
    const cx = startX + (W - margin - startX) * smooth;
    const cy = H * 0.62;
    const phase = smooth * Math.PI * 10; // passos ao longo do scroll
    const j = pose(phase, cx, cy, s);

    const lineCol = 'rgba(245,244,240,.85)';
    const accCol = '#8f75ff';

    // linha do "chão"
    ctx.strokeStyle = 'rgba(245,244,240,.12)';
    ctx.setLineDash([6, 10]);
    ctx.beginPath();
    ctx.moveTo(0, cy + s * 0.87);
    ctx.lineTo(W, cy + s * 0.87);
    ctx.stroke();
    ctx.setLineDash([]);

    // ossos
    bone(j.neck, j.hip, lineCol, 2.5);
    bone(j.neck, j.head, lineCol, 2.5);
    bone(j.hip, j.kneeL, lineCol, 2.5); bone(j.kneeL, j.footL, lineCol, 2.5);
    bone(j.hip, j.kneeR, lineCol, 2.5); bone(j.kneeR, j.footR, lineCol, 2.5);
    bone(j.shL, j.elbL, lineCol, 2.2); bone(j.elbL, j.handL, lineCol, 2.2);
    bone(j.shR, j.elbR, lineCol, 2.2); bone(j.elbR, j.handR, lineCol, 2.2);

    // cabeça (círculo)
    ctx.beginPath();
    ctx.arc(j.head.x, j.head.y, s * 0.13, 0, Math.PI * 2);
    ctx.strokeStyle = lineCol;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // keypoints
    const pts = [j.neck, j.hip, j.kneeL, j.footL, j.kneeR, j.footR, j.elbL, j.handL, j.elbR, j.handR];
    pts.forEach(p => dot(p, 4, accCol));
    dot(j.head, 4.5, accCol);

    // bounding box de detecção
    const bx = Math.min(j.handL.x, j.handR.x, j.footL.x, j.footR.x, j.head.x - s * 0.15) - 18;
    const by = j.head.y - s * 0.16 - 18;
    const bw = Math.max(j.handL.x, j.handR.x, j.footL.x, j.footR.x, j.head.x + s * 0.15) - bx + 18;
    const bh = (cy + s * 0.87) - by + 6;

    ctx.strokeStyle = 'rgba(143,117,255,.75)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(bx, by, bw, bh);
    ctx.setLineDash([]);

    // cantos da bounding box
    ctx.strokeStyle = accCol;
    ctx.lineWidth = 3;
    const c = 16;
    [[bx, by, 1, 1], [bx + bw, by, -1, 1], [bx, by + bh, 1, -1], [bx + bw, by + bh, -1, -1]].forEach(([x, y, dx, dy]) => {
      ctx.beginPath();
      ctx.moveTo(x + dx * c, y); ctx.lineTo(x, y); ctx.lineTo(x, y + dy * c);
      ctx.stroke();
    });

    // label de detecção (se não couber acima da caixa, desenha dentro dela)
    const conf = (0.973 + Math.sin(now / 900) * 0.012).toFixed(3);
    ctx.font = `500 12px 'JetBrains Mono', monospace`;
    const label = ` dev.detectada — conf: ${conf} `;
    const lw = ctx.measureText(label).width + 10;
    const boxH = 24; // um pouco mais alta pra caber a escrita toda dentro do roxo
    const ly = (by - boxH - 4 < 4) ? by + 4 : by - boxH - 2;
    ctx.fillStyle = accCol;
    ctx.fillRect(bx, ly, lw, boxH);
    ctx.fillStyle = '#0c0c0b';
    ctx.textBaseline = 'middle'; // centraliza verticalmente — evita cortar o topo da letra
    ctx.fillText(label, bx + 5, ly + boxH / 2 + 1);
    ctx.textBaseline = 'alphabetic';

    // mini crosshair seguindo a cabeça
    ctx.strokeStyle = 'rgba(245,244,240,.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(j.head.x - s * 0.3, j.head.y); ctx.lineTo(j.head.x + s * 0.3, j.head.y);
    ctx.moveTo(j.head.x, j.head.y - s * 0.3); ctx.lineTo(j.head.x, j.head.y + s * 0.3);
    ctx.stroke();

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(draw);
};
