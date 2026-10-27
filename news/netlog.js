// usage: node netlog.js <url>  -> which hosts loaded and which failed (a failed CSS/CDN host = add it to Allowed domains)
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined }); const p = await b.newPage();
  const bad = {}, ok = {}; p.on('requestfailed', r => { const h = new URL(r.url()).host; bad[h] = (bad[h] || 0) + 1; }); p.on('requestfinished', r => { const h = new URL(r.url()).host; ok[h] = (ok[h] || 0) + 1; });
  await p.goto(process.argv[2], { waitUntil: 'networkidle', timeout: 45000 }).catch(e => console.log('goto', String(e).split('\n')[0]));
  console.log('OK hosts', ok); console.log('FAILED hosts', bad); await b.close(); })();
