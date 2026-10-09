// ===================== KURZ TECHVIZ: real technical visuals (matrix, attention, transformer, vectors, plots, code, equations) in the Kurz look =====================
// Load AFTER kurz.js + tech.js. Dark glowing world, shaded 3D shapes, NO outlines, NO white cards. Each helper hides itself until its reveal (kXXX(id, t)).
const kMono = el => { el.setAttribute('font-family', 'JetBrains Mono, monospace'); return el; };

// generic shaded 3D box (pipeline step, layer, block). w x h front face, depth dp (isometric up-right). label on the front face.
function kBox3D(par, cx, cy, w, h, dp, col, label, id, fs = 30, shadow = true) {
  const g = S('g', id ? { id } : {}, par), x = cx - w / 2, y = cy - h / 2, dx = dp * .8, dy = -dp * .5;
  if (shadow) S('ellipse', { cx: cx + dx / 2, cy: y + h + 14, rx: w * .6, ry: 14, fill: 'rgba(0,0,0,.3)' }, g);
  S('path', { d: `M${x} ${y} L${x + dx} ${y + dy} L${x + w + dx} ${y + dy} L${x + w} ${y} Z`, fill: kLite(col, .3) }, g);
  S('path', { d: `M${x + w} ${y} L${x + w + dx} ${y + dy} L${x + w + dx} ${y + h + dy} L${x + w} ${y + h} Z`, fill: kDark(col, .32) }, g);
  const f = S('rect', { x, y, width: w, height: h, rx: Math.min(14, h * .2), fill: col }, g);
  S('rect', { x: x + 10, y: y + 8, width: w * .4, height: 7, rx: 3.5, fill: '#fff', opacity: .3 }, g);
  if (label) wtext(g, cx, cy + fs * .36, label, fs, kLite(col, .85), 'middle', 700);
  return g;
}
// matrix / tensor: rows x cols cells, colour = value 0..1 (dark -> col). vals: 2D array or fn(r,c). nums: show numbers (needs cell >= 44)
function kMatrix(par, x, y, rows, cols, cell, vals, col, id, o = {}) {
  const g = S('g', { id }, par), gap = cell * .12, v = typeof vals === 'function' ? vals : (r, c) => vals[r][c];
  kGlow(g, x + cols * cell / 2, y + rows * cell / 2, Math.max(rows, cols) * cell * .75, col, .18);
  if (o.bracket !== false) [[x - cell * .35, 1], [x + cols * cell + cell * .35 - gap, -1]].forEach(([bx, sd]) => S('path', { d: `M${bx + sd * cell * .2} ${y - cell * .1} L${bx} ${y - cell * .1} L${bx} ${y + rows * cell + cell * .02} L${bx + sd * cell * .2} ${y + rows * cell + cell * .02}`, stroke: kLite(col, .5), 'stroke-width': Math.max(4, cell * .08), fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g));
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const val = Math.max(0, Math.min(1, v(r, c))), fc = kMix(kMix(col, '#0b0820', .78), kLite(col, .2), val);
    const cg = S('g', { class: id + 'c' }, g); S('rect', { x: x + c * cell, y: y + r * cell, width: cell - gap, height: cell - gap, rx: cell * .18, fill: fc }, cg);
    S('rect', { x: x + c * cell + cell * .12, y: y + r * cell + cell * .1, width: cell * .4, height: cell * .1, rx: cell * .05, fill: '#fff', opacity: .12 + val * .2 }, cg);
    if (o.nums && cell >= 44) kMono(wtext(cg, x + c * cell + (cell - gap) / 2, y + r * cell + (cell - gap) / 2 + cell * .13, (o.fmt || (n => n.toFixed(1)))(o.raw ? o.raw(r, c) : val), cell * .32, val > .55 ? '#0b0820' : kLite(col, .7), 'middle', 600)); }
  hidId(id); return g;
}
const kMATRIX = (id, t, d = .8) => { tl.set('#' + id, { autoAlpha: 1 }, t); tl.fromTo('#' + id + ' .' + id + 'c', { autoAlpha: 0, scale: .3, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: .35, stagger: d / document.querySelectorAll('#' + id + ' .' + id + 'c').length, ease: 'back.out(2)' }, t); B(t); };
// embedding / vector: [0.21, -0.84, ...] as shaded slabs with numbers + brackets. vertical = column vector
function kVector(par, x, y, nums, col, id, o = {}) {
  const g = S('g', { id }, par), cw = o.cw || 118, ch = o.ch || 58, vert = !!o.vertical, n = nums.length;
  const W = vert ? cw : n * (cw + 8) - 8, H = vert ? n * (ch + 8) - 8 : ch;
  kGlow(g, x + W / 2, y + H / 2, Math.max(W, H) * .6, col, .15);
  [[x - 22, 1], [x + W + 22, -1]].forEach(([bx, sd]) => S('path', { d: `M${bx + sd * 14} ${y - 8} L${bx} ${y - 8} L${bx} ${y + H + 8} L${bx + sd * 14} ${y + H + 8}`, stroke: kLite(col, .5), 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g));
  nums.forEach((v, k) => { const cx = vert ? x : x + k * (cw + 8), cy = vert ? y + k * (ch + 8) : y, cg = S('g', { class: id + 'c' }, g), a = Math.min(1, Math.abs(+v || 0));
    const fc = (+v || 0) < 0 ? kMix('#2a1d4a', KC.pink, .25 + a * .5) : kMix('#12304a', col, .3 + a * .55);
    S('rect', { x: cx, y: cy, width: cw, height: ch, rx: 14, fill: fc }, cg); S('rect', { x: cx + 10, y: cy + 7, width: cw * .4, height: 6, rx: 3, fill: '#fff', opacity: .25 }, cg);
    kMono(wtext(cg, cx + cw / 2, cy + ch / 2 + 10, typeof v === 'number' ? v.toFixed(2) : v, 28, '#f4f1ff', 'middle', 600)); });
  hidId(id); return g;
}
const kVECTOR = (id, t, d = .6) => { tl.set('#' + id, { autoAlpha: 1 }, t); tl.fromTo('#' + id + ' .' + id + 'c', { autoAlpha: 0, y: -20 }, { autoAlpha: 1, y: 0, duration: .3, stagger: d / 8, ease: 'back.out(2)' }, t); B(t); };
// attention: token slabs in a row + glowing arcs from token `focus` to every token (thickness/brightness = weight)
function kAttn(par, x, y, words, focus, weights, col, id, o = {}) {
  const g = S('g', { id }, par), fs = o.fs || 34, gap = 22, ws = words.map(w => w.length * fs * .62 + 46); let cx = x; const C = [];
  const arcs = S('g', { id: id + 'a' }, g), toks = S('g', {}, g);
  words.forEach((w, k) => { const tw = ws[k], c = k === focus ? KC.light : kMix(col, '#0b0820', .35), tg = S('g', { class: id + 't' }, toks);
    S('rect', { x: cx + 4, y: y + 8, width: tw, height: fs * 1.9, rx: 18, fill: 'rgba(0,0,0,.3)' }, tg);
    S('rect', { x: cx, y, width: tw, height: fs * 1.9, rx: 18, fill: c }, tg); S('rect', { x: cx + 12, y: y + 8, width: tw * .45, height: 6, rx: 3, fill: '#fff', opacity: .3 }, tg);
    wtext(tg, cx + tw / 2, y + fs * 1.25, w, fs, k === focus ? '#2a1a00' : '#f4f1ff', 'middle', 700); C.push(cx + tw / 2); cx += tw + gap; });
  words.forEach((w, k) => { if (k === focus) return; const a = C[focus], b = C[k], h = Math.min(260, 60 + Math.abs(b - a) * .35), wt = weights[k];
    const d = `M${a} ${y - 6} C${a} ${y - h} ${b} ${y - h} ${b} ${y - 6}`;
    S('path', { d, stroke: KC.light, 'stroke-width': 4 + wt * 26, fill: 'none', opacity: .12 + wt * .2, 'stroke-linecap': 'round' }, arcs);
    S('path', { d, class: 'draw', stroke: kLite(KC.light, .3), 'stroke-width': 2 + wt * 10, fill: 'none', opacity: .35 + wt * .65, 'stroke-linecap': 'round' }, arcs);
    if (o.pct !== false && wt >= (o.minPct ?? .15)) wtext(arcs, (a + b) / 2, y - h * .75 - 8, Math.round(wt * 100) + '%', 24, KC.light, 'middle', 700); });
  hidId(id); return g;
}
const kATTN = (id, t) => { tl.set('#' + id, { autoAlpha: 1 }, t); tl.fromTo('#' + id + ' .' + id + 't', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: .35, stagger: .08, ease: 'back.out(2)' }, t); tl.fromTo('#' + id + 'a', { autoAlpha: 0 }, { autoAlpha: 1, duration: .6 }, t + .7); DRAW('#' + id + 'a .draw', t + .7, { d: .8 }); B(t); };
// transformer / model architecture: stacked 3D slabs (bottom first). layers = [['Embedding', col], ['Attention', col], ...]
function kStack(par, cx, bottomY, w, h, layers, id, o = {}) {
  const g = S('g', { id }, par), gap = o.gap ?? 26; kGlow(g, cx, bottomY - layers.length * (h + gap) / 2, w * .9, layers[0][1], .16);
  layers.forEach(([name, col], k) => { const lg = S('g', { class: id + 'l' }, g); kBox3D(lg, cx, bottomY - k * (h + gap) - h / 2, w, h, o.depth || 46, col, name, null, o.fs || 32, k === 0); });
  if (o.repeat) { const top = bottomY - (layers.length - 1) * (h + gap) - h, x2 = cx + w / 2 + 70; S('path', { d: `M${x2} ${top + 6} L${x2 + 18} ${top + 6} L${x2 + 18} ${bottomY - h - gap + 4} L${x2} ${bottomY - h - gap + 4}`, stroke: KC.light, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g); wtext(g, x2 + 36, (top + bottomY - h) / 2 + 12, o.repeat, 34, KC.light, 'start', 800); }
  hidId(id); return g;
}
const kSTACK = (id, t, d = .9) => { tl.set('#' + id, { autoAlpha: 1 }, t); tl.fromTo('#' + id + ' .' + id + 'l', { autoAlpha: 0, y: -60 }, { autoAlpha: 1, y: 0, duration: .4, stagger: d / 4, ease: 'back.out(1.6)' }, t); B(t); };
// plot: soft axes, glowing curve fn(u) 0..1 -> 0..1, shaded area, ball at a point (u = ballAt). labels {x, y}
function kPlot(par, x, y, w, h, fn, col, id, o = {}) {
  const g = S('g', { id }, par), N = 60, P = Array.from({ length: N + 1 }, (_, i) => [x + w * i / N, y + h - h * fn(i / N)]);
  const panel = S('rect', { x: x - 60, y: y - 50, width: w + 110, height: h + 120, rx: 30, fill: 'rgba(8,6,24,.45)' }, g);
  S('path', { d: `M${x} ${y - 20} L${x} ${y + h} L${x + w + 20} ${y + h}`, stroke: kLite(col, .55), 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: .8 }, g);
  for (let k = 1; k < 4; k++) S('path', { d: `M${x + 6} ${y + h * k / 4} L${x + w} ${y + h * k / 4}`, stroke: kLite(col, .4), 'stroke-width': 2, opacity: .15 }, g);
  const dd = 'M' + P.map(p => p.map(v => v.toFixed(1)).join(' ')).join(' L');
  S('path', { id: id + 'ar', d: dd + ` L${x + w} ${y + h} L${x} ${y + h} Z`, fill: col, opacity: .14 }, g);
  S('path', { d: dd, stroke: col, 'stroke-width': 22, fill: 'none', opacity: .18, 'stroke-linecap': 'round', class: 'draw' }, g);
  S('path', { d: dd, stroke: kLite(col, .25), 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round', class: 'draw' }, g);
  if (o.ballAt != null) { const bp = P[Math.round(o.ballAt * N)]; const bg = S('g', { id: id + 'b' }, g); kGlow(bg, bp[0], bp[1] - 20, 50, KC.light, .5); kBall(bg, bp[0], bp[1] - 20, 20, KC.light); }
  if (o.labels) { wtext(g, x + w / 2, y + h + 56, o.labels.x, 28, kLite(col, .6), 'middle', 600); const ty = wtext(g, x - 34, y + h / 2, o.labels.y, 28, kLite(col, .6), 'middle', 600); ty.setAttribute('transform', `rotate(-90 ${x - 34} ${y + h / 2})`); }
  hidId(id); return g;
}
const kPLOT = (id, t, d = 1.2) => { tl.set('#' + id, { autoAlpha: 1 }, t); DRAW('#' + id + ' .draw', t + .2, { d }); tl.fromTo('#' + id + 'ar', { autoAlpha: 0 }, { autoAlpha: .14, duration: .6 }, t + d * .6); if (document.getElementById(id + 'b')) POP('#' + id + 'b', t + d + .1); B(t); };
// code panel: real short code, simple Python colouring, lines appear one by one (kCODE)
function kCode(par, cx, cy, w, lines, id, o = {}) {
  const fs = o.fs || 30, lh = fs * 1.5, h = lines.length * lh + fs * 4, col = o.col || '#5ec2ff', c = kScreen(par, cx, cy, w, h, col, id);
  const KW = /\b(def|return|for|in|import|from|class|if|else|while|as|with|lambda|None|True|False)\b/;
  lines.forEach((ln, k) => { const t = S('text', { class: id + 'L', x: cx - w / 2 + 44, y: cy - h / 2 + fs * 3.4 + k * lh, 'font-size': fs, 'font-family': 'JetBrains Mono, monospace', 'font-weight': 500, fill: '#e8e6ff', 'xml:space': 'preserve' }, c);
    ln.split(/(\s+|[()\[\],.:=+\-*/@]|"[^"]*"|'[^']*'|#.*$)/).filter(Boolean).forEach(tok => { const sp = S('tspan', { fill: /^#/.test(tok) ? '#7d84a8' : /^["']/.test(tok) ? '#9be37a' : KW.test(tok) && tok.trim().match(KW)?.[0] === tok.trim() ? '#ff8fb8' : /^\d/.test(tok) ? '#ffd166' : /^[()\[\],.:=+\-*/@]$/.test(tok) ? '#8fd0ff' : '#e8e6ff' }, t); sp.textContent = tok; }); });
  hidId(id); return c;
}
const kCODE = (id, t, per = .35) => { tl.set('#' + id, { autoAlpha: 1 }, t); POP('#' + id, t, { s: .8 }); tl.fromTo('#' + id + ' .' + id + 'L', { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: .25, stagger: per }, t + .35); B(t); };
// big glowing equation (parts can get kCallout). text uses unicode (ᵀ, √, Σ, ·)
function kEq(par, cx, cy, text, size, col, id) { const g = S('g', { id }, par); kGlow(g, cx, cy, text.length * size * .35, col, .25);
  kMono(wtext(g, cx + size * .04, cy + size * .4, text, size, '#000', 'middle', 700)).setAttribute('opacity', .3); kMono(wtext(g, cx, cy + size * .36, text, size, kLite(col, .5), 'middle', 700)); hidId(id); return g; }
const kEQ = (id, t) => { tl.set('#' + id, { autoAlpha: 1 }, t); POP('#' + id, t, { s: .7 }); B(t); };
// next-token probabilities: rows word | shaded capsule bar | %. items = [['Paris', .92], ...]; first = winner (glows)
function kProbs(par, x, y, w, items, col, id, o = {}) {
  const g = S('g', { id }, par), rh = o.rh || 70, lw = o.lw || 170;
  items.forEach(([word, p], k) => { const ry = y + k * rh, win = k === 0, c = win ? KC.light : kMix(col, '#0b0820', .25), rg = S('g', {}, g);
    wtext(rg, x + lw - 20, ry + rh * .5 + 11, word, 32, win ? KC.light : '#dcd8f5', 'end', 700);
    S('rect', { x: x + lw, y: ry + rh * .18, width: w, height: rh * .56, rx: rh * .28, fill: 'rgba(8,6,24,.45)' }, rg);
    const bar = S('g', { class: id + 'b' }, rg); if (win) kGlow(bar, x + lw + w * p / 2, ry + rh * .46, w * p * .55, KC.light, .3);
    S('rect', { x: x + lw, y: ry + rh * .18, width: Math.max(rh * .56, w * p), height: rh * .56, rx: rh * .28, fill: c }, bar); S('rect', { x: x + lw + 12, y: ry + rh * .24, width: Math.max(10, w * p * .4), height: 6, rx: 3, fill: '#fff', opacity: .35 }, bar);
    wtext(rg, x + lw + w + 24, ry + rh * .5 + 11, Math.round(p * 100) + '%', 30, win ? KC.light : '#b9b4dc', 'start', 700); });
  hidId(id); return g;
}
const kPROBS = (id, t) => { tl.set('#' + id, { autoAlpha: 1 }, t); tl.fromTo('#' + id + ' .' + id + 'b', { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: .7, stagger: .12, ease: 'power3.out' }, t); B(t); };
