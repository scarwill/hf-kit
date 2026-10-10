// Netlight ML demo: "How a machine reads" (tokens -> IDs -> vectors -> code -> next token). LONG 1920x1080.
const VIDEO = { theme: 'blue', scenes: [{ type: 'custom', build: (s) => {
  nlInit(s); nlIntro(s); nlOutro(s);
  const msg = nlHero('msg', 160, 330, 700, 'How do tokenizers work?', NL.data, 'you → chat');
  const TK = ['How', ' do', ' token', 'izers', ' work', '?'], IDS = ['4438', '656', '4037', '12509', '990', '30'];

  // S1 the model never sees words
  const s1 = nlScene(s, 's1', 'What the model <b>sees</b>');
  nlOrb(s1, 'o1', 1420, 520, 150);
  const v1 = nlSvg(s1); nlWire(v1, 'w1', 'M870 420 C 1000 420, 1080 500, 1230 520', NL.data, '10 10');
  nlMark(s1, 'x1', 1010, 412, NL.err, false);
  const mi = nlWin(s1, 'mi1', 1060, 790, 760, 150, NL.model, 'model_input'); D(mi, `[${IDS.join(', ')}]`, `padding:24px 28px;font:700 34px ${NLMONO};color:${NL.model}`);
  nlCmd(s1, 'c1', 'model.read(text)');

  // S2 tokenizer
  const s2 = nlScene(s, 's2', 'Text becomes <b>tokens</b>');
  const t2 = nlTokens(s2, 'tk2', 160, 480, TK, NL.data, 56, 16);
  const v2 = nlSvg(s2); const bx = 160 + t2.xs[2][0], bw = t2.xs[3][0] + t2.xs[3][1] - t2.xs[2][0];
  nlWire(v2, 'w2', `M${bx} 600 L${bx} 625 L${bx + bw} 625 L${bx + bw} 600`, NL.out);
  nlTag(s2, 'l2', bx + bw / 2, 655, '1 word → 2 tokens', NL.out, 32);
  nlChip(s2, 'n2', 1440, 340, '6 tokens', NL.data, '#', 36);
  nlOrb(s2, 'o2', 1600, 760, 120);
  nlCmd(s2, 'c2', 'tokenize(text)');

  // S3 IDs + vocabulary
  const s3 = nlScene(s, 's3', 'Every token gets an <b>ID</b>');
  const t3 = nlTokens(s3, 'tk3', 140, 260, TK, NL.data, 40, 14);
  const v3 = nlSvg(s3); TK.forEach((_, k) => { const cx = t3.cx(k); nlWire(v3, 'w3' + k, `M${cx} 340 L${cx} 430`, NL.model, null, 3); nlTag(s3, 'i3' + k, cx, 450, IDS[k], NL.model, 32); });
  const vb = nlWin(s3, 'vb3', 1220, 200, 560, 520, NL.model, 'vocab.json');
  [['0', '"!"'], ['…', ''], ['656', '" do"'], ['4037', '" token"'], ['12509', '"izers"'], ['…', ''], ['100255', '…']].forEach(([a, b], k) => nlRow(vb, 'vr' + k, a, b, k === 3 || k === 4 ? NL.out : NL.data));
  nlCount(s3, 'n3', 1240, 790, ['0', '25,000', '50,000', '75,000', '100,000'], NL.out, 96);
  nlLab(s3, 'l3', 140, 640, 'fixed vocabulary', NL.model);
  nlDocs(s3, 'dv3', 140, 700, 14, 4, 52, 64, 12, NL.model);

  // S4 embedding table -> vector -> meaning
  const s4 = nlScene(s, 's4', 'IDs pick <b>vectors</b>');
  const et = nlWin(s4, 'et4', 120, 190, 900, 520, NL.model, 'embedding_table  [100k × 4096]');
  [4035, 4036, 4037, 4038, 4039, 4040].forEach((id, r) => D(et, `<span style="width:110px;color:${r === 2 ? NL.out : NL.dim}">${id}</span>` + Array.from({ length: 6 }, (_, k) => { const v = rnd(id * 7 + k) * 2 - 1; return `<span style="width:96px;color:${v < 0 ? NL.err : NL.model}">${v.toFixed(2)}</span>`; }).join(''), '', 'er' + r, 'nrow'));
  D(s4, '', `position:absolute;left:132px;top:${190 + 50 + 18 + 2 * 59}px;width:876px;height:60px;border:3px solid ${NL.out};border-radius:12px;box-shadow:0 0 22px ${NL.out}`, 'hl4');
  nlVec(s4, 'vec4', 140, 820, [.12, -.4, .88, .05, -.71, .33, .6, -.18], NL.model, true, 70);
  const v4 = nlSvg(s4); nlWire(v4, 'w4', 'M560 712 C 560 760, 500 760, 500 810', NL.out);
  const em = nlEmbed(s4, 'em4', 1100, 190, 700, 700, 'meaning space');
  em.pt('p4a', .62, .32, NL.out, '" token"'); em.pt('p4b', .74, .46, NL.data, '" piece"'); em.pt('p4c', .52, .55, NL.data, '" word"', 20, 26); em.pt('p4d', .14, .86, NL.dim, '" banana"');
  em.ring('rg4', .63, .44, 200, 150, NL.data);

  // S5 code
  const s5 = nlScene(s, 's5', 'Now in <b>code</b>');
  nlCode(s5, 'cd5', 140, 200, 1160, ['import tiktoken', "enc = tiktoken.get_encoding('cl100k_base')", "ids = enc.encode('How do tokenizers work?')", 'print(ids)'], 'tokens.py', 32);
  const o5 = nlWin(s5, 'out5', 140, 620, 1160, 190, NL.data, 'output'); nlType(o5, 'ty5', 30, 86, `[${IDS.join(', ')}]`, 40, NL.data).style.position = 'absolute';
  nlOrb(s5, 'o5', 1600, 560, 150);
  nlChip(s5, 'n5', 140, 880, '6 IDs', NL.model, '#', 34);

  // S6 next token
  const s6 = nlScene(s, 's6', 'Score every <b>next token</b>');
  nlNet(s6, 'nn6', 100, 200, 820, 660, [4, 6, 6, 4]);
  nlLab(s6, 'l6a', 120, 880, 'vectors', NL.data); nlLab(s6, 'l6b', 780, 880, 'scores', NL.out);
  nlBars(s6, 'br6', 1000, 230, 800, [['" work"', .62], ['" function"', .18], ['" help"', .09], ['" run"', .05]]);
  nlChip(s6, 'pk6', 1000, 680, 'next = " work"', NL.out, NLOK('#05070d', 22), 36);
  nlOrb(s6, 'o6', 1660, 860, 90);

  // S7 recap pipeline
  const s7 = nlScene(s, 's7', 'How a machine <b>reads</b>');
  const P7 = [['Text', NL.data, 'T'], ['Tokens', NL.data, '▤'], ['IDs', NL.model, '#'], ['Vectors', NL.model, 'V']];
  P7.forEach(([t, c, i], k) => { const e = nlChip(s7, 'p7' + k, 130 + k * 450, 300, t, c, i, 40); e.style.width = '330px'; e.style.justifyContent = 'center'; nlTag(s7, 'q7' + k, 295 + k * 450, 430, ['"How do…"', 'How|do|token', '4438 656', '0.12 -0.40'][k], c, 30); });
  const v7 = nlSvg(s7); [0, 1, 2].forEach(k => nlWire(v7, 'w7' + k, `M${470 + k * 450} 335 L${570 + k * 450} 335`, NL.model));
  nlOrb(s7, 'o7', 960, 740, 140);

  return () => {
    nlIntroBeats(); nlStart(['#s1', '#s2', '#s3', '#s4', '#s5', '#s6', '#s7']);
    // S1
    let t = go('you type a message'); IN('#msg', t, { y: 30 }); TYPE('c1', t + .5);
    t = W('but the model'); ORB_ON('o1', t - .3); nlDraw('w1', W('never sees')); POP('#x1', W('your words')); SHAKE('#x1', W('your words') + .4);
    t = W('something else'); ORB_LOOK('o1', t, 0, 14); IN('#mi1', t, { y: 30 }); ORB_THINK('o1', W('entirely'));
    // S2
    t = nlNext('#s2', 'first a tokenizer'); HERO('msg', t, 160, 190, .85); TYPE('c2', t + .3); ORB_ON('o2', t + .4);
    t = W('cuts your text'); POP('.tk2t', t, { st: .15 }); nlShow('#tk2', t); ORB_LOOK('o2', t + .3, -14, 0); POP('#n2', W('called tokens'));
    t = W('one word can become'); nlDraw('w2', t); POP('#l2', W('several tokens')); PULSE(['#tk2t2', '#tk2t3'], W('several tokens') + .3); ORB_BLINK('o2', W('several tokens') + .8);
    // S3
    t = nlNext('#s3', 'every token is then'); OUT('#msg', t - .3); FADE('#tk3', t + .2); IN('#vb3', t + .6, { x: 40, y: 0 });
    t = W('swapped for a number'); TK.forEach((_, k) => { nlDraw('w3' + k, t + k * .15, .3); POP('#i3' + k, t + .2 + k * .15); });
    t = W('fixed vocabulary'); FADE('#l3', t); nlShow('#dv3', t); FADE('.dv3d', t + .2, { d: .2, st: .01 }); PULSE(['#vr3', '#vr4'], t + .8);
    COUNT('n3', W('about one hundred'), .25);
    // S4
    t = nlNext('#s4', 'each id picks'); IN('#et4', t + .1, { y: 30 }); POP('#hl4', W('one row')); PULSE('#er2', W('one row') + .3);
    t = W('that row is a vector'); nlDraw('w4', t - .2); nlShow('#vec4', t); POP('.vec4v', t + .3, { st: .08 });
    t = W('carries meaning'); IN('#em4', t - 1.6, { x: 40, y: 0 }); POP(['#p4a', '#p4aL'], t - 1); POP(['#p4b', '#p4bL', '#p4c', '#p4cL'], t - .5); POP(['#p4d', '#p4dL'], t); FADE('#rg4', t + .4);
    // S5
    t = nlNext('#s5', 'here it is in code'); IN('#cd5', t + .1, { y: 30 }); CODE('cd5', t + .5, .45); ORB_ON('o5', t + .4); ORB_LOOK('o5', t + 1, -18, 0);
    t = W('encode the text'); IN('#out5', t, { y: 30 }); const te = TYPE('ty5', W('get the ids'), .04); POP('#n5', te); ORB_BOUNCE('o5', W('ids back'), 2);
    // S6
    t = nlNext('#s6', 'from those vectors'); FADE('#nn6', t + .1); FADE(['#l6a', '#l6b'], t + .4); ORB_ON('o6', t + .3);
    t = W('model scores'); NET_FWD('nn6', t, 1.6); IN('#br6', t + .4, { x: 40, y: 0 }); BARS('br6', t + 1);
    t = W('picks the most likely'); PULSE('#br6r0', t); POP('#pk6', W('likely one')); ORB_WOW('o6', W('likely one'));
    // S7
    t = nlNext('#s7', 'text tokens'); POP(['#p70', '#q70'], t); POP(['#p71', '#q71'], W('tokens')); nlDraw('w70', W('tokens') - .2, .3); POP(['#p72', '#q72'], W('ids')); nlDraw('w71', W('ids') - .2, .3); POP(['#p73', '#q73'], W('vectors')); nlDraw('w72', W('vectors') - .2, .3);
    ORB_ON('o7', W('that is how')); ORB_WOW('o7', W('machine reads'));
    OUT('#s7', END + .1, { d: .3 }); nlOutroBeats();
  };
} }] };
