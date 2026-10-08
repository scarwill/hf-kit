// ===== chars2.js — DSML characters v2 (chosen style C: rounded + navy outline). charP(par,x,feetY,s,p,opt,st='C') / botP(par,x,feetY,s,p,st='C'). Same opt + ids as charB/botB (mood/blink/wave/talk work). Load after illus.js + scenes.js. st: A clean | B soft shade | C outline =====
let _cpn = 0;
function charP(par, x, y, s, p, o = {}, st = 'C') {
  const sk = o.skin ?? SKIN[0], hc = o.hairC ?? HAIRC[0], top = o.top ?? '#14b8a6', pants = o.pants ?? '#1f2a44', shoe = o.shoes ?? '#0b1222', hair = o.hair ?? 'short', tt = o.topType ?? 'blazer';
  const shd = st === 'B', ol = st === 'C', hs = ol ? 1.15 : 1;
  const O = S('g', { transform: `translate(${x},${y}) scale(${s})` }, par); const M = S('g', { id: p + 'B' }, O);
  const legH = 222, bt = -legH - 200, by = -legH + 20, HY = bt - 85, cy = HY;
  const OL = ol ? { stroke: '#0f172a', 'stroke-width': 6, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' } : {};
  const sd = (g, d, side = 1, a = .16) => { if (!shd && !ol) return; const id = p + 'c' + (_cpn++); const cp = S('clipPath', { id }, g); S('path', { d }, cp); S('rect', { x: side > 0 ? 40 : -400, y: -760, width: 360, height: 900, fill: `rgba(10,15,45,${a * .75})`, 'clip-path': `url(#${id})` }, g); };
  const rim = (g, d, a = .22) => { if (!shd) return; const id = p + 'c' + (_cpn++); const cp = S('clipPath', { id }, g); S('path', { d }, cp); S('rect', { x: -400, y: -760, width: 336, height: 900, fill: `rgba(255,255,255,${a})`, 'clip-path': `url(#${id})` }, g); };
  S('ellipse', { cx: 0, cy: 6, rx: 120, ry: 19, fill: 'rgba(0,0,0,.28)' }, M);
  // legs (tapered) + shoes with sole
  [-1, 1].forEach(sg => { const lx = sg * 30; const d = `M${lx - 24} ${-legH} L${lx + 24} ${-legH} L${lx + 20} -14 L${lx - 20} -14 Z`; const g = S('g', {}, M); S('path', Object.assign({ d, fill: pants }, OL), g); sd(g, d, sg > 0 ? 1 : -1, .12);
    const sh = `M${lx - 28} -4 Q${lx - 30} -26 ${lx - 14} -26 L${lx + 14} -26 Q${lx + 30} -22 ${lx + 40} -8 Q${lx + 42} 6 ${lx + 28} 6 L${lx - 24} 6 Q${lx - 30} 6 ${lx - 28} -4 Z`; S('path', Object.assign({ d: sh, fill: shoe }, OL), g); S('rect', { x: lx - 28, y: 0, width: 70, height: 6, rx: 3, fill: 'rgba(255,255,255,.55)' }, g); });
  // torso
  const tD = `M-90 ${bt + 44} Q-98 ${bt + 4} -52 ${bt - 2} L-20 ${bt - 8} Q0 ${bt + 4} 20 ${bt - 8} L52 ${bt - 2} Q98 ${bt + 4} 90 ${bt + 44} L${tt === 'kurta' ? 96 : 88} ${tt === 'kurta' ? by + 60 : by} Q0 ${(tt === 'kurta' ? by + 60 : by) + 10} ${tt === 'kurta' ? -96 : -88} ${tt === 'kurta' ? by + 60 : by} Z`;
  const T = S('g', {}, M); S('path', Object.assign({ d: tD, fill: top }, OL), T); sd(T, tD, 1, .17); rim(T, tD, .2);
  if (tt === 'blazer') { S('path', { d: `M-34 ${bt - 4} L0 ${bt + 86} L34 ${bt - 4} Z`, fill: '#f8fafc' }, T); S('path', { d: `M-34 ${bt - 4} L-6 ${bt + 80} L-46 ${bt + 62} Z M34 ${bt - 4} L6 ${bt + 80} L46 ${bt + 62} Z`, fill: 'rgba(0,0,0,.2)' }, T); S('path', { d: `M0 ${bt + 86} L0 ${by + 6}`, stroke: 'rgba(0,0,0,.25)', 'stroke-width': 4 }, T); }
  if (tt === 'tshirt') S('path', { d: `M-36 ${bt - 2} Q0 ${bt + 44} 36 ${bt - 2}`, stroke: 'rgba(0,0,0,.22)', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, T);
  if (tt === 'hoodie') { S('path', { d: `M-62 ${bt + 4} Q0 ${bt + 74} 62 ${bt + 4}`, stroke: 'rgba(0,0,0,.2)', 'stroke-width': 12, fill: 'none', 'stroke-linecap': 'round' }, T); S('rect', { x: -52, y: by - 92, width: 104, height: 52, rx: 14, fill: 'rgba(0,0,0,.16)' }, T); S('path', { d: `M-12 ${bt + 50} L-12 ${bt + 96} M12 ${bt + 50} L12 ${bt + 96}`, stroke: 'rgba(255,255,255,.7)', 'stroke-width': 4, 'stroke-linecap': 'round' }, T); }
  if (tt === 'kurta') { S('path', { d: `M0 ${bt + 4} L0 ${bt + 110}`, stroke: 'rgba(0,0,0,.2)', 'stroke-width': 5 }, T); [0, 1, 2].forEach(k => S('circle', { cx: 9, cy: bt + 30 + k * 28, r: 4.5, fill: 'rgba(255,255,255,.7)' }, T)); }
  // arms: sleeve + cuff + hand with thumb
  const arm = (side, id) => { const g = S('g', { id }, M); const sx = side * 90;
    S('path', Object.assign({ d: `M${sx} ${bt + 36} Q${side * 132} ${bt + 122} ${side * 112} ${bt + 204}`, stroke: top, 'stroke-width': 42, fill: 'none', 'stroke-linecap': 'round' }, ol ? { filter: 'none' } : {}), g);
    if (ol) { S('path', { d: `M${sx} ${bt + 36} Q${side * 132} ${bt + 122} ${side * 112} ${bt + 204}`, stroke: '#0f172a', 'stroke-width': 54, fill: 'none', 'stroke-linecap': 'round', opacity: 1 }, g).parentNode.insertBefore(g.lastChild, g.firstChild); }
    if (shd) S('path', { d: `M${sx + side * 10} ${bt + 44} Q${side * 140} ${bt + 124} ${side * 120} ${bt + 200}`, stroke: 'rgba(10,15,45,.14)', 'stroke-width': 18, fill: 'none', 'stroke-linecap': 'round' }, g);
    S('path', { d: `M${side * 112 - 22} ${bt + 196} L${side * 112 + 22} ${bt + 196}`, stroke: 'rgba(255,255,255,.55)', 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
    S('ellipse', Object.assign({ cx: side * 110, cy: bt + 226, rx: 20, ry: 24, fill: sk }, OL), g); S('ellipse', Object.assign({ cx: side * 110 - side * 17, cy: bt + 224, rx: 7, ry: 14, fill: sk, transform: `rotate(${side * -12} ${side * 110 - side * 17} ${bt + 224})` }, ol ? OL : {}), g); return g; };
  arm(-1, p + 'aL'); arm(1, p + 'aR');
  // neck
  S('path', { d: `M-20 ${HY + 46} L20 ${HY + 46} L24 ${bt + 4} L-24 ${bt + 4} Z`, fill: sk }, M); S('path', { d: `M-20 ${HY + 46} L20 ${HY + 46} L22 ${HY + 74} Q0 ${HY + 86} -22 ${HY + 74} Z`, fill: 'rgba(120,50,20,.22)' }, M);
  // head
  const Hd = S('g', { transform: `translate(0 ${HY}) scale(${hs}) translate(0 ${-HY})` }, M);
  if (hair === 'long' || hair === 'pony') S('path', Object.assign({ d: `M-82 ${cy + 10} Q-96 ${cy - 108} 0 ${cy - 102} Q96 ${cy - 108} 82 ${cy + 10} L86 ${cy + 76} Q60 ${cy + 44} 62 ${cy} L-62 ${cy} Q-60 ${cy + 44} -86 ${cy + 76} Z`, fill: hc }, OL), Hd);
  if (hair === 'pony') S('path', { d: `M60 ${cy - 60} Q134 ${cy - 30} 104 ${cy + 64} Q96 ${cy} 64 ${cy - 30} Z`, fill: hc }, Hd);
  if (hair === 'bun') S('circle', Object.assign({ cx: 0, cy: cy - 94, r: 34, fill: hc }, OL), Hd);
  if (hair === 'curly') for (let k = 0; k < 9; k++) { const a = Math.PI * (1.05 + k * .11); S('circle', { cx: Math.cos(a) * 68, cy: cy - 10 + Math.sin(a) * 76, r: 27, fill: hc }, Hd); }
  [-1, 1].forEach(sg => { S('ellipse', Object.assign({ cx: sg * 66, cy: cy + 8, rx: 12, ry: 16, fill: sk }, OL), Hd); S('ellipse', { cx: sg * 67, cy: cy + 9, rx: 5, ry: 8, fill: 'rgba(160,70,40,.25)' }, Hd); });
  const fD = `M-64 ${cy - 10} Q-66 ${cy + 58} -32 ${cy + 80} Q0 ${cy + 92} 32 ${cy + 80} Q66 ${cy + 58} 64 ${cy - 10} Q60 ${cy - 78} 0 ${cy - 80} Q-60 ${cy - 78} -64 ${cy - 10} Z`;
  const Fc = S('g', {}, Hd); S('path', Object.assign({ d: fD, fill: sk }, OL), Fc); sd(Fc, fD, 1, .14); rim(Fc, fD, .18);
  if (hair === 'long' || hair === 'pony' || hair === 'bun') S('path', { d: `M-68 ${cy - 10} Q-60 ${cy - 82} 0 ${cy - 80} Q54 ${cy - 78} 70 ${cy - 20} Q20 ${cy - 54} -20 ${cy - 42} Q-50 ${cy - 32} -68 ${cy - 10} Z`, fill: hc }, Hd);
  if (hair === 'short') { S('path', Object.assign({ d: `M-68 ${cy - 4} Q-76 ${cy - 88} 0 ${cy - 90} Q76 ${cy - 88} 68 ${cy - 4} Q62 ${cy - 48} 30 ${cy - 56} Q0 ${cy - 42} -30 ${cy - 56} Q-60 ${cy - 48} -68 ${cy - 4} Z`, fill: hc }, OL), Hd); S('path', { d: `M-34 ${cy - 76} Q-6 ${cy - 86} 20 ${cy - 78}`, stroke: 'rgba(255,255,255,.28)', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, Hd); }
  else S('path', { d: `M-40 ${cy - 74} Q-10 ${cy - 86} 22 ${cy - 76}`, stroke: 'rgba(255,255,255,.26)', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, Hd);
  if (hair === 'bald') S('path', { d: `M-68 ${cy} Q-70 ${cy - 30} -60 ${cy - 34} M68 ${cy} Q70 ${cy - 30} 60 ${cy - 34}`, stroke: hc, 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round' }, Hd);
  if (o.beard) S('path', { d: `M-62 ${cy + 6} Q-60 ${cy + 84} 0 ${cy + 90} Q60 ${cy + 84} 62 ${cy + 6} Q40 ${cy + 52} 0 ${cy + 52} Q-40 ${cy + 52} -62 ${cy + 6} Z`, fill: hc }, Hd);
  S('ellipse', { cx: -40, cy: cy + 26, rx: 13, ry: 9, fill: '#f472b6', opacity: .26 }, Hd); S('ellipse', { cx: 40, cy: cy + 26, rx: 13, ry: 9, fill: '#f472b6', opacity: .26 }, Hd);
  S('path', { d: `M-4 ${cy + 14} Q0 ${cy + 24} 8 ${cy + 22}`, stroke: 'rgba(150,70,30,.45)', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, Hd);
  const E = S('g', { id: p + 'E' }, Hd);
  [['eL', -25], ['eR', 25]].forEach(([k, dx]) => { const e = S('g', { id: p + k }, E); S('ellipse', { cx: dx, cy: cy + 1, rx: 11, ry: 13, fill: '#fff' }, e); S('ellipse', { cx: dx + 1, cy: cy + 3, rx: 7.5, ry: 10, fill: '#1e293b' }, e); S('circle', { cx: dx + 4, cy: cy - 1, r: 3, fill: '#fff' }, e); });
  if (o.glasses) { [-25, 25].forEach(dx => S('rect', { x: dx - 22, y: cy - 20, width: 44, height: 38, rx: 14, fill: 'rgba(186,230,253,.18)', stroke: '#111827', 'stroke-width': 4.5 }, Hd)); S('path', { d: `M-3 ${cy} L3 ${cy}`, stroke: '#111827', 'stroke-width': 4.5 }, Hd); }
  const bc = hair === 'bald' ? '#6b7280' : hc;
  S('path', { id: p + 'bL', d: `M-40 ${cy - 24} Q-25 ${cy - 34} -9 ${cy - 24}`, stroke: bc, 'stroke-width': 6.5, fill: 'none', 'stroke-linecap': 'round' }, Hd);
  S('path', { id: p + 'bR', d: `M9 ${cy - 24} Q25 ${cy - 34} 40 ${cy - 24}`, stroke: bc, 'stroke-width': 6.5, fill: 'none', 'stroke-linecap': 'round' }, Hd);
  const mc = '#9a3412';
  S('path', { id: p + 'mS', d: `M-20 ${cy + 40} Q0 ${cy + 58} 20 ${cy + 40}`, stroke: mc, 'stroke-width': 5.5, fill: 'none', 'stroke-linecap': 'round' }, Hd);
  S('path', { id: p + 'mW', d: `M-17 ${cy + 52} Q0 ${cy + 38} 17 ${cy + 52}`, stroke: mc, 'stroke-width': 5.5, fill: 'none', 'stroke-linecap': 'round', opacity: 0 }, Hd);
  S('ellipse', { id: p + 'mO', cx: 0, cy: cy + 48, rx: 10, ry: 13, fill: '#7f1d1d', opacity: 0 }, Hd);
  S('path', { id: p + 'mN', d: `M-15 ${cy + 46} L15 ${cy + 46}`, stroke: mc, 'stroke-width': 5.5, 'stroke-linecap': 'round', opacity: 0 }, Hd);
  return M;
}
function botP(par, x, y, s, p, st = 'C', col = '#38bdf8') {
  const shd = st === 'B', ol = st === 'C', hs = ol ? 1.12 : 1;
  const OL = ol ? { stroke: '#0f172a', 'stroke-width': 6, 'stroke-linejoin': 'round' } : {};
  const O = S('g', { transform: `translate(${x},${y}) scale(${s})` }, par); const M = S('g', { id: p + 'B' }, O);
  const gl = (g, d, a = .2) => { if (!shd) return; const id = p + 'g' + (_cpn++); const cp = S('clipPath', { id }, g); S('path', { d }, cp); S('rect', { x: -300, y: -700, width: 236, height: 800, fill: `rgba(255,255,255,${a})`, 'clip-path': `url(#${id})` }, g); S('rect', { x: 52, y: -700, width: 300, height: 800, fill: 'rgba(8,20,60,.16)', 'clip-path': `url(#${id})` }, g); };
  S('ellipse', { cx: 0, cy: 6, rx: 120, ry: 19, fill: 'rgba(0,0,0,.26)' }, M);
  [-45, 45].forEach(dx => { const g = S('g', {}, M); S('rect', Object.assign({ x: dx - 20, y: -144, width: 40, height: 136, rx: 16, fill: '#a3b1c6' }, OL), g); S('rect', { x: dx - 20, y: -96, width: 40, height: 10, fill: 'rgba(0,0,0,.14)' }, g); S('rect', Object.assign({ x: dx - 38, y: -22, width: 76, height: 28, rx: 14, fill: '#334155' }, OL), g); S('rect', { x: dx - 26, y: -18, width: 36, height: 6, rx: 3, fill: 'rgba(255,255,255,.35)' }, g); });
  const arm = (sd, id) => { const g = S('g', { id }, M); if (ol) S('path', { d: `M${sd * 96} -300 Q${sd * 140} -235 ${sd * 120} -170`, stroke: '#0f172a', 'stroke-width': 40, fill: 'none', 'stroke-linecap': 'round' }, g); S('path', { d: `M${sd * 96} -300 Q${sd * 140} -235 ${sd * 120} -170`, stroke: '#a3b1c6', 'stroke-width': 28, fill: 'none', 'stroke-linecap': 'round' }, g); S('circle', { cx: sd * 112, cy: -236, r: 14, fill: '#64748b' }, g); S('circle', Object.assign({ cx: sd * 120, cy: -160, r: 24, fill: '#64748b' }, OL), g); S('circle', { cx: sd * 114, cy: -166, r: 8, fill: 'rgba(255,255,255,.3)' }, g); return g; };
  arm(-1, p + 'aL'); arm(1, p + 'aR');
  const bD = 'M-100 -300 Q-100 -335 -64 -335 L64 -335 Q100 -335 100 -300 L100 -170 Q100 -135 64 -135 L-64 -135 Q-100 -135 -100 -170 Z';
  const B = S('g', {}, M); S('path', Object.assign({ d: bD, fill: col }, OL), B); gl(B, bD, .24);
  S('rect', { x: -62, y: -292, width: 124, height: 94, rx: 22, fill: '#0b6fb0' }, B); S('rect', { x: -62, y: -292, width: 124, height: 36, rx: 18, fill: 'rgba(255,255,255,.12)' }, B);
  S('circle', { cx: 0, cy: -244, r: 30, fill: 'rgba(253,224,71,.28)' }, B); S('circle', { id: p + 'core', cx: 0, cy: -244, r: 21, fill: '#fde047' }, B); S('circle', { cx: -6, cy: -250, r: 6, fill: '#fff9c4' }, B);
  [-30, 0, 30].forEach((dx, k) => S('rect', { x: dx - 8, y: -170, width: 16, height: 6, rx: 3, fill: ['#4ade80', '#fde047', '#f87171'][k] }, B));
  S('rect', { x: -26, y: -366, width: 52, height: 38, rx: 8, fill: '#64748b' }, M); S('path', { d: 'M-26 -352 L26 -352 M-26 -340 L26 -340', stroke: 'rgba(0,0,0,.2)', 'stroke-width': 4 }, M);
  const HG = S('g', { id: p + 'H', transform: `translate(0 -450) scale(${hs}) translate(0 450)` }, M); const hD = 'M-118 -500 Q-118 -560 -62 -560 L62 -560 Q118 -560 118 -500 L118 -410 Q118 -352 62 -352 L-62 -352 Q-118 -352 -118 -410 Z';
  S('rect', Object.assign({ x: -136, y: -482, width: 24, height: 70, rx: 12, fill: '#94a3b8' }, OL), HG); S('rect', Object.assign({ x: 112, y: -482, width: 24, height: 70, rx: 12, fill: '#94a3b8' }, OL), HG);
  const head = S('g', {}, HG); S('path', Object.assign({ d: hD, fill: '#e8eef7' }, OL), head); gl(head, hD, .45);
  S('rect', { x: -92, y: -532, width: 184, height: 148, rx: 38, fill: '#0f172a' }, head); S('path', { d: 'M-80 -520 Q0 -540 80 -520 L80 -500 Q0 -516 -80 -500 Z', fill: 'rgba(255,255,255,.07)' }, head);
  S('path', { d: 'M0 -560 L0 -604', stroke: '#94a3b8', 'stroke-width': 9, 'stroke-linecap': 'round' }, head); S('circle', { id: p + 'antG', cx: 0, cy: -612, r: 40, fill: '#ef4444', opacity: 0 }, head); S('circle', { id: p + 'ant', cx: 0, cy: -612, r: 15, fill: '#67e8f9' }, head); S('circle', { cx: -4, cy: -616, r: 5, fill: '#fff' }, head);
  const face = S('g', {}, HG); const E = S('g', { id: p + 'E' }, face);
  [['eL', -38], ['eR', 38]].forEach(([k, dx]) => { const e = S('g', { id: p + k }, E); S('ellipse', { cx: dx, cy: -466, rx: 22, ry: 26, fill: 'rgba(103,232,249,.22)' }, e); S('ellipse', { cx: dx, cy: -466, rx: 17, ry: 22, fill: '#67e8f9' }, e); S('ellipse', { cx: dx + 5, cy: -473, rx: 5, ry: 7, fill: '#fff' }, e); });
  [-44, 44].forEach(dx => S('ellipse', { cx: dx * 1.55, cy: -420, rx: 11, ry: 6, fill: '#f472b6', opacity: .5 }, face));
  S('path', { id: p + 'bL', d: 'M-62 -506 Q-40 -514 -18 -504', stroke: '#67e8f9', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, face);
  S('path', { id: p + 'bR', d: 'M18 -504 Q40 -514 62 -506', stroke: '#67e8f9', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, face);
  S('path', { id: p + 'mS', d: 'M-30 -424 Q0 -398 30 -424', stroke: '#67e8f9', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, face);
  S('path', { id: p + 'mW', d: 'M-26 -408 Q0 -428 26 -408', stroke: '#67e8f9', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round', opacity: 0 }, face);
  S('ellipse', { id: p + 'mO', cx: 0, cy: -414, rx: 12, ry: 15, fill: '#67e8f9', opacity: 0 }, face);
  S('path', { id: p + 'mN', d: 'M-22 -414 L22 -414', stroke: '#67e8f9', 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0 }, face);
  return M;
}
