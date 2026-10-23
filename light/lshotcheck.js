// LIGHT screenshot check: every moment a real page (nlShot) changes - a highlight appears, the cursor lands, a zoom/scroll ends -
// is grabbed at FULL SIZE (1:1 crop of the browser window + the cursor around it), labelled with the time and the visible highlights.
//   node ~/hf-kit/light/lshotcheck.js index.html [--from A --to B]
// Writes out/pages_NN.png (several moments stacked per sheet) and prints the paths. Read EVERY sheet before delivery:
// is each box around the words the voice says, does the cursor tip sit on its target, is any line cut by the window edge?
// (Contact sheets are too small for this - a box on the wrong row looks fine at 1/4 size.)
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const { testPage, lab } = require('./lsheet.js');
const A = process.argv.slice(2), opt = (k, d) => { const i = A.indexOf(k); if (i < 0) return d; const v = A[i + 1]; A.splice(i, 2); return v; };
const FROM = +opt('--from', 0), TO = +opt('--to', 1e9), src = A[0] || 'index.html', STEP = .2;
(async () => {
  testPage(src, 'nl_shot.html'); fs.mkdirSync('out', { recursive: true });
  fs.readdirSync('out').filter(f => /^pages_\d+\.png$/.test(f)).forEach(f => fs.unlinkSync(path.join('out', f)));
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + path.resolve('nl_shot.html')); await p.waitForTimeout(800);
  const end = await p.evaluate(() => END + TAIL);
  // state of every visible screenshot window: which highlights are on, where the cursor is, the image transform
  const probe = () => {
    const op = e => { let o = 1; for (let x = e; x && x !== document.body; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.visibility === 'hidden' || cs.display === 'none') return 0; o *= +cs.opacity; } return o; };
    return [...document.querySelectorAll('.nshot')].filter(e => op(e) > .9).map(e => {
      const r = e.getBoundingClientRect(), im = document.getElementById(e.id + 'im').getBoundingClientRect();
      const hl = [...document.getElementById(e.id + 'im').querySelectorAll('[id]')].filter(h => op(h) > .9).map(h => h.id);
      const cur = (window.__NLCURS || []).map(c => document.getElementById(c)).filter(c => c && op(c) > .9 && c.closest('.nsc') === e.closest('.nsc'))
        .map(c => { const q = c.getBoundingClientRect(); return [c.id, Math.round((q.left - r.left) / r.width * 150), Math.round((q.top - r.top) / r.width * 150)]; });
      // relative to the window (the slow scene drift moves everything together and is not a change)
      const rel = [(im.left - r.left) / r.width, (im.top - r.top) / r.width, im.width / r.width].map(v => Math.round(v * 150));
      return { id: e.id, rect: [r.left, r.top, r.width, r.height].map(Math.round), sig: JSON.stringify([hl, cur, rel]), hl, cur: cur.map(c => c[0]) };
    });
  };
  const moments = []; let prev = {};
  for (let t = Math.max(FROM, 0); t <= Math.min(TO, end); t += STEP) {
    await p.evaluate(t => window.__timelines.main.seek(t), t); const now = await p.evaluate(probe), cur = {};
    for (const s of now) { cur[s.id] = s.sig; if (prev[s.id] !== s.sig) s.pending = true; }
    // keep a moment once its state stayed the same for one more step (zoom finished, highlight fully in)
    for (const s of now) if (prev['_p_' + s.id] && prev[s.id] === s.sig) { moments.push({ t: +(t).toFixed(2), ...s }); }
    const np = {}; now.forEach(s => { np[s.id] = s.sig; np['_p_' + s.id] = prev[s.id] !== s.sig; }); prev = np;
  }
  const crops = [];
  for (const m of moments) {
    await p.evaluate(t => window.__timelines.main.seek(t), m.t); await p.waitForTimeout(30);
    const [x, y, w, h] = m.rect, cx = Math.max(0, x - 70), cy = Math.max(0, y - 20), cw = Math.min(1920 - cx, w + 140), ch = Math.min(1080 - cy, h + 90);
    crops.push({ m, img: (await p.screenshot({ type: 'png', clip: { x: cx, y: cy, width: cw, height: ch } })).toString('base64'), cw, ch });
  }
  const comp = await b.newPage({ viewport: { width: 1920, height: 1080 } }); const files = []; let i = 0;
  while (i < crops.length) {   // stack crops (1:1) into sheets of at most ~2100 px height
    const grp = []; let H = 0; while (i < crops.length && (H + crops[i].ch + 40 <= 2100 || !grp.length)) { grp.push(crops[i]); H += crops[i].ch + 40; i++; }
    const W = Math.max(...grp.map(c => c.cw)); await comp.setViewportSize({ width: W, height: H });
    await comp.setContent(`<body style="margin:0;background:#222">` + grp.map(c => `<div style="font:bold 22px monospace;color:#ff0;background:#000;padding:6px 8px;height:28px">${lab(c.m.t)}  ${c.m.id}  HL: ${c.m.hl.join(' ') || '-'}  cursor: ${c.m.cur.join(' ') || '-'}</div><img src="data:image/png;base64,${c.img}" style="display:block;width:${c.cw}px;height:${c.ch}px">`).join('') + '</body>');
    const f = path.join('out', `pages_${String(files.length + 1).padStart(2, '0')}.png`); await comp.screenshot({ path: f, fullPage: true }); files.push(f);
  }
  console.log(`lshotcheck: ${moments.length} screenshot moments -> ${files.length} sheet(s) at full size. Read every one:\n` + files.join('\n'));
  await b.close();
})();
