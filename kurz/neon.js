// ===================== KURZ NEON (load AFTER kurz.js): the newer Kurzgesagt space look + Kurz-style infographic parts =====================
// Look: deep navy/violet space, soft nebula clouds, tiny + 4-point stars (static), strong bloom on light sources, saturated neon accents.
// Parts: glowing titles, label pills, map pins, timelines, counters, icon cards, gauges, speech bubbles, planets, galaxy, rocket.
// Every part: (par, ..., id) -> <g id>. Hide with hidId(id) at build, show with the matching CAPS beat (nPOP, nDRAW, nCOUNT ...).
const NPAL = { bg: '#0a0626', bg2: '#170a45', deep: '#05031a', mag: '#ff2e88', cyan: '#22e3ff', yel: '#ffd23f', vio: '#8b5cf6',
  teal: '#18d4a8', org: '#ff8a3d', blue: '#3b6bff', ink: '#f4f0ff', navy: '#140a3a' };

// ---------- filters (made once per svg) ----------
function nFilters(defs) { if (defs.querySelector('#nBloom')) return;
  const b = S('filter', { id: 'nBloom', x: '-60%', y: '-60%', width: '220%', height: '220%' }, defs);   // soft bloom: blurred copy under the shape
  S('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: 14, result: 'b1' }, b); S('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: 4, result: 'b2' }, b);
  const m = S('feMerge', {}, b); ['b1', 'b2', 'SourceGraphic'].forEach(i => S('feMergeNode', { in: i }, m));
  const n = S('filter', { id: 'nNeb', x: '-50%', y: '-50%', width: '200%', height: '200%' }, defs); S('feGaussianBlur', { stdDeviation: 60 }, n);   // nebula clouds
  const s = S('filter', { id: 'nSh', x: '-30%', y: '-30%', width: '160%', height: '160%' }, defs); S('feDropShadow', { dx: 0, dy: 10, stdDeviation: 12, 'flood-color': '#000', 'flood-opacity': .45 }, s);
}
const nBloom = el => { el.setAttribute('filter', 'url(#nBloom)'); return el; };

// ---------- 4-point sparkle star ----------
function nSpark(par, x, y, r, col = '#ffffff', cls = 'nTw') { const g = S('g', { class: cls }, par);
  S('path', { d: `M${x} ${y - r} Q${x + r * .12} ${y - r * .12} ${x + r} ${y} Q${x + r * .12} ${y + r * .12} ${x} ${y + r} Q${x - r * .12} ${y + r * .12} ${x - r} ${y} Q${x - r * .12} ${y - r * .12} ${x} ${y - r} Z`, fill: col }, g);
  S('circle', { cx: x, cy: y, r: r * .5, fill: col, opacity: .35 }, g); return g; }

// ---------- space backdrop for one area: gradient + nebula + stars (+ optional perspective grid floor) ----------
// o = { top, bot, neb: [[x, y, r, col, op], ...] (frame coords), stars: n, sparks: n, grid: true (synthwave floor), seed }
function nSpace(BG, defs, ox, oy, o = {}) { nFilters(defs);
  const L = FW !== 1080, pw = L ? 2400 : 1500, ph = L ? 1400 : 2400, mx = L ? 240 : 210, my = L ? 160 : 240, X0 = ox - mx, Y0 = oy - my, sd = o.seed ?? 1;
  const cr = S('clipPath', { id: kUid('nroom') }, defs); S('rect', { x: X0, y: Y0, width: pw, height: ph }, cr);
  const R = S('g', { 'clip-path': `url(#${cr.id})` }, BG);
  S('rect', { x: X0, y: Y0, width: pw, height: ph, fill: kLG(defs, [[0, o.top || NPAL.deep], [.55, o.mid || NPAL.bg], [1, o.bot || NPAL.bg2]]) }, R);
  const neb = S('g', { class: 'nNeb', filter: 'url(#nNeb)' }, R);
  (o.neb || [[300, 200, 420, NPAL.vio, .35], [1600, 850, 520, NPAL.mag, .22], [1450, 150, 300, NPAL.blue, .3]]).forEach(([x, y, r, c, a], k) =>
    S('path', { d: kBlobD(ox + x, oy + y, r, .35, sd * 7 + k, 9, .6), fill: c, opacity: a }, neb));
  const st = S('g', { class: 'kStars' }, R);
  for (let k = 0; k < (o.stars ?? 140); k++) { const x = X0 + rnd(sd * 101 + k * 3) * pw, y = Y0 + rnd(sd * 37 + k * 7) * ph, r = .8 + rnd(k * 5 + sd) * 2.2;
    S('circle', { cx: x, cy: y, r, fill: rnd(k * 11) > .8 ? '#bcd4ff' : '#ffffff', opacity: .25 + rnd(k * 13 + sd) * .6, class: k % 9 ? '' : 'nTw' }, st); }
  for (let k = 0; k < (o.sparks ?? 7); k++) nSpark(st, X0 + mx + rnd(sd * 53 + k * 17) * FW, Y0 + my + rnd(sd * 29 + k * 23) * FH * .8, 7 + rnd(k * 3) * 9, rnd(k * 19) > .5 ? '#ffffff' : '#9fd8ff');
  if (o.grid) { const g = S('g', { opacity: .55 }, R), hz = oy + FH * .62, cx = ox + FW / 2, gc = o.gridCol || NPAL.vio;
    for (let k = -14; k <= 14; k++) S('path', { d: `M${cx + k * 60} ${hz} L${cx + k * 520} ${Y0 + ph}`, stroke: gc, 'stroke-width': 2.5, opacity: .7 }, g);
    for (let k = 1; k < 14; k++) { const y = hz + Math.pow(k / 13, 2.2) * (Y0 + ph - hz); S('path', { d: `M${X0} ${y} L${X0 + pw} ${y}`, stroke: gc, 'stroke-width': 2.5, opacity: .25 + k * .04 }, g); }
    S('rect', { x: X0, y: hz - 120, width: pw, height: 240, fill: kLG(defs, [[0, gc, 0], [.5, gc, .35], [1, gc, 0]]) }, g); }
  return { R };
}

// ---------- glowing title (kinetic typography): lines = [{ t, s (size), c (glow/fill colour) }] centred on cx ----------
function nTitle(par, cx, y, lines, id) { const g = S('g', { id }, par), d = kDefs(par); nFilters(d); let yy = y;
  lines.forEach((ln, k) => { const fs = ln.s || 120, c = ln.c || NPAL.cyan; yy += fs * (k ? 1.02 : .8);
    const fill = kLG(d, [[0, '#ffffff'], [.45, kLite(c, .55)], [1, c]]);
    const mk = (at) => { const t = S('text', Object.assign({ x: cx, y: yy, 'text-anchor': 'middle', 'font-family': 'Poppins', 'font-weight': 800, 'font-size': fs, 'letter-spacing': fs * .01 }, at), g); t.textContent = ln.t; return t; };
    nBloom(mk({ fill: c, stroke: c, 'stroke-width': fs * .1, opacity: .55 })); mk({ fill: '#0b0730', stroke: '#0b0730', 'stroke-width': fs * .14, 'stroke-linejoin': 'round' });
    mk({ fill, stroke: kLite(c, .7), 'stroke-width': fs * .015 }); });
  return g; }

// ---------- label pill (the Kurz label): cx = centre, y = centre ----------
function nPill(par, cx, cy, text, col, id, fs = 30, o = {}) { const g = S('g', Object.assign({ class: 'nPill' }, id ? { id } : {}), par);
  const w = o.w || Math.max(fs * 2.2, text.length * fs * .56 + fs * 1.4), h = fs * 1.55, x = cx - w / 2, y = cy - h / 2;
  S('rect', { x, y: y + 4, width: w, height: h, rx: h / 2, fill: kDark(col, .45) }, g); S('rect', { x, y, width: w, height: h, rx: h / 2, fill: col }, g);
  S('rect', { x: x + h * .3, y: y + h * .14, width: w - h * .6, height: h * .22, rx: h * .11, fill: '#ffffff', opacity: .18 }, g);
  const t = S('text', { x: cx, y: cy + fs * .36, 'text-anchor': 'middle', 'font-family': 'Poppins', 'font-weight': 700, 'font-size': fs, fill: o.ink || '#ffffff' }, g); t.textContent = text;
  if (o.sub) { const s2 = S('text', { x: cx, y: cy + h * .5 + fs * .85, 'text-anchor': 'middle', 'font-family': 'Poppins', 'font-weight': 600, 'font-size': fs * .5, fill: '#c9c2ff', opacity: .85 }, g); s2.textContent = o.sub; }
  return g; }

// ---------- planet: shaded ball + land + clouds + rim light + atmosphere glow ----------
// o = { land, cloud: true, ring: col, glow: col, bands: true (gas giant), seed }
function nPlanet(par, cx, cy, r, base, id, o = {}) { const g = S('g', id ? { id } : {}, par), d = kDefs(par), sd = o.seed ?? 3;
  kGlow(g, cx, cy, r * 1.7, o.glow || kLite(base, .3), .4);
  if (o.ring) S('ellipse', { cx, cy, rx: r * 1.75, ry: r * .42, fill: 'none', stroke: o.ring, 'stroke-width': r * .12, opacity: .85, transform: `rotate(-18 ${cx} ${cy})` }, g);
  const ball = S('circle', { cx, cy, r, fill: kRG(d, [[0, kLite(base, .35)], [.6, base], [1, kDark(base, .45)]], '35%', '30%', '75%') }, g);
  const cl = S('g', { 'clip-path': kClip(d, ball) }, g);
  if (o.bands) for (let k = 0; k < 6; k++) S('rect', { x: cx - r, y: cy - r + k * r * .36 + r * .05, width: r * 2, height: r * (.1 + rnd(sd + k) * .14), fill: k % 2 ? kLite(base, .25) : kDark(base, .2), opacity: .7 }, cl);
  if (o.land) for (let k = 0; k < 5; k++) S('path', { d: kBlobD(cx + (rnd(sd * 9 + k) - .5) * r * 1.4, cy + (rnd(sd * 5 + k * 3) - .5) * r * 1.3, r * (.22 + rnd(k + sd) * .22), .4, sd + k, 8, .8), fill: k % 2 ? o.land : kDark(o.land, .15) }, cl);
  if (o.cloud) for (let k = 0; k < 4; k++) S('ellipse', { cx: cx + (rnd(sd * 3 + k * 7) - .5) * r * 1.5, cy: cy + (rnd(sd * 11 + k) - .5) * r * 1.4, rx: r * .32, ry: r * .1, fill: '#ffffff', opacity: .75 }, cl);
  S('circle', { cx: cx + r * .45, cy: cy + r * .45, r: r * 1.05, fill: '#05031a', opacity: .32 }, cl);   // night side
  S('path', { d: kArc(cx, cy, r - r * .06, 190, 280), stroke: '#ffffff', 'stroke-width': r * .07, fill: 'none', 'stroke-linecap': 'round', opacity: .55 }, g);   // rim light
  if (o.ring) S('path', { d: `M${cx - r * 1.66} ${cy + r * .55} Q${cx} ${cy + r * .95} ${cx + r * 1.66} ${cy - r * .55}`, stroke: o.ring, 'stroke-width': r * .12, fill: 'none', opacity: .85, transform: `rotate(0 ${cx} ${cy})` }, g);
  return g; }

// ---------- map pin: teardrop with a white rim, inner picture (fn(g, cx, cy, r)) or colour, glowing tip ----------
function nPin(par, x, y, s, col, id, inner) { const g = S('g', { id }, par), r = 34 * s, cy = y - 72 * s;
  kGlow(g, x, y, 26 * s, NPAL.cyan, .9); S('circle', { cx: x, cy: y, r: 6 * s, fill: '#bff6ff' }, g);
  S('path', { d: `M${x} ${y - 6 * s} C${x - 12 * s} ${cy + r * .9} ${x - r - 8 * s} ${cy + r * .6} ${x - r - 8 * s} ${cy} A${r + 8 * s} ${r + 8 * s} 0 1 1 ${x + r + 8 * s} ${cy} C${x + r + 8 * s} ${cy + r * .6} ${x + 12 * s} ${cy + r * .9} ${x} ${y - 6 * s} Z`, fill: '#ffffff', filter: 'url(#nSh)' }, g);
  S('circle', { cx: x, cy, r, fill: col }, g); if (inner) inner(g, x, cy, r);
  return g; }

// ---------- timeline: line x1..x2 at y with n nodes; draws on with nDRAW ----------
function nTimeline(par, x1, x2, y, n, col, id, w = 6) { const g = S('g', { id }, par);
  S('path', { class: 'draw', d: `M${x1} ${y} L${x2} ${y}`, stroke: col, 'stroke-width': w, 'stroke-linecap': 'round', fill: 'none' }, g);
  for (let k = 0; k < n; k++) { const x = x1 + (x2 - x1) * (n > 1 ? k / (n - 1) : .5); const nd = S('g', { id: `${id}n${k}` }, g); S('circle', { cx: x, cy: y, r: w * 2.6, fill: '#ffffff' }, nd); S('circle', { cx: x, cy: y, r: w * 1.5, fill: col }, nd); }
  return g; }

// ---------- counter: shows values[i] one after another (works with real GSAP and the shim) ----------
function nCounter(par, x, y, values, fs, col, id, anchor = 'middle') { const g = S('g', { id }, par);
  values.forEach((v, k) => { const t = S('text', { id: `${id}v${k}`, x, y, 'text-anchor': anchor, 'font-family': 'Poppins', 'font-weight': 800, 'font-size': fs, fill: col, opacity: k ? 0 : 1 }, g); t.textContent = v; });
  g.dataset.n = values.length; return g; }
function nCOUNT(id, t, d = 1.2) { const n = +document.getElementById(id).dataset.n; tl.set('#' + id, { autoAlpha: 1 }, t);
  for (let k = 0; k < n; k++) { const tk = t + d * Math.pow(k / Math.max(1, n - 1), .6); tl.set(`#${id}v${k}`, { opacity: 1 }, tk); if (k) tl.set(`#${id}v${k - 1}`, { opacity: 0 }, tk); } B(t); }
const nNum = (from, to, n, f = v => Math.round(v).toLocaleString('en-US')) => Array.from({ length: n }, (_, k) => f(from + (to - from) * k / (n - 1)));

// ---------- icon card: rounded dark tile with a neon rim, a picture drawn by fn(g, cx, cy, size), and a label pill under it ----------
function nCard(par, cx, cy, size, fn, label, col, id) { const g = S('g', { id }, par), d = kDefs(par), h = size / 2;
  S('rect', { x: cx - h, y: cy - h + 8, width: size, height: size, rx: size * .16, fill: '#000', opacity: .35 }, g);
  S('rect', { x: cx - h, y: cy - h, width: size, height: size, rx: size * .16, fill: kLG(d, [[0, '#1b1260'], [1, '#0b0730']]) }, g);
  S('rect', { x: cx - h + 3, y: cy - h + 3, width: size - 6, height: size - 6, rx: size * .15, fill: 'none', stroke: kLite(col, .2), 'stroke-width': 5, opacity: .9 }, g);
  const inner = S('g', {}, g); if (fn) fn(inner, cx, cy, size);
  if (label) nPill(g, cx, cy + h + 42, label, col, null, 30);
  return g; }

// ---------- gauge: half-circle rainbow meter with a needle (needle id: id+'nd', turn it with nNEEDLE) ----------
function nGauge(par, cx, cy, r, id, val = 0) { const g = S('g', { id }, par), cols = [NPAL.teal, '#9be15d', NPAL.yel, NPAL.org, NPAL.mag];
  S('path', { d: kArc(cx, cy, r + 16, 180, 360) + ` L${cx + r + 16} ${cy + 18} L${cx - r - 16} ${cy + 18} Z`, fill: '#1b1260' }, g);
  cols.forEach((c, k) => S('path', { d: kArc(cx, cy, r - 14, 180 + k * 36 + 1, 180 + (k + 1) * 36 - 1), stroke: c, 'stroke-width': 26, fill: 'none' }, g));
  for (let k = 0; k <= 10; k++) { const [x1, y1] = kPt(cx, cy, r - 40, 180 + k * 18), [x2, y2] = kPt(cx, cy, r - 54, 180 + k * 18); S('path', { d: `M${x1} ${y1} L${x2} ${y2}`, stroke: '#ffffff', 'stroke-width': 4, opacity: .6 }, g); }
  const nd = S('g', { id: id + 'nd' }, g); nd.dataset.val = val;   // needle points straight up in the file; nGaugeSet / nNEEDLE turn it (pivot = its bottom centre)
  S('path', { d: `M${cx - 9} ${cy} L${cx} ${cy - r + 30} L${cx + 9} ${cy} Z`, fill: NPAL.mag }, nd); kBall(g, cx, cy, 20, '#ffffff', '#c9c2ff', '#ffffff');
  return g; }
// value 0..1 = left..right. nGaugeSet at time 0 (or the gauge's pop time), nNEEDLE to swing it
const nGaugeSet = (id, t, v) => tl.set('#' + id + 'nd', { rotation: (v - .5) * 180, transformOrigin: '50% 100%' }, t);
function nNEEDLE(id, t, from, to, d = 1) { tl.fromTo('#' + id + 'nd', { rotation: (from - .5) * 180, transformOrigin: '50% 100%' }, { rotation: (to - .5) * 180, transformOrigin: '50% 100%', duration: d, ease: 'elastic.out(1, .5)' }, t); B(t); }

// ---------- speech bubble: white rounded box, tail to (tx, ty) ----------
function nBubble(par, x, y, w, h, text, tx, ty, id, fs = 30) { const g = S('g', { id, filter: 'url(#nSh)' }, par);
  const bx = Math.min(Math.max(tx, x + 30), x + w - 30); S('path', { d: `M${bx - 18} ${y + h - 2} L${tx} ${ty} L${bx + 18} ${y + h - 2} Z`, fill: '#ffffff' }, g);
  S('rect', { x, y, width: w, height: h, rx: Math.min(34, h / 2), fill: '#ffffff' }, g);
  String(text).split('\n').forEach((ln, k, a) => { const t = S('text', { x: x + w / 2, y: y + h / 2 + fs * .36 + (k - (a.length - 1) / 2) * fs * 1.2, 'text-anchor': 'middle', 'font-family': 'Poppins', 'font-weight': 600, 'font-size': fs, fill: '#1b1240' }, g); t.textContent = ln; });
  return g; }

// ---------- spiral galaxy: coloured arm strokes + star dots + bloom core (spins slowly via nLife) ----------
function nGalaxy(par, cx, cy, r, id, tilt = .55) { const g = S('g', { id }, par), sp = S('g', { transform: `translate(${cx} ${cy}) scale(1 ${tilt})` }, g), arms = S('g', { class: 'nSpinI' }, sp);
  kGlow(sp, 0, 0, r * 1.2, NPAL.vio, .5); kGlow(sp, 0, 0, r * .75, NPAL.blue, .35);
  const cols = [NPAL.cyan, NPAL.teal, NPAL.org, NPAL.mag], arm = (a, k, i) => { const th = i / 40 * Math.PI * 2 + a * Math.PI + k * .16, rr = r * (.14 + i / 40 * .84); return [Math.cos(th) * rr, Math.sin(th) * rr]; };
  const glow = nBloom(S('g', { opacity: .9 }, arms));   // thin arm strands, softly glowing
  for (let a = 0; a < 2; a++) cols.forEach((c, k) => { let d = ''; for (let i = 0; i <= 40; i++) { const [x, y] = arm(a, k, i); d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1); }
    S('path', { d, stroke: c, 'stroke-width': r * (.028 - k * .004), fill: 'none', 'stroke-linecap': 'round', opacity: .8 - k * .12 }, glow); });
  for (let k = 0; k < 420; k++) { const a = k % 2, i = rnd(k * 3) * 40, [x, y] = arm(a, k % 4, i), j = r * .09 * (1 + i / 40);   // star dust clustered along the arms
    S('circle', { cx: x + (rnd(k * 7) - .5) * j * 2, cy: y + (rnd(k * 11) - .5) * j * 2, r: 1 + rnd(k) * 3.2, fill: rnd(k * 5) > .6 ? '#ffffff' : rnd(k * 13) > .5 ? '#a8f0ff' : '#ffb3e1', opacity: .45 + rnd(k * 9) * .55 }, arms); }
  for (let k = 0; k < 60; k++) { const th = rnd(k * 17) * Math.PI * 2, rr = Math.sqrt(rnd(k * 19)) * r * .35; S('circle', { cx: Math.cos(th) * rr, cy: Math.sin(th) * rr, r: 1.5 + rnd(k) * 2.5, fill: '#fff4fd', opacity: .7 }, arms); }
  S('circle', { cx: 0, cy: 0, r: r * .42, fill: kRG(kDefs(par), [[0, '#ffffff', 1], [.25, '#ffd9f3', .9], [.6, '#c78bff', .35], [1, '#8b5cf6', 0]]) }, sp);   // bright core, no hard edge
  nBloom(S('circle', { cx: 0, cy: 0, r: r * .07, fill: '#ffffff' }, sp));
  return g; }

// ---------- rocket (side view, flying right), flame + speed lines; id+'f' flame ----------
function nRocket(par, x, y, s, id, col = '#e9e4ff') { const g = S('g', { id }, par), O = S('g', { transform: `translate(${x} ${y}) scale(${s})` }, g);
  const fl = S('g', { id: id + 'f' }, O); nBloom(S('path', { d: 'M-118 -22 Q-230 0 -118 22 Z', fill: NPAL.cyan }, fl)); S('path', { d: 'M-118 -12 Q-180 0 -118 12 Z', fill: '#ffffff' }, fl);
  S('path', { d: 'M-80 -40 L-140 -86 L-110 -30 Z', fill: NPAL.mag }, O); S('path', { d: 'M-80 40 L-140 86 L-110 30 Z', fill: kDark(NPAL.mag, .25) }, O);
  const body = S('path', { d: 'M-120 -40 L60 -40 Q150 -36 170 0 Q150 36 60 40 L-120 40 Z', fill: col }, O); kShade(O, body, kDark(col, .3), '#ffffff');
  S('circle', { cx: 50, cy: 0, r: 22, fill: NPAL.blue, stroke: '#ffffff', 'stroke-width': 8 }, O); S('circle', { cx: 44, cy: -6, r: 7, fill: '#ffffff', opacity: .7 }, O);
  S('rect', { x: -60, y: -40, width: 20, height: 80, fill: NPAL.mag, opacity: .85 }, O);
  return g; }
function nSpeed(par, x, y, w, h, id, n = 14, col = '#9fd8ff') { const g = S('g', { id, class: 'nSpd' }, par);
  for (let k = 0; k < n; k++) { const yy = y + rnd(k * 7) * h, L = 120 + rnd(k * 3) * 260, xx = x + rnd(k * 11) * w; S('path', { d: `M${xx} ${yy} L${xx + L} ${yy}`, stroke: col, 'stroke-width': 3 + rnd(k) * 4, 'stroke-linecap': 'round', opacity: .35 + rnd(k * 5) * .4 }, g); }
  return g; }

// ---------- beats ----------
// pop in (Kurz cards and pills pop with a little overshoot)
const nPOP = (sel, t, o = {}) => { tl.set(sel, { autoAlpha: 1 }, t); return POP(sel, t, Object.assign({ s: .5 }, o)); };
// timeline draws on, then nodes pop one by one
function nDRAW(id, t, d = 1) { tl.set('#' + id, { autoAlpha: 1 }, t); DRAW(`#${id} .draw`, t, { d }); const nodes = [...document.querySelectorAll(`#${id} [id^="${id}n"]`)];
  nodes.forEach((nd, k) => tl.fromTo(nd, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: .3, ease: 'back.out(2)' }, t + d * k / Math.max(1, nodes.length - 1))); }
// rocket fly: moves dx over d with flame flicker + speed lines streaming
function nFLY(id, t, dx, d = 2, dy = 0) { tl.to('#' + id, { x: dx, y: dy, duration: d, ease: 'power1.inOut' }, t);
  tl.to('#' + id + 'f', { scaleX: 1.25, transformOrigin: '100% 50%', duration: .12, yoyo: true, repeat: Math.round(d / .12), ease: 'sine.inOut' }, t); B(t); }
// slow camera drift for a whole area (the newer Kurz camera never stands still)
function nDRIFT(t0, t1, cx, cy, z0 = 1, z1 = 1.06, dx = 30) { CAM(t0, cx - dx, cy, z0, .01, 'none');
  CAM(t0 + .02, cx + dx, cy, z1, Math.max(.5, t1 - t0 - .02), 'none'); }
// ambient life for the whole video: slow nebula drift, spinning galaxies, speed lines streaming. Call once in beats.
// Stars do NOT twinkle (user rule: no twinkling / floating particles; stars only move with the camera parallax).
function nLife() { const rep = d => Math.max(1, Math.floor((END + 4) / d));
  document.querySelectorAll('.nNeb').forEach((e, k) => tl.to(e, { x: 60, y: -25, duration: 9, yoyo: true, repeat: rep(9), ease: 'sine.inOut' }, 0));
  document.querySelectorAll('.nSpinI').forEach(e => tl.to(e, { rotation: 360, transformOrigin: '50% 50%', duration: 60, repeat: rep(60), ease: 'none' }, 0));
  document.querySelectorAll('.nSpd').forEach(e => tl.fromTo(e, { x: 300 }, { x: -500, duration: .6, repeat: rep(.6), ease: 'none' }, 0));
}
