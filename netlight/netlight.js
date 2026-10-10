// ===================== NETLIGHT ML  (neon-tech UI look for DS / ML / AI explainers) =====================
// Build:  python3 ~/hf-kit/netlight/nlbuild.py video.js audio.m4a [index.html]     (cats premium.js + life.js + this + video.js, HEAD 2.6 / TAIL 3.6)
// Look:   navy-black bg + faint grid, glowing windows/chips, mono labels. Titles = Space Grotesk, body = Inter, code/labels = JetBrains Mono.
// Colour = meaning (never decoration):  DATA green · MODEL blue · OUTPUT yellow · ERROR pink · ACCENT purple = ONLY the <b> word in a title.
// Signature: the Model ORB (neuron cluster with 2 eyes = the model / host) + the CARET (green typing cursor = narrator).
// RULE #1: SHOW, DON'T WRITE. Every scene has a moving visual (net, curve, matrix, dots, loop, code...). Text = 1-4 word labels. Voice says the sentences.
const NL = { bg: '#05070d', data: '#34e0b0', model: '#6cc8ff', out: '#ffcc4d', err: '#ff6b81', acc: '#b48cff', ink: '#eef2f6', dim: '#8e9aae', line: 'rgba(255,255,255,.09)' };
const NLMONO = "'JetBrains Mono','DejaVu Sans Mono',monospace", NLHEAD = "'Space Grotesk',Inter,sans-serif", NLBODY = "Inter,'Space Grotesk',sans-serif";
const NLX = (c, sz = 26) => `<svg width="${sz}" height="${sz}" viewBox="0 0 26 26"><path d="M6 6L20 20M20 6L6 20" stroke="${c}" stroke-width="4" stroke-linecap="round"/></svg>`;
const NLOK = (c, sz = 26) => `<svg width="${sz}" height="${sz}" viewBox="0 0 26 26"><path d="M5 14L11 19L21 7" stroke="${c}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const NLUSR = (c, sz = 38) => `<svg width="${sz}" height="${sz}" viewBox="0 0 38 38"><circle cx="19" cy="14" r="7" stroke="${c}" stroke-width="3" fill="none"/><path d="M6 33c2-8 8-11 13-11s11 3 13 11" stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`;

// ---------- css + layers (call FIRST in build) ----------
function nlInit(s) {
  const css = document.createElement('style'); css.textContent = `
  #root{background:radial-gradient(1100px 650px at 50% -10%,#0f1a33 0%,transparent 65%),${NL.bg}!important;font-family:${NLBODY}}
  .orb{display:none!important} .grid-bg{background-image:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)!important}
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
// orb beats (all add a beat): assemble with eyes opening / blink / think (nodes ripple) / look (eyes shift dx px) / bounce / surprised / sleep
function ORB_ON(id, t) { B(t); tl.set('#' + id, { autoAlpha: 1 }, t); tl.set('#' + id + 'E', { autoAlpha: 0 }, t); tl.fromTo('.' + id + 'n', { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: .25, stagger: .006 }, t); tl.fromTo(['#' + id + 'l', '#' + id + 'g'], { opacity: 0 }, { opacity: 1, duration: .4 }, t + .3); tl.set('#' + id + 'E', { autoAlpha: 1 }, t + .7); tl.fromTo('#' + id + 'E', { scaleY: .1, transformOrigin: '50% 50%' }, { scaleY: 1, duration: .15 }, t + .7); return t + .85; }
function ORB_BLINK(id, t) { B(t); return tl.to('#' + id + 'E', { scaleY: .1, transformOrigin: '50% 50%', duration: .07, yoyo: true, repeat: 1 }, t); }
function ORB_THINK(id, t, d = 1.2) { B(t); return tl.to('.' + id + 'n', { scale: 1.7, transformOrigin: '50% 50%', duration: .18, yoyo: true, repeat: 1, stagger: d / 46 }, t); }
function ORB_LOOK(id, t, dx = 0, dy = 0) { B(t); return tl.to('#' + id + 'E', { x: dx, y: dy, duration: .3, ease: 'power2.inOut' }, t); }
function ORB_BOUNCE(id, t, n = 2) { B(t); return tl.to('#' + id, { y: -16, duration: .22, yoyo: true, repeat: n * 2 - 1, ease: 'sine.inOut' }, t); }
function ORB_WOW(id, t) { B(t); tl.to('#' + id + 'E', { scaleY: 1.35, scaleX: 1.2, transformOrigin: '50% 50%', duration: .15 }, t); tl.to('#' + id + 'E', { scaleY: 1, scaleX: 1, duration: .3 }, t + .9); return PULSE('#' + id, t, { s: 1.08 }); }
function ORB_SLEEP(id, t) { B(t); tl.set('#' + id + 'E', { autoAlpha: 0 }, t); tl.set('#' + id + 'C', { autoAlpha: 1 }, t); return tl.to('#' + id + 'N', { opacity: .45, duration: .6 }, t); }

// ---------- CARET: typed mono text with the green block cursor. nlType(par,id,x,y,txt,fs,col) ; TYPE(id,t,dt) types it (returns end time) ; CARET(id,t,n) blinks n times ----------
function nlType(par, id, x, y, txt, fs = 34, col = NL.ink) { const n = [...txt].length, cw = fs * .6;   // mono: every char is .6 em wide, so the caret can sit right after the last typed char
  const e = D(par, [...txt].map(ch => `<span class="nchar ${id}c">${ch}</span>`).join('') + `<span id="${id}k" class="ncar" style="position:absolute;left:${n * cw + 6}px;top:${fs * .05}px;width:${fs * .5}px;height:${fs * 1.05}px"></span>`, `position:absolute;left:${x}px;top:${y}px;font:700 ${fs}px ${NLMONO};line-height:${fs * 1.15}px;height:${fs * 1.15}px;color:${col};white-space:nowrap`, id, 'ncode'); e.dataset.cw = cw; return e; }
function TYPE(id, t, dt = .055) { B(t); const e = document.getElementById(id), cw = +e.dataset.cw, cs = e.querySelectorAll('.' + id + 'c'), n = cs.length; tl.set(e, { autoAlpha: 1 }, t); tl.set('#' + id + 'k', { x: -n * cw }, 0);
  cs.forEach((c, i) => { tl.set(c, { autoAlpha: 0 }, 0); tl.set(c, { autoAlpha: 1 }, t + i * dt); tl.set('#' + id + 'k', { x: -(n - i - 1) * cw }, t + i * dt); }); return t + n * dt; }
function CARET(id, t, n = 2) { for (let i = 0; i < n; i++) { tl.set('#' + id + 'k', { autoAlpha: 0 }, t + i * .5); tl.set('#' + id + 'k', { autoAlpha: 1 }, t + i * .5 + .25); } B(t); return t + n * .5; }
// narrator line at the bottom-left of a scene ("> step 2: train"): nlCmd(scene, id, txt) then TYPE(id, t)
const nlCmd = (par, id, txt) => nlType(par, id, 80, 990, '> ' + txt, 28, NL.dim);

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
// INTRO A "Boot" (0..HEAD = 2.6 s, before the voice) and OUTRO A "Sleep" (END .. END+TAIL).  Build both in build(s); call the beats inside beats.
// =====================================================================================================
const NLNAME = 'netlight.ml';
function nlIntro(s) { const e = D(stage, '', `position:absolute;inset:0;z-index:30;background:radial-gradient(1100px 650px at 50% -10%,#0f1a33 0%,transparent 65%),${NL.bg}`, 'nlI');
  nlOrb(e, 'nlIo', 560, 540, 170); nlType(e, 'nlIt', 800, 498, '> ' + NLNAME, 72); return e; }
function nlIntroBeats() { tl.set('#nlIo', { autoAlpha: 0 }, 0); tl.set('#nlIt', { autoAlpha: 1 }, 0); CARET('nlIt', 0, 1); TYPE('nlIt', .4, .05); ORB_ON('nlIo', 1.0); PULSE('#nlIo', 1.9, { s: 1.06 }); tl.to('#nlI', { autoAlpha: 0, duration: .35 }, HEAD - .4); }
function nlOutro(s) { const e = D(stage, '', `position:absolute;inset:0;z-index:30;background:radial-gradient(1100px 650px at 50% -10%,#0f1a33 0%,transparent 65%),${NL.bg}`, 'nlO');
  nlOrb(e, 'nlOo', 960, 400, 170); const txt = '> subscribe --next'; nlType(e, 'nlOt', Math.round(960 - txt.length * 60 * .6 / 2), 700, txt, 60); return e; }
function nlOutroBeats() { const t = END + .2; tl.set('#nlO', { autoAlpha: 0 }, 0); tl.set('#nlOt', { autoAlpha: 0 }, 0); tl.set('#nlOoC', { autoAlpha: 0 }, 0); FADE('#nlO', t, { d: .4 }); ORB_BOUNCE('nlOo', t + .3, 2); const te = TYPE('nlOt', t + .5, .045); CARET('nlOt', te + .1, 2);
  ORB_SLEEP('nlOo', t + 2.4); tl.to('#nlO', { opacity: 0, duration: .5 }, END + TAIL - .6); tl.set({}, {}, END + TAIL); }
