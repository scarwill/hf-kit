// NOTE: older example — copy its STRUCTURE (worlds, kSCALE, camera, beats) only. Its pill() and kKid() are banned in new Kurz videos (kurzlint flags them).
// Blind spot v2 — Kurzgesagt-style: shaded flat shapes, layered backgrounds, small character, idle motion. LONG 1920x1080.
// Example for the kurzgesagt-explainer-video skill. Build: cat premium illus life helpers icons scenes extras kurz/kurz.js kurz/organs.js this > all.js
// Source plan: no library. Worlds = kWorld palettes (auto parallax), organs = kurz/organs.js, nature props = kurz/kurz.js, camera/intro/outro = video kit.
const VIDEO = { theme: 'blue', scenes: [{ type: 'custom', build: (s) => {
  const { G, BG, defs } = makeWorld(s, 4, 2); illusDefs(defs); addLife(s); moodLayer(s);
  const pat = S('pattern', { id: 'kpStr', width: 64, height: 64, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(35)' }, defs);
  S('rect', { width: 64, height: 64, fill: '#f7e7c6' }, pat); S('rect', { width: 26, height: 64, fill: '#efcf9f' }, pat);

  // ========== AREA 0: the eye + the world with (no) hole ==========
  const [a0x, a0y] = AO(0);
  const W0 = kWorld(BG, defs, a0x, a0y, 'night', { stars: 70 });
  kMountain(kLayer(W0.R, 1), a0x + 1450, a0y + 830, 520, 300, '#2e2578', false); kMountain(kLayer(W0.R, 1), a0x + 1780, a0y + 840, 420, 230, '#2a2170', false);
  kFgRocks(G, a0x - 120, a0y + 1060, 1.1, '#07051a'); kFgPlants(G, a0x + 1980, a0y + 1080, 1, '#07051a', -1);
  S('path', { id: 'cone0', d: `M${a0x + 780} ${a0y + 540} L${a0x + 990} ${a0y + 300} L${a0x + 990} ${a0y + 780} Z`, fill: kLG(defs, [[0, KC.light, .35], [1, KC.light, .05]], 1, 0) }, G); hidId('cone0');
  kView2(G, a0x + 990, a0y + 290, 760, 500, 'view0'); hidId('view0');
  kVoid(G, a0x + 1250, a0y + 540, 46, 'spot0'); hidId('spot0');
  glowRing(G, a0x + 1250, a0y + 540, 60, KC.pink, 'ring0', 7); hidId('ring0');
  S('circle', { id: 'holeQ', cx: a0x + 1250, cy: a0y + 540, r: 50, fill: 'none', stroke: '#ffffff', 'stroke-width': 6, 'stroke-dasharray': '14 12', opacity: .85 }, G); hidId('holeQ');
  QM(G, a0x + 1390, a0y + 440, 120, '#ffffff', 'q0'); hidId('q0');
  const ch = S('g', { id: 'tgt0' }, G); S('circle', { cx: a0x + 1250, cy: a0y + 540, r: 92, fill: 'none', stroke: KC.light, 'stroke-width': 8 }, ch);
  [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(([dx, dy]) => S('path', { d: `M${a0x + 1250 + dx * 70} ${a0y + 540 + dy * 70} L${a0x + 1250 + dx * 120} ${a0y + 540 + dy * 120}`, stroke: KC.light, 'stroke-width': 8, 'stroke-linecap': 'round' }, ch)); hidId('tgt0');
  kEye2(G, a0x + 560, a0y + 540, 1, 'eye0', { look: 40 });

  // ========== AREA 1: the test (kid + phone through a lens) ==========
  const [a1x, a1y] = AO(1);
  const W1 = kWorld(BG, defs, a1x, a1y, 'ocean');
  [[120, .55], [300, .7], [1760, .6], [1960, .5]].forEach(([dx, sc], k) => kPine(kLayer(W1.R, 1), a1x + dx, a1y + 830 + k % 2 * 14, sc, '#0d4a52'));
  kTree(kLayer(W1.R, 2), a1x + 1880, a1y + 930, .9, null, { col: '#1f7a6a', trunk: '#3e3a2f' }); kCloud(G, a1x + 260, a1y + 170, .9); kCloud(G, a1x + 1820, a1y + 120, .7);
  kGrass(G, a1x + 230, a1y + 975, 1.1, '#2a8f7a'); kGrass(G, a1x + 560, a1y + 985, .9, '#2a8f7a'); kRock(G, a1x + 690, a1y + 990, .8, '#3b5d6b', 4);
  kFgPlants(G, a1x + 1990, a1y + 1090, 1.1, '#03141a', -1);
  const lc = a1x + 1300, lcy = a1y + 500, LR = 330;
  S('path', { d: `M${a1x + 640} ${a1y + 450} L${lc - 70} ${lcy - LR + 8} L${lc - 70} ${lcy + LR - 8} L${a1x + 640} ${a1y + 620} Z`, fill: '#5ee6d0', opacity: .1 }, G);
  S('circle', { cx: lc, cy: lcy, r: LR + 60, fill: kRG(defs, [[0, '#5ee6d0', .35], [1, '#5ee6d0', 0]]) }, G);
  const lens = S('circle', { cx: lc, cy: lcy, r: LR, fill: '#1a2638' }, G); const lcl = S('g', { 'clip-path': kClip(defs, lens) }, G);
  const phI = S('g', { id: 'phI' }, lcl); kPhone2(phI, lc + 30, lcy, 1100, 560, 'phB', '#f6f1e7', { plus: -190, dot: 170 });
  S('circle', { id: 'phDr', cx: lc + 200, cy: lcy, r: 46, fill: 'none', stroke: '#9aa3b5', 'stroke-width': 6, 'stroke-dasharray': '12 10' }, phI); hidId('phDr');
  QM(phI, lc + 200, lcy - 130, 90, '#5b6478', 'phQ'); hidId('phQ');
  glowRing(phI, lc - 160, lcy, 70, KC.light, 'plRing', 7); hidId('plRing');
  S('circle', { cx: lc, cy: lcy, r: LR, fill: 'none', stroke: '#5ee6d0', 'stroke-width': 14 }, G);
  S('path', { d: kArc(lc, lcy, LR - 22, 200, 250), stroke: '#ffffff', 'stroke-width': 10, fill: 'none', opacity: .6, 'stroke-linecap': 'round' }, G);
  kKid(G, a1x + 380, a1y + 960, 1.35, 'kid', { pose: 'coverEye', phone: true }); hidId('kidcv');
  glowRing(G, a1x + 456, a1y + 494, 44, KC.light, 'eyeRg', 6); hidId('eyeRg');
  CRV(G, `M${a1x + 470} ${a1y + 494} L${a1x + 628} ${a1y + 520}`, KC.light, 'beam1', 6); hidId('beam1');

  // ========== AREA 2: inside the eye ==========
  const [a2x, a2y] = AO(2);
  kWorld(BG, defs, a2x, a2y, 'body');
  kCell(G, a2x + 120, a2y + 140, 90, null, { col: '#c2417a', nuc: '#7b2d5c', seed: 5 }); kCell(G, a2x + 1780, a2y + 930, 120, null, { col: '#b03a72', nuc: '#6b2752', seed: 8 }); kCell(G, a2x + 1640, a2y + 120, 70, null, { col: '#c2417a', nuc: '#7b2d5c', seed: 2 });
  const Cx = a2x + 900, Cy = a2y + 540, R = 380, TH = 12;
  const { ex, ey, gx, gy } = kEyeFull(G, Cx, Cy, R, TH, a2x);
  pill(G, ex + 260, ey - 170, 'OPTIC NERVE', KC.nerve, '#2a1a08', 'pNerve', 28); hidId('pNerve');
  pill(G, gx + 230, gy - 210, 'BLIND SPOT', KC.pink, '#ffffff', 'pBlind', 32); hidId('pBlind');
  const tinyW = S('g', { id: 'tinyW' }, G); const tk = S('g', { transform: `translate(${2 * (ex + 270)} 0) scale(-1 1)` }, tinyW);
  kKid(tk, ex + 270, ey + 8, .42, 'tiny', { shirt: '#5ee6d0', shirtD: '#2fb3a0', hair: '#2b1a12' }); hidId('tinyW');

  // ========== AREA 3: the hole you never see ==========
  const [a3x, a3y] = AO(3);
  const W3 = kWorld(BG, defs, a3x, a3y, 'dusk', { stars: 40 });
  [[140, .6], [1820, .55], [1990, .7]].forEach(([dx, sc]) => kPine(kLayer(W3.R, 1), a3x + dx, a3y + 835, sc, '#232a7a'));
  kFgRocks(G, a3x - 100, a3y + 1070, 1, '#05061a');
  kPhone2(G, a3x + 720, a3y + 540, 940, 500, 'ph3', 'url(#kpStr)', { plus: -230, dot: 210, withDot: false });
  const hx = a3x + 930, hy = a3y + 540;
  kVoid(G, hx, hy, 46, 'hole3'); hidId('hole3');
  XM(G, hx, hy, 70, 'x3'); hidId('x3');
  kBrain2(G, a3x + 1560, a3y + 500, .95, 'br3');
  CRV(G, `M${a3x + 1440} ${a3y + 480} Q${a3x + 1200} ${a3y + 330} ${hx + 50} ${hy - 50}`, KC.brain, 'beam3', 10); hidId('beam3');
  S('circle', { id: 'patch3', cx: hx, cy: hy, r: 58, fill: 'url(#kpStr)' }, G); hidId('patch3');
  spark(G, hx, hy, 1.4, KC.light, 'spk3'); hidId('spk3');
  glowRing(G, a3x + 1560, a3y + 500, 230, KC.brain, 'brR3', 8); hidId('brR3');

  // ========== AREA 4: not a recording — the brain fills in ==========
  const [a4x, a4y] = AO(4);
  const W4 = kWorld(BG, defs, a4x, a4y, 'deep');
  kMountain(kLayer(W4.R, 1), a4x + 260, a4y + 830, 600, 330, '#163a63'); kMountain(kLayer(W4.R, 1), a4x + 1650, a4y + 840, 520, 280, '#143559');
  kCloud(G, a4x + 640, a4y + 150, .8, null, '#dbeafe', '#9fb8d8'); kFgPlants(G, a4x - 160, a4y + 1090, 1.1, '#020814');
  kCamR2(G, a4x + 390, a4y + 600, 1.15, 'cam4'); XM(G, a4x + 400, a4y + 560, 150, 'x4'); hidId('x4');
  kBrain2(G, a4x + 1150, a4y + 300, .8, 'br4');
  const mos = S('g', { id: 'mos' }, G), mx0 = a4x + 820, my0 = a4y + 560, tw = 132, th = 112, miss = [[1, 0], [3, 1], [0, 2], [4, 2]];
  const tcol = (c, r) => r === 0 ? (c === 3 ? '#ffe08a' : ['#6cc4ff', '#79caff', '#86d0ff', '#ffe08a', '#93d6ff'][c]) : r === 1 ? ['#4fb07a', '#3fa66b', '#58b882', '#2f8a57', '#3fa66b'][c] : ['#2f8a57', '#257a4b', '#2f8a57', '#3a9663', '#257a4b'][c];
  S('rect', { x: mx0 - 18, y: my0 - 18, width: 5 * tw + 36, height: 3 * th + 36, rx: 26, fill: '#000', opacity: .3 }, mos);
  const tile = (par, c, r, id) => { const g = S('g', id ? { id } : {}, par), X = mx0 + c * tw + 3, Y = my0 + r * th + 3;
    S('rect', { x: X, y: Y, width: tw - 6, height: th - 6, rx: 12, fill: tcol(c, r) }, g); S('rect', { x: X + 6, y: Y + 6, width: tw - 18, height: 16, rx: 8, fill: '#fff', opacity: .22 }, g); S('rect', { x: X, y: Y + th - 30, width: tw - 6, height: 24, rx: 12, fill: '#000', opacity: .14 }, g); return g; };
  for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) { const m = miss.some(([a, b]) => a === c && b === r);
    if (!m) tile(mos, c, r); else {
      S('rect', { x: mx0 + c * tw + 3, y: my0 + r * th + 3, width: tw - 6, height: th - 6, rx: 12, fill: KC.void }, mos);
      S('rect', { x: mx0 + c * tw + 9, y: my0 + r * th + 9, width: tw - 18, height: th - 18, rx: 9, fill: 'none', stroke: KC.pink, 'stroke-width': 3, 'stroke-dasharray': '10 8', opacity: .7 }, mos);
      tile(G, c, r, `fill${c}${r}`); hidId(`fill${c}${r}`);
      CRV(G, `M${a4x + 1150} ${a4y + 420} Q${(a4x + 1150 + mx0 + c * tw + tw / 2) / 2 + (c - 2) * 40} ${a4y + 470} ${mx0 + c * tw + tw / 2} ${my0 + r * th + th / 2}`, KC.brain, `bm${c}${r}`, 7); hidId(`bm${c}${r}`); } }
  const kw = S('g', {}, G); const k4 = S('g', { transform: `translate(${2 * (a4x + 1720)} 0) scale(-1 1)` }, kw);
  kKid(k4, a4x + 1720, a4y + 1010, 1.0, 'kid4', { shirt: '#ff8a5b' });
  glowRing(G, a4x + 1150, a4y + 730, 260, KC.light, 'mosR', 8); hidId('mosR');
  spark(G, mx0 + 4 * tw, my0 - 10, 1, KC.light, 'spk4'); hidId('spk4');

  return () => {
    tl.set(HID, { autoAlpha: 0 }, 0); tl.set('#world', { transformOrigin: '0% 0%' }, 0);
    intro(s, '#eye0', a0x + 560, a0y + 540, { col: '#4cc9f0', r: 320, z0: 2.2, z1: 1.45 });
    const starts = [];
    // ---- idle life (finite, all video): hills + rays drift, kid breathes ----
    kLife();
    tl.to('#kidH', { y: -5, duration: 1.4, yoyo: true, repeat: 7, ease: 'sine.inOut' }, 12);
    tl.to('#kid4H', { y: -5, duration: 1.4, yoyo: true, repeat: 5, ease: 'sine.inOut' }, 36);
    tl.to('#tinyH', { y: -3, duration: 1.2, yoyo: true, repeat: 5, ease: 'sine.inOut' }, 29);
    eyes('#kidE', [14, 18.5, 23]); eyes('#kid4E', [38, 42, 44.5]); eyes('#eye0', [3.9, 7.6]);

    // ---- A0 hook ----
    ST = 0; let t = go('each of your eyes'); starts.push(t);
    CAM(t, a0x + 760, a0y + 540, 1.2, 1.4, 'power2.out');
    t = W('has a spot'); CAM(t - .2, a0x + 1060, a0y + 540, 1, 1.2); FADE('#view0', t, { d: .6 }); FADE('#cone0', t + .2, { d: .6 }); POP('#spot0', t + .45);
    tl.to('#view0cl', { x: 70, duration: 14, ease: 'sine.inOut' }, t);
    t = W('absolutely nothing'); tl.fromTo('#ring0', { autoAlpha: .9, scale: .8, transformOrigin: '50% 50%' }, { autoAlpha: 0, scale: 1.9, duration: .9, repeat: 1 }, t); PULSE('#spot0', t, { s: 1.18, r: 3 }); dim(t, 1.4, .28);
    t = W('so why doesnt'); OUT('#spot0', t, { d: .5 }); CAM(t, a0x + 1330, a0y + 540, 1.3, 1.6);
    t = W('hole in it'); DR('#holeQ', t - .1, { d: .1 }); FADE('#holeQ', t - .1, { d: .3, to: .85 }); POP('#q0', t + .2); BOING('#q0', t + .7);
    t = W('lets catch it'); OUT(['#holeQ', '#q0'], t - .05, { d: .25 }); tl.fromTo('#tgt0', { autoAlpha: 0, scale: 2.2, rotation: -90, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, rotation: 0, duration: .55, ease: 'back.out(1.6)' }, t); B(t); CAM(t, a0x + 1300, a0y + 540, 1.15, 1);

    // ---- A1 the test ----
    t = go('close your left eye'); starts.push(t); WHIP(t, a1x + 960, a1y + 520, 1);
    tl.fromTo('#kidcv', { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: .5, ease: 'back.out(1.6)' }, t + .5); B(t + .5);
    t = W('with your right eye'); CAM(t, a1x + 520, a1y + 500, 1.6, 1); tl.fromTo('#eyeRg', { autoAlpha: .9, scale: .7, transformOrigin: '50% 50%' }, { autoAlpha: 0, scale: 1.8, duration: .8, repeat: 1 }, t + .2); B(t + .2);
    t = W('stare at the plus'); CAM(t - .1, a1x + 900, a1y + 500, 1.05, 1.2); DR('#beam1', t, { d: .6 }); tl.fromTo('#plRing', { autoAlpha: .9, scale: .7, transformOrigin: '50% 50%' }, { autoAlpha: 0, scale: 1.7, duration: .8 }, t + .6); PULSE('#phBP', t + .6, { s: 1.2 });
    t = W('slowly move'); OUT('#beam1', t, { d: .4 }); CAM(t, a1x + 960, a1y + 520, 1, 1.2);
    t = W('closer'); tl.to('#phI', { scale: 1.2, transformOrigin: '50% 50%', duration: 1.1, ease: 'sine.inOut' }, t - .3); tl.to('#kidaR', { x: -34, duration: 1.1, ease: 'sine.inOut' }, t - .3); B(t);
    t = W('farther away'); tl.to('#phI', { scale: .82, transformOrigin: '50% 50%', duration: 1.3, ease: 'sine.inOut' }, t - .2); tl.to('#kidaR', { x: 30, duration: 1.3, ease: 'sine.inOut' }, t - .2); B(t);
    t = W('at a certain distance'); tl.to('#phI', { scale: 1.06, transformOrigin: '50% 50%', duration: 1.4, ease: 'sine.inOut' }, t); tl.to('#kidaR', { x: -6, duration: 1.4, ease: 'sine.inOut' }, t); B(t);
    t = W('will disappear'); tl.to('#phBD', { autoAlpha: 0, scale: .5, transformOrigin: '50% 50%', duration: .7, ease: 'power2.in' }, t); B(t); CAM(t, a1x + 1000, a1y + 520, 1.15, 1.2);
    tl.to('#kidbr', { y: -10, duration: .2, yoyo: true, repeat: 1, repeatDelay: .9 }, t); tl.to('#kidH', { y: -16, duration: .18, yoyo: true, repeat: 1 }, t + .25);
    t = W('keep looking'); CAM(t, a1x + 860, a1y + 520, 1.25, 1); PULSE('#phBP', t + .1, { s: 1.25, r: 3 }); tl.fromTo('#plRing', { autoAlpha: .9, scale: .7, transformOrigin: '50% 50%' }, { autoAlpha: 0, scale: 1.7, duration: .8 }, t + .2);
    t = W('did it vanish'); CAM(t - .1, a1x + 960, a1y + 520, 1.1, .9); DR('#phDr', t, { d: .5 }); FADE('#phDr', t, { d: .3 }); POP('#phQ', t + .3); BOING('#phQ', t + .6); tl.to('#kidbr', { y: -12, duration: .25, yoyo: true, repeat: 1, repeatDelay: .6 }, t + .1);

    // ---- A2 inside the eye ----
    t = go('the back of your eye'); starts.push(t); ZOOMIN(t, a1x + 456, a1y + 494, Cx + 40, Cy, 1.35); CAM(t + .1, Cx + 120, Cy, 1, 1.6, 'power2.out');
    t = W('covered in cells'); POP('.cellA', t, { st: .012, d: .35 }); CAM(t, Cx + 200, Cy, 1.25, 1.6);
    t = W('detect light'); [0, 1, 2].forEach(k => { FADE('#rayGl' + k, t - .1 + k * .1, { d: .3 }); DR('#ray' + k, t - .1 + k * .1, { d: .55 }); tl.fromTo('#rg' + k, { autoAlpha: 0, scale: .5, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1.3, duration: .4, yoyo: true, repeat: 3 }, t + .45); });
    tl.set('#sig', { autoAlpha: 1 }, t + .6); tl.fromTo('.sigD', { x: 0, y: 0, autoAlpha: 1 }, { x: 440, y: 125, autoAlpha: 0, duration: 1.4, stagger: .22, ease: 'power1.in' }, t + .6);
    t = W('but where the optic'); OUT(['#ray0', '#ray1', '#ray2', '#rayGl0', '#rayGl1', '#rayGl2'], t, { d: .4 }); CAM(t, ex + 60, ey - 20, 1.9, 1.3); POP('#pNerve', W('optic nerve') + .2);
    t = W('exits your eye'); tl.fromTo('.sigD', { x: 0, y: 0, autoAlpha: 1 }, { x: 440, y: 125, autoAlpha: 0, duration: 1.2, stagger: .2, ease: 'power1.in' }, t); B(t); PULSE('#disc', t + .1, { s: 1.06 });
    t = W('there are none'); DR('#rayG', t - .2, { d: .5 }); POP('#gapV', t + .1); FADE('#gapR', t + .2, { d: .2 }); dim(t + .3, 1.2, .3); SHAKE('#gapR', t + .6);
    t = W('thats your blind spot'); OUT('#pNerve', t - .1, { d: .3 }); POP('#pBlind', t); BOING('#pBlind', t + .4); tl.fromTo('#gapG', { autoAlpha: .9, scale: .7, transformOrigin: '50% 50%' }, { autoAlpha: 0, scale: 1.8, duration: .8, repeat: 1 }, t + .1); CAM(t, gx - 120, gy - 40, 1.6, 1.2);
    FADE('#tinyW', t + .4, { d: .5 }); tl.to('#tinyaR', { rotation: -22, transformOrigin: '10% 50%', duration: .4, yoyo: true, repeat: 3 }, t + .6);

    // ---- A3 the hole you never see ----
    t = go('and heres the strange'); starts.push(t); WHIP(t, a3x + 960, a3y + 540, 1); BOING('#br3', t + .3, '50% 50%');
    tl.fromTo('#brR3', { autoAlpha: .8, scale: .85, transformOrigin: '50% 50%' }, { autoAlpha: 0, scale: 1.3, duration: .9 }, t + .5);
    t = W('you didnt see'); CAM(t, a3x + 820, a3y + 540, 1.3, 1.2);
    t = W('black hole'); POP('#hole3', t - .1); SHAKE('#hole3', t + .4);
    t = W('where the dot used'); POP('#x3', t + .1); dim(t, 1, .25);
    t = W('your brain filled'); CAM(t - .1, a3x + 1180, a3y + 520, 1.05, 1.2); DR('#beam3', t + .2, { d: .7 }); PULSE('#br3', t, { s: 1.06, r: 3 });
    t = W('the gap with'); POP('#patch3', t, { s: .2, d: .6 }); OUT(['#hole3', '#x3'], t + .4, { d: .4 }); tl.fromTo('#spk3', { autoAlpha: 1, scale: .4, transformOrigin: '50% 50%' }, { autoAlpha: 0, scale: 1.4, duration: .7 }, t + .4); B(t + .4);
    t = W('surrounding background'); OUT('#beam3', t, { d: .5 }); glow(t); CAM(t, a3x + 820, a3y + 540, 1.35, 1.4, 'sine.inOut'); PULSE('#patch3', t + .3, { s: 1.12 });

    // ---- A4 vision isn't a recording ----
    t = go('your vision isnt'); starts.push(t); ZOOMIN(t, a3x + 1560, a3y + 500, a4x + 1150, a4y + 330, 1.3); CAM(t + .1, a4x + 700, a4y + 560, 1.15, 1.2);
    tl.to('#cam4R', { autoAlpha: .15, duration: .3, yoyo: true, repeat: 5 }, t); B(t);
    t = W('just a recording'); POP('#x4', t + .1); dim(t + .1, .9, .25);
    t = W('your brain fills'); CAM(t, a4x + 1150, a4y + 560, 1, 1.2); PULSE('#br4', t + .1, { s: 1.07, r: 3 });
    const ms = [['bm10', 'fill10'], ['bm31', 'fill31'], ['bm02', 'fill02'], ['bm42', 'fill42']];
    t = W('missing information'); ms.forEach(([b, f], k) => { DR('#' + b, t - .5 + k * .18, { d: .4 }); POP('#' + f, t - .1 + k * .18, { s: .3 }); });
    OUT(ms.map(([b]) => '#' + b), t + 1.2, { d: .5 }); tl.fromTo('#spk4', { autoAlpha: 1, scale: .4, transformOrigin: '50% 50%' }, { autoAlpha: 0, scale: 1.3, duration: .7 }, t + .7); glow(t + .6);
    t = W('and you dont even'); CAM(t, a4x + 1300, a4y + 640, 1.2, 1.3, 'sine.inOut');
    t = W('notice that'); tl.fromTo('#mosR', { autoAlpha: .9, scale: .8, transformOrigin: '50% 50%' }, { autoAlpha: 0, scale: 1.25, duration: .9, repeat: 1 }, t); B(t);
    tl.fromTo('#mosR', { autoAlpha: .9, scale: .8, transformOrigin: '50% 50%' }, { autoAlpha: 0, scale: 1.25, duration: .9 }, END - .3);

    lifeBeats(starts.slice(1));
    outro(a4x + 1150, a4y + 600, .95, '#mos');
  };
} }] };

