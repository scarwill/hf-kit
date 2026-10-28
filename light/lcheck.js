// LIGHT checker:  node ~/hf-kit/light/lcheck.js [index.html] [--from A --to B] [--every 4] [--nosheet]
// Seeks the video every 1 s (local gsap shim, no network) and reports:
//   EMPTY    < 25% of the frame (below the title) is covered by visible parts -> fill it: bigger visual, hero object
//   TEXT     > 110 visible text characters in one frame (titles excluded)    -> show it, don't write it
//   SMALL    visible text under 24 px                                          -> 30 px body, 24 px labels minimum
//   OUT      a visible part sticks out of the frame (1920x1080, SHORT 1080x1920)
//   OVERFLOW text spills out of its window / chip
//   OVERLAP  two windows/chips/labels cover each other (> 15% of the smaller)
//   ORBCORNER a window/chip/label sits in the orb's corner (LONG bottom-right, SHORT top-right)
//   CAPTION  a scene part sits under a visible caption (nlCaptions) -> keep parts out of the caption band
//   HOOK0    SHORT only: frame 0 (and 0.5 s) under 25% covered or no drawn visual -> HOOK(['#part', ...]) the hook visual
//   SAFE     SHORT only: a part sits where the Shorts player covers the frame (like/comment column on the right, caption at the bottom, top bar)
//   NOORB    the scene's corner orb is not visible 1.5 s after the scene start (forgot ORB_ON)
//   NOVISUAL a scene has no drawn visual (svg / net / curve / cells / docs) -> every scene needs one
//   GAP      > 5 s without any animation beat
//   CUTTEXT  a screenshot word is cut by its window edge (zoom/scroll/crop cuts through text) -> crop or focus so whole lines show
//   SMALLSHOT screenshot text under 9 px tall on screen -> crop the page to the part the voice talks about, or zoom
//   SVGOUT   a drawing (nlBox svg) spills out of its own box (a line / word bar runs past the card or page) -> nlWords, fix sizes
//   JS       page errors + kit guards (LIGHT: ...) + PHRASE NOT FOUND  -> always fix
// --from/--to limit the check to a time range (video seconds) = check one batch of scenes.
// Writes cues.json (sound cues for lmix.py) and contact sheets out/sheet_NN.png (one frame every --every s, 16 per sheet). Look at the SHEETS only.
// Exit code 1 when there are JS errors.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const A = process.argv.slice(2), opt = (k, d) => { const i = A.indexOf(k); if (i < 0) return d; const v = A[i + 1]; A.splice(i, 2); return v; };
const NOSHEET = A.includes('--nosheet'); if (NOSHEET) A.splice(A.indexOf('--nosheet'), 1);
const FROM = +opt('--from', -1), TO = +opt('--to', 1e9), EVERY = +opt('--every', 4), src = A[0] || 'index.html';
const { sheets, fitFrame } = require('./lsheet.js');
require('./lsheet.js').testPage(src, 'nl_test.html'); fs.mkdirSync('out', { recursive: true });
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
  await p.goto('file://' + path.resolve('nl_test.html')); const [FW, FH] = await fitFrame(p), VT = FW < FH;
  const meta = await p.evaluate(() => ({ end: END, tail: TAIL, head: HEAD, beats: window.__BEATS || [], sc: (typeof NLSC !== 'undefined' ? NLSC : []), nlt: window.__NLT || [], cues: window.__CUES || [], orbs: (typeof ORBS !== 'undefined' ? ORBS : []) }));
  fs.writeFileSync('cues.json', JSON.stringify(meta.cues));
  const W = []; const warn = (t, k, m) => W.push(`${String(t.toFixed(1)).padStart(6)}s  ${k.padEnd(8)} ${m}`);
  const probe = ({ t, FW, FH, VT }) => {
    const op = e => { let o = 1; for (let x = e; x && x !== document.body; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.visibility === 'hidden' || cs.display === 'none') return 0; o *= +cs.opacity; } return o; };
    const orbIds = (typeof ORBS !== 'undefined' ? ORBS : []).map(o => o[0]);
    const sc = [...document.querySelectorAll('.nsc')].find(s => op(s) > .5); const R = { sc: sc ? sc.id : null, cov: 0, txt: 0, small: [], out: [], ovf: [], ovl: [], vis: false };
    if (!sc) return R; const parts = [...sc.querySelectorAll('[id]:not(.nttl)'), ...document.querySelectorAll('#nlTop > [id]')].filter(e => op(e) > .15);
    // coverage grid (40 px cells) over the content area: LONG below the title, SHORT between the title and the caption
    const GX = FW / 40, GY = VT ? 27 : 22, G0 = VT ? 400 : 160, G = new Uint8Array(GX * GY);
    const mark = r => { for (let gx = Math.max(0, Math.floor(r.left / 40)); gx < Math.min(GX, Math.ceil(r.right / 40)); gx++) for (let gy = Math.max(0, Math.floor((r.top - G0) / 40)); gy < Math.min(GY, Math.ceil((r.bottom - G0) / 40)); gy++) G[gy * GX + gx] = 1; };
    R.safe = []; R.capov = [];
    const caps = [...document.querySelectorAll('.ncap')].filter(e => op(e) > .5).map(e => e.firstElementChild.getBoundingClientRect());
    if (VT) caps.forEach(c => { if (c.right > 940 || c.left < 40 || c.bottom > 1500) R.safe.push('caption'); });
    parts.forEach(e => { let r = e.getBoundingClientRect(); if (r.width < 2 && e.firstElementChild) r = e.firstElementChild.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return; if (r.width > FW - 20 && r.height > FH - 80) return; mark(r);
      const isOrb = orbIds.some(o => e.id.startsWith(o));
      if ((r.left < -8 || r.top < -8 || r.right > FW + 8 || r.bottom > FH + 8) && !isOrb) R.out.push(e.id);
      if (!isOrb && caps.some(c => Math.min(r.right, c.right) - Math.max(r.left, c.left) > 4 && Math.min(r.bottom, c.bottom) - Math.max(r.top, c.top) > 4)) R.capov.push(e.id);
      if (VT && !isOrb && (r.bottom > 1500 || r.top < 120 || (r.right > 940 && r.bottom > 900 && r.top < 1700))) R.safe.push(e.id); });
    R.cov = G.reduce((a, v) => a + v, 0) / G.length;
    R.vis = !!sc.querySelector('svg path, svg circle, .ncell, .ndoc, .nbox');
    const tw = document.createTreeWalker(sc, NodeFilter.SHOW_TEXT); let n; while ((n = tw.nextNode())) { const el = n.parentElement; if (!n.textContent.trim() || el.closest('.nttl') || op(el) < .15) continue; if (!el.closest('.nhd,.ncell,.nrow,.ncode,.nchar,.nico')) R.txt += n.textContent.trim().length; const fsz = parseFloat(getComputedStyle(el).fontSize); if (fsz < 23.5) R.small.push(n.textContent.trim().slice(0, 18) + ' ' + fsz + 'px'); }
    [...sc.querySelectorAll('.nwin,.nchp,.nrow'), ...document.querySelectorAll('#nlTop .nwin')].filter(e => op(e) > .15).forEach(e => { if (e.scrollWidth > e.clientWidth + 4 || (e.classList.contains('nwin') && e.style.height !== 'auto' && e.scrollHeight > e.clientHeight + 4)) R.ovf.push(e.id || e.className); });
    const box = [...sc.querySelectorAll('.nwin,.nchp,.nlb'), ...document.querySelectorAll('#nlTop .nwin')].filter(e => op(e) > .3).map(e => [e, e.getBoundingClientRect()]);
    for (let i = 0; i < box.length; i++) for (let j = i + 1; j < box.length; j++) { const [a, ra] = box[i], [c, rc] = box[j]; if (a.contains(c) || c.contains(a)) continue;
      const ix = Math.max(0, Math.min(ra.right, rc.right) - Math.max(ra.left, rc.left)), iy = Math.max(0, Math.min(ra.bottom, rc.bottom) - Math.max(ra.top, rc.top)), sm = Math.min(ra.width * ra.height, rc.width * rc.height);
      if (sm > 0 && ix * iy / sm > .15) R.ovl.push((a.id || a.className) + ' x ' + (c.id || c.className)); }
    const inF = id => (window.__NLFOCUS || []).some(([i, a, b]) => i === id && t > a - .1 && t < b + .1); R.cut = []; R.sshot = []; R.svgout = [];
    if (typeof NLBOXES !== 'undefined') [...sc.querySelectorAll('.nshot')].filter(e => op(e) > .9 && !inF(e.id)).forEach(e => { const B = NLBOXES[e.dataset.src]; if (!B) return;
      const ir = document.getElementById(e.id + 'im').getBoundingClientRect(), vr = document.getElementById(e.id + 'vp').getBoundingClientRect(), fx = ir.width / B.w, fy = ir.height / B.h, hs = [];
      B.words.forEach(([tx, x, y, w, h]) => { if (tx.replace(/[^A-Za-z0-9]/g, '').length < 2) return; const L = ir.left + x * fx, T = ir.top + y * fy, Rr = L + w * fx, Bb = T + h * fy;
        const inside = L >= vr.left - 1 && Rr <= vr.right + 1 && T >= vr.top - 1 && Bb <= vr.bottom + 1, apart = Rr <= vr.left || L >= vr.right || Bb <= vr.top || T >= vr.bottom;
        const atEdge = x <= 3 || y <= 3 || x + w >= B.w - 3 || y + h >= B.h - 3;   // touches the image border = the crop itself cut this word
        if (atEdge && !apart && R.cut.length < 2) { R.cut.push(`${e.id}: "${tx}" cut by the crop of ${e.dataset.src} - crop again between rows`); return; }
        if (inside) hs.push(h * fy); else if (!apart && R.cut.length < 2) R.cut.push(`${e.id}: "${tx}" cut at the ${L < vr.left ? 'left' : Rr > vr.right ? 'right' : T < vr.top ? 'top' : 'bottom'} edge`); });
      hs.sort((a, b) => a - b); const md = hs.length ? hs[hs.length >> 1] : 99; if (md < 9) R.sshot.push(`${e.id}: page text ~${md.toFixed(1)} px tall on screen (need >= 9) - crop ${e.dataset.src} or zoom`); });
    [...sc.querySelectorAll('.nbox > svg')].filter(v => op(v) > .15 && !orbIds.some(o => (v.parentElement.id || '').startsWith(o))).forEach(v => { const w = +v.getAttribute('width'), h = +v.getAttribute('height'); if (!w || !h) return;
      let bb; try { bb = v.getBBox(); } catch (er) { return; } const sp = Math.max(-bb.x, -bb.y, bb.x + bb.width - w, bb.y + bb.height - h);
      if (sp > 6) R.svgout.push(`${v.parentElement.id || '?'}: drawing spills ${Math.round(sp)} px out of its ${w}x${h} box`); });
    R.corner = box.filter(([e, r]) => VT ? r.right > 850 && r.top < 330 : r.right > 1700 && r.bottom > 870).map(([e]) => e.id || e.className);
    const orb = (typeof ORBS !== 'undefined' ? ORBS : []).find(([, p]) => p === sc.id); R.orb = orb ? op(document.getElementById(orb[0] + 'N') || document.getElementById(orb[0])) > .3 : null;
    return R; };
  const seen = {}, scT = {};
  // SHORT: frame 0 is what the Shorts feed shows while the viewer decides to swipe; it must already hold the hook visual
  if (VT && FROM < 0) for (const t of [0.04, 0.5]) { await p.evaluate(t => window.__timelines.main.seek(t), t); const r = await p.evaluate(probe, { t, FW, FH, VT });
    if (!r.sc) warn(t, 'HOOK0', 'no scene visible at the start - HOOK the first scene\'s main visual');
    else if (r.cov < .25 || !r.vis) warn(t, 'HOOK0', `[${r.sc}] frame ${t < .1 ? '0' : 'at 0.5 s'} is ${Math.round(r.cov * 100)}% covered${r.vis ? '' : ', no drawn visual'} - HOOK(['#part', ...]) the hook visual`); }
  for (let t = Math.max(meta.head + .5, FROM); t < Math.min(meta.end, TO); t += 1) {
    await p.evaluate(t => window.__timelines.main.seek(t), t); const r = await p.evaluate(probe, { t, FW, FH, VT }); if (!r.sc) continue;
    (scT[r.sc] = scT[r.sc] || []).push(t); const once = (k, m) => { const key = r.sc + k + m; if (seen[key]) return; seen[key] = 1; warn(t, k, `[${r.sc}] ${m}`); };
    if (r.cov < .25 && t - scT[r.sc][0] > (VT ? .6 : 1.5)) warn(t, 'EMPTY', `[${r.sc}] only ${Math.round(r.cov * 100)}% covered`);
    if (r.txt > (VT ? 70 : 110)) once('TEXT', `${r.txt} chars on screen`);
    r.small.forEach(s => once('SMALL', s)); r.out.forEach(s => once('OUT', s)); r.ovf.forEach(s => once('OVERFLOW', s)); r.ovl.forEach(s => once('OVERLAP', s));
    if (!r.vis) once('NOVISUAL', 'no drawn visual in this scene');
    r.cut.forEach(s => once('CUTTEXT', s)); r.sshot.forEach(s => once('SMALLSHOT', s)); r.svgout.forEach(s => once('SVGOUT', s));
    r.corner.forEach(x => once('ORBCORNER', x + (VT ? ' sits in the orb corner (keep the top-right free: x<850 or y>330 on the 1080x1920 frame)' : ' sits in the orb corner (keep x<1700 or y<870 free)')));
    r.capov.forEach(x => once('CAPTION', x + ' is under the caption band (keep parts above y 995 on the 810x1440 canvas)'));
    r.safe.forEach(x => once('SAFE', x + ' is under the Shorts player UI (keep parts in x 40..690 below y 675 and y 90..1110 on the 810x1440 canvas, the scene drift grows them 3%)'));
    if (r.orb === false && t - scT[r.sc][0] > 1.5) once('NOORB', 'corner orb not visible - ORB_ON it at the scene start');
  }
  const bt = [...new Set(meta.beats)].filter(t => t >= meta.head).sort((a, b) => a - b); bt.push(meta.end);
  const inR = t => t >= FROM - 5 && t <= TO;
  for (let i = 1; i < bt.length; i++) if (bt[i] - bt[i - 1] > 5 && inR(bt[i - 1])) warn(bt[i - 1], 'GAP', `${(bt[i] - bt[i - 1]).toFixed(1)} s with no beat`);
  let files = [];
  if (!NOSHEET) { await p.reload(); await p.waitForTimeout(500); const ts = [];
    const f0 = FROM >= 0 ? FROM : 1.2, f1 = Math.min(TO, meta.end + meta.tail - .2);
    for (let t = f0; t <= f1; t += EVERY) ts.push(t);
    if (FROM < 0) ts.push(VT ? 0.04 : meta.head + 1, VT ? meta.end + 1 : meta.end + 2);
    meta.nlt.forEach(([, t]) => { if (t + 1.5 >= f0 && t + 1.5 <= f1) ts.push(t + 1.5); });
    files = await sheets(b, p, ts, 'sheet'); }
  W.sort(); console.log(W.join('\n')); errs.filter(e => !e.includes('ERR_FILE_NOT_FOUND')).forEach(e => console.log('JS     ', e));
  console.log(`lcheck: ${W.length} warnings, ${errs.filter(e => !e.includes('ERR_FILE_NOT_FOUND')).length} js errors, ${Object.keys(scT).length} scenes, ${meta.cues.length} cues -> cues.json`);
  if (files.length) console.log(`look at these ${files.length} sheet(s) (frames every ${EVERY} s + every scene start + intro/outro):\n` + files.join('\n')); await b.close(); process.exit(errs.filter(e => !e.includes('ERR_FILE_NOT_FOUND')).length ? 1 : 0);
})();
