// Example LONG (1920x1080) DSML video — "Human vs AI hallucination" (6:44, 18 rooms). Uses extras.js. Build: cat premium illus life helpers icons scenes extras + this > all.js; python3 build.py all.js <audio>
// Human vs AI hallucination — LONG, Midnight Lab, Infographics-Show rooms. Hero = the robot AI + its fake paper; human side = the old man / brain.
const ROSE = '#f472b6', AMB = LAB.warn, BLU = LAB.data, RED = LAB.bad, GRN = LAB.good, VIO = LAB.model, CYA = LAB.acc;
// ---------- local drawing helpers ----------
function wallStripes(ox, oy) { for (let k = 0; k < 24; k++) S('rect', { x: ox - 200 + k * 100, y: oy - 160, width: 40, height: 980, fill: '#ffffff', opacity: .025 }, document.getElementById('gMain')); }
function legs(par, x, y, w, oy) { S('rect', { x: x + 24, y: y + 28, width: 22, height: oy + 820 - y - 28, fill: '#451a03' }, par); S('rect', { x: x + w - 46, y: y + 28, width: 22, height: oy + 820 - y - 28, fill: '#451a03' }, par); }
function table(par, x, y, w, oy, col = '#92400e') { S('rect', { x, y, width: w, height: 28, rx: 8, fill: col }, par); legs(par, x, y, w, oy); }

const VIDEO = { theme: 'blue', scenes: [{ type: 'custom', build: (s) => {
  const { G, BG, defs } = makeWorld(s, 4, 5); illusDefs(defs); useTheme('lab'); addLife(s); moodLayer(s); G.id = 'gMain';
  extrasDefs(defs); rgrad(defs, 'gCore', VIO, .45); rgrad(defs, 'gCy', CYA, .4); rgrad(defs, 'gMoon', '#bfdbfe', .35);
  const BT = [];
  // =============== AREA 0: living room — the old man (Charles Bonnet) ===============
  { const [ox, oy] = AO(0); const X = v => ox + v, Y = v => oy + v;
    scene(BG, defs, ox, oy); wallStripes(ox, oy);
    frameP(G, X(90), Y(130), 240, 180, 'pf0'); treeG(G, X(170), Y(210), .55); sunG(G, X(270), Y(180), 18);
    clock(G, X(1210), Y(470), 46);
    windowPane(G, X(1380), Y(120), 360, 400, 'url(#gNight)'); S('circle', { cx: X(1650), cy: Y(210), r: 34, fill: '#e0f2fe' }, G); S('circle', { cx: X(1650), cy: Y(210), r: 90, fill: 'url(#gMoon)' }, G);
    // curtains with hidden faces
    S('path', { d: `M${X(1300)} ${Y(90)} L${X(1450)} ${Y(90)} Q${X(1420)} ${Y(330)} ${X(1460)} ${Y(600)} L${X(1290)} ${Y(600)} Z`, fill: '#9f1239' }, G);
    S('path', { d: `M${X(1660)} ${Y(90)} L${X(1820)} ${Y(90)} L${X(1830)} ${Y(600)} L${X(1650)} ${Y(600)} Q${X(1690)} ${Y(330)} ${X(1660)} ${Y(90)} Z`, fill: '#9f1239' }, G);
    [[1335, 1385], [1700, 1760]].forEach(([a, b]) => S('path', { d: `M${X(a)} ${Y(100)} L${X(a + 6)} ${Y(590)} M${X(b)} ${Y(100)} L${X(b - 4)} ${Y(590)}`, stroke: '#881337', 'stroke-width': 8 }, G));
    S('rect', { x: X(1280), y: Y(78), width: 560, height: 22, rx: 11, fill: '#78350f' }, G);
    faceSk(G, X(1365), Y(300), 1.1, 'cf0'); faceSk(G, X(1745), Y(380), 1.1, 'cf1'); hidId('cf0'); hidId('cf1');
    // flowers that bloom on the wallpaper
    [[430, 200, '#f472b6'], [520, 380, '#fb923c'], [170, 470, '#c084fc'], [1060, 560, '#f472b6'], [1250, 640, '#fb7185']].forEach(([x, y, c], k) => { flowerG(G, X(x), Y(y), 38, c, 'fl0' + k); hidId('fl0' + k); });
    // side table + lamp + cup
    table(G, X(300), Y(650), 190, oy); lamp(G, X(395), Y(640)); S('rect', { x: X(387), y: Y(600), width: 16, height: 50, fill: '#a16207' }, G);
    // carpet
    S('ellipse', { cx: X(960), cy: Y(935), rx: 720, ry: 105, fill: '#7f1d1d' }, G); S('ellipse', { cx: X(960), cy: Y(935), rx: 640, ry: 80, fill: 'none', stroke: '#d97706', 'stroke-width': 6 }, G);
    // armchair back
    S('rect', { x: X(590), y: Y(330), width: 340, height: 380, rx: 70, fill: '#7c2d12' }, G); S('rect', { x: X(620), y: Y(360), width: 280, height: 320, rx: 50, fill: '#9a3412' }, G);
    // the old man (intro hero)
    charB(G, X(760), Y(800), .75, 'man', { hair: 'bald', hairC: '#e5e7eb', skin: SKIN[0], top: '#7c5c3b', topType: 'blazer', glasses: true, beard: true });
    // chair front + arms
    S('rect', { x: X(570), y: Y(640), width: 380, height: 170, rx: 26, fill: '#9a3412' }, G); S('rect', { x: X(570), y: Y(640), width: 380, height: 26, rx: 13, fill: '#c2410c' }, G);
    S('rect', { x: X(545), y: Y(560), width: 90, height: 250, rx: 36, fill: '#7c2d12' }, G); S('rect', { x: X(885), y: Y(560), width: 90, height: 250, rx: 36, fill: '#7c2d12' }, G);
    S('rect', { x: X(590), y: Y(805), width: 30, height: 20, fill: '#451a03' }, G); S('rect', { x: X(900), y: Y(805), width: 30, height: 20, fill: '#451a03' }, G);
    S('path', { id: 'gl0', d: `M${X(732)} ${Y(415)} L${X(744)} ${Y(405)}`, stroke: '#fff', 'stroke-width': 5, 'stroke-linecap': 'round' }, G); hidId('gl0');
    // eyesight meter
    const es = S('g', { id: 'eyeS' }, G); S('rect', { x: X(600), y: Y(232), width: 330, height: 76, rx: 38, fill: '#0f172a', stroke: '#334155', 'stroke-width': 4 }, es); eyeBig(es, X(650), Y(270), .32, 'eyeSi'); S('rect', { x: X(705), y: Y(258), width: 200, height: 24, rx: 12, fill: '#1e293b' }, es); S('rect', { id: 'eyeSb', x: X(705), y: Y(258), width: 200, height: 24, rx: 12, fill: BLU }, es); hidId('eyeS');
    // tiny people in old-fashioned clothes
    [['short', '#1f2937', 'blazer', 1], ['long', '#7e22ce', 'kurta', 0], ['short', '#065f46', 'blazer', 1], ['long', '#be123c', 'kurta', 0]].forEach(([h, top, tt, hat], k) => {
      const M = charB(G, X(560 + k * 190), Y(950 - (k % 2) * 22), .17, 'tp' + k, { hair: h, hairC: HAIRC[k % 4], skin: SKIN[0], top, topType: tt });
      if (hat) { S('rect', { x: -55, y: -720, width: 110, height: 130, rx: 6, fill: '#111827' }, M); S('rect', { x: -90, y: -600, width: 180, height: 22, rx: 8, fill: '#111827' }, M); }
      else S('path', { d: 'M-80 -560 Q0 -690 80 -560 Z', fill: '#fde68a' }, M);
      hidId('tp' + k + 'B'); });
    // for the revisit: thought bubble with brain + fading eye signal
    const tb = thought(G, X(930), Y(50), 440, 320, 'tb0', X(830), Y(380));
    eyeBig(tb, X(1290), Y(150), .42, 'tbEye'); S('path', { id: 'tbCab', d: `M${X(1245)} ${Y(158)} Q${X(1200)} ${Y(190)} ${X(1150)} ${Y(185)}`, stroke: BLU, 'stroke-width': 9, fill: 'none', 'stroke-dasharray': '18 10' }, tb);
    brainG(tb, X(1060), Y(190), .55, 'tbBr', false);
    flowerG(tb, X(1000), Y(320), 22, '#f472b6', 'tbI0'); faceSk(tb, X(1110), Y(300), .55, 'tbI1'); S('rect', { x: X(1060), y: Y(280), width: 100, height: 0, fill: 'none' }, tb); ic(tb, 'user', X(1230), Y(310), 50, '#fbbf24', 'tbI2');
    ['tbI0', 'tbI1', 'tbI2'].forEach(hidId); hidId('tb0'); ringH(tb, X(1060), Y(190), 110, ROSE, 'tbR');
    pill(G, X(430), Y(70), 'CHARLES BONNET SYNDROME', '#fde68a', C.ink, 'cbs0', 30); hidId('cbs0');
    plant(G, X(1880), Y(820), 1.1); fgLeaves(G, X(-60), Y(1080), 1.2, 1); fgBox(G, X(1650), Y(990), 360, 200, '#3f1d0b');
    BT.push(() => {
      let t = go('a man in his eighties'); CAM(t + .3, X(960), Y(540), 1, 2.4, 'sine.inOut'); breathe('man', t, 9, 1.6); blink('man', [t + 1.2, t + 4.6, t + 9, t + 14]); bgLife();
      t = W('his eyesight has been'); POP('#eyeS', t); BOING('#eyeS', t + .45, '50% 50%'); tl.fromTo('#eyeSb', { scaleX: 1, transformOrigin: '0% 50%' }, { scaleX: .25, duration: 1.6, ease: 'power2.inOut' }, W('fading')); tl.to('#eyeSi', { opacity: .4, duration: 1.2 }, W('fading')); mood('man', W('fading'), 'tired');
      t = W('and then he sees them'); OUT('#eyeS', t); CAM(t - .1, X(760), Y(440), 2.0, .6, 'power3.out'); mood('man', t + .1, 'surprised');
      t = W('tiny people'); CAM(t - .2, X(900), Y(820), 1.35, 1.0); [0, 1, 2, 3].forEach(k => WALKER('tp' + k, t + k * .25, -2600 - k * 300, 2.6));
      t = W('flowers blooming'); CAM(t - .2, X(760), Y(420), 1.15, 1.0); [0, 1, 2, 3, 4].forEach(k => tl.fromTo('#fl0' + k, { autoAlpha: 0, scale: 0, rotation: -120, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, rotation: 0, duration: .7, ease: 'back.out(1.8)' }, t + .1 + k * .18)); B(t);
      t = W('faces in the curtains'); CAM(t - .2, X(1560), Y(360), 1.6, .9); FADE('#cf0', t + .2, { d: .8 }); FADE('#cf1', t + .5, { d: .8 }); eyes('.fcE', [t + 1.3]);
      t = W('he knows they'); CAM(t - .1, X(960), Y(540), 1, 1.1); shake('man', t + .2, 2); mood('man', t, 'neutral');
      t = W('but he sees them clearly'); POP('#gl0', t); tl.to('#gl0', { autoAlpha: 0, duration: .4 }, t + .8); mood('man', t + .2, 'surprised'); PULSE('#cf0,#cf1', t + .3, { s: 1.15 }); [0, 1, 2, 3, 4].forEach(k => PULSE('#fl0' + k, t + .2 + k * .1, { s: 1.2 }));
    });
    // revisit (Charles Bonnet explanation)
    BT.push(() => {
      let t = go('thats exactly whats happening'); WHIP(t, X(960), Y(540), 1); mood('man', t, 'neutral'); blink('man', [t + 1, t + 6, t + 11]);
      t = W('charles bonnet'); POP('#cbs0', t - .2); BOING('#cbs0', t + .3, '50% 50%');
      t = W('lose a lot of their vision'); CAM(t - .3, X(900), Y(400), 1.2, 1.0); tl.set('#eyeSb', { scaleX: .25 }, t - .3); POP('#eyeS', t - .2); tl.to('#eyeSb', { scaleX: .06, duration: 1.2, transformOrigin: '0% 50%' }, t + .2);
      t = W('as the signals from the eyes'); OUT('#eyeS', t - .2); POP('#tb0', t - .1); CAM(t, X(1100), Y(260), 1.45, 1.0); tl.to('#tbCab', { opacity: .15, duration: 1.8 }, W('fade') - .2); tl.to('#tbEye', { opacity: .35, duration: 1.4 }, W('fade') - .2);
      t = W('dont go quiet'); RING('tbR', t - .3, 3); PULSE('#tbBr', t, { s: 1.1, r: 3 });
      t = W('producing images'); ['tbI0', 'tbI1', 'tbI2'].forEach((id, k) => { tl.fromTo('#' + id, { autoAlpha: 0, x: -60 + k * 40, y: -110, scale: .3, transformOrigin: '50% 50%' }, { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: .6, ease: 'back.out(1.6)' }, t + k * .3); }); B(t);
      CAM(t + 1.2, X(1000), Y(470), 1.0, 1.4); PULSE('#cf0,#cf1', t + 1.3, { s: 1.12 }); BOB('#tp0B,#tp1B,#tp2B,#tp3B', t + 1.4, 2, -14, .3);
    });
  }
  // =============== AREA 1: office — the chatbot invents papers ===============
  { const [ox, oy] = AO(1); const X = v => ox + v, Y = v => oy + v;
    scene(BG, defs, ox, oy);
    clock(G, X(1640), Y(140), 50); server(G, X(1790), Y(300), .42); lamp(G, X(1460), Y(120));
    // wall screen = chat window
    S('rect', { x: X(540), y: Y(60), width: 840, height: 600, rx: 24, fill: '#0b1020', stroke: '#475569', 'stroke-width': 8 }, G);
    S('rect', { x: X(560), y: Y(80), width: 800, height: 560, rx: 14, fill: '#e2e8f0' }, G); S('rect', { x: X(560), y: Y(80), width: 800, height: 54, rx: 14, fill: '#334155' }, G);
    [0, 1, 2].forEach(k => S('circle', { cx: X(592 + k * 28), cy: Y(107), r: 9, fill: ['#f87171', '#fbbf24', '#4ade80'][k] }, G)); txt(G, X(960), Y(118), 'AI Chat', 30, '#e2e8f0');
    chat(G, X(880), Y(150), 460, 70, BLU, 'ub1', '#fff', 'Papers on coffee & sleep?', 30, 'r'); hidId('ub1');
    const rows = [['Caffeine and Deep Sleep', 'Hart & Cole · 2019 · pp. 112–128'], ['Coffee Timing and REM', 'J. Moreno · 2021 · pp. 45–61'], ['Evening Espresso Study', 'Lind et al. · 2017 · pp. 9–22']];
    rows.forEach(([a, b], k) => { const y = Y(250 + k * 128); const g = S('g', { id: 'pr1' + k, filter: 'url(#fSh)' }, G); S('rect', { x: X(590), y, width: 640, height: 110, rx: 16, fill: '#fff' }, g); S('rect', { x: X(590), y, width: 12, height: 110, rx: 6, fill: CYA }, g); ic(g, 'paper', X(650), y + 55, 70, '#94a3b8'); txt(g, X(700), y + 48, a, 32, C.ink, 'start', 800); txt(g, X(700), y + 88, b, 24, '#64748b', 'start', 600); hidId('pr1' + k); });
    stamp(G, X(1010), Y(440), 'DOES NOT EXIST', RED, 'st1a', 430, 44); stamp(G, X(1010), Y(568), 'DOES NOT EXIST', RED, 'st1b', 430, 44); hidId('st1a'); hidId('st1b');
    // woman at desk with laptop
    charB(G, X(250), Y(830), .78, 'u1', { hair: 'long', hairC: '#eab308', skin: SKIN[0], top: '#0ea5e9', topType: 'hoodie' });
    table(G, X(60), Y(640), 470, oy, '#78350f'); laptop(G, X(170), Y(470), .55, 'lp1'); S('rect', { x: X(195), y: Y(495), width: 180, height: 110, rx: 6, fill: '#1e3a8a' }, G);
    [0, 1, 2].forEach(k => S('rect', { x: X(215), y: Y(515 + k * 26), width: [140, 110, 90][k], height: 12, rx: 6, fill: '#93c5fd' }, G));
    S('rect', { x: X(440), y: Y(590), width: 46, height: 52, rx: 8, fill: '#f8fafc' }, G); S('path', { d: `M${X(486)} ${Y(600)} Q${X(510)} ${Y(615)} ${X(486)} ${Y(630)}`, stroke: '#f8fafc', 'stroke-width': 7, fill: 'none' }, G);
    // the robot AI
    botB(G, X(1600), Y(840), .72, 'b1');
    bubble(G, X(1380), Y(250), 300, 90, '100% sure!', 'bb1', 38, .25); hidId('bb1'); sparkH(G, X(1600), Y(360), 1.2, '#fde047', 'sk1');
    fgLeaves(G, X(-60), Y(1080), 1.2, 1); fgBox(G, X(1550), Y(1000), 420, 200);
    BT.push(() => {
      let t = go('now somewhere else'); WHIP(t, X(960), Y(540), 1); blink('u1', [t + 1, t + 6.5, t + 12]); blink('b1', [t + 2, t + 8, t + 13]); breathe('b1', t, 9, 1.6);
      t = W('asks an ai chatbot'); tl.to('#u1aR', { rotation: -18, transformOrigin: '50% 0%', duration: .12, yoyo: true, repeat: 9 }, t); tl.to('#u1aL', { rotation: 18, transformOrigin: '50% 0%', duration: .12, yoyo: true, repeat: 9 }, t + .06);
      t = W('research papers'); POP('#ub1', t - .3); BOING('#ub1', t + .2, '50% 50%');
      t = W('it replies instantly'); talk('b1', t, W('some of those')); point('b1', t, 'aL', 70, 4); [0, 1, 2].forEach(k => { POP('#pr1' + k, t + .2 + k * .25); BOING('#pr1' + k, t + .65 + k * .25, '50% 50%'); });
      CAM(W('titles') - .2, X(960), Y(420), 1.25, 1.2); ['titles', 'authors', 'years', 'page numbers'].forEach((w, k) => PULSE('#pr1' + k % 3, W(w), { s: 1.04 }));
      t = W('some of those papers'); mood('u1', t, 'surprised'); CAM(t - .1, X(960), Y(470), 1.4, .8); POP('#st1a', W('dont exist'), { s: 1.8 }); POP('#st1b', W('dont exist') + .3, { s: 1.8 }); SHAKE('#pr11', W('dont exist') + .1); dim(W('dont exist'), 1.2);
      t = W('the ai invented them'); CAM(t - .2, X(1500), Y(470), 1.35, .9); liar('b1', t + .2); mood('b1', t, 'happy');
      t = W('complete confidence'); POP('#bb1', t - .4); jump('b1', t); SPK('sk1', t + .1); nod('b1', t + .5);
    });
  }
  // =============== AREA 2: stage — one word for both ===============
  { const [ox, oy] = AO(2); const X = v => ox + v, Y = v => oy + v;
    scene(BG, defs, ox, oy, null, null, 840);
    [[0, 1], [1920, -1]].forEach(([x, d]) => S('path', { d: `M${X(x)} ${Y(-160)} L${X(x + d * 280)} ${Y(-160)} Q${X(x + d * 180)} ${Y(400)} ${X(x + d * 240)} ${Y(840)} L${X(x)} ${Y(840)} Z`, fill: '#7f1d1d' }, G));
    for (let k = 0; k < 14; k++) S('circle', { class: 'bulb', cx: X(300 + k * 102), cy: Y(856), r: 9, fill: k % 2 ? '#fde047' : '#fb923c' }, G);
    cone(G, X(420), Y(-60), 520, 900); cone(G, X(1500), Y(-60), 520, 900);
    charB(G, X(420), Y(830), .62, 'm2', { hair: 'bald', hairC: '#e5e7eb', skin: SKIN[0], top: '#7c5c3b', topType: 'blazer', glasses: true, beard: true });
    botB(G, X(1500), Y(830), .6, 'b2');
    txt(G, X(960), Y(230), 'HALLUCINATION', 120, '#fde68a', 'middle', 800, 'hw2'); hidId('hw2');
    ARW(G, X(780), Y(270), X(520), Y(400), '#fde68a', 'ha2', 8); ARW(G, X(1140), Y(270), X(1400), Y(400), '#fde68a', 'hb2', 8); hidId('ha2'); hidId('hb2');
    const c0 = card(G, X(640), Y(360), 290, 330, 'xc2a', '#1e1b4b'); S('rect', { x: X(640), y: Y(360), width: 290, height: 330, rx: 18, fill: 'none', stroke: ROSE, 'stroke-width': 6 }, c0); brainG(c0, X(785), Y(525), .62, 'xb2', false);
    const c1 = card(G, X(990), Y(360), 290, 330, 'xc2b', '#1e1b4b'); S('rect', { x: X(990), y: Y(360), width: 290, height: 330, rx: 18, fill: 'none', stroke: VIO, 'stroke-width': 6 }, c1); chipM(c1, X(1135), Y(525), .6, VIO, 'xp2');
    hidId('xc2a'); hidId('xc2b');
    const ne = S('g', { id: 'ne2' }, G); S('circle', { cx: X(960), cy: Y(525), r: 46, fill: '#fff', stroke: C.ink, 'stroke-width': 6 }, ne); S('path', { d: `M${X(935)} ${Y(512)} L${X(985)} ${Y(512)} M${X(935)} ${Y(540)} L${X(985)} ${Y(540)} M${X(975)} ${Y(490)} L${X(945)} ${Y(560)}`, stroke: RED, 'stroke-width': 9, 'stroke-linecap': 'round' }, ne); hidId('ne2');
    QM(G, X(420), Y(330), 110, '#fde047', 'q2a'); QM(G, X(1500), Y(330), 110, '#fde047', 'q2b'); hidId('q2a'); hidId('q2b');
    bulb(G, X(960), Y(770), .55, 'bl2'); hidId('bl2');
    heads(G, X(-100), X(2020), Y(1010), 13); fgHeads(G, X(-40), Y(1010), 2);
    BT.push(() => {
      let t = go('we use the same word'); ZOOMIN(t, AO(1)[0] + 960, AO(1)[1] + 400, X(960), Y(560), 1.25); CAM(t + .1, X(960), Y(540), 1, 1.4, 'power2.out'); breathe('m2', t, 4); blink('m2', [t + 1.5, t + 6]); blink('b2', [t + 2.5, t + 8]);
      t = W('hallucination'); POP('#hw2', t, { s: .3 }); BOING('#hw2', t + .45, '50% 50%'); DR('#ha2', t + .3, { d: .5 }); DR('#hb2', t + .3, { d: .5 }); mood('m2', t + .4, 'surprised'); mood('b2', t + .4, 'surprised');
      t = W('under the hood'); OUT('#ha2,#hb2', t); POP('#xc2a', t + .1); POP('#xc2b', t + .35); CAM(t, X(960), Y(500), 1.15, 1.2);
      t = W('inside a human brain'); PULSE('#xc2a', t, { s: 1.06 }); t = W('inside an ai'); PULSE('#xc2b', t, { s: 1.06 }); fire('xp2N', 4, t, .15, 3);
      t = W('completely different'); POP('#ne2', t, { s: .3 }); SHAKE('#ne2', t + .5);
      t = W('and understanding that'); CAM(t, X(960), Y(540), 1, 1.2); POP('#q2a', t + .3); POP('#q2b', t + .5); mood('m2', t, 'neutral'); mood('b2', t, 'neutral');
      t = W('something surprising'); POP('#bl2', t); glow(t + .2); mood('m2', t + .2, 'happy'); mood('b2', t + .2, 'happy'); OUT('#q2a,#q2b', t + .2);
    });
  }
  // =============== AREA 3: are eyes cameras? ===============
  { const [ox, oy] = AO(3); const X = v => ox + v, Y = v => oy + v;
    scene(BG, defs, ox, oy);
    shelf(G, X(40), Y(470), 200, 350); clock(G, X(1830), Y(130), 46); plant(G, X(1840), Y(820), 1);
    // the real world
    const wg = S('g', { id: 'wd3' }, G); treeG(wg, X(250), Y(330), 1.2); sunG(wg, X(150), Y(160), 34);
    eyeBig(G, X(760), Y(430), 1.25, 'ey3');
    camG(G, X(760), Y(430), 1.1, 'cm3'); hidId('cm3');
    [[380, 300], [400, 430], [380, 540]].forEach(([x, y], k) => { S('path', { id: 'ry3' + k, class: 'draw', d: `M${X(x)} ${Y(y)} L${X(625)} ${Y(430 + (k - 1) * 40)}`, stroke: '#fde047', 'stroke-width': 7, 'stroke-linecap': 'round' }, G); hidId('ry3' + k); });
    S('path', { id: 'cb3', class: 'draw', d: `M${X(900)} ${Y(430)} L${X(1240)} ${Y(430)}`, stroke: BLU, 'stroke-width': 12, 'stroke-linecap': 'round' }, G); hidId('cb3');
    const sc = S('g', { id: 'sc3' }, G); S('rect', { x: X(1240), y: Y(230), width: 500, height: 400, rx: 20, fill: '#1f2937', stroke: '#94a3b8', 'stroke-width': 8 }, sc); S('rect', { x: X(1260), y: Y(250), width: 460, height: 360, rx: 10, fill: '#0b1226' }, sc);
    S('rect', { x: X(1470), y: Y(630), width: 40, height: 70, fill: '#64748b' }, G); S('rect', { x: X(1400), y: Y(700), width: 180, height: 16, rx: 8, fill: '#64748b' }, G);
    const pc = S('g', { id: 'pc3' }, G); S('rect', { x: X(1260), y: Y(250), width: 460, height: 360, rx: 10, fill: '#7dd3fc' }, pc); S('rect', { x: X(1260), y: Y(520), width: 460, height: 90, rx: 10, fill: '#22c55e' }, pc); treeG(pc, X(1530), Y(420), .9); sunG(pc, X(1350), Y(320), 30); hidId('pc3');
    brainG(G, X(1490), Y(110), .42, 'br3'); hidId('br3'); S('path', { id: 'bl3', class: 'draw', d: `M${X(1490)} ${Y(180)} L${X(1490)} ${Y(228)}`, stroke: ROSE, 'stroke-width': 8 }, G); hidId('bl3');
    XM(G, X(1070), Y(430), 70, 'x3'); hidId('x3');
    dots(G, X(390), Y(430), 3, '#fde047', 'rd3', 12); hidId('rd3'); dots(G, X(905), Y(430), 3, '#93c5fd', 'cd3', 12); hidId('cd3');
    heads(G, X(300), X(1700), Y(1000), 10); fgHeads(G, X(1500), Y(1000), 2);
    BT.push(() => {
      let t = go('lets start with the human brain'); WHIP(t, X(960), Y(540), 1); POP('#br3', t + .3); BOING('#br3', t + .8, '50% 50%'); eyes('#ey3', [t + 1.5, t + 5.5]);
      t = W('work like cameras'); POP('#cm3', t - .3); BOING('#cm3', t + .2); tl.to('#ey3', { opacity: 0, duration: .3 }, t - .3);
      t = W('light comes in'); [0, 1, 2].forEach(k => DR('#ry3' + k, t + k * .1, { d: .5 })); RUN('rd3', 230, 0, t + .4, .6, 2);
      t = W('simply shows us'); DR('#cb3', t - .2, { d: .5 }); RUN('cd3', 330, 0, t + .1, .5, 2); DR('#bl3', t, { d: .3 }); FADE('#pc3', W('the picture'), { d: .6 }); PULSE('#br3', W('the picture'), { s: 1.12 });
      t = W('but thats not really'); POP('#x3', t, { s: 2 }); dim(t, 1.2); SHAKE('#sc3', t + .2); tl.to('#cm3', { opacity: .3, duration: .4 }, t + .2);
    });
  }
  // =============== AREA 4: a brain sealed in a dark skull ===============
  { const [ox, oy] = AO(4); const X = v => ox + v, Y = v => oy + v;
    scene(BG, defs, ox, oy);
    // world outside
    const wg = S('g', { id: 'wd4' }, G); treeG(wg, X(220), Y(600), 1.1); sunG(wg, X(160), Y(170), 40); S('rect', { x: X(300), y: Y(700), width: 110, height: 100, rx: 10, fill: '#f8fafc' }, wg); S('path', { d: `M${X(410)} ${Y(720)} Q${X(450)} ${Y(750)} ${X(410)} ${Y(780)}`, stroke: '#f8fafc', 'stroke-width': 10, fill: 'none' }, wg);
    // head profile
    S('path', { d: `M${X(1000)} ${Y(800)} L${X(1000)} ${Y(700)} Q${X(820)} ${Y(690)} ${X(830)} ${Y(560)} L${X(780)} ${Y(520)} L${X(830)} ${Y(470)} Q${X(800)} ${Y(140)} ${X(1150)} ${Y(110)} Q${X(1520)} ${Y(110)} ${X(1530)} ${Y(430)} Q${X(1530)} ${Y(620)} ${X(1390)} ${Y(700)} L${X(1390)} ${Y(800)} Z`, fill: '#0b1020', stroke: '#64748b', 'stroke-width': 10 }, G);
    brainG(G, X(1180), Y(390), .95, 'br4'); S('rect', { id: 'dk4', x: X(880), y: Y(130), width: 640, height: 560, fill: '#020617', opacity: 0 }, G);
    // sensors + wires
    eyeBig(G, X(640), Y(250), .45, 'se0'); earG(G, X(640), Y(440), 1, '#fca5a5', 'se1'); handG(G, X(640), Y(630), 1, '#fca5a5', 'se2');
    const wy = [250, 440, 630]; wy.forEach((y, k) => { S('path', { id: 'wr4' + k, class: 'draw', d: `M${X(700)} ${Y(y)} Q${X(860)} ${Y(y + (k - 1) * -40)} ${X(1020)} ${Y(390 + (k - 1) * 60)}`, stroke: BLU, 'stroke-width': 9, fill: 'none', 'stroke-linecap': 'round' }, G); hidId('wr4' + k); dots(G, X(700), Y(y), 3, '#93c5fd', 'wd4' + k, 11); hidId('wd4' + k); });
    ['se0', 'se1', 'se2'].forEach(hidId);
    S('rect', { id: 'gap4', x: X(820), y: Y(390), width: 50, height: 120, fill: '#0b1226' }, G); hidId('gap4');
    ARW(G, X(420), Y(450), X(740), Y(450), '#94a3b8', 'aw4', 8); hidId('aw4'); XM(G, X(560), Y(450), 50, 'xw4'); hidId('xw4');
    pill(G, X(860), Y(195), 'messy', '#fde68a', C.ink, 'pm4', 28); pill(G, X(860), Y(455), 'incomplete', '#fde68a', C.ink, 'pi4', 28); pill(G, X(860), Y(700), 'delayed', '#fde68a', C.ink, 'pd4', 28); ['pm4', 'pi4', 'pd4'].forEach(hidId);
    clock(G, X(960), Y(780), 34, 'ck4'); hidId('ck4');
    bulb(G, X(1180), Y(90), .55, 'bb4'); hidId('bb4'); ringH(G, X(1180), Y(390), 230, ROSE, 'rg4');
    plant(G, X(1800), Y(820), 1.1); lamp(G, X(1720), Y(140)); fgBox(G, X(-80), Y(990), 380, 200);
    BT.push(() => {
      let t = go('your brain is sealed'); WHIP(t, X(1180), Y(420), 1.3); CAM(t + .2, X(1150), Y(450), 1.15, 2); tl.to('#dk4', { opacity: .55, duration: 1.2 }, W('dark skull')); tl.to('#br4', { opacity: .5, duration: 1.2 }, W('dark skull'));
      t = W('never touches'); CAM(t - .2, X(960), Y(540), 1, 1.1); DR('#aw4', t, { d: .5 }); POP('#xw4', t + .5, { s: 2 });
      t = W('electrical signals'); OUT('#aw4,#xw4', t - .3); [0, 1, 2].forEach(k => { DR('#wr4' + k, t + k * .15, { d: .6 }); });
      ['eyes', 'ears', 'and skin'].forEach((w, k) => { POP('#se' + k, W(w) - .1); RUN('wd4' + k, 320, [80, -50, -180][k], W(w) + .2, .7, 3); });
      t = W('messy'); POP('#pm4', t); tl.to('#wr40', { x: 6, duration: .05, yoyo: true, repeat: 13 }, t);
      t = W('incomplete'); POP('#pi4', t); tl.set('#gap4', { autoAlpha: 1 }, t);
      t = W('delayed'); POP('#pd4', t); POP('#ck4', t + .1); tl.to('#ck4 .clkH', { rotation: 540, transformOrigin: '50% 50%', duration: 1.5 }, t + .1);
      t = W('so the brain does something'); OUT('#pm4,#pi4,#pd4,#ck4', t - .2); tl.to('#br4', { opacity: 1, duration: .5 }, t); tl.to('#dk4', { opacity: .15, duration: .5 }, t); CAM(t, X(1180), Y(400), 1.25, 1.1); RING('rg4', t + .3, 3);
      t = W('it predicts'); POP('#bb4', t - .1); BOING('#bb4', t + .4, '50% 50%'); glow(t);
    });
  }
  // =============== AREA 5: guess -> check -> update ===============
  { const [ox, oy] = AO(5); const X = v => ox + v, Y = v => oy + v;
    scene(BG, defs, ox, oy);
    clock(G, X(1830), Y(130), 44); lamp(G, X(720), Y(100)); plant(G, X(80), Y(820), 1);
    brainG(G, X(430), Y(470), 1.05, 'br5');
    // memories (past experiences)
    [[130, 160, '#fbbf24'], [300, 120, '#22c55e'], [560, 140, '#60a5fa'], [700, 260, '#f472b6']].forEach(([x, y, c], k) => { const g = frameP(G, X(x - 60), Y(y - 45), 120, 90, 'mm5' + k, '#a16207'); S('circle', { cx: X(x), cy: Y(y), r: 26, fill: c }, g); hidId('mm5' + k); });
    // guess card (amber) with a ball
    const gc = S('g', { id: 'gc5' }, G); S('rect', { x: X(760), y: Y(220), width: 300, height: 300, rx: 24, fill: '#1e293b', stroke: AMB, 'stroke-width': 8 }, gc); ballG(gc, X(910), Y(370), 80, 'gb5'); hidId('gc5');
    const gp = S('g', { id: 'gp5' }, G); S('rect', { x: X(772), y: Y(232), width: 276, height: 276, rx: 18, fill: '#1e293b' }, gp); ic(gp, 'plant', X(910), Y(370), 180, '#22c55e'); hidId('gp5');
    CRV(G, `M${X(600)} ${Y(400)} Q${X(680)} ${Y(330)} ${X(752)} ${Y(360)}`, AMB, 'ga5', 8); hidId('ga5');
    // signal card (blue) — blurry pixels
    const blob = (cx, cy, col, bg) => (u, v) => { const d = Math.hypot(u - cx, v - cy), n = rnd(Math.floor(u * 97) + Math.floor(v * 61) * 13); return d < .32 + (n - .5) * .16 ? col : (n > .82 ? '#475569' : bg); };
    const sg = S('g', { id: 'sg5' }, G); S('rect', { x: X(1360), y: Y(220), width: 300, height: 300, rx: 24, fill: '#1e293b', stroke: BLU, 'stroke-width': 8 }, sg); pixImg(sg, X(1380), Y(240), 13, 13, 20, 'px5', blob(.5, .5, '#ef4444', '#334155')); hidId('sg5');
    const sg2 = S('g', { id: 'sh5' }, G); S('rect', { x: X(1372), y: Y(232), width: 276, height: 276, rx: 18, fill: '#1e293b' }, sg2); pixImg(sg2, X(1380), Y(240), 13, 13, 20, 'px5b', blob(.5, .45, '#16a34a', '#334155')); hidId('sh5');
    eyeBig(G, X(1800), Y(370), .5, 'ey5'); hidId('ey5'); ARW(G, X(1740), Y(370), X(1675), Y(370), BLU, 'sa5', 9); hidId('sa5');
    txt(G, X(1210), Y(395), '=', 110, GRN, 'middle', 800, 'eq5'); hidId('eq5'); XM(G, X(1210), Y(370), 40, 'nq5'); hidId('nq5');
    check(G, X(1210), Y(560), 46, 'ck5'); hidId('ck5');
    // clear world view
    const wv = S('g', { id: 'wv5' }, G); S('rect', { x: X(960), y: Y(620), width: 500, height: 190, rx: 16, fill: '#7dd3fc', stroke: '#f8fafc', 'stroke-width': 6 }, wv); S('rect', { x: X(960), y: Y(740), width: 500, height: 70, rx: 12, fill: '#22c55e' }, wv); ballG(wv, X(1210), Y(722), 36); sunG(wv, X(1030), Y(670), 18); hidId('wv5');
    ringH(G, X(910), Y(370), 170, AMB, 'rg5'); sparkH(G, X(910), Y(370), 1.4, '#fde047', 'sk5');
    fgLeaves(G, X(1960), Y(1080), 1.2, -1); fgBox(G, X(-60), Y(990), 360, 200);
    BT.push(() => {
      let t = go('based on everything'); ZOOMIN(t, AO(4)[0] + 1180, AO(4)[1] + 90, X(430), Y(470), 1.4); CAM(t + .1, X(700), Y(470), 1.05, 1.6, 'power2.out'); eyes('#br5E', [t + 1, t + 5, t + 9, t + 13]);
      t = W('experienced before'); [0, 1, 2, 3].forEach(k => { POP('#mm5' + k, t + k * .15); tl.to('#mm5' + k, { x: [300, 130, -130, -270][k], y: [310, 350, 330, 210][k], scale: .2, autoAlpha: 0, transformOrigin: '50% 50%', duration: .7, ease: 'power2.in' }, t + 1.1 + k * .15); }); B(t);
      t = W('it constantly guesses'); DR('#ga5', t, { d: .5 }); POP('#gc5', t + .4); BOING('#gc5', t + .9, '50% 50%'); RING('rg5', t + .6, 1);
      t = W('then it checks'); CAM(t - .2, X(1200), Y(430), 1.05, 1.2); POP('#ey5', t); DR('#sa5', t + .3, { d: .4 }); POP('#sg5', W('signals coming'));
      t = W('when the guess and the signal match'); POP('#eq5', t + .2); t = W('you see the world'); POP('#ck5', t - .2); FADE('#wv5', t, { d: .6 }); glow(t); SPK('sk5', t);
      t = W('when they dont'); OUT('#eq5,#ck5', t - .2); FADE('#sh5', t, { d: .4 }); POP('#nq5', t + .3, { s: 2 }); SHAKE('#gc5', t + .4); tl.to('#wv5', { opacity: .3, duration: .4 }, t);
      t = W('updates its guess'); OUT('#nq5', t); tl.fromTo('#gp5', { autoAlpha: 0, scale: .5, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: .5, ease: 'back.out(1.7)' }, t + .1); B(t); POP('#ck5', t + .7); glow(t + .7);
    });
  }
  // =============== AREA 6: perception = best guess on an anchor; the anchor slips ===============
  { const [ox, oy] = AO(6); const X = v => ox + v, Y = v => oy + v;
    scene(BG, defs, ox, oy);
    // chalkboard + scientists
    S('rect', { x: X(60), y: Y(110), width: 480, height: 270, rx: 12, fill: '#78350f' }, G); S('rect', { x: X(76), y: Y(126), width: 448, height: 238, rx: 6, fill: '#14532d' }, G);
    eyeBig(G, X(150), Y(245), .4); S('path', { d: `M${X(205)} ${Y(245)} L${X(270)} ${Y(245)}`, stroke: '#f8fafc', 'stroke-width': 6 }, G); brainG(G, X(330), Y(245), .35, 'cb6', false); S('path', { d: `M${X(395)} ${Y(245)} L${X(445)} ${Y(245)}`, stroke: '#f8fafc', 'stroke-width': 6 }, G); txt(G, X(480), Y(270), '?', 70, '#fde047');
    charB(G, X(180), Y(830), .62, 'n6a', { hair: 'short', hairC: '#7c4a1e', skin: SKIN[0], top: '#f1f5f9', topType: 'blazer', glasses: true });
    charB(G, X(400), Y(830), .62, 'n6b', { hair: 'long', hairC: '#2b1a12', skin: SKIN[0], top: '#f1f5f9', topType: 'blazer' });
    { const rc = camG(G, X(720), Y(250), .85, 'rc6'); txt(rc, X(720), Y(160), 'REC', 34, RED, 'middle', 800); } hidId('rc6'); XM(G, X(720), Y(260), 80, 'xr6'); hidId('xr6');
    // balloon (the guess) on a rope to the senses anchor
    const BW = S('g', { id: 'bw6' }, G); const bi = S('g', { id: 'bl6' }, BW); balloon(bi, X(1150), Y(280), .6, 'GUESS', 'blIn6'); hidId('bw6');
    S('path', { id: 'rp6', class: 'draw', d: `M${X(1150)} ${Y(546)} Q${X(1130)} ${Y(620)} ${X(1150)} ${Y(690)}`, stroke: '#e2e8f0', 'stroke-width': 7, fill: 'none' }, G); hidId('rp6');
    const an = S('g', { id: 'an6' }, G); anchorG(an, X(1150), Y(770), .9, BLU); eyeBig(an, X(1035), Y(770), .3); earG(an, X(1265), Y(770), .55, '#fca5a5'); hidId('an6');
    S('path', { id: 'rb6', d: `M${X(1150)} ${Y(690)} Q${X(1170)} ${Y(660)} ${X(1140)} ${Y(630)} L${X(1155)} ${Y(615)}`, stroke: '#e2e8f0', 'stroke-width': 7, fill: 'none' }, G); hidId('rb6');
    ringH(G, X(1150), Y(700), 130, GRN, 'rg6');
    // world it generates
    [['house', 880, 200, '#fbbf24'], ['plant', 900, 470, '#22c55e'], ['sun', 1420, 190, '#fde047'], ['car', 1410, 450, '#f87171']].forEach(([n, x, y, c], k) => { const g = S('g', { id: 'gw6' + k }, G); if (n === 'sun') sunG(g, X(x), Y(y), 34); else ic(g, n, X(x), Y(y), 110, c); hidId('gw6' + k); });
    // meters
    [[1630, 'SIGNAL', BLU, 'ms6'], [1790, 'GUESS', AMB, 'mg6']].forEach(([x, l, c, id]) => { const g = S('g', { id: id + 'G' }, G); S('rect', { x: X(x - 40), y: Y(300), width: 80, height: 380, rx: 20, fill: '#0f172a', stroke: '#334155', 'stroke-width': 5 }, g); S('rect', { id, x: X(x - 30), y: Y(310), width: 60, height: 360, rx: 14, fill: c }, g); txt(g, X(x), Y(730), l, 30, c, 'middle', 800); hidId(id + 'G'); });
    ghostG(G, X(1400), Y(600), .9, 'gh6'); hidId('gh6');
    plant(G, X(1880), Y(820), 1); fgHeads(G, X(-60), Y(1010), 1); fgBox(G, X(1620), Y(1000), 360, 200);
    BT.push(() => {
      let t = go('many neuroscientists'); WHIP(t, X(960), Y(540), 1); nod('n6a', t + .4); nod('n6b', t + .7); point('n6a', t + .5, 'aR', -110, 2); blink('n6a', [t + 2, t + 9, t + 17]); blink('n6b', [t + 3, t + 11, t + 22]); talk('n6b', t, t + 2.5);
      t = W('direct recording'); POP('#rc6', t - .4); tl.to('#rc6 circle', { opacity: .3, duration: .3, yoyo: true, repeat: 3 }, t); POP('#xr6', t + .5, { s: 2 });
      t = W('best guess'); OUT('#rc6,#xr6', t - .4); POP('#bw6', t - .2); BOING('#bw6', t + .3); BOB('#bl6', t + .5, 12, -14, .9); CAM(t, X(1150), Y(470), 1.15, 1.2);
      t = W('kept in check by your'); DR('#rp6', t, { d: .5 }); POP('#an6', t + .3); BOING('#an6', t + .8);
      t = W('generating the world'); [0, 1, 2, 3].forEach(k => { POP('#gw6' + k, t - .2 + k * .2); BOING('#gw6' + k, t + .3 + k * .2, '50% 50%'); });
      t = W('anchored to whats'); RING('rg6', t, 3); PULSE('#an6', t + .2, { s: 1.08 }); glow(t + .2);
      t = W('when that anchor slips'); CAM(t - .6, X(1200), Y(480), 1.0, 1.0); OUT('#gw60,#gw61,#gw62,#gw63', t - .5); OUT('#rp6', t); tl.set('#rb6', { autoAlpha: 1 }, t); tl.to('#bw6', { y: -150, rotation: 6, transformOrigin: '50% 100%', duration: 2.4, ease: 'power1.out' }, t); dim(t, 1.5); mood('n6a', t, 'surprised'); B(t);
      t = W('signals become weak'); FADE('#ms6G,#mg6G', t - .8); tl.fromTo('#ms6', { scaleY: 1, transformOrigin: '50% 100%' }, { scaleY: .2, duration: 1.2, ease: 'power2.inOut' }, t); tl.to('#an6', { opacity: .35, duration: 1 }, t);
      t = W('become too strong'); tl.fromTo('#mg6', { scaleY: .5, transformOrigin: '50% 100%' }, { scaleY: 1, duration: 1.0, ease: 'power2.out' }, t - .3); tl.to('#bl6', { scale: 1.25, transformOrigin: '50% 50%', duration: 1, ease: 'back.out(1.5)' }, t - .2); B(t);
      t = W('guesses can take over'); PULSE('#mg6G', t, { s: 1.06 }); SHAKE('#bw6', t);
      t = W('you perceive something'); POP('#gh6', t); tl.to('#gh6', { y: -16, duration: .7, yoyo: true, repeat: 3, ease: 'sine.inOut' }, t + .5); mood('n6b', t + .2, 'surprised'); CAM(t, X(1250), Y(470), 1.0, .9);
    });
  }
  // =============== AREA 7: bedroom — other causes, and healthy people too ===============
  { const [ox, oy] = AO(7); const X = v => ox + v, Y = v => oy + v;
    scene(BG, defs, ox, oy);
    windowPane(G, X(590), Y(390), 230, 210, 'url(#gNight)'); S('circle', { cx: X(650), cy: Y(440), r: 22, fill: '#e0f2fe' }, G);
    S('ellipse', { cx: X(330), cy: Y(560), rx: 190, ry: 250, fill: '#93c5fd', opacity: .08 }, G);
    // cause panels
    const pan = (k, lab) => { const x = X(140 + k * 420), g = S('g', { id: 'cz7' + k }, G); S('rect', { x, y: Y(70), width: 330, height: 260, rx: 18, fill: '#0f172a', stroke: ['#818cf8', '#94a3b8', ROSE, AMB][k], 'stroke-width': 6 }, g); txt(g, x + 165, Y(310), lab, 28, '#e2e8f0', 'middle', 800); hidId('cz7' + k); return [g, x + 165]; };
    { const [g, cx] = pan(0, 'NO SLEEP'); S('path', { d: `M${cx - 50} ${Y(120)} A60 60 0 1 0 ${cx - 10} ${Y(240)} A48 48 0 1 1 ${cx - 50} ${Y(120)} Z`, fill: '#fde68a' }, g); clock(g, cx + 70, Y(180), 44, 'ck7'); }
    { const [g, cx] = pan(1, 'NO INPUT'); eyeBig(g, cx - 70, Y(185), .45); earG(g, cx + 75, Y(185), .8, '#fca5a5'); XM(g, cx - 70, Y(185), 42); XM(g, cx + 75, Y(185), 42); }
    { const [g, cx] = pan(2, 'BRAIN CHEMISTRY'); brainG(g, cx - 60, Y(180), .38, 'bc7', false); const m = S('g', { id: 'ml7' }, g); [[60, 150], [120, 190], [70, 235], [140, 130]].forEach(([dx, y], k, a) => { if (k) S('path', { d: `M${cx + a[0][0]} ${Y(a[0][1])} L${cx + dx} ${Y(y)}`, stroke: '#e2e8f0', 'stroke-width': 5 }, m); }); [[60, 150], [120, 190], [70, 235], [140, 130]].forEach(([dx, y], k) => S('circle', { cx: cx + dx, cy: Y(y), r: 18, fill: ['#f472b6', '#60a5fa', '#fbbf24', '#34d399'][k] }, m)); }
    { const [g, cx] = pan(3, 'DRUGS'); [[-60, -20, '#f87171'], [40, 15, '#60a5fa'], [-10, 60, '#fbbf24']].forEach(([dx, rot, c], k) => { const p = S('g', { class: 'pl7', transform: `rotate(${rot} ${cx + dx} ${Y(180)})` }, g); S('rect', { x: cx + dx - 55, y: Y(158), width: 110, height: 44, rx: 22, fill: '#f8fafc' }, p); S('rect', { x: cx + dx - 55, y: Y(158), width: 55, height: 44, rx: 22, fill: c }, p); }); }
    // bed, sleeper, night table
    S('rect', { x: X(1160), y: Y(520), width: 40, height: 300, rx: 10, fill: '#78350f' }, G); S('rect', { x: X(1180), y: Y(660), width: 560, height: 90, rx: 18, fill: '#e2e8f0' }, G); S('rect', { x: X(1190), y: Y(750), width: 30, height: 70, fill: '#451a03' }, G); S('rect', { x: X(1700), y: Y(750), width: 30, height: 70, fill: '#451a03' }, G);
    S('ellipse', { cx: X(1270), cy: Y(650), rx: 85, ry: 34, fill: '#f8fafc' }, G);
    const sw = S('g', { transform: `translate(${X(1560)},${Y(655)}) rotate(-90)` }, G); charB(sw, 0, 0, .55, 'p7', { hair: 'short', hairC: '#7c4a1e', skin: SKIN[0], top: '#22c55e', topType: 'tshirt' });
    S('path', { d: `M${X(1335)} ${Y(600)} Q${X(1500)} ${Y(570)} ${X(1735)} ${Y(610)} L${X(1740)} ${Y(740)} L${X(1335)} ${Y(740)} Z`, fill: '#4f46e5' }, G); S('path', { d: `M${X(1335)} ${Y(600)} L${X(1335)} ${Y(740)}`, stroke: '#818cf8', 'stroke-width': 18 }, G);
    table(G, X(960), Y(660), 160, oy, '#92400e'); S('rect', { x: X(985), y: Y(605), width: 110, height: 55, rx: 10, fill: '#0f172a' }, G); txt(G, X(1040), Y(646), '3:00', 34, RED, 'middle', 800, 'dc7');
    S('circle', { id: 'lg7', cx: X(1150), cy: Y(560), r: 260, fill: 'url(#gLamp)' }, G); hidId('lg7'); S('path', { d: `M${X(1110)} ${Y(560)} L${X(1170)} ${Y(560)} L${X(1155)} ${Y(520)} L${X(1125)} ${Y(520)} Z`, fill: '#fde68a' }, G); S('rect', { x: X(1135), y: Y(560), width: 10, height: 100, fill: '#a16207' }, G);
    // the shape in the corner, and what it really is
    const cr = S('g', { id: 'cr7' }, G); S('rect', { x: X(322), y: Y(420), width: 16, height: 400, fill: '#78350f' }, cr); S('rect', { x: X(260), y: Y(805), width: 140, height: 16, rx: 8, fill: '#78350f' }, cr); S('path', { d: `M${X(330)} ${Y(440)} L${X(250)} ${Y(500)} L${X(240)} ${Y(720)} L${X(420)} ${Y(720)} L${X(410)} ${Y(500)} Z`, fill: '#92400e' }, cr); S('rect', { x: X(280), y: Y(395), width: 100, height: 30, rx: 8, fill: '#1f2937' }, cr); S('rect', { x: X(300), y: Y(365), width: 60, height: 40, rx: 6, fill: '#1f2937' }, cr); hidId('cr7');
    const shp = S('g', { id: 'sh7' }, G); person(shp, X(330), Y(820), 1.2, '#020617'); [-22, 22].forEach(dx => S('circle', { cx: X(330 + dx), cy: Y(545), r: 8, fill: '#f87171' }, shp)); hidId('sh7');
    [0, 1, 2].forEach(k => { S('path', { id: 'sw7' + k, d: `M${X(1180 - k * 30)} ${Y(560 - k * 25)} Q${X(1150 - k * 30)} ${Y(600)} ${X(1180 - k * 30)} ${Y(640 + k * 25)}`, stroke: '#fde68a', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, G); hidId('sw7' + k); });
    bubble(G, X(900), Y(400), 260, 90, 'Sam…?', 'nm7', 40, .3); hidId('nm7');
    fgBox(G, X(1640), Y(1000), 380, 200, '#1e1b4b'); fgLeaves(G, X(-60), Y(1080), 1.1, 1);
    BT.push(() => {
      let t = go('something similar can happen'); ZOOMIN(t, AO(0)[0] + 1060, AO(0)[1] + 190, X(960), Y(250), 1.25); CAM(t + .1, X(960), Y(540), 1, 1.5, 'power2.out'); breathe('p7', t, 10, 1.4);
      t = W('extreme sleep deprivation'); POP('#cz70', t - .2); SPIN('#ck7 .clkH', t, 3); mood('p7', t, 'tired'); PULSE('#dc7', t + .5, { s: 1.15 });
      t = W('sensory deprivation'); POP('#cz71', t - .3);
      t = W('mental health conditions'); POP('#cz72', t - .2); t = W('changes in brain chemistry'); SPIN('#ml7', t, 6); PULSE('#bc7', t + .5, { s: 1.15, r: 3 });
      t = W('coming from the outside'); CAM(t - .5, X(960), Y(330), 1.2, 1.0);
      t = W('certain drugs'); POP('#cz73', t - .1); tl.to('.pl7', { y: -14, duration: .2, yoyo: true, repeat: 3, stagger: .1 }, t + .3); t = W('disrupt the balance'); SHAKE('#cz73', t);
      t = W('even healthy people'); CAM(t - .2, X(1250), Y(590), 1.3, 1.2); mood('p7', t, 'tired'); blink('p7', [t + .8]);
      t = W('heard their name'); [0, 1, 2].forEach(k => POP('#sw7' + k, t + k * .12)); POP('#nm7', W('called') - .1); mood('p7', W('called'), 'surprised'); OUT('#sw70,#sw71,#sw72', t + 2.2);
      t = W('or seen a shape'); OUT('#nm7', t - .2); CAM(t - .2, X(420), Y(560), 1.3, 1.0); dim(t, 2.2, .4); FADE('#sh7', t + .2, { d: .7 }); tl.to('#sh7', { x: 10, duration: 1.2, yoyo: true, repeat: 1, ease: 'sine.inOut' }, t + .8);
      t = W('turned out to be nothing'); FADE('#lg7', t - .3, { d: .2 }); OUT('#sh7', t - .1, { d: .5 }); FADE('#cr7', t - .1, { d: .5 }); glow(t); CAM(t + .4, X(700), Y(560), 1.05, 1.0);
    });
  }
  // =============== AREA 8: a human hallucination is an experience ===============
  { const [ox, oy] = AO(8); const X = v => ox + v, Y = v => oy + v;
    scene(BG, defs, ox, oy, null, null, 840);
    [[0, 1], [1920, -1]].forEach(([x, d]) => S('path', { d: `M${X(x)} ${Y(-160)} L${X(x + d * 240)} ${Y(-160)} Q${X(x + d * 160)} ${Y(400)} ${X(x + d * 210)} ${Y(840)} L${X(x)} ${Y(840)} Z`, fill: '#581c87' }, G));
    cone(G, X(820), Y(-60), 640, 920);
    charB(G, X(820), Y(830), .8, 'k8', { hair: 'long', hairC: '#c2410c', skin: SKIN[0], top: '#a855f7', topType: 'blazer' });
    ringH(G, X(820), Y(580), 290, '#fde68a', 'rg8');
    const sense = (cx, cy, id, f) => { const g = S('g', { id }, G); S('circle', { cx, cy, r: 82, fill: '#0f172a', stroke: BLU, 'stroke-width': 6 }, g); f(g); hidId(id); };
    sense(X(480), Y(300), 'sn80', g => eyeBig(g, X(480), Y(300), .55)); sense(X(820), Y(150), 'sn81', g => earG(g, X(820), Y(150), .9, '#fca5a5')); sense(X(1160), Y(300), 'sn82', g => handG(g, X(1160), Y(300), 1, '#fca5a5'));
    ghostG(G, X(1420), Y(560), 1, 'gh8'); hidId('gh8'); XM(G, X(1420), Y(560), 100, 'x8'); hidId('x8');
    check(G, X(560), Y(330), 46, 'ok8'); hidId('ok8');
    heads(G, X(-100), X(2020), Y(1010), 13); plant(G, X(1840), Y(830), 1.1);
    BT.push(() => {
      let t = go('and heres the key detail'); WHIP(t, X(960), Y(540), 1); blink('k8', [t + 1.2, t + 6, t + 10]); breathe('k8', t, 6);
      t = W('is an experience'); FADE('#gh8', t - .2, { d: .6 }); tl.to('#gh8', { y: -14, duration: .8, yoyo: true, repeat: 7, ease: 'sine.inOut' }, t + .4); mood('k8', t, 'surprised');
      t = W('something you see'); ['see', 'hear', 'or feel'].forEach((w, k) => { POP('#sn8' + k, W(w) - .05); BOING('#sn8' + k, W(w) + .4, '50% 50%'); });
      t = W('it happens to someone'); RING('rg8', t, 3); tl.to('#k8aR', { rotation: 30, transformOrigin: '50% 0%', duration: .3, yoyo: true, repeat: 1, repeatDelay: 0 }, t); CAM(t - .1, X(820), Y(520), 1.25, .9); OUT('#sn80,#sn81,#sn82', t + 1.4);
      t = W('step back'); CAM(t - .3, X(1000), Y(540), 1.0, 1.0); WALK8(t);
      t = W('that wasnt real'); POP('#x8', t, { s: 2 }); tl.to('#gh8', { autoAlpha: 0, duration: .8 }, t + .5); POP('#ok8', t + .6); nod('k8', t + .4); mood('k8', t + .3, 'happy');
    });
    function WALK8(t) { tl.to('#k8B', { x: -170, duration: 1.0, ease: 'power2.inOut' }, t); tl.to('#k8B', { y: -10, duration: .25, yoyo: true, repeat: 3 }, t); mood('k8', t, 'neutral'); B(t); }
  }
  // =============== AREA 9: the machine has no senses ===============
  { const [ox, oy] = AO(9); const X = v => ox + v, Y = v => oy + v;
    scene(BG, defs, ox, oy);
    server(G, X(60), Y(300), .5); server(G, X(1760), Y(560), .4); lamp(G, X(960), Y(80));
    botB(G, X(960), Y(830), .8, 'b9');
    const se = (cx, cy, id, f) => { const g = S('g', { id }, G); S('circle', { cx, cy, r: 90, fill: '#0f172a', stroke: '#475569', 'stroke-width': 6 }, g); f(g); XM(g, cx, cy, 62, id + 'x'); hidId(id); hidId(id + 'x'); };
    se(X(470), Y(260), 'ns90', g => eyeBig(g, X(470), Y(260), .6)); se(X(470), Y(520), 'ns91', g => earG(g, X(470), Y(520), 1, '#fca5a5'));
    const w = S('g', { id: 'ww9' }, G); windowPane(w, X(1360), Y(110), 400, 300, 'url(#gSkyDay)'); treeG(w, X(1650), Y(260), .8); sunG(w, X(1450), Y(170), 26); hidId('ww9');
    S('path', { id: 'cb9', class: 'draw', d: `M${X(1560)} ${Y(415)} Q${X(1560)} ${Y(560)} ${X(1380)} ${Y(600)}`, stroke: BLU, 'stroke-width': 12, fill: 'none', 'stroke-linecap': 'round' }, G); hidId('cb9');
    const pl = S('g', { id: 'pl9' }, G); ic(pl, 'plug', X(1360), Y(640), 80, BLU); hidId('pl9'); S('path', { id: 'sk9', d: `M${X(1060)} ${Y(560)} L${X(1150)} ${Y(560)}`, stroke: '#64748b', 'stroke-width': 10, 'stroke-dasharray': '14 10' }, G); hidId('sk9');
    XM(G, X(1250), Y(600), 50, 'xc9'); hidId('xc9'); dots(G, X(1560), Y(420), 3, '#93c5fd', 'dd9', 11); hidId('dd9');
    const tks = [['The', '#fca5a5'], ['sky', '#fdba74'], ['is', '#86efac'], ['blue', '#93c5fd']]; let tx = X(240);
    tks.forEach(([wd, c], k) => { const ww = wd.length * 21 + 44; token(G, tx + ww / 2, Y(760), wd, c, 'tk9' + k); tx += ww + 16; hidId('tk9' + k); });
    fgBox(G, X(-60), Y(1000), 340, 200); fgLeaves(G, X(1980), Y(1080), 1.1, -1);
    BT.push(() => {
      let t = go('now lets look at the machine'); ZOOMIN(t, AO(8)[0] + 820, AO(8)[1] + 420, X(960), Y(400), 1.5); CAM(t + .1, X(960), Y(520), 1, 1.4, 'power2.out'); blink('b9', [t + 1, t + 5, t + 9]); breathe('b9', t, 5);
      t = W('doesnt see anything'); POP('#ns90', t - .3); POP('#ns90x', t + .3, { s: 2 }); shake('b9', t + .3);
      t = W('it doesnt hear'); POP('#ns91', t - .2); POP('#ns91x', t + .3, { s: 2 }); shake('b9', t + .3);
      t = W('no senses at all'); PULSE('#ns90,#ns91', t, { s: 1.08 }); mood('b9', t, 'neutral');
      t = W('stream of signals'); FADE('#ww9', t - .3); DR('#cb9', t, { d: .7 }); POP('#pl9', t + .6); tl.set('#sk9', { autoAlpha: 1 }, t + .6); RUN('dd9', 0, 140, t + .5, .6, 2); CAM(t, X(1200), Y(450), 1.1, 1.2);
      t = W('to check itself'); POP('#xc9', t, { s: 2 }); dim(t, 1);
      t = W('what it does is predict'); CAM(t - .2, X(800), Y(560), 1.05, 1.0); talk('b9', t, t + 1.6); tks.forEach((_, k) => { tl.fromTo('#tk9' + k, { autoAlpha: 0, x: 500 - k * 60, y: -200, scale: .4, transformOrigin: '50% 50%' }, { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: .55, ease: 'back.out(1.4)' }, W('text') - .3 + k * .22); }); B(W('text'));
    });
  }
  // =============== AREA 10: training — predict the next word ===============
  { const [ox, oy] = AO(10); const X = v => ox + v, Y = v => oy + v;
    scene(BG, defs, ox, oy);
    shelf(G, X(30), Y(160), 300, 660, 'shA10'); shelf(G, X(1610), Y(160), 290, 660, 'shB10');
    botB(G, X(960), Y(830), .62, 'b10');
    const bd = S('g', { id: 'bd10' }, G); S('rect', { x: X(420), y: Y(60), width: 1080, height: 350, rx: 20, fill: '#f8fafc', stroke: '#475569', 'stroke-width': 6, filter: 'url(#fSh)' }, bd); hidId('bd10');
    const words = [['The', '#fca5a5'], ['cat', '#fdba74'], ['sat', '#86efac'], ['on', '#93c5fd'], ['the', '#d8b4fe'], ['mat', '#fde047'], ['and', '#5eead4'], ['purred', '#f9a8d4']]; let tx = X(452);
    words.forEach(([w, c], k) => { const ww = w.length * 21 + 44; token(bd, tx + ww / 2, Y(130), w, c, 'tw10' + k); if (k >= 5) hidId('tw10' + k); else hidId('tw10' + k); if (k === 5) { S('rect', { id: 'slot10', x: tx, y: Y(94), width: ww, height: 72, rx: 16, fill: 'none', stroke: AMB, 'stroke-width': 5, 'stroke-dasharray': '12 8' }, bd); hidId('slot10'); } tx += ww + 14; });
    const pp = S('g', { id: 'pp10' }, bd); [['mat', .72, GRN], ['floor', .18, BLU], ['moon', .03, '#a855f7']].forEach(([w, v, c], k) => { const y = Y(215 + k * 62); txt(pp, X(640), y + 36, w, 34, C.ink, 'end', 700); S('rect', { x: X(670), y: y + 8, width: 560, height: 38, rx: 12, fill: '#e2e8f0' }, pp); S('rect', { id: 'pb10' + k, x: X(670), y: y + 8, width: 560 * v, height: 38, rx: 12, fill: c }, pp); txt(pp, X(670) + 560 * v + 14, y + 38, Math.round(v * 100) + '%', 30, C.ink, 'start', 700); }); hidId('pp10');
    ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#f97316'].forEach((c, k) => { book(G, k < 3 ? X(250) : X(1690), Y(300 + (k % 3) * 160), c, 'bk10' + k); hidId('bk10' + k); });
    ringH(G, X(960), Y(560), 150, CYA, 'rg10');
    // what it learns to produce
    const fc = card(G, X(400), Y(470), 360, 190, 'fc10', '#f8fafc'); ['The results show a', 'clear and lasting', 'effect on memory.'].forEach((l, k) => { tln(fc, X(425), Y(530 + k * 48), l, 30, C.ink, 'fl10', 'start', false, 600); }); hidId('fc10');
    const mg = S('g', { id: 'mg10' }, G); S('path', { d: `M${X(860)} ${Y(560)} L${X(790)} ${Y(520)} L${X(790)} ${Y(640)} L${X(860)} ${Y(600)} Z`, fill: '#fde047', stroke: C.ink, 'stroke-width': 5 }, mg); [0, 1].forEach(k => S('path', { d: `M${X(770 - k * 24)} ${Y(540 - k * 10)} Q${X(750 - k * 24)} ${Y(580)} ${X(770 - k * 24)} ${Y(620 + k * 10)}`, stroke: '#fde047', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, mg)); hidId('mg10');
    [['Citation', ['Hart, J.', '(2019) p.4'], BLU], ['Legal', ['Section 4', 'therefore'], '#a855f7'], ['Biography', ['Born 1952', 'in Ohio'], AMB]].forEach(([h, l, c], k) => { docSheet(G, X(1100 + k * 165), Y(440), 150, 'dc10' + k, l, c); txt(G, X(1175 + k * 165), Y(470), h, 18, '#fff', 'middle', 800, 'dh10' + k); hidId('dc10' + k); hidId('dh10' + k); });
    gauge(G, X(1290), Y(800), 70, GRN, 'gg10'); hidId('gg10');
    pill(G, X(650), Y(230), 'SOUNDS RIGHT', AMB, C.ink, 'sr10', 40); pill(G, X(1270), Y(230), 'IS RIGHT', GRN, C.ink, 'ir10', 40); hidId('sr10'); hidId('ir10');
    const ne = S('g', { id: 'ne10' }, G); S('circle', { cx: X(960), cy: Y(230), r: 52, fill: '#fff', stroke: C.ink, 'stroke-width': 6 }, ne); S('path', { d: `M${X(932)} ${Y(216)} L${X(988)} ${Y(216)} M${X(932)} ${Y(246)} L${X(988)} ${Y(246)} M${X(978)} ${Y(192)} L${X(942)} ${Y(268)}`, stroke: RED, 'stroke-width': 9, 'stroke-linecap': 'round' }, ne); hidId('ne10');
    fgHeads(G, X(-60), Y(1010), 1); fgBox(G, X(1650), Y(1000), 360, 200);
    BT.push(() => {
      let t = go('during training'); WHIP(t, X(960), Y(540), 1); blink('b10', [t + 3, t + 9, t + 15, t + 21]); breathe('b10', t, 10);
      t = W('enormous amount'); [0, 1, 2, 3, 4, 5].forEach(k => { const sx = k < 3 ? 250 : 1690, sy = 300 + (k % 3) * 160; tl.set('#bk10' + k, { autoAlpha: 1 }, t + k * .2); tl.fromTo('#bk10' + k, { x: 0, y: 0, rotation: 0, scale: 1, transformOrigin: '50% 50%' }, { x: 960 - sx, y: 520 - sy, rotation: 360, scale: .3, duration: .8, ease: 'power2.in' }, t + k * .2); tl.set('#bk10' + k, { autoAlpha: 0 }, t + k * .2 + .8); }); RING('rg10', t + .8, 3); B(t);
      t = W('learns one skill'); POP('#bd10', t - .2); CAM(t, X(960), Y(380), 1.1, 1.0);
      t = W('given some words'); [0, 1, 2, 3, 4].forEach(k => POP('#tw10' + k, t + k * .15)); POP('#slot10', t + .9);
      t = W('most likely to come next'); POP('#pp10', t - .4); [0, 1, 2].forEach(k => BAR('#pb10' + k, t - .1 + k * .15, 1, .6)); talk('b10', t - .8, t + 1);
      t = W('come next'); OUT('#slot10', t + .7); POP('#tw105', t + .7); BOING('#tw105', t + 1.2, '50% 50%'); PULSE('#pb100', t + .7);
      t = W('then the next'); POP('#tw106', t + .1); BOING('#tw106', t + .55, '50% 50%'); t = findp('then the next', t + .3) ?? t + 1; POP('#tw107', t + .1); BOING('#tw107', t + .55, '50% 50%');
      t = W('over time'); OUT('#pp10', t - .2); CAM(t, X(960), Y(560), 1, 1.2); POP('#gg10', t); tl.fromTo('#gg10N', { rotation: -80, transformOrigin: '50% 100%' }, { rotation: 70, duration: 2, ease: 'power2.out' }, t + .4); mood('b10', t + 1.5, 'happy');
      t = W('fluent sentences'); POP('#fc10', t - .2); tl.fromTo('.fl10', { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: .3, stagger: .25 }, t);
      t = W('confident tone'); POP('#mg10', t - .2); tl.to('#mg10', { x: -6, duration: .08, yoyo: true, repeat: 7 }, t + .3); jump('b10', t);
      t = W('research citation'); POP('#dc100,#dh100', t - .1); POP('#dc101,#dh101', W('legal argument') - .1); POP('#dc102,#dh102', W('biography') - .1);
      t = W('but sounding right'); OUT('#bd10,#tw100,#tw101,#tw102,#tw103,#tw104,#tw105,#tw106,#tw107', t - .3); POP('#sr10', t); POP('#ir10', W('being right')); POP('#ne10', W('not the same'), { s: .3 }); CAM(t, X(960), Y(420), 1.05, 1.0);
    });
  }
  // =============== AREA 11: known facts vs the made-up paper ===============
  { const [ox, oy] = AO(11); const X = v => ox + v, Y = v => oy + v;
    scene(BG, defs, ox, oy);
    clock(G, X(140), Y(130), 46); plant(G, X(90), Y(820), 1);
    botB(G, X(520), Y(830), .7, 'b11');
    S('ellipse', { id: 'hl11', cx: X(520), cy: Y(375), rx: 80, ry: 16, fill: 'none', stroke: '#fde047', 'stroke-width': 9 }, G); hidId('hl11');
    const qa = card(G, X(860), Y(80), 600, 110, 'qa11', '#1e293b'); txt(qa, X(1160), Y(150), 'Capital of France?', 44, '#f8fafc'); hidId('qa11');
    const aa = card(G, X(860), Y(240), 300, 100, 'aa11', '#f8fafc'); txt(aa, X(1010), Y(305), 'Paris', 46, C.ink); hidId('aa11');
    const tb = S('g', { id: 'tb11' }, G); S('circle', { cx: X(1680), cy: Y(290), r: 100, fill: '#052e16', stroke: GRN, 'stroke-width': 6 }, tb); ic(tb, 'book', X(1680), Y(290), 120, GRN);
    S('path', { id: 'tl11', class: 'draw', d: `M${X(1170)} ${Y(290)} L${X(1570)} ${Y(290)}`, stroke: GRN, 'stroke-width': 8, 'stroke-dasharray': '18 12' }, G); hidId('tl11'); check(G, X(1370), Y(240), 34, 'ck11'); hidId('ck11');
    const qb = card(G, X(860), Y(80), 600, 110, 'qb11', '#1e293b'); txt(qb, X(1160), Y(150), 'Papers on moon coffee?', 40, '#f8fafc'); hidId('qb11');
    [['rare', 960], ['obscure', 1160], ['made up', 1370]].forEach(([w, x], k) => { pill(G, X(x), Y(230), w, '#fde68a', C.ink, 'tg11' + k, 28); hidId('tg11' + k); });
    fakePaper(G, X(860), Y(300), 640, 'fp11', 'Moon Coffee and Memory', 'Dr. Elena Vasquez', 'J. Sleep Sci. · 2018'); ['fp11', 'fp11t', 'fp11a', 'fp11m'].forEach(hidId);
    [[110, 390, 560, 60], [110, 470, 420, 50], [110, 545, 380, 46]].forEach(([x, y, w, h], k) => { S('rect', { id: 'tp11' + k, x: X(860 + x - 20), y: Y(y - 2), width: w, height: h, rx: 10, fill: 'none', stroke: AMB, 'stroke-width': 5, 'stroke-dasharray': '14 9' }, G); hidId('tp11' + k); });
    S('path', { id: 'tl11b', class: 'draw', d: `M${X(1510)} ${Y(340)} L${X(1600)} ${Y(320)}`, stroke: '#64748b', 'stroke-width': 8, 'stroke-dasharray': '14 10' }, G); hidId('tl11b');
    thought(G, X(130), Y(200), 200, 140, 'th11', X(420), Y(360)); check(G, X(230), Y(270), 44, 'thc11'); hidId('th11'); hidId('thc11');
    const fcb = S('g', { id: 'fcb11' }, G); S('rect', { x: X(1560), y: Y(470), width: 320, height: 300, rx: 24, fill: 'rgba(255,255,255,.04)', stroke: '#64748b', 'stroke-width': 6, 'stroke-dasharray': '22 14' }, fcb); txt(fcb, X(1720), Y(530), 'FACT CHECK', 32, '#94a3b8'); ic(fcb, 'magnify', X(1720), Y(650), 130, '#475569'); hidId('fcb11'); XM(G, X(1720), Y(640), 90, 'xf11'); hidId('xf11');
    fgBox(G, X(-80), Y(1000), 360, 200); fgHeads(G, X(1700), Y(1010), 1);
    BT.push(() => {
      let t = go('when you ask a model'); WHIP(t, X(960), Y(540), 1); blink('b11', [t + 2, t + 8, t + 14, t + 21, t + 28]); breathe('b11', t, 16);
      t = W('it knows well'); POP('#qa11', t - .4); talk('b11', W('the most likely'), W('the most likely') + 1); POP('#aa11', W('next words usually'));
      t = W('line up with the truth'); DR('#tl11', t - .2, { d: .6 }); POP('#ck11', t + .4); glow(t + .4);
      t = W('but when you ask about something rare'); OUT('#qa11,#aa11,#tl11,#ck11', t); POP('#qb11', t + .2); [0, 1, 2].forEach((k, i) => POP('#tg11' + k, W(['rare', 'obscure', 'completely made'][k]) - .05));
      t = W('the model often still'); OUT('#tg110,#tg111,#tg112', t - .2); POP('#fp11', W('plausiblesounding') - .3); talk('b11', t, t + 3.5); liar('b11', W('plausiblesounding'));
      t = W('a research paper title'); POP('#fp11t', t + .2); CAM(t - .2, X(1180), Y(450), 1.3, 1.0);
      t = W('an authors name'); POP('#fp11a', t + .1); t = W('a date that seems'); POP('#fp11m', t + .2);
      t = W('it isnt lying'); CAM(t - .2, X(560), Y(470), 1.2, 1.0); POP('#hl11', t); BOB('#hl11', t + .4, 3, -8, .4); mood('b11', t, 'happy');
      t = W('it doesnt know its wrong'); POP('#th11', t - .1); POP('#thc11', t + .3); nod('b11', t + .2);
      t = W('there isnt a separate part'); OUT('#th11,#thc11,#hl11', t - .2); CAM(t, X(1200), Y(480), 1.0, 1.2); FADE('#fcb11', t + .2); t = W('against reality'); DR('#tl11b', t - .6, { d: .4 }); POP('#xf11', t, { s: 2 }); dim(t, 1.1);
      t = W('simply generating'); CAM(t - .2, X(1180), Y(460), 1.3, 1.0); [0, 1, 2].forEach(k => POP('#tp11' + k, W('fits the pattern') - .3 + k * .15)); PULSE('#fp11', W('fits the pattern') + .5, { s: 1.03 });
    });
  }
  // =============== AREA 12: game show + exam — guessing pays ===============
  { const [ox, oy] = AO(12); const X = v => ox + v, Y = v => oy + v;
    scene(BG, defs, ox, oy, null, null, 830);
    cone(G, X(520), Y(-60), 520, 900);
    const sb = S('g', { id: 'sb12' }, G); S('rect', { x: X(120), y: Y(70), width: 780, height: 310, rx: 24, fill: '#0f172a', stroke: '#fbbf24', 'stroke-width': 10 }, sb); txt(sb, X(510), Y(130), 'SCORE', 40, '#fbbf24'); for (let k = 0; k < 11; k++) S('circle', { class: 'bulb', cx: X(150 + k * 72), cy: Y(70), r: 9, fill: k % 2 ? '#fde047' : '#fb923c' }, sb); hidId('sb12');
    const ra = S('g', { id: 'ra12' }, G); txt(ra, X(170), Y(225), 'Confident guess', 46, '#a3e635', 'start'); txt(ra, X(860), Y(225), '+1', 58, '#a3e635', 'end'); hidId('ra12');
    const rb = S('g', { id: 'rb12' }, G); txt(rb, X(170), Y(325), '"I don\'t know"', 46, '#94a3b8', 'start'); txt(rb, X(860), Y(325), '0', 58, '#94a3b8', 'end'); hidId('rb12');
    botB(G, X(520), Y(830), .6, 'b12');
    S('path', { d: `M${X(390)} ${Y(640)} L${X(650)} ${Y(640)} L${X(630)} ${Y(830)} L${X(410)} ${Y(830)} Z`, fill: '#7c3aed' }, G); S('rect', { x: X(370), y: Y(620), width: 300, height: 30, rx: 8, fill: '#a78bfa' }, G); txt(G, X(520), Y(760), 'AI', 60, '#fde68a');
    const bz = S('g', { id: 'bz12' }, G); S('ellipse', { cx: X(610), cy: Y(618), rx: 44, ry: 15, fill: '#7f1d1d' }, bz); S('ellipse', { cx: X(610), cy: Y(608), rx: 38, ry: 15, fill: RED }, bz);
    sparkH(G, X(610), Y(580), 1.2, '#fde047', 'sk12'); [0, 1, 2].forEach(k => { pill(G, X(700 + k * 70), Y(520), '+1', '#a3e635', C.ink, 'po12' + k, 40); hidId('po12' + k); });
    // exam
    const ex = S('g', { id: 'ex12' }, G); S('rect', { x: X(1080), y: Y(60), width: 740, height: 420, rx: 16, fill: '#f8fafc', stroke: '#94a3b8', 'stroke-width': 6, filter: 'url(#fSh)' }, ex); txt(ex, X(1450), Y(118), 'EXAM', 42, C.ink);
    const qs = ['Q1  Year of the treaty?', 'Q2  Capital of Peru?', 'Q3  Atomic number of tin?', 'Q4  Author of the poem?'];
    qs.forEach((q, k) => { const y = Y(185 + k * 78); txt(ex, X(1110), y, q, 30, '#334155', 'start', 700); S('path', { d: `M${X(1560)} ${y + 6} L${X(1720)} ${y + 6}`, stroke: '#94a3b8', 'stroke-width': 4 }, ex); });
    hidId('ex12');
    [['1648', 0], ['Lima', 1], ['42', 2], ['Keats', 3]].forEach(([a, k]) => { txt(G, X(1640), Y(180 + k * 78), a, 34, '#1d4ed8', 'middle', 800, 'an12' + k); hidId('an12' + k); });
    [['x', 0], ['c', 1], ['x', 2], ['c', 3]].forEach(([m, k]) => { if (m === 'x') XM(G, X(1775), Y(172 + k * 78), 20, 'mk12' + k); else check(G, X(1775), Y(172 + k * 78), 22, 'mk12' + k); hidId('mk12' + k); });
    charB(G, X(1450), Y(830), .7, 'st12', { kid: true, hair: 'short', hairC: '#c2410c', skin: SKIN[0], top: '#f97316', topType: 'tshirt' });
    S('rect', { x: X(1270), y: Y(660), width: 360, height: 26, rx: 8, fill: '#a16207' }, G); S('rect', { x: X(1290), y: Y(686), width: 320, height: 134, fill: '#854d0e' }, G);
    const pn = S('g', { id: 'pn12' }, G); ic(pn, 'pen', X(1560), Y(620), 70, AMB); hidId('pn12');
    heads(G, X(-100), X(1000), Y(1010), 7); fgBox(G, X(1680), Y(1000), 340, 200);
    BT.push(() => {
      let t = go('and theres another reason'); WHIP(t, X(520), Y(540), 1.1); blink('b12', [t + 1.5, t + 7, t + 12]); breathe('b12', t, 6);
      t = W('tested and rewarded'); POP('#sb12', t - .2); BOING('#sb12', t + .3); CAM(t, X(560), Y(440), 1.15, 1.0);
      t = W('a confident guess'); POP('#ra12', t); tl.to('#b12aR', { rotation: -60, transformOrigin: '50% 0%', duration: .2, yoyo: true, repeat: 1 }, t + .3); tl.to('#bz12', { y: 8, duration: .1, yoyo: true, repeat: 1 }, t + .4); SPK('sk12', t + .45); mood('b12', t + .3, 'happy');
      t = W('while saying'); POP('#rb12', W('earned nothing') - .2); shrug('b12', W('earned nothing') - .2);
      t = W('so models learned'); [0, 1, 2].forEach(k => { tl.fromTo('#po12' + k, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: -60 - k * 30, duration: .7, ease: 'power2.out' }, t + k * .3); tl.to('#po12' + k, { autoAlpha: 0, duration: .3 }, t + 1.6 + k * .3); }); liar('b12', t + .5); jump('b12', W('pays off')); B(t);
      t = W('imagine a student'); CAM(t - .2, X(1450), Y(470), 1.0, 1.3); POP('#ex12', t + .2); walkIn('st12', t - .2, 900, 1.3); blink('st12', [t + 2, t + 6, t + 10]);
      t = W('blank answers'); POP('#mk120', W('marked wrong'), { s: 2 }); mood('st12', W('marked wrong'), 'worried'); CAM(t, X(1450), Y(300), 1.4, 1.0);
      t = W('but guesses are sometimes'); [1, 2, 3].forEach((k, i) => { IN('#an12' + k, t + i * .35, { y: 0, x: -20 }); POP('#mk12' + k, t + .3 + i * .35); });
      t = W('that student will learn'); CAM(t - .2, X(1450), Y(470), 1.0, 1.0); POP('#pn12', t); tl.to('#pn12', { x: 30, y: -6, duration: .15, yoyo: true, repeat: 5 }, t + .3); IN('#an120', W('never leave'), { y: 0, x: -20 }); OUT('#mk120', W('never leave')); mood('st12', W('never leave'), 'happy'); nod('st12', W('anything blank'));
    });
  }
  // =============== AREA 13: the real difference ===============
  { const [ox, oy] = AO(13); const X = v => ox + v, Y = v => oy + v;
    scene(BG, defs, ox, oy);
    S('path', { d: `M${X(960)} ${Y(40)} L${X(960)} ${Y(820)}`, stroke: '#475569', 'stroke-width': 8, 'stroke-dasharray': '24 16' }, G);
    brainG(G, X(480), Y(280), .75, 'br13'); pill(G, X(480), Y(470), 'PERCEPTION', ROSE, C.ink, 'pe13', 34); hidId('pe13'); S('path', { id: 'pc13', class: 'draw', d: `M${X(340)} ${Y(500)} L${X(620)} ${Y(440)}`, stroke: RED, 'stroke-width': 10, 'stroke-linecap': 'round' }, G); hidId('pc13');
    S('path', { d: `M${X(430)} ${Y(818)} L${X(530)} ${Y(818)} L${X(480)} ${Y(712)} Z`, fill: '#64748b' }, G);
    const bm = S('g', { id: 'bm13' }, G); S('rect', { x: X(200), y: Y(690), width: 560, height: 22, rx: 10, fill: '#94a3b8' }, bm); S('rect', { x: X(210), y: Y(570), width: 150, height: 120, rx: 14, fill: AMB }, bm); txt(bm, X(285), Y(642), 'GUESS', 30, C.ink); S('rect', { x: X(640), y: Y(640), width: 110, height: 50, rx: 10, fill: BLU }, bm); txt(bm, X(695), Y(674), 'SIGNAL', 22, '#fff'); hidId('bm13');
    botB(G, X(1250), Y(830), .58, 'b13');
    const nw = S('g', { id: 'nw13' }, G); S('rect', { x: X(1500), y: Y(100), width: 320, height: 230, rx: 14, fill: '#020617', stroke: '#e2e8f0', 'stroke-width': 12 }, nw); QM(nw, X(1660), Y(215), 120, '#64748b'); hidId('nw13');
    const ac = card(G, X(1030), Y(100), 380, 220, 'ac13', '#f8fafc'); S('rect', { x: X(1030), y: Y(100), width: 380, height: 50, rx: 18, fill: VIO }, ac); txt(ac, X(1220), Y(136), 'ANSWER', 30, '#fff'); ['Studies clearly', 'show that coffee', 'adds 12 years.'].forEach((l, k) => tln(ac, X(1055), Y(195 + k * 40), l, 28, C.ink, null, 'start', false, 600)); hidId('ac13');
    const tb = S('g', { id: 'tb13' }, G); S('circle', { cx: X(1460), cy: Y(410), r: 42, fill: '#334155', stroke: '#94a3b8', 'stroke-width': 5 }, tb); S('rect', { x: X(1444), y: Y(450), width: 32, height: 26, rx: 6, fill: '#64748b' }, tb); txt(tb, X(1460), Y(510), 'TRUE?', 26, '#94a3b8'); hidId('tb13'); XM(G, X(1460), Y(410), 34, 'xt13'); hidId('xt13');
    const gf = S('g', { id: 'gf13' }, G); S('rect', { x: X(1530), y: Y(620), width: 260, height: 190, rx: 10, fill: '#db2777' }, gf); S('rect', { x: X(1645), y: Y(620), width: 30, height: 190, fill: '#fde047' }, gf);
    const gl = S('g', { id: 'gl13' }, gf); S('rect', { x: X(1515), y: Y(580), width: 290, height: 50, rx: 10, fill: '#ec4899' }, gl); S('rect', { x: X(1645), y: Y(580), width: 30, height: 50, fill: '#fde047' }, gl); S('path', { d: `M${X(1660)} ${Y(580)} Q${X(1600)} ${Y(520)} ${X(1620)} ${Y(575)} M${X(1660)} ${Y(580)} Q${X(1720)} ${Y(520)} ${X(1700)} ${Y(575)}`, stroke: '#fde047', 'stroke-width': 12, fill: 'none' }, gl); hidId('gf13');
    S('rect', { id: 'gin13', x: X(1545), y: Y(612), width: 230, height: 30, rx: 6, fill: '#1e1b4b' }, G); hidId('gin13'); QM(G, X(1660), Y(540), 110, '#fde047', 'gq13'); hidId('gq13');
    sparkH(G, X(1560), Y(600), .9, '#fde047', 'sk13a'); sparkH(G, X(1780), Y(640), .8, '#fde047', 'sk13b');
    plant(G, X(80), Y(820), 1); fgBox(G, X(-80), Y(1000), 340, 200); fgLeaves(G, X(1980), Y(1080), 1.1, -1);
    BT.push(() => {
      let t = go('so heres the real difference'); ZOOMIN(t, AO(12)[0] + 1450, AO(12)[1] + 260, X(960), Y(450), 1.2); CAM(t + .1, X(960), Y(540), 1, 1.3, 'power2.out'); eyes('#br13E', [t + 2, t + 8]); blink('b13', [t + 4, t + 12, t + 19]);
      t = W('a human hallucination is a failure'); CAM(t - .2, X(480), Y(500), 1.3, 1.0); POP('#pe13', W('perception') - .2); DR('#pc13', W('perception') + .3, { d: .3 });
      t = W('predictions about the world'); POP('#bm13', t - .3); tl.fromTo('#bm13', { rotation: 0, transformOrigin: '50% 100%' }, { rotation: -13, duration: .9, ease: 'back.out(1.6)', immediateRender: false }, W('overpower')); PULSE('#bm13', W('overpower') + 1, { s: 1.03 }); B(W('overpower'));
      t = W('an ai hallucination isnt'); CAM(t - .2, X(1420), Y(450), 1.1, 1.1); mood('b13', t, 'neutral');
      t = W('there is no world'); FADE('#nw13', t - .1); SHAKE('#nw13', t + .8);
      t = W('a failure of knowledge'); POP('#gf13', t - .1); BOING('#gf13', t + .4); t = W('perfect fluency'); SPK('sk13a', t); SPK('sk13b', t + .2);
      tl.to('#gl13', { y: -160, x: 60, rotation: 25, transformOrigin: '50% 50%', autoAlpha: 0, duration: .8, ease: 'power2.out' }, t + .9); tl.set('#gin13', { autoAlpha: 1 }, t + .9); POP('#gq13', t + 1.1); dim(t + 1, 1);
      t = W('the system generates'); CAM(t - .2, X(1300), Y(380), 1.15, 1.0); POP('#ac13', t); talk('b13', t, t + 2); t = W('without any builtin way'); POP('#tb13', t - .2); POP('#xt13', W('whether its true'), { s: 2 }); liar('b13', W('whether its true'));
    });
  }
  // =============== AREA 14: confabulation ===============
  { const [ox, oy] = AO(14); const X = v => ox + v, Y = v => oy + v;
    scene(BG, defs, ox, oy);
    frameP(G, X(80), Y(300), 150, 110, 'dp14', '#ca8a04'); frameP(G, X(80), Y(440), 150, 110, 'dq14', '#ca8a04'); clock(G, X(1820), Y(320), 44); plant(G, X(1860), Y(820), 1);
    const wa = card(G, X(620), Y(70), 680, 130, 'wa14', '#1e293b'); txt(wa, X(960), Y(160), 'HALLUCINATION', 66, '#fde68a'); hidId('wa14'); S('path', { id: 'sl14', class: 'draw', d: `M${X(640)} ${Y(140)} L${X(1280)} ${Y(130)}`, stroke: RED, 'stroke-width': 12, 'stroke-linecap': 'round' }, G); hidId('sl14');
    const wb = card(G, X(620), Y(70), 680, 130, 'wb14', '#14532d'); txt(wb, X(960), Y(160), 'CONFABULATION', 66, '#bbf7d0'); hidId('wb14');
    charB(G, X(520), Y(830), .78, 'dr14', { hair: 'short', hairC: '#5b3a29', skin: SKIN[0], top: '#f1f5f9', topType: 'blazer', glasses: true });
    S('rect', { x: X(270), y: Y(660), width: 420, height: 28, rx: 8, fill: '#78350f' }, G); S('rect', { x: X(290), y: Y(688), width: 380, height: 132, fill: '#5b2d0c' }, G); ic(G, 'file', X(620), Y(625), 60, '#e2e8f0');
    charB(G, X(1100), Y(830), .76, 'pt14', { hair: 'long', hairC: '#d1d5db', skin: SKIN[0], top: '#0d9488', topType: 'tshirt' });
    const bq = S('g', { id: 'bq14' }, G); brainG(bq, X(1460), Y(380), .6, 'pb14', false); S('rect', { id: 'pg14', x: X(1470), y: Y(320), width: 70, height: 70, rx: 8, fill: '#1e1b4b', stroke: '#e2e8f0', 'stroke-width': 4, 'stroke-dasharray': '10 6' }, bq); hidId('bq14');
    const pz = S('g', { id: 'pz14' }, G); S('rect', { x: X(1470), y: Y(320), width: 70, height: 70, rx: 8, fill: AMB }, pz); ico(pz, 'yacht', X(1505), Y(355), 54, '#1e3a8a'); hidId('pz14');
    bubble(G, X(240), Y(250), 500, 90, 'What did you do yesterday?', 'q14', 30, .2); hidId('q14');
    bubble(G, X(860), Y(250), 300, 90, "I don't know", 'nk14', 32, .15); hidId('nk14'); XM(G, X(1010), Y(295), 50, 'xk14'); hidId('xk14');
    bubble(G, X(840), Y(250), 330, 90, 'I went sailing!', 'sv14', 34, .15); hidId('sv14');
    ico(G, 'heart', X(1240), Y(470), 70, '#f472b6', 'ht14'); hidId('ht14');
    const mk = S('g', { id: 'mk14' }, G); S('path', { d: `M${X(760)} ${Y(500)} Q${X(820)} ${Y(470)} ${X(880)} ${Y(500)} Q${X(880)} ${Y(560)} ${X(820)} ${Y(570)} Q${X(760)} ${Y(560)} ${X(760)} ${Y(500)} Z`, fill: '#e2e8f0' }, mk); [790, 850].forEach(x => S('ellipse', { cx: X(x), cy: Y(515), rx: 14, ry: 9, fill: '#0f172a' }, mk)); XM(mk, X(820), Y(520), 48); hidId('mk14');
    botB(G, X(1720), Y(830), .55, 'b14'); hidId('b14B'); const pp = S('g', { id: 'pp14' }, G); ic(pp, 'paper', X(1630), Y(650), 80, '#f8fafc'); hidId('pp14');
    const ap = S('g', { id: 'ap14' }, G); S('path', { d: `M${X(1520)} ${Y(560)} Q${X(1545)} ${Y(540)} ${X(1570)} ${Y(560)} Q${X(1595)} ${Y(580)} ${X(1620)} ${Y(560)} M${X(1520)} ${Y(590)} Q${X(1545)} ${Y(570)} ${X(1570)} ${Y(590)} Q${X(1595)} ${Y(610)} ${X(1620)} ${Y(590)}`, stroke: '#fde047', 'stroke-width': 9, fill: 'none', 'stroke-linecap': 'round' }, ap); hidId('ap14');
    fgBox(G, X(-80), Y(1000), 340, 200); fgHeads(G, X(1760), Y(1010), 1);
    BT.push(() => {
      let t = go('in fact some researchers'); WHIP(t, X(960), Y(540), 1); blink('dr14', [t + 2, t + 9, t + 15, t + 22]); blink('pt14', [t + 3, t + 10, t + 17, t + 24]); breathe('pt14', t, 10);
      t = W('hallucination is the wrong word'); POP('#wa14', t - .3); DR('#sl14', W('wrong word') + .1, { d: .4 });
      t = W('something called confabulation'); OUT('#wa14,#sl14', W('confabulation') - .3); POP('#wb14', W('confabulation')); BOING('#wb14', W('confabulation') + .5, '50% 50%'); glow(W('confabulation'));
      t = W('memory damage'); OUT('#wb14', t - .8); POP('#bq14', t - .2); CAM(t, X(1300), Y(480), 1.15, 1.0); mood('pt14', t, 'neutral');
      t = W('when asked about something'); CAM(t - .2, X(820), Y(470), 1.05, 1.0); POP('#q14', t); talk('dr14', t, W('they dont say'));
      t = W('they dont say'); OUT('#q14', t - .2); POP('#nk14', t + .2); POP('#xk14', W('i dont know') + .4, { s: 2 });
      t = W('they fill the gap'); OUT('#nk14,#xk14', t - .2); POP('#sv14', t); talk('pt14', t, t + 1.5); mood('pt14', t, 'happy'); tl.fromTo('#pz14', { autoAlpha: 0, x: -360, y: 60, rotation: -60, transformOrigin: '50% 50%' }, { autoAlpha: 1, x: 0, y: 0, rotation: 0, duration: .9, ease: 'back.out(1.3)' }, W('believable story') - .3); B(W('believable story'));
      t = W('genuinely believe it'); POP('#ht14', t); PULSE('#ht14', t + .5, { s: 1.2, r: 3 }); nod('pt14', t + .2);
      t = W('no intention to deceive'); POP('#mk14', t);
      t = W('that sounds a lot more'); OUT('#mk14,#ht14,#sv14', t - .2); CAM(t, X(1350), Y(500), 1.05, 1.0); WALKER('b14', t, 800, 1.2); POP('#pp14', t + 1.2); liar('b14', W('inventing') ); POP('#ap14', W('inventing') + .3);
    });
  }
  // =============== AREA 15: still a someone vs nobody inside ===============
  { const [ox, oy] = AO(15); const X = v => ox + v, Y = v => oy + v;
    scene(BG, defs, ox, oy);
    lamp(G, X(560), Y(90)); clock(G, X(1830), Y(120), 42); plant(G, X(80), Y(820), 1);
    charB(G, X(560), Y(830), .8, 'ps15', { hair: 'short', hairC: '#5b3a29', skin: SKIN[0], top: '#16a34a', topType: 'hoodie' });
    ringH(G, X(560), Y(580), 280, GRN, 'rg15');
    const slot = (cx, cy, id, f, col) => { const g = S('g', { id }, G); S('circle', { cx, cy, r: 78, fill: '#0f172a', stroke: col, 'stroke-width': 6 }, g); if (f) f(g); hidId(id); };
    slot(X(280), Y(300), 'ex150', g => ic(g, 'star', X(280), Y(300), 100, '#fde047'), '#fde047'); slot(X(560), Y(160), 'ex151', g => ico(g, 'heart', X(560), Y(160), 100, '#f472b6'), '#f472b6'); slot(X(840), Y(300), 'ex152', g => ic(g, 'user', X(840), Y(300), 100, '#60a5fa'), '#60a5fa');
    botB(G, X(1380), Y(830), .72, 'b15');
    [[1120, 300], [1380, 160], [1640, 300]].forEach(([x, y], k) => { const g = S('g', { id: 'em15' + k }, G); S('circle', { cx: X(x), cy: Y(y), r: 78, fill: 'none', stroke: '#64748b', 'stroke-width': 6, 'stroke-dasharray': '16 12' }, g); hidId('em15' + k); });
    // x-ray: empty seat inside the robot's head
    const hx = S('g', { id: 'hx15' }, G); S('rect', { x: X(1310), y: Y(452), width: 140, height: 98, rx: 20, fill: '#0b1226', stroke: CYA, 'stroke-width': 4 }, hx); S('rect', { x: X(1355), y: Y(495), width: 50, height: 12, rx: 4, fill: '#64748b' }, hx); S('rect', { x: X(1395), y: Y(465), width: 10, height: 42, rx: 4, fill: '#64748b' }, hx); S('rect', { x: X(1360), y: Y(507), width: 8, height: 30, fill: '#64748b' }, hx); S('rect', { x: X(1393), y: Y(507), width: 8, height: 30, fill: '#64748b' }, hx); hidId('hx15');
    const mg = S('g', { id: 'mg15' }, G); ic(mg, 'magnify', X(1250), Y(470), 120, '#e2e8f0'); hidId('mg15');
    fakePaper(G, X(1500), Y(560), 300, 'fp15', 'Moon Coffee', 'Dr. E. Vasquez', '2018'); hidId('fp15');
    fgBox(G, X(1650), Y(1000), 360, 200); fgLeaves(G, X(-60), Y(1080), 1.1, 1);
    BT.push(() => {
      let t = go('but even here'); WHIP(t, X(960), Y(540), 1); blink('ps15', [t + 1, t + 6, t + 11]); blink('b15', [t + 2, t + 8]); breathe('ps15', t, 6);
      t = W('still a someone'); RING('rg15', t, 3); mood('ps15', t, 'happy'); CAM(t - .2, X(560), Y(480), 1.15, 1.0);
      ['experiences', 'beliefs', 'sense of self'].forEach((w, k) => { POP('#ex15' + k, W(w) - .05); BOING('#ex15' + k, W(w) + .4, '50% 50%'); });
      t = W('the ai has none'); CAM(t - .2, X(1380), Y(480), 1.15, 1.0); [0, 1, 2].forEach(k => POP('#em15' + k, t + k * .15)); mood('b15', t, 'neutral');
      t = W('when it invents a fact'); POP('#fp15', t); liar('b15', t + .2); OUT('#em150,#em151,#em152', t);
      t = W('nobody inside is fooled'); CAM(t - .3, X(1380), Y(500), 1.7, 1.0); FADE('#hx15', t - .2, { d: .4 }); POP('#mg15', t); tl.to('#mg15', { x: 160, duration: 1.4, yoyo: true, repeat: 1, ease: 'sine.inOut' }, t + .4); B(t);
      t = W('nobody inside to be'); PULSE('#hx15', t, { s: 1.06 }); eyes('#b15E', [t + .5]);
    });
  }
  // =============== AREA 16: both prediction machines; anchors ===============
  { const [ox, oy] = AO(16); const X = v => ox + v, Y = v => oy + v;
    scene(BG, defs, ox, oy);
    brainG(G, X(460), Y(290), .8, 'br16'); botB(G, X(1340), Y(830), .6, 'b16');
    gearG(G, X(680), Y(170), .9, '#94a3b8', 'ga16'); gearG(G, X(1570), Y(380), .9, '#94a3b8', 'gb16'); hidId('ga16'); hidId('gb16');
    [[620, 360, 'pza16'], [1510, 470, 'pzb16']].forEach(([x, y, id]) => { const g = S('g', { id }, G); ic(g, 'puzzle', X(x), Y(y), 90, AMB); hidId(id); });
    ic(G, 'warn', X(300), Y(140), 90, RED, 'wa16'); ic(G, 'warn', X(1200), Y(380), 90, RED, 'wb16'); hidId('wa16'); hidId('wb16');
    S('path', { id: 'rp16', class: 'draw', d: `M${X(460)} ${Y(430)} Q${X(430)} ${Y(560)} ${X(460)} ${Y(680)}`, stroke: '#e2e8f0', 'stroke-width': 8, fill: 'none' }, G); hidId('rp16');
    const an = S('g', { id: 'an16' }, G); anchorG(an, X(460), Y(760), .9, BLU); eyeBig(an, X(345), Y(760), .3); earG(an, X(575), Y(760), .55, '#fca5a5'); hidId('an16');
    // AI anchors
    const posts = [[1000, 'globe', BLU, 'search'], [1140, 'db', '#22d3ee', 'db'], [1540, null, '#a3e635', 'idk'], [1690, 'book', GRN, 'cite']];
    posts.forEach(([x, n, c, k], i) => { const g = S('g', { id: 'ps16' + i }, G); S('rect', { x: X(x - 6), y: Y(690), width: 12, height: 130, fill: '#64748b' }, g); S('circle', { cx: X(x), cy: Y(630), r: 62, fill: '#0f172a', stroke: c, 'stroke-width': 6 }, g); if (n) ic(g, n, X(x), Y(630), 80, c); else { S('rect', { x: X(x - 52), y: Y(608), width: 104, height: 46, rx: 14, fill: '#f8fafc' }, g); txt(g, X(x), Y(638), "I don't know", 16, C.ink, 'middle', 800); } hidId('ps16' + i);
      const sx = X(1340), sy = Y(690); S('path', { id: 'rr16' + i, class: 'draw', d: `M${sx} ${sy} Q${(sx + X(x)) / 2} ${Y(560)} ${X(x)} ${Y(570)}`, stroke: '#e2e8f0', 'stroke-width': 6, fill: 'none' }, G); hidId('rr16' + i); });
    pill(G, X(1540), Y(510), '+1', '#a3e635', C.ink, 'pr16', 34); hidId('pr16');
    S('path', { id: 'fr16', d: `M${X(1340)} ${Y(690)} Q${X(1515)} ${Y(560)} ${X(1690)} ${Y(570)}`, stroke: RED, 'stroke-width': 6, fill: 'none', 'stroke-dasharray': '10 16' }, G); hidId('fr16');
    charB(G, X(1840), Y(830), .6, 'en16', { hair: 'short', hairC: '#eab308', skin: SKIN[0], top: '#f59e0b', topType: 'tshirt' }); hidId('en16B');
    ringH(G, X(460), Y(290), 170, ROSE, 'rg16a'); ringH(G, X(1340), Y(560), 190, CYA, 'rg16b'); sparkH(G, X(1340), Y(420), 1.2, '#fde047', 'sk16');
    fgBox(G, X(-80), Y(1000), 340, 200); fgHeads(G, X(1720), Y(1010), 1);
    BT.push(() => {
      let t = go('still the two do share'); WHIP(t, X(960), Y(540), 1); eyes('#br16E', [t + 2, t + 10, t + 20, t + 30]); blink('b16', [t + 3, t + 12, t + 22, t + 33]); breathe('b16', t, 18);
      t = W('prediction machines'); POP('#ga16', t - .3); POP('#gb16', t - .1); SPIN('#ga16', t, 12); SPIN('#gb16', t, 12, -1); RING('rg16a', t, 1); RING('rg16b', t + .2, 1);
      t = W('fill in gaps'); [['pza16', -160, 80], ['pzb16', 160, 80]].forEach(([id, dx, dy], k) => tl.fromTo('#' + id, { autoAlpha: 0, x: dx, y: dy, rotation: -90, transformOrigin: '50% 50%' }, { autoAlpha: 1, x: 0, y: 0, rotation: 0, duration: .7, ease: 'back.out(1.4)' }, t + k * .2)); B(t);
      t = W('and both go wrong'); OUT('#pza16,#pzb16', t - .2); POP('#wa16', W('anchored to reality') - .5); POP('#wb16', W('anchored to reality') - .3); SHAKE('#br16', W('anchored to reality')); shake('b16', W('anchored to reality')); dim(W('anchored to reality'), 1); mood('b16', W('anchored to reality'), 'worried');
      t = W('for the brain the anchor'); OUT('#wa16,#wb16', t - .3); CAM(t - .2, X(460), Y(500), 1.15, 1.0); DR('#rp16', t, { d: .5 }); POP('#an16', W('the senses') - .2); BOING('#an16', W('the senses') + .3); glow(W('the senses'));
      t = W('for ai engineers'); CAM(t - .2, X(1340), Y(560), 1.0, 1.1); WALKER('en16', t, 600, 1.3); mood('b16', t, 'neutral');
      [['search engines', 0], ['and databases', 1], ['admit uncertainty', 2], ['cite their sources', 3]].forEach(([w, i]) => { const tt = W(w); POP('#ps16' + i, tt - .1); BOING('#ps16' + i, tt + .35); DR('#rr16' + i, tt + .1, { d: .5 }); });
      t = W('so they can check facts'); PULSE('#ps160,#ps161', t, { s: 1.08 }); t = W('rewarding i dont know'); POP('#pr16', t); tl.to('#pr16', { y: -40, autoAlpha: 0, duration: .8 }, t + 1.2);
      t = W('so people can verify'); CAM(t - .3, X(1340), Y(540), 1.05, 1.0); RING('rg16b', t, 1);
      t = W('these fixes help'); glow(t); mood('b16', t, 'happy'); SPK('sk16', t);
      t = W('but they dont completely'); OUT('#rr163', t); tl.set('#fr16', { autoAlpha: 1 }, t); tl.to('#b16B', { rotation: 4, transformOrigin: '50% 100%', duration: .25, yoyo: true, repeat: 5 }, t + .2); mood('b16', t + .2, 'worried'); t = W('at least not yet'); PULSE('#ps163', t, { s: 1.1 });
    });
  }
  // =============== AREA 17: ending ===============
  { const [ox, oy] = AO(17); const X = v => ox + v, Y = v => oy + v;
    scene(BG, defs, ox, oy);
    lamp(G, X(960), Y(80)); plant(G, X(1870), Y(820), 1); clock(G, X(110), Y(110), 40);
    brainG(G, X(430), Y(360), .85, 'br17'); ringH(G, X(430), Y(360), 170, ROSE, 'rg17');
    eyeBig(G, X(430), Y(720), .5, 'ey17'); hidId('ey17');
    CRV(G, `M${X(300)} ${Y(470)} Q${X(220)} ${Y(600)} ${X(340)} ${Y(710)}`, BLU, 'lp17a', 9); CRV(G, `M${X(520)} ${Y(710)} Q${X(640)} ${Y(600)} ${X(560)} ${Y(470)}`, AMB, 'lp17b', 9); hidId('lp17a'); hidId('lp17b');
    check(G, X(640), Y(560), 40, 'ck17'); hidId('ck17');
    botB(G, X(1400), Y(830), .66, 'b17');
    fakePaper(G, X(1500), Y(520), 330, 'fp17', 'Moon Coffee and Memory', 'Dr. Elena Vasquez', '2018'); hidId('fp17');
    ghostG(G, X(930), Y(400), .9, 'gh17'); hidId('gh17'); XM(G, X(930), Y(400), 110, 'xg17'); hidId('xg17');
    const tc = thought(G, X(780), Y(290), 300, 200, 'tc17', X(1300), Y(420)); sunG(tc, X(880), Y(380), 24); treeG(tc, X(990), Y(370), .5); hidId('tc17'); XM(G, X(930), Y(390), 110, 'xt17'); hidId('xt17');
    const tw = [['The', '#fca5a5'], ['most', '#fdba74'], ['likely', '#86efac'], ['next', '#93c5fd'], ['words', '#d8b4fe']]; let tx = X(720);
    tw.forEach(([w, c], k) => { const ww = w.length * 21 + 44; token(G, tx + ww / 2, Y(120), w, c, 'tk17' + k); tx += ww + 16; hidId('tk17' + k); });
    const cp = S('g', { id: 'cap17' }, G); ico(cp, 'cap', X(1400), Y(380), 170, '#1e293b'); S('path', { d: `M${X(1468)} ${Y(368)} L${X(1480)} ${Y(430)}`, stroke: '#fde047', 'stroke-width': 6 }, cp); S('circle', { cx: X(1480), cy: Y(435), r: 9, fill: '#fde047' }, cp); hidId('cap17');
    const lb = S('g', { id: 'lb17' }, G); book(lb, X(1240), Y(690), '#22c55e'); hidId('lb17');
    fgBox(G, X(-80), Y(1000), 340, 200); fgLeaves(G, X(1980), Y(1080), 1.1, -1);
    BT.push(() => {
      let t = go('so the next time'); WHIP(t, X(1300), Y(520), 1.1); blink('b17', [t + 2, t + 9, t + 15]); breathe('b17', t, 8);
      t = W('confidently tells you'); POP('#fp17', t); talk('b17', t, t + 1.5); liar('b17', t + .3); mood('b17', t, 'happy');
      t = W('turns out to be false'); SHAKE('#fp17', t); dim(t, 1);
      t = W('it didnt see a ghost'); CAM(t - .3, X(1000), Y(480), 1.1, 1.0); POP('#gh17', t - .2); POP('#xg17', W('a ghost') + .3, { s: 2 });
      t = W('it didnt imagine'); OUT('#gh17,#xg17', t - .2); POP('#tc17', t - .1); POP('#xt17', W('something') + .2, { s: 2 });
      t = W('it did exactly'); OUT('#tc17,#xt17', t - .1); CAM(t, X(1150), Y(420), 1.0, 1.0); t = W('predict the most likely'); tw.forEach((_, k) => tl.fromTo('#tk17' + k, { autoAlpha: 0, x: 600 - k * 120, y: 300, scale: .4, transformOrigin: '50% 50%' }, { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: .55, ease: 'back.out(1.4)' }, t + k * .25)); talk('b17', t, t + 1.8); B(t);
      t = W('the difference is that'); CAM(t - .2, X(560), Y(520), 1.15, 1.1); RING('rg17', t + .3, 1);
      t = W('keeps checking'); POP('#ey17', t - .3); DR('#lp17a', t, { d: .5 }); DR('#lp17b', t + .4, { d: .5 }); POP('#ck17', W('against the world')); glow(W('against the world'));
      t = W('and the machine is still'); CAM(t - .2, X(1320), Y(520), 1.15, 1.0); POP('#cap17', W('learning') - .2); BOING('#cap17', W('learning') + .3); POP('#lb17', W('learning')); mood('b17', W('learning'), 'happy'); nod('b17', W('how to do') );
    });
  }

  // ---------------- beats ----------------
  return () => {
    tl.set(HID, { autoAlpha: 0 }, 0); tl.set('#world', { transformOrigin: '0% 0%' }, 0);
    const [ax, ay] = AO(0); intro(s, '#manB', ax + 760, ay + 560, { col: '#fde68a', r: 320 });
    BT.forEach(f => { ST = 0; f(); });
    ST = 0; const starts = ['now somewhere else', 'we use the same word', 'lets start with the human brain', 'your brain is sealed', 'based on everything', 'many neuroscientists', 'thats exactly whats happening', 'something similar can happen', 'and heres the key detail', 'now lets look at the machine', 'during training', 'when you ask a model', 'and theres another reason', 'so heres the real difference', 'in fact some researchers', 'but even here', 'still the two do share', 'so the next time'].map(p => { ST = 0; return go(p); });
    lifeBeats(starts);
    const [fx, fy] = AO(17); outro(fx + 960, fy + 520, .92, '#cap17');
    RING('rg17', END - .3, 1);
  };
} }] };
