// ===================== KURZ FOLK (load AFTER kurz.js + neon.js + mascots.js): people in the newer Kurzgesagt look =====================
// Big round head, compact rounded body, tall oval eyes, big simple hair shapes. Views: front / 3q / side (facing right; o.flip = -1 faces left).
// nFolk(par, x, feetY, s, id, o) ~ 470 px tall at s=1.
// o = { view, mood: 'happy'|'shock'|'meh'|'neutral', skin, hair, hairStyle: 'short'|'bob'|'pony'|'afro', top, pants, shoes, pose: 'stand'|'wave'|'point'|'cheer', flip }
// ids like the mascots: id+'B' whole, id+'H' head, id+'E' eyes, id+'eH' happy eyes, id+'mS'/'mO'/'mF' mouths, id+'aL'/'aR' arms (pivot = shoulder).
// Beats: nMOOD, nHOP, nWAVE, nTALKM (mascots.js) all work on nFolk too.
const FSKIN = ['#f6d2b8', '#e9b48f', '#c98b62', '#9a6243', '#6e4430'];

function nFolk(par, x, y, s, id, o = {}) {
  const d = kDefs(par), v = o.view || 'front', sk = o.skin || FSKIN[0], skD = kDark(sk, .2), hc = o.hair || '#3a2418', hD = kDark(hc, .25), st = o.hairStyle || 'short';
  const top = o.top || '#5b6cff', pants = o.pants || '#2b2f5a', shoe = o.shoes || '#1b1d2e';
  const O = S('g', { transform: `translate(${x},${y}) scale(${s * (o.flip || 1)},${s})` }, par), M = S('g', { id: id + 'B' }, O);
  const F = _mFill, HY = -335;                        // head centre y
  const P = { front: { hx: 0, fx: 0 }, '3q': { hx: 6, fx: 30 }, side: { hx: 0, fx: 52 } }[v] || { hx: 0, fx: 0 };
  // ---- arm: shoulder (sx, sy), angle a (deg, 90 = straight down), group id; pivot = shoulder
  const arm = (k, sx, sy, a, col, skc, len = 100) => { const g = S('g', { id: id + k }, M); g.dataset.px = sx; g.dataset.py = sy; const [hx2, hy2] = kPt(sx, sy, len, a), [mx2, my2] = kPt(sx, sy, len * .55, a + (a > 90 ? -8 : 8));
    S('path', { d: `M${sx} ${sy} Q${mx2} ${my2} ${hx2} ${hy2}`, stroke: col, 'stroke-width': 30, fill: 'none', 'stroke-linecap': 'round' }, g); kBall(g, hx2, hy2, 17, skc, kDark(skc, .2), kLite(skc, .3)); return g; };
  const poseA = { stand: 100, wave: -60, point: 5, cheer: -75 }[o.pose || 'stand'] ?? 100;
  S('ellipse', { cx: 0, cy: 4, rx: 95, ry: 14, fill: '#000', opacity: .3 }, M);
  // ---- hair behind the head
  const back = S('g', {}, M);
  if (st === 'afro') S('circle', { cx: P.hx - (v === 'side' ? 28 : v === '3q' ? 14 : 0), cy: HY - 25, r: 126, fill: F(d, hc, '35%', '25%') }, back);
  if (st === 'bob') S('rect', { x: P.hx - (v === 'side' ? 108 : v === '3q' ? 112 : 108), y: HY - 115, width: v === 'side' ? 160 : v === '3q' ? 200 : 216, height: 200, rx: 80, fill: hD }, back);
  if (st === 'pony') { const tx = v === 'front' ? 1 : -1, bx = v === 'front' ? 50 : -70;
    S('path', { d: `M${bx} ${HY - 85} Q${bx + tx * 95} ${HY - 80} ${bx + tx * 80} ${HY + 40} Q${bx + tx * 70} ${HY + 90} ${bx + tx * 40} ${HY + 120} Q${bx + tx * 40} ${HY + 50} ${bx + tx * 15} ${HY - 20} Z`, fill: F(d, hc, '30%', '20%') }, back);
    kBall(back, bx + tx * 18, HY - 78, 13, o.tie || NPAL.mag); }
  // ---- legs + shoes
  const fw = v === 'front' ? 0 : 14;
  (v === 'front' ? [-24, 24] : v === '3q' ? [-16, 22] : [-6, 10]).forEach((lx, k) => { const far = v !== 'front' && k === 0;
    S('rect', { x: lx - 19, y: -128, width: 38, height: 118, rx: 18, fill: far ? kDark(pants, .25) : pants }, M);
    S('ellipse', { cx: lx + fw, cy: -9, rx: 30, ry: 13, fill: far ? kDark(shoe, .3) : shoe }, M); });
  // ---- far arm (behind the torso) in 3q / side
  if (v === '3q') arm('aL', -42, -238, 100, kDark(top, .3), kDark(sk, .25));
  // ---- torso
  const tw = v === 'front' ? 68 : v === '3q' ? 60 : 44, tx0 = v === 'side' ? 4 : v === '3q' ? 4 : 0;
  const tp = S('path', { d: `M${tx0 - tw} -232 Q${tx0 - tw} -266 ${tx0 - tw + 30} -266 L${tx0 + tw - 30 + (v === 'side' ? 12 : 0)} -266 Q${tx0 + tw + (v === 'side' ? 16 : 0)} -266 ${tx0 + tw + (v === 'side' ? 18 : 0)} -226 L${tx0 + tw + 8} -138 Q${tx0 + tw + 8} -118 ${tx0 + tw - 14} -118 L${tx0 - tw + 6} -118 Q${tx0 - tw - 8} -118 ${tx0 - tw - 8} -138 Z`, fill: F(d, top, '35%', '20%') }, M);
  S('path', { d: `M${tx0 - 20 + (v === 'side' ? 22 : v === '3q' ? 10 : 0)} -266 Q${tx0 + (v === 'side' ? 30 : v === '3q' ? 14 : 0)} -246 ${tx0 + 20 + (v === 'side' ? 30 : v === '3q' ? 18 : 0)} -266 Z`, fill: skD }, M);   // neckline
  // ---- near arm(s)
  if (v === 'front') { arm('aL', -60, -244, 100, top, sk); arm('aR', 60, -244, poseA === 100 ? 80 : poseA, top, sk); }
  else if (v === '3q') arm('aR', 48, -242, poseA === 100 ? 84 : poseA, top, sk);
  else arm('aR', 10, -244, poseA === 100 ? 92 : poseA, top, sk);
  // ---- neck + head
  S('rect', { x: P.hx - 18 + (v === 'side' ? 8 : 0), y: -290, width: 36, height: 30, rx: 10, fill: skD }, M);
  const H = S('g', { id: id + 'H' }, M);
  const ear = (ex) => { S('ellipse', { cx: ex, cy: HY + 8, rx: 12, ry: 17, fill: kMix(sk, '#d9776a', .25) }, H); S('ellipse', { cx: ex + 2, cy: HY + 8, rx: 5, ry: 9, fill: kMix(sk, '#b85a50', .3), opacity: .6 }, H); };
  if (v === 'front' && st !== 'bob') { ear(-90); ear(90); }
  const hd = v === 'side' ? `M-82 ${HY} Q-84 ${HY - 98} 0 ${HY - 100} Q84 ${HY - 98} 90 ${HY - 22} L104 ${HY + 8} Q108 ${HY + 18} 94 ${HY + 22} Q92 ${HY + 70} 40 ${HY + 92} Q-10 ${HY + 102} -50 ${HY + 80} Q-84 ${HY + 56} -82 ${HY} Z`
    : v === '3q' ? `M${P.hx - 88} ${HY} Q${P.hx - 90} ${HY - 98} ${P.hx + 4} ${HY - 100} Q${P.hx + 94} ${HY - 98} ${P.hx + 96} ${HY - 4} Q${P.hx + 96} ${HY + 60} ${P.hx + 50} ${HY + 90} Q${P.hx + 10} ${HY + 104} ${P.hx - 38} ${HY + 86} Q${P.hx - 88} ${HY + 60} ${P.hx - 88} ${HY} Z`
    : `M-92 ${HY} Q-94 ${HY - 100} 0 ${HY - 100} Q94 ${HY - 100} 92 ${HY} Q92 ${HY + 70} 46 ${HY + 92} Q0 ${HY + 108} -46 ${HY + 92} Q-92 ${HY + 70} -92 ${HY} Z`;
  const head = S('path', { d: hd, fill: F(d, sk, '40%', '28%') }, H);
  if (v === '3q' && st !== 'bob') ear(P.hx - 70); if (v === 'side' && st !== 'bob') ear(-12);
  // blush, nose, brows, face
  const fx = P.fx, ey = HY + 2;
  (v === 'front' ? [-48, 48] : v === '3q' ? [fx - 52] : [fx + 4]).forEach(bx => S('ellipse', { cx: bx, cy: HY + 38, rx: 17, ry: 10, fill: '#ff6f8f', opacity: .35 }, H));
  if (v !== 'side') S('path', { d: `M${fx + (v === '3q' ? 10 : 0)} ${HY + 12} Q${fx + (v === '3q' ? 22 : 8)} ${HY + 30} ${fx + (v === '3q' ? 8 : 0)} ${HY + 34}`, stroke: skD, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, H);
  const eyes = v === 'front' ? [[-34, ey, 11], [34, ey, 11]] : v === '3q' ? [[fx - 30, ey, 11, .95], [fx + 40, ey, 10, .7]] : [[fx + 8, ey, 11, .7]];
  const brow = (bx, w, k) => S('path', { id: id + k, d: `M${bx - w} ${ey - 26} Q${bx} ${ey - 33} ${bx + w} ${ey - 26}`, stroke: kDark(hc, .1), 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, H);
  eyes.forEach(([bx, , , sx = 1], k) => brow(bx, 13 * sx, k ? 'bR' : 'bL'));
  _mFace(H, id, eyes, v === 'front' ? 0 : v === '3q' ? fx + 8 : fx + 14, HY + 56, o, '#24160f', v === 'side' ? 9 : 14);
  // ---- hair in front of the head
  const f = S('g', {}, H), hx = P.hx;
  if (st === 'short') S('path', { d: v === 'side' ? `M-86 ${HY + 10} Q-96 ${HY - 112} 10 ${HY - 112} Q92 ${HY - 108} 92 ${HY - 40} Q50 ${HY - 66} 14 ${HY - 58} Q-20 ${HY - 40} -30 ${HY - 6} Q-60 ${HY + 20} -86 ${HY + 10} Z`
      : v === '3q' ? `M${hx - 92} ${HY - 8} Q${hx - 100} ${HY - 112} ${hx + 6} ${HY - 112} Q${hx + 100} ${HY - 110} ${hx + 98} ${HY - 26} Q${hx + 70} ${HY - 66} ${hx + 20} ${HY - 62} Q${hx - 30} ${HY - 50} ${hx - 60} ${HY - 52} Q${hx - 80} ${HY - 30} ${hx - 92} ${HY - 8} Z`
      : `M-96 ${HY - 6} Q-102 ${HY - 112} 0 ${HY - 112} Q102 ${HY - 112} 96 ${HY - 6} Q84 ${HY - 60} 40 ${HY - 66} Q0 ${HY - 52} -40 ${HY - 66} Q-84 ${HY - 60} -96 ${HY - 6} Z`, fill: F(d, hc, '35%', '20%') }, f);
  if (st === 'pony') S('path', { d: v === 'side' ? `M-84 ${HY + 4} Q-94 ${HY - 110} 10 ${HY - 108} Q88 ${HY - 104} 90 ${HY - 40} Q40 ${HY - 70} 0 ${HY - 62} Q-40 ${HY - 50} -60 ${HY - 10} Z`
      : `M${hx - 94} ${HY - 4} Q${hx - 100} ${HY - 110} ${hx + 2} ${HY - 108} Q${hx + 100} ${HY - 108} ${hx + 95} ${HY - 4} Q${hx + 70} ${HY - 74} ${hx + 2 + (v === '3q' ? 24 : 0)} ${HY - 72} Q${hx - 66} ${HY - 74} ${hx - 94} ${HY - 4} Z`, fill: F(d, hc, '35%', '20%') }, f);
  if (st === 'bob') S('path', { d: v === 'side' ? `M92 ${HY - 40} Q60 ${HY - 66} 15 ${HY - 57} Q-6 ${HY - 30} -6 ${HY + 30} Q-6 ${HY + 72} -22 ${HY + 90} L-100 ${HY + 86} Q-112 ${HY + 30} -106 ${HY - 45} Q-90 ${HY - 116} 10 ${HY - 114} Q90 ${HY - 110} 92 ${HY - 40} Z`
      : `M${hx - 104} ${HY + 20} Q${hx - 110} ${HY - 116} ${hx + 2} ${HY - 116} Q${hx + 110} ${HY - 116} ${hx + 104} ${HY + 20} Q${hx + 96} ${HY - 44} ${hx + 50 + (v === '3q' ? 20 : 0)} ${HY - 56} Q${hx} ${HY - 40} ${hx - 50} ${HY - 58} Q${hx - 96} ${HY - 44} ${hx - 104} ${HY + 20} Z`, fill: F(d, hc, '35%', '20%') }, f);
  if (st === 'afro') { const c0 = v === 'side' ? [-24, HY - 30] : v === '3q' ? [hx - 6, HY - 28] : [0, HY - 28], a0 = v === 'side' ? 200 : v === '3q' ? 185 : 180, a1 = v === 'side' ? 330 : v === '3q' ? 345 : 360;
    for (let k = 0; k <= 9; k++) { const a = a0 + (a1 - a0) * k / 9, [bx, by] = kPt(c0[0], c0[1], 84, a); kBall(f, bx, by, 30 + (k % 2) * 6, hc, hD, kLite(hc, .25)); } }
  // pose: raise the near arm at build time (beats can still rotate it)
  return M;
}
// raise / lower an arm at time t: deg = rotation around the shoulder (negative = up/forward for the right arm)
function nARM(id, k, t, deg, d = .35) { const g = document.getElementById(id + k); if (!g) return; tl.to(g, { rotation: deg, svgOrigin: `${g.dataset.px} ${g.dataset.py}`, duration: d, ease: 'back.out(1.6)' }, t); B(t); }
