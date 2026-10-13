// ===================== kurz/props.js — reusable shaded props (from the "Can humans hibernate?" long video) =====================
// Load AFTER the other kurz files:  ... kurz/neon.js kurz/mascots.js kurz/props.js video.js
// All original designs, shaded, no outlines (Kurz look). Every function draws into `par` and returns its group.
// ROOMS:     kHomeRoom(par, defs, x0, y0, w, h, {id, wall:[top,bot], floor, wx, wy, ww, wh, px:false|x, plx, curtain, rug})  bedroom; ids id+'nS' night sky, id+'dS' day sky (opacity 0), id+'sun', id+'day' morning light (opacity 0)
//            kHospRoom(par, defs, x0, y0, w, h, {id, night, wall, wx, cx, sx, opx, dx, curtain})  hospital room (window, curtain, red-cross sign, O2 panel, door)
//            kSideTable(par, cx, floorY, s, id)  bedside table + lamp;  kLabBench(par, cx, floorY, s, id);  kPanel(par, defs, x, y, w, h) -> {g, frame()} rounded split-screen panel
// PEOPLE:    kBedPerson(par, cx, floorY, s, id, {p: kBean opts, blanket, wood})  person in bed (kBean id+'p');  kAstro(par, x, feetY, s, id, kBeanOpts)  astronaut (kBean ids);  kPod(par, cx, cy, s, id, kBeanOpts) sleep pod (person id+'p')
// ANIMALS:   kBear (sleeping, ids id+'H', id+'Ec'/'Eo', id+'Bd')  kBearUp(par, cx, feetY, s, id) standing bear (id+'lL'/'lR' legs, head id+'h')  kBearHead(H, id, s)
//            kSquirrel (curled asleep)  kSquirrelUp(par, cx, feetY, s, id)  kLemur(par, cx, cy, s, id)  kMouse(par, cx, cy, s, id, col) (id+'Bd', 'Eo', 'Ec')  kFish
// BODY:      kHeart(par, cx, cy, r, id)  kLungs  kKidney  kMuscle(par, cx, cy, s, id) (shrink id+'m' with scaleX)  kBone  kNeuron(par, cx, cy, s, col, id)  kRbc(par, cx, cy, r)
//            kVessel(par, x1, x2, y, h, id)  kToxin(par, cx, cy, r, id)  kUREA (kMolecule atoms)  kEcgPanel(par, x, y, w, h, defs) + kEcg(par, x1, x2, y, gap, col, id, amp) draw-on trace
//            kThermo(par, cx, cy, s, id) (mercury id+'m', scaleY)  kIvStand(par, x, floorY, s, id)  kCoolPad(par, cx, cy, s)
// THINGS:    kMeal (plate: roti, rice, dal, sabzi)  kFoodBox / kWaterBarrel / kO2Tank (par, cx, bottomY, s)  kDrop  kToilet  kBalloons (fun)  kCalendar(par, cx, cy, s, labels[], id) (+ nCOUNT(id+'m'))
//            kStopwatch(par, cx, cy, r, id) (hand id+'h')  kAlarm  kSnowflake(par, cx, cy, r, col)  kZzz(par, x, y, s, id)  kToggle(par, cx, cy, s, id, on)  kPauseSym(par, cx, cy, s, col, id)
//            kShield(par, cx, bottomY, rx, ry, col, id)  kUWand(par, cx, cy, s, id) (waves id+'w')  kCrossM(par, cx, cy, r, id) + kXDRAW(id, t)  kZigD(x1, y1, x2, y2) zig-zag ray path  kFlame(par, cx, bottomY, s, id) (shrink id+'f')
// SPACE:     kShip(par, cx, cy, s, id) side-view craft  kShipCut(par, defs, cx, cy, w, h, id) cutaway, returns the cabin floor y  kTreadmill  kHospital(par, cx, groundY, s, id) building
// EFFECT:    kBeam(par, defs, x, feetY, id) + kBEAM(id, t0, dur)  teleport beam with rings + rising sparks (hide/squeeze the person yourself)
// Rules learned on that video: people sleep indoors (kHomeRoom), patients lie in kHospRoom, an animal stands (kBearUp) whenever the line is not about sleep.
const K_FUR = '#2e2738', K_FURD = '#17121f', K_FURL = '#5d4f72', K_MUZ = '#c79c6e';
function kBearHead(H, id, s = 1) {
  [-1, 1].forEach(sd => { const ear = S('g', id ? { id: id + 'Ear' + (sd < 0 ? 'L' : 'R') } : {}, H); kBall(ear, sd * 80 * s, -262 * s, 42 * s, K_FUR, K_FURD, K_FURL); S('circle', { cx: sd * 80 * s, cy: -262 * s, r: 19 * s, fill: '#8b6a55' }, ear); });
  kBall(H, 0, -175 * s, 115 * s, K_FUR, K_FURD, K_FURL, null, '#9d93d6');
  kShade(H, S('ellipse', { cx: 0, cy: -128 * s, rx: 62 * s, ry: 46 * s, fill: K_MUZ }, H));
  S('ellipse', { cx: 0, cy: -150 * s, rx: 24 * s, ry: 16 * s, fill: '#120d16' }, H); S('ellipse', { cx: -7 * s, cy: -155 * s, rx: 8 * s, ry: 4 * s, fill: '#ffffff', opacity: .5 }, H);
  S('path', { d: `M${-16 * s} ${-118 * s} Q0 ${-106 * s} ${16 * s} ${-118 * s}`, stroke: '#3a2418', 'stroke-width': 6 * s, fill: 'none', 'stroke-linecap': 'round' }, H);
  if (id) { const mo = S('g', { id: id + 'MO', opacity: 0 }, H); S('ellipse', { cx: 0, cy: -110 * s, rx: 24 * s, ry: 30 * s, fill: '#3a1420' }, mo); S('ellipse', { cx: 0, cy: -96 * s, rx: 14 * s, ry: 9 * s, fill: '#ff6b8a' }, mo); }
  const Ec = S('g', id ? { id: id + 'Ec' } : {}, H); [-46, 46].forEach(x => S('path', { d: `M${(x - 18) * s} ${-196 * s} Q${x * s} ${-184 * s} ${(x + 18) * s} ${-196 * s}`, stroke: '#0e0a12', 'stroke-width': 8 * s, fill: 'none', 'stroke-linecap': 'round' }, Ec));
  const Eo = S('g', Object.assign({ opacity: 0 }, id ? { id: id + 'Eo' } : {}), H); [-46, 46].forEach(x => { S('ellipse', { cx: x * s, cy: -198 * s, rx: 15 * s, ry: 17 * s, fill: '#0e0a12' }, Eo); S('circle', { cx: (x - 5) * s, cy: -204 * s, r: 6 * s, fill: '#ffffff' }, Eo); });
  return { Ec, Eo };
}
// sleeping black bear, front view, curled up. ids: id (whole), id+'H' head, id+'Ec' closed eyes, id+'Eo' open eyes
function kBear(par, cx, cy, s, id) {
  const O = S('g', { transform: `translate(${cx},${cy}) scale(${s})` }, par), M = S('g', { id }, O);
  S('ellipse', { cx: 0, cy: 0, rx: 270, ry: 28, fill: '#000', opacity: .3 }, M);
  const body = S('g', { id: id + 'Bd' }, M); kShade(body, S('path', { d: kBlobD(0, -140, 235, .12, 4, 10, .62), fill: K_FUR }, body), K_FURD, K_FURL);
  S('path', { d: kArc(0, -140, 222, 200, 300), stroke: '#8f86c9', 'stroke-width': 9, fill: 'none', opacity: .55, 'stroke-linecap': 'round', transform: 'translate(0 -140) scale(1 .62) translate(0 140)' }, body);
  const paws = S('g', {}, M);
  [-130, 130].forEach(dx => { kShade(paws, S('ellipse', { cx: dx, cy: -30, rx: 66, ry: 36, fill: K_FUR }, paws), K_FURD, K_FURL); [-24, 0, 24].forEach(t => S('ellipse', { cx: dx + t, cy: -10, rx: 10, ry: 7, fill: '#d8c3a5', opacity: .75 }, paws)); });
  const H = S('g', { id: id + 'H' }, M); kBearHead(H, id);
  return M;
}
function kFish(par, cx, cy, s, id) { const g = S('g', { id }, par);
  S('path', { d: `M${cx + 50 * s} ${cy} L${cx + 105 * s} ${cy - 45 * s} L${cx + 98 * s} ${cy + 45 * s} Z`, fill: '#e8742a' }, g);
  kShade(g, S('path', { d: `M${cx - 80 * s} ${cy} Q${cx - 10 * s} ${cy - 62 * s} ${cx + 66 * s} ${cy} Q${cx - 10 * s} ${cy + 62 * s} ${cx - 80 * s} ${cy} Z`, fill: '#ffa24a' }, g));
  S('path', { d: `M${cx - 20 * s} ${cy - 30 * s} Q${cx - 5 * s} ${cy} ${cx - 20 * s} ${cy + 30 * s}`, stroke: '#e8742a', 'stroke-width': 7 * s, fill: 'none', 'stroke-linecap': 'round' }, g);
  S('circle', { cx: cx - 46 * s, cy: cy - 10 * s, r: 9 * s, fill: '#1b1240' }, g); return g; }
function kDrop(par, cx, cy, s, id) { const g = S('g', { id }, par);
  kShade(g, S('path', { d: `M${cx} ${cy - 85 * s} C${cx + 20 * s} ${cy - 45 * s} ${cx + 62 * s} ${cy - 5 * s} ${cx + 62 * s} ${cy + 30 * s} A${62 * s} ${62 * s} 0 0 1 ${cx - 62 * s} ${cy + 30 * s} C${cx - 62 * s} ${cy - 5 * s} ${cx - 20 * s} ${cy - 45 * s} ${cx} ${cy - 85 * s} Z`, fill: '#3fc4f0' }, g), '#1c7fb8', '#d4f6ff');
  return g; }
function kToilet(par, cx, cy, s, id) { const g = S('g', { id }, par);
  kShade(g, S('rect', { x: cx - 48 * s, y: cy - 90 * s, width: 96 * s, height: 70 * s, rx: 14 * s, fill: '#dfe7f5' }, g), '#93a3c4', '#ffffff');
  kShade(g, S('path', { d: `M${cx - 78 * s} ${cy - 20 * s} L${cx + 78 * s} ${cy - 20 * s} Q${cx + 74 * s} ${cy + 40 * s} ${cx + 30 * s} ${cy + 55 * s} L${cx + 26 * s} ${cy + 85 * s} L${cx - 26 * s} ${cy + 85 * s} L${cx - 30 * s} ${cy + 55 * s} Q${cx - 74 * s} ${cy + 40 * s} ${cx - 78 * s} ${cy - 20 * s} Z`, fill: '#dfe7f5' }, g), '#93a3c4', '#ffffff');
  S('rect', { x: cx - 84 * s, y: cy - 30 * s, width: 168 * s, height: 18 * s, rx: 9 * s, fill: '#b9c6e0' }, g); return g; }
// red cross that draws on: reveal with kXDRAW
function kCrossM(par, cx, cy, r, id) { const g = S('g', { id }, par);
  [[-1, -1, 1, 1], [1, -1, -1, 1]].forEach(([a, b, c, d]) => S('path', { class: 'draw', d: `M${cx + a * r} ${cy + b * r} L${cx + c * r} ${cy + d * r}`, stroke: '#ff3b5c', 'stroke-width': 22, 'stroke-linecap': 'round', fill: 'none' }, g)); return g; }
const kXDRAW = (id, t) => { tl.set('#' + id, { autoAlpha: 1 }, t); DRAW('#' + id + ' .draw', t, { d: .25, st: .12 }); };
function kHeartD(cx, cy, r) { return `M${cx} ${cy + r * .95} C${cx - r * 1.55} ${cy - r * .05} ${cx - r * .95} ${cy - r * 1.25} ${cx} ${cy - r * .48} C${cx + r * .95} ${cy - r * 1.25} ${cx + r * 1.55} ${cy - r * .05} ${cx} ${cy + r * .95} Z`; }
function kHeart(par, cx, cy, r, id) { const g = S('g', { id }, par);
  S('path', { d: `M${cx - 20} ${cy - r * .6} Q${cx - 30} ${cy - r * 1.35} ${cx + r * .55} ${cy - r * 1.3} L${cx + r * .7} ${cy - r * .9}`, stroke: '#d6336c', 'stroke-width': 54, fill: 'none', 'stroke-linecap': 'round' }, g);
  S('path', { d: `M${cx + r * .35} ${cy - r * .55} L${cx + r * .45} ${cy - r * 1.15}`, stroke: '#6c4ad8', 'stroke-width': 46, fill: 'none', 'stroke-linecap': 'round' }, g);
  S('path', { d: `M${cx - r * .45} ${cy - r * .6} L${cx - r * .62} ${cy - r * 1.1}`, stroke: '#6c4ad8', 'stroke-width': 40, fill: 'none', 'stroke-linecap': 'round' }, g);
  kShade(g, S('path', { d: kHeartD(cx, cy, r), fill: '#ff4d6d' }, g), '#b3123f', '#ffc2cf');
  S('path', { d: `M${cx + r * .1} ${cy - r * .35} Q${cx - r * .15} ${cy + r * .2} ${cx + r * .05} ${cy + r * .75}`, stroke: '#c9184a', 'stroke-width': 10, fill: 'none', opacity: .6, 'stroke-linecap': 'round' }, g);
  S('path', { d: kArc(cx - r * .48, cy - r * .5, r * .42, 200, 280), stroke: '#ffe0e8', 'stroke-width': 12, fill: 'none', opacity: .7, 'stroke-linecap': 'round' }, g);
  return g; }
function kStopwatch(par, cx, cy, r, id) { const g = S('g', { id }, par);
  S('rect', { x: cx - 16, y: cy - r - 34, width: 32, height: 30, rx: 8, fill: '#ffd166' }, g);
  kBall(g, cx, cy, r, '#ffd166', '#c98a1a', '#fff4c4'); kBall(g, cx, cy, r * .78, '#fff8e6', '#e6d6b0', '#ffffff');
  for (let k = 0; k < 12; k++) { const [x1, y1] = kPt(cx, cy, r * .66, k * 30), [x2, y2] = kPt(cx, cy, r * .72, k * 30); S('path', { d: `M${x1} ${y1} L${x2} ${y2}`, stroke: '#7a5a20', 'stroke-width': 4, 'stroke-linecap': 'round' }, g); }
  const h = S('g', { id: id + 'h' }, g); S('path', { d: `M${cx} ${cy} L${cx} ${cy - r * .6}`, stroke: '#ff3b5c', 'stroke-width': 7, 'stroke-linecap': 'round' }, h);
  S('circle', { cx, cy, r: 8, fill: '#3a2a10' }, g); return g; }
const kUREA = [[0, 0, 40, '#8d99ae'], [0, -64, 32, '#ff5a5f'], [-62, 38, 30, '#4d7cff'], [62, 38, 30, '#4d7cff']];
function kFoodBox(par, cx, by, s, id) { const g = S('g', id ? { id } : {}, par);
  kShade(g, S('rect', { x: cx - 70 * s, y: by - 110 * s, width: 140 * s, height: 110 * s, rx: 12 * s, fill: '#d99a4e' }, g), '#8a5626', '#ffe0b0');
  S('rect', { x: cx - 76 * s, y: by - 118 * s, width: 152 * s, height: 26 * s, rx: 10 * s, fill: '#b9773a' }, g);
  S('rect', { x: cx - 12 * s, y: by - 110 * s, width: 24 * s, height: 110 * s, fill: '#f2c27a', opacity: .7 }, g); return g; }
function kWaterBarrel(par, cx, by, s, id) { const g = S('g', id ? { id } : {}, par);
  kShade(g, S('rect', { x: cx - 52 * s, y: by - 140 * s, width: 104 * s, height: 140 * s, rx: 26 * s, fill: '#3fa9f5' }, g), '#1b5fa8', '#c8ecff');
  [.3, .7].forEach(f => S('rect', { x: cx - 54 * s, y: by - 140 * s * f - 6 * s, width: 108 * s, height: 12 * s, rx: 6 * s, fill: '#1f6fbf' }, g)); return g; }
function kO2Tank(par, cx, by, s, id) { const g = S('g', id ? { id } : {}, par);
  kShade(g, S('rect', { x: cx - 34 * s, y: by - 190 * s, width: 68 * s, height: 190 * s, rx: 34 * s, fill: '#2ec4b6' }, g), '#127a70', '#c8fff6');
  S('rect', { x: cx - 12 * s, y: by - 214 * s, width: 24 * s, height: 30 * s, rx: 6 * s, fill: '#cfd8e6' }, g);
  S('rect', { x: cx - 34 * s, y: by - 120 * s, width: 68 * s, height: 30 * s, fill: '#e8eefc', opacity: .85 }, g); return g; }
// sleep pod (capsule) with a sleeping kBean inside. ids: id (whole), id+'p' person
function kPod(par, cx, cy, s, id, o = {}) { const g = S('g', { id }, par), d = kDefs(par), w = 300 * s, h = 580 * s;
  kGlow(g, cx, cy, 420 * s, NPAL.cyan, .35);
  kShade(g, S('rect', { x: cx - w / 2, y: cy - h / 2, width: w, height: h, rx: w / 2, fill: '#33407a' }, g), '#161c3e', '#7d8fd6');
  S('rect', { x: cx - w / 2 + 26 * s, y: cy - h / 2 + 26 * s, width: w - 52 * s, height: h - 52 * s, rx: (w - 52 * s) / 2, fill: kLG(d, [[0, '#0f2a4a'], [1, '#0a1630']]) }, g);
  kBean(g, cx, cy + h / 2 - 50 * s, .82 * s, id + 'p', Object.assign({ sex: 'm', hair: '#6b3e1f', hairStyle: 'short', top: '#e8eefc', pants: '#9fb3d9' }, o));
  S('rect', { x: cx - w / 2 + 26 * s, y: cy - h / 2 + 26 * s, width: w - 52 * s, height: h - 52 * s, rx: (w - 52 * s) / 2, fill: kLG(d, [[0, NPAL.cyan, .28], [1, NPAL.cyan, .08]]) }, g);
  S('rect', { x: cx - w / 2 + 50 * s, y: cy - h / 2 + 70 * s, width: 26 * s, height: h * .5, rx: 13 * s, fill: '#ffffff', opacity: .22 }, g);
  [-1, 0, 1].forEach(k => kBall(g, cx + k * 60 * s, cy + h / 2 - 14 * s, 9 * s, k ? NPAL.teal : NPAL.mag)); return g; }
// mouse, front view. ids: id (whole), id+'Bd' body group, id+'Eo' open eyes, id+'Ec' closed eyes
function kMouse(par, cx, cy, s, id, col) { const O = S('g', { transform: `translate(${cx},${cy}) scale(${s})` }, par), M = S('g', { id }, O), fur = col || '#a3abc2', furD = kDark(fur, .4), furL = kLite(fur, .55);
  S('ellipse', { cx: 0, cy: 0, rx: 190, ry: 22, fill: '#000', opacity: .3 }, M);
  S('path', { d: 'M120 -30 Q260 -20 250 -120 Q240 -190 300 -210', stroke: '#f2a0b4', 'stroke-width': 16, fill: 'none', 'stroke-linecap': 'round' }, M);
  const B = S('g', { id: id + 'Bd' }, M);
  kShade(B, S('ellipse', { cx: 0, cy: -105, rx: 150, ry: 110, fill: fur }, B), furD, furL); S('ellipse', { cx: 0, cy: -80, rx: 85, ry: 70, fill: '#d9deec', opacity: .8 }, B);
  [-70, 70].forEach(dx => S('ellipse', { cx: dx, cy: -10, rx: 34, ry: 16, fill: '#f2a0b4' }, B));
  [-1, 1].forEach(sd => { kBall(B, sd * 86, -300, 62, fur, furD, furL); kBall(B, sd * 86, -300, 38, '#f7b6c6', '#d97a93', '#ffe3ea'); });
  kBall(B, 0, -230, 95, fur, furD, furL, null, '#ffffff');
  [-1, 1].forEach(sd => [-10, 6].forEach(a => S('path', { d: `M${sd * 30} -200 L${sd * 120} ${-200 + a}`, stroke: '#e8eefc', 'stroke-width': 3, opacity: .8 }, B)));
  kBall(B, 0, -198, 15, '#ff7a9c', '#c2456a', '#ffd0dc');
  const Eo = S('g', { id: id + 'Eo' }, B); [-38, 38].forEach(x => { S('ellipse', { cx: x, cy: -246, rx: 15, ry: 18, fill: '#120d1e' }, Eo); S('circle', { cx: x - 5, cy: -253, r: 6, fill: '#ffffff' }, Eo); });
  const Ec = S('g', { id: id + 'Ec', opacity: 0 }, B); [-38, 38].forEach(x => S('path', { d: `M${x - 16} -244 Q${x} -234 ${x + 16} -244`, stroke: '#120d1e', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, Ec));
  return M; }
// fat-tailed dwarf lemur, front view. ids: id (whole), id+'Eo', id+'Ec'
function kLemur(par, cx, cy, s, id) { const O = S('g', { transform: `translate(${cx},${cy}) scale(${s})` }, par), M = S('g', { id }, O), fur = '#a88a72', furD = '#5e4636', furL = '#e7d3bf';
  S('ellipse', { cx: 0, cy: 0, rx: 150, ry: 18, fill: '#000', opacity: .3 }, M);
  S('path', { d: 'M60 -40 Q230 -30 220 -170 Q210 -280 120 -270', stroke: '#8f705a', 'stroke-width': 70, fill: 'none', 'stroke-linecap': 'round' }, M);
  S('path', { d: 'M150 -60 Q215 -100 212 -170', stroke: '#b89a82', 'stroke-width': 22, fill: 'none', 'stroke-linecap': 'round', opacity: .7 }, M);
  kShade(M, S('ellipse', { cx: 0, cy: -100, rx: 105, ry: 105, fill: fur }, M), furD, furL); S('ellipse', { cx: 0, cy: -80, rx: 60, ry: 66, fill: '#e9d9c6', opacity: .85 }, M);
  [-1, 1].forEach(sd => { kBall(M, sd * 60, -16, 26, fur, furD, furL); kBall(M, sd * 92, -282, 34, fur, furD, furL); kBall(M, sd * 92, -282, 18, '#5e4636'); });
  kBall(M, 0, -225, 92, fur, furD, furL, null, '#ffffff'); S('ellipse', { cx: 0, cy: -195, rx: 50, ry: 46, fill: '#efe2d2' }, M);
  [-40, 40].forEach(x => S('ellipse', { cx: x, cy: -240, rx: 36, ry: 34, fill: '#4a3426' }, M));
  const Eo = S('g', { id: id + 'Eo' }, M); [-40, 40].forEach(x => { S('circle', { cx: x, cy: -240, r: 24, fill: '#c46a1c' }, Eo); S('circle', { cx: x, cy: -240, r: 14, fill: '#120a06' }, Eo); S('circle', { cx: x - 8, cy: -248, r: 7, fill: '#ffffff' }, Eo); });
  const Ec = S('g', { id: id + 'Ec', opacity: 0 }, M); [-40, 40].forEach(x => S('path', { d: `M${x - 20} -238 Q${x} -226 ${x + 20} -238`, stroke: '#120a06', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, Ec));
  kBall(M, 0, -200, 13, '#2a1a12', '#120a06', '#6b4a38'); return M; }
function kThermo(par, cx, cy, s, id) { const g = S('g', { id }, par);
  kShade(g, S('rect', { x: cx - 26 * s, y: cy - 120 * s, width: 52 * s, height: 190 * s, rx: 26 * s, fill: '#e3ebfa' }, g), '#8fa0c4', '#ffffff');
  const m = S('g', { id: id + 'm' }, g); S('rect', { x: cx - 12 * s, y: cy - 95 * s, width: 24 * s, height: 175 * s, rx: 12 * s, fill: '#ff3b5c' }, m);
  kBall(g, cx, cy + 82 * s, 44 * s, '#ff3b5c', '#a3102d', '#ffb3c1');
  for (let k = 0; k < 5; k++) S('rect', { x: cx + 30 * s, y: cy - 100 * s + k * 34 * s, width: 22 * s, height: 6 * s, rx: 3 * s, fill: '#c9d4ee' }, g); return g; }
function kSnowflake(par, cx, cy, r, col) { const g = S('g', {}, par); for (let k = 0; k < 6; k++) { const [x, y] = kPt(cx, cy, r, k * 60), [a, b] = kPt(cx, cy, r * .55, k * 60);
  S('path', { d: `M${cx} ${cy} L${x} ${y}`, stroke: col, 'stroke-width': r * .16, 'stroke-linecap': 'round' }, g); [-1, 1].forEach(sd => { const [p, q] = kPt(a, b, r * .3, k * 60 + sd * 45); S('path', { d: `M${a} ${b} L${p} ${q}`, stroke: col, 'stroke-width': r * .12, 'stroke-linecap': 'round' }, g); }); } return g; }
// a few drifting "Zzz" letters (≤ 2 words of text per area)
function kZzz(par, x, y, s, id, col = '#c9d6ff') { const g = S('g', { id, class: 'kBob' }, par); wtext(g, x, y, 'Zzz', 70 * s, col, 'middle', 800); return g; }


// person in bed, seen from the foot of the bed (front view, no rotation). ids: id (whole bed group), id+'p' the kBean
function kBedPerson(par, cx, by, s, id, o = {}) {
  const g = S('g', { id }, par), d = kDefs(par), wood = o.wood || '#8a5a3c';
  const hb = S('g', {}, g); kShade(hb, S('rect', { x: cx - 190 * s, y: by - 360 * s, width: 380 * s, height: 250 * s, rx: 40 * s, fill: wood }, hb), kDark(wood, .4), kLite(wood, .35));
  const pl = S('g', {}, g); kShade(pl, S('rect', { x: cx - 150 * s, y: by - 300 * s, width: 300 * s, height: 110 * s, rx: 50 * s, fill: '#e9eefb' }, pl), '#a9b6d6', '#ffffff');
  kBean(S('g', {}, g), cx, by - 30 * s, .62 * s, id + 'p', Object.assign({ sex: 'm', hair: '#6b3e1f', hairStyle: 'short', top: '#7aa7e8' }, o.p || {}));
  const bl = S('g', { id: id + 'bl' }, g), bc = o.blanket || '#5b7bd5';
  kShade(bl, S('path', { d: `M${cx - 215 * s} ${by - 10 * s} L${cx - 205 * s} ${by - 190 * s} Q${cx} ${by - 235 * s} ${cx + 205 * s} ${by - 190 * s} L${cx + 215 * s} ${by - 10 * s} Z`, fill: bc }, bl), kDark(bc, .4), kLite(bc, .35));
  S('path', { d: `M${cx - 200 * s} ${by - 175 * s} Q${cx} ${by - 215 * s} ${cx + 200 * s} ${by - 175 * s}`, stroke: kLite(bc, .45), 'stroke-width': 18 * s, fill: 'none', 'stroke-linecap': 'round' }, bl);
  const fb = S('g', {}, g); kShade(fb, S('rect', { x: cx - 230 * s, y: by - 40 * s, width: 460 * s, height: 70 * s, rx: 18 * s, fill: kDark(wood, .1) }, fb), kDark(wood, .45), kLite(wood, .3));
  [-1, 1].forEach(sd => S('rect', { x: cx + sd * 205 * s - 12 * s, y: by + 25 * s, width: 24 * s, height: 50 * s, rx: 6 * s, fill: kDark(wood, .35) }, g));
  S('ellipse', { cx, cy: by + 78 * s, rx: 260 * s, ry: 18 * s, fill: '#000', opacity: .25 }, g);
  return g;
}
// wall calendar block; months shown by an nCounter inside (id+'m')
function kCalendar(par, cx, cy, s, months, id) { const g = S('g', { id }, par);
  kShade(g, S('rect', { x: cx - 120 * s, y: cy - 110 * s, width: 240 * s, height: 220 * s, rx: 26 * s, fill: '#f2f4fb' }, g), '#a7b1cc', '#ffffff');
  S('rect', { x: cx - 120 * s, y: cy - 110 * s, width: 240 * s, height: 64 * s, rx: 26 * s, fill: '#ff5d6c' }, g); S('rect', { x: cx - 120 * s, y: cy - 70 * s, width: 240 * s, height: 24 * s, fill: '#ff5d6c' }, g);
  [-60, 60].forEach(dx => { S('rect', { x: cx + dx * s - 8 * s, y: cy - 130 * s, width: 16 * s, height: 44 * s, rx: 8 * s, fill: '#5d6582' }, g); });
  nCounter(g, cx, cy + 52 * s, months, 84 * s, '#2a2340', id + 'm'); return g; }
// hospital building with a red cross
function kHospital(par, cx, gy, s, id) { const g = S('g', { id }, par);
  S('ellipse', { cx, cy: gy, rx: 300 * s, ry: 22 * s, fill: '#000', opacity: .3 }, g);
  kShade(g, S('rect', { x: cx - 260 * s, y: gy - 300 * s, width: 520 * s, height: 300 * s, rx: 18 * s, fill: '#e8eefc' }, g), '#97a6c8', '#ffffff');
  kShade(g, S('rect', { x: cx - 110 * s, y: gy - 420 * s, width: 220 * s, height: 140 * s, rx: 16 * s, fill: '#dfe7f7' }, g), '#97a6c8', '#ffffff');
  S('rect', { x: cx - 22 * s, y: gy - 400 * s, width: 44 * s, height: 100 * s, rx: 8 * s, fill: '#ff3b5c' }, g); S('rect', { x: cx - 50 * s, y: gy - 372 * s, width: 100 * s, height: 44 * s, rx: 8 * s, fill: '#ff3b5c' }, g);
  for (let r = 0; r < 2; r++) for (let c = 0; c < 6; c++) if (!(r === 1 && (c === 2 || c === 3))) S('rect', { x: cx - 230 * s + c * 78 * s, y: gy - 260 * s + r * 110 * s, width: 50 * s, height: 64 * s, rx: 8 * s, fill: (r + c) % 3 ? '#6fb6ff' : '#ffd166', opacity: .9 }, g);
  kShade(g, S('rect', { x: cx - 50 * s, y: gy - 120 * s, width: 100 * s, height: 120 * s, rx: 10 * s, fill: '#4a7fd6' }, g)); return g; }
// side-view spacecraft (flies right): body, modules, panels, round windows. id+'f' engine glow
function kShip(par, cx, cy, s, id) { const g = S('g', { id }, par), O = S('g', { transform: `translate(${cx} ${cy}) scale(${s})` }, g);
  const fl = S('g', { id: id + 'f' }, O); nBloom(S('path', { d: 'M-300 -34 Q-430 0 -300 34 Z', fill: NPAL.cyan }, fl)); S('path', { d: 'M-300 -18 Q-370 0 -300 18 Z', fill: '#ffffff' }, fl);
  [[-1, -150], [1, 150]].forEach(([sd, y]) => { S('rect', { x: -160, y: sd < 0 ? y - 70 : y, width: 200, height: 70, rx: 8, fill: '#2b4fa8' }, O); for (let k = 0; k < 5; k++) S('rect', { x: -150 + k * 38, y: (sd < 0 ? y - 62 : y + 8), width: 30, height: 54, rx: 4, fill: '#4f86ff', opacity: .8 }, O); S('rect', { x: -70, y: sd < 0 ? y : y - 70 + 70 - 70, width: 14, height: 70, fill: '#8a93b0' }, O); });
  const b = S('path', { d: 'M-300 -60 L180 -60 Q300 -56 330 0 Q300 56 180 60 L-300 60 Z', fill: '#e6e9f5' }, O); kShade(O, b, '#8f97b8', '#ffffff');
  kShade(O, S('rect', { x: -260, y: -84, width: 180, height: 168, rx: 30, fill: '#cfd6ea' }, O), '#8890ad', '#ffffff');
  [-200, -40, 80, 200].forEach(x => { S('circle', { cx: x, cy: 0, r: 26, fill: '#1b2a55' }, O); S('circle', { cx: x - 7, cy: -8, r: 8, fill: '#9fd8ff', opacity: .8 }, O); });
  S('rect', { x: -300, y: 20, width: 480, height: 12, fill: NPAL.mag, opacity: .8 }, O); return g; }
// lungs (two shaded lobes + trachea) — breathe by scaling id
function kLungs(par, cx, cy, s, id) { const g = S('g', { id }, par);
  S('path', { d: `M${cx} ${cy - 210 * s} L${cx} ${cy - 60 * s} M${cx} ${cy - 70 * s} L${cx - 70 * s} ${cy - 20 * s} M${cx} ${cy - 70 * s} L${cx + 70 * s} ${cy - 20 * s}`, stroke: '#f6b3c2', 'stroke-width': 26 * s, fill: 'none', 'stroke-linecap': 'round' }, g);
  [-1, 1].forEach(sd => kShade(g, S('path', { d: `M${cx + sd * 30 * s} ${cy - 120 * s} Q${cx + sd * 210 * s} ${cy - 160 * s} ${cx + sd * 220 * s} ${cy + 60 * s} Q${cx + sd * 220 * s} ${cy + 190 * s} ${cx + sd * 90 * s} ${cy + 170 * s} Q${cx + sd * 30 * s} ${cy + 140 * s} ${cx + sd * 30 * s} ${cy - 120 * s} Z`, fill: '#ff8fa8' }, g), '#c2415f', '#ffd6df'));
  return g; }
// metabolism flame (inner + outer), shrink by scaling id+'f'
function kFlame(par, cx, by, s, id) { const g = S('g', { id }, par), f = S('g', { id: id + 'f' }, g);
  kGlow(f, cx, by - 120 * s, 220 * s, '#ff9b3d', .45);
  nBloom(S('path', { d: `M${cx} ${by - 300 * s} Q${cx + 150 * s} ${by - 150 * s} ${cx + 110 * s} ${by - 40 * s} Q${cx} ${by + 20 * s} ${cx - 110 * s} ${by - 40 * s} Q${cx - 150 * s} ${by - 150 * s} ${cx} ${by - 300 * s} Z`, fill: '#ff7a2f' }, f));
  S('path', { d: `M${cx} ${by - 190 * s} Q${cx + 80 * s} ${by - 100 * s} ${cx + 55 * s} ${by - 40 * s} Q${cx} ${by} ${cx - 55 * s} ${by - 40 * s} Q${cx - 80 * s} ${by - 100 * s} ${cx} ${by - 190 * s} Z`, fill: '#ffd166' }, f);
  kShade(g, S('rect', { x: cx - 120 * s, y: by - 10 * s, width: 240 * s, height: 40 * s, rx: 16 * s, fill: '#5d4f72' }, g)); return g; }
// spiky green toxin blob
function kToxin(par, cx, cy, r, id) { const g = S('g', { id }, par); let d = '';
  for (let k = 0; k <= 16; k++) { const a = k / 16 * Math.PI * 2, rr = r * (k % 2 ? .62 : 1.05); d += (k ? 'L' : 'M') + (cx + Math.cos(a) * rr).toFixed(1) + ' ' + (cy + Math.sin(a) * rr).toFixed(1); }
  kShade(g, S('path', { d: d + 'Z', fill: '#7ddf3f', 'stroke-linejoin': 'round' }, g), '#3c8a1a', '#e2ffc4'); S('circle', { cx: cx - r * .2, cy: cy - r * .15, r: r * .14, fill: '#1e4a0c' }, g); S('circle', { cx: cx + r * .2, cy: cy - r * .15, r: r * .14, fill: '#1e4a0c' }, g); return g; }
// blood vessel tube from x1 to x2 at y (wall + lumen), cells added separately
function kVessel(par, x1, x2, y, h, id) { const g = S('g', { id }, par);
  kShade(g, S('rect', { x: x1, y: y - h / 2 - 26, width: x2 - x1, height: h + 52, rx: 40, fill: '#c2335a' }, g), '#6e1230', '#ff9ab5');
  S('rect', { x: x1 + 10, y: y - h / 2, width: x2 - x1 - 20, height: h, rx: 30, fill: '#5a0d26' }, g);
  S('rect', { x: x1 + 30, y: y - h / 2 + 10, width: x2 - x1 - 60, height: 10, rx: 5, fill: '#ff7aa0', opacity: .35 }, g); return g; }
function kRbc(par, cx, cy, r) { const g = S('g', {}, par); kShade(g, S('ellipse', { cx, cy, rx: r, ry: r * .62, fill: '#ff4d5e' }, g), '#a3122a', '#ffc0c8'); S('ellipse', { cx, cy, rx: r * .45, ry: r * .22, fill: '#c41d35', opacity: .7 }, g); return g; }
// shaded bone and muscle (for strength meters)
function kBone(par, cx, cy, s, id) { const g = S('g', { id }, par), c = '#f3ead6';
  kShade(g, S('rect', { x: cx - 110 * s, y: cy - 20 * s, width: 220 * s, height: 40 * s, rx: 20 * s, fill: c }, g), '#b9ab8a', '#ffffff');
  [-1, 1].forEach(sd => [-1, 1].forEach(v => kBall(g, cx + sd * 112 * s, cy + v * 22 * s, 30 * s, c, '#b9ab8a', '#ffffff'))); return g; }
// arctic ground squirrel curled into a ball (asleep). ids: id (whole)
function kSquirrel(par, cx, cy, s, id) { const O = S('g', { transform: `translate(${cx},${cy}) scale(${s})` }, par), M = S('g', { id }, O), fur = '#b98a5a';
  S('ellipse', { cx: 0, cy: 92, rx: 140, ry: 16, fill: '#000', opacity: .35 }, M);
  kShade(M, S('path', { d: kBlobD(0, 0, 110, .1, 3, 10, .85), fill: fur }, M), '#6e4a2a', '#f1d2a8');
  S('path', { d: 'M90 40 Q150 -20 110 -90 Q70 -130 20 -100', stroke: '#8f6640', 'stroke-width': 46, fill: 'none', 'stroke-linecap': 'round' }, M);
  for (let k = 0; k < 6; k++) S('circle', { cx: -60 + (k % 3) * 40, cy: -40 + Math.floor(k / 3) * 34, r: 9, fill: '#f6e2c4', opacity: .7 }, M);
  kBall(M, -50, 30, 48, '#c99a6a', '#7a5432', '#f6dcb8');
  [-70, -32].forEach(x => S('path', { d: `M${x - 11} 22 Q${x} 30 ${x + 11} 22`, stroke: '#2a1a0e', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, M));
  kBall(M, -50, 48, 7, '#3a2418'); kBall(M, -90, -6, 14, '#a87a4c'); kBall(M, -12, -6, 14, '#a87a4c'); return M; }
// alarm clock (waking up safely)
function kAlarm(par, cx, cy, r, id) { const g = S('g', { id }, par);
  [-1, 1].forEach(sd => kBall(g, cx + sd * r * .62, cy - r * .82, r * .32, '#ffd166', '#c98a1a', '#fff4c4'));
  kBall(g, cx, cy, r, '#ff5d6c', '#a3122a', '#ffc0c8'); kBall(g, cx, cy, r * .78, '#fff8e6', '#e6d6b0', '#ffffff');
  S('path', { d: `M${cx} ${cy} L${cx} ${cy - r * .55} M${cx} ${cy} L${cx + r * .4} ${cy + r * .15}`, stroke: '#3a2a10', 'stroke-width': r * .1, 'stroke-linecap': 'round' }, g); return g; }
// kidney bean shape
function kKidney(par, cx, cy, s, id) { const g = S('g', { id }, par);
  kShade(g, S('path', { d: `M${cx - 30 * s} ${cy - 90 * s} Q${cx + 80 * s} ${cy - 110 * s} ${cx + 90 * s} ${cy} Q${cx + 80 * s} ${cy + 110 * s} ${cx - 30 * s} ${cy + 90 * s} Q${cx - 90 * s} ${cy + 60 * s} ${cx - 40 * s} ${cy + 10 * s} Q${cx - 20 * s} ${cy} ${cx - 40 * s} ${cy - 10 * s} Q${cx - 90 * s} ${cy - 60 * s} ${cx - 30 * s} ${cy - 90 * s} Z`, fill: '#c2415f' }, g), '#6e1230', '#ff9ab5'); return g; }
// ultrasound wand with wave arcs (id+'w' arcs, draw-on)
function kUWand(par, cx, cy, s, id) { const g = S('g', { id }, par);
  kShade(g, S('rect', { x: cx - 40 * s, y: cy - 220 * s, width: 80 * s, height: 180 * s, rx: 30 * s, fill: '#cfd8ea' }, g), '#7d89a8', '#ffffff');
  kShade(g, S('path', { d: `M${cx - 70 * s} ${cy - 50 * s} L${cx + 70 * s} ${cy - 50 * s} L${cx + 50 * s} ${cy} L${cx - 50 * s} ${cy} Z`, fill: '#5b7bd5' }, g));
  const w = S('g', { id: id + 'w' }, g); [40, 80, 120].forEach(r => S('path', { class: 'draw', d: kArc(cx, cy - 10 * s, r * s, 40, 140), stroke: NPAL.cyan, 'stroke-width': 9 * s, fill: 'none', 'stroke-linecap': 'round', opacity: .9 }, w)); return g; }
// toggle switch (on knob id+'on', off knob id+'off')
function kToggle(par, cx, cy, s, id, on = true) { const g = S('g', { id }, par);
  kShade(g, S('rect', { x: cx - 90 * s, y: cy - 38 * s, width: 180 * s, height: 76 * s, rx: 38 * s, fill: '#1b2a44' }, g), '#0a1220', '#3d5a85');
  const a = S('g', { id: id + 'on', opacity: on ? 1 : 0 }, g); kGlow(a, cx + 50 * s, cy, 70 * s, '#4dffb8', .6); kBall(a, cx + 50 * s, cy, 30 * s, '#4dffb8', '#1a9a6a', '#d9fff0');
  const b = S('g', { id: id + 'off', opacity: on ? 0 : 1 }, g); kBall(b, cx - 50 * s, cy, 30 * s, '#8a93b0', '#4a5270', '#dfe4f2'); return g; }
// neuron: soma + dendrites
function kNeuron(par, cx, cy, s, col, id) { const g = S('g', { id }, par);
  for (let k = 0; k < 6; k++) { const a = k * 60 + 15, [x, y] = kPt(cx, cy, 70 * s, a), [x2, y2] = kPt(cx, cy, 110 * s, a + 18); S('path', { d: `M${cx} ${cy} Q${x} ${y} ${x2} ${y2}`, stroke: kLite(col, .2), 'stroke-width': 9 * s, fill: 'none', 'stroke-linecap': 'round' }, g); }
  kGlow(g, cx, cy, 70 * s, col, .5); kBall(g, cx, cy, 30 * s, col, null, null, null, '#ffffff'); return g; }
// IV drip stand
function kIvStand(par, x, by, s, id) { const g = S('g', { id }, par);
  S('rect', { x: x - 6 * s, y: by - 520 * s, width: 12 * s, height: 520 * s, fill: '#9aa3bd' }, g); S('rect', { x: x - 80 * s, y: by - 10 * s, width: 160 * s, height: 14 * s, rx: 7 * s, fill: '#7d86a3' }, g);
  S('path', { d: `M${x - 50 * s} ${by - 500 * s} L${x + 50 * s} ${by - 500 * s}`, stroke: '#9aa3bd', 'stroke-width': 8 * s }, g);
  kShade(g, S('rect', { x: x + 14 * s, y: by - 490 * s, width: 70 * s, height: 110 * s, rx: 20 * s, fill: '#cfe9ff' }, g), '#7fa9d1', '#ffffff');
  S('rect', { x: x + 22 * s, y: by - 440 * s, width: 54 * s, height: 50 * s, rx: 12 * s, fill: '#ffe08a', opacity: .9 }, g); return g; }
// cooling pad (blue gel pack)
function kCoolPad(par, cx, cy, s) { const g = S('g', {}, par); kShade(g, S('rect', { x: cx - 70 * s, y: cy - 34 * s, width: 140 * s, height: 68 * s, rx: 22 * s, fill: '#5ecbff' }, g), '#1c7fb8', '#e0f7ff'); kSnowflake(g, cx, cy, 20 * s, '#ffffff'); return g; }
// treadmill
function kTreadmill(par, cx, by, s, id) { const g = S('g', { id }, par);
  kShade(g, S('rect', { x: cx - 150 * s, y: by - 40 * s, width: 300 * s, height: 40 * s, rx: 18 * s, fill: '#3b4466' }, g), '#1b2038', '#6d7aa6');
  S('rect', { x: cx + 110 * s, y: by - 220 * s, width: 18 * s, height: 190 * s, rx: 8 * s, fill: '#6d7aa6' }, g); S('rect', { x: cx + 60 * s, y: by - 230 * s, width: 90 * s, height: 22 * s, rx: 10 * s, fill: '#8a96c4' }, g); return g; }
// pause symbol + shield dome
function kPauseSym(par, cx, cy, s, col, id) { const g = S('g', { id }, par); kGlow(g, cx, cy, 90 * s, col, .5); [-1, 1].forEach(sd => kShade(g, S('rect', { x: cx + sd * 26 * s - 14 * s, y: cy - 48 * s, width: 28 * s, height: 96 * s, rx: 10 * s, fill: col }, g))); return g; }
function kShield(par, cx, by, rx, ry, col, id) { const g = S('g', { id }, par);
  S('path', { d: `M${cx - rx} ${by} A${rx} ${ry} 0 0 1 ${cx + rx} ${by} Z`, fill: col, opacity: .16 }, g);
  nBloom(S('path', { d: `M${cx - rx} ${by} A${rx} ${ry} 0 0 1 ${cx + rx} ${by}`, stroke: col, 'stroke-width': 10, fill: 'none', opacity: .8 }, g));
  S('path', { d: kArc(cx, by, Math.min(rx, ry) * .82, 205, 250), stroke: '#ffffff', 'stroke-width': 10, fill: 'none', opacity: .45, 'stroke-linecap': 'round' }, g); return g; }
// generic ECG trace path (draw-on): beats every gap px; flat = no beats
function kEcg(par, x1, x2, y, gap, col, id, amp = 1) { let d = `M${x1} ${y}`;
  if (gap) for (let x = x1 + 40; x < x2 - 80; x += gap) d += ` L${x} ${y} L${x + 14} ${y - 40 * amp} L${x + 28} ${y + 50 * amp} L${x + 44} ${y - 80 * amp} L${x + 60} ${y + 20 * amp} L${x + 74} ${y}`;
  if (!gap) d += ` L${(x1 + x2) / 2} ${y - 1.5} L${(x1 + x2) / 2 + 4} ${y}`; d += ` L${x2} ${y}`; return nBloom(S('path', { id, class: 'draw', d, stroke: col, 'stroke-width': 7, fill: 'none', 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, par)); }
function kEcgPanel(par, x, y, w, h, defs) { S('rect', { x, y: y + 6, width: w, height: h, rx: 34, fill: '#0b0412', opacity: .55 }, par); S('rect', { x, y, width: w, height: h, rx: 34, fill: kLG(defs, [[0, '#2a1240'], [1, '#160a26']]) }, par); }
// zig-zag radiation ray path from (x1,y1) to (x2,y2)
function kZigD(x1, y1, x2, y2, n = 7, a = 26) { const dx = (x2 - x1) / n, dy = (y2 - y1) / n, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L; let d = `M${x1} ${y1}`;
  for (let k = 1; k < n; k++) { const s = k % 2 ? a : -a; d += ` L${x1 + dx * k + nx * s} ${y1 + dy * k + ny * s}`; } return d + ` L${x2} ${y2}`; }

// bedroom interior filling the rect (x0,y0,w,h). o = {id, wall:[top,bot], floor, wx (window centre x, frame coords inside rect), night: true}
// ids: id+'nS' night sky in the window, id+'dS' day sky (hidden), id+'day' warm morning light overlay (hidden), id+'lamp' lamp glow
function kHomeRoom(par, defs, x0, y0, w, h, o = {}) {
  const id = o.id || 'room', g = S('g', { id }, par), fy = y0 + h * .7, wall = o.wall || ['#3b3170', '#251d52'], fl = o.floor || '#5a3b2e';
  S('rect', { x: x0, y: y0, width: w, height: fy - y0, fill: kLG(defs, [[0, wall[0]], [1, wall[1]]]) }, g);
  for (let k = 0; k < Math.ceil(w / 70); k++) S('rect', { x: x0 + k * 70, y: y0, width: 34, height: fy - y0, fill: '#ffffff', opacity: .025 }, g);   // wallpaper stripes
  S('rect', { x: x0, y: fy - 120, width: w, height: 120, fill: kDark(wall[1], .25) }, g); S('rect', { x: x0, y: fy - 126, width: w, height: 12, fill: kLite(wall[1], .2) }, g);
  S('rect', { x: x0, y: fy, width: w, height: y0 + h - fy, fill: kLG(defs, [[0, kLite(fl, .1)], [1, kDark(fl, .3)]]) }, g);
  for (let k = 1; k < 7; k++) { const yy = fy + (y0 + h - fy) * Math.pow(k / 7, 1.4); S('path', { d: `M${x0} ${yy} L${x0 + w} ${yy}`, stroke: kDark(fl, .35), 'stroke-width': 3, opacity: .6 }, g); }
  S('rect', { x: x0, y: fy - 6, width: w, height: 18, fill: kDark(fl, .45) }, g);
  // window
  const ww = o.ww || 420, wh = o.wh || 340, wx = x0 + (o.wx ?? w * .74), wy = y0 + (o.wy ?? h * .3);
  const glass = S('rect', { x: wx - ww / 2, y: wy - wh / 2, width: ww, height: wh, rx: 16 }, defs), gc = S('g', { 'clip-path': kClip(defs, glass) }, g);
  const nS = S('g', { id: id + 'nS' }, gc); S('rect', { x: wx - ww / 2, y: wy - wh / 2, width: ww, height: wh, fill: kLG(defs, [[0, '#0d1440'], [1, '#2a3a80']]) }, nS);
  for (let k = 0; k < 26; k++) S('circle', { cx: wx - ww / 2 + rnd(k * 3 + 7) * ww, cy: wy - wh / 2 + rnd(k * 5 + 2) * wh * .6, r: 1.5 + rnd(k) * 2, fill: '#ffffff', opacity: .5 + rnd(k * 9) * .5 }, nS);
  kBall(nS, wx + ww * .25, wy - wh * .22, 34, '#f3f0ff', '#b9b3e6', '#ffffff');
  const dS = S('g', { id: id + 'dS', opacity: 0 }, gc); S('rect', { x: wx - ww / 2, y: wy - wh / 2, width: ww, height: wh, fill: kLG(defs, [[0, '#7fc4ff'], [1, '#ffe2b8']]) }, dS);
  const sun = S('g', { id: id + 'sun' }, dS); kGlow(sun, wx - ww * .2, wy - wh * .05, 120, '#ffd166', .6); kBall(sun, wx - ww * .2, wy - wh * .05, 40, '#fff1b8', '#ffd166', '#ffffff');
  [nS, dS].forEach((G2, k) => { [[-.35, .9], [-.05, .7], [.3, .85]].forEach(([dx, sc]) => kPine(G2, wx + dx * ww, wy + wh / 2 - 30, sc, k ? '#2f6b55' : '#1c3358'));
    S('path', { d: `M${wx - ww / 2} ${wy + wh / 2 - 40} Q${wx} ${wy + wh / 2 - 70} ${wx + ww / 2} ${wy + wh / 2 - 40} L${wx + ww / 2} ${wy + wh / 2} L${wx - ww / 2} ${wy + wh / 2} Z`, fill: k ? '#f4f8ff' : '#c9d8f2' }, G2); });
  const fr = S('g', {}, g); [[wx - ww / 2 - 18, wy - wh / 2 - 18, ww + 36, 22], [wx - ww / 2 - 18, wy + wh / 2 - 4, ww + 36, 22], [wx - ww / 2 - 18, wy - wh / 2 - 18, 22, wh + 36], [wx + ww / 2 - 4, wy - wh / 2 - 18, 22, wh + 36], [wx - 8, wy - wh / 2, 16, wh], [wx - ww / 2, wy - 8, ww, 16]].forEach(([x, y, w2, h2]) => S('rect', { x, y, width: w2, height: h2, rx: 6, fill: '#e9e2d6' }, fr));
  kShade(g, S('rect', { x: wx - ww / 2 - 40, y: wy + wh / 2 + 14, width: ww + 80, height: 26, rx: 8, fill: '#e9e2d6' }, g), '#a99f8f', '#ffffff');
  [-1, 1].forEach(sd => { const cx = wx + sd * (ww / 2 + 60), c = o.curtain || '#8a3f6e'; kShade(g, S('path', { d: `M${cx - 70} ${wy - wh / 2 - 60} L${cx + 70} ${wy - wh / 2 - 60} Q${cx + 50} ${wy + 40} ${cx + 80} ${wy + wh / 2 + 70} L${cx - 80} ${wy + wh / 2 + 70} Q${cx - 50} ${wy + 40} ${cx - 70} ${wy - wh / 2 - 60} Z`, fill: c }, g), kDark(c, .35), kLite(c, .3));
    [-30, 10, 45].forEach(dx => S('path', { d: `M${cx + dx} ${wy - wh / 2 - 50} Q${cx + dx - 10} ${wy + 40} ${cx + dx + 8} ${wy + wh / 2 + 60}`, stroke: kDark(c, .3), 'stroke-width': 6, fill: 'none', opacity: .6 }, g)); });
  S('rect', { x: wx - ww / 2 - 170, y: wy - wh / 2 - 74, width: ww + 340, height: 14, rx: 7, fill: '#c9b48c' }, g);
  // picture frame
  if (o.px !== false) { const px = x0 + (o.px ?? w * .2), py = y0 + h * .27; kShade(g, S('rect', { x: px - 90, y: py - 70, width: 180, height: 140, rx: 10, fill: '#c9a46a' }, g)); S('rect', { x: px - 74, y: py - 54, width: 148, height: 108, fill: '#3f7fb8' }, g);
  S('path', { d: `M${px - 74} ${py + 54} L${px - 30} ${py - 10} L${px + 4} ${py + 24} L${px + 34} ${py - 20} L${px + 74} ${py + 54} Z`, fill: '#2f6b55' }, g); kBall(g, px + 40, py - 30, 12, '#ffd166'); }
  // rug + plant
  kShade(g, S('ellipse', { cx: x0 + w * .5, cy: fy + (y0 + h - fy) * .55, rx: w * .26, ry: 60, fill: o.rug || '#b0456b' }, g));
  const plx = x0 + (o.plx ?? w * .08); kShade(g, S('path', { d: `M${plx - 50} ${fy + 20} L${plx + 50} ${fy + 20} L${plx + 36} ${fy + 120} L${plx - 36} ${fy + 120} Z`, fill: '#c46a3c' }, g));
  [[-40, -70, 60, '#2f8a57'], [30, -90, 64, '#37a064'], [0, -150, 58, '#2a7a4e']].forEach(([dx, dy, r, c], k) => kBlob(g, plx + dx, fy + 20 + dy, r, c, null, { wob: .3, seed: k + 3 }));
  // morning light overlay (window light beam + warm wash)
  const day = S('g', { id: id + 'day', opacity: 0 }, par);
  S('rect', { x: x0, y: y0, width: w, height: h, fill: '#ffd9a0', opacity: .12 }, day);
  S('path', { d: `M${wx - ww / 2} ${wy - wh / 2} L${wx + ww / 2} ${wy - wh / 2} L${wx + ww * .2} ${y0 + h} L${wx - ww * 1.4} ${y0 + h} Z`, fill: '#fff1c4', opacity: .12 }, day);
  return { g, fy, wx, wy };
}
// hospital room interior filling the rect. ids: id (group)
function kHospRoom(par, defs, x0, y0, w, h, o = {}) {
  const id = o.id || 'hosp', g = S('g', { id }, par), fy = y0 + h * .72, wall = o.wall || ['#2f6474', '#1d4250'];
  S('rect', { x: x0, y: y0, width: w, height: fy - y0, fill: kLG(defs, [[0, wall[0]], [1, wall[1]]]) }, g);
  S('rect', { x: x0, y: fy - 150, width: w, height: 150, fill: kDark(wall[1], .15) }, g); S('rect', { x: x0, y: fy - 156, width: w, height: 10, fill: kLite(wall[1], .25) }, g);
  S('rect', { x: x0, y: fy, width: w, height: y0 + h - fy, fill: kLG(defs, [[0, '#2a4f5a'], [1, '#13262e']]) }, g);
  for (let k = 0; k < Math.ceil(w / 120); k++) S('path', { d: `M${x0 + k * 120} ${fy} L${x0 + k * 120 + (k * 120 - w / 2) * .5} ${y0 + h}`, stroke: '#0f1f26', 'stroke-width': 3, opacity: .55 }, g);
  for (let k = 1; k < 5; k++) { const yy = fy + (y0 + h - fy) * Math.pow(k / 5, 1.5); S('path', { d: `M${x0} ${yy} L${x0 + w} ${yy}`, stroke: '#0f1f26', 'stroke-width': 3, opacity: .55 }, g); }
  // window with city / sky
  const wx = x0 + (o.wx ?? w * .2), wy = y0 + h * .28, ww = 360, wh = 280;
  const glass = S('rect', { x: wx - ww / 2, y: wy - wh / 2, width: ww, height: wh, rx: 12 }, defs), gc = S('g', { 'clip-path': kClip(defs, glass) }, g);
  S('rect', { x: wx - ww / 2, y: wy - wh / 2, width: ww, height: wh, fill: kLG(defs, o.night ? [[0, '#0d1440'], [1, '#2a3a80']] : [[0, '#6fb6ff'], [1, '#cfe9ff']]) }, gc);
  [[-140, 120], [-80, 170], [-20, 90], [40, 150], [100, 110], [150, 180]].forEach(([dx, hh], k) => { S('rect', { x: wx + dx - 26, y: wy + wh / 2 - hh, width: 52, height: hh, fill: o.night ? '#1b2350' : '#5d7fae' }, gc);
    for (let r = 0; r < hh / 30 - 1; r++) S('rect', { x: wx + dx - 14, y: wy + wh / 2 - hh + 14 + r * 30, width: 10, height: 12, fill: o.night ? '#ffd166' : '#dbeeff', opacity: o.night ? (rnd(k * 9 + r) > .5 ? .9 : .2) : .7 }, gc); });
  [[wx - ww / 2 - 14, wy - wh / 2 - 14, ww + 28, 18], [wx - ww / 2 - 14, wy + wh / 2 - 4, ww + 28, 18], [wx - ww / 2 - 14, wy - wh / 2 - 14, 18, wh + 28], [wx + ww / 2 - 4, wy - wh / 2 - 14, 18, wh + 28], [wx - 6, wy - wh / 2, 12, wh]].forEach(([x, y, w2, h2]) => S('rect', { x, y, width: w2, height: h2, rx: 5, fill: '#dfe7ee' }, g));
  // privacy curtain on a rail
  S('rect', { x: x0 + w * .02, y: y0 + h * .06, width: w * .5, height: 12, rx: 6, fill: '#b9c6d0' }, g);
  const cx0 = x0 + (o.cx ?? w * .42), cc = o.curtain || '#5fb3a8';
  kShade(g, S('path', { d: `M${cx0 - 90} ${y0 + h * .07} L${cx0 + 90} ${y0 + h * .07} Q${cx0 + 70} ${fy - 200} ${cx0 + 110} ${fy - 20} L${cx0 - 110} ${fy - 20} Q${cx0 - 70} ${fy - 200} ${cx0 - 90} ${y0 + h * .07} Z`, fill: cc }, g), kDark(cc, .3), kLite(cc, .3));
  [-50, 0, 50].forEach(dx => S('path', { d: `M${cx0 + dx} ${y0 + h * .08} Q${cx0 + dx - 14} ${fy - 200} ${cx0 + dx + 14} ${fy - 30}`, stroke: kDark(cc, .3), 'stroke-width': 6, fill: 'none', opacity: .6 }, g));
  // wall sign with a red cross, oxygen panel, door
  const sx = x0 + (o.sx ?? w * .62); kShade(g, S('rect', { x: sx - 60, y: y0 + h * .25, width: 120, height: 120, rx: 22, fill: '#eef3f6' }, g), '#9fb0bc', '#ffffff');
  S('rect', { x: sx - 14, y: y0 + h * .25 + 22, width: 28, height: 76, rx: 6, fill: '#ff3b5c' }, g); S('rect', { x: sx - 38, y: y0 + h * .25 + 46, width: 76, height: 28, rx: 6, fill: '#ff3b5c' }, g);
  const opx = x0 + (o.opx ?? w * .55); kShade(g, S('rect', { x: opx - 160, y: y0 + h * .4, width: 320, height: 60, rx: 14, fill: '#cfd9e2' }, g)); [-100, -40, 20, 80].forEach((dx, k) => kBall(g, opx + dx, y0 + h * .4 + 30, 13, ['#4cc9f0', '#ffd166', '#7ddf3f', '#ff8a3d'][k]));
  const dx0 = x0 + (o.dx ?? w * .9); kShade(g, S('rect', { x: dx0 - 110, y: fy - 420, width: 220, height: 420, rx: 10, fill: '#cfd9e2' }, g)); S('rect', { x: dx0 - 60, y: fy - 370, width: 120, height: 90, rx: 8, fill: '#8fc8e8' }, g); kBall(g, dx0 + 70, fy - 200, 12, '#9fb0bc');
  return { g, fy };
}
// upright black bear, front view (not hunched): head clearly above the shoulders. ids: id (whole), id+'H' head, id+'lL'/'lR' legs
function kBearUp(par, cx, by, s, id) { const O = S('g', { transform: `translate(${cx},${by}) scale(${s})` }, par), M = S('g', { id }, O);
  S('ellipse', { cx: 0, cy: 0, rx: 150, ry: 20, fill: '#000', opacity: .3 }, M);
  [-1, 1].forEach(sd => { const l = S('g', { id: id + (sd < 0 ? 'lL' : 'lR') }, M); kShade(l, S('rect', { x: sd * 58 - 44, y: -190, width: 88, height: 190, rx: 40, fill: K_FUR }, l), K_FURD, K_FURL); S('ellipse', { cx: sd * 58, cy: -10, rx: 44, ry: 14, fill: '#d8c3a5', opacity: .55 }, l); });
  kShade(M, S('ellipse', { cx: 0, cy: -320, rx: 135, ry: 185, fill: K_FUR }, M), K_FURD, K_FURL);
  S('ellipse', { cx: 0, cy: -300, rx: 78, ry: 120, fill: '#3e3450', opacity: .7 }, M);
  S('path', { d: 'M-40 -430 Q0 -400 40 -430 Q0 -410 -40 -430 Z', fill: '#d8c3a5', opacity: .7 }, M);
  [-1, 1].forEach(sd => { kShade(M, S('ellipse', { cx: sd * 138, cy: -330, rx: 40, ry: 125, fill: K_FUR, transform: `rotate(${sd * -8} ${sd * 138} -330)` }, M), K_FURD, K_FURL); kBall(M, sd * 150, -215, 36, K_FUR, K_FURD, K_FURL); });
  const H = S('g', { id: id + 'H', transform: 'translate(0 -360)' }, M); kBearHead(H, id + 'h', .95);
  document.getElementById(id + 'hEo').setAttribute('opacity', 1); document.getElementById(id + 'hEc').setAttribute('opacity', 0);
  return M; }
// anatomy muscle (vertical spindle with white tendons + fibres) — waste it with scaleX
function kMuscle(par, cx, cy, s, id) { const g = S('g', id ? { id } : {}, par), m = S('g', id ? { id: id + 'm' } : {}, g);
  [-1, 1].forEach(sd => kShade(g, S('rect', { x: cx - 16 * s, y: cy + sd * 150 * s - (sd < 0 ? 60 * s : 0), width: 32 * s, height: 60 * s, rx: 14 * s, fill: '#f3ead6' }, g), '#b9ab8a', '#ffffff'));
  kShade(m, S('path', { d: `M${cx} ${cy - 160 * s} C${cx + 110 * s} ${cy - 90 * s} ${cx + 110 * s} ${cy + 90 * s} ${cx} ${cy + 160 * s} C${cx - 110 * s} ${cy + 90 * s} ${cx - 110 * s} ${cy - 90 * s} ${cx} ${cy - 160 * s} Z`, fill: '#d9475a' }, m), '#7a1626', '#ff9fae');
  for (let k = -2; k <= 2; k++) S('path', { d: `M${cx + k * 6 * s} ${cy - 140 * s} Q${cx + k * 30 * s} ${cy} ${cx + k * 6 * s} ${cy + 140 * s}`, stroke: '#ff8a9a', 'stroke-width': 4 * s, fill: 'none', opacity: .55 }, m);
  return g; }
// awake squirrel, standing up (front view). ids: id (whole)
function kSquirrelUp(par, cx, by, s, id) { const O = S('g', { transform: `translate(${cx},${by}) scale(${s})` }, par), M = S('g', { id }, O), fur = '#b98a5a';
  S('ellipse', { cx: 0, cy: 0, rx: 70, ry: 12, fill: '#000', opacity: .3 }, M);
  S('path', { d: 'M40 -20 Q140 -60 110 -170 Q90 -230 40 -210', stroke: '#8f6640', 'stroke-width': 54, fill: 'none', 'stroke-linecap': 'round' }, M);
  kShade(M, S('ellipse', { cx: 0, cy: -70, rx: 55, ry: 72, fill: fur }, M), '#6e4a2a', '#f1d2a8'); S('ellipse', { cx: 0, cy: -60, rx: 32, ry: 46, fill: '#f1dcbc' }, M);
  [-1, 1].forEach(sd => kBall(M, sd * 28, -8, 16, '#a87a4c'));
  kBall(M, 0, -165, 48, fur, '#6e4a2a', '#f6dcb8', null, '#ffffff'); [-1, 1].forEach(sd => kBall(M, sd * 34, -205, 14, '#a87a4c'));
  [-18, 18].forEach(x => { S('ellipse', { cx: x, cy: -170, rx: 8, ry: 10, fill: '#1e120a' }, M); S('circle', { cx: x - 3, cy: -174, r: 3, fill: '#ffffff' }, M); });
  kBall(M, 0, -150, 7, '#3a2418'); return M; }
// spaceship cutaway (side): hull + cabin interior + windows. Returns the cabin floor y.
function kShipCut(par, defs, cx, cy, w, h, id) { const g = S('g', { id }, par);
  const fl = S('g', { id: id + 'f' }, g); nBloom(S('path', { d: `M${cx + w / 2 + 40} ${cy - 60} Q${cx + w / 2 + 240} ${cy} ${cx + w / 2 + 40} ${cy + 60} Z`, fill: NPAL.cyan }, fl));
  kShade(g, S('path', { d: `M${cx - w / 2} ${cy - h / 2} L${cx + w / 2} ${cy - h / 2} Q${cx + w / 2 + 60} ${cy - h / 2} ${cx + w / 2 + 60} ${cy - h / 2 + 80} L${cx + w / 2 + 60} ${cy + h / 2 - 80} Q${cx + w / 2 + 60} ${cy + h / 2} ${cx + w / 2} ${cy + h / 2} L${cx - w / 2} ${cy + h / 2} Q${cx - w / 2 - 220} ${cy} ${cx - w / 2} ${cy - h / 2} Z`, fill: '#e3e7f3' }, g), '#8a93b4', '#ffffff');
  S('rect', { x: cx - w / 2 + 20, y: cy - h / 2 + 34, width: w - 10, height: h - 68, rx: 28, fill: kLG(defs, [[0, '#2b3566'], [1, '#161c3a']]) }, g);
  for (let k = 0; k < 6; k++) S('rect', { x: cx - w / 2 + 50 + k * (w - 80) / 6, y: cy - h / 2 + 60, width: (w - 80) / 6 - 20, height: h * .32, rx: 12, fill: '#ffffff', opacity: .05 }, g);
  [-.32, -.05, .22].forEach(f => { S('circle', { cx: cx + f * w, cy: cy - h / 2 + 100, r: 40, fill: '#0b1030' }, g); [0, 1, 2].forEach(k => S('circle', { cx: cx + f * w - 15 + k * 14, cy: cy - h / 2 + 90 + k * 8, r: 2.5, fill: '#ffffff' }, g)); S('circle', { cx: cx + f * w, cy: cy - h / 2 + 100, r: 40, fill: 'none', stroke: '#9aa6c8', 'stroke-width': 8 }, g); });
  const floorY = cy + h / 2 - 64; S('rect', { x: cx - w / 2 + 20, y: floorY, width: w - 10, height: 18, fill: '#5d6896' }, g);
  S('rect', { x: cx - w / 2 + 20, y: floorY + 18, width: w - 10, height: 12, fill: NPAL.mag, opacity: .6 }, g);
  return floorY; }
// lab bench with flasks + microscope
function kLabBench(par, cx, by, s, id) { const g = S('g', id ? { id } : {}, par);
  kShade(g, S('rect', { x: cx - 230 * s, y: by - 150 * s, width: 460 * s, height: 30 * s, rx: 10 * s, fill: '#cfd8ea' }, g), '#7d89a8', '#ffffff');
  [-1, 1].forEach(sd => S('rect', { x: cx + sd * 200 * s - 12 * s, y: by - 122 * s, width: 24 * s, height: 122 * s, fill: '#7d89a8' }, g));
  [[-150, '#4dffb8'], [-80, '#ff5d8f'], [90, '#4cc9f0']].forEach(([dx, c]) => { const x = cx + dx * s, y = by - 150 * s;
    S('path', { d: `M${x - 12 * s} ${y - 110 * s} L${x + 12 * s} ${y - 110 * s} L${x + 12 * s} ${y - 70 * s} L${x + 44 * s} ${y} L${x - 44 * s} ${y} L${x - 12 * s} ${y - 70 * s} Z`, fill: '#dff3ff', opacity: .55 }, g);
    S('path', { d: `M${x - 30 * s} ${y - 26 * s} L${x + 30 * s} ${y - 26 * s} L${x + 44 * s} ${y} L${x - 44 * s} ${y} Z`, fill: c }, g); kGlow(g, x, y - 20 * s, 50 * s, c, .35); });
  const mx = cx + 170 * s, my = by - 150 * s; kShade(g, S('rect', { x: mx - 40 * s, y: my - 14 * s, width: 80 * s, height: 14 * s, rx: 5 * s, fill: '#3b4466' }, g));
  S('path', { d: `M${mx - 10 * s} ${my - 14 * s} L${mx - 10 * s} ${my - 120 * s} L${mx + 30 * s} ${my - 150 * s}`, stroke: '#3b4466', 'stroke-width': 16 * s, fill: 'none', 'stroke-linecap': 'round' }, g);
  S('rect', { x: mx + 14 * s, y: my - 170 * s, width: 34 * s, height: 60 * s, rx: 8 * s, fill: '#6d7aa6', transform: `rotate(35 ${mx + 30 * s} ${my - 140 * s})` }, g); return g; }
// rounded split panel: returns { g (clipped content group), frame() }
function kPanel(par, defs, x, y, w, h) { const r = S('rect', { x, y, width: w, height: h, rx: 36 }, defs), g = S('g', { 'clip-path': kClip(defs, r) }, par);
  return { g, frame: () => { S('rect', { x: x + 6, y: y + 12, width: w, height: h, rx: 36, fill: 'none', stroke: '#000000', 'stroke-width': 10, opacity: .25 }, par); S('rect', { x, y, width: w, height: h, rx: 36, fill: 'none', stroke: '#0b0820', 'stroke-width': 12 }, par); } }; }
// plate of Indian food (roti, rice, dal, sabzi) — reads clearly as "a meal"
function kMeal(par, cx, cy, s, id) { const g = S('g', id ? { id } : {}, par);
  S('ellipse', { cx, cy: cy + 10 * s, rx: 100 * s, ry: 32 * s, fill: '#000', opacity: .25 }, g);
  kShade(g, S('ellipse', { cx, cy, rx: 98 * s, ry: 64 * s, fill: '#dfe4ee' }, g), '#8a93a8', '#ffffff'); S('ellipse', { cx, cy: cy - 2 * s, rx: 80 * s, ry: 50 * s, fill: '#c6cddb' }, g);
  kShade(g, S('ellipse', { cx: cx - 36 * s, cy: cy - 8 * s, rx: 40 * s, ry: 26 * s, fill: '#e3ab60' }, g), '#a8742e', '#f7d396'); [[-46, -12], [-28, -4], [-38, 4], [-22, -16]].forEach(([dx, dy]) => S('circle', { cx: cx + dx * s, cy: cy + dy * s, r: 4 * s, fill: '#9a5f24' }, g));
  kShade(g, S('ellipse', { cx: cx + 8 * s, cy: cy + 22 * s, rx: 32 * s, ry: 17 * s, fill: '#fbfbf4' }, g), '#cfcfc0', '#ffffff');
  [[34, -22, '#f2b632'], [62, 6, '#5fae3a']].forEach(([dx, dy, c]) => { kShade(g, S('ellipse', { cx: cx + dx * s, cy: cy + dy * s, rx: 24 * s, ry: 15 * s, fill: '#aab3c4' }, g)); S('ellipse', { cx: cx + dx * s, cy: cy + (dy - 2) * s, rx: 18 * s, ry: 9 * s, fill: c }, g); });
  [-24, 0, 24].forEach(dx => S('path', { d: `M${cx + dx * s} ${cy - 62 * s} q${8 * s} ${-14 * s} 0 ${-28 * s} q${-8 * s} ${-14 * s} 0 ${-28 * s}`, stroke: '#ffffff', 'stroke-width': 5 * s, fill: 'none', opacity: .65, 'stroke-linecap': 'round' }, g));
  return g; }
// party balloons + confetti (= fun / "mauj masti")
function kBalloons(par, cx, cy, s, id) { const g = S('g', id ? { id } : {}, par);
  [[-58, -30, '#ff5d6c'], [0, -72, '#ffd166'], [58, -26, '#4cc9f0']].forEach(([dx, dy, c]) => { S('path', { d: `M${cx + dx * s} ${cy + (dy + 58) * s} Q${cx + (dx * .5 + 10) * s} ${cy + 100 * s} ${cx} ${cy + 150 * s}`, stroke: '#e9e2d6', 'stroke-width': 3 * s, fill: 'none' }, g);
    kShade(g, S('ellipse', { cx: cx + dx * s, cy: cy + dy * s, rx: 44 * s, ry: 54 * s, fill: c }, g), kDark(c, .3), kLite(c, .45)); S('path', { d: `M${cx + (dx - 8) * s} ${cy + (dy + 60) * s} L${cx + (dx + 8) * s} ${cy + (dy + 60) * s} L${cx + dx * s} ${cy + (dy + 50) * s} Z`, fill: kDark(c, .2) }, g); });
  [[-115, -95, '#7ddf3f'], [105, -115, '#ff8fb8'], [-100, 35, '#ffd166'], [112, 45, '#4cc9f0'], [-20, -150, '#ff8a3d']].forEach(([dx, dy, c], k) => S('rect', { x: cx + dx * s, y: cy + dy * s, width: 16 * s, height: 9 * s, rx: 2 * s, fill: c, transform: `rotate(${k * 40 + 15} ${cx + dx * s} ${cy + dy * s})` }, g));
  return g; }
// astronaut = kBean in a white suit + helmet bubble + chest kPanel (moves with id+'B')
function kAstro(par, x, y, s, id, o = {}) { kBean(par, x, y, s, id, Object.assign({ top: '#eef2fa', pants: '#dfe5f2', shoes: '#7d89a8' }, o)); const M = document.getElementById(id + 'B');
  S('rect', { x: -34, y: -300, width: 68, height: 46, rx: 10, fill: '#5d6896' }, M); [[-18, '#ff5d6c'], [0, '#ffd166'], [18, '#4dffb8']].forEach(([dx, c]) => S('circle', { cx: dx, cy: -277, r: 7, fill: c }, M));
  S('rect', { x: -82, y: -344, width: 164, height: 24, rx: 12, fill: '#9aa6c8' }, M);
  S('circle', { cx: 0, cy: -440, r: 132, fill: '#bfe9ff', opacity: .2 }, M); S('circle', { cx: 0, cy: -440, r: 132, fill: 'none', stroke: '#e8eefc', 'stroke-width': 11 }, M);
  S('path', { d: 'M-84 -506 Q-62 -546 -20 -556', stroke: '#ffffff', 'stroke-width': 13, fill: 'none', opacity: .7, 'stroke-linecap': 'round' }, M); return M; }

// bedside table with a glowing lamp
function kSideTable(par, cx, by, s, id) { const g = S('g', id ? { id } : {}, par); kShade(g, S('rect', { x: cx - 75 * s, y: by - 150 * s, width: 150 * s, height: 150 * s, rx: 12 * s, fill: '#8a5a3c' }, g), '#4a2e1c', '#c48a5e');
  S('rect', { x: cx - 50 * s, y: by - 110 * s, width: 100 * s, height: 10 * s, rx: 5 * s, fill: '#5e3c26' }, g);
  kGlow(g, cx, by - 260 * s, 200 * s, '#ffd27a', .45); S('rect', { x: cx - 6 * s, y: by - 230 * s, width: 12 * s, height: 80 * s, fill: '#c9b48c' }, g);
  kShade(g, S('path', { d: `M${cx - 55 * s} ${by - 220 * s} L${cx + 55 * s} ${by - 220 * s} L${cx + 35 * s} ${by - 300 * s} L${cx - 35 * s} ${by - 300 * s} Z`, fill: '#ffe2a8' }, g), '#d9a85e', '#ffffff'); return g; }
// teleport beam at a person's feet (hidden). Reveal with kBEAM(id, t0, dur)
function kBeam(par, defs, X, fy, id) { const g = S('g', { id }, par), Y = fy - 130;
  nBloom(S('rect', { x: X - 140, y: Y - 560, width: 280, height: 1120, rx: 140, fill: kLG(defs, [[0, 'rgba(127,231,255,0)'], [.5, 'rgba(200,248,255,.85)'], [1, 'rgba(127,231,255,0)']]) }, g));
  [0, 1, 2].forEach(k => S('ellipse', { id: id + 'r' + k, cx: X, cy: Y + 240 - k * 240, rx: 170, ry: 40, fill: 'none', stroke: '#bff6ff', 'stroke-width': 8, opacity: .9 }, g));
  for (let k = 0; k < 14; k++) kBall(g, X - 130 + rnd(k * 7 + 3) * 260, Y - 300 + rnd(k * 11 + 5) * 600, 5 + rnd(k) * 6, '#ffffff', null, null, id + 's' + k);
  hidId(id); return g; }
function kBEAM(id, t0, dur = 1) { tl.fromTo('#' + id, { autoAlpha: 0, scaleX: .1, transformOrigin: '50% 50%' }, { autoAlpha: 1, scaleX: 1, duration: .25, ease: 'power2.out' }, t0);
  [0, 1, 2].forEach(k => tl.fromTo('#' + id + 'r' + k, { scale: .3, transformOrigin: '50% 50%' }, { scale: 1.3, duration: .6, ease: 'power2.out' }, t0 + k * .08));
  for (let k = 0; k < 14; k++) tl.fromTo('#' + id + 's' + k, { y: 60 }, { y: -160 - (k % 4) * 40, duration: dur, ease: 'power1.out' }, t0);
  tl.to('#' + id, { autoAlpha: 0, scaleX: .1, duration: .3, ease: 'power2.in' }, t0 + dur - .3); }
