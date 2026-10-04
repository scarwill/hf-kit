// Example SHORT (1080x1920) Infographics-style DSML video with PRO LIFE (talk, gestures, close-ups, bgLife). Needs scenes.js. Build: python3 build.py all.js <audio> index.html --short
const VIDEO = { theme: 'blue', scenes: [{ type: 'custom', build: (s) => {
  const { G, BG, defs } = makeWorld(s, 4, 2); illusDefs(defs); addLife(s);
  const BT = [];
  const FULL = (t, d = 1.3, e = 'power2.out', ox, oy) => CAM(t, ox + 540, oy + 960, 1, d, e);
  // ================= AREA 0: lecture hall — the fake study =================
  { const [ox, oy] = AO(0);
    scene(BG, defs, ox, oy, ['#6366f1', '#3730a3'], ['#b45309', '#78350f']);
    cone(G, ox + 300, oy - 60, 640, 1560); cone(G, ox + 820, oy - 60, 480, 1560); clock(G, ox + 990, oy + 80, 44);
    S('rect', { x: ox + 50, y: oy + 150, width: 980, height: 680, rx: 22, fill: '#1e293b' }, G);
    const sc = S('g', { id: 'scr0' }, G); S('rect', { x: ox + 72, y: oy + 172, width: 936, height: 636, rx: 12, fill: '#f8fafc' }, sc);
    const pap = S('g', { id: 'pap' }, sc); S('rect', { x: ox + 72, y: oy + 172, width: 936, height: 84, rx: 12, fill: '#1d4ed8' }, pap); txt(pap, ox + 540, oy + 228, 'JOURNAL OF ADVANCED MEDICINE', 36, '#fff');
    const ttl = S('g', { id: 'pT' }, pap); txt(ttl, ox + 540, oy + 340, 'Daily Coffee Adds', 62, C.ink); txt(ttl, ox + 540, oy + 414, '12 Years to Your Life', 62, C.ink);
    txt(pap, ox + 540, oy + 474, 'Dr. A. Reed et al.  ·  2021', 32, '#64748b', 'middle', 600);
    S('path', { d: `M${ox + 130} ${oy + 760} L${ox + 560} ${oy + 760}`, stroke: '#94a3b8', 'stroke-width': 6 }, pap);
    [70, 110, 160, 215].forEach((h, k) => S('rect', { id: 'pb' + k, x: ox + 150 + k * 100, y: oy + 760 - h, width: 70, height: h, rx: 8, fill: ['#93c5fd', '#60a5fa', '#3b82f6', '#1d4ed8'][k] }, pap));
    txt(pap, ox + 800, oy + 640, 'n = 48,000', 46, '#334155', 'middle', 700); txt(pap, ox + 800, oy + 710, 'p < 0.001', 46, '#334155', 'middle', 700);
    stamp(G, ox + 540, oy + 520, 'DOES NOT EXIST', C.red, 'stamp0', 780, 82);
    // stage
    S('rect', { x: ox - 210, y: oy + 1460, width: 1500, height: 60, fill: '#92400e' }, G); S('rect', { x: ox - 210, y: oy + 1460, width: 1500, height: 12, fill: '#d97706' }, G);
    botB(G, ox + 300, oy + 1460, 1.0, 'b0');
    const pod = S('g', {}, G); S('path', { d: `M${ox + 130} ${oy + 1170} L${ox + 470} ${oy + 1170} L${ox + 440} ${oy + 1470} L${ox + 160} ${oy + 1470} Z`, fill: '#7c2d12' }, pod); S('rect', { x: ox + 110, y: oy + 1145, width: 380, height: 36, rx: 10, fill: '#9a3412' }, pod); S('path', { d: `M${ox + 380} ${oy + 1145} L${ox + 420} ${oy + 1070}`, stroke: '#334155', 'stroke-width': 10 }, pod); S('ellipse', { cx: ox + 425, cy: oy + 1060, rx: 16, ry: 22, fill: '#111827' }, pod);
    txt(pod, ox + 300, oy + 1340, 'AI', 80, '#fde68a');
    bubble(G, ox + 440, oy + 880, 400, 110, 'Proven fact!', 'bb0', 46, -.3); hidId('bb0');
    charB(G, ox + 840, oy + 1460, .95, 'e0', { hair: 'long', skin: SKIN[0], hairC: '#7c4a1e', top: '#ec4899', topType: 'tshirt' });
    QM(G, ox + 990, oy + 900, 110, '#fde047', 'q0'); hidId('q0');
    heads(G, ox - 80, ox + 1160, oy + 1640, 6); heads(G, ox - 160, ox + 1240, oy + 1800, 7);
    hidId('pap'); hidId('stamp0');
    BT.push(() => {
      let t = go('invent a scientific'); FULL(t, 1.4, 'power2.inOut', ox, oy); FADE('#pap', t, { d: .5 });
      t = W('believable title'); CAM(t - .2, ox + 540, oy + 520, 1.35, 1.0); POP('#pT', t); PULSE('#pT', t + .5);
      t = W('confidently explain'); FULL(t, 1.0, 'power2.inOut', ox, oy); tl.to('#b0aR', { rotation: -110, transformOrigin: '50% 0%', duration: .4 }, t); [0, 1, 2, 3].forEach(k => BARY('#pb' + k, t + .1 + k * .12, 1, .5)); POP('#bb0', t + .2); mood('b0', t, 'happy'); blink('b0', [t + 1.2]); blink('e0', [t + .6, t + 3]); talk('b0', t, W('the problem')); nod('e0', t + .8);
      t = W('the problem'); CAM(t, ox + 540, oy + 760, 1.15, 1.0); OUT('#bb0', t);
      t = W('never existed'); POP('#stamp0', t, { s: 1.8 }); SHAKE('#scr0', t + .1); tl.to('#pap', { opacity: .35, duration: .4 }, t); mood('e0', t, 'surprised'); shake('e0', t + .35); POP('#q0', t + .3); tl.to('#b0aR', { rotation: 0, duration: .3 }, t); mood('b0', t + .2, 'worried');
    });
  }
  // ================= AREA 1: office — "be accurate!" vs a missing fact checker =================
  { const [ox, oy] = AO(1);
    scene(BG, defs, ox, oy, ['#5eead4', '#0d9488'], ['#a16207', '#713f12']);
    windowPane(G, ox + 60, oy + 120, 420, 360); [[90, 90, 230], [200, 110, 290], [330, 100, 200]].forEach(([x, w, h], k) => tower(G, ox + x, oy + 470, w, h, k % 2 ? '#312e81' : '#1e1b4b'));
    shelf(G, ox + 680, oy + 120, 340, 480); clock(G, ox + 580, oy + 200, 54);
    // desk + monitor showing the AI
    S('rect', { x: ox + 400, y: oy + 1180, width: 660, height: 34, rx: 8, fill: '#78350f' }, G); S('rect', { x: ox + 430, y: oy + 1214, width: 26, height: 286, fill: '#451a03' }, G); S('rect', { x: ox + 1004, y: oy + 1214, width: 26, height: 286, fill: '#451a03' }, G);
    const dx = ox + 480, dy = oy + 808, ds = 1.2; desktop(G, dx, dy, ds, 'dk1');
    const fc = S('g', {}, G); S('rect', { x: dx + 40 * ds, y: dy + 40 * ds, width: 300 * ds, height: 170 * ds, rx: 30, fill: '#e2e8f0' }, fc); S('rect', { x: dx + 60 * ds, y: dy + 58 * ds, width: 260 * ds, height: 134 * ds, rx: 22, fill: C.ink }, fc); [145, 235].forEach(x => S('ellipse', { class: 'scr1', cx: dx + x * ds, cy: dy + 110 * ds, rx: 16, ry: 21, fill: '#67e8f9' }, fc)); S('path', { d: `M${dx + 165 * ds} ${dy + 155 * ds} Q${dx + 190 * ds} ${dy + 172 * ds} ${dx + 215 * ds} ${dy + 155 * ds}`, stroke: '#67e8f9', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, fc);
    const note = S('g', { id: 'note1' }, G); const nr = S('g', { transform: `rotate(8 ${ox + 900} ${oy + 800})` }, note); S('rect', { x: ox + 790, y: oy + 720, width: 230, height: 165, fill: '#fde047', stroke: '#ca8a04', 'stroke-width': 4 }, nr); txt(nr, ox + 905, oy + 790, 'BE', 46, C.ink); txt(nr, ox + 905, oy + 846, 'TRUTHFUL', 40, C.ink);
    charB(G, ox + 220, oy + 1500, 1.0, 'j1', { hair: 'short', skin: SKIN[0], hairC: '#5b3a29', top: '#2563eb', topType: 'hoodie', glasses: true });
    bubble(G, ox + 60, oy + 600, 560, 120, 'Be 100% accurate!', 'bb1', 46, -.25); hidId('bb1');
    plant(G, ox + 1010, oy + 1500, 1.0);
    // the missing fact checker (on the floor)
    const mc = S('g', { id: 'mach' }, G); S('rect', { x: ox + 230, y: oy + 1560, width: 620, height: 320, rx: 26, fill: 'rgba(255,255,255,.18)', stroke: '#fef3c7', 'stroke-width': 7, 'stroke-dasharray': '26 16' }, mc); txt(mc, ox + 540, oy + 1630, 'FACT CHECKER', 48, '#fef3c7'); gearG(mc, ox + 420, oy + 1770, 1.1, '#fde68a'); gearG(mc, ox + 580, oy + 1790, .8, '#fde68a'); ic(mc, 'magnify', ox + 730, oy + 1760, 100, '#fde68a');
    XM(G, ox + 540, oy + 1740, 150, 'mx1'); hidId('mach'); hidId('note1'); hidId('mx1');
    BT.push(() => {
      let t = go('so why does this'); CUT(t - .05, ox + 680, oy + 960, 1.6); FULL(t, 1.4, 'power2.out', ox, oy); breathe('j1', t, 5); blink('j1', [t + 1.5, t + 5]);
      t = W('explicitly tell'); POP('#bb1', t); mood('j1', t, 'happy'); point('j1', t, 'aR', -75, 2.2); talk('j1', t, W('because an instruction')); eyes('.scr1', [t - 1.2, t + 3, t + 6.5]);
      t = W('because an instruction'); OUT('#bb1', t - .2); CAM(t, ox + 700, oy + 900, 1.3, .9); tl.fromTo('#note1', { autoAlpha: 0, y: -300, rotation: -30, transformOrigin: '50% 50%' }, { autoAlpha: 1, y: 0, rotation: 0, duration: .5, ease: 'back.out(1.6)' }, t + .2); B(t);
      t = W('a mechanism that'); CAM(t, ox + 540, oy + 1300, 1.1, 1.0); FADE('#mach', t); t = W('isnt the same'); CAM(t - .1, ox + 520, oy + 1020, 1.05, .6); mood('j1', t, 'worried'); shrug('j1', t + .2, .9); t = W('verifies truth'); POP('#mx1', t, { s: 2 }); SHAKE('#note1', t + .2); shake('j1', t + .3);
    });
  }
  // ================= AREA 2: inside the model — a token factory =================
  { const [ox, oy] = AO(2);
    scene(BG, defs, ox, oy, ['#fde68a', '#f59e0b'], ['#78716c', '#44403c'], 1560);
    shelf(G, ox + 40, oy + 200, 340, 560, 'sh2'); S('rect', { x: ox + 50, y: oy + 125, width: 320, height: 58, rx: 29, fill: '#78350f' }, G); txt(G, ox + 210, oy + 166, 'TRAINING DATA', 34, '#fff');
    // machine
    const m = S('g', { id: 'mach2' }, G);
    S('path', { d: `M${ox + 330} ${oy + 760} L${ox + 750} ${oy + 760} L${ox + 690} ${oy + 850} L${ox + 390} ${oy + 850} Z`, fill: '#4f46e5', stroke: C.ink, 'stroke-width': 6 }, m);
    S('rect', { x: ox + 200, y: oy + 850, width: 680, height: 520, rx: 44, fill: '#6366f1', stroke: C.ink, 'stroke-width': 6 }, m); txt(m, ox + 540, oy + 930, 'LANGUAGE MODEL', 52, '#fff');
    S('rect', { x: ox + 330, y: oy + 965, width: 420, height: 170, rx: 32, fill: C.ink }, m); [480, 600].forEach(x => S('ellipse', { class: 'mE2', cx: ox + x, cy: oy + 1040, rx: 24, ry: 30, fill: '#67e8f9' }, m)); S('path', { d: `M${ox + 505} ${oy + 1095} Q${ox + 540} ${oy + 1115} ${ox + 575} ${oy + 1095}`, stroke: '#67e8f9', 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round' }, m);
    gearG(m, ox + 340, oy + 1250, 1.3, '#fde047', 'g2a'); gearG(m, ox + 540, oy + 1280, 1.0, '#fbbf24', 'g2b'); gearG(m, ox + 740, oy + 1250, 1.2, '#fde047', 'g2c');
    S('rect', { x: ox + 500, y: oy + 1370, width: 80, height: 50, fill: '#4338ca', stroke: C.ink, 'stroke-width': 5 }, m);
    // conveyor (tokens come out of the machine)
    S('rect', { x: ox + 30, y: oy + 1490, width: 1020, height: 34, rx: 17, fill: '#1f2937' }, G); for (let k = 0; k < 10; k++) S('circle', { cx: ox + 70 + k * 105, cy: oy + 1540, r: 18, fill: '#6b7280', stroke: '#1f2937', 'stroke-width': 4 }, G);
    S('rect', { x: ox + 60, y: oy + 1540, width: 16, height: 60, fill: '#374151' }, G); S('rect', { x: ox + 1000, y: oy + 1540, width: 16, height: 60, fill: '#374151' }, G);
    const toks = [['The', '#fca5a5'], ['study', '#fdba74'], ['found', '#86efac'], ['that', '#93c5fd'], ['coffee', '#d8b4fe']]; let tx = ox + 150;
    toks.forEach(([w, c], k) => { const ww = w.length * 21 + 44; token(G, tx + ww / 2, oy + 1452, w, c, 'tk' + k); tx += ww + 18; hidId('tk' + k); });
    // crates on the floor
    crate(G, ox + 70, oy + 1680, 260, 200, 'TEXT'); crate(G, ox + 380, oy + 1720, 220, 160); crate(G, ox + 660, oy + 1660, 340, 220, 'TEXT');
    // next-word probabilities
    const pp = S('g', { id: 'prob' }, G); S('rect', { x: ox + 420, y: oy + 330, width: 620, height: 380, rx: 26, fill: '#fff', stroke: C.ink, 'stroke-width': 5, filter: 'url(#fSh)' }, pp); txt(pp, ox + 730, oy + 395, 'Next word?', 46, C.ink);
    [['found', .62, '#22c55e'], ['showed', .21, '#3b82f6'], ['proved', .09, '#a855f7']].forEach(([w, v, c], k) => { const y = oy + 430 + k * 85; txt(pp, ox + 450, y + 44, w, 38, C.ink, 'start', 700); S('rect', { x: ox + 620, y: y + 14, width: 300, height: 42, rx: 12, fill: '#e5e7eb' }, pp); S('rect', { id: 'pr' + k, x: ox + 620, y: y + 14, width: 300 * v, height: 42, rx: 12, fill: c }, pp); txt(pp, ox + 620 + 300 * v + 14, y + 47, Math.round(v * 100) + '%', 32, C.ink, 'start', 700); });
    hidId('prob');
    ['#ef4444', '#3b82f6', '#22c55e', '#eab308'].forEach((c, k) => { book(G, ox + 210, oy + 330 + k * 110, c, 'fb' + k); hidId('fb' + k); });
    [0, 1, 2].forEach(k => { check(G, ox + 405, oy + 300 + k * 170, 34, 'ck2' + k); hidId('ck2' + k); });
    // the reliable source — never connected
    const src = S('g', { id: 'src2' }, G); S('path', { d: `M${ox + 720} ${oy + 190} L${ox + 880} ${oy + 120} L${ox + 1040} ${oy + 190} Z`, fill: '#e2e8f0', stroke: C.ink, 'stroke-width': 5 }, src); S('rect', { x: ox + 740, y: oy + 190, width: 280, height: 140, fill: '#f8fafc', stroke: C.ink, 'stroke-width': 5 }, src); [0, 1, 2, 3].forEach(k => S('rect', { x: ox + 768 + k * 66, y: oy + 210, width: 22, height: 100, fill: '#cbd5e1' }, src)); txt(src, ox + 880, oy + 180, 'SOURCE', 32, C.ink);
    CRV(G, `M${ox + 700} ${oy + 760} Q${ox + 900} ${oy + 560} ${ox + 880} ${oy + 340}`, '#0f172a', 'srcL', 8); hidId('srcL'); XM(G, ox + 840, oy + 555, 60, 'mx2'); hidId('mx2'); hidId('src2');
    BT.push(() => {
      let t = go('a language model generates'); CUT(t - .05, ox + 540, oy + 1050, 1.7); FULL(t, 1.4, 'power2.out', ox, oy); eyes('.mE2', [t + 1.3, t + 4, t + 7.5, t + 10.5, t + 13.5]);
      ['g2a', 'g2c'].forEach(id => tl.to('#' + id, { rotation: 720, transformOrigin: '50% 50%', duration: 16, ease: 'none' }, t)); tl.to('#g2b', { rotation: -720, transformOrigin: '50% 50%', duration: 16, ease: 'none' }, t);
      t = W('predicting'); CAM(t, ox + 540, oy + 1300, 1.25, 1.0); toks.forEach((_, k) => { tl.fromTo('#tk' + k, { autoAlpha: 0, x: 390 - k * 150, y: -60, scale: .3 }, { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: .8, ease: 'power2.out' }, t + .2 + k * .35); }); B(t);
      t = W('pieces that make'); FULL(t, 1.0, 'power2.inOut', ox, oy); POP('#prob', t); [0, 1, 2].forEach(k => BAR('#pr' + k, t + .3 + k * .15, 1, .6)); PULSE('#tk2', t + 1.4, { s: 1.15 });
      t = W('patterns learned during'); [0, 1, 2, 3].forEach(k => { tl.set('#fb' + k, { autoAlpha: 1 }, t + k * .25); tl.fromTo('#fb' + k, { x: 0, y: 0, rotation: 0, transformOrigin: '50% 50%' }, { x: 330, y: 470 - k * 110, rotation: 360, duration: .9, ease: 'power2.in' }, t + k * .25); tl.set('#fb' + k, { autoAlpha: 0 }, t + k * .25 + .9); }); B(t);
      t = W('useful factual knowledge'); [0, 1, 2].forEach(k => POP('#ck2' + k, t + k * .15));
      t = W('but generating'); OUT('#prob', t - .2); CAM(t, ox + 640, oy + 560, 1.25, 1.0); FADE('#src2', t);
      t = W('checking it against'); DR('#srcL', t, { d: .8 }); t = W('reliable source'); POP('#mx2', t, { s: 2 }); tl.to('#src2', { opacity: .45, duration: .5 }, t + .2);
    });
  }
  // ================= AREA 3: the confident expert who fills gaps =================
  { const [ox, oy] = AO(3);
    scene(BG, defs, ox, oy, ['#c4b5fd', '#7c3aed'], ['#4c1d95', '#2e1065'], 1520);
    // puzzle board (top)
    S('rect', { x: ox + 150, y: oy + 130, width: 780, height: 500, rx: 16, fill: '#fef3c7', stroke: '#78350f', 'stroke-width': 10 }, G);
    const pc = ['#60a5fa', '#34d399', '#f472b6', '#fbbf24', '#a78bfa']; for (let r = 0; r < 2; r++) for (let q = 0; q < 3; q++) { const x = ox + 190 + q * 240, y = oy + 170 + r * 220; if (r === 1 && q === 2) { S('rect', { x, y, width: 220, height: 200, rx: 12, fill: 'none', stroke: '#78350f', 'stroke-width': 5, 'stroke-dasharray': '14 10' }, G); continue; } S('rect', { x, y, width: 220, height: 200, rx: 12, fill: pc[r * 3 + q] }, G); }
    S('rect', { id: 'pz3', x: ox + 670, y: oy + 390, width: 220, height: 200, rx: 12, fill: '#fb7185', stroke: '#be123c', 'stroke-width': 4 }, G); hidId('pz3');
    // document stacks + expert (middle)
    [[620, 300], [705, 420], [790, 360], [875, 500], [960, 380]].forEach(([x, h], k) => { const g = S('g', { id: 'ps' + k }, G); for (let y = 0; y < h; y += 26) S('rect', { x: ox + x - 40, y: oy + 1520 - y - 24, width: 80, height: 22, rx: 3, fill: y % 52 ? '#f8fafc' : '#e2e8f0', stroke: '#94a3b8', 'stroke-width': 2 }, g); });
    pill(G, ox + 790, oy + 940, '1,000,000+ docs', '#fde047', C.ink, 'pc3', 38); hidId('pc3');
    charB(G, ox + 300, oy + 1520, 1.0, 'd3', { hair: 'bald', skin: SKIN[0], hairC: '#9ca3af', top: '#1e3a8a', topType: 'blazer', glasses: true, beard: true });
    bubble(G, ox + 70, oy + 700, 580, 120, 'Studies clearly show…', 'bb3', 44, -.25); hidId('bb3');
    // two identical framed answers on the floor: one correct, one fake
    const frame = (x, id) => { const g = S('g', { id }, G); S('rect', { x, y: oy + 1570, width: 300, height: 300, rx: 12, fill: '#ca8a04' }, g); S('rect', { x: x + 18, y: oy + 1588, width: 264, height: 264, fill: '#fff' }, g); txt(g, x + 150, oy + 1642, 'ANSWER', 38, C.ink); [0, 1, 2].forEach(k => S('rect', { x: x + 60 + k * 64, y: oy + 1830 - (50 + k * 45), width: 44, height: 50 + k * 45, rx: 6, fill: '#3b82f6' }, g)); return g; };
    frame(ox + 150, 'fr0'); frame(ox + 630, 'fr1'); hidId('fr0'); hidId('fr1');
    check(G, ox + 450, oy + 1570, 50, 'ok3'); hidId('ok3'); XM(G, ox + 930, oy + 1570, 50, 'xx3'); hidId('xx3');
    BT.push(() => {
      let t = go('imagine someone'); CUT(t - .05, ox + 300, oy + 1100, 1.6); FULL(t, 1.4, 'power2.out', ox, oy); walkIn('d3', t, -520, 1.5); breathe('d3', t + 1.7, 6); blink('d3', [t + 2, t + 6, t + 10]);
      t = W('millions of documents'); [0, 1, 2, 3, 4].forEach(k => BARY('#ps' + k, t + k * .1, 1, .6)); POP('#pc3', t + .4);
      t = W('how an expert'); CAM(t, ox + 480, oy + 1100, 1.2, 1.0); OUT('#pc3', t); POP('#bb3', t + .2); mood('d3', t, 'happy'); talk('d3', t, W('sometimes')); nod('d3', t - .5); tl.to('#d3aR', { rotation: -70, transformOrigin: '50% 0%', duration: .3, yoyo: true, repeat: 3 }, t + .3);
      t = W('fills gaps'); CAM(t, ox + 540, oy + 600, 1.2, 1.0); OUT('#bb3', t); tl.fromTo('#pz3', { autoAlpha: 0, x: -380, y: 800, rotation: 40, transformOrigin: '50% 50%' }, { autoAlpha: 1, x: 0, y: 0, rotation: 0, duration: .9, ease: 'back.out(1.2)' }, W('plausible details') - .3); B(W('plausible details'));
      t = W('thats why'); CAM(t, ox + 540, oy + 1330, 1.1, 1.1); POP('#fr0', t + .2); POP('#fr1', t + .5);
      t = W('sound just as'); CAM(t, ox + 320, oy + 1020, 2.0, .45, 'power3.out'); mood('d3', t, 'happy'); nod('d3', t + .3);
      t = W('as a correct one'); CAM(t, ox + 540, oy + 1330, 1.1, .5); POP('#ok3', t + .3); POP('#xx3', t + .65);
    });
  }
  // ================= AREA 4: classroom — rules reduce mistakes, but no guarantee =================
  { const [ox, oy] = AO(4);
    scene(BG, defs, ox, oy, ['#fde68a', '#fbbf24'], ['#b45309', '#78350f']);
    S('rect', { x: ox + 50, y: oy + 120, width: 980, height: 600, rx: 16, fill: '#92400e' }, G); S('rect', { x: ox + 72, y: oy + 142, width: 936, height: 556, rx: 8, fill: '#14532d' }, G);
    [['NEVER MAKE', 300], ['ANYTHING UP', 410]].forEach(([w, y], k) => { txt(G, ox + 540, oy + y, w, 92, '#f8fafc', 'middle', 800, 'rw' + k); hidId('rw' + k); });
    const mt = S('g', { id: 'meter' }, G); txt(mt, ox + 540, oy + 540, 'MISTAKES', 46, '#bbf7d0'); S('rect', { x: ox + 190, y: oy + 570, width: 700, height: 52, rx: 26, fill: '#052e16' }, mt); S('rect', { id: 'mbar', x: ox + 190, y: oy + 570, width: 700, height: 52, rx: 26, fill: C.red }, mt); hidId('meter');
    clock(G, ox + 980, oy + 70, 44); plant(G, ox + 1020, oy + 1500, .9);
    charB(G, ox + 200, oy + 1500, 1.0, 'e4', { hair: 'long', skin: SKIN[0], hairC: '#7c4a1e', top: '#ec4899', topType: 'blazer' });
    S('path', { id: 'ptr4', d: `M${ox + 300} ${oy + 1080} L${ox + 380} ${oy + 740}`, stroke: '#78350f', 'stroke-width': 12, 'stroke-linecap': 'round' }, G);
    botB(G, ox + 760, oy + 1500, .85, 'b4');
    S('rect', { x: ox + 560, y: oy + 1230, width: 400, height: 44, rx: 8, fill: '#a16207' }, G); S('rect', { x: ox + 580, y: oy + 1274, width: 360, height: 226, fill: '#854d0e' }, G);
    bubble(G, ox + 470, oy + 820, 440, 110, "I'm not sure.", 'bb4', 46, .2); hidId('bb4');
    // claims table (floor, front)
    S('rect', { x: ox + 90, y: oy + 1770, width: 900, height: 34, rx: 8, fill: '#a16207' }, G); S('rect', { x: ox + 120, y: oy + 1804, width: 22, height: 140, fill: '#713f12' }, G); S('rect', { x: ox + 940, y: oy + 1804, width: 22, height: 140, fill: '#713f12' }, G);
    for (let k = 0; k < 5; k++) { const x = ox + 120 + k * 172; const g = S('g', { id: 'cl' + k }, G); S('rect', { x, y: oy + 1590, width: 150, height: 180, rx: 10, fill: '#fff', stroke: '#334155', 'stroke-width': 4 }, g); txt(g, x + 75, oy + 1640, 'CLAIM', 30, '#334155'); [0, 1, 2].forEach(r => S('rect', { x: x + 20, y: oy + 1665 + r * 26, width: 110, height: 10, rx: 5, fill: '#cbd5e1' }, g)); hidId('cl' + k);
      if (k < 2) { check(G, x + 130, oy + 1590, 34, 'cv' + k); hidId('cv' + k); } else { QM(G, x + 130, oy + 1580, 80, C.red, 'cq' + k); hidId('cq' + k); } }
    BT.push(() => {
      let t = go('and what about'); CUT(t - .05, ox + 540, oy + 420, 1.6); FULL(t, 1.3, 'power2.out', ox, oy); blink('e4', [t + 1, t + 5]); blink('b4', [t + 2, t + 7]);
      t = W('never make anything'); talk('e4', W('rules like'), W('instructions and')); IN('#rw0', t, { y: 20 }); IN('#rw1', t + .4, { y: 20 }); tl.to('#ptr4', { rotation: -8, transformOrigin: '0% 100%', duration: .25, yoyo: true, repeat: 3 }, t);
      t = W('reduce mistakes'); FADE('#meter', t - .3); tl.fromTo('#mbar', { scaleX: 1, transformOrigin: '0% 50%' }, { scaleX: .35, duration: 1.2, ease: 'power2.out' }, t + .2); B(t);
      t = W('admit uncertainty'); CAM(t, ox + 700, oy + 1020, 1.8, .6, 'power3.out'); POP('#bb4', t); mood('b4', t, 'worried'); talk('b4', t, W('but they dont') - .2, 'mW');
      t = W('but they dont'); OUT('#bb4', t); shake('e4', t + .2); CAM(t, ox + 540, oy + 1420, 1.15, 1.0); [0, 1, 2, 3, 4].forEach(k => POP('#cl' + k, t + k * .12));
      t = W('gets verified'); [0, 1].forEach(k => POP('#cv' + k, t - .4 + k * .2)); [2, 3, 4].forEach(k => POP('#cq' + k, t + .2 + (k - 2) * .15));
    });
  }
  // ================= AREA 5: game show — answering is rewarded, "I don't know" is not =================
  { const [ox, oy] = AO(5);
    scene(BG, defs, ox, oy, ['#f472b6', '#9d174d'], ['#312e81', '#1e1b4b']);
    [[-210, 1], [1290, -1]].forEach(([x, d]) => S('path', { d: `M${ox + x} ${oy - 240} L${ox + x + d * 330} ${oy - 240} Q${ox + x + d * 230} ${oy + 700} ${ox + x + d * 290} ${oy + 1500} L${ox + x} ${oy + 1500} Z`, fill: '#b91c1c' }, G));
    cone(G, ox + 360, oy - 60, 600, 1560); cone(G, ox + 820, oy - 60, 440, 1560);
    const sb = S('g', {}, G); S('rect', { x: ox + 70, y: oy + 150, width: 940, height: 400, rx: 26, fill: '#0f172a', stroke: '#fbbf24', 'stroke-width': 12 }, sb); txt(sb, ox + 540, oy + 230, 'SCORE', 48, '#fbbf24');
    txt(sb, ox + 130, oy + 345, 'Answer', 62, '#a3e635', 'start'); txt(sb, ox + 950, oy + 345, '+1', 70, '#a3e635', 'end'); txt(sb, ox + 130, oy + 470, '"I don\'t know"', 62, '#94a3b8', 'start'); txt(sb, ox + 950, oy + 470, '0', 70, '#94a3b8', 'end');
    for (let k = 0; k < 13; k++) S('circle', { class: 'bulb', cx: ox + 90 + k * 75, cy: oy + 150, r: 10, fill: k % 2 ? '#fde047' : '#fb923c' }, sb);
    botB(G, ox + 360, oy + 1480, .9, 'b5');
    const pd = S('g', {}, G); S('path', { d: `M${ox + 170} ${oy + 1180} L${ox + 550} ${oy + 1180} L${ox + 525} ${oy + 1490} L${ox + 195} ${oy + 1490} Z`, fill: '#7c3aed' }, pd); S('rect', { x: ox + 150, y: oy + 1155, width: 420, height: 36, rx: 10, fill: '#a78bfa' }, pd); txt(pd, ox + 360, oy + 1370, 'AI', 84, '#fde68a');
    const bz = S('g', { id: 'bz5' }, G); S('ellipse', { cx: ox + 480, cy: oy + 1152, rx: 54, ry: 18, fill: '#7f1d1d' }, bz); S('ellipse', { cx: ox + 480, cy: oy + 1140, rx: 48, ry: 18, fill: C.red }, bz);
    spark(G, ox + 480, oy + 1100, 1.5, '#fde047', 'sp5'); hidId('sp5');
    bubble(G, ox + 80, oy + 680, 400, 110, 'Uh… 1987?', 'bb5', 48, -.1); hidId('bb5'); pill(G, ox + 600, oy + 760, '+1', '#a3e635', C.ink, 'pt5', 64); hidId('pt5');
    charB(G, ox + 830, oy + 1480, .95, 'j5', { hair: 'short', skin: SKIN[0], hairC: '#5b3a29', top: '#f59e0b', topType: 'blazer' });
    S('rect', { x: ox - 210, y: oy + 1480, width: 1500, height: 30, fill: '#fbbf24' }, G);
    heads(G, ox - 80, ox + 1160, oy + 1660, 6); heads(G, ox - 160, ox + 1240, oy + 1810, 7);
    BT.push(() => {
      let t = go('training that rewards'); CUT(t - .05, ox + 540, oy + 350, 1.6); FULL(t, 1.2, 'power2.out', ox, oy); mood('j5', t, 'happy'); blink('j5', [t + 1.5]); walkIn('j5', t, 560, 1.3); talk('j5', t + .2, W('also encourage')); point('j5', t + 1.5, 'aL', 130, 1.8);
      t = W('encourage guessing'); CAM(t - .6, ox + 500, oy + 1020, 1.2, .8); tl.to('#b5aR', { rotation: -60, transformOrigin: '50% 0%', duration: .2 }, t - .6); tl.fromTo('#bz5', { y: 0 }, { y: 8, duration: .1, yoyo: true, repeat: 1 }, t - .4); POP('#sp5', t - .35); tl.to('#sp5', { autoAlpha: 0, scale: 1.6, duration: .5 }, t + .1); POP('#bb5', t - .2); POP('#pt5', t + .3); mood('b5', t - .3, 'happy'); talk('b5', t - .2, t + .5); jump('j5', t + .35); CAM(t + .7, ox + 370, oy + 1070, 1.9, .4, 'power3.out');
    });
  }
  // ================= AREA 6: library — retrieval (RAG), with its limits =================
  { const [ox, oy] = AO(6);
    scene(BG, defs, ox, oy, ['#fed7aa', '#fb923c'], ['#92400e', '#451a03']);
    lamp(G, ox + 540, oy + 60); shelf(G, ox + 30, oy + 660, 1020, 360);
    const ws = S('g', { id: 'web6' }, G); S('rect', { x: ox + 60, y: oy + 150, width: 960, height: 440, rx: 20, fill: '#fff', stroke: C.ink, 'stroke-width': 5, filter: 'url(#fSh)' }, ws); S('rect', { x: ox + 60, y: oy + 150, width: 960, height: 60, rx: 20, fill: '#334155' }, ws); [0, 1, 2].forEach(k => S('circle', { cx: ox + 95 + k * 30, cy: oy + 180, r: 9, fill: ['#f87171', '#fbbf24', '#4ade80'][k] }, ws));
    S('rect', { x: ox + 95, y: oy + 235, width: 890, height: 64, rx: 32, fill: '#f1f5f9', stroke: '#cbd5e1', 'stroke-width': 3 }, ws); txt(ws, ox + 130, oy + 280, 'coffee and lifespan study', 38, '#334155', 'start', 600);
    ['Coffee & health: a 2023 review', 'What large studies really found', 'Caffeine: how much is safe?'].forEach((l, k) => txt(ws, ox + 110, oy + 380 + k * 70, l, 40, '#1d4ed8', 'start', 600));
    hidId('web6');
    const rag = S('g', { id: 'rag6' }, G); [['R', 'Retrieval', '#22c55e'], ['A', 'Augmented', '#3b82f6'], ['G', 'Generation', '#a855f7']].forEach(([L, w, c], k) => { const g = S('g', { id: 'rg' + k }, rag); const x = ox + 210 + k * 330; S('circle', { cx: x, cy: oy + 330, r: 130, fill: c, stroke: C.ink, 'stroke-width': 7 }, g); txt(g, x, oy + 380, L, 150, '#fff'); txt(g, x, oy + 520, w, 42, C.ink); }); hidId('rag6');
    botB(G, ox + 190, oy + 1500, .85, 'b6');
    S('rect', { x: ox + 360, y: oy + 1240, width: 700, height: 40, rx: 10, fill: '#78350f' }, G); S('rect', { x: ox + 390, y: oy + 1280, width: 30, height: 220, fill: '#451a03' }, G); S('rect', { x: ox + 1000, y: oy + 1280, width: 30, height: 220, fill: '#451a03' }, G);
    const dl = [['Study A', '2021'], ['Review', 'n=12k'], ['Report', '2019']]; dl.forEach(([a, b], k) => { docSheet(G, ox + 390 + k * 215, oy + 1020, 170, 'd6' + k, [a, b], ['#22c55e', '#3b82f6', '#f97316'][k]); hidId('d6' + k); });
    S('path', { id: 'crk6', class: 'draw', d: `M${ox + 680} ${oy + 1045} L${ox + 715} ${oy + 1105} L${ox + 685} ${oy + 1145} L${ox + 730} ${oy + 1215}`, stroke: C.red, 'stroke-width': 9, fill: 'none', 'stroke-linecap': 'round' }, G); hidId('crk6');
    XM(G, ox + 775, oy + 1020, 44, 'x6'); hidId('x6'); QM(G, ox + 905, oy + 930, 110, '#fde047', 'q6'); hidId('q6');
    S('ellipse', { cx: ox + 540, cy: oy + 1720, rx: 470, ry: 120, fill: '#b91c1c', opacity: .55 }, G); bookPile(G, ox + 120, oy + 1880, 5); bookPile(G, ox + 820, oy + 1880, 4);
    BT.push(() => {
      let t = go('one solution is'); CUT(t - .05, ox + 540, oy + 600, 1.6); FULL(t, 1.3, 'power2.out', ox, oy); blink('b6', [t + 1, t + 6, t + 11]);
      t = W('relevant documents'); point('b6', t + .1, 'aR', -60, 2.6); [0, 1, 2].forEach(k => { tl.fromTo('#d6' + k, { autoAlpha: 0, x: (k - 1) * 200, y: -700, rotation: k ? 20 : -20, transformOrigin: '50% 50%' }, { autoAlpha: 1, x: 0, y: 0, rotation: 0, duration: .8, ease: 'power3.out' }, t + k * .25); }); B(t);
      t = W('search results'); POP('#web6', t); nod('b6', t + .3); t = W('before it answers'); mood('b6', t, 'happy'); talk('b6', t, W('this is often'));
      t = W('this is often'); OUT('#web6', t - .1); [0, 1, 2].forEach(k => POP('#rg' + k, W('retrievalaugmented') + k * .35)); tl.set('#rag6', { autoAlpha: 1 }, t); PULSE('#rg2', W('or rag'), { s: 1.12 });
      t = W('sources can be wrong'); OUT('#rag6', t - .4); CAM(t, ox + 560, oy + 1150, 1.3, .9); DR('#crk6', t, { d: .4 }); POP('#x6', t + .3); SHAKE('#d61', t + .3);
      t = W('misinterpret them'); tl.to('#d62', { rotation: 180, transformOrigin: '50% 50%', duration: .6 }, t - .4); POP('#q6', t); mood('b6', t, 'worried'); shrug('b6', t + .1, 1); CAM(t + .35, ox + 220, oy + 1090, 1.9, .45, 'power3.out');
    });
  }
  // ================= AREA 7: sounding certain ≠ being correct =================
  { const [ox, oy] = AO(7);
    scene(BG, defs, ox, oy, ['#38bdf8', '#0369a1'], ['#0c4a6e', '#082f49']);
    cone(G, ox + 280, oy - 60, 560, 1560); cone(G, ox + 800, oy - 60, 560, 1560);
    const ped = (x, col, l1, l2, id) => { const g = S('g', { id }, G); S('rect', { x: x - 220, y: oy + 1270, width: 440, height: 230, rx: 18, fill: col, stroke: C.ink, 'stroke-width': 6 }, g); txt(g, x, oy + 1370, l1, 54, '#fff'); txt(g, x, oy + 1440, l2, 54, '#fff'); return g; };
    ped(ox + 280, '#f97316', 'SOUNDING', 'CERTAIN', 'pl7'); ped(ox + 800, '#16a34a', 'BEING', 'CORRECT', 'pr7');
    botB(G, ox + 260, oy + 1270, .75, 'b7');
    const mg = S('g', { id: 'meg7' }, G); S('path', { d: `M${ox + 340} ${oy + 960} L${ox + 450} ${oy + 900} L${ox + 450} ${oy + 1040} L${ox + 340} ${oy + 1000} Z`, fill: '#fde047', stroke: C.ink, 'stroke-width': 5 }, mg);
    [0, 1, 2].forEach(k => S('path', { d: `M${ox + 475 + k * 24} ${oy + 930 - k * 10} Q${ox + 497 + k * 24} ${oy + 970} ${ox + 475 + k * 24} ${oy + 1010 + k * 10}`, stroke: '#fff', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, mg));
    const tr = S('g', { id: 'tro7' }, G); S('path', { d: `M${ox + 690} ${oy + 880} L${ox + 910} ${oy + 880} Q${ox + 910} ${oy + 1110} ${ox + 800} ${oy + 1130} Q${ox + 690} ${oy + 1110} ${ox + 690} ${oy + 880} Z`, fill: '#fbbf24', stroke: C.ink, 'stroke-width': 6 }, tr); S('rect', { x: ox + 770, y: oy + 1130, width: 60, height: 80, fill: '#d97706' }, tr); S('rect', { x: ox + 710, y: oy + 1205, width: 180, height: 65, rx: 8, fill: '#92400e' }, tr); check(tr, ox + 800, oy + 995, 64, 'tc7');
    const ne = S('g', { id: 'neq' }, G); S('circle', { cx: ox + 540, cy: oy + 520, r: 170, fill: '#fff', stroke: C.ink, 'stroke-width': 10 }, ne); S('path', { d: `M${ox + 450} ${oy + 480} L${ox + 630} ${oy + 480} M${ox + 450} ${oy + 560} L${ox + 630} ${oy + 560}`, stroke: C.red, 'stroke-width': 24, 'stroke-linecap': 'round' }, ne); S('path', { d: `M${ox + 600} ${oy + 410} L${ox + 480} ${oy + 630}`, stroke: C.red, 'stroke-width': 24, 'stroke-linecap': 'round' }, ne);
    S('rect', { x: ox - 210, y: oy + 1500, width: 1500, height: 24, fill: '#7dd3fc', opacity: .5 }, G);
    heads(G, ox - 80, ox + 1160, oy + 1680, 6); heads(G, ox - 160, ox + 1240, oy + 1830, 7);
    ['pl7', 'pr7', 'meg7', 'tro7', 'neq'].forEach(hidId);
    BT.push(() => {
      let t = go('the key distinction'); CUT(t - .05, ox + 540, oy + 900, 1.6); FULL(t, 1.2, 'power2.out', ox, oy); POP('#pl7', t + .4); POP('#pr7', t + .7);
      t = W('sounding certain'); CAM(t, ox + 330, oy + 1080, 1.35, .9); PULSE('#pl7', t, { s: 1.06 }); POP('#meg7', t + .2); mood('b7', t, 'happy'); talk('b7', t, W('being correct')); tl.to('#meg7', { x: 6, duration: .1, yoyo: true, repeat: 7 }, t + .5);
      t = W('being correct'); CAM(t, ox + 750, oy + 1080, 1.35, .9); mood('b7', t + .2, 'worried'); PULSE('#pr7', t, { s: 1.06 }); POP('#tro7', t + .2);
      t = W('two different'); FULL(t, 1.0, 'power2.inOut', ox, oy); POP('#neq', t, { s: .3 });
    });
  }
  // --------- beats ---------
  return () => {
    tl.set(HID, { autoAlpha: 0 }, 0); tl.set('#world', { transformOrigin: '0% 0%' }, 0);
    intro(s, '#b0B', 300, 1100, { col: '#fde047', r: 320 });
    BT.forEach(f => { ST = 0; f(); });
    blink('b0', [3, 6.5]); bgLife();
    ST = 0; const starts = ['invent a scientific', 'so why does this', 'a language model generates', 'imagine someone', 'and what about', 'training that rewards', 'one solution is', 'the key distinction'].map(p => go(p));
    lifeBeats(starts.slice(1));
    const [fx, fy] = AO(7); outro(fx + 540, fy + 900, .92, '#neq');
  };
} }] };
