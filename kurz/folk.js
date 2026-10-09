// ===================== KURZ FOLK (load AFTER kurz.js + neon.js + mascots.js): people in the newer Kurzgesagt look =====================
// Flat cel shading (hard curved shadow, _mFill), dot eyes, a big round nose that sticks out of the face in 3/4 and side,
// open expressive mouths, chunky hair with a shadow chunk, mitten hands, short legs. Views: front / 3q / side (facing right; o.flip = -1 faces left).
// nFolk(par, x, y, s, id, o): full body ~430 px tall at s=1, feet at y. o.bust = true: head + shoulders only (y = bottom of the shoulders) for close-ups.
// o = { view, bust, mood: 'smile'|'happy'|'shock'|'meh'|'neutral', skin, hair, hairStyle: 'short'|'bob'|'pony'|'buzz', top, collar, pants, shoes, pose: 'stand'|'wave'|'point'|'cheer', flip }
// ids like the mascots: id+'B' whole, id+'H' head, id+'E' dot eyes, id+'eH' closed happy eyes, id+'mS' open smile, id+'mO' "oh", id+'mF' flat, id+'bL'/'bR' brows, id+'aL'/'aR' arms.
// Beats: nMOOD (incl. 'smile'), nHOP, nWAVE, nTALKM (mascots.js), nARM (below).
const FSKIN = ['#f7c9a8', '#eab08a', '#c98b62', '#9a6243', '#6e4430'];

function _fFace(H, id, eyes, mx, my, mw, o, ink = '#1d1220') {   // Kurz face: dot eyes, open D smile, round "oh", flat line
  const E = S('g', { id: id + 'E' }, H), EH = S('g', { id: id + 'eH', opacity: 0 }, H);
  eyes.forEach(([x, y, r, sx = 1]) => { S('ellipse', { cx: x, cy: y, rx: r * .78 * sx, ry: r, fill: ink }, E);
    S('path', { d: `M${x - r * sx} ${y + 2} Q${x} ${y - r * 1.1} ${x + r * sx} ${y + 2}`, stroke: ink, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, EH); });
  const mS = S('g', { id: id + 'mS' }, H); S('path', { d: `M${mx - mw} ${my - 4} Q${mx} ${my - 8} ${mx + mw} ${my - 4} Q${mx + mw * .8} ${my + mw * 1.1} ${mx} ${my + mw * 1.15} Q${mx - mw * .8} ${my + mw * 1.1} ${mx - mw} ${my - 4} Z`, fill: '#7a1630' }, mS);
  S('ellipse', { cx: mx + mw * .1, cy: my + mw * .75, rx: mw * .55, ry: mw * .3, fill: '#ff6f91' }, mS); S('path', { d: `M${mx - mw * .7} ${my - 3} L${mx + mw * .7} ${my - 3}`, stroke: '#ffffff', 'stroke-width': mw * .28, 'stroke-linecap': 'round', opacity: .9 }, mS);
  const mO = S('g', { id: id + 'mO', opacity: 0 }, H); S('ellipse', { cx: mx, cy: my + 6, rx: mw * .55, ry: mw * .75, fill: '#7a1630' }, mO); S('ellipse', { cx: mx, cy: my + 6 + mw * .4, rx: mw * .35, ry: mw * .22, fill: '#ff6f91' }, mO);
  S('path', { id: id + 'mF', d: `M${mx - mw * .6} ${my + 4} L${mx + mw * .6} ${my + 4}`, stroke: ink, 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0 }, H);
  _mSet(id, o.mood || 'smile', H);
}

function nFolk(par, x, y, s, id, o = {}) {
  const d = kDefs(par), v = o.view || 'front', sk = o.skin || FSKIN[0], skD = kDark(sk, .16), hc = o.hair || '#2f5bd8', st = o.hairStyle || 'short';
  const top = o.top || '#ff4f7a', col2 = o.collar || kLite(top, .55), pants = o.pants || '#2b2f5a', shoe = o.shoes || '#1b1d2e', F = _mFill, bust = !!o.bust;
  const O = S('g', { transform: `translate(${x},${y + (bust ? 150 * s : 0)}) scale(${s * (o.flip || 1)},${s})` }, par), M = S('g', { id: id + 'B' }, O);
  const HY = -335, side = v === 'side', q3 = v === '3q';
  // ---- arm: sleeve from shoulder (sx, sy) at angle a (deg, 90 = down) + mitten hand with a thumb; pivot = shoulder
  const arm = (k, sx, sy, a, col, far) => { const g = S('g', { id: id + k }, M); g.dataset.px = sx; g.dataset.py = sy; const [hx2, hy2] = kPt(sx, sy, 92, a), [mx2, my2] = kPt(sx, sy, 50, a + (a > 90 ? -6 : 6));
    S('path', { d: `M${sx} ${sy} Q${mx2} ${my2} ${hx2} ${hy2}`, stroke: far ? kDark(col, .25) : col, 'stroke-width': 34, fill: 'none', 'stroke-linecap': 'round' }, g);
    const hs = far ? kDark(sk, .2) : sk, [tx, ty] = kPt(hx2, hy2, 14, a - 70); S('ellipse', { cx: tx, cy: ty, rx: 7, ry: 10, fill: kDark(hs, .08), transform: `rotate(${a} ${tx} ${ty})` }, g);
    S('ellipse', { cx: hx2, cy: hy2 + 4, rx: 17, ry: 19, fill: F(d, hs) }, g); return g; };
  const poseA = { stand: null, wave: v === 'front' ? -60 : -25, point: 0, cheer: -75 }[o.pose || 'stand'];
  if (!bust) S('ellipse', { cx: 0, cy: 4, rx: 90, ry: 13, fill: '#000', opacity: .3 }, M);
  // ---- hair behind the head (bob back, ponytail)
  if (st === 'bob') S('rect', { x: side ? -116 : q3 ? -120 : -116, y: HY - 112, width: side ? 170 : q3 ? 214 : 232, height: 204, rx: 74, fill: kDark(hc, .22) }, M);
  if (st === 'pony') { const tx = v === 'front' ? 1 : -1, bx = v === 'front' ? 54 : -74;
    S('path', { d: `M${bx} ${HY - 86} Q${bx + tx * 104} ${HY - 82} ${bx + tx * 86} ${HY + 40} Q${bx + tx * 74} ${HY + 96} ${bx + tx * 40} ${HY + 126} Q${bx + tx * 44} ${HY + 54} ${bx + tx * 14} ${HY - 20} Z`, fill: F(d, hc) }, M);
    kBall(M, bx + tx * 18, HY - 80, 14, o.tie || NPAL.yel); }
  // ---- legs + shoes (short, chunky)
  if (!bust) (v === 'front' ? [-24, 24] : q3 ? [-14, 24] : [-4, 10]).forEach((lx, k) => { const far = v !== 'front' && k === 0, fw = v === 'front' ? 0 : 16;
    S('rect', { x: lx - 20, y: -104, width: 40, height: 96, rx: 18, fill: far ? kDark(pants, .25) : pants }, M);
    S('path', { d: `M${lx - 26 + fw * .3} -4 Q${lx - 28 + fw * .3} -28 ${lx + fw * .3} -28 Q${lx + 30 + fw} -26 ${lx + 32 + fw} -6 Q${lx + 32 + fw} 4 ${lx + 20 + fw} 4 L${lx - 18 + fw * .3} 4 Q${lx - 26 + fw * .3} 4 ${lx - 26 + fw * .3} -4 Z`, fill: far ? kDark(shoe, .3) : shoe }, M); });
  // ---- far arm behind the torso
  if (q3) arm('aL', -44, -222, 100, top, true);
  // ---- torso (chunky, cel shaded) + collar
  const tw = v === 'front' ? 70 : q3 ? 62 : 46, t0 = side ? 6 : q3 ? 6 : 0, fb = side ? 14 : 0;
  S('path', { d: `M${t0 - tw} -200 Q${t0 - tw} -246 ${t0 - tw + 34} -246 L${t0 + tw - 34 + fb} -246 Q${t0 + tw + fb} -246 ${t0 + tw + fb} -196 L${t0 + tw + 6} -112 Q${t0 + tw + 6} -88 ${t0 + tw - 18} -88 L${t0 - tw + 10} -88 Q${t0 - tw - 6} -88 ${t0 - tw - 6} -112 Z`, fill: F(d, top, '30%', '25%') }, M);
  const cx0 = t0 + (side ? 26 : q3 ? 14 : 0), cw = side ? 18 : 30;
  S('path', { d: `M${cx0 - cw} -246 Q${cx0} -214 ${cx0 + cw} -246 Z`, fill: col2 }, M); S('path', { d: `M${cx0 - cw + 8} -246 Q${cx0} -226 ${cx0 + cw - 8} -246 Z`, fill: skD }, M);
  // ---- near arm(s)
  if (v === 'front') { arm('aL', -64, -226, 102, top); arm('aR', 64, -226, poseA ?? 78, top); }
  else if (q3) arm('aR', 50, -226, poseA ?? 84, top);
  else arm('aR', 12, -228, poseA ?? 90, top);
  // ---- neck + head
  S('rect', { x: (side ? 2 : q3 ? 0 : -18), y: -272, width: 36, height: 34, rx: 12, fill: skD }, M);
  const H = S('g', { id: id + 'H' }, M);
  const ear = ex => { S('ellipse', { cx: ex, cy: HY + 14, rx: 15, ry: 20, fill: sk }, H); S('ellipse', { cx: ex + 2, cy: HY + 15, rx: 7, ry: 11, fill: kDark(sk, .18) }, H); };
  if (v === 'front' && st !== 'bob') { ear(-94); ear(94); }
  const hd = side ? `M-90 ${HY} Q-92 ${HY - 102} 4 ${HY - 104} Q88 ${HY - 100} 92 ${HY - 18} Q94 ${HY + 40} 84 ${HY + 66} Q66 ${HY + 96} 20 ${HY + 98} Q-40 ${HY + 100} -70 ${HY + 70} Q-92 ${HY + 40} -90 ${HY} Z`
    : q3 ? `M-96 ${HY} Q-98 ${HY - 102} 0 ${HY - 104} Q92 ${HY - 100} 96 ${HY - 10} Q100 ${HY + 50} 70 ${HY + 80} Q30 ${HY + 108} -30 ${HY + 96} Q-92 ${HY + 70} -96 ${HY} Z`
    : `M-95 ${HY} Q-97 ${HY - 102} 0 ${HY - 104} Q97 ${HY - 102} 95 ${HY} Q95 ${HY + 62} 52 ${HY + 90} Q0 ${HY + 110} -52 ${HY + 90} Q-95 ${HY + 62} -95 ${HY} Z`;
  S('path', { d: hd, fill: F(d, sk, '34%', '30%') }, H);
  if (q3 && st !== 'bob') ear(-72); if (side && st !== 'bob') ear(-6);
  // blush, nose (sticks out of the outline in 3q / side), brows, face
  const blush = (bx, r = 18) => S('ellipse', { cx: bx, cy: HY + 48, rx: r, ry: r * .6, fill: '#ff6f8f', opacity: .4 }, H);
  if (v === 'front') { blush(-54); blush(54); } else if (q3) blush(-6); else blush(46);
  const nose = (nx, ny, rx, ry) => { S('ellipse', { cx: nx + 2, cy: ny + 6, rx: rx * .9, ry: ry * .7, fill: kDark(sk, .2) }, H); S('ellipse', { cx: nx, cy: ny, rx, ry, fill: kDark(sk, .06) }, H); };
  if (v === 'front') nose(0, HY + 32, 14, 11); else if (q3) nose(98, HY + 28, 20, 17); else nose(104, HY + 22, 22, 18);
  const eyes = v === 'front' ? [[-32, HY + 8, 10], [32, HY + 8, 10]] : q3 ? [[8, HY + 6, 10], [74, HY + 4, 9, .75]] : [[60, HY + 4, 10, .7]];
  const ink = '#1d1220', brow = (bx, w, k, tilt = 0) => S('path', { id: id + k, d: `M${bx - w} ${HY - 18 + tilt} L${bx + w} ${HY - 22 - tilt}`, stroke: kDark(hc, .1), 'stroke-width': 9, fill: 'none', 'stroke-linecap': 'round' }, H);
  eyes.forEach(([bx, , , sx = 1], k) => brow(bx, 14 * sx, k ? 'bR' : 'bL'));
  _fFace(H, id, eyes, v === 'front' ? 0 : q3 ? 50 : 64, HY + 64, side ? 11 : 18, o, ink);
  // ---- hair in front of the head (chunky, cel shaded) + a light streak
  const hp = side ? { short: `M-96 ${HY + 30} Q-112 ${HY - 118} 10 ${HY - 118} Q96 ${HY - 114} 96 ${HY - 30} Q78 ${HY - 62} 46 ${HY - 56} Q20 ${HY - 40} 4 ${HY - 56} Q-14 ${HY - 20} -28 ${HY + 4} Q-60 ${HY + 40} -96 ${HY + 30} Z`,
      bob: `M94 ${HY - 40} Q60 ${HY - 70} 14 ${HY - 58} Q-6 ${HY - 30} -8 ${HY + 30} Q-8 ${HY + 76} -24 ${HY + 92} L-104 ${HY + 90} Q-118 ${HY + 30} -110 ${HY - 50} Q-90 ${HY - 120} 10 ${HY - 120} Q92 ${HY - 114} 94 ${HY - 40} Z`,
      pony: `M-92 ${HY + 6} Q-104 ${HY - 116} 10 ${HY - 116} Q94 ${HY - 112} 94 ${HY - 36} Q50 ${HY - 70} 4 ${HY - 60} Q-40 ${HY - 46} -62 ${HY - 6} Z`,
      buzz: `M90 ${HY - 46} Q55 ${HY - 70} 15 ${HY - 64} Q-10 ${HY - 38} -20 ${HY - 2} Q-44 ${HY + 26} -82 ${HY + 16} Q-92 ${HY - 102} 4 ${HY - 106} Q84 ${HY - 102} 90 ${HY - 46} Z` }
    : q3 ? { short: `M-104 ${HY + 8} Q-112 ${HY - 118} 10 ${HY - 118} Q108 ${HY - 114} 100 ${HY - 10} Q88 ${HY - 46} 64 ${HY - 52} Q54 ${HY - 30} 26 ${HY - 48} Q2 ${HY - 30} -18 ${HY - 52} Q-60 ${HY - 40} -78 ${HY - 20} Q-96 ${HY - 10} -104 ${HY + 8} Z`,
      bob: `M-110 ${HY + 40} Q-118 ${HY - 122} 6 ${HY - 122} Q114 ${HY - 120} 104 ${HY + 20} Q98 ${HY - 34} 70 ${HY - 50} Q40 ${HY - 34} 10 ${HY - 52} Q-30 ${HY - 36} -60 ${HY - 50} Q-96 ${HY - 34} -110 ${HY + 40} Z`,
      pony: `M-98 ${HY + 4} Q-106 ${HY - 116} 6 ${HY - 116} Q106 ${HY - 112} 100 ${HY - 6} Q80 ${HY - 70} 26 ${HY - 70} Q-60 ${HY - 72} -98 ${HY + 4} Z`,
      buzz: `M-92 ${HY - 6} Q-96 ${HY - 106} 4 ${HY - 106} Q96 ${HY - 104} 96 ${HY - 18} Q84 ${HY - 58} 50 ${HY - 64} Q10 ${HY - 58} -40 ${HY - 62} Q-78 ${HY - 50} -92 ${HY - 6} Z` }
    : { short: `M-100 ${HY + 6} Q-110 ${HY - 118} 0 ${HY - 118} Q110 ${HY - 118} 100 ${HY + 6} Q96 ${HY - 40} 70 ${HY - 52} Q60 ${HY - 30} 30 ${HY - 50} Q0 ${HY - 30} -24 ${HY - 54} Q-52 ${HY - 32} -70 ${HY - 50} Q-92 ${HY - 36} -100 ${HY + 6} Z`,
      bob: `M-106 ${HY + 40} Q-118 ${HY - 122} 0 ${HY - 122} Q118 ${HY - 122} 106 ${HY + 40} Q100 ${HY - 30} 70 ${HY - 48} Q30 ${HY - 34} 0 ${HY - 52} Q-40 ${HY - 34} -70 ${HY - 48} Q-100 ${HY - 30} -106 ${HY + 40} Z`,
      pony: `M-98 ${HY + 2} Q-106 ${HY - 116} 0 ${HY - 116} Q106 ${HY - 116} 98 ${HY + 2} Q84 ${HY - 70} 0 ${HY - 72} Q-84 ${HY - 70} -98 ${HY + 2} Z`,
      buzz: `M-95 ${HY - 8} Q-98 ${HY - 106} 0 ${HY - 106} Q98 ${HY - 106} 95 ${HY - 8} Q88 ${HY - 56} 50 ${HY - 63} Q0 ${HY - 57} -50 ${HY - 63} Q-88 ${HY - 56} -95 ${HY - 8} Z` };
  const hair = S('path', { d: hp[st] || hp.short, fill: F(d, hc, '30%', '22%') }, H);
  if (st === 'buzz') { hair.setAttribute('fill', F(d, kMix(hc, sk, .25))); const cl = S('g', { 'clip-path': kClip(d, hair) }, H); for (let k = 0; k < 80; k++) S('circle', { cx: -100 + rnd(k * 7) * 200, cy: HY - 108 + rnd(k * 13) * 110, r: 2, fill: kDark(hc, .1), opacity: .55 }, cl); }
  if (bust) { const cp = S('clipPath', { id: kUid('fb') }, d); S('rect', { x: -400, y: -900, width: 800, height: 900 - 150 }, cp); M.setAttribute('clip-path', `url(#${cp.id})`); }
  return M;
}
// raise / lower an arm at time t: deg = rotation around the shoulder (negative = up/forward for the right arm)
function nARM(id, k, t, deg, d = .35) { const g = document.getElementById(id + k); if (!g) return; tl.to(g, { rotation: deg, svgOrigin: `${g.dataset.px} ${g.dataset.py}`, duration: d, ease: 'back.out(1.6)' }, t); B(t); }
