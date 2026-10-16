// usage: node geomcheck.js nl_test.html [step=0.5]  -> flags text-on-text overlaps and labels sitting on a window border (things nlcheck misses)
const { chromium } = require('playwright'); const path = require('path');
(async () => { const [file, step = '0.5'] = process.argv.slice(2); const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + path.resolve(file)); await p.waitForTimeout(1500);
  const end = await p.evaluate(() => END + 3); const seen = new Set(); const out = [];
  for (let t = 2.6; t < end; t += +step) {
    await p.evaluate(t => window.__timelines.main.seek(t), t);
    const r = await p.evaluate(() => {
      const op = e => { let o = 1; for (let x = e; x && x !== document.body; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.visibility === 'hidden' || cs.display === 'none') return 0; o *= +cs.opacity; } return o; };
      const sc = [...document.querySelectorAll('.nsc')].find(s => op(s) > .5); if (!sc) return [];
      const name = e => { for (let x = e; x; x = x.parentElement) if (x.id) return x.id; return '?'; };
      // text leaves: elements whose own text is non-empty
      const T = []; const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
      while ((n = tw.nextNode())) { const el = n.parentElement; if (!n.textContent.trim() || el.closest('.nttl,.nhd') || el.classList.contains('nchar')) continue; if (!sc.contains(el) && !el.closest('#nlTop')) continue; if (op(el) < .3) continue; const rc = el.getBoundingClientRect(); if (rc.width < 2) continue; T.push([el, rc]); }
      document.querySelectorAll('.ncode').forEach(el => { if ((sc.contains(el)) && op(el) > .3) { const rc = el.getBoundingClientRect(); T.push([el, rc]); } });
      const W = [...sc.querySelectorAll('.nwin'), ...document.querySelectorAll('#nlTop .nwin')].filter(e => op(e) > .3).map(e => [e, e.getBoundingClientRect()]);
      const ia = (a, c) => Math.max(0, Math.min(a.right, c.right) - Math.max(a.left, c.left)) * Math.max(0, Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top));
      const res = [];
      for (let i = 0; i < T.length; i++) for (let j = i + 1; j < T.length; j++) { const [a, ra] = T[i], [c, rc] = T[j]; if (a.contains(c) || c.contains(a)) continue; const sm = Math.min(ra.width * ra.height, rc.width * rc.height); if (sm > 0 && ia(ra, rc) / sm > .12) res.push('TEXTxTEXT ' + name(a) + ' x ' + name(c)); }
      for (let i = 0; i < W.length; i++) for (let j = i + 1; j < W.length; j++) { const [a, ra] = W[i], [c, rc] = W[j]; if (a.contains(c) || c.contains(a)) continue; if (ia(ra, rc) > 400) res.push('WINxWIN ' + a.id + ' x ' + c.id); }
      for (const [el, re] of T) for (const [w, rw] of W) { if (w.contains(el)) { if (re.right > rw.right + 2 || re.bottom > rw.bottom + 2 || re.left < rw.left - 2) res.push('OUTSIDE-WIN ' + name(el) + ' in ' + w.id); continue; }
        if (ia(re, rw) / (re.width * re.height) > .92 && (re.right > rw.right - 10 || re.left < rw.left + 10 || re.bottom > rw.bottom - 10)) res.push('TOUCHES-BORDER ' + name(el) + ' / ' + w.id); const f = ia(re, rw) / (re.width * re.height); if (f > .08 && f < .92) res.push('ON-BORDER ' + name(el) + ' / ' + w.id); }
      return [...new Set(res)];
    });
    r.forEach(m => { if (!seen.has(m)) { seen.add(m); out.push(t.toFixed(1).padStart(6) + 's  ' + m); } });
  }
  console.log(out.join('\n')); console.log('geomcheck:', out.length, 'issues'); await b.close(); })();
