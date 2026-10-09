// ===================== KURZ MASCOTS (load AFTER kurz.js + neon.js): original host characters for the neon Kurz look =====================
// Our own designs (NOT Kurzgesagt's birds): Axo (pink axolotl), Glim (one-eyed jelly blob with a glowing antenna), Pip (round fox-cat).
// All: (par, x, feetY, s, id, o) ~ 400 px tall at s=1, flat + shaded, no outlines, big eyes.
// o = { mood: 'happy' | 'shock' | 'meh' | 'neutral', col (main colour), flip: -1 (face left) }
// ids: id+'B' whole (move/bob), id+'E' open eyes, id+'eH' happy eyes (^^), id+'mS' smile, id+'mO' open mouth, id+'mF' flat mouth, id+'aL'/'aR' arms.
// Timeline: nMOOD(id, t, mood), nHOP(id, t), nWAVE(id, t), nTALKM(id, t0, t1) (mouth flaps).

function _mFace(g, id, eyes, mx, my, o, eyeCol = '#1b1240', mw = 20) {   // shared eyes + mouths; eyes = [[x, y, r, sx]]
  const E = S('g', { id: id + 'E' }, g), H = S('g', { id: id + 'eH', opacity: 0 }, g);
  eyes.forEach(([x, y, er, sx = 1]) => { S('ellipse', { cx: x, cy: y, rx: er * sx, ry: er * 1.15, fill: eyeCol }, E); S('circle', { cx: x - er * .32 * sx, cy: y - er * .4, r: er * .36 * Math.max(.7, sx), fill: '#ffffff' }, E); S('circle', { cx: x + er * .35 * sx, cy: y + er * .3, r: er * .15, fill: '#ffffff', opacity: .8 }, E);
    S('path', { d: `M${x - er * .9 * sx} ${y + er * .2} Q${x} ${y - er * 1.1} ${x + er * .9 * sx} ${y + er * .2}`, stroke: eyeCol, 'stroke-width': er * .38, fill: 'none', 'stroke-linecap': 'round' }, H); });
  S('path', { id: id + 'mS', d: `M${mx - mw} ${my} Q${mx} ${my + 18} ${mx + mw} ${my}`, stroke: eyeCol, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, g);
  const mO = S('g', { id: id + 'mO', opacity: 0 }, g); S('ellipse', { cx: mx, cy: my + 8, rx: 15, ry: 19, fill: '#3a0a2a' }, mO); S('ellipse', { cx: mx, cy: my + 18, rx: 9, ry: 6, fill: '#ff5d8f' }, mO);
  S('path', { id: id + 'mF', d: `M${mx - mw * .8} ${my + 6} L${mx + mw * .8} ${my + 6}`, stroke: eyeCol, 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0 }, g);
  _mSet(id, o.mood || 'happy', g);
}
// view helper: o.view 'front' | '3q' | 'side'; facing right by default, o.flip = -1 faces left (the whole drawing is mirrored)
function _mSet(id, m, root) { const q = k => (root || document).querySelector('#' + id + k); if (!q('E')) return;
  const on = { happy: ['eH', 'mS'], shock: ['E', 'mO'], meh: ['E', 'mF'], neutral: ['E', 'mS'] }[m] || ['E', 'mS'];
  ['E', 'eH', 'mS', 'mO', 'mF'].forEach(k => q(k).setAttribute('opacity', on.includes(k) ? 1 : 0));
  q('E').setAttribute('transform', m === 'meh' ? 'scale(1 .55)' : ''); q('E').style.transformBox = 'fill-box'; q('E').style.transformOrigin = '50% 50%';
  if (m === 'shock') q('E').setAttribute('transform', ''); }

// soft shading for mascots: light top-left -> base -> darker rim (no hard diagonal split)
const _mFill = (d, c, lx = '35%', ly = '28%') => kRG(d, [[0, kLite(c, .4)], [.55, c], [1, kDark(c, .28)]], lx, ly, '78%');
// gill frond from (bx, by) at angle a (deg), length L, width w
function _mGill(g, bx, by, a, L, w, col) { const [tx, ty] = kPt(bx, by, L, a), [p1x, p1y] = kPt(bx, by, w, a + 90), [p2x, p2y] = kPt(bx, by, w, a - 90);
  S('path', { d: `M${p1x} ${p1y} L${tx} ${ty} L${p2x} ${p2y} Z`, fill: col, stroke: col, 'stroke-width': w * 1.4, 'stroke-linejoin': 'round' }, g); kBall(g, tx, ty, w * .8, kLite(col, .3)); }

// ---------- Axo: pink axolotl. Each view is its own drawing (front / 3q / side), facing right; o.flip = -1 faces left ----------
function nAxo(par, x, y, s, id, o = {}) { const c = o.col || '#ff9ec7', gc = o.gill || '#ff3d9a', d = kDefs(par), v = o.view || 'front', cD = kDark(c, .22);
  const O = S('g', { transform: `translate(${x},${y}) scale(${s * (o.flip || 1)},${s})` }, par), M = S('g', { id: id + 'B' }, O);
  const belly = kLite(c, .5), arm = (k, ax, ay, rot, col) => { const a = S('g', { id: id + k }, M); S('ellipse', { cx: ax, cy: ay, rx: 20, ry: 38, fill: col, transform: `rotate(${rot} ${ax} ${ay})` }, a); return a; };
  if (v === 'side') {
    S('ellipse', { cx: -30, cy: 4, rx: 170, ry: 16, fill: '#000', opacity: .3 }, M);
    S('path', { d: 'M-80 -150 Q-200 -170 -290 -120 Q-200 -70 -80 -70 Z', fill: c }, M); S('path', { d: 'M-90 -150 Q-200 -175 -285 -122 Q-200 -150 -110 -128 Z', fill: kLite(gc, .35), opacity: .8 }, M);   // tail + fin
    [[-70, cD], [40, cD]].forEach(([lx, col]) => S('ellipse', { cx: lx - 18, cy: -14, rx: 30, ry: 18, fill: kDark(c, .3) }, M));   // far legs
    S('ellipse', { cx: -10, cy: -105, rx: 120, ry: 82, fill: _mFill(d, c) }, M); S('ellipse', { cx: 20, cy: -62, rx: 82, ry: 34, fill: belly, opacity: .85 }, M);
    [-60, 52].forEach(lx => S('ellipse', { cx: lx, cy: -14, rx: 32, ry: 19, fill: cD }, M));   // near legs
    arm('aR', 70, -88, -35, cD);
    const H = S('g', { id: id + 'H' }, M);
    [[205, .7], [175, .9], [145, .75]].forEach(([a, k], n) => _mGill(H, -10, -330 + n * 4, a + 20, 70 * k, 13 * k, kDark(gc, .25)));   // far side, behind the head
    [[150, .95], [180, 1.1], [210, .95]].forEach(([a, k]) => _mGill(H, -30, -262, a, 92 * k, 17, gc));
    S('path', { d: 'M-70 -255 Q-72 -360 45 -362 Q178 -356 190 -262 Q196 -172 92 -160 Q-60 -150 -70 -255 Z', fill: _mFill(d, c, '45%', '25%') }, H);
    S('ellipse', { cx: 112, cy: -222, rx: 18, ry: 10, fill: '#ff5d8f', opacity: .45 }, H);
    _mFace(H, id, [[118, -280, 22, .8]], 160, -210, o, '#1b1240', 13);
  } else if (v === '3q') {
    S('ellipse', { cx: -20, cy: 4, rx: 135, ry: 16, fill: '#000', opacity: .3 }, M);
    S('path', { d: 'M-50 -70 Q-200 -50 -250 -150 Q-170 -95 -60 -125 Z', fill: kDark(c, .1) }, M);
    S('ellipse', { cx: -50, cy: -16, rx: 26, ry: 16, fill: kDark(c, .32) }, M); arm('aL', -95, -120, 25, kDark(c, .3));   // far leg + far arm
    S('ellipse', { cx: 0, cy: -110, rx: 102, ry: 100, fill: _mFill(d, c) }, M); S('ellipse', { cx: 34, cy: -88, rx: 48, ry: 60, fill: belly, opacity: .85 }, M);
    S('ellipse', { cx: 42, cy: -14, rx: 32, ry: 19, fill: cD }, M); arm('aR', 92, -112, -28, cD);
    const H = S('g', { id: id + 'H' }, M);
    [[-60, .8], [-25, .9], [10, .8]].forEach(([a, k]) => _mGill(H, 120, -330, a, 72 * k, 13 * k, kDark(gc, .22)));   // far-side gills, peeking above-right behind the head
    [[-148, 1], [180, 1.1], [148, 1]].forEach(([a, k]) => _mGill(H, -95, -300, a, 90 * k, 17, gc));
    S('ellipse', { cx: 25, cy: -290, rx: 142, ry: 110, fill: _mFill(d, c, '40%', '25%') }, H);
    S('ellipse', { cx: 20, cy: -255, rx: 25, ry: 13, fill: '#ff5d8f', opacity: .45 }, H); S('ellipse', { cx: 138, cy: -258, rx: 15, ry: 11, fill: '#ff5d8f', opacity: .4 }, H);
    _mFace(H, id, [[40, -298, 22, .95], [128, -298, 18, .72]], 92, -250, o, '#1b1240', 17);   // near eye (left) big, far eye (right) foreshortened
  } else {
    S('ellipse', { cx: 0, cy: 4, rx: 115, ry: 16, fill: '#000', opacity: .3 }, M);
    S('path', { d: 'M-70 -60 Q-150 -40 -170 -110 Q-130 -80 -80 -100 Z', fill: kDark(c, .14) }, M);   // tail peeks out behind
    S('ellipse', { cx: 0, cy: -110, rx: 100, ry: 100, fill: _mFill(d, c) }, M); S('ellipse', { cx: 0, cy: -88, rx: 58, ry: 62, fill: belly, opacity: .85 }, M);
    [-40, 40].forEach(dx => S('ellipse', { cx: dx, cy: -14, rx: 30, ry: 18, fill: cD }, M));
    arm('aL', -100, -118, 25, cD); arm('aR', 100, -118, -25, cD);
    const H = S('g', { id: id + 'H' }, M);
    [-1, 1].forEach(sd => [-36, 0, 36].forEach(a => _mGill(H, sd * 125, -300, (sd > 0 ? 0 : 180) + sd * a, 90 - Math.abs(a) * .4, 17, gc)));
    S('ellipse', { cx: 0, cy: -290, rx: 150, ry: 112, fill: _mFill(d, c, '40%', '25%') }, H);
    [-1, 1].forEach(sd => S('ellipse', { cx: sd * 92, cy: -258, rx: 24, ry: 13, fill: '#ff5d8f', opacity: .45 }, H));
    _mFace(H, id, [[-62, -300, 22], [62, -300, 22]], 0, -252, o);
  }
  return M; }

// ---------- Glim: one-eyed teal jelly blob, glowing antenna bulb, little tentacle feet (front / 3q / side) ----------
function nGlim(par, x, y, s, id, o = {}) { const c = o.col || '#2de0c2', d = kDefs(par), v = o.view || 'front', cD = kDark(c, .15);
  const O = S('g', { transform: `translate(${x},${y}) scale(${s * (o.flip || 1)},${s})` }, par), M = S('g', { id: id + 'B' }, O);
  S('ellipse', { cx: 0, cy: 4, rx: 120, ry: 16, fill: '#000', opacity: .3 }, M);
  const antenna = (bx0, tipx) => { S('path', { d: `M${bx0} -325 Q${bx0 - 15} -395 ${tipx} -420`, stroke: kDark(c, .25), 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round' }, M); kGlow(M, tipx, -424, 60, NPAL.yel, .8); kBall(M, tipx, -424, 20, NPAL.yel, '#e0a630', '#fff6cf'); };
  const arm = (k, sd, col, sw = 1) => { const a = S('g', { id: id + k }, M); S('path', { d: `M${sd * 110} -150 Q${sd * 170 * sw} -130 ${sd * 160 * sw} -80`, stroke: col, 'stroke-width': 30, fill: 'none', 'stroke-linecap': 'round' }, a); };
  const feet = xs => xs.forEach((dx, k) => S('ellipse', { cx: dx, cy: -12, rx: 26, ry: 22, fill: kDark(c, .18 + (k % 2) * .06) }, M));
  const shine = (cx, cy) => S('ellipse', { cx, cy, rx: 24, ry: 38, fill: '#ffffff', opacity: .28, transform: `rotate(25 ${cx} ${cy})` }, M);
  if (v === 'side') {   // profile: straight back, belly bulging forward, the eye sits on the front edge and bulges out of the outline
    antenna(-40, -95); feet([-60, -15, 30, 70]);
    S('path', { d: 'M-95 -20 Q-115 -300 0 -335 Q140 -315 140 -190 Q150 -60 105 -20 Q80 0 55 -18 Q25 4 0 -18 Q-30 4 -55 -18 Q-80 0 -95 -20 Z', fill: _mFill(d, c, '30%', '25%') }, M);
    shine(-35, -250); { const a = S('g', { id: id + 'aR' }, M); S('path', { d: 'M30 -128 Q82 -108 76 -58', stroke: kDark(c, .3), 'stroke-width': 26, fill: 'none', 'stroke-linecap': 'round' }, a); }
    const H = S('g', { id: id + 'H' }, M); S('ellipse', { cx: 108, cy: -195, rx: 42, ry: 62, fill: '#ffffff' }, H);
    _mFace(H, id, [[122, -195, 30, .55]], 112, -92, o, '#1b1240', 12);
  } else if (v === '3q') {
    antenna(-20, -55); arm('aL', -1, kDark(c, .3), .85); feet([-70, -22, 26, 76]);
    S('path', { d: 'M-118 -20 Q-140 -300 5 -335 Q150 -305 132 -20 Q95 0 62 -18 Q30 4 0 -18 Q-30 4 -60 -18 Q-90 0 -118 -20 Z', fill: _mFill(d, c, '32%', '25%') }, M);
    shine(-62, -250); arm('aR', 1, cD, 1.02);
    const H = S('g', { id: id + 'H' }, M); S('ellipse', { cx: 42, cy: -192, rx: 54, ry: 64, fill: '#ffffff' }, H);
    _mFace(H, id, [[50, -192, 34, .8]], 48, -92, o, '#1b1240', 16);
  } else {
    antenna(0, 42); arm('aL', -1, cD); arm('aR', 1, cD); feet([-75, -25, 25, 75]);
    S('path', { d: 'M-125 -20 Q-150 -300 0 -335 Q150 -300 125 -20 Q90 0 60 -18 Q30 4 0 -18 Q-30 4 -60 -18 Q-90 0 -125 -20 Z', fill: _mFill(d, c) }, M);
    shine(-60, -250);
    const H = S('g', { id: id + 'H' }, M); S('circle', { cx: 0, cy: -190, r: 66, fill: '#ffffff' }, H);
    _mFace(H, id, [[0, -190, 36]], 0, -92, o);
  }
  return M; }

// ---------- Pip: round orange fox-cat, big ears, fluffy white-tipped tail ----------
function nPip(par, x, y, s, id, o = {}) { const c = o.col || '#ff8a3d', cr = '#fff1dc', d = kDefs(par);
  const O = S('g', { transform: `translate(${x},${y}) scale(${s * (o.flip || 1)},${s})` }, par), M = S('g', { id: id + 'B' }, O);
  S('ellipse', { cx: 0, cy: 4, rx: 110, ry: 16, fill: '#000', opacity: .3 }, M);
  const tl2 = S('path', { d: 'M80 -60 Q230 -60 210 -220 Q180 -300 140 -250 Q190 -140 70 -120 Z', fill: c }, M); kShade(M, tl2, kDark(c, .3), kLite(c, .4));
  S('path', { d: 'M210 -220 Q180 -300 140 -250 Q170 -235 200 -195 Z', fill: cr }, M);
  [-1, 1].forEach(sd => { S('path', { d: `M${sd * 70} -280 L${sd * 110} -410 L${sd * 150} -250 Z`, fill: c, stroke: c, 'stroke-width': 24, 'stroke-linejoin': 'round' }, M); S('path', { d: `M${sd * 88} -285 L${sd * 110} -370 L${sd * 132} -268 Z`, fill: '#ff9fb8', stroke: '#ff9fb8', 'stroke-width': 10, 'stroke-linejoin': 'round' }, M); });
  [-45, 45].forEach(dx => S('ellipse', { cx: dx, cy: -12, rx: 34, ry: 20, fill: kDark(c, .25) }, M));
  const body = S('circle', { cx: 0, cy: -170, r: 150, fill: c }, M); kShade(M, body, kDark(c, .3), kLite(c, .45));
  S('path', { d: 'M-110 -150 Q-60 -40 0 -40 Q60 -40 110 -150 Q60 -110 0 -125 Q-60 -110 -110 -150 Z', fill: cr }, M);
  S('ellipse', { cx: 0, cy: -95, rx: 70, ry: 52, fill: cr }, M);
  [['aL', -1], ['aR', 1]].forEach(([k, sd]) => { const a = S('g', { id: id + k }, M); S('ellipse', { cx: sd * 120, cy: -100, rx: 26, ry: 36, fill: kDark(c, .12) }, a); });
  [-1, 1].forEach(sd => S('ellipse', { cx: sd * 92, cy: -150, rx: 22, ry: 12, fill: '#ff5d8f', opacity: .4 }, M));
  S('path', { d: 'M-12 -158 Q0 -148 12 -158 Q0 -142 -12 -158 Z', fill: '#3a1a10', stroke: '#3a1a10', 'stroke-width': 8, 'stroke-linejoin': 'round' }, M);
  _mFace(M, id, [[-52, -195, 24], [52, -195, 24]], 0, -132, o, '#2a140c');
  return M; }

// ---------- timeline beats ----------
function nMOOD(id, t, m) { const on = { happy: ['eH', 'mS'], shock: ['E', 'mO'], meh: ['E', 'mF'], neutral: ['E', 'mS'] }[m] || ['E', 'mS'];
  ['E', 'eH', 'mS', 'mO', 'mF'].forEach(k => tl.set('#' + id + k, { opacity: on.includes(k) ? 1 : 0 }, t));
  tl.to('#' + id + 'E', { scaleY: m === 'meh' ? .55 : 1, scale: m === 'shock' ? 1.2 : 1, transformOrigin: '50% 50%', duration: .2 }, t);
  if (m === 'shock') tl.fromTo('#' + id + 'B', { y: 0 }, { y: -30, duration: .15, yoyo: true, repeat: 1, ease: 'power2.out' }, t); B(t); }
const nHOP = (id, t, h = 50) => { tl.fromTo('#' + id + 'B', { y: 0 }, { y: -h, duration: .22, yoyo: true, repeat: 1, ease: 'power2.out' }, t); B(t); };
const nWAVE = (id, t, n = 3) => { tl.to('#' + id + 'aR', { rotation: -40, transformOrigin: '50% 100%', duration: .18, yoyo: true, repeat: n * 2 - 1, ease: 'sine.inOut' }, t); B(t); };
function nTALKM(id, t0, t1) { const n = Math.max(1, Math.round((t1 - t0) / .24)); for (let k = 0; k < n; k++) { const t = t0 + k * .24; tl.set('#' + id + 'mO', { opacity: 1, scaleY: .6 + (k % 3) * .2, transformOrigin: '50% 0%' }, t); tl.set('#' + id + 'mS', { opacity: 0 }, t); tl.set('#' + id + 'mO', { opacity: 0 }, t + .14); tl.set('#' + id + 'mS', { opacity: 1 }, t + .14); } B(t0); }
