// usage: node webshot.js <url> <out.png> [fullPage=1] [dark=1]  -> sharp (2x) screenshot through the session proxy
const { chromium } = require('playwright');
(async () => { const [url, out, full = '1', dark = '1'] = process.argv.slice(2);
  const b = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined });
  const p = await b.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, colorScheme: dark === '1' ? 'dark' : 'light' });
  try { const r = await p.goto(url, { waitUntil: 'networkidle', timeout: 45000 }); await p.waitForTimeout(800);
    await p.screenshot({ path: out, fullPage: full === '1' }); console.log('OK', r && r.status(), out); }
  catch (e) { console.log('FAIL', url, String(e).split('\n')[0]); process.exitCode = 2; }
  await b.close(); })();
