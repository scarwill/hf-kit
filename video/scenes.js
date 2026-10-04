// ===== scenes.js — "Infographics-Show style" kit: full colourful rooms + own characters + props =====
// Use for EVERY DSML and finance video (long and short). One area = one illustrated room (wall + floor), filled with props.
// Long: rooms are 1920x1080, floor line fy=820.  Short (--short): rooms are 1080x1920, floor fy=1500; stack top=board/screen, middle=characters, bottom=floor props.
// Examples: ../examples/dsml-infographics-long.js and dsml-infographics-short.js (same script, both formats).
const C = { ink: '#0f172a', white: '#f8fafc', bot: '#38bdf8', botD: '#0284c7', red: '#ef4444', green: '#22c55e', gold: '#fbbf24' };
let _gi = 0;
function lgr(defs, stops, x2 = 0, y2 = 1) { const id = 'lg' + (++_gi); grad(defs, id, stops, x2, y2); return `url(#${id})`; }
// full illustrated area background: wall + floor, painted with margins so the camera never shows void
// full illustrated area background: wall + floor, painted with margins so the camera never shows void (LONG or SHORT)
function scene(BG, defs, ox, oy, wall, floor, fy) {
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
  const head = S('g', {}, M); S('rect', { x: -118, y: -555, width: 236, height: 200, rx: 56, fill: '#e2e8f0' }, head); S('rect', { x: -92, y: -528, width: 184, height: 146, rx: 36, fill: C.ink }, head);
  S('path', { d: 'M0 -555 L0 -605', stroke: '#94a3b8', 'stroke-width': 9 }, head); S('circle', { id: p + 'ant', cx: 0, cy: -612, r: 15, fill: C.red }, head);
  const face = S('g', {}, M); const E = S('g', { id: p + 'E' }, face);
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
function plant(par, x, y, s = 1) { const g = S('g', {}, par); S('path', { d: `M${x - 40 * s} ${y - 70 * s} L${x + 40 * s} ${y - 70 * s} L${x + 30 * s} ${y} L${x - 30 * s} ${y} Z`, fill: '#c2410c' }, g); for (let k = 0; k < 5; k++) S('ellipse', { cx: x + (k - 2) * 16 * s, cy: y - 120 * s - Math.abs(k - 2) * -8 * s, rx: 14 * s, ry: 50 * s, fill: k % 2 ? '#16a34a' : '#22c55e', transform: `rotate(${(k - 2) * 20} ${x + (k - 2) * 16 * s} ${y - 80 * s})` }, g); return g; }
function clock(par, cx, cy, r, id) { const g = S('g', { id }, par); S('circle', { cx, cy, r, fill: '#fff', stroke: C.ink, 'stroke-width': 8 }, g); S('path', { d: `M${cx} ${cy} L${cx} ${cy - r * .6} M${cx} ${cy} L${cx + r * .45} ${cy}`, stroke: C.ink, 'stroke-width': 7, 'stroke-linecap': 'round' }, g); return g; }
function lamp(par, cx, cy, col = '#fde68a') { S('circle', { cx, cy, r: 170, fill: `url(#gLamp)` }, par); S('path', { d: `M${cx - 40} ${cy} L${cx + 40} ${cy} L${cx + 24} ${cy - 50} L${cx - 24} ${cy - 50} Z`, fill: col }, par); }
function cone(par, x, y, w, h) { S('path', { d: `M${x - 30} ${y} L${x + 30} ${y} L${x + w / 2} ${y + h} L${x - w / 2} ${y + h} Z`, fill: 'url(#gCone)' }, par); }
function token(par, x, y, t, col, id) { const g = S('g', { id }, par); const w = t.length * 21 + 44; S('rect', { x: x - w / 2, y: y - 36, width: w, height: 72, rx: 16, fill: col, stroke: C.ink, 'stroke-width': 5 }, g); txt(g, x, y + 13, t, 36, C.ink, 'middle', 700); return g; }
function book(par, x, y, col, id) { const g = S('g', { id }, par); S('rect', { x: x - 34, y: y - 44, width: 68, height: 88, rx: 8, fill: col, stroke: C.ink, 'stroke-width': 4 }, g); S('rect', { x: x - 22, y: y - 26, width: 44, height: 8, rx: 4, fill: 'rgba(255,255,255,.6)' }, g); return g; }
function docSheet(par, x, y, w, id, lines, head = '#1d4ed8') { const h = w * 1.3; const g = S('g', { id, filter: 'url(#fSh)' }, par); S('rect', { x, y, width: w, height: h, rx: 10, fill: '#fff' }, g); S('rect', { x, y, width: w, height: h * .14, rx: 10, fill: head }, g); lines.forEach((l, k) => txt(g, x + 16, y + h * .28 + k * w * .16, l, w * .1, '#334155', 'start', 600)); return g; }
function heads(par, x0, x1, y, n) { const hair = ['#5b3a29', '#2b1a12', '#c2410c', '#eab308', '#111827', '#7c4a1e']; const tops = ['#3b82f6', '#ef4444', '#22c55e', '#a855f7', '#f97316', '#14b8a6']; for (let k = 0; k < n; k++) { const x = x0 + (x1 - x0) * (k + .5) / n; S('path', { d: `M${x - 70} ${y + 140} Q${x - 70} ${y + 40} ${x} ${y + 36} Q${x + 70} ${y + 40} ${x + 70} ${y + 140} Z`, fill: tops[k % 6] }, par); S('circle', { cx: x, cy: y, r: 46, fill: hair[k % 6] }, par); } }
function crate(par, x, y, w, h, t) { S('rect', { x, y, width: w, height: h, rx: 8, fill: '#b45309', stroke: '#78350f', 'stroke-width': 6 }, par); S('path', { d: `M${x} ${y} L${x + w} ${y + h} M${x + w} ${y} L${x} ${y + h}`, stroke: '#92400e', 'stroke-width': 6 }, par); if (t) { S('rect', { x: x + w / 2 - 70, y: y + h / 2 - 28, width: 140, height: 56, rx: 10, fill: '#fef3c7' }, par); txt(par, x + w / 2, y + h / 2 + 12, t, 32, '#78350f'); } }
function bookPile(par, x, y, n) { const cols = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7']; for (let k = 0; k < n; k++) S('rect', { x: x + ((k * 13) % 20) - 10, y: y - (k + 1) * 34, width: 170 - (k % 3) * 14, height: 30, rx: 6, fill: cols[k % 5], stroke: C.ink, 'stroke-width': 3 }, par); }
