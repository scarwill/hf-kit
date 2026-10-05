# hf-kit

Kit for the HyperFrames explainer videos and YouTube thumbnails.

- `video/` — align.py, build.py, template.html, kit.js, premium.js, life.js, helpers.js, icons.js, illus.js, **scenes.js** (Infographics-style rooms + useTheme("lab") DSML Midnight Lab palette, robot AI `botB`, props, PRO LIFE: talk/nod/shake/point/shrug/jump/walkIn/eyes/bgLife, PRO LOOK: fgHeads/fgLeaves/fgBox parallax, WHIP/ZOOMIN transitions, BOING, moodLayer+dim/glow, liar antenna gag), check.js, check.py, sheets.py, gsap-shim.js
- `examples/` — `dsml-infographics-long.js` (1920x1080), `dsml-infographics-short.js` (1080x1920, same script), `finance-maya-video.js`

LONG vs SHORT: same kit. Short = `python3 build.py all.js audio.m4a index.html --short` (VERT=true → 1080x1920 frame, each area a 1080x1920 room). check.js / sheets.py pick the size from the html.

Build: `cat ~/hf-kit/{premium.js,illus.js,life.js,helpers.js,icons.js,scenes.js} video.js > all.js && python3 ~/hf-kit/build.py all.js audio.m4a [index.html --short]`
- `thumb/` — thumb.js, shot.js, page.html

New chat setup:

```bash
git clone --depth 1 https://github.com/scarwill/hf-kit /tmp/hfk && mkdir -p ~/hf-kit ~/thumb-kit && cp /tmp/hfk/video/* ~/hf-kit/ && cp /tmp/hfk/thumb/* ~/thumb-kit/
```
