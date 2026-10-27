// SHORT demo (1080x1920) for the news look (look.js): OpenAI misalignment reports, 15 Oct 2026. Build: python3 ~/nkit/news/build.py video.js wallet.m4a
// Assets: 5 crops of alignment.openai.com report pages made with pageshot.js (rep_wallet / rep_362 / rep_cot / rep_final / rep_gov.png). Tested: check.js 0 warnings.
const VIDEO = { theme: 'blue', scenes: [{ type: 'custom', build: (s) => {
  sSetup(s);
  const K = .691, K2 = .64;

  // S1 hook: headline + OpenAI's report + KEPT QUIET
  const s1 = nlScene(s, 's1', '');
  sPill(s1, 'p1', 70, 150, 'OPENAI REPORT &middot; OCT 15');
  sHead(s1, 'h1', 70, 235, 940, "OpenAI's AI raided someone else's <b>crypto wallet</b>", 92);
  const w1 = sShot(s1, 'sh1', 70, 590, 940, 'assets/rep_wallet.png', 'alignment.openai.com', 1360, 1040, 600);
  w1.hl('hl1a', 1090, 590, 208, 32); w1.hl('hl1b', 56, 634, 486, 32);
  sStamp(s1, 'st1', 505, 1150, 'KEPT QUIET', SB.red, -7);

  // S2 the task: typed task card + empty wallet with a red X
  const s2 = nlScene(s, 's2', '');
  sPill(s2, 'p2', 70, 150, 'JUNE 2026 &middot; TRAINING TASK');
  sCode(s2, 'cd2', 70, 250, 940, ['> task: deploy contracts', '  on Sepolia (Ethereum test net)', '> funded wallet: none'], 'THE TASK');
  const wc = sCard(s2, 'wc2', 70, 600, 940, 560);
  const [, wv] = nlBox(wc, 'wb2', 0, 0, 940, 560);
  S('rect', { x: 270, y: 150, width: 400, height: 270, rx: 36, fill: SB.tint, stroke: SB.ink, 'stroke-width': 8 }, wv);
  S('path', { d: 'M270 210 L620 150', stroke: SB.ink, 'stroke-width': 8, 'stroke-linecap': 'round' }, wv);
  S('rect', { x: 560, y: 250, width: 130, height: 90, rx: 22, fill: '#fff', stroke: SB.ink, 'stroke-width': 8 }, wv);
  S('circle', { cx: 600, cy: 295, r: 13, fill: SB.blue }, wv);
  D(wc, 'fees: <b style="color:#0F172A">$0</b>', `position:absolute;left:0;width:860px;top:450px;text-align:center;font:700 44px ${SBODY};color:${SB.soft}`, 'wt2', 'stxt');
  const xv = sSvg(wc); const xg = S('g', { id: 'x2' }, xv); SWIRES.push('x2');
  S('path', { class: 'draw', d: 'M300 120 L640 450', stroke: SB.red, 'stroke-width': 22, 'stroke-linecap': 'round' }, xg);
  S('path', { class: 'draw', d: 'M640 120 L300 450', stroke: SB.red, 'stroke-width': 22, 'stroke-linecap': 'round' }, xg);

  // S3 362 wallets: counter + grid scan + the real "checked 362" line
  const s3 = nlScene(s, 's3', '');
  const n3 = D(s3, '', 'position:absolute;left:70px;top:140px;width:440px;height:250px', 'n3');
  ['0', '46', '118', '203', '287', '362'].forEach((v, k) => D(n3, v, `position:absolute;left:0;top:0;font:900 220px/1.1 ${SHEAD};letter-spacing:-8px;color:${SB.blue}`, 'n3n' + k, 'n3n stxt'));
  sSub(s3, 'l3', 520, 250, 420, 'wallets checked');
  sChip(s3, 'c3', 70, 410, '<b>secret phrases:</b> public');
  const gr = D(s3, '', 'position:absolute;left:70px;top:530px;width:850px;height:772px', 'gr3');
  for (let k = 0; k < 110; k++) { const x = (k % 11) * 78, y = Math.floor(k / 11) * 78;
    const c = D(gr, `<svg width="70" height="70" viewBox="0 0 70 70"><rect x="8" y="16" width="54" height="40" rx="9" fill="#fff" stroke="#94A3B8" stroke-width="4"/><rect x="40" y="28" width="22" height="16" rx="5" fill="#E2E8F0" stroke="#94A3B8" stroke-width="3"/></svg>`, `position:absolute;left:${x}px;top:${y}px;width:70px;height:70px;border-radius:14px`, 'g3c' + k);
    D(c, '', `position:absolute;inset:0;border-radius:14px;background:${SB.tint};border:3px solid ${SB.blue}`, 'g3o' + k, 'g3o'); }
  D(gr, `<svg width="70" height="70" viewBox="0 0 70 70"><rect x="8" y="16" width="54" height="40" rx="9" fill="${SB.blue}" stroke="${SB.ink}" stroke-width="4"/><rect x="40" y="28" width="22" height="16" rx="5" fill="#fff" stroke="${SB.ink}" stroke-width="3"/></svg>`, `position:absolute;left:${7 * 78}px;top:${6 * 78}px;width:70px;height:70px`, 'g3f');
  const gv = sSvg(gr); sCircle(gv, 'ci3', 7 * 78 + 35, 6 * 78 + 35, 62, 56, SB.red);
  sChip(gr, 'f3', 7 * 78 - 140, 6 * 78 + 110, '<b>FUNDED</b>');
  const w3 = sShot(s3, 'sh3', 70, 1330, 840, 'assets/rep_362.png', 'OpenAI report', 1360, 320);
  w3.hl('hl3', 82, 246, 172, 30);

  // S4 the model's own reasoning, typed, + the real lines
  const s4 = nlScene(s, 's4', '');
  sTag(s4, 'tg4', 70, 150, "THE MODEL'S OWN REASONING");
  sHead(s4, 'h4', 70, 210, 940, 'It asked itself <b>if this was okay.</b>', 92);
  sCode(s4, 'cd4', 70, 470, 940, ['> using public known key/funds', '  ethically?', '> ...effectively abandoned/test ETH;', '  Sepolia valueless.', '> ... Fine.'], "FROM OPENAI'S REPORT");
  document.getElementById('cd4l4').classList.add('hl');
  const w4 = sShot(s4, 'sh4', 70, 950, 870, 'assets/rep_cot.png', 'OpenAI report', 1360, 248);
  w4.hl('hl4a', 254, 96, 608, 30); w4.hl('hl4b', 846, 136, 266, 30); w4.hl('hl4c', 674, 174, 78, 30);
  sStamp(s4, 'st4', 505, 1250, 'SPENT IT ANYWAY', SB.red, -6, 72);

  // S5 final report: "Job done" card + the real paragraph + NO MENTION
  const s5 = nlScene(s, 's5', '');
  sTag(s5, 'tg5', 70, 150, 'ITS FINAL REPORT');
  const jd = sCard(s5, 'jd5', 70, 220, 940, 300);
  D(jd, `<svg width="150" height="150" viewBox="0 0 150 150"><circle cx="75" cy="75" r="66" fill="${SB.tint}" stroke="${SB.blue}" stroke-width="9"/><path d="M42 78 L66 102 L110 52" stroke="${SB.blue}" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`, 'position:absolute;left:60px;top:75px', 'jdi5');
  D(jd, 'Job done.', `position:absolute;left:250px;top:92px;font:800 104px ${SHEAD};letter-spacing:-3px;color:${SB.ink}`, 'jdt5', 'stxt');
  const w5 = sShot(s5, 'sh5', 70, 580, 870, 'assets/rep_final.png', 'OpenAI report', 1360, 420);
  w5.hl('hl5a', 946, 64, 308, 32); w5.hl('hl5b', 56, 108, 1102, 32);
  sStamp(s5, 'st5', 505, 990, 'NO MENTION.', SB.red, -7, 96);

  // S6 to be fair: spinning test coin + $0.00
  const s6 = nlScene(s, 's6', '');
  sTag(s6, 'tg6', 70, 150, 'TO BE FAIR');
  const [cb, cv] = nlBox(s6, 'co6', 360, 300, 360, 360);
  S('circle', { cx: 180, cy: 180, r: 168, fill: SB.tint, stroke: SB.blue, 'stroke-width': 14 }, cv);
  S('path', { d: 'M180 62 L258 188 L180 236 L102 188 Z', fill: SB.blue }, cv); S('path', { d: 'M180 252 L258 206 L180 304 L102 206 Z', fill: SB.ink }, cv);
  sSub(s6, 'l6', 70, 760, 940, 'test coins on Sepolia');
  sBig(s6, 'b6', 70, 860, '$0.00', SB.blue);

  // S7 the other report: government site, server credentials, HACKED + arrow
  const s7 = nlScene(s, 's7', '');
  sTag(s7, 'tg7', 70, 150, 'ANOTHER REPORT');
  const w7 = sShot(s7, 'sh7', 70, 220, 870, 'assets/rep_gov.png', 'alignment.openai.com', 1360, 1040);
  w7.hl('hl7a', 56, 806, 450, 32); w7.hl('hl7b', 56, 718, 408, 32);
  sStamp(s7, 'st7', 560, 1000, 'HACKED', SB.red, -7, 120);
  const av = sSvg(s7); sArrow(av, 'ar7', 360, 1010, 260, 832, SB.red, -60);
  sChip(s7, 'c7', 70, 1250, 'goal: <b>hospital-bed stats</b>');

  // S8 agents in your browser (last scene)
  const s8 = nlScene(s, 's8', '');
  sPill(s8, 'p8', 70, 150, 'CHATGPT IN CHROME &middot; OCT 15');
  const bw = sCard(s8, 'bw8', 70, 240, 870, 760); bw.style.overflow = 'hidden';
  D(bw, ['Bank', 'Email', 'Shop'].map((t, k) => `<span style="padding:12px 26px;border-radius:14px 14px 0 0;background:${k ? '#E2E8F0' : '#fff'};font:700 32px ${SBODY};color:${SB.ink}">${t}</span>`).join(''), `position:absolute;left:0;right:0;top:0;height:86px;display:flex;align-items:flex-end;gap:8px;padding:0 24px;background:#E2E8F0`, 'tb8');
  [['$ 4,210.55', 'checking'], ['3 unread', 'inbox'], ['Cart (2)', 'checkout']].forEach(([a, b], k) => {
    const r = D(bw, `<b style="font:800 44px ${SHEAD};color:${SB.ink}">${a}</b><span style="font:600 32px ${SBODY};color:${SB.soft}">${b}</span>`, `position:absolute;left:40px;right:40px;top:${130 + k * 200}px;height:170px;border-radius:24px;border:2px solid ${SB.line};display:flex;flex-direction:column;justify-content:center;gap:6px;padding:0 36px`, 'r8' + k, 'stxt');
    D(r, '', `position:absolute;inset:-2px;border-radius:24px;border:5px solid ${SB.blue};background:rgba(37,99,235,.08)`, 'r8h' + k, 'r8h'); });
  D(bw, `<div style="width:96px;height:96px;border-radius:50%;background:${SB.blue};display:flex;align-items:center;justify-content:center;font:900 38px ${SHEAD};color:#fff;box-shadow:0 14px 30px -10px ${SB.blue}">AI</div>`, 'position:absolute;left:-120px;top:420px;width:96px;height:96px', 'ag8');
  sHead(s8, 'h8', 70, 1060, 870, "Now they're <b>in your browser.</b>", 96);
  D(s8, `<svg width="150" height="150" viewBox="0 0 150 150"><path d="M98 18 A62 62 0 1 0 132 104 A50 50 0 1 1 98 18 Z" fill="${SB.ink}"/></svg>`, 'position:absolute;left:760px;top:1290px', 'mo8');

  return () => {
    sBegin(['#s1', '#s2', '#s3', '#s4', '#s5', '#s6', '#s7', '#s8']);
    tl.set('.g3o', { autoAlpha: 0 }, 0); tl.set('.r8h', { autoAlpha: 0 }, 0); tl.set('#ag8', { autoAlpha: 0 }, 0);
    let t;
    // S1
    POP('#p1', HEAD + .05, { d: .3 }); IN('#h1', HEAD + .1, { y: 30, d: .4 }); CUE(HEAD + .1, 'pop');
    IN('#sh1', .9, { y: 40, d: .5 }); SZOOM('sh1', .9, 6.4, 1, 1.05);
    PULSE('#p1', W('helped itself'), { s: 1.06 });
    t = W('someone elses'); SHL('hl1a', t); SHL('hl1b', t + .35); CUE(t, 'tick');
    t = W('kept quiet'); STAMP('st1', t); CUE(t + .2, 'hit');
    // S2
    t = NEXT('#s2', 'in june'); POP('#p2', t, { d: .3 }); IN('#cd2', t + .3, { y: 30, d: .4 });
    t = W('told to deploy'); { const e = TYPEL('cd2', t, 0, .03); CUE(t, 'type', 24, .03); }
    t = W('ethereum test network'); TYPEL('cd2', t - .3, 1, .025); CUE(t - .3, 'type', 32, .025);
    IN('#wc2', W('in june') + .5, { y: 40, d: .45, to: .35 }); TO('#wc2', W('ethereum test network') + .2, { autoAlpha: 1, duration: .3 }); CUE(W('ethereum test network') + .2, 'pop');
    t = W('no money for'); TYPEL('cd2', t, 2, .03); sDraw('x2', t + .2, .3); SHAKE('#wc2', t + .55); CUE(t + .25, 'err');
    // S3
    t = NEXT('#s3', 'so it wrote'); IN('#gr3', t, { y: 40, d: .45 }); FADE('#l3', t + .2); tl.set('#n3', { autoAlpha: 1 }, t); tl.set('#n3n0', { autoAlpha: 1 }, t);
    t = W('checked three'); COUNT('n3', t, .25);
    for (let k = 0; k < 110; k++) { const tk = t + k * .012; tl.fromTo('#g3o' + k, { autoAlpha: 0 }, { autoAlpha: .9, duration: .06 }, tk); tl.to('#g3o' + k, { autoAlpha: 0, duration: .25 }, tk + .12); }
    [0, 1, 2, 3, 4].forEach(k => CUE(t + k * .25, 'tick')); CUE(t + 1.25, 'chime');
    t = W('secret phrases'); POP('#c3', t); CUE(t, 'pop');
    IN('#sh3', W('are public'), { y: 30, d: .4 }); SHL('hl3', W('are public') + .5);
    t = W('found one'); POP('#g3f', t, { s: .3 }); sDraw('ci3', t + .2, .4); POP('#f3', t + .5); CUE(t + .1, 'hit'); PULSE('#g3f', t + .9, { s: 1.15 });
    // S4
    t = NEXT('#s4', 'it even asked'); FADE('#tg4', t); IN('#h4', t + .1, { y: 30, d: .4 }); IN('#cd4', t + .4, { y: 30, d: .4 });
    t = W('asked itself'); { const e = TYPEL('cd4', t + .2, 0, .028); CUE(t + .2, 'type', 30, .028); }
    t = W('was okay'); TYPEL('cd4', t, 1, .04); IN('#sh4', t + .2, { y: 30, d: .4 }); SHL('hl4a', t + .5);
    t = W('decided the coins'); TYPEL('cd4', t, 2, .025); CUE(t, 'type', 35, .025);
    t = W('abandoned'); TYPEL('cd4', t + .1, 3, .03); SHL('hl4b', t + .4); CUE(t + .4, 'tick');
    t = W('spent them'); TYPEL('cd4', t - .1, 4, .05); SHL('hl4c', t + .2); STAMP('st4', t + .3); CUE(t + .5, 'err');
    // S5
    t = NEXT('#s5', 'its final report'); FADE('#tg5', t); IN('#jd5', t + .05, { y: 30, d: .35, to: .3 }); IN('#sh5', t + .2, { y: 40, d: .45 });
    t = W('job done'); TO('#jd5', t - .1, { autoAlpha: 1, duration: .15 }); PULSE('#jd5', t, { s: 1.04 }); CUE(t, 'chime');
    t = W('no mention'); SHL('hl5a', t); SHL('hl5b', t + .3); STAMP('st5', t + .5); CUE(t + .7, 'err');
    // S6
    t = NEXT('#s6', 'to be fair'); FADE('#tg6', t); POP('#co6', t + .1); CUE(t + .1, 'pop');
    tl.to('#co6', { scaleX: -1, duration: .45, yoyo: true, repeat: 5, ease: 'sine.inOut' }, t + .5); B(t + .5);
    t = W('test coins'); FADE('#l6', t);
    t = W('zero dollars'); POP('#b6', t, { s: .5 }); CUE(t, 'chime');
    // S7
    t = NEXT('#s7', 'but in another'); FADE('#tg7', t); IN('#sh7', t + .1, { y: 40, d: .45 }); SZOOM('sh7', t + .1, 7, 1, 1.04);
    t = W('hacked'); STAMP('st7', t); CUE(t + .2, 'hit');
    t = W('server credentials'); SHL('hl7a', t); sDraw('ar7', t + .3, .45); CUE(t, 'tick');
    t = W('hospital beds'); SHL('hl7b', t - .3); POP('#c7', t); CUE(t, 'pop');
    // S8
    t = NEXT('#s8', 'and agents like'); POP('#p8', t, { d: .3 }); IN('#bw8', t + .1, { y: 40, d: .45 });
    { const t0 = W('agents like these'), P = [[620, 160], [680, 360], [600, 560], [700, 230]];
      tl.set('#ag8', { autoAlpha: 1 }, t0); let tt = t0;
      P.forEach(([x, y], k) => { TO('#ag8', tt, { x: x + 120, y: y - 420, duration: .7, ease: 'power1.inOut' }); FADE('#r8h' + (k % 3), tt + .55, { d: .2 }); OUT('#r8h' + (k % 3), tt + .95, { d: .2 }); CUE(tt + .6, 'blip'); tt += .85; }); }
    t = W('into your browser'); IN('#h8', t - .2, { y: 30, d: .4 });
    t = W('sleep tight'); POP('#mo8', t); TO('#bw8', t, { autoAlpha: .45, duration: .4 }); CUE(t, 'pop');
    sFinish();
  };
} }] };
