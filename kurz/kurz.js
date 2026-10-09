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

// ---------- POLISHED HUMANS (user-approved styles; kKid is old, don't use it for new videos) ----------
// STYLE 1 kHuman — polished normal proportions, front view, ~960 px tall at s=1 (feet at y). Serious / science topics.
// o = {sex:'m'|'f', skin, hair, hairStyle:'quiff'|'side'|'long'|'bob', top, topType:'blazer'|'sweater'|'blouse'|'jacket', inner, pants, shoes, eyes, glasses, stubble}
// ids: id+'H' head, id+'E' eyes (blink: eyes('#idE',[t])), id+'bL'/'bR' brows, id+'mS' mouth, id+'mO' open mouth, id+'aL'/'aR' arms (rotate, transformOrigin '50% 0%')
function kHuman(par, x, y, s, id, o = {}) {
  const f = o.sex === 'f', sk = o.skin || '#f3cfb3', skD = kMix(sk, '#9c5a3c', .28), skL = kMix(sk, '#ffffff', .35), hc = o.hair || '#5a3522', hD = kDark(hc, .35), hL = kLite(hc, .3);
  const top = o.top || '#2b4c7e', tD = kDark(top, .3), tL = kLite(top, .22), pants = o.pants || '#273149', shoe = o.shoes || '#1b1f2e', d = kDefs(par);
  const O = S('g', { transform: `translate(${x},${y}) scale(${s})` }, par), g = S('g', { id }, O);
  const P = (...a) => a.join(' ');
  // shadow
  S('ellipse', { cx: 0, cy: 6, rx: 130, ry: 18, fill: '#000', opacity: .28 }, g);
  const gL = S('g', { transform: 'scale(1 .84)' }, g), gU = S('g', { transform: 'translate(0 60)' }, g);
  // back hair (long) — behind everything
  if (o.hairStyle === 'long') { const bh = S('path', { d: 'M-74 -820 Q-98 -720 -92 -640 Q-96 -590 -70 -560 Q-40 -590 -30 -640 L30 -640 Q40 -590 70 -560 Q96 -590 92 -640 Q98 -720 74 -820 Z', fill: hD }, gU); }
  // legs
  const lw = f ? 46 : 52, hipX = f ? 50 : 54;
  [-1, 1].forEach(sd => { const lg = S('path', { d: `M${sd * 4} -380 L${sd * (hipX + 22)} -380 L${sd * (hipX * .62 + 22)} -24 L${sd * (hipX * .62 - lw + 30)} -24 Z`, fill: pants }, gL); if (sd > 0) S('path', { d: `M${sd * 4} -380 L${sd * (hipX + 22)} -380 L${sd * (hipX * .62 + 22)} -24 L${sd * (hipX * .62 + 6)} -24 Z`, fill: '#000', opacity: .18 }, gL);
    S('path', { d: `M${sd * (hipX * .62 - 30)} -26 Q${sd * (hipX * .62 - 34)} -6 ${sd * (hipX * .62 - 20)} 0 L${sd * (hipX * .62 + 46)} 0 Q${sd * (hipX * .62 + 50)} -18 ${sd * (hipX * .62 + 24)} -28 Z`, fill: shoe }, gL);
    S('path', { d: `M${sd * (hipX * .62 - 18)} -22 L${sd * (hipX * .62 + 20)} -24`, stroke: '#fff', 'stroke-width': 3, opacity: .25, 'stroke-linecap': 'round' }, gL); });
  // torso
  const sh = f ? 84 : 104, wa = f ? 62 : 82, hp = f ? 82 : 80, ty = -652;
  const torso = S('path', { d: `M${-sh} ${ty + 34} Q${-sh} ${ty} ${-sh + 34} ${ty - 6} L${sh - 34} ${ty - 6} Q${sh} ${ty} ${sh} ${ty + 34} Q${wa + 6} ${ty + 150} ${wa} ${ty + 190} Q${hp + 4} ${ty + 240} ${hp} -372 L${-hp} -372 Q${-hp - 4} ${ty + 240} ${-wa} ${ty + 190} Q${-wa - 6} ${ty + 150} ${-sh} ${ty + 34} Z`, fill: top }, gU);
  const tc = S('g', { 'clip-path': kClip(d, torso) }, gU);
  S('ellipse', { cx: 90, cy: -500, rx: 70, ry: 200, fill: tD, opacity: .55 }, tc); S('ellipse', { cx: -60, cy: -630, rx: 50, ry: 30, fill: tL, opacity: .5 }, tc);
  // neckline / inner layer
  if (o.topType === 'blazer') { S('path', { d: `M-34 ${ty - 4} L0 ${ty + 120} L34 ${ty - 4} Z`, fill: o.inner || '#f4f1ea' }, gU); S('path', { d: `M-34 ${ty - 4} L-8 ${ty + 160} L-46 ${ty + 60} L-30 ${ty + 40} Z`, fill: tD }, gU); S('path', { d: `M34 ${ty - 4} L8 ${ty + 160} L46 ${ty + 60} L30 ${ty + 40} Z`, fill: kDark(top, .45) }, gU);
    [0, 1].forEach(k => S('circle', { cx: 0, cy: ty + 200 + k * 56, r: 6, fill: kDark(top, .5) }, gU)); S('path', { d: `M-60 ${ty + 130} L-34 ${ty + 130}`, stroke: tL, 'stroke-width': 4, 'stroke-linecap': 'round' }, gU); }
  if (o.topType === 'sweater') { S('path', { d: `M-34 ${ty - 4} Q0 ${ty + 30} 34 ${ty - 4}`, stroke: kDark(top, .25), 'stroke-width': 14, fill: 'none', 'stroke-linecap': 'round' }, gU); S('path', { d: `M${-hp + 6} -392 L${hp - 6} -392`, stroke: kDark(top, .2), 'stroke-width': 16, 'stroke-linecap': 'round' }, gU); }
  if (o.topType === 'blouse') { S('path', { d: `M-40 ${ty - 4} Q0 ${ty + 70} 40 ${ty - 4} Z`, fill: sk }, gU); S('path', { d: `M-40 ${ty - 4} Q0 ${ty + 70} 40 ${ty - 4}`, stroke: kDark(top, .2), 'stroke-width': 6, fill: 'none' }, gU); S('path', { d: `M${-wa} ${ty + 190} Q0 ${ty + 210} ${wa} ${ty + 190}`, stroke: kDark(top, .3), 'stroke-width': 8, fill: 'none' }, gU); }
  if (o.topType === 'jacket') { S('path', { d: `M-30 ${ty - 4} L-30 ${ty + 60} Q0 ${ty + 80} 30 ${ty + 60} L30 ${ty - 4} Q0 ${ty + 20} -30 ${ty - 4} Z`, fill: o.inner || '#f4f1ea' }, gU); S('path', { d: `M0 ${ty + 70} L0 -372`, stroke: kDark(top, .4), 'stroke-width': 5 }, gU); S('path', { d: `M-46 ${ty - 2} Q-38 ${ty + 40} -10 ${ty + 60} M46 ${ty - 2} Q38 ${ty + 40} 10 ${ty + 60}`, stroke: tL, 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round' }, gU); }
  // arms (ids aL / aR, rotate at the shoulder)
  [['aL', -1], ['aR', 1]].forEach(([k, sd]) => { const a = S('g', { id: id + k }, gU), ax = sd * (sh - 14);
    S('path', { d: `M${ax} ${ty + 20} Q${sd * (sh + 14)} ${ty + 140} ${sd * (sh + 6)} ${ty + 262}`, stroke: sd > 0 ? kDark(top, .12) : top, 'stroke-width': f ? 40 : 46, fill: 'none', 'stroke-linecap': 'round' }, a);
    S('path', { d: `M${sd * (sh + 6) - 16} ${ty + 262} Q${sd * (sh + 6)} ${ty + 272} ${sd * (sh + 6) + 16} ${ty + 262}`, stroke: kDark(top, .3), 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round' }, a);
    const hx = sd * (sh + 6), hy = ty + 296, hs = f ? .88 : 1; const hand = S('path', { d: `M${hx - 15 * hs} ${hy - 22 * hs} Q${hx - 20 * hs} ${hy + 6 * hs} ${hx - 12 * hs} ${hy + 22 * hs} Q${hx} ${hy + 32 * hs} ${hx + 12 * hs} ${hy + 22 * hs} Q${hx + 20 * hs} ${hy + 6 * hs} ${hx + 15 * hs} ${hy - 22 * hs} Z`, fill: sk }, a); kShade(a, hand, skD, skL);
    S('path', { d: `M${hx - sd * 13 * hs} ${hy - 14 * hs} Q${hx - sd * 24 * hs} ${hy} ${hx - sd * 14 * hs} ${hy + 12 * hs}`, stroke: sk, 'stroke-width': 11 * hs, fill: 'none', 'stroke-linecap': 'round' }, a);
    [-5, 3].forEach(dx => S('path', { d: `M${hx + dx * hs} ${hy + 8 * hs} L${hx + dx * hs} ${hy + 22 * hs}`, stroke: skD, 'stroke-width': 2, opacity: .6, 'stroke-linecap': 'round' }, a)); });
  // neck
  S('path', { d: `M-21 -740 L-23 ${ty + 2} Q0 ${ty + 14} 23 ${ty + 2} L21 -740 Z`, fill: sk }, gU); S('path', { d: `M-21 -728 Q0 -700 21 -728 L22 -700 Q0 -690 -22 -700 Z`, fill: skD, opacity: .7 }, gU);
  // head
  const HG = S('g', { id: id + 'H' }, gU);
  [-1, 1].forEach(sd => { S('ellipse', { cx: sd * 62, cy: -794, rx: 13, ry: 20, fill: sd > 0 ? skD : sk }, HG); S('path', { d: `M${sd * 60} -804 Q${sd * 68} -796 ${sd * 61} -784`, stroke: skD, 'stroke-width': 3, fill: 'none' }, HG); });
  const face = f ? 'M-60 -830 Q-62 -760 -34 -726 Q-14 -704 0 -704 Q14 -704 34 -726 Q62 -760 60 -830 Q58 -892 0 -894 Q-58 -892 -60 -830 Z'
    : 'M-62 -830 Q-64 -762 -46 -730 Q-26 -704 0 -702 Q26 -704 46 -730 Q64 -762 62 -830 Q60 -894 0 -896 Q-60 -894 -62 -830 Z';
  const fc = S('path', { d: face, fill: sk }, HG), fcl = S('g', { 'clip-path': kClip(d, fc) }, HG);
  S('ellipse', { cx: 58, cy: -790, rx: 40, ry: 110, fill: skD, opacity: .35 }, fcl); S('ellipse', { cx: -26, cy: -850, rx: 30, ry: 20, fill: skL, opacity: .45 }, fcl);
  S('ellipse', { cx: 0, cy: -712, rx: 46, ry: 12, fill: skD, opacity: .2 }, fcl);
  if (!f && o.stubble) S('path', { d: 'M-56 -778 Q-48 -722 0 -706 Q48 -722 56 -778 Q40 -744 0 -742 Q-40 -744 -56 -778 Z', fill: hc, opacity: .22 }, fcl);
  const FG = S('g', { id: id + 'F' }, HG);
  // cheeks
  [-1, 1].forEach(sd => S('ellipse', { cx: sd * 36, cy: -764, rx: 14, ry: 8, fill: '#ff8f8f', opacity: f ? .32 : .16 }, FG));
  // eyes
  const E = S('g', { id: id + 'E' }, FG), ec = o.eyes || '#4a7bd0';
  [-1, 1].forEach(sd => { const cx = sd * 25, cy = -796;
    const al = S('path', { d: `M${cx - 14} ${cy} Q${cx} ${cy - 12} ${cx + 14} ${cy} Q${cx} ${cy + 9} ${cx - 14} ${cy} Z`, fill: '#fbf7f2' }, E); const ac = S('g', { 'clip-path': kClip(d, al) }, E);
    S('circle', { cx: cx + 1, cy: cy - 1, r: 8, fill: ec }, ac); S('circle', { cx: cx + 1, cy: cy - 1, r: 8, fill: 'none', stroke: kDark(ec, .4), 'stroke-width': 1.6 }, ac); S('circle', { cx: cx + 1, cy: cy - 1, r: 4, fill: '#141018' }, ac); S('circle', { cx: cx - 2, cy: cy - 4, r: 2.4, fill: '#fff' }, ac);
    S('path', { d: `M${cx - 14} ${cy - 3} Q${cx - 14} ${cy} ${cx - 15} ${cy}`, fill: 'none' }, E);
    S('path', { d: `M${cx - 15} ${cy + 1} Q${cx} ${cy - 13} ${cx + 15} ${cy - 1}`, stroke: '#2a1a16', 'stroke-width': f ? 4.2 : 3.2, fill: 'none', 'stroke-linecap': 'round' }, E);
    if (f) S('path', { d: `M${cx + sd * 13} ${cy - 2} l${sd * 7} -5`, stroke: '#2a1a16', 'stroke-width': 3, 'stroke-linecap': 'round' }, E);
    S('path', { d: `M${cx - 10} ${cy + 9} Q${cx} ${cy + 12} ${cx + 10} ${cy + 9}`, stroke: skD, 'stroke-width': 2, fill: 'none', opacity: .6 }, E); });
  // brows
  const bc = kDark(hc, .2);
  [-1, 1].forEach(sd => S('path', { id: id + (sd < 0 ? 'bL' : 'bR'), d: f ? `M${sd * 12} -818 Q${sd * 26} -828 ${sd * 42} -820` : `M${sd * 10} -817 Q${sd * 26} -826 ${sd * 44} -820`, stroke: bc, 'stroke-width': f ? 4 : 6.5, fill: 'none', 'stroke-linecap': 'round' }, FG));
  // nose
  S('path', { d: 'M5 -800 Q11 -776 6 -764 Q0 -760 -6 -764', stroke: skD, 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, FG); S('ellipse', { cx: -3, cy: -780, rx: 3, ry: 9, fill: skL, opacity: .6 }, FG);
  // mouth
  if (f) { S('path', { id: id + 'mS', d: 'M-17 -740 Q-8 -746 0 -742 Q8 -746 17 -740 Q8 -728 0 -728 Q-8 -728 -17 -740 Z', fill: '#d4626f' }, FG); S('path', { d: 'M-17 -740 Q0 -736 17 -740', stroke: '#9e3a4a', 'stroke-width': 2.4, fill: 'none' }, FG); S('ellipse', { cx: -2, cy: -732, rx: 6, ry: 2, fill: '#fff', opacity: .35 }, FG); }
  else { S('path', { id: id + 'mS', d: 'M-18 -742 Q0 -728 18 -742', stroke: '#8f3f36', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, FG); S('path', { d: 'M-8 -728 Q0 -725 8 -728', stroke: skD, 'stroke-width': 2.4, fill: 'none', opacity: .7 }, FG); }
  S('ellipse', { id: id + 'mO', cx: 0, cy: -738, rx: 11, ry: 9, fill: '#6e2630', opacity: 0 }, FG);
  // glasses
  if (o.glasses) { [-1, 1].forEach(sd => S('rect', { x: sd * 25 - 19, y: -811, width: 38, height: 28, rx: 10, fill: '#ffffff', 'fill-opacity': .12, stroke: '#1d2333', 'stroke-width': 4 }, FG)); S('path', { d: 'M-6 -800 Q0 -806 6 -800', stroke: '#1d2333', 'stroke-width': 4, fill: 'none' }, FG); }
  // hair (front)
  const hair = {
    quiff: 'M-64 -810 Q-70 -872 -44 -900 Q-8 -936 34 -922 Q70 -908 66 -846 L64 -808 Q58 -846 44 -858 Q20 -862 0 -872 Q-26 -858 -50 -858 Q-60 -846 -64 -810 Z',
    side: 'M-64 -806 Q-72 -880 -20 -904 Q34 -920 62 -884 Q70 -860 64 -806 Q58 -840 50 -852 Q10 -846 -24 -866 Q-46 -846 -60 -836 Z',
    long: 'M-66 -790 Q-76 -880 -18 -904 Q40 -920 66 -880 Q78 -846 70 -780 Q62 -820 56 -840 Q20 -850 -8 -880 Q-30 -844 -60 -836 Z',
    bob: 'M-70 -740 Q-84 -870 -20 -902 Q44 -920 72 -870 Q84 -820 72 -740 Q64 -752 60 -790 Q58 -830 46 -852 Q6 -854 -12 -882 Q-34 -850 -52 -850 Q-60 -820 -60 -790 Q-62 -756 -70 -740 Z',
  }[o.hairStyle || 'side'];
  const hp2 = S('path', { d: hair, fill: hc }, HG); const hcl = S('g', { 'clip-path': kClip(d, hp2) }, HG);
  S('ellipse', { cx: 70, cy: -830, rx: 60, ry: 90, fill: hD, opacity: .55 }, hcl); S('ellipse', { cx: -20, cy: -900, rx: 40, ry: 16, fill: hL, opacity: .55, transform: 'rotate(-15 -20 -900)' }, hcl);
  if (o.hairStyle === 'long') { [-1, 1].forEach(sd => { const lk = S('path', { d: `M${sd * 58} -836 Q${sd * 84} -760 ${sd * 72} -690 Q${sd * 68} -640 ${sd * 86} -600 Q${sd * 54} -620 ${sd * 50} -680 Q${sd * 48} -740 ${sd * 52} -800 Z`, fill: sd > 0 ? kDark(hc, .15) : hc }, HG); });
    S('path', { d: 'M62 -760 Q78 -700 70 -650', stroke: hL, 'stroke-width': 3, fill: 'none', opacity: .4 }, HG); }
  return O;
}

// STYLE 3 kSlim — slim elegant fashion-flat, tall, small head, ~900 px tall at s=1. Modern / lifestyle / tech topics.
// o = {sex, skin, hair, hairStyle:'short'|'wave'|'long'|'bun2', top, coat, pants, shoes}; same ids as kHuman
function kSlim(par, x, y, s, id, o = {}) {
  const f = o.sex === 'f', sk = o.skin || '#f1c9ad', skD = kMix(sk, '#9c5a3c', .3), skL = kMix(sk, '#fff', .35), hc = o.hair || '#2d1d16', hD = kDark(hc, .35), hL = kLite(hc, .3), d = kDefs(par);
  const top = o.top || '#f4efe6', coat = o.coat, pants = o.pants || '#2b3045', shoe = o.shoes || '#f8fafc';
  const O = S('g', { transform: `translate(${x},${y}) scale(${s})` }, par), g = S('g', { id }, O);
  S('ellipse', { cx: 0, cy: 6, rx: 110, ry: 14, fill: '#000', opacity: .28 }, g);
  const HY = -820;
  if (o.hairStyle === 'long') S('path', { d: `M-46 ${HY - 10} Q-62 ${HY + 80} -52 ${HY + 150} Q-20 ${HY + 160} -10 ${HY + 100} L10 ${HY + 100} Q20 ${HY + 160} 52 ${HY + 150} Q62 ${HY + 80} 46 ${HY - 10} Z`, fill: hD }, g);
  // legs: wide trousers (f) or slim (m)
  [-1, 1].forEach(sd => { const lg = f ? S('path', { d: `M${sd * 2} -420 L${sd * 52} -420 L${sd * 66} -24 L${sd * 14} -24 Z`, fill: sd > 0 ? kDark(pants, .15) : pants }, g) : S('path', { d: `M${sd * 3} -420 L${sd * 46} -420 L${sd * 40} -24 L${sd * 14} -24 Z`, fill: sd > 0 ? kDark(pants, .15) : pants }, g);
    S('rect', { x: sd > 0 ? 6 : -60, y: -28, width: 54, height: 26, rx: 13, fill: shoe }, g); S('rect', { x: sd > 0 ? 6 : -60, y: -8, width: 54, height: 8, rx: 4, fill: kDark(shoe, .3) }, g); if (f) S('rect', { x: sd > 0 ? 18 : -46, y: -40, width: 26, height: 14, rx: 6, fill: sk }, g); });
  // torso
  const sh = f ? 58 : 70, wa = f ? 36 : 50;
  const tor = S('path', { d: `M${-sh} -680 Q${-sh} -712 ${-sh + 24} -716 L${sh - 24} -716 Q${sh} -712 ${sh} -680 L${wa} -520 Q${wa + 6} -470 ${wa + 10} -416 L${-wa - 10} -416 Q${-wa - 6} -470 ${-wa} -520 Z`, fill: top }, g); kShade(g, tor);
  S('path', { d: f ? 'M-24 -716 Q0 -680 24 -716' : 'M-20 -716 L0 -690 L20 -716', stroke: kDark(top, .2), 'stroke-width': 5, fill: 'none' }, g);
  if (coat) { [-1, 1].forEach(sd => { const c = S('path', { d: `M${sd * 18} -716 L${sd * (sh + 6)} -704 Q${sd * (sh + 14)} -600 ${sd * (sh + 20)} ${f ? -300 : -360} L${sd * 26} ${f ? -300 : -360} Q${sd * 30} -560 ${sd * 18} -716 Z`, fill: sd > 0 ? kDark(coat, .15) : coat }, g); });
    [-1, 1].forEach(sd => S('path', { d: `M${sd * 18} -716 L${sd * 44} -640 L${sd * 30} -600`, stroke: kDark(coat, .35), 'stroke-width': 5, fill: 'none', 'stroke-linejoin': 'round' }, g)); }
  // arms (long, slim)
  const ac = coat || top;
  [['aL', -1], ['aR', 1]].forEach(([k, sd]) => { const a = S('g', { id: id + k }, g); S('path', { d: `M${sd * (sh - 10)} -700 Q${sd * (sh + 18)} -580 ${sd * (sh + 14)} -470`, stroke: sd > 0 ? kDark(ac, .14) : ac, 'stroke-width': f ? 26 : 32, fill: 'none', 'stroke-linecap': 'round' }, a);
    const hx = sd * (sh + 14), hy = -448; const hn = S('path', { d: `M${hx - 10} ${hy - 18} Q${hx - 13} ${hy + 6} ${hx - 6} ${hy + 18} Q${hx} ${hy + 24} ${hx + 6} ${hy + 18} Q${hx + 13} ${hy + 6} ${hx + 10} ${hy - 18} Z`, fill: sk }, a); kShade(a, hn, skD, skL); });
  // neck + head (small, oval)
  S('path', { d: `M-12 ${HY + 60} L-14 -712 Q0 -704 14 -712 L12 ${HY + 60} Z`, fill: sk }, g); S('path', { d: `M-12 ${HY + 70} Q0 ${HY + 86} 12 ${HY + 70} L13 ${HY + 86} Q0 ${HY + 94} -13 ${HY + 86} Z`, fill: skD, opacity: .6 }, g);
  const HG = S('g', { id: id + 'H' }, g);
  [-1, 1].forEach(sd => S('ellipse', { cx: sd * 42, cy: HY + 6, rx: 8, ry: 13, fill: sd > 0 ? skD : sk }, HG));
  const hd = S('path', { d: `M-42 ${HY - 10} Q-44 ${HY + 46} -18 ${HY + 66} Q0 ${HY + 76} 18 ${HY + 66} Q44 ${HY + 46} 42 ${HY - 10} Q40 ${HY - 62} 0 ${HY - 64} Q-40 ${HY - 62} -42 ${HY - 10} Z`, fill: sk }, HG);
  const hcl = S('g', { 'clip-path': kClip(d, hd) }, HG); S('ellipse', { cx: 34, cy: HY + 10, rx: 26, ry: 80, fill: skD, opacity: .35 }, hcl); S('ellipse', { cx: -14, cy: HY - 34, rx: 18, ry: 12, fill: skL, opacity: .45 }, hcl);
  const FG = S('g', { id: id + 'F' }, HG);
  const E = S('g', { id: id + 'E' }, FG);
  [-1, 1].forEach(sd => { const cx = sd * 17, cy = HY + 6; S('path', { d: `M${cx - 9} ${cy} Q${cx} ${cy - 8} ${cx + 9} ${cy} Q${cx} ${cy + 5} ${cx - 9} ${cy} Z`, fill: '#fbf7f2' }, E); S('circle', { cx, cy: cy - 1, r: 4.6, fill: '#2a1a16' }, E); S('circle', { cx: cx - 1.5, cy: cy - 3, r: 1.4, fill: '#fff' }, E);
    S('path', { d: `M${cx - 10} ${cy} Q${cx} ${cy - 10} ${cx + 10} ${cy - 1}`, stroke: '#2a1a16', 'stroke-width': f ? 3 : 2.4, fill: 'none', 'stroke-linecap': 'round' }, E);
    S('path', { d: `M${sd * 8} ${HY - 12} Q${sd * 17} ${HY - 18} ${sd * 28} ${HY - 13}`, stroke: kDark(hc, .1), 'stroke-width': f ? 2.6 : 4, fill: 'none', 'stroke-linecap': 'round' }, FG); });
  S('path', { d: `M3 ${HY + 6} Q8 ${HY + 26} 2 ${HY + 32}`, stroke: skD, 'stroke-width': 2.4, fill: 'none', 'stroke-linecap': 'round' }, FG);
  if (f) S('path', { id: id + 'mS', d: `M-11 ${HY + 46} Q0 ${HY + 42} 11 ${HY + 46} Q0 ${HY + 55} -11 ${HY + 46} Z`, fill: '#c95b6a' }, FG);
  else S('path', { id: id + 'mS', d: `M-11 ${HY + 46} Q0 ${HY + 54} 11 ${HY + 46}`, stroke: '#8f3f36', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, FG);
  S('ellipse', { id: id + 'mO', cx: 0, cy: HY + 48, rx: 7, ry: 6, fill: '#6e2630', opacity: 0 }, FG);
  [-1, 1].forEach(sd => S('ellipse', { cx: sd * 24, cy: HY + 30, rx: 8, ry: 5, fill: '#ff8f8f', opacity: f ? .3 : .15 }, FG));
  const H3 = {
    short: `M-44 ${HY - 4} Q-50 ${HY - 70} 0 ${HY - 78} Q46 ${HY - 80} 48 ${HY - 30} L44 ${HY - 4} Q40 ${HY - 34} 26 ${HY - 40} Q-6 ${HY - 36} -30 ${HY - 46} Q-40 ${HY - 30} -44 ${HY - 4} Z`,
    wave: `M-46 ${HY + 10} Q-56 ${HY - 66} -8 ${HY - 76} Q48 ${HY - 84} 50 ${HY - 20} Q46 ${HY - 40} 30 ${HY - 46} Q4 ${HY - 34} -16 ${HY - 52} Q-34 ${HY - 34} -40 ${HY - 20} Q-44 ${HY - 4} -46 ${HY + 10} Z`,
    long: `M-48 ${HY + 40} Q-58 ${HY - 70} 0 ${HY - 74} Q58 ${HY - 70} 48 ${HY + 40} Q42 ${HY - 10} 34 ${HY - 36} Q10 ${HY - 40} -6 ${HY - 56} Q-26 ${HY - 34} -38 ${HY - 30} Q-44 ${HY} -48 ${HY + 40} Z`,
    bun2: `M-44 ${HY} Q-48 ${HY - 70} 0 ${HY - 74} Q48 ${HY - 70} 44 ${HY} Q38 ${HY - 40} 20 ${HY - 46} Q0 ${HY - 40} -20 ${HY - 46} Q-38 ${HY - 40} -44 ${HY} Z`,
  };
  if (o.hairStyle === 'bun2') kBall(HG, 0, HY - 92, 28, hc, hD, hL);
  const hp = S('path', { d: H3[o.hairStyle || 'short'], fill: hc }, HG); const cl = S('g', { 'clip-path': kClip(d, hp) }, HG); S('ellipse', { cx: 30, cy: HY - 20, rx: 30, ry: 70, fill: hD, opacity: .5 }, cl); S('ellipse', { cx: -16, cy: HY - 66, rx: 22, ry: 8, fill: hL, opacity: .6, transform: `rotate(-12 -16 ${HY - 66})` }, cl);
  return O;
}

// kTalk(id, t0, t1): mouth opens on every spoken word (kHuman / kSlim / kKid)
// look at something during the video: face slides toward dir (-1/0/1), small head tilt; dy for up/down (px, e.g. -8 = up)
function kLook(id, t, dir, dy = 0, d = .45) { const F = document.getElementById(id + 'F'), H = document.getElementById(id + 'H'), w = H.getBBox().width;
  tl.to('#' + id + 'F', { x: dir * w * .03, y: dy, duration: d, ease: 'power2.inOut' }, t); tl.to('#' + id + 'H', { rotation: dir * 3 + dy * .3, transformOrigin: '50% 100%', duration: d, ease: 'power2.inOut' }, t); B(t); }
function kTalk(id, t0, t1) { const base = document.getElementById(id + 'mS') ? id + 'mS' : id + 'm';
  TW.filter(w => w[0] >= t0 - .01 && w[0] < t1).forEach((w, i, a) => { const op = Math.min(.17, Math.max(.07, ((a[i + 1] ? a[i + 1][0] : w[0] + .3) - w[0]) * .55));
    tl.set('#' + id + 'mO', { opacity: 1 }, w[0]); tl.set('#' + base, { opacity: 0 }, w[0]); tl.set('#' + id + 'mO', { opacity: 0 }, w[0] + op); tl.set('#' + base, { opacity: 1 }, w[0] + op); }); B(t0); }
