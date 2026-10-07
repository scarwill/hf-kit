// ===================== ILLUSTRATED LIBRARY (characters + money objects) =====================
// Needs premium.js first:  cat ~/hf-kit/premium.js ~/hf-kit/illus.js video.js > all.js
// Call illusDefs(defs) once after makeWorld (adds gradients used below).
function illusDefs(defs) {
  grad(defs, 'gLiquid', [[0, '#34d399'], [1, '#059669']]); grad(defs, 'gSunset', [[0, '#fb923c'], [.5, '#f472b6'], [1, '#4c1d95']]); grad(defs, 'gDusk', [[0, '#312e81'], [.6, '#9d174d'], [1, '#f97316']]);
  grad(defs, 'gNight', [[0, '#0b1026'], [1, '#1e1b4b']]); grad(defs, 'gEve', [[0, '#1e3a8a'], [.7, '#7c3aed'], [1, '#f472b6']]); grad(defs, 'gSea', [[0, '#0e7490'], [1, '#082f49']]);
  grad(defs, 'gSkyDay', [[0, '#0c4a6e'], [1, '#38bdf8']]); grad(defs, 'gCanyon', [[0, '#7c2d12'], [1, '#1c0a03']]); grad(defs, 'gBalloon', [[0, '#fbbf24'], [1, '#f97316']], 1, 0);
  grad(defs, 'gGlass', [[0, '#bae6fd', .5], [1, '#7dd3fc', .2]]); grad(defs, 'gKitchen', [[0, '#2b2f4a'], [1, '#1a1d33']]); grad(defs, 'gMint', [[0, '#0f2b2b'], [1, '#0a1a1f']]);
}
const SKIN = ['#f2c29b', '#e0a982', '#c68863', '#a86b4c', '#7a4a32'];   // pick per character
const HAIRC = ['#2b1a12', '#5b3a29', '#111827', '#7c4a1e', '#9ca3af'];
// ---------- character builder ----------
// charB(parent, x, y(feet), scale, prefix, opt) -> inner group id p+'B' (animate it). opt:
//  {skin, hairC, hair:'long'|'short'|'bun'|'curly'|'bald'|'pony', top:'#14b8a6', topType:'blazer'|'tshirt'|'hoodie'|'kurta', pants, shoes, glasses, beard, kid}
// ids: p+'E' both eyes (blink scaleY), p+'eL'/p+'eR', p+'bL'/p+'bR' brows, mouths p+'mS' smile | p+'mW' worry | p+'mO' surprised | p+'mN' flat,
//      arms p+'aL'/p+'aR' (rotate at shoulder: transformOrigin '50% 0%').  Use mood(), blink(), breathe() below.
function charB(par, x, y, s, p, o = {}) {
  const sk = o.skin ?? SKIN[0], hc = o.hairC ?? HAIRC[0], top = o.top ?? '#14b8a6', topSh = o.topSh ?? 'rgba(0,0,0,.18)', pants = o.pants ?? '#1f2a44', shoe = o.shoes ?? '#0b1222', hair = o.hair ?? 'short', tt = o.topType ?? 'blazer';
  const O = S('g', { transform: `translate(${x},${y}) scale(${s})` }, par); const M = S('g', { id: p + 'B' }, O);
  const kid = !!o.kid, legH = kid ? 150 : 222, bodyTop = -legH - 200, HY = bodyTop - 85, hs = kid ? 1.15 : 1;
  S('ellipse', { cx: 0, cy: 5, rx: 120, ry: 20, fill: 'rgba(0,0,0,.35)' }, M);
  S('rect', { x: -52, y: -legH - 3, width: 44, height: legH, rx: 20, fill: pants }, M); S('rect', { x: 8, y: -legH - 3, width: 44, height: legH, rx: 20, fill: pants }, M);
  S('ellipse', { cx: -35, cy: 0, rx: 38, ry: 15, fill: shoe }, M); S('ellipse', { cx: 35, cy: 0, rx: 38, ry: 15, fill: shoe }, M);
  const by = -legH + 20, bt = bodyTop;   // torso bottom / top
  if (tt === 'kurta') S('path', { d: `M-96 ${by + 60} Q-104 ${bt + 12} 0 ${bt} Q104 ${bt + 12} 96 ${by + 60} Z`, fill: top }, M);
  else S('path', { d: `M-98 ${by} Q-105 ${bt + 12} 0 ${bt} Q105 ${bt + 12} 98 ${by} Z`, fill: top }, M);
  if (tt === 'blazer') { S('path', { d: `M-30 ${bt + 6} L0 ${bt + 82} L30 ${bt + 6} Z`, fill: '#f8fafc' }, M); S('path', { d: `M0 ${bt + 82} L0 ${by}`, stroke: topSh, 'stroke-width': 4 }, M); }
  if (tt === 'tshirt') S('path', { d: `M-34 ${bt + 4} Q0 ${bt + 40} 34 ${bt + 4}`, stroke: topSh, 'stroke-width': 6, fill: 'none' }, M);
  if (tt === 'hoodie') { S('path', { d: `M-60 ${bt + 10} Q0 ${bt + 70} 60 ${bt + 10}`, stroke: topSh, 'stroke-width': 10, fill: 'none' }, M); S('rect', { x: -50, y: by - 90, width: 100, height: 50, rx: 14, fill: topSh }, M); }
  if (tt === 'kurta') { S('path', { d: `M0 ${bt + 6} L0 ${bt + 110}`, stroke: topSh, 'stroke-width': 5 }, M); [0, 1, 2].forEach(k => S('circle', { cx: 8, cy: bt + 30 + k * 28, r: 4, fill: topSh }, M)); }
  const arm = (side, id) => { const g = S('g', { id }, M); const sx = side * 92; S('path', { d: `M${sx} ${bt + 32} Q${side * 130} ${bt + 122} ${side * 110} ${bt + 212}`, stroke: top, 'stroke-width': 40, fill: 'none', 'stroke-linecap': 'round' }, g); S('circle', { cx: side * 108, cy: bt + 222, r: 20, fill: sk }, g); return g; };
  arm(-1, p + 'aL'); arm(1, p + 'aR');
  S('rect', { x: -18, y: HY + 50, width: 36, height: 44, fill: sk, opacity: .85 }, M);
  const Hd = S('g', { transform: `translate(0 ${HY}) scale(${hs}) translate(0 ${-HY})` }, M); const cy = HY;
  if (hair === 'long' || hair === 'pony') S('path', { d: `M-80 ${cy + 10} Q-92 ${cy - 105} 0 ${cy - 98} Q92 ${cy - 105} 80 ${cy + 10} L82 ${cy + 70} Q60 ${cy + 40} 62 ${cy} L-62 ${cy} Q-60 ${cy + 40} -82 ${cy + 70} Z`, fill: hc }, Hd);
  if (hair === 'pony') S('path', { d: `M60 ${cy - 60} Q130 ${cy - 30} 100 ${cy + 60} Q95 ${cy} 64 ${cy - 30} Z`, fill: hc }, Hd);
  if (hair === 'bun') S('circle', { cx: 0, cy: cy - 92, r: 34, fill: hc }, Hd);
  if (hair === 'curly') for (let k = 0; k < 9; k++) { const a = Math.PI * (1.05 + k * .11); S('circle', { cx: Math.cos(a) * 66, cy: cy - 10 + Math.sin(a) * 74, r: 26, fill: hc }, Hd); }
  S('circle', { cx: -66, cy: cy + 6, r: 14, fill: sk }, Hd); S('circle', { cx: 66, cy: cy + 6, r: 14, fill: sk }, Hd);
  S('ellipse', { cx: 0, cy, rx: 66, ry: 74, fill: sk }, Hd);
  if (hair === 'long' || hair === 'pony' || hair === 'bun') S('path', { d: `M-68 ${cy - 10} Q-60 ${cy - 80} 0 ${cy - 78} Q50 ${cy - 76} 70 ${cy - 20} Q20 ${cy - 50} -20 ${cy - 40} Q-50 ${cy - 30} -68 ${cy - 10} Z`, fill: hc }, Hd);
  if (hair === 'short') S('path', { d: `M-68 ${cy - 6} Q-72 ${cy - 82} 0 ${cy - 84} Q72 ${cy - 82} 68 ${cy - 6} Q60 ${cy - 46} 30 ${cy - 52} Q0 ${cy - 40} -30 ${cy - 52} Q-60 ${cy - 46} -68 ${cy - 6} Z`, fill: hc }, Hd);
  if (hair === 'bald') S('path', { d: `M-68 ${cy} Q-70 ${cy - 30} -60 ${cy - 34} M68 ${cy} Q70 ${cy - 30} 60 ${cy - 34}`, stroke: hc, 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round' }, Hd);
  if (o.beard) S('path', { d: `M-62 ${cy + 8} Q-60 ${cy + 80} 0 ${cy + 84} Q60 ${cy + 80} 62 ${cy + 8} Q40 ${cy + 50} 0 ${cy + 50} Q-40 ${cy + 50} -62 ${cy + 8} Z`, fill: hc }, Hd);
  S('circle', { cx: -40, cy: cy + 22, r: 12, fill: '#f472b6', opacity: .22 }, Hd); S('circle', { cx: 40, cy: cy + 22, r: 12, fill: '#f472b6', opacity: .22 }, Hd);
  const E = S('g', { id: p + 'E' }, Hd);
  const eL = S('g', { id: p + 'eL' }, E); S('ellipse', { cx: -24, cy: cy + 2, rx: 7, ry: 10, fill: '#1e293b' }, eL); S('circle', { cx: -22, cy: cy - 1, r: 2.5, fill: '#fff' }, eL);
  const eR = S('g', { id: p + 'eR' }, E); S('ellipse', { cx: 24, cy: cy + 2, rx: 7, ry: 10, fill: '#1e293b' }, eR); S('circle', { cx: 26, cy: cy - 1, r: 2.5, fill: '#fff' }, eR);
  if (o.glasses) { S('circle', { cx: -24, cy: cy + 2, r: 19, fill: 'none', stroke: '#111827', 'stroke-width': 4 }, Hd); S('circle', { cx: 24, cy: cy + 2, r: 19, fill: 'none', stroke: '#111827', 'stroke-width': 4 }, Hd); S('path', { d: `M-5 ${cy + 2} L5 ${cy + 2}`, stroke: '#111827', 'stroke-width': 4 }, Hd); }
  const bc = hair === 'bald' ? '#6b7280' : hc;
  S('path', { id: p + 'bL', d: `M-38 ${cy - 20} Q-24 ${cy - 28} -10 ${cy - 20}`, stroke: bc, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, Hd);
  S('path', { id: p + 'bR', d: `M10 ${cy - 20} Q24 ${cy - 28} 38 ${cy - 20}`, stroke: bc, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, Hd);
  const mc = o.beard ? '#fca5a5' : '#9a3412';
  S('path', { id: p + 'mS', d: `M-18 ${cy + 32} Q0 ${cy + 48} 18 ${cy + 32}`, stroke: mc, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, Hd);
  S('path', { id: p + 'mW', d: `M-16 ${cy + 42} Q0 ${cy + 30} 16 ${cy + 42}`, stroke: mc, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round', opacity: 0 }, Hd);
  S('ellipse', { id: p + 'mO', cx: 0, cy: cy + 40, rx: 9, ry: 12, fill: '#7f1d1d', opacity: 0 }, Hd);
  S('path', { id: p + 'mN', d: `M-14 ${cy + 38} L14 ${cy + 38}`, stroke: mc, 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0 }, Hd);
  return M;
}
// mood(p, t, 'happy'|'worried'|'tired'|'surprised'|'neutral')
const MOODLOG = {};   // per character: [[t, mood]] (used by talk)
function mood(p, t, m) { (MOODLOG[p] = MOODLOG[p] || []).push([t, m]);
  const show = { happy: 'mS', worried: 'mW', angry: 'mW', tired: 'mN', surprised: 'mO', neutral: 'mN' }[m];
  ['mS', 'mW', 'mO', 'mN'].forEach(k => tl.to('#' + p + k, { opacity: k === show ? 1 : 0, duration: .25 }, t));
  // worried = inner brow ends UP (sad), angry = inner ends down
  const br = m === 'worried' ? -14 : m === 'angry' ? 14 : 0; tl.to('#' + p + 'bL', { rotation: br, transformOrigin: '100% 50%', y: m === 'surprised' ? -8 : 0, duration: .3 }, t); tl.to('#' + p + 'bR', { rotation: -br, transformOrigin: '0% 50%', y: m === 'surprised' ? -8 : 0, duration: .3 }, t);
  tl.to('#' + p + 'E', { scaleY: m === 'tired' ? .45 : m === 'surprised' ? 1.2 : 1, transformOrigin: '50% 50%', duration: .3 }, t); B(t);
}
const blink = (p, ts) => ts.forEach(t => tl.to('#' + p + 'eL,#' + p + 'eR', { scaleY: .1, transformOrigin: '50% 50%', duration: .08, yoyo: true, repeat: 1 }, t));
const breathe = (p, t0, n = 7, d = 1.5) => tl.to('#' + p + 'B', { y: -6, duration: d, yoyo: true, repeat: n, ease: 'sine.inOut' }, t0);
const wave = (p, t, side = 'aR') => tl.to('#' + p + side, { rotation: side === 'aR' ? -120 : 120, transformOrigin: '50% 0%', duration: .35, yoyo: true, repeat: 3 }, t);
function bubble(par, x, y, w, h, txt, id, fs = 36, tailDx = -0.35) { const g = S('g', { id, filter: 'url(#fSh)' }, par); S('rect', { x, y, width: w, height: h, rx: h / 2, fill: '#f8fafc' }, g); S('path', { d: `M${x + w / 2 + tailDx * w - 20} ${y + h - 6} L${x + w / 2 + tailDx * w - 50} ${y + h + 60} L${x + w / 2 + tailDx * w + 30} ${y + h - 4} Z`, fill: '#f8fafc' }, g); if (txt) wtext(g, x + w / 2, y + h / 2 + fs * .36, txt, fs, '#0f172a', 'middle', 700); return g; }
// say(): speech bubble whose tail TIP lands on (sx, sy) = just above / beside the speaker's head (use instead of bubble for people talking).
// td < 0: bubble sits to the right of the tail, td > 0: to the left. Hidden until cue (hidId). Returns the bubble centre [cx, cy].
function say(par, sx, sy, w, h, text, id, fs = 34, td = -.25) { const x = sx + 50 - w / 2 - td * w, y = sy - 60 - h; bubble(par, x, y, w, h, text, id, fs, td); if (typeof hidId === 'function') hidId(id); return [x + w / 2, y + h / 2]; }
function thought(par, x, y, w, h, id, fromX, fromY) { const g = S('g', { id }, par); if (fromX != null) [[.25, 10], [.55, 16], [.85, 22]].forEach(([f, r]) => S('circle', { cx: fromX + (x + w * .25 - fromX) * f, cy: fromY + (y + h - fromY) * f, r, fill: '#f8fafc' }, g)); S('rect', { x, y, width: w, height: h, rx: Math.min(h / 2, 120), fill: '#f8fafc' }, g); return g; }
// ---------- money objects ----------
function coin(g, x, y, r, id) { const c = S('g', id ? { id } : {}, g); S('circle', { cx: x, cy: y + r * .12, r, fill: '#b45309' }, c); S('circle', { cx: x, cy: y, r, fill: '#fbbf24' }, c); S('circle', { cx: x, cy: y, r: r * .72, fill: 'none', stroke: '#f59e0b', 'stroke-width': r * .1 }, c); wtext(c, x, y + r * .36, '$', r * 1.05, '#92400e', 'middle', 800); return c; }
function coinStack(par, x, y, n, r, id) { const g = S('g', { id }, par); for (let k = 0; k < n; k++) { S('ellipse', { cx: x, cy: y - k * r * .32, rx: r, ry: r * .36, fill: '#b45309' }, g); S('ellipse', { cx: x, cy: y - k * r * .32 - 4, rx: r, ry: r * .36, fill: '#fbbf24', stroke: '#d97706', 'stroke-width': 2 }, g); } return g; }
function banknote(par, x, y, w, id, amt = '$') { const h = w * .48; const g = S('g', { id }, par); S('rect', { x, y, width: w, height: h, rx: 8, fill: '#86efac', stroke: '#15803d', 'stroke-width': 4 }, g); S('circle', { cx: x + w / 2, cy: y + h / 2, r: h * .3, fill: 'none', stroke: '#15803d', 'stroke-width': 4 }, g); wtext(g, x + w / 2, y + h / 2 + h * .13, amt, h * .36, '#15803d', 'middle', 800); return g; }
function ccard(par, x, y, w, col, id) { const h = w * .62; const g = S('g', { id, filter: 'url(#fSh)' }, par); S('rect', { x, y, width: w, height: h, rx: 18, fill: col }, g); S('rect', { x: x + w * .1, y: y + h * .3, width: w * .18, height: h * .2, rx: 6, fill: '#fde68a' }, g); [0, 1, 2, 3].forEach(k => S('rect', { x: x + w * .1 + k * w * .2, y: y + h * .66, width: w * .15, height: h * .08, rx: 3, fill: 'rgba(255,255,255,.75)' }, g)); return g; }
function wallet(par, x, y, s, id, col = '#7c2d12') { const g = S('g', { id }, par); S('rect', { x, y, width: 220 * s, height: 150 * s, rx: 24 * s, fill: col }, g); S('rect', { x: x + 140 * s, y: y + 50 * s, width: 90 * s, height: 50 * s, rx: 14 * s, fill: '#9a3412' }, g); S('circle', { cx: x + 168 * s, cy: y + 75 * s, r: 9 * s, fill: '#fde68a' }, g); return g; }
function piggy(par, x, y, s, id, col = '#f9a8d4') { const g = S('g', { id }, par); S('ellipse', { cx: x, cy: y, rx: 130 * s, ry: 95 * s, fill: col }, g); S('ellipse', { cx: x + 125 * s, cy: y + 5 * s, rx: 32 * s, ry: 26 * s, fill: '#f472b6' }, g); [[-10, 8], [10, 8]].forEach(([dx]) => S('circle', { cx: x + 125 * s + dx * s * .9, cy: y + 5 * s, r: 5 * s, fill: '#9d174d' }, g)); S('path', { d: `M${x + 50 * s} ${y - 80 * s} L${x + 70 * s} ${y - 120 * s} L${x + 90 * s} ${y - 75 * s} Z`, fill: '#f472b6' }, g); S('circle', { cx: x + 70 * s, cy: y - 25 * s, r: 9 * s, fill: '#1e293b' }, g); [-70, -20, 30, 80].forEach(dx => S('rect', { x: x + dx * s - 14 * s, y: y + 75 * s, width: 28 * s, height: 50 * s, rx: 10 * s, fill: col }, g)); S('rect', { x: x - 30 * s, y: y - 96 * s, width: 60 * s, height: 10 * s, rx: 5 * s, fill: '#9d174d' }, g); return g; }
// jar(...) -> liquid rect id+'L' (fill level: tl.to('#idL',{scaleY:f, transformOrigin:'50% 100%'}) — never PULSE it)
function jar(par, cx, top, w, h, id, coins = 12) { const g = S('g', { id }, par); S('rect', { x: cx - w / 2, y: top, width: w, height: h, rx: 50, fill: 'rgba(255,255,255,.05)' }, g); S('rect', { id: id + 'L', x: cx - w / 2 + 12, y: top + 30, width: w - 24, height: h - 42, rx: 40, fill: 'url(#gLiquid)' }, g); for (let k = 0; k < coins; k++) coin(g, cx - w * .36 + (k * 61) % (w * .72), top + h - 60 - Math.floor(k / 5) * 40, 22); S('rect', { x: cx - w / 2, y: top, width: w, height: h, rx: 50, fill: 'none', stroke: '#e2e8f0', 'stroke-width': 10 }, g); S('rect', { x: cx - w / 2 - 20, y: top - 50, width: w + 40, height: 60, rx: 14, fill: '#94a3b8' }, g); return g; }
function billDoc(par, x, y, id, txt = 'BILL', w = 180) { const g = S('g', { id, filter: 'url(#fSh)' }, par); S('rect', { x, y, width: w, height: w * 1.25, rx: 10, fill: '#f8fafc' }, g); wtext(g, x + w / 2, y + w * .3, txt, w * .2, '#dc2626'); [0, 1, 2].forEach(k => S('rect', { x: x + w * .15, y: y + w * .5 + k * w * .18, width: w * .7, height: w * .07, rx: 4, fill: '#cbd5e1' }, g)); return g; }
function hourglass(par, cx, top, s, id) { const g = S('g', { id }, par); const w = 200 * s, h = 370 * s; S('path', { d: `M${cx - w / 2} ${top} L${cx + w / 2} ${top} L${cx + w * .12} ${top + h / 2} L${cx + w / 2} ${top + h} L${cx - w / 2} ${top + h} L${cx - w * .12} ${top + h / 2} Z`, fill: 'none', stroke: '#f87171', 'stroke-width': 10 * s, 'stroke-linejoin': 'round' }, g); S('path', { id: id + 'S', d: `M${cx - w * .38} ${top + h - 10 * s} L${cx + w * .38} ${top + h - 10 * s} L${cx + w * .22} ${top + h - 80 * s} L${cx - w * .22} ${top + h - 80 * s} Z`, fill: '#fbbf24' }, g); return g; }
function balloon(par, cx, cy, s, label, id) { const g = S('g', { id }, par); S('ellipse', { cx, cy, rx: 220 * s, ry: 260 * s, fill: 'url(#gBalloon)' }, g); S('path', { d: `M${cx} ${cy - 260 * s} Q${cx - 100 * s} ${cy} ${cx} ${cy + 260 * s} M${cx} ${cy - 260 * s} Q${cx + 100 * s} ${cy} ${cx} ${cy + 260 * s}`, stroke: '#c2410c', 'stroke-width': 6 * s, fill: 'none' }, g); if (label) wtext(g, cx, cy + 30 * s, label, 90 * s, '#7c2d12'); S('path', { d: `M${cx - 160 * s} ${cy + 190 * s} L${cx - 60 * s} ${cy + 350 * s} M${cx + 160 * s} ${cy + 190 * s} L${cx + 60 * s} ${cy + 350 * s}`, stroke: '#78350f', 'stroke-width': 4 * s }, g); S('rect', { x: cx - 70 * s, y: cy + 350 * s, width: 140 * s, height: 90 * s, rx: 10 * s, fill: '#92400e' }, g); return g; }
function dominoes(par, x, y, n, id, col = '#34d399', gap = 130) { const ids = []; for (let k = 0; k < n; k++) { const o = S('g', {}, par); const d = S('g', { id: id + k }, o); S('rect', { x: x + k * gap, y: y - 260, width: 60, height: 260, rx: 10, fill: col }, d); S('rect', { x: x + 8 + k * gap, y: y - 220, width: 44, height: 70, rx: 6, fill: 'rgba(255,255,255,.35)' }, d); ids.push('#' + id + k); } return ids; }
// ---------- charts drawn from data ----------
function axes(par, x, y, w, h, col = '#94a3b8', id) { return S('path', { id, class: 'draw', d: `M${x} ${y - h} L${x} ${y} L${x + w} ${y}`, stroke: col, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, par); }
function lineChart(par, x, y, w, h, vals, col, id, max) { const m = max ?? Math.max(...vals); const d = vals.map((v, k) => `${k ? 'L' : 'M'}${(x + k * w / (vals.length - 1)).toFixed(1)} ${(y - h * v / m).toFixed(1)}`).join(' '); return S('path', { id, class: 'draw', d, stroke: col, 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, par); }
function barChart(par, x, y, w, h, vals, cols, id, max) { const m = max ?? Math.max(...vals), n = vals.length, bw = w / n * .7; return vals.map((v, k) => S('rect', { id: id + k, x: x + k * w / n + (w / n - bw) / 2, y: y - h * v / m, width: bw, height: h * v / m, rx: 10, fill: Array.isArray(cols) ? cols[k % cols.length] : cols }, par)); }   // grow with BARY('#id'+k, t)
function pieChart(par, cx, cy, r, vals, cols, id) { const tot = vals.reduce((a, b) => a + b, 0); let a0 = -Math.PI / 2; return vals.map((v, k) => { const a1 = a0 + 2 * Math.PI * v / tot, big = a1 - a0 > Math.PI ? 1 : 0; const d = `M${cx} ${cy} L${cx + r * Math.cos(a0)} ${cy + r * Math.sin(a0)} A${r} ${r} 0 ${big} 1 ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)} Z`; a0 = a1; return S('path', { id: id + k, d, fill: cols[k % cols.length], stroke: '#0b1020', 'stroke-width': 4 }, par); }); }
// ---------- places ----------
function houseG(par, x, y, s, col, id, roof = '#7c2d12') { const o = S('g', { transform: `translate(${x},${y}) scale(${s})` }, par); const g = S('g', { id }, o);
  S('ellipse', { cx: 0, cy: 4, rx: 190, ry: 18, fill: 'rgba(0,0,0,.35)' }, g); S('rect', { x: 70, y: -330, width: 34, height: 80, fill: '#57534e' }, g);
  S('rect', { x: -140, y: -210, width: 280, height: 210, fill: col }, g); S('path', { d: 'M-170 -205 L0 -340 L170 -205 Z', fill: roof }, g); S('rect', { x: -28, y: -110, width: 56, height: 110, rx: 4, fill: '#3f2d24' }, g);
  [[-105, -170], [55, -170]].forEach(([wx, wy]) => { S('rect', { x: wx, y: wy, width: 50, height: 50, rx: 4, fill: '#fde68a' }, g); S('path', { d: `M${wx + 25} ${wy} L${wx + 25} ${wy + 50} M${wx} ${wy + 25} L${wx + 50} ${wy + 25}`, stroke: '#78350f', 'stroke-width': 4 }, g); }); return g; }
function carG(par, x, y, s, col, id) { const o = S('g', { transform: `translate(${x},${y}) scale(${s})` }, par); const g = S('g', { id }, o); const h = S('g', { transform: 'translate(-260,-905)' }, g);
  S('ellipse', { cx: 260, cy: 905, rx: 230, ry: 18, fill: 'rgba(0,0,0,.4)' }, h);
  S('path', { d: 'M40 880 L50 800 Q60 760 110 755 L170 700 Q190 680 230 680 L360 680 Q400 680 420 710 L460 760 Q500 768 500 800 L505 880 Z', fill: col }, h);
  S('path', { d: 'M190 710 L235 700 L300 700 L300 755 L160 755 Z', fill: '#bfdbfe' }, h); S('path', { d: 'M318 700 L360 700 Q385 702 400 724 L420 755 L318 755 Z', fill: '#bfdbfe' }, h);
  [130, 400].forEach((cx, k) => { const w = S('g', { id: id + 'w' + k }, h); S('circle', { cx, cy: 880, r: 48, fill: '#111827' }, w); S('circle', { cx, cy: 880, r: 22, fill: '#9ca3af' }, w); S('rect', { x: cx - 4, y: 860, width: 8, height: 40, fill: '#4b5563' }, w); }); return g; }   // wheels id+'w0'/'w1' (rotate 50% 50%)
function tower(par, x, y, w, h, col, lit) { const g = S('g', {}, par); S('rect', { x, y: y - h, width: w, height: h, fill: col }, g); for (let r = 0; r < Math.floor(h / 46); r++) for (let q = 0; q < Math.floor(w / 36); q++) S('rect', { x: x + 10 + q * 36, y: y - h + 14 + r * 46, width: 18, height: 24, fill: ((r * 7 + q * 3) % 5 === 0) ? '#fde68a' : (lit || '#1e293b') }, g); return g; }
function room(par, ox, oy) { S('rect', { x: ox - 240, y: oy - 160, width: 2400, height: 980, fill: 'url(#gWall)' }, par); S('rect', { x: ox - 240, y: oy + 820, width: 2400, height: 420, fill: 'url(#gFloor)' }, par); for (let k = -1; k < 14; k++) S('path', { d: `M${ox + k * 160} ${oy + 820} L${ox + k * 160 - 110} ${oy + 1080}`, stroke: 'rgba(0,0,0,.18)', 'stroke-width': 3 }, par); }
function street(par, ox, oy, sky = 'gEve') { S('rect', { x: ox - 240, y: oy - 160, width: 2400, height: 1040, fill: `url(#${sky})` }, par); S('rect', { x: ox - 240, y: oy + 880, width: 2400, height: 360, fill: '#1f2937' }, par); for (let k = -1; k < 13; k++) S('rect', { x: ox + k * 170, y: oy + 975, width: 90, height: 12, rx: 6, fill: '#fde68a' }, par); }
function skyline(par, ox, oy, base = 880) { const g = S('g', {}, par); [[60, 160, 460], [240, 150, 560], [410, 180, 400], [1300, 170, 520], [1490, 150, 620], [1660, 200, 470]].forEach(([x, w, h], k) => tower(g, ox + x, oy + base, w, h, k % 2 ? '#312e81' : '#1e1b4b')); return g; }
function windowPane(par, x, y, w, h, fill = 'url(#gSunset)') { S('rect', { x, y, width: w, height: h, rx: 14, fill }, par); S('path', { d: `M${x + w / 2} ${y} L${x + w / 2} ${y + h} M${x} ${y + h / 2} L${x + w} ${y + h / 2}`, stroke: '#e2e8f0', 'stroke-width': 12 }, par); S('rect', { x, y, width: w, height: h, rx: 14, fill: 'none', stroke: '#e2e8f0', 'stroke-width': 14 }, par); }
// ---------- small icon set (100x100 viewBox) ----------
const IPX = {
  apt: c => `<rect x="24" y="10" width="52" height="82" rx="4" fill="${c}"/>${[0, 1, 2, 3].map(r => [0, 1].map(q => `<rect x="${33 + q * 20}" y="${20 + r * 17}" width="12" height="10" fill="#0b1020"/>`).join('')).join('')}`,
  car: c => `<path d="M10 66 L18 44 Q22 36 32 36 L68 36 Q78 36 82 44 L90 66 L90 76 L10 76 Z" fill="${c}"/><rect x="30" y="42" width="40" height="14" rx="3" fill="#0b1020"/><circle cx="28" cy="78" r="10" fill="#e8eefc"/><circle cx="72" cy="78" r="10" fill="#e8eefc"/>`,
  cart: c => `<path d="M10 22 L24 22 L34 64 L80 64 L88 34 L28 34" stroke="${c}" stroke-width="7" fill="none" stroke-linejoin="round"/><circle cx="38" cy="80" r="7" fill="${c}"/><circle cx="74" cy="80" r="7" fill="${c}"/>`,
  bolt: c => `<path d="M58 6 L22 56 L46 56 L40 94 L78 40 L54 40 Z" fill="${c}"/>`,
  cap: c => `<path d="M50 20 L94 40 L50 60 L6 40 Z" fill="${c}"/><path d="M26 50 L26 70 Q50 84 74 70 L74 50" fill="${c}"/><path d="M88 43 L88 70" stroke="${c}" stroke-width="4"/>`,
  med: c => `<circle cx="50" cy="50" r="42" fill="${c}"/><path d="M42 26 H58 V42 H74 V58 H58 V74 H42 V58 H26 V42 H42 Z" fill="#0b1020"/>`,
  shirt: c => `<path d="M30 14 L10 30 L22 46 L30 40 L30 90 L70 90 L70 40 L78 46 L90 30 L70 14 Q50 28 30 14 Z" fill="${c}"/>`,
  wrench: c => `<path d="M64 10 A22 22 0 0 0 46 40 L12 74 L26 88 L60 54 A22 22 0 0 0 90 36 L76 42 L64 30 L70 16 Z" fill="${c}"/>`,
  plane: c => `<path d="M50 6 Q56 6 56 18 L56 40 L92 60 L92 68 L56 58 L56 80 L66 88 L66 94 L50 89 L34 94 L34 88 L44 80 L44 58 L8 68 L8 60 L44 40 L44 18 Q44 6 50 6 Z" fill="${c}"/>`,
  ring: c => `<circle cx="50" cy="62" r="26" stroke="${c}" stroke-width="8" fill="none"/><path d="M38 30 L50 14 L62 30 L50 38 Z" fill="${c}"/>`,
  umbrella: c => `<path d="M8 50 Q50 0 92 50 Z" fill="${c}"/><path d="M50 50 L50 84 Q50 92 42 90" stroke="${c}" stroke-width="6" fill="none"/>`,
  house: c => `<path d="M12 50 L50 16 L88 50 L88 90 L12 90 Z" fill="${c}"/><rect x="42" y="62" width="16" height="28" fill="#0b1020"/>`,
  heart: c => `<path d="M50 88 L14 52 Q2 36 16 22 Q32 10 50 30 Q68 10 84 22 Q98 36 86 52 Z" fill="${c}"/>`,
  person: c => `<circle cx="50" cy="28" r="15" fill="${c}"/><path d="M22 94 Q22 50 50 50 Q78 50 78 94 Z" fill="${c}"/>`,
  kid: c => `<circle cx="50" cy="42" r="11" fill="${c}"/><path d="M32 94 Q32 60 50 60 Q68 60 68 94 Z" fill="${c}"/>`,
  elder: c => `<circle cx="44" cy="28" r="14" fill="${c}"/><path d="M20 94 Q20 52 44 52 Q66 52 66 94 Z" fill="${c}"/><path d="M78 56 L78 94 M78 56 Q78 48 70 50" stroke="${c}" stroke-width="5" fill="none"/>`,
  brief: c => `<rect x="10" y="32" width="80" height="54" rx="8" fill="${c}"/><path d="M36 32 L36 20 L64 20 L64 32" stroke="${c}" stroke-width="7" fill="none"/>`,
  takeout: c => `<path d="M22 36 L78 36 L70 90 L30 90 Z" fill="${c}"/><path d="M36 36 Q36 16 50 16 Q64 16 64 36" stroke="${c}" stroke-width="5" fill="none"/>`,
  tag: c => `<path d="M10 50 L40 20 L88 20 L88 80 L40 80 Z" fill="${c}"/><circle cx="34" cy="50" r="7" fill="#0b1020"/>`,
  door: c => `<rect x="24" y="8" width="52" height="86" rx="4" fill="${c}"/><circle cx="66" cy="54" r="5" fill="#0b1020"/>`,
  eye: c => `<path d="M6 50 Q50 6 94 50 Q50 94 6 50 Z" fill="none" stroke="${c}" stroke-width="7"/><circle cx="50" cy="50" r="15" fill="${c}"/>`,
  cal: c => `<rect x="10" y="18" width="80" height="72" rx="8" fill="${c}"/><rect x="10" y="18" width="80" height="18" rx="6" fill="#0b1020" opacity=".35"/>${[0, 1, 2].map(r => [0, 1, 2, 3].map(q => `<rect x="${20 + q * 18}" y="${44 + r * 14}" width="10" height="8" fill="#0b1020"/>`).join('')).join('')}`,
  yacht: c => `<path d="M8 66 L92 66 L78 86 L22 86 Z" fill="${c}"/><path d="M50 10 L50 62 L84 62 Z" fill="${c}"/><path d="M46 20 L46 62 L20 62 Z" fill="${c}"/>`,
  bank: c => `<path d="M50 8 L92 30 L8 30 Z" fill="${c}"/>${[0, 1, 2, 3].map(k => `<rect x="${16 + k * 20}" y="36" width="10" height="40" fill="${c}"/>`).join('')}<rect x="8" y="80" width="84" height="12" fill="${c}"/>`,
  chartUp: c => `<path d="M10 80 L36 52 L56 64 L88 24" stroke="${c}" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M70 22 L90 22 L90 42" stroke="${c}" stroke-width="9" fill="none" stroke-linecap="round"/>`,
  chartDown: c => `<path d="M10 24 L36 52 L56 40 L88 80" stroke="${c}" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M70 82 L90 82 L90 62" stroke="${c}" stroke-width="9" fill="none" stroke-linecap="round"/>`,
  lock: c => `<rect x="18" y="44" width="64" height="48" rx="8" fill="${c}"/><path d="M32 44 L32 30 Q32 12 50 12 Q68 12 68 30 L68 44" stroke="${c}" stroke-width="8" fill="none"/>`,
  phone: c => `<rect x="28" y="6" width="44" height="88" rx="10" fill="${c}"/><rect x="34" y="16" width="32" height="62" rx="3" fill="#0b1020"/>`,
};
function ico(par, n, cx, cy, size, col, id) { const g = S('g', id ? { id } : {}, par); const sv = S('svg', { x: cx - size / 2, y: cy - size / 2, width: size, height: size, viewBox: '0 0 100 100', overflow: 'visible' }, g); sv.innerHTML = IPX[n](col); return g; }
// ---------- HTML overlays (screen level, not in the world) ----------
// odometer: odo(parent, left, top, w, h, ['$6,000','$3,600',...], fontPx, colours|colour, id) -> roll with tl.to('#'+id+'c', {y: -h*k})
function odo(parent, x, y, w, h, vals, fs, col, id) { const box = H('div', 'a', `left:${x}px;top:${y}px;width:${w}px;height:${h}px;overflow:hidden`, null, parent, id); const c = H('div', 'a', `left:0;top:0;width:${w}px`, null, box, id + 'c'); vals.forEach((v, i) => H('div', 'a', `left:0;top:${i * h}px;width:${w}px;height:${h}px;text-align:center;font-size:${fs}px;font-weight:800;line-height:${h}px;color:${Array.isArray(col) ? col[i] : col}`, v, c)); return box; }
// red-edge flash for a REAL emergency moment only (e.g. "financial emergency" right after the car breaks down): ~1 s, 2 pulses, at most 1–2 times per video. Never a permanent dark edge.
// vignette(s) at build, then tl.fromTo('#vig',{autoAlpha:0},{autoAlpha:1,duration:.25,yoyo:true,repeat:3},t) and tl.set('#vig',{autoAlpha:0},0) at the start of beats
const vignette = s => H('div', 'a', `left:0;top:0;width:${FW}px;height:${FH}px;pointer-events:none;background:radial-gradient(ellipse at center,transparent 45%,rgba(239,68,68,.55) 100%)`, '', s, 'vig');
