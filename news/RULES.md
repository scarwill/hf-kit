# NEWS rules card (re-read before EVERY batch of scenes)

Long videos go wrong when these get forgotten halfway. `cat ~/lkit/news/RULES.md` before writing each batch.

## Look
- Background #05070d + navy glow. No mascot, no grid, no vignette, no particles, no captions, no header/footer/progress bar, no ticker. Every part lives inside a scene (nbuild bans `stage` in video.js).
- Colour = meaning, all video: NEW / GOOD `NL.data` green · COMPANY / PRODUCT `NL.model` blue · KEY NUMBER / FACT `NL.out` yellow · PROBLEM / RISK `NL.err` pink. Purple ONLY as the `<b>word</b>` in a scene title.
- Text: labels 1-4 words, max 2-3 chips per scene, body >= 30 px, labels >= 24 px, titles 60 px. Never put the spoken sentence on screen.
- When the voice talks ABOUT a text (headline, post, quote, command, error, code, URL, name), show that exact text: `nwHead` (headline), `nwPost` (post / statement), `nlType` + `TYPE` (command, query), `nlCode` (code), `nlBig` (short quote or number).

## Stories
- Story k of n starts with `nwStory(scene, id, x, y, k, n, tag, source, date)` + `STORY(id, t)` in its first scene. Numbered 1..n in order (kit guard).
- The voice says the signpost ("story two", "next up") at a story start: that is its `NEXT` phrase.
- Every fact on screen comes from sources.md. Source + date on every story opener, article card and post card. Numbers that change get a date. Illustrative things are said in the delivery message.
- Real pages beat cards: the real article / repo / paper / post as `nlShot` with cursor + `SHOT_FOCUS` + `nlShotHL`. `nwHead` / `nwPost` when no good screenshot exists.
- Companies are `nwCo` badges (initials) or the real page. Never redraw a logo or a site's UI. Never put someone else's video, audio or photo in as a clip.

## Visuals
- Every scene: at least one MOVING visual (story dial, marker sweep, typed text, timeline marker, counter, bars, wires + packets, custom drawing). ncheck NOVISUAL = fix.
- Draw the story's own objects (phone, chip, server rack, satellite, court gavel...) with `nlBox` + SVG. 2-3 custom drawings per video.
- Two scenes in a row never use the same main visual type. Window + rows + chips as the main visual: at most 1 scene in 3.
- `nlHero` (optional) = one object that glides across a story's scenes with `HERO(...)`. Never `PULSE` it, never `IN` it after a `HERO` move (use `FADE`).
- Wires: start at the centre of the source edge, end on the target edge, arrowhead `arw(g, x, y, c, 'r'|'l'|'u'|'d')` for flow. Re-check wires after moving a part.
- Things inside a window/frame fit fully inside it. A moving ball/packet/dot never sits frozen: it moves continuously and lands ON its word.
- Frame never > 75% empty. Fill a scene's first seconds with the coming parts at `{ to: .3 }`, then `TO(..., { autoAlpha: 1 })` on the word.

## Sync
- `NEXT('#sN', 'first words of sN')` for every scene change. `W('2-3 word phrase')` unique inside the scene. Never raw seconds for beats.
- Something new moves every 3-4 s. Every beat on its spoken words.
- nbuild ERRORs (NOTFOUND / OUTSIDE / SCENE / BANNED / OVERLAY) block the build: fix them, never `--force` a delivery.

## Code
- Build every part at build time; only animate in beats. Give every top-level part an id.
- A child of a window shows with the window: to reveal it later give it an id and FADE/POP it (POP hides it from frame 0).
- Highlight frames inside rows/windows: `FADE`, not `POP` (the overshoot makes the window OVERFLOW). Never `PULSE` a row inside a window.
- `<b>` marks in `nwHead` never wrap: keep each to 1-4 words.
- `fromTo` needs autoAlpha in both from and to. No colour tweens, no onUpdate, finite repeats, no emoji, comments on their own line.
- `CUE(t, kind)` next to its beat: `hit` on each story opener + the 2-4 biggest reveals, `chime` on a check / confirmed fact, `err` on every cross / failure, `tick` list items / rows, `pop` new object, `blip` small digital events, `type` for typed text. NEXT adds the whoosh.

## Checking (context budget)
- Look ONLY at contact sheets (`out/sheet_NN.png`, `out/motion_NN.png`, `out/fix_NN.png`). Never Read single frames.
- Per batch: 1 ncheck (`--from --to`), its 1-2 sheets, 1 motion sheet per moving thing. Whole video at the end: the full ncheck sheets once.
- After a fix: `nsheet.js index.html at <fixed times> --name fix` (one sheet), not a full re-check.
