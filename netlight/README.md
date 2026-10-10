# netlight/ — Netlight ML neon-tech video kit

Neon-tech UI look for data-science / ML / AI explainers (channel **Netlight ML**, `netlight.ml`). Used by the `netlightml` skill.

| file | what |
|---|---|
| `netlight.js` | theme + parts (`nl*`) + beats (CAPS). Loaded after `video/premium.js` + `video/life.js`, before `video.js`. |
| `nlbuild.py` | `python3 nlbuild.py video.js <audio> [index.html]` — lint (no Kurz / Infographics helpers), cat, build. HEAD 2.6 s (Intro A), TAIL 3.6 s (Outro A). Adds Space Grotesk + Inter + JetBrains Mono. |
| `nlcheck.js` | `node nlcheck.js index.html` — EMPTY / TEXT / SMALL / OUT / OVERFLOW / OVERLAP / NOVISUAL / GAP warnings + `out/nc_*.png` frames. |
| `nlrender.js` | `node nlrender.js index.html [audio] out.mp4 [from] [to]` — local MP4 preview (fallback fonts). |

Example: `examples/netlight-demo.js` (tokens → IDs → vectors → code → next token).

**Look:** bg `#05070d` + navy glow on top + faint 60 px grid. Colour = meaning: DATA `#34e0b0`, MODEL `#6cc8ff`, OUTPUT `#ffcc4d`, ERROR `#ff6b81`, ACCENT `#b48cff` (only the `<b>` word of a title).
**Signature:** Model Orb (`nlOrb` + `ORB_*`) and the green caret (`nlType` + `TYPE`/`CARET`, `nlCmd`).
**Parts:** `nlScene nlWin nlChip nlLab nlTag nlMark nlUser nlBig nlText nlRow nlSvg nlWire nlDocs nlBox nlHero/HERO nlOrb nlType nlCmd`
**ML visuals:** `nlLoop/LOOP_RUN nlNet/NET_FWD nlCurve/CURVE nlBowl/GD nlEmbed(.pt .link .ring) nlAttn/ATTN/ATTN_ROW nlBound/BOUND nlConf nlMatmul/MATMUL nlCode/CODE nlBars/BARS nlTokens nlVec nlEq nlCount/COUNT`
**Flow:** `nlInit nlIntro nlOutro` in build; `nlIntroBeats(); nlStart([...])` first in beats, `nlNext('#sN','words')` per scene, `nlOutroBeats()` last.
