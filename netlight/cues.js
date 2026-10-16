// usage: node cues.js nl_test.html  -> cues.json (from window.__CUES)
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => { const b = await chromium.launch(); const p = await b.newPage(); await p.goto('file://' + path.resolve(process.argv[2])); await p.waitForTimeout(1500);
  const c = await p.evaluate(() => window.__CUES); fs.writeFileSync('cues.json', JSON.stringify(c)); console.log(c.length, 'cues'); await b.close(); })();
