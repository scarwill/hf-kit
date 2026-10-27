// PAGESHOT: screenshot a real web page and find exact phrases on it (for highlights).
//   node ~/nkit/news/pageshot.js <url> <out-prefix> ["phrase 1" "phrase 2" ...] [--crop y0:y1 ...] [--width 900]
// Writes <out>_full.png (full page, 2x pixels), prints every phrase's boxes in CSS px [x, y, w, h] (page coords),
// and for each --crop y0:y1 (CSS px) writes <out>_cropN.png (x 110..790 of a 900-wide page = the text column; change with --cx x0:x1).
// Highlight on a crop (image pixels): px = (x - x0) * 2, py = (y - y0) * 2, pw = w * 2, ph = h * 2  -> el.hl(hid, px, py, pw, ph) on an sShot of that crop.
// If the page comes back unstyled or blank, the host is blocked or needs a login: ask the user for a screenshot instead.
const { chromium } = require('playwright'); const { execFileSync } = require('child_process');
const A = process.argv.slice(2), opt = (k, d) => { const i = A.indexOf(k); if (i < 0) return d; const v = A[i + 1]; A.splice(i, 2); return v; };
const W = +opt('--width', 900), CX = opt('--cx', '110:790').split(':').map(Number), crops = [];
for (let i = A.indexOf('--crop'); i >= 0; i = A.indexOf('--crop')) { crops.push(A[i + 1].split(':').map(Number)); A.splice(i, 2); }
const [url, out, ...keys] = A;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: W, height: 1400 }, deviceScaleFactor: 2, colorScheme: 'light', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36' });
  await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(e => console.log('load warning:', e.message.split('\n')[0])); await p.waitForTimeout(1500);
  await p.screenshot({ path: out + '_full.png', fullPage: true });
  const r = await p.evaluate(keys => keys.map(k => { const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) { const i = n.textContent.indexOf(k); if (i < 0) continue; const rg = document.createRange(); rg.setStart(n, i); rg.setEnd(n, i + k.length);
      return [k, [...rg.getClientRects()].map(q => [Math.round(q.left + scrollX), Math.round(q.top + scrollY), Math.round(q.width), Math.round(q.height)])]; } return [k, null]; }), keys);
  r.forEach(([k, bx]) => console.log(bx ? `FOUND    "${k}" ${JSON.stringify(bx)}` : `NOTFOUND "${k}"`));
  await b.close();
  crops.forEach(([y0, y1], i) => { const f = `${out}_crop${i + 1}.png`;
    execFileSync('python3', ['-c', `from PIL import Image; im = Image.open('${out}_full.png'); im.crop((${CX[0] * 2}, ${y0 * 2}, ${CX[1] * 2}, ${y1 * 2})).save('${f}'); print('${f}', im.crop((${CX[0] * 2}, ${y0 * 2}, ${CX[1] * 2}, ${y1 * 2})).size, 'origin css', ${CX[0]}, ${y0})`], { stdio: 'inherit' }); });
})();
