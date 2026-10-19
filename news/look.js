// ===================== LOOK: AI + Dev news channel, light "Clean Blue" (blue + black only). Shorts 1080x1920 and long 1920x1080. =====================
// Loads AFTER news.js (build.py): news.js is only the ENGINE here (D, nlScene, nlStart, NEXT, CUE, nlBox, nlType/TYPE, COUNT...). Its old neon parts are banned by build.py.
// This file sets the look, the scene cut (hard cut + punch-in) and the end card. No intro: the hook is on screen from frame 0. FW/FH = frame size (premium.js).
// build:  sSetup(s)  ->  nlScene(s, 'sN', '') per idea      beats: sBegin(['#s1', ...]) FIRST -> NEXT('#sN', 'first words') -> sFinish() LAST
// Shorts safe zones: text above y 1590, and left of x 940 below y 900 (Shorts buttons / title). Text parts carry class 'stxt' so check.js can see them.
// Long videos: keep 60 px from every edge.
const SB = { bg: '#F5F8FA', ink: '#0F172A', soft: '#5B6678', card: '#FFFFFF', line: '#E2E8F0', blue: '#2563EB', tint: '#E3ECFF', red: '#E11D48', hl: 'rgba(37,99,235,.22)' };
const SHEAD = "'Inter Tight',Inter,sans-serif", SBODY = "Inter,'Helvetica Neue',sans-serif", SMONO = "'JetBrains Mono','DejaVu Sans Mono',monospace";
const SBG = `radial-gradient(900px 700px at 100% 0%,#E3ECFF 0%,transparent 60%),radial-gradient(900px 800px at 0% 100%,#EEF2F7 0%,transparent 60%),${SB.bg}`;

function sSetup(s) {
  nlInit(s);
  const css = document.createElement('style'); css.textContent = `
  #root{background:${SBG}!important;font-family:${SBODY}}
  .nttl{display:none!important}
  .spill{position:absolute;display:flex;gap:14px;align-items:center;font:800 32px ${SBODY};letter-spacing:2px;color:${SB.blue};background:${SB.tint};border-radius:999px;padding:14px 28px;white-space:nowrap}
  .spill i{width:14px;height:14px;border-radius:50%;background:${SB.blue}}
  .shead{position:absolute;font:800 100px/1.0 ${SHEAD};letter-spacing:-3px;color:${SB.ink}}
  .shead b{color:${SB.blue};font-weight:800}
  .stag{position:absolute;font:800 32px ${SBODY};letter-spacing:4px;color:${SB.blue};white-space:nowrap}
  .ssub{position:absolute;font:600 40px/1.25 ${SBODY};color:${SB.soft}}
  .schip{position:absolute;display:flex;gap:16px;align-items:center;background:${SB.card};border:2px solid ${SB.line};border-radius:22px;padding:18px 28px;font:700 40px ${SBODY};color:${SB.ink};box-shadow:0 12px 28px -16px rgba(15,23,42,.35);white-space:nowrap}
  .schip b{color:${SB.blue}}
  .scard{position:absolute;background:${SB.card};border:2px solid ${SB.line};border-radius:36px;box-shadow:0 30px 70px -30px rgba(15,23,42,.4)}
  .sshot{position:absolute;background:${SB.card};border-radius:30px;overflow:hidden;box-shadow:0 34px 70px -24px rgba(15,23,42,.35),0 0 0 8px #fff}
  .sshot .bar{height:58px;display:flex;align-items:center;gap:10px;padding:0 22px;border-bottom:2px solid ${SB.line};font:600 24px ${SBODY};color:${SB.soft};white-space:nowrap;background:#F8FAFC}
  .sshot .bar i{width:13px;height:13px;border-radius:50%;background:#CBD5E1}
  .sshot .vp{position:relative;overflow:hidden}
  .sshot .im{position:absolute;left:0;top:0;transform-origin:50% 0%}
  .sshot .im img{display:block;width:100%}
  .shl{position:absolute;border-radius:6px;background:${SB.hl};border-bottom:5px solid ${SB.blue};transform-origin:0 50%}
  .sstamp{position:absolute;display:flex;justify-content:center;width:0}
  .sstamp span{display:inline-block;white-space:nowrap;font:900 88px ${SHEAD};letter-spacing:-1px;padding:10px 30px;border:9px solid currentColor;border-radius:18px;background:rgba(255,255,255,.92)}
  .sbig{position:absolute;font:900 240px/1 ${SHEAD};letter-spacing:-8px;color:${SB.ink};white-space:nowrap}
  .scode{position:absolute;background:#0F172A;border-radius:28px;padding:34px 40px;box-shadow:0 30px 70px -30px rgba(15,23,42,.6)}
  .scode .scl{font:600 40px/1.5 ${SMONO};color:#E2E8F0;white-space:pre;height:60px}
  .scode .sch{visibility:hidden}
  .scode .scl.hl{color:#93B4FF}
  .sphoto{position:absolute;border-radius:30px;overflow:hidden;background:#CBD5E1;box-shadow:0 34px 70px -24px rgba(15,23,42,.35),0 0 0 8px #fff}
  .sphoto img{position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover;display:block}
  .scr{position:absolute;right:16px;bottom:14px;font:600 28px ${SBODY};color:#fff;background:rgba(0,0,0,.45);padding:4px 14px;border-radius:10px}
  .stable{position:absolute;background:${SB.card};border:2px solid ${SB.line};border-radius:32px;box-shadow:0 30px 70px -30px rgba(15,23,42,.4)}
  .srow{display:flex;justify-content:space-between;align-items:center;gap:30px;padding:26px 40px;border-bottom:2px solid ${SB.line};font:600 40px ${SBODY};color:${SB.soft};white-space:nowrap}
  .srow:last-child{border-bottom:0}
  .srow b{font:800 44px ${SBODY};color:${SB.ink}}
  .squote{position:absolute;background:#F1F5FF;border:2px solid ${SB.line};border-radius:32px;padding:40px 46px;box-shadow:0 30px 70px -30px rgba(15,23,42,.4)}
  .squote .q{font:800 60px/1.12 ${SHEAD};letter-spacing:-1px;color:${SB.ink}}
  .squote .w{font:600 30px ${SBODY};color:${SB.soft};margin-top:20px}
  .smk{position:relative;display:inline-block}
  .smk .smb{position:absolute;left:-6px;right:-6px;bottom:6px;height:38%;background:#C7D7FE;border-radius:6px;transform-origin:0 50%}
  .smk .smt{position:relative}`;
  document.head.appendChild(css); sEnd(); return s;
}

// ---------- parts ----------
const sPill = (par, id, x, y, txt) => D(par, `<i></i>${txt}`, `left:${x}px;top:${y}px`, id, 'spill stxt');
const sHead = (par, id, x, y, w, html, fs) => D(par, html, `left:${x}px;top:${y}px;width:${w}px${fs ? ';font-size:' + fs + 'px' : ''}`, id, 'shead stxt');
const sTag = (par, id, x, y, txt) => D(par, txt, `left:${x}px;top:${y}px`, id, 'stag stxt');
const sSub = (par, id, x, y, w, txt) => D(par, txt, `left:${x}px;top:${y}px;width:${w}px`, id, 'ssub stxt');
const sChip = (par, id, x, y, html) => D(par, html, `left:${x}px;top:${y}px`, id, 'schip stxt');
const sCard = (par, id, x, y, w, h) => D(par, '', `left:${x}px;top:${y}px;width:${w}px${h ? ';height:' + h + 'px' : ''}`, id, 'scard');
const sBig = (par, id, x, y, html, c = SB.ink) => D(par, html, `left:${x}px;top:${y}px;color:${c}`, id, 'sbig stxt');
// stamp centred on cx: STAMP(id, t) slams it in. rot in degrees, c = SB.red for problems, SB.blue / SB.ink otherwise.
const sStamp = (par, id, cx, y, txt, c = SB.red, rot = -7, fs) => D(par, `<span style="color:${c};transform:rotate(${rot}deg)${fs ? ';font-size:' + fs + 'px' : ''}">${txt}</span>`, `left:${cx}px;top:${y}px`, id, 'sstamp stxt');
function STAMP(id, t) { B(t); tl.fromTo('#' + id, { autoAlpha: 0, scale: 2.4 }, { autoAlpha: 1, scale: 1, duration: .22, ease: 'power4.in' }, t); tl.to('#' + id, { x: 8, duration: .05, yoyo: true, repeat: 3 }, t + .22); return t + .45; }
// real page screenshot in a light browser card: sShot(par, id, x, y, w, src, url, nw, nh) (nw/nh = image pixels). Card height = 58 + nh * w / nw.
// el.hl(hid, px, py, pw, ph): highlight on image pixels (hidden at 0, SHL(hid, t) sweeps it in). KB-style slow zoom: SZOOM(id, t, d, s0, s1).
function sShot(par, id, x, y, w, src, url, nw, nh, vh) {
  const k = w / nw, ih = Math.round(nh * k), h = vh || ih;
  const e = D(par, `<div class="bar"><i></i><i></i><i></i><span style="margin-left:10px">${url}</span></div>`, `left:${x}px;top:${y}px;width:${w}px;height:${58 + h}px`, id, 'sshot');
  const vp = D(e, '', `width:${w}px;height:${h}px`, id + 'vp', 'vp'); const im = D(vp, `<img src="${src}">`, `width:${w}px;height:${ih}px`, id + 'im', 'im');
  e.hl = (hid, px, py, pw, ph) => { SHLS.push(hid); return D(im, '', `left:${px * k - 6}px;top:${py * k - 4}px;width:${pw * k + 12}px;height:${ph * k + 8}px`, hid, 'shl'); };
  e.k = k; e.h = h; return e;
}
const SHLS = [];
function SHL(hid, t) { B(t); return tl.fromTo('#' + hid, { autoAlpha: 1, scaleX: 0 }, { autoAlpha: 1, scaleX: 1, duration: .45, ease: 'power2.out' }, t); }
function SZOOM(id, t, d, s0 = 1, s1 = 1.06, y0 = 0, y1 = 0) { B(t); return tl.fromTo('#' + id + 'im', { scale: s0, y: y0 }, { scale: s1, y: y1, duration: d, ease: 'none' }, t); }

// official / press photo with credit (always moving: KB). sPhoto(par, id, x, y, w, h, src, credit, pos) ; KB(id, t, d, {s,x,y}, {s,x,y})
const sPhoto = (par, id, x, y, w, h, src, credit = '', pos = '50% 50%') => D(par, `<img src="${src}" style="object-position:${pos}">` + (credit ? `<span class="scr">${credit}</span>` : ''), `left:${x}px;top:${y}px;width:${w}px;height:${h}px`, id, 'sphoto nbox');
function KB(id, t, d, a, b) { B(t); return tl.fromTo('#' + id + ' img', { scale: a.s ?? 1, x: a.x ?? 0, y: a.y ?? 0 }, { scale: b.s ?? 1, x: b.x ?? 0, y: b.y ?? 0, duration: d, ease: 'none' }, t); }
// info table: rows = [[label, value, colour?], ...]; rows are id+'r'+k (hidden at 0 by sBegin), TABLE(id, t, dt) reveals them one by one
function sTable(par, id, x, y, w, rows) { const e = D(par, '', `left:${x}px;top:${y}px;width:${w}px`, id, 'stable stxt nwq');
  rows.forEach(([l, v, c], k) => D(e, `<span>${l}</span><b style="color:${c || SB.ink}">${v}</b>`, '', id + 'r' + k, 'srow ' + id + 'r')); STABLES.push(id); return e; }
const STABLES = [];
function TABLE(id, t, dt = .35) { B(t); return tl.fromTo('.' + id + 'r', { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: .25, stagger: dt }, t); }
// quote card: html may hold <mk>words</mk> (highlighter, SMARK(id, t) sweeps it in); who = the real speaker + where it was said
function sQuote(par, id, x, y, w, html, who) { return D(par, `<div class="q">${html.replace(/<mk>(.*?)<\/mk>/g, `<span class="smk"><span class="smb ${id}mb"></span><span class="smt">$1</span></span>`)}</div><div class="w">${who}</div>`, `left:${x}px;top:${y}px;width:${w}px`, id, 'squote stxt nwq'); }
function SMARK(id, t) { B(t); return tl.fromTo('.' + id + 'mb', { scaleX: 0 }, { scaleX: 1, duration: .5, ease: 'power2.out' }, t); }
// big counter that steps through values: sCount(par, id, x, y, ['0', '46', '362'], c, fs) ; COUNT(id, t, step) (engine). The first value shows with the part.
function sCount(par, id, x, y, vals, c = SB.blue, fs = 220) { const e = D(par, '', `position:absolute;left:${x}px;top:${y}px;width:${Math.ceil(Math.max(...vals.map(v => v.length)) * fs * .62)}px;height:${Math.round(fs * 1.15)}px`, id);
  vals.forEach((v, k) => D(e, v, `position:absolute;left:0;top:0;font:900 ${fs}px/1.1 ${SHEAD};letter-spacing:-6px;color:${c};white-space:nowrap`, id + 'n' + k, id + 'n stxt')); return e; }
// svg layer the size of the frame
const sSvg = par => { const v = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); v.style.cssText = `position:absolute;left:0;top:0;width:${FW}px;height:${FH}px;overflow:visible;pointer-events:none`; par.appendChild(v); return v; };
// hand-drawn arrow from (x1,y1) to (x2,y2) with a bend; DRAW('#'+id+' path', t) or sDraw(id, t)
function sArrow(v, id, x1, y1, x2, y2, c = SB.red, bend = 60) {
  const g = S('g', { id }, v), mx = (x1 + x2) / 2 + bend, my = (y1 + y2) / 2 - bend * .4, a = Math.atan2(y2 - my, x2 - mx), L = 30;
  S('path', { class: 'draw', d: `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`, stroke: c, 'stroke-width': 9, fill: 'none', 'stroke-linecap': 'round' }, g);
  S('path', { class: 'draw', d: `M${x2 - L * Math.cos(a - .5)} ${y2 - L * Math.sin(a - .5)} L${x2} ${y2} L${x2 - L * Math.cos(a + .5)} ${y2 - L * Math.sin(a + .5)}`, stroke: c, 'stroke-width': 9, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
  SWIRES.push(id); return g;
}
// hand-drawn loop around (cx, cy)
function sCircle(v, id, cx, cy, rx, ry, c = SB.red) { const g = S('g', { id }, v);
  S('path', { class: 'draw', d: `M${cx - rx * .2} ${cy - ry} C${cx + rx * 1.1} ${cy - ry * 1.15}, ${cx + rx * 1.1} ${cy + ry * 1.05}, ${cx} ${cy + ry} S${cx - rx * 1.1} ${cy + ry * .1}, ${cx - rx * .55} ${cy - ry * .95}`, stroke: c, 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round' }, g); SWIRES.push(id); return g; }
const SWIRES = [];
const sDraw = (id, t, d = .45) => { tl.set('#' + id, { autoAlpha: 1 }, t); return DRAW('#' + id + ' .draw', t, { d, st: .12 }); };
// dark code / reasoning card with typed lines: sCode(par, id, x, y, w, lines, head) ; TYPEL(id, t, k, dt) types line k (returns end time)
function sCode(par, id, x, y, w, lines, head) {
  const e = D(par, (head ? `<div style="font:700 30px ${SBODY};letter-spacing:3px;color:#93B4FF;margin-bottom:14px">${head}</div>` : ''), `left:${x}px;top:${y}px;width:${w}px`, id, 'scode');
  lines.forEach((l, k) => D(e, [...l].map(ch => `<span class="sch ${id}c${k}">${ch}</span>`).join(''), '', id + 'l' + k, 'scl')); return e; }
function TYPEL(id, t, k, dt = .035) { B(t); const cs = document.querySelectorAll('.' + id + 'c' + k); cs.forEach((c, i) => { tl.set(c, { visibility: 'hidden' }, 0); tl.set(c, { visibility: 'visible' }, t + i * dt); }); return t + cs.length * dt; }

// ---------- scene cut: hard cut + punch-in (replaces the slow fade + drift of the long-video kit) ----------
function nlDrift(sel, t, d = 6) { tl.fromTo(sel, { scale: 1.035, transformOrigin: '50% 40%' }, { scale: 1, duration: .35, ease: 'power3.out' }, t); }
function nlNext(sel, phrase) { const t = go(phrase); tl.set(NLCUR, { autoAlpha: 0 }, t - .02); tl.set(sel, { autoAlpha: 1 }, t - .02); nlDrift(sel, t - .02); NLCUR = sel; return t; }

// ---------- end card (END .. END+TAIL) ----------
function sEnd() { const e = D(stage, '', `position:absolute;inset:0;z-index:30;background:${SBG}`, 'sE');
  const V = FH > FW, top = V ? 620 : 300;
  D(e, V ? 'New AI &amp; dev news<br>every day' : 'New AI &amp; dev news every day', `position:absolute;left:70px;right:70px;top:${top}px;text-align:center;font:800 104px/1.02 ${SHEAD};letter-spacing:-3px;color:${SB.ink}`, 'sEt');
  D(e, `<span style="display:inline-block;background:${SB.blue};color:#fff;font:800 48px ${SBODY};padding:24px 60px;border-radius:999px;box-shadow:0 18px 34px -14px ${SB.blue}">${V ? 'Follow' : 'Subscribe'}</span>`, `position:absolute;left:0;right:0;top:${top + (V ? 280 : 170)}px;text-align:center`, 'sEb'); return e; }
function sEndBeats() { const t = END + .05; tl.set('#sE', { autoAlpha: 0 }, 0); tl.set('#sE', { autoAlpha: 1 }, t); tl.fromTo('#sEt', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: .4, ease: 'power3.out' }, t); POP('#sEb', t + .35); PULSE('#sEb', t + 1.1, { s: 1.06 }); tl.set({}, {}, END + TAIL); }

function sBegin(scs) {
  nlStart(scs); NLT.push([scs[0], HEAD]);
  [...document.querySelectorAll('.nsc')].map(e => '#' + e.id).forEach(sc => { if (scs.indexOf(sc) < 0) console.error(`LOOK: scene ${sc} exists but is missing from sBegin([...])`); });
  SHLS.forEach(h => tl.set('#' + h, { autoAlpha: 0 }, 0)); SWIRES.forEach(h => tl.set('#' + h, { autoAlpha: 0 }, 0)); STABLES.forEach(h => tl.set('.' + h + 'r', { autoAlpha: 0 }, 0));
}
function sFinish() {
  if (NLCUR !== NLSC[NLSC.length - 1]) console.error(`LOOK: video ends on ${NLCUR}, not on the last scene ${NLSC[NLSC.length - 1]}`);
  tl.set(NLCUR, { autoAlpha: 0 }, END + .05); sEndBeats(); CUE(END + .05, 'whoosh'); CUE(END + .4, 'pop');
}
