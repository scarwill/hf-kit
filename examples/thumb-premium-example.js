// Demo: AI Agents video (DSML). Text (exact): "IT HAS NO HANDS"
const LINES = [['IT', 'HAS'], ['NO', 'HANDS']], HL = ['NO', 'HANDS'];
const V = +new URLSearchParams(location.search).get('v') || 1;
const VIDEO = { theme: 'blue', scenes: [{ type: 'custom', build: (s) => {
  const { G, BG, defs } = makeWorld(s, 1, 1); illusDefs(defs); useTheme('lab');
  const after = [];   // tl calls (mood, hidden arms) run in the beat fn
  // room shared by all three, props change per option
  const roomBase = () => scene(BG, defs, 0, 0);
  if (V === 1) {   // T1 HERO: big robot at a desk, arms missing, laptop glowing; text left
    roomBase();
    windowPane(BG, 1180, 70, 560, 380, 'url(#gEve)'); shelf(BG, 90, 470, 300, 340); clock(BG, 1830, 150, 60); plant(G, 1850, 820, 1.3);
    lamp(BG, 1480, 40, '#22d3ee');
    tGlow(G, 1350, 520, 560, LAB.acc, .55);
    S('rect', { x: 760, y: 700, width: 560, height: 40, rx: 10, fill: '#7c2d12' }, G); S('rect', { x: 800, y: 740, width: 30, height: 120, fill: '#451a03' }, G); S('rect', { x: 1250, y: 740, width: 30, height: 120, fill: '#451a03' }, G);
    botB(G, 1450, 880, 1.2, 'b1'); after.push(() => { tl.set('#b1aL,#b1aR', { autoAlpha: 0 }, 0); mood('b1', 0, 'surprised'); });
    laptop(G, 1000, 700, .9, 'lp1');
    fgLeaves(G, -40, 1080, 1.4, 1);
    tTitle(G, LINES, { x: 80, y: 150, maxW: 820, size: 230, hl: HL });
  }
  if (V === 2) {   // T2 REACTION: shocked character close up left, robot without arms on a screen behind; text top right
    roomBase();
    shelf(BG, 1600, 420, 280, 400); plant(G, 1560, 830, 1.1);
    const scr = win(G, 900, 420, 640, 400, LAB.acc, 'w2');
    tGlow(G, 1220, 620, 420, LAB.acc, .5);
    botB(G, 1220, 800, .62, 'b2'); after.push(() => { tl.set('#b2aL,#b2aR', { autoAlpha: 0 }, 0); });
    charB(G, 470, 1460, 2.1, 'c2', { hair: 'short', skin: SKIN[0], hairC: '#7c4a1e', top: '#f59e0b', topType: 'hoodie' }); after.push(() => mood('c2', 0, 'surprised'));
    tTitle(G, LINES, { x: 900, y: 40, maxW: 900, size: 190, hl: HL, panel: false });
  }
  if (V === 3) {   // T3 MYSTERY: robot centre-right, red ring on the empty shoulder, fat arrow; text left
    roomBase();
    windowPane(BG, 1300, 90, 460, 320, 'url(#gNight)'); clock(BG, 1100, 160, 56); crate(G, 1680, 700, 180, 130, ''); plant(G, 1880, 830, 1.2);
    tGlow(G, 1300, 560, 600, LAB.bad, .45);
    botB(G, 1300, 900, 1.3, 'b3'); after.push(() => { tl.set('#b3aL,#b3aR', { autoAlpha: 0 }, 0); mood('b3', 0, 'worried'); });
    const ar = document.getElementById('b3aR').getBoundingClientRect(), ax = ar.x + ar.width * .25, ay = ar.y + ar.height * .12;
    tRing(G, ax, ay, 95, 115); tArrow(G, ax + 420, ay - 300, ax + 120, ay - 90);
    tTitle(G, LINES, { x: 70, y: 210, maxW: 800, size: 230, hl: HL });
  }
  return () => { after.forEach(f => f()); };
} }] };
