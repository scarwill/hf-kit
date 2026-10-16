// NEWS contact sheets: many video frames in ONE image (4x4 = 16 frames, each labelled m:ss.s). Look at sheets, never at single frames.
//   node nsheet.js index.html every 4 [from] [to]      -> one frame every 4 s (whole video, or from..to in video seconds)
//   node nsheet.js index.html range 12 15 .4           -> motion strip: every .4 s from 12 to 15 (a ball / packet / dot must move in every frame and land on its word)
//   node nsheet.js index.html at 12.5 30 61.2          -> exactly these times (after a fix: only the fixed moments)
//   options: --name <prefix> (default sheet)  --cols 3 (bigger frames, 9 per sheet)
// Writes <prefix>_01.png, <prefix>_02.png ... in out/ and prints their paths.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');

// html -> local test page (local gsap shim instead of the CDN, no web fonts)
function testPage(src, out) {
  const html = fs.readFileSync(src, 'utf8').replace(/<script src="https:\/\/cdn\.jsdelivr[^>]*><\/script>/, `<script src="${path.join(__dirname, '..', 'video', 'gsap-shim.js')}"></script>`).replace(/<link [^>]*fonts[^>]*>/g, '');
  fs.writeFileSync(out, html); return out;
}
const lab = t => `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, '0')}`;
// page = a playwright page with the video loaded (seeks forward only, so times are sorted). Returns the sheet paths.
async function sheets(browser, page, times, prefix = 'sheet', cols = 4) {
  times = [...new Set(times.map(t => +(+t).toFixed(2)))].sort((a, b) => a - b); const per = cols * cols, fw = Math.round(1920 / cols), fh = Math.round(1080 / cols), files = [];
  fs.mkdirSync('out', { recursive: true }); fs.readdirSync('out').filter(f => f.startsWith(prefix + '_') && f.endsWith('.png')).forEach(f => fs.unlinkSync(path.join('out', f)));
  const comp = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  for (let k = 0; k < times.length; k += per) {
    const grp = times.slice(k, k + per), imgs = [];
    for (const t of grp) { await page.evaluate(t => window.__timelines.main.seek(t), t); await page.waitForTimeout(40); imgs.push((await page.screenshot({ type: 'jpeg', quality: 72 })).toString('base64')); }
    const rows = Math.ceil(grp.length / cols);
    await comp.setViewportSize({ width: 1920, height: rows * fh });
    await comp.setContent(`<body style="margin:0;background:#000;display:grid;grid-template-columns:repeat(${cols},${fw}px)">` + imgs.map((b, i) =>
      `<div style="position:relative;width:${fw}px;height:${fh}px;outline:1px solid #333"><img src="data:image/jpeg;base64,${b}" style="width:100%;height:100%;display:block"><span style="position:absolute;left:4px;top:3px;font:bold 18px monospace;color:#ff0;background:#000a;padding:0 4px">${lab(grp[i])}</span></div>`).join('') + '</body>');
    const f = path.join('out', `${prefix}_${String(files.length + 1).padStart(2, '0')}.png`); await comp.screenshot({ path: f }); files.push(f);
  }
  await comp.close(); return files;
}
module.exports = { sheets, testPage, lab };

if (require.main === module) (async () => {
  const a = process.argv.slice(2), opt = k => { const i = a.indexOf(k); if (i < 0) return null; const v = a[i + 1]; a.splice(i, 2); return v; };
  const name = opt('--name') || 'sheet', cols = +(opt('--cols') || 4), [src, mode, ...v] = a, n = v.map(Number);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + path.resolve(testPage(src, 'l_sheet.html'))); await p.waitForTimeout(800);
  const end = await p.evaluate(() => END + TAIL); let ts = [];
  if (mode === 'every') { const st = n[0] || 4, f = n[1] ?? 1, to = n[2] ?? end - .1; for (let t = f; t <= to + 1e-6; t += st) ts.push(t); }
  else if (mode === 'range') { const [f, to, st = .4] = n; for (let t = f; t <= to + 1e-6; t += st) ts.push(t); }
  else if (mode === 'at') ts = n;
  else { console.log('usage: node nsheet.js index.html every 4 [from] [to] | range A B step | at t1 t2 ...  [--name x] [--cols 3]'); process.exit(2); }
  const files = await sheets(b, p, ts.filter(t => t >= 0 && t <= end), name, cols);
  console.log(`${ts.length} frames -> ${files.length} sheet(s):\n` + files.join('\n')); await b.close();
})();
