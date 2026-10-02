// EXAMPLE (reference only, do not run as-is): the 'Maya' finance video the user loved (5 min, US audience, built before intro/outro existed).
// Study the LEVEL OF DETAIL per area (props, lighting, small story objects), not the exact code. Newer videos use illus.js charB + kit helpers + intro()/outro().
// WARNING: it contains a red screen-edge vignette (SCREEN overlays section) — NEVER copy that; the user hates vignettes.
// ================== PREMIUM: remaining areas (41s -> end) ==================
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
};
function ico(par, n, cx, cy, size, col, id) { const g = S('g', id ? { id } : {}, par); const sv = S('svg', { x: cx - size / 2, y: cy - size / 2, width: size, height: size, viewBox: '0 0 100 100', overflow: 'visible' }, g); sv.innerHTML = IPX[n](col); return g; }
function XM(par, cx, cy, r, id) { const g = S('g', { id }, par); S('path', { d: `M${cx - r} ${cy - r} L${cx + r} ${cy + r} M${cx + r} ${cy - r} L${cx - r} ${cy + r}`, stroke: '#ef4444', 'stroke-width': r * .22, 'stroke-linecap': 'round' }, g); return g; }
function pill(par, x, y, txt, bg, fg, id, fs = 30) { const g = S('g', { id }, par); const w = txt.length * fs * .6 + 50; S('rect', { x: x - w / 2, y: y - fs * .95, width: w, height: fs * 1.9, rx: fs * .95, fill: bg }, g); wtext(g, x, y + fs * .35, txt, fs, fg, 'middle', 700); return g; }
function mayaBody(par, x, y, s, p) {
  const o = S('g', { transform: `translate(${x},${y}) scale(${s})` }, par); const M = S('g', { id: p + 'B' }, o);
  S('ellipse', { cx: 0, cy: 5, rx: 120, ry: 20, fill: 'rgba(0,0,0,.35)' }, M);
  S('rect', { x: -52, y: -225, width: 44, height: 222, rx: 20, fill: C.pants }, M); S('rect', { x: 8, y: -225, width: 44, height: 222, rx: 20, fill: C.pants }, M);
  S('ellipse', { cx: -35, cy: 0, rx: 38, ry: 15, fill: C.shoe }, M); S('ellipse', { cx: 35, cy: 0, rx: 38, ry: 15, fill: C.shoe }, M);
  S('path', { d: 'M-98 -205 Q-105 -415 0 -427 Q105 -415 98 -205 Z', fill: C.blazer }, M);
  S('path', { d: 'M-30 -421 L0 -345 L30 -421 Z', fill: '#f8fafc' }, M); S('path', { d: 'M0 -345 L0 -205', stroke: C.blazerSh, 'stroke-width': 4 }, M);
  S('path', { d: 'M-92 -395 Q-130 -305 -110 -215', stroke: C.blazer, 'stroke-width': 40, fill: 'none', 'stroke-linecap': 'round' }, M); S('circle', { cx: -108, cy: -205, r: 20, fill: C.skin }, M);
  S('path', { d: 'M92 -395 Q130 -305 110 -215', stroke: C.blazer, 'stroke-width': 40, fill: 'none', 'stroke-linecap': 'round' }, M); S('circle', { cx: 108, cy: -205, r: 20, fill: C.skin }, M);
  mayaHead(M, 0, -510, p); return M;
}
function carG(par, x, y, s, col, id) { const o = S('g', { transform: `translate(${x},${y}) scale(${s})` }, par); const g = S('g', { id }, o); const h = S('g', { transform: 'translate(-260,-905)' }, g);
  S('ellipse', { cx: 260, cy: 905, rx: 230, ry: 18, fill: 'rgba(0,0,0,.4)' }, h);
  S('path', { d: 'M40 880 L50 800 Q60 760 110 755 L170 700 Q190 680 230 680 L360 680 Q400 680 420 710 L460 760 Q500 768 500 800 L505 880 Z', fill: col }, h);
  S('path', { d: 'M190 710 L235 700 L300 700 L300 755 L160 755 Z', fill: '#bfdbfe' }, h); S('path', { d: 'M318 700 L360 700 Q385 702 400 724 L420 755 L318 755 Z', fill: '#bfdbfe' }, h);
  [130, 400].forEach(x => { S('circle', { cx: x, cy: 880, r: 48, fill: '#111827' }, h); S('circle', { cx: x, cy: 880, r: 22, fill: '#9ca3af' }, h); }); return g; }
function houseG(par, x, y, s, col, id, roof = '#7c2d12') { const o = S('g', { transform: `translate(${x},${y}) scale(${s})` }, par); const g = S('g', { id }, o);
  S('ellipse', { cx: 0, cy: 4, rx: 190, ry: 18, fill: 'rgba(0,0,0,.35)' }, g);
  S('rect', { x: 70, y: -330, width: 34, height: 80, fill: '#57534e' }, g);
  S('rect', { x: -140, y: -210, width: 280, height: 210, fill: col }, g); S('path', { d: 'M-170 -205 L0 -340 L170 -205 Z', fill: roof }, g);
  S('rect', { x: -28, y: -110, width: 56, height: 110, rx: 4, fill: '#3f2d24' }, g);
  [[-105, -170], [55, -170]].forEach(([wx, wy]) => { S('rect', { x: wx, y: wy, width: 50, height: 50, rx: 4, fill: '#fde68a' }, g); S('path', { d: `M${wx + 25} ${wy} L${wx + 25} ${wy + 50} M${wx} ${wy + 25} L${wx + 50} ${wy + 25}`, stroke: '#78350f', 'stroke-width': 4 }, g); });
  return g; }
function tower(par, x, y, w, h, col, lit) { const g = S('g', {}, par); S('rect', { x, y: y - h, width: w, height: h, fill: col }, g); for (let r = 0; r < Math.floor(h / 46); r++) for (let q = 0; q < Math.floor(w / 36); q++) S('rect', { x: x + 10 + q * 36, y: y - h + 14 + r * 46, width: 18, height: 24, fill: ((r * 7 + q * 3) % 5 === 0) ? '#fde68a' : (lit || '#1e293b') }, g); return g; }
function bgArea(par, ox, oy, gid) { S('rect', { x: ox, y: oy, width: 1920, height: 1080, fill: `url(#${gid})` }, par); }
const AO = i => [(i % 4) * 2400, Math.floor(i / 4) * 1400];

function buildMore(sv, defs, s) {
  grad(defs, 'gEve', [[0, '#1e3a8a'], [.7, '#7c3aed'], [1, '#f472b6']]); grad(defs, 'gKitchen', [[0, '#2b2f4a'], [1, '#1a1d33']]);
  grad(defs, 'gMint', [[0, '#0f2b2b'], [1, '#0a1a1f']]); grad(defs, 'gSea', [[0, '#0e7490'], [1, '#082f49']]); grad(defs, 'gSkyDay', [[0, '#0c4a6e'], [1, '#38bdf8']]);
  grad(defs, 'gLiquid', [[0, '#34d399'], [1, '#059669']]); grad(defs, 'gCanyon', [[0, '#7c2d12'], [1, '#1c0a03']]); grad(defs, 'gBalloon', [[0, '#fbbf24'], [1, '#f97316']], 1, 0);
  const G = S('g', {}, sv); const B_ = [];
  const beat = f => B_.push(f);
  // ---------- D(extra): take-home pay stub (stage area index 4) ----------
  const [dx, dy] = AO(4);
  const stub = S('g', { id: 'stub', filter: 'url(#fSh)' }, G);
  S('rect', { x: dx + 1180, y: dy + 120, width: 620, height: 330, rx: 20, fill: '#f8fafc' }, stub); S('rect', { x: dx + 1180, y: dy + 120, width: 620, height: 60, rx: 20, fill: '#34d399' }, stub);
  wtext(stub, dx + 1210, dy + 162, 'TAKE-HOME PAY', 28, '#064e3b', 'start', 800); wtext(stub, dx + 1490, dy + 300, '$6,000', 110, '#047857'); wtext(stub, dx + 1490, dy + 360, 'per month (illustrative)', 26, '#64748b', 'middle', 500);
  const up = S('g', { id: 'stUp' }, G); S('path', { d: `M${dx + 1740} ${dy + 250} L${dx + 1770} ${dy + 210} L${dx + 1800} ${dy + 250} Z`, fill: '#34d399' }, up);
  const dn = S('g', { id: 'stDn' }, G); S('path', { d: `M${dx + 1740} ${dy + 290} L${dx + 1770} ${dy + 330} L${dx + 1800} ${dy + 290} Z`, fill: '#f87171' }, dn);
  pill(G, dx + 1330, dy + 520, 'where you live', '#1e293b', '#cbd5e1', 'stP1', 26); pill(G, dx + 1650, dy + 520, "what's deducted", '#1e293b', '#cbd5e1', 'stP2', 26);
  beat(() => { const t = go('so lets imagine'); CAM(t, dx + 1490, dy + 320, 1.7, 1.4); tl.fromTo('#stub', { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: .7, ease: 'back.out(1.4)' }, W('six thousand dollars') - .3); B(W('six thousand dollars'));
    const t2 = W('higher or lower'); FADE('#stUp', t2); FADE('#stDn', t2 + .3); tl.to('#stUp', { y: -16, duration: .35, yoyo: true, repeat: 5 }, t2); tl.to('#stDn', { y: 16, duration: .35, yoyo: true, repeat: 5 }, t2 + .3);
    POP('#stP1', W('where you live')); POP('#stP2', W('what comes out')); });

  // ---------- E: Maya's life (index 3) ----------
  const [ex, ey] = AO(3); bgArea(G, ex, ey, 'gEve');
  for (let k = 0; k < 10; k++) S('circle', { cx: ex + 100 + k * 190, cy: ey + 80 + (k * 37) % 120, r: 2.5, fill: '#fde68a' }, G);
  S('rect', { x: ex, y: ey + 880, width: 1920, height: 200, fill: '#1e1b4b' }, G); S('rect', { x: ex, y: ey + 880, width: 1920, height: 10, fill: '#475569' }, G);
  const eApt = S('g', { id: 'eApt' }, G); tower(eApt, ex + 120, ey + 880, 260, 520, '#334155');
  const eJob = S('g', { id: 'eJob' }, G); tower(eJob, ex + 1580, ey + 880, 260, 700, '#1e3a8a', '#172554'); wtext(eJob, ex + 1710, ey + 160, 'OFFICE', 30, '#93c5fd');
  carG(G, ex + 1340, ey + 885, .55, '#22d3ee', 'eCar');
  mayaBody(G, ex + 840, ey + 885, 1, 'e');
  pill(G, ex + 840, ey + 260, 'Maya', '#34d399', '#052e1f', 'eName', 40); pill(G, ex + 1060, ey + 470, '$100k / year', '#0f172a', '#34d399', 'eSal', 28);
  const eY = S('g', { id: 'eY' }, G); S('circle', { cx: ex + 470, cy: ey + 250, r: 110, fill: '#f8fafc', opacity: .92 }, eY); ico(eY, 'yacht', ex + 470, ey + 250, 150, '#64748b'); XM(eY, ex + 470, ey + 250, 80, 'eYx');
  const eP = S('g', { id: 'eP' }, G); S('circle', { cx: ex + 1230, cy: ey + 220, r: 110, fill: '#f8fafc', opacity: .92 }, eP); ico(eP, 'plane', ex + 1230, ey + 220, 140, '#64748b'); XM(eP, ex + 1230, ey + 220, 80, 'ePx');
  const eFo = S('g', { transform: 'translate(120,0)' }, G); const eF = S('g', { id: 'eF' }, eFo); S('circle', { cx: ex + 450, cy: ey + 520, r: 150, fill: '#fde7c7', stroke: '#d6a85b', 'stroke-width': 10 }, eF);
  mayaBody(eF, ex + 450, ey + 640, .45, 'f'); S('path', { d: `M${ex + 410} ${ey + 395} L${ex + 450} ${ey + 378} L${ex + 490} ${ey + 395} L${ex + 450} ${ey + 412} Z`, fill: '#111827' }, eF);
  S('path', { d: `M${ex + 320} ${ey + 600} L${ex + 580} ${ey + 600}`, stroke: '#ef4444', 'stroke-width': 8, 'stroke-dasharray': '16 10' }, eF); wtext(eF, ex + 450, ey + 700, 'age 22', 30, '#7c2d12');
  beat(() => { const t = go('well call her maya'); tl.set('#world', { x: 960 - (ex + 900) * 1.8, y: 540 - (ey + 500) * 1.8, scale: 1.8 }, t - .1); CAM(t, ex + 960, ey + 540, 1, 1.6, 'power2.out');
    POP('#eName', W('maya') + .3); POP('#eSal', W('maya earns'));
    tl.set(['#eYx', '#ePx'], { autoAlpha: 0 }, 0); POP('#eY', W('own a yacht')); POP('#eYx', W('own a yacht') + .5); POP('#eP', W('flying first class')); POP('#ePx', W('flying first class') + .5);
    OUT(['#eY', '#eP'], W('decent apartment') - .3); tl.fromTo('#eApt', { autoAlpha: 0, y: 200 }, { autoAlpha: 1, y: 0, duration: .7, ease: 'power3.out' }, W('decent apartment')); B(W('decent apartment'));
    tl.fromTo('#eCar', { autoAlpha: 0, x: 400 }, { autoAlpha: 1, x: 0, duration: .8, ease: 'power3.out' }, W('a car')); B(W('a car'));
    tl.fromTo('#eJob', { autoAlpha: 0, y: 260 }, { autoAlpha: 1, y: 0, duration: .7, ease: 'power3.out' }, W('and a job')); B(W('and a job'));
    POP('#eF', W('finish line'), { s: .3 }); CAM(W('finish line'), ex + 720, ey + 560, 1.4, 1.2); });

  // ---------- F: budget jar (index 5) ----------
  const [fx, fy] = AO(5); bgArea(G, fx, fy, 'gKitchen');
  S('rect', { x: fx, y: fy + 900, width: 1920, height: 180, fill: '#3f2d24' }, G); S('rect', { x: fx, y: fy + 890, width: 1920, height: 16, fill: '#57534e' }, G);
  const JX = fx + 480, JT = fy + 260, JH = 620, JW = 380;
  S('rect', { x: JX - JW / 2, y: JT, width: JW, height: JH, rx: 50, fill: 'rgba(255,255,255,.05)' }, G);
  S('rect', { id: 'liq', x: JX - JW / 2 + 12, y: JT + 30, width: JW - 24, height: JH - 42, rx: 40, fill: 'url(#gLiquid)' }, G);
  for (let k = 0; k < 14; k++) coin(G, JX - 140 + (k * 61) % 280, JT + JH - 60 - Math.floor(k / 5) * 40, 22);
  S('rect', { x: JX - JW / 2, y: JT, width: JW, height: JH, rx: 50, fill: 'none', stroke: '#e2e8f0', 'stroke-width': 10 }, G);
  S('rect', { x: JX - JW / 2 - 20, y: JT - 50, width: JW + 40, height: 60, rx: 14, fill: '#94a3b8' }, G);
  const od = H('div', 'a', `left:${JX - 230}px;top:${JT - 180}px;width:460px;height:110px;overflow:hidden`, null, s.querySelector('#world'), 'jOd'); const odc = H('div', 'a', 'left:0;top:0;width:460px', null, od, 'jOdc');
  ['$6,000', '$3,600', '$2,800', '$2,200', '$1,900', '$1,500'].forEach((v, i) => H('div', 'a', `left:0;top:${i * 110}px;width:460px;height:110px;text-align:center;font-size:96px;font-weight:800;line-height:110px;color:${i === 5 ? '#fbbf24' : '#34d399'}`, v, odc));
  const exps = [['apt', 'Rent', '-$2,400', '#60a5fa', 'rent', .6], ['car', 'Car', '-$800', '#22d3ee', 'car payment', .4667], ['cart', 'Food', '-$600', '#fb923c', 'groceries', .3667], ['bolt', 'Bills', '-$300', '#fbbf24', 'utilities', .3167], ['cap', 'Loans', '-$400', '#a78bfa', 'student loans', .25]];
  exps.forEach(([n, l, v, c], i) => { const y = fy + 180 + i * 145; const g = S('g', { id: 'ex' + i }, G); S('rect', { x: fx + 900, y: y - 55, width: 520, height: 110, rx: 24, fill: 'rgba(255,255,255,.06)', stroke: c, 'stroke-width': 3 }, g); ico(g, n, fx + 965, y, 80, c); wtext(g, fx + 1030, y + 14, l, 40, '#e8eefc', 'start', 700); wtext(g, fx + 1390, y + 14, v, 40, c, 'end', 800); S('path', { class: 'draw', id: 'exa' + i, d: `M${JX + JW / 2 + 10} ${fy + 600} Q${fx + 820} ${y} ${fx + 895} ${y}`, stroke: c, 'stroke-width': 5, fill: 'none', 'stroke-dasharray': '0' }, G); });
  const okF = S('g', { id: 'okF' }, G); S('circle', { cx: JX + 240, cy: JT + 60, r: 44, fill: '#34d399' }, okF); S('path', { d: `M${JX + 218} ${JT + 62} L${JX + 236} ${JT + 80} L${JX + 264} ${JT + 44}`, stroke: '#052e1f', 'stroke-width': 9, fill: 'none' }, okF);
  const nPos = i => [fx + 960 + (i % 4) * 230, fy + 330 + Math.floor(i / 4) * 300];
  for (let i = 0; i < 8; i++) { const [cx, cy] = nPos(i); const g = S('g', { id: 'np' + i }, G); S('circle', { cx, cy, r: 90, fill: 'none', stroke: '#64748b', 'stroke-width': 4, 'stroke-dasharray': '14 10' }, g); wtext(g, cx, cy + 28, '?', 80, '#64748b'); }
  const needs = [['med', '#f87171', 'medical bills'], ['shirt', '#f472b6', 'clothes'], ['wrench', '#22d3ee', 'car maintenance'], ['plane', '#60a5fa', 'a trip to see'], ['ring', '#fbbf24', 'a wedding invitation'], ['umbrella', '#fb923c', 'an emergency fund'], ['house', '#a78bfa', 'saving for a home'], ['heart', '#34d399', 'enjoying the life']];
  const nG = needs.map(([n, c], i) => { const a = -Math.PI * .9 + i * (Math.PI * .8 / 7), x = fx + 1400 + Math.cos(a) * 0 + (i % 4) * 130, y = fy + 260 + Math.floor(i / 4) * 330; const g = S('g', { id: 'nd' + i }, G); S('circle', { cx: fx + 960 + (i % 4) * 230, cy: fy + 330 + Math.floor(i / 4) * 300, r: 90, fill: 'rgba(255,255,255,.07)', stroke: c, 'stroke-width': 4 }, g); ico(g, n, fx + 960 + (i % 4) * 230, fy + 330 + Math.floor(i / 4) * 300, 110, c); S('path', { d: `M${fx + 960 + (i % 4) * 230} ${fy + 420 + Math.floor(i / 4) * 300} Q${fx + 820} ${fy + 760} ${JX + 60} ${JT + JH - 140}`, stroke: c, 'stroke-width': 3, 'stroke-dasharray': '8 8', fill: 'none' }, g); return g; });
  beat(() => { const t = go('heres an illustrative'); tl.set('#world', { x: 960 - (JX) * 2, y: 540 - (fy + 540) * 2, scale: 2 }, t - .1); CAM(t, fx + 960, fy + 540, 1, 1.6, 'power2.out');
    tl.set(['#jOd', '#okF', ...[0,1,2,3,4,5,6,7].map(i => '#np' + i), ...needs.map((_, i) => '#nd' + i), ...exps.map((_, i) => '#ex' + i)], { autoAlpha: 0 }, 0); FADE('#jOd', t + .6);
    exps.forEach(([, , , , a, f], i) => { const tt = W(a); tl.fromTo('#ex' + i, { autoAlpha: 0, x: 80 }, { autoAlpha: 1, x: 0, duration: .5, ease: 'back.out(1.5)' }, tt); DRAW('#exa' + i, tt + .1, { d: .5 }); tl.to('#liq', { scaleY: f, transformOrigin: '50% 100%', duration: .8, ease: 'power2.inOut' }, tt + .3); tl.to('#jOdc', { y: -110 * (i + 1), duration: .5 }, tt + .3); B(tt); });
    POP('#okF', W('still sounds manageable'));
    const t2 = W('until that fifteen'); tl.to(exps.map((_, i) => '#ex' + i), { autoAlpha: 0, x: 60, duration: .4, stagger: .05 }, t2 - .2); tl.to(exps.map((_, i) => '#exa' + i), { autoAlpha: 0, duration: .3 }, t2 - .2); OUT('#okF', t2 - .2); B(t2); tl.fromTo([0,1,2,3,4,5,6,7].map(i => '#np' + i), { autoAlpha: 0, scale: .5, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: .4, stagger: .15, ease: 'back.out(1.6)' }, t2 + .5); tl.to([0,1,2,3,4,5,6,7].map(i => '#np' + i), { rotation: 8, duration: .3, yoyo: true, repeat: 3, stagger: .1 }, t2 + 2);
    needs.forEach(([, , a], i) => tl.fromTo('#nd' + i, { autoAlpha: 0, scale: .3, transformOrigin: '50% 50%' }, { autoAlpha: i === 7 ? .55 : 1, scale: 1, duration: .45, ease: 'back.out(1.8)' }, W(a))); needs.forEach(([, , a], i) => tl.to('#np' + i, { autoAlpha: 0, duration: .2 }, W(a)));
    tl.to('#liq', { x: 6, duration: .06, yoyo: true, repeat: 9 }, W('enjoying the life') + 1); B(W('enjoying the life') + 1); });

  // ---------- G: spoken for + flow + hourglass (index 6) ----------
  const [gx, gy] = AO(6); bgArea(G, gx, gy, 'gMint');
  const gc = []; const tags = ['apt', 'car', 'cart', 'bolt', 'cap', 'med', 'umbrella', 'house']; const tc = ['#60a5fa', '#22d3ee', '#fb923c', '#fbbf24', '#a78bfa', '#f87171', '#fb923c', '#a78bfa'];
  for (let k = 0; k < 8; k++) { const x = gx + 300 + k * 190; const g = S('g', { id: 'gc' + k }, G); coin(g, x, gy + 360, 60); gc.push(g); const t = S('g', { id: 'gt' + k }, G); S('path', { d: `M${x} ${gy + 425} Q${x + 20} ${gy + 520} ${x} ${gy + 600}`, stroke: '#94a3b8', 'stroke-width': 3, fill: 'none' }, t); S('rect', { x: x - 50, y: gy + 600, width: 100, height: 100, rx: 16, fill: '#f8fafc' }, t); ico(t, tags[k], x, gy + 650, 70, tc[k]); }
  const gTxt = S('g', { id: 'gTx' }, G); wtext(gTxt, gx + 960, gy + 180, 'already spoken for', 64, '#fbbf24');
  // flow-through pipe & basin (same area, revealed after coins leave)
  const PY = gy + 300; const GF = S('g', { id: 'gFlow' }, G);
  S('rect', { x: gx - 200, y: PY - 40, width: 2320, height: 80, rx: 40, fill: 'rgba(255,255,255,.12)' }, GF);
  const flow = []; for (let k = 0; k < 12; k++) { const f = S('g', { id: 'fl' + k }, G); coin(f, gx - 150 - k * 190, PY, 30); flow.push(f); }
  S('path', { d: `M${gx + 760} ${PY + 180} L${gx + 760} ${PY + 520} Q${gx + 760} ${PY + 560} ${gx + 800} ${PY + 560} L${gx + 1120} ${PY + 560} Q${gx + 1160} ${PY + 560} ${gx + 1160} ${PY + 520} L${gx + 1160} ${PY + 180}`, stroke: '#cbd5e1', 'stroke-width': 10, fill: 'none' }, GF);
  S('rect', { id: 'basin', x: gx + 770, y: PY + 470, width: 380, height: 80, rx: 12, fill: '#fbbf24' }, GF);
  S('path', { d: `M${gx + 960} ${PY + 40} L${gx + 960} ${PY + 150}`, stroke: 'rgba(255,255,255,.12)', 'stroke-width': 30 }, GF);
  const drip = S('g', { id: 'drip' }, G); coin(drip, gx + 960, PY + 140, 20);
  const hg = S('g', { id: 'hg' }, G); S('path', { d: `M${gx + 1400} ${PY + 180} L${gx + 1600} ${PY + 180} L${gx + 1525} ${PY + 365} L${gx + 1600} ${PY + 550} L${gx + 1400} ${PY + 550} L${gx + 1475} ${PY + 365} Z`, fill: 'none', stroke: '#f87171', 'stroke-width': 10, 'stroke-linejoin': 'round' }, hg); S('path', { id: 'sand', d: `M${gx + 1425} ${PY + 540} L${gx + 1575} ${PY + 540} L${gx + 1545} ${PY + 470} L${gx + 1455} ${PY + 470} Z`, fill: '#fbbf24' }, hg);
  const pX = XM(G, gx + 300, PY + 360, 80, 'pX'); const pc = S('g', { id: 'pChk' }, G); S('rect', { x: gx + 190, y: PY + 290, width: 220, height: 140, rx: 14, fill: '#f8fafc' }, pc); wtext(pc, gx + 300, PY + 375, 'PAY', 44, '#047857');
  pill(G, gx + 400, PY - 120, 'moves through', '#0f172a', '#e8eefc', 'gL1', 34); pill(G, gx + 960, PY + 650, 'stays', '#0f172a', '#fbbf24', 'gL2', 34); pill(G, gx + 1500, PY + 650, 'if it stops?', '#0f172a', '#f87171', 'gL3', 34);
  beat(() => { const t = go('maya isnt necessarily'); tl.set('#world', { x: 960 - (gx + 960) * 1.6, y: 540 - (gy + 450) * 1.6, scale: 1.6 }, t - .1); CAM(t, gx + 960, gy + 540, 1, 1.4, 'power2.out');
    tl.set(['#gTx', '#gL1', '#gL2', '#gL3', '#pX', '#pChk', '#hg', '#drip', '#gFlow', ...flow.map(e => '#' + e.id), ...gc.map(e => '#' + e.id), ...tags.map((_, k) => '#gt' + k)], { autoAlpha: 0 }, 0);
    POP(gc.map(e => '#' + e.id), t + .2, { st: .08 });
    const t2 = W('already spoken for'); IN('#gTx', t2); tags.forEach((_, k) => tl.fromTo('#gt' + k, { autoAlpha: 0, y: -60 }, { autoAlpha: 1, y: 0, duration: .45, ease: 'back.out(1.6)' }, t2 + .2 + k * .1)); B(t2);
    tl.to(gc.map(e => '#' + e.id), { y: -14, duration: .4, yoyo: true, repeat: 3, stagger: .05 }, W('that difference explains')); B(W('that difference explains'));
    const t3 = W('a high income'); tl.to(['#gTx', ...gc.map(e => '#' + e.id), ...tags.map((_, k) => '#gt' + k)], { autoAlpha: 0, y: 40, duration: .4, stagger: .02 }, t3 - .5); FADE('#gFlow', t3 - .1);
    flow.forEach((f, k) => { tl.set(f, { autoAlpha: 1 }, t3 + .2); tl.fromTo(f, { x: 0 }, { x: 4300, duration: 5.5, ease: 'none' }, t3 + .2); }); IN('#gL1', W('moves through')); B(W('moves through'));
    const t4 = W('how much stays'); FADE('#drip', t4 - .4); tl.fromTo('#drip', { y: 0 }, { y: 330, duration: .6, ease: 'power2.in', repeat: 2 }, t4 - .4); tl.fromTo('#basin', { scaleY: .3, transformOrigin: '50% 100%' }, { scaleY: 1, duration: 1 }, t4); POP('#gL2', t4 + .3);
    const t5 = W('how long you could'); POP('#hg', t5); POP('#gL3', t5 + .4); POP('#pChk', W('paychecks stopped') - .5); POP('#pX', W('paychecks stopped')); tl.to('#sand', { scaleY: .2, transformOrigin: '50% 100%', duration: 1.5 }, W('paychecks stopped')); tl.to('#hg', { rotation: 180, transformOrigin: '50% 50%', duration: .7 }, W('paychecks stopped') + .2); tl.to('#basin', { scaleY: .1, duration: 1.5 }, W('paychecks stopped') + .5); B(W('paychecks stopped')); });

  // ---------- H: geography (index 7) ----------
  const [hx, hy] = AO(7); bgArea(G, hx, hy, 'gSkyDay');
  [[hx + 60, 'City A', '#14532d'], [hx + 990, 'City B', '#1e1b4b']].forEach(([x, l, c], i) => { const g = S('g', { id: 'hc' + i, filter: 'url(#fSh)' }, G); S('rect', { x, y: hy + 300, width: 870, height: 700, rx: 30, fill: c }, g); pill(g, x + 435, hy + 360, l, '#f8fafc', '#0f172a', 'hcl' + i, 34); });
  houseG(G, hx + 495, hy + 900, 1.25, '#fcd34d', 'hH1'); for (let k = 0; k < 3; k++) { S('circle', { cx: hx + 160 + k * 600 * (k === 2 ? .2 : 1) + (k === 2 ? 560 : 0), cy: hy + 820, r: 60, fill: '#16a34a' }, G); S('rect', { x: hx + 152 + k * 600 * (k === 2 ? .2 : 1) + (k === 2 ? 560 : 0), y: hy + 860, width: 16, height: 50, fill: '#78350f' }, G); }
  S('circle', { id: 'hAura', cx: hx + 495, cy: hy + 720, r: 330, fill: 'url(#gGlow)' }, G);
  const cityB = S('g', { id: 'hB' }, G); tower(cityB, hx + 1010, hy + 980, 150, 560, '#312e81'); tower(cityB, hx + 1170, hy + 980, 150, 640, '#3730a3'); tower(cityB, hx + 1330, hy + 980, 150, 600, '#312e81'); tower(cityB, hx + 1490, hy + 980, 150, 520, '#3730a3'); tower(cityB, hx + 1650, hy + 980, 190, 610, '#312e81');
  S('rect', { id: 'hWin', x: hx + 1350, y: hy + 700, width: 40, height: 46, fill: '#fbbf24', stroke: '#f87171', 'stroke-width': 6 }, G);
  const offer = S('g', { id: 'offer', filter: 'url(#fSh)' }, G); S('rect', { x: hx + 810, y: hy + 60, width: 300, height: 200, rx: 12, fill: '#f8fafc' }, offer); wtext(offer, hx + 960, hy + 120, 'OFFER', 32, '#0f172a'); wtext(offer, hx + 960, hy + 210, '$100,000', 52, '#047857');
  [[hx + 495, '#hOA'], [hx + 1425, '#hOB']].forEach(([x, id]) => { const g = S('g', { id: id.slice(1), filter: 'url(#fSh)' }, G); S('rect', { x: x - 110, y: hy + 420, width: 220, height: 130, rx: 10, fill: '#f8fafc' }, g); wtext(g, x, hy + 505, '$100k', 46, '#047857'); });
  pill(G, hx + 300, hy + 560, 'rent $', '#f8fafc', '#14532d', 'hTA', 34); pill(G, hx + 1425, hy + 340 + 260, 'rent $$$', '#f8fafc', '#b91c1c', 'hTB', 34);
  pill(G, hx + 495, hy + 1040, 'breathing room', '#14532d', '#86efac', 'hR1', 32); pill(G, hx + 1425, hy + 1040, 'tight', '#450a0a', '#fca5a5', 'hR2', 32);
  beat(() => { const t = go('now add geography'); tl.set('#world', { x: 960 - (hx + 960) * 1.5, y: 540 - (hy + 300) * 1.5, scale: 1.5 }, t - .1); CAM(t, hx + 960, hy + 560, 1, 1.4, 'power2.out');
    tl.set(['#offer', '#hOA', '#hOB', '#hTA', '#hTB', '#hR1', '#hR2', '#hAura', '#hc0', '#hc1', '#hH1', '#hB', '#hWin'], { autoAlpha: 0 }, 0);
    FADE(['#hc0', '#hc1'], t + .2, { st: .2 }); FADE(['#hH1', '#hB', '#hWin'], t + .5, { st: .2 });
    tl.fromTo('#offer', { autoAlpha: 0, y: -120, rotation: -8, transformOrigin: '50% 50%' }, { autoAlpha: 1, y: 0, rotation: 0, duration: .7, ease: 'back.out(1.5)' }, W('offer letter') - .4); B(W('offer letter'));
    tl.to('#offer', { scale: 1.1, duration: .25, yoyo: true, repeat: 1 }, W('in every city'));
    const tS = W('same number'); [['#hOA', -465], ['#hOB', 465]].forEach(([id, dx]) => tl.fromTo(id, { autoAlpha: 0, x: -dx, y: -330, scale: .6, transformOrigin: '50% 50%' }, { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: .8, ease: 'power3.out' }, tS + .3)); B(tS + .3);
    PULSE(['#hc0', '#hc1'], W('does not buy'), { s: 1.03 }); tl.to(['#hOA', '#hOB'], { autoAlpha: 0, y: -40, duration: .4 }, W('housing alone') - .4); PULSE('#hH1', W('housing alone'), { s: 1.05 }); POP('#hTA', W('housing alone') + .2); POP('#hTB', W('housing alone') + .5); PULSE('#hTB', W('entire equation'), { s: 1.2, r: 3 });
    FADE('#hAura', W('breathing room'), { d: 1 }); POP('#hR1', W('breathing room')); tl.to('#hB', { scaleX: .93, transformOrigin: '50% 100%', duration: .5, yoyo: true, repeat: 3 }, W('feel tight')); POP('#hR2', W('feel tight')); B(W('feel tight')); });

  // ---------- I: moving isn't simple (index 8) ----------
  const [ix, iy] = AO(8); bgArea(G, ix, iy, 'gEve');
  S('rect', { x: ix, y: iy + 780, width: 1920, height: 300, fill: '#1f2937' }, G); for (let k = 0; k < 12; k++) S('rect', { x: ix + k * 170, y: iy + 925, width: 90, height: 12, rx: 6, fill: '#fde68a' }, G);
  const sign = S('g', { id: 'iSign' }, G); S('rect', { x: ix + 1700, y: iy + 520, width: 12, height: 260, fill: '#94a3b8' }, sign); S('rect', { x: ix + 1580, y: iy + 470, width: 260, height: 90, rx: 10, fill: '#16a34a' }, sign); wtext(sign, ix + 1710, iy + 528, 'CHEAPER', 34, '#f0fdf4');
  carG(G, ix + 820, iy + 900, .7, '#22d3ee', 'iCar');
  const anchors = [['brief', 'job', '#fbbf24', ix + 200, iy + 360, 'job may be tied'], ['person', 'partner', '#f472b6', ix + 200, iy + 560, 'your partner'], ['kid', 'childcare', '#22d3ee', ix + 200, iy + 760, 'provide childcare']];
  anchors.forEach(([n, l, c, x, y], i) => { const g = S('g', { id: 'ia' + i }, G); S('circle', { cx: x, cy: y, r: 70, fill: 'rgba(255,255,255,.08)', stroke: c, 'stroke-width': 4 }, g); ico(g, n, x, y, 90, c); wtext(g, x + 90, y + 12, l, 34, c, 'start', 700); S('path', { class: 'draw', id: 'ir' + i, d: `M${x + 70} ${y} Q${ix + 520} ${y + 120} ${ix + 700} ${iy + 820}`, stroke: c, 'stroke-width': 6, fill: 'none', 'stroke-dasharray': '0' }, G); });
  const lst = S('g', { id: 'iL', filter: 'url(#fSh)' }, G); S('rect', { x: ix + 1080, y: iy + 120, width: 460, height: 230, rx: 18, fill: '#f8fafc' }, lst); wtext(lst, ix + 1310, iy + 180, 'RENT LISTING', 30, '#0f172a'); wtext(lst, ix + 1310, iy + 270, 'cheaper!', 64, '#047857');
  ['commute', 'childcare', 'career'].forEach((l, i) => pill(G, ix + 1150 + (i % 2) * 300, iy + 420 + Math.floor(i / 2) * 90 + (i % 2) * 0, '+ ' + l, '#7f1d1d', '#fecaca', 'ih' + i, 32));
  beat(() => { const t = go('and moving somewhere cheaper'); tl.set('#world', { x: 960 - (ix + 1000) * 1.5, y: 540 - (iy + 700) * 1.5, scale: 1.5 }, t - .1); CAM(t, ix + 960, iy + 540, 1, 1.4, 'power2.out');
    tl.set(['#iL', '#ih0', '#ih1', '#ih2', '#ia0', '#ia1', '#ia2'], { autoAlpha: 0 }, 0);
    tl.fromTo('#iCar', { x: -500 }, { x: 250, duration: 2, ease: 'power2.out' }, t); B(t);
    anchors.forEach(([, , , , , a], i) => { const tt = W(a); POP('#ia' + i, tt); DRAW('#ir' + i, tt + .2, { d: .5 }); tl.to('#iCar', { x: 250 - (i + 1) * 70, duration: .5, ease: 'power2.inOut' }, tt + .5); });
    const t2 = W('a cheaper address'); POP('#iL', t2); ['#ih0', '#ih1', '#ih2'].forEach((h, i) => POP(h, W('never appear') + i * .3)); });

  // ---------- J: the pie (index 9) ----------
  const [jx, jy] = AO(9); bgArea(G, jx, jy, 'gKitchen');
  const PCX = jx + 960, PCY = jy + 470, PR = 260;
  S('ellipse', { cx: PCX, cy: PCY + 20, rx: PR + 50, ry: PR + 50, fill: '#e2e8f0' }, G);
  const pie = S('g', { id: 'pie' }, G); S('circle', { cx: PCX, cy: PCY, r: PR, fill: '#fbbf24' }, pie); S('circle', { cx: PCX, cy: PCY, r: PR - 26, fill: '#f59e0b' }, pie); for (let k = 0; k < 9; k++) coin(pie, PCX + Math.cos(k * .7 + .4) * (150 + (k * 37) % 50), PCY + Math.sin(k * .7 + .4) * (150 + (k * 37) % 50), 26);
  const cut = (n, id) => { const g = S('g', { id }, G); for (let k = 0; k < n; k++) { const a = -Math.PI / 2 + k * 2 * Math.PI / n; S('path', { class: 'draw', d: `M${PCX} ${PCY} L${PCX + Math.cos(a) * PR} ${PCY + Math.sin(a) * PR}`, stroke: '#1e293b', 'stroke-width': 8, 'stroke-dasharray': '0' }, g); } return g; };
  cut(4, 'cut4'); cut(7, 'cut7'); const pb = S('g', { id: 'pieC' }, G); S('circle', { cx: PCX, cy: PCY, r: 105, fill: '#fbbf24', stroke: '#78350f', 'stroke-width': 8 }, pb); wtext(pb, PCX, PCY + 22, '$100k', 60, '#78350f');
  const solo = S('g', { id: 'jSolo' }, G); ico(solo, 'person', jx + 300, jy + 470, 200, '#e8eefc'); wtext(solo, jx + 300, jy + 640, 'one adult', 36, '#e8eefc');
  const fam = [['person', '#60a5fa'], ['person', '#f472b6'], ['kid', '#22d3ee'], ['kid', '#fbbf24']].map(([n, c], i) => { const g = S('g', { id: 'jf' + i }, G); ico(g, n, jx + 690 + i * 180, jy + 900, n === 'kid' ? 130 : 170, c); return g; });
  const more3 = [['kid', 'childcare', '#22d3ee'], ['med', 'medical', '#f87171'], ['elder', 'aging parent', '#a78bfa']].map(([n, l, c], i) => { const g = S('g', { id: 'jm' + i }, G); ico(g, n, jx + 1430, jy + 260 + i * 210, 150, c); wtext(g, jx + 1530, jy + 275 + i * 210, l, 42, c, 'start', 700); return g; });
  pill(G, PCX, jy + 110, 'how many people?', '#0f172a', '#fbbf24', 'jQ', 40);
  beat(() => { const t = go('then theres the question'); tl.set('#world', { x: 960 - PCX * 1.8, y: 540 - PCY * 1.8, scale: 1.8 }, t - .1); CAM(t, jx + 960, jy + 540, 1, 3.2, 'power2.inOut');
    tl.set(['#jQ', '#jSolo', '#cut4', '#cut7', ...fam.map(e => '#' + e.id), ...more3.map(e => '#' + e.id)], { autoAlpha: 0 }, 0);
    POP('#jQ', W('how many people')); POP('#jSolo', W('one adult making'));
    const t2 = W('and a family'); FADE('#cut4', t2 - .1, { d: .1 }); DRAW(s.querySelectorAll('#cut4 .draw'), t2, { st: .1, d: .3 }); POP(fam.map(e => '#' + e.id), t2 + .3, { st: .12 }); DIM('#jSolo', t2, .35);
    PULSE('#pie', W('two very different'), { s: 1.04 });
    const t3 = W('add childcare'); OUT('#cut4', t3, { d: .2 }); FADE('#cut7', t3, { d: .1 }); DRAW(s.querySelectorAll('#cut7 .draw'), t3 + .1, { st: .08, d: .3 });
    [['add childcare', 0], ['medical needs', 1], ['aging parent', 2]].forEach(([a, i]) => tl.fromTo('#jm' + i, { autoAlpha: 0, x: 60 }, { autoAlpha: 1, x: 0, duration: .45, ease: 'back.out(1.6)' }, W(a)));
    tl.to('#pie', { scale: .92, transformOrigin: '50% 50%', duration: .5, yoyo: true, repeat: 1 }, W('more jobs to do')); B(W('more jobs to do')); });

  // ---------- K: lifestyle glass (index 10) ----------
  const [kx, ky] = AO(10); bgArea(G, kx, ky, 'gNight');
  const GX0 = kx + 700, GW = 520, GB = ky + 960, GHt = 760;
  S('path', { id: 'kTop', class: 'draw', d: `M${GX0 - 60} ${GB - GHt} L${GX0 + GW + 60} ${GB - GHt}`, stroke: '#34d399', 'stroke-width': 6, 'stroke-dasharray': '18 12' }, G);
  pill(G, GX0 + GW + 240, GB - GHt, 'new salary', '#052e1f', '#34d399', 'kSal', 32);
  S('path', { d: `M${GX0} ${GB - GHt - 20} L${GX0} ${GB} L${GX0 + GW} ${GB} L${GX0 + GW} ${GB - GHt - 20}`, stroke: '#e2e8f0', 'stroke-width': 10, fill: 'rgba(255,255,255,.04)' }, G);
  const blocks = [['Essentials', '#475569', 260, null, null], ['Bigger place', '#60a5fa', 200, 'apt', 'better apartment'], ['Newer car', '#22d3ee', 160, 'car', 'replace the old car'], ['Takeout', '#fb923c', 140, 'takeout', 'order dinner']];
  let by = GB; const kb = blocks.map(([l, c, h, n], i) => { by -= h; const g = S('g', { id: 'kb' + i }, G); S('rect', { x: GX0 + 12, y: by + 4, width: GW - 24, height: h - 8, rx: 14, fill: c }, g); if (n) ico(g, n, GX0 + 80, by + h / 2, 70, '#f8fafc'); wtext(g, GX0 + GW / 2 + 30, by + h / 2 + 14, l, 38, '#0b1020', 'middle', 800); if (i) { const k = S('g', { id: 'kk' + i }, G); S('circle', { cx: GX0 + GW + 60, cy: by + h / 2, r: 30, fill: '#34d399' }, k); S('path', { d: `M${GX0 + GW + 45} ${by + h / 2} L${GX0 + GW + 57} ${by + h / 2 + 12} L${GX0 + GW + 76} ${by + h / 2 - 12}`, stroke: '#052e1f', 'stroke-width': 6, fill: 'none' }, k); } return g; });
  const raise = S('g', { id: 'kR' }, G); S('path', { d: `M${kx + 300} ${ky + 700} L${kx + 300} ${ky + 380} M${kx + 250} ${ky + 440} L${kx + 300} ${ky + 380} L${kx + 350} ${ky + 440}`, stroke: '#34d399', 'stroke-width': 18, fill: 'none', 'stroke-linecap': 'round' }, raise); wtext(raise, kx + 300, ky + 780, 'raise!', 48, '#34d399');
  pill(G, GX0 + GW / 2, ky + 120, 'every dollar used', '#7f1d1d', '#fecaca', 'kAll', 36);
  mayaBody(G, kx + 1600, ky + 960, .8, 'k');
  beat(() => { const t = go('but essential expenses'); tl.set('#world', { x: 960 - (GX0 + GW / 2) * 1.5, y: 540 - (ky + 620) * 1.5, scale: 1.5 }, t - .1); CAM(t, kx + 960, ky + 540, 1, 1.4, 'power2.out');
    tl.set(['#kSal', '#kAll', '#kR', ...kb.map(e => '#' + e.id), '#kk1', '#kk2', '#kk3'], { autoAlpha: 0 }, 0);
    tl.fromTo('#kb0', { autoAlpha: 0, y: -300 }, { autoAlpha: 1, y: 0, duration: .6, ease: 'bounce.out' }, t + .3); B(t + .3);
    const t2 = W('the raise really'); POP('#kR', t2); DRAW('#kTop', t2 + .3, { d: .6 }); FADE('#kSal', t2 + .6);
    blocks.slice(1).forEach(([, , , , a], i) => { tl.fromTo('#kb' + (i + 1), { autoAlpha: 0, y: -500 }, { autoAlpha: 1, y: 0, duration: .7, ease: 'power3.in' }, W(a)); B(W(a)); });
    POP(['#kk1', '#kk2', '#kk3'], W('each decision makes'), { st: .2 });
    tl.to(['#keL', '#keR'], { scaleY: .45, transformOrigin: '50% 50%', duration: .3 }, W('leaves you exhausted'));
    CAM(W('together they build'), kx + 1040, ky + 560, 1.1, 2.6, 'sine.inOut'); POP('#kAll', W('every dollar of')); tl.to(kb.map(e => '#' + e.id), { x: 6, duration: .06, yoyo: true, repeat: 7 }, W('every dollar of') + .3); });

  // ---------- L: drip vs splash (index 11) ----------
  const [lx, ly] = AO(11); bgArea(G, lx, ly, 'gMint');
  const big = S('g', { id: 'lBig', filter: 'url(#fSh)' }, G); S('rect', { x: lx + 140, y: ly + 330, width: 480, height: 300, rx: 26, fill: '#f87171' }, big); wtext(big, lx + 380, ly + 520, '$1,000', 110, '#450a0a');
  const eyeL = S('g', { id: 'lEye' }, G); ico(eyeL, 'eye', lx + 380, ly + 220, 130, '#f8fafc');
  S('path', { d: `M${lx + 1000} ${ly + 120} L${lx + 1200} ${ly + 120} L${lx + 1200} ${ly + 200}`, stroke: '#94a3b8', 'stroke-width': 40, fill: 'none', 'stroke-linejoin': 'round' }, G); S('rect', { x: lx + 1170, y: ly + 200, width: 60, height: 40, rx: 8, fill: '#64748b' }, G);
  const drops = []; for (let k = 0; k < 6; k++) { const d = S('g', { id: 'ld' + k }, G); S('path', { d: `M${lx + 1200} ${ly + 250} Q${lx + 1225} ${ly + 290} ${lx + 1200} ${ly + 305} Q${lx + 1175} ${ly + 290} ${lx + 1200} ${ly + 250} Z`, fill: '#fbbf24' }, d); wtext(d, lx + 1270, ly + 290, '$150', 30, '#fbbf24', 'start', 700); drops.push(d); }
  S('path', { d: `M${lx + 1020} ${ly + 520} L${lx + 1050} ${ly + 860} L${lx + 1350} ${ly + 860} L${lx + 1380} ${ly + 520}`, stroke: '#e2e8f0', 'stroke-width': 10, fill: 'rgba(255,255,255,.04)' }, G);
  S('rect', { id: 'lFill', x: lx + 1040, y: ly + 540, width: 320, height: 310, rx: 10, fill: '#fbbf24', opacity: .85 }, G);
  const eq = S('g', { id: 'lEq' }, G); wtext(eq, lx + 1200, ly + 950, '$150 × 12 = $1,800 / year', 46, '#fbbf24');
  const cal = S('g', { id: 'lCal' }, G); ico(cal, 'cal', lx + 760, ly + 420, 150, '#93c5fd'); S('path', { d: `M${lx + 680} ${ly + 560} A90 40 0 1 0 ${lx + 840} ${ly + 560}`, stroke: '#93c5fd', 'stroke-width': 7, fill: 'none' }, cal); S('path', { d: `M${lx + 828} ${ly + 540} L${lx + 842} ${ly + 562} L${lx + 818} ${ly + 570}`, stroke: '#93c5fd', 'stroke-width': 7, fill: 'none' }, cal);
  const fut = S('g', { id: 'lFut' }, G); for (let k = 0; k < 4; k++) { S('rect', { x: lx + 1460 + (k % 2) * 210, y: ly + 380 + Math.floor(k / 2) * 180, width: 180, height: 130, rx: 12, fill: '#f8fafc' }, fut); S('rect', { x: lx + 1470 + (k % 2) * 210, y: ly + 425 + Math.floor(k / 2) * 180, width: 160, height: 40, rx: 8, fill: '#dc2626', transform: `rotate(-12 ${lx + 1550 + (k % 2) * 210} ${ly + 445 + Math.floor(k / 2) * 180})` }, fut); wtext(fut, lx + 1550 + (k % 2) * 210, ly + 457 + Math.floor(k / 2) * 180, 'TAKEN', 26, '#fff'); }
  pill(G, lx + 1660, ly + 300, 'future paychecks', '#0f172a', '#e8eefc', 'lFl', 28);
  beat(() => { const t = go('the dangerous purchases'); tl.set('#world', { x: 960 - (lx + 1200) * 1.6, y: 540 - (ly + 400) * 1.6, scale: 1.6 }, t - .1); CAM(t, lx + 960, ly + 540, 1, 1.4, 'power2.out');
    tl.set(['#lBig', '#lEye', '#lFut', '#lFl', '#lEq', '#lCal', ...drops.map(e => '#' + e.id)], { autoAlpha: 0 }, 0); tl.set('#lFill', { scaleY: .02, transformOrigin: '50% 100%' }, 0);
    drops.forEach((d, k) => { tl.fromTo(d, { autoAlpha: 1, y: 0 }, { y: 520, autoAlpha: 0, duration: .9, ease: 'power2.in' }, t + .6 + k * 2.1); tl.to('#lFill', { scaleY: .02 + (k + 1) * .16, duration: .4 }, t + 1.4 + k * 2.1); }); B(t + .6);
    tl.fromTo('#lBig', { autoAlpha: 0, scale: 1.6, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: .4, ease: 'power3.out' }, W('you notice a')); POP('#lEye', W('you notice a') + .4); B(W('you notice a'));
    POP('#lCal', W('recurring payments')); tl.to('#lCal', { rotation: 360, transformOrigin: '50% 50%', duration: 1.2 }, W('stop questioning')); POP('#lEq', W('hundred and fifty'));
    POP('#lFl', W('future income')); tl.fromTo('#lFut', { autoAlpha: 0, x: 120 }, { autoAlpha: 1, x: 0, duration: .6 }, W('future income') + .2); });

  // ---------- M: feed + iceberg (index 12) ----------
  const [mx, my] = AO(12); S('rect', { x: mx, y: my, width: 1920, height: 560, fill: 'url(#gSkyDay)' }, G); S('rect', { x: mx, y: my + 560, width: 1920, height: 520, fill: 'url(#gSea)' }, G);
  S('path', { d: `M${mx + 760} ${my + 560} L${mx + 960} ${my + 400} L${mx + 1160} ${my + 560} Z`, fill: '#f0f9ff' }, G);
  S('path', { id: 'mBerg', d: `M${mx + 700} ${my + 560} L${mx + 1220} ${my + 560} L${mx + 1500} ${my + 820} L${mx + 1300} ${my + 1060} L${mx + 620} ${my + 1060} L${mx + 420} ${my + 800} Z`, fill: 'rgba(186,230,253,.5)' }, G);
  const posts = [['house', 'their house', '#22d3ee', 'someones house'], ['plane', 'business class', '#60a5fa', 'businessclass flight'], ['heart', 'retired at 30', '#f472b6', 'retired at thirty']];
  posts.forEach(([n, l, c], i) => { const g = S('g', { id: 'mp' + i, filter: 'url(#fSh)' }, G); const x = mx + 250 + i * 520; S('rect', { x, y: my + 90, width: 420, height: 250, rx: 22, fill: '#f8fafc' }, g); ico(g, n, x + 110, my + 215, 130, c); wtext(g, x + 300, my + 230, l, 30, '#0f172a', 'middle', 700); S('path', { d: `M${x + 30} ${my + 310} L${x + 60} ${my + 310}`, stroke: '#f43f5e', 'stroke-width': 10, 'stroke-linecap': 'round' }, g); });
  const hid = [['borrowed?', 'borrowed the money'], ['inherited?', 'inherited it'], ['split the cost?', 'split the cost'], ['years of saving?', 'years saving']];
  hid.forEach(([l], i) => pill(G, mx + 760 + (i % 2) * 420, my + 700 + Math.floor(i / 2) * 170, l, '#0c4a6e', '#bae6fd', 'mh' + i, 34));
  const mEye = S('g', { id: 'mEye' }, G); ico(mEye, 'eye', mx + 130, my + 460, 120, '#f8fafc');
  pill(G, mx + 500, my + 260, 'doing well', '#052e1f', '#34d399', 'mGoal', 44);
  pill(G, mx + 960, my + 470, 'only the part they show', '#fbbf24', '#0b1020', 'mOnly', 30);
  beat(() => { const t = go('meanwhile the definition'); tl.set('#world', { x: 960 - (mx + 960) * 1.4, y: 540 - (my + 300) * 1.4, scale: 1.4 }, t - .1); CAM(t, mx + 960, my + 540, 1, 1.4, 'power2.out');
    tl.set([...posts.map((_, i) => '#mp' + i), ...hid.map((_, i) => '#mh' + i), '#mEye', '#mOnly', '#mGoal'], { autoAlpha: 0 }, 0); POP('#mGoal', t + .4); tl.to('#mGoal', { x: 900, duration: 2.4, ease: 'power1.inOut' }, W('keeps moving') - .3); OUT('#mGoal', W('compare your apartment') - .3);
    posts.forEach(([, , , a], i) => tl.fromTo('#mp' + i, { autoAlpha: 0, y: 80 }, { autoAlpha: 1, y: 0, duration: .5, ease: 'back.out(1.6)' }, W(a)));
    POP('#mEye', W('you see what'));
    const t2 = W('you dont see whether'); CAM(t2 - .3, mx + 960, my + 660, 1.3, 1.4); hid.forEach(([, a], i) => POP('#mh' + i, W(a)));
    const t3 = W('youre comparing your entire'); CAM(t3, mx + 960, my + 540, 1, 1.2); POP('#mOnly', W('chose to show')); });

  // ---------- N: relief expected, anxiety stays (index 13) ----------
  const [nx, ny] = AO(13); bgArea(G, nx, ny, 'gNight');
  mayaBody(G, nx + 560, ny + 980, .95, 'v');
  const hopes = [['tag', '#fbbf24', 'checking prices'], ['umbrella', '#fb923c', 'worrying about emergencies'], ['door', '#a78bfa', 'leave a job']];
  hopes.forEach(([n, c], i) => { const g = S('g', { id: 'vh' + i }, G); S('circle', { cx: nx + 300 + i * 260, cy: ny + 200, r: 90, fill: 'rgba(255,255,255,.9)' }, g); ico(g, n, nx + 300 + i * 260, ny + 200, 100, c); });
  const chart = S('g', { id: 'vChart' }, G); S('rect', { x: nx + 1100, y: ny + 200, width: 640, height: 640, rx: 24, fill: 'rgba(255,255,255,.05)', stroke: '#334155', 'stroke-width': 4 }, chart);
  const bars = [100, 180, 280, 400, 520].map((h, i) => S('rect', { id: 'vb' + i, x: nx + 1160 + i * 115, y: ny + 800 - h, width: 80, height: h, rx: 10, fill: '#34d399' }, G));
  wtext(chart, nx + 1420, ny + 900, 'income', 38, '#34d399'); pill(G, nx + 560, ny + 300, '$100k', '#fbbf24', '#78350f', 'vK', 44);
  const cloud = S('g', { id: 'vCl' }, G); S('path', { d: `M${nx + 440} ${ny + 420} Q${nx + 400} ${ny + 420} ${nx + 405} ${ny + 380} Q${nx + 410} ${ny + 345} ${nx + 455} ${ny + 350} Q${nx + 475} ${ny + 300} ${nx + 545} ${ny + 305} Q${nx + 610} ${ny + 305} ${nx + 625} ${ny + 355} Q${nx + 680} ${ny + 355} ${nx + 680} ${ny + 392} Q${nx + 678} ${ny + 422} ${nx + 640} ${ny + 422} Z`, fill: '#64748b' }, cloud);
  for (let k = 0; k < 5; k++) S('path', { class: 'rain', d: `M${nx + 450 + k * 45} ${ny + 440} L${nx + 440 + k * 45} ${ny + 480}`, stroke: '#60a5fa', 'stroke-width': 5 }, cloud);
  pill(G, nx + 560, ny + 80, 'expected: relief', '#052e1f', '#34d399', 'vRel', 34);
  beat(() => { const t = go('and theres another reason'); tl.set('#world', { x: 960 - (nx + 560) * 1.7, y: 540 - (ny + 520) * 1.7, scale: 1.7 }, t - .1); CAM(t, nx + 960, ny + 540, 1, 1.4, 'power2.out');
    POP('#vK', t + .3); tl.to('#vK', { rotation: 18, y: 60, autoAlpha: .45, transformOrigin: '50% 50%', duration: .8, ease: 'power2.in' }, W('feel disappointing')); OUT('#vK', W('buy relief') - .4);
    tl.set(['#vK', '#vRel', '#vCl', '#vChart', ...hopes.map((_, i) => '#vh' + i), ...bars.map(b => '#' + b.id)], { autoAlpha: 0 }, 0);
    POP('#vRel', W('buy relief')); hopes.forEach(([, , a], i) => tl.fromTo('#vh' + i, { autoAlpha: 0, scale: .3, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: .45, ease: 'back.out(1.8)' }, W(a)));
    FADE('#vChart', W('stop checking prices'));
    const t2 = W('instead the numbers'); bars.forEach((b, i) => tl.fromTo(b, { autoAlpha: 0, scaleY: 0, transformOrigin: '50% 100%' }, { autoAlpha: 1, scaleY: 1, duration: .45, ease: 'power2.out' }, t2 + i * .2)); B(t2);
    tl.to(hopes.map((_, i) => '#vh' + i), { autoAlpha: 0, scale: .2, duration: .4, stagger: .1 }, W('the anxiety stayed'));
    tl.fromTo('#vCl', { autoAlpha: 0, y: -60 }, { autoAlpha: 1, y: 0, duration: .5 }, W('the anxiety stayed')); B(W('the anxiety stayed'));
    tl.to(['#vbL'], { rotation: 14, transformOrigin: '100% 50%', duration: .4 }, W('the anxiety stayed')); tl.to(['#vbR'], { rotation: -14, transformOrigin: '0% 50%', duration: .4 }, W('the anxiety stayed')); tl.to('#vmS', { opacity: 0, duration: .3 }, W('the anxiety stayed')); tl.to('#vmW', { opacity: 1, duration: .3 }, W('the anxiety stayed'));
    tl.fromTo(s.querySelectorAll('.rain'), { y: 0 }, { y: 30, duration: .4, repeat: 4, stagger: .08, ease: 'none' }, W('the anxiety stayed') + .4); });

  // ---------- O: safety net vs tightrope (index 14) ----------
  const [ox, oy] = AO(14); bgArea(G, ox, oy, 'gDusk');
  S('rect', { x: ox, y: oy + 760, width: 900, height: 320, fill: '#14532d' }, G); S('path', { d: `M${ox + 900} ${oy + 760} L${ox + 1920} ${oy + 760} L${ox + 1920} ${oy + 1080} L${ox + 900} ${oy + 1080} Z`, fill: 'url(#gCanyon)' }, G);
  S('rect', { x: ox + 1820, y: oy + 760, width: 100, height: 320, fill: '#14532d' }, G);
  houseG(G, ox + 330, oy + 760, .9, '#fcd34d', 'oH1'); carG(G, ox + 640, oy + 765, .45, '#22d3ee', 'oC1');
  const oR = S('g', { id: 'oRight' }, G); houseG(oR, ox + 1250, oy + 700, .9, '#fcd34d', 'oH2'); carG(oR, ox + 1560, oy + 705, .45, '#22d3ee', 'oC2'); S('rect', { x: ox + 1050, y: oy + 700, width: 680, height: 16, rx: 6, fill: '#78350f' }, oR);
  S('path', { id: 'oRope', class: 'draw', d: `M${ox + 900} ${oy + 760} L${ox + 1820} ${oy + 760}`, stroke: '#e5e7eb', 'stroke-width': 6, 'stroke-dasharray': '0' }, G);
  S('path', { id: 'oNet', class: 'draw', d: `M${ox + 80} ${oy + 830} Q${ox + 450} ${oy + 960} ${ox + 820} ${oy + 830}`, stroke: '#34d399', 'stroke-width': 12, fill: 'none', 'stroke-dasharray': '0' }, G);
  pill(G, ox + 450, oy + 1010, 'room for things to go wrong', '#052e1f', '#86efac', 'oL1', 30); pill(G, ox + 1400, oy + 1010, 'needs everything right', '#450a0a', '#fecaca', 'oL2', 30);
  const eqO = S('g', { id: 'oEq' }, G); S('rect', { x: ox + 860, y: oy + 330, width: 120, height: 22, rx: 11, fill: '#f8fafc' }, eqO); S('rect', { x: ox + 860, y: oy + 380, width: 120, height: 22, rx: 11, fill: '#f8fafc' }, eqO);
  const bills2 = [0, 1].map(i => { const g = S('g', { id: 'ob' + i, filter: 'url(#fSh)' }, G); S('rect', { x: ox + [380, 1300][i], y: oy + 60, width: 180, height: 120, rx: 10, fill: '#f8fafc' }, g); wtext(g, ox + [470, 1390][i], oy + 135, 'BILL', 40, '#dc2626'); return g; });
  beat(() => { const t = go('because a comfortablelooking'); tl.set('#world', { x: 960 - (ox + 960) * 1.4, y: 540 - (oy + 640) * 1.4, scale: 1.4 }, t - .1); CAM(t, ox + 960, oy + 560, 1, 1.4, 'power2.out');
    tl.set(['#oL1', '#oL2', '#ob0', '#ob1', '#oEq'], { autoAlpha: 0 }, 0); POP('#oEq', W('look identical')); OUT('#oEq', W('one has room') - .3);
    PULSE(['#oH1', '#oH2'], W('look identical'), { s: 1.05 }); PULSE(['#oC1', '#oC2'], W('both can have'), { s: 1.08 }); CAM(W('both can have'), ox + 960, oy + 600, 1.08, 2.4, 'sine.inOut'); CAM(W('an unexpected bill') - .4, ox + 960, oy + 540, 1, .8);
    DRAW('#oNet', W('one has room'), { d: .7 }); POP('#oL1', W('one has room') + .4);
    DRAW('#oRope', W('the other needs'), { d: .7 }); POP('#oL2', W('the other needs') + .4); tl.to('#oRight', { rotation: 1.2, transformOrigin: '50% 100%', duration: .6, yoyo: true, repeat: 3, ease: 'sine.inOut' }, W('the other needs') + .5);
    const t2 = W('an unexpected bill'); tl.fromTo(['#ob0', '#ob1'], { autoAlpha: 0, y: -100 }, { autoAlpha: 1, y: 430, duration: .8, ease: 'power2.in' }, t2); B(t2);
    tl.to('#oH1', { y: 12, duration: .2, yoyo: true, repeat: 1 }, t2 + .8); tl.to('#oRight', { rotation: -4, transformOrigin: '50% 100%', duration: .15, yoyo: true, repeat: 5 }, t2 + .8); tl.fromTo('#vig', { autoAlpha: 0 }, { autoAlpha: .8, duration: .2, yoyo: true, repeat: 1 }, t2 + .8); });

  // ---------- P: balloon with sandbags (index 15) ----------
  const [px, py] = AO(15); bgArea(G, px, py, 'gSkyDay');
  for (let k = 0; k < 5; k++) S('ellipse', { cx: px + 200 + k * 380, cy: py + 150 + (k % 2) * 80, rx: 120, ry: 40, fill: 'rgba(255,255,255,.35)' }, G);
  S('rect', { x: px, y: py + 960, width: 1920, height: 120, fill: '#166534' }, G);
  const balO = S('g', { transform: `translate(${px + 960},${py + 420}) scale(.8) translate(${-(px + 960)},${-(py + 500)})` }, G); const bal = S('g', { id: 'bal' }, balO);
  S('ellipse', { cx: px + 960, cy: py + 330, rx: 220, ry: 260, fill: 'url(#gBalloon)' }, bal); S('path', { d: `M${px + 960} ${py + 70} Q${px + 860} ${py + 330} ${px + 960} ${py + 590} M${px + 960} ${py + 70} Q${px + 1060} ${py + 330} ${px + 960} ${py + 590}`, stroke: '#c2410c', 'stroke-width': 6, fill: 'none' }, bal);
  wtext(bal, px + 960, py + 360, '$100k', 90, '#7c2d12');
  S('path', { d: `M${px + 800} ${py + 520} L${px + 900} ${py + 680} M${px + 1120} ${py + 520} L${px + 1020} ${py + 680}`, stroke: '#78350f', 'stroke-width': 4 }, bal);
  S('rect', { x: px + 890, y: py + 680, width: 140, height: 90, rx: 10, fill: '#92400e' }, bal);
  const bags = [['debt', '#a78bfa'], ['location', '#22d3ee'], ['family', '#f472b6'], ['commitments', '#fb923c']].map(([l, c], i) => { const g = S('g', { id: 'sb' + i }, bal); const x = px + 720 + i * 150; S('path', { d: `M${px + 960} ${py + 770} L${x + 30} ${py + 830}`, stroke: '#78350f', 'stroke-width': 3 }, g); S('path', { d: `M${x} ${py + 830} Q${x + 30} ${py + 815} ${x + 60} ${py + 830} L${x + 66} ${py + 900} Q${x + 30} ${py + 915} ${x - 6} ${py + 900} Z`, fill: c }, g); wtext(g, x + 30, py + 955 + (i % 2) * 38, l, 30, '#f8fafc', 'middle', 800); return g; });
  const tick = S('g', { id: 'tick' }, G); S('path', { d: `M${px + 1350} ${py + 240} L${px + 1720} ${py + 240} L${px + 1720} ${py + 300} Q${px + 1700} ${py + 320} ${px + 1720} ${py + 340} L${px + 1720} ${py + 400} L${px + 1350} ${py + 400} L${px + 1350} ${py + 340} Q${px + 1370} ${py + 320} ${px + 1350} ${py + 300} Z`, fill: '#fbbf24' }, tick); wtext(tick, px + 1535, py + 338, 'TICKET TO WEALTH', 30, '#78350f');
  const tX = XM(G, px + 1535, py + 320, 90, 'tX');
  pill(G, px + 300, py + 400, 'meaningful', '#052e1f', '#34d399', 'pM', 34); pill(G, px + 300, py + 500, 'a big step up', '#052e1f', '#34d399', 'pU', 34);
  pill(G, px + 960, py + 1030, 'freedom = how high it can go', '#0f172a', '#fbbf24', 'pF', 32);
  beat(() => { const t = go('a hundred thousand dollars is a meaningful'); tl.set('#world', { x: 960 - (px + 960) * 1.5, y: 540 - (py + 600) * 1.5, scale: 1.5 }, t - .1); CAM(t, px + 960, py + 540, 1, 1.4, 'power2.out');
    tl.set(['#pM', '#pU', '#pF', '#tick', '#tX', ...bags.map(b => '#' + b.id)], { autoAlpha: 0 }, 0); tl.set('#bal', { y: 160 }, 0);
    tl.to('#bal', { y: -40, duration: 3, ease: 'power2.out' }, t); B(t); POP('#pM', W('meaningful income')); POP('#pU', W('major improvement'));
    POP('#tick', W('universal ticket') - .3); POP('#tX', W('universal ticket') + .3); tl.to('#tick', { rotation: 8, transformOrigin: '50% 50%', autoAlpha: .4, duration: .5 }, W('universal ticket') + .6);
    [['debt', 0], ['location', 1], ['family responsibilities', 2], ['spending commitments', 3]].forEach(([a, i]) => { tl.fromTo('#sb' + i, { autoAlpha: 0, y: -40 }, { autoAlpha: 1, y: 0, duration: .4, ease: 'back.out(1.6)' }, W(a)); tl.to('#bal', { y: -40 + (i + 1) * 45, duration: .5, ease: 'power2.out' }, W(a) + .2); B(W(a)); });
    POP('#pF', W('how much freedom')); });

  // ---------- Q: ending — paycheck dominoes + room (index 16) ----------
  const [qx, qy] = AO(16); bgArea(G, qx, qy, 'gWall');
  S('rect', { x: qx, y: qy + 820, width: 1920, height: 260, fill: 'url(#gFloor)' }, G); S('circle', { cx: qx + 1700, cy: qy + 300, r: 260, fill: 'url(#gLamp)' }, G);
  mayaBody(G, qx + 330, qy + 900, .85, 'q');
  const bub = S('g', { id: 'qBub', filter: 'url(#fSh)' }, G); S('rect', { x: qx + 420, y: qy + 220, width: 640, height: 150, rx: 75, fill: '#f8fafc' }, bub); S('path', { d: `M${qx + 470} ${qy + 360} L${qx + 430} ${qy + 430} L${qx + 520} ${qy + 365} Z`, fill: '#f8fafc' }, bub); wtext(bub, qx + 740, qy + 315, '"six figures... still broke"', 40, '#0f172a', 'middle', 700);
  const doms = []; for (let k = 0; k < 8; k++) { const o = S('g', {}, G); const d = S('g', { id: 'dm' + k }, o); S('rect', { x: qx + 760 + k * 130, y: qy + 560, width: 60, height: 260, rx: 10, fill: k === 2 ? '#f87171' : '#34d399' }, d); S('rect', { x: qx + 768 + k * 130, y: qy + 600, width: 44, height: 70, rx: 6, fill: 'rgba(255,255,255,.35)' }, d); doms.push(d); }
  pill(G, qx + 1220, qy + 460, 'paychecks', '#0f172a', '#e8eefc', 'qP', 32);
  const cush = S('g', { id: 'qCush' }, G); S('rect', { x: qx + 920, y: qy + 760, width: 260, height: 70, rx: 30, fill: '#fbbf24' }, cush); wtext(cush, qx + 1050, qy + 808, 'ROOM', 36, '#78350f');
  pill(G, qx + 1150, qy + 600, 'how much do you earn?', '#0f172a', '#e8eefc', 'qEarn', 36);
  pill(G, qx + 1220, qy + 150, 'the real luxury: room', '#052e1f', '#34d399', 'qLux', 44);
  beat(() => { const t = go('so when someone says'); tl.set('#world', { x: 960 - (qx + 500) * 1.7, y: 540 - (qy + 500) * 1.7, scale: 1.7 }, t - .1); CAM(t, qx + 790, qy + 520, 1.25, 1.6, 'power2.out');
    POP('#qEarn', W('how much do you earn')); tl.to('#qEarn', { autoAlpha: .35, duration: .4 }, W('how much of your life') - .6); OUT('#qEarn', W('how much of your life') - .2);
    tl.set(['#qEarn', '#qBub', '#qP', '#qCush', '#qLux', ...doms.map(d => '#' + d.id)], { autoAlpha: 0 }, 0);
    POP('#qBub', W('i make six figures')); tl.to(['#qbL'], { rotation: 14, transformOrigin: '100% 50%', duration: .4 }, W('still feel broke')); tl.to(['#qbR'], { rotation: -14, transformOrigin: '0% 50%', duration: .4 }, W('still feel broke')); tl.to('#qmS', { opacity: 0, duration: .3 }, W('still feel broke')); tl.to('#qmW', { opacity: 1, duration: .3 }, W('still feel broke'));
    const t2 = W('how much of your life'); CAM(t2 - .3, qx + 1040, qy + 560, 1.1, 1.2); OUT('#qBub', t2 - .3); tl.fromTo(doms, { autoAlpha: 0, y: -80 }, { autoAlpha: 1, y: 0, duration: .35, stagger: .12, ease: 'back.out(1.5)' }, t2); FADE('#qP', t2 + .6); B(t2);
    const t3 = W('the real luxury'); tl.to('#dm2', { y: 160, rotation: 20, autoAlpha: 0, transformOrigin: '50% 50%', duration: .7, ease: 'power2.in' }, t3); tl.to(['#dm3', '#dm4'], { rotation: -5, transformOrigin: '50% 100%', duration: .25, yoyo: true, repeat: 3 }, t3 + .4); B(t3);
    POP('#qCush', W('having enough room')); PULSE(doms.filter((_, k) => k !== 2), W('one missed paycheck'), { s: 1.04 });
    tl.to('#qbL', { rotation: 0, duration: .4 }, W('bring everything')); tl.to('#qbR', { rotation: 0, duration: .4 }, W('bring everything')); tl.to('#qmW', { opacity: 0, duration: .3 }, W('bring everything')); tl.to('#qmS', { opacity: 1, duration: .3 }, W('bring everything'));
    POP('#qLux', W('bring everything') - .4); CAM(W('bring everything'), qx + 960, qy + 520, 1, 1.6, 'power2.inOut'); });

  beat(() => { [['e', [53.2, 57.4, 61.6]], ['k', [174.2, 179.6, 183.4, 192.4]], ['v', [237.2, 242.2, 247.4, 253]], ['q', [288.4, 294.2, 301.2]]].forEach(([p, ts]) => ts.forEach(t => tl.to(['#' + p + 'eL', '#' + p + 'eR'], { scaleY: .1, transformOrigin: '50% 50%', duration: .08, yoyo: true, repeat: 1 }, t)));
    tl.to('#eB', { y: -6, duration: 1.6, yoyo: true, repeat: 5, ease: 'sine.inOut' }, 52); tl.to('#vB', { y: -6, duration: 1.6, yoyo: true, repeat: 5, ease: 'sine.inOut' }, 236); tl.to('#qB', { y: -6, duration: 1.5, yoyo: true, repeat: 5, ease: 'sine.inOut' }, 286); });
  return () => B_.forEach(f => f());
}
// section-relative phrase timing
let ST = 0;
const go = p => { const t = findp(p, ST - .06); if (t !== null) ST = t; return ST; };
const W = p => { const t = findp(p, ST - .06); return t === null ? ST : t; };
const CAM = (t, cx, cy, z, d = 1.3, e = 'power3.inOut') => { tl.to('#world', { x: 960 - cx * z, y: 540 - cy * z, scale: z, duration: d, ease: e }, t); B(t); };

// ===== PREMIUM TEST: one continuous illustrated world + camera =====
const C = { skin: '#f2c29b', skinSh: '#d9a07a', hair: '#2b1a12', blazer: '#14b8a6', blazerSh: '#0f8f83', pants: '#1f2a44', shoe: '#0b1222', green: '#34d399', gold: '#fbbf24', red: '#f87171', ink: '#e8eefc' };
function grad(defs, id, stops, x2 = 0, y2 = 1) { const g = S('linearGradient', { id, x1: 0, y1: 0, x2, y2 }, defs); stops.forEach(([o, c, a]) => S('stop', { offset: o, 'stop-color': c, 'stop-opacity': a ?? 1 }, g)); }
function rgrad(defs, id, c, a = .6) { const g = S('radialGradient', { id }, defs); S('stop', { offset: 0, 'stop-color': c, 'stop-opacity': a }, g); S('stop', { offset: 1, 'stop-color': c, 'stop-opacity': 0 }, g); }
// Maya's head (reused). cx,cy = head centre
function mayaHead(g, cx, cy, p) {
  S('path', { d: `M${cx - 80} ${cy + 10} Q${cx - 92} ${cy - 105} ${cx} ${cy - 98} Q${cx + 92} ${cy - 105} ${cx + 80} ${cy + 10} L${cx + 82} ${cy + 70} Q${cx + 60} ${cy + 40} ${cx + 62} ${cy} L${cx - 62} ${cy} Q${cx - 60} ${cy + 40} ${cx - 82} ${cy + 70} Z`, fill: C.hair }, g);
  S('rect', { x: cx - 18, y: cy + 55, width: 36, height: 40, fill: C.skinSh }, g);
  S('ellipse', { cx, cy, rx: 66, ry: 74, fill: C.skin }, g);
  S('path', { d: `M${cx - 68} ${cy - 10} Q${cx - 60} ${cy - 80} ${cx} ${cy - 78} Q${cx + 50} ${cy - 76} ${cx + 70} ${cy - 20} Q${cx + 20} ${cy - 50} ${cx - 20} ${cy - 40} Q${cx - 50} ${cy - 30} ${cx - 68} ${cy - 10} Z`, fill: C.hair }, g);
  S('circle', { cx: cx - 40, cy: cy + 22, r: 12, fill: '#f472b6', opacity: .25 }, g); S('circle', { cx: cx + 40, cy: cy + 22, r: 12, fill: '#f472b6', opacity: .25 }, g);
  const eL = S('g', { id: p + 'eL' }, g); S('ellipse', { cx: cx - 24, cy: cy + 2, rx: 7, ry: 10, fill: '#1e293b' }, eL); S('circle', { cx: cx - 22, cy: cy - 1, r: 2.5, fill: '#fff' }, eL);
  const eR = S('g', { id: p + 'eR' }, g); S('ellipse', { cx: cx + 24, cy: cy + 2, rx: 7, ry: 10, fill: '#1e293b' }, eR); S('circle', { cx: cx + 26, cy: cy - 1, r: 2.5, fill: '#fff' }, eR);
  S('path', { id: p + 'bL', d: `M${cx - 38} ${cy - 20} Q${cx - 24} ${cy - 28} ${cx - 10} ${cy - 20}`, stroke: C.hair, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, g);
  S('path', { id: p + 'bR', d: `M${cx + 10} ${cy - 20} Q${cx + 24} ${cy - 28} ${cx + 38} ${cy - 20}`, stroke: C.hair, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, g);
  S('path', { id: p + 'mS', d: `M${cx - 18} ${cy + 32} Q${cx} ${cy + 48} ${cx + 18} ${cy + 32}`, stroke: '#9a3412', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, g);
  S('path', { id: p + 'mW', d: `M${cx - 16} ${cy + 42} Q${cx} ${cy + 30} ${cx + 16} ${cy + 42}`, stroke: '#9a3412', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round', opacity: 0 }, g);
}
function coin(g, x, y, r, id) { const c = S('g', id ? { id } : {}, g); S('circle', { cx: x, cy: y + r * .12, r, fill: '#b45309' }, c); S('circle', { cx: x, cy: y, r, fill: C.gold }, c); S('circle', { cx: x, cy: y, r: r * .72, fill: 'none', stroke: '#f59e0b', 'stroke-width': r * .1 }, c); const t = S('text', { x, y: y + r * .36, 'text-anchor': 'middle', 'font-size': r * 1.05, 'font-weight': 800, fill: '#92400e', 'font-family': 'Poppins' }, c); t.textContent = '$'; return c; }
function wtext(g, x, y, txt, size, fill, anchor = 'middle', weight = 800, id) { const t = S('text', Object.assign({ x, y, 'text-anchor': anchor, 'font-size': size, 'font-weight': weight, fill, 'font-family': 'Poppins' }, id ? { id } : {}), g); t.textContent = txt; return t; }

const VIDEO = { theme: 'green', scenes: [ { type: 'custom', build: (s) => {
  const world = H('div', 'a', 'left:0;top:0;width:1920px;height:1080px', null, s, 'world');
  const sv = S('svg', { width: 9600, height: 7000, viewBox: '0 0 9600 7000', style: 'position:absolute;left:0;top:0;overflow:visible' }, world);
  const defs = S('defs', {}, sv);
  grad(defs, 'gWall', [[0, '#1f2a4d'], [1, '#141b33']]); grad(defs, 'gFloor', [[0, '#1a2138'], [1, '#0c1120']]);
  grad(defs, 'gSunset', [[0, '#fb923c'], [.5, '#f472b6'], [1, '#4c1d95']]); grad(defs, 'gNight', [[0, '#0b1026'], [1, '#1e1b4b']]);
  grad(defs, 'gDusk', [[0, '#312e81'], [.6, '#9d174d'], [1, '#f97316']]); grad(defs, 'gStage', [[0, '#0a0f1f'], [1, '#111827']]);
  grad(defs, 'gCheck', [[0, '#f8fafc'], [1, '#e2e8f0']]); grad(defs, 'gSpot', [[0, '#fde68a', .55], [1, '#fde68a', 0]]);
  rgrad(defs, 'gLamp', '#fcd34d', .45); rgrad(defs, 'gGlow', '#34d399', .5); rgrad(defs, 'gScreen', '#60a5fa', .5); rgrad(defs, 'gRed', '#ef4444', .55);
  const sh = S('filter', { id: 'fSh', x: '-20%', y: '-20%', width: '140%', height: '140%' }, defs); S('feDropShadow', { dx: 0, dy: 14, stdDeviation: 14, 'flood-color': '#000', 'flood-opacity': .45 }, sh);

  // ---------------- AREA A: living room (0..1920, 0..1080) ----------------
  const A = S('g', {}, sv);
  S('rect', { x: 0, y: 0, width: 1920, height: 820, fill: 'url(#gWall)' }, A);
  S('rect', { x: 0, y: 820, width: 1920, height: 260, fill: 'url(#gFloor)' }, A);
  for (let k = 0; k < 12; k++) S('path', { d: `M${k * 170} 820 L${k * 170 - 120} 1080`, stroke: 'rgba(255,255,255,.04)', 'stroke-width': 3 }, A);
  // window with city at sunset
  S('rect', { x: 1340, y: 150, width: 440, height: 400, rx: 16, fill: 'url(#gSunset)' }, A);
  for (let k = 0; k < 9; k++) { const h = 60 + ((k * 53) % 140); S('rect', { x: 1350 + k * 48, y: 550 - h, width: 40, height: h, fill: '#1e1b4b', opacity: .85 }, A); }
  S('rect', { x: 1340, y: 150, width: 440, height: 400, rx: 16, fill: 'none', stroke: '#e2e8f0', 'stroke-width': 14 }, A);
  S('path', { d: 'M1560 150 L1560 550 M1340 350 L1780 350', stroke: '#e2e8f0', 'stroke-width': 8 }, A);
  S('path', { d: 'M1300 120 Q1330 360 1290 600 L1340 600 L1340 120 Z', fill: '#be185d', opacity: .8 }, A);
  // lamp
  S('circle', { cx: 260, cy: 330, r: 260, fill: 'url(#gLamp)' }, A);
  S('path', { d: 'M180 260 L340 260 L300 180 L220 180 Z', fill: '#fcd34d' }, A); S('rect', { x: 254, y: 260, width: 12, height: 560, fill: '#94a3b8' }, A); S('ellipse', { cx: 260, cy: 822, rx: 70, ry: 14, fill: '#94a3b8' }, A);
  // parents photo frame
  const PF = S('g', { id: 'pf', filter: 'url(#fSh)' }, A);
  S('rect', { x: 420, y: 230, width: 330, height: 260, rx: 10, fill: '#d6a85b' }, PF); S('rect', { x: 440, y: 250, width: 290, height: 220, fill: '#fde7c7' }, PF);
  [[520, '#7c3aed'], [650, '#db2777']].forEach(([x, c]) => { S('circle', { cx: x, cy: 345, r: 34, fill: C.skin }, PF); S('path', { d: `M${x - 34} 330 Q${x} 290 ${x + 34} 330 Q${x + 30} 305 ${x} 302 Q${x - 30} 305 ${x - 34} 330 Z`, fill: x < 600 ? '#94a3b8' : '#4b5563' }, PF); S('path', { d: `M${x - 60} 470 Q${x - 60} 390 ${x} 390 Q${x + 60} 390 ${x + 60} 470 Z`, fill: c }, PF); S('path', { d: `M${x - 12} 352 Q${x} 362 ${x + 12} 352`, stroke: '#7c2d12', 'stroke-width': 3, fill: 'none' }, PF); });
  const hearts = []; for (let k = 0; k < 4; k++) { const hx = 470 + k * 80, hy = 210; hearts.push(S('path', { class: 'pheart', d: `M${hx} ${hy + 18} L${hx - 18} ${hy} Q${hx - 26} ${hy - 12} ${hx - 14} ${hy - 20} Q${hx - 4} ${hy - 24} ${hx} ${hy - 12} Q${hx + 4} ${hy - 24} ${hx + 14} ${hy - 20} Q${hx + 26} ${hy - 12} ${hx + 18} ${hy} Z`, fill: '#f472b6' }, A)); }
  // plant
  S('path', { d: 'M1820 820 L1800 740 L1880 740 L1860 820 Z', fill: '#b45309' }, A);
  for (let k = 0; k < 5; k++) S('ellipse', { cx: 1840 + (k - 2) * 18, cy: 690 - Math.abs(k - 2) * 10, rx: 16, ry: 50, fill: '#15803d', transform: `rotate(${(k - 2) * 18} ${1840 + (k - 2) * 18} 700)` }, A);
  // big paycheck
  const ckO = S('g', { transform: 'translate(960,250) rotate(-4)' }, A); const ck = S('g', { id: 'ck', filter: 'url(#fSh)' }, ckO);
  S('rect', { x: -380, y: -120, width: 760, height: 240, rx: 18, fill: 'url(#gCheck)' }, ck);
  S('rect', { x: -380, y: -120, width: 760, height: 46, rx: 18, fill: C.green }, ck); wtext(ck, -350, -86, 'PAYCHECK', 26, '#064e3b', 'start', 800);
  wtext(ck, -350, -20, 'Pay to the order of', 22, '#64748b', 'start', 500); wtext(ck, -350, 20, 'Maya', 40, '#0f172a', 'start', 700);
  wtext(ck, 350, 50, '$100,000.00', 76, '#047857', 'end', 800);
  S('path', { d: 'M80 95 q20 -30 40 0 t40 0 t40 -10 t40 5', stroke: '#1e293b', 'stroke-width': 3, fill: 'none' }, ck); S('path', { d: 'M60 104 L340 104', stroke: '#94a3b8', 'stroke-width': 2 }, ck);
  const conf = []; const cc = ['#34d399', '#fbbf24', '#f472b6', '#60a5fa', '#a78bfa'];
  for (let k = 0; k < 46; k++) conf.push(S('rect', { class: 'conf', x: 560 + (k * 97) % 820, y: 40 + (k * 41) % 120, width: 14, height: 24, rx: 3, fill: cc[k % 5], transform: `rotate(${(k * 37) % 180} ${560 + (k * 97) % 820} ${40 + (k * 41) % 120})` }, A));
  // friends chat bubbles (by the window)
  const fb = [[1390, 640, 'rich!!', '#22d3ee'], [1560, 720, 'big money!', '#fb923c'], [1420, 800, 'treat us!', '#a78bfa']];
  fb.forEach(([x, y, t, c], i) => { const g = S('g', { id: 'fb' + i, filter: 'url(#fSh)' }, A); S('circle', { cx: x, cy: y, r: 30, fill: c }, g); S('rect', { x: x + 42, y: y - 32, width: t.length * 22 + 50, height: 64, rx: 32, fill: '#f8fafc' }, g); wtext(g, x + 67, y + 12, t, 32, '#0f172a', 'start', 700); });
  // Maya (standing) at (960, 900)
  const mO = S('g', { transform: 'translate(0,0)' }, A); const M = S('g', { id: 'maya' }, mO);
  S('ellipse', { cx: 960, cy: 905, rx: 120, ry: 20, fill: 'rgba(0,0,0,.35)' }, M);
  S('rect', { x: 908, y: 680, width: 44, height: 220, rx: 20, fill: C.pants }, M); S('rect', { x: 968, y: 680, width: 44, height: 220, rx: 20, fill: C.pants }, M);
  S('ellipse', { cx: 925, cy: 900, rx: 38, ry: 15, fill: C.shoe }, M); S('ellipse', { cx: 995, cy: 900, rx: 38, ry: 15, fill: C.shoe }, M);
  S('path', { d: 'M862 700 Q855 490 960 478 Q1065 490 1058 700 Z', fill: C.blazer }, M);
  S('path', { d: 'M930 484 L960 560 L990 484 Z', fill: '#f8fafc' }, M); S('path', { d: 'M960 560 L960 700', stroke: C.blazerSh, 'stroke-width': 4 }, M);
  S('path', { d: 'M868 510 Q830 600 850 690', stroke: C.blazer, 'stroke-width': 40, fill: 'none', 'stroke-linecap': 'round' }, M); S('circle', { cx: 852, cy: 700, r: 20, fill: C.skin }, M);
  const armO = S('g', {}, M); const arm = S('g', { id: 'armR' }, armO);
  S('path', { d: 'M1052 510 Q1095 580 1070 630', stroke: C.blazer, 'stroke-width': 40, fill: 'none', 'stroke-linecap': 'round' }, arm);
  S('rect', { x: 1040, y: 560, width: 50, height: 90, rx: 10, fill: '#0f172a', stroke: '#94a3b8', 'stroke-width': 4 }, arm); S('rect', { x: 1047, y: 568, width: 36, height: 72, rx: 5, fill: '#60a5fa', id: 'phS', opacity: .2 }, arm);
  S('circle', { cx: 1066, cy: 638, r: 20, fill: C.skin }, arm);
  mayaHead(M, 960, 395, 'm');

  // ---------------- AREA B: night desk (2400..4320) ----------------
  const Bx = 2400, Bg = S('g', {}, sv);
  S('rect', { x: Bx, y: 0, width: 1920, height: 1080, fill: 'url(#gNight)' }, Bg);
  S('rect', { x: Bx + 120, y: 140, width: 360, height: 320, rx: 14, fill: '#0b1026', stroke: '#334155', 'stroke-width': 12 }, Bg); S('circle', { cx: Bx + 380, cy: 230, r: 44, fill: '#fef3c7' }, Bg); S('circle', { cx: Bx + 400, cy: 218, r: 40, fill: '#0b1026' }, Bg);
  for (let k = 0; k < 14; k++) S('circle', { cx: Bx + 150 + (k * 71) % 300, cy: 170 + (k * 43) % 260, r: 2.5, fill: '#e2e8f0' }, Bg);
  S('circle', { cx: Bx + 560, cy: 640, r: 220, fill: 'url(#gLamp)' }, Bg); S('path', { d: `M${Bx + 520} 600 L${Bx + 610} 600 L${Bx + 590} 540 L${Bx + 540} 540 Z`, fill: '#fcd34d' }, Bg); S('path', { d: `M${Bx + 565} 600 L${Bx + 590} 700`, stroke: '#94a3b8', 'stroke-width': 8 }, Bg);
  mayaHead(Bg, Bx + 960, 470, 'n'); S('path', { d: `M${Bx + 860} 700 Q${Bx + 860} 560 ${Bx + 960} 556 Q${Bx + 1060} 560 ${Bx + 1060} 700 Z`, fill: C.blazer }, Bg);
  S('rect', { x: Bx + 300, y: 700, width: 1320, height: 40, rx: 8, fill: '#3f2d24' }, Bg); S('rect', { x: Bx + 360, y: 740, width: 30, height: 340, fill: '#2a1f19' }, Bg); S('rect', { x: Bx + 1530, y: 740, width: 30, height: 340, fill: '#2a1f19' }, Bg);
  S('ellipse', { cx: Bx + 960, cy: 600, rx: 260, ry: 140, fill: 'url(#gScreen)' }, Bg);
  S('path', { d: `M${Bx + 780} 700 L${Bx + 800} 560 L${Bx + 1120} 560 L${Bx + 1140} 700 Z`, fill: '#475569' }, Bg); S('circle', { cx: Bx + 960, cy: 630, r: 14, fill: '#cbd5e1' }, Bg);
  // thought bubbles: earn (coins) vs worry (storm)
  const tL = S('g', { id: 'tL' }, Bg); S('circle', { cx: Bx + 560, cy: 260, r: 150, fill: '#f8fafc', opacity: .95 }, tL); [0, 1, 2, 3, 4].forEach(k => coin(tL, Bx + 560, 330 - k * 34, 46)); S('circle', { cx: Bx + 720, cy: 420, r: 22, fill: '#f8fafc' }, tL); S('circle', { cx: Bx + 790, cy: 470, r: 12, fill: '#f8fafc' }, tL);
  const tR = S('g', { id: 'tR' }, Bg); S('circle', { cx: Bx + 1380, cy: 260, r: 150, fill: '#334155', opacity: .95 }, tR);
  S('path', { d: `M${Bx + 1300} 290 Q${Bx + 1270} 290 ${Bx + 1275} 260 Q${Bx + 1280} 230 ${Bx + 1315} 235 Q${Bx + 1330} 195 ${Bx + 1380} 200 Q${Bx + 1430} 200 ${Bx + 1440} 240 Q${Bx + 1480} 240 ${Bx + 1480} 270 Q${Bx + 1478} 292 ${Bx + 1450} 292 Z`, fill: '#94a3b8' }, tR);
  S('path', { d: `M${Bx + 1370} 300 L${Bx + 1350} 345 L${Bx + 1378} 345 L${Bx + 1360} 390`, stroke: C.gold, 'stroke-width': 7, fill: 'none' }, tR);
  for (let k = 0; k < 4; k++) S('path', { d: `M${Bx + 1300 + k * 40} 310 L${Bx + 1290 + k * 40} 340`, stroke: '#60a5fa', 'stroke-width': 5 }, tR);
  S('circle', { cx: Bx + 1200, cy: 420, r: 22, fill: '#334155' }, tR); S('circle', { cx: Bx + 1130, cy: 470, r: 12, fill: '#334155' }, tR);

  // ---------------- AREA C: road at dusk (4800..6720) ----------------
  const Cx = 4800, Cg = S('g', {}, sv);
  S('rect', { x: Cx, y: 0, width: 1920, height: 1080, fill: 'url(#gDusk)' }, Cg);
  S('path', { d: `M${Cx} 700 Q${Cx + 400} 560 ${Cx + 800} 680 Q${Cx + 1250} 580 ${Cx + 1920} 690 L${Cx + 1920} 760 L${Cx} 760 Z`, fill: '#3b0764', opacity: .8 }, Cg);
  S('rect', { x: Cx, y: 760, width: 1920, height: 200, fill: '#1f2937' }, Cg); S('rect', { x: Cx, y: 960, width: 1920, height: 120, fill: '#14532d' }, Cg);
  const dashO = S('g', {}, Cg); const dash = S('g', { id: 'dash' }, dashO); for (let k = 0; k < 16; k++) S('rect', { x: Cx + k * 160, y: 852, width: 90, height: 12, rx: 6, fill: '#fde68a' }, dash);
  const carO = S('g', { transform: `translate(${Cx + 300},0)` }, Cg); const car = S('g', { id: 'car' }, carO);
  S('ellipse', { cx: 260, cy: 905, rx: 230, ry: 18, fill: 'rgba(0,0,0,.4)' }, car);
  S('path', { d: 'M40 880 L50 800 Q60 760 110 755 L170 700 Q190 680 230 680 L360 680 Q400 680 420 710 L460 760 Q500 768 500 800 L505 880 Z', fill: '#3b82f6' }, car);
  S('path', { d: 'M190 710 L235 700 L300 700 L300 755 L160 755 Z', fill: '#bfdbfe' }, car); S('path', { d: 'M318 700 L360 700 Q385 702 400 724 L420 755 L318 755 Z', fill: '#bfdbfe' }, car);
  S('rect', { x: 470, y: 790, width: 30, height: 20, rx: 6, fill: '#fde68a' }, car);
  [130, 400].forEach((x, i) => { const wO = S('g', {}, car); const w = S('g', { id: 'wh' + i }, wO); S('circle', { cx: x, cy: 880, r: 48, fill: '#111827' }, w); S('circle', { cx: x, cy: 880, r: 22, fill: '#9ca3af' }, w); S('rect', { x: x - 4, y: 838, width: 8, height: 30, fill: '#111827' }, w); });
  const smoke = []; for (let k = 0; k < 6; k++) smoke.push(S('circle', { class: 'smk', cx: Cx + 300 + 470 - k * 10, cy: 740 - k * 50, r: 30 + k * 10, fill: '#cbd5e1', opacity: .7 }, Cg));
  const gear = S('g', { id: 'gear' }, Cg); S('circle', { cx: Cx + 1500, cy: 360, r: 90, fill: 'none', stroke: '#e5e7eb', 'stroke-width': 30, 'stroke-dasharray': '30 18' }, gear); S('circle', { cx: Cx + 1500, cy: 360, r: 40, fill: '#e5e7eb' }, gear);
  S('path', { id: 'crack', class: 'draw', d: `M${Cx + 1440} 280 L${Cx + 1490} 350 L${Cx + 1470} 370 L${Cx + 1540} 450`, stroke: '#ef4444', 'stroke-width': 12, fill: 'none', 'stroke-linecap': 'round' }, Cg);
  const bill = S('g', { id: 'bill', filter: 'url(#fSh)' }, Cg); S('rect', { x: Cx + 1300, y: 520, width: 380, height: 200, rx: 14, fill: '#f8fafc' }, bill); wtext(bill, Cx + 1490, 580, 'REPAIR BILL', 34, '#0f172a'); wtext(bill, Cx + 1490, 670, '$ $ $ $', 64, '#dc2626');

  // ---------------- AREA D: stage (0..1920, 1400..2480) ----------------
  const Dy = 1400, Dg = S('g', {}, sv);
  S('rect', { x: 0, y: Dy, width: 1920, height: 1080, fill: 'url(#gStage)' }, Dg);
  S('polygon', { id: 'spotL', points: `300,${Dy} 420,${Dy} 900,${Dy + 820} 560,${Dy + 820}`, fill: 'url(#gSpot)' }, Dg);
  S('polygon', { id: 'spotR', points: `1500,${Dy} 1620,${Dy} 1360,${Dy + 820} 1020,${Dy + 820}`, fill: 'url(#gSpot)' }, Dg);
  S('ellipse', { cx: 960, cy: Dy + 830, rx: 820, ry: 90, fill: '#1e293b' }, Dg);
  S('circle', { cx: 960, cy: Dy + 400, r: 420, fill: 'url(#gGlow)', id: 'glow' }, Dg);
  const crowd = S('g', { id: 'crowd' }, Dg); for (let k = 0; k < 22; k++) { const x = 40 + k * 88, y = Dy + 1000 + (k % 3) * 14; S('circle', { cx: x, cy: y - 70, r: 30, fill: '#0b1020' }, crowd); S('path', { d: `M${x - 48} ${y + 80} Q${x - 48} ${y - 30} ${x} ${y - 32} Q${x + 48} ${y - 30} ${x + 48} ${y + 80} Z`, fill: '#0b1020' }, crowd); if (k % 3 === 0) S('path', { d: `M${x + 30} ${y - 20} L${x + 52} ${y - 110}`, stroke: '#0b1020', 'stroke-width': 18, 'stroke-linecap': 'round' }, crowd); }
  const bigN = S('g', { id: 'bigN' }, Dg); wtext(bigN, 960, Dy + 470, '$100,000', 230, C.green);
  // 12 envelopes
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const envs = months.map((m, i) => { const x = 170 + (i % 6) * 270, y = Dy + 540 + Math.floor(i / 6) * 200; const g = S('g', { id: 'env' + i, filter: 'url(#fSh)' }, Dg); S('rect', { x, y, width: 230, height: 150, rx: 12, fill: '#f1f5f9' }, g); S('path', { d: `M${x} ${y + 6} L${x + 115} ${y + 80} L${x + 230} ${y + 6}`, stroke: '#cbd5e1', 'stroke-width': 4, fill: 'none' }, g); wtext(g, x + 115, y + 125, '$8,333', 40, '#047857'); wtext(g, x + 20, y + 40, m, 20, '#64748b', 'start', 700); return g; });
  // envelope 0 close-up: bills inside (8 bills)
  const E0x = 170, E0y = Dy + 540; const bills = [];
  for (let k = 0; k < 8; k++) { const b = S('g', { id: 'bl' + k }, Dg); S('rect', { x: E0x + 18 + k * 25, y: E0y - 70, width: 22, height: 90, rx: 4, fill: k < 2 ? '#22c55e' : '#16a34a', stroke: '#14532d', 'stroke-width': 2 }, b); bills.push(b); }
  const bite = [['TAX', '#f87171', [0, 1]], ['HEALTH', '#fb923c', [2]], ['RETIRE', '#a78bfa', [3]]];
  bite.forEach(([l, c], i) => { const g = S('g', { id: 'bt' + i }, Dg); S('rect', { x: E0x + 260, y: E0y - 60 + i * 60, width: 150, height: 46, rx: 23, fill: c }, g); wtext(g, E0x + 335, E0y - 28 + i * 60, '-' + l, 22, '#0b1020'); });
  wtext(Dg, E0x + 115, E0y + 125, '', 40, '#047857');
  const mega = S('g', { id: 'mega' }, Dg); S('path', { d: `M520 ${Dy + 300} L700 ${Dy + 220} L700 ${Dy + 460} L520 ${Dy + 380} Z`, fill: '#e5e7eb' }, mega); S('rect', { x: 470, y: Dy + 300, width: 60, height: 80, rx: 8, fill: '#9ca3af' }, mega);
  for (let k = 0; k < 3; k++) S('path', { class: 'mwave', d: `M${740 + k * 40} ${Dy + 250 - k * 20} Q${790 + k * 50} ${Dy + 340} ${740 + k * 40} ${Dy + 430 + k * 20}`, stroke: C.gold, 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round' }, mega);
  const whisper = S('g', { id: 'wh' }, Dg); wtext(whisper, 285, Dy + 440, '(−tax −health −retirement)', 18, '#94a3b8', 'middle', 500);

  const MORE = buildMore(sv, defs, s);
  // ---------------- SCREEN overlays: phone UI + red vignette ----------------
  H('div', 'a', 'left:0;top:0;width:1920px;height:1080px;background:radial-gradient(ellipse at center,transparent 45%,rgba(239,68,68,.55) 100%)', '', s, 'vig');
  const ph = H('div', 'a', 'left:740px;top:90px;width:440px;height:900px;border-radius:60px;background:#0b1020;border:14px solid #1f2937;box-shadow:0 40px 80px rgba(0,0,0,.6);overflow:hidden', null, s, 'ph');
  H('div', '', 'height:120px;background:linear-gradient(135deg,#059669,#34d399);padding:44px 34px 0;font-size:30px;font-weight:800;color:#052e1f', 'My Bank', ph);
  H('div', 'sm', 'margin:28px 34px 0', 'Balance', ph);
  const od = H('div', 'a', 'left:34px;top:205px;width:360px;height:96px;overflow:hidden', null, ph); const odc = H('div', 'a', 'left:0;top:0', null, od, 'odc');
  ['$6,000', '$3,600', '$2,800', '$2,200', '$1,900', '$412'].forEach((v, i) => H('div', 'a', `left:0;top:${i * 96}px;height:96px;font-size:78px;font-weight:800;line-height:96px;color:${i === 5 ? C.red : C.green}`, v, odc));
  const tx = [['Rent', '−$2,400'], ['Car', '−$800'], ['Groceries', '−$600'], ['Bills', '−$300'], ['Card', '−$1,488']];
  tx.forEach(([a, b], i) => H('div', 'a', `left:24px;top:${340 + i * 96}px;width:364px;height:80px;border-radius:18px;background:rgba(255,255,255,.06);display:flex;justify-content:space-between;align-items:center;padding:0 22px;font-size:28px;font-weight:600`, `<span>${a}</span><span style="color:${C.red}">${b}</span>`, ph, 'tx' + i));
  const fly = []; for (let k = 0; k < 8; k++) fly.push(H('div', 'a', 'left:910px;top:400px;width:100px;height:100px', `<svg width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="54" r="40" fill="#b45309"/><circle cx="50" cy="50" r="40" fill="#fbbf24"/><text x="50" y="66" text-anchor="middle" font-size="46" font-weight="800" fill="#92400e" font-family="Poppins">$</text></svg>`, s, 'fc' + k));
  H('div', 'a', 'left:1240px;top:300px;font-size:200px;font-weight:800;color:' + C.red, '?', s, 'phq');

  return () => {
    // camera helper
    const cam = (t, cx, cy, z, d = 1.3, e = 'power3.inOut') => { tl.to('#world', { x: 960 - cx * z, y: 540 - cy * z, scale: z, duration: d, ease: e }, t); B(t); };
    tl.set('#world', { x: -960 * .25, y: -540 * .25 + 60, scale: 1.25, transformOrigin: '0% 0%' }, 0);
    tl.set(['#vig', '#ph', '#phq', '.pheart', ...fly.map(f => '#' + f.id), '#tL', '#tR', '#smk', '#bill', '#crack', '#bigN', '#mega', '#wh', '#bt0', '#bt1', '#bt2'], { autoAlpha: 0 }, 0);
    tl.set(s.querySelectorAll('.smk,.mwave'), { autoAlpha: 0 }, 0); tl.set(envs, { autoAlpha: 0 }, 0); tl.set(bills, { autoAlpha: 0 }, 0); tl.set(fb.map((_, i) => '#fb' + i), { autoAlpha: 0 }, 0);
    // idle life: Maya breathing + blinks (finite)
    tl.to('#maya', { y: -6, duration: 1.6, yoyo: true, repeat: 11, ease: 'sine.inOut' }, 0);
    [1.8, 5.2, 8.6, 12.4, 16.8].forEach(t => tl.to(['#meL', '#meR', '#neL', '#neR'], { scaleY: .1, transformOrigin: '50% 50%', duration: .08, yoyo: true, repeat: 1 }, t));
    // 0: paycheck + confetti
    cam(0.05, 960, 540, 1.0, 1.6, 'power2.out');
    tl.fromTo('#ck', { autoAlpha: 0, y: -60, scale: .7, transformOrigin: '50% 50%' }, { autoAlpha: 1, y: 0, scale: 1, duration: .8, ease: 'back.out(1.6)' }, .2); B(.2);
    tl.fromTo(conf, { autoAlpha: 0, y: -80 }, { autoAlpha: 1, y: 520, rotation: 200, duration: 2.6, stagger: .02, ease: 'power1.in' }, .5);
    tl.to(conf, { autoAlpha: 0, duration: .5 }, 3.4);
    // 2.5 parents
    let t = at('your parents think'); cam(t - .2, 600, 380, 1.7, 1.1); tl.fromTo(hearts, { autoAlpha: 0, y: 30, scale: .3, transformOrigin: '50% 50%' }, { autoAlpha: 1, y: -30, scale: 1, duration: .6, stagger: .12, ease: 'back.out(2)' }, at('made it') - .3);
    // 4.1 friends
    t = at('your friends think'); cam(t - .2, 1250, 640, 1.5, 1.0); tl.fromTo(fb.map((_, i) => '#fb' + i), { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: .45, stagger: .3, ease: 'back.out(1.7)' }, t); B(t);
    // 5.8 banking app: zoom to phone then UI
    t = at('open your banking'); cam(t - .3, 1065, 600, 5, 1.0, 'power3.in'); tl.to('#phS', { opacity: 1, duration: .4 }, t);
    tl.fromTo('#ph', { autoAlpha: 0, scale: .3, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: .5, ease: 'power3.out' }, t + .55); B(t + .55);
    tl.fromTo(tx.map((_, i) => '#tx' + i), { autoAlpha: 0, x: 120 }, { autoAlpha: 1, x: 0, duration: .35, stagger: .45 }, t + 1.1);
    for (let k = 1; k < 6; k++) tl.to('#odc', { y: -96 * k, duration: .35, ease: 'power2.inOut' }, t + 1.1 + (k - 1) * .45);
    t = at('wonder where'); fly.forEach((f, k) => { const a = k / 8 * Math.PI * 2; tl.fromTo(f, { autoAlpha: 1, x: 0, y: 0, scale: .5 }, { x: Math.cos(a) * 700, y: Math.sin(a) * 420, scale: 1, autoAlpha: 0, rotation: 200, duration: 1.4, ease: 'power2.out' }, t + k * .05); }); B(t);
    tl.fromTo('#phq', { autoAlpha: 0, scale: .2, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: .5, ease: 'back.out(2)' }, t + .5);
    // 9.7 night desk: earn vs worry
    t = at('you earn too much'); tl.to(['#ph', '#phq'], { autoAlpha: 0, duration: .3 }, t - .4); tl.set('#world', { x: 960 - (Bx + 960) * 2.2, y: 540 - 520 * 2.2, scale: 2.2 }, t - .1); cam(t, Bx + 960, 520, 1.0, 1.6, 'power2.out');
    tl.to(['#nbL'], { rotation: 14, transformOrigin: '100% 50%', duration: .4 }, t + .4); tl.to(['#nbR'], { rotation: -14, transformOrigin: '0% 50%', duration: .4 }, t + .4); tl.to('#nmS', { opacity: 0, duration: .3 }, t + .4); tl.to('#nmW', { opacity: 1, duration: .3 }, t + .4);
    tl.fromTo('#tL', { autoAlpha: 0, scale: .2, transformOrigin: '80% 90%' }, { autoAlpha: 1, scale: 1, duration: .6, ease: 'back.out(1.6)' }, at('struggling') - .8); B(at('struggling') - .8);
    tl.fromTo('#tR', { autoAlpha: 0, scale: .2, transformOrigin: '20% 90%' }, { autoAlpha: 1, scale: 1, duration: .6, ease: 'back.out(1.6)' }, at('not enough')); B(at('not enough'));
    tl.to('#tL', { y: 30, duration: .7, ease: 'sine.inOut', yoyo: true, repeat: 3 }, at('not enough') + .3); tl.to('#tR', { y: -30, duration: .7, ease: 'sine.inOut', yoyo: true, repeat: 3 }, at('not enough') + .3);
    // 14.9 road: car drives, breaks
    t = at('how does a sixfigure'); tl.set('#world', { x: 960 - (Cx + 600) * 1.6, y: 540 - 760 * 1.6, scale: 1.6 }, t - .1); B(t); cam(t, Cx + 960, 560, 1.0, 2.4, 'power2.inOut');
    tl.fromTo('#car', { x: -500 }, { x: 600, duration: 2.6, ease: 'power2.out' }, t); tl.to('#dash', { x: -480, duration: 2.6, ease: 'power2.out' }, t);
    tl.to(['#wh0', '#wh1'], { rotation: 900, transformOrigin: '50% 50%', duration: 2.6, ease: 'power2.out' }, t);
    t = at('broken transmission'); tl.to('#car', { x: 560, rotation: -2, transformOrigin: '50% 100%', duration: .15, yoyo: true, repeat: 3 }, t); B(t);
    tl.fromTo(smoke, { autoAlpha: 0, y: 40, scale: .4, transformOrigin: '50% 50%' }, { autoAlpha: .8, y: -60, scale: 1, duration: 1.2, stagger: .15 }, t + .1);
    tl.fromTo('#gear', { autoAlpha: 0, rotation: 0, transformOrigin: '50% 50%' }, { autoAlpha: 1, rotation: 40, duration: .6 }, t + .3); DRAW('#crack', t + .9, { d: .3 });
    tl.fromTo('#bill', { autoAlpha: 0, y: 300, rotation: 10, transformOrigin: '50% 50%' }, { autoAlpha: 1, y: 0, rotation: -3, duration: .7, ease: 'back.out(1.4)' }, at('feels like a financial')); B(at('feels like a financial'));
    t = at('financial emergency'); tl.fromTo('#vig', { autoAlpha: 0 }, { autoAlpha: 1, duration: .25, yoyo: true, repeat: 3 }, t); B(t);
    // 21.7 stage: the celebrated number
    t = at('start with the number'); tl.set('#world', { x: 960 - 960 * 1.8, y: 540 - (Dy + 300) * 1.8, scale: 1.8 }, t - .1); cam(t, 960, Dy + 540, 1.0, 2.0, 'power2.out');
    tl.fromTo(['#spotL', '#spotR'], { opacity: 0 }, { opacity: 1, duration: .6, stagger: .2 }, t + .2);
    tl.fromTo('#crowd', { y: 60 }, { y: 0, duration: .8, ease: 'power2.out' }, t + .3);
    tl.fromTo('#bigN', { autoAlpha: 0, scale: .5, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: .7, ease: 'back.out(1.7)' }, at('everyone celebrates')); B(at('everyone celebrates')); t = at('one hundred thousand'); tl.to('#bigN', { scale: 1.1, duration: .3, yoyo: true, repeat: 1 }, t); B(t);
    tl.to('#crowd', { y: -14, duration: .2, yoyo: true, repeat: 5 }, t + .3); tl.to('#glow', { scale: 1.15, transformOrigin: '50% 50%', duration: .6, yoyo: true, repeat: 3 }, t);
    // 26.1 split into 12 envelopes
    t = at('it sounds like'); tl.to('#bigN', { y: -240, scale: .55, transformOrigin: '50% 50%', duration: .8, ease: 'power3.inOut' }, t); B(t);
    tl.fromTo(envs, { autoAlpha: 0, y: -200, scale: .4, transformOrigin: '50% 50%' }, { autoAlpha: 1, y: 0, scale: 1, duration: .5, stagger: .08, ease: 'back.out(1.5)' }, t + .4);
    t = at('eight thousand three'); cam(t + .4, 170 + 115 + 150, Dy + 560, 2.4, 1.2);
    DIM(envs.slice(1), t + .4, .15); tl.fromTo(bills, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: .3, stagger: .06 }, t + .6);
    // 30.5 You don't -> bites
    t = at('you dont'); tl.to('#env0', { x: 8, duration: .05, yoyo: true, repeat: 7 }, t); B(t);
    const take = (i, idx, tt) => { tl.fromTo('#bt' + i, { autoAlpha: 0, x: -60 }, { autoAlpha: 1, x: 0, duration: .4, ease: 'back.out(1.6)' }, tt); idx.forEach(k => tl.to('#bl' + k, { y: -160, x: 160 + i * 20, rotation: 30, autoAlpha: 0, duration: .7, ease: 'power2.in' }, tt + .3)); B(tt); };
    take(0, [7, 6], at('before taxes')); take(1, [5], at('health insurance')); take(2, [4], at('toward retirement'));
    // 37.5 announced loudly / 39.2 deducted quietly
    t = at('the salary gets'); cam(t - .2, 960, Dy + 540, 1.0, 1.0); tl.to(envs.slice(1), { autoAlpha: 1, duration: .4 }, t); tl.fromTo('#mega', { autoAlpha: 0, x: -80 }, { autoAlpha: 1, x: 0, duration: .5 }, t + .2); B(t + .2);
    tl.fromTo(s.querySelectorAll('.mwave'), { autoAlpha: 0, scale: .5, transformOrigin: '0% 50%' }, { autoAlpha: 1, scale: 1.2, duration: .35, stagger: .12, yoyo: true, repeat: 3 }, t + .5);
    tl.to('#bigN', { scale: .75, duration: .3, yoyo: true, repeat: 1 }, t + .6);
    t = at('happen quietly'); tl.fromTo('#wh', { autoAlpha: 0 }, { autoAlpha: 1, duration: .8 }, t - .4); B(t); cam(t - .3, 520, Dy + 600, 2.0, 1.4); tl.to(['#mega', '#bigN'], { autoAlpha: 0, duration: .4 }, t - .3);
    MORE();
  };
} } ]};
