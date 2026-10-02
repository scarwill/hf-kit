// ===================== HF SCENE KIT (runtime) =====================
// Needs before it: const TW=[[t,'word'],...]; const END=<sec>; const VIDEO={theme,scenes:[...]}
window.__timelines = window.__timelines || {};
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const NS = 'http://www.w3.org/2000/svg';
function S(tag, at, parent) { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); if (parent) (typeof parent === 'string' ? $(parent) : parent).appendChild(e); return e; }
function H(tag, cls, css, html, parent, id) { const e = document.createElement(tag); if (cls) e.className = cls; if (css) e.style.cssText = css; if (html != null) e.innerHTML = html; if (id) e.id = id; if (parent) (typeof parent === 'string' ? $(parent) : parent).appendChild(e); return e; }
function SVG(parent) { return S('svg', { class: 'full', viewBox: '0 0 1920 1080' }, parent); }
const fmt = t => String(t ?? '').replace(/\*(.+?)\*/g, '<span class="acc">$1</span>').replace(/_(.+?)_/g, '<span class="acc2">$1</span>');
const ICON = {
  check: (c = 'var(--good)', s = 40) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 40 40"><circle cx="20" cy="20" r="17" fill="none" stroke="${c}" stroke-width="3"/><polyline points="11,21 18,28 30,13" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  cross: (c = 'var(--bad)', s = 40) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 40 40"><circle cx="20" cy="20" r="17" fill="none" stroke="${c}" stroke-width="3"/><path d="M13 13 L27 27 M27 13 L13 27" stroke="${c}" stroke-width="4" stroke-linecap="round"/></svg>`,
  dot: (c = 'var(--acc)', s = 40) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 40 40"><circle cx="20" cy="20" r="11" fill="${c}"/></svg>`,
  warn: (c = 'var(--bad)', s = 40) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 40 40"><path d="M20 4 L37 35 L3 35 Z" fill="none" stroke="${c}" stroke-width="3" stroke-linejoin="round"/><path d="M20 15 L20 25" stroke="${c}" stroke-width="4" stroke-linecap="round"/><circle cx="20" cy="30" r="2.4" fill="${c}"/></svg>`,
  bolt: (c = 'var(--gold)', s = 40) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 40 40"><path d="M23 2 L7 23 L19 23 L16 38 L33 15 L21 15 Z" fill="${c}"/></svg>`,
};
function arrowD(x1, y1, x2, y2, h = 18) { const a = Math.atan2(y2 - y1, x2 - x1); const p = d => `${(x2 - h * Math.cos(a + d)).toFixed(1)} ${(y2 - h * Math.sin(a + d)).toFixed(1)}`; return `M${x1} ${y1} L${x2} ${y2} M${p(0.5)} L${x2} ${y2} L${p(-0.5)}`; }
const COL = ['var(--acc)', 'var(--acc2)', 'var(--gold)', 'var(--bad)', 'var(--c5)', 'var(--c6)'];

// ---------- theme ----------
const THEMES = {
  green: ['#34d399', '#22d3ee'], blue: ['#60a5fa', '#a78bfa'], orange: ['#fb923c', '#fbbf24'],
  purple: ['#a78bfa', '#f472b6'], cyan: ['#22d3ee', '#60a5fa'], red: ['#f87171', '#fb923c'],
};
const TH = THEMES[VIDEO.theme] || VIDEO.theme || THEMES.green; { const r = $('#root'); r.style.setProperty('--acc', TH[0]); r.style.setProperty('--acc2', TH[1]); }

// ---------- timing ----------
const NW = TW.map(w => w[1]);
const norm = p => p.split(/\s+/).map(w => w.toLowerCase().replace(/[^a-z0-9]/g, '')).filter(Boolean);
function findp(p, from) { const q = norm(p); for (let i = 0; i < TW.length; i++) { if (TW[i][0] < from) continue; let ok = true; for (let j = 0; j < q.length; j++) if (NW[i + j] !== q[j]) { ok = false; break; } if (ok) return TW[i][0]; } console.warn('PHRASE NOT FOUND: ' + p); return null; }
let CUR = 0, NXT = END;
function at(p, dflt) { if (typeof p === 'number') return p; if (!p) return dflt ?? CUR; const t = findp(p, CUR - 0.06); if (t === null) return dflt ?? CUR; if (t > NXT + 0.2) console.warn('PHRASE OUTSIDE SCENE: ' + p + ' @' + t); return t; }
// time for item i of n: its own `at`, else auto-spread through the scene
function T(item, i, n, start) { const s0 = start ?? CUR + .4; if (item && item.at) return at(item.at); const span = Math.max(1, NXT - s0 - 1.2); return s0 + Math.min(2.2, span / Math.max(1, n)) * i; }

// ---------- tween helpers ----------
const tl = gsap.timeline({ paused: true });
const BEATS = []; const B = t => BEATS.push(+(+t).toFixed(2));
function IN(s, t, o = {}) { B(t); return tl.fromTo(s, { autoAlpha: 0, y: o.y ?? 30, x: o.x ?? 0 }, { autoAlpha: o.to ?? 1, y: 0, x: 0, duration: o.d ?? .6, ease: o.e ?? 'power3.out', stagger: o.st ?? 0 }, t); }
function POP(s, t, o = {}) { B(t); return tl.fromTo(s, { autoAlpha: 0, scale: o.s ?? .6, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: o.d ?? .5, ease: 'back.out(1.7)', stagger: o.st ?? 0 }, t); }
function FADE(s, t, o = {}) { B(t); return tl.fromTo(s, { autoAlpha: 0 }, { autoAlpha: o.to ?? 1, duration: o.d ?? .5, stagger: o.st ?? 0 }, t); }
function OUT(s, t, o = {}) { return tl.to(s, { autoAlpha: o.to ?? 0, duration: o.d ?? .4, stagger: o.st ?? 0 }, t); }
function DIM(s, t, v = .3) { return tl.to(s, { autoAlpha: v, duration: .4 }, t); }
function DRAW(s, t, o = {}) { B(t); return tl.fromTo(s, { strokeDashoffset: (i, e) => e.__len }, { strokeDashoffset: 0, duration: o.d ?? 1, ease: o.e ?? 'power2.inOut', stagger: o.st ?? 0 }, t); }
function PULSE(s, t, o = {}) { B(t); return tl.to(s, { scale: o.s ?? 1.08, transformOrigin: '50% 50%', duration: o.d ?? .25, yoyo: true, repeat: o.r ?? 1, ease: 'sine.inOut' }, t); }
function SHAKE(s, t) { B(t); return tl.to(s, { x: 10, duration: .06, repeat: 5, yoyo: true }, t); }
function TO(s, t, v) { B(t); return tl.to(s, Object.assign({ duration: .6, ease: 'power2.inOut' }, v), t); }
function BAR(s, t, v = 1, d = 1) { B(t); return tl.fromTo(s, { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: v, duration: d, ease: 'power2.out' }, t); }
function BARY(s, t, v = 1, d = 1) { B(t); return tl.fromTo(s, { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: v, duration: d, ease: 'power2.out' }, t); }

// ---------- scene plumbing ----------
const stage = $('#stage'); const LATER = []; let NID = 0;
const uid = p => `${p}${NID++}`;
function head(s, c) { if (!c.head) return null; const id = uid('h'); H('div', 'cx h2', `top:${c.headTop ?? 60}px`, fmt(c.head), s, id); return '#' + id; }
function note(s, c) { if (!c.note) return null; const id = uid('n'); H('div', 'cx sm', `top:${c.noteTop ?? 990}px`, fmt(c.note), s, id); return '#' + id; }
function headBeats(hd, nt, c) { if (hd) IN(hd, CUR); if (nt) FADE(nt, c.noteAt ? at(c.noteAt) : CUR + 1); }

const K = {};
// ---- title: {title, sub, subAt, tag}
K.title = (s, c) => {
  const a = uid('t'), b = uid('t'), g = uid('t');
  if (c.tag) H('div', 'chip', 'left:0;right:0;margin:auto;width:fit-content;top:300px;border-color:var(--acc);color:var(--acc)', fmt(c.tag), s, g);
  H('div', 'cx h1 kmain', `top:${c.sub ? 400 : 450}px;font-size:${c.size ?? 96}px`, fmt(c.title), s, a);
  if (c.sub) H('div', 'cx h3 c-dim', 'top:560px', fmt(c.sub), s, b);
  return () => { if (c.tag) POP('#' + g, CUR); IN('#' + a, CUR + .1, { y: 40, d: .8 }); if (c.sub) IN('#' + b, at(c.subAt, CUR + 1)); };
};
// ---- statement: {lines:[{text,at,size,color}]}  big sentences stacked & centred
K.statement = (s, c) => {
  const n = c.lines.length, gap = c.gap ?? 150, top0 = 540 - (n - 1) * gap / 2 - 50, ids = [];
  c.lines.forEach((l, i) => { const id = uid('st'); ids.push(id); H('div', `cx ${l.size ?? 'h2'} kmain`, `top:${top0 + i * gap}px;${l.color ? 'color:' + l.color : ''}`, fmt(l.text), s, id); });
  return () => c.lines.forEach((l, i) => IN('#' + ids[i], T(l, i, n), { y: 30, d: .7 }));
};
// ---- cards: {head, items:[{title,sub,big,color,at}], note}
K.cards = (s, c) => {
  const hd = head(s, c), nt = note(s, c), n = c.items.length, W = n <= 2 ? 620 : n === 3 ? 500 : 400, gap = 50, x0 = (1920 - (n * W + (n - 1) * gap)) / 2, ids = [];
  c.items.forEach((it, i) => {
    const id = uid('cd'); ids.push(id); const col = it.color || COL[i % COL.length];
    H('div', 'card kmain', `left:${x0 + i * (W + gap)}px;top:${c.top ?? 280}px;width:${W}px;height:${c.h ?? 520}px;border-top:6px solid ${col};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;text-align:center`,
      `${it.big ? `<div style="font-size:${it.bigSize ?? 110}px;font-weight:800;line-height:1;color:${col}">${fmt(it.big)}</div>` : ''}<div class="h3">${fmt(it.title)}</div>${it.sub ? `<div class="sm">${fmt(it.sub)}</div>` : ''}`, s, id);
  });
  return () => { headBeats(hd, nt, c); c.items.forEach((it, i) => POP('#' + ids[i], T(it, i, n))); };
};
// ---- bars: {head, items:[{label,value,color,at,text}], max, unit, note}
K.bars = (s, c) => {
  const hd = head(s, c), nt = note(s, c), n = c.items.length, max = c.max ?? Math.max(...c.items.map(i => i.value)), BW = 1050, rowH = Math.min(150, 620 / n), y0 = 540 - n * rowH / 2 + 30, ids = [];
  c.items.forEach((it, i) => {
    const y = y0 + i * rowH, id = uid('br'), col = it.color || COL[i % COL.length], w = Math.max(6, BW * it.value / max);
    H('div', 'a h3', `left:150px;top:${y + 4}px;width:440px;font-size:36px`, fmt(it.label), s, id + 'l');
    H('div', 'a', `left:610px;top:${y}px;width:${BW}px;height:64px;border-radius:14px;background:rgba(255,255,255,.06)`, '', s, id + 'k');
    H('div', 'a kmain', `left:610px;top:${y}px;width:${w}px;height:64px;border-radius:14px;background:${col}`, '', s, id);
    H('div', 'a h3', `left:${630 + w}px;top:${y + 4}px;font-size:38px`, fmt(it.text ?? (it.value + (c.unit ?? ''))), s, id + 'v');
    ids.push(id);
  });
  return () => { headBeats(hd, nt, c); c.items.forEach((it, i) => { const t = T(it, i, n); FADE(`#${ids[i]}l,#${ids[i]}k`, t - .3); BAR('#' + ids[i], t, 1, 1); FADE('#' + ids[i] + 'v', t + .8); }); };
};
// ---- compare: {head, left:{title,color,points:[{text,at}],at}, right:{...}, vs:true, win:'left'|'right', winAt}
K.compare = (s, c) => {
  const hd = head(s, c), nt = note(s, c), side = {};
  ['left', 'right'].forEach((k, j) => {
    const d = c[k], id = uid('cp'), col = d.color || (j ? 'var(--acc)' : 'var(--c5)'), ch = c.h ?? Math.max(c.left.points?.length || 0, c.right.points?.length || 0) * 110 + 220;
    const el = H('div', 'card kmain', `left:${j ? 1000 : 120}px;top:${c.top ?? (540 - ch / 2)}px;width:800px;height:${ch}px;border:3px solid ${col}`, `<div class="h2" style="color:${col};text-align:center">${fmt(d.title)}</div>`, s, id);
    const pts = (d.points || []).map((p, i) => { const pid = uid('pt'); H('div', 'tx', 'display:flex;gap:18px;align-items:center;margin-top:34px', (p.icon === 'cross' ? ICON.cross() : p.icon === 'check' ? ICON.check() : ICON.dot(col, 30)) + `<span>${fmt(p.text)}</span>`, el, pid); return pid; });
    side[k] = { id, pts };
  });
  const vs = uid('vs'); if (c.vs !== false) H('div', 'a h2 c-dim', 'left:910px;top:520px;width:100px;text-align:center', 'vs', s, vs);
  const ch = c.h ?? Math.max(c.left.points?.length || 0, c.right.points?.length || 0) * 110 + 220;
  const wid = uid('w'); if (c.win) H('div', 'badge', `left:${c.win === 'left' ? 380 : 1260}px;top:${(c.top ?? (540 - ch / 2)) + ch - 30}px;border-color:var(--good);color:var(--good)`, ICON.check() + (c.winText ?? 'winner'), s, wid);
  return () => {
    headBeats(hd, nt, c);
    ['left', 'right'].forEach((k, j) => { const d = c[k]; const t0 = at(d.at, CUR + .3 + j * 1.5); IN('#' + side[k].id, t0, { x: j ? 60 : -60, y: 0 }); d.points?.forEach((p, i) => IN('#' + side[k].pts[i], p.at ? at(p.at) : t0 + .6 + i * .9, { x: 20, y: 0, d: .4 })); });
    if (c.vs !== false) POP('#' + vs, CUR + .8); if (c.win) POP('#' + wid, at(c.winAt, NXT - 2));
  };
};
// ---- flow: {head, steps:[{label,sub,at,color}], note}
K.flow = (s, c) => {
  const hd = head(s, c), nt = note(s, c), n = c.steps.length, W = Math.min(380, (1700 - (n - 1) * 90) / n), x0 = (1920 - (n * W + (n - 1) * 90)) / 2, y = c.y ?? 400, sv = SVG(s), ids = [], ar = [];
  c.steps.forEach((st, i) => {
    const id = uid('fl'), col = st.color || COL[i % COL.length]; ids.push(id);
    H('div', 'card kmain', `left:${x0 + i * (W + 90)}px;top:${y}px;width:${W}px;height:${c.h ?? 280}px;border:3px solid ${col};display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:14px`, `<div class="h3" style="color:${col}">${fmt(st.label)}</div>${st.sub ? `<div class="sm">${fmt(st.sub)}</div>` : ''}`, s, id);
    if (i) { const x = x0 + i * (W + 90); const p = S('path', { class: 'draw', d: arrowD(x - 80, y + (c.h ?? 280) / 2, x - 12, y + (c.h ?? 280) / 2, 16), stroke: '#e8eefc', 'stroke-width': 6, fill: 'none' }, sv); ar.push(p); }
  });
  return () => { headBeats(hd, nt, c); c.steps.forEach((st, i) => { const t = T(st, i, n); if (i) DRAW(ar[i - 1], t - .35, { d: .35 }); POP('#' + ids[i], t); }); };
};
// ---- counter: {head, values:['1×','10×','40×'], at, label, sub, color}
K.counter = (s, c) => {
  const hd = head(s, c), nt = note(s, c), od = uid('od'), col = uid('oc'), lb = uid('ol'), H0 = 240;
  const box = H('div', 'a kmain', `left:260px;top:280px;width:900px;height:${H0}px;overflow:hidden`, null, s, od);
  const cl = H('div', 'a', 'left:0;top:0;width:900px', null, box, col);
  c.values.forEach((v, i) => H('div', 'a', `left:0;top:${i * H0}px;width:900px;height:${H0}px;text-align:right;font-size:220px;font-weight:800;line-height:${H0}px;color:${c.color ?? 'var(--acc)'}`, fmt(v), cl));
  H('div', 'a kmain', 'left:1200px;top:330px;width:620px', `<div class="h2">${fmt(c.label ?? '')}</div><div class="sm" style="margin-top:8px">${fmt(c.sub ?? '')}</div>`, s, lb);
  return () => { headBeats(hd, nt, c); const t = at(c.at, CUR + .5); FADE('#' + od, CUR + .1); tl.fromTo('#' + col, { y: 0 }, { y: -(c.values.length - 1) * H0, duration: c.dur ?? 1.4, ease: 'power3.out' }, t); B(t); IN('#' + lb, t + .3, { x: 30, y: 0 }); };
};
// ---- timeline: {head, events:[{year,label,at,color}]}
K.timeline = (s, c) => {
  const hd = head(s, c), nt = note(s, c), n = c.events.length, x0 = 200, x1 = 1720, sv = SVG(s), ids = [];
  const ln = S('path', { class: 'draw', d: `M${x0} 540 L${x1} 540`, stroke: 'rgba(255,255,255,.4)', 'stroke-width': 6 }, sv);
  c.events.forEach((e, i) => {
    const x = n === 1 ? 960 : x0 + 90 + i * (x1 - x0 - 180) / (n - 1), up = i % 2 === 0, id = uid('tm'), col = e.color || COL[i % COL.length]; ids.push(id);
    H('div', 'a kmain', `left:${x - 18}px;top:522px;width:36px;height:36px;border-radius:50%;background:${col}`, '', s, id + 'd');
    H('div', 'a kmain', `left:${x - 160}px;top:${up ? 320 : 600}px;width:320px;text-align:center`, `<div class="h2" style="color:${col}">${fmt(e.year)}</div><div class="tx">${fmt(e.label)}</div>`, s, id);
  });
  return () => { headBeats(hd, nt, c); DRAW(ln, CUR + .2, { d: 1 }); c.events.forEach((e, i) => { const t = T(e, i, n, CUR + .8); POP('#' + ids[i] + 'd', t); IN('#' + ids[i], t + .1, { y: i % 2 ? -20 : 20 }); }); };
};
// ---- checklist: {head, items:[{text,ok:true|false|null,at}]}
K.checklist = (s, c) => {
  const hd = head(s, c), nt = note(s, c), n = c.items.length, rowH = Math.min(130, 700 / n), y0 = 560 - n * rowH / 2, ids = [];
  c.items.forEach((it, i) => { const id = uid('ck'); ids.push(id); H('div', 'card kmain', `left:${c.left ?? 360}px;top:${y0 + i * rowH}px;width:${c.w ?? 1200}px;height:${rowH - 22}px;display:flex;align-items:center;gap:26px;padding:0 34px`, (it.ok === true ? ICON.check('var(--good)', 50) : it.ok === false ? ICON.cross('var(--bad)', 50) : ICON.dot('var(--acc)', 50)) + `<div class="tx" style="font-weight:600;font-size:36px">${fmt(it.text)}</div>`, s, id); });
  return () => { headBeats(hd, nt, c); c.items.forEach((it, i) => IN('#' + ids[i], T(it, i, n), { x: -50, y: 0 })); };
};
// ---- tokens: {head, words:[...], at, focus:index, focusAt, arcs:true, arcsAt, weights:[...], dimAfter:true, note}
K.tokens = (s, c) => {
  const hd = head(s, c), nt = note(s, c), n = c.words.length, ws = c.words.map(w => Math.max(110, w.length * 22 + 50)), gap = 16, tot = ws.reduce((a, b) => a + b, 0) + gap * (n - 1), sc = Math.min(1, 1760 / tot), y = c.y ?? 500, sv = SVG(s), ids = [], xs = [];
  let x = (1920 - tot * sc) / 2;
  c.words.forEach((w, i) => { const id = uid('tk'); ids.push(id); xs.push(x + ws[i] * sc / 2); H('div', 'tok kmain', `left:${x}px;top:${y}px;width:${ws[i] * sc}px;height:84px;font-size:${32 * Math.max(.75, sc)}px;${i === c.focus ? 'border-color:var(--acc);color:var(--acc);box-shadow:0 0 26px var(--acc)' : ''}`, fmt(w), s, id); x += (ws[i] + gap) * sc; });
  const arcs = []; if (c.arcs && c.focus != null) for (let i = 0; i < c.focus; i++) { const x1 = xs[c.focus], x2 = xs[i], h = 2 * (40 + .22 * (x1 - x2)); arcs.push(S('path', { class: 'draw', d: `M${x1} ${y - 4} Q${(x1 + x2) / 2} ${y - 4 - h} ${x2} ${y - 4}`, stroke: 'var(--acc)', 'stroke-width': 2 + 14 * (c.weights?.[i] ?? .3), fill: 'none', 'stroke-linecap': 'round' }, sv)); }
  return () => {
    headBeats(hd, nt, c); const t0 = at(c.at, CUR + .3); IN(ids.map(i => '#' + i), t0, { st: Math.min(.25, 2 / n), y: 20, d: .4 });
    if (c.focus != null) { const tf = at(c.focusAt, t0 + 1.5); PULSE('#' + ids[c.focus], tf, { s: 1.15 }); if (c.dimAfter) DIM(ids.slice(c.focus + 1).map(i => '#' + i), tf, .3); if (arcs.length) DRAW(arcs.slice().reverse(), at(c.arcsAt, tf + .5), { st: .3, d: .7 }); }
  };
};
// ---- line chart: {head, curves:[{fn:u=>..(0..1), color, label, at}], xLabel, yLabel, note}
K.line = (s, c) => {
  const hd = head(s, c), nt = note(s, c), X0 = 300, Y0 = 900, W = 1250, Hh = 620, sv = SVG(s);
  const ax = [S('path', { class: 'draw', d: arrowD(X0, Y0, X0, Y0 - Hh - 40), stroke: '#8b97b5', 'stroke-width': 4, fill: 'none' }, sv), S('path', { class: 'draw', d: arrowD(X0, Y0, X0 + W + 50, Y0), stroke: '#8b97b5', 'stroke-width': 4, fill: 'none' }, sv)];
  const lab = uid('lx'); H('div', 'a', 'left:0;top:0', `<div class="a sm" style="left:${X0 + W - 400}px;top:${Y0 + 20}px;width:450px;text-align:right">${fmt(c.xLabel ?? '')}</div><div class="a sm" style="left:${X0 + 20}px;top:${Y0 - Hh - 50}px;width:500px">${fmt(c.yLabel ?? '')}</div>`, s, lab);
  const cv = c.curves.map((cu, i) => { const col = cu.color || COL[i % COL.length]; let d = ''; for (let u = 0; u <= 1.0001; u += .01) { const v = Math.max(-.05, Math.min(1.05, cu.fn(u))); d += `${u ? 'L' : 'M'}${(X0 + W * u).toFixed(1)} ${(Y0 - Hh * v).toFixed(1)} `; } const p = S('path', { class: 'draw kmain', d, stroke: col, 'stroke-width': 9, fill: 'none', 'stroke-linecap': 'round' }, sv); const id = uid('lb'); const ve = Math.max(0, Math.min(1, cu.fn(1))); H('div', 'badge', `left:${X0 + W - 330}px;top:${Y0 - Hh * ve - 90 + (cu.dy ?? 0)}px;border-color:${col};color:${col};font-size:28px`, fmt(cu.label ?? ''), s, id); return [p, id]; });
  return () => { headBeats(hd, nt, c); DRAW(ax, CUR + .2, { d: .6 }); FADE('#' + lab, CUR + .6); c.curves.forEach((cu, i) => { const t = T(cu, i, c.curves.length, CUR + 1); DRAW(cv[i][0], t, { d: 1.4 }); if (cu.label) POP('#' + cv[i][1], t + 1.2); }); };
};
// ---- stack: {head, layers:[{label,color,at}] (bottom first), sideL:{text,at}, sideR:{text,at}}
K.stack = (s, c) => {
  const hd = head(s, c), nt = note(s, c), n = c.layers.length, h = Math.min(90, 640 / n), ids = [];
  c.layers.forEach((l, i) => { const id = uid('sk'); ids.push(id); H('div', 'a kmain', `left:660px;top:${900 - (i + 1) * h}px;width:600px;height:${h - 12}px;border-radius:14px;background:${l.color || 'var(--acc)'};display:flex;align-items:center;justify-content:center;font-weight:800;font-size:30px;color:#06121a`, fmt(l.label), s, id); });
  const sl = uid('sl'), sr = uid('sr');
  if (c.sideL) H('div', 'a', 'left:100px;top:450px;width:520px;text-align:right', `<div class="h3">${fmt(c.sideL.text)}</div>`, s, sl);
  if (c.sideR) H('div', 'a', 'left:1300px;top:450px;width:540px', `<div class="h3">${fmt(c.sideR.text)}</div>`, s, sr);
  return () => { headBeats(hd, nt, c); c.layers.forEach((l, i) => IN('#' + ids[i], T(l, i, n), { y: -30, d: .4 })); if (c.sideL) IN('#' + sl, at(c.sideL.at, NXT - 4), { x: -30, y: 0 }); if (c.sideR) IN('#' + sr, at(c.sideR.at, NXT - 2.5), { x: 30, y: 0 }); };
};
// ---- grid: {head, n:10, stages:[{k, at, label}]}  lights k×k cells (quadratic growth)
K.grid = (s, c) => {
  const hd = head(s, c), nt = note(s, c), N = c.n ?? 10, P = Math.min(60, 640 / N), C = P - 6, GX = 760 - N * P / 2 + 200, GY = 540 - N * P / 2 + 30, cells = [];
  for (let r = 0; r < N; r++) for (let q = 0; q < N; q++) { H('div', 'a', `left:${GX + q * P}px;top:${GY + r * P}px;width:${C}px;height:${C}px;border-radius:7px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03)`, '', s); cells.push([r, q, H('div', 'a kmain', `left:${GX + q * P}px;top:${GY + r * P}px;width:${C}px;height:${C}px;border-radius:7px;background:var(--acc);box-shadow:0 0 14px var(--acc)`, '', s)]); }
  const labs = c.stages.map((st, i) => { const id = uid('gl'); H('div', 'a h3', `left:${GX + N * P + 70}px;top:${GY + 20 + i * 110}px;width:600px`, fmt(st.label ?? ''), s, id); return id; });
  return () => { headBeats(hd, nt, c); let prev = 0; c.stages.forEach((st, i) => { const t = T(st, i, c.stages.length); const add = cells.filter(([r, q]) => r < st.k && q < st.k && !(r < prev && q < prev)).sort((a, b) => (a[0] + a[1]) - (b[0] + b[1])).map(x => x[2]); POP(add, t, { st: Math.min(.05, 1.5 / add.length), d: .3 }); if (st.label) IN('#' + labs[i], t, { x: 30, y: 0 }); prev = st.k; }); };
};
// ---- box: {head, title, items:[{text, keep:true|false, at}], note}  things go into a memory box or get rejected
K.box = (s, c) => {
  const hd = head(s, c), nt = note(s, c), bx = uid('bx'), n = c.items.length, keep = c.items.filter(i => i.keep !== false).length;
  H('div', 'card kmain', `left:1080px;top:230px;width:640px;height:${Math.max(300, 140 + keep * 100)}px;border:4px solid var(--acc);background:rgba(255,255,255,.03)`, `<div class="h3 acc" style="text-align:center">${fmt(c.title ?? 'memory')}</div>`, s, bx);
  let k = 0; const ids = c.items.map((it, i) => { const id = uid('bi'); const kp = it.keep !== false; H('div', 'tok', `left:${kp ? 1120 : 200}px;top:${kp ? 330 + (k++) * 100 : 300 + i * 110}px;width:${kp ? 560 : 360}px;height:80px;${kp ? 'border-color:var(--gold);color:var(--gold)' : 'color:var(--dim)'}`, fmt(it.text), s, id); return id; });
  return () => { headBeats(hd, nt, c); FADE('#' + bx, CUR + .2); c.items.forEach((it, i) => { const t = T(it, i, n, CUR + .8); if (it.keep !== false) tl.fromTo('#' + ids[i], { autoAlpha: 0, x: -700 }, { autoAlpha: 1, x: 0, duration: .8, ease: 'power3.out' }, t); else { tl.fromTo('#' + ids[i], { autoAlpha: 0, x: -100 }, { autoAlpha: 1, x: 0, duration: .4 }, t); tl.to('#' + ids[i], { x: 300, autoAlpha: .25, duration: .6 }, t + .6); } B(t); }); };
};
// ---- options: {head, items:[{title,sub,color,at}], win:index, winAt}  last/winner glows
K.options = (s, c) => {
  const hd = head(s, c), nt = note(s, c), n = c.items.length, W = 520, x0 = (1920 - (n * W + (n - 1) * 60)) / 2, ids = [];
  c.items.forEach((it, i) => { const id = uid('op'); ids.push(id); const col = it.color || COL[i % COL.length]; H('div', 'card kmain', `left:${x0 + i * (W + 60)}px;top:260px;width:${W}px;height:560px;border:3px solid ${col};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;text-align:center`, `<div class="h3" style="color:${col}">${fmt(it.title)}</div><div class="tx">${fmt(it.sub ?? '')}</div>`, s, id); });
  return () => { headBeats(hd, nt, c); c.items.forEach((it, i) => IN('#' + ids[i], T(it, i, n), { y: 40 })); if (c.win != null) { const t = at(c.winAt, NXT - 2); TO('#' + ids[c.win], t, { scale: 1.06, boxShadow: `0 0 60px ${TH[0]}`, duration: .5 }); ids.forEach((id, i) => { if (i !== c.win) DIM('#' + id, t, .45); }); } };
};
// ---- custom: {build:(s)=>beatsFn}  for bespoke diagrams (use H/S/SVG + IN/POP/DRAW...)
K.custom = (s, c) => c.build(s, c);

// ---------- build all scenes ----------
const SCN = [];
VIDEO.scenes.forEach((c, i) => {
  const t = i === 0 ? 0 : findp(c.at, SCN.length ? SCN[SCN.length - 1].t : 0);
  if (t === null) console.warn('SCENE START NOT FOUND: ' + c.at);
  const s = H('section', 'scene', '', null, stage, 'sc' + i);
  SCN.push({ id: '#sc' + i, t: t ?? (SCN.length ? SCN[SCN.length - 1].t + 3 : 0), build: () => K[c.type](s, c), c });
});
const sc = i => { CUR = SCN[i].t; NXT = i + 1 < SCN.length ? SCN[i + 1].t : END; return CUR; };
SCN.forEach((x, i) => { sc(i); x.beats = x.build(); });
$$('.draw').forEach(p => { const L = p.getTotalLength(); p.__len = L; p.style.strokeDasharray = L + ' ' + L; p.style.strokeDashoffset = L; });
tl.set('.scene', { autoAlpha: 0 }, 0);
SCN.forEach((x, i) => {
  const t0 = Math.max(0, x.t - .2), m = i % 3, from = m === 0 ? { autoAlpha: 0, scale: .97 } : m === 1 ? { autoAlpha: 0, x: 60 } : { autoAlpha: 0, y: 40 };
  tl.fromTo(x.id, from, { autoAlpha: 1, scale: 1, x: 0, y: 0, duration: .45, ease: 'power2.out' }, t0);
  if (i < SCN.length - 1) tl.to(x.id, { autoAlpha: 0, duration: .35, ease: 'power1.in' }, SCN[i + 1].t - .05);
});
SCN.forEach((x, i) => { sc(i); B(CUR); x.beats && x.beats(); });
// auto-fill: no scene may sit still > 3.5 s -> gentle float on its main elements (y only: never scale, it breaks bars)
SCN.forEach((x, i) => {
  sc(i); const bs = BEATS.filter(b => b >= CUR - .01 && b < NXT).sort((a, b) => a - b).concat([NXT]); const mains = $$(`${x.id} .kmain`); if (!mains.length) return;
  let k = 0; for (let j = 0; j < bs.length - 1; j++) for (let t = bs[j] + 3; t < bs[j + 1] - .8; t += 3) { const el = mains[(k++) % mains.length]; tl.to(el, { y: -10, duration: .45, yoyo: true, repeat: 1, ease: 'sine.inOut' }, t); BEATS.push(+t.toFixed(2)); }
});
const orbT = (d) => Math.max(1, Math.floor(END / d) - 1);
tl.to('#orb1', { x: 500, y: 250, duration: END / (orbT(40) + 1), yoyo: true, repeat: orbT(40), ease: 'sine.inOut' }, 0);
tl.to('#orb2', { x: -600, y: -300, duration: END / (orbT(48) + 1), yoyo: true, repeat: orbT(48), ease: 'sine.inOut' }, 0);
tl.to('#orb3', { x: 300, y: 300, duration: END / (orbT(30) + 1), yoyo: true, repeat: orbT(30), ease: 'sine.inOut' }, 0);
tl.set({}, {}, END);
window.__timelines.main = tl;
window.__BEATS = BEATS; window.__SCN = SCN.map(x => [x.id, x.t]);
