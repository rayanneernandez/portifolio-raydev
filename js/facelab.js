/* ══════════════════════════════════════════════
   FACE LAB — análise facial em tempo real
   Visão computacional no navegador com MediaPipe Tasks
   (Face Landmarker + Hand Landmarker). Nada sai do dispositivo.
   ══════════════════════════════════════════════ */

/* helper de tradução (definido em i18n.js); se vier vazio, mantém o texto atual */
const T = (k) => {
  const v = typeof window.t === 'function' ? window.t(k) : '';
  return v || k;
};

/* ─── elementos ─── */
const el = (id) => document.getElementById(id);
const cam = el('flCam');
const video = el('flVideo');
const overlay = el('flOverlay');
const idle = el('flIdle');
const errBox = el('flError');
const errMsg = el('flErrorMsg');
const badgeTxt = el('flBadgeTxt');

if (cam && video && overlay) {
  el('flStart')?.addEventListener('click', start);
  el('flRetry')?.addEventListener('click', start);
  el('flStop')?.addEventListener('click', stop);
}

/* ─── estado ─── */
let faceLandmarker = null;
let handLandmarker = null;
let stream = null;
let running = false;
let rafId = null;
let ctx = overlay ? overlay.getContext('2d') : null;

const state = {
  startTs: 0,
  lastTs: -1,
  lastFrame: 0,
  fps: 0,
  eyesClosed: false,
  blinkCount: 0,
  smileTime: 0,
  lastEmotion: null,
  expChanges: 0,
  emotionsSeen: new Set(),
  lastGesture: 'none',
  gestTotal: 0,
  score: 0,
  // valores suavizados exibidos
  smoothSmile: 0, smoothSurprise: 0, smoothGaze: 0,
};

/* mostra apenas um overlay por vez (idle | error | none) */
function setOverlay(which) {
  idle.style.display = which === 'idle' ? 'flex' : 'none';
  errBox.style.display = which === 'error' ? 'flex' : 'none';
}

/* ─── iniciar ─── */
async function start() {
  cam.classList.remove('is-error');
  setOverlay('none'); // esconde idle enquanto tenta abrir a câmera
  try {
    // contexto seguro? (câmera não abre em file:// nem http)
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw { name: 'InsecureError' };
    }

    // 1) permissão de câmera (primeiro, com feedback rápido)
    badgeTxt.textContent = T('fl.loading');
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false,
    });
    video.srcObject = stream;
    await video.play();
    cam.classList.add('is-live'); // esconde o overlay assim que a câmera abre

    // 2) carrega o MediaPipe só agora (economiza banda até a pessoa querer)
    if (!faceLandmarker) {
      badgeTxt.textContent = T('fl.loading');
      await loadModels();
    }

    el('flStop').hidden = false;
    badgeTxt.textContent = T('fl.scanning');
    sizeCanvas();

    // reset dos contadores
    state.startTs = performance.now();
    state.lastFrame = state.startTs;
    Object.assign(state, {
      lastTs: -1, blinkCount: 0, smileTime: 0, lastEmotion: null,
      expChanges: 0, emotionsSeen: new Set(), lastGesture: 'none', gestTotal: 0,
    });

    running = true;
    loop();
  } catch (e) {
    console.warn('[facelab]', e);
    showError(e);
  }
}

async function loadModels() {
  const vision = await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14');
  const { FilesetResolver, FaceLandmarker, HandLandmarker } = vision;
  const fileset = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
  );

  faceLandmarker = await FaceLandmarker.createFromOptions(fileset, {
    baseOptions: {
      modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
      delegate: 'GPU',
    },
    runningMode: 'VIDEO',
    numFaces: 1,
    outputFaceBlendshapes: true,
  });

  handLandmarker = await HandLandmarker.createFromOptions(fileset, {
    baseOptions: {
      modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
      delegate: 'GPU',
    },
    runningMode: 'VIDEO',
    numHands: 2,
  });
}

function showError(e) {
  cam.classList.remove('is-live');
  setOverlay('error');
  const name = e && e.name;
  const insecure = name === 'InsecureError' || location.protocol === 'file:' || !window.isSecureContext;
  if (insecure) {
    errMsg.textContent = T('fl.errInsecure');
  } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
    errMsg.textContent = T('fl.errNoCam');
  } else {
    errMsg.textContent = T('fl.errText');
  }
}

function stop() {
  running = false;
  if (rafId) cancelAnimationFrame(rafId);
  if (stream) stream.getTracks().forEach((t) => t.stop());
  stream = null;
  cam.classList.remove('is-live');
  setOverlay('idle');
  el('flStop').hidden = true;
  if (ctx) ctx.clearRect(0, 0, overlay.width, overlay.height);
}

/* ─── canvas ─── */
let dpr = 1;
function sizeCanvas() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  overlay.width = cam.clientWidth * dpr;
  overlay.height = cam.clientHeight * dpr;
}
window.addEventListener('resize', () => { if (running) sizeCanvas(); });

/* mapeia coords normalizadas (0..1) do frame pro display com object-fit: cover */
function mapPoint(x, y) {
  const cw = overlay.width, ch = overlay.height;
  const vw = video.videoWidth || 16, vh = video.videoHeight || 9;
  const scale = Math.max(cw / vw, ch / vh);
  const dw = vw * scale, dh = vh * scale;
  const ox = (cw - dw) / 2, oy = (ch - dh) / 2;
  return [ox + x * dw, oy + y * dh];
}

/* ─── loop principal ─── */
function loop() {
  if (!running) return;
  const now = performance.now();
  let ts = now;
  if (ts <= state.lastTs) ts = state.lastTs + 1;
  state.lastTs = ts;

  let faceRes = null, handRes = null;
  if (video.readyState >= 2) {
    try { faceRes = faceLandmarker.detectForVideo(video, ts); } catch (e) {}
    try { handRes = handLandmarker.detectForVideo(video, ts + 0.5); } catch (e) {}
  }

  // fps
  const dt = (now - state.lastFrame) / 1000;
  state.lastFrame = now;
  if (dt > 0) state.fps = state.fps * 0.9 + (1 / dt) * 0.1;

  draw(faceRes, handRes);
  updateMetrics(faceRes, handRes, dt);

  rafId = requestAnimationFrame(loop);
}

/* ─── desenho dos landmarks ─── */
const HAND_BONES = [
  [0,1],[1,2],[2,3],[3,4], [0,5],[5,6],[6,7],[7,8],
  [5,9],[9,10],[10,11],[11,12], [9,13],[13,14],[14,15],[15,16],
  [13,17],[17,18],[18,19],[19,20], [0,17],
];

function draw(faceRes, handRes) {
  ctx.clearRect(0, 0, overlay.width, overlay.height);

  // malha do rosto — pontinhos discretos (efeito "scan")
  if (faceRes && faceRes.faceLandmarks && faceRes.faceLandmarks[0]) {
    const lm = faceRes.faceLandmarks[0];
    ctx.fillStyle = 'rgba(139, 112, 255, 0.55)';
    for (let i = 0; i < lm.length; i += 1) {
      const [px, py] = mapPoint(lm[i].x, lm[i].y);
      ctx.fillRect(px, py, 1.6 * dpr, 1.6 * dpr);
    }
    // contorno dos olhos e boca em destaque
    ctx.fillStyle = 'rgba(70, 227, 155, 0.9)';
    [33, 133, 362, 263, 61, 291, 13, 14].forEach((i) => {
      if (!lm[i]) return;
      const [px, py] = mapPoint(lm[i].x, lm[i].y);
      ctx.beginPath(); ctx.arc(px, py, 2.4 * dpr, 0, Math.PI * 2); ctx.fill();
    });
  }

  // mãos — ossos + juntas
  if (handRes && handRes.landmarks) {
    handRes.landmarks.forEach((hand) => {
      ctx.strokeStyle = 'rgba(139, 112, 255, 0.85)';
      ctx.lineWidth = 2 * dpr;
      HAND_BONES.forEach(([a, b]) => {
        const [ax, ay] = mapPoint(hand[a].x, hand[a].y);
        const [bx, by] = mapPoint(hand[b].x, hand[b].y);
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
      });
      ctx.fillStyle = '#fff';
      hand.forEach((p) => {
        const [px, py] = mapPoint(p.x, p.y);
        ctx.beginPath(); ctx.arc(px, py, 3 * dpr, 0, Math.PI * 2); ctx.fill();
      });
    });
  }
}

/* ─── métricas ─── */
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const pct = (v) => Math.round(clamp(v, 0, 1) * 100);

function bsMap(faceRes) {
  const map = {};
  const bs = faceRes && faceRes.faceBlendshapes && faceRes.faceBlendshapes[0];
  if (bs) bs.categories.forEach((c) => { map[c.categoryName] = c.score; });
  return map;
}

function updateMetrics(faceRes, handRes, dt) {
  const b = bsMap(faceRes);
  const hasFace = !!(faceRes && faceRes.faceLandmarks && faceRes.faceLandmarks[0]);

  // ── expressões ──
  const smile = ((b.mouthSmileLeft || 0) + (b.mouthSmileRight || 0)) / 2;
  const surprise = Math.max(b.jawOpen || 0, ((b.eyeWideLeft || 0) + (b.eyeWideRight || 0)) / 2, (b.browInnerUp || 0));
  const sad = ((b.mouthFrownLeft || 0) + (b.mouthFrownRight || 0)) / 2;
  const angry = ((b.browDownLeft || 0) + (b.browDownRight || 0)) / 2;

  state.smoothSmile = lerp(state.smoothSmile, smile, 0.3);
  state.smoothSurprise = lerp(state.smoothSurprise, surprise, 0.3);

  let emotion = 'neutral';
  if (hasFace) {
    if (smile > 0.4) emotion = 'happy';
    else if (surprise > 0.45) emotion = 'surprised';
    else if (sad > 0.25) emotion = 'sad';
    else if (angry > 0.4) emotion = 'angry';
  }
  const emoColor = { happy: '#46e39b', surprised: '#8b70ff', sad: '#5b9bff', angry: '#ff6b6b', neutral: '#9f9db4' }[emotion];
  setText('flEmotion', hasFace ? T('emotion.' + emotion) : '—');
  const dot = el('flEmoDot'); if (dot) dot.style.background = hasFace ? emoColor : '#9f9db4';
  setBar('flSmileBar', 'flSmileVal', state.smoothSmile);
  setBar('flSurpriseBar', 'flSurpriseVal', state.smoothSurprise);

  if (hasFace && emotion !== state.lastEmotion) {
    if (state.lastEmotion !== null) state.expChanges += 1;
    state.lastEmotion = emotion;
    state.emotionsSeen.add(emotion);
  }
  setText('flExpChanges', state.expChanges);
  if (hasFace && smile > 0.35) state.smileTime += dt;
  setText('flSmileTime', fmtTime(state.smileTime));

  // ── olhos ──
  const blink = ((b.eyeBlinkLeft || 0) + (b.eyeBlinkRight || 0)) / 2;
  if (hasFace) {
    if (blink > 0.5 && !state.eyesClosed) { state.eyesClosed = true; state.blinkCount += 1; }
    else if (blink < 0.3 && state.eyesClosed) { state.eyesClosed = false; }
  }
  const elapsedMin = Math.max(1 / 60, (performance.now() - state.startTs) / 60000);
  setText('flBpm', hasFace ? Math.round(state.blinkCount / elapsedMin) : 0);
  setText('flEyeState', hasFace ? (state.eyesClosed ? T('eye.closed') : T('eye.open')) : '—');

  // contato visual: quanto o olhar está centralizado (blendshapes de direção)
  const gazeDev = ((b.eyeLookOutLeft || 0) + (b.eyeLookInLeft || 0) + (b.eyeLookOutRight || 0) + (b.eyeLookInRight || 0)) / 4
    + ((b.eyeLookUpLeft || 0) + (b.eyeLookDownLeft || 0)) / 4;
  const gaze = hasFace ? clamp(1 - gazeDev * 1.6, 0, 1) : 0;
  state.smoothGaze = lerp(state.smoothGaze, gaze, 0.2);
  setText('flGaze', pct(state.smoothGaze) + '%');

  // ── gestos / mãos ──
  const hands = (handRes && handRes.landmarks) ? handRes.landmarks.length : 0;
  setText('flHands', hands);
  let fingersUp = 0, gesture = 'none';
  if (hands > 0) {
    const hd = handRes.handednesses && handRes.handednesses[0] && handRes.handednesses[0][0];
    const fingers = fingerStates(handRes.landmarks[0], hd ? hd.categoryName : 'Right');
    fingersUp = fingers.filter(Boolean).length;
    gesture = classifyGesture(fingers, fingersUp);
  }
  setText('flFingers', fingersUp);
  setText('flGesture', cleanName(T('gesture.' + gesture)));
  if (gesture !== 'none' && gesture !== state.lastGesture) state.gestTotal += 1;
  state.lastGesture = gesture;

  // ── estatísticas ──
  const elapsed = (performance.now() - state.startTs) / 1000;
  setText('flTime', fmtTime(elapsed));
  setText('flExpTotal', state.emotionsSeen.size);
  setText('flGestTotal', state.gestTotal);
  setText('flFps', Math.round(state.fps) + ' FPS');

  // score geral (engajamento)
  const target = clamp(
    0.4 * pct(state.smoothGaze) +
    0.2 * pct(state.smoothSmile) +
    0.2 * Math.min(100, state.expChanges * 10) +
    0.2 * Math.min(100, state.gestTotal * 25),
    0, 100
  );
  state.score = lerp(state.score, hasFace ? target : 0, 0.1);
  setText('flScore', Math.round(state.score));
  setRing('flScoreRing', state.score);
}

/* dedos levantados → [polegar, indicador, médio, anelar, mindinho] */
function fingerStates(lm, handedness) {
  const up = [];
  // polegar: comparação horizontal (depende da mão)
  const isRight = handedness === 'Right';
  up[0] = isRight ? lm[4].x < lm[3].x : lm[4].x > lm[3].x;
  // demais dedos: ponta acima da junta (y menor = mais alto)
  const tips = [8, 12, 16, 20], pips = [6, 10, 14, 18];
  for (let i = 0; i < 4; i++) up[i + 1] = lm[tips[i]].y < lm[pips[i]].y - 0.02;
  return up;
}

function classifyGesture(f, count) {
  const [thumb, index, middle, ring, pinky] = f;
  if (count === 0) return 'fist';
  if (count === 5) return 'open';
  if (index && !middle && !ring && !pinky && !thumb) return 'point';
  if (index && middle && !ring && !pinky) return 'peace';
  if (thumb && !index && !middle && !ring && !pinky) return 'thumb';
  if (index && pinky && !middle && !ring) return 'rock';
  return 'ok';
}

/* ─── utils DOM ─── */
function setText(id, v) { const n = el(id); if (n && n.textContent !== String(v)) n.textContent = v; }
function setBar(barId, valId, v) {
  const bar = el(barId); if (bar) bar.style.width = pct(v) + '%';
  setText(valId, pct(v) + '%');
}
function setRing(id, score) {
  const ring = el(id); if (!ring) return;
  const circ = 2 * Math.PI * 52;
  ring.style.strokeDashoffset = circ * (1 - score / 100);
}
function fmtTime(s) {
  s = Math.floor(s);
  if (s < 60) return s + 's';
  const m = Math.floor(s / 60);
  return m + 'm ' + (s % 60) + 's';
}
/* remove emoji do fim das strings de gesto (o emoji grande já é mostrado à parte) */
function cleanName(str) {
  return str.replace(/[\u{1F000}-\u{1FFFF}←-➿⬀-⯿️‍]/gu, '').trim();
}
