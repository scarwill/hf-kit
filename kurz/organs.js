// ===================== KURZ ORGANS: eye, cross-section, brain, camera, phone, landscape window (load after kurz/kurz.js) =====================
// kEye2 (front-view eye, iris id+"i"), kView2 (landscape in a window, clouds id+"cl"), kVoid (missing patch), kPhone2 (phone with + and dot: id+"P", id+"D"),
// kEyeFull(G, Cx, Cy, R, TH, ax) (animatable cross-section; ids sig/.sigD, .cellA, ray0-2/rayGl0-2/rg0-2, rayG, gapV, gapR, gapG, disc, lens; returns {ex,ey,gx,gy}), kBrain2 (shaded brain), kCamR2 (film camera, red light id+"R")
// ---- the hero eye, front view, with shading, iris fibres, caruncle, rim light ----
function kEye2(par, cx, cy, s, id, o = {}) {
  const g = S('g', { id }, par), d = kDefs(par);
  const al = `M${cx - 260 * s} ${cy} Q${cx} ${cy - 330 * s} ${cx + 260 * s} ${cy} Q${cx} ${cy + 330 * s} ${cx - 260 * s} ${cy} Z`;
  if (o.halo !== false) S('circle', { cx, cy, r: 360 * s, fill: kRG(d, [[0, '#4cc9f0', .35], [1, '#4cc9f0', 0]]) }, g);
  const scl = S('g', {}, g); const sp = S('path', { d: al, fill: '#f6f1ec' }, scl); const cl = S('g', { 'clip-path': kClip(d, sp) }, scl);
  S('ellipse', { cx: cx + 40 * s, cy: cy + 150 * s, rx: 320 * s, ry: 120 * s, fill: '#d8cdc4' }, cl);
  S('ellipse', { cx: cx - 232 * s, cy: cy + 4 * s, rx: 30 * s, ry: 24 * s, fill: '#f2a3a3', opacity: .85 }, cl);
  [[-150, -20, -60, -40], [-160, 30, -80, 55], [170, -10, 100, -35]].forEach(([x1, y1, x2, y2]) => S('path', { d: `M${cx + x1 * s} ${cy + y1 * s} Q${cx + (x1 + x2) / 2 * s} ${cy + (y1 + y2) / 2 * s - 12 * s} ${cx + x2 * s} ${cy + y2 * s}`, stroke: '#e58e98', 'stroke-width': 3 * s, fill: 'none', opacity: .55 }, cl));
  const ir = S('g', { id: id + 'i', 'clip-path': kClip(d, sp) }, g), ix = cx + (o.look || 0) * s;
  S('circle', { cx: ix, cy, r: 134 * s, fill: kRG(d, [[0, '#9ad4ff'], [.45, '#4e9bff'], [.85, '#2361c4'], [1, '#123a7a']]) }, ir);
  for (let k = 0; k < 36; k++) { const a = k * 10 + (k % 3) * 3; const [x1, y1] = kPt(ix, cy, 62 * s, a), [x2, y2] = kPt(ix, cy, (112 + (k % 4) * 6) * s, a + 4);
    S('path', { d: `M${x1} ${y1} L${x2} ${y2}`, stroke: k % 2 ? '#bfe3ff' : '#1d4f9e', 'stroke-width': 3.2 * s, opacity: .45, 'stroke-linecap': 'round' }, ir); }
  S('circle', { cx: ix, cy, r: 58 * s, fill: '#05050f' }, ir);
  S('ellipse', { cx, cy: cy - 165 * s, rx: 320 * s, ry: 80 * s, fill: '#1a0f2e', opacity: .28 }, ir);
  S('path', { d: `M${ix + 40 * s} ${cy + 70 * s} A${110 * s} ${110 * s} 0 0 0 ${ix + 110 * s} ${cy - 10 * s}`, stroke: '#cfeaff', 'stroke-width': 6 * s, fill: 'none', opacity: .5, 'stroke-linecap': 'round' }, ir);
  const hl = S('g', {}, g);
  S('rect', { x: ix - 70 * s, y: cy - 70 * s, width: 46 * s, height: 34 * s, rx: 10 * s, fill: '#fff', transform: `rotate(-20 ${ix - 47 * s} ${cy - 53 * s})` }, hl);
  S('circle', { cx: ix + 34 * s, cy: cy + 34 * s, r: 10 * s, fill: '#fff', opacity: .85 }, hl);
  S('path', { d: `M${cx - 210 * s} ${cy + 40 * s} Q${cx} ${cy + 200 * s} ${cx + 210 * s} ${cy + 40 * s}`, stroke: '#9fe3ff', 'stroke-width': 5 * s, fill: 'none', opacity: .55, 'stroke-linecap': 'round' }, g);
  return g;
}
// ---- landscape window (shaded hills, layered sky, tree with two-tone canopy, clouds with shadow) ----
function kView2(par, x, y, w, h, id) {
  const g = S('g', { id }, par), d = kDefs(par);
  S('rect', { x: x - 16, y: y - 16, width: w + 32, height: h + 32, rx: 54, fill: '#000', opacity: .28 }, g);
  const fr = S('rect', { x, y, width: w, height: h, rx: 40, fill: kLG(d, [[0, '#3f9cf0'], [.6, '#8fd0ff'], [1, '#cdeeff']]) }, g);
  const c = S('g', { 'clip-path': kClip(d, fr) }, g);
  S('circle', { cx: x + w * .8, cy: y + h * .28, r: 210, fill: kRG(d, [[0, '#fff1b8', .9], [.35, '#ffd27a', .5], [1, '#ffd27a', 0]]) }, c);
  kBall(c, x + w * .8, y + h * .28, 50, '#fff3c4', '#ffd27a', '#ffffff');
  const cl = S('g', { id: id + 'cl' }, c);
  [[.22, .2, 1], [.42, .14, .7]].forEach(([a, b, k]) => { const X = x + w * a, Y = y + h * b;
    [[-60, 10, 44], [-15, -12, 58], [40, 5, 46], [80, 18, 30]].forEach(([dx, dy, r]) => S('circle', { cx: X + dx * k, cy: Y + dy * k, r: r * k, fill: '#ffffff' }, cl));
    S('ellipse', { cx: X + 5 * k, cy: Y + 34 * k, rx: 100 * k, ry: 12 * k, fill: '#cfe6f7' }, cl); });
  S('ellipse', { cx: x + w * .9, cy: y + h * .82, rx: w * .5, ry: h * .3, fill: '#6fae8a' }, c);
  const hill = (cx2, cy2, rx, ry, base, top) => { const e = S('ellipse', { cx: cx2, cy: cy2, rx, ry, fill: base }, c); const k2 = S('g', { 'clip-path': kClip(d, e) }, c); S('ellipse', { cx: cx2 - rx * .1, cy: cy2 - ry * .92, rx: rx * .95, ry: ry * .22, fill: top, opacity: .7 }, k2); S('ellipse', { cx: cx2 + rx * .5, cy: cy2 + ry * .2, rx: rx * .6, ry, fill: '#000', opacity: .12 }, k2); };
  hill(x + w * .2, y + h * 1.02, w * .55, h * .45, '#3fa66b', '#7bd38f'); hill(x + w * .85, y + h * 1.1, w * .55, h * .45, '#2f8a57', '#5fbf7a');
  const tx = x + w * .62, ty = y + h * .5;
  S('ellipse', { cx: tx + 10, cy: ty + 132, rx: 60, ry: 10, fill: '#000', opacity: .2 }, c);
  S('rect', { x: tx - 10, y: ty + 20, width: 20, height: 112, rx: 6, fill: '#7a4b2a' }, c); S('rect', { x: tx + 2, y: ty + 20, width: 8, height: 112, fill: '#5e3820' }, c);
  kBall(c, tx, ty, 64, '#2f8a57', '#1f5e3c', '#6fd08f'); kBall(c, tx - 40, ty + 26, 40, '#36975f', '#1f5e3c', '#7bd89a'); kBall(c, tx + 44, ty + 20, 42, '#2b8050', '#1a5235', '#5fc282');
  return g;
}
// ---- the void spot (missing patch) ----
function kVoid(par, cx, cy, r, id) { const g = S('g', { id }, par), d = kDefs(par);
  S('circle', { cx, cy, r: r * 1.8, fill: kRG(d, [[0, KC.pink, .55], [1, KC.pink, 0]]) }, g);
  S('circle', { cx, cy, r, fill: kRG(d, [[0, '#000'], [.7, '#0b0820'], [1, '#2a1240']]) }, g);
  S('circle', { cx, cy, r: r - 3, fill: 'none', stroke: KC.pink, 'stroke-width': 4, opacity: .7 }, g); return g; }
// ---- phone with test screen (shaded body, glass reflection) ----
function kPhone2(par, cx, cy, w, h, id, scr, o = {}) {
  const g = S('g', { id }, par), d = kDefs(par);
  S('rect', { x: cx - w / 2 + 14, y: cy - h / 2 + 26, width: w, height: h, rx: 70, fill: '#000', opacity: .3 }, g);
  S('rect', { x: cx - w / 2, y: cy - h / 2, width: w, height: h, rx: 70, fill: kLG(d, [[0, '#33496b'], [1, '#1a2638']]) }, g);
  S('rect', { x: cx - w / 2 + 6, y: cy - h / 2 + 6, width: w - 12, height: h - 12, rx: 64, fill: 'none', stroke: '#6f8bb5', 'stroke-width': 3, opacity: .5 }, g);
  const sc = S('rect', { x: cx - w / 2 + 50, y: cy - h / 2 + 40, width: w - 100, height: h - 80, rx: 30, fill: scr }, g);
  const c = S('g', { 'clip-path': kClip(d, sc) }, g);
  S('path', { d: `M${cx - w / 2} ${cy - h / 2} L${cx - w / 2 + w * .35} ${cy - h / 2} L${cx - w / 2 + w * .15} ${cy + h / 2} L${cx - w / 2 - w * .05} ${cy + h / 2} Z`, fill: '#fff', opacity: .25 }, c);
  S('circle', { cx: cx - w / 2 + 25, cy, r: 8, fill: '#0f1724' }, g);
  const px = cx + (o.plus ?? -260), dx = cx + (o.dot ?? 240);
  const pl = S('g', { id: id + 'P' }, g); S('rect', { x: px - 48, y: cy - 11, width: 96, height: 22, rx: 8, fill: KC.ink }, pl); S('rect', { x: px - 11, y: cy - 48, width: 22, height: 96, rx: 8, fill: KC.ink }, pl);
  if (o.withDot !== false) kBall(g, dx, cy, 36, KC.dot, '#c93c46', '#ff9a9a', id + 'D');
  return g;
}
function kEyeFull(G, Cx, Cy, R, TH, ax) {
  const d = kDefs(G);
  S('circle', { cx: Cx, cy: Cy, r: R + 170, fill: kRG(d, [[0, '#ff8fb8', .28], [1, '#ff8fb8', 0]]) }, G);
  const [ex, ey] = kPt(Cx, Cy, R, TH);
  const nd = `M${Cx + 200} ${Cy + 40} L${ex} ${ey} Q${ex + 200} ${ey + 40} ${ax + 1760} ${ey + 150}`;
  S('path', { d: nd, stroke: '#000', 'stroke-width': 130, fill: 'none', 'stroke-linecap': 'round', opacity: .25, transform: 'translate(10 22)' }, G);
  S('path', { d: nd, stroke: KC.nerve, 'stroke-width': 120, fill: 'none', 'stroke-linecap': 'round' }, G);
  S('path', { d: `M${ex} ${ey + 34} Q${ex + 200} ${ey + 74} ${ax + 1760} ${ey + 184}`, stroke: '#c9832f', 'stroke-width': 46, fill: 'none', 'stroke-linecap': 'round', opacity: .6 }, G);
  S('path', { d: `M${ex} ${ey - 36} Q${ex + 200} ${ey + 4} ${ax + 1760} ${ey + 114}`, stroke: '#ffd99a', 'stroke-width': 16, fill: 'none', 'stroke-linecap': 'round', opacity: .8 }, G);
  [-18, 6, 26].forEach(o => S('path', { d: `M${ex} ${ey + o} Q${ex + 200} ${ey + 40 + o} ${ax + 1740} ${ey + 150 + o}`, stroke: KC.nerveD, 'stroke-width': 6, fill: 'none', opacity: .6, 'stroke-dasharray': '60 18' }, G));
  const sig = S('g', { id: 'sig' }, G); [0, 1, 2, 3].forEach(() => S('circle', { class: 'sigD', cx: ex + 30, cy: ey + 8, r: 14, fill: '#fff6d6' }, sig)); hidId('sig');
  const sc = S('circle', { cx: Cx, cy: Cy, r: R, fill: '#f3e7dd' }, G); const scc = S('g', { 'clip-path': kClip(d, sc) }, G);
  S('circle', { cx: Cx + 120, cy: Cy + 140, r: R, fill: '#cdb6a6', opacity: .55 }, scc); S('circle', { cx: Cx - 150, cy: Cy - 170, r: R * .55, fill: '#fffaf5', opacity: .7 }, scc);
  S('path', { d: kArc(Cx, Cy, R - 6, 190, 260), stroke: '#ffffff', 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round', opacity: .8 }, G);
  S('circle', { cx: Cx, cy: Cy, r: R - 28, fill: kRG(d, [[0, '#5b3d86'], [.7, '#38235a'], [1, '#22143a']], '38%', '45%', '60%') }, G);
  S('path', { d: kArc(Cx, Cy, R - 42, -114, 114), stroke: '#8f2752', 'stroke-width': 18, fill: 'none' }, G);
  S('path', { d: kArc(Cx, Cy, R - 58, -112, TH - 10), stroke: '#ff8a5b', 'stroke-width': 18, fill: 'none' }, G);
  S('path', { d: kArc(Cx, Cy, R - 58, TH + 10, 112), stroke: '#ff8a5b', 'stroke-width': 18, fill: 'none' }, G);
  [1, -1].forEach(dir => { let p = `M${kPt(Cx, Cy, R - 60, TH).join(' ')}`; for (let k = 1; k <= 8; k++) { const a = TH + dir * k * 11, r = R - 62 + (k % 2 ? -5 : 4); p += ` L${kPt(Cx, Cy, r, a).map(v => v.toFixed(1)).join(' ')}`; }
    S('path', { d: p, stroke: '#d23a5a', 'stroke-width': 7, fill: 'none', 'stroke-linejoin': 'round', 'stroke-linecap': 'round', opacity: .9 }, G);
    [2, 4, 6].forEach(k => { const a = TH + dir * k * 11, [x1, y1] = kPt(Cx, Cy, R - 62, a), [x2, y2] = kPt(Cx, Cy, R - 96, a + dir * 9);
      S('path', { d: `M${x1} ${y1} Q${(x1 + x2) / 2 + 10} ${(y1 + y2) / 2} ${x2} ${y2}`, stroke: '#d23a5a', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round', opacity: .8 }, G); }); });
  S('path', { id: 'disc', d: kArc(Cx, Cy, R - 50, TH - 10, TH + 10), stroke: KC.nerve, 'stroke-width': 36, fill: 'none' }, G);
  S('ellipse', { cx: Cx - R + 4, cy: Cy, rx: 64, ry: 178, fill: kLG(d, [[0, '#cdeeff', .75], [1, '#7cc4f2', .45]], 1, 0) }, G);
  S('path', { d: `M${Cx - R - 38} ${Cy - 110} Q${Cx - R - 52} ${Cy} ${Cx - R - 38} ${Cy + 60}`, stroke: '#fff', 'stroke-width': 8, fill: 'none', opacity: .7, 'stroke-linecap': 'round' }, G);
  [[-205, -85], [85, 205]].forEach(([a, b]) => S('rect', { x: Cx - R + 36, y: Cy + a, width: 28, height: b - a, rx: 10, fill: kLG(d, [[0, '#4e8de6'], [1, '#2a5fb8']], 1, 0) }, G));
  S('ellipse', { id: 'lens', cx: Cx - R + 94, cy: Cy, rx: 48, ry: 114, fill: kRG(d, [[0, '#ffffff'], [1, '#bfe6ff']], '40%', '40%', '70%') }, G);
  S('ellipse', { cx: Cx - R + 80, cy: Cy - 50, rx: 12, ry: 34, fill: '#fff', opacity: .9 }, G);
  let k = 0; for (let a = -106; a <= 106; a += 4) { if (Math.abs(a - TH) < 11) continue; const rod = k++ % 3 !== 0, [x, y] = kPt(Cx, Cy, R - (rod ? 88 : 82), a);
    const e = rod ? S('rect', { class: 'cellA', x: x - 20, y: y - 6, width: 40, height: 12, rx: 6, fill: KC.cell, transform: `rotate(${a} ${x} ${y})` }, G)
      : S('path', { class: 'cellA', d: `M${x + 14} ${y - 9} L${x + 14} ${y + 9} L${x - 16} ${y} Z`, fill: '#8ff0e2', transform: `rotate(${a} ${x} ${y})` }, G); hid(e); }
  const lx = Cx - R + 94;
  [[-150, -20, -48], [0, 0, -18], [150, 20, 40]].forEach(([y0, ly, a], i) => { const [tx, ty] = kPt(Cx, Cy, R - 100, a), dd = `M${ax - 200} ${Cy + y0} L${lx} ${Cy + ly} L${tx} ${ty}`;
    S('path', { id: 'rayGl' + i, d: dd, stroke: KC.light, 'stroke-width': 30, fill: 'none', opacity: .18, 'stroke-linejoin': 'round' }, G); hidId('rayGl' + i);
    CRV(G, dd, '#ffe7a3', 'ray' + i, 8); hidId('ray' + i);
    S('circle', { id: 'rg' + i, cx: tx, cy: ty, r: 56, fill: kRG(d, [[0, '#fff6c8', .95], [.4, '#ffd166', .5], [1, '#ffd166', 0]]) }, G); hidId('rg' + i); });
  const [gx, gy] = kPt(Cx, Cy, R - 70, TH);
  CRV(G, `M${ax - 200} ${Cy - 60} L${lx} ${Cy - 4} L${gx} ${gy}`, '#ffe7a3', 'rayG', 8); hidId('rayG');
  kVoid(G, gx + 4, gy + 1, 34, 'gapV'); hidId('gapV');
  S('circle', { id: 'gapR', cx: gx + 4, cy: gy + 1, r: 64, fill: 'none', stroke: KC.pink, 'stroke-width': 6, 'stroke-dasharray': '14 10' }, G); hidId('gapR');
  glowRing(G, gx + 4, gy + 1, 70, KC.pink, 'gapG', 8); hidId('gapG');
  return { ex, ey, gx, gy };
}
function kBrain2(par, cx, cy, s, id) {
  const g = S('g', { id }, par), d = kDefs(par);
  S('circle', { cx, cy, r: 310 * s, fill: kRG(d, [[0, KC.brain, .38], [1, KC.brain, 0]]) }, g);
  S('path', { d: `M${cx + 10 * s} ${cy + 90 * s} L${cx + 36 * s} ${cy + 200 * s} Q${cx + 62 * s} ${cy + 212 * s} ${cx + 86 * s} ${cy + 196 * s} L${cx + 76 * s} ${cy + 90 * s} Z`, fill: '#c9507c' }, g);
  [[-70, 55, 98], [75, 55, 98], [-105, -25, 108], [105, -25, 108], [0, -75, 122], [0, 5, 118]].forEach(([dx, dy, r]) => kBall(g, cx + dx * s, cy + dy * s, r * s, '#ff8fb8', '#d9578a', '#ffc9dd'));
  const f = (dd, w = 9) => S('path', { d: dd, stroke: KC.brainD, 'stroke-width': w * s, fill: 'none', 'stroke-linecap': 'round', opacity: .8 }, g), P2 = (a, b) => `${cx + a * s} ${cy + b * s}`;
  f(`M${P2(0, -190)} Q${P2(-22, -60)} ${P2(0, 90)}`, 11);
  f(`M${P2(-165, -40)} Q${P2(-120, -90)} ${P2(-76, -40)} Q${P2(-44, -8)} ${P2(-76, 26)}`); f(`M${P2(165, -40)} Q${P2(120, -90)} ${P2(76, -40)} Q${P2(44, -8)} ${P2(76, 26)}`);
  f(`M${P2(-128, 70)} Q${P2(-86, 34)} ${P2(-42, 78)}`); f(`M${P2(128, 70)} Q${P2(86, 34)} ${P2(42, 78)}`);
  f(`M${P2(-70, -138)} Q${P2(-44, -104)} ${P2(-78, -84)}`); f(`M${P2(70, -138)} Q${P2(44, -104)} ${P2(78, -84)}`);
  S('path', { d: kArc(cx, cy - 10 * s, 190 * s, 200, 250), stroke: '#fff', 'stroke-width': 9 * s, fill: 'none', opacity: .5, 'stroke-linecap': 'round' }, g);
  return g;
}
function kCamR2(par, cx, cy, s, id) {
  const g = S('g', { id }, par);
  S('ellipse', { cx: cx + 20 * s, cy: cy + 125 * s, rx: 210 * s, ry: 18 * s, fill: '#000', opacity: .25 }, g);
  [[-70, -150], [70, -150]].forEach(([dx, dy]) => { kBall(g, cx + dx * s, cy + dy * s, 70 * s, '#46598a', '#2b3a5c', '#7a90c4'); S('circle', { cx: cx + dx * s, cy: cy + dy * s, r: 22 * s, fill: '#22304a' }, g); });
  const body = S('rect', { x: cx - 170 * s, y: cy - 90 * s, width: 300 * s, height: 190 * s, rx: 30 * s, fill: '#4b5f88' }, g);
  S('rect', { x: cx - 170 * s, y: cy + 40 * s, width: 300 * s, height: 60 * s, rx: 24 * s, fill: '#3b4d70' }, g);
  S('rect', { x: cx - 160 * s, y: cy - 82 * s, width: 280 * s, height: 22 * s, rx: 11 * s, fill: '#fff', opacity: .15 }, g);
  S('path', { d: `M${cx + 130 * s} ${cy - 40 * s} L${cx + 230 * s} ${cy - 90 * s} L${cx + 230 * s} ${cy + 100 * s} L${cx + 130 * s} ${cy + 50 * s} Z`, fill: '#2f3f5f' }, g);
  kBall(g, cx - 30 * s, cy + 5 * s, 60 * s, '#22304a', '#141c2e', '#3a4c74'); kBall(g, cx - 30 * s, cy + 5 * s, 38 * s, '#4ea1ff', '#2361c4', '#bfe3ff');
  S('circle', { cx: cx - 44 * s, cy: cy - 8 * s, r: 10 * s, fill: '#fff' }, g);
  kBall(g, cx - 130 * s, cy - 60 * s, 14 * s, '#ff4d4d', '#b92b2b', '#ff9a9a', id + 'R');
  return g;
}
