# hf-kit

Kit for the HyperFrames explainer videos and YouTube thumbnails.

- `video/` — align.py, build.py, template.html, kit.js, premium.js, life.js, helpers.js, icons.js, illus.js, **scenes.js** (Infographics-style rooms + useTheme("lab") DSML Midnight Lab palette, robot AI `botB`, props, PRO LIFE: talk/nod/shake/point/shrug/jump/walkIn/eyes/bgLife, PRO LOOK: fgHeads/fgLeaves/fgBox parallax, WHIP/ZOOMIN transitions, BOING, moodLayer+dim/glow, liar antenna gag), check.js, check.py, sheets.py, gsap-shim.js, textcheck.js (text sticking out of cards, no screenshots), labelcheck.js (how long every label is really readable; WARN if < 1 s or never visible, no screenshots), phrasecheck.py (timing phrases that fire on the wrong word), sheets4.py (one frame every 4 s, 4x4 review sheets after check.js)
- `video/extras.js` — reusable props + motion shortcuts (load after scenes.js; call `extrasDefs(defs)` once): eyeBig, earG, handG, brainG (pink human brain), ghostG, faceSk, treeG, sunG, flowerG, fakePaper, frameP, anchorG, camG; beats: dots+RUN (signal dots on a wire), ringH+RING, sparkH+SPK, SPIN, BOB, WALKER
- `examples/` — `dsml-infographics-long.js` (1920x1080), `dsml-infographics-short.js` (1080x1920, same script), `finance-maya-video.js`, `dsml-hallucination-long.js` (uses extras.js)

LONG vs SHORT: same kit. Short = `python3 build.py all.js audio.m4a index.html --short` (VERT=true → 1080x1920 frame, each area a 1080x1920 room). check.js / sheets.py pick the size from the html.

Build: `cat ~/hf-kit/{premium.js,illus.js,life.js,helpers.js,icons.js,scenes.js,extras.js} video.js > all.js && python3 ~/hf-kit/build.py all.js audio.m4a [index.html --short]`
- `video/chars2.js` — DSML characters v2 (style C, outlined, rounded): `charP(...)` humans + `botP(...)` robot, same options/ids as `charB`/`botB`. Load after scenes.js/extras.js: `cat ... extras.js chars2.js video.js > all.js`. Use these for new DSML videos.
- `kurz/` — Kurzgesagt-style add-on (load after the video kit). **Rules for Kurz videos: `kurz/RULES.md`** (the Kurz skill reads it from here). Files: `kurz.js` (KPAL nature/body worlds with auto parallax, shading kBall/kShade/kBlob, nature/space/micro props, kCallout/kArrow/kBigNum, kLife, kSCALE, kGROW), `organs.js` (eye, eye cross-section, brain, camera, phone), `people.js` (kBean people, front view), `techviz.js` (matrix, attention, transformer stack, vectors, plots, code, equations, probabilities), `tech.js` (AI/data props, kMind model, kBot), `neon.js` (newer Kurz neon space look: nSpace, bloom, nTitle, nPill, nPin, nTimeline, nCounter, nCard, nGauge, nBubble, nPlanet, nGalaxy, nRocket, nDRIFT), `mascots.js` (original hosts Axo + Glim, front view, moods), `props.js` (load last: shaded bedroom / hospital room / lab, bed person, astronaut, bears, squirrels, lemur, mouse, heart, lungs, muscle, bone, neuron, ECG, thermometer, meal plate, balloons, calendar, stopwatch, spaceship + cutaway, teleport beam — list in its header), `kurzlint.py` (blocks Infographics helpers in Kurz videos). Examples: `examples/kurz-neon-demo.js`, `examples/kurz-blindspot-long.js` (older, structure only).
- `light/` — LIGHT kit for the `light` skill (Netlight ML neon-tech look, long-video safe; `lbuild.py --short` builds a 1080x1920 Short for `net-shorts`): light.js (nl* parts + built-in house rules + guards), lbuild.py (lint + scene-aware phrase check + build), lcheck.js (checks + contact sheets + cues.json), lsheet.js, lmix.py, lverify.py, realign.py, score.py, webshot.js, netlog.js, RULES.md, SKILL.md. Example: `examples/light-demo.js`. `netlight/` stays as it was.
- `trends/` — `net-trends` skill for Netlight ML: `scout.py` checks what is rising in DS / ML / AI (Hugging Face papers + trending models, Hacker News, Wikipedia, PyPI) and the US / UK YouTube demand and gap per concept, then the skill turns it into ranked video topics. `concepts.txt` (~110 concepts), `made.txt`, `SKILL.md`. See `trends/README.md`.
- `shorts/` — `net-shorts` skill for Netlight ML Shorts: `sscout.py` ranks concepts by Shorts demand + momentum and reads the channel's Shorts (no repeats) and latest long videos; Shorts are built with `light/lbuild.py --short` (1080x1920). See `shorts/README.md`.
- `blue-lantern/` — Blue Lantern channel (guided breathing, sleep, focus, nature/noise ambience): tested example scripts + brand files; used by the `blue-lantern` skill. See `blue-lantern/README.md`.
- `thumb/` — premium (video-kit) thumbnails: thumbx.js, tshot.js (example: examples/thumb-premium-example.js); old style: thumb.js, shot.js, page.html

Kit safety built in (no per-video code needed):
- `CAM` / `CUT` / `WHIP` (and so `ZOOMIN`, `intro`, `outro`) clamp the camera inside the painted room (`clampV`) -> the next room never shows at a frame edge.
- `talk()` is queued and run by `outro()` (or `flushTalks()`): it uses the mouth of the mood active at that moment (`MOODLOG` from `mood()`) -> never two mouths.
- `say(par, sx, sy, w, h, text, id, fs, td)` (illus.js): speech bubble whose tail tip lands on the speaker (sx, sy just above the head). Use it instead of `bubble()` for people/robots talking.

New chat setup:

```bash
git clone --depth 1 https://github.com/scarwill/hf-kit /tmp/hfk && mkdir -p ~/hf-kit ~/thumb-kit && cp /tmp/hfk/video/* ~/hf-kit/ && cp /tmp/hfk/thumb/* ~/thumb-kit/
```
