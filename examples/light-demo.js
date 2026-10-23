// LIGHT demo (Netlight ML look, `light` skill): "How a machine reads" - text -> tokens -> IDs -> vectors -> next token. LONG 1920x1080.
// Follows every rule of the light skill: nlSetup / nlBegin / nlFinish, cOrb in the corner of every scene but the last, NEXT per scene,
// 2-3 word unique phrases, typed text inside windows, custom drawings (laptop, scissors), a cursor click, a moving packet, sound cues.
// Build (in the video folder with words.json + meta.json): python3 ~/hf-kit/light/lbuild.py video.js talk.m4a
// Token IDs are the real cl100k_base IDs (verified with tiktoken, Oct 2026): How=4438, " do"=656, " token"=4037, "izers"=12509, " work"=990, "?"=30.
// Script (9 lines): You type a question into a chat box, but the model never sees your words. / It sees something else entirely. /
//   First, a tokenizer cuts your text into small pieces called tokens. / One word can become several tokens. /
//   Every token is then swapped for a number from a fixed vocabulary of about one hundred thousand entries. /
//   Each ID picks one row from a giant table, and that row is a vector of numbers that carries meaning. /
//   Here it is in code: encode the text, and you get the IDs back. /
//   From those vectors, the model scores every possible next token and picks the most likely one. / Text, tokens, IDs, vectors. That is how a machine reads.
const VIDEO = { theme: 'blue', scenes: [{ type: 'custom', build: (s) => {
  nlSetup(s);
  const TK = ['How', ' do', ' token', 'izers', ' work', '?'], IDS = ['4438', '656', '4037', '12509', '990', '30'], Q = 'How do tokenizers work?';

  // hero: the user's chat message. Starts inside the laptop screen, glides to the top-left in s2, leaves in s3.
  const msg = nlHero('msg', 190, 300, 640, '', NL.data, 'chat'); msg.style.height = '130px';
  nlType(msg, 'ty1', 28, 70, Q, 34, NL.ink);

  // S1 the model never sees words: laptop (custom drawing) -> wire with a red X -> model window; model_input typed below
  const s1 = nlScene(s, 's1', 'What the model <b>sees</b>');
  const [lp, lv] = nlBox(s1, 'lp1', 120, 230, 760, 510);
  S('rect', { x: 20, y: 0, width: 720, height: 440, rx: 22, fill: '#0a0f1a', stroke: NL.data, 'stroke-width': 3 }, lv);
  S('rect', { x: 34, y: 14, width: 692, height: 412, rx: 14, fill: NL.data, opacity: .05 }, lv);
  S('path', { d: 'M0 452 L760 452 L716 506 L44 506 Z', fill: '#121a2b', stroke: NL.data, 'stroke-width': 3, 'stroke-linejoin': 'round' }, lv);
  [470, 486].forEach(y => S('path', { d: `M110 ${y} L650 ${y}`, stroke: '#2a3550', 'stroke-width': 4, 'stroke-dasharray': '22 10' }, lv));
  const send = S('g', { id: 'snd1' }, lv); S('rect', { x: 560, y: 240, width: 140, height: 56, rx: 14, fill: NL.data }, send);
  S('path', { d: 'M608 254 L656 268 L608 282 L616 268 Z', fill: '#05070d' }, send);
  nlCursor(s1, 'cu1', 520, 380);
  const mw = nlWin(s1, 'mw1', 1160, 190, 520, 470, NL.model, 'model');
  nlNet(mw, 'nt1', 20, 60, 480, 390, [3, 5, 5, 3]);
  const v1 = nlSvg(s1);
  const w1 = nlWire(v1, 'w1', 'M880 450 C 1000 450, 1030 425, 1160 425', NL.data); arw(w1, 1160, 425, NL.data);
  nlMark(s1, 'x1', 981, 409, NL.err, false);
  const mi = nlWin(s1, 'mi1', 1000, 720, 680, 140, NL.model, 'model_input');
  nlType(mi, 'ty1b', 28, 72, `[${IDS.join(', ')}]`, 30, NL.model);
  const w1b = nlWire(v1, 'w1b', 'M1340 720 L1340 664', NL.model); arw(w1b, 1340, 664, NL.model, 'u');
  cOrb(s1, 'o1');

  // S2 tokenizer: scissors (custom drawing) run along the text, every token pops as the blade passes it
  const s2 = nlScene(s, 's2', 'Text becomes <b>tokens</b>');
  const t2 = nlTokens(s2, 'tk2', 120, 480, TK, NL.data, 50, 16), rowW = t2.xs[5][0] + t2.xs[5][1];
  const [, sv] = nlBox(s2, 'sc2', 60, 372, 120, 90);
  [25, 65].forEach(y => S('circle', { cx: 20, cy: y, r: 15, fill: 'none', stroke: NL.out, 'stroke-width': 5 }, sv));
  S('path', { d: 'M33 31 L112 54 M33 59 L112 36', stroke: '#e8eefc', 'stroke-width': 6, 'stroke-linecap': 'round' }, sv);
  S('circle', { cx: 66, cy: 45, r: 5, fill: NL.out }, sv);
  const v2 = nlSvg(s2), bx = 120 + t2.xs[2][0], bw = t2.xs[3][0] + t2.xs[3][1] - t2.xs[2][0];
  nlWire(v2, 'w2', `M${bx} 576 L${bx} 600 L${bx + bw} 600 L${bx + bw} 576`, NL.out);
  nlTag(s2, 'l2', bx + bw / 2, 624, '1 word = 2 tokens', NL.out, 32);
  const tz = nlWin(s2, 'tz2', 1180, 190, 500, 450, NL.data, 'tokens');
  TK.forEach((tk, k) => nlRow(tz, 'tr2' + k, `"${tk}"`, '#' + k, k === 2 || k === 3 ? NL.out : NL.data));
  nlChip(s2, 'n2', 1180, 690, '6 tokens', NL.data, '#', 36);
  cOrb(s2, 'o2');

  // S3 IDs + vocabulary: wires drop from every token to its ID, the vocab file lights the two rows, the counter runs to 100k
  const s3 = nlScene(s, 's3', 'Every token gets an <b>ID</b>');
  const t3 = nlTokens(s3, 'tk3', 140, 250, TK, NL.data, 40, 14);
  const v3 = nlSvg(s3);
  TK.forEach((_, k) => { const cx = t3.cx(k), g = nlWire(v3, 'w3' + k, `M${cx} 330 L${cx} 410`, NL.model, null, 3); arw(g, cx, 410, NL.model, 'd'); nlTag(s3, 'i3' + k, cx, 428, IDS[k], NL.model, 30); });
  const vb = nlWin(s3, 'vb3', 1220, 190, 460, 500, NL.model, 'vocab.json');
  [['0', '"!"'], ['...', ''], ['656', '" do"'], ['4037', '" token"'], ['12509', '"izers"'], ['...', ''], ['100255', '"..."']].forEach(([a, b], k) => nlRow(vb, 'vr' + k, a, b, NL.data));
  ['vr3', 'vr4'].forEach(r => nlRowHL(document.getElementById(r), r + 'h'));
  nlLab(s3, 'l3', 140, 590, 'fixed vocabulary', NL.model);
  nlDocs(s3, 'dv3', 140, 640, 14, 4, 52, 64, 12, NL.model);
  nlCount(s3, 'n3', 1220, 730, ['0', '25,000', '50,000', '75,000', '100,000'], NL.out, 96);
  cOrb(s3, 'o3');

  // S4 embedding table -> one row -> vector -> meaning space
  const s4 = nlScene(s, 's4', 'IDs pick <b>vectors</b>');
  const et = nlWin(s4, 'et4', 120, 190, 900, 470, NL.model, 'embedding_table  [100k x 4096]'), er = [];
  [4035, 4036, 4037, 4038, 4039, 4040].forEach((id, r) => er.push(D(et, `<span style="width:110px;color:${r === 2 ? NL.out : NL.dim}">${id}</span>` + Array.from({ length: 6 }, (_, k) => { const v = rnd(id * 7 + k) * 2 - 1; return `<span style="width:96px;color:${v < 0 ? NL.err : NL.model}">${v.toFixed(2)}</span>`; }).join(''), '', 'er' + r, 'nrow')));
  nlRowHL(er[2], 'hl4');
  const v4 = nlSvg(s4), w4 = nlWire(v4, 'w4', 'M570 660 C 570 720, 537 720, 537 790', NL.out); arw(w4, 537, 790, NL.out, 'd');
  nlVec(s4, 'vec4', 140, 800, [.12, -.4, .88, .05, -.71, .33, .6, -.18], NL.model, true, 70);
  const em = nlEmbed(s4, 'em4', 1080, 190, 600, 640, 'meaning space');
  em.pt('p4a', .62, .3, NL.out, '" token"'); em.pt('p4b', .72, .46, NL.data, '" piece"'); em.pt('p4c', .5, .56, NL.data, '" word"', 20, 26); em.pt('p4d', .12, .88, NL.dim, '" banana"');
  em.ring('rg4', .62, .44, 190, 140, NL.data);
  cOrb(s4, 'o4');

  // S5 code: the call, an arrow to the output, the IDs typed in the output window
  const s5 = nlScene(s, 's5', 'Now in <b>code</b>');
  nlCode(s5, 'cd5', 140, 200, 1160, ['import tiktoken', "enc = tiktoken.get_encoding('cl100k_base')", `ids = enc.encode('${Q}')`, 'print(ids)'], 'tokens.py', 32);
  const v5 = nlSvg(s5), w5 = nlWire(v5, 'w5', 'M1300 400 C 1440 400, 1440 715, 1300 715', NL.data); arw(w5, 1300, 715, NL.data, 'l');
  const o5 = nlWin(s5, 'out5', 140, 620, 1160, 190, NL.data, 'output');
  nlType(o5, 'ty5', 30, 86, `[${IDS.join(', ')}]`, 40, NL.data);
  nlChip(s5, 'n5', 140, 860, '6 IDs', NL.model, '#', 34);
  cOrb(s5, 'o5');

  // S6 next token: net forward pass -> probability bars -> pick
  const s6 = nlScene(s, 's6', 'Score every <b>next token</b>');
  nlNet(s6, 'nn6', 100, 200, 820, 640, [4, 6, 6, 4]);
  nlLab(s6, 'l6a', 120, 860, 'vectors', NL.data); nlLab(s6, 'l6b', 760, 860, 'scores', NL.out);
  const v6 = nlSvg(s6), w6 = nlWire(v6, 'w6', 'M880 520 C 940 520, 940 380, 1000 380', NL.out); arw(w6, 1000, 380, NL.out);
  nlBars(s6, 'br6', 1000, 200, 680, [['" work"', .62], ['" function"', .18], ['" help"', .09], ['" run"', .05]]);
  nlChip(s6, 'pk6', 1000, 640, 'next = " work"', NL.out, NLOK('#05070d', 22), 36);
  cOrb(s6, 'o6');

  // S7 recap (last scene: no orb). A packet runs along the pipeline and lands on every word; the vector fills at the end.
  const s7 = nlScene(s, 's7', 'How a machine <b>reads</b>');
  const P7 = [['Text', NL.data, 'T'], ['Tokens', NL.data, '#'], ['IDs', NL.model, '#'], ['Vectors', NL.model, 'V']];
  P7.forEach(([t, c, i], k) => { const e = nlChip(s7, 'p7' + k, 130 + k * 400, 300, t, c, i, 44); e.style.width = '330px'; e.style.justifyContent = 'center'; nlTag(s7, 'q7' + k, 295 + k * 400, 430, ['"How do..."', 'How|do|token', '4438 656', '0.12 -0.40'][k], c, 30); });
  const v7 = nlSvg(s7); [0, 1, 2].forEach(k => { const g = nlWire(v7, 'w7' + k, `M${460 + k * 400} 338 L${528 + k * 400} 338`, NL.model); arw(g, 528 + k * 400, 338, NL.model); });
  D(s7, '', `position:absolute;left:${295 - 14}px;top:${338 - 14}px;width:28px;height:28px;border-radius:50%;background:#fff;box-shadow:0 0 22px ${NL.out},0 0 8px #fff;z-index:4`, 'dt7');
  const rd = nlWin(s7, 'rd7', 130, 560, 1530, 300, NL.model, 'model_input');
  nlVec(rd, 'vc7', 40, 100, [.12, -.4, .88, .05, -.71, .33, .6, -.18], NL.model, true, 110);

  return () => {
    nlBegin(['#s1', '#s2', '#s3', '#s4', '#s5', '#s6', '#s7']);
    // S1
    let t = go('you type a question'); IN('#msg', t, { y: 30 }); FADE('#lp1', t, { d: .4 }); ORB_ON('o1', t + .3);
    CUE(TYPE('ty1', t + .4, .045) - 23 * .045, 'type', 23, .045);
    nlShow('#cu1', t + .6); CURSOR('cu1', W('chat box') - .3, 750, 498, .6);
    t = W('but the model'); CLICK('cu1', t); PULSE('#snd1', t, { s: 1.1 }); FADE('#mw1', t + .2); CUE(t + .2, 'pop');
    t = W('never sees'); nlDraw('w1', t - .3); POP('#x1', W('your words')); CUE(W('your words'), 'err'); SHAKE('#x1', W('your words') + .4); ORB_BLINK('o1', W('your words') + .9);
    t = W('something else'); IN('#mi1', t - .2, { y: 30 }); CUE(TYPE('ty1b', t + .2, .03) - 33 * .03, 'type', 33, .03); nlDraw('w1b', t + 1.1, .3); NET_FWD('nt1', t + 1.3, 1.4); CUE(t + 1.3, 'hit');
    ORB_THINK('o1', W('entirely'));
    // S2
    t = NEXT('#s2', 'first a tokenizer'); HERO('msg', t, 120, 190, .85); ORB_ON('o2', t + .3);
    IN('#tz2', t + .3, { x: 40, y: 0, to: .3 });
    t = W('cuts your text'); FADE('#sc2', t - .2, { d: .2 }); nlShow('#tk2', t);
    { const dEnd = rowW - 25, Dd = 1.3; TO('#sc2', t, { x: dEnd, duration: Dd, ease: 'none' });
      TK.forEach((_, k) => { const tk = t + Dd * Math.max(0, t2.xs[k][0] + t2.xs[k][1] / 2 - 45) / dEnd; POP('#tk2t' + k, tk, { d: .3 }); CUE(tk, 'tick'); });
      OUT('#sc2', t + Dd + .1, { d: .3 }); }
    t = W('called tokens'); TO('#tz2', t - .2, { autoAlpha: 1, duration: .3 }); TK.forEach((_, k) => { FADE('#tr2' + k, t + .1 + k * .12, { d: .2 }); CUE(t + .1 + k * .12, 'tick'); });
    POP('#n2', t + 1); CUE(t + 1, 'pop');
    t = W('one word can'); nlDraw('w2', t); POP('#l2', W('several tokens')); CUE(W('several tokens'), 'hit'); PULSE(['#tk2t2', '#tk2t3'], W('several tokens') + .3); ORB_BLINK('o2', W('several tokens') + .9);
    // S3
    t = NEXT('#s3', 'every token is then'); OUT('#msg', t - .3); FADE('#tk3', t + .2); IN('#vb3', t + .6, { x: 40, y: 0 }); ORB_ON('o3', t + .3);
    t = W('swapped for a number'); TK.forEach((_, k) => { nlDraw('w3' + k, t + k * .15, .3); POP('#i3' + k, t + .2 + k * .15); CUE(t + .2 + k * .15, 'tick'); });
    t = W('fixed vocabulary'); FADE('#l3', t); nlShow('#dv3', t); FADE('.dv3d', t + .2, { d: .2, st: .01 }); FADE(['#vr3h', '#vr4h'], t + .8, { d: .3 }); CUE(t + .8, 'chime');
    t = W('one hundred thousand'); COUNT('n3', t - .6, .25); CUE(t + .4, 'hit'); ORB_WOW('o3', t + .5);
    // S4
    t = NEXT('#s4', 'each id picks'); IN('#et4', t + .1, { y: 30 }); ORB_ON('o4', t + .3); FADE('#hl4', W('one row from'), { d: .3 }); CUE(W('one row from'), 'tick');
    t = W('that row is'); nlDraw('w4', t - .2); nlShow('#vec4', t); POP('.vec4v', t + .3, { st: .08 }); CUE(t + .3, 'pop');
    t = W('carries meaning'); IN('#em4', t - 1.4, { x: 40, y: 0 }); POP(['#p4a', '#p4aL'], t - .8); POP(['#p4b', '#p4bL', '#p4c', '#p4cL'], t - .4); POP(['#p4d', '#p4dL'], t); FADE('#rg4', t + .4); CUE(t + .4, 'chime'); ORB_THINK('o4', t + .6);
    // S5
    t = NEXT('#s5', 'here it is in code'); IN('#cd5', t + .1, { y: 30 }); CODE('cd5', t + .5, .45); ORB_ON('o5', t + .4);
    t = W('encode the text'); nlDraw('w5', t, .5); IN('#out5', t + .3, { y: 30 });
    t = W('get the ids'); CUE(TYPE('ty5', t - .2, .04) - 33 * .04, 'type', 33, .04); POP('#n5', t + 1.2); CUE(t + 1.2, 'chime'); ORB_BOUNCE('o5', t + 1.3, 2);
    // S6
    t = NEXT('#s6', 'from those vectors'); FADE('#nn6', t + .1); FADE(['#l6a', '#l6b'], t + .4); ORB_ON('o6', t + .3);
    t = W('model scores'); NET_FWD('nn6', t, 1.6); nlDraw('w6', t + 1.4, .4); IN('#br6', t + 1.6, { x: 40, y: 0 }); BARS('br6', t + 1.8); CUE(t + 1.8, 'hit');
    t = W('most likely'); POP('#pk6', W('likely one')); CUE(W('likely one'), 'chime'); ORB_WOW('o6', W('likely one'));
    // S7 (no orb)
    t = NEXT('#s7', 'text tokens ids'); POP(['#p70', '#q70'], t); CUE(t, 'pop'); FADE('#dt7', t + .2, { d: .2 }); IN('#rd7', t + .2, { y: 30, to: .3 });
    [['tokens ids', 1], ['ids vectors', 2], ['vectors that', 3]].forEach(([ph, k]) => { const tk = W(ph); nlDraw('w7' + (k - 1), tk - .5, .3); TO('#dt7', tk - .5, { x: 400 * k - 181, duration: .5, ease: 'power1.inOut' }); POP(['#p7' + k, '#q7' + k], tk); CUE(tk, 'tick'); });
    t = W('that is how'); TO('#rd7', t - .3, { autoAlpha: 1, duration: .3 }); POP('.vc7v', t + .1, { st: .08 }); CUE(t + .1, 'pop');
    t = W('machine reads'); PULSE('#rd7', t, { s: 1.03 }); CUE(t, 'hit');
    nlFinish();
  };
} }] };
