// usage: node labelcheck.js [index.html] [minSeconds=1]   -> how long every on-screen label is really readable (no screenshots, ~20 s)
// A label = the group around each SVG <text> in #world (pill, callout, bubble, counter, big number, card ...). It counts as visible at a
// moment when its text is not hidden (opacity of the text and all its parents > .5, visibility not hidden) and >= 60 % of it is inside
// the frame. Samples the timeline every 0.05 s with the gsap shim (like check.js).
// Prints WARN for every label whose longest visible stretch is shorter than minSeconds (too fast to read) and for labels that are
// NEVER visible (shown and hidden on almost the same word, or off-screen). Fix them: show the label earlier / hide it later.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const src = process.argv[2] || 'index.html', MIN = +(process.argv[3] || 1);
const html = fs.readFileSync(src, 'utf8').replace(/<script src="https:\/\/cdn\.jsdelivr[^>]*><\/script>/, `<script src="${path.join(__dirname, 'gsap-shim.js')}"></script>`).replace(/<link [^>]*fonts[^>]*>/g, '');
fs.writeFileSync('lc_test.html', html);
(async () => {
  const vw = +(html.match(/data-width="(\d+)"/) || [0, 1920])[1], vh = +(html.match(/data-height="(\d+)"/) || [0, 1080])[1];
  const dur = +(html.match(/data-duration="([\d.]+)"/) || [0, 0])[1];
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: vw, height: vh } });
  const errs = []; p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await p.goto('file://' + path.resolve('lc_test.html')); await p.evaluate(() => document.fonts.ready);
  const labels = await p.evaluate(() => { const L = {}; window.__LC = [];
    document.querySelectorAll('#world text').forEach(t => { if (!t.textContent.trim()) return;
      const root = t.parentElement.closest('[id]'); if (!root || root.id === 'world' || root.tagName === 'svg') return;
      const key = root.id; if (!L[key]) { L[key] = t.textContent.trim().slice(0, 40); window.__LC.push([key, []]); }
      window.__LC.find(x => x[0] === key)[1].push(t); });
    return L; });
  const N = Math.ceil(dur / .05), vis = {}; Object.keys(labels).forEach(k => vis[k] = []);
  for (let i = 0; i <= N; i++) { const t = +(i * .05).toFixed(2);
    const on = await p.evaluate(([t, W, H]) => { window.__timelines.main.seek(t); const out = [];
      const shown = e => { for (let n = e, a = 1; n && n.nodeType === 1; n = n.parentElement) { const cs = getComputedStyle(n); if (cs.display === 'none') return false; a *= +cs.opacity; if (a <= .5) return false; } return getComputedStyle(e).visibility !== 'hidden'; };
      const inside = e => { const r = e.getBoundingClientRect(); if (!r.width || !r.height) return false; const w = Math.max(0, Math.min(r.right, W) - Math.max(r.left, 0)), h = Math.max(0, Math.min(r.bottom, H) - Math.max(r.top, 0)); return w * h >= .6 * r.width * r.height; };
      window.__LC.forEach(([k, ts]) => { if (ts.some(e => shown(e) && inside(e))) out.push(k); }); return out; }, [t, vw, vh]);
    on.forEach(k => vis[k].push(t)); }
  const rows = Object.keys(labels).map(k => { const ts = vis[k]; let best = 0, run = 0, first = ts.length ? ts[0] : null;
    ts.forEach((t, i) => { run = i && Math.abs(t - ts[i - 1] - .05) < .001 ? run + .05 : .05; best = Math.max(best, run); });
    return { k, text: labels[k], first, best: +best.toFixed(2) }; }).sort((a, b) => (a.first ?? 1e9) - (b.first ?? 1e9));
  let bad = 0;
  rows.forEach(r => { const flag = r.first === null ? 'WARN NEVER VISIBLE' : r.best < MIN ? `WARN only ${r.best}s` : 'ok';
    if (flag !== 'ok') bad++; console.log(`${flag.padEnd(20)} ${String(r.first ?? '-').padStart(6)}s  ${r.best.toFixed(2).padStart(5)}s  #${r.k}  "${r.text}"`); });
  errs.forEach(e => console.log(e));
  console.log(bad ? `labelcheck: ${bad} label(s) shorter than ${MIN}s or never visible - fix the timing` : `labelcheck: all ${rows.length} labels readable for >= ${MIN}s`);
  await b.close();
})();
