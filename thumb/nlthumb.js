// Netlight ML thumbnail (net-thumb skill):  node ~/skit/thumb/nlthumb.js spec.json  ->  <out>.png (1280x720) + <out>_feed.png (phone feed preview)
// The channel's look (dark #05070d + navy glow, neon colours with meaning, Space Grotesk), 2-4 BIG words, ONE visual.
// Checks (light/analytics.md: acronym thumbnails got 0.4-0.8 % clicks, "19 NEURONS BEAT GIANT AI" 3.8 %):
//   WORDS  more than 4 words            ACRONYM  a word nobody in the feed knows (NCM, RSI, REA)
//   CUT    text cut by the frame        CLAIM    no shared word / number with the title (title, thumbnail, first line = one claim)
//   SMALL  text under 15 px tall in the phone feed
// spec.json:
// { "out": "thumb_A", "title": "19 Neurons Beat Giant AI (Liquid Networks)",
//   "lines": ["19 NEURONS", "BEAT GIANT AI"], "hl": [0], "accent": "data",            // hl = line numbers in the accent colour
//   "tag": "MIT, 2020",                                                                // optional small chip under the text
//   "visual": { "type": "image", "src": "assets/paper.png", "head": "nature.com" }    // a real page / photo in a glow window
//          or { "type": "big", "text": "55 GB", "c": "out" }                           // one huge number
//          or { "type": "vs", "a": "19", "b": "100,000", "la": "neurons", "lb": "neurons", "ca": "data", "cb": "err" }  // the contrast
//   "side": "right", "acronyms": ["NCM"] }                                             // extra words to treat as acronyms
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const NL = { data: '#34e0b0', model: '#6cc8ff', out: '#ffcc4d', err: '#ff6b81', acc: '#b48cff', ink: '#eef2f6', bg: '#05070d' };
const KNOWN = new Set(['AI', 'GPU', 'GPUS', 'CPU', 'US', 'UK', 'DNA', 'ID', 'API', 'GB', 'MB', 'TB', 'VS', 'X', 'PC', 'TV', 'MIT', 'NASA', 'GPT', 'OK']);
const specF = process.argv[2]; if (!specF) { console.log('usage: node nlthumb.js spec.json'); process.exit(1); }
const sp = JSON.parse(fs.readFileSync(specF, 'utf8')), dir = path.dirname(path.resolve(specF)), out = path.resolve(dir, sp.out || 'thumb');
const acc = NL[sp.accent || 'data'] || sp.accent, lines = sp.lines || [], hl = new Set(sp.hl || [0]);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const img = f => 'data:image/' + (/\.jpe?g$/i.test(f) ? 'jpeg' : 'png') + ';base64,' + fs.readFileSync(path.resolve(dir, f)).toString('base64');

// ---- text checks ----
const W = [], E = [];
const words = lines.join(' ').split(/\s+/).filter(w => /[A-Za-z0-9]/.test(w));
if (words.length > 5) E.push(`WORDS   ${words.length} words - 2-4 big words read on a phone`); else if (words.length > 4) W.push(`WORDS   ${words.length} words - 2-4 read best`);
const titleCaps = new Set((sp.title || '').replace(/\(.*?\)/g, '').match(/\b[A-Z][A-Z0-9]{1,6}s?\b/g) || []);
const extra = new Set((sp.acronyms || []).map(a => a.toUpperCase()));
const acr = words.map(w => w.replace(/[^A-Za-z0-9]/g, '')).filter(w => w && !KNOWN.has(w.toUpperCase()) && !/^\d/.test(w) &&
  (extra.has(w.toUpperCase()) || titleCaps.has(w) || (w.length >= 2 && w.length <= 5 && w === w.toUpperCase() && !/[AEIOUY]/.test(w))));
if (acr.length) E.push(`ACRONYM ${[...new Set(acr)].join(', ')} - nobody in the feed knows it yet; say what it does`);
if (sp.title) { const tw = new Set(sp.title.toLowerCase().match(/[a-z0-9]+/g));
  if (!words.some(w => tw.has(w.toLowerCase().replace(/[^a-z0-9]/g, ''))) && !/\d/.test(lines.join(' ')))
    W.push('CLAIM   no shared word or number with the title - title, thumbnail and first line must make the SAME claim'); }

// ---- page ----
const V = sp.visual || {}, right = (sp.side || 'right') === 'right';
const TX = right ? 64 : 640, VX = right ? 700 : 40, TW = 600;
const fit = (t, w, mx) => Math.min(mx, Math.floor(w / (Math.max(1, [...String(t)].length) * .62)));
let vis = '';
if (V.type === 'image') vis = `<div class="win" style="left:${VX}px;top:110px;width:540px;height:500px"><div class="hd"><i style="background:${acc}"></i><i></i><i></i><span>${esc(V.head || '')}</span></div>
  <div style="position:absolute;inset:44px 0 0 0;background:#fff url(${img(V.src)}) ${V.pos || 'top left'}/cover"></div></div>`;
if (V.type === 'big') vis = `<div class="big" style="left:${VX}px;width:540px;font-size:${fit(V.text, 520, 170)}px;color:${V.c ? NL[V.c] : acc}">${esc(V.text)}</div>`;
if (V.type === 'vs') { const vf = fit(V.a.length > V.b.length ? V.a : V.b, 520, 130);
  vis = `<div style="position:absolute;left:${VX}px;top:60px;width:540px;height:600px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px">
  <div class="vs" style="font-size:${vf}px;color:${V.ca ? NL[V.ca] : NL.data}">${esc(V.a)}<small>${esc(V.la || '')}</small></div><div style="font:800 46px 'Space Grotesk',Inter;color:#8e9aae">vs</div>
  <div class="vs" style="font-size:${vf}px;color:${V.cb ? NL[V.cb] : NL.err}">${esc(V.b)}<small>${esc(V.lb || '')}</small></div></div>`; }
const maxLen = Math.max(...lines.map(l => l.length), 1), fs0 = Math.min(170, Math.floor(TW / (maxLen * .5)));
const txt = lines.map((l, i) => `<div style="color:${hl.has(i) ? acc : NL.ink};text-shadow:${hl.has(i) ? `0 0 34px ${acc}88` : '0 4px 0 #000'}">${esc(l)}</div>`).join('');
const html = `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=JetBrains+Mono:wght@700;800&display=block" rel="stylesheet">
<style>*{margin:0;box-sizing:border-box}body{width:1280px;height:720px;overflow:hidden;background:radial-gradient(900px 600px at ${right ? 78 : 22}% 40%,#0f1a33 0%,transparent 70%),${NL.bg};position:relative;font-family:'Space Grotesk',Inter,sans-serif}
.t{position:absolute;left:${TX}px;top:50%;transform:translateY(-50%);width:${TW}px;font-weight:700;font-size:${fs0}px;line-height:.98;letter-spacing:-2px}
.tag{display:inline-block;margin-top:26px;padding:8px 20px;border:3px solid ${acc};border-radius:14px;font:700 30px 'JetBrains Mono',monospace;color:#fff;background:color-mix(in srgb,${acc} 16%,#0a0f1a);letter-spacing:0}
.win{position:absolute;border:3px solid ${acc};border-radius:22px;overflow:hidden;background:#0a0f1a;box-shadow:0 0 60px -10px ${acc}}
.hd{height:44px;display:flex;align-items:center;gap:8px;padding:0 16px;background:#0d1424;font:600 20px 'JetBrains Mono',monospace;color:#8e9aae}.hd i{width:12px;height:12px;border-radius:50%;background:#2a3550}.hd span{margin-left:10px}
.big{position:absolute;top:50%;transform:translateY(-50%);text-align:center;white-space:nowrap;font-family:'JetBrains Mono',monospace;font-weight:800;text-shadow:0 0 60px currentColor}
.vs{font-family:'JetBrains Mono',monospace;font-weight:800;line-height:1;white-space:nowrap;text-align:center;text-shadow:0 0 40px currentColor;display:flex;flex-direction:column;align-items:center}.vs small{font:700 30px 'JetBrains Mono',monospace;color:#8e9aae;text-shadow:none;margin-top:8px}
</style></head><body>${vis}<div class="t" id="t">${txt}${sp.tag ? `<div class="tag">${esc(sp.tag)}</div>` : ''}</div></body></html>`;

(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  await p.setContent(html, { waitUntil: 'networkidle' }).catch(() => {}); await p.evaluate(() => document.fonts.ready);
  // shrink the text block until it fits its half of the frame
  await p.evaluate(() => { const t = document.getElementById('t'); let fs = parseFloat(getComputedStyle(t).fontSize); while ((t.scrollHeight > 600 || t.scrollWidth > 620) && fs > 40) { fs -= 4; t.style.fontSize = fs + 'px'; } });
  const fsz = await p.evaluate(() => parseFloat(getComputedStyle(document.getElementById('t')).fontSize));
  if (fsz * 360 / 1280 < 15) W.push(`SMALL   text is ${Math.round(fsz * 360 / 1280)} px tall in the phone feed (>= 15) - fewer / shorter words`);
  const cut = await p.evaluate(() => [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.width && (r.left < -2 || r.top < -2 || r.right > 1282 || r.bottom > 722); }).map(e => (e.textContent || e.className).trim().slice(0, 20)));
  if (cut.length) E.push(`CUT     cut by the frame: ${[...new Set(cut)].slice(0, 3).join(' | ')} - shorter text`);
  await p.screenshot({ path: out + '.png' });
  // phone feed preview: a 360 px card with the title under it, like the YouTube app
  const data = fs.readFileSync(out + '.png').toString('base64');
  const fp = await b.newPage({ viewport: { width: 400, height: 330 } });
  await fp.setContent(`<body style="margin:0;background:#0f0f0f;font-family:Roboto,Inter,Arial;padding:20px"><div style="position:relative;width:360px"><img src="data:image/png;base64,${data}" style="width:360px;border-radius:10px;display:block">
    <span style="position:absolute;right:6px;bottom:6px;background:#000c;color:#fff;font:600 12px Inter;padding:2px 4px;border-radius:4px">7:12</span></div>
    <div style="display:flex;gap:10px;margin-top:10px"><div style="width:32px;height:32px;border-radius:50%;background:#1d2a44;flex:none"></div>
    <div><div style="color:#f1f1f1;font:500 15px/1.3 Inter;max-height:40px;overflow:hidden">${esc(sp.title || '')}</div><div style="color:#aaa;font:400 12px Inter;margin-top:4px">Netlight ML · 1.2K views · 2 days ago</div></div></div></body>`);
  await fp.screenshot({ path: out + '_feed.png' }); await b.close();
  W.forEach(m => console.log('WARN ', m)); E.forEach(m => console.log('ERROR', m));
  console.log(`nlthumb: ${out}.png + ${out}_feed.png  (${E.length} errors, ${W.length} warnings)`); process.exit(E.length ? 1 : 0);
})();
