// usage: node shots.js nl_test.html 12.5 13 13.5 ...  -> shot_<t>.png (seeks in increasing order)
const { chromium } = require('playwright'); const path = require('path');
(async () => { const [file, ...ts] = process.argv.slice(2); const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + path.resolve(file)); await p.waitForTimeout(1500);
  for (const t of ts.map(Number).sort((a, c) => a - c)) { await p.evaluate(t => window.__timelines.main.seek(t), t); await p.waitForTimeout(80); await p.screenshot({ path: `shot_${t}.png` }); }
  await b.close(); })();
