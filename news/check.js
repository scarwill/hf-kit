// CHECK (Shorts or long, size read from the html):  node ~/nkit/news/check.js [index.html] [--from A --to B] [--every 4] [--nosheet]
// Seeks the video every 1 s (local gsap shim, no network) and reports:
//   EMPTY    < 25% of the frame (below the title) is covered by visible parts -> fill it: bigger visual, hero object
//   TEXT     > 110 visible text characters in one frame (titles excluded)    -> show it, don't write it
//   SMALL    visible text under 24 px                                          -> 30 px body, 24 px labels minimum
//   OUT      a visible part sticks out of the 1920x1080 frame
//   OVERFLOW text spills out of its window / chip
//   OVERLAP  two windows/chips/labels cover each other (> 15% of the smaller)
//   NOVISUAL a scene has no drawn visual (svg / net / curve / cells / docs) -> every scene needs one
//   GAP      > 5 s without any animation beat
//   JS       page errors + kit guards (NEWS: ...) + PHRASE NOT FOUND  -> always fix
// --from/--to limit the check to a time range (video seconds) = check one batch of scenes.
// Writes cues.json (sound cues for lmix.py) and contact sheets out/sheet_NN.png (one frame every --every s, 16 per sheet). Look at the SHEETS only.
// Exit code 1 when there are JS errors.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const A = process.argv.slice(2), opt = (k, d) => { const i = A.indexOf(k); if (i < 0) return d; const v = A[i + 1]; A.splice(i, 2); return v; };
const NOSHEET = A.includes('--nosheet'); if (NOSHEET) A.splice(A.indexOf('--nosheet'), 1);
const FROM = +opt('--from', -1), TO = +opt('--to', 1e9), EVERY0 = opt('--every', null), src = A[0] || 'index.html';
const { sheets } = require('./sheet.js');
require('./sheet.js').testPage(src, 'nl_test.html'); fs.mkdirSync('out', { recursive: true });
(async () => {
  const [VW, VH] = require('./sheet.js').frameSize(src); const LONG = VW > VH, EVERY = +(EVERY0 ?? (LONG ? 3 : 1.5)); const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: VW, height: VH } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
  await p.goto('file://' + path.resolve('nl_test.html'));
  const meta = await p.evaluate(() => ({ end: END, tail: TAIL, head: HEAD, beats: window.__BEATS || [], sc: (typeof NLSC !== 'undefined' ? NLSC : []), nlt: window.__NLT || [], cues: window.__CUES || [] }));
  fs.writeFileSync('cues.json', JSON.stringify(meta.cues));
  const W = []; const warn = (t, k, m) => W.push(`${String(t.toFixed(1)).padStart(6)}s  ${k.padEnd(8)} ${m}`);
  const probe = ([VW, VH]) => {
    const op = e => { let o = 1; for (let x = e; x && x !== document.body; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.visibility === 'hidden' || cs.display === 'none') return 0; o *= +cs.opacity; } return o; };
    const sc = [...document.querySelectorAll('.nsc')].find(s => op(s) > .5); const R = { sc: sc ? sc.id : null, cov: 0, txt: 0, small: [], out: [], ovf: [], ovl: [], vis: false };
    if (!sc) return R; const parts = [...sc.querySelectorAll('[id]:not(.nttl)'), ...document.querySelectorAll('#nlTop > [id]')].filter(e => op(e) > .15);
    const GX = Math.floor(VW / 40), GY = VH > VW ? 37 : Math.floor((VH - 110) / 40), G = new Uint8Array(GX * GY); const mark = r => { for (let gx = Math.max(0, Math.floor(r.left / 40)); gx < Math.min(GX, Math.ceil(r.right / 40)); gx++) for (let gy = Math.max(0, Math.floor((r.top - 110) / 40)); gy < Math.min(GY, Math.ceil((r.bottom - 110) / 40)); gy++) G[gy * GX + gx] = 1; };
    parts.forEach(e => { let r = e.getBoundingClientRect(); if (r.width < 2 && e.firstElementChild) r = e.firstElementChild.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return; if (r.width > VW - 20 && r.height > VH - 40) return; mark(r);
      if ((r.left < -8 || r.top < -8 || r.right > VW + 8 || r.bottom > VH + 8)) R.out.push(e.id); });
    R.cov = G.reduce((a, v) => a + v, 0) / G.length;
    R.vis = !!sc.querySelector('svg path, svg circle, .ncell, .ndoc, .nbox, .sshot');
    R.safe = [...sc.querySelectorAll('.stxt')].filter(e => op(e) > .3).map(e => [e, e.getBoundingClientRect()]).filter(([e, r]) => VH > VW ? (r.bottom > 1592 || (r.right > 942 && r.bottom > 900)) : (r.left < 50 || r.top < 40 || r.right > VW - 50 || r.bottom > VH - 40)).map(([e]) => e.id || e.className);
    const tw = document.createTreeWalker(sc, NodeFilter.SHOW_TEXT); let n; while ((n = tw.nextNode())) { const el = n.parentElement; if (!n.textContent.trim() || el.closest('.nttl') || op(el) < .15) continue; if (!el.closest('.nhd,.ncell,.nrow,.ncode,.nchar,.nico,.nwq,.sshot,.scode')) R.txt += n.textContent.trim().length; const fsz = parseFloat(getComputedStyle(el).fontSize); if (fsz < (VW > VH ? 27.5 : 29.5) && !el.closest('.sshot')) R.small.push(n.textContent.trim().slice(0, 18) + ' ' + fsz + 'px'); }
    [...sc.querySelectorAll('.nwin,.nchp,.nrow'), ...document.querySelectorAll('#nlTop .nwin')].filter(e => op(e) > .15).forEach(e => { if (e.scrollWidth > e.clientWidth + 4 || (e.classList.contains('nwin') && e.style.height !== 'auto' && e.scrollHeight > e.clientHeight + 4)) R.ovf.push(e.id || e.className); });
    const box = [...sc.querySelectorAll('.nwin,.nchp,.nlb'), ...document.querySelectorAll('#nlTop .nwin')].filter(e => op(e) > .3).map(e => [e, e.getBoundingClientRect()]);
    for (let i = 0; i < box.length; i++) for (let j = i + 1; j < box.length; j++) { const [a, ra] = box[i], [c, rc] = box[j]; if (a.contains(c) || c.contains(a)) continue;
      const ix = Math.max(0, Math.min(ra.right, rc.right) - Math.max(ra.left, rc.left)), iy = Math.max(0, Math.min(ra.bottom, rc.bottom) - Math.max(ra.top, rc.top)), sm = Math.min(ra.width * ra.height, rc.width * rc.height);
      if (sm > 0 && ix * iy / sm > .15) R.ovl.push((a.id || a.className) + ' x ' + (c.id || c.className)); }
    return R; };
  const seen = {}, scT = {};
  // FIRSTFRAME (Shorts, 28 Oct 2026): the swipe decision is made in the first 1-2 s. A big drawing / photo must be on screen and
  // text short. Source pills (.spill) and captions do not count. Guideline, not yet proven by our swipe data: WARN only.
  if (VH > VW) {
    await p.evaluate(t => window.__timelines.main.seek(t), meta.head + .3);
    const ff = await p.evaluate(() => { const op = e => { let o = 1; for (let x = e; x && x !== document.body; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.visibility === 'hidden' || cs.display === 'none') return 0; o *= +cs.opacity; } return o; };
      const sc = [...document.querySelectorAll('.nsc')].find(s => op(s) > .5); if (!sc) return null; let words = 0;
      const tw = document.createTreeWalker(sc, NodeFilter.SHOW_TEXT); let n; while ((n = tw.nextNode())) { const el = n.parentElement; if (!n.textContent.trim() || el.closest('.spill,.nttl') || op(el) < .3) continue; words += n.textContent.trim().split(/\s+/).length; }
      const vis = [...sc.querySelectorAll('svg, img, .sshot, .sphoto')].filter(e => op(e) > .3 && e.getBoundingClientRect().width * e.getBoundingClientRect().height > 40000).length;
      return { words, vis }; });
    if (ff && ff.words > 12) warn(meta.head + .3, 'FIRSTFRAME', `${ff.words} words on the first frame: keep the hook text short, let one big visual carry it`);
    if (ff && !ff.vis) warn(meta.head + .3, 'FIRSTFRAME', 'no big drawing / photo / screenshot on the first frame');
  }
  for (let t = Math.max(meta.head + .5, FROM); t < Math.min(meta.end, TO); t += 1) {
    await p.evaluate(t => window.__timelines.main.seek(t), t); const r = await p.evaluate(probe, [VW, VH]); if (!r.sc) continue;
    (scT[r.sc] = scT[r.sc] || []).push(t); const once = (k, m) => { const key = r.sc + k + m; if (seen[key]) return; seen[key] = 1; warn(t, k, `[${r.sc}] ${m}`); };
    if (r.cov < .25 && t - scT[r.sc][0] > 1.5) warn(t, 'EMPTY', `[${r.sc}] only ${Math.round(r.cov * 100)}% covered`);
    if (r.txt > 140) once('TEXT', `${r.txt} chars on screen`);
    r.small.forEach(s => once('SMALL', s)); r.out.forEach(s => once('OUT', s)); r.ovf.forEach(s => once('OVERFLOW', s)); r.ovl.forEach(s => once('OVERLAP', s));
    if (!r.vis) once('NOVISUAL', 'no drawn visual in this scene');
    (r.safe || []).forEach(x => once('SAFE', x + ' is outside the safe zone (Shorts: above y 1590, left of x 940 below y 900; long: 50 px from every edge)'));
  }
  const bt = [...new Set(meta.beats)].filter(t => t >= meta.head).sort((a, b) => a - b); bt.push(meta.end);
  const inR = t => t >= FROM - 5 && t <= TO;
  for (let i = 1; i < bt.length; i++) if (bt[i] - bt[i - 1] > (LONG ? 4 : 2.5) && inR(bt[i - 1])) warn(bt[i - 1], 'GAP', `${(bt[i] - bt[i - 1]).toFixed(1)} s with no beat`);
  let files = [];
  if (!NOSHEET) { await p.reload(); await p.waitForTimeout(500); const ts = [];
    const f0 = FROM >= 0 ? FROM : .4, f1 = Math.min(TO, meta.end + meta.tail - .2);
    for (let t = f0; t <= f1; t += EVERY) ts.push(t);
    if (FROM < 0) ts.push(meta.head + 1, meta.end + 2);
    meta.nlt.forEach(([, t]) => { if (t + 1.5 >= f0 && t + 1.5 <= f1) ts.push(t + 1.5); });
    files = await sheets(b, p, ts, 'sheet'); }
  W.sort(); console.log(W.join('\n')); errs.filter(e => !e.includes('ERR_FILE_NOT_FOUND')).forEach(e => console.log('JS     ', e));
  console.log(`check: ${W.length} warnings, ${errs.filter(e => !e.includes('ERR_FILE_NOT_FOUND')).length} js errors, ${Object.keys(scT).length} scenes, ${meta.cues.length} cues -> cues.json`);
  if (files.length) console.log(`look at these ${files.length} sheet(s) (frames every ${EVERY} s + every scene start + intro/outro):\n` + files.join('\n')); await b.close(); process.exit(errs.filter(e => !e.includes('ERR_FILE_NOT_FOUND')).length ? 1 : 0);
})();
