// ===================== PREMIUM LIBRARY (one continuous world + camera) =====================
// Build: cat ~/hf-kit/premium.js ~/hf-kit/life.js video.js > all.js && python3 ~/hf-kit/build.py all.js <audio>
// colour language (keep it fixed for the whole video and say it with the visuals, not with text)
const P = { ctx: '#60a5fa', tgt: '#fbbf24', emb: '#34d399', pred: '#a78bfa', bad: '#f87171', ink: '#e8eefc', dim: '#64748b', skin: '#f2c29b', hair: '#5b3a29', ball: '#ef4444' };
function grad(defs, id, stops, x2 = 0, y2 = 1) { const g = S('linearGradient', { id, x1: 0, y1: 0, x2, y2 }, defs); stops.forEach(([o, c, a]) => S('stop', { offset: o, 'stop-color': c, 'stop-opacity': a ?? 1 }, g)); }
function rgrad(defs, id, c, a = .6) { const g = S('radialGradient', { id }, defs); S('stop', { offset: 0, 'stop-color': c, 'stop-opacity': a }, g); S('stop', { offset: 1, 'stop-color': c, 'stop-opacity': 0 }, g); }
function wtext(g, x, y, txt, size, fill, anchor = 'middle', weight = 800, id) { const t = S('text', Object.assign({ x, y, 'text-anchor': anchor, 'font-size': size, 'font-weight': weight, fill, 'font-family': 'Poppins' }, id ? { id } : {}), g); t.textContent = txt; return t; }
function pill(par, x, y, txt, bg, fg, id, fs = 30) { const g = S('g', { id }, par); const w = txt.length * fs * .6 + 50; S('rect', { x: x - w / 2, y: y - fs * .95, width: w, height: fs * 1.9, rx: fs * .95, fill: bg }, g); wtext(g, x, y + fs * .35, txt, fs, fg, 'middle', 700); return g; }
function XM(par, cx, cy, r, id) { const g = S('g', { id }, par); S('path', { d: `M${cx - r} ${cy - r} L${cx + r} ${cy + r} M${cx + r} ${cy - r} L${cx - r} ${cy + r}`, stroke: P.bad, 'stroke-width': Math.max(8, r * .2), 'stroke-linecap': 'round' }, g); return g; }
function QM(par, cx, cy, size, col, id) { const g = S('g', { id }, par); wtext(g, cx, cy + size * .36, '?', size, col, 'middle', 800); return g; }
const rnd = i => { const v = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return v - Math.floor(v); };   // deterministic "random"
// LONG = 1920x1080 frame, SHORT (VERT, build.py --short) = 1080x1920 frame. FW/FH = frame size.
const FW = (typeof VERT !== 'undefined' && VERT) ? 1080 : 1920, FH = FW === 1080 ? 1920 : 1080;
const AO = i => FW === 1080 ? [(i % 4) * 1500, Math.floor(i / 4) * 2400] : [(i % 4) * 2400, Math.floor(i / 4) * 1400];   // area i origin; each area is a FWxFH "room" of the world
// ---- phrase timing relative to the current area: go('first words of area') sets ST; W('later words') looks from ST on
let ST = 0;
const go = p => { const t = findp(p, ST - .06); if (t !== null) ST = t; return ST; };
const W = p => { const t = findp(p, ST - .06); return t === null ? ST : t; };
// ---- camera on #world (transformOrigin 0 0): centre (cx,cy) at zoom z. Visible half-size = 960/z x 540/z.
const CAM = (t, cx, cy, z, d = 1.3, e = 'power3.inOut') => { tl.to('#world', { x: FW / 2 - cx * z, y: FH / 2 - cy * z, scale: z, duration: d, ease: e }, t); if (typeof FGP === 'function') FGP(t, cx, cy, d, e); B(t); };
const CUT = (t, cx, cy, z) => { tl.set('#world', { x: FW / 2 - cx * z, y: FH / 2 - cy * z, scale: z }, t); if (typeof FGP === 'function') FGP(t, cx, cy); };   // area change = CUT zoomed-in, then CAM out ("cut + push")
// ---- hidden-until-cue elements: hid(el) at build, tl.set(HID,{autoAlpha:0},0) first thing in beats; DR = draw-on that also un-hides
const HID = []; const hid = e => { HID.push(e); return e; };
const hidId = id => hid(document.getElementById(id));
const DR = (sel, t, o) => { tl.set(sel, { autoAlpha: 1 }, t); return DRAW(sel, t, o); };
const ARW = (par, x1, y1, x2, y2, col, id, w = 6) => S('path', { id, class: 'draw', d: arrowD(x1, y1, x2, y2, 20), stroke: col, 'stroke-width': w, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, par);
const CRV = (par, d, col, id, w = 6) => S('path', { id, class: 'draw', d, stroke: col, 'stroke-width': w, fill: 'none', 'stroke-linecap': 'round' }, par);
// ---- world setup: call first inside the custom build. cols x rows areas. BG group is BELOW content group G.
function makeWorld(s, cols = 4, rows = 2) {
  const world = H('div', 'a', `left:0;top:0;width:${FW}px;height:${FH}px`, null, s, 'world');
  const sv = S('svg', { width: cols * 2400, height: rows * 1400, viewBox: `0 0 ${cols * 2400} ${rows * 1400}`, style: 'position:absolute;left:0;top:0;overflow:visible' }, world);
  const defs = S('defs', {}, sv);
  grad(defs, 'gTech', [[0, '#0b1226'], [1, '#111a33']]); grad(defs, 'gWall', [[0, '#25305a'], [1, '#161d38']]); grad(defs, 'gFloor', [[0, '#4a3426'], [1, '#2a1d15']]);
  grad(defs, 'gSky', [[0, '#7dd3fc'], [1, '#e0f2fe']]); grad(defs, 'gGrass', [[0, '#16a34a'], [1, '#14532d']]); grad(defs, 'gBlue', [[0, '#1e3a8a'], [1, '#0b1226']]); grad(defs, 'gCone', [[0, '#fde68a', .4], [1, '#fde68a', 0]]);
  rgrad(defs, 'gNet', P.ctx, .45); rgrad(defs, 'gBulb', '#fde68a', .55); rgrad(defs, 'gEmb', P.emb, .5); rgrad(defs, 'gLamp', '#fcd34d', .35);
  const sh = S('filter', { id: 'fSh', x: '-20%', y: '-20%', width: '140%', height: '140%' }, defs); S('feDropShadow', { dx: 0, dy: 12, stdDeviation: 12, 'flood-color': '#000', 'flood-opacity': .45 }, sh);
  const pat = S('pattern', { id: 'pGrid', width: 64, height: 64, patternUnits: 'userSpaceOnUse' }, defs); S('path', { d: 'M64 0 L0 0 0 64', stroke: 'rgba(148,163,184,.07)', 'stroke-width': 2, fill: 'none' }, pat);
  const hat = S('pattern', { id: 'pHatch', width: 18, height: 18, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, defs); S('rect', { width: 18, height: 18, fill: '#78350f' }, hat); S('rect', { width: 8, height: 18, fill: P.tgt, opacity: .55 }, hat);
  const BG = S('g', {}, sv); const G = S('g', {}, sv);
  // dark technical floor for an area, with 240/160 px margins so a zoomed camera never shows void
  const techBg = (ox, oy, h = 1080) => { S('rect', { x: ox - 240, y: oy - 160, width: 2400, height: h + 320, fill: 'url(#gTech)' }, BG); S('rect', { x: ox - 240, y: oy - 160, width: 2400, height: h + 320, fill: 'url(#pGrid)' }, BG); };
  return { world, sv, defs, BG, G, techBg };
}
// ---- technical pieces
function nnet(par, cx, cy, w, h, layers, col, id) {   // nodes get glow circles with class id+'g'+layer -> fire()
  const g = S('g', { id }, par); const pts = layers.map((n, li) => Array.from({ length: n }, (_, k) => [cx - w / 2 + li * w / (layers.length - 1), cy - h / 2 + (k + .5) * h / n]));
  for (let li = 0; li < pts.length - 1; li++) pts[li].forEach(a => pts[li + 1].forEach(b => S('path', { d: `M${a[0]} ${a[1]} L${b[0]} ${b[1]}`, stroke: col, 'stroke-opacity': .22, 'stroke-width': 2 }, g)));
  const r = Math.min(18, h / Math.max(...layers) * .26);
  pts.forEach((L, li) => L.forEach(p => { S('circle', { cx: p[0], cy: p[1], r, fill: '#0b1020', stroke: col, 'stroke-width': 4 }, g); S('circle', { class: id + 'g' + li, cx: p[0], cy: p[1], r: r * .62, fill: col }, g); }));
  return g;
}
const fire = (id, nL, t, gap = .18, rep = 1) => { for (let li = 0; li < nL; li++) tl.fromTo('.' + id + 'g' + li, { autoAlpha: .15 }, { autoAlpha: 1, duration: .2, yoyo: true, repeat: rep, ease: 'sine.inOut' }, t + li * gap); };   // signal wave through layers (use odd rep so it ends dim)
function encT(par, x, y, w, h, col, label, id) { const g = S('g', { id }, par); S('path', { d: `M${x} ${y} L${x + w} ${y + h * .28} L${x + w} ${y + h * .72} L${x} ${y + h} Z`, fill: col, 'fill-opacity': .16, stroke: col, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
  for (let k = 0; k < 3; k++) { const xx = x + w * (.22 + k * .26), hh = h * (1 - .56 * (xx - x) / w) * .7; S('rect', { x: xx - 7, y: y + h / 2 - hh / 2, width: 14, height: hh, rx: 7, fill: col, opacity: .55 }, g); }
  if (label) wtext(g, x + w / 2, y + h + 42, label, 28, col, 'middle', 700); return g; }   // encoder = trapezoid (wide in -> narrow out)
function vecG(par, x, y, vals, col, id, c = 56) { const g = S('g', { id }, par); vals.forEach((v, k) => S('rect', { x: x + k * (c + 6), y, width: c, height: c, rx: 10, fill: col, 'fill-opacity': .18 + .45 * Math.min(1, Math.abs(v) / 2), stroke: col, 'stroke-width': 3 }, g));
  const nt = S('g', { id: id + 'N' }, g); vals.forEach((v, k) => wtext(nt, x + k * (c + 6) + c / 2, y + c / 2 + 7, (v > 0 ? '' : '-') + Math.abs(v).toFixed(1), c * .34, '#f8fafc', 'middle', 700)); return g; }   // embedding vector; numbers in id+'N'
function pixImg(par, x, y, cols, rows, cell, id, colFn) { const g = S('g', { id }, par); const cells = [];   // picture as pixels: colFn(u,v) with u,v in 0..1
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const col = colFn((c + .5) / cols, (r + .5) / rows); cells.push({ c, r, col, el: S('rect', { x: x + c * cell, y: y + r * cell, width: cell - 2, height: cell - 2, rx: 2, fill: col }, g) }); }
  return { g, cells }; }
function card(par, x, y, w, h, id, bg = '#f8fafc') { const g = S('g', { id, filter: 'url(#fSh)' }, par); S('rect', { x, y, width: w, height: h, rx: 18, fill: bg }, g); return g; }
function bulb(par, cx, cy, s, id) { const g = S('g', { id }, par); S('circle', { cx, cy, r: 110 * s, fill: 'url(#gBulb)' }, g); S('circle', { cx, cy, r: 46 * s, fill: '#fde68a' }, g); S('rect', { x: cx - 20 * s, y: cy + 40 * s, width: 40 * s, height: 30 * s, rx: 6 * s, fill: '#94a3b8' }, g); for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + (k - 2.5) * .5; S('path', { d: `M${cx + Math.cos(a) * 64 * s} ${cy + Math.sin(a) * 64 * s} L${cx + Math.cos(a) * 92 * s} ${cy + Math.sin(a) * 92 * s}`, stroke: '#fde68a', 'stroke-width': 7 * s, 'stroke-linecap': 'round' }, g); } return g; }
function person(par, x, y, s, col, id) { const g = S('g', { id }, par); S('circle', { cx: x, cy: y - 230 * s, r: 70 * s, fill: col }, g); S('path', { d: `M${x - 150 * s} ${y} Q${x - 150 * s} ${y - 140 * s} ${x} ${y - 145 * s} Q${x + 150 * s} ${y - 140 * s} ${x + 150 * s} ${y} Z`, fill: col }, g); return g; }   // generic silhouette (use for real people — never draw a likeness)
function ballG(par, cx, cy, r, id, idR) { const g = S('g', id ? { id } : {}, par); const R = S('g', idR ? { id: idR } : {}, g); S('circle', { cx, cy, r, fill: P.ball }, R); S('path', { d: `M${cx - r} ${cy} Q${cx} ${cy - r * .5} ${cx + r} ${cy}`, stroke: '#fff', 'stroke-width': r * .16, fill: 'none' }, R); S('circle', { cx: cx - r * .35, cy: cy - r * .4, r: r * .18, fill: '#fff', opacity: .5 }, R); return g; }   // move id with x, spin idR with rotation+transformOrigin 50% 50%
function wordC(par, cx, cy, size, word, cols, id) { const g = S('g', { id }, par); word.split('').forEach((ch, i) => { const L = S('g', { id: id + i }, g); wtext(L, cx + (i - (word.length - 1) / 2) * size * .72, cy, ch, size, cols[i % cols.length], 'middle', 800); }); return g; }   // coloured title letters id+i
