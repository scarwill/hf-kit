// Example LONG (1920x1080) Infographics-style DSML video — 'Why AI hallucinates'. Needs scenes.js. Build: cat premium illus life helpers icons scenes + this > all.js; python3 build.py all.js <audio>
const VIDEO = { theme: 'blue', scenes: [{ type: 'custom', build: (s) => {
  const { G, BG, defs } = makeWorld(s, 4, 2); illusDefs(defs); addLife(s);
  const BT = [];   // extra beats
  // ================= AREA 0: lecture hall — the fake study =================
  { const [ox, oy] = AO(0);
    scene(BG, defs, ox, oy, ['#6366f1', '#3730a3'], ['#b45309', '#78350f'], 860);
    S('rect', { x: ox + 140, y: oy + 820, width: 1640, height: 60, rx: 8, fill: '#92400e' }, G); S('rect', { x: ox + 140, y: oy + 820, width: 1640, height: 12, fill: '#d97706' }, G);
    cone(G, ox + 430, oy - 60, 520, 900); cone(G, ox + 1640, oy - 60, 420, 900);
    lamp(G, ox + 150, oy + 260); lamp(G, ox + 1770, oy + 260); clock(G, ox + 1600, oy + 150, 50);
    // big screen with the (fake) paper
    S('rect', { x: ox + 600, y: oy + 90, width: 920, height: 530, rx: 18, fill: '#1e293b' }, G);
    const sc = S('g', { id: 'scr0' }, G); S('rect', { x: ox + 620, y: oy + 110, width: 880, height: 490, rx: 10, fill: '#f8fafc' }, sc);
    const pap = S('g', { id: 'pap' }, sc); S('rect', { x: ox + 620, y: oy + 110, width: 880, height: 64, rx: 10, fill: '#1d4ed8' }, pap); txt(pap, ox + 1060, oy + 154, 'JOURNAL OF ADVANCED MEDICINE', 30, '#fff');
    const ttl = S('g', { id: 'pT' }, pap); txt(ttl, ox + 1060, oy + 240, 'Daily Coffee Adds', 50, C.ink); txt(ttl, ox + 1060, oy + 300, '12 Years to Your Life', 50, C.ink);
    txt(pap, ox + 1060, oy + 350, 'Dr. A. Reed et al.  ·  2021', 28, '#64748b', 'middle', 600);
    S('path', { d: `M${ox + 680} ${oy + 570} L${ox + 1060} ${oy + 570}`, stroke: '#94a3b8', 'stroke-width': 5 }, pap);
    [60, 95, 140, 185].forEach((h, k) => S('rect', { id: 'pb' + k, x: ox + 700 + k * 90, y: oy + 570 - h, width: 60, height: h, rx: 6, fill: ['#93c5fd', '#60a5fa', '#3b82f6', '#1d4ed8'][k] }, pap));
    txt(pap, ox + 1290, oy + 450, 'n = 48,000', 38, '#334155', 'middle', 700); txt(pap, ox + 1290, oy + 510, 'p < 0.001', 38, '#334155', 'middle', 700);
    stamp(G, ox + 1060, oy + 360, 'DOES NOT EXIST', C.red, 'stamp0');
    // podium + bot (hero of the intro)
    botB(G, ox + 430, oy + 820, .85, 'b0');
    const pod = S('g', {}, G); S('path', { d: `M${ox + 320} ${oy + 640} L${ox + 540} ${oy + 640} L${ox + 520} ${oy + 830} L${ox + 340} ${oy + 830} Z`, fill: '#7c2d12' }, pod); S('rect', { x: ox + 300, y: oy + 620, width: 260, height: 30, rx: 8, fill: '#9a3412' }, pod); S('path', { d: `M${ox + 470} ${oy + 620} L${ox + 500} ${oy + 560}`, stroke: '#334155', 'stroke-width': 8 }, pod); S('ellipse', { cx: ox + 504, cy: oy + 552, rx: 14, ry: 18, fill: '#111827' }, pod);
    txt(pod, ox + 430, oy + 740, 'AI', 54, '#fde68a');
    bubble(G, ox + 70, oy + 300, 380, 100, 'Proven fact!', 'bb0', 40, .15); hidId('bb0');
    charB(G, ox + 1650, oy + 840, .78, 'e0', { hair: 'long', skin: SKIN[0], hairC: '#7c4a1e', top: '#ec4899', topType: 'tshirt' });
    QM(G, ox + 1650, oy + 330, 120, '#fde047', 'q0'); hidId('q0');
    heads(G, ox - 100, ox + 2020, oy + 1010, 12);
    hidId('pap'); hidId('stamp0');
    BT.push(() => {
      let t = go('invent a scientific'); CAM(t, ox + 960, oy + 520, 1, 1.4, 'power2.inOut'); FADE('#pap', t, { d: .5 }); POP('#pT', W('believable title')); PULSE('#pT', W('believable title') + .5);
      t = W('confidently explain'); tl.to('#b0aR', { rotation: -110, transformOrigin: '50% 0%', duration: .4 }, t); [0, 1, 2, 3].forEach(k => BARY('#pb' + k, t + .1 + k * .12, 1, .5)); POP('#bb0', t + .2); mood('b0', t, 'happy'); blink('b0', [t + 1.2]); blink('e0', [t + .6, t + 3]);
      t = W('the problem'); CAM(t, ox + 1060, oy + 380, 1.25, 1.0); OUT('#bb0', t);
      t = W('never existed'); POP('#stamp0', t, { s: 1.8 }); SHAKE('#scr0', t + .1); tl.to('#pap', { opacity: .35, duration: .4 }, t); mood('e0', t, 'surprised'); POP('#q0', t + .3); tl.to('#b0aR', { rotation: 0, duration: .3 }, t); mood('b0', t + .2, 'worried');
    });
  }
  // ================= AREA 1: office — "be accurate!" vs a missing fact checker =================
  { const [ox, oy] = AO(1);
    scene(BG, defs, ox, oy, ['#5eead4', '#0d9488'], ['#a16207', '#713f12']);
    windowPane(G, ox + 1290, oy + 110, 420, 330); [[1320, 90, 230], [1430, 110, 290], [1560, 100, 200]].forEach(([x, w, h], k) => tower(G, ox + x, oy + 430, w, h, k % 2 ? '#312e81' : '#1e1b4b'));
    shelf(G, ox + 60, oy + 200, 320, 620); clock(G, ox + 520, oy + 170, 56); plant(G, ox + 1230, oy + 820, 1.1);
    S('rect', { x: ox + 500, y: oy + 640, width: 700, height: 30, rx: 8, fill: '#78350f' }, G); S('rect', { x: ox + 530, y: oy + 670, width: 24, height: 150, fill: '#451a03' }, G); S('rect', { x: ox + 1146, y: oy + 670, width: 24, height: 150, fill: '#451a03' }, G);
    desktop(G, ox + 600, oy + 330, 1.0, 'dk1');
    const fc = S('g', {}, G); S('rect', { x: ox + 640, y: oy + 370, width: 300, height: 170, rx: 30, fill: '#e2e8f0' }, fc); S('rect', { x: ox + 660, y: oy + 388, width: 260, height: 134, rx: 22, fill: C.ink }, fc); [745, 835].forEach(x => S('ellipse', { cx: ox + x, cy: oy + 440, rx: 14, ry: 18, fill: '#67e8f9' }, fc)); S('path', { d: `M${ox + 765} ${oy + 485} Q${ox + 790} ${oy + 500} ${ox + 815} ${oy + 485}`, stroke: '#67e8f9', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, fc);
    const note = S('g', { id: 'note1' }, G); const nr = S('g', { transform: `rotate(8 ${ox + 940} ${oy + 340})` }, note); S('rect', { x: ox + 840, y: oy + 270, width: 210, height: 150, fill: '#fde047', stroke: '#ca8a04', 'stroke-width': 4 }, nr); txt(nr, ox + 945, oy + 335, 'BE', 40, C.ink); txt(nr, ox + 945, oy + 385, 'TRUTHFUL', 38, C.ink);
    charB(G, ox + 1120, oy + 840, .8, 'j1', { hair: 'short', skin: SKIN[0], hairC: '#5b3a29', top: '#2563eb', topType: 'hoodie', glasses: true });
    bubble(G, ox + 880, oy + 80, 470, 100, 'Be 100% accurate!', 'bb1', 40, .2); hidId('bb1');
    const mc = S('g', { id: 'mach' }, G); S('rect', { x: ox + 1360, y: oy + 480, width: 440, height: 340, rx: 24, fill: 'rgba(255,255,255,.18)', stroke: '#134e4a', 'stroke-width': 7, 'stroke-dasharray': '26 16' }, mc); txt(mc, ox + 1580, oy + 545, 'FACT CHECKER', 38, '#134e4a'); gearG(mc, ox + 1500, oy + 680, 1.0, '#64748b'); gearG(mc, ox + 1650, oy + 700, .8, '#64748b'); ic(mc, 'magnify', ox + 1730, oy + 610, 80, '#64748b');
    XM(G, ox + 1580, oy + 660, 120, 'mx1'); hidId('mach'); hidId('note1'); hidId('mx1');
    BT.push(() => {
      let t = go('so why does this'); CUT(t - .05, ox + 1100, oy + 450, 1.7); CAM(t, ox + 960, oy + 540, 1, 1.4, 'power2.out'); breathe('j1', t, 5); blink('j1', [t + 1.5, t + 5]);
      t = W('explicitly tell'); POP('#bb1', t); mood('j1', t, 'happy'); tl.to('#j1aL', { rotation: 40, transformOrigin: '50% 0%', duration: .2, yoyo: true, repeat: 5 }, t);
      t = W('because an instruction'); OUT('#bb1', t - .2); tl.fromTo('#note1', { autoAlpha: 0, y: -260, rotation: -30, transformOrigin: '50% 50%' }, { autoAlpha: 1, y: 0, rotation: 0, duration: .5, ease: 'back.out(1.6)' }, t); B(t);
      t = W('a mechanism that'); CAM(t, ox + 1280, oy + 560, 1.1, 1.0); FADE('#mach', t); t = W('verifies truth'); POP('#mx1', t, { s: 2 }); SHAKE('#note1', t + .2); mood('j1', t, 'worried');
    });
  }
  // ================= AREA 2: inside the model — a token factory =================
  { const [ox, oy] = AO(2);
    scene(BG, defs, ox, oy, ['#fde68a', '#f59e0b'], ['#78716c', '#44403c']);
    shelf(G, ox + 40, oy + 260, 330, 560, 'sh2'); S('rect', { x: ox + 50, y: oy + 195, width: 310, height: 54, rx: 27, fill: '#78350f' }, G); txt(G, ox + 205, oy + 233, 'TRAINING DATA', 32, '#fff');
    // machine
    const m = S('g', { id: 'mach2' }, G);
    S('path', { d: `M${ox + 580} ${oy + 170} L${ox + 920} ${oy + 170} L${ox + 860} ${oy + 260} L${ox + 640} ${oy + 260} Z`, fill: '#4f46e5', stroke: C.ink, 'stroke-width': 6 }, m);
    S('rect', { x: ox + 470, y: oy + 260, width: 560, height: 520, rx: 40, fill: '#6366f1', stroke: C.ink, 'stroke-width': 6 }, m); txt(m, ox + 750, oy + 330, 'LANGUAGE MODEL', 40, '#fff');
    S('rect', { x: ox + 560, y: oy + 360, width: 380, height: 160, rx: 30, fill: C.ink }, m); [690, 810].forEach(x => S('ellipse', { cx: ox + x, cy: oy + 430, rx: 22, ry: 28, fill: '#67e8f9' }, m)); S('path', { d: `M${ox + 715} ${oy + 485} Q${ox + 750} ${oy + 505} ${ox + 785} ${oy + 485}`, stroke: '#67e8f9', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, m);
    gearG(m, ox + 600, oy + 650, 1.2, '#fde047', 'g2a'); gearG(m, ox + 760, oy + 690, .9, '#fbbf24', 'g2b'); gearG(m, ox + 900, oy + 640, 1.1, '#fde047', 'g2c');
    S('rect', { x: ox + 1000, y: oy + 600, width: 60, height: 90, fill: '#4338ca', stroke: C.ink, 'stroke-width': 5 }, m);
    // conveyor
    S('rect', { x: ox + 1040, y: oy + 690, width: 900, height: 34, rx: 17, fill: '#1f2937' }, G); for (let k = 0; k < 9; k++) S('circle', { cx: ox + 1070 + k * 100, cy: oy + 740, r: 18, fill: '#6b7280', stroke: '#1f2937', 'stroke-width': 4 }, G);
    S('rect', { x: ox + 1060, y: oy + 740, width: 16, height: 80, fill: '#374151' }, G); S('rect', { x: ox + 1880, y: oy + 740, width: 16, height: 80, fill: '#374151' }, G);
    const toks = [['The', '#fca5a5'], ['study', '#fdba74'], ['found', '#86efac'], ['that', '#93c5fd'], ['coffee', '#d8b4fe']]; let tx = ox + 1090;
    toks.forEach(([w, c], k) => { const ww = w.length * 21 + 44; token(G, tx + ww / 2, oy + 650, w, c, 'tk' + k); tx += ww + 18; hidId('tk' + k); });
    // next-word probabilities
    const pp = S('g', { id: 'prob' }, G); S('rect', { x: ox + 1120, y: oy + 250, width: 640, height: 330, rx: 24, fill: '#fff', stroke: C.ink, 'stroke-width': 5, filter: 'url(#fSh)' }, pp); txt(pp, ox + 1440, oy + 305, 'Next word?', 40, C.ink);
    [['found', .62, '#22c55e'], ['showed', .21, '#3b82f6'], ['proved', .09, '#a855f7']].forEach(([w, v, c], k) => { const y = oy + 340 + k * 75; txt(pp, ox + 1150, y + 40, w, 34, C.ink, 'start', 700); S('rect', { x: ox + 1310, y: y + 12, width: 380, height: 40, rx: 12, fill: '#e5e7eb' }, pp); S('rect', { id: 'pr' + k, x: ox + 1310, y: y + 12, width: 380 * v, height: 40, rx: 12, fill: c }, pp); txt(pp, ox + 1310 + 380 * v + 14, y + 44, Math.round(v * 100) + '%', 30, C.ink, 'start', 700); });
    hidId('prob');
    // books flying from the shelf into the hopper
    ['#ef4444', '#3b82f6', '#22c55e', '#eab308'].forEach((c, k) => { book(G, ox + 260, oy + 400 + k * 90, c, 'fb' + k); hidId('fb' + k); });
    [0, 1, 2].forEach(k => { check(G, ox + 400, oy + 380 + k * 150, 30, 'ck2' + k); hidId('ck2' + k); });
    // the reliable source — never connected
    const src = S('g', { id: 'src2' }, G); S('path', { d: `M${ox + 1540} ${oy + 120} L${ox + 1720} ${oy + 60} L${ox + 1900} ${oy + 120} Z`, fill: '#e2e8f0', stroke: C.ink, 'stroke-width': 5 }, src); S('rect', { x: ox + 1560, y: oy + 120, width: 320, height: 110, fill: '#f8fafc', stroke: C.ink, 'stroke-width': 5 }, src); [0, 1, 2, 3].forEach(k => S('rect', { x: ox + 1590 + k * 76, y: oy + 135, width: 22, height: 80, fill: '#cbd5e1' }, src)); txt(src, ox + 1720, oy + 112, 'SOURCE', 30, C.ink);
    CRV(G, `M${ox + 930} ${oy + 175} Q${ox + 1240} ${oy + 40} ${ox + 1545} ${oy + 160}`, '#0f172a', 'srcL', 7); hidId('srcL'); XM(G, ox + 1240, oy + 110, 50, 'mx2'); hidId('mx2'); hidId('src2');
    BT.push(() => {
      let t = go('a language model generates'); CUT(t - .05, ox + 750, oy + 450, 1.8); CAM(t, ox + 960, oy + 540, 1, 1.4, 'power2.out');
      ['g2a', 'g2c'].forEach(id => tl.to('#' + id, { rotation: 720, transformOrigin: '50% 50%', duration: 16, ease: 'none' }, t)); tl.to('#g2b', { rotation: -720, transformOrigin: '50% 50%', duration: 16, ease: 'none' }, t);
      t = W('predicting'); toks.forEach((_, k) => { tl.fromTo('#tk' + k, { autoAlpha: 0, x: -(160 + k * 150) }, { autoAlpha: 1, x: 0, duration: .9, ease: 'power2.out' }, t + k * .35); }); B(t);
      t = W('pieces that make'); POP('#prob', t); [0, 1, 2].forEach(k => BAR('#pr' + k, t + .3 + k * .15, 1, .6)); PULSE('#tk2', t + 1.4, { s: 1.15 });
      t = W('patterns learned during'); [0, 1, 2, 3].forEach(k => { tl.set('#fb' + k, { autoAlpha: 1 }, t + k * .25); tl.fromTo('#fb' + k, { x: 0, y: 0, rotation: 0, transformOrigin: '50% 50%' }, { x: 490, y: -(250 + k * 90), rotation: 360, duration: .9, ease: 'power2.in' }, t + k * .25); tl.set('#fb' + k, { autoAlpha: 0 }, t + k * .25 + .9); }); B(t);
      t = W('useful factual knowledge'); [0, 1, 2].forEach(k => POP('#ck2' + k, t + k * .15));
      t = W('but generating'); CAM(t, ox + 1250, oy + 420, 1.05, 1.2); FADE('#src2', t);
      t = W('checking it against'); DR('#srcL', t, { d: .8 }); t = W('reliable source'); POP('#mx2', t, { s: 2 }); tl.to('#src2', { opacity: .45, duration: .5 }, t + .2);
    });
  }
  // ================= AREA 3: the confident expert who fills gaps =================
  { const [ox, oy] = AO(3);
    scene(BG, defs, ox, oy, ['#c4b5fd', '#7c3aed'], ['#4c1d95', '#2e1065']);
    [[60, 260], [160, 380], [260, 300], [360, 460], [460, 340]].forEach(([x, h], k) => { const g = S('g', { id: 'ps' + k }, G); for (let y = 0; y < h; y += 26) S('rect', { x: ox + x, y: oy + 820 - y - 24, width: 90, height: 22, rx: 3, fill: y % 52 ? '#f8fafc' : '#e2e8f0', stroke: '#94a3b8', 'stroke-width': 2 }, g); });
    pill(G, ox + 300, oy + 300, '1,000,000+ documents', '#fde047', C.ink, 'pc3', 34); hidId('pc3');
    charB(G, ox + 700, oy + 840, .82, 'd3', { hair: 'bald', skin: SKIN[0], hairC: '#9ca3af', top: '#1e3a8a', topType: 'blazer', glasses: true, beard: true });
    bubble(G, ox + 520, oy + 130, 460, 100, 'Studies clearly show…', 'bb3', 38, -.05); hidId('bb3');
    // puzzle with a missing piece
    S('path', { d: `M${ox + 880} ${oy + 820} L${ox + 960} ${oy + 560} M${ox + 1180} ${oy + 820} L${ox + 1100} ${oy + 560}`, stroke: '#78350f', 'stroke-width': 14 }, G);
    S('rect', { x: ox + 820, y: oy + 240, width: 420, height: 330, rx: 12, fill: '#fef3c7', stroke: '#78350f', 'stroke-width': 8 }, G);
    const pc = ['#60a5fa', '#34d399', '#f472b6', '#fbbf24', '#a78bfa', '#f87171']; for (let r = 0; r < 2; r++) for (let q = 0; q < 3; q++) { if (r === 1 && q === 2) { S('rect', { x: ox + 850 + q * 125, y: oy + 270 + r * 135, width: 115, height: 125, rx: 10, fill: 'none', stroke: '#78350f', 'stroke-width': 4, 'stroke-dasharray': '12 8' }, G); continue; } S('rect', { x: ox + 850 + q * 125, y: oy + 270 + r * 135, width: 115, height: 125, rx: 10, fill: pc[r * 3 + q] }, G); }
    S('rect', { id: 'pz3', x: ox + 1100, y: oy + 405, width: 115, height: 125, rx: 10, fill: '#fb7185', stroke: '#be123c', 'stroke-width': 3 }, G); hidId('pz3');
    // two identical framed answers: one correct, one fake
    const frame = (x, id) => { const g = S('g', { id }, G); S('rect', { x, y: oy + 250, width: 280, height: 320, rx: 10, fill: '#ca8a04' }, g); S('rect', { x: x + 18, y: oy + 268, width: 244, height: 284, fill: '#fff' }, g); txt(g, x + 140, oy + 320, 'ANSWER', 34, C.ink); [0, 1, 2].forEach(k => S('rect', { x: x + 50 + k * 64, y: oy + 520 - (60 + k * 50), width: 44, height: 60 + k * 50, rx: 6, fill: '#3b82f6' }, g)); return g; };
    frame(ox + 1300, 'fr0'); frame(ox + 1610, 'fr1'); hidId('fr0'); hidId('fr1');
    check(G, ox + 1440, oy + 650, 50, 'ok3'); hidId('ok3'); XM(G, ox + 1750, oy + 650, 45, 'xx3'); hidId('xx3');
    BT.push(() => {
      let t = go('imagine someone'); CUT(t - .05, ox + 700, oy + 450, 1.7); CAM(t, ox + 600, oy + 520, 1.1, 1.4, 'power2.out'); breathe('d3', t, 7); blink('d3', [t + 2, t + 6, t + 10]);
      t = W('millions of documents'); [0, 1, 2, 3, 4].forEach(k => BARY('#ps' + k, t + k * .1, 1, .6)); POP('#pc3', t + .4);
      t = W('how an expert'); OUT('#pc3', t); POP('#bb3', t + .2); mood('d3', t, 'happy'); tl.to('#d3aR', { rotation: -70, transformOrigin: '50% 0%', duration: .3, yoyo: true, repeat: 3 }, t + .3);
      t = W('fills gaps'); CAM(t, ox + 1030, oy + 470, 1.25, 1.0); OUT('#bb3', t); tl.fromTo('#pz3', { autoAlpha: 0, x: 260, y: 300, rotation: 40, transformOrigin: '50% 50%' }, { autoAlpha: 1, x: 0, y: 0, rotation: 0, duration: .9, ease: 'back.out(1.2)' }, W('plausible details') - .3); B(W('plausible details'));
      t = W('thats why'); CAM(t, ox + 1045, oy + 500, 1.1, 1.0); POP('#fr0', t + .2); POP('#fr1', t + .5); t = W('as a correct one'); POP('#ok3', t); POP('#xx3', t + .35);
    });
  }
  // ================= AREA 4: classroom — rules reduce mistakes, but no guarantee =================
  { const [ox, oy] = AO(4);
    scene(BG, defs, ox, oy, ['#fde68a', '#fbbf24'], ['#b45309', '#78350f']);
    S('rect', { x: ox + 330, y: oy + 100, width: 1060, height: 480, rx: 14, fill: '#92400e' }, G); S('rect', { x: ox + 350, y: oy + 120, width: 1020, height: 440, rx: 8, fill: '#14532d' }, G);
    const rw = [['NEVER MAKE', 250], ['ANYTHING UP', 340]]; rw.forEach(([w, y], k) => { txt(G, ox + 860, oy + y, w, 84, '#f8fafc', 'middle', 800, 'rw' + k); hidId('rw' + k); });
    const mt = S('g', { id: 'meter' }, G); txt(mt, ox + 860, oy + 450, 'MISTAKES', 40, '#bbf7d0'); S('rect', { x: ox + 560, y: oy + 475, width: 600, height: 44, rx: 22, fill: '#052e16' }, mt); S('rect', { id: 'mbar', x: ox + 560, y: oy + 475, width: 600, height: 44, rx: 22, fill: C.red }, mt); hidId('meter');
    clock(G, ox + 1600, oy + 170, 56); plant(G, ox + 1830, oy + 820, 1.0);
    charB(G, ox + 200, oy + 840, .82, 'e4', { hair: 'long', skin: SKIN[0], hairC: '#7c4a1e', top: '#ec4899', topType: 'blazer' });
    S('path', { id: 'ptr4', d: `M${ox + 290} ${oy + 470} L${ox + 420} ${oy + 300}`, stroke: '#78350f', 'stroke-width': 10, 'stroke-linecap': 'round' }, G);
    botB(G, ox + 1080, oy + 860, .6, 'b4');
    S('rect', { x: ox + 900, y: oy + 700, width: 360, height: 40, rx: 8, fill: '#a16207' }, G); S('rect', { x: ox + 920, y: oy + 740, width: 320, height: 120, fill: '#854d0e' }, G);
    bubble(G, ox + 1160, oy + 560, 360, 90, "I'm not sure.", 'bb4', 38, -.3); hidId('bb4');
    S('rect', { x: ox + 1380, y: oy + 700, width: 520, height: 30, rx: 8, fill: '#a16207' }, G); S('rect', { x: ox + 1400, y: oy + 730, width: 20, height: 130, fill: '#713f12' }, G); S('rect', { x: ox + 1860, y: oy + 730, width: 20, height: 130, fill: '#713f12' }, G);
    for (let k = 0; k < 5; k++) { const g = S('g', { id: 'cl' + k }, G); S('rect', { x: ox + 1395 + k * 100, y: oy + 600, width: 88, height: 100, rx: 8, fill: '#fff', stroke: '#334155', 'stroke-width': 3 }, g); txt(g, ox + 1439 + k * 100, oy + 630, 'CLAIM', 20, '#334155'); [0, 1].forEach(r => S('rect', { x: ox + 1407 + k * 100, y: oy + 645 + r * 18, width: 64, height: 8, rx: 4, fill: '#cbd5e1' }, g)); hidId('cl' + k);
      if (k < 2) { check(G, ox + 1439 + k * 100, oy + 570, 26, 'cv' + k); hidId('cv' + k); } else { QM(G, ox + 1439 + k * 100, oy + 570, 60, C.red, 'cq' + k); hidId('cq' + k); } }
    BT.push(() => {
      let t = go('and what about'); CUT(t - .05, ox + 860, oy + 300, 1.6); CAM(t, ox + 960, oy + 540, 1, 1.3, 'power2.out'); blink('e4', [t + 1, t + 5]); blink('b4', [t + 2, t + 7]);
      t = W('never make anything'); IN('#rw0', t, { y: 20 }); IN('#rw1', t + .4, { y: 20 }); tl.to('#ptr4', { rotation: -10, transformOrigin: '0% 100%', duration: .25, yoyo: true, repeat: 3 }, t);
      t = W('reduce mistakes'); FADE('#meter', t - .3); tl.fromTo('#mbar', { scaleX: 1, transformOrigin: '0% 50%' }, { scaleX: .35, duration: 1.2, ease: 'power2.out' }, t + .2); B(t);
      t = W('admit uncertainty'); POP('#bb4', t); mood('b4', t, 'worried');
      t = W('but they dont'); OUT('#bb4', t); CAM(t, ox + 1180, oy + 600, 1.3, 1.0); [0, 1, 2, 3, 4].forEach(k => POP('#cl' + k, t + k * .12));
      t = W('gets verified'); [0, 1].forEach(k => POP('#cv' + k, t - .4 + k * .2)); [2, 3, 4].forEach(k => POP('#cq' + k, t + .2 + (k - 2) * .15));
    });
  }
  // ================= AREA 5: game show — answering is rewarded, "I don't know" is not =================
  { const [ox, oy] = AO(5);
    scene(BG, defs, ox, oy, ['#f472b6', '#9d174d'], ['#312e81', '#1e1b4b'], 840);
    [[0, 1], [1920, -1]].forEach(([x, d]) => S('path', { d: `M${ox + x} ${oy - 160} L${ox + x + d * 300} ${oy - 160} Q${ox + x + d * 200} ${oy + 400} ${ox + x + d * 260} ${oy + 840} L${ox + x} ${oy + 840} Z`, fill: '#b91c1c' }, G));
    cone(G, ox + 960, oy - 80, 640, 940); cone(G, ox + 1560, oy - 80, 420, 940);
    const sb = S('g', {}, G); S('rect', { x: ox + 540, y: oy + 70, width: 840, height: 300, rx: 24, fill: '#0f172a', stroke: '#fbbf24', 'stroke-width': 10 }, sb); txt(sb, ox + 960, oy + 130, 'SCORE', 40, '#fbbf24');
    txt(sb, ox + 600, oy + 220, 'Answer', 52, '#a3e635', 'start'); txt(sb, ox + 1320, oy + 220, '+1', 60, '#a3e635', 'end'); txt(sb, ox + 600, oy + 320, '"I don\'t know"', 52, '#94a3b8', 'start'); txt(sb, ox + 1320, oy + 320, '0', 60, '#94a3b8', 'end');
    for (let k = 0; k < 12; k++) S('circle', { cx: ox + 560 + k * 73, cy: oy + 70, r: 9, fill: k % 2 ? '#fde047' : '#fb923c' }, sb);
    botB(G, ox + 960, oy + 840, .62, 'b5');
    const pd = S('g', {}, G); S('path', { d: `M${ox + 820} ${oy + 620} L${ox + 1100} ${oy + 620} L${ox + 1080} ${oy + 850} L${ox + 840} ${oy + 850} Z`, fill: '#7c3aed' }, pd); S('rect', { x: ox + 800, y: oy + 600, width: 320, height: 30, rx: 8, fill: '#a78bfa' }, pd); txt(pd, ox + 960, oy + 760, 'AI', 60, '#fde68a');
    const bz = S('g', { id: 'bz5' }, G); S('ellipse', { cx: ox + 1050, cy: oy + 598, rx: 46, ry: 16, fill: '#7f1d1d' }, bz); S('ellipse', { cx: ox + 1050, cy: oy + 588, rx: 40, ry: 16, fill: C.red }, bz);
    spark(G, ox + 1050, oy + 560, 1.3, '#fde047', 'sp5'); hidId('sp5');
    bubble(G, ox + 560, oy + 400, 330, 90, 'Uh… 1987?', 'bb5', 40, .3); hidId('bb5'); pill(G, ox + 1240, oy + 480, '+1', '#a3e635', C.ink, 'pt5', 50); hidId('pt5');
    charB(G, ox + 1560, oy + 840, .78, 'j5', { hair: 'short', skin: SKIN[0], hairC: '#5b3a29', top: '#f59e0b', topType: 'blazer' });
    BT.push(() => {
      let t = go('training that rewards'); CUT(t - .05, ox + 960, oy + 250, 1.6); CAM(t, ox + 960, oy + 520, 1, 1.2, 'power2.out'); mood('j5', t, 'happy'); blink('j5', [t + 1.5]);
      t = W('encourage guessing'); tl.to('#b5aR', { rotation: -60, transformOrigin: '50% 0%', duration: .2 }, t - .6); tl.fromTo('#bz5', { y: 0 }, { y: 8, duration: .1, yoyo: true, repeat: 1 }, t - .4); POP('#sp5', t - .35); tl.to('#sp5', { autoAlpha: 0, scale: 1.6, duration: .5 }, t + .1); POP('#bb5', t - .2); POP('#pt5', t + .3); mood('b5', t - .3, 'happy');
    });
  }
  // ================= AREA 6: library — retrieval (RAG), with its limits =================
  { const [ox, oy] = AO(6);
    scene(BG, defs, ox, oy, ['#fed7aa', '#fb923c'], ['#92400e', '#451a03']);
    shelf(G, ox + 30, oy + 140, 360, 680); shelf(G, ox + 1530, oy + 140, 360, 680); lamp(G, ox + 960, oy + 70);
    const ws = S('g', { id: 'web6' }, G); S('rect', { x: ox + 600, y: oy + 100, width: 720, height: 330, rx: 18, fill: '#fff', stroke: C.ink, 'stroke-width': 5, filter: 'url(#fSh)' }, ws); S('rect', { x: ox + 600, y: oy + 100, width: 720, height: 50, rx: 18, fill: '#334155' }, ws); [0, 1, 2].forEach(k => S('circle', { cx: ox + 630 + k * 26, cy: oy + 125, r: 8, fill: ['#f87171', '#fbbf24', '#4ade80'][k] }, ws));
    S('rect', { x: ox + 630, y: oy + 170, width: 660, height: 50, rx: 25, fill: '#f1f5f9', stroke: '#cbd5e1', 'stroke-width': 3 }, ws); txt(ws, ox + 660, oy + 206, 'coffee and lifespan study', 30, '#334155', 'start', 600);
    ['Coffee & health: a 2023 review', 'What large studies really found', 'Caffeine: how much is safe?'].forEach((l, k) => txt(ws, ox + 640, oy + 270 + k * 52, l, 30, '#1d4ed8', 'start', 600));
    hidId('web6');
    const rag = S('g', { id: 'rag6' }, G); [['R', 'Retrieval', '#22c55e'], ['A', 'Augmented', '#3b82f6'], ['G', 'Generation', '#a855f7']].forEach(([L, w, c], k) => { const g = S('g', { id: 'rg' + k }, rag); const x = ox + 700 + k * 260; S('circle', { cx: x, cy: oy + 260, r: 100, fill: c, stroke: C.ink, 'stroke-width': 6 }, g); txt(g, x, oy + 300, L, 120, '#fff'); txt(g, x, oy + 410, w, 34, C.ink); }); hidId('rag6');
    botB(G, ox + 510, oy + 860, .7, 'b6');
    S('rect', { x: ox + 640, y: oy + 680, width: 820, height: 40, rx: 10, fill: '#78350f' }, G); S('rect', { x: ox + 680, y: oy + 720, width: 30, height: 140, fill: '#451a03' }, G); S('rect', { x: ox + 1390, y: oy + 720, width: 30, height: 140, fill: '#451a03' }, G);
    const dl = [['Study A', '2021'], ['Review', 'n=12k'], ['Report', '2019']]; dl.forEach(([a, b], k) => { docSheet(G, ox + 735 + k * 230, oy + 470, 170, 'd6' + k, [a, b], ['#22c55e', '#3b82f6', '#f97316'][k]); hidId('d6' + k); });
    S('path', { id: 'crk6', class: 'draw', d: `M${ox + 1030} ${oy + 500} L${ox + 1065} ${oy + 560} L${ox + 1035} ${oy + 600} L${ox + 1080} ${oy + 670}`, stroke: C.red, 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round' }, G); hidId('crk6');
    XM(G, ox + 1135, oy + 470, 40, 'x6'); hidId('x6'); QM(G, ox + 1280, oy + 380, 100, '#fde047', 'q6'); hidId('q6');
    BT.push(() => {
      let t = go('one solution is'); CUT(t - .05, ox + 960, oy + 500, 1.6); CAM(t, ox + 960, oy + 540, 1, 1.3, 'power2.out'); blink('b6', [t + 1, t + 6, t + 11]);
      t = W('relevant documents'); [0, 1, 2].forEach(k => { const sx = k === 1 ? 0 : (k === 0 ? -480 : 660); tl.fromTo('#d6' + k, { autoAlpha: 0, x: sx, y: -260, rotation: k ? 20 : -20, transformOrigin: '50% 50%' }, { autoAlpha: 1, x: 0, y: 0, rotation: 0, duration: .8, ease: 'power3.out' }, t + k * .25); }); B(t);
      t = W('search results'); POP('#web6', t); t = W('before it answers'); mood('b6', t, 'happy');
      t = W('this is often'); OUT('#web6', t - .1); [0, 1, 2].forEach(k => POP('#rg' + k, W('retrievalaugmented') + k * .35)); tl.set('#rag6', { autoAlpha: 1 }, t); PULSE('#rg2', W('or rag'), { s: 1.12 });
      t = W('sources can be wrong'); OUT('#rag6', t - .4); DR('#crk6', t, { d: .4 }); POP('#x6', t + .3); SHAKE('#d61', t + .3);
      t = W('misinterpret them'); tl.to('#d62', { rotation: 180, transformOrigin: '50% 50%', duration: .6 }, t - .4); POP('#q6', t); mood('b6', t, 'worried');
    });
  }
  // ================= AREA 7: sounding certain ≠ being correct =================
  { const [ox, oy] = AO(7);
    scene(BG, defs, ox, oy, ['#38bdf8', '#0369a1'], ['#0c4a6e', '#082f49'], 860);
    cone(G, ox + 520, oy - 80, 520, 960); cone(G, ox + 1400, oy - 80, 520, 960);
    const ped = (x, col, l1, id) => { const g = S('g', { id }, G); S('rect', { x: x - 260, y: oy + 660, width: 520, height: 200, rx: 16, fill: col, stroke: C.ink, 'stroke-width': 6 }, g); txt(g, x, oy + 780, l1, 40, '#fff'); return g; };
    ped(ox + 520, '#f97316', 'SOUNDING CERTAIN', 'pl7'); ped(ox + 1400, '#16a34a', 'BEING CORRECT', 'pr7');
    botB(G, ox + 520, oy + 660, .62, 'b7');
    const mg = S('g', { id: 'meg7' }, G); S('path', { d: `M${ox + 620} ${oy + 410} L${ox + 760} ${oy + 340} L${ox + 760} ${oy + 500} L${ox + 620} ${oy + 450} Z`, fill: '#fde047', stroke: C.ink, 'stroke-width': 5 }, mg);
    [0, 1, 2].forEach(k => S('path', { d: `M${ox + 790 + k * 28} ${oy + 380 - k * 10} Q${ox + 815 + k * 28} ${oy + 420} ${ox + 790 + k * 28} ${oy + 460 + k * 10}`, stroke: '#fff', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, mg));
    const tr = S('g', { id: 'tro7' }, G); S('path', { d: `M${ox + 1300} ${oy + 300} L${ox + 1500} ${oy + 300} Q${ox + 1500} ${oy + 520} ${ox + 1400} ${oy + 540} Q${ox + 1300} ${oy + 520} ${ox + 1300} ${oy + 300} Z`, fill: '#fbbf24', stroke: C.ink, 'stroke-width': 6 }, tr); S('rect', { x: ox + 1370, y: oy + 540, width: 60, height: 70, fill: '#d97706' }, tr); S('rect', { x: ox + 1320, y: oy + 605, width: 160, height: 50, rx: 8, fill: '#92400e' }, tr); check(tr, ox + 1400, oy + 410, 60, 'tc7');
    const ne0 = S('g', { id: 'neq' }, G); const ne = S('g', { transform: 'translate(40 0)' }, ne0); S('circle', { cx: ox + 960, cy: oy + 440, r: 105, fill: '#fff', stroke: C.ink, 'stroke-width': 8 }, ne); S('path', { d: `M${ox + 895} ${oy + 410} L${ox + 1025} ${oy + 410} M${ox + 895} ${oy + 470} L${ox + 1025} ${oy + 470}`, stroke: C.red, 'stroke-width': 18, 'stroke-linecap': 'round' }, ne); S('path', { d: `M${ox + 1000} ${oy + 360} L${ox + 920} ${oy + 520}`, stroke: C.red, 'stroke-width': 18, 'stroke-linecap': 'round' }, ne);
    ['pl7', 'pr7', 'meg7', 'tro7', 'neq'].forEach(hidId);
    BT.push(() => {
      let t = go('the key distinction'); CUT(t - .05, ox + 960, oy + 440, 1.6); CAM(t, ox + 960, oy + 540, 1, 1.2, 'power2.out'); POP('#pl7', t + .4); POP('#pr7', t + .7);
      t = W('sounding certain'); PULSE('#pl7', t, { s: 1.06 }); POP('#meg7', t + .2); mood('b7', t, 'happy'); tl.to('#meg7', { x: 6, duration: .1, yoyo: true, repeat: 7 }, t + .5);
      t = W('being correct'); PULSE('#pr7', t, { s: 1.06 }); POP('#tro7', t + .2);
      t = W('two different'); POP('#neq', t, { s: .3 });
    });
  }
  // --------- beats ---------
  return () => {
    tl.set(HID, { autoAlpha: 0 }, 0); tl.set('#world', { transformOrigin: '0% 0%' }, 0);
    intro(s, '#b0B', 430, 470, { col: '#fde047', r: 300 });
    BT.forEach(f => { ST = 0; f(); });
    blink('b0', [3, 6.5]);
    ST = 0; const starts = ['invent a scientific', 'so why does this', 'a language model generates', 'imagine someone', 'and what about', 'training that rewards', 'one solution is', 'the key distinction'].map(p => go(p));
    lifeBeats(starts.slice(1));
    const [fx, fy] = AO(7); outro(fx + 960, fy + 520, .92, '#neq');
  };
} }] };
