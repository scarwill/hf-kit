// LONG demo (1920x1080) for the news look (look.js): Tesla Roadster reveal, 15 Oct 2026. Build: python3 ~/nkit/news/build.py video.js tesla.m4a --long
// Voice: the 7-line Tesla script (TTS), words.json from align.py. Photos: Tesla handout images (assets/fly.jpg, ramp.jpg, thrust.jpg, speed.jpg, desert.jpg).
// Facts: CNN / TechCrunch / NBC / Euronews, 15-16 Oct 2026 (0-60 in 0.81 s and the 2 G fan figure are Tesla's own claims).
const VIDEO = { theme: 'blue', scenes: [{ type: 'custom', build: (s) => {
  sSetup(s);

  // S1 hook: headline left, flying-car photo right
  const s1 = nlScene(s, 's1', '');
  sPill(s1, 'p1', 60, 80, 'TESLA &middot; OCT 15, 2026');
  sHead(s1, 'h1', 60, 170, 820, "Tesla's Roadster can <b>fly.</b>", 120);
  sHead(s1, 'h1b', 60, 580, 820, 'Well, sort of.', 120);
  sPhoto(s1, 'ph1', 940, 70, 920, 940, 'assets/fly.jpg', 'Photo: Tesla', '62% 0%');

  // S2 the stunt: ramp photo + facts
  const s2 = nlScene(s, 's2', '');
  sPhoto(s2, 'ph2', 60, 70, 1100, 940, 'assets/ramp.jpg', 'Photo: Tesla');
  sChip(s2, 'c2a', 1220, 120, '<b>SpaceX</b> test site, Texas');
  sChip(s2, 'c2b', 1220, 260, 'fans pull up to <b>2 G</b>');
  sStamp(s2, 'st2', 1530, 520, 'UPSIDE DOWN', SB.red, -7, 80);
  sChip(s2, 'c2c', 1220, 760, '<b>launch</b>, flip, land');

  // S3 how it lifts: thruster photo + big 10
  const s3 = nlScene(s, 's3', '');
  sPhoto(s3, 'ph3', 60, 70, 900, 940, 'assets/thrust.jpg', 'Photo: Tesla', '50% 60%');
  sTag(s3, 'tg3', 1040, 120, 'HOW IT LIFTS');
  sCount(s3, 'n3', 1040, 190, ['0', '4', '7', '10'], SB.blue, 300);
  sSub(s3, 'l3', 1040, 560, 780, 'cold-gas thrusters');
  sChip(s3, 'c3', 1040, 680, '<b>600 L</b> of compressed air');

  // S4 the jump
  const s4 = nlScene(s, 's4', '');
  sPhoto(s4, 'ph4', 60, 70, 1100, 940, 'assets/fly.jpg', 'Photo: Tesla', '70% 10%');
  sHead(s4, 'h4', 1220, 160, 640, 'Over <b>5 Teslas</b>', 110);
  sStamp(s4, 'st4', 1530, 560, 'NO DRIVER', SB.red, -6, 96);

  // S5 0-60: speed photo + counter card with a real-time bar
  const s5 = nlScene(s, 's5', '');
  sPhoto(s5, 'ph5', 60, 70, 1800, 940, 'assets/speed.jpg', 'Photo: Tesla');
  const c5 = sCard(s5, 'cd5', 120, 520, 760, 420);
  sTag(c5, 'tg5', 50, 40, '0-60 MPH');
  sCount(c5, 'n5', 46, 90, ['0.00', '0.27', '0.54', '0.81'], SB.blue, 180);
  D(c5, '', `position:absolute;left:50px;top:320px;width:660px;height:18px;border-radius:9px;background:${SB.line}`, 'bt5');
  D(c5, '', `position:absolute;left:50px;top:320px;width:660px;height:18px;border-radius:9px;background:${SB.blue};transform-origin:0 50%`, 'bf5');
  sSub(c5, 'l5', 50, 350, 660, "Tesla's own figure");

  // S6 the catch: table + quote + photo (last scene)
  const s6 = nlScene(s, 's6', '');
  sTag(s6, 'tg6', 70, 70, 'THE CATCH');
  sTable(s6, 'tb6', 60, 130, 900, [['Production', '2028', SB.blue], ['Price', 'not announced'], ['Reserve', '$50k / $250k'], ['Rocket version', 'not for public roads', SB.red]]);
  sPhoto(s6, 'ph6', 1020, 70, 840, 470, 'assets/desert.jpg', 'Photo: Tesla', '50% 62%');
  sQuote(s6, 'q6', 1020, 600, 840, '&ldquo;We are literally talking about <mk>hopping</mk>.&rdquo;', 'Roger Connor, Smithsonian, via CNN');

  return () => {
    sBegin(['#s1', '#s2', '#s3', '#s4', '#s5', '#s6']);
    let t;
    // S1
    POP('#p1', HEAD + .05, { d: .3 }); IN('#h1', HEAD + .1, { y: 30, d: .4 }); FADE('#ph1', HEAD, { d: .3 }); KB('ph1', HEAD, 6.8, { s: 1.15 }, { s: 1.28, x: -20 }); CUE(HEAD + .1, 'pop');
    t = W('flies'); PULSE('#h1', t, { s: 1.03 }); CUE(t, 'hit');
    t = W('well sort of'); IN('#h1b', t, { y: 30, d: .35 }); CUE(t, 'pop');
    // S2
    t = NEXT('#s2', 'at a spacex'); FADE('#ph2', t, { d: .3 }); KB('ph2', t, 7.8, { s: 1.04, y: -10 }, { s: 1.2, y: 50 }); POP('#c2a', t + .3); CUE(t + .3, 'pop');
    t = W('curved ramp'); POP('#c2b', t); CUE(t, 'tick');
    t = W('upside down'); STAMP('st2', t); CUE(t + .2, 'hit');
    t = W('launched off'); POP('#c2c', t); CUE(t, 'whoosh');
    // S3
    t = NEXT('#s3', 'fans underneath'); FADE('#ph3', t, { d: .3 }); KB('ph3', t, 5, { s: 1.02 }, { s: 1.14, y: 20 }); FADE('#tg3', t + .2); tl.set('#n3', { autoAlpha: 1 }, t + .2); tl.set('#n3n0', { autoAlpha: 1 }, t + .2);
    t = W('ten cold gas'); COUNT('n3', t - .3, .2); FADE('#l3', t + .4); CUE(t + .3, 'hit');
    t = W('push it into'); POP('#c3', t); CUE(t, 'pop');
    // S4
    t = NEXT('#s4', 'it even jumped'); FADE('#ph4', t, { d: .3 }); KB('ph4', t, 4, { s: 1.4 }, { s: 1.6, x: -30 }); IN('#h4', t + .2, { y: 30, d: .4 });
    t = W('five teslas'); PULSE('#h4', t, { s: 1.04 }); CUE(t, 'tick');
    t = W('nobody inside'); STAMP('st4', t); CUE(t + .2, 'err');
    // S5
    t = NEXT('#s5', 'tesla says zero'); FADE('#ph5', t, { d: .3 }); KB('ph5', t, 3.8, { s: 1.04 }, { s: 1.18, x: -60 }); IN('#cd5', t + .3, { y: 30, d: .4 }); tl.set('#n5', { autoAlpha: 1 }, t + .3); tl.set('#n5n0', { autoAlpha: 1 }, t + .3); CUE(t + .3, 'pop');
    t = W('zero point eight'); COUNT('n5', t, .27); tl.fromTo('#bf5', { scaleX: 0 }, { scaleX: 1, duration: .81, ease: 'none' }, t); FADE('#l5', t + .9); CUE(t + .81, 'hit');
    // S6
    t = NEXT('#s6', 'the catch'); FADE('#tg6', t); IN('#tb6', t + .1, { y: 30, d: .4 }); FADE('#ph6', t + .2, { d: .3 }); KB('ph6', t + .2, 7.5, { s: 1.04 }, { s: 1.16, x: 30 }); CUE(t + .2, 'hit');
    t = W('twenty twenty eight'); TABLE('tb6', t, .35); [0, 1, 2, 3].forEach(k => CUE(t + k * .35, 'tick'));
    t = W('one expert'); IN('#q6', t - .1, { y: 30, d: .4 }); CUE(t, 'pop');
    t = W('hopping'); SMARK('q6', t); CUE(t, 'chime');
    t = W('see you tomorrow'); PULSE('#q6', t, { s: 1.02 });
    sFinish();
  };
} }] };
