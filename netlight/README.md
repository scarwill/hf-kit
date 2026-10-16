# netlight/ — Netlight ML neon-tech video kit

Neon-tech UI look for data-science / ML / AI explainers (channel **Netlight ML**, `netlight.ml`). Used by the `netlightml` skill.

| file | what |
|---|---|
| `netlight.js` | theme + parts (`nl*`) + beats (CAPS). Loaded after `video/premium.js` + `video/life.js`, before `video.js`. |
| `nlbuild.py` | `python3 nlbuild.py video.js <audio> [index.html]` — lint (no Kurz / Infographics helpers), cat, build. HEAD 2.6 s (Intro A), TAIL 3.6 s (Outro A). Adds Space Grotesk + Inter + JetBrains Mono. |
| `nlcheck.js` | `node nlcheck.js index.html` — EMPTY / TEXT / SMALL / OUT / OVERFLOW / OVERLAP / NOVISUAL / GAP warnings + `out/nc_*.png` frames. |
| `geomcheck.js` | `node geomcheck.js nl_test.html [step]` — text on text, window on window, a label sitting on / touching a window border, text outside its window (things nlcheck misses). |
| `realign.py` | after `video/align.py`: report bad sentence boundaries (`CHECK`), then `realign.py fix '{"12":[a,b]}'` (one `[a,b]` per comma part for lists). |
| `pscheck.py` | free-decode `a.raw` with pocketsphinx and list distinctive words more than 0.5 s off `words.json`. |
| `score.py` | `score.py cues.json DUR HEAD END music.wav sfx.wav <dark|lofi|upbeat|calm|cinematic>` — self-made music + sound cues. |
| `cues.js` | `node cues.js nl_test.html` → `cues.json` (from `window.__CUES`). |
| `shots.js` | `node shots.js nl_test.html 12 12.5 …` → `shot_<t>.png` (seek in increasing order). |
| `webshot.js` / `netlog.js` | real-page screenshot through the session proxy (2×) / list the hosts a page failed to load. |
| `nlrender.js` | `node nlrender.js index.html [audio] out.mp4 [from] [to]` — local MP4 preview (fallback fonts). |

Example: `examples/netlight-demo.js` (tokens → IDs → vectors → code → next token).

**Look:** bg `#05070d` + navy glow on top + faint 60 px grid. Colour = meaning: DATA `#34e0b0`, MODEL `#6cc8ff`, OUTPUT `#ffcc4d`, ERROR `#ff6b81`, ACCENT `#b48cff` (only the `<b>` word of a title).
**Signature:** Model Orb (`nlOrb` + `ORB_*`) and the green caret (`nlType` + `TYPE`/`CARET`, `nlCmd`).
**Parts:** `nlScene nlWin nlChip nlLab nlTag nlMark nlUser nlBig nlText nlRow nlSvg nlWire nlDocs nlBox nlHero/HERO nlOrb nlType nlCmd`
**ML visuals:** `nlLoop/LOOP_RUN nlNet/NET_FWD nlCurve/CURVE nlBowl/GD nlEmbed(.pt .link .ring) nlAttn/ATTN/ATTN_ROW nlBound/BOUND nlConf nlMatmul/MATMUL nlCode/CODE nlBars/BARS nlTokens nlVec nlEq nlCount/COUNT`
**Flow:** `nlInit nlIntro nlOutro` in build; `nlIntroBeats(); nlStart([...])` first in beats, `nlNext('#sN','words')` per scene, `nlOutroBeats()` last.

**House + motion + real-page helpers (in `netlight.js`, defined with `nlDef`, so an older `video.js` that still declares the same names keeps its own copy):**
`cOrb` (orb in the bottom-right corner, eyes up-left) `houseStart` (no grid) `CUE`/`CUES` `NEXT` `houseBeats` `houseEnd` ·
`arw(g,x,y,c,dir)` (dir r/d/u/l) and `arwA(g,c)` (head follows the wire's last tangent — prefer it) ·
`art(par,id,x,y,w,h,svg)` custom drawings · `chips(par,id,x,y,[[t,c]..],fs)` with `.cx(k)` · `bez(p0,p1,p2,p3,n)` + `FOLLOW(sel,t,pts,d,{org,rot})` move along a path ·
`nlShot` `SHOT_FOCUS` `nlShotHL` `nlCursor` `CURSOR` `CLICK` (screenshots under 8000 px tall; measure highlight boxes from the image pixels).
Use `transformOrigin`, not `svgOrigin` (the local preview shim ignores `svgOrigin`).
