// LIGHT SHORT demo (net-shorts): "Why a 27B AI model needs 55 GB". Build: python3 ~/skit/light/lbuild.py video.js talk.m4a --short
// Shows the Short rules in code: HOOK at frame 0 (the big number is on screen before the voice), one main visual per scene,
// parts inside the safe column (x 40-690, y 300-990 on the 810x1440 canvas), nlCaptions() as the last line of BUILD.
// Script (test lines): This free AI needs fifty five gigabytes of memory. / Every number inside it takes two bytes. /
//   And it holds almost twenty eight billion numbers. / Squeeze each number to four bits, and it fits in fourteen.
// Numbers: Qwen/Qwen3.8-27B has 27,781,427,952 BF16 parameters (Hugging Face API, 28 Oct 2026); x 2 bytes = 55.6 GB; 4 bit = 13.9 GB.
NL_END_TXT = '> follow for more';
const VIDEO = { theme: 'blue', scenes: [{ type: 'custom', build: (s) => {
  nlSetup(s);
  // S1 hook: the number fills the screen at frame 0, a memory stick under it
  const s1 = nlScene(s, 's1', 'A free AI needs <b>55 GB</b>');
  nlCount(s1, 'c1', 150, 330, ['55 GB'], NL.out, 150);
  const [, v1] = nlBox(s1, 'ram1', 80, 560, 580, 180);
  S('rect', { x: 0, y: 20, width: 580, height: 120, rx: 14, fill: '#0a0f1a', stroke: NL.model, 'stroke-width': 4 }, v1);
  for (let k = 0; k < 8; k++) S('rect', { x: 30 + k * 68, y: 40, width: 48, height: 80, rx: 6, fill: NL.model, opacity: .25, class: 'chip1' }, v1);
  for (let k = 0; k < 14; k++) S('rect', { x: 20 + k * 40, y: 140, width: 22, height: 26, fill: NL.out }, v1);
  nlChip(s1, 'ch1', 90, 800, '27.8B numbers', NL.data);
  cOrb(s1, 'o1');
  // S2 the fix: bars shrink 16 -> 8 -> 4 bit
  const s2 = nlScene(s, 's2', 'Shrink the <b>bits</b>');
  nlBars(s2, 'b2', 60, 360, 620, [['16 bit', 1], ['8 bit', .5], ['4 bit', .25]], 'memory_needed', NL.data);
  nlCount(s2, 'c2', 150, 760, ['14 GB'], NL.data, 120);
  // captions: last line of build (never in the beats)
  nlCaptions();
  return () => {
    nlBegin(['#s1', '#s2']);
    HOOK(['#c1', '#ram1']);
    let t = W('fifty five'); PULSE('#c1', t, { s: 1.06 }); CUE(t, 'hit');
    t = W('every number'); POP('.chip1', t, { st: .08 }); IN('#ch1', t + .3); CUE(t, 'pop');
    t = W('twenty eight'); PULSE('#ram1', t, { s: 1.03 }); CUE(t, 'blip');
    t = NEXT('#s2', 'squeeze each number'); IN('#b2', t, { y: 20, d: .35 }); t = W('four bits'); BARS('b2', t - .6, .2);
    POP('#c2', W('fourteen')); CUE(W('fourteen'), 'chime');
    nlFinish();
  };
} }] };
