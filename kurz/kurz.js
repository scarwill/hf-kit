// ===================== KURZ KIT: Kurzgesagt-like flat look (load AFTER the video kit, BEFORE organs.js) =====================
// cat premium illus life helpers icons scenes extras kurz/kurz.js kurz/organs.js video.js > all.js
// Look: no outlines, every shape shaded (core shadow bottom-right + highlight top-left + rim light), one light source per area,
// layered backgrounds (sky gradient, light glow + rays, 3 hill layers) with automatic PARALLAX on every camera move,
// blurred foreground silhouettes, saturated objects on a darker world, small detail clusters, constant gentle motion.
const KC = { light: '#ffd166', cell: '#2ec4b6', lit: '#d9fff6', void: '#0b0820', pink: '#ff5d8f', brain: '#ff8fb8', brainD: '#e0628f', dot: '#ff5a5f', nerve: '#f3b562', nerveD: '#d9933f', ink: '#1f2a44' };
// area palettes: kWorld(BG, defs, ox, oy, 'night') — top/bot sky, glow = light colour, hills back->front, acc = accent for this area, lx/ly = light position (LONG frame coords)
const KPAL = {
  night: { top: '#2b2072', bot: '#0b0a26', glow: '#9a86ff', hills: ['#251c63', '#1c1550', '#130f3a'], acc: '#ffd166', lx: 1750, ly: 40 },
  ocean: { top: '#14506a', bot: '#061722', glow: '#5ee6d0', hills: ['#0f3f52', '#0b3142', '#072230'], acc: '#5ee6d0', lx: 1500, ly: 120 },
  body: { top: '#4a1450', bot: '#14061c', glow: '#ffb38a', hills: [], acc: '#ff5d8f', lx: 60, ly: 540 },
  flesh: { top: '#5c1840', bot: '#1c0614', glow: '#ff9ab8', hills: ['#4a1236', '#380d29', '#26081c'], acc: '#ff5d8f', lx: 1700, ly: 100 },
  space: { top: '#0f1d40', bot: '#03060f', glow: '#4cc9f0', hills: [], stars: 140, acc: '#4cc9f0', lx: 1650, ly: 160 },
  deep: { top: '#10264a', bot: '#050c1a', glow: '#4cc9f0', hills: ['#0e2d4f', '#0a2340', '#071a30'], acc: '#4cc9f0', lx: 300, ly: 60 },
  dusk: { top: '#1d2366', bot: '#0a0c2a', glow: '#7aa2ff', hills: ['#171a52', '#11143f', '#0c0e30'], acc: '#ffd166', lx: 1700, ly: 80 },
  forest: { top: '#1e5a46', bot: '#071a12', glow: '#ffe08a', hills: ['#1b4b38', '#123a2a', '#0b281c'], acc: '#ffd166', lx: 1600, ly: 70 },
  sunset: { top: '#3b1d6e', bot: '#ff8a5b', glow: '#ffd166', hills: ['#5b2a7a', '#421d5e', '#2b1042'], acc: '#ffd166', lx: 960, ly: 760 },
  desert: { top: '#2d4a8a', bot: '#f4a259', glow: '#fff1b8', hills: ['#c06b3e', '#9a4f2c', '#73381e'], acc: '#fff1b8', lx: 1500, ly: 200 },
  lab: { top: '#123a5c', bot: '#06121f', glow: '#22d3ee', hills: ['#0f3350', '#0b2840', '#071d30'], acc: '#22d3ee', lx: 1700, ly: 60 },
};
const kDeg = a => a * Math.PI / 180;
const kArc = (cx, cy, r, a0, a1) => { const p = a => `${(cx + r * Math.cos(kDeg(a))).toFixed(1)} ${(cy + r * Math.sin(kDeg(a))).toFixed(1)}`; return `M${p(a0)} A${r} ${r} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} 1 ${p(a1)}`; };
const kPt = (cx, cy, r, a) => [cx + r * Math.cos(kDeg(a)), cy + r * Math.sin(kDeg(a))];
let _k2 = 0; const kUid = p => p + (++_k2);
const kDefs = par => (par.ownerSVGElement || par).querySelector('defs');
function kRG(defs, stops, cx = '50%', cy = '50%', r = '50%') { const id = kUid('krg'); const g = S('radialGradient', { id, cx, cy, r }, defs); stops.forEach(([o, c, a]) => S('stop', { offset: o, 'stop-color': c, 'stop-opacity': a ?? 1 }, g)); return `url(#${id})`; }
function kLG(defs, stops, x2 = 0, y2 = 1) { const id = kUid('klg'); grad(defs, id, stops, x2, y2); return `url(#${id})`; }
function kClip(defs, el) { const id = kUid('kcp'); const c = S('clipPath', { id }, defs); c.appendChild(el.cloneNode()); return `url(#${id})`; }
// colour maths: kMix('#ff0000', '#0000ff', .3) -> 30% of the way; kDark(c, .3) / kLite(c, .3)
const kHex = c => { c = c.replace('#', ''); if (c.length === 3) c = c.split('').map(x => x + x).join(''); return [0, 2, 4].map(i => parseInt(c.substr(i, 2), 16)); };
const kMix = (a, b, f) => { const A = kHex(a), B = kHex(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * f).toString(16).padStart(2, '0')).join(''); };
const kDark = (c, f = .35) => kMix(c, '#0a0614', f), kLite = (c, f = .45) => kMix(c, '#ffffff', f);

// ---------- shading (the core of the look) ----------
// shaded ball: base + core shadow (bottom-right) + highlight (top-left) + optional rim light. dark/lite default from base.
function kBall(par, cx, cy, r, base, dark, lite, id, rim) {
  dark = dark || kDark(base); lite = lite || kLite(base);
  const g = S('g', id ? { id } : {}, par), d = kDefs(par);
  const b = S('circle', { cx, cy, r, fill: base }, g); const cl = S('g', { 'clip-path': kClip(d, b) }, g);
  S('circle', { cx: cx + r * .42, cy: cy + r * .42, r: r * 1.05, fill: dark, opacity: .55 }, cl);
  S('circle', { cx: cx - r * .28, cy: cy - r * .3, r: r * .62, fill: lite, opacity: .55 }, cl);
  if (rim) S('path', { d: kArc(cx, cy, r - 5, 20, 110), stroke: rim, 'stroke-width': Math.max(4, r * .06), fill: 'none', 'stroke-linecap': 'round', opacity: .8 }, g);
  return g;
}
// shade ANY shape already in the DOM (path/rect/ellipse): adds core shadow + highlight clipped to it. Call right after drawing it.
function kShade(par, el, dark, lite, k = 1) {
  const base = el.getAttribute('fill') || '#888'; dark = dark || kDark(base); lite = lite || kLite(base);
  const bb = el.getBBox(), d = kDefs(par), cl = S('g', { 'clip-path': kClip(d, el) }, par), r = Math.max(bb.width, bb.height);
  S('ellipse', { cx: bb.x + bb.width * (.5 + .45 * k), cy: bb.y + bb.height * (.5 + .45 * k), rx: r * .75, ry: r * .75, fill: dark, opacity: .5 }, cl);
  S('ellipse', { cx: bb.x + bb.width * .28, cy: bb.y + bb.height * .22, rx: bb.width * .3, ry: bb.height * .22, fill: lite, opacity: .45 }, cl);
  return cl;
}
// organic blob (cells, rocks, islands): wob 0..1 = how lumpy, seed = shape
function kBlobD(cx, cy, r, wob = .25, seed = 1, n = 9, sy = 1) { const P = []; for (let k = 0; k < n; k++) { const a = k / n * Math.PI * 2, rr = r * (1 + wob * (rnd(seed * 17 + k) - .5)); P.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * sy]); }
  const m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; let s = m(P[n - 1], P[0]), dd = `M${s[0].toFixed(1)} ${s[1].toFixed(1)}`;
  for (let k = 0; k < n; k++) { const q = m(P[k], P[(k + 1) % n]); dd += ` Q${P[k][0].toFixed(1)} ${P[k][1].toFixed(1)} ${q[0].toFixed(1)} ${q[1].toFixed(1)}`; } return dd + ' Z'; }
function kBlob(par, cx, cy, r, base, id, o = {}) { const g = S('g', id ? { id } : {}, par); const p = S('path', { d: kBlobD(cx, cy, r, o.wob ?? .25, o.seed ?? 1, o.n ?? 9, o.sy ?? 1), fill: base }, g); kShade(g, p, o.dark, o.lite); return g; }
// soft light glow (no blur filter needed)
function kGlow(par, cx, cy, r, col, a = .45, id) { return S('circle', Object.assign({ cx, cy, r, fill: kRG(kDefs(par), [[0, col, a], [.5, col, a * .3], [1, col, 0]]) }, id ? { id } : {}), par); }

// ---------- world: one painted, clipped area per topic ----------
// kWorld(BG, defs, ox, oy, 'night' | {top,bot,glow,hills,lx,ly,stars}, o) -> { R (area group), lx, ly (absolute light position) }
// Hill layers: outer group class kP1/kP2/kP3 (parallax, moved by every camera call) > inner group kD1/kD2/kD3 (idle drift, kLife()).
function kWorld(BG, defs, ox, oy, p, o = {}) {
  p = Object.assign({}, typeof p === 'string' ? KPAL[p] : p, o);
  const L = FW !== 1080, pw = L ? 2400 : 1500, ph = L ? 1400 : 2400, mx = L ? 240 : 210, my = L ? 160 : 240, sx = FW / 1920, sy = FH / 1080;
  const X0 = ox - mx, Y0 = oy - my, cr = S('clipPath', { id: kUid('kroom') }, defs); S('rect', { x: X0, y: Y0, width: pw, height: ph }, cr);
  const R = S('g', { 'clip-path': `url(#${cr.id})` }, BG);
  S('rect', { x: X0, y: Y0, width: pw, height: ph, fill: kLG(defs, [[0, p.top], [1, p.bot]]) }, R);
  const lx = ox + (p.lx ?? 1600) * sx, ly = oy + (p.ly ?? 60) * (L ? 1 : sy * .55);
  if (p.stars) { const st = S('g', { class: 'kStars' }, R); for (let k = 0; k < p.stars; k++) { const x = X0 + rnd(k * 3 + 1) * pw, y = Y0 + rnd(k * 7 + 2) * ph * .8, r = 1.2 + rnd(k * 5 + 3) * 2.6; S('circle', { cx: x, cy: y, r, fill: '#ffffff', opacity: .25 + rnd(k + 9) * .6 }, st); } }
  S('circle', { cx: lx, cy: ly, r: 900 * Math.max(sx, 1), fill: kRG(defs, [[0, p.glow, .45], [.5, p.glow, .12], [1, p.glow, 0]]) }, R);
  if (p.rays !== false) { const rays = S('g', { class: 'kRays', opacity: .9 }, R);
    [-62, -40, -18, 6, 30].forEach((a, k) => { const w = 7 + (k % 2) * 5; const [x1, y1] = kPt(lx, ly, 3200, 180 - a - w / 2 + 90), [x2, y2] = kPt(lx, ly, 3200, 180 - a + w / 2 + 90);
      S('path', { d: `M${lx} ${ly} L${x1} ${y1} L${x2} ${y2} Z`, fill: '#ffffff', opacity: .035 }, rays); }); }
  [300, 480, 680].forEach(r => S('circle', { cx: lx, cy: ly, r, fill: 'none', stroke: p.glow, 'stroke-width': 3, opacity: .08 }, R));
  (p.hills || []).forEach((c, k) => { const P = S('g', { class: 'kP' + (k + 1) }, R), D = S('g', { class: 'kD' + (k + 1) }, P);
    const y = oy + FH * (.74 + k * .083) + (p.hy ?? 0), a = 70 - k * 12, sh = (k * 530 + (p.seed ?? 0) * 211) % 900, xa = X0 - 340, xb = X0 + pw + 340;
    let d = `M${xa} ${Y0 + ph + 200} L${xa} ${y}`; for (let x = xa; x < xb; x += 120) d += ` Q${x + 60} ${y - a * Math.sin((x + sh) / 260)} ${x + 120} ${y - a * .4 * Math.cos((x + sh) / 300)}`;
    d += ` L${xb} ${Y0 + ph + 200} Z`; S('path', { d, fill: c }, D);
    S('path', { d, fill: 'none', stroke: kLite(c, .18), 'stroke-width': 5, opacity: .5, transform: 'translate(0 2)' }, D); });
  return { R, lx, ly };
}
// layer helpers: put props INTO a hill layer so they parallax with it (trees on the far hill, rocks on the near one)
const kLayer = (R, k) => R.querySelector('.kD' + k) || R;

// ---------- parallax: overrides scenes.js FGP, so CAM / CUT / WHIP / ZOOMIN / intro / outro all move the layers ----------
const KPF = [.24, .15, .07];   // back, middle, front hill layer: share of the camera move they follow (far = follows more = looks slower)
function FGP(t, cx, cy, d, e) {
  const px = FW === 1080 ? 1500 : 2400, py = FW === 1080 ? 2400 : 1400, dx = cx - (Math.round((cx - FW / 2) / px) * px + FW / 2), dy = cy - (Math.round((cy - FH / 2) / py) * py + FH / 2);
  const mv = (sel, v) => { if (!document.querySelector(sel)) return; d ? tl.to(sel, Object.assign({ duration: d, ease: e }, v), t) : tl.set(sel, v, t); };
  mv('.fg', { x: -dx * .35, y: -dy * .35 }); KPF.forEach((f, k) => mv('.kP' + (k + 1), { x: dx * f, y: dy * f * .5 })); mv('.kStars', { x: dx * .3, y: dy * .3 });
}
// blurred dark foreground silhouettes at a room's bottom corners (class 'fg' -> parallax + blur). col: darker than the front hill.
function kFgRocks(par, x, y, s = 1, col = '#06040f', flip = 1) { const g = fgG(par); [[0, 0, 170], [flip * 190, 50, 120], [flip * 330, 90, 90]].forEach(([dx, dy, r], k) => S('path', { d: kBlobD(x + dx * s, y + dy * s, r * s, .3, k + 3, 8, .7), fill: col }, g)); return g; }
function kFgPlants(par, x, y, s = 1, col = '#06120c', flip = 1) { const g = fgG(par); for (let k = 0; k < 7; k++) { const bx = x + flip * k * 46 * s, h = (180 + rnd(k + 4) * 160) * s, a = flip * (-24 + k * 9);
  S('path', { d: `M${bx - 18 * s} ${y} Q${bx - 30 * s} ${y - h * .6} ${bx} ${y - h} Q${bx + 30 * s} ${y - h * .6} ${bx + 18 * s} ${y} Z`, fill: col, transform: `rotate(${a} ${bx} ${y})` }, g); } return g; }

// ---------- nature / space props (all shaded, no outlines) ----------
function kCloud(par, cx, cy, s = 1, id, col = '#ffffff', sh = '#cfe0f2') { const g = S('g', Object.assign({ class: 'kCloudD' }, id ? { id } : {}), par);
  S('ellipse', { cx: cx + 6 * s, cy: cy + 36 * s, rx: 110 * s, ry: 14 * s, fill: sh, opacity: .8 }, g);
  [[-62, 12, 44], [-16, -12, 60], [42, 4, 48], [84, 18, 30]].forEach(([dx, dy, r]) => S('circle', { cx: cx + dx * s, cy: cy + dy * s, r: r * s, fill: col }, g));
  S('rect', { x: cx - 104 * s, y: cy + 2 * s, width: 216 * s, height: 40 * s, rx: 20 * s, fill: col }, g);
  S('path', { d: `M${cx - 92 * s} ${cy + 34 * s} L${cx + 100 * s} ${cy + 34 * s}`, stroke: sh, 'stroke-width': 9 * s, 'stroke-linecap': 'round', opacity: .9 }, g); return g; }
function kTree(par, x, y, s = 1, id, o = {}) { const g = S('g', id ? { id } : {}, par), c = o.col || '#2f8a57';
  S('ellipse', { cx: x + 10 * s, cy: y, rx: 70 * s, ry: 11 * s, fill: '#000', opacity: .22 }, g);
  S('rect', { x: x - 11 * s, y: y - 120 * s, width: 22 * s, height: 120 * s, rx: 7 * s, fill: o.trunk || '#7a4b2a' }, g); S('rect', { x: x + 2 * s, y: y - 120 * s, width: 9 * s, height: 120 * s, fill: '#000', opacity: .2 }, g);
  const cn = S('g', { class: 'kSway' }, g);
  kBall(cn, x, y - 170 * s, 70 * s, c); kBall(cn, x - 44 * s, y - 138 * s, 44 * s, kLite(c, .08)); kBall(cn, x + 48 * s, y - 144 * s, 46 * s, kDark(c, .1)); return g; }
function kPine(par, x, y, s = 1, col = '#1f6b4a', id) { const g = S('g', id ? { id } : {}, par); S('rect', { x: x - 8 * s, y: y - 40 * s, width: 16 * s, height: 40 * s, fill: '#5e3820' }, g);
  [[0, 150, 90], [-70, 120, 74], [-130, 92, 56]].forEach(([dy, w, h]) => { const yy = y - 40 * s + dy * s; S('path', { d: `M${x - w * s / 2} ${yy} L${x} ${yy - h * s * 1.5} L${x + w * s / 2} ${yy} Z`, fill: col }, g); S('path', { d: `M${x} ${yy - h * s * 1.5} L${x + w * s / 2} ${yy} L${x} ${yy} Z`, fill: '#000', opacity: .2 }, g); }); return g; }
function kGrass(par, x, y, s = 1, col = '#3fa66b') { const g = S('g', { class: 'kSway' }, par); [-22, -8, 6, 20].forEach((dx, k) => { const h = (40 + (k % 2) * 22) * s; S('path', { d: `M${x + dx * s - 6 * s} ${y} Q${x + dx * s} ${y - h} ${x + dx * s + (k - 1.5) * 8 * s} ${y - h * 1.1} Q${x + dx * s + 4 * s} ${y - h * .5} ${x + dx * s + 6 * s} ${y} Z`, fill: k % 2 ? col : kDark(col, .15) }, g); }); return g; }
function kRock(par, x, y, s = 1, col = '#5b6478', seed = 2) { const g = S('g', {}, par); S('ellipse', { cx: x + 6 * s, cy: y, rx: 70 * s, ry: 10 * s, fill: '#000', opacity: .25 }, g); const p = S('path', { d: kBlobD(x, y - 34 * s, 62 * s, .35, seed, 7, .62), fill: col }, g); kShade(g, p); return g; }
function kMountain(par, x, y, w, h, col = '#3b4a7a', snow = true, id) { const g = S('g', id ? { id } : {}, par);
  S('path', { d: `M${x - w / 2} ${y} L${x} ${y - h} L${x + w / 2} ${y} Z`, fill: col }, g); S('path', { d: `M${x} ${y - h} L${x + w / 2} ${y} L${x + w * .08} ${y} Z`, fill: '#000', opacity: .22 }, g);
  if (snow) S('path', { d: `M${x - w * .14} ${y - h * .72} L${x} ${y - h} L${x + w * .14} ${y - h * .72} L${x + w * .06} ${y - h * .66} L${x} ${y - h * .74} L${x - w * .06} ${y - h * .66} Z`, fill: '#f1f5ff' }, g); return g; }
// planet: o = {ring:'#col', craters:true, bands:true}
function kPlanet(par, cx, cy, r, base, id, o = {}) { const g = S('g', id ? { id } : {}, par), d = kDefs(par);
  kGlow(g, cx, cy, r * 1.6, o.glow || base, .3);
  if (o.ring) S('path', { d: `M${cx - r * 1.7} ${cy + r * .1} A${r * 1.7} ${r * .38} 0 0 1 ${cx + r * 1.7} ${cy - r * .1}`, stroke: o.ring, 'stroke-width': r * .14, fill: 'none', opacity: .9, transform: `rotate(-14 ${cx} ${cy})` }, g);
  const b = S('circle', { cx, cy, r, fill: base }, g), cl = S('g', { 'clip-path': kClip(d, b) }, g);
  if (o.bands) [-.5, -.15, .25, .6].forEach((f, k) => S('ellipse', { cx, cy: cy + f * r, rx: r * 1.1, ry: r * (.08 + (k % 2) * .05), fill: k % 2 ? kLite(base, .25) : kDark(base, .2), opacity: .7 }, cl));
  if (o.craters) [[-.35, -.2, .18], [.25, .3, .13], [.1, -.45, .09], [-.1, .45, .1]].forEach(([a, b2, q]) => { S('circle', { cx: cx + a * r, cy: cy + b2 * r, r: q * r, fill: kDark(base, .25) }, cl); S('circle', { cx: cx + a * r - q * r * .2, cy: cy + b2 * r - q * r * .2, r: q * r * .7, fill: kDark(base, .1) }, cl); });
  S('circle', { cx: cx + r * .45, cy: cy + r * .4, r: r * 1.05, fill: '#05030d', opacity: .55 }, cl); S('circle', { cx: cx - r * .3, cy: cy - r * .3, r: r * .55, fill: '#fff', opacity: .18 }, cl);
  if (o.ring) S('path', { d: `M${cx + r * 1.7} ${cy - r * .1} A${r * 1.7} ${r * .38} 0 0 1 ${cx - r * 1.7} ${cy + r * .1}`, stroke: o.ring, 'stroke-width': r * .14, fill: 'none', transform: `rotate(-14 ${cx} ${cy})` }, g);
  return g; }
// sun / star / lamp: glowing shaded ball with soft halo
function kSun(par, cx, cy, r, id, col = '#fff3c4') { const g = S('g', id ? { id } : {}, par); kGlow(g, cx, cy, r * 4, '#ffd27a', .55); kBall(g, cx, cy, r, col, '#ffd27a', '#ffffff'); return g; }

// ---------- microscopic world ----------
// cell: membrane blob + cytoplasm + nucleus + organelles (class kPulse -> kLife wobbles them). o = {col, nuc, seed}
function kCell(par, cx, cy, r, id, o = {}) { const g = S('g', id ? { id } : {}, par), c = o.col || '#2ec4b6', d = kDefs(par);
  kGlow(g, cx, cy, r * 1.5, c, .25);
  const m = S('path', { d: kBlobD(cx, cy, r, .14, o.seed ?? 3, 10), fill: c }, g); const cl = S('g', { 'clip-path': kClip(d, m) }, g);
  S('path', { d: kBlobD(cx - r * .04, cy - r * .04, r * .86, .14, o.seed ?? 3, 10), fill: kLite(c, .55), opacity: .9 }, cl);
  S('circle', { cx: cx + r * .5, cy: cy + r * .5, r: r * .9, fill: kDark(c, .3), opacity: .25 }, cl);
  for (let k = 0; k < 6; k++) { const [x, y] = kPt(cx, cy, r * (.5 + rnd(k + 11) * .2), k * 60 + 20); S('ellipse', { class: 'kPulse', cx: x, cy: y, rx: r * .12, ry: r * .06, fill: k % 2 ? '#ffb38a' : kDark(c, .1), transform: `rotate(${k * 47} ${x} ${y})` }, cl); }
  kBall(g, cx - r * .12, cy - r * .08, r * .32, o.nuc || '#7b5cff', null, null, id ? id + 'N' : undefined); return g; }
function kVirus(par, cx, cy, r, col = '#ff5d8f', id) { const g = S('g', id ? { id } : {}, par); const sp = S('g', { class: 'kSpin' }, g);
  S('circle', { cx, cy, r: r * 1.55, fill: 'transparent' }, sp);
  for (let k = 0; k < 12; k++) { const [x1, y1] = kPt(cx, cy, r * .9, k * 30), [x2, y2] = kPt(cx, cy, r * 1.35, k * 30); S('path', { d: `M${x1} ${y1} L${x2} ${y2}`, stroke: kDark(col, .2), 'stroke-width': r * .1, 'stroke-linecap': 'round' }, sp); kBall(sp, x2, y2, r * .13, kLite(col, .2)); }
  kBall(g, cx, cy, r, col); [[-.3, -.1], [.2, .25], [.15, -.35]].forEach(([a, b]) => S('circle', { cx: cx + a * r, cy: cy + b * r, r: r * .12, fill: kDark(col, .25), opacity: .6 }, g)); return g; }
function kBacterium(par, cx, cy, len, r, col = '#7bd389', id, rot = 0) { const o = S('g', { transform: `rotate(${rot} ${cx} ${cy})` }, par), g = S('g', id ? { id } : {}, o);
  for (let k = 0; k < 3; k++) S('path', { class: 'kFlag', d: `M${cx - len / 2} ${cy + (k - 1) * r * .5} q${-r * .8} ${-r * .5} ${-r * 1.6} 0 t${-r * 1.6} 0`, stroke: kDark(col, .2), 'stroke-width': r * .12, fill: 'none', 'stroke-linecap': 'round' }, g);
  const b = S('rect', { x: cx - len / 2, y: cy - r, width: len, height: 2 * r, rx: r, fill: col }, g); kShade(g, b); return g; }
// molecule: atoms [[dx,dy,r,col],...] (first = centre) joined by sticks; default = water
function kMolecule(par, cx, cy, s = 1, id, atoms) { atoms = atoms || [[0, 0, 46, '#ff5a5f'], [-58, 42, 30, '#f1f5ff'], [58, 42, 30, '#f1f5ff']]; const g = S('g', id ? { id } : {}, par);
  atoms.slice(1).forEach(([dx, dy]) => S('path', { d: `M${cx} ${cy} L${cx + dx * s} ${cy + dy * s}`, stroke: '#cbd5e1', 'stroke-width': 14 * s, 'stroke-linecap': 'round' }, g));
  atoms.forEach(([dx, dy, r, c]) => kBall(g, cx + dx * s, cy + dy * s, r * s, c)); return g; }

// ---------- explainer marks (Kurzgesagt-style: thin lines, small labels, thick rounded arrows) ----------
// callout: dot on the object (x1,y1), thin line to (x2,y2), small label there. Hidden until cue -> kCALL(id, t)
function kCallout(par, x1, y1, x2, y2, text, col, id, fs = 30) { const g = S('g', { id }, par); S('circle', { id: id + 'd', cx: x1, cy: y1, r: 9, fill: col }, g);
  S('path', { id: id + 'l', class: 'draw', d: `M${x1} ${y1} L${x2} ${y2}`, stroke: col, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
  const right = x2 >= x1, w = text.length * fs * .62 + 36; S('rect', { id: id + 'b', x: right ? x2 : x2 - w, y: y2 - fs * .9, width: w, height: fs * 1.8, rx: fs * .9, fill: 'rgba(8,6,24,.72)' }, g);
  wtext(g, right ? x2 + w / 2 : x2 - w / 2, y2 + fs * .36, text, fs, col, 'middle', 700, id + 't'); hidId(id); return g; }
const kCALL = (id, t) => { tl.set('#' + id, { autoAlpha: 1 }, t); POP('#' + id + 'd', t, { s: .2 }); DRAW('#' + id + 'l', t + .1, { d: .4 }); POP(['#' + id + 'b', '#' + id + 't'], t + .45, { s: .7 }); };
// thick rounded arrow along any path d (the head is drawn at the end, pointing along the last segment)
function kArrow(par, d, col, id, w = 16) { const g = S('g', { id }, par); const p = S('path', { class: 'draw', d, stroke: col, 'stroke-width': w, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
  const L = p.getTotalLength(), e = p.getPointAtLength(L), q = p.getPointAtLength(Math.max(0, L - 20)), a = Math.atan2(e.y - q.y, e.x - q.x), h = w * 2.4;
  S('path', { id: id + 'h', d: `M${e.x + Math.cos(a) * h * .5} ${e.y + Math.sin(a) * h * .5} L${e.x + Math.cos(a + 2.4) * h} ${e.y + Math.sin(a + 2.4) * h} L${e.x + Math.cos(a - 2.4) * h} ${e.y + Math.sin(a - 2.4) * h} Z`, fill: col, 'stroke-linejoin': 'round', stroke: col, 'stroke-width': w * .4 }, g); hidId(id); return g; }
const kARROW = (id, t, d = .7) => { tl.set('#' + id, { autoAlpha: 1 }, t); DRAW('#' + id + ' .draw', t, { d }); POP('#' + id + 'h', t + d - .1, { s: .3, d: .3 }); };
function kBigNum(par, cx, cy, text, size, col, id) { const g = S('g', { id }, par); wtext(g, cx + size * .04, cy + size * .4, text, size, '#000', 'middle', 800).setAttribute('opacity', .3); wtext(g, cx, cy + size * .36, text, size, col, 'middle', 800); return g; }

// ---------- characters ----------
// kKid: small flat human (big round head, dot eyes), faces right. o = {skin, shirt, shirtD, hair, pose:'stand'|'coverEye', phone}
// ids: id+'H' head, id+'E' eyes (blink with eyes('#idE',[t])), id+'br' brows, id+'m' mouth, id+'aR' front arm, id+'cv' covering hand. Mirror with an outer scale(-1 1) group.
function kKid(par, x, y, s, id, o = {}) {
  const g = S('g', { id }, par), d = kDefs(par), skin = o.skin || '#f6d5bf', skD = '#e3b496', shirt = o.shirt || '#ff8a5b', shD = o.shirtD || kDark(shirt, .2), hair = o.hair || '#6b3f26';
  const P = (a, b) => `${x + a * s} ${y + b * s}`;
  S('ellipse', { cx: x, cy: y + 4 * s, rx: 90 * s, ry: 16 * s, fill: '#000', opacity: .25 }, g);
  [[-26, '#2b3655'], [22, '#323f63']].forEach(([dx, c]) => { S('rect', { x: x + (dx - 18) * s, y: y - 110 * s, width: 36 * s, height: 100 * s, rx: 16 * s, fill: c }, g); S('ellipse', { cx: x + (dx + 10) * s, cy: y - 8 * s, rx: 30 * s, ry: 14 * s, fill: '#1a1f33' }, g); });
  const body = S('path', { d: `M${P(-70, -110)} Q${P(-78, -250)} ${P(0, -262)} Q${P(78, -250)} ${P(70, -110)} Z`, fill: shirt }, g);
  const bc = S('g', { 'clip-path': kClip(d, body) }, g); S('ellipse', { cx: x + 70 * s, cy: y - 170 * s, rx: 60 * s, ry: 120 * s, fill: shD }, bc); S('ellipse', { cx: x - 40 * s, cy: y - 240 * s, rx: 40 * s, ry: 22 * s, fill: '#ffffff', opacity: .25 }, bc);
  S('rect', { x: x - 72 * s, y: y - 122 * s, width: 144 * s, height: 22 * s, rx: 10 * s, fill: '#1f2a44', opacity: .5 }, g);
  const hd = S('g', { id: id + 'H' }, g), hy = y - 345 * s;
  if (o.long) S('path', { d: `M${P(-88, -380)} Q${P(-118, -260)} ${P(-80, -205)} Q${P(-40, -200)} ${P(-30, -260)} Z`, fill: hair }, hd);
  S('circle', { cx: x - 70 * s, cy: hy + 10 * s, r: 18 * s, fill: skD }, hd);
  const head = S('circle', { cx: x, cy: hy, r: 92 * s, fill: skin }, hd); const hc = S('g', { 'clip-path': kClip(d, head) }, hd);
  S('circle', { cx: x - 60 * s, cy: hy + 50 * s, r: 90 * s, fill: skD, opacity: .55 }, hc); S('circle', { cx: x + 30 * s, cy: hy - 40 * s, r: 40 * s, fill: '#fff', opacity: .25 }, hc);
  S('path', { d: `M${P(-95, -330)} Q${P(-90, -450)} ${P(10, -445)} Q${P(95, -440)} ${P(92, -360)} Q${P(40, -400)} ${P(-20, -385)} Q${P(-50, -365)} ${P(-60, -320)} Z`, fill: hair }, hd);
  S('path', { d: `M${P(-40, -425)} Q${P(10, -440)} ${P(50, -420)}`, stroke: kLite(hair, .25), 'stroke-width': 8 * s, fill: 'none', 'stroke-linecap': 'round' }, hd);
  const eyesG = S('g', { id: id + 'E' }, hd);
  [14, 56].forEach(dx => { S('ellipse', { cx: x + dx * s, cy: hy - 2 * s, rx: 9 * s, ry: 13 * s, fill: '#1a1325' }, eyesG); S('circle', { cx: x + (dx + 3) * s, cy: hy - 7 * s, r: 3.5 * s, fill: '#fff' }, eyesG); });
  S('path', { id: id + 'br', d: `M${P(2, -375)} L${P(28, -380)} M${P(46, -380)} L${P(70, -374)}`, stroke: kDark(hair, .3), 'stroke-width': 6 * s, 'stroke-linecap': 'round' }, hd);
  S('circle', { cx: x + 70 * s, cy: hy + 32 * s, r: 14 * s, fill: '#ff8fa3', opacity: .45 }, hd);
  S('path', { id: id + 'm', d: `M${P(36, -310)} Q${P(48, -300)} ${P(60, -312)}`, stroke: '#7a3b2e', 'stroke-width': 5 * s, fill: 'none', 'stroke-linecap': 'round' }, hd);
  S('ellipse', { id: id + 'mO', cx: x + 48 * s, cy: y - 306 * s, rx: 8 * s, ry: 10 * s, fill: '#7a3b2e', opacity: 0 }, hd);
  if (o.pose === 'coverEye') {
    const cv = S('g', { id: id + 'cv' }, g);
    S('path', { d: `M${P(-52, -232)} Q${P(-120, -280)} ${P(-58, -330)} L${P(-6, -342)}`, stroke: shD, 'stroke-width': 32 * s, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, cv);
    kBall(cv, x + 14 * s, y - 343 * s, 24 * s, skin, skD, '#ffe9dc', id + 'hand');
  }
  const ar = S('g', { id: id + 'aR' }, g);
  if (o.pose === 'stand' && !o.phone) { S('path', { d: `M${P(40, -235)} Q${P(80, -180)} ${P(70, -130)}`, stroke: shirt, 'stroke-width': 34 * s, fill: 'none', 'stroke-linecap': 'round' }, ar); kBall(ar, x + 70 * s, y - 126 * s, 22 * s, skin, skD, '#ffe9dc'); return g; }
  S('path', { d: `M${P(40, -235)} Q${P(120, -250)} ${P(190, -300)}`, stroke: shirt, 'stroke-width': 34 * s, fill: 'none', 'stroke-linecap': 'round' }, ar);
  if (o.phone) { S('rect', { x: x + 186 * s, y: y - 380 * s, width: 26 * s, height: 150 * s, rx: 10 * s, fill: '#22324a' }, ar); S('rect', { x: x + 182 * s, y: y - 372 * s, width: 8 * s, height: 134 * s, rx: 4 * s, fill: '#9fe3ff', opacity: .8 }, ar); }
  kBall(ar, x + 194 * s, y - 300 * s, 22 * s, skin, skD, '#ffe9dc');
  return g;
}
// kKidTalk: open the kKid mouth on each spoken word between t0 and t1
function kKidTalk(id, t0, t1) { TW.filter(w => w[0] >= t0 - .01 && w[0] < t1).forEach((w, i, a) => { const op = Math.min(.17, Math.max(.07, ((a[i + 1] ? a[i + 1][0] : w[0] + .3) - w[0]) * .55));
  tl.set('#' + id + 'mO', { opacity: 1 }, w[0]); tl.set('#' + id + 'm', { opacity: 0 }, w[0]); tl.set('#' + id + 'mO', { opacity: 0 }, w[0] + op); tl.set('#' + id + 'm', { opacity: 1 }, w[0] + op); }); B(t0); }
// kBlobby: OUR OWN mascot (a round shaded creature with stubby feet) — never draw Kurzgesagt's own birds/characters.
// ids: id+'B' body group (animate), id+'E' eyes, id+'m' smile, id+'mO' open mouth, id+'aL'/id+'aR' arms (rotate, transformOrigin '50% 0%')
function kBlobby(par, x, y, s, id, col = '#ffb703') { const O = S('g', { id }, par), g = S('g', { id: id + 'B' }, O), r = 80 * s, cy = y - r - 18 * s;
  S('ellipse', { cx: x, cy: y, rx: r * .9, ry: 12 * s, fill: '#000', opacity: .25 }, g);
  [-28, 28].forEach(dx => S('ellipse', { cx: x + dx * s, cy: y - 10 * s, rx: 22 * s, ry: 12 * s, fill: kDark(col, .35) }, g));
  [['aL', -1], ['aR', 1]].forEach(([k, sd]) => { const a = S('g', { id: id + k }, g); S('path', { d: `M${x + sd * r * .82} ${cy} q${sd * 30 * s} ${20 * s} ${sd * 26 * s} ${52 * s}`, stroke: kDark(col, .15), 'stroke-width': 18 * s, fill: 'none', 'stroke-linecap': 'round' }, a); });
  kBall(g, x, cy, r, col, null, null, null, kLite(col, .6)); S('ellipse', { cx: x + 6 * s, cy: cy + r * .4, rx: r * .55, ry: r * .38, fill: kLite(col, .45), opacity: .7 }, g);
  const E = S('g', { id: id + 'E' }, g); [-24, 24].forEach(dx => { S('ellipse', { cx: x + dx * s, cy: cy - 14 * s, rx: 11 * s, ry: 16 * s, fill: '#1a1325' }, E); S('circle', { cx: x + (dx + 4) * s, cy: cy - 20 * s, r: 4 * s, fill: '#fff' }, E); });
  S('path', { id: id + 'm', d: `M${x - 16 * s} ${cy + 16 * s} Q${x} ${cy + 30 * s} ${x + 16 * s} ${cy + 16 * s}`, stroke: '#1a1325', 'stroke-width': 5 * s, fill: 'none', 'stroke-linecap': 'round' }, g);
  S('ellipse', { id: id + 'mO', cx: x, cy: cy + 22 * s, rx: 10 * s, ry: 12 * s, fill: '#1a1325', opacity: 0 }, g); return O; }

// ---------- motion ----------
// kLife(): call ONCE in beats. Hills drift (kD1-3), rays breathe, clouds drift (.kCloudD), canopies/grass sway (.kSway), organelles wobble (.kPulse),
// viruses spin (.kSpin), flagella wave (.kFlag), anything with class kBob bobs. All finite.
function kLife() { const rep = d => Math.max(1, Math.floor(END / d) - 1), has = s => document.querySelector(s);
  [1, 2, 3].forEach(k => { if (has('.kD' + k)) tl.to('.kD' + k, { x: 18 + k * 10, duration: 5 + k, yoyo: true, repeat: rep(5 + k), ease: 'sine.inOut' }, 0); });
  if (has('.kRays')) tl.to('.kRays', { opacity: .35, duration: 3.2, yoyo: true, repeat: rep(3.2), ease: 'sine.inOut' }, 0);
  if (has('.kCloudD')) tl.to('.kCloudD', { x: 70, duration: 11, yoyo: true, repeat: rep(11), stagger: 1.3, ease: 'sine.inOut' }, 0);
  if (has('.kSway')) tl.to('.kSway', { rotation: 3, transformOrigin: '50% 100%', duration: 2.1, yoyo: true, repeat: rep(2.1), stagger: .27, ease: 'sine.inOut' }, 0);
  if (has('.kPulse')) tl.to('.kPulse', { scale: 1.25, transformOrigin: '50% 50%', duration: 1.3, yoyo: true, repeat: rep(1.3), stagger: .17, ease: 'sine.inOut' }, 0);
  if (has('.kSpin')) tl.to('.kSpin', { rotation: 90, transformOrigin: '50% 50%', duration: END, ease: 'none' }, 0);
  if (has('.kFlag')) tl.to('.kFlag', { scaleY: -1, transformOrigin: '100% 50%', duration: .6, yoyo: true, repeat: rep(.6), stagger: .1, ease: 'sine.inOut' }, 0);
  if (has('.kBob')) tl.to('.kBob', { y: -12, duration: 1.6, yoyo: true, repeat: rep(1.6), stagger: .25, ease: 'sine.inOut' }, 0); }
// scale jump (micro -> macro / macro -> micro): dive the camera into (fx,fy) of the old area while it scales up, flash, land on the new area zoomed out.
function kSCALE(t, fx, fy, cx, cy, z = 1, d = .7) { tl.to('#world', { x: FW / 2 - fx * 12, y: FH / 2 - fy * 12, scale: 12, duration: d, ease: 'power3.in' }, t - d - .05);
  tl.fromTo('#flash', { autoAlpha: 0 }, { autoAlpha: .9, duration: .12 }, t - .15); CUT(t - .05, cx, cy, z * 3); CAM(t - .03, cx, cy, z, 1.1, 'power3.out'); B(t); }
// grow from nothing with a soft overshoot (cells dividing, planets forming)
const kGROW = (sel, t, d = .7) => { B(t); return tl.fromTo(sel, { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: d, ease: 'elastic.out(1, .55)' }, t); };
