// NEWS demo (`news` skill): a 2-story episode in the news look. LONG 1920x1080. No mascot, no header / footer / progress bar.
// FORMAT DEMO: the two stories are real but from 2024 (Python 3.13.0, tag v3.13.0 dated 7 Oct 2024; NumPy 2.0.0, tag v2.0.0 dated 15 Jun 2024).
// Facts checked against the release notes in the repos (Doc/whatsnew/3.13.rst at v3.13.0, doc/source/release/2.0.0-notes.rst at v2.0.0):
//   free-threaded mode is experimental, built with --disable-gil, executable python3.13t; basic JIT (PEP 744) disabled by default; greatly improved interactive
//   interpreter; NumPy 2.0.0 "is the first major release since 2006", 11 months, 212 contributors, 1078 pull requests, new StringDType, ABI break.
// Shows: nwSetup / nwBegin / nwFinish, nwStory per story, nwHead + MARK, custom drawing (CPU cores + lock), typed terminal, nwTime, nlCount, nwSpec, nwRecap.
// Build (in the video folder with words.json + meta.json): python3 ~/hf-kit/news/nbuild.py video.js talk.m4a
// Script (11 lines):
//   Python three thirteen is out, and for the first time it can run without the GIL. / The docs call it free threaded, and it shipped on October seventh. /
//   For decades, one global lock meant only one thread could run Python code at a time. / The new build removes that lock, so threads can finally use every core. /
//   It is still experimental. You build it with the disable gil option, and you get a separate executable called python three thirteen t. /
//   There is also an experimental JIT compiler and a greatly improved interactive interpreter. / And since three nine, a new Python ships every October. /
//   Story two. NumPy two point oh is the first major NumPy release since two thousand six. /
//   It took eleven months of work, two hundred and twelve contributors, and one thousand and seventy eight pull requests. /
//   You get a new string dtype, but the ABI breaks, so some packages need a rebuild. / That is today: Python without the lock, and NumPy two. See you tomorrow.
const VIDEO = { theme: 'blue', scenes: [{ type: 'custom', build: (s) => {
  nwSetup(s, { channel: 'Tech News Today', date: '07 Oct 2024' });

  // S1 story 1 opener: dial 1/2 + the real doc title, two feature tags
  const s1 = nlScene(s, 's1', 'Python 3.13 drops the <b>GIL</b>');
  nwStory(s1, 'st1', 150, 230, 1, 2, 'LANGUAGES', 'docs.python.org', '7 Oct 2024');
  nwHead(s1, 'hd1', 800, 280, 960, 'docs.python.org', 'Python 3.13', "What's New In <b>Python 3.13</b>");
  nlTag(s1, 'g1a', 1060, 560, 'no GIL', NL.data, 34);
  nlTag(s1, 'g1b', 1460, 560, 'free-threaded', NL.data, 34);
  const v1 = nlSvg(s1);
  const w1 = nlWire(v1, 'w1', 'M1060 610 L1060 680 L1460 680 L1460 610', NL.data); arw(w1, 1460, 612, NL.data, 'u');
  nlLab(s1, 'l1', 1260, 710, '7 Oct 2024', NL.out, true);

  // S2 custom drawing: 4 CPU cores. Left: one lock hops lane to lane, one thread at a time. Right: all four threads run together.
  const s2 = nlScene(s, 's2', 'One lock, <b>one thread</b>');
  const lanes = (id, x, c, head) => { const w = nlWin(s2, id, x, 200, 820, 640, c, head); const [, v] = nlBox(w, id + 'b', 0, 50, 820, 580);
    for (let k = 0; k < 4; k++) { S('rect', { x: 200, y: 50 + k * 130, width: 580, height: 74, rx: 14, fill: '#0d1424', stroke: '#26324a', 'stroke-width': 2 }, v);
      D(w, 'core ' + (k + 1), `position:absolute;left:26px;top:${50 + 50 + k * 130 + 20}px;font:600 26px ${NLMONO};color:${NL.dim}`);
      S('circle', { id: id + 'd' + k, cx: 240, cy: 87 + k * 130, r: 22, fill: c }, v); }
    return v; };
  const vl = lanes('gl2', 120, NL.err, 'with the GIL'); lanes('ft2', 980, NL.data, 'free-threaded');
  const lk = S('g', { id: 'lk2' }, vl);
  S('rect', { x: 146, y: 74, width: 36, height: 30, rx: 6, fill: NL.out }, lk); S('path', { d: 'M154 74 L154 64 A10 10 0 0 1 174 64 L174 74', stroke: NL.out, 'stroke-width': 5, fill: 'none' }, lk);

  // S3 typed terminal -> the separate executable, "experimental" tag
  const s3 = nlScene(s, 's3', 'Still <b>experimental</b>');
  const tm = nlWin(s3, 'tm3', 120, 230, 1060, 380, NL.model, 'terminal');
  nlType(tm, 'ty3a', 40, 110, '$ ./configure --disable-gil', 42, NL.ink);
  nlType(tm, 'ty3b', 40, 220, '$ make && ./python3.13t', 42, NL.data);
  const v3 = nlSvg(s3);
  const w3 = nlWire(v3, 'w3', 'M1180 420 L1330 420', NL.data); arw(w3, 1330, 420, NL.data);
  nlChip(s3, 'c3', 1340, 386, 'python3.13t', NL.data, 't', 34);
  nlTag(s3, 'x3', 650, 680, 'experimental', NL.err, 36);
  nlLab(s3, 'l3', 1530, 490, 'separate binary', NL.dim, true);

  // S4 JIT + REPL chips, then the yearly release timeline with a travelling marker
  const s4 = nlScene(s, 's4', 'A Python every <b>October</b>');
  nlChip(s4, 'c4a', 330, 230, 'JIT compiler', NL.model, 'J', 36);
  nlChip(s4, 'c4b', 1050, 230, 'new REPL', NL.data, '>', 36);
  nlLab(s4, 'l4a', 520, 330, 'off by default', NL.dim, true);
  nlLab(s4, 'l4b', 1200, 330, 'color + multiline', NL.dim, true);
  nwTime(s4, 'tl4', 160, 520, 1600, [['2020', '3.9'], ['2021', '3.10'], ['2022', '3.11'], ['2023', '3.12'], ['2024', '3.13']]);

  // S5 story 2 opener: dial 2/2 + the exact sentence from the release notes
  const s5 = nlScene(s, 's5', 'NumPy <b>2.0</b>');
  nwStory(s5, 'st5', 150, 230, 2, 2, 'DATA SCIENCE', 'numpy release notes', 'Jun 2024');
  nwHead(s5, 'hd5', 800, 330, 960, 'numpy 2.0.0 release notes', 'Jun 2024', 'NumPy 2.0.0 is the <b>first major release</b> since 2006.');

  // S6 three counters + a grid of pull requests
  const s6 = nlScene(s, 's6', 'Who built <b>NumPy 2</b>');
  nlCount(s6, 'n6a', 250, 230, ['0', '4', '8', '11'], NL.out, 130);
  nlCount(s6, 'n6b', 760, 230, ['0', '90', '160', '212'], NL.data, 130);
  nlCount(s6, 'n6c', 1290, 230, ['0', '400', '800', '1078'], NL.model, 130);
  nlLab(s6, 'l6a', 335, 420, 'months', NL.out, true);
  nlLab(s6, 'l6b', 881, 420, 'contributors', NL.data, true);
  nlLab(s6, 'l6c', 1451, 420, 'pull requests', NL.model, true);
  const pr = nlWin(s6, 'pr6', 240, 500, 1440, 440, NL.model, 'pull requests');
  nlDocs(pr, 'dc6', 66, 70, 13, 3, 84, 104, 18, NL.model);

  // S7 1.26 vs 2.0 table, ABI row gets a red X + rebuild tag
  const s7 = nlScene(s, 's7', 'What <b>changes</b>');
  nwSpec(s7, 'sp7', 260, 230, 1400, ['', 'NumPy 1.26', 'NumPy 2.0'], [['strings', 'object', 'StringDType', 2], ['ABI', '1.x', '2.x']], 'numpy 1.26 vs 2.0');
  nlMark(s7, 'x7', 1700, 441, NL.err, false);
  nlTag(s7, 'g7', 960, 620, 'rebuild needed', NL.err, 38);
  const v7 = nlSvg(s7);
  const w7 = nlWire(v7, 'w7', 'M1729 499 L1729 646 L1160 646', NL.err, '10 10'); arw(w7, 1160, 646, NL.err, 'l');

  // S8 recap (last scene)
  const s8 = nlScene(s, 's8', 'That was <b>today</b>');
  nwRecap(s8, 'rc8', 310, 220, 1300, ['Python 3.13: free-threaded build', 'NumPy 2.0: first major since 2006']);
  nwCo(s8, 'co8a', 720, 500, 'Python', NL.model, 190);
  nwCo(s8, 'co8b', 1200, 500, 'NumPy', NL.data, 190);
  nlLab(s8, 'l8', 960, 860, 'see you tomorrow', NL.dim, true);

  return () => {
    nwBegin(['#s1', '#s2', '#s3', '#s4', '#s5', '#s6', '#s7', '#s8']);
    let t;
    // S1
    t = HEAD; CUE(STORY('st1', t + .1) - .7, 'hit'); IN('#hd1', t + .5, { x: 40, y: 0 });
    t = W('first time'); MARK('hd1', t); CUE(t, 'tick');
    t = W('without the gil'); POP('#g1a', t); CUE(t, 'pop');
    t = W('free threaded'); POP('#g1b', t); CUE(t, 'pop'); nlDraw('w1', t + .3);
    t = W('october seventh'); FADE('#l1', t); CUE(t, 'chime');
    // S2
    t = NEXT('#s2', 'for decades'); IN('#gl2', t + .1, { y: 30 }); IN('#ft2', t + .3, { y: 30, to: .3 });
    t = W('one global lock'); POP('#lk2', t); CUE(t, 'pop');
    t = W('only one thread');
    for (let k = 0; k < 4; k++) { const tk = t + k * 1.1; TO('#lk2', tk, { y: k * 130, duration: .25 }); TO('#gl2d' + k, tk + .2, { attr: { cx: 740 }, duration: .8, ease: 'none' }); CUE(tk, 'tick'); }
    t = W('removes that lock'); TO('#ft2', t - .3, { autoAlpha: 1, duration: .3 }); CUE(t, 'hit');
    t = W('use every core'); TO(['#ft2d0', '#ft2d1', '#ft2d2', '#ft2d3'], t - .6, { attr: { cx: 740 }, duration: .9, ease: 'none' }); CUE(t, 'chime');
    // S3
    t = NEXT('#s3', 'it is still experimental'); IN('#tm3', t + .1, { y: 30 }); POP('#x3', t + .4); CUE(t + .4, 'err');
    t = W('disable gil option'); { const e = TYPE('ty3a', t - .8, .04); CUE(e - 27 * .04, 'type', 27, .04); }
    t = W('separate executable'); { const e = TYPE('ty3b', t - .4, .04); CUE(e - 23 * .04, 'type', 23, .04); nlDraw('w3', e); POP('#c3', e + .4); CUE(e + .4, 'pop'); FADE('#l3', e + .7); }
    // S4
    t = NEXT('#s4', 'there is also'); IN('#tl4', t + .1, { y: 30, to: .3 });
    t = W('jit compiler'); POP('#c4a', t); CUE(t, 'pop'); FADE('#l4a', t + .5);
    t = W('interactive interpreter'); POP('#c4b', t); CUE(t, 'pop'); FADE('#l4b', t + .5);
    t = W('since three nine'); TO('#tl4', t - .3, { autoAlpha: 1, duration: .3 }); { const e = TIMELINE('tl4', t, .55); CUE(e, 'chime'); }
    // S5
    t = NEXT('#s5', 'story two'); CUE(STORY('st5', t + .1) - .7, 'hit'); IN('#hd5', t + .6, { x: 40, y: 0 });
    t = W('first major numpy'); MARK('hd5', t); CUE(t, 'hit');
    // S6
    t = NEXT('#s6', 'it took eleven'); IN('#pr6', t + .1, { y: 30 }); FADE('.dc6d', t + .3, { d: .2, st: .02, to: .35 });
    t = W('eleven months'); COUNT('n6a', t - .3, .2); FADE('#l6a', t + .5); CUE(t + .3, 'tick');
    t = W('twelve contributors'); COUNT('n6b', t - .6, .2); FADE('#l6b', t + .3); CUE(t, 'tick');
    t = W('seventy eight pull'); COUNT('n6c', t - .6, .2); FADE('#l6c', t + .3); CUE(t, 'hit'); TO('.dc6d', t + .2, { autoAlpha: 1, duration: .2, stagger: .015 });
    // S7
    t = NEXT('#s7', 'you get a new'); IN('#sp7', t + .1, { y: 30 }); SPEC('sp7', t + .4, 1.4); CUE(t + .4, 'tick');
    t = W('abi breaks'); CUE(t, 'tick'); POP('#x7', t + .3); CUE(t + .3, 'err'); SHAKE('#x7', t + .6);
    t = W('need a rebuild'); nlDraw('w7', t - .4, .5); POP('#g7', t); CUE(t, 'err');
    // S8
    t = NEXT('#s8', 'that is today'); IN('#rc8', t + .1, { y: 30 }); RECAP('rc8', t + .5, W('numpy two') - t - .5); CUE(t + .8, 'chime'); POP('#co8a', t + .8); CUE(W('numpy two') + .3, 'chime'); POP('#co8b', W('numpy two') + .3);
    t = W('see you tomorrow'); FADE('#l8', t);
    nwFinish();
  };
} }] };
