// ===================== EXTRAS (reusable props + motion shortcuts, from the "human vs AI hallucination" video) =====================
// Load AFTER scenes.js:  cat premium illus life helpers icons scenes extras video.js > all.js
// Call extrasDefs(defs) once after makeWorld (adds the gRose glow used by brainG).
// Example: ../examples/dsml-hallucination-long.js
function extrasDefs(defs) { rgrad(defs, 'gRose', '#f472b6', .35); }
const XC = { rose: '#f472b6', blue: '#3b82f6', ink: '#0f172a' };

// ---------- senses / people side ----------
// eyeBig: big almond eye (blink with eyes('#id',[t]) ); earG: ear; handG: hand icon in any colour
function eyeBig(par, cx, cy, s, id) { const g = S('g', id ? { id } : {}, par); S('path', { d: `M${cx - 110 * s} ${cy} Q${cx} ${cy - 95 * s} ${cx + 110 * s} ${cy} Q${cx} ${cy + 95 * s} ${cx - 110 * s} ${cy} Z`, fill: '#f8fafc', stroke: XC.ink, 'stroke-width': 6 * s }, g); S('circle', { cx, cy, r: 46 * s, fill: XC.blue }, g); S('circle', { cx, cy, r: 22 * s, fill: XC.ink }, g); S('circle', { cx: cx - 14 * s, cy: cy - 14 * s, r: 9 * s, fill: '#fff' }, g); return g; }
function earG(par, cx, cy, s, col = '#fca5a5', id) { const g = S('g', id ? { id } : {}, par); S('path', { d: `M${cx - 20 * s} ${cy + 40 * s} Q${cx - 50 * s} ${cy - 10 * s} ${cx - 30 * s} ${cy - 45 * s} Q${cx} ${cy - 75 * s} ${cx + 30 * s} ${cy - 45 * s} Q${cx + 50 * s} ${cy - 15 * s} ${cx + 20 * s} ${cy + 15 * s} Q${cx} ${cy + 35 * s} ${cx + 5 * s} ${cy + 60 * s} Q${cx - 5 * s} ${cy + 75 * s} ${cx - 20 * s} ${cy + 40 * s} Z`, fill: col }, g); S('path', { d: `M${cx - 12 * s} ${cy - 30 * s} Q${cx + 10 * s} ${cy - 45 * s} ${cx + 18 * s} ${cy - 20 * s}`, stroke: '#0b1020', 'stroke-width': 6 * s, fill: 'none', opacity: .45 }, g); return g; }
function handG(par, cx, cy, s, col = '#fca5a5', id) { const g = S('g', id ? { id } : {}, par); ic(g, 'hand', cx, cy, 110 * s, col); return g; }
// brainG: pink human brain with soft glow; face=true adds eyes (id+'E', blink with eyes('#idE',[t])) + smile
function brainG(par, cx, cy, s, id, face = true) { const g = S('g', { id }, par); S('circle', { cx, cy, r: 170 * s, fill: 'url(#gRose)' }, g); ic(g, 'brain', cx, cy, 260 * s, XC.rose); if (face) { const e = S('g', { id: id + 'E' }, g); [-34, 34].forEach(dx => S('ellipse', { cx: cx + dx * s, cy: cy - 6 * s, rx: 11 * s, ry: 15 * s, fill: XC.ink }, e)); S('path', { d: `M${cx - 22 * s} ${cy + 30 * s} Q${cx} ${cy + 46 * s} ${cx + 22 * s} ${cy + 30 * s}`, stroke: XC.ink, 'stroke-width': 6 * s, fill: 'none', 'stroke-linecap': 'round' }, g); } return g; }
// ghostG: "something that isn't there" (hallucination, false memory, fake fact)
function ghostG(par, cx, cy, s, id) { const g = S('g', { id }, par); S('path', { d: `M${cx - 80 * s} ${cy + 110 * s} L${cx - 80 * s} ${cy - 20 * s} Q${cx - 80 * s} ${cy - 120 * s} ${cx} ${cy - 120 * s} Q${cx + 80 * s} ${cy - 120 * s} ${cx + 80 * s} ${cy - 20 * s} L${cx + 80 * s} ${cy + 110 * s} L${cx + 50 * s} ${cy + 85 * s} L${cx + 25 * s} ${cy + 110 * s} L${cx} ${cy + 85 * s} L${cx - 25 * s} ${cy + 110 * s} L${cx - 50 * s} ${cy + 85 * s} Z`, fill: '#e0e7ff', opacity: .88 }, g); [-28, 28].forEach(dx => S('ellipse', { cx: cx + dx * s, cy: cy - 30 * s, rx: 13 * s, ry: 19 * s, fill: '#1e1b4b' }, g)); S('ellipse', { cx, cy: cy + 20 * s, rx: 14 * s, ry: 18 * s, fill: '#1e1b4b' }, g); return g; }
// faceSk: simple face (eyes class 'fcE' + smile) to put on curtains, clouds, walls
function faceSk(par, cx, cy, s, id, col = '#fecdd3') { const g = S('g', { id }, par); [-26, 26].forEach(dx => S('ellipse', { class: 'fcE', cx: cx + dx * s, cy, rx: 10 * s, ry: 15 * s, fill: col }, g)); S('path', { d: `M${cx - 24 * s} ${cy + 42 * s} Q${cx} ${cy + 62 * s} ${cx + 24 * s} ${cy + 42 * s}`, stroke: col, 'stroke-width': 6 * s, fill: 'none', 'stroke-linecap': 'round' }, g); return g; }

// ---------- the "real world" ----------
function treeG(par, cx, cy, s, id) { const g = S('g', id ? { id } : {}, par); S('rect', { x: cx - 14 * s, y: cy, width: 28 * s, height: 90 * s, fill: '#92400e' }, g); [[0, -30, 70], [-45, 10, 50], [45, 10, 50]].forEach(([dx, dy, r]) => S('circle', { cx: cx + dx * s, cy: cy + dy * s, r: r * s, fill: '#22c55e' }, g)); return g; }
function sunG(par, cx, cy, r, id) { const g = S('g', id ? { id } : {}, par); S('circle', { cx, cy, r, fill: '#fde047' }, g); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; S('path', { d: `M${cx + Math.cos(a) * r * 1.3} ${cy + Math.sin(a) * r * 1.3} L${cx + Math.cos(a) * r * 1.7} ${cy + Math.sin(a) * r * 1.7}`, stroke: '#fde047', 'stroke-width': r * .22, 'stroke-linecap': 'round' }, g); } return g; }
function flowerG(par, cx, cy, r, col, id) { const g = S('g', { id }, par); for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; S('circle', { cx: cx + Math.cos(a) * r * .62, cy: cy + Math.sin(a) * r * .62, r: r * .45, fill: col }, g); } S('circle', { cx, cy, r: r * .4, fill: '#fde047' }, g); return g; }

// ---------- props ----------
// fakePaper: research-paper card with REAL text; title/author/meta texts get ids id+'t' / id+'a' / id+'m' (pop them one by one)
function fakePaper(par, x, y, w, id, title, auth, meta, col = XC.blue) { const h = w * .62; const g = S('g', { id, filter: 'url(#fSh)' }, par); S('rect', { x, y, width: w, height: h, rx: 14, fill: '#f8fafc' }, g); S('rect', { x, y, width: 14, height: h, rx: 6, fill: col }, g);
  wtext(g, x + 36, y + h * .3, title, w * .068, XC.ink, 'start', 800, id + 't'); wtext(g, x + 36, y + h * .55, auth, w * .05, '#475569', 'start', 600, id + 'a'); wtext(g, x + 36, y + h * .78, meta, w * .045, '#64748b', 'start', 600, id + 'm'); return g; }
// frameP: picture frame on a wall (draw the picture inside x+14..x+w-14)
function frameP(par, x, y, w, h, id, col = '#a16207') { const g = S('g', id ? { id } : {}, par); S('rect', { x, y, width: w, height: h, rx: 10, fill: col }, g); S('rect', { x: x + 14, y: y + 14, width: w - 28, height: h - 28, rx: 6, fill: '#0b1226' }, g); return g; }
// anchorG: anchor = grounding (senses, sources, RAG, facts). Tie a rope (CRV + DR) to (cx, cy-112*s)
function anchorG(par, cx, cy, s, col, id) { const g = S('g', id ? { id } : {}, par); S('circle', { cx, cy: cy - 90 * s, r: 22 * s, fill: 'none', stroke: col, 'stroke-width': 12 * s }, g); S('path', { d: `M${cx} ${cy - 68 * s} L${cx} ${cy + 60 * s} M${cx - 50 * s} ${cy - 30 * s} L${cx + 50 * s} ${cy - 30 * s} M${cx - 80 * s} ${cy + 10 * s} Q${cx - 70 * s} ${cy + 70 * s} ${cx} ${cy + 64 * s} Q${cx + 70 * s} ${cy + 70 * s} ${cx + 80 * s} ${cy + 10 * s}`, stroke: col, 'stroke-width': 14 * s, fill: 'none', 'stroke-linecap': 'round' }, g); return g; }
// camG: photo / video camera (red rec dot top right)
function camG(par, cx, cy, s, id) { const g = S('g', { id }, par); S('rect', { x: cx - 120 * s, y: cy - 70 * s, width: 240 * s, height: 150 * s, rx: 22 * s, fill: '#334155', stroke: XC.ink, 'stroke-width': 6 * s }, g); S('rect', { x: cx - 60 * s, y: cy - 95 * s, width: 70 * s, height: 30 * s, rx: 8 * s, fill: '#334155' }, g); S('circle', { cx, cy: cy + 5 * s, r: 52 * s, fill: '#0f172a', stroke: '#94a3b8', 'stroke-width': 8 * s }, g); S('circle', { cx, cy: cy + 5 * s, r: 24 * s, fill: XC.blue }, g); S('circle', { cx: cx + 90 * s, cy: cy - 40 * s, r: 10 * s, fill: '#ef4444' }, g); return g; }

// ---------- motion shortcuts (use inside beats) ----------
// dots + RUN: n dots travel along a wire from (x,y) by (dx,dy), repeat, then hide. Build: dots(G,x,y,3,col,'d1'); hidId('d1'). Beat: RUN('d1',dx,dy,t)
function dots(par, x, y, n, col, id, r = 10) { const g = S('g', { id }, par); for (let k = 0; k < n; k++) S('circle', { class: id + 'd', cx: x, cy: y, r, fill: col }, g); return g; }
function RUN(id, dx, dy, t, d = .8, rep = 2) { tl.set('#' + id, { autoAlpha: 1 }, t); tl.fromTo('.' + id + 'd', { x: 0, y: 0, autoAlpha: 1 }, { x: dx, y: dy, duration: d, stagger: d / 3, repeat: rep, ease: 'none' }, t); tl.set('#' + id, { autoAlpha: 0 }, t + d * (rep + 1) + d); B(t); }
// ringH + RING: hidden glow ring (build) and its pulse (beat). Use odd/any rep; it always ends invisible.
function ringH(par, cx, cy, r, col, id) { glowRing(par, cx, cy, r, col, id); hidId(id); }
const RING = (id, t, rep = 3) => { tl.fromTo('#' + id, { autoAlpha: .9, scale: .8, transformOrigin: '50% 50%' }, { autoAlpha: 0, scale: 1.35, duration: .8, repeat: rep, ease: 'power2.out' }, t); B(t); };
// sparkH + SPK: hidden spark (build) and its burst (beat)
function sparkH(par, x, y, s, col, id) { spark(par, x, y, s, col, id); hidId(id); }
const SPK = (id, t) => { POP('#' + id, t, { s: .4 }); tl.to('#' + id, { autoAlpha: 0, scale: 1.6, transformOrigin: '50% 50%', duration: .5 }, t + .45); };
// SPIN: rotate gears / molecules for d seconds (dir -1 = counter-clockwise); BOB: idle up-down bob n times
const SPIN = (sel, t, d = 12, dir = 1) => tl.to(sel, { rotation: 360 * dir * Math.max(1, Math.round(d / 6)), transformOrigin: '50% 50%', duration: d, ease: 'none' }, t);
const BOB = (sel, t, n = 5, a = -12, d = .6) => tl.to(sel, { y: a, duration: d, yoyo: true, repeat: n * 2 - 1, ease: 'sine.inOut' }, t);
// WALKER: character hidden at build (hidId(p+'B')) appears and walks in at t
const WALKER = (p, t, dx, d) => { tl.set('#' + p + 'B', { autoAlpha: 1 }, t); walkIn(p, t, dx, d); };
// lying person: wrap charB in a rotated group -> mood/blink/breathe still work
// const w = S('g', { transform: `translate(${feetX},${y}) rotate(-90)` }, G); charB(w, 0, 0, .55, 'p1', {...});   // head points left
