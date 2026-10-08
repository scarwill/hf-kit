# kurz/ — Kurzgesagt-style add-on for the video kit

Load AFTER the normal video kit:

```bash
cat ~/hf-kit/{premium.js,illus.js,life.js,helpers.js,icons.js,scenes.js,extras.js} ~/hf-kit/kurz/kurz.js ~/hf-kit/kurz/organs.js video.js > all.js
python3 ~/hf-kit/build.py all.js audio.m4a [index.html --short]
```

- `kurz.js` — the look: `KPAL` area palettes (night, ocean, body, flesh, space, deep, dusk, forest, sunset, desert, lab), shading (`kBall`, `kShade`, `kBlob`, `kGlow`), colour maths (`kMix`, `kDark`, `kLite`), worlds (`kWorld` = sky + light glow + rays + 3 hill layers, clipped per area; `kLayer(R, k)` to put props on a hill layer), automatic parallax (overrides `FGP`, so every CAM/CUT/WHIP/intro/outro moves the hill layers, stars and `.fg` foreground), foreground (`kFgRocks`, `kFgPlants`), nature/space (`kCloud`, `kTree`, `kPine`, `kGrass`, `kRock`, `kMountain`, `kPlanet`, `kSun`), micro (`kCell`, `kVirus`, `kBacterium`, `kMolecule`), marks (`kCallout` + `kCALL`, `kArrow` + `kARROW`, `kBigNum`), characters (`kKid` + `kKidTalk`, own mascot `kBlobby`), motion (`kLife`, `kSCALE` macro/micro jump, `kGROW`).
- `organs.js` — `kEye2`, `kView2`, `kVoid`, `kPhone2`, `kEyeFull` (animated eye cross-section), `kBrain2`, `kCamR2`.
- Example: `examples/kurz-blindspot-long.js` (the blind spot video, 5 worlds).
