// usage: node render.js out_dir fps [t1 t2 ...]  (no times = whole video)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const [out, fpsArg, ...ts] = process.argv.slice(2);
  const fps = +fpsArg; fs.mkdirSync(out, { recursive: true });
  const br = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const pg = await br.newPage({ viewport: { width: 1080, height: 1920 } });
  pg.on('pageerror', e => console.log('PAGEERR', e.message));
  pg.on('console', m => { if (m.type() === 'error') console.log('CONSOLE', m.text()); });
  await pg.goto('file://' + path.resolve('index.html'));
  await pg.waitForFunction('window.READY');
  const dur = await pg.evaluate('DUR');
  const times = ts.length ? ts.map(Number) : [...Array(Math.round(dur * fps)).keys()].map(i => i / fps);
  const t0 = Date.now();
  for (let i = 0; i < times.length; i++) {
    await pg.evaluate(t => window.renderAt(t), times[i]);
    await pg.screenshot({ path: path.join(out, `f_${String(i).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 92 });
    if (i % 100 === 0) console.log(i, '/', times.length, ((Date.now() - t0) / 1000).toFixed(0) + 's');
  }
  await br.close();
})();
