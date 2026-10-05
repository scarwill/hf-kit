// ===== scenes.js — "Infographics-Show style" kit: full colourful rooms + own characters + props =====
// Use for EVERY DSML and finance video (long and short). One area = one illustrated room (wall + floor), filled with props.
// Long: rooms are 1920x1080, floor line fy=820.  Short (--short): rooms are 1080x1920, floor fy=1500; stack top=board/screen, middle=characters, bottom=floor props.
// Examples: ../examples/dsml-infographics-long.js and dsml-infographics-short.js (same script, both formats).
const C = { ink: '#0f172a', white: '#f8fafc', bot: '#38bdf8', botD: '#0284c7', red: '#ef4444', green: '#22c55e', gold: '#fbbf24' };
let _gi = 0;
function lgr(defs, stops, x2 = 0, y2 = 1) { const id = 'lg' + (++_gi); grad(defs, id, stops, x2, y2); return `url(#${id})`; }
// full illustrated area background: wall + floor, painted with margins so the camera never shows void
// full illustrated area background: wall + floor, painted with margins so the camera never shows void (LONG or SHORT)
// ROOM THEMES. DSML videos: call useTheme('lab') once right after makeWorld -> every scene() ignores its own colours and uses the
// fixed "Midnight Lab" palette (navy / indigo / slate / dark teal rooms, dark floors; cyan accent LAB.acc). Finance: no theme (bright rooms).
const ROOM_THEMES = { lab: [[['#1e3a8a', '#0f172a'], ['#1e293b', '#020617']], [['#312e81', '#0f0a2e'], ['#1e1b4b', '#020617']], [['#334155', '#0f172a'], ['#1e293b', '#020617']], [['#134e4a', '#042f2e'], ['#0f172a', '#020617']]] };
const LAB = { acc: '#22d3ee', model: '#a855f7', data: '#3b82f6', bad: '#ef4444', good: '#22c55e', warn: '#f59e0b' };   // fixed DSML role colours
let ROOMS = null; const useTheme = n => { ROOMS = ROOM_THEMES[n] || null; };
// ROOM THEMES. DSML videos: call useTheme('lab') once right after makeWorld -> every scene() ignores its own colours and uses the
// fixed "Midnight Lab" palette (navy / indigo / slate / dark teal rooms, dark floors; cyan accent LAB.acc). Finance: no theme (bright rooms).
const ROOM_THEMES = { lab: [[['#1e3a8a', '#0f172a'], ['#1e293b', '#020617']], [['#312e81', '#0f0a2e'], ['#1e1b4b', '#020617']], [['#334155', '#0f172a'], ['#1e293b', '#020617']], [['#134e4a', '#042f2e'], ['#0f172a', '#020617']]] };
const LAB = { acc: '#22d3ee', model: '#a855f7', data: '#3b82f6', bad: '#ef4444', good: '#22c55e', warn: '#f59e0b' };   // fixed DSML role colours
let ROOMS = null; const useTheme = n => { ROOMS = ROOM_THEMES[n] || null; };
function scene(BG, defs, ox, oy, wall, floor, fy) {
  if (ROOMS) { const px = FW === 1080 ? 1500 : 2400, py = FW === 1080 ? 2400 : 1400, i = Math.round(ox / px) + 4 * Math.round(oy / py); [wall, floor] = ROOMS[i % ROOMS.length]; }
  if (ROOMS) { const px = FW === 1080 ? 1500 : 2400, py = FW === 1080 ? 2400 : 1400, i = Math.round(ox / px) + 4 * Math.round(oy / py); [wall, floor] = ROOMS[i % ROOMS.length]; }
  if (FW === 1080) { fy = fy ?? 1500;
    S('rect', { x: ox - 210, y: oy - 240, width: 1500, height: fy + 240, fill: lgr(defs, [[0, wall[0]], [1, wall[1]]]) }, BG);
    S('rect', { x: ox - 210, y: oy + fy, width: 1500, height: 2160 - fy, fill: lgr(defs, [[0, floor[0]], [1, floor[1]]]) }, BG);
    S('rect', { x: ox - 210, y: oy + fy - 6, width: 1500, height: 12, fill: 'rgba(0,0,0,.18)' }, BG); return; }
  fy = fy ?? 820;
  S('rect', { x: ox - 240, y: oy - 160, width: 2400, height: fy + 160, fill: lgr(defs, [[0, wall[0]], [1, wall[1]]]) }, BG);
  S('rect', { x: ox - 240, y: oy + fy, width: 2400, height: 1400 - fy - 160, fill: lgr(defs, [[0, floor[0]], [1, floor[1]]]) }, BG);
  S('rect', { x: ox - 240, y: oy + fy - 6, width: 2400, height: 12, fill: 'rgba(0,0,0,.18)' }, BG);
}
// friendly robot = the AI. feet at (x,y). ids like charB so mood()/blink() work: p+'B', p+'E', p+'eL/eR', p+'bL/bR', p+'mS/mW/mO/mN', p+'aL/aR'
function botB(par, x, y, s, p, col = C.bot) {
  const O = S('g', { transform: `translate(${x},${y}) scale(${s})` }, par); const M = S('g', { id: p + 'B' }, O);
  S('ellipse', { cx: 0, cy: 6, rx: 120, ry: 20, fill: 'rgba(0,0,0,.25)' }, M);
  const legs = S('g', {}, M); [-45, 45].forEach(dx => { S('rect', { x: dx - 20, y: -140, width: 40, height: 135, rx: 16, fill: '#94a3b8' }, legs); S('rect', { x: dx - 36, y: -18, width: 72, height: 24, rx: 12, fill: '#334155' }, legs); });
  const arm = (sd, id) => { const g = S('g', { id }, M); S('path', { d: `M${sd * 96} -300 Q${sd * 140} -235 ${sd * 120} -170`, stroke: '#94a3b8', 'stroke-width': 28, fill: 'none', 'stroke-linecap': 'round' }, g); S('circle', { cx: sd * 120, cy: -162, r: 22, fill: '#64748b' }, g); return g; };
  arm(-1, p + 'aL'); arm(1, p + 'aR');
  const body = S('g', {}, M); S('rect', { x: -100, y: -335, width: 200, height: 200, rx: 46, fill: col }, body); S('rect', { x: -60, y: -290, width: 120, height: 90, rx: 20, fill: C.botD }, body); S('circle', { id: p + 'core', cx: 0, cy: -245, r: 22, fill: '#fde047' }, body);
  S('rect', { x: -24, y: -365, width: 48, height: 36, fill: '#64748b' }, M);
  const HG = S('g', { id: p + 'H' }, M); const head = S('g', {}, HG); S('rect', { x: -118, y: -555, width: 236, height: 200, rx: 56, fill: '#e2e8f0' }, head); S('rect', { x: -92, y: -528, width: 184, height: 146, rx: 36, fill: C.ink }, head);
  S('path', { d: 'M0 -555 L0 -605', stroke: '#94a3b8', 'stroke-width': 9 }, head); S('circle', { id: p + 'antG', cx: 0, cy: -612, r: 40, fill: '#ef4444', opacity: 0 }, head); S('circle', { id: p + 'ant', cx: 0, cy: -612, r: 15, fill: '#94a3b8' }, head);
  const face = S('g', {}, HG); const E = S('g', { id: p + 'E' }, face);
  [['eL', -38], ['eR', 38]].forEach(([k, dx]) => { const e = S('g', { id: p + k }, E); S('ellipse', { cx: dx, cy: -470, rx: 17, ry: 22, fill: '#67e8f9' }, e); });
  S('path', { id: p + 'bL', d: 'M-60 -506 L-18 -502', stroke: '#67e8f9', 'stroke-width': 7, 'stroke-linecap': 'round' }, face);
  S('path', { id: p + 'bR', d: 'M18 -502 L60 -506', stroke: '#67e8f9', 'stroke-width': 7, 'stroke-linecap': 'round' }, face);
  S('path', { id: p + 'mS', d: 'M-28 -424 Q0 -402 28 -424', stroke: '#67e8f9', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, face);
  S('path', { id: p + 'mW', d: 'M-26 -410 Q0 -428 26 -410', stroke: '#67e8f9', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round', opacity: 0 }, face);
  S('ellipse', { id: p + 'mO', cx: 0, cy: -414, rx: 12, ry: 14, fill: '#67e8f9', opacity: 0 }, face);
  S('path', { id: p + 'mN', d: 'M-22 -414 L22 -414', stroke: '#67e8f9', 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0 }, face);
  return M;
}
function txt(par, x, y, t, fs, col, anchor = 'middle', w = 800, id) { return wtext(par, x, y, t, fs, col, anchor, w, id); }
function stamp(par, cx, cy, t, col, id, w = 560, fs = 64) { const g = S('g', { id }, par); const r = S('g', { transform: `rotate(-12 ${cx} ${cy})` }, g); S('rect', { x: cx - w / 2, y: cy - 60, width: w, height: 120, rx: 14, fill: 'rgba(254,226,226,.92)', stroke: col, 'stroke-width': 10 }, r); txt(r, cx, cy + fs * .36, t, fs, col); return g; }
function check(par, cx, cy, r, id, col = C.green) { const g = S('g', { id }, par); S('circle', { cx, cy, r, fill: col }, g); S('path', { d: `M${cx - r * .45} ${cy} L${cx - r * .1} ${cy + r * .35} L${cx + r * .5} ${cy - r * .35}`, stroke: '#fff', 'stroke-width': r * .22, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g); return g; }
function shelf(par, x, y, w, h, id) { const g = S('g', { id }, par); S('rect', { x, y, width: w, height: h, rx: 10, fill: '#7c2d12' }, g); const rows = Math.floor(h / 120); const cols = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#f97316', '#14b8a6'];
  for (let r = 0; r < rows; r++) { S('rect', { x: x + 12, y: y + 12 + r * 120 + 100, width: w - 24, height: 10, fill: '#451a03' }, g); for (let k = 0, bx = x + 20; bx < x + w - 40; k++) { const bw = 22 + ((r * 7 + k * 5) % 3) * 8, bh = 70 + ((r * 3 + k * 11) % 4) * 7; S('rect', { x: bx, y: y + 12 + r * 120 + 100 - bh, width: bw, height: bh, rx: 4, fill: cols[(r * 3 + k) % cols.length] }, g); bx += bw + 6; } } return g; }
function plant(par, x, y, s = 1) { const g = S('g', {}, par); S('path', { d: `M${x - 40 * s} ${y - 70 * s} L${x + 40 * s} ${y - 70 * s} L${x + 30 * s} ${y} L${x - 30 * s} ${y} Z`, fill: '#c2410c' }, g); const lv = S('g', { class: 'plL' }, g); for (let k = 0; k < 5; k++) S('ellipse', { cx: x + (k - 2) * 16 * s, cy: y - 120 * s - Math.abs(k - 2) * -8 * s, rx: 14 * s, ry: 50 * s, fill: k % 2 ? '#16a34a' : '#22c55e', transform: `rotate(${(k - 2) * 20} ${x + (k - 2) * 16 * s} ${y - 80 * s})` }, lv); return g; }
function clock(par, cx, cy, r, id) { const g = S('g', { id }, par); S('circle', { cx, cy, r, fill: '#fff', stroke: C.ink, 'stroke-width': 8 }, g); S('path', { d: `M${cx} ${cy} L${cx + r * .45} ${cy}`, stroke: C.ink, 'stroke-width': 7, 'stroke-linecap': 'round' }, g); const mh = S('g', { class: 'clkH' }, g); S('circle', { cx, cy, r: r * .8, fill: 'transparent' }, mh); S('path', { d: `M${cx} ${cy} L${cx} ${cy - r * .7}`, stroke: C.ink, 'stroke-width': 6, 'stroke-linecap': 'round' }, mh); return g; }
function lamp(par, cx, cy, col = '#fde68a') { S('circle', { cx, cy, r: 170, fill: `url(#gLamp)` }, par); S('path', { d: `M${cx - 40} ${cy} L${cx + 40} ${cy} L${cx + 24} ${cy - 50} L${cx - 24} ${cy - 50} Z`, fill: col }, par); }
function cone(par, x, y, w, h) { S('path', { d: `M${x - 30} ${y} L${x + 30} ${y} L${x + w / 2} ${y + h} L${x - w / 2} ${y + h} Z`, fill: 'url(#gCone)', class: 'cn' }, par); }
function token(par, x, y, t, col, id) { const g = S('g', { id }, par); const w = t.length * 21 + 44; S('rect', { x: x - w / 2, y: y - 36, width: w, height: 72, rx: 16, fill: col, stroke: C.ink, 'stroke-width': 5 }, g); txt(g, x, y + 13, t, 36, C.ink, 'middle', 700); return g; }
function book(par, x, y, col, id) { const g = S('g', { id }, par); S('rect', { x: x - 34, y: y - 44, width: 68, height: 88, rx: 8, fill: col, stroke: C.ink, 'stroke-width': 4 }, g); S('rect', { x: x - 22, y: y - 26, width: 44, height: 8, rx: 4, fill: 'rgba(255,255,255,.6)' }, g); return g; }
function docSheet(par, x, y, w, id, lines, head = '#1d4ed8') { const h = w * 1.3; const g = S('g', { id, filter: 'url(#fSh)' }, par); S('rect', { x, y, width: w, height: h, rx: 10, fill: '#fff' }, g); S('rect', { x, y, width: w, height: h * .14, rx: 10, fill: head }, g); lines.forEach((l, k) => txt(g, x + 16, y + h * .28 + k * w * .16, l, w * .1, '#334155', 'start', 600)); return g; }
function heads(par, x0, x1, y, n) { const hair = ['#5b3a29', '#2b1a12', '#c2410c', '#eab308', '#111827', '#7c4a1e']; const tops = ['#3b82f6', '#ef4444', '#22c55e', '#a855f7', '#f97316', '#14b8a6']; for (let k = 0; k < n; k++) { const x = x0 + (x1 - x0) * (k + .5) / n; const hg = S('g', { class: 'hd' }, par); S('path', { d: `M${x - 70} ${y + 140} Q${x - 70} ${y + 40} ${x} ${y + 36} Q${x + 70} ${y + 40} ${x + 70} ${y + 140} Z`, fill: tops[k % 6] }, hg); S('circle', { cx: x, cy: y, r: 46, fill: hair[k % 6] }, hg); } }
function crate(par, x, y, w, h, t) { S('rect', { x, y, width: w, height: h, rx: 8, fill: '#b45309', stroke: '#78350f', 'stroke-width': 6 }, par); S('path', { d: `M${x} ${y} L${x + w} ${y + h} M${x + w} ${y} L${x} ${y + h}`, stroke: '#92400e', 'stroke-width': 6 }, par); if (t) { S('rect', { x: x + w / 2 - 70, y: y + h / 2 - 28, width: 140, height: 56, rx: 10, fill: '#fef3c7' }, par); txt(par, x + w / 2, y + h / 2 + 12, t, 32, '#78350f'); } }
function bookPile(par, x, y, n) { const cols = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7']; for (let k = 0; k < n; k++) S('rect', { x: x + ((k * 13) % 20) - 10, y: y - (k + 1) * 34, width: 170 - (k % 3) * 14, height: 30, rx: 6, fill: cols[k % 5], stroke: C.ink, 'stroke-width': 3 }, par); }

// ===== PRO LIFE: talking mouths, gestures, close-ups, background life (works on charB people and botB robots) =====
// talk(p, from, to, base): mouth opens on every spoken word between two times (TW word timings). base = mouth to return to ('mS' happy, 'mW' worried, 'mN' neutral).
function talk(p, t0, t1, base = 'mS') { const ws = TW.filter(w => w[0] >= t0 - .01 && w[0] < t1);
  ws.forEach((w, i) => { const nx = i + 1 < ws.length ? ws[i + 1][0] : w[0] + .3, op = Math.min(.17, Math.max(.07, (nx - w[0]) * .55));
    tl.set('#' + p + 'mO', { opacity: 1, scaleY: [1, .7, 1.2][i % 3], transformOrigin: '50% 50%' }, w[0]); tl.set('#' + p + base, { opacity: 0 }, w[0]);
    tl.set('#' + p + 'mO', { opacity: 0, scaleY: 1 }, w[0] + op); tl.set('#' + p + base, { opacity: 1 }, w[0] + op); }); B(t0); }
const HD = p => { let e = document.getElementById(p + 'H'); if (!e) { e = document.getElementById(p + 'E').parentNode; e.id = p + 'H'; } return '#' + p + 'H'; };
const nod = (p, t, n = 2) => tl.to(HD(p), { rotation: 7, transformOrigin: '50% 100%', duration: .16, yoyo: true, repeat: n * 2 - 1, ease: 'sine.inOut' }, t);
const shake = (p, t, n = 2) => { tl.to(HD(p), { x: -8, duration: .1, ease: 'sine.out' }, t); tl.to(HD(p), { x: 8, duration: .16, yoyo: true, repeat: n * 2 - 1, ease: 'sine.inOut' }, t + .1); tl.to(HD(p), { x: 0, duration: .1 }, t + .1 + .16 * n * 2); };
// point(p, t, side, rot, hold): raise one arm (aR: negative rot = up/right, aL: positive) and hold
const point = (p, t, side = 'aR', rot = -80, hold = 1.4) => { tl.to('#' + p + side, { rotation: rot, transformOrigin: '50% 0%', duration: .3, ease: 'back.out(1.6)' }, t); tl.to('#' + p + side, { rotation: 0, duration: .35, ease: 'power2.inOut' }, t + hold); };
const shrug = (p, t, hold = 1) => { tl.to('#' + p + 'aL', { rotation: 45, transformOrigin: '50% 0%', duration: .25 }, t); tl.to('#' + p + 'aR', { rotation: -45, transformOrigin: '50% 0%', duration: .25 }, t); tl.to(HD(p), { rotation: -8, transformOrigin: '50% 100%', duration: .25 }, t); tl.to(['#' + p + 'aL', '#' + p + 'aR', HD(p)], { rotation: 0, duration: .3 }, t + hold); };
const jump = (p, t, h = 40) => tl.to('#' + p + 'B', { y: -h, duration: .2, yoyo: true, repeat: 1, ease: 'power2.out' }, t);
// walkIn(p, t, dx, dur): walk into place from dx (local units) with a bob and arm swing
function walkIn(p, t, dx, dur = 1.4) { const n = Math.max(2, Math.round(dur / .23)), st = dur / n;
  tl.fromTo('#' + p + 'B', { x: dx }, { x: 0, duration: dur, ease: 'power1.out', immediateRender: false }, t);
  tl.to('#' + p + 'B', { y: -12, duration: st / 2, yoyo: true, repeat: n * 2 - 1, ease: 'sine.inOut' }, t);
  tl.fromTo('#' + p + 'aL', { rotation: -16 }, { rotation: 16, transformOrigin: '50% 0%', duration: st, yoyo: true, repeat: n - 1, ease: 'sine.inOut', immediateRender: false }, t);
  tl.fromTo('#' + p + 'aR', { rotation: 16 }, { rotation: -16, transformOrigin: '50% 0%', duration: st, yoyo: true, repeat: n - 1, ease: 'sine.inOut', immediateRender: false }, t);
  tl.to(['#' + p + 'aL', '#' + p + 'aR'], { rotation: 0, duration: .2 }, t + dur); }
// eyes(sel, ts): blink any pair of eyes drawn on screens / machines (class or id selector)
const eyes = (sel, ts) => ts.forEach(t => tl.to(sel, { scaleY: .1, transformOrigin: '50% 50%', duration: .08, yoyo: true, repeat: 1 }, t));
// bgLife(): call once in beats — audience heads bob (.hd), clock minute hands turn (.clkH), plants sway (.plL), spotlights breathe (.cn), marquee bulbs blink (.bulb)
function bgLife() { const L = (sel, d, st, v) => { const n = document.querySelectorAll(sel).length; if (!n) return; const rep = Math.max(1, Math.floor((END - st * n) / d) - 1); tl.to(sel, Object.assign({ duration: d, yoyo: true, repeat: rep, stagger: st, ease: 'sine.inOut' }, v), 0); };
  L('.hd', .5, .11, { y: -9 }); L('.plL', 1.6, .3, { rotation: 4, transformOrigin: '50% 100%' }); L('.cn', 2.4, .5, { opacity: .6 }); L('.bulb', .3, .05, { opacity: .25, ease: 'none' });
  tl.to('.clkH', { rotation: 360, transformOrigin: '50% 50%', duration: END - .1, ease: 'none' }, 0); }

// ===== PRO LOOK 2: parallax foreground, whip / zoom-through transitions, bouncy landings, light mood, running gag =====
// Parallax: anything with class 'fg' (fgHeads / fgLeaves / fgBox at a room's bottom corners) is blurred and slides 35% extra
// against every camera move (CAM/CUT call FGP automatically) -> the room reads as 3D.
function FGP(t, cx, cy, d, e) { if (!document.querySelector('.fg')) return; const px = FW === 1080 ? 1500 : 2400, py = FW === 1080 ? 2400 : 1400;
  const ax = Math.round((cx - FW / 2) / px) * px + FW / 2, ay = Math.round((cy - FH / 2) / py) * py + FH / 2, v = { x: -(cx - ax) * .35, y: -(cy - ay) * .35 };
  d ? tl.to('.fg', Object.assign({ duration: d, ease: e }, v), t) : tl.set('.fg', v, t); }
function fgG(par) { const sv = par.ownerSVGElement || par; if (!sv.querySelector('#fBlur')) { const f = S('filter', { id: 'fBlur', x: '-30%', y: '-30%', width: '160%', height: '160%' }, sv.querySelector('defs')); S('feGaussianBlur', { stdDeviation: 7 }, f); } return S('g', { class: 'fg', filter: 'url(#fBlur)' }, par); }
function fgHeads(par, x, y, n = 2, s = 2.2) { const g = fgG(par); for (let k = 0; k < n; k++) { const hx = x + k * 150 * s; S('path', { d: `M${hx - 80 * s} ${y + 160 * s} Q${hx - 80 * s} ${y + 40 * s} ${hx} ${y + 36 * s} Q${hx + 80 * s} ${y + 40 * s} ${hx + 80 * s} ${y + 160 * s} Z`, fill: '#0b1020' }, g); S('circle', { cx: hx, cy: y, r: 52 * s, fill: '#111827' }, g); } return g; }
function fgLeaves(par, x, y, s = 1, flip = 1) { const g = fgG(par); for (let k = 0; k < 6; k++) S('ellipse', { cx: x + flip * k * 38 * s, cy: y - k * 22 * s, rx: 34 * s, ry: 150 * s, fill: k % 2 ? '#14532d' : '#166534', transform: `rotate(${flip * (-30 + k * 14)} ${x + flip * k * 38 * s} ${y})` }, g); return g; }
function fgBox(par, x, y, w, h, col = '#451a03') { const g = fgG(par); S('rect', { x, y, width: w, height: h, rx: 14, fill: col }, g); S('rect', { x: x + 16, y: y + 16, width: w - 32, height: 26, rx: 8, fill: 'rgba(255,255,255,.12)' }, g); return g; }
// Transitions into a new area (use at the area's first phrase t INSTEAD of CUT; then FULL/CAM out as usual):
// WHIP(t, cx,cy,z): fast pan from wherever the camera is to the new area's first shot (+ motion blur).
// ZOOMIN(t, fx,fy, cx,cy,z): dive into an object (fx,fy) of the OLD area, then cut to the new area's first shot.
function WHIP(t, cx, cy, z, d = .55) { tl.to('#world', { x: FW / 2 - cx * z, y: FH / 2 - cy * z, scale: z, duration: d, ease: 'power4.inOut' }, t - d + .05); FGP(t - d + .05, cx, cy, d, 'power4.inOut');
  tl.to('#world', { filter: 'blur(14px)', duration: d * .45, ease: 'power2.in' }, t - d + .05); tl.to('#world', { filter: 'blur(0px)', duration: d * .55, ease: 'power2.out' }, t - d * .55 + .05); B(t); }
function ZOOMIN(t, fx, fy, cx, cy, z, d = .45) { tl.to('#world', { x: FW / 2 - fx * 7, y: FH / 2 - fy * 7, scale: 7, duration: d, ease: 'power3.in' }, t - d - .05); CUT(t - .05, cx, cy, z); B(t); }
// Bouncy landing (squash & stretch) for props / people that drop or pop in
const BOING = (sel, t, o = '50% 100%') => { tl.to(sel, { scaleX: 1.16, scaleY: .84, transformOrigin: o, duration: .09, ease: 'power2.out' }, t); tl.to(sel, { scaleX: 1, scaleY: 1, duration: .6, ease: 'elastic.out(1, .4)' }, t + .09); };
// Light mood: whole frame dims on a wrong / bad moment, warm glow on a good one (NOT a vignette: even tint, ~1 s). Call moodLayer(s) once after addLife(s).
function moodLayer(s) { const m = H('div', 'a', `left:0;top:0;width:${FW}px;height:${FH}px;pointer-events:none;opacity:0;background:#0f172a`, '', s, 'moodL'); const f = document.getElementById('flash'); if (f) s.insertBefore(m, f); }
function dim(t, d = 1.2, a = .32, col = '#0f172a') { tl.set('#moodL', { backgroundColor: col }, t); tl.to('#moodL', { opacity: a, duration: .3 }, t); tl.to('#moodL', { opacity: 0, duration: .6 }, t + d); }
const glow = (t, d = .9) => dim(t, d, .16, '#fde047');
// Running gag: the robot's grey antenna flashes red whenever it is confidently wrong
function liar(p, t, n = 3) { tl.set('#' + p + 'ant', { attr: { fill: '#ef4444' } }, t); tl.to('#' + p + 'ant', { scale: 1.7, transformOrigin: '50% 50%', duration: .18, yoyo: true, repeat: n * 2 - 1 }, t); tl.to('#' + p + 'antG', { opacity: .55, scale: 1.4, transformOrigin: '50% 50%', duration: .18, yoyo: true, repeat: n * 2 - 1 }, t); tl.set('#' + p + 'ant', { attr: { fill: '#94a3b8' } }, t + .36 * n + .3); }
