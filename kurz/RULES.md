# Kurzgesagt-style HyperFrames explainer video — RULES

This file is the full rule book. The Kurz skill only clones the kit and tells Claude to follow this file, so rules change here (GitHub) without re-uploading the skill.

User talks in Hinglish — reply in Hinglish, short and clear. Deliver ONE `index.html` (attach the file; paste code only if asked). Never zip. **Ask before doing anything beyond what was asked** (changing the kit, other skills, other files) — user: "kuch bhi karne se pahele pucha kar".

Goal (user): "pura Kurzgesagt jaisa — agar Kurzgesagt se bhi accha bane to maza aa jayega". So: the full Kurzgesagt look, plus our extras that Kurzgesagt rarely has (one continuous camera world, parallax depth, word-synced beats, character reactions).

**SHORT or LONG — ASK FIRST:** every time a script + audio arrive, ask in one line: "Short (1080×1920) chahiye ya long (1920×1080)?" unless the user already said it. A short is laid out for vertical from scratch (`--short`); never crop a long layout.

## Hard rules (same as the other video skills — never break)
- NO header, footer, progress bar, on-screen captions/subtitles.
- NO vignette, NO floating/glowing particles or bubbles drifting around (user hates them). Static stars in a sky are fine; they only move with the camera parallax, never twinkle or float (`nLife()` and `kLife()` respect this).
- START: 1.5 s silent cold-open via `intro()` (hero object assembles, glow ring). Title words pop only if the script has a spoken title ("Title pakda: …" / "Title nahi mila" in the delivery message). Strongest visual in the first 5 s.
- ENDING: `outro()` — settle on the final idea, camera eases back, fade to black (TAIL 3.1 s, build.py adds it).
- Audio tag in the code (`data-start` = HEAD, `data-duration` = audio length) — the kit template does it.
- Visual-first: never put the spoken sentence on screen. Labels ≤ 3–4 words, max 2–3 visible at once. When a visual IS text (a screen, a sign), use real short words.
- Every beat fires on its spoken words (`W('unique phrase')`). Something new moves at least every ~3–4 s.
- Verify every number/fact (compute in Python). Say in the delivery message what is illustrative.
- Audience is global/Western: humans light skin only (`#f3cfb3` / `#f1c9ad` / `#e9b896`), brown/red/blonde/black hair.
- **People = `kBean` only** (kurz/people.js), the user's pick: simple, clean, shaded bean people with clear open eyes. **FRONT VIEW ONLY** for every character (people and hosts): the user rejected all 3/4 and side views ("koi angle pasand nahi aaya"); to look at something use `kGaze`. **Light skin only** (`#f3cfb3`, `#f1c9ad`, `#e9b896`; user: no dark-skinned characters). Hair: short, long, pony, bun, bald (curly and beard were dropped). Never `kHuman`, `kSlim`, `kKid`, `kBlobby`, and never the rejected cel-shaded `folk.js` people in new videos.
- **Hosts = Axo only, never Glim** (kurz/mascots.js, our own designs): through the whole video. Use them in most areas: reacting (`nMOOD` shock / happy / meh), hopping, waving, pointing at the thing, saying ≤ 4 words in an `nBubble` now and then. Front view only (Axo looks best facing the camera). They support the explanation, they never replace the real visual.
- **Original designs only:** never draw Kurzgesagt's own birds, ducks, characters, logo or any recognisable frame of theirs. We copy the *style* (flat, shaded, glowing, layered), not their artwork.
- If an attached "script" is not actually a script, say so and ask for the right file.

## Two looks (pick per area)
A real Kurzgesagt video (analysed frame by frame, 10 min) is mostly the **newer neon look**: deep navy/violet space, soft nebula, small static stars, strong bloom on light sources, saturated magenta / cyan / yellow / violet accents, and lots of Kurz-style infographic parts (label pills, map pins, timelines, counters, icon cards, gauges, glowing titles, speech bubbles). About half the frames are diagrams on dark space, the rest are illustrated scenes, mascot reactions and big glowing titles.
- **Neon (default for space, AI, tech, abstract, numbers):** `nSpace` backdrop per area (`grid: true` for a UI / synthwave look), `nTitle` for the hook / chapter titles, parts from neon.js. See `examples/kurz-neon-demo.js`.
- **Classic nature / body worlds (earth, nature, inside the body):** `kWorld` with `KPAL` palettes, hills, parallax, foreground silhouettes (kurz.js).
- Mix both in one video when the topic moves (e.g. neon space → body world via `kSCALE`).
- **Shot variety (newer Kurz):** alternate diagram shots (pins, timelines, counters on dark space), illustrated scenes with people, mascot reaction close-ups, big glowing titles, and UI-like screens / cards on a grid. Few hard cuts: most changes are camera moves (`CAM`, `WHIP`, `ZOOMIN`, `kSCALE`, `nDRIFT` keeps the camera slowly moving in every area).

## KURZ ONLY — nothing from the Infographics look (user: "kurz bola to kurz jaisa hi dikhe", "infographics wala kuch na aaye")
A Kurz video must look 100 % Kurzgesagt in EVERY frame. A real video made with this skill came out half Infographics (yellow speech bubbles, pill labels, flat icons, white document cards, people standing in a row talking) — never again. Kurz-style labels are fine and wanted, but only the neon.js versions (`nPill`, `nPin`, `nBubble`, `nCard`, …), never the Infographics helpers below.
- **Only this skill.** When the user says Kurz / Kurzgesagt, do NOT also follow hyperframes-explainer-video or finance-explainer-video (their rooms, characters, bubbles and pills are exactly what must not appear). Shared rules (short/long question, intro/outro, sync, no captions) are already copied above.
- **BANNED helpers** (the old video kit is loaded only for the camera/timing engine): `chat`, `pill`, `bubble`, `say`, `thought`, `card`, `docSheet`, `stamp`, `token`, `txt`, `tln`, `codeCard`, `win`, `wordC`, `ic`/`ico` (flat icons), `scene`, `useTheme`, `room`, `street`, `skyline`, `windowPane`, `tower`, `shelf`, `plant`, `clock`, `lamp`, `crate`, `book`, `bookPile`, `heads`, `cone`, `fgHeads`, `fgLeaves`, `fgBox`, `charB`, `botB`, `charP`, `botP`, `person`, `kKid`, `kBlobby`, `kHuman`, `kSlim`, `kCore`, `laptop`, `server`, `gpu`, `phone`, `desktop`, `chipM`, `brainBox`, `block`, `nnet`, `fire`, `encT`, `vecG`, `pixImg`, `bulb`, `gearG`, `ballG`, `liar`, and the extras.js drawings (`eyeBig`, `brainG`, `ghostG`, `fakePaper`, `treeG`, `sunG`, `flowerG`).
- **ALLOWED from the video kit** (engine only): `makeWorld`, `AO`, `addLife`, `moodLayer`, `dim`, `glow`, `go`, `W`, `B`, `beat`, `CAM`, `CUT`, `WHIP`, `ZOOMIN`, `hid`, `hidId`, `HID`, `POP`, `IN`, `OUT`, `FADE`, `PULSE`, `SHAKE`, `DRAW`, `DR`, `BOING`, `SPIN`, `BOB`, `eyes`, `spark`, `glowRing`, `intro`, `outro`, `lifeBeats`, `wtext` (only inside kurz helpers or for ≤ 2 big words per area), `rnd`, `grad`, `S`. Everything you SEE must come from `kurz/` (kurz.js, organs.js, tech.js, people.js, techviz.js, neon.js, mascots.js) or be a new drawing in the same shaded style.
- **Replacements:** label → `nPill` (neon) or `kCallout` (dot + line); place / item on a map → `nPin`; distance / time → `nTimeline` + `nPill`; a growing number → `nCounter` + `nCOUNT`; A × B = C → `nCard`s; speed / level → `nGauge`; a host or person speaking → `nBubble` (≤ 4 words, near the speaker, short tail) or `kSay`; document / source / web page → `kTablet`; data / token → `kCube` or `kCrystal`; AI model → `kMind` (always; `kBot` only if the AI must walk/act like a character); computation → `kNet` + `kFIRE`; data moving → `kStream` + `kFLOW`; computer / app → `kScreen`; data centre → `kServer`; big number → `kBigNum`; any other object → draw it shaded (`kBall`, `kBlob`, `kShade`), never a flat icon.
- **kurzlint is mandatory:** `python3 ~/hf-kit/kurz/kurzlint.py video.js` runs before every build (the build command below includes it). Any BANNED line = fix it and rebuild; read every WARN (outlines, white cards, labels > 4 words, too much text).

## AI / ML / data-science videos = REAL technical visuals in the Kurz look (user: "technical videos hai to technical cheeze honi chahiye, par style kurz hi")
The viewer of a DSML channel must SEE the real thing (matrices, attention, architecture, vectors, loss curves, code, equations, probabilities). Kurz metaphors (zoom, scale, galaxies, landscapes) are added on top to explain and to wow — never instead of the real thing. Pattern per idea: show the real technical object → explain its parts with `kCallout` → then a Kurz move (zoom into it, pull out to scale, turn it into a landscape/galaxy) → back to the real object.
Kit (kurz/techviz.js + tech.js), each hidden until its reveal call on the spoken words:
- **Model = `kMind`** (glowing neuron cluster, user's pick "B") — the same model object all video; zoom INTO it to show `kNet` + `kFIRE` or a `kStack`. (`kCore` planet look was rejected; `kGem`/`kOrb` only if the user asks.)
- Transformer / architecture → `kStack(par, cx, bottomY, w, h, [['Embedding',col],['Attention',col],…], id, {repeat:'×12'})` + `kSTACK`; any block / pipeline step → `kBox3D(par, cx, cy, w, h, depth, col, label, id)` joined by `kStream` + `kFLOW`.
- Attention → `kAttn(par, x, y, words, focus, weights, col, id)` + `kATTN` (arcs + %), and the matrix itself → `kMatrix(par, x, y, rows, cols, cell, vals|fn, col, id, {nums:true})` + `kMATRIX`.
- Embeddings → `kVector(par, x, y, nums, col, id, {vertical})` + `kVECTOR`; many embeddings → points/stars in a `space` world, similar words clustered (Kurz move).
- Training / loss → `kPlot(par, x, y, w, h, fn, col, id, {ballAt, labels:{x,y}})` + `kPLOT`; gradient descent → ball rolling down the curve, then pull out into a hilly loss landscape (Kurz move).
- Code → `kCode(par, cx, cy, w, ['real', 'python', 'lines'], id)` + `kCODE` (lines type in on cue). Real, short, correct code only.
- Math → `kEq(par, cx, cy, 'softmax(QKᵀ/√d)·V', size, col, id)` + `kEQ`, then `kCallout` on each part as it is spoken.
- Next-token / classifier output → `kProbs(par, x, y, w, [['Paris',.92],…], col, id)` + `kPROBS`.
- Tokens → `kCube(…, glyph)` rows or `kAttn` slabs; data / sources → `kTablet`, `kCrystal`; compute → `kServer`; a bad source / hallucination → one `KC.pink` crystal + `dim(t)`.
- Big numbers (parameters, tokens, GPUs) → `kBigNum` + a scale pull-out (`kSCALE`).
- Max 1–2 technical objects per frame, centred in the area's light; everything else is supporting detail. Numbers shown must be real or labelled illustrative in the delivery message.

## Frame composition (check every rev sheet)
- Each frame = ONE focal cluster (hero + 6–10 supporting shaded things) in or near the light glow. No frame is just a background with a label, no frame > 40 % empty, no "label alone on a gradient".
- Max 1–2 pieces of text visible (callouts / kSay / one big number). Kurzgesagt frames are mostly pictures.
- Nothing important cut by the frame: characters and heroes keep ≥ 80 px from every edge (at the current camera zoom); a character may only be cut on purpose as a blurred foreground silhouette.
- Characters do something (point, react, walk in, look up at the hero, are tiny for scale). Max 2 characters in a frame unless it is a crowd shown small.

## What makes the Kurzgesagt look (check every frame against this)
1. **Flat shapes, no outlines, everything shaded.** Every object gets a core shadow (bottom-right), a highlight (top-left) and, on hero objects, a rim light on the lit edge: use `kBall`, `kBlob`, or `kShade(par, el)` right after drawing any path/rect. Never a plain single-colour shape for an important object.
2. **One light source per area** (`kWorld` puts a glow + rays there). Shadows fall away from it; the hero sits in or near its glow.
3. **Dark saturated world, brighter objects.** Backgrounds are deep (`KPAL`), objects are lighter and warmer than everything behind them. 3–4 hues per area + one accent. The same object keeps the same colour all video (a fixed colour language, e.g. light = `KC.light`, problem = `KC.pink`).
4. **Depth in layers:** sky gradient → glow/rays/rings → 3 hill layers (the far one closest to the sky colour) → props standing ON those layers (`kLayer(R, 1..3)`: pines on the far hill, trees/rocks on the near one) → main story objects → blurred dark foreground silhouettes at 1–2 bottom corners (`kFgRocks` / `kFgPlants`). Parallax is automatic on every camera move.
5. **Detail clusters around one focal point:** 6–10 small supporting things (grass tufts, rocks, cells, clouds, stars, a tiny person for scale), never competing with the hero. No frame more than ~40 % empty, no frame that is one tiny object on a gradient for > 3 s.
6. **Scale storytelling (their signature):** jump between macro and micro — eye → retina → cells, planet → city → person, body → cell → molecule. Use `kSCALE(t, fx, fy, cx, cy, z)` (dive into a point of the old area, flash, land wide in the new one) or `ZOOMIN`. At least one scale jump per video when the topic allows it.
7. **Everything breathes:** `kLife()` once (hills drift, rays breathe, clouds drift, canopies/grass sway, organelles wobble, viruses spin, flagella wave, `.kBob` items bob). Things appear by growing with a soft overshoot (`kGROW`, `POP`, `BOING`), never just fading in. Camera eases with `sine.inOut` / `power2/3`; slow pushes (`CAM(t, …, 1.08, 2.5, 'sine.inOut')`) over static explanations.
8. **Kurzgesagt-style marks:** label pills (`nPill`, 1–4 words, sub-line allowed), dot + line labels (`kCallout` + `kCALL`), map pins (`nPin`), timelines (`nTimeline` + `nDRAW`), counters (`nCounter` + `nCOUNT`), icon cards (`nCard`), thick rounded arrows (`kArrow` + `kARROW`), big glowing titles (`nTitle`), big numbers (`kBigNum`). Never boxed paragraphs.
9. **Characters (`kBean`, people.js)** — `kBean(par, x, feetY, s, id, {sex:'m'|'f', skin (light only), hair, hairStyle:'short'|'long'|'bun'|'pony'|'bald', top, coat, pants, shoes, glasses})`, ~520 px tall at s=1. ids: `id+'B'` whole (move/bob), `id+'H'` head, `id+'E'` eyes (blink `eyes('#idE',[t])`), `id+'bL'/'bR'` brows (raise: `tl.to('#idbL',{y:-6})`), `id+'mS'` mouth / `id+'mO'` open mouth, `id+'aN'`/`id+'aF'` right/left arm (rotate with `transformOrigin:'50% 0%'`, within ±80°), `id+'lN'/'lF'` legs. Speak: `kTalk(id, t0, t1)`; walk: `kWALK(id, t, dx, d)`; look toward something: `kGaze(id, t, dir, dy)`. Every person a different hair/outfit colour, light skin range (Western audience). In AI/tech videos people are mostly small (for scale) or 1–2 reacting — the technical visuals are the stars.

10. **Hosts (`nAxo`, `nGlim`, mascots.js)** — `nAxo(par, x, feetY, s, id, {mood})` (~400 px tall at s=1, front view), `nGlim(...)` same. ids: `id+'B'` whole, `id+'H'` head, `id+'E'` eyes, `id+'mS'/'mO'/'mF'` mouths, `id+'aL'/'aR'` arms. Beats: `nMOOD(id, t, 'smile'|'happy'|'shock'|'meh')`, `nHOP(id, t)`, `nWAVE(id, t)`, `nTALKM(id, t0, t1)`. Put them at a frame corner or beside the hero, never over it.

## Better than Kurzgesagt (our extras — use them)
- One continuous `#world` with a camera instead of cuts; areas connected by `kSCALE` / `ZOOMIN` / `WHIP`.
- Parallax on every move (automatic) + blurred foreground.
- 2–3 reaction close-ups per video (CAM z ≈ 1.8–2 on a character's face on the emotional word).
- Light mood: `dim(t)` on a wrong/scary moment, `glow(t)` on a good one (`moodLayer(s)` after `addLife(s)`).
- Word-exact beats.

## Areas = worlds (not rooms)
Each topic group (~15–40 s of audio) is one area `AO(i)` painted with `kWorld(BG, defs, ox, oy, '<palette>', opts)`. Pick the palette by place:
space → `space` (stars, no hills) · inside the body → `body` (no hills) / `flesh` · night / mystery → `night`, `dusk` · water / calm science → `ocean`, `deep` · nature / life → `forest` · warm ending / hope → `sunset` · dry / heat → `desert` · tech / AI → `lab`.
Options: `{ stars: n, rays: false, hills: [...], lx, ly, hy, seed }` (lx/ly = light position in LONG frame coords). Neighbouring areas should use different palettes so area changes read clearly.
Neon areas: `nSpace(BG, defs, ox, oy, { seed, top, mid, bot, neb: [[x, y, r, col, op], …], stars, sparks, grid })` instead of `kWorld` (call `nFilters(defs)` once after `makeWorld`).

## Source plan FIRST (user: "pahele sochega ki ky cheez kaha se lena hai")
Before writing video.js, write a short table: area → visual → source. Sources in order:
1. **HyperFrames registry** — ASK FIRST every time ("Library check karu?"). Only on yes: clone `https://github.com/heygen-com/hyperframes` to `~/hf-registry` and browse `registry/components` (CATALOG.md). Never take captions, lower thirds, vignette, grain, particles, logo/brand units. Restyle anything taken to flat + shaded.
2. **Kurz kit** (`~/hf-kit/kurz/`) + the video kit (`~/hf-kit`).
3. **New custom drawing** in video.js, in the same style (shaded, no outlines, `kLG`/`kRG` gradients). If it would help later videos, ASK before adding it to `kurz/kurz.js`.

## Workflow
0. Kit setup (one command):
   done by the skill (always a fresh clone of the repo, so the latest kit + these rules are used).
   If the clone fails or `kurz/` is missing in the repo, tell the user (the kurz folder must be uploaded to the repo first) — never rewrite the kit by hand. Playwright: `NODE_PATH=/home/claude/.npm-global/lib/node_modules` (or `npm root -g`).
1. `mkdir ~/<name>-video && cd` there; copy the audio; script lines → `script.txt`; `python3 ~/hf-kit/align.py <audio> script.txt` → `words.json`, `meta.json`. Print sentences with times.
2. Plan: source plan, hero object for the intro, hook visual for the first 5 s, the areas (index, time range, palette, main story object, scale level, transition into it), one beat per sentence + 2–3 secondary motions per area, the final visual for the outro. Read `/tmp/hfk/examples/kurz-neon-demo.js` (neon look, parts, camera drift) and `/tmp/hfk/examples/kurz-blindspot-long.js` for the STRUCTURE only (worlds, kSCALE jumps, camera, beats) — the blindspot one is older and still has a `pill` and the legacy `kKid`: never copy those (kurzlint flags them).
3. Write `video.js`:
~~~~js
const VIDEO = { theme: 'blue', scenes: [{ type: 'custom', build: (s) => {
  const { G, BG, defs } = makeWorld(s, 4, 2); illusDefs(defs); addLife(s); moodLayer(s);
  const [ax, ay] = AO(0); const W0 = kWorld(BG, defs, ax, ay, 'space', { stars: 120 });
  kPlanet(G, ax + 960, ay + 540, 220, '#2a9d8f', 'earth', { glow: '#4cc9f0' });   // intro hero: NOT hid()
  kBean(G, ax + 1500, ay + 1030, .9, 'p1', { sex: 'f', hair: '#a8542c', hairStyle: 'long', top: '#e76f51' });
  kPine(kLayer(W0.R, 1), ax + 300, ay + 830, .6);                                  // props on a hill layer (only areas with hills)
  kCallout(G, ax + 1100, ay + 420, ax + 1400, ay + 220, 'OCEANS', KC.light, 'c0');   // hidden until kCALL
  kFgRocks(G, ax - 120, ay + 1060, 1.1);
  return () => {
    tl.set(HID, { autoAlpha: 0 }, 0); tl.set('#world', { transformOrigin: '0% 0%' }, 0);
    intro(s, '#earth', ax + 960, ay + 540, { col: '#4cc9f0' });
    kLife();
    let t = go('first words of area'); const starts = [t];
    CAM(t, ax + 960, ay + 540, 1.1, 1.6, 'power2.out'); kCALL('c0', W('later words')); kTalk('p1', W('she says'), W('next sentence')); eyes('#p1E', [t + 2, t + 6]);
    // next area: t = go('first words'); starts.push(t); kSCALE(t, ax + 1100, ay + 420, bx + 960, by + 540, 1);
    lifeBeats(starts.slice(1));
    outro(ax + 960, ay + 600, .95, '#earth');
  };
} }] };
~~~~
   - Every element that appears later gets an id + `hid()` / `hidId()`; create everything at build time, only animate in beats.
   - `W('words')` searches from the current area start: use 2–3 word phrases unique in the area.
4. Build (kurzlint first): `python3 ~/hf-kit/kurz/kurzlint.py video.js && cat ~/hf-kit/{premium.js,illus.js,life.js,helpers.js,icons.js,scenes.js,extras.js} ~/hf-kit/kurz/kurz.js ~/hf-kit/kurz/organs.js ~/hf-kit/kurz/tech.js ~/hf-kit/kurz/people.js ~/hf-kit/kurz/techviz.js ~/hf-kit/kurz/neon.js ~/hf-kit/kurz/mascots.js video.js > all.js && node -e "new Function(require('fs').readFileSync('all.js','utf8'))" && python3 ~/hf-kit/build.py all.js <audio> [index.html --short]`.
5. Check: `node ~/hf-kit/check.js > check.log 2>&1`, `python3 ~/hf-kit/check.py` (fix PHRASE warnings, PAGEERROR, STATIC), `node ~/hf-kit/textcheck.js index.html`, `python3 ~/hf-kit/phrasecheck.py video.js`, `python3 ~/hf-kit/sheets4.py` and look at EVERY rev sheet against the KURZ ONLY rules, the frame-composition rules and the 9 look points above (any Infographics speech bubble with a big yellow box, Infographics `pill`, flat icon, white document card or row of talking people = redo that area; neon pills / pins / cards are fine): unshaded flat blobs, empty frames, objects cut at the frame edge, labels on top of objects, hills showing a gap at the edge, foreground covering the hero. Plus intro (1.2, 2.5) and outro (END + 2) frames. Fix, rebuild, re-check the fixed moments.
6. Copy to `~/<name>-hyperframes/index.html`, send with SendUserFile, short Hinglish message: long/short + synced; "Title pakda/nahi mila"; "Library se liya: …" or leave out; area list (palette + what happens); setup (`mkdir assets`, `copy "<path>" assets\<name>.m4a`, `dir assets` — watch `.m4a.m4a`, `npx hyperframes render --output <name>.mp4`); what is illustrative; ask them to play it once and report glitches with the time.

## Kit reference (`kurz/kurz.js`, `kurz/organs.js`, `kurz/tech.js`, `kurz/people.js`, `kurz/techviz.js`, `kurz/neon.js`, `kurz/mascots.js`)
- Neon (neon.js): `NPAL` colours (bg, mag, cyan, yel, vio, teal, org, blue, ink), `nFilters(defs)`, `nBloom(el)`, `nSpace(...)`, `nSpark(par, x, y, r, col)`, `nTitle(par, cx, y, [{t, s, c}], id)`, `nPill(par, cx, cy, text, col, id, fs, {sub, ink, w})`, `nPlanet(par, cx, cy, r, base, id, {land, cloud, ring, bands, glow, seed})`, `nPin(par, x, tipY, s, col, id, innerFn)`, `nTimeline(par, x1, x2, y, nodes, col, id)` + `nDRAW(id, t, d)`, `nCounter(par, x, y, values, fs, col, id)` + `nCOUNT(id, t, d)` (`nNum(from, to, n)` makes the values), `nCard(par, cx, cy, size, drawFn, label, col, id)`, `nGauge(par, cx, cy, r, id)` + `nGaugeSet(id, t, v)` + `nNEEDLE(id, t, from, to)`, `nBubble(par, x, y, w, h, text, tailX, tailY, id, fs)`, `nGalaxy(par, cx, cy, r, id, tilt)`, `nRocket(par, x, y, s, id)` + `nFLY(id, t, dx, d, dy)`, `nSpeed(par, x, y, w, h, id)`, `nPOP(sel, t)`, `nDRIFT(t0, t1, cx, cy, z0, z1, dx)`, `nLife()` (call once in beats).
- Hosts (mascots.js): `nAxo`, `nGlim` + `nMOOD`, `nHOP`, `nWAVE`, `nTALKM` (see look point 10).
- People (people.js): `kBean` (front view), `kWALK`, `kGaze` (see look point 9). Model: `kMind(par, cx, cy, r, col, id, n)` (tech.js; ids id+'g' glow, id+'n' nodes).
- Techviz (techviz.js): `kBox3D`, `kMatrix`/`kMATRIX`, `kVector`/`kVECTOR`, `kAttn`/`kATTN`, `kStack`/`kSTACK`, `kPlot`/`kPLOT`, `kCode`/`kCODE`, `kEq`/`kEQ`, `kProbs`/`kPROBS` (signatures in the AI section).
- Tech / AI (tech.js): (`kCore` planet-orb = rejected, don't use) `kCube(par, cx, cy, s, col, id, glyph)` isometric data block, `kCrystal(par, cx, cy, s, col, id, glow)` data point / fact, `kTablet(par, cx, cy, w, col, id, {tilt, badge, lines})` document / source, `kServer(par, x, feetY, s, col, id, n)`, `kScreen(par, cx, cy, w, h, col, id)` → content group (draw inside), `kNet(par, cx, cy, w, h, layers, col, id)` + `kFIRE(id, t)`, `kStream(par, d, col, id, n, r)` + `kFLOW(id, t, reps)`, `kSay(par, sx, sy, text, col, id, fs, side)` + `kSAY(id, t)` (tail tip at the speaker sx, sy), `kBot(par, x, feetY, s, id, col)` robot (ids id+'B', 'E', 'H', 'aL', 'aR', 'mS').
- Colours: `KC` (light, cell, pink, brain, nerve, ink …), `KPAL` palettes, `kMix(a,b,f)`, `kDark(c,f)`, `kLite(c,f)`, gradients `kLG(defs, stops, x2, y2)`, `kRG(defs, stops)`, `kClip(defs, el)`, geometry `kArc`, `kPt`, `kDeg`.
- Shading: `kBall(par, cx, cy, r, base, dark?, lite?, id?, rim?)`, `kShade(par, el, dark?, lite?)`, `kBlob(par, cx, cy, r, base, id, {wob, seed, sy})`, `kBlobD(...)` (path only), `kGlow(par, cx, cy, r, col, a)`.
- World: `kWorld(...) → {R, lx, ly}`, `kLayer(R, 1|2|3)`, parallax `KPF` factors (FGP override), `kFgRocks(par, x, y, s, col, flip)`, `kFgPlants(...)`.
- Nature/space: `kCloud(par, cx, cy, s, id, col, shade)`, `kTree(par, x, y, s, id, {col, trunk})`, `kPine(par, x, y, s, col)`, `kGrass(par, x, y, s, col)`, `kRock(par, x, y, s, col, seed)`, `kMountain(par, x, y, w, h, col, snow)`, `kPlanet(par, cx, cy, r, base, id, {ring, bands, craters, glow})`, `kSun(par, cx, cy, r, id)`.
- Micro: `kCell(par, cx, cy, r, id, {col, nuc, seed})` (nucleus id+'N'), `kVirus(par, cx, cy, r, col, id)`, `kBacterium(par, cx, cy, len, r, col, id, rot)`, `kMolecule(par, cx, cy, s, id, atoms)`.
- Marks: `kCallout(par, x1, y1, x2, y2, text, col, id, fs)` + `kCALL(id, t)`, `kArrow(par, d, col, id, w)` + `kARROW(id, t, d)`, `kBigNum(par, cx, cy, text, size, col, id)`.
- Characters: `kBean` (people.js) + `kTalk(id, t0, t1)`; hosts `nAxo` / `nGlim` (mascots.js). `kHuman`, `kSlim`, `kKid`, `kBlobby` stay in kurz.js only for old videos — never in new ones (kurzlint flags them).
- Motion: `kLife()`, `kSCALE(t, fx, fy, cx, cy, z, d)`, `kGROW(sel, t, d)`; plus the video kit's CAM/CUT/WHIP/ZOOMIN/BOING/dim/glow/eyes/spark/glowRing/intro/outro/lifeBeats.
- Organs: `kEye2(par, cx, cy, s, id, {look, halo})`, `kView2(par, x, y, w, h, id)`, `kVoid(par, cx, cy, r, id)`, `kPhone2(par, cx, cy, w, h, id, screenFill, {plus, dot, withDot})`, `kEyeFull(G, Cx, Cy, R, TH, ax)` (one per video: fixed ids), `kBrain2(par, cx, cy, s, id)`, `kCamR2(par, cx, cy, s, id)`.

## Pitfalls
- Load order: video kit first, then `kurz.js`, then `organs.js`, then `tech.js`, `people.js`, `techviz.js`, `neon.js`, `mascots.js`. `kurz.js` redefines `FGP` (parallax) on purpose — never define another `FGP`.
- `kShade`, `kBlob`, `kRock`, `kBacterium`, `kArrow` measure their shape (getBBox / getTotalLength): call them at build time, never inside beats.
- `kCallout` and `kArrow` hide themselves (`hidId`): reveal ONLY with `kCALL` / `kARROW`, never POP/FADE the whole group.
- `kWorld` clips its area: anything that must cross into another area belongs in `G`, not in `R`.
- Things inside a hill layer (`kLayer`) parallax with it — keep story objects in `G`, only scenery in layers.
- Classes `kSway`, `kPulse`, `kSpin`, `kBob`, `kCloudD` are animated by `kLife()`: don't also rotate/scale/move those same elements in beats (wrap them in a parent group and animate the parent).
- Character size: `kBean` is ~520 px tall at s=1 — in a LONG frame s ≈ .5–1.1, feet on a hill line; keep the head ≥ 80 px from the frame top; close-ups by camera zoom.
- Characters are front view only: never mirror or rotate them sideways; don't put labels or callouts on a face.
- `kSCALE` uses `#flash` from `addLife(s)` and moves the camera: keep close-up CAMs ending ≥ 0.6 s before it.
- `POP()` hides its target from frame 0: never POP the intro hero; PULSE it instead.
- Whole-eye blinks: `eyes('#id', [t])` squashes the whole group — use it on eye groups only (`id+'E'`).
- Same video-kit pitfalls apply: `hid()` + `DRAW()` stays invisible (use `DR()`), fromTo needs autoAlpha in both from and to, comments on their own line, no emoji, no colour tweens, no onUpdate, finite repeats only.
