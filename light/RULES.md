# LIGHT rules card (re-read before EVERY batch of scenes)

Long videos go wrong when these get forgotten halfway. `cat ~/lkit/light/RULES.md` before writing each batch.

## Look
- Background #05070d + navy glow. No grid, no vignette, no particles, no captions, no header/footer/progress bar.
- Colour = meaning, all video: DATA `NL.data` green · MODEL `NL.model` blue · OUTPUT `NL.out` yellow · ERROR `NL.err` pink. Purple ONLY as the `<b>word</b>` in a scene title.
- Text: labels 1-4 words, max 2-3 chips per scene, body >= 30 px, labels >= 24 px, titles 60 px. Never put the spoken sentence on screen.
- When the voice talks ABOUT a text (prompt, command, query, error, code, formula, URL, name), show that exact text: typed in a window (`nlType` + `TYPE`), as code (`nlCode`), as a highlighted row (`nlRow` + `nlRowHL`), or big (`nlBig`).

## Orb (host)
- `cOrb(scene, 'oN')` in every scene except the LAST. `ORB_ON('oN', t)` at the scene start. Same corner always; the kit fixes size, place and eyes.
- Never `nlOrb`, `ORB_LOOK`, `nlCmd`. Keep x < 1700 or y < 870 free of windows/chips (the orb corner).
- "The model / the agent" as an object in the middle = `nlWin` + `nlNet`, not the orb.

## Visuals
- Every scene: at least one MOVING technical visual (net, curve, matrix, dots, loop, code, bars, custom drawing). lcheck NOVISUAL = fix.
- Draw the script's own objects (game, phone, server, scissors, laptop...) with `nlBox` + SVG. 2-3 custom drawings per video.
- Two scenes in a row never use the same main visual type. Window + rows + chips as the main visual: at most 1 scene in 3.
- One `nlHero` = the story's main object, glides with `HERO(...)`. Never rebuild it, never `PULSE` it, never `IN` it after a `HERO` move (use `FADE`).
- Wires: start at the centre of the source edge, end on the target edge, arrowhead `arw(g, x, y, c, 'r'|'l'|'u'|'d')` for flow. Re-check wires after moving a part.
- Things inside a window/frame fit fully inside it. A moving ball/packet/dot never sits frozen: it moves continuously and lands ON its word.
- Frame never > 75% empty. Fill a scene's first seconds with the coming parts at `{ to: .3 }`, then `TO(..., { autoAlpha: 1 })` on the word.

## Sync
- `NEXT('#sN', 'first words of sN')` for every scene change. `W('2-3 word phrase')` unique inside the scene. Never raw seconds for beats.
- Something new moves every 3-4 s. Every beat on its spoken words.
- lbuild ERRORs (NOTFOUND / OUTSIDE / SCENE / BANNED) block the build: fix them, never `--force` a delivery.

## Code
- Build every part at build time; only animate in beats. Give every top-level part an id.
- A child of a window shows with the window: to reveal it later give it an id and FADE/POP it (POP hides it from frame 0).
- Highlight frames inside rows/windows: `FADE`, not `POP` (the overshoot makes the window OVERFLOW). Never `PULSE` a row inside a window.
- `fromTo` needs autoAlpha in both from and to. No colour tweens, no onUpdate, finite repeats, no emoji, comments on their own line.
- `CUE(t, kind)` next to its beat: `hit` 4-6 biggest reveals, `chime` on a check, `err` on every cross/failure, `tick` list items / rows, `pop` new object, `blip` small digital events, `type` for typed text. NEXT adds the whoosh.

## Checking (context budget)
- Look ONLY at contact sheets (`out/sheet_NN.png`, `out/motion_NN.png`). Never Read single frames.
- Per batch: 1 lcheck (`--from --to`), its 1-2 sheets, 1 motion sheet per moving thing. Whole video at the end: the full lcheck sheets once.
- After a fix: `lsheet.js index.html at <fixed times> --name fix` (one sheet), not a full re-check.
