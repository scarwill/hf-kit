// Demo v2 (POP style, needs the thumbx.js POP kit): AI Agents video. Text (exact): "IT HAS NO HANDS"
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
  if (V === 3) {   // T3 MYSTERY: armless robot on a red-purple burst, red ring + fat arrow on the empty shoulder, small shocked person for scale
    tBg(BG, '#9333ea', '#1e0b3a', 1300, 520, 1250); tBurst(BG, 1300, 520, '#f472b6', 18, .1);
    tGlow(G, 1300, 560, 560, '#ef4444', .4);
    const b = botB(G, 1300, 1000, 1.45, 'b3'); tSticker(b.parentNode, '#ffffff', 6); after.push(() => { tl.set('#b3aL,#b3aR', { autoAlpha: 0 }, 0); mood('b3', 0, 'worried'); });
    const sx = 1300 + 112 * 1.45, sy = 1000 - 255 * 1.45; tSpark(G, sx, sy, 1.1); tRing(G, sx, sy, 105, 125, '#ef4444', 16); tArrow(G, sx + 330, sy - 330, sx + 95, sy - 95, '#ef4444', 44);
    const c = charB(G, 870, 1050, .66, 'c3', { hair: 'long', skin: SKIN[0], hairC: '#a2512c', top: '#f59e0b', topType: 'tshirt' }); tSticker(c.parentNode, '#ffffff', 6); after.push(() => mood('c3', 0, 'surprised'));
    tTitle(G, LINES, { x: 60, y: 260, maxW: 820, size: 300, hl: HL, panel: false });
  }
  return () => { after.forEach(f => f()); };
} }] };
