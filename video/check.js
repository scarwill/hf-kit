// usage: node check.js [index.html]  -> out/f*.png every 2s + scene frames, info.json (beats, scenes, warnings)
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const src = process.argv[2] || 'index.html';
const html = fs.readFileSync(src, 'utf8').replace(/<script src="https:\/\/cdn\.jsdelivr[^>]*><\/script>/, `<script src="${path.join(__dirname, 'gsap-shim.js')}"></script>`).replace(/<link [^>]*fonts[^>]*>/g, '');
fs.writeFileSync('test.html', html); fs.mkdirSync('out', { recursive: true });
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const logs = []; p.on('console', m => logs.push(m.type() + ': ' + m.text())); p.on('pageerror', e => logs.push('PAGEERROR: ' + e.message));
  await p.goto('file://' + path.resolve('test.html'));
  const info = await p.evaluate(() => ({ beats: window.__BEATS, scn: window.__SCN, dur: window.__timelines.main.duration(), end: END }));
  info.logs = [...new Set(logs)].filter(l => !l.includes('ERR_FILE_NOT_FOUND'));
  fs.writeFileSync('info.json', JSON.stringify(info));
  const sc = info.scn.map(s => s[1]); const T = new Set();
  for (let t = 1; t < info.end; t += 2) T.add(+t.toFixed(1));
  sc.forEach((t, i) => { const nx = i + 1 < sc.length ? sc[i + 1] : info.end; T.add(+(nx - .6).toFixed(1)); });
  for (const t of [...T].sort((a, b) => a - b)) { await p.evaluate(t => window.__timelines.main.seek(t), t); await p.screenshot({ path: `out/f${t.toFixed(1).padStart(6, '0')}.png` }); }
  console.log('done', T.size, 'frames'); await b.close();
})();
