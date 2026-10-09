// ===================== KURZ PEOPLE: simple, clean, shaded "bean" people (load AFTER kurz.js) =====================
// Original design in the Kurzgesagt spirit: round head, pill body, clear open eyes (no heavy lids), soft shading, no outlines.
// Views: o.view 'front' (default) | '3q' | 'side', facing right; o.flip = -1 faces left. Each view is its own drawing in the same style.
// To look at something without turning use kGaze (small eye/head shift).
// kBean(par, x, feetY, s, id, o) ~ 520 px tall at s=1. o = {view, flip, sex:'m'|'f', skin, hair, hairStyle:'short'|'long'|'bun'|'pony'|'bald',
//   top, pants, shoes, glasses, coat}   (beard was dropped)
// ids: id+'B' whole (move / bob), id+'H' head, id+'E' eyes (blink: eyes('#idE',[t])), id+'mS' mouth, id+'mO' open mouth, id+'bL'/'bR' brows,
//      id+'aN' right arm / id+'aF' left arm (rotate, transformOrigin '50% 0%'), id+'lN'/'lF' legs. Speaking: kTalk(id, t0, t1). Walking: kWALK(id, t, dx, d).
function kBean(par, x, y, s, id, o = {}) {
  if (o.view === '3q' || o.view === 'side') return _kBeanTurn(par, x, y, s, id, o);
  const v = 'front', dr = 1, sk = o.skin || '#f3cfb3', skD = kDark(sk, .22), skL = kLite(sk, .35);
  const hc = o.hair || '#5a3a26', hD = kDark(hc, .3), hL = kLite(hc, .3), top = o.top || '#3a7bd5', pants = o.pants || '#2b2f4a', shoe = o.shoes || '#1b1d2e';
  const f = o.sex === 'f', st = o.hairStyle === 'curly' ? 'short' : o.hairStyle || (f ? 'long' : 'short'), d = kDefs(par);   // curly was dropped
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
  // long: two locks that fall in front of the shoulders, with a gap at the neck (one dark mass under the chin read as a beard)
  if (st === 'long') { const lk = S('path', { d: `M${hx - 68} ${hy - 30} Q${hx - 82} ${hy + 60} ${hx - 92} ${hy + 160} Q${hx - 70} ${hy + 178} ${hx - 44} ${hy + 160} Q${hx - 40} ${hy + 110} ${hx - 32} ${hy + 64} L${hx} ${hy + 20} L${hx + 32} ${hy + 64} Q${hx + 40} ${hy + 110} ${hx + 44} ${hy + 160} Q${hx + 70} ${hy + 178} ${hx + 92} ${hy + 160} Q${hx + 82} ${hy + 60} ${hx + 68} ${hy - 30} Z`, fill: kDark(hc, .1) }, H);
    const lc = S('g', { 'clip-path': kClip(d, lk) }, H); [-1, 1].forEach(sg => { S('ellipse', { cx: hx + sg * 50, cy: hy + 120, rx: 14, ry: 70, fill: hD, opacity: .45 }, lc); S('path', { d: `M${hx + sg * 76} ${hy + 40} Q${hx + sg * 80} ${hy + 100} ${hx + sg * 74} ${hy + 150}`, stroke: hL, 'stroke-width': 5, fill: 'none', opacity: .4, 'stroke-linecap': 'round' }, lc); }); }
  // pony (front): tail peeks out behind the head on one side and hangs to the shoulder, with a hair tie (no mass under the chin)
  if (st === 'pony' && v === 'front') { const pt = S('path', { d: `M${hx + 30} ${hy - 62} Q${hx + 104} ${hy - 60} ${hx + 100} ${hy + 20} Q${hx + 98} ${hy + 90} ${hx + 82} ${hy + 140} Q${hx + 74} ${hy + 90} ${hx + 66} ${hy + 40} Q${hx + 60} ${hy - 10} ${hx + 30} ${hy - 30} Z`, fill: hc }, H);
    const pc = S('g', { 'clip-path': kClip(d, pt) }, H); S('ellipse', { cx: hx + 70, cy: hy + 40, rx: 14, ry: 90, fill: hD, opacity: .5 }, pc); S('path', { d: `M${hx + 92} ${hy - 20} Q${hx + 94} ${hy + 50} ${hx + 84} ${hy + 110}`, stroke: hL, 'stroke-width': 5, fill: 'none', opacity: .45, 'stroke-linecap': 'round' }, pc);
    kBall(H, hx + 62, hy - 58, 10, top, kDark(top, .3), kLite(top, .4)); }
  if (st === 'pony' && v !== 'front') S('path', { d: `M${hx - dr * 52} ${hy - 30} Q${hx - dr * 110} ${hy} ${hx - dr * 92} ${hy + 76} Q${hx - dr * 70} ${hy + 30} ${hx - dr * 44} ${hy + 6} Z`, fill: hD }, H);
  if (st === 'bun') kBall(H, hx - X * 30, hy - 70, 28, hc, hD, hL);
  if (v !== 'side' || true) { const ex = v === 'front' ? 0 : -dr * (v === 'side' ? 6 : 40); if (v !== 'front' || true) [-1, 1].forEach(sg => { if ((v === 'front' && st !== 'long') || sg === -dr) S('ellipse', { cx: v === 'front' ? sg * 64 : hx + ex, cy: hy + 8, rx: 11, ry: 15, fill: skD }, H); }); }
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
  if (f && v === 'front') [-1, 1].forEach(sg => S('path', { d: `M${sg * (gp + 7)} ${hy - 6} L${sg * (gp + 15)} ${hy - 11} M${sg * (gp + 9)} ${hy - 2} L${sg * (gp + 17)} ${hy - 4}`, stroke: '#2a1d1a', 'stroke-width': 3, 'stroke-linecap': 'round' }, E));
  const bc = kDark(hc, .15), bw = 4.5;
  const brow = (cx, w, sideId) => S('path', { id: id + sideId, d: `M${cx - w} ${hy - 16} Q${cx} ${hy - 24} ${cx + w} ${hy - 17}`, stroke: bc, 'stroke-width': bw, fill: 'none', 'stroke-linecap': 'round' }, H);
  if (v === 'front') { brow(-gp, 12, 'bL'); brow(gp, 12, 'bR'); } else if (v === '3q') { brow(hx + fc - dr * gp, 9, dr > 0 ? 'bL' : 'bR'); brow(hx + fc + dr * gp * .9, 12, dr > 0 ? 'bR' : 'bL'); } else brow(hx + fc - dr * 8, 10, 'bR');
  if (v !== 'side') S('path', { d: `M${hx + fc + X * 6} ${hy + 10} Q${hx + fc + X * 14 + (v === 'front' ? 4 : 0)} ${hy + 26} ${hx + fc + X * 4} ${hy + 30}`, stroke: skD, 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round', opacity: .8 }, H);
  const mx = hx + fc + (v === 'side' ? dr * 4 : 0), mw = v === 'side' ? 9 : 13;
  S('path', { id: id + 'mS', d: `M${mx - mw} ${hy + 44} Q${mx} ${hy + 53} ${mx + mw} ${hy + 44}`, stroke: '#8f3f36', 'stroke-width': 3.6, fill: 'none', 'stroke-linecap': 'round' }, H);
  S('ellipse', { id: id + 'mO', cx: mx, cy: hy + 47, rx: 8, ry: 7, fill: '#6e2630', opacity: 0 }, H);
  if (o.glasses) { const gs = v === 'front' ? [-gp, gp] : v === '3q' ? [hx + fc - dr * gp, hx + fc + dr * gp * .9] : [hx + fc - dr * 8]; gs.forEach((gx, k) => S('rect', { x: gx - 17, y: hy - 10, width: 34, height: 28, rx: 10, fill: '#fff', 'fill-opacity': .12, stroke: '#1d2333', 'stroke-width': 3.5 }, H)); }
  // hair (front shape; volume pushed to the back of the head when turned)
  const b = -X; const HR = {
    short: `M${hx - 66} ${hy - 4} Q${hx - 72} ${hy - 80} ${hx + b * 6} ${hy - 84} Q${hx + 72} ${hy - 82} ${hx + 66} ${hy - 6} Q${hx + 58 + b * 10} ${hy - 44} ${hx + X * 30} ${hy - 48} Q${hx} ${hy - 40} ${hx - X * 20} ${hy - 52} Q${hx - 58} ${hy - 44} ${hx - 66} ${hy - 4} Z`,
    long: `M${hx - 68} ${hy + 30} Q${hx - 76} ${hy - 82} ${hx} ${hy - 84} Q${hx + 76} ${hy - 82} ${hx + 68} ${hy + 30} Q${hx + 60} ${hy - 20} ${hx + X * 40 + 20} ${hy - 44} Q${hx + X * 10} ${hy - 36} ${hx - 20 + X * 20} ${hy - 54} Q${hx - 56} ${hy - 30} ${hx - 68} ${hy + 30} Z`,
    bun: `M${hx - 64} ${hy - 6} Q${hx - 68} ${hy - 80} ${hx} ${hy - 82} Q${hx + 68} ${hy - 80} ${hx + 64} ${hy - 6} Q${hx + 50} ${hy - 50} ${hx} ${hy - 52} Q${hx - 50} ${hy - 50} ${hx - 64} ${hy - 6} Z`,
    pony: `M${hx - 64} ${hy - 6} Q${hx - 68} ${hy - 80} ${hx} ${hy - 82} Q${hx + 68} ${hy - 80} ${hx + 64} ${hy - 6} Q${hx + 50} ${hy - 50} ${hx + X * 20} ${hy - 50} Q${hx - 50} ${hy - 48} ${hx - 64} ${hy - 6} Z`, bald: null }[st];
  const hairEl = HR ? S('path', { d: HR, fill: hc }, H) : null;
  if (hairEl) { const c2 = S('g', { 'clip-path': kClip(d, hairEl) }, H); S('ellipse', { cx: hx + 50, cy: hy - 20, rx: 40, ry: 70, fill: hD, opacity: .5 }, c2); S('ellipse', { cx: hx - 20, cy: hy - 70, rx: 30, ry: 10, fill: hL, opacity: .55, transform: `rotate(-12 ${hx - 20} ${hy - 70})` }, c2); }
  return M;
}
// ---------- 3/4 and side views (facing right; o.flip = -1 mirrors). Same parts, colours, shading and ids as the front view ----------
function _kBeanTurn(par, x, y, s, id, o) {
  const side = o.view === 'side', sk = o.skin || '#f3cfb3', skD = kDark(sk, .22), skL = kLite(sk, .35);
  const hc = o.hair || '#5a3a26', hD = kDark(hc, .3), hL = kLite(hc, .3), top = o.top || '#3a7bd5', pants = o.pants || '#2b2f4a', shoe = o.shoes || '#1b1d2e';
  const f = o.sex === 'f', st = o.hairStyle === 'curly' ? 'short' : o.hairStyle || (f ? 'long' : 'short'), d = kDefs(par);   // curly was dropped
  const O = S('g', { transform: `translate(${x},${y}) scale(${s * (o.flip || 1)},${s})` }, par), M = S('g', { id: id + 'B' }, O);
  S('ellipse', { cx: 6, cy: 2, rx: 82, ry: 12, fill: 'rgba(0,0,0,.28)' }, M);
  const leg = (lx, idl, far) => { const g = S('g', { id: id + idl }, M); S('rect', { x: lx - 17, y: -158, width: 34, height: 150, rx: 16, fill: far ? kDark(pants, .25) : pants }, g);
    S('path', { d: `M${lx - 18} -8 Q${lx - 18} -26 ${lx} -26 Q${lx + 30} -26 ${lx + 36} -8 Q${lx + 36} 2 ${lx + 22} 2 L${lx - 12} 2 Q${lx - 18} 2 ${lx - 18} -8 Z`, fill: far ? kDark(shoe, .2) : shoe }, g); return g; };
  const arm = (sx, hx2, idl, far) => { const g = S('g', { id: id + idl }, M), c = far ? kDark(top, .28) : top;
    S('path', { d: `M${sx} -318 Q${(sx + hx2) / 2 + 6} -250 ${hx2} -196`, stroke: c, 'stroke-width': 32, fill: 'none', 'stroke-linecap': 'round' }, g); kBall(g, hx2, -182, 17, far ? skD : sk, null, null, null); return g; };
  // legs, far arm
  if (side) { leg(-2, 'lF', true); leg(12, 'lN'); } else { leg(-12, 'lF', true); arm(-48, -44, 'aF', true); leg(24, 'lN'); }
  // torso
  const tw = side ? 46 : 64, ox = side ? 4 : 6;
  const tD = `M${ox - tw} -300 Q${ox - tw - 4} -352 ${ox - tw * .45} -356 L${ox + tw * .45} -356 Q${ox + tw + 4} -352 ${ox + tw} -300 L${ox + tw * .9} -168 Q${ox + tw * .85} -146 ${ox + tw * .6} -146 L${ox - tw * .6} -146 Q${ox - tw * .85} -146 ${ox - tw * .9} -168 Z`;
  const T = S('g', {}, M), tc = o.coat || top, tp = S('path', { d: tD, fill: tc }, T), tcl = S('g', { 'clip-path': kClip(d, tp) }, T);
  S('ellipse', { cx: ox + tw * 1.05, cy: -230, rx: tw * .55, ry: 150, fill: kDark(tc, .35), opacity: .45 }, tcl); S('ellipse', { cx: ox - tw * .55, cy: -340, rx: tw * .35, ry: 16, fill: kLite(tc, .4), opacity: .45 }, tcl);
  const nx = ox + (side ? 22 : 16);
  if (o.coat) S('path', { d: `M${nx - (side ? 6 : 16)} -354 L${nx + (side ? 20 : 22)} -354 L${nx + (side ? 16 : 18)} -150 L${nx - (side ? 4 : 12)} -150 Z`, fill: top }, T);
  S('path', { d: `M${nx - (side ? 12 : 18)} -356 Q${nx} -336 ${nx + (side ? 12 : 18)} -356`, fill: skD, opacity: .9 }, T);
  S('rect', { x: ox - tw * .9, y: -176, width: tw * 1.8, height: 12, rx: 6, fill: 'rgba(0,0,0,.14)' }, T);
  if (side) arm(8, 16, 'aN'); else arm(ox + tw - 6, ox + tw, 'aN');
  // neck + head
  S('rect', { x: side ? -8 : 0, y: -378, width: 28, height: 30, rx: 10, fill: skD }, M);
  const H = S('g', { id: id + 'H' }, M), hy = -436, hx = side ? 0 : 6;
  // ---- hair behind the head
  if (st === 'long') { const lk = side ? S('path', { d: `M${hx - 10} ${hy - 60} Q${hx - 88} ${hy - 50} ${hx - 84} ${hy + 60} Q${hx - 82} ${hy + 140} ${hx - 54} ${hy + 168} Q${hx - 26} ${hy + 150} ${hx - 30} ${hy + 70} Q${hx - 26} ${hy + 20} ${hx - 6} ${hy - 6} Z`, fill: kDark(hc, .1) }, H)
      : S('path', { d: `M${hx - 64} ${hy - 30} Q${hx - 80} ${hy + 60} ${hx - 90} ${hy + 160} Q${hx - 68} ${hy + 178} ${hx - 44} ${hy + 160} Q${hx - 40} ${hy + 110} ${hx - 34} ${hy + 64} L${hx + 4} ${hy + 30} L${hx + 40} ${hy + 70} Q${hx + 44} ${hy + 110} ${hx + 50} ${hy + 156} Q${hx + 70} ${hy + 170} ${hx + 84} ${hy + 152} Q${hx + 76} ${hy + 60} ${hx + 64} ${hy - 30} Z`, fill: kDark(hc, .1) }, H);
    const lc = S('g', { 'clip-path': kClip(d, lk) }, H); S('ellipse', { cx: hx - 56, cy: hy + 110, rx: 14, ry: 70, fill: hD, opacity: .45 }, lc); }
  if (st === 'pony') { const bx = hx - (side ? 56 : 50), pt = S('path', { d: `M${bx} ${hy - 50} Q${bx - 70} ${hy - 40} ${bx - 58} ${hy + 40} Q${bx - 50} ${hy + 100} ${bx - 26} ${hy + 140} Q${bx - 24} ${hy + 70} ${bx - 10} ${hy + 20} Q${bx - 2} ${hy - 10} ${bx + 10} ${hy - 30} Z`, fill: hc }, H);
    const pc = S('g', { 'clip-path': kClip(d, pt) }, H); S('ellipse', { cx: bx - 20, cy: hy + 40, rx: 14, ry: 90, fill: hD, opacity: .5 }, pc); kBall(H, bx - 4, hy - 46, 10, top, kDark(top, .3), kLite(top, .4)); }
  if (st === 'bun') kBall(H, hx - (side ? 46 : 26), hy - (side ? 62 : 72), 28, hc, hD, hL);
  // ---- head
  const hd = side ? `M${hx - 64} ${hy} Q${hx - 66} ${hy - 72} ${hx} ${hy - 74} Q${hx + 62} ${hy - 72} ${hx + 66} ${hy - 4} Q${hx + 68} ${hy + 44} ${hx + 44} ${hy + 66} Q${hx + 14} ${hy + 80} ${hx - 24} ${hy + 70} Q${hx - 62} ${hy + 54} ${hx - 64} ${hy} Z`
    : `M${hx - 64} ${hy} Q${hx - 66} ${hy - 72} ${hx} ${hy - 74} Q${hx + 66} ${hy - 72} ${hx + 66} ${hy} Q${hx + 66} ${hy + 50} ${hx + 34} ${hy + 68} Q${hx + 4} ${hy + 78} ${hx - 30} ${hy + 68} Q${hx - 62} ${hy + 52} ${hx - 64} ${hy} Z`;
  const hp = S('path', { d: hd, fill: sk }, H), hcl = S('g', { 'clip-path': kClip(d, hp) }, H);
  S('ellipse', { cx: hx + 70, cy: hy + 26, rx: 30, ry: 84, fill: skD, opacity: .24 }, hcl); S('ellipse', { cx: hx - 22, cy: hy - 40, rx: 26, ry: 16, fill: skL, opacity: .5 }, hcl);
  if (st !== 'long' || side) { const ex = side ? hx - 16 : hx - 46; S('ellipse', { cx: ex, cy: hy + 8, rx: side ? 12 : 10, ry: 15, fill: kMix(sk, skD, .35) }, H); S('ellipse', { cx: ex + 2, cy: hy + 9, rx: 5, ry: 8, fill: skD, opacity: .7 }, H); }   // ear on the back side
  // ---- face
  const fc = hx + (side ? 40 : 22), gp = 23;
  const eyes = side ? [[fc, .72]] : [[fc - gp, 1], [fc + gp, .78]];
  S('ellipse', { cx: side ? fc - 6 : fc - 34, cy: hy + 28, rx: 10, ry: 6, fill: '#ff8f8f', opacity: .14 }, H); if (!side) S('ellipse', { cx: fc + 36, cy: hy + 28, rx: 7, ry: 5, fill: '#ff8f8f', opacity: .12 }, H);
  const E = S('g', { id: id + 'E' }, H);
  eyes.forEach(([cx, k]) => { S('ellipse', { cx, cy: hy + 4, rx: 9.5 * k, ry: 12, fill: '#fbf8f4' }, E); S('ellipse', { cx: cx + 2.5 * k, cy: hy + 5, rx: 6.5 * k, ry: 8.5, fill: '#2a1d1a' }, E); S('circle', { cx: cx + 2.5 * k - 2, cy: hy + 1, r: 2.4, fill: '#fff' }, E); });
  if (f) { const [lx2, lk2] = eyes[eyes.length - 1]; S('path', { d: `M${lx2 + 7 * lk2} ${hy - 6} L${lx2 + 14 * lk2} ${hy - 11} M${lx2 + 9 * lk2} ${hy - 2} L${lx2 + 16 * lk2} ${hy - 4}`, stroke: '#2a1d1a', 'stroke-width': 3, 'stroke-linecap': 'round' }, E);
    if (!side) S('path', { d: `M${fc - gp - 7} ${hy - 6} L${fc - gp - 15} ${hy - 11} M${fc - gp - 9} ${hy - 2} L${fc - gp - 17} ${hy - 4}`, stroke: '#2a1d1a', 'stroke-width': 3, 'stroke-linecap': 'round' }, E); }
  const bc = kDark(hc, .15); eyes.forEach(([cx, k], i) => S('path', { id: id + (i ? 'bR' : side ? 'bR' : 'bL'), d: `M${cx - 12 * k} ${hy - 16} Q${cx} ${hy - 24} ${cx + 12 * k} ${hy - 17}`, stroke: bc, 'stroke-width': 4.5, fill: 'none', 'stroke-linecap': 'round' }, H));
  if (!side) S('path', { d: `M${fc + 8} ${hy + 10} Q${fc + 18} ${hy + 26} ${fc + 6} ${hy + 30}`, stroke: skD, 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round', opacity: .8 }, H);
  const mx = side ? fc + 8 : fc + 6, mw = side ? 8 : 12;
  S('path', { id: id + 'mS', d: `M${mx - mw} ${hy + 44} Q${mx} ${hy + 53} ${mx + mw} ${hy + 44}`, stroke: '#8f3f36', 'stroke-width': 3.6, fill: 'none', 'stroke-linecap': 'round' }, H);
  S('ellipse', { id: id + 'mO', cx: mx, cy: hy + 47, rx: 7, ry: 7, fill: '#6e2630', opacity: 0 }, H);
  if (o.glasses) { eyes.forEach(([gx, k]) => S('rect', { x: gx - 17 * k, y: hy - 10, width: 34 * k, height: 28, rx: 10 * k, fill: '#fff', 'fill-opacity': .12, stroke: '#1d2333', 'stroke-width': 3.5 }, H));
    S('path', { d: side ? `M${fc - 12} ${hy + 2} L${hx - 6} ${hy + 4}` : `M${fc - gp - 17} ${hy + 2} L${hx - 44} ${hy + 4}`, stroke: '#1d2333', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, H); }
  // ---- hair in front (volume toward the back of the head)
  const HR = side ? {
      short: `M${hx + 60} ${hy - 30} Q${hx + 40} ${hy - 52} ${hx + 10} ${hy - 48} Q${hx + 2} ${hy - 40} ${hx + 2} ${hy - 26} L${hx + 12} ${hy - 4} L${hx + 2} ${hy - 2} Q${hx - 8} ${hy - 22} ${hx - 22} ${hy - 22} Q${hx - 36} ${hy - 20} ${hx - 34} ${hy + 30} Q${hx - 48} ${hy + 50} ${hx - 62} ${hy + 28} Q${hx - 74} ${hy - 80} ${hx + 4} ${hy - 84} Q${hx + 64} ${hy - 80} ${hx + 60} ${hy - 30} Z`,
      long: `M${hx + 62} ${hy - 28} Q${hx + 40} ${hy - 54} ${hx + 6} ${hy - 48} Q${hx - 14} ${hy - 20} ${hx - 16} ${hy + 20} Q${hx - 40} ${hy + 40} ${hx - 66} ${hy + 30} Q${hx - 76} ${hy - 82} ${hx + 4} ${hy - 84} Q${hx + 66} ${hy - 80} ${hx + 62} ${hy - 28} Z`,
      pony: `M${hx + 60} ${hy - 30} Q${hx + 40} ${hy - 54} ${hx + 8} ${hy - 50} Q${hx - 30} ${hy - 44} ${hx - 52} ${hy - 6} Q${hx - 70} ${hy - 30} ${hx - 64} ${hy - 50} Q${hx - 50} ${hy - 84} ${hx + 4} ${hy - 84} Q${hx + 62} ${hy - 80} ${hx + 60} ${hy - 30} Z`,
      bun: `M${hx + 60} ${hy - 30} Q${hx + 40} ${hy - 54} ${hx + 8} ${hy - 50} Q${hx - 30} ${hy - 44} ${hx - 52} ${hy - 6} Q${hx - 70} ${hy - 30} ${hx - 64} ${hy - 50} Q${hx - 50} ${hy - 84} ${hx + 4} ${hy - 84} Q${hx + 62} ${hy - 80} ${hx + 60} ${hy - 30} Z` }
    : {
      short: `M${hx - 66} ${hy + 2} Q${hx - 74} ${hy - 80} ${hx + 4} ${hy - 84} Q${hx + 72} ${hy - 82} ${hx + 66} ${hy - 8} Q${hx + 54} ${hy - 46} ${hx + 30} ${hy - 48} Q${hx + 6} ${hy - 40} ${hx - 14} ${hy - 52} Q${hx - 26} ${hy - 44} ${hx - 28} ${hy - 30} L${hx - 26} ${hy + 0} Q${hx - 32} ${hy + 6} ${hx - 38} ${hy} L${hx - 40} ${hy - 22} Q${hx - 52} ${hy - 22} ${hx - 58} ${hy - 10} Q${hx - 56} ${hy + 20} ${hx - 60} ${hy + 34} Q${hx - 66} ${hy + 20} ${hx - 66} ${hy + 2} Z`,
      long: `M${hx - 70} ${hy + 30} Q${hx - 78} ${hy - 82} ${hx + 4} ${hy - 84} Q${hx + 76} ${hy - 80} ${hx + 68} ${hy + 20} Q${hx + 60} ${hy - 24} ${hx + 40} ${hy - 44} Q${hx + 16} ${hy - 36} ${hx - 4} ${hy - 54} Q${hx - 50} ${hy - 30} ${hx - 70} ${hy + 30} Z`,
      pony: `M${hx - 64} ${hy - 2} Q${hx - 68} ${hy - 80} ${hx + 4} ${hy - 82} Q${hx + 70} ${hy - 80} ${hx + 66} ${hy - 6} Q${hx + 50} ${hy - 50} ${hx + 24} ${hy - 50} Q${hx - 40} ${hy - 48} ${hx - 64} ${hy - 2} Z`,
      bun: `M${hx - 64} ${hy - 2} Q${hx - 68} ${hy - 80} ${hx + 4} ${hy - 82} Q${hx + 70} ${hy - 80} ${hx + 66} ${hy - 6} Q${hx + 50} ${hy - 50} ${hx + 24} ${hy - 50} Q${hx - 40} ${hy - 48} ${hx - 64} ${hy - 2} Z` };
  const hairEl = HR[st] ? S('path', { d: HR[st], fill: hc }, H) : null;
  if (hairEl) { const c2 = S('g', { 'clip-path': kClip(d, hairEl) }, H); S('ellipse', { cx: hx - 40, cy: hy - 10, rx: 36, ry: 70, fill: hD, opacity: .45 }, c2); S('ellipse', { cx: hx, cy: hy - 70, rx: 30, ry: 10, fill: hL, opacity: .55, transform: `rotate(-12 ${hx} ${hy - 70})` }, c2); }
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
