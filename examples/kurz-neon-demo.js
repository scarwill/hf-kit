// Kurz NEON demo (no audio, fixed times): the newer Kurzgesagt space look + Kurz infographic parts (kurz/neon.js).
// Build: cat premium illus life helpers icons scenes extras kurz/{kurz,organs,tech,people,techviz,neon,mascots}.js this > all.js ; meta.json {"END": 21}, words.json []
// Hosts Axo + Glim react in every area; kBean people in 3/4 and side view watch.
// Areas: 0 glowing title over nebula + galaxy, 1 Earth -> Mars timeline with pills, counter and rocket, 2 icon cards on a grid floor
// (gauge x calendar = Mars), 3 Milky Way with a "You Are Here" pin and a speech bubble.
const VIDEO = { theme: 'purple', scenes: [{ type: 'custom', build: (s) => {
  const { G, BG, defs } = makeWorld(s, 4, 1); nFilters(defs);

  // ========== AREA 0: title ==========
  const [a0x, a0y] = AO(0);
  nSpace(BG, defs, a0x, a0y, { seed: 2, neb: [[250, 250, 480, NPAL.vio, .45], [1650, 800, 560, NPAL.mag, .28], [1500, 180, 340, NPAL.blue, .35]] });
  nGalaxy(G, a0x + 1560, a0y + 840, 330, 'gal0', .45);
  nPlanet(G, a0x + 260, a0y + 860, 90, '#ff9b5e', 'pl0', { bands: true, ring: '#ffd9a8', seed: 4 });
  nTitle(G, a0x + 960, a0y + 300, [{ t: 'SPACE IS', s: 110, c: NPAL.cyan }, { t: 'REALLY BIG', s: 190, c: NPAL.blue }], 'ttl0');
  nAxo(G, a0x + 560, a0y + 1045, .5, 'ax0', { view: '3q', mood: 'smile' }); nGlim(G, a0x + 800, a0y + 1045, .45, 'gl0', { view: '3q', flip: -1, mood: 'smile' });
  const sub = S('text', { id: 'sub0', x: a0x + 960, y: a0y + 650, 'text-anchor': 'middle', 'font-family': 'Poppins', 'font-weight': 600, 'font-size': 38, fill: '#c9c2ff' }, G); sub.textContent = '(like, really)'; hidId('sub0');

  // ========== AREA 1: Earth -> Mars ==========
  const [a1x, a1y] = AO(1);
  nSpace(BG, defs, a1x, a1y, { seed: 5, neb: [[200, 900, 520, NPAL.vio, .3], [1700, 200, 420, NPAL.mag, .25]] });
  nPlanet(G, a1x + 380, a1y + 560, 125, '#2f7bff', 'earth1', { land: '#2fbf71', cloud: true, seed: 3 });
  nPlanet(G, a1x + 1620, a1y + 560, 82, '#e2552d', 'mars1', { land: '#a8321c', seed: 8, glow: '#ff7a4d' });
  nPill(G, a1x + 380, a1y + 360, 'Earth', NPAL.teal, 'pE1', 34); hidId('pE1');
  nPill(G, a1x + 1620, a1y + 400, 'Mars', NPAL.mag, 'pM1', 34, { sub: '~225 million km away' }); hidId('pM1');
  nTimeline(G, a1x + 540, a1x + 1500, a1y + 560, 5, NPAL.mag, 'tl1'); hidId('tl1');
  nPill(G, a1x + 1020, a1y + 470, '7–9 Months', NPAL.yel, 'pT1', 34, { ink: '#2a1600' }); hidId('pT1');
  nCounter(G, a1x + 1020, a1y + 690, nNum(0, 225000000, 14).map(v => v + ' km'), 58, '#ffffff', 'cnt1'); hidId('cnt1');
  nRocket(G, a1x + 540, a1y + 560, .42, 'rk1'); hidId('rk1');
  kBean(G, a1x + 330, a1y + 1040, .55, 'pp1', { view: 'side', sex: 'f', hairStyle: 'pony', hair: '#a2512c', top: '#ff8a3d' });
  nGlim(G, a1x + 1440, a1y + 1050, .45, 'gl1', { view: '3q', flip: -1, mood: 'meh' });
  nBubble(G, a1x + 1250, a1y + 740, 360, 100, 'Are we there yet?', a1x + 1430, a1y + 880, 'bb1', 32); hidId('bb1');

  // ========== AREA 2: icon cards on a synthwave grid ==========
  const [a2x, a2y] = AO(2);
  nSpace(BG, defs, a2x, a2y, { seed: 9, grid: true, top: '#120a4a', mid: '#2a1380', bot: '#3a1aa0', neb: [[960, 260, 600, NPAL.mag, .25]] });
  const cy2 = a2y + 400, sz = 280;
  nCard(G, a2x + 470, cy2, sz, (g, cx, cy) => { nGauge(g, cx, cy + 50, 105, 'gg2'); }, '40,000 km/h', NPAL.yel, 'c2a'); hidId('c2a');
  nCard(G, a2x + 960, cy2, sz, (g, cx, cy) => { S('rect', { x: cx - 80, y: cy - 75, width: 160, height: 150, rx: 18, fill: '#ffffff' }, g); S('rect', { x: cx - 80, y: cy - 75, width: 160, height: 40, rx: 18, fill: NPAL.mag }, g);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) S('rect', { x: cx - 64 + c * 34, y: cy - 22 + r * 30, width: 22, height: 18, rx: 4, fill: (r * 4 + c) < 7 ? NPAL.vio : '#d9d4f5' }, g); }, '7 Months', NPAL.mag, 'c2b'); hidId('c2b');
  nCard(G, a2x + 1450, cy2, sz, (g, cx, cy) => nPlanet(g, cx, cy, 78, '#e2552d', null, { land: '#a8321c', seed: 8 }), 'Mars!', NPAL.teal, 'c2c'); hidId('c2c');
  nAxo(G, a2x + 960, a2y + 1040, .55, 'ax2', { view: 'front', mood: 'smile' });
  kBean(G, a2x + 1720, a2y + 1050, .6, 'pp2', { view: '3q', flip: -1, sex: 'm', hair: '#3a2418', top: '#2a9d8f', skin: '#c68b62' });
  [['×', 715], ['=', 1205]].forEach(([c, x], k) => { const t = S('text', { id: 'op2' + k, x: a2x + x, y: cy2 + 30, 'text-anchor': 'middle', 'font-family': 'Poppins', 'font-weight': 800, 'font-size': 90, fill: '#ffffff' }, G); t.textContent = c; hidId('op2' + k); });

  // ========== AREA 3: the Milky Way ==========
  const [a3x, a3y] = AO(3);
  nSpace(BG, defs, a3x, a3y, { seed: 13, neb: [[300, 300, 500, NPAL.blue, .3], [1600, 700, 500, NPAL.vio, .35]] });
  nGalaxy(G, a3x + 1000, a3y + 560, 620, 'gal3', .5);
  nPill(G, a3x + 1000, a3y + 120, 'The Milky Way', NPAL.mag, 'pG3', 40); hidId('pG3');
  nPin(G, a3x + 640, a3y + 690, 1.3, '#2f7bff', 'pin3', (g, cx, cy, r) => nPlanet(g, cx, cy, r * .8, '#2f7bff', null, { land: '#2fbf71', seed: 3 })); hidId('pin3');
  nPill(G, a3x + 640, a3y + 790, 'You Are Here', NPAL.cyan, 'pY3', 30, { ink: '#04263a' }); hidId('pY3');
  nAxo(G, a3x + 300, a3y + 1000, .55, 'ax3', { view: 'side', mood: 'smile' }); nGlim(G, a3x + 1600, a3y + 1000, .5, 'gl3', { view: '3q', flip: -1, mood: 'neutral' });
  nBubble(G, a3x + 160, a3y + 560, 440, 120, "...and Mars is\nbasically next door.", a3x + 340, a3y + 790, 'bb3', 30); hidId('bb3');

  return () => {
    tl.set(HID, { autoAlpha: 0 }, 0); tl.set('#fadeIn', { autoAlpha: 0 }, 0); nLife(); nGaugeSet('gg2', 0, .05);
    const C = i => [AO(i)[0] + 960, AO(i)[1] + 540];
    // 0..5 title
    nDRIFT(0, 5, ...C(0), 1.0, 1.08, 40);
    tl.fromTo('#ttl0', { autoAlpha: 0, scale: .6, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: .8, ease: 'back.out(1.6)' }, .4); B(.4);
    nPOP('#sub0', 2.2); nHOP('ax0', 1.4); nMOOD('gl0', 2.3, 'shock'); nMOOD('ax0', 3.2, 'happy');
    // 5..11 Earth -> Mars
    WHIP(5.2, ...C(1), 1.05, .6); nDRIFT(5.25, 11, ...C(1), 1.05, 1.1, 25);
    nPOP('#pE1', 5.6); nPOP('#pM1', 6.1);
    nDRAW('tl1', 6.6, 1.6); nPOP('#rk1', 6.6, { s: .3 }); nFLY('rk1', 6.7, 880, 3.6); tl.set('#pp1mO', { opacity: 1 }, 6.8); tl.set('#pp1mS', { opacity: 0 }, 6.8);
    nCOUNT('cnt1', 6.7, 3.4); nPOP('#pT1', 8.4);
    nPOP('#bb1', 9.2); nTALKM('gl1', 9.2, 10.3);
    // 11..16.5 cards
    CUT(11, ...C(2), 1.25); CAM(11.02, ...C(2), 1.0, 1.0, 'power3.out'); nDRIFT(12.05, 16.5, ...C(2), 1.0, 1.05, 20);
    nPOP('#c2a', 11.3); nNEEDLE('gg2', 11.8, .05, .82, 1.2);
    nPOP('#op20', 12.6); nPOP('#c2b', 12.9); nPOP('#op21', 13.8); nPOP('#c2c', 14.1); nMOOD('ax2', 14.2, 'shock'); nMOOD('ax2', 15.2, 'happy'); nHOP('ax2', 15.2);
    // 16.5..21 galaxy
    WHIP(16.6, ...C(3), 1.1, .6); nDRIFT(16.65, END, ...C(3), 1.1, 1.0, 30);
    nPOP('#pG3', 17.0); nPOP('#pin3', 17.6, { s: .2 }); nPOP('#pY3', 18.0); nPOP('#bb3', 18.9); nTALKM('ax3', 18.9, 20.2); nMOOD('gl3', 19.6, 'happy'); nWAVE('gl3', 19.8);
    outro(...C(3), .95);
  };
} }] };
