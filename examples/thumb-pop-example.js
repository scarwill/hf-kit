// Demo v2 (POP style, needs thumbx.js POP kit + kurz files for V=3): AI Agents video. Text (exact): "IT HAS NO HANDS"
const LINES = [['IT', 'HAS'], ['NO', 'HANDS']], HL = ['NO', 'HANDS'];
const V = +new URLSearchParams(location.search).get('v') || 1;
const VIDEO = { theme: 'blue', scenes: [{ type: 'custom', build: (s) => {
  const { G, BG, defs } = makeWorld(s, 1, 1); illusDefs(defs); useTheme('lab');
  const after = [];
  if (V === 1) {   // T1 HERO HUGE: armless robot fills the right half, sticker outline, sparks at the shoulders, cyan burst
    tBg(BG, '#0ea5b7', '#071330', 1350, 480, 1250); tBurst(BG, 1350, 480, '#ffffff', 20, .09);
    const b = botB(G, 1420, 1290, 1.95, 'b1'); tSticker(b.parentNode, '#ffffff', 7);
    after.push(() => { tl.set('#b1aL,#b1aR', { autoAlpha: 0 }, 0); mood('b1', 0, 'surprised'); });
    [-1, 1].forEach(sd => tSpark(G, 1420 + sd * 205, 1290 - 300 * 1.95, 1.2));
    tTitle(G, LINES, { x: 60, y: 230, maxW: 880, size: 300, hl: HL, panel: false });
  }
  if (V === 2) {   // T2 BIG FACE: shocked face fills the left, armless robot on the right, warm vs cool split
    tBg(BG, '#fb923c', '#7c2d12', 420, 560, 1100); S('path', { d: 'M1000 -10 L1930 -10 L1930 1090 L820 1090 Z', fill: '#0b1d3a' }, BG); tBurst(BG, 1430, 640, '#22d3ee', 16, .1);
    tGlow(G, 1430, 640, 480, '#22d3ee', .55);
    const b = botB(G, 1430, 1000, 1.05, 'b2'); tSticker(b.parentNode, '#ffffff', 6); after.push(() => { tl.set('#b2aL,#b2aR', { autoAlpha: 0 }, 0); mood('b2', 0, 'worried'); });
    [-1, 1].forEach(sd => tRing(G, 1430 + sd * 112, 1000 - 250 * 1.05, 70, 90, '#ef4444', 14));
    const c = charB(G, 430, 2350, 3.6, 'c2', { hair: 'short', skin: SKIN[0], hairC: '#7c4a1e', top: '#2563eb', topType: 'hoodie' }); tSticker(c.parentNode, '#ffffff', 6); after.push(() => mood('c2', 0, 'surprised'));
    tTitle(G, LINES, { x: 1000, y: 30, maxW: 860, size: 200, hl: HL, panel: false });
  }
  if (V === 3) {   // T3 KURZ LOOK: glowing Kurz world, huge armless kBot, tiny kBean looking up (scale), fat red arrow
    const W = kWorld(BG, defs, 0, 0, 'space', { stars: 80 });
    kGlow(G, 1300, 470, 620, '#7cf6ff', .45);
    const kb = kBot(G, 1300, 1010, 1.55, 'kb3'); after.push(() => tl.set('#kb3aL,#kb3aR', { autoAlpha: 0 }, 0));
    [-1, 1].forEach(sd => tSpark(G, 1300 + sd * 120 * 1.55, 1010 - 300 * 1.55, 1));
    kBean(G, 1730, 1075, .85, 'p3', { sex: 'f', hairStyle: 'pony', hair: '#a2512c', top: '#ffb703' }); after.push(() => { tl.set('#p3mO', { opacity: 1 }, 0); tl.set('#p3mS', { opacity: 0 }, 0); tl.set('#p3E', { x: -6, y: -4 }, 0); });
    tArrow(G, 1020, 160, 1080, 450, '#ef4444', 46);
    tTitle(G, LINES, { x: 60, y: 260, maxW: 820, size: 300, hl: HL, panel: false });
  }
  return () => { after.forEach(f => f()); };
} }] };
