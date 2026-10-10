// Netlight ML checker:  node ~/hf-kit/netlight/nlcheck.js [index.html]
// Seeks the video every 1 s (local gsap shim, no network) and warns about:
//   EMPTY    < 25% of the frame (below the title) is covered by visible parts -> fill it: bigger visual, hero object, orb
//   TEXT     > 110 visible text characters in one frame (titles excluded)    -> show it, don't write it
//   SMALL    visible text under 24 px                                          -> 30 px body, 24 px labels minimum
//   OUT      a visible part sticks out of the 1920x1080 frame
//   OVERFLOW text spills out of its window / chip
//   OVERLAP  two windows/chips/labels cover each other (> 15% of the smaller)
//   NOVISUAL a scene has no drawn visual (svg / net / curve / cells / docs) -> every scene needs one
//   GAP      > 5 s without any animation beat
// Also writes out/nc_<t>.png at the middle and end of every scene for a look.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const src = process.argv[2] || 'index.html';
const html = fs.readFileSync(src, 'utf8').replace(/<script src="https:\/\/cdn\.jsdelivr[^>]*><\/script>/, `<script src="${path.join(__dirname, '..', 'video', 'gsap-shim.js')}"></script>`).replace(/<link [^>]*fonts[^>]*>/g, '');
fs.writeFileSync('nl_test.html', html); fs.mkdirSync('out', { recursive: true });
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
  await p.goto('file://' + path.resolve('nl_test.html'));
  const meta = await p.evaluate(() => ({ end: END, head: HEAD, beats: window.__BEATS || [], sc: (typeof NLSC !== 'undefined' ? NLSC : []) }));
  const W = []; const warn = (t, k, m) => W.push(`${String(t.toFixed(1)).padStart(6)}s  ${k.padEnd(8)} ${m}`);
  const probe = () => {
    const op = e => { let o = 1; for (let x = e; x && x !== document.body; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.visibility === 'hidden' || cs.display === 'none') return 0; o *= +cs.opacity; } return o; };
    const sc = [...document.querySelectorAll('.nsc')].find(s => op(s) > .5); const R = { sc: sc ? sc.id : null, cov: 0, txt: 0, small: [], out: [], ovf: [], ovl: [], vis: false };
    if (!sc) return R; const parts = [...sc.querySelectorAll('[id]:not(.nttl)'), ...document.querySelectorAll('#nlTop > [id]')].filter(e => op(e) > .15);
    const G = new Uint8Array(48 * 22); const mark = r => { for (let gx = Math.max(0, Math.floor(r.left / 40)); gx < Math.min(48, Math.ceil(r.right / 40)); gx++) for (let gy = Math.max(0, Math.floor((r.top - 160) / 40)); gy < Math.min(22, Math.ceil((r.bottom - 160) / 40)); gy++) G[gy * 48 + gx] = 1; };
    parts.forEach(e => { let r = e.getBoundingClientRect(); if (r.width < 2 && e.firstElementChild) r = e.firstElementChild.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return; if (r.width > 1900 && r.height > 1000) return; mark(r);
      if (r.left < -8 || r.top < -8 || r.right > 1928 || r.bottom > 1088) R.out.push(e.id); });
    R.cov = G.reduce((a, v) => a + v, 0) / G.length;
    R.vis = !!sc.querySelector('svg path, svg circle, .ncell, .ndoc, .nbox');
    const tw = document.createTreeWalker(sc, NodeFilter.SHOW_TEXT); let n; while ((n = tw.nextNode())) { const el = n.parentElement; if (!n.textContent.trim() || el.closest('.nttl') || op(el) < .15) continue; if (!el.closest('.nhd,.ncell,.nrow,.ncode,.nchar,.nico')) R.txt += n.textContent.trim().length; const fsz = parseFloat(getComputedStyle(el).fontSize); if (fsz < 23.5) R.small.push(n.textContent.trim().slice(0, 18) + ' ' + fsz + 'px'); }
    [...sc.querySelectorAll('.nwin,.nchp,.nrow'), ...document.querySelectorAll('#nlTop .nwin')].filter(e => op(e) > .15).forEach(e => { if (e.scrollWidth > e.clientWidth + 4 || (e.classList.contains('nwin') && e.style.height !== 'auto' && e.scrollHeight > e.clientHeight + 4)) R.ovf.push(e.id || e.className); });
    const box = [...sc.querySelectorAll('.nwin,.nchp,.nlb'), ...document.querySelectorAll('#nlTop .nwin')].filter(e => op(e) > .3).map(e => [e, e.getBoundingClientRect()]);
    for (let i = 0; i < box.length; i++) for (let j = i + 1; j < box.length; j++) { const [a, ra] = box[i], [c, rc] = box[j]; if (a.contains(c) || c.contains(a)) continue;
      const ix = Math.max(0, Math.min(ra.right, rc.right) - Math.max(ra.left, rc.left)), iy = Math.max(0, Math.min(ra.bottom, rc.bottom) - Math.max(ra.top, rc.top)), sm = Math.min(ra.width * ra.height, rc.width * rc.height);
      if (sm > 0 && ix * iy / sm > .15) R.ovl.push((a.id || a.className) + ' x ' + (c.id || c.className)); }
    return R; };
  const seen = {}, scT = {};
  for (let t = meta.head + .5; t < meta.end; t += 1) {
    await p.evaluate(t => window.__timelines.main.seek(t), t); const r = await p.evaluate(probe); if (!r.sc) continue;
    (scT[r.sc] = scT[r.sc] || []).push(t); const once = (k, m) => { const key = r.sc + k + m; if (seen[key]) return; seen[key] = 1; warn(t, k, `[${r.sc}] ${m}`); };
    if (r.cov < .25 && t - scT[r.sc][0] > 1.5) warn(t, 'EMPTY', `[${r.sc}] only ${Math.round(r.cov * 100)}% covered`);
    if (r.txt > 110) once('TEXT', `${r.txt} chars on screen`);
    r.small.forEach(s => once('SMALL', s)); r.out.forEach(s => once('OUT', s)); r.ovf.forEach(s => once('OVERFLOW', s)); r.ovl.forEach(s => once('OVERLAP', s));
    if (!r.vis) once('NOVISUAL', 'no drawn visual in this scene');
  }
  const bt = [...new Set(meta.beats)].filter(t => t >= meta.head).sort((a, b) => a - b); bt.push(meta.end);
  for (let i = 1; i < bt.length; i++) if (bt[i] - bt[i - 1] > 5) warn(bt[i - 1], 'GAP', `${(bt[i] - bt[i - 1]).toFixed(1)} s with no beat`);
  await p.reload(); const shots = Object.values(scT).flatMap(ts => [ts[Math.floor(ts.length / 2)], ts[ts.length - 1]]).sort((a, b) => a - b);   // reload: the local shim only seeks forward cleanly
  for (const t of shots) { await p.evaluate(t => window.__timelines.main.seek(t), t); await p.screenshot({ path: `out/nc_${t.toFixed(1).padStart(6, '0')}.png` }); }
  W.sort(); console.log(W.join('\n')); errs.filter(e => !e.includes('ERR_FILE_NOT_FOUND')).forEach(e => console.log('JS     ', e));
  console.log(`nlcheck: ${W.length} warnings, ${errs.filter(e => !e.includes('ERR_FILE_NOT_FOUND')).length} js errors, ${Object.keys(scT).length} scenes`); await b.close(); process.exit(errs.filter(e => !e.includes('ERR_FILE_NOT_FOUND')).length ? 1 : 0);
})();
