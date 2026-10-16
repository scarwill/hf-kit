// ===================== NEWS  (neon-tech look for the daily tech news channel, `news` skill) =====================
// Build:  python3 ~/hf-kit/news/nbuild.py video.js audio.m4a      (lint + phrase check + build; cats premium.js + life.js + this + video.js, HEAD 2.6 / TAIL 3.6)
// Look:   navy-black bg + navy glow on top, NO grid, glowing windows/chips, mono labels. Titles = Space Grotesk, body = Inter, code/labels = JetBrains Mono.
// Colour = meaning (never decoration):  NEW / GOOD green · COMPANY / PRODUCT blue · KEY NUMBER / FACT yellow · PROBLEM / RISK pink · purple = ONLY the <b> word in a title.
// NO mascot, NO header, NO footer, NO progress bar: everything lives inside a scene (nbuild bans drawing on `stage`).
// RULE #1: SHOW, DON'T WRITE. Every scene has a moving visual. Text = 1-4 word labels, plus the exact text a story is about (headline, post, command).
const NL = { bg: '#05070d', data: '#34e0b0', model: '#6cc8ff', out: '#ffcc4d', err: '#ff6b81', acc: '#b48cff', ink: '#eef2f6', dim: '#8e9aae', line: 'rgba(255,255,255,.09)' };
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
  .nhero{position:absolute;z-index:5}`;
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
const nlSvg = par => { const v = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); v.style.cssText = 'position:absolute;left:0;top:0;width:1920px;height:1080px;overflow:visible;pointer-events:none'; par.appendChild(v); return v; };
const nlWire = (v, id, d, c, dash, w = 3.5) => { const g = S('g', { id }, v); S('path', { d, stroke: c, 'stroke-width': w * 3, fill: 'none', opacity: .16, 'stroke-linecap': 'round' }, g); S('path', { class: 'draw', d, stroke: c, 'stroke-width': w, fill: 'none', 'stroke-linecap': 'round', 'stroke-dasharray': dash || null }, g); NLWIRES.push(g); return g; };
const nlDocs = (par, id, x, y, cols, rows, w, h, gap, c) => { const g = D(par, '', '', id); for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) D(g, '<i style="top:28%"></i><i style="top:48%"></i><i style="top:68%;right:40%"></i>', `left:${x + k * (w + gap)}px;top:${y + r * (h + gap)}px;width:${w}px;height:${h}px;--c:${c}`, null, 'ndoc ' + id + 'd'); return g; };
// a box holding its own svg (local coords 0..w, 0..h) -> [div, svg]
const nlBox = (par, id, x, y, w, h) => { const e = D(par, '', `left:${x}px;top:${y}px;width:${w}px;height:${h}px`, id, 'nbox'); const v = S('svg', { width: w, height: h, viewBox: `0 0 ${w} ${h}` }, e); v.style.overflow = 'visible'; return [e, v]; };

// ---------- HERO object: one card that lives across scenes (answer / dataset / model output). Move it, never rebuild it. ----------
// nlHero(id, x, y, w, html, c, head) builds it in the top layer;  HERO(id, t, x, y, s) glides it to (x,y) at scale s;  show with IN/POP, hide with OUT.
function nlHero(id, x, y, w, html, c = NL.out, head = 'answer') { const e = nlWin(nlInit.top, id, x, y, w, 0, c, head); e.style.height = 'auto'; e.classList.add('nhero'); D(e, html, 'padding:22px 28px 26px;font-size:38px', null, 'ntx'); e.dataset.x = x; e.dataset.y = y; return e; }
function HERO(id, t, x, y, s = 1, d = .9) { const e = document.getElementById(id); B(t); return tl.to(e, { x: x - +e.dataset.x, y: y - +e.dataset.y, scale: s, transformOrigin: '0% 0%', duration: d, ease: 'power3.inOut' }, t); }

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
  IN(scs[0] + 'T', HEAD - .3, { y: -20, d: .5 }); nlDrift(scs[0], HEAD - .3); }
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
// NEWS PARTS. Each one is a top-level part (hidden by nwBegin). Show it with IN/POP/FADE, then run its beat.
// Facts on screen come from the story's real sources: source + date are required arguments (NEWS: guard when empty).
// =====================================================================================================
const NWSTORY = [];
const nwErr = m => console.error('NEWS: ' + m);
const nwArc = (cx, cy, R, a0, a1) => { const p = a => [(cx + R * Math.cos(a)).toFixed(1), (cy + R * Math.sin(a)).toFixed(1)], [x0, y0] = p(a0), [x1, y1] = p(a1); return `M${x0} ${y0} A${R} ${R} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1} ${y1}`; };

// ---- story opener: dial with one arc per story (this story's arc draws), big "02", tag, source + date.  STORY(id, t)
// nwStory(par, id, x, y, k, n, tag, source, date): k = this story (1..n), n = stories in the video. Box is 520 x 520.
function nwStory(par, id, x, y, k, n, tag, source, date) {
  if (!source || !date) nwErr(`nwStory('${id}') needs its source and date`);
  NWSTORY.push([id, k, n, par.id]);
  const [e, v] = nlBox(par, id, x, y, 520, 520), cx = 260, cy = 190, R = 170, gap = n > 1 ? .12 : 0;
  S('circle', { cx, cy, r: R, fill: 'none', stroke: NL.model, 'stroke-width': 30, opacity: .06 }, v);
  for (let i = 0; i < n; i++) { const a0 = -Math.PI / 2 + i * 2 * Math.PI / n + gap / 2, a1 = a0 + 2 * Math.PI / n - gap;
    if (i === k - 1) { S('path', { d: nwArc(cx, cy, R, a0, a1), stroke: NL.out, 'stroke-width': 26, fill: 'none', opacity: .18, class: id + 'a' }, v); S('path', { id: id + 'k', class: 'draw', d: nwArc(cx, cy, R, a0, a1), stroke: NL.out, 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round' }, v); }
    else S('path', { class: id + 'a', d: nwArc(cx, cy, R, a0, a1), stroke: i < k - 1 ? NL.model : '#263044', 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round', opacity: i < k - 1 ? .55 : 1 }, v); }
  D(e, String(k).padStart(2, '0'), `position:absolute;left:0;width:520px;top:${cy - 92}px;text-align:center;font:800 150px ${NLMONO};color:${NL.out};text-shadow:0 0 40px ${NL.out}88`, id + 'n');
  D(e, 'of ' + String(n).padStart(2, '0'), `position:absolute;left:0;width:520px;top:${cy + 64}px;text-align:center;font:600 26px ${NLMONO};color:${NL.dim}`, id + 'o');
  nlTag(e, id + 'g', 260, 396, tag, NL.model, 30);
  D(e, `${source} &middot; ${date}`, `position:absolute;left:-40px;width:600px;top:470px;text-align:center;font:600 26px ${NLMONO};color:${NL.dim};white-space:nowrap`, id + 's');
  return e;
}
function STORY(id, t) { B(t); tl.set('#' + id, { autoAlpha: 1 }, t); tl.fromTo('.' + id + 'a', { opacity: 0 }, { opacity: (i, el) => +el.getAttribute('opacity') || 1, duration: .3, stagger: .05 }, t); DRAW('#' + id + 'k', t + .25, { d: .7 }); POP(['#' + id + 'n', '#' + id + 'o'], t + .1); FADE(['#' + id + 'g', '#' + id + 's'], t + .6, { st: .2 }); return t + 1; }

// ---- article card: the REAL headline, word for word, in a window whose header is "source · date". <b>words</b> in the headline get a marker that MARK(id, t) sweeps in
//      (a marked part never wraps: keep each <b> to 1-4 words).
// nwHead(par, id, x, y, w, source, date, headline, c). Height grows with the text.
function nwHead(par, id, x, y, w, source, date, html, c = NL.model) {
  if (!source || !date) nwErr(`nwHead('${id}') needs its source and date`);
  if (html.replace(/<[^>]+>/g, '').length > 140) nwErr(`nwHead('${id}') headline is longer than 140 characters - show the first part and say the rest`);
  const e = nlWin(par, id, x, y, w, 0, c, `${source} &middot; ${date}`); e.style.height = 'auto';
  D(e, html.replace(/<b>(.*?)<\/b>/g, `<span class="nwmk"><span class="nwmb ${id}mb"></span><span style="position:relative">$1</span></span>`), `padding:26px 34px 32px;font:700 46px/1.25 ${NLHEAD};color:#fff`, id + 'h', 'nwq');
  return e;
}
function MARK(id, t) { B(t); return tl.fromTo('.' + id + 'mb', { scaleX: 0 }, { scaleX: 1, duration: .5, ease: 'power2.out', stagger: .25 }, t); }

// ---- post card: a real post / statement, word for word (generic card, no platform logo or UI). POST(id, t, dt) reveals it word by word (returns the end time).
// nwPost(par, id, x, y, w, name, handle, date, text, c)
function nwPost(par, id, x, y, w, name, handle, date, text, c = NL.model) {
  if (!handle || !date) nwErr(`nwPost('${id}') needs the real handle and date`);
  const e = nlWin(par, id, x, y, w, 0, c, `post &middot; ${date}`); e.style.height = 'auto';
  const ini = name.split(/\s+/).map(s => s[0] || '').join('').slice(0, 2).toUpperCase();
  D(e, `<span style="width:64px;height:64px;border-radius:50%;border:2px solid ${c};display:flex;align-items:center;justify-content:center;font:800 26px ${NLMONO};color:${c};flex:none">${ini}</span><span style="display:flex;flex-direction:column;gap:2px"><span style="font:700 32px ${NLBODY};color:#fff">${name}</span><span style="font:500 26px ${NLMONO};color:${NL.dim}">${handle}</span></span>`, 'display:flex;align-items:center;gap:18px;padding:22px 30px 0');
  D(e, text.split(/\s+/).map(wd => `<span class="${id}w">${wd}</span>`).join(' '), `padding:18px 30px 30px;font:500 36px/1.38 ${NLBODY};color:${NL.ink}`, id + 'x', 'nwq');
  e.dataset.n = text.split(/\s+/).length; return e;
}
function POST(id, t, dt = .07) { B(t); const n = +document.getElementById(id).dataset.n; tl.fromTo('.' + id + 'w', { autoAlpha: 0 }, { autoAlpha: 1, duration: .05, stagger: dt }, t); return t + n * dt; }

// ---- spec / A vs B table. cols = ['', 'Model A', 'Model B'] ; rows = [['context', '128k', '1M', 2], ...] (optional 4th+ item = the winning column, 1-based).
// nwSpec(par, id, x, y, w, cols, rows, head, colours). SPEC(id, t, dt) shows the rows one by one, the winner cell lights up.
function nwSpec(par, id, x, y, w, cols, rows, head = 'spec sheet', cc = [NL.model, NL.data, NL.out]) {
  const nc = cols.length, w0 = Math.round((w - 40) * .36), wc = Math.floor((w - 40 - w0) / (nc - 1)), e = nlWin(par, id, x, y, w, 50 + 76 + rows.length * 76 + 20, NL.model, head);
  const row = (cells, rid, cls, fn) => { const r = D(e, '', `position:relative;display:flex;align-items:center;height:76px;margin:0 20px;border-bottom:1px solid rgba(255,255,255,.06)`, rid, cls); cells.forEach((c, i) => D(r, c, `width:${i ? wc : w0}px;${i ? 'text-align:center;' : 'padding-left:10px;'}font:${fn(i)};white-space:nowrap;overflow:hidden;position:relative`)); return r; };
  row(cols, null, '', i => `700 30px ${NLMONO};color:${i ? cc[(i - 1) % cc.length] : NL.dim}`);
  rows.forEach((rw, k) => { const r = row(rw.slice(0, nc), id + 'r' + k, id + 'r', i => `${i ? 600 : 500} 30px ${NLMONO};color:${i ? '#fff' : '#c9d2de'}`), win = rw[nc];
    if (win) D(r, '', `position:absolute;left:${w0 + (win - 1) * wc + 6}px;top:8px;width:${wc - 12}px;height:60px;border:3px solid ${NL.out};border-radius:10px;box-shadow:0 0 18px ${NL.out}`, id + 'w' + k, id + 'w'); });
  e.dataset.n = rows.length; return e;
}
function SPEC(id, t, dt = .5) { B(t); const n = +document.getElementById(id).dataset.n; tl.fromTo('.' + id + 'r', { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: .25, stagger: dt }, t);
  document.querySelectorAll('.' + id + 'w').forEach(w => { const k = +w.id.slice(id.length + 1); tl.fromTo(w, { autoAlpha: 0 }, { autoAlpha: 1, duration: .25 }, t + k * dt + .3); }); return t + n * dt; }

// ---- timeline: dates above, events below, a glowing marker that travels from event to event.  events = [['2023', 'v1 ships'], ...] (2-6 events)
// nwTime(par, id, x, y, w, events, c). TIMELINE(id, t, dt) draws the line and runs the marker through every event; TIME_GO(id, t, k, d) moves it to event k on a word.
function nwTime(par, id, x, y, w, ev, c = NL.model) {
  const [e, v] = nlBox(par, id, x, y, w, 260), px = k => 70 + k * (w - 140) / Math.max(1, ev.length - 1);
  S('path', { d: `M20 130 L${w - 20} 130`, stroke: c, 'stroke-width': 14, opacity: .1 }, v); S('path', { id: id + 'ln', class: 'draw', d: `M20 130 L${w - 20} 130`, stroke: c, 'stroke-width': 4 }, v);
  ev.forEach(([dt, tx], k) => { const g = D(e, '', `position:absolute;left:${px(k)}px;top:0;width:0`, id + 'e' + k, id + 'e');
    D(g, dt, `position:absolute;left:-150px;width:300px;top:52px;text-align:center;font:700 30px ${NLMONO};color:${NL.out};white-space:nowrap`);
    D(g, '', `position:absolute;left:-12px;top:118px;width:24px;height:24px;border-radius:50%;background:#0a0f1a;border:3px solid ${c}`);
    D(g, tx, `position:absolute;left:-160px;width:320px;top:166px;text-align:center;font:600 28px ${NLBODY};color:${NL.ink};white-space:nowrap`); });
  D(e, '', `position:absolute;left:${px(0) - 17}px;top:113px;width:34px;height:34px;border-radius:50%;background:#fff;box-shadow:0 0 22px ${NL.out},0 0 8px #fff`, id + 'm');
  e.px = px; e.dataset.n = ev.length; return e;
}
function TIME_GO(id, t, k, d = .7) { const e = document.getElementById(id); TO('#' + id + 'm', t, { x: e.px(k) - e.px(0), duration: d, ease: 'power1.inOut' }); POP('#' + id + 'e' + k, t + d - .15, { d: .35 }); return t + d; }
function TIMELINE(id, t, dt = .8) { B(t); const n = +document.getElementById(id).dataset.n; DRAW('#' + id + 'ln', t, { d: .6 }); FADE('#' + id + 'm', t, { d: .2 }); POP('#' + id + 'e0', t + .1, { d: .35 });
  for (let k = 1; k < n; k++) TIME_GO(id, t + .45 + (k - 1) * dt, k, dt); return t + .45 + (n - 1) * dt; }

// ---- company / project badge: initials in a glowing ring + the name (NOT a logo - never redraw a real logo). Centred on cx.
// nwCo(par, id, cx, y, name, c, sz)
function nwCo(par, id, cx, y, name, c = NL.model, sz = 130) {
  const ini = name.split(/\s+/).map(s => s[0] || '').join('').slice(0, 2).toUpperCase(), e = D(par, '', `position:absolute;left:${cx}px;top:${y}px;width:0;display:flex;flex-direction:column;align-items:center`, id);
  D(e, ini, `flex:none;width:${sz}px;height:${sz}px;border-radius:50%;border:3px solid ${c};background:color-mix(in srgb,${c} 14%,#0a0f1a);box-shadow:0 0 34px -6px ${c};display:flex;align-items:center;justify-content:center;font:800 ${Math.round(sz * .36)}px ${NLMONO};color:#fff`);
  D(e, name, `margin-top:14px;font:700 30px ${NLMONO};color:${c};white-space:nowrap`); return e;
}

// ---- recap: today's stories as numbered rows, each gets a check.  nwRecap(par, id, x, y, w, items, head) ; RECAP(id, t, dt)
function nwRecap(par, id, x, y, w, items, head = 'today') {
  const e = nlWin(par, id, x, y, w, 50 + items.length * 78 + 24, NL.model, head);
  items.forEach((it, k) => { const r = D(e, `<span style="color:${NL.out};font-weight:800">${String(k + 1).padStart(2, '0')}</span><span style="flex:1;font-family:${NLBODY};font-weight:600;color:#fff">${it}</span>`, 'height:78px;padding:0 26px;font-size:32px', id + 'r' + k, 'nrow ' + id + 'r');
    D(r, NLOK(NL.data, 32), 'display:flex', id + 'c' + k, id + 'c'); }); e.dataset.n = items.length; return e;
}
function RECAP(id, t, dt = .6) { B(t); tl.fromTo('.' + id + 'r', { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: .25, stagger: dt }, t); tl.fromTo('.' + id + 'c', { autoAlpha: 0, scale: .4 }, { autoAlpha: 1, scale: 1, duration: .3, ease: 'back.out(2)', stagger: dt }, t + .3);
  return t + +document.getElementById(id).dataset.n * dt; }

// =====================================================================================================
// INTRO "Signal" (0..HEAD = 2.6 s, before the voice) and OUTRO "Sign-off" (END .. END+TAIL). Channel + date come from nwSetup. Never change their text.
// =====================================================================================================
const NWB = { channel: '', date: '' };
// broadcast emblem: a dot with 3 arcs on each side (class 'draw', DRAW them)
function nwSignal(par, id, cx, cy, r = 90, c = NL.data) {
  const [e, v] = nlBox(par, id, cx - r * 2.2, cy - r * 1.4, r * 4.4, r * 2.8), ox = r * 2.2, oy = r * 1.4;
  S('circle', { cx: ox, cy: oy, r: r * .7, fill: c, opacity: .12 }, v); S('circle', { id: id + 'd', cx: ox, cy: oy, r: r * .24, fill: c }, v);
  for (let k = 1; k <= 3; k++) [-1, 1].forEach(sd => { const R = r * (.32 + k * .5), a = .62, A = sd > 0 ? 0 : Math.PI;
    S('path', { class: 'draw ' + id + 'a', d: nwArc(ox, oy, R, A - a, A + a), stroke: c, 'stroke-width': Math.max(4, r * .09), fill: 'none', 'stroke-linecap': 'round', opacity: 1 - k * .2 }, v); });
  return e;
}
function nwIntro(s) { const e = D(stage, '', `position:absolute;inset:0;z-index:30;background:radial-gradient(1100px 650px at 50% -10%,#0f1a33 0%,transparent 65%),${NL.bg}`, 'nwI');
  nwSignal(e, 'nwIs', 960, 330, 90); const tx = '> ' + NWB.channel; nlType(e, 'nwIt', Math.round(960 - tx.length * 72 * .6 / 2), 470, tx, 72);
  nlTag(e, 'nwId', 960, 610, `${NWB.date} &middot; <span id="nwIn">0</span> stories`, NL.out, 34); return e; }
function nwIntroBeats() { tl.set('#nwIt', { autoAlpha: 1 }, 0); CARET('nwIt', 0, 1); DRAW('.nwIsa', .15, { d: .5, st: .06 }); TYPE('nwIt', .45, .045); POP('#nwId', 1.6); PULSE('#nwIsd', 1.6, { s: 1.4 });
  tl.to('#nwI', { autoAlpha: 0, duration: .35 }, HEAD - .4); }
function nwOutro(s) { const e = D(stage, '', `position:absolute;inset:0;z-index:30;background:radial-gradient(1100px 650px at 50% -10%,#0f1a33 0%,transparent 65%),${NL.bg}`, 'nwO');
  nwSignal(e, 'nwOs', 960, 380, 100); const txt = '> subscribe --daily'; nlType(e, 'nwOt', Math.round(960 - txt.length * 60 * .6 / 2), 640, txt, 60); return e; }
function nwOutroBeats() { const t = END + .2; tl.set('#nwO', { autoAlpha: 0 }, 0); tl.set('#nwOt', { autoAlpha: 0 }, 0); FADE('#nwO', t, { d: .4 }); DRAW('.nwOsa', t + .3, { d: .5, st: .06 });
  const te = TYPE('nwOt', t + .6, .045); CARET('nwOt', te + .1, 2); PULSE('#nwOsd', t + 2.4, { s: 1.4 }); tl.to('#nwO', { opacity: 0, duration: .5 }, END + TAIL - .6); tl.set({}, {}, END + TAIL); }

// =====================================================================================================
// NEWS HOUSE LAYER
//   build:  nwSetup(s, { channel, date })  ->  nlScene(...) per idea  ->  nwStory(...) in the first scene of every story
//   beats:  nwBegin(['#s1', ...])  FIRST   ->  NEXT('#sN', 'first words of sN') per scene  ->  nwFinish()  LAST
// Guards (console.error 'NEWS: ...' = ncheck fails): missing channel/date, a scene missing from nwBegin, stories not numbered 1..n,
// a story opener without source/date, a scene start phrase not found, scenes out of order, NEXT with the scene already showing.
// =====================================================================================================
// arrowhead at (x,y) on a wire group g: dir 'r' right, 'l' left, 'd' down, 'u' up
const arw = (g, x, y, c, dir = 'r') => { const P = { r: [[-16, -11], [-16, 11]], l: [[16, -11], [16, 11]], d: [[-11, -16], [11, -16]], u: [[-11, 16], [11, 16]] }[dir];
  return S('path', { class: 'draw', d: `M${x + P[0][0]} ${y + P[0][1]} L${x} ${y} L${x + P[1][0]} ${y + P[1][1]}`, stroke: c, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g); };
// sound cues -> window.__CUES -> ncheck writes cues.json -> nmix.py. kinds: whoosh hit chime blip tick err pop down type(n chars, dt)
const CUES = []; window.__CUES = CUES;
const CUE = (t, k, n = 1, dt = 0) => { if (t != null) CUES.push([+(+t).toFixed(3), k, n, dt]); return t; };
const NLT = []; window.__NLT = NLT;          // [scene, start time] for ncheck / phrase report
function NEXT(sel, ph) {
  if (sel === NLCUR) nwErr(`NEXT('${sel}') but ${sel} is already showing`);
  if (NLSC.indexOf(sel) < 0) nwErr(`NEXT('${sel}') - scene not listed in nwBegin([...])`);
  const prev = NLT.length ? NLT[NLT.length - 1][1] : HEAD, t = nlNext(sel, ph);
  if (t <= prev + .05) nwErr(`scene ${sel} start phrase '${ph}' not found or not after the previous scene (t=${t.toFixed(2)})`);
  NLT.push([sel, t]); return CUE(t, 'whoosh');
}
function nwSetup(s, o = {}) {
  NWB.channel = o.channel || ''; NWB.date = o.date || '';
  if (!NWB.channel) nwErr("nwSetup(s, { channel: '...', date: '...' }) - channel name missing");
  if (NWB.channel.length > 24 || /[^\x20-\x7e]/.test(NWB.channel)) nwErr('channel name: plain ASCII, at most 24 characters (it is typed in the intro)');
  if (!NWB.date) nwErr("nwSetup: the episode date is missing (e.g. date: '16 Oct 2026')");
  nlInit(s);
  const css = document.createElement('style'); css.textContent = `
  .nwmk{position:relative;display:inline-block}
  .nwmb{position:absolute;left:-6px;right:-6px;bottom:4px;height:42%;background:${NL.out};opacity:.38;border-radius:5px;transform-origin:0 50%}`;
  document.head.appendChild(css); nwIntro(s); nwOutro(s); return s;
}
function nwBegin(scs) {
  nwIntroBeats(); nlStart(scs); NLT.push([scs[0], HEAD]);
  const all = [...document.querySelectorAll('.nsc')].map(e => '#' + e.id);
  all.forEach(sc => { if (scs.indexOf(sc) < 0) nwErr(`scene ${sc} exists but is missing from nwBegin([...])`); });
  const n = NWSTORY.length; if (!n) nwErr('no nwStory(...) - every story starts with a story opener');
  NWSTORY.forEach(([id, k, nn, sc], i) => { if (k !== i + 1 || nn !== n) nwErr(`nwStory('${id}') is story ${k} of ${nn}, expected ${i + 1} of ${n} (number them 1..n in order)`);
    if (i && scs.indexOf('#' + sc) <= scs.indexOf('#' + NWSTORY[i - 1][3])) nwErr(`nwStory('${id}') is not in a later scene than story ${i}`); });
  const cn = document.getElementById('nwIn'); if (cn) cn.textContent = n;
  NLHL.forEach(h => tl.set('#' + h, { autoAlpha: 0 }, 0));
  CUE(.15, 'whoosh'); CUE(.45, 'type', NWB.channel.length + 2, .045); CUE(1.6, 'chime');
}
function nwFinish() {
  if (NLCUR !== NLSC[NLSC.length - 1]) nwErr(`video ends on ${NLCUR}, not on the last scene ${NLSC[NLSC.length - 1]} (a NEXT is missing)`);
  OUT(NLCUR, END + .1, { d: .3 }); nwOutroBeats(); CUE(END + .2, 'whoosh'); CUE(END + .6, 'type', 19, .045); CUE(END + 2.4, 'chime');
}

// ---- real pages: screenshot inside a browser window + scroll/zoom focus, highlight box, cursor + click ----
// nlShot(par,id,x,y,w,h,src,url,nw,nh): src = 'assets/<file>.png', nw/nh = the image's real pixel size (python3 -c "from PIL import Image; print(Image.open('assets/x.png').size)").
function nlShot(par, id, x, y, w, h, src, url, nw, nh) {
  const e = nlWin(par, id, x, y, w, h, NL.model, url), vh = h - 50, ih = Math.round(w * nh / nw);
  const vp = D(e, '', `position:absolute;left:0;top:50px;width:${w}px;height:${vh}px;overflow:hidden;background:#0d1117`, id + 'vp');
  D(vp, `<img src="${src}" style="width:${w}px;height:${ih}px;display:block">`, `position:absolute;left:0;top:0;width:${w}px;height:${ih}px;transform-origin:0 0`, id + 'im');
  e.dataset.vw = w; e.dataset.vh = vh; e.dataset.ih = ih; return e;
}
// SHOT_FOCUS(id,t,px,py,s,d): bring image point (px,py) (px of the image as shown at scale 1) to the centre of the window at zoom s. s=1 = plain scroll.
function SHOT_FOCUS(id, t, px, py, s = 1, d = 1.1) {
  const e = document.getElementById(id), vw = +e.dataset.vw, vh = +e.dataset.vh, ih = +e.dataset.ih;
  const x = Math.min(0, Math.max(vw - vw * s, vw / 2 - px * s)), y = Math.min(0, Math.max(vh - ih * s, vh / 2 - py * s));
  return TO('#' + id + 'im', t, { x, y, scale: s, duration: d, ease: 'power2.inOut' });
}
// highlight box on the image (moves with scroll/zoom). Hidden at 0 automatically; POP('#hid', t) to show.
const NLHL = [];
const nlShotHL = (id, hid, px, py, w, h, c = NL.out) => { NLHL.push(hid); return D(document.getElementById(id + 'im'), '', `position:absolute;left:${px}px;top:${py}px;width:${w}px;height:${h}px;border:4px solid ${c};border-radius:10px;box-shadow:0 0 22px ${c},inset 0 0 18px ${c}55`, hid); };
// mouse cursor: nlCursor(par,id,x,y) ; CURSOR(id,t,x,y,d) moves its tip to (x,y) ; CLICK(id,t) ring + press. Show it with nlShow('#id', t).
function nlCursor(par, id, x, y) {
  const e = D(par, `<svg width="44" height="54" viewBox="0 0 22 27"><path d="M2 2 L2 22 L7.5 17 L11 25 L14.5 23.5 L11 15.5 L18 15.5 Z" fill="#fff" stroke="#05070d" stroke-width="1.6" stroke-linejoin="round"/></svg>`, `position:absolute;left:${x - 4}px;top:${y - 4}px;width:44px;height:54px;z-index:6;filter:drop-shadow(0 4px 6px #000)`, id);
  D(par, '', `position:absolute;left:${x - 22}px;top:${y - 22}px;width:44px;height:44px;border-radius:50%;border:3px solid ${NL.out};z-index:5`, id + 'r');
  NLHL.push(id + 'r'); e.dataset.x = x; e.dataset.y = y; return e;
}
function CURSOR(id, t, x, y, d = .8) { const e = document.getElementById(id), dx = x - +e.dataset.x, dy = y - +e.dataset.y; TO(['#' + id, '#' + id + 'r'], t, { x: dx, y: dy, duration: d, ease: 'power2.inOut' }); return t + d; }
function CLICK(id, t) { B(t); CUE(t, 'blip'); tl.fromTo('#' + id + 'r', { autoAlpha: 1, scale: .3 }, { autoAlpha: 0, scale: 1.6, duration: .45, ease: 'power2.out' }, t); tl.to('#' + id, { scale: .85, duration: .08, yoyo: true, repeat: 1, transformOrigin: '10% 10%' }, t); return t + .45; }
