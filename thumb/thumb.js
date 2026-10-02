// ===================== THUMBNAIL KIT (1280x720 SVG, rendered to PNG by shot.js) =====================
// Usage in a thumb html:  <svg id="T" viewBox="0 0 1280 720"></svg> <script src="thumb.js"></script> <script> ... </script>
const NS = 'http://www.w3.org/2000/svg';
const S = (tag, a = {}, par) => { const e = document.createElementNS(NS, tag); for (const k in a) e.setAttribute(k, a[k]); if (par) par.appendChild(e); return e; };
const SVG = document.getElementById('T'); const DEFS = S('defs', {}, SVG);
let _gid = 0; const uid = p => p + (++_gid);
function lg(stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1) { const id = uid('lg'); const g = S('linearGradient', { id, x1, y1, x2, y2 }, DEFS); stops.forEach(([o, c, a]) => S('stop', { offset: o, 'stop-color': c, 'stop-opacity': a ?? 1 }, g)); return `url(#${id})`; }
function rg(stops, cx = .5, cy = .5, r = .5) { const id = uid('rg'); const g = S('radialGradient', { id, cx, cy, r }, DEFS); stops.forEach(([o, c, a]) => S('stop', { offset: o, 'stop-color': c, 'stop-opacity': a ?? 1 }, g)); return `url(#${id})`; }
function blurF(sd) { const id = uid('bl'); const f = S('filter', { id, x: '-50%', y: '-50%', width: '200%', height: '200%' }, DEFS); S('feGaussianBlur', { stdDeviation: sd }, f); return `url(#${id})`; }
function shadowF(dy = 10, sd = 12, op = .6) { const id = uid('sh'); const f = S('filter', { id, x: '-30%', y: '-30%', width: '160%', height: '160%' }, DEFS); S('feDropShadow', { dx: 0, dy, stdDeviation: sd, 'flood-color': '#000', 'flood-opacity': op }, f); return `url(#${id})`; }
const G = (par = SVG, a = {}) => S('g', a, par);
const glow = (par, cx, cy, r, col, op = .7) => S('circle', { cx, cy, r, fill: rg([[0, col, op], [.45, col, op * .35], [1, col, 0]]) }, par);

// ---------- background: dark base + accent spotlight behind the hero (no vignette) ----------
function bg(acc, hx = 900, hy = 360, acc2) {
  S('rect', { width: 1280, height: 720, fill: lg([[0, '#0a1024'], [1, '#05070f']]) }, SVG);
  const gr = G(SVG, { opacity: .5 });
  for (let x = 0; x <= 1280; x += 64) S('path', { d: `M${x} 0V720`, stroke: '#1c2a4a', 'stroke-width': 1.5 }, gr);
  for (let y = 0; y <= 720; y += 64) S('path', { d: `M0 ${y}H1280`, stroke: '#1c2a4a', 'stroke-width': 1.5 }, gr);
  S('ellipse', { cx: hx, cy: hy, rx: 620, ry: 470, fill: rg([[0, acc, .55], [.5, acc, .16], [1, acc, 0]]) }, SVG);
  if (acc2) S('ellipse', { cx: 1280 - hx, cy: 720 - hy * .6, rx: 520, ry: 360, fill: rg([[0, acc2, .28], [1, acc2, 0]]) }, SVG);
}

// ---------- title: the user's text, exactly as given. lines = [['IT','HAS'],['NO','HANDS']], hl = Set of words in highlight colour ----------
// Auto-fits each line to maxW. Heavy look = black outline + same-colour stroke + drop shadow.
function title(lines, { x = 70, y = 90, maxW = 600, size = 150, lh = 1.0, hl = [], hlCol = '#facc15', col = '#ffffff', anchor = 'start', rot = 0, box } = {}) {
  const g = G(SVG, { transform: `rotate(${rot} ${x} ${y})` });
  const H = new Set(hl); let yy = y; const out = [];
  // hierarchy: the line holding highlight words is the biggest (fills maxW); other lines are at most 80% of it
  const fit = lines.map(words => { const t = S('text', { 'font-family': 'Poppins', 'font-weight': 700, 'font-size': 100, 'letter-spacing': -2 }, g); t.textContent = words.join(' '); const w = t.getComputedTextLength(); t.remove(); return 100 * maxW / w; });
  const isH = lines.map(ws => ws.some(w => H.has(w)));
  const hs = Math.min(size * 1.25, ...fit.filter((f, i) => isH[i]).concat(isH.some(Boolean) ? [] : fit));
  const FS = fit.map((f, i) => isH[i] ? Math.min(f, hs) : Math.min(f, isH.some(Boolean) ? hs * .8 : hs, size));
  lines.forEach((words, li) => {
    let fs = FS[li];
    const mk = (layer) => {
      const t = S('text', { x, y: yy, 'font-family': 'Poppins', 'font-weight': 700, 'font-size': fs, 'text-anchor': anchor, 'letter-spacing': -fs * .02 }, g);
      words.forEach((w, k) => { const ts = S('tspan', {}, t); ts.textContent = (k ? ' ' : '') + w; const c = H.has(w) ? hlCol : col;
        if (layer === 'sh') { ts.setAttribute('fill', '#000'); }
        else if (layer === 'out') { ts.setAttribute('fill', '#000'); ts.setAttribute('stroke', '#000'); ts.setAttribute('stroke-width', fs * .16); ts.setAttribute('stroke-linejoin', 'round'); }
        else { ts.setAttribute('fill', c); ts.setAttribute('stroke', c); ts.setAttribute('stroke-width', fs * .035); ts.setAttribute('stroke-linejoin', 'round'); } });
      return t; };
    // measure, then fit
    if (li === 0) yy = y + fs * .78; else yy += (FS[li - 1] * .22 + fs * .80) * lh;
    const sh = mk('sh'); sh.setAttribute('transform', `translate(${fs * .03} ${fs * .07})`); sh.setAttribute('filter', blurF(fs * .05)); sh.setAttribute('opacity', .8);
    mk('out'); out.push(mk('fill'));
  });
  if (box) { const b = g.getBBox(); const r = S('rect', { x: b.x - 26, y: b.y - 14, width: b.width + 52, height: b.height + 28, rx: 18, fill: box }, g); g.insertBefore(r, g.firstChild); }
  return g;
}

// ---------- objects ----------
// AI chip with neural glyph. (cx,cy) centre, s = side length
function aiChip(par, cx, cy, s, acc = '#22d3ee') {
  const g = G(par); const h = s / 2;
  glow(g, cx, cy, s * 1.05, acc, .55);
  const pins = G(g); const n = 6, step = s / (n + 1);
  for (let i = 1; i <= n; i++) { const o = -h + i * step - s * .035;
    [[cx + o, cy - h - s * .13, s * .07, s * .15], [cx + o, cy + h - s * .02, s * .07, s * .15], [cx - h - s * .13, cy + o, s * .15, s * .07], [cx + h - s * .02, cy + o, s * .15, s * .07]]
      .forEach(([x, y, w, hh]) => S('rect', { x, y, width: w, height: hh, rx: s * .02, fill: lg([[0, '#e2e8f0'], [1, '#94a3b8']]) }, pins)); }
  S('rect', { x: cx - h, y: cy - h, width: s, height: s, rx: s * .12, fill: lg([[0, '#1e293b'], [1, '#0b1222']]), stroke: acc, 'stroke-width': s * .025, filter: shadowF(14, 16, .7) }, g);
  S('rect', { x: cx - h * .74, y: cy - h * .74, width: s * .74, height: s * .74, rx: s * .08, fill: lg([[0, '#0f2a3d'], [1, '#081420']]), stroke: acc, 'stroke-opacity': .5, 'stroke-width': s * .012 }, g);
  // neural glyph
  const P = [[-.22, -.2], [.0, -.27], [.22, -.18], [-.26, .05], [.04, .0], [.25, .08], [-.12, .25], [.14, .26]].map(([a, b]) => [cx + a * s, cy + b * s]);
  const E = [[0, 1], [1, 2], [0, 3], [0, 4], [1, 4], [2, 4], [2, 5], [3, 4], [4, 5], [3, 6], [4, 6], [4, 7], [5, 7], [6, 7]];
  E.forEach(([a, b]) => S('path', { d: `M${P[a][0]} ${P[a][1]}L${P[b][0]} ${P[b][1]}`, stroke: acc, 'stroke-width': s * .016, 'stroke-opacity': .85 }, g));
  P.forEach(([x, y], i) => { glow(g, x, y, s * .07, acc, .9); S('circle', { cx: x, cy: y, r: s * (i === 4 ? .05 : .032), fill: i === 4 ? '#ffffff' : '#a5f3fc' }, g); });
  return g;
}
// classic mouse pointer, tip at (x,y)
function cursor(par, x, y, s = 1, rot = -8) {
  const g = G(par, { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})`, filter: shadowF(10, 10, .7) });
  S('path', { d: 'M0 0 L0 150 L36 116 L62 176 L88 164 L62 106 L110 104 Z', fill: '#ffffff', stroke: '#0b1222', 'stroke-width': 9, 'stroke-linejoin': 'round' }, g);
  return g;
}
// click burst around (x,y)
function burst(par, x, y, r = 60, col = '#facc15', n = 7, a0 = -150, a1 = -20) {
  const g = G(par);
  for (let i = 0; i < n; i++) { const a = (a0 + (a1 - a0) * i / (n - 1)) * Math.PI / 180;
    S('path', { d: `M${x + Math.cos(a) * r * .55} ${y + Math.sin(a) * r * .55} L${x + Math.cos(a) * r} ${y + Math.sin(a) * r}`, stroke: col, 'stroke-width': r * .13, 'stroke-linecap': 'round' }, g); }
  return g;
}
// big glossy push button (top view, slight 3D)
function bigButton(par, cx, cy, r, col = '#ef4444', dark = '#7f1d1d') {
  const g = G(par);
  glow(g, cx, cy, r * 2.1, col, .55);
  S('ellipse', { cx, cy: cy + r * .28, rx: r * 1.18, ry: r * .62, fill: '#0b1222' }, g);
  S('rect', { x: cx - r, y: cy - r * .1, width: r * 2, height: r * .38, fill: dark }, g);
  S('ellipse', { cx, cy: cy + r * .28, rx: r, ry: r * .5, fill: dark }, g);
  S('ellipse', { cx, cy: cy - r * .1, rx: r, ry: r * .5, fill: lg([[0, '#fca5a5'], [.45, col], [1, dark]]) }, g);
  S('ellipse', { cx: cx - r * .3, cy: cy - r * .25, rx: r * .35, ry: r * .12, fill: '#fff', opacity: .55 }, g);
  return g;
}
// dashed glowing link from a to b (quadratic, bend = perpendicular offset)
function beam(par, x1, y1, x2, y2, col, bend = 0, w = 7) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
  const qx = mx - dy / L * bend, qy = my + dx / L * bend; const d = `M${x1} ${y1} Q${qx} ${qy} ${x2} ${y2}`;
  S('path', { d, stroke: col, 'stroke-width': w * 3, 'stroke-opacity': .25, fill: 'none', filter: blurF(6) }, par);
  S('path', { d, stroke: col, 'stroke-width': w, fill: 'none', 'stroke-dasharray': `${w * 2.4} ${w * 1.8}`, 'stroke-linecap': 'round' }, par);
}
// monitor with screen group returned (draw into .scr, coords are screen-local 0..w,0..h)
function monitor(par, x, y, w, h, acc = '#38bdf8') {
  const g = G(par, { filter: shadowF(16, 18, .7) });
  S('rect', { x: x + w / 2 - w * .06, y: y + h + 10, width: w * .12, height: h * .16, fill: lg([[0, '#334155'], [1, '#1e293b']]) }, g);
  S('rect', { x: x + w / 2 - w * .2, y: y + h + 10 + h * .15, width: w * .4, height: h * .045, rx: 6, fill: '#334155' }, g);
  S('rect', { x: x - 16, y: y - 16, width: w + 32, height: h + 32, rx: 22, fill: lg([[0, '#334155'], [1, '#111827']]) }, g);
  S('rect', { x, y, width: w, height: h, rx: 8, fill: lg([[0, '#0b1a2e'], [1, '#060c18']]) }, g);
  const scr = G(g, { transform: `translate(${x} ${y})` });
  S('rect', { x: 0, y: 0, width: w, height: h, rx: 8, fill: rg([[0, acc, .22], [1, acc, 0]], .5, .45, .7) }, scr);
  S('path', { d: `M${w * .55} 0 L${w * .8} 0 L${w * .45} ${h} L${w * .2} ${h} Z`, fill: '#fff', opacity: .04 }, scr);
  return scr;
}
// hand-drawn red circle (ellipse, slightly rotated, overshoot) + arrow
function redRing(par, cx, cy, rx, ry, col = '#ef4444', w = 12) {
  const g = G(par, { transform: `rotate(-8 ${cx} ${cy})` }); let d = '';
  for (let i = 0; i <= 64; i++) { const a = -Math.PI * .6 + i / 64 * Math.PI * 2.12, k = 1 + .05 * Math.sin(i * .35);
    d += (i ? 'L' : 'M') + (cx + Math.cos(a) * rx * k).toFixed(1) + ' ' + (cy + Math.sin(a) * ry * k).toFixed(1); }
  S('path', { d, stroke: '#000', 'stroke-width': w + 8, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: .55 }, g);
  S('path', { d, stroke: col, 'stroke-width': w, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
  return g;
}
function fatArrow(par, x1, y1, x2, y2, col = '#ef4444', w = 26) {
  const a = Math.atan2(y2 - y1, x2 - x1), L = Math.hypot(x2 - x1, y2 - y1), hw = w * 1.35, hl = w * 1.6;
  const g = G(par, { transform: `translate(${x1} ${y1}) rotate(${a * 180 / Math.PI})`, filter: shadowF(6, 6, .7) });
  S('path', { d: `M0 ${-w / 2} Q${(L - hl) / 2} ${-w / 2 - 10} ${L - hl} ${-w / 2} L${L - hl} ${-hw} L${L} 0 L${L - hl} ${hw} L${L - hl} ${w / 2} Q${(L - hl) / 2} ${w / 2 + 10} 0 ${w / 2} Z`, fill: col, stroke: '#000', 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
  return g;
}
function qMark(par, x, y, size, col = '#facc15', rot = 10) {
  const g = G(par, { transform: `rotate(${rot} ${x} ${y})` });
  const t = (a) => { const e = S('text', Object.assign({ x, y, 'font-family': 'Poppins', 'font-weight': 700, 'font-size': size, 'text-anchor': 'middle' }, a), g); e.textContent = '?'; };
  t({ fill: '#000', stroke: '#000', 'stroke-width': size * .14, 'stroke-linejoin': 'round' }); t({ fill: col, stroke: col, 'stroke-width': size * .03 });
  return g;
}
// friendly robot WITHOUT arms (empty shoulder sockets). (cx, top y of head), s scale
function robotNoArms(par, cx, y, s = 1, acc = '#22d3ee') {
  const g = G(par, { transform: `translate(${cx} ${y}) scale(${s})` });
  const metal = lg([[0, '#e2e8f0'], [.55, '#94a3b8'], [1, '#475569']], 0, 0, 1, 1);
  glow(g, 0, 210, 300, acc, .35);
  // antenna
  S('path', { d: 'M0 -30 L0 10', stroke: '#94a3b8', 'stroke-width': 10 }, g); glow(g, 0, -38, 40, acc, .9); S('circle', { cx: 0, cy: -38, r: 14, fill: '#cffafe' }, g);
  // head
  S('rect', { x: -130, y: 8, width: 260, height: 190, rx: 56, fill: metal, stroke: '#0b1222', 'stroke-width': 8 }, g);
  S('rect', { x: -102, y: 40, width: 204, height: 122, rx: 40, fill: '#0b1222' }, g);
  [-48, 48].forEach(ex => { glow(g, ex, 96, 46, acc, .95); S('ellipse', { cx: ex, cy: 96, rx: 20, ry: 26, fill: '#cffafe' }, g); });
  S('path', { d: 'M-26 138 Q0 128 26 138', stroke: acc, 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, g);
  S('rect', { x: -150, y: 80, width: 22, height: 60, rx: 10, fill: '#64748b', stroke: '#0b1222', 'stroke-width': 6 }, g); S('rect', { x: 128, y: 80, width: 22, height: 60, rx: 10, fill: '#64748b', stroke: '#0b1222', 'stroke-width': 6 }, g);
  // neck + torso
  S('rect', { x: -34, y: 196, width: 68, height: 34, fill: '#475569', stroke: '#0b1222', 'stroke-width': 6 }, g);
  S('path', { d: 'M-150 250 Q-150 228 -126 228 L126 228 Q150 228 150 250 L136 470 L-136 470 Z', fill: metal, stroke: '#0b1222', 'stroke-width': 8 }, g);
  S('rect', { x: -70, y: 280, width: 140, height: 100, rx: 18, fill: '#0b1222' }, g);
  [[-40, 312, '#22c55e'], [0, 312, '#facc15'], [40, 312, '#ef4444']].forEach(([x, y, c]) => S('circle', { cx: x, cy: y, r: 11, fill: c }, g));
  S('rect', { x: -48, y: 340, width: 96, height: 14, rx: 7, fill: acc, opacity: .8 }, g);
  // empty shoulder sockets (where arms should be)
  const sock = side => { const sx = side * 150; S('ellipse', { cx: sx, cy: 270, rx: 26, ry: 38, fill: '#1e293b', stroke: '#0b1222', 'stroke-width': 7 }, g); S('ellipse', { cx: sx, cy: 270, rx: 13, ry: 22, fill: '#020617' }, g);
    [[-1, -1], [1, -.3], [.6, 1]].forEach(([a, b], k) => S('path', { d: `M${sx + side * 18} ${270 + b * 14} l${side * (22 + k * 6)} ${b * 12 - 6}`, stroke: k === 1 ? '#facc15' : '#f97316', 'stroke-width': 5, 'stroke-linecap': 'round' }, g)); };
  sock(-1); sock(1);
  return g;
}
// cartoon bust (head + shoulders), shocked. white/western look, short hair. (cx, chin y), s scale. Not a real person.
function bustShock(par, cx, cy, s = 1, o = {}) {
  const sk = o.skin ?? '#f2c29b', skD = o.skinD ?? '#dca57f', hc = o.hair ?? '#5b3a29', top = o.top ?? '#2563eb';
  const g = G(par, { transform: `translate(${cx} ${cy}) scale(${s})`, filter: shadowF(14, 16, .6) });
  // shoulders / hoodie
  S('path', { d: 'M-250 330 Q-245 150 -110 110 L110 110 Q245 150 250 330 Z', fill: top, stroke: '#0b1222', 'stroke-width': 8 }, g);
  S('path', { d: 'M-80 112 Q0 190 80 112', fill: lg([[0, '#1e3a8a'], [1, top]]), stroke: '#0b1222', 'stroke-width': 6 }, g);
  S('path', { d: 'M-40 160 L-46 240 M40 160 L46 240', stroke: '#e2e8f0', 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
  // neck
  S('path', { d: 'M-46 40 L-46 120 Q0 150 46 120 L46 40 Z', fill: skD, stroke: '#0b1222', 'stroke-width': 6 }, g);
  // ears
  [-1, 1].forEach(sd => { S('ellipse', { cx: sd * 128, cy: -110, rx: 26, ry: 38, fill: sk, stroke: '#0b1222', 'stroke-width': 6 }, g); });
  // head
  S('path', { d: 'M-130 -150 Q-136 -280 0 -284 Q136 -280 130 -150 Q128 -40 70 20 Q0 70 -70 20 Q-128 -40 -130 -150 Z', fill: sk, stroke: '#0b1222', 'stroke-width': 8 }, g);
  // hair (short, swept)
  S('path', { d: 'M-134 -150 Q-150 -270 -40 -300 Q60 -330 120 -270 Q150 -230 134 -150 Q120 -200 80 -220 Q20 -236 -40 -222 Q-100 -210 -134 -150 Z', fill: hc, stroke: '#0b1222', 'stroke-width': 7 }, g);
  S('path', { d: 'M-60 -272 Q0 -300 70 -270', stroke: '#7c4a2e', 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round', opacity: .8 }, g);
  // brows (raised high, shock)
  S('path', { d: 'M-96 -186 Q-62 -214 -26 -192', stroke: hc, 'stroke-width': 13, fill: 'none', 'stroke-linecap': 'round' }, g);
  S('path', { d: 'M26 -192 Q62 -214 96 -186', stroke: hc, 'stroke-width': 13, fill: 'none', 'stroke-linecap': 'round' }, g);
  // eyes: big whites, tiny pupils looking right (towards the subject)
  [-58, 58].forEach(ex => { S('ellipse', { cx: ex, cy: -128, rx: 34, ry: 40, fill: '#fff', stroke: '#0b1222', 'stroke-width': 6 }, g); S('circle', { cx: ex + (o.look ?? 10), cy: -126, r: 11, fill: '#0b1222' }, g); S('circle', { cx: ex + (o.look ?? 10) + 4, cy: -130, r: 3.5, fill: '#fff' }, g); });
  // nose
  S('path', { d: 'M0 -100 Q-14 -60 -4 -52 Q8 -48 14 -56', stroke: skD, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, g);
  // mouth: open O
  S('ellipse', { cx: 0, cy: -8, rx: 34, ry: 42, fill: '#7f1d1d', stroke: '#0b1222', 'stroke-width': 7 }, g);
  S('ellipse', { cx: 0, cy: 14, rx: 20, ry: 13, fill: '#f87171' }, g);
  S('path', { d: 'M-22 -38 Q0 -46 22 -38', stroke: '#fff', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, g);
  // cheeks
  [-84, 84].forEach(x => S('ellipse', { cx: x, cy: -64, rx: 20, ry: 12, fill: '#f472b6', opacity: .25 }, g));
  // sweat drop
  S('path', { d: 'M150 -230 Q136 -200 150 -186 Q164 -200 150 -230 Z', fill: '#7dd3fc', stroke: '#0b1222', 'stroke-width': 4 }, g);
  return g;
}
window.__THUMB_READY = true;
