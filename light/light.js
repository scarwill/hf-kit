// ===================== LIGHT  (Netlight ML neon-tech look, fixed kit for the `light` skill) =====================
// Build:  python3 ~/hf-kit/light/lbuild.py video.js audio.m4a      (lint + phrase check + build; cats premium.js + life.js + this + video.js, HEAD 2.6 / TAIL 3.6)
// Look:   navy-black bg + navy glow on top, NO grid, glowing windows/chips, mono labels. Titles = Space Grotesk, body = Inter, code/labels = JetBrains Mono.
// Colour = meaning (never decoration):  DATA green · MODEL blue · OUTPUT yellow · ERROR pink · ACCENT purple = ONLY the <b> word in a title.
// Host: the Model ORB, always in the same corner (cOrb: LONG bottom-right, SHORT top-right), eyes rest on the content (LONG up-left, SHORT down-left); it blinks every ~3 s and looks into the camera now and then (automatic, nlOrbLife). The caret types only in intro/outro and inside a scene's own window.
// RULE #1: SHOW, DON'T WRITE. Every scene has a moving visual (net, curve, matrix, dots, loop, code...). Text = 1-4 word labels. Voice says the sentences.
const NL = { bg: '#05070d', data: '#34e0b0', model: '#6cc8ff', out: '#ffcc4d', err: '#ff6b81', acc: '#b48cff', ink: '#eef2f6', dim: '#8e9aae', line: 'rgba(255,255,255,.09)' };
// SHORT (lbuild.py --short): 1080x1920 frame. Parts are laid out on an 810x1440 canvas (LW x LH) that #stage scales by 4/3, so every kit size
// reads 1/3 bigger on a phone (a 24 px label shows at 32 px). Keep parts inside the Shorts safe area (lcheck SAFE): the like/comment column on the
// right and the caption at the bottom cover the frame there.  LONG: LW x LH = 1920x1080, nothing changes.
const NLV = typeof VERT !== 'undefined' && VERT, LW = NLV ? 810 : 1920, LH = NLV ? 1440 : 1080;
const NLMONO = "'JetBrains Mono','DejaVu Sans Mono',monospace", NLHEAD = "'Space Grotesk',Inter,sans-serif", NLBODY = "Inter,'Space Grotesk',sans-serif";
const NLX = (c, sz = 26) => `<svg width="${sz}" height="${sz}" viewBox="0 0 26 26"><path d="M6 6L20 20M20 6L6 20" stroke="${c}" stroke-width="4" stroke-linecap="round"/></svg>`;
const NLOK = (c, sz = 26) => `<svg width="${sz}" height="${sz}" viewBox="0 0 26 26"><path d="M5 14L11 19L21 7" stroke="${c}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const NLUSR = (c, sz = 38) => `<svg width="${sz}" height="${sz}" viewBox="0 0 38 38"><circle cx="19" cy="14" r="7" stroke="${c}" stroke-width="3" fill="none"/><path d="M6 33c2-8 8-11 13-11s11 3 13 11" stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`;

// ---------- css + layers (call FIRST in build) ----------
function nlInit(s) {
  const css = document.createElement('style'); css.textContent = `
  #root{background:radial-gradient(1100px 650px at 50% -10%,#0f1a33 0%,transparent 65%),${NL.bg}!important;font-family:${NLBODY}}
  .orb{display:none!important} .grid-bg{display:none!important}
  .nsc{position:absolute;inset:0}
  .nttl{position:absolute;top:52px;left:0;right:0;text-align:center;font:700 60px ${NLHEAD};color:#fff;letter-spacing:-1px;white-space:nowrap}
  .nttl b{color:${NL.acc};font-weight:700;text-shadow:0 0 30px ${NL.acc}66}
  .nwin{position:absolute;background:#0a0f1a;border:2px solid var(--c);border-radius:18px;box-shadow:0 0 44px -10px var(--c),inset 0 0 30px -18px var(--c);overflow:hidden}
  .nhd{height:50px;display:flex;align-items:center;gap:10px;padding:0 20px;border-bottom:1px solid ${NL.line};font:500 24px ${NLMONO};color:${NL.dim};white-space:nowrap}
  .ndt{width:12px;height:12px;border-radius:50%;background:#262d3a}
  .nchp{position:absolute;display:flex;align-items:center;gap:14px;padding:12px 24px;border-radius:14px;border:2px solid var(--c);background:linear-gradient(180deg,color-mix(in srgb,var(--c) 24%,#05070d),color-mix(in srgb,var(--c) 7%,#05070d));color:#fff;font:700 32px ${NLMONO};box-shadow:0 0 30px -6px var(--c);white-space:nowrap}
  .nico{min-width:40px;height:40px;padding:0 6px;border-radius:10px;background:var(--c);color:#05070d;display:flex;align-items:center;justify-content:center;font:800 24px ${NLMONO}}
  .nlb{position:absolute;font:700 24px ${NLMONO};letter-spacing:3px;color:var(--c);text-transform:uppercase;white-space:nowrap}
  .ntx{font:500 32px/1.4 ${NLBODY};color:${NL.ink}}
  .nrow{position:relative;display:flex;align-items:center;gap:18px;font:500 28px ${NLMONO};color:#c9d2de;padding:12px 26px;white-space:nowrap;border-bottom:1px solid rgba(255,255,255,.06)}
  .ndoc{position:absolute;border-radius:8px;border:1.5px solid color-mix(in srgb,var(--c) 70%,#000);background:color-mix(in srgb,var(--c) 10%,#05070d)}
  .ndoc i{position:absolute;left:18%;right:18%;height:3px;border-radius:2px;background:color-mix(in srgb,var(--c) 55%,#000)}
  .nmk{position:absolute;width:58px;height:58px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid var(--c);background:color-mix(in srgb,var(--c) 18%,#05070d);box-shadow:0 0 24px -4px var(--c)}
  .nav{position:absolute;width:80px;height:80px;border-radius:50%;border:2px solid var(--c);background:#0a0f1a;display:flex;align-items:center;justify-content:center;box-shadow:0 0 22px -6px var(--c)}
  .nbig{position:absolute;left:0;right:0;text-align:center;font:800 120px ${NLMONO};color:var(--c);text-shadow:0 0 40px color-mix(in srgb,var(--c) 60%,transparent);white-space:nowrap}
  .nbox{position:absolute}
  .ncell{position:absolute;display:flex;align-items:center;justify-content:center;border-radius:8px;font:600 26px ${NLMONO};color:#fff}
  .nchar{display:inline-block;white-space:pre}
  .ncar{display:inline-block;margin-left:6px;border-radius:4px;background:${NL.data};box-shadow:0 0 18px ${NL.data}}
  .nhero{position:absolute;z-index:5}` + (NLV ? `
  #stage{width:810px!important;height:1440px!important;right:auto!important;bottom:auto!important;transform:scale(1.3333334);transform-origin:0 0}
  .nttl{top:110px;left:40px;right:180px;text-align:left;font-size:52px;line-height:1.08;white-space:normal}` : '');
  document.head.appendChild(css);
  nlInit.top = D(stage, '', 'position:absolute;inset:0;pointer-events:none;z-index:20', 'nlTop');   // hero objects live here, above every scene
  return s;
}
const D = (par, html, css2, id, cls = '') => { const e = document.createElement('div'); if (id) e.id = id; if (cls) e.className = cls; e.style.cssText = css2 || ''; e.innerHTML = html || ''; par.appendChild(e); return e; };
const NLWIRES = [];

// ---------- scene + basic parts ----------
const nlScene = (s, id, title) => { const e = D(s, '', '', id, 'nsc'); D(e, title, '', id + 'T', 'nttl'); return e; };           // title: 'Plain words <b>key word</b>'
const nlWin = (par, id, x, y, w, h, c, head) => D(par, `<div class="nhd"><span class="ndt" style="background:${c}"></span><span class="ndt"></span><span class="ndt"></span><span style="margin-left:10px">${head}</span></div>`, `left:${x}px;top:${y}px;width:${w}px;height:${h}px;--c:${c}`, id, 'nwin');
const nlChip = (par, id, x, y, txt, c, ico, fs) => D(par, (ico ? `<span class="nico">${ico}</span>` : '') + `<span>${txt}</span>`, `left:${x}px;top:${y}px;--c:${c}${fs ? ';font-size:' + fs + 'px' : ''}`, id, 'nchp');
const nlLab = (par, id, x, y, txt, c, center) => center ? D(par, `<span>${txt}</span>`, `left:${x}px;top:${y}px;width:0;display:flex;justify-content:center;--c:${c}`, id, 'nlb') : D(par, txt, `left:${x}px;top:${y}px;--c:${c}`, id, 'nlb');   // center=true: x is the label's centre
const nlMark = (par, id, x, y, c, ok) => D(par, ok ? NLOK(c) : NLX(c), `left:${x}px;top:${y}px;--c:${c}`, id, 'nmk');
const nlUser = (par, id, x, y, c) => D(par, NLUSR(c), `left:${x}px;top:${y}px;--c:${c}`, id, 'nav');
const nlBig = (par, id, y, txt, c, fs) => D(par, txt, `top:${y}px;--c:${c}${fs ? ';font-size:' + fs + 'px' : ''}`, id, 'nbig');
const nlText = (par, id, x, y, html, css = '') => D(par, html, `position:absolute;left:${x}px;top:${y}px;${css}`, id, 'ntx');
const nlRow = (par, id, left, right, rc) => D(par, `<span style="flex:1">${left}</span><span style="color:${rc || NL.data}">${right ?? ''}</span>`, '', id, 'nrow');
// glow frame around one row (lives inside the row, so it always lines up). POP('#'+id, t) to show it.
const nlRowHL = (row, id, c = NL.out) => D(row, '', `position:absolute;inset:2px 6px;border:3px solid ${c};border-radius:10px;box-shadow:0 0 20px ${c}`, id);
const nlSvg = par => { const v = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); v.style.cssText = `position:absolute;left:0;top:0;width:${LW}px;height:${LH}px;overflow:visible;pointer-events:none`; par.appendChild(v); return v; };
const nlWire = (v, id, d, c, dash, w = 3.5) => { const g = S('g', { id }, v); S('path', { d, stroke: c, 'stroke-width': w * 3, fill: 'none', opacity: .16, 'stroke-linecap': 'round' }, g); S('path', { class: 'draw', d, stroke: c, 'stroke-width': w, fill: 'none', 'stroke-linecap': 'round', 'stroke-dasharray': dash || null }, g); NLWIRES.push(g); return g; };
const nlDocs = (par, id, x, y, cols, rows, w, h, gap, c) => { const g = D(par, '', '', id); for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) D(g, '<i style="top:28%"></i><i style="top:48%"></i><i style="top:68%;right:40%"></i>', `left:${x + k * (w + gap)}px;top:${y + r * (h + gap)}px;width:${w}px;height:${h}px;--c:${c}`, null, 'ndoc ' + id + 'd'); return g; };
// a box holding its own svg (local coords 0..w, 0..h) -> [div, svg]
const nlBox = (par, id, x, y, w, h) => { const e = D(par, '', `left:${x}px;top:${y}px;width:${w}px;height:${h}px`, id, 'nbox'); const v = S('svg', { width: w, height: h, viewBox: `0 0 ${w} ${h}` }, e); v.style.overflow = 'visible'; return [e, v]; };

// ---------- HERO object: one card that lives across scenes (answer / dataset / model output). Move it, never rebuild it. ----------
// nlHero(id, x, y, w, html, c, head) builds it in the top layer;  HERO(id, t, x, y, s) glides it to (x,y) at scale s;  show with IN/POP, hide with OUT.
function nlHero(id, x, y, w, html, c = NL.out, head = 'answer') { const e = nlWin(nlInit.top, id, x, y, w, 0, c, head); e.style.height = 'auto'; e.classList.add('nhero'); D(e, html, 'padding:22px 28px 26px;font-size:38px', null, 'ntx'); e.dataset.x = x; e.dataset.y = y; return e; }
function HERO(id, t, x, y, s = 1, d = .9) { const e = document.getElementById(id); B(t); return tl.to(e, { x: x - +e.dataset.x, y: y - +e.dataset.y, scale: s, transformOrigin: '0% 0%', duration: d, ease: 'power3.inOut' }, t); }

// ---------- ORB: the model / host. nlOrb(par, id, cx, cy, r). Parts: id+'E' open eyes, id+'C' closed eyes, .{id}n nodes, id+'l' links, id+'g' glow ----------
function nlOrb(par, id, cx, cy, r = 120, c = NL.model) {
  const B4 = Math.round(r * 3.8), o = B4 / 2, [e, v] = nlBox(par, id, cx - o, cy - o, B4, B4); const defs = S('defs', {}, v);
  const f = S('filter', { id: id + 'gf', x: '-50%', y: '-50%', width: '200%', height: '200%' }, defs); S('feGaussianBlur', { stdDeviation: Math.max(3, r * .035), result: 'b' }, f); const m = S('feMerge', {}, f); S('feMergeNode', { in: 'b' }, m); S('feMergeNode', { in: 'SourceGraphic' }, m);
  const rg = S('radialGradient', { id: id + 'rg' }, defs); S('stop', { offset: 0, 'stop-color': c, 'stop-opacity': .5 }, rg); S('stop', { offset: 1, 'stop-color': c, 'stop-opacity': 0 }, rg);
  const P = []; for (let k = 0; k < 46; k++) { const a = k * 2.39996, d = Math.sqrt((k + .5) / 46) * r; P.push([o + Math.cos(a) * d, o + Math.sin(a) * d * .9]); }
  S('circle', { id: id + 'g', cx: o, cy: o, r: r * 1.9, fill: `url(#${id}rg)` }, v);
  const L = S('g', { id: id + 'l' }, v); P.forEach((p, i) => P.slice(i + 1).forEach(q => { if (Math.hypot(p[0] - q[0], p[1] - q[1]) < r * .42) S('path', { d: `M${p[0].toFixed(1)} ${p[1].toFixed(1)} L${q[0].toFixed(1)} ${q[1].toFixed(1)}`, stroke: c, 'stroke-width': Math.max(1, r * .012), opacity: .45 }, L); }));
  const N = S('g', { id: id + 'N' }, v); P.forEach(p => S('circle', { class: id + 'n', cx: p[0].toFixed(1), cy: p[1].toFixed(1), r: Math.max(2, r * .045), fill: c }, N));
  const E = S('g', { id: id + 'E' }, v); [-1, 1].forEach(sd => S('rect', { x: o + sd * r * .3 - r * .075, y: o - r * .2, width: r * .15, height: r * .3, rx: r * .075, fill: '#fff', filter: `url(#${id}gf)` }, E));
  const C = S('g', { id: id + 'C', opacity: 0 }, v); [-1, 1].forEach(sd => S('path', { d: `M${o + sd * r * .3 - r * .09} ${o - r * .02} Q${o + sd * r * .3} ${o + r * .06} ${o + sd * r * .3 + r * .09} ${o - r * .02}`, stroke: '#fff', 'stroke-width': Math.max(2, r * .04), fill: 'none', 'stroke-linecap': 'round' }, C));
  return e;
}
// orb beats (all add a beat): assemble with eyes opening / blink / think (nodes ripple) / bounce / surprised / sleep / ORB_CAM (look into the camera).  No ORB_LOOK: the eyes rest on the content (NLEYE).
// eyes at rest look toward the content: LONG orb bottom-right -> up-left, SHORT orb top-right -> down-left (scaled to the smaller Short orb)
const NLEYE = NLV ? { x: -9, y: 6 } : { x: -12, y: -7 };
function ORB_ON(id, t) { if (id === NLHOOKORB) return t; B(t); tl.set('#' + id, { autoAlpha: 1 }, t); tl.set('#' + id + 'E', { autoAlpha: 0 }, t); tl.fromTo('.' + id + 'n', { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: .25, stagger: .006 }, t); tl.fromTo(['#' + id + 'l', '#' + id + 'g'], { opacity: 0 }, { opacity: 1, duration: .4 }, t + .3); tl.set('#' + id + 'E', { autoAlpha: 1 }, t + .7); tl.fromTo('#' + id + 'E', { scaleY: .1, transformOrigin: '50% 50%' }, { scaleY: 1, duration: .15 }, t + .7); return t + .85; }
// ORB_CAM(id, t, d): eyes turn to the camera (centre) for d seconds with a blink in the middle, then back to their rest on the content
function ORB_CAM(id, t, d = 1.6) { B(t); TO('#' + id + 'E', t, { x: 0, y: 0, duration: .25, ease: 'power2.out' }); ORB_BLINK(id, t + d * .45); return TO('#' + id + 'E', t + d, { ...NLEYE, duration: .3, ease: 'power2.inOut' }); }
function ORB_BLINK(id, t) { B(t); return tl.to('#' + id + 'E', { scaleY: .1, transformOrigin: '50% 50%', duration: .07, yoyo: true, repeat: 1 }, t); }
function ORB_THINK(id, t, d = 1.2) { B(t); return tl.to('.' + id + 'n', { scale: 1.7, transformOrigin: '50% 50%', duration: .18, yoyo: true, repeat: 1, stagger: d / 46 }, t); }
function ORB_BOUNCE(id, t, n = 2) { B(t); return tl.to('#' + id, { y: -16, duration: .22, yoyo: true, repeat: n * 2 - 1, ease: 'sine.inOut' }, t); }
function ORB_WOW(id, t) { B(t); tl.to('#' + id + 'E', { scaleY: 1.35, scaleX: 1.2, transformOrigin: '50% 50%', duration: .15 }, t); tl.to('#' + id + 'E', { scaleY: 1, scaleX: 1, duration: .3 }, t + .9); return PULSE('#' + id, t, { s: 1.08 }); }
function ORB_SLEEP(id, t) { B(t); tl.set('#' + id + 'E', { autoAlpha: 0 }, t); tl.set('#' + id + 'C', { autoAlpha: 1 }, t); return tl.to('#' + id + 'N', { opacity: .45, duration: .6 }, t); }

// ---------- CARET: typed mono text with the green block cursor. nlType(par,id,x,y,txt,fs,col) ; TYPE(id,t,dt) types it (returns end time) ; CARET(id,t,n) blinks n times ----------
function nlType(par, id, x, y, txt, fs = 34, col = NL.ink) { const n = [...txt].length, cw = fs * .6;   // mono: every char is .6 em wide, so the caret can sit right after the last typed char
  const e = D(par, [...txt].map(ch => `<span class="nchar ${id}c">${ch}</span>`).join('') + `<span id="${id}k" class="ncar" style="position:absolute;left:${n * cw + 6}px;top:${fs * .05}px;width:${fs * .5}px;height:${fs * 1.05}px"></span>`, `position:absolute;left:${x}px;top:${y}px;font:700 ${fs}px ${NLMONO};line-height:${fs * 1.15}px;height:${fs * 1.15}px;color:${col};white-space:nowrap`, id, 'ncode'); e.dataset.cw = cw; return e; }
function TYPE(id, t, dt = .055) { B(t); const e = document.getElementById(id), cw = +e.dataset.cw, cs = e.querySelectorAll('.' + id + 'c'), n = cs.length; tl.set(e, { autoAlpha: 1 }, t); tl.set('#' + id + 'k', { x: -n * cw }, 0);
  cs.forEach((c, i) => { tl.set(c, { autoAlpha: 0 }, 0); tl.set(c, { autoAlpha: 1 }, t + i * dt); tl.set('#' + id + 'k', { x: -(n - i - 1) * cw }, t + i * dt); }); return t + n * dt; }
function CARET(id, t, n = 2) { for (let i = 0; i < n; i++) { tl.set('#' + id + 'k', { autoAlpha: 0 }, t + i * .5); tl.set('#' + id + 'k', { autoAlpha: 1 }, t + i * .5 + .25); } B(t); return t + n * .5; }

// ---------- scene flow ----------
// nlStart(['#s1','#s2',...]) FIRST in beats: hides all scenes but #s1, every top-level part of every scene, and every wire. (Children of a window show with it.)
// nlNext('#s2', 'first words of scene 2') switches scene (+ slow camera drift) and returns its start time.  nlDraw(id, t) shows + draws a wire.
let NLCUR = null; const NLSC = [];
function nlStart(scs) { NLSC.push(...scs); NLCUR = scs[0]; tl.set(scs.slice(1), { autoAlpha: 0 }, 0);
  scs.forEach(sc => document.querySelectorAll(sc + ' > [id]:not(.nttl)').forEach(e => tl.set(e, { autoAlpha: 0 }, 0)));
  NLWIRES.forEach(g => tl.set(g, { autoAlpha: 0 }, 0)); document.querySelectorAll('#nlTop > [id]').forEach(e => tl.set(e, { autoAlpha: 0 }, 0)); tl.set(scs[0] + 'T', { autoAlpha: 0 }, 0);
  if (NLV) tl.set(scs[0] + 'T', { autoAlpha: 1 }, 0); else IN(scs[0] + 'T', HEAD - .3, { y: -20, d: .5 }); nlDrift(scs[0], NLV ? 0 : HEAD - .3); }
// SHORT: HOOK(['#id', ...]) right after nlBegin = the hook visual is fully on screen at frame 0 (no fade-in, its wires already drawn,
// the scene's corner orb already awake). In the Shorts feed the first second decides the swipe; Studio showed a black 0:00 frame
// on our Shorts (Oct 2026, light/analytics.md). lbuild --short needs it; lcheck HOOK0 checks frame 0.
// Never IN / POP / FADE / DRAW / ORB_ON a hooked part later (that hides it again at frame 0): animate it with PULSE / TO.
const NLHOOK = []; let NLHOOKORB = null;
function HOOK(sels) { [].concat(sels).forEach(sel => { NLHOOK.push(sel); tl.set(sel, { autoAlpha: 1 }, 0);
    document.querySelectorAll(sel + ' .draw, ' + sel + '.draw').forEach(pth => tl.set(pth, { strokeDashoffset: 0 }, 0)); });
  const o = ORBS.find(([, sc]) => '#' + sc === NLCUR); if (o) { NLHOOKORB = o[0]; tl.set('#' + o[0], { autoAlpha: 1 }, 0); tl.set(['#' + o[0] + 'l', '#' + o[0] + 'g'], { opacity: 1 }, 0); tl.set('#' + o[0] + 'E', { autoAlpha: 1 }, 0); }
  B(0); return 0; }
function nlDrift(sel, t, d = 9) { tl.fromTo(sel, { scale: 1, transformOrigin: '50% 45%' }, { scale: 1.03, duration: d, ease: 'none' }, t); }
function nlNext(sel, phrase) { const t = go(phrase); OUT(NLCUR, t - .3, { d: .3 }); tl.set(sel, { autoAlpha: 1 }, t); IN(sel + 'T', t, { y: -20, d: .5 }); nlDrift(sel, t); NLCUR = sel; return t; }
const nlDraw = (id, t, d = .6) => { tl.set('#' + id, { autoAlpha: 1 }, t); return DRAW('#' + id + ' .draw', t, { d }); };
const nlShow = (sels, t) => tl.set(sels, { autoAlpha: 1 }, t);

// =====================================================================================================
// ML / DS VISUALS. Each one is a top-level part (hidden by nlStart). Show it with IN/POP/FADE, then run its beat.
// =====================================================================================================

// ---- training loop: Data -> Model -> Loss -> Update around a ring, a light dot orbits, epoch counter in the middle.  LOOP_RUN(id, t, laps, lap=1.4)
function nlLoop(par, id, cx, cy, R = 185, epochs = ['epoch 1', 'epoch 12', 'epoch 30', 'epoch 50']) {
  const g = D(par, '', 'position:absolute;inset:0', id), v = nlSvg(g), lp = a => [cx + Math.cos(a) * R, cy + Math.sin(a) * R];
  S('circle', { cx, cy, r: R, fill: 'none', stroke: NL.model, 'stroke-width': 12, opacity: .12 }, v); S('circle', { cx, cy, r: R, fill: 'none', stroke: NL.model, 'stroke-width': 3, 'stroke-dasharray': '10 12' }, v);
  [-1, 1, 3, -3].forEach(q => { const a = q * Math.PI / 4, [x, y] = lp(a); S('path', { d: 'M-10 -9 L10 0 L-10 9 Z', fill: NL.model, transform: `translate(${x} ${y}) rotate(${a * 180 / Math.PI + 90})` }, v); });
  D(g, '', `position:absolute;left:${cx - 11}px;top:${cy - R - 11}px;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 0 18px ${NL.model},0 0 6px #fff`, id + 'dot');
  [['Data', NL.data, '▤', Math.PI], ['Model', NL.model, 'M', -Math.PI / 2], ['Loss', NL.err, 'L', 0], ['Update', NL.out, '∇', Math.PI / 2]].forEach(([t, c, i, a], k) => { const [x, y] = lp(a); const e = nlChip(g, id + 'n' + k, x - 90, y - 30, t, c, i, 28); e.style.width = '180px'; e.style.justifyContent = 'center'; e.style.padding = '8px 12px'; });
  const ep = D(g, '', `position:absolute;left:${cx - 110}px;top:${cy - 18}px;width:220px;text-align:center`, id + 'ep'); epochs.forEach((t, k) => D(ep, t, `position:absolute;left:0;right:0;font:700 26px ${NLMONO};color:${NL.model}`, id + 'ev' + k, id + 'ev'));
  g.dataset.r = R; return g;
}
function LOOP_RUN(id, t, laps = 3, lap = 1.4) { B(t); const R = +document.getElementById(id).dataset.r, n = laps * 8, dt = lap / 8, ev = document.querySelectorAll('.' + id + 'ev');
  ev.forEach(e => tl.set(e, { autoAlpha: 0 }, 0)); for (let k = 1; k <= n; k++) { const a = -Math.PI / 2 + k * Math.PI / 4; tl.to('#' + id + 'dot', { x: Math.cos(a) * R, y: Math.sin(a) * R + R, duration: dt, ease: 'none' }, t + (k - 1) * dt); }
  const per = laps * lap / ev.length; ev.forEach((e, k) => { tl.set(e, { autoAlpha: 1 }, t + k * per); if (k < ev.length - 1) tl.set(e, { autoAlpha: 0 }, t + (k + 1) * per); });
  for (let k = 0; k < laps; k++) PULSE('#' + id + 'n2', t + k * lap + lap * .25, { s: 1.08 }); return t + laps * lap; }

// ---- neural network: layers of nodes + edges.  NET_FWD(id, t, d=1.6) = signal flows left->right (edges draw, nodes light up layer by layer)
function nlNet(par, id, x, y, w, h, layers = [3, 5, 5, 2], cIn = NL.data, cOut = NL.out) {
  const [e, v] = nlBox(par, id, x, y, w, h), L = layers.length, pos = layers.map((n, l) => Array.from({ length: n }, (_, k) => [40 + l * (w - 80) / (L - 1), h / 2 + (k - (n - 1) / 2) * Math.min(110, (h - 60) / Math.max(...layers))]));
  const col = l => l === 0 ? cIn : l === L - 1 ? cOut : NL.model;
  for (let l = 0; l < L - 1; l++) { const g = S('g', { id: id + 'e' + l }, v); pos[l].forEach(p => pos[l + 1].forEach(q => S('path', { class: 'draw', d: `M${p[0]} ${p[1]} L${q[0]} ${q[1]}`, stroke: NL.model, 'stroke-width': 2, opacity: .45 }, g))); }
  pos.forEach((ps, l) => { const g = S('g', { id: id + 'l' + l }, v); ps.forEach(p => { S('circle', { cx: p[0], cy: p[1], r: 30, fill: col(l), opacity: .12 }, g); S('circle', { cx: p[0], cy: p[1], r: 17, fill: '#0a0f1a', stroke: col(l), 'stroke-width': 3 }, g); S('circle', { class: id + 'h' + l, cx: p[0], cy: p[1], r: 11, fill: col(l), opacity: 0 }, g); }); });
  e.dataset.L = L; return e;
}
function NET_FWD(id, t, d = 1.6) { B(t); const L = +document.getElementById(id).dataset.L, st = d / L;
  for (let l = 0; l < L; l++) { tl.fromTo('.' + id + 'h' + l, { opacity: 0 }, { opacity: 1, duration: .2, stagger: .04 }, t + l * st); if (l < L - 1) DRAW('#' + id + 'e' + l + ' path', t + l * st + .1, { d: st }); } return t + d; }

// ---- plot window with axes + a curve (loss going down by default). pts = [[x0..1, y0..1], ...] (y up). CURVE(id, t, d) draws it, a dot rides the end.
function nlCurve(par, id, x, y, w, h, o = {}) {
  const c = o.c || NL.err, e = nlWin(par, id, x, y, w, h, c, o.head || 'loss.png'), pw = w - 140, ph = h - 160, ox = 90, oy = h - 70;
  const v = S('svg', { width: w, height: h }, e); v.style.cssText = 'position:absolute;left:0;top:0;overflow:visible';
  S('path', { d: `M${ox} ${oy - ph} L${ox} ${oy} L${ox + pw} ${oy}`, stroke: '#3a4458', 'stroke-width': 2.5, fill: 'none' }, v);
  for (let k = 1; k < 4; k++) S('path', { d: `M${ox} ${oy - ph * k / 4} L${ox + pw} ${oy - ph * k / 4}`, stroke: '#1c2333', 'stroke-width': 1.5 }, v);
  const pts = o.pts || Array.from({ length: 30 }, (_, k) => { const u = k / 29; return [u, .08 + .85 * Math.exp(-u * 4.2) + .03 * Math.sin(k * 1.7)]; });
  const P = pts.map(([a, b]) => [ox + a * pw, oy - b * ph]); const dd = 'M' + P.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L');
  S('path', { d: dd, stroke: c, 'stroke-width': 12, fill: 'none', opacity: .15, 'stroke-linecap': 'round', id: id + 'pg' }, v); S('path', { id: id + 'p', class: 'draw', d: dd, stroke: c, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, v);
  S('circle', { id: id + 'd', cx: P[0][0], cy: P[0][1], r: 10, fill: '#fff', opacity: 0 }, v);
  if (o.xl) D(e, o.xl, `position:absolute;right:40px;top:${h - 52}px;font:600 24px ${NLMONO};color:${NL.dim}`); if (o.yl) D(e, o.yl, `position:absolute;left:24px;top:62px;font:600 24px ${NLMONO};color:${NL.dim}`);
  e.__P = P; return e;
}
function CURVE(id, t, d = 1.6) { B(t); const P = document.getElementById(id).__P; tl.fromTo('#' + id + 'pg', { opacity: 0 }, { opacity: .15, duration: .3 }, t); DRAW('#' + id + 'p', t, { d, e: 'none' }); tl.set('#' + id + 'd', { opacity: 1 }, t);
  const n = Math.min(P.length - 1, 12); for (let k = 1; k <= n; k++) { const p = P[Math.round(k * (P.length - 1) / n)]; tl.to('#' + id + 'd', { attr: { cx: p[0], cy: p[1] }, duration: d / n, ease: 'none' }, t + (k - 1) * d / n); } return t + d; }

// ---- gradient descent: loss bowl + ball stepping down.  GD(id, t, steps=6, dt=.45)
function nlBowl(par, id, x, y, w, h, c = NL.err) {
  const [e, v] = nlBox(par, id, x, y, w, h);
  const yb = u => 40 + (h - 90) * (1 - Math.pow(2 * u - 1, 2)); const dd = 'M' + Array.from({ length: 41 }, (_, k) => `${(k / 40 * w).toFixed(1)} ${yb(k / 40).toFixed(1)}`).join(' L');
  S('path', { d: dd, stroke: c, 'stroke-width': 14, fill: 'none', opacity: .14 }, v); S('path', { d: dd, stroke: c, 'stroke-width': 4, fill: 'none' }, v);
  S('circle', { cx: w / 2, cy: yb(.5) + 4, r: 8, fill: NL.data }, v);
  const us = [.04, .17, .28, .37, .44, .48, .5]; e.__B = us.map(u => [u * w, yb(u) - 22]);
  S('circle', { id: id + 'b', cx: e.__B[0][0], cy: e.__B[0][1], r: 20, fill: NL.out, filter: null }, v); S('circle', { id: id + 'bg', cx: e.__B[0][0], cy: e.__B[0][1], r: 34, fill: NL.out, opacity: .2 }, v); return e;
}
function GD(id, t, steps = 6, dt = .45) { B(t); const P = document.getElementById(id).__B; for (let k = 1; k <= Math.min(steps, P.length - 1); k++) tl.to(['#' + id + 'b', '#' + id + 'bg'], { attr: { cx: P[k][0], cy: P[k][1] }, duration: dt * .8, ease: 'power2.inOut' }, t + (k - 1) * dt); return t + steps * dt; }

// ---- embedding space: window with grey background points. Returns el; el.pt(pid, fx, fy, c, label) adds a point (fx,fy = 0..1 inside the plot), el.link(wid, p1, p2, c) a curved wire.
function nlEmbed(par, id, x, y, w, h, head = 'embedding_space (2-D)', n = 70) {
  const e = nlWin(par, id, x, y, w, h, NL.model, head), v = S('svg', { width: w, height: h }, e); v.style.cssText = 'position:absolute;left:0;top:0;overflow:visible';
  const X = fx => 60 + fx * (w - 120), Y = fy => 90 + fy * (h - 150), bg = S('g', { id: id + 'bg' }, v);
  for (let k = 0; k < n; k++) S('circle', { cx: X(rnd(k * 3 + 1)), cy: Y(rnd(k * 7 + 2)), r: 5, fill: '#5d6678', opacity: .55 }, bg);
  const P = {}; e.pt = (pid, fx, fy, c, label, dx = 20, dy = -16) => { P[pid] = [X(fx), Y(fy)]; const g = S('g', { id: pid }, v); S('circle', { cx: X(fx), cy: Y(fy), r: 24, fill: c, opacity: .18 }, g); S('circle', { cx: X(fx), cy: Y(fy), r: 10, fill: c }, g);
    if (label) D(e, label, `position:absolute;left:${X(fx) + dx}px;top:${Y(fy) + dy - 16}px;font:600 26px ${NLMONO};color:${c};white-space:nowrap;text-shadow:0 0 12px #000`, pid + 'L'); return g; };
  e.link = (wid, a, b, c = NL.model, bend = -60) => { const [x1, y1] = P[a], [x2, y2] = P[b]; return nlWire(v, wid, `M${x1} ${y1} Q ${(x1 + x2) / 2} ${(y1 + y2) / 2 + bend} ${x2} ${y2}`, c); };
  e.ring = (rid, fx, fy, rx, ry, c = NL.data) => { const g = S('g', { id: rid }, v); S('ellipse', { cx: X(fx), cy: Y(fy), rx, ry, fill: 'none', stroke: c, 'stroke-width': 3, 'stroke-dasharray': '10 10' }, g); return g; };
  return e;
}

// ---- attention heatmap: tokens x tokens, cell alpha = weight. ATTN(id, t) fades cells in; ATTN_ROW(id, t, r) spotlights one query row.
function nlAttn(par, id, x, y, toks, M, cs = 86, c = NL.model) {
  const n = toks.length, e = D(par, '', `left:${x}px;top:${y}px;width:${150 + n * cs}px;height:${70 + n * cs}px`, id, 'nbox');
  toks.forEach((tk, k) => { D(e, tk, `position:absolute;left:${150 + k * cs}px;top:0;width:${cs}px;text-align:center;font:600 24px ${NLMONO};color:${NL.dim}`); D(e, tk, `position:absolute;left:0;top:${70 + k * cs + cs / 2 - 16}px;width:136px;text-align:right;font:600 24px ${NLMONO};color:${NL.dim}`, id + 'q' + k); });
  M.forEach((row, r) => row.forEach((a, k) => D(e, a >= .3 ? a.toFixed(1) : '', `left:${150 + k * cs + 3}px;top:${70 + r * cs + 3}px;width:${cs - 6}px;height:${cs - 6}px;background:color-mix(in srgb,${c} ${Math.round(8 + a * 80)}%,#0a0f1a);font-size:24px;color:${a > .5 ? '#05070d' : '#fff'}`, id + 'c' + r + '_' + k, 'ncell ' + id + 'c ' + id + 'r' + r)));
  D(e, '', `position:absolute;left:146px;top:66px;width:${n * cs + 8}px;height:${cs + 8}px;border:3px solid ${NL.out};border-radius:12px;box-shadow:0 0 22px ${NL.out}`, id + 'hl'); e.dataset.cs = cs; return e;
}
function ATTN(id, t) { B(t); tl.set('#' + id + 'hl', { autoAlpha: 0 }, 0); return tl.fromTo('.' + id + 'c', { autoAlpha: 0, scale: .6 }, { autoAlpha: 1, scale: 1, duration: .25, stagger: .02 }, t); }
function ATTN_ROW(id, t, r) { B(t); const cs = +document.getElementById(id).dataset.cs; tl.set('#' + id + 'hl', { autoAlpha: 1 }, t); tl.to('#' + id + 'hl', { y: r * cs, duration: .35, ease: 'power2.inOut' }, t); return PULSE('.' + id + 'r' + r, t + .3, { s: 1.06 }); }

// ---- decision boundary: two classes of points + a separating line that DRAWs.  BOUND(id, t) (points pop, line draws)
function nlBound(par, id, x, y, w, h, c1 = NL.data, c2 = NL.err, seed = 3) {
  const e = nlWin(par, id, x, y, w, h, NL.model, 'classifier'), v = S('svg', { width: w, height: h }, e); v.style.cssText = 'position:absolute;left:0;top:0;overflow:visible';
  for (let k = 0; k < 60; k++) { const a = rnd(seed * 31 + k * 3), b = rnd(seed * 17 + k * 5), m = a - .9 * b - .05; if (Math.abs(m) < .07) continue; const cl = m > 0; const px = 60 + a * (w - 120), py = 90 + (1 - b) * (h - 150); S('circle', { class: id + 'p', cx: px, cy: py, r: 11, fill: cl ? c2 : c1, opacity: .9 }, v); }
  S('path', { id: id + 'b', class: 'draw', d: `M${60 + (w - 120) * .95} ${90} L${60 + (w - 120) * .05} ${h - 60}`, stroke: NL.out, 'stroke-width': 5, 'stroke-dasharray': null, fill: 'none', 'stroke-linecap': 'round' }, v); return e;
}
function BOUND(id, t) { B(t); tl.fromTo('.' + id + 'p', { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: .2, stagger: .02 }, t); return DRAW('#' + id + 'b', t + 1, { d: .8 }); }

// ---- confusion matrix 2x2. m = [[TP, FN], [FP, TN]]. Cells POP with nlShow/POP('.'+id+'c').
function nlConf(par, id, x, y, m, cs = 190, labs = ['spam', 'ham']) {
  const e = D(par, '', `left:${x}px;top:${y}px;width:${150 + 2 * cs}px;height:${100 + 2 * cs}px`, id, 'nbox');
  labs.forEach((l, k) => { D(e, l, `position:absolute;left:${150 + k * cs}px;top:40px;width:${cs}px;text-align:center;font:600 24px ${NLMONO};color:${NL.dim}`); D(e, l, `position:absolute;left:0;top:${100 + k * cs + cs / 2 - 16}px;width:136px;text-align:right;font:600 24px ${NLMONO};color:${NL.dim}`); });
  D(e, 'predicted →', `position:absolute;left:150px;top:0;width:${2 * cs}px;text-align:center;font:600 24px ${NLMONO};color:${NL.dim}`);
  m.forEach((row, r) => row.forEach((v, k) => { const ok = r === k, c = ok ? NL.data : NL.err; D(e, String(v), `left:${150 + k * cs + 4}px;top:${100 + r * cs + 4}px;width:${cs - 8}px;height:${cs - 8}px;border:2px solid ${c};background:color-mix(in srgb,${c} ${ok ? 22 : 12}%,#0a0f1a);font-size:54px;box-shadow:0 0 26px -8px ${c}`, id + 'c' + r + k, 'ncell ' + id + 'c'); })); return e;
}

// ---- matrix x vector = result. MATMUL(id, t, dt=.7): each row of A lights with the vector, then its result cell pops.
function nlMatmul(par, id, x, y, A, v, cs = 84) {
  const R = A.length, Cn = A[0].length, out = A.map(r => r.reduce((s, a, k) => s + a * v[k], 0)), e = D(par, '', `left:${x}px;top:${y}px;width:${(Cn + 3) * cs + 160}px;height:${R * cs}px`, id, 'nbox');
  const cell = (cx, cy, val, c, cid, cls) => D(e, String(val), `left:${cx}px;top:${cy}px;width:${cs - 8}px;height:${cs - 8}px;border:2px solid color-mix(in srgb,${c} 60%,#000);background:color-mix(in srgb,${c} 12%,#0a0f1a)`, cid, 'ncell ' + (cls || ''));
  A.forEach((row, r) => row.forEach((a, k) => cell(k * cs, r * cs, a, NL.model, id + 'a' + r + k, id + 'r' + r)));
  D(e, '×', `position:absolute;left:${Cn * cs + 6}px;top:${R * cs / 2 - 34}px;font:700 52px ${NLMONO};color:${NL.dim}`);
  const vy = (R - Cn) * cs / 2; v.forEach((b, k) => cell(Cn * cs + 70, vy + k * cs, b, NL.data, id + 'v' + k, id + 'v'));
  D(e, '=', `position:absolute;left:${Cn * cs + 70 + cs + 12}px;top:${R * cs / 2 - 34}px;font:700 52px ${NLMONO};color:${NL.dim}`);
  out.forEach((o, r) => cell(Cn * cs + 70 + cs + 80, r * cs, o, NL.out, id + 'o' + r, id + 'o'));
  D(e, '', `position:absolute;left:-6px;top:-6px;width:${Cn * cs + 4}px;height:${cs + 4}px;border:3px solid ${NL.out};border-radius:12px;box-shadow:0 0 20px ${NL.out}`, id + 'hl'); e.dataset.R = R; e.dataset.cs = cs; return e;
}
function MATMUL(id, t, dt = .7) { B(t); const e = document.getElementById(id), R = +e.dataset.R, cs = +e.dataset.cs; tl.set('.' + id + 'o', { autoAlpha: 0 }, 0); tl.set('#' + id + 'hl', { autoAlpha: 0 }, 0); tl.set('#' + id + 'hl', { autoAlpha: 1 }, t);
  for (let r = 0; r < R; r++) { if (r) tl.to('#' + id + 'hl', { y: r * cs, duration: .2 }, t + r * dt); PULSE('.' + id + 'v', t + r * dt + .1, { s: 1.06 }); POP('#' + id + 'o' + r, t + r * dt + .35); } tl.to('#' + id + 'hl', { autoAlpha: 0, duration: .2 }, t + R * dt); return t + R * dt; }

// ---- code window (simple highlight). lines = array of strings. CODE(id, t, dt=.35) reveals line by line.
function nlCode(par, id, x, y, w, lines, head = 'train.py', fs = 28) {
  const e = nlWin(par, id, x, y, w, 70 + lines.length * fs * 1.6 + 30, NL.model, head), KW = /\b(def|for|in|return|import|from|class|if|else|while|with|as|lambda|None|True|False)\b/g;
  const hl = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/(#.*)$/, `<span style="color:${NL.dim}">$1</span>`).replace(/('[^']*'|"[^"]*")/g, `<span style="color:${NL.out}">$1</span>`).replace(KW, `<span style="color:${NL.model}">$1</span>`).replace(/\b(\d+\.?\d*)\b/g, `<span style="color:${NL.data}">$1</span>`);
  lines.forEach((l, k) => D(e, `<span style="color:#47506a;display:inline-block;width:${fs * 1.6}px">${k + 1}</span>${hl(l)}`, `padding:${k ? 0 : 18}px 26px 0;font:500 ${fs}px/1.6 ${NLMONO};color:${NL.ink};white-space:pre`, id + 'L' + k, id + 'L ncode')); return e;
}
function CODE(id, t, dt = .35) { B(t); return tl.fromTo('.' + id + 'L', { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: .2, stagger: dt }, t); }

// ---- code EDITOR for walkthroughs: line numbers + Rust / Python colours + ONE caret that types char by char (indent appears at once), auto-scrolls,
// marks a line or a piece of a line while the voice explains it. par = a scene, or null = the top layer (stays on screen across scenes, glide it with HERO).
// nlEditor(par,id,x,y,w,h,lines,file,fs=30,lang='rust'). Lines never typed / shown are visible with the window (code that is already there).
// ED_TYPE(id,t,k0,k1=k0,dt=.045) types lines k0..k1 (adds the type cues, returns the end time) ; ED_SHOW(id,t,k0,k1) lines appear at once
// ED_LINE(id,t,k,c,d=0) glow bar on line k (d>0 = hide after d s) ; ED_SPAN(id,t,k,'text',c,d=0) box around that exact text on line k
// ED_CARET(id,t,k,col) moves the caret ; ED_SCROLL(id,t,top) top visible line ; ED_OFF(id,t) hides all marks
const NLED = { rust: { kw: 'fn|let|mut|struct|impl|pub|use|for|in|while|loop|if|else|return|match|as|const|mod|enum|trait|where|move|ref|self|Self|crate|true|false', ty: 'f32|f64|i8|i16|i32|i64|u8|u16|u32|u64|usize|isize|bool|char|str|String|Vec|Option|Result|Box|Some|None|Ok|Err', cm: '//.*$' },
  py: { kw: 'def|for|in|return|import|from|class|if|else|elif|while|with|as|lambda|None|True|False|self|not|and|or', ty: 'int|float|str|list|dict|tuple|bool', cm: '#.*$' } };
function nlEdSeg(l, lang) { const L = NLED[lang] || NLED.rust, out = [], re = new RegExp(`(${L.cm})|("[^"]*"|'[^']*')|\\b(${L.kw})\\b|\\b(${L.ty})\\b|\\b(\\d+\\.?\\d*)\\b|(\\w+!)|(\\w+)(?=\\()`, 'g');
  const col = [NL.dim, NL.out, NL.model, '#9fd4ff', NL.data, NL.out, '#ffffff']; let a = 0, m;
  while ((m = re.exec(l))) { if (m.index > a) out.push([l.slice(a, m.index), null]); const g = m.slice(1).findIndex(v => v !== undefined); out.push([m[0], col[g]]); a = m.index + m[0].length; if (!m[0].length) re.lastIndex++; }
  if (a < l.length) out.push([l.slice(a), null]); return out; }
function nlEditor(par, id, x, y, w, h, lines, file = 'src/main.rs', fs = 30, lang = 'rust') {
  const e = nlWin(par || nlInit.top, id, x, y, w, h, NL.model, file), lh = Math.round(fs * 1.6), cw = fs * .6, gw = Math.round(fs * 2.2), pad = 16, esc = ch => ch === '<' ? '&lt;' : ch === '>' ? '&gt;' : ch === '&' ? '&amp;' : ch;
  const bd = D(e, '', `position:absolute;left:0;right:0;top:50px;bottom:0;overflow:hidden`, id + 'bd'), tr = D(bd, '', `position:absolute;left:0;right:0;top:${pad}px;height:${lines.length * lh}px`, id + 'tr');
  D(tr, '', `position:absolute;left:0;top:0;bottom:0;width:${gw + 8}px;border-right:1px solid ${NL.line}`);
  lines.forEach((l, k) => { let c = 0; const code = nlEdSeg(l, lang).map(([tx, cl]) => [...tx].map(ch => `<span class="nchar ${id}c${k}" data-i="${c++}"${cl ? ` style="color:${cl}"` : ''}>${esc(ch)}</span>`).join('')).join('');
    D(tr, `<span id="${id}n${k}" style="position:absolute;left:0;width:${gw}px;text-align:right;color:#47506a">${k + 1}</span><span style="position:absolute;left:${gw + 24}px;white-space:pre">${code}</span>`,
      `position:absolute;left:0;right:0;top:${k * lh}px;height:${lh}px;font:500 ${fs}px/${lh}px ${NLMONO};color:${NL.ink};z-index:1`, id + 'L' + k, id + 'L ncode'); });
  D(tr, '', `position:absolute;left:${gw + 24}px;top:${(lh - fs * 1.1) / 2}px;width:${Math.round(fs * .12) + 2}px;height:${Math.round(fs * 1.1)}px;border-radius:2px;background:${NL.data};box-shadow:0 0 14px ${NL.data};z-index:2`, id + 'k');
  e.__ed = { lines, lh, cw, gw, rows: Math.floor((h - 50 - pad) / lh), top: 0, nm: 0 }; e.dataset.x = x; e.dataset.y = y; return e; }
function ED_CARET(id, t, k, col = 0) { const E = document.getElementById(id).__ed; if (!E.kon) { E.kon = 1; tl.set('#' + id + 'k', { autoAlpha: 0 }, 0); } tl.set('#' + id + 'k', { autoAlpha: 1, x: col * E.cw, y: k * E.lh }, t); return t; }
function ED_SCROLL(id, t, top, d = .4) { const E = document.getElementById(id).__ed; E.top = top; B(t); return tl.to('#' + id + 'tr', { y: -top * E.lh, duration: d, ease: 'power2.inOut' }, t); }
function nlEdFit(id, t, k) { const E = document.getElementById(id).__ed; if (k >= E.top + E.rows) ED_SCROLL(id, t, k - E.rows + 1, .3); else if (k < E.top) ED_SCROLL(id, t, k, .3); }
function ED_TYPE(id, t, k0, k1 = k0, dt = .045) { B(t); const E = document.getElementById(id).__ed; let tt = t;
  for (let k = k0; k <= k1; k++) { const cs = [...document.querySelectorAll('.' + id + 'c' + k)], ind = E.lines[k].length - E.lines[k].trimStart().length; nlEdFit(id, tt, k);
    tl.set('#' + id + 'n' + k, { autoAlpha: 0 }, 0); tl.set('#' + id + 'n' + k, { autoAlpha: 1 }, tt); cs.forEach(c => tl.set(c, { autoAlpha: 0 }, 0));
    ED_CARET(id, tt, k, ind); const n = cs.length - ind; if (n > 0) CUE(tt, 'type', n, dt);
    cs.forEach((c, i) => { const ti = i < ind ? tt : tt + (i - ind + 1) * dt; tl.set(c, { autoAlpha: 1 }, ti); if (i >= ind) tl.set('#' + id + 'k', { x: (i + 1) * E.cw }, ti); });
    tt += Math.max(0, n) * dt + (k < k1 ? .12 : 0); }
  return tt; }
function ED_SHOW(id, t, k0, k1 = k0) { B(t); for (let k = k0; k <= k1; k++) { nlEdFit(id, t, k); const s = ['#' + id + 'n' + k, ...document.querySelectorAll('.' + id + 'c' + k)]; tl.set(s, { autoAlpha: 0 }, 0); tl.set(s, { autoAlpha: 1 }, t); } return t; }
function nlEdMark(id, t, html, d) { const E = document.getElementById(id).__ed, mid = id + 'm' + E.nm++; D(document.getElementById(id + 'tr'), '', html, mid, id + 'mk'); tl.set('#' + mid, { autoAlpha: 0 }, 0); FADE('#' + mid, t, { d: .25 }); if (d > 0) tl.to('#' + mid, { autoAlpha: 0, duration: .25 }, t + d); return t; }
function ED_LINE(id, t, k, c = NL.out, d = 0) { const E = document.getElementById(id).__ed; nlEdFit(id, t, k);
  return nlEdMark(id, t, `position:absolute;left:${E.gw + 9}px;right:0;top:${k * E.lh}px;height:${E.lh}px;background:color-mix(in srgb,${c} 13%,transparent);border-left:4px solid ${c};z-index:0`, d); }
function ED_SPAN(id, t, k, txt, c = NL.out, d = 0) { const E = document.getElementById(id).__ed, i = E.lines[k].indexOf(txt); if (i < 0) throw new Error(`ED_SPAN: "${txt}" is not on line ${k + 1} of ${id}`); nlEdFit(id, t, k);
  return nlEdMark(id, t, `position:absolute;left:${E.gw + 24 + i * E.cw - 7}px;top:${k * E.lh + 3}px;width:${txt.length * E.cw + 14}px;height:${E.lh - 6}px;border:3px solid ${c};border-radius:8px;box-shadow:0 0 16px ${c};z-index:3`, d); }
function ED_OFF(id, t) { B(t); return tl.to('.' + id + 'mk', { autoAlpha: 0, duration: .25 }, t); }

// ---- probability / score bars inside a window. items = [[label, 0..1, colour?], ...]. BARS(id, t) grows them.
function nlBars(par, id, x, y, w, items, head = 'next_token_probs', c = NL.out) {
  const e = nlWin(par, id, x, y, w, 80 + items.length * 70, c, head);
  items.forEach(([l, p, cc], k) => { const col = cc || c; D(e, `<span style="width:${Math.min(260, w * .32)}px;overflow:hidden">${l}</span><span style="flex:1;height:22px;position:relative"><span class="${id}b" style="position:absolute;left:0;top:0;bottom:0;width:${p * 100}%;border-radius:6px;background:${col};box-shadow:0 0 14px ${col};transform-origin:0 50%"></span></span><span style="width:90px;text-align:right;color:${col}">${Math.round(p * 100)}%</span>`, '', id + 'r' + k, 'nrow'); }); return e;
}
function BARS(id, t, st = .25) { B(t); return tl.fromTo('.' + id + 'b', { scaleX: 0 }, { scaleX: 1, duration: .7, ease: 'power2.out', stagger: st }, t); }

// ---- tokens: a row of chips (text split into tokens), fixed mono widths so el.xs = [[left, width], ...] (local x) is known at build. POP('.'+id+'t', t, {st:.12}) shows them one by one.
function nlTokens(par, id, x, y, toks, c = NL.data, fs = 30, gap = 12) { const e = D(par, '', `left:${x}px;top:${y}px;height:${fs * 1.2 + 24}px`, id, 'nbox'); let cx = 0; e.xs = [];
  toks.forEach((tk, k) => { const w = Math.round(tk.length * fs * .6 + 40); e.xs.push([cx, w]); D(e, tk, `position:absolute;left:${cx}px;top:0;width:${w}px;padding:10px 0;text-align:center;border-radius:12px;border:2px solid ${c};background:color-mix(in srgb,${c} 14%,#0a0f1a);font:600 ${fs}px ${NLMONO};color:#fff;white-space:pre;box-shadow:0 0 20px -8px ${c}`, id + 't' + k, id + 't'); cx += w + gap; });
  e.style.width = (cx - gap) + 'px'; e.cx = k => x + e.xs[k][0] + e.xs[k][1] / 2; return e; }
// ---- tag: a small glowing pill CENTRED on cx (safe to tween with IN/POP).
const nlTag = (par, id, cx, y, txt, c = NL.model, fs = 32) => D(par, `<span style="padding:8px 18px;border-radius:12px;border:2px solid ${c};background:color-mix(in srgb,${c} 16%,#0a0f1a);font:700 ${fs}px ${NLMONO};color:#fff;white-space:nowrap;box-shadow:0 0 22px -6px ${c}">${txt}</span>`, `position:absolute;left:${cx}px;top:${y}px;width:0;display:flex;justify-content:center`, id);

// ---- vector: a column/row of numbers with a colour bar per cell (an embedding). horiz=true for a row.
function nlVec(par, id, x, y, vals, c = NL.model, horiz = false, cs = 70) { const e = D(par, '', `left:${x}px;top:${y}px`, id, 'nbox');
  vals.forEach((v, k) => D(e, (v >= 0 ? ' ' : '') + v.toFixed(2), `left:${horiz ? k * (cs + 30) : 0}px;top:${horiz ? 0 : k * (cs * .62)}px;width:${cs + 24}px;height:${cs * .55}px;border:1.5px solid color-mix(in srgb,${v < 0 ? NL.err : c} 60%,#000);background:color-mix(in srgb,${v < 0 ? NL.err : c} ${Math.round(10 + Math.abs(v) * 40)}%,#0a0f1a)`, id + 'v' + k, 'ncell ' + id + 'v')); return e; }

// ---- equation window. html may use <sup>.
const nlEq = (par, id, x, y, w, html, head = 'math', c = NL.model, fs = 56) => { const e = nlWin(par, id, x, y, w, 90 + fs * 2, c, head); D(e, html, `padding:${fs * .55}px 44px;font:700 ${fs}px ${NLMONO};color:#fff;white-space:nowrap`); return e; };

// ---- counter that steps through values (no number tweening): nlCount(par,id,x,y,['0','8B','52B'],c,fs) ; COUNT(id, t, step=.22)
function nlCount(par, id, x, y, vals, c = NL.out, fs = 120) { const e = D(par, '', `left:${x}px;top:${y}px;width:${Math.ceil(Math.max(...vals.map(v => v.length)) * fs * .62)}px;height:${fs * 1.3}px`, id, 'nbox'); vals.forEach((n, k) => D(e, n, `position:absolute;left:0;font:800 ${fs}px ${NLMONO};color:${c};text-shadow:0 0 36px ${c}88;white-space:nowrap`, id + 'n' + k, id + 'n')); return e; }
function COUNT(id, t, step = .22) { B(t); const ns = document.querySelectorAll('.' + id + 'n'); tl.set('#' + id, { autoAlpha: 1 }, t); ns.forEach((n, k) => { tl.set(n, { autoAlpha: 0 }, 0); tl.set(n, { autoAlpha: 1 }, t + k * step); if (k < ns.length - 1) tl.set(n, { autoAlpha: 0 }, t + (k + 1) * step); }); return t + ns.length * step; }

// =====================================================================================================
// INTRO A "Boot" (0..HEAD = 2.6 s, before the voice) and OUTRO A "Sleep" (END .. END+TAIL).  Build both in build(s); call the beats inside beats.
// =====================================================================================================
const NLNAME = 'netlight.ml';
function nlIntro(s) { if (NLV) return null;   // a Short starts on its hook: no boot intro
  const e = D(stage, '', `position:absolute;inset:0;z-index:30;background:radial-gradient(1100px 650px at 50% -10%,#0f1a33 0%,transparent 65%),${NL.bg}`, 'nlI');
  nlOrb(e, 'nlIo', 560, 540, 170); nlType(e, 'nlIt', 800, 498, '> ' + NLNAME, 72); return e; }
function nlIntroBeats() { if (NLV) return; tl.set('#nlIo', { autoAlpha: 0 }, 0); tl.set('#nlIt', { autoAlpha: 1 }, 0); CARET('nlIt', 0, 1); TYPE('nlIt', .4, .05); ORB_ON('nlIo', 1.0); PULSE('#nlIo', 1.9, { s: 1.06 }); tl.to('#nlI', { autoAlpha: 0, duration: .35 }, HEAD - .4); }
let NL_END_TXT = '> follow for more';   // SHORT end card text; set it at the top of video.js, e.g. NL_END_TXT = '> full video below';
function nlOutro(s) { if (NLV) { const e = D(stage, '', `position:absolute;inset:0;z-index:30;background:radial-gradient(700px 600px at 50% 30%,#0f1a33 0%,transparent 70%),${NL.bg}`, 'nlO');
    nlOrb(e, 'nlOo', 405, 520, 110); nlType(e, 'nlOt', Math.round(405 - [...NL_END_TXT].length * 40 * .6 / 2), 760, NL_END_TXT, 40); return e; }
  const e = D(stage, '', `position:absolute;inset:0;z-index:30;background:radial-gradient(1100px 650px at 50% -10%,#0f1a33 0%,transparent 65%),${NL.bg}`, 'nlO');
  nlOrb(e, 'nlOo', 960, 400, 170); const txt = '> subscribe --next'; nlType(e, 'nlOt', Math.round(960 - txt.length * 60 * .6 / 2), 700, txt, 60); return e; }
function nlOutroBeats() { if (NLV) { const t = END + .1; tl.set('#nlO', { autoAlpha: 0 }, 0); tl.set('#nlOt', { autoAlpha: 0 }, 0); tl.set('#nlOoC', { autoAlpha: 0 }, 0);
    FADE('#nlO', t, { d: .25 }); ORB_BOUNCE('nlOo', t + .2, 1); TYPE('nlOt', t + .3, .03); tl.set({}, {}, END + TAIL); return; }
  const t = END + .2; tl.set('#nlO', { autoAlpha: 0 }, 0); tl.set('#nlOt', { autoAlpha: 0 }, 0); tl.set('#nlOoC', { autoAlpha: 0 }, 0); FADE('#nlO', t, { d: .4 }); ORB_BOUNCE('nlOo', t + .3, 2); const te = TYPE('nlOt', t + .5, .045); CARET('nlOt', te + .1, 2);
  ORB_SLEEP('nlOo', t + 2.4); tl.to('#nlO', { opacity: 0, duration: .5 }, END + TAIL - .6); tl.set({}, {}, END + TAIL); }

// =====================================================================================================
// LIGHT HOUSE LAYER: everything the old skill made you paste into video.js now lives here.
//   build:  nlSetup(s)  (= nlInit + no grid + intro + outro)  ->  nlScene(...) per idea  ->  cOrb(scene, id) in every scene except the last
//   beats:  nlBegin(['#s1', ...])  FIRST   ->  NEXT('#sN', 'first words of sN') per scene  ->  nlFinish()  LAST
// Guards (console.error = nlcheck/lcheck fails): orb in the last scene, a scene with no orb, a scene missing from nlBegin, a scene start
// phrase not found (two scenes on the same time), scenes out of order, NEXT called with the scene that is already showing.
// =====================================================================================================
const OX = NLV ? 735 : 1790, OY = NLV ? 175 : 962, OR = NLV ? 40 : 56, ORBS = [];   // SHORT: top-right, above the like/comment column
// the host orb: always the same corner (LONG bottom-right, SHORT top-right), same size. Never call nlOrb in a video (lbuild bans it).
const cOrb = (sc, id) => { ORBS.push([id, sc.id]); return nlOrb(sc, id, OX, OY, OR); };
// arrowhead at (x,y) on a wire group g: dir 'r' right, 'l' left, 'd' down, 'u' up
const arw = (g, x, y, c, dir = 'r') => { const P = { r: [[-16, -11], [-16, 11]], l: [[16, -11], [16, 11]], d: [[-11, -16], [11, -16]], u: [[-11, 16], [11, 16]] }[dir];
  return S('path', { class: 'draw', d: `M${x + P[0][0]} ${y + P[0][1]} L${x} ${y} L${x + P[1][0]} ${y + P[1][1]}`, stroke: c, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g); };
// sound cues -> window.__CUES -> lcheck writes cues.json -> lmix.py. kinds: whoosh hit chime blip tick err pop down type(n chars, dt)
const CUES = []; window.__CUES = CUES;
const CUE = (t, k, n = 1, dt = 0) => { if (t != null) CUES.push([+(+t).toFixed(3), k, n, dt]); return t; };
const NLT = []; window.__NLT = NLT;          // [scene, start time] for lcheck / phrase report
function NEXT(sel, ph) {
  if (sel === NLCUR) console.error(`LIGHT: NEXT('${sel}') but ${sel} is already showing`);
  if (NLSC.indexOf(sel) < 0) console.error(`LIGHT: NEXT('${sel}') - scene not listed in nlBegin([...])`);
  const prev = NLT.length ? NLT[NLT.length - 1][1] : HEAD, t = nlNext(sel, ph);
  if (t <= prev + .05) console.error(`LIGHT: scene ${sel} start phrase '${ph}' not found or not after the previous scene (t=${t.toFixed(2)})`);
  NLT.push([sel, t]); return CUE(t, 'whoosh');
}
// ---- CAPTIONS (Shorts): 2-3 of the script's own words at a time, the spoken word lit. Call nlCaptions() once at the end of build;
// nlFinish adds the beats. Band: SHORT y 1012-1092 on the 810x1440 canvas, above the Shorts caption area (keep scene parts above y 995:
// lcheck CAPTION); LONG y 948. The words come from meta.json via lbuild (NLCAPW), the times from words.json (TW).
const NLCAP = [];
function nlCaptions(o = {}) {
  if (NLDONE) { console.error('LIGHT: nlCaptions() after nlFinish() - call it at the end of BUILD (before return), not in the beats: every caption showed at once'); return; }
  if (typeof NLCAPW === 'undefined' || !NLCAPW) { console.error('LIGHT: nlCaptions() but the script words do not line up with words.json (lbuild CAPTIONS)'); return; }
  const top = o.top ?? (NLV ? 1012 : 948), fs = o.fs ?? (NLV ? 44 : 40), maxc = o.maxc ?? (NLV ? 24 : 34);
  const lay = D(stage, '', 'position:absolute;inset:0;pointer-events:none;z-index:25', 'nlCap');
  let g = [];
  const flush = () => { if (g.length) NLCAP.push(g); g = []; };
  // a sentence's last word joins the group before it (no lonely "word." card); a comma ends a group only after 2+ words
  // a pause > 0.7 s starts a new group, but never leaves one word alone
  TW.forEach(([t], i) => { const w = NLCAPW[i], end = /[.!?]$/.test(w), pun = /[.!?,;:]$/.test(w), gap = i ? t - TW[i - 1][0] : 0, len = (g.map(x => x[1]).join(' ') + ' ' + w).length;
    if (g.length && ((gap > .7 && !(g.length === 1 && gap < 1.2)) || g.length >= (pun ? 4 : 3) || len > maxc + (pun ? 4 : 0))) flush();
    g.push([t, w, i]); if (end || (/[,;:]$/.test(w) && g.length >= 2)) flush(); });
  flush();
  // SHORT: centred in the safe column x 40..690 (the like / comment buttons sit right of it); a long group gets a smaller font to fit 640 px
  const [cx0, cw] = NLV ? [40, 650] : [0, LW];
  NLCAP.forEach((grp, k) => { const n = grp.map(x => x[1]).join(' ').length, f2 = Math.round(Math.min(fs, (cw - 54) / (n * .56)));
    D(lay, `<span class="ncapc" style="display:inline-block;padding:8px 22px 10px;border-radius:16px;background:rgba(5,7,13,.88);border:2px solid #24324a;box-shadow:0 0 24px -6px #000;font:700 ${f2}px ${NLHEAD};color:${NL.ink};white-space:nowrap">`
      + grp.map(([, w, i]) => `<span id="ncw${i}">${w.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</span>`).join(' ') + '</span>',
      `position:absolute;left:${cx0}px;width:${cw}px;top:${top}px;display:flex;justify-content:center`, 'ncg' + k, 'ncap'); });
}
function nlCapBeats() {
  NLCAP.forEach((grp, k) => {
    const el = '#ncg' + k, t0 = grp[0][0] - .05, last = grp[grp.length - 1][0], nx = k + 1 < NLCAP.length ? NLCAP[k + 1][0][0] - .05 : END + .1;
    const t1 = Math.min(nx, nx - last > 1.2 ? last + .8 : nx, END + .1);
    tl.set(el, { autoAlpha: 0 }, 0); tl.set(el, { autoAlpha: 1 }, t0); tl.set(el, { autoAlpha: 0 }, t1);
    grp.forEach(([t, , i], j) => { tl.set('#ncw' + i, { color: NL.model, textShadow: `0 0 18px ${NL.model}` }, t);
      if (j + 1 < grp.length) tl.set('#ncw' + i, { color: NL.ink, textShadow: 'none' }, grp[j + 1][0]); });
  });
}
function nlSetup(s) { nlInit(s); nlIntro(s); nlOutro(s); return s; }
function nlBegin(scs) {
  nlIntroBeats(); nlStart(scs); NLT.push([scs[0], HEAD]);
  const all = [...document.querySelectorAll('.nsc')].map(e => '#' + e.id), last = scs[scs.length - 1];
  all.forEach(sc => { if (scs.indexOf(sc) < 0) console.error(`LIGHT: scene ${sc} exists but is missing from nlBegin([...])`); });
  scs.forEach(sc => { const has = ORBS.some(([, p]) => '#' + p === sc); if (sc === last && has) console.error(`LIGHT: orb in the last scene ${sc} (the outro already shows it)`); if (sc !== last && !has) console.error(`LIGHT: scene ${sc} has no corner orb - add cOrb(${sc.slice(1)}, 'o..')`); });
  ORBS.forEach(([id]) => tl.set('#' + id + 'E', NLEYE, 0));
  NLHL.forEach(h => tl.set('#' + h, { autoAlpha: 0 }, 0));
  if (NLV) CUE(.05, 'pop'); else { CUE(.4, 'type', 13, .05); CUE(1.0, 'blip'); CUE(1.9, 'chime'); }
}
// orb life (automatic, called by nlFinish): in every scene with a corner orb it blinks every 2.6-4.2 s and looks into the camera (ORB_CAM)
// at 35 % of the scene, again at 75 % in scenes longer than 11 s. Set NL_ORB_LIFE = false in video.js build to switch it off.
let NL_ORB_LIFE = true;
function nlOrbLife() { if (!NL_ORB_LIFE) return;
  NLT.forEach(([sel, t0], i) => { const t1 = i + 1 < NLT.length ? NLT[i + 1][1] : END, o = ORBS.find(([, p]) => '#' + p === sel); if (!o) return; const id = o[0];
    for (let tb = t0 + 1.4 + rnd(i) * .8; tb < t1 - .6; tb += 2.6 + rnd(i * 7 + tb) * 1.6) ORB_BLINK(id, tb);
    [.35, .75].forEach((f, k) => { if (!k || t1 - t0 >= 11) ORB_CAM(id, t0 + (t1 - t0) * f); }); }); }
let NLDONE = false;
function nlFinish() { NLDONE = true;
  nlOrbLife(); if (NLCAP.length) nlCapBeats();
  if (NLCUR !== NLSC[NLSC.length - 1]) console.error(`LIGHT: video ends on ${NLCUR}, not on the last scene ${NLSC[NLSC.length - 1]} (a NEXT is missing)`);
  OUT(NLCUR, END + .1, { d: .3 }); nlOutroBeats();
  if (NLV) { CUE(END + .1, 'whoosh'); CUE(END + .3, 'type', [...NL_END_TXT].length, .03); } else { CUE(END + .2, 'whoosh'); CUE(END + .5, 'type', 18, .045); CUE(END + 2.4, 'down'); }
}

// ---- real pages: screenshot inside a browser window + scroll/zoom focus, highlight box, cursor + click ----
// FIRST: python3 ~/hf-kit/light/lfind.py assets/<file>.png  (OCR -> assets/<file>.boxes.json, embedded by lbuild). Highlights and the cursor are placed
// BY PHRASE from that OCR, never by hand-typed pixels (lbuild refuses numbers in nlShotHL).
// nlShot(par,id,x,y,w,h,src,url,nw,nh): src = 'assets/<file>.png', nw/nh = the image's real pixel size. Crop the page to the part the voice talks about
// first (lcheck SMALLSHOT: page text must be >= 9 px tall on screen).
const NLSHOT = {}; window.__NLFOCUS = [];
function nlShot(par, id, x, y, w, h, src, url, nw, nh) {
  const e = nlWin(par, id, x, y, w, h, NL.model, url), vh = h - 50, ih = Math.round(w * nh / nw);
  const vp = D(e, '', `position:absolute;left:0;top:50px;width:${w}px;height:${vh}px;overflow:hidden;background:#0d1117`, id + 'vp');
  D(vp, `<img src="${src}" style="width:${w}px;height:${ih}px;display:block">`, `position:absolute;left:0;top:0;width:${w}px;height:${ih}px;transform-origin:0 0`, id + 'im');
  e.dataset.vw = w; e.dataset.vh = vh; e.dataset.ih = ih; e.dataset.src = src; e.classList.add('nshot');
  if (typeof NLBOXES === 'undefined' || !NLBOXES[src]) console.error(`LIGHT: nlShot('${id}') ${src} has no OCR boxes - run: python3 ~/hf-kit/light/lfind.py ${src}`);
  else if (NLBOXES[src].w !== nw || NLBOXES[src].h !== nh) console.error(`LIGHT: nlShot('${id}') nw/nh ${nw}x${nh} but ${src} is ${NLBOXES[src].w}x${NLBOXES[src].h}`);
  NLSHOT[id] = { src, k: w / nw, vw: w, vh, ih, f: [] }; return e;
}
// SHOT_FOCUS(id,t,px,py,s,d): bring image point (px,py) (px of the image as shown at scale 1) to the centre of the window at zoom s. s=1 = plain scroll.
// Use nlShotXY(id, 'phrase') for px,py. lcheck CUTTEXT fails when a zoom/scroll leaves a word cut by the window edge.
function SHOT_FOCUS(id, t, px, py, s = 1, d = 1.1) {
  const e = document.getElementById(id), vw = +e.dataset.vw, vh = +e.dataset.vh, ih = +e.dataset.ih;
  const x = Math.min(0, Math.max(vw - vw * s, vw / 2 - px * s)), y = Math.min(0, Math.max(vh - ih * s, vh / 2 - py * s));
  if (NLSHOT[id]) NLSHOT[id].f.push([t, t + d, x, y, s]); window.__NLFOCUS.push([id, t, t + d]);
  return TO('#' + id + 'im', t, { x, y, scale: s, duration: d, ease: 'power2.inOut' });
}
// phrase -> box in ORIGINAL image px from the OCR words. 'A B C' = these words in a row on one OCR line; 'A..B' = from A to B on the same row
// (a table row: 'E2D2..64'). o.n = which match (1 = top-most) when the phrase occurs more than once. Exact match only; when OCR misread the
// word (dark pages: 'ncm' -> 'nem') the error shows what OCR read: pass { fuzzy: true } to accept 1-letter slips (2 for 8+ letters).
const NLNZ = s => s.toLowerCase().replace(/[^a-z0-9.%]/g, '');
function nlLev(a, b) { if (Math.abs(a.length - b.length) > 2) return 9; let p = [...Array(b.length + 1).keys()];
  for (let i = 1; i <= a.length; i++) { const c = [i]; for (let j = 1; j <= b.length; j++) c.push(Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] !== b[j - 1]))); p = c; } return p[b.length]; }
function nlHits(W, ph, fz) {
  const same = (w, q) => w === q || (fz && q.length >= 3 && nlLev(w, q) <= (q.length >= 8 ? 2 : 1));
  const dd = bs => { const o = []; bs.forEach(b => { if (!o.some(c => { const ix = Math.max(0, Math.min(b[0] + b[2], c[0] + c[2]) - Math.max(b[0], c[0])), iy = Math.max(0, Math.min(b[1] + b[3], c[1] + c[3]) - Math.max(b[1], c[1])); return ix * iy / (b[2] * b[3] + c[2] * c[3] - ix * iy) > .5; })) o.push(b); }); return o.sort((a, b) => Math.round(a[1] / 8) - Math.round(b[1] / 8) || a[0] - b[0]); };
  if (ph.includes('..')) { const [a, b] = ph.split('..').map(x => x.trim()), out = [];
    nlHits(W, a, fz).forEach(A => { const c = nlHits(W, b, fz).filter(B => B[0] > A[0] && Math.abs(A[1] + A[3] / 2 - B[1] - B[3] / 2) < Math.max(A[3], B[3]) * .6).sort((p, q) => p[0] - q[0]);
      if (c.length) { const B = c[0], x0 = Math.min(A[0], B[0]), y0 = Math.min(A[1], B[1]); out.push([x0, y0, Math.max(A[0] + A[2], B[0] + B[2]) - x0, Math.max(A[1] + A[3], B[1] + B[3]) - y0, A[4] + ' .. ' + B[4]]); } }); return dd(out); }
  const q = ph.split(/\s+/).map(NLNZ).filter(Boolean), out = [];
  for (let i = 0; i < W.length; i++) { if (!same(NLNZ(W[i][0]), q[0])) continue; const seq = [W[i]];
    for (let j = i + 1; seq.length < q.length && j < W.length && W[j][5] === W[i][5]; j++) { const n = NLNZ(W[j][0]); if (same(n, q[seq.length])) seq.push(W[j]); else if (n) break; }
    if (seq.length === q.length) { const x0 = Math.min(...seq.map(s => s[1])), y0 = Math.min(...seq.map(s => s[2])); out.push([x0, y0, Math.max(...seq.map(s => s[1] + s[3])) - x0, Math.max(...seq.map(s => s[2] + s[4])) - y0, seq.map(s => s[0]).join(' ')]); } }
  return dd(out);
}
// box of a phrase in DISPLAY px of the shot at scale 1 (what nlShotHL / SHOT_FOCUS use). Errors (LIGHT: HLMISS ...) when it is not found or ambiguous.
function nlShotBox(id, ph, o = {}) { const S0 = NLSHOT[id]; if (!S0 || typeof NLBOXES === 'undefined' || !NLBOXES[S0.src]) return null;
  const W = NLBOXES[S0.src].words; let h = nlHits(W, ph, false);
  if (!h.length) { h = nlHits(W, ph, true); if (h.length && !o.fuzzy) { console.error(`LIGHT: HLMISS "${ph}" not on the page; OCR only has "${h.map(b => b[4]).join('" / "')}" - if that IS the text (OCR misread it) pass { fuzzy: true }, else fix the phrase`); return null; } }
  if (!h.length) { console.error(`LIGHT: HLMISS "${ph}" not found in ${S0.src} - check: python3 ~/hf-kit/light/lfind.py ${S0.src} "${ph}"`); return null; }
  if (h.length > 1 && !o.n) { console.error(`LIGHT: HLMISS "${ph}" occurs ${h.length}x in ${S0.src} - pass { n: 1..${h.length} } (1 = top-most) or a longer phrase / 'A..B'`); return null; }
  const b = h[Math.min(h.length, o.n || 1) - 1]; return b.slice(0, 4).map(v => v * S0.k);
}
// centre of a phrase (display px) -> for SHOT_FOCUS(id, t, ...nlShotXY(id, 'phrase'), s)
function nlShotXY(id, ph, o = {}) { const b = nlShotBox(id, ph, o); return b ? [b[0] + b[2] / 2, b[1] + b[3] / 2] : [0, 0]; }
// highlight box around a phrase (moves with scroll/zoom). Hidden at 0 automatically; POP('#hid', t) to show.  nlShotHL(shot, hid, 'phrase', colour, { n, pad })
const NLHL = [];
const nlShotHL = (id, hid, ph, c = NL.out, o = {}) => { NLHL.push(hid);
  if (typeof ph !== 'string') { console.error(`LIGHT: nlShotHL('${id}', '${hid}', ...) needs a phrase from the page, not pixel numbers`); return null; }
  const b = nlShotBox(id, ph, o) || [0, 0, 0, 0], pd = o.pad ?? 6;
  return D(document.getElementById(id + 'im'), '', `position:absolute;left:${b[0] - pd}px;top:${b[1] - pd}px;width:${b[2] + 2 * pd}px;height:${b[3] + 2 * pd}px;border:4px solid ${c};border-radius:10px;box-shadow:0 0 22px ${c},inset 0 0 18px ${c}55`, hid); };
function nlCursor(par, id, x, y) {
  const e = D(par, `<svg width="44" height="54" viewBox="0 0 22 27"><path d="M2 2 L2 22 L7.5 17 L11 25 L14.5 23.5 L11 15.5 L18 15.5 Z" fill="#fff" stroke="#05070d" stroke-width="1.6" stroke-linejoin="round"/></svg>`, `position:absolute;left:${x - 4}px;top:${y - 4}px;width:44px;height:54px;z-index:6;filter:drop-shadow(0 4px 6px #000)`, id);
  D(par, '', `position:absolute;left:${x - 22}px;top:${y - 22}px;width:44px;height:44px;border-radius:50%;border:3px solid ${NL.out};z-index:5`, id + 'r');
  NLHL.push(id + 'r'); (window.__NLCURS = window.__NLCURS || []).push(id); e.dataset.x = x; e.dataset.y = y; return e;
}
function CURSOR(id, t, x, y, d = .8) { const e = document.getElementById(id), dx = x - +e.dataset.x, dy = y - +e.dataset.y; TO(['#' + id, '#' + id + 'r'], t, { x: dx, y: dy, duration: d, ease: 'power2.inOut' }); return t + d; }
function CLICK(id, t) { B(t); CUE(t, 'blip'); tl.fromTo('#' + id + 'r', { autoAlpha: 1, scale: .3 }, { autoAlpha: 0, scale: 1.6, duration: .45, ease: 'power2.out' }, t); tl.to('#' + id, { scale: .85, duration: .08, yoyo: true, repeat: 1, transformOrigin: '10% 10%' }, t); return t + .45; }
// offset of element el inside ancestor anc (layout px, borders included)
function nlOff(el, anc) { let x = 0, y = 0, e = el; while (e && e !== anc) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; if (e && e !== anc) { x += e.clientLeft; y += e.clientTop; } } return [x, y]; }
// CURSOR_TO(cur, shot, 'phrase', t, d, {n}): moves the cursor tip onto the phrase in a screenshot. Knows the shot's zoom/scroll at the arrival
// time (SHOT_FOCUS calls made BEFORE this line), so never compute cursor pixels by hand. Errors when the phrase is not visible then.
function CURSOR_TO(id, shot, ph, t, d = .8, o = {}) { const S0 = NLSHOT[shot], b = nlShotBox(shot, ph, o); if (!S0 || !b) return t + d;
  const ta = t + d; let st = [0, 0, 1]; S0.f.forEach(([t0, , x, y, s]) => { if (t0 <= ta + .01) st = [x, y, s]; });
  const vx = st[0] + (b[0] + b[2] / 2) * st[2], vy = st[1] + (b[1] + b[3] * .55) * st[2];
  if (vx < 4 || vy < 4 || vx > S0.vw - 4 || vy > S0.vh - 4) console.error(`LIGHT: CURSOR_TO('${id}') "${ph}" is outside the visible part of ${shot} at ${ta.toFixed(1)}s`);
  const [ox, oy] = nlOff(document.getElementById(shot + 'vp'), document.getElementById(id).parentElement);
  return CURSOR(id, t, ox + vx, oy + vy, d); }
// a row of 'words' (rounded bars) for drawn pages / documents: from x0 to x1 inside an svg group g. Every bar ENDS at or before x1
// (the last one is cut to fit, a stub < 16 px is dropped). Use this for every text-like line in a drawing (lcheck SVGOUT catches spills).
function nlWords(g, x0, x1, y, h, seed, wmin = 24, wvar = 60, gap = 12, cls = null, c = NL.ink) { let x = x0;
  while (x1 - x >= 16) { const w = Math.min(wmin + rnd(seed + x) * wvar, x1 - x); const at = { x, y, width: w, height: h, rx: h / 2, fill: c, opacity: .85 }; if (cls) at.class = cls; S('rect', at, g); x += w + gap; } }
