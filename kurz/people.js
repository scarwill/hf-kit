// ===================== KURZ PEOPLE: simple, clean, shaded "bean" people (load AFTER kurz.js) =====================
// Original design in the Kurzgesagt spirit: round head, pill body, clear open eyes (no heavy lids), soft shading, no outlines.
// FRONT VIEW ONLY (user dropped 3/4 and side: "side angle bohot bhayanak", "nahi chahiye 3/4 look"). To look at something use kLook (small eye/head shift).
// kBean(par, x, feetY, s, id, o) ~ 520 px tall at s=1. o = {sex:'m'|'f', skin, hair, hairStyle:'short'|'curly'|'long'|'bun'|'pony'|'bald',
//   top, pants, shoes, glasses, beard, coat}
// ids: id+'B' whole (move / bob), id+'H' head, id+'E' eyes (blink: eyes('#idE',[t])), id+'mS' mouth, id+'mO' open mouth, id+'bL'/'bR' brows,
//      id+'aN' right arm / id+'aF' left arm (rotate, transformOrigin '50% 0%'), id+'lN'/'lF' legs. Speaking: kTalk(id, t0, t1). Walking: kWALK(id, t, dx, d).
function kBean(par, x, y, s, id, o = {}) {
  const v = 'front',   /* user: only front view (3/4 and side dropped) */ dr = o.dir || 1, sk = o.skin || '#f3cfb3', skD = kDark(sk, .22), skL = kLite(sk, .35);
  const hc = o.hair || '#5a3a26', hD = kDark(hc, .3), hL = kLite(hc, .3), top = o.top || '#3a7bd5', pants = o.pants || '#2b2f4a', shoe = o.shoes || '#1b1d2e';
  const f = o.sex === 'f', st = o.hairStyle || (f ? 'long' : 'short'), d = kDefs(par);
  const O = S('g', { transform: `translate(${x},${y}) scale(${s})` }, par), M = S('g', { id: id + 'B' }, O);
  const X = v === 'front' ? 0 : dr;                       // facing sign (0 = front)
  S('ellipse', { cx: 0, cy: 2, rx: 78, ry: 12, fill: 'rgba(0,0,0,.28)' }, M);
  const tw = v === 'front' ? 74 : v === '3q' ? 64 : 46;   // half torso width
  // legs
  const leg = (lx, idl, col, far) => { const g = S('g', { id: id + idl }, M); S('rect', { x: lx - 17, y: -158, width: 34, height: 150, rx: 16, fill: far ? kDark(col, .25) : col }, g);
    S('path', { d: `M${lx - 20} -8 Q${lx - 20} -26 ${lx} -26 Q${lx + 26 * (X || 1)} -26 ${lx + 30 * (X || 1)} -8 Q${lx + 30 * (X || 1)} 2 ${lx + 16 * (X || 1)} 2 L${lx - 14} 2 Q${lx - 20} 2 ${lx - 20} -8 Z`, fill: far ? kDark(shoe, .2) : shoe }, g); return g; };
  const arm = (ax, idl, far, sd) => { const g = S('g', { id: id + idl }, M), c = far ? kDark(top, .28) : top, ex = ax + sd * 14;
    S('path', { d: `M${ax} -318 Q${ex} -250 ${ax + sd * 6} -196`, stroke: c, 'stroke-width': 32, fill: 'none', 'stroke-linecap': 'round' }, g);
    kBall(g, ax + sd * 6, -182, 17, far ? skD : sk, null, null, null); return g; };
  if (v === 'front') { leg(-24, 'lF', pants); leg(24, 'lN', pants); }
  else { leg(-dr * 14, 'lF', pants, true); arm(-dr * (tw - 12), 'aF', true, -dr * .4); leg(dr * 12, 'lN', pants); }
  // torso (pill), shaded; coat = open jacket over top
  const tD = `M${-tw} -300 Q${-tw - 4} -352 ${-tw * .45} -356 L${tw * .45} -356 Q${tw + 4} -352 ${tw} -300 L${tw * .9} -168 Q${tw * .85} -146 ${tw * .6} -146 L${-tw * .6} -146 Q${-tw * .85} -146 ${-tw * .9} -168 Z`;
  const T = S('g', {}, M), tc = o.coat || top, tp = S('path', { d: tD, fill: tc }, T); const tcl = S('g', { 'clip-path': kClip(d, tp) }, T);
  S('ellipse', { cx: tw * 1.05, cy: -230, rx: tw * .55, ry: 150, fill: kDark(tc, .35), opacity: .45 }, tcl); S('ellipse', { cx: -tw * .55, cy: -340, rx: tw * .35, ry: 16, fill: kLite(tc, .4), opacity: .45 }, tcl);
  if (o.coat) { const iw = v === 'front' ? 26 : 18, ic = X * tw * .3; const inn = S('path', { d: `M${ic - iw} -354 L${ic + iw} -354 L${ic + iw * .7} -150 L${ic - iw * .7} -150 Z`, fill: top }, T); }
  const nx = X * tw * .25; S('path', { d: `M${nx - 20} -356 Q${nx} -334 ${nx + 20} -356`, fill: skD, opacity: .9 }, T);
  S('rect', { x: -tw * .9, y: -176, width: tw * 1.8, height: 12, rx: 6, fill: 'rgba(0,0,0,.14)' }, T);
  if (v === 'front') { arm(-tw + 4, 'aF', false, -1); arm(tw - 4, 'aN', false, 1); }
  else arm(dr * (v === 'side' ? 4 : tw * .45), 'aN', false, dr * .35);
  // neck + head
  S('rect', { x: nx - 14, y: -378, width: 28, height: 30, rx: 10, fill: skD }, M);
  const H = S('g', { id: id + 'H' }, M), hy = -436, hx = X * 4;
  if (st === 'long' || (st === 'pony' && v === 'front')) S('path', { d: `M${hx - 60 - X * 4} ${hy - 34} Q${hx - 74} ${hy + 60} ${hx - 54 - X * 20} ${hy + 94} Q${hx - X * 20} ${hy + 108} ${hx + 54 - X * 20} ${hy + 94} Q${hx + 74} ${hy + 60} ${hx + 60 - X * 4} ${hy - 34} Z`, fill: hD }, H);
  if (st === 'pony' && v !== 'front') S('path', { d: `M${hx - dr * 52} ${hy - 30} Q${hx - dr * 110} ${hy} ${hx - dr * 92} ${hy + 76} Q${hx - dr * 70} ${hy + 30} ${hx - dr * 44} ${hy + 6} Z`, fill: hD }, H);
  if (st === 'bun') kBall(H, hx - X * 30, hy - 70, 28, hc, hD, hL);
  if (v !== 'side' || true) { const ex = v === 'front' ? 0 : -dr * (v === 'side' ? 6 : 40); if (v !== 'front' || true) [-1, 1].forEach(sg => { if (v === 'front' || sg === -dr) S('ellipse', { cx: v === 'front' ? sg * 64 : hx + ex, cy: hy + 8, rx: 11, ry: 15, fill: skD }, H); }); }
  // head shape: round; 3q/side get a gentle jaw + nose bump on the facing side
  const hd = v === 'side' ? `M${hx - dr * 62} ${hy} Q${hx - dr * 64} ${hy - 70} ${hx} ${hy - 72} Q${hx + dr * 60} ${hy - 72} ${hx + dr * 64} ${hy - 6} L${hx + dr * 76} ${hy + 12} Q${hx + dr * 78} ${hy + 20} ${hx + dr * 64} ${hy + 24} Q${hx + dr * 58} ${hy + 64} ${hx + dr * 10} ${hy + 68} Q${hx - dr * 60} ${hy + 66} ${hx - dr * 62} ${hy} Z`
    : v === '3q' ? `M${hx - dr * 64} ${hy} Q${hx - dr * 66} ${hy - 70} ${hx} ${hy - 72} Q${hx + dr * 64} ${hy - 72} ${hx + dr * 66} ${hy - 4} Q${hx + dr * 66} ${hy + 50} ${hx + dr * 30} ${hy + 68} Q${hx} ${hy + 76} ${hx - dr * 34} ${hy + 64} Q${hx - dr * 64} ${hy + 50} ${hx - dr * 64} ${hy} Z`
    : `M${-64} ${hy} Q-66 ${hy - 72} 0 ${hy - 74} Q66 ${hy - 72} 64 ${hy} Q64 ${hy + 56} 30 ${hy + 70} Q0 ${hy + 78} -30 ${hy + 70} Q-64 ${hy + 56} -64 ${hy} Z`;
  const hp = S('path', { d: hd, fill: sk }, H); const hcl = S('g', { 'clip-path': kClip(d, hp) }, H);
  S('ellipse', { cx: hx + 66, cy: hy + 26, rx: 34, ry: 84, fill: skD, opacity: .28 }, hcl); S('ellipse', { cx: hx - 22, cy: hy - 40, rx: 26, ry: 16, fill: skL, opacity: .5 }, hcl);
  // face: centre fc, eye gap g; far eye smaller in 3q
  const fc = v === 'front' ? 0 : v === '3q' ? dr * 24 : dr * 44, gp = v === 'front' ? 25 : 21;
  S('ellipse', { cx: hx + fc + (v === 'front' ? -32 : -dr * 22), cy: hy + 28, rx: 10, ry: 6, fill: '#ff8f8f', opacity: .14 }, H); if (v === 'front') S('ellipse', { cx: 32, cy: hy + 28, rx: 10, ry: 6, fill: '#ff8f8f', opacity: .14 }, H);
  const E = S('g', { id: id + 'E' }, H);
  const eye = (cx, k) => { S('ellipse', { cx, cy: hy + 4, rx: 9.5 * k, ry: 12, fill: '#fbf8f4' }, E); S('ellipse', { cx: cx + X * 2.5 * k, cy: hy + 5, rx: 6.5 * k, ry: 8.5, fill: '#2a1d1a' }, E); S('circle', { cx: cx + X * 2.5 * k - 2, cy: hy + 1, r: 2.4, fill: '#fff' }, E); };
  if (v === 'front') { eye(-gp, 1); eye(gp, 1); } else if (v === '3q') { eye(hx + fc - dr * gp, .78); eye(hx + fc + dr * gp * .9, 1); } else eye(hx + fc - dr * 8, .8);
  const bc = kDark(hc, .15), bw = 4.5;
  const brow = (cx, w, sideId) => S('path', { id: id + sideId, d: `M${cx - w} ${hy - 16} Q${cx} ${hy - 24} ${cx + w} ${hy - 17}`, stroke: bc, 'stroke-width': bw, fill: 'none', 'stroke-linecap': 'round' }, H);
  if (v === 'front') { brow(-gp, 12, 'bL'); brow(gp, 12, 'bR'); } else if (v === '3q') { brow(hx + fc - dr * gp, 9, dr > 0 ? 'bL' : 'bR'); brow(hx + fc + dr * gp * .9, 12, dr > 0 ? 'bR' : 'bL'); } else brow(hx + fc - dr * 8, 10, 'bR');
  if (v !== 'side') S('path', { d: `M${hx + fc + X * 6} ${hy + 10} Q${hx + fc + X * 14 + (v === 'front' ? 4 : 0)} ${hy + 26} ${hx + fc + X * 4} ${hy + 30}`, stroke: skD, 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round', opacity: .8 }, H);
  const mx = hx + fc + (v === 'side' ? dr * 4 : 0), mw = v === 'side' ? 9 : 13;
  S('path', { id: id + 'mS', d: `M${mx - mw} ${hy + 44} Q${mx} ${hy + 53} ${mx + mw} ${hy + 44}`, stroke: '#8f3f36', 'stroke-width': 3.6, fill: 'none', 'stroke-linecap': 'round' }, H);
  S('ellipse', { id: id + 'mO', cx: mx, cy: hy + 47, rx: 8, ry: 7, fill: '#6e2630', opacity: 0 }, H);
  const bk = v === 'side' ? .62 : v === '3q' ? .85 : 1; if (o.beard) { const bd = S('path', { d: `M${hx + fc - 52 * bk} ${hy + 22} Q${hx + fc - 44 * bk} ${hy + 72} ${hx + fc} ${hy + 76} Q${hx + fc + 44 * bk} ${hy + 72} ${hx + fc + 52 * bk} ${hy + 22} Q${hx + fc + 30 * bk} ${hy + 40} ${hx + fc} ${hy + 38} Q${hx + fc - 30 * bk} ${hy + 40} ${hx + fc - 52 * bk} ${hy + 22} Z`, fill: hc, 'clip-path': kClip(d, hp) }, H); }
  if (o.glasses) { const gs = v === 'front' ? [-gp, gp] : v === '3q' ? [hx + fc - dr * gp, hx + fc + dr * gp * .9] : [hx + fc - dr * 8]; gs.forEach((gx, k) => S('rect', { x: gx - 17, y: hy - 10, width: 34, height: 28, rx: 10, fill: '#fff', 'fill-opacity': .12, stroke: '#1d2333', 'stroke-width': 3.5 }, H)); }
  // hair (front shape; volume pushed to the back of the head when turned)
  const b = -X; const HR = {
    short: `M${hx - 66} ${hy - 4} Q${hx - 72} ${hy - 80} ${hx + b * 6} ${hy - 84} Q${hx + 72} ${hy - 82} ${hx + 66} ${hy - 6} Q${hx + 58 + b * 10} ${hy - 44} ${hx + X * 30} ${hy - 48} Q${hx} ${hy - 40} ${hx - X * 20} ${hy - 52} Q${hx - 58} ${hy - 44} ${hx - 66} ${hy - 4} Z`,
    curly: null, long: `M${hx - 68} ${hy + 30} Q${hx - 76} ${hy - 82} ${hx} ${hy - 84} Q${hx + 76} ${hy - 82} ${hx + 68} ${hy + 30} Q${hx + 60} ${hy - 20} ${hx + X * 40 + 20} ${hy - 44} Q${hx + X * 10} ${hy - 36} ${hx - 20 + X * 20} ${hy - 54} Q${hx - 56} ${hy - 30} ${hx - 68} ${hy + 30} Z`,
    bun: `M${hx - 64} ${hy - 6} Q${hx - 68} ${hy - 80} ${hx} ${hy - 82} Q${hx + 68} ${hy - 80} ${hx + 64} ${hy - 6} Q${hx + 50} ${hy - 50} ${hx} ${hy - 52} Q${hx - 50} ${hy - 50} ${hx - 64} ${hy - 6} Z`,
    pony: `M${hx - 64} ${hy - 6} Q${hx - 68} ${hy - 80} ${hx} ${hy - 82} Q${hx + 68} ${hy - 80} ${hx + 64} ${hy - 6} Q${hx + 50} ${hy - 50} ${hx + X * 20} ${hy - 50} Q${hx - 50} ${hy - 48} ${hx - 64} ${hy - 6} Z`, bald: null }[st];
  const hairEl = HR ? S('path', { d: HR, fill: hc }, H) : null;
  if (st === 'curly') { const cg = S('g', {}, H); for (let k = 0; k < 9; k++) { const a = Math.PI * (1.02 + k * .12); kBall(cg, hx + Math.cos(a) * 60 - X * 6, hy - 8 + Math.sin(a) * 66, 26, hc, hD, hL); } }
  if (hairEl) { const c2 = S('g', { 'clip-path': kClip(d, hairEl) }, H); S('ellipse', { cx: hx + 50, cy: hy - 20, rx: 40, ry: 70, fill: hD, opacity: .5 }, c2); S('ellipse', { cx: hx - 20, cy: hy - 70, rx: 30, ry: 10, fill: hL, opacity: .55, transform: `rotate(-12 ${hx - 20} ${hy - 70})` }, c2); }
  return M;
}
// walk: moves the whole person by dx over d seconds with a leg swing and a little bob
function kWALK(id, t, dx, d = 1.6) { const n = Math.max(2, Math.round(d / .4));
  tl.to('#' + id + 'B', { x: dx, duration: d, ease: 'none' }, t);
  tl.to('#' + id + 'lN', { rotation: 16, transformOrigin: '50% 0%', duration: d / n, yoyo: true, repeat: n - 1, ease: 'sine.inOut' }, t);
  tl.to('#' + id + 'lF', { rotation: -16, transformOrigin: '50% 0%', duration: d / n, yoyo: true, repeat: n - 1, ease: 'sine.inOut' }, t);
  tl.to('#' + id + 'B', { y: -8, duration: d / n / 2, yoyo: true, repeat: 2 * n - 1, ease: 'sine.inOut' }, t); B(t); }

// look toward something: eyes + head shift a little (dir -1 left / 1 right, dy px up/down). Works for kBean.
function kGaze(id, t, dir, dy = 0, d = .4) { tl.to('#' + id + 'E', { x: dir * 5, y: dy * .4, duration: d, ease: 'power2.inOut' }, t); tl.to('#' + id + 'H', { rotation: dir * 4, y: dy * .3, transformOrigin: '50% 100%', duration: d, ease: 'power2.inOut' }, t); B(t); }
