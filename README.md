# hf-kit

Kit for the HyperFrames explainer videos and YouTube thumbnails.

- `video/` — align.py, build.py, template.html, kit.js, premium.js, life.js, helpers.js, icons.js, illus.js, **scenes.js** (Infographics-style rooms + useTheme("lab") DSML Midnight Lab palette, robot AI `botB`, props, PRO LIFE: talk/nod/shake/point/shrug/jump/walkIn/eyes/bgLife, PRO LOOK: fgHeads/fgLeaves/fgBox parallax, WHIP/ZOOMIN transitions, BOING, moodLayer+dim/glow, liar antenna gag), check.js, check.py, sheets.py, gsap-shim.js
- `video/extras.js` — reusable props + motion shortcuts (load after scenes.js; call `extrasDefs(defs)` once): eyeBig, earG, handG, brainG (pink human brain), ghostG, faceSk, treeG, sunG, flowerG, fakePaper, frameP, anchorG, camG; beats: dots+RUN (signal dots on a wire), ringH+RING, sparkH+SPK, SPIN, BOB, WALKER
- `examples/` — `dsml-infographics-long.js` (1920x1080), `dsml-infographics-short.js` (1080x1920, same script), `finance-maya-video.js`, `dsml-hallucination-long.js` (uses extras.js)

LONG vs SHORT: same kit. Short = `python3 build.py all.js audio.m4a index.html --short` (VERT=true → 1080x1920 frame, each area a 1080x1920 room). check.js / sheets.py pick the size from the html.

Build: `cat ~/hf-kit/{premium.js,illus.js,life.js,helpers.js,icons.js,scenes.js,extras.js} video.js > all.js && python3 ~/hf-kit/build.py all.js audio.m4a [index.html --short]`
- `thumb/` — premium (video-kit) thumbnails: thumbx.js, tshot.js (example: examples/thumb-premium-example.js); old style: thumb.js, shot.js, page.html

Kit safety built in (no per-video code needed):
- `CAM` / `CUT` / `WHIP` (and so `ZOOMIN`, `intro`, `outro`) clamp the camera inside the painted room (`clampV`) -> the next room never shows at a frame edge.
- `talk()` is queued and run by `outro()` (or `flushTalks()`): it uses the mouth of the mood active at that moment (`MOODLOG` from `mood()`) -> never two mouths.
- `say(par, sx, sy, w, h, text, id, fs, td)` (illus.js): speech bubble whose tail tip lands on the speaker (sx, sy just above the head). Use it instead of `bubble()` for people/robots talking.

New chat setup:

```bash
git clone --depth 1 https://github.com/scarwill/hf-kit /tmp/hfk && mkdir -p ~/hf-kit ~/thumb-kit && cp /tmp/hfk/video/* ~/hf-kit/ && cp /tmp/hfk/thumb/* ~/thumb-kit/
```
