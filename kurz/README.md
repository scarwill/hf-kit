# kurz/ — Kurzgesagt-style add-on for the video kit

**How to make a Kurz video: read `RULES.md`** (the Kurz skill loads it from this repo, so rule changes need no skill re-upload).

Load AFTER the normal video kit:

```bash
python3 ~/hf-kit/kurz/kurzlint.py video.js   # must pass: no Infographics helpers in a Kurz video
cat ~/hf-kit/{premium.js,illus.js,life.js,helpers.js,icons.js,scenes.js,extras.js} ~/hf-kit/kurz/{kurz.js,organs.js,tech.js,people.js,techviz.js,neon.js,mascots.js} video.js > all.js
python3 ~/hf-kit/build.py all.js audio.m4a [index.html --short]
```

- `kurz.js` — the classic look: `KPAL` palettes (night, ocean, body, flesh, space, deep, dusk, forest, sunset, desert, lab), shading (`kBall`, `kShade`, `kBlob`, `kGlow`), colour maths (`kMix`, `kDark`, `kLite`), worlds (`kWorld` + `kLayer`), automatic parallax, foreground (`kFgRocks`, `kFgPlants`), nature/space (`kCloud`, `kTree`, `kPine`, `kGrass`, `kRock`, `kMountain`, `kPlanet`, `kSun`), micro (`kCell`, `kVirus`, `kBacterium`, `kMolecule`), marks (`kCallout`, `kArrow`, `kBigNum`), motion (`kLife`, `kSCALE`, `kGROW`). Old characters `kHuman`/`kSlim`/`kKid`/`kBlobby` stay only for old videos (kurzlint bans them).
- `neon.js` — the newer Kurzgesagt neon space look: `nSpace` (nebula + static stars, optional synthwave grid), `nBloom`, glowing titles `nTitle`, label pills `nPill`, map pins `nPin`, `nTimeline` + `nDRAW`, `nCounter` + `nCOUNT`, icon cards `nCard`, `nGauge` + `nNEEDLE`, speech bubbles `nBubble`, `nPlanet`, `nGalaxy`, `nRocket` + `nFLY`, `nSpeed`, camera drift `nDRIFT`, `nLife` (no star twinkle).
- `mascots.js` — original hosts (not Kurzgesagt's birds): `nAxo` (pink axolotl), `nGlim` (one-eyed jelly blob); moods (`nMOOD`: smile, happy, shock, meh), `nHOP`, `nWAVE`, `nTALKM`. (`nPip` exists but is not used.) Front view only.
- `people.js` — `kBean` people, front view only, light skin; hair short / long / pony / bun / bald, glasses, coat (+ `kWALK`, `kGaze`).
- `organs.js` — `kEye2`, `kView2`, `kVoid`, `kPhone2`, `kEyeFull`, `kBrain2`, `kCamR2`.
- `tech.js` — AI / data props: `kMind` (the model), `kCube`, `kCrystal`, `kTablet`, `kServer`, `kScreen`, `kNet` + `kFIRE`, `kStream` + `kFLOW`, `kSay` + `kSAY`, `kBot`.
- `techviz.js` — `kMatrix`, `kAttn`, `kStack`, `kVector`, `kPlot`, `kCode`, `kEq`, `kProbs`, `kBox3D` (+ CAPS reveal beats).
- `kurzlint.py` — fails if video.js uses Infographics helpers (chat, pill, ic, card, scene, charB/botB/charP/botP, …) and warns on outlines, white cards, long labels.
- Examples: `examples/kurz-neon-demo.js` (neon look + parts), `examples/kurz-blindspot-long.js` (older nature look; structure only).
