// ===================== KURZ MASCOTS (load AFTER kurz.js + neon.js): original host characters for the neon Kurz look =====================
// Our own designs (NOT Kurzgesagt's birds): Axo (pink axolotl), Glim (one-eyed jelly blob with a glowing antenna), Pip (round fox-cat).
// All: (par, x, feetY, s, id, o) ~ 400 px tall at s=1, flat + shaded, no outlines, big eyes.
// o = { mood: 'happy' | 'shock' | 'meh' | 'neutral', col (main colour), flip: -1 (face left) }
// ids: id+'B' whole (move/bob), id+'E' open eyes, id+'eH' happy eyes (^^), id+'mS' smile, id+'mO' open mouth, id+'mF' flat mouth, id+'aL'/'aR' arms.
// Timeline: nMOOD(id, t, mood), nHOP(id, t), nWAVE(id, t), nTALKM(id, t0, t1) (mouth flaps).

function _mFace(g, id, ex, ey, er, gap, my, o, eyeCol = '#1b1240') {   // shared eyes + mouths
  const E = S('g', { id: id + 'E' }, g), H = S('g', { id: id + 'eH', opacity: 0 }, g);
  (gap ? [-gap, gap] : [0]).forEach(dx => { S('ellipse', { cx: ex + dx, cy: ey, rx: er, ry: er * 1.15, fill: eyeCol }, E); S('circle', { cx: ex + dx - er * .32, cy: ey - er * .4, r: er * .36, fill: '#ffffff' }, E); S('circle', { cx: ex + dx + er * .35, cy: ey + er * .3, r: er * .15, fill: '#ffffff', opacity: .8 }, E);
    S('path', { d: `M${ex + dx - er * .9} ${ey + er * .2} Q${ex + dx} ${ey - er * 1.1} ${ex + dx + er * .9} ${ey + er * .2}`, stroke: eyeCol, 'stroke-width': er * .38, fill: 'none', 'stroke-linecap': 'round' }, H); });
  S('path', { id: id + 'mS', d: `M${ex - 20} ${my} Q${ex} ${my + 18} ${ex + 20} ${my}`, stroke: eyeCol, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, g);
  const mO = S('g', { id: id + 'mO', opacity: 0 }, g); S('ellipse', { cx: ex, cy: my + 8, rx: 15, ry: 19, fill: '#3a0a2a' }, mO); S('ellipse', { cx: ex, cy: my + 18, rx: 9, ry: 6, fill: '#ff5d8f' }, mO);
  S('path', { id: id + 'mF', d: `M${ex - 16} ${my + 6} L${ex + 16} ${my + 6}`, stroke: eyeCol, 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0 }, g);
  _mSet(id, o.mood || 'happy', g);
}
function _mSet(id, m, root) { const q = k => (root || document).querySelector('#' + id + k); if (!q('E')) return;
  const on = { happy: ['eH', 'mS'], shock: ['E', 'mO'], meh: ['E', 'mF'], neutral: ['E', 'mS'] }[m] || ['E', 'mS'];
  ['E', 'eH', 'mS', 'mO', 'mF'].forEach(k => q(k).setAttribute('opacity', on.includes(k) ? 1 : 0));
  q('E').setAttribute('transform', m === 'meh' ? 'scale(1 .55)' : ''); q('E').style.transformBox = 'fill-box'; q('E').style.transformOrigin = '50% 50%';
  if (m === 'shock') q('E').setAttribute('transform', ''); }

// ---------- Axo: pink axolotl with magenta gill fronds ----------
function nAxo(par, x, y, s, id, o = {}) { const c = o.col || '#ff9ec7', gc = o.gill || '#ff3d9a', d = kDefs(par);
  const O = S('g', { transform: `translate(${x},${y}) scale(${s * (o.flip || 1)},${s})` }, par), M = S('g', { id: id + 'B' }, O);
  S('ellipse', { cx: 0, cy: 4, rx: 110, ry: 16, fill: '#000', opacity: .3 }, M);
  const tail = S('path', { d: 'M-60 -60 Q-200 -40 -230 -150 Q-170 -90 -70 -120 Z', fill: kDark(c, .12) }, M);
  [-40, 40].forEach(dx => S('ellipse', { cx: dx, cy: -14, rx: 30, ry: 18, fill: kDark(c, .2) }, M));
  const body = S('ellipse', { cx: 0, cy: -110, rx: 100, ry: 100, fill: c }, M); kShade(M, body, kDark(c, .3), kLite(c, .5));
  S('ellipse', { cx: 6, cy: -90, rx: 58, ry: 62, fill: kLite(c, .45), opacity: .8 }, M);
  [['aL', -1], ['aR', 1]].forEach(([k, sd]) => { const a = S('g', { id: id + k }, M); S('ellipse', { cx: sd * 102, cy: -120, rx: 22, ry: 40, fill: kDark(c, .1), transform: `rotate(${sd * -25} ${sd * 102} -120)` }, a); });
  const H = S('g', {}, M);
  [-1, 1].forEach(sd => [-38, 0, 38].forEach((a, k) => { const ang = (sd > 0 ? 0 : 180) + sd * a, [tx, ty] = kPt(sd * 128, -300, 92 - Math.abs(a) * .5, ang), [bx, by] = kPt(sd * 128, -300, 18, ang + 90), [cx2, cy2] = kPt(sd * 128, -300, 18, ang - 90);
    S('path', { d: `M${bx} ${by} Q${tx} ${ty} ${tx} ${ty} Q${tx} ${ty} ${cx2} ${cy2} Z`, fill: gc, stroke: gc, 'stroke-width': 26, 'stroke-linejoin': 'round' }, H);
    kBall(H, tx, ty, 15, kLite(gc, .3)); }));
  const head = S('ellipse', { cx: 0, cy: -290, rx: 150, ry: 112, fill: c }, H); kShade(H, head, kDark(c, .3), kLite(c, .55));
  [-1, 1].forEach(sd => S('ellipse', { cx: sd * 92, cy: -258, rx: 24, ry: 13, fill: '#ff5d8f', opacity: .45 }, H));
  _mFace(H, id, 0, -300, 22, 62, -252, o);
  return M; }

// ---------- Glim: one-eyed teal jelly blob, glowing antenna bulb, little tentacle feet ----------
function nGlim(par, x, y, s, id, o = {}) { const c = o.col || '#2de0c2', d = kDefs(par);
  const O = S('g', { transform: `translate(${x},${y}) scale(${s * (o.flip || 1)},${s})` }, par), M = S('g', { id: id + 'B' }, O);
  S('ellipse', { cx: 0, cy: 4, rx: 120, ry: 16, fill: '#000', opacity: .3 }, M);
  S('path', { d: 'M0 -330 Q10 -400 40 -420', stroke: kDark(c, .25), 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round' }, M);
  kGlow(M, 42, -424, 60, NPAL.yel, .8); kBall(M, 42, -424, 20, NPAL.yel, '#e0a630', '#fff6cf');
  [-75, -25, 25, 75].forEach((dx, k) => S('ellipse', { cx: dx, cy: -12, rx: 26, ry: 22, fill: kDark(c, .18 + (k % 2) * .06) }, M));
  [['aL', -1], ['aR', 1]].forEach(([k, sd]) => { const a = S('g', { id: id + k }, M); S('path', { d: `M${sd * 110} -150 Q${sd * 170} -130 ${sd * 160} -80`, stroke: kDark(c, .1), 'stroke-width': 30, fill: 'none', 'stroke-linecap': 'round' }, a); });
  const body = S('path', { d: 'M-125 -20 Q-150 -300 0 -335 Q150 -300 125 -20 Q90 0 60 -18 Q30 4 0 -18 Q-30 4 -60 -18 Q-90 0 -125 -20 Z', fill: kLG(d, [[0, kLite(c, .35)], [1, c]]) }, M); kShade(M, body, kDark(c, .35), kLite(c, .6));
  S('ellipse', { cx: -60, cy: -250, rx: 26, ry: 40, fill: '#ffffff', opacity: .3, transform: 'rotate(25 -60 -250)' }, M);
  S('circle', { cx: 0, cy: -190, r: 66, fill: '#ffffff' }, M);
  _mFace(M, id, 0, -190, 36, 0, -92, o);
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
  _mFace(M, id, 0, -195, 24, 52, -132, o, '#2a140c');
  return M; }

// ---------- timeline beats ----------
function nMOOD(id, t, m) { const on = { happy: ['eH', 'mS'], shock: ['E', 'mO'], meh: ['E', 'mF'], neutral: ['E', 'mS'] }[m] || ['E', 'mS'];
  ['E', 'eH', 'mS', 'mO', 'mF'].forEach(k => tl.set('#' + id + k, { opacity: on.includes(k) ? 1 : 0 }, t));
  tl.to('#' + id + 'E', { scaleY: m === 'meh' ? .55 : 1, scale: m === 'shock' ? 1.2 : 1, transformOrigin: '50% 50%', duration: .2 }, t);
  if (m === 'shock') tl.fromTo('#' + id + 'B', { y: 0 }, { y: -30, duration: .15, yoyo: true, repeat: 1, ease: 'power2.out' }, t); B(t); }
const nHOP = (id, t, h = 50) => { tl.fromTo('#' + id + 'B', { y: 0 }, { y: -h, duration: .22, yoyo: true, repeat: 1, ease: 'power2.out' }, t); B(t); };
const nWAVE = (id, t, n = 3) => { tl.to('#' + id + 'aR', { rotation: -40, transformOrigin: '50% 100%', duration: .18, yoyo: true, repeat: n * 2 - 1, ease: 'sine.inOut' }, t); B(t); };
function nTALKM(id, t0, t1) { const n = Math.max(1, Math.round((t1 - t0) / .24)); for (let k = 0; k < n; k++) { const t = t0 + k * .24; tl.set('#' + id + 'mO', { opacity: 1, scaleY: .6 + (k % 3) * .2, transformOrigin: '50% 0%' }, t); tl.set('#' + id + 'mS', { opacity: 0 }, t); tl.set('#' + id + 'mO', { opacity: 0 }, t + .14); tl.set('#' + id + 'mS', { opacity: 1 }, t + .14); } B(t0); }
