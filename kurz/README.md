# kurz/ — Kurzgesagt-style add-on for the video kit

Load AFTER the normal video kit:

```bash
python3 ~/hf-kit/kurz/kurzlint.py video.js   # must pass: no Infographics helpers in a Kurz video
cat ~/hf-kit/{premium.js,illus.js,life.js,helpers.js,icons.js,scenes.js,extras.js} ~/hf-kit/kurz/kurz.js ~/hf-kit/kurz/organs.js ~/hf-kit/kurz/tech.js ~/hf-kit/kurz/people.js ~/hf-kit/kurz/techviz.js video.js > all.js
python3 ~/hf-kit/build.py all.js audio.m4a [index.html --short]
```

- `kurz.js` — the look: `KPAL` area palettes (night, ocean, body, flesh, space, deep, dusk, forest, sunset, desert, lab), shading (`kBall`, `kShade`, `kBlob`, `kGlow`), colour maths (`kMix`, `kDark`, `kLite`), worlds (`kWorld` = sky + light glow + rays + 3 hill layers, clipped per area; `kLayer(R, k)` to put props on a hill layer), automatic parallax (overrides `FGP`, so every CAM/CUT/WHIP/intro/outro moves the hill layers, stars and `.fg` foreground), foreground (`kFgRocks`, `kFgPlants`), nature/space (`kCloud`, `kTree`, `kPine`, `kGrass`, `kRock`, `kMountain`, `kPlanet`, `kSun`), micro (`kCell`, `kVirus`, `kBacterium`, `kMolecule`), marks (`kCallout` + `kCALL`, `kArrow` + `kARROW`, `kBigNum`), characters: polished humans `kHuman` (style 1, normal proportions) and `kSlim` (style 3, slim elegant) + `kTalk`; older `kKid` / `kBlobby` kept only for the blind spot example, motion (`kLife`, `kSCALE` macro/micro jump, `kGROW`).
- `organs.js` — `kEye2`, `kView2`, `kVoid`, `kPhone2`, `kEyeFull` (animated eye cross-section), `kBrain2`, `kCamR2`.
- `tech.js` — AI / data props in the Kurz look: `kCore` (model orb), `kCube`, `kCrystal`, `kTablet` (document), `kServer`, `kScreen`, `kNet` + `kFIRE`, `kStream` + `kFLOW`, `kSay` + `kSAY` (small speech), `kBot` (robot).
- `people.js` — `kBean` simple shaded people, FRONT view only (+ `kWALK`, `kGaze`). Default characters for Kurz videos.
- `techviz.js` — real technical visuals in the Kurz look: `kMatrix`+`kMATRIX`, `kAttn`+`kATTN`, `kStack`+`kSTACK` (transformer), `kVector`+`kVECTOR`, `kPlot`+`kPLOT`, `kCode`+`kCODE`, `kEq`+`kEQ`, `kProbs`+`kPROBS`, `kBox3D`.
- Model (AI) = `kMind` (tech.js, user's pick B).
- `kurzlint.py` — fails if video.js uses Infographics helpers (chat, pill, ic, card, scene, charB/botB/charP/botP, …) and warns on outlines, white cards, long labels.
- Example: `examples/kurz-blindspot-long.js` (the blind spot video, 5 worlds; structure only — it still has one `pill` and the legacy `kKid`).
