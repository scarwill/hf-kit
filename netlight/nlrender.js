// Local MP4 preview (fonts fall back to Inter/DejaVu here; the real HyperFrames render loads the Google fonts):
//   node ~/hf-kit/netlight/nlrender.js index.html assets/talk.m4a out.mp4 [from] [to]
const { chromium } = require('playwright'); const { spawnSync, spawn } = require('child_process'); const fs = require('fs'); const path = require('path');
const [src = 'index.html', aud, out = 'video.mp4', A, Z] = process.argv.slice(2);
const html = fs.readFileSync(src, 'utf8').replace(/<script src="https:\/\/cdn\.jsdelivr[^>]*><\/script>/, `<script src="${path.join(__dirname, '..', 'video', 'gsap-shim.js')}"></script>`).replace(/<link [^>]*fonts[^>]*>/g, '');
fs.writeFileSync('nl_render.html', html);
(async () => {
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + path.resolve('nl_render.html'));
  const [dur, head] = await p.evaluate(() => [window.__timelines.main.duration(), HEAD]); const fps = 30, t0 = +(A || 0), t1 = Math.min(dur, +(Z || dur));
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-preset', 'veryfast', 'nl_v.mp4']);
  for (let i = Math.round(t0 * fps); i <= Math.round(t1 * fps); i++) { await p.evaluate(t => window.__timelines.main.seek(t), i / fps); const buf = await p.screenshot({ type: 'jpeg', quality: 88 }); if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r)); }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close();
  if (aud) { const off = head - t0; const args = off >= 0 ? ['-itsoffset', String(off), '-i', aud] : ['-ss', String(-off), '-i', aud];
    spawnSync('ffmpeg', ['-v', 'error', '-y', '-i', 'nl_v.mp4', ...args, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-af', 'apad', '-t', String(t1 - t0), out], { stdio: 'inherit' }); fs.unlinkSync('nl_v.mp4'); }
  else fs.renameSync('nl_v.mp4', out);
  console.log(out, (t1 - t0).toFixed(1) + 's');
})();
