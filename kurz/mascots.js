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
const _mV = o => ({ front: 0, '3q': .55, side: 1 })[o.view || 'front'] ?? 0;
function _mSet(id, m, root) { const q = k => (root || document).querySelector('#' + id + k); if (!q('E')) return;
  const on = { happy: ['eH', 'mS'], shock: ['E', 'mO'], meh: ['E', 'mF'], neutral: ['E', 'mS'] }[m] || ['E', 'mS'];
  ['E', 'eH', 'mS', 'mO', 'mF'].forEach(k => q(k).setAttribute('opacity', on.includes(k) ? 1 : 0));
  q('E').setAttribute('transform', m === 'meh' ? 'scale(1 .55)' : ''); q('E').style.transformBox = 'fill-box'; q('E').style.transformOrigin = '50% 50%';
  if (m === 'shock') q('E').setAttribute('transform', ''); }

// ---------- Axo: pink axolotl with magenta gill fronds (views: front, 3q, side) ----------
function nAxo(par, x, y, s, id, o = {}) { const c = o.col || '#ff9ec7', gc = o.gill || '#ff3d9a', V = _mV(o);
  const O = S('g', { transform: `translate(${x},${y}) scale(${s * (o.flip || 1)},${s})` }, par), M = S('g', { id: id + 'B' }, O);
  const hx = V * 40, hrx = 150 - V * 22;   // head shifts forward and narrows as it turns
  S('ellipse', { cx: -V * 30, cy: 4, rx: 110 + V * 40, ry: 16, fill: '#000', opacity: .3 }, M);
  S('path', { d: `M${-60 + V * 10} -60 Q${-200 - V * 40} -40 ${-230 - V * 40} -150 Q${-170 - V * 30} -90 ${-70 + V * 10} -120 Z`, fill: kDark(c, .12) }, M);
  const gill = (sd, a, sc, col) => { const bx0 = hx + sd * (hrx - 22), ang = (sd > 0 ? 0 : 180) + sd * a, L = (92 - Math.abs(a) * .5) * sc, [tx, ty] = kPt(bx0, -300, L, ang), [bx, by] = kPt(bx0, -300, 18 * sc, ang + 90), [cx2, cy2] = kPt(bx0, -300, 18 * sc, ang - 90);
    S('path', { d: `M${bx} ${by} L${tx} ${ty} L${cx2} ${cy2} Z`, fill: col, stroke: col, 'stroke-width': 26 * sc, 'stroke-linejoin': 'round' }, M); kBall(M, tx, ty, 15 * sc, kLite(col, .3)); };
  if (V && V < 1) [-30, 8, 46].forEach(a => gill(1, a - 10, .55, kDark(gc, .25)));   // 3/4: far-side gills peek out behind the head
  [-1, 1].forEach(sd => S('ellipse', { cx: sd * 40 - V * 25, cy: -14, rx: 30, ry: 18, fill: kDark(c, sd < 0 || !V ? .2 : .32) }, M));
  if (V) { const a = S('g', { id: id + 'aL' }, M); S('ellipse', { cx: V * 60, cy: -120, rx: 20, ry: 36, fill: kDark(c, .3), transform: 'rotate(20 60 -120)' }, a); }
  const body = S('ellipse', { cx: -V * 15, cy: -110, rx: 100 - V * 10, ry: 100, fill: c }, M); kShade(M, body, kDark(c, .3), kLite(c, .5));
  S('ellipse', { cx: 6 + V * 30, cy: -90, rx: 58 - V * 18, ry: 62, fill: kLite(c, .45), opacity: .8 }, M);
  [['aL', -1], ['aR', 1]].forEach(([k, sd]) => { if (V && k === 'aL') return; const ax = V ? 50 + V * 20 : sd * 102, a = S('g', { id: id + k }, M); S('ellipse', { cx: ax, cy: -115, rx: 22, ry: 40, fill: kDark(c, .1), transform: `rotate(${V ? -35 : sd * -25} ${ax} -115)` }, a); });
  const H = S('g', { id: id + 'H' }, M);
  if (!V) [-1, 1].forEach(sd => [-38, 0, 38].forEach(a => gill(sd, a, 1, gc))); else [-38, 0, 38].forEach(a => gill(-1, a, 1, gc));   // near-side / back gills
  const head = S('ellipse', { cx: hx, cy: -290, rx: hrx, ry: 112, fill: c }, H); kShade(H, head, kDark(c, .3), kLite(c, .55));
  const fx = hx + V * 70;   // face centre moves toward the facing side
  [-1, 1].forEach(sd => { if (V === 1 && sd < 0) return; S('ellipse', { cx: fx + sd * (92 - V * 40) * (sd < 0 ? 1 - V * .3 : 1), cy: -258, rx: 24 - V * 6, ry: 13, fill: '#ff5d8f', opacity: .45 }, H); });
  const eyes = V === 1 ? [[fx + 18, -300, 22, .75]] : V ? [[fx - 62 + V * 20, -300, 18, .7], [fx + 50, -300, 22, .9]] : [[-62, -300, 22], [62, -300, 22]];
  _mFace(H, id, eyes, fx + V * 30, -252, o, '#1b1240', 20 - V * 6);
  return M; }

// ---------- Glim: one-eyed teal jelly blob, glowing antenna bulb, little tentacle feet (views: front, 3q, side) ----------
function nGlim(par, x, y, s, id, o = {}) { const c = o.col || '#2de0c2', d = kDefs(par), V = _mV(o);
  const O = S('g', { transform: `translate(${x},${y}) scale(${s * (o.flip || 1)},${s})` }, par), M = S('g', { id: id + 'B' }, O);
  S('ellipse', { cx: 0, cy: 4, rx: 120, ry: 16, fill: '#000', opacity: .3 }, M);
  const ax = -V * 30; S('path', { d: `M${ax} -330 Q${ax - 10 - V * 20} -400 ${ax + 30 - V * 70} -420`, stroke: kDark(c, .25), 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round' }, M);
  const bx = ax + 32 - V * 70; kGlow(M, bx, -424, 60, NPAL.yel, .8); kBall(M, bx, -424, 20, NPAL.yel, '#e0a630', '#fff6cf');
  [-75, -25, 25, 75].forEach((dx, k) => S('ellipse', { cx: dx - V * 10, cy: -12, rx: 26, ry: 22, fill: kDark(c, .18 + (k % 2) * .06) }, M));
  [['aL', -1], ['aR', 1]].forEach(([k, sd]) => { const a = S('g', { id: id + k }, M), far = V && sd < 0; S('path', { d: `M${sd * 110} -150 Q${sd * 170} -130 ${sd * 160} -80`, stroke: kDark(c, far ? .3 : .1), 'stroke-width': 30, fill: 'none', 'stroke-linecap': 'round', opacity: far && V === 1 ? 0 : 1 }, a); });
  const body = S('path', { d: 'M-125 -20 Q-150 -300 0 -335 Q150 -300 125 -20 Q90 0 60 -18 Q30 4 0 -18 Q-30 4 -60 -18 Q-90 0 -125 -20 Z', fill: kLG(d, [[0, kLite(c, .35)], [1, c]]) }, M); kShade(M, body, kDark(c, .35), kLite(c, .6));
  S('ellipse', { cx: -60 - V * 20, cy: -250, rx: 26, ry: 40, fill: '#ffffff', opacity: .3, transform: `rotate(25 ${-60 - V * 20} -250)` }, M);
  const H = S('g', { id: id + 'H' }, M), ex = V * 62, sx = 1 - V * .35;   // the eye slides toward the facing side and squashes
  S('ellipse', { cx: ex, cy: -190, rx: 66 * sx, ry: 66, fill: '#ffffff' }, H);
  _mFace(H, id, [[ex + V * 8, -190, 36, sx]], ex + V * 10, -92, o, '#1b1240', 20 - V * 6);
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
