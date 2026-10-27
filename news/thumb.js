// THUMB: YouTube thumbnail (1280x720) in the channel's dark "Night Blue" look from a small JSON spec, + a phone-feed-size preview.
//   node ~/nkit/news/thumb.js spec.json out.png        (image paths in the spec are relative to the spec file)
// Layouts:
//   "big3"   (weekly long video, the default): one big story (photo + headline on it) + two small numbered stories.
//            { "layout": "big3", "badge": "THIS WEEK IN TECH",
//              "big":   { "img": "assets/a.jpg", "pos": "50% 50%", "title": "Rocket fell in a <b>cornfield</b>" },
//              "small": [ { "img": "assets/b.jpg", "title": "Touch MacBook?" }, { "code": ["> use wallet?", "> Fine."], "title": "AI said Fine" } ] }
//   "single" (one Big Story long video): headline left, photo right, optional tile + stamp.
//            { "layout": "single", "badge": "BIG STORY", "title": "Tesla can <b>fly?!</b>", "img": "assets/a.jpg", "pos": "62% 0%",
//              "tile": { "label": "ALSO", "text": "AI stole crypto" }, "stamp": "NO DRIVER" }
// Rules: 2-5 words per title, <b> = the blue word, real photos / screenshots only, nothing the video does not deliver.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const [specFile, out = 'thumb.png'] = process.argv.slice(2), S = JSON.parse(fs.readFileSync(specFile, 'utf8')), dir = path.dirname(path.resolve(specFile));
const src = p => 'file://' + path.resolve(dir, p), esc = s => String(s ?? '');
const css = `*{box-sizing:border-box;margin:0}body{width:1280px;height:720px;overflow:hidden;font-family:Inter,sans-serif}
.t{position:absolute;inset:0;background:radial-gradient(700px 500px at 100% 0%,#1C3570 0%,transparent 60%),radial-gradient(700px 600px at 0% 100%,#0E1626 0%,transparent 60%),#070B14;overflow:hidden}
.ph{position:absolute;border-radius:28px;overflow:hidden;background:#111A2B;box-shadow:0 24px 50px -18px rgba(0,0,0,.8),0 0 0 6px #2A3B5C}
.ph img{width:100%;height:100%;object-fit:cover;display:block}
.h{position:absolute;font:900 112px/.92 'Inter Tight',sans-serif;letter-spacing:-4px;color:#F1F5F9}.h b{color:#60A5FA}
.badge{position:absolute;display:flex;align-items:center;gap:12px;background:#2563EB;color:#fff;font:800 30px Inter;letter-spacing:2px;padding:12px 22px;border-radius:14px;z-index:4}
.badge i{width:16px;height:16px;border-radius:50%;background:#fff}
.stamp{position:absolute;font:900 64px 'Inter Tight';color:#E11D48;border:8px solid #E11D48;border-radius:16px;padding:4px 20px;background:rgba(7,11,20,.92);transform:rotate(-8deg);white-space:nowrap;z-index:4}
.tile{position:absolute;background:#111A2B;border-radius:22px;border:3px solid #24324A;box-shadow:0 16px 30px -16px rgba(0,0,0,.8);padding:18px 22px;font:900 44px/1 'Inter Tight';letter-spacing:-1px;color:#F1F5F9}
.tile small{display:block;font:800 22px Inter;letter-spacing:2px;color:#60A5FA;margin-bottom:8px}
.cap{position:absolute;left:0;right:0;bottom:0;padding:14px 18px;background:linear-gradient(transparent,rgba(7,11,20,.94));color:#fff;font:900 36px/1 'Inter Tight';letter-spacing:-1px}
.cap b{color:#93B4FF}
.n{position:absolute;width:56px;height:56px;border-radius:50%;background:#3B82F6;color:#fff;font:900 32px 'Inter Tight';display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 5px #070B14;z-index:3}
.code{position:absolute;inset:0;background:#0B1222;padding:26px 28px;font:700 30px/1.45 'JetBrains Mono',monospace;color:#E2E8F0;white-space:pre}`;
const panel = (o, x, y, w, h, k) => `<div class="ph" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">${o.code ? `<div class="code">${o.code.map(esc).join('\n')}</div>` : `<img src="${src(o.img)}" style="object-position:${o.pos || '50% 50%'}">`}<div class="cap">${esc(o.title)}</div></div>` + (k ? `<div class="n" style="left:${x - 18}px;top:${y - 16}px">${k}</div>` : '');
let body;
if ((S.layout || 'big3') === 'big3') {
  const B = S.big;
  body = `<div class="badge" style="left:44px;top:40px"><i></i>${esc(S.badge || 'THIS WEEK IN TECH')}</div>
  <div class="ph" style="left:44px;top:120px;width:700px;height:556px"><img src="${src(B.img)}" style="object-position:${B.pos || '50% 50%'}"></div><div class="n" style="left:24px;top:104px">1</div>
  <div class="h" style="left:70px;top:${676 - 40 - 2 * 80}px;width:660px;font-size:84px;color:#fff;text-shadow:0 4px 24px rgba(0,0,0,.75)">${esc(B.title).replace(/<b>/g, '<b style="color:#93B4FF">')}</div>
  ${panel(S.small[0], 800, 40, 440, 300, 2)}${panel(S.small[1], 800, 376, 440, 300, 3)}`;
} else {
  body = `<div class="badge" style="left:50px;top:56px"><i></i>${esc(S.badge || 'BIG STORY')}</div>
  <div class="ph" style="left:600px;top:40px;width:640px;height:640px"><img src="${src(S.img)}" style="object-position:${S.pos || '50% 50%'}"></div>
  <div style="position:absolute;left:50px;top:150px;width:560px;display:flex;flex-direction:column;align-items:flex-start;gap:30px">
    <div class="h" style="position:static;font-size:100px">${esc(S.title)}</div>
    ${S.tile ? `<div class="tile" style="position:static"><small>${esc(S.tile.label)}</small>${esc(S.tile.text)}</div>` : ''}</div>
  ${S.stamp ? `<div class="stamp" style="left:690px;top:560px">${esc(S.stamp)}</div>` : ''}`;
}
const html = `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@800;900&family=Inter:wght@700;800&family=JetBrains+Mono:wght@700&display=swap" rel="stylesheet"><style>${css}</style></head><body><div class="t">${body}</div></body></html>`;
(async () => {
  const tmp = path.join(dir, '.thumb.html'); fs.writeFileSync(tmp, html);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  await p.goto('file://' + tmp); await p.waitForTimeout(2000); await p.screenshot({ path: out });
  const prev = out.replace(/\.png$/, '') + '_feed.png'; await p.setViewportSize({ width: 360, height: 203 });
  await p.setContent(`<body style="margin:0"><img src="file://${path.resolve(out)}" style="width:360px;height:203px;display:block"></body>`); await p.waitForTimeout(300); await p.screenshot({ path: prev });
  await b.close(); fs.unlinkSync(tmp); console.log(out, '+', prev, '(phone feed size: is the headline still readable?)');
})();
