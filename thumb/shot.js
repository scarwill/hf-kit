// node shot.js <dir with page.html+thumbs.js> [n=3]  -> thumb_1.png.. (1920x1080) + sheet.png (big + phone-size check)
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
const dir = path.resolve(process.argv[2] || '.'); const N = +(process.argv[3] || 3);
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1.5 });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  for (let i = 1; i <= N; i++) { await p.goto('file://' + path.join(dir, 'page.html') + '?v=' + i); await p.waitForFunction(() => window.__DONE);
    await p.screenshot({ path: path.join(dir, `thumb_${i}.png`) }); }
  const imgs = [...Array(N)].map((_, i) => 'file://' + path.join(dir, `thumb_${i + 1}.png`));
  const q = await b.newPage({ viewport: { width: 1340, height: 100 } });
  const sh = path.join(dir, 'sheet.html'); fs.writeFileSync(sh, `<body style="margin:0;background:#0f0f0f;font:16px sans-serif;color:#aaa;padding:20px">` +
    imgs.map((s, i) => `<div style="margin-bottom:18px">#${i + 1}<br><img src="${s}" width="640"> <img src="${s}" width="246" style="vertical-align:top;margin-left:16px"> <img src="${s}" width="168" style="vertical-align:top;margin-left:16px"></div>`).join('') + '</body>'); await q.goto('file://' + sh);
  await q.waitForTimeout(300); await q.screenshot({ path: path.join(dir, 'sheet.png'), fullPage: true });
  console.log(errs.length ? 'ERRORS:\n' + errs.join('\n') : 'ok'); await b.close();
})();
