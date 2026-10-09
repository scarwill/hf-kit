// ===================== KURZ TECH: AI / data / computing props in the Kurzgesagt look (load AFTER kurz.js) =====================
// Everything is flat + shaded (core shadow bottom-right, highlight top-left), glowing where it is "alive", NO outlines, NO white paper cards.
// Use these instead of the Infographics helpers (chat/pill/ic/card/docSheet/laptop/server/botB) in Kurz videos.

// AI model = a glowing core (planet-like orb with inner rings + orbiting nodes). ids: id+'g' glow, id+'o' orbit group, id+'E' eyes (if face)
function kCore(par, cx, cy, r, col, id, o = {}) {
  const g = S('g', { id }, par); kGlow(g, cx, cy, r * 2.3, col, .5, id + 'g');
  const orb = S('g', { id: id + 'o' }, g); const R = r * 1.45;
  S('ellipse', { cx, cy, rx: R, ry: R * .32, fill: 'none', stroke: kLite(col, .35), 'stroke-width': Math.max(3, r * .05), opacity: .55, transform: `rotate(-18 ${cx} ${cy})` }, orb);
  kBall(g, cx, cy, r, col, null, null, null, kLite(col, .7));
  const d = kDefs(par); const inner = S('g', { 'clip-path': kClip(d, S('circle', { cx, cy, r }, d)) }, g);
  for (let k = 1; k <= 3; k++) S('circle', { cx: cx - r * .08, cy: cy - r * .05, r: r * k * .28, fill: 'none', stroke: kLite(col, .55), 'stroke-width': Math.max(2, r * .025), opacity: .35 }, inner);
  for (let k = 0; k < 7; k++) { const a = k * 0.9 + .3, rr = r * (.35 + .45 * rnd(k * 7 + 3)); S('circle', { cx: cx + Math.cos(a) * rr, cy: cy + Math.sin(a) * rr, r: r * .045, fill: kLite(col, .85), opacity: .9 }, inner); }
  const front = S('g', {}, g); [[-1, .32], [1, .32]].forEach(([s]) => kBall(front, cx + s * R * .97, cy + s * R * .3 * -.95 + 0, r * .12, kLite(col, .25)));
  if (o.face) { const E = S('g', { id: id + 'E' }, g); [-1, 1].forEach(s => { S('ellipse', { cx: cx + s * r * .28, cy: cy - r * .05, rx: r * .1, ry: r * .14, fill: '#1a1033' }, E); S('circle', { cx: cx + s * r * .28 + r * .03, cy: cy - r * .1, r: r * .035, fill: '#fff' }, E); });
    S('path', { id: id + 'mS', d: `M${cx - r * .16} ${cy + r * .22} Q${cx} ${cy + r * .36} ${cx + r * .16} ${cy + r * .22}`, stroke: '#1a1033', 'stroke-width': r * .05, fill: 'none', 'stroke-linecap': 'round' }, g); }
  return g;
}
// data cube (token, data block, memory cell): isometric, 3 shaded faces. glyph = 1–3 chars on the top-front face (optional)
function kCube(par, cx, cy, s, col, id, glyph) {
  const g = S('g', id ? { id } : {}, par), h = s * .5, w = s * .87;
  S('ellipse', { cx, cy: cy + s * 1.02, rx: w * .9, ry: s * .14, fill: 'rgba(0,0,0,.28)' }, g);
  S('path', { d: `M${cx} ${cy} L${cx + w} ${cy - h} L${cx} ${cy - 2 * h} L${cx - w} ${cy - h} Z`, fill: kLite(col, .32) }, g);
  S('path', { d: `M${cx - w} ${cy - h} L${cx} ${cy} L${cx} ${cy + s} L${cx - w} ${cy + s - h} Z`, fill: col }, g);
  S('path', { d: `M${cx + w} ${cy - h} L${cx} ${cy} L${cx} ${cy + s} L${cx + w} ${cy + s - h} Z`, fill: kDark(col, .3) }, g);
  S('path', { d: `M${cx - w * .78} ${cy - h * .92} L${cx - w * .2} ${cy - h * 1.55}`, stroke: '#fff', 'stroke-width': s * .05, 'stroke-linecap': 'round', opacity: .45 }, g);
  if (glyph) wtext(g, cx - w * .5, cy + s * .42, glyph, s * .42, kLite(col, .8), 'middle', 800);
  return g;
}
// crystal shard (a single fact / data point / source of knowledge): faceted, glowing tip
function kCrystal(par, cx, cy, s, col, id, glow = true) {
  const g = S('g', id ? { id } : {}, par); if (glow) kGlow(g, cx, cy - s * .4, s * 1.4, col, .35);
  const t = [cx, cy - s * 1.15], l = [cx - s * .42, cy - s * .35], r = [cx + s * .42, cy - s * .35], b = [cx, cy + s * .35], m = [cx + s * .05, cy - s * .3];
  const P = a => a.map(p => p.join(' ')).join(' L');
  S('path', { d: `M${P([t, l, b])} Z`, fill: kLite(col, .25) }, g); S('path', { d: `M${P([t, m, b])} Z`, fill: col }, g); S('path', { d: `M${P([t, r, b])} Z`, fill: kDark(col, .3) }, g);
  S('path', { d: `M${t[0] - s * .06} ${t[1] + s * .2} L${l[0] + s * .12} ${l[1]}`, stroke: '#fff', 'stroke-width': s * .05, 'stroke-linecap': 'round', opacity: .6 }, g);
  return g;
}
// document / source / web page as a Kurz object: a thick shaded slab (not white paper), soft rounded lines, a coloured badge. tilt in degrees.
function kTablet(par, cx, cy, w, col, id, o = {}) {
  const h = w * 1.25, g = S('g', id ? { id } : {}, par), G2 = S('g', { transform: `rotate(${o.tilt ?? 0} ${cx} ${cy})` }, g);
  S('rect', { x: cx - w / 2 + w * .06, y: cy - h / 2 + w * .08, width: w, height: h, rx: w * .1, fill: 'rgba(0,0,0,.3)' }, G2);
  S('rect', { x: cx - w / 2, y: cy - h / 2 + w * .05, width: w, height: h, rx: w * .1, fill: kDark(col, .25) }, G2);
  const f = S('rect', { x: cx - w / 2, y: cy - h / 2, width: w, height: h, rx: w * .1, fill: col }, G2); kShade(G2, f, null, null, .6);
  const lc = kLite(col, .55); S('circle', { cx: cx - w * .26, cy: cy - h * .3, r: w * .11, fill: o.badge ?? KC.light }, G2);
  S('rect', { x: cx - w * .08, y: cy - h * .33, width: w * .34, height: w * .07, rx: w * .035, fill: lc }, G2);
  for (let k = 0; k < (o.lines ?? 4); k++) S('rect', { x: cx - w * .36, y: cy - h * .12 + k * h * .14, width: w * (k % 3 === 2 ? .46 : .72), height: w * .06, rx: w * .03, fill: lc, opacity: .75 }, G2);
  return g;
}
// server / data-centre tower: stacked shaded slabs with glowing light strips (.kBlink)
function kServer(par, x, feetY, s, col, id, n = 5) {
  const g = S('g', id ? { id } : {}, par), w = 220 * s, uh = 70 * s, H = n * uh + 30 * s;
  S('ellipse', { cx: x, cy: feetY, rx: w * .7, ry: 20 * s, fill: 'rgba(0,0,0,.3)' }, g);
  const body = S('rect', { x: x - w / 2, y: feetY - H, width: w, height: H, rx: 26 * s, fill: col }, g); kShade(g, body, null, null, .7);
  for (let k = 0; k < n; k++) { const y = feetY - H + 22 * s + k * uh; S('rect', { x: x - w / 2 + 18 * s, y, width: w - 36 * s, height: uh - 14 * s, rx: 14 * s, fill: kDark(col, .35) }, g);
    S('rect', { class: 'kBlink', x: x - w / 2 + 34 * s, y: y + (uh - 14 * s) / 2 - 5 * s, width: 60 * s, height: 10 * s, rx: 5 * s, fill: k % 2 ? '#7cf6c8' : KC.light }, g);
    [0, 1, 2].forEach(j => S('circle', { cx: x + w / 2 - 44 * s - j * 24 * s, cy: y + (uh - 14 * s) / 2, r: 6 * s, fill: kLite(col, .4) }, g)); }
  return g;
}
// floating holo screen / panel (dark glass + glow, no outline). Returns the content group (draw inside it). ids: id (whole), id+'c' content
function kScreen(par, cx, cy, w, h, col, id) {
  const g = S('g', { id }, par); kGlow(g, cx, cy, Math.max(w, h) * .75, col, .25);
  S('rect', { x: cx - w / 2 + 10, y: cy - h / 2 + 14, width: w, height: h, rx: 28, fill: 'rgba(0,0,0,.35)' }, g);
  S('rect', { x: cx - w / 2, y: cy - h / 2, width: w, height: h, rx: 28, fill: kMix(col, '#0b0820', .78) }, g);
  S('rect', { x: cx - w / 2 + 8, y: cy - h / 2 + 8, width: w - 16, height: h * .16, rx: 22, fill: kMix(col, '#0b0820', .55) }, g);
  [0, 1, 2].forEach(k => S('circle', { cx: cx - w / 2 + 34 + k * 26, cy: cy - h / 2 + 8 + h * .08, r: 7, fill: kLite(col, .2 + k * .2) }, g));
  S('path', { d: `M${cx - w / 2 + 30} ${cy + h / 2 - 6} L${cx + w / 2 - 30} ${cy + h / 2 - 6}`, stroke: col, 'stroke-width': 6, 'stroke-linecap': 'round', opacity: .7 }, g);
  return S('g', { id: id + 'c' }, g);
}
// neural net: columns of shaded nodes + soft links. layers = [3,5,5,2]. ids: id+'n'+L+'_'+k nodes (fire with kFIRE)
function kNet(par, cx, cy, w, h, layers, col, id) {
  const g = S('g', { id }, par), L = layers.length, pos = layers.map((n, i) => Array.from({ length: n }, (_, k) => [cx - w / 2 + w * i / (L - 1), cy - h / 2 + h * (k + .5) / n]));
  const lk = S('g', { opacity: .45 }, g); for (let i = 0; i < L - 1; i++) pos[i].forEach(a => pos[i + 1].forEach(b => S('path', { d: `M${a[0]} ${a[1]} C${(a[0] + b[0]) / 2} ${a[1]} ${(a[0] + b[0]) / 2} ${b[1]} ${b[0]} ${b[1]}`, stroke: kLite(col, .3), 'stroke-width': 3, fill: 'none' }, lk)));
  const r = Math.min(34, h / Math.max(...layers) * .32);
  pos.forEach((col2, i) => col2.forEach(([x, y], k) => { const n = S('g', { id: `${id}n${i}_${k}` }, g); kGlow(n, x, y, r * 2.2, KC.light, 0).setAttribute('class', 'kNg'); kBall(n, x, y, r, col); }));
  g.dataset.layers = JSON.stringify(layers); return g;
}
// light up a kNet layer by layer (a wave of thought)
function kFIRE(id, t, gap = .18) { const L = JSON.parse(document.getElementById(id).dataset.layers); L.forEach((n, i) => { for (let k = 0; k < n; k++) { const s = `#${id}n${i}_${k}`; tl.to(s + ' .kNg', { opacity: 1, duration: .15, yoyo: true, repeat: 1 }, t + i * gap); tl.to(s, { scale: 1.18, transformOrigin: '50% 50%', duration: .15, yoyo: true, repeat: 1 }, t + i * gap); } }); B(t); }
// stream of glowing dots along a path (data flowing). n dots; kFLOW makes a wave travel along it.
function kStream(par, d, col, id, n = 14, r = 9) {
  const g = S('g', { id }, par); const p = S('path', { d, stroke: col, 'stroke-width': 4, fill: 'none', opacity: .25, 'stroke-linecap': 'round' }, g); const L = p.getTotalLength();
  for (let k = 0; k < n; k++) { const q = p.getPointAtLength(L * k / (n - 1)); kGlow(g, q.x, q.y, r * 2.6, col, .35); S('circle', { class: id + 'd', cx: q.x, cy: q.y, r, fill: kLite(col, .5) }, g); }
  hidId(id); return g;
}
function kFLOW(id, t, reps = 2) { tl.set('#' + id, { autoAlpha: 1 }, t); tl.fromTo('#' + id + ' .' + id + 'd', { scale: .4, transformOrigin: '50% 50%' }, { scale: 1.35, duration: .25, yoyo: true, repeat: 2 * reps - 1, stagger: .05 }, t); B(t); }
// Kurz speech: small dark soft bubble with light text (≤ 4 words), tail toward the speaker at (sx, sy). Hidden until kSAY(id, t).
function kSay(par, sx, sy, text, col, id, fs = 30, side = 1) {
  const w = text.length * fs * .6 + fs * 1.6, h = fs * 2, x = sx + side * 40 - (side > 0 ? 0 : w), y = sy - 70 - h, g = S('g', { id }, par);
  S('path', { d: `M${sx} ${sy} L${sx + side * 60} ${y + h - 4} L${sx + side * 10} ${y + h - 4} Z`, fill: 'rgba(14,10,36,.82)' }, g);
  S('rect', { x, y, width: w, height: h, rx: h / 2, fill: 'rgba(14,10,36,.82)' }, g); S('circle', { cx: x + fs * .75, cy: y + h / 2, r: fs * .2, fill: col }, g);
  wtext(g, x + w / 2 + fs * .25, y + h / 2 + fs * .36, text, fs, '#f4f1ff', 'middle', 600); hidId(id); return g;
}
const kSAY = (id, t) => { tl.set('#' + id, { autoAlpha: 1 }, t); POP('#' + id, t, { s: .6 }); };
// Kurz robot (when the AI must be a character): round shaded body, one wide glowing visor, small arms. ids like characters: id+'B', id+'E', id+'aL'/'aR', id+'H'
function kBot(par, x, feetY, s, id, col = '#7b6cf6') {
  const O = S('g', { transform: `translate(${x},${feetY}) scale(${s})` }, par), M = S('g', { id: id + 'B' }, O);
  S('ellipse', { cx: 0, cy: 0, rx: 150, ry: 22, fill: 'rgba(0,0,0,.3)' }, M);
  [-1, 1].forEach(sg => { const a = S('g', { id: id + (sg < 0 ? 'aL' : 'aR') }, M); S('path', { d: `M${sg * 120} -300 Q${sg * 175} -230 ${sg * 160} -160`, stroke: kDark(col, .2), 'stroke-width': 30, fill: 'none', 'stroke-linecap': 'round' }, a); kBall(a, sg * 160, -152, 26, kLite(col, .2)); });
  [-1, 1].forEach(sg => { const l = S('rect', { x: sg * 55 - 26, y: -110, width: 52, height: 104, rx: 24, fill: kDark(col, .3) }, M); });
  const body = S('path', { d: 'M-130 -250 Q-140 -360 0 -365 Q140 -360 130 -250 Q125 -95 0 -92 Q-125 -95 -130 -250 Z', fill: col }, M); kShade(M, body);
  kGlow(M, 0, -235, 60, KC.light, .5); kBall(M, 0, -235, 28, KC.light, '#e0a630', '#fff6cf');
  const H = S('g', { id: id + 'H' }, M); const hd = S('path', { d: 'M-120 -470 Q-125 -585 0 -590 Q125 -585 120 -470 Q115 -385 0 -382 Q-115 -385 -120 -470 Z', fill: kLite(col, .15) }, H); kShade(H, hd);
  S('path', { d: 'M0 -588 L0 -630', stroke: kDark(col, .2), 'stroke-width': 10, 'stroke-linecap': 'round' }, H); kBall(H, 0, -640, 16, KC.pink);
  S('rect', { x: -92, y: -525, width: 184, height: 92, rx: 46, fill: '#140c2e' }, H); kGlow(H, 0, -479, 110, '#7cf6ff', .25);
  const E = S('g', { id: id + 'E' }, H); [-1, 1].forEach(sg => { S('ellipse', { cx: sg * 38, cy: -479, rx: 17, ry: 22, fill: '#7cf6ff' }, E); S('circle', { cx: sg * 38 + 5, cy: -486, r: 6, fill: '#fff' }, E); });
  S('path', { id: id + 'mS', d: 'M-22 -440 Q0 -428 22 -440', stroke: '#7cf6ff', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, H);
  return M;
}

// ---------- AI model options (pick ONE per video, keep it all video) ----------
// A: faceted crystal core — a cut gem with a glowing network inside, small shards floating around (no planet ring)
function kGem(par, cx, cy, r, col, id) {
  const g = S('g', { id }, par); kGlow(g, cx, cy, r * 2.4, col, .55, id + 'g');
  const pts = Array.from({ length: 6 }, (_, k) => [cx + Math.cos(Math.PI / 3 * k - Math.PI / 2) * r, cy + Math.sin(Math.PI / 3 * k - Math.PI / 2) * r * 1.08]);
  const shade = [.2, .05, -.25, -.4, -.15, .3];
  pts.forEach((p, k) => { const q = pts[(k + 1) % 6], f = shade[k]; S('path', { d: `M${cx} ${cy} L${p[0]} ${p[1]} L${q[0]} ${q[1]} Z`, fill: f > 0 ? kLite(col, f) : kDark(col, -f) }, g); });
  const net = S('g', { id: id + 'n', opacity: .85 }, g); const inner = pts.map(p => [cx + (p[0] - cx) * .55, cy + (p[1] - cy) * .55]);
  inner.forEach((p, k) => { S('path', { d: `M${cx} ${cy} L${p[0]} ${p[1]} L${inner[(k + 2) % 6][0]} ${inner[(k + 2) % 6][1]}`, stroke: kLite(col, .75), 'stroke-width': Math.max(2, r * .02), fill: 'none', opacity: .7 }, net); S('circle', { cx: p[0], cy: p[1], r: r * .05, fill: '#fff' }, net); });
  kGlow(g, cx, cy, r * .5, '#ffffff', .6); S('circle', { cx, cy, r: r * .09, fill: '#fff' }, g);
  S('path', { d: `M${pts[5][0] + r * .08} ${pts[5][1] + r * .1} L${pts[0][0] - r * .02} ${pts[0][1] + r * .2}`, stroke: '#fff', 'stroke-width': r * .04, 'stroke-linecap': 'round', opacity: .6 }, g);
  const sh = S('g', { id: id + 'o', class: 'kBob' }, g); [[-1.45, -.5, .2], [1.5, .2, .16], [-1.2, .85, .12], [1.1, -.95, .1]].forEach(([a, b, s2]) => kCrystal(sh, cx + a * r, cy + b * r, r * s2 * 2, kLite(col, .2), null, false));
  return g;
}
// B: neuron cluster — a cloud of glowing nodes and threads, brighter at the centre (a "mind" made of connections)
function kMind(par, cx, cy, r, col, id, n = 70) {
  const g = S('g', { id }, par); kGlow(g, cx, cy, r * 2.2, col, .5, id + 'g');
  const P = []; for (let k = 0; k < n; k++) { const a = k * 2.39996, d = Math.sqrt((k + .5) / n) * r * (.92 + .16 * rnd(k * 7)); P.push([cx + Math.cos(a) * d, cy + Math.sin(a) * d * .82, d / r]); }
  const L = S('g', {}, g); P.forEach((p, i) => P.forEach((q, j) => { if (j <= i) return; const dd = Math.hypot(p[0] - q[0], p[1] - q[1]); if (dd < r * .38) S('path', { d: `M${p[0]} ${p[1]} L${q[0]} ${q[1]}`, stroke: kLite(col, .5), 'stroke-width': Math.max(1.5, r * .012), opacity: .5 * (1 - dd / (r * .38)) + .1 }, L); }));
  kGlow(g, cx, cy, r * .8, kLite(col, .6), .55);
  const N = S('g', { id: id + 'n' }, g); P.forEach((p, k) => { const rr = r * (.035 + .045 * (1 - p[2])); kBall(N, p[0], p[1], rr, p[2] < .35 ? kLite(col, .6) : kLite(col, .25)); });
  kBall(g, cx, cy, r * .14, kLite(col, .75), kLite(col, .3), '#fff');
  return g;
}
// C: glowing machine-cell orb — soft translucent membrane, inner layers, glowing nucleus with circuitry (zoom INTO it)
function kOrb(par, cx, cy, r, col, id) {
  const g = S('g', { id }, par); kGlow(g, cx, cy, r * 2.2, col, .5, id + 'g'); const d = kDefs(par);
  const m = S('path', { d: kBlobD(cx, cy, r, .12, 4, 10), fill: kMix(col, '#0b0820', .35), 'fill-opacity': .85 }, g); kShade(g, m);
  S('path', { d: kBlobD(cx, cy, r, .12, 4, 10), fill: 'none', stroke: kLite(col, .55), 'stroke-width': r * .05, opacity: .7 }, g);
  S('path', { d: kBlobD(cx - r * .04, cy - r * .02, r * .78, .14, 8, 9), fill: kMix(col, '#0b0820', .15), opacity: .8 }, g);
  for (let k = 0; k < 9; k++) { const a = k * .7 + .4, dd = r * (.5 + .2 * rnd(k * 5)); kBall(g, cx + Math.cos(a) * dd, cy + Math.sin(a) * dd * .9, r * (.04 + .03 * rnd(k * 11)), kLite(col, .35)); }
  kGlow(g, cx, cy, r * .7, kLite(col, .5), .6); kBall(g, cx, cy, r * .34, kLite(col, .3), null, null, id + 'k', '#fff');
  const c = S('g', { opacity: .9 }, g); for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3 + .3, x2 = cx + Math.cos(a) * r * .24, y2 = cy + Math.sin(a) * r * .24; S('path', { d: `M${cx} ${cy} L${(cx + x2) / 2} ${cy} L${x2} ${y2}`, stroke: '#fff', 'stroke-width': r * .018, fill: 'none', opacity: .75 }, c); S('circle', { cx: x2, cy: y2, r: r * .03, fill: '#fff' }, c); }
  return g;
}
