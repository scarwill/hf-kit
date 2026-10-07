// usage: node textcheck.js [index.html]   -> prints every SVG text that sticks out of its card / pill / bubble / panel (no screenshots, ~5 s)
// A text is checked against the first <rect> in its own group (or up to 3 parent groups) that contains the text's centre.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const src = process.argv[2] || 'index.html';
const html = fs.readFileSync(src, 'utf8').replace(/<script src="https:\/\/cdn\.jsdelivr[^>]*><\/script>/, `<script src="${path.join(__dirname, 'gsap-shim.js')}"></script>`).replace(/<link [^>]*fonts[^>]*>/g, '');
fs.writeFileSync('tc_test.html', html);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = []; p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await p.goto('file://' + path.resolve('tc_test.html')); await p.evaluate(() => document.fonts.ready);
  const out = await p.evaluate(() => { const R = [];
    document.querySelectorAll('#world text').forEach(t => { const tb = t.getBBox(); if (!tb.width || !t.textContent.trim()) return; let g = t.parentNode;
      for (let d = 0; d < 4 && g && g.tagName === 'g'; d++, g = g.parentNode) { const r = [...g.children].find(c => c.tagName === 'rect' && c !== t); if (!r) continue;
        const rb = r.getBBox(), cx = tb.x + tb.width / 2, cy = tb.y + tb.height / 2; if (cx < rb.x || cx > rb.x + rb.width || cy < rb.y || cy > rb.y + rb.height) continue;
        const pad = 6; if (tb.x < rb.x + pad || tb.x + tb.width > rb.x + rb.width - pad || tb.y < rb.y - 2 || tb.y + tb.height > rb.y + rb.height + 2) {
          const id = (t.closest('[id]') || {}).id || '?'; R.push(`OVERFLOW "${t.textContent}" (in #${id}) text x ${tb.x | 0}-${(tb.x + tb.width) | 0} vs box ${rb.x | 0}-${(rb.x + rb.width) | 0}, y ${tb.y | 0}-${(tb.y + tb.height) | 0} vs ${rb.y | 0}-${(rb.y + rb.height) | 0}`); } break; } });
    return R; });
  console.log(out.length ? out.join('\n') : 'textcheck: no text overflow'); if (errs.length) console.log(errs.join('\n')); fs.unlinkSync('tc_test.html'); await b.close(); })();
