// ===================== LIFE (premium add-on) =====================
// camera breathing, transition flash/streak, small effects. Backgrounds stay the dark techBg (no per-area colours). NO vignette, NO floating particles/bubbles (user hates all three).
// call once after makeWorld (before anything else is added to s): wraps #world in #drift and adds screen overlays
function addLife(s) { const w = document.getElementById('world'); const d = H('div', 'a', 'left:0;top:0;width:1920px;height:1080px', null, s, 'drift'); d.appendChild(w);
  H('div', 'a', 'left:0;top:0;width:1920px;height:1080px;pointer-events:none;background:radial-gradient(circle at center,rgba(253,230,138,.5),rgba(255,255,255,0) 70%)', '', s, 'flash');
  H('div', 'a', 'left:-700px;top:-200px;width:500px;height:1500px;pointer-events:none;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(253,230,138,.32),rgba(255,255,255,0))', '', s, 'streak');
  H('div', 'a', 'left:0;top:0;width:1920px;height:1080px;background:#000;pointer-events:none', '', s, 'fadeEnd');
  H('div', 'a', 'left:0;top:0;width:1920px;height:1080px;background:#000;pointer-events:none', '', s, 'fadeIn'); }
// call inside beats: area-start times get a flash + light streak; camera breathes the whole video
function lifeBeats(times) { tl.set(['#flash', '#streak'], { autoAlpha: 0 }, 0); tl.set('#streak', { rotation: 18 }, 0);
  tl.to('#drift', { scale: 1.035, x: -18, y: 10, transformOrigin: '50% 50%', duration: 8, yoyo: true, repeat: Math.max(0, Math.floor(END / 8) - 1), ease: 'sine.inOut' }, 0);
  times.forEach(t => { tl.fromTo('#flash', { autoAlpha: .7 }, { autoAlpha: 0, duration: .6, ease: 'power2.out' }, t - .05); tl.fromTo('#streak', { autoAlpha: 1, x: 0 }, { autoAlpha: 1, x: 2900, duration: .7, ease: 'power2.inOut' }, t - .25); tl.set('#streak', { autoAlpha: 0 }, t + .5); }); }
// small effects
function spark(par, cx, cy, s, col, id) { const g = S('g', { id }, par); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; S('path', { d: `M${cx + Math.cos(a) * 20 * s} ${cy + Math.sin(a) * 20 * s} L${cx + Math.cos(a) * 60 * s} ${cy + Math.sin(a) * 60 * s}`, stroke: col, 'stroke-width': 7 * s, 'stroke-linecap': 'round' }, g); } S('circle', { cx, cy, r: 12 * s, fill: col }, g); return g; }   // POP then fade + scale up
function gauge(par, cx, cy, r, col, id) { const g = S('g', { id }, par); S('path', { d: `M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy}`, stroke: '#334155', 'stroke-width': 22, fill: 'none', 'stroke-linecap': 'round' }, g); S('path', { d: `M${cx + r * Math.cos(-.9)} ${cy + r * Math.sin(-.9)} A${r} ${r} 0 0 1 ${cx + r} ${cy}`, stroke: col, 'stroke-width': 22, fill: 'none', 'stroke-linecap': 'round' }, g); const n = S('g', { id: id + 'N' }, g); S('path', { d: `M${cx} ${cy} L${cx} ${cy - r + 20}`, stroke: '#f8fafc', 'stroke-width': 9, 'stroke-linecap': 'round' }, n); S('circle', { cx, cy, r: 14, fill: '#f8fafc' }, g); return g; }   // needle id+'N': rotation with transformOrigin '50% 100%'
function glowRing(par, cx, cy, r, col, id, w = 8) { return S('circle', { id, cx, cy, r, fill: 'none', stroke: col, 'stroke-width': w, opacity: .9 }, par); }
// ENDING (every video): call last inside beats. Camera eases back to (cx,cy,z) as the last words finish, focus (selector of the final
// visual) gets a pulse, then the screen fades to black. build.py makes the video TAIL s longer than the audio.
function outro(cx, cy, z = .9, focus) { const T2 = END + (typeof TAIL === 'number' ? TAIL : 3.1); tl.set('#fadeEnd', { autoAlpha: 0 }, 0);
  CAM(END - .4, cx, cy, z, 2.8, 'sine.inOut');
  if (focus) tl.to(focus, { scale: 1.12, transformOrigin: '50% 50%', duration: .6, yoyo: true, repeat: 3, ease: 'sine.inOut' }, END + .1);
  tl.fromTo('#fadeEnd', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.3, ease: 'power1.in' }, T2 - 1.4); tl.set({}, {}, T2); }
// OPENING (every video): call FIRST inside beats. 0..HEAD (no voice yet): fade from black, light streak, the hero object assembles
// (each child of `hero` scales in, staggered), a glow ring pulses. If the script has a spoken title (TITLE from align.py), its words pop
// on the spoken words in a screen-space row and leave at `outAt` (phrase where the hook starts). Then the first area takes the camera.
// hero: selector of a group built at build time (NOT hid()), cx/cy: its centre, s: the scene element.
function intro(s, hero, cx, cy, o = {}) {
  const h0 = typeof HEAD === 'number' ? HEAD : 1.5, kids = [...document.querySelector(hero).children];
  tl.fromTo('#fadeIn', { autoAlpha: 1 }, { autoAlpha: 0, duration: .8, ease: 'power1.out' }, 0);
  tl.set('#streak', { autoAlpha: 0, rotation: 18 }, 0); tl.fromTo('#streak', { autoAlpha: 1, x: 0 }, { autoAlpha: 1, x: 2900, duration: .9, ease: 'power2.inOut' }, .2); tl.set('#streak', { autoAlpha: 0 }, 1.2);
  CUT(0, cx, cy, o.z0 ?? 2.0); CAM(.05, cx, cy + 40, o.z1 ?? 1.45, h0 + .6, 'power2.out');
  tl.fromTo(hero, { autoAlpha: 0 }, { autoAlpha: 1, duration: .2 }, .1);
  tl.fromTo(kids, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: .35, stagger: Math.min(.12, (h0 - .6) / Math.max(1, kids.length)), ease: 'back.out(1.8)' }, .15); B(.15);
  const ring = document.getElementById('introRing') || glowRing(document.querySelector(hero).parentNode, cx, cy, o.r ?? 250, o.col ?? '#a78bfa', 'introRing', 6);
  tl.set(ring, { autoAlpha: 0 }, 0); tl.fromTo(ring, { autoAlpha: .9, scale: .9, transformOrigin: '50% 50%' }, { autoAlpha: 0, scale: 1.8, duration: .9, ease: 'power2.out' }, h0 - .3);
  if (TITLE && o.title !== false) {
    const words = TITLE.split(/\s+/), cols = o.titleCols || [], wrap = H('div', 'cx', 'top:828px;width:fit-content', null, s, 'tWrap');
    const row = H('div', '', 'display:flex;gap:28px;font-size:96px;font-weight:800;letter-spacing:-1px;line-height:1.1', null, wrap);
    words.forEach((w, k) => H('span', 'ib', `color:${cols[k] || '#e8eefc'}`, w, row, 'tw' + k));
    H('div', '', `height:9px;border-radius:5px;margin-top:10px;background:${o.ulCol || '#fbbf24'}`, '', wrap, 'tUl');
    const ids = words.map((_, k) => '#tw' + k); tl.set([...ids, '#tUl'], { autoAlpha: 0 }, 0);
    let last = h0; words.forEach((w, k) => { const t = findp(w, 0) ?? (h0 + .25 * k); last = t; tl.fromTo(ids[k], { autoAlpha: 0, y: 40, scale: .85, transformOrigin: '50% 50%' }, { autoAlpha: 1, y: 0, scale: 1, duration: .45, ease: 'back.out(1.8)' }, t - .08); B(t); });
    tl.fromTo('#tUl', { autoAlpha: 1, scaleX: 0, transformOrigin: '0% 50%' }, { autoAlpha: 1, scaleX: 1, duration: .5, ease: 'power2.out' }, last + .1);
    CAM(h0 + .1, cx, cy + 170, 1.12, 1.6, 'sine.inOut');
    const tOut = o.outAt ? findp(o.outAt, last) ?? last + 1.2 : last + 1.2; OUT([...ids, '#tUl'], tOut - .25, { d: .3 });
  }
}
