# NEWS look rules card (re-read before every batch of scenes)

`cat ~/nkit/news/RULES.md` before writing each batch. Full decisions: `BRAND.md`.

## Look
- Light "Clean Blue": bg #F5F8FA, ink #0F172A, the only accent blue `SB.blue`, red `SB.red` ONLY for problems (HACKED, X, not legal). No neon, no mascot, no intro, no header / footer / progress bar.
- Headlines `sHead` (Inter Tight 800, `<b>` = blue word). Shorts: 90-120 px. Long: 100-130 px. Body >= 30 px (Shorts) / 28 px (long), labels >= 30 / 28 px.
- Shorts safe zone: every text part above y 1590, and left of x 940 below y 900 (check.js SAFE). Long: 50 px from every edge.

## Every scene
- One main visual that MOVES: photo with `KB`, screenshot with `SZOOM` + `SHL` highlight, typed `sCode`, counter `sCount` + `COUNT`, table `TABLE`, drawing in `nlBox`, arrow / circle `sDraw`, stamp `STAMP`.
- Shorts: something new every 1-1.5 s (check.js GAP > 2.5 s). Long: every 3-4 s (GAP > 4 s).
- First frame of a scene already shows its main part (hard cut, no empty frames). Fill a scene early with a part at `{ to: .3 }` and raise it on the word.
- Two scenes in a row never use the same main visual type.

## Text on screen
- When the voice talks ABOUT a text (headline, quote, post, command, code, model name, number), show that exact text: screenshot + `SHL`, `sCode` + `TYPEL`, `sQuote`, `sCount`, `sTable`.
- Labels 1-4 words, chips 2-6 words. Never caption the narration.
- Sources on screen: a pill with source + date in the hook (`sPill`), credit on every photo ("Photo: Tesla"), URL in every screenshot bar.

## Real things
- Screenshots: `pageshot.js` (full page + exact phrase boxes + crops) -> `sShot` + `el.hl(...)` on the real phrase boxes.
- Photos: official press / newsroom images or free-licence images only, credited. No ripped clips, no meme images, no redrawn logos.
- Our own drawings (wallets, browsers, diagrams) are fine: say they are illustrative in the delivery message.

## Sync
- `NEXT('#sN', 'first words')` per scene, `W('2-3 word phrase')` unique inside the scene, never raw seconds for beats.
- build.py ERRORs (NOTFOUND / OUTSIDE / SCENE / BANNED / OVERLAY / REDEFINE) block the build: fix them, never `--force` a delivery.

## Code
- Every top-level part needs an id; position with left/top (GSAP transforms override CSS transform). A plain `D(...)` part needs `position:absolute` in its css.
- Children of a card show with the card: give them ids and FADE / POP them to reveal later (POP and fromTo hide from frame 0).
- `fromTo` needs autoAlpha in both from and to; no colour tweens, no onUpdate, finite repeats, no emoji, comments on their own line.
- Never use `stage`, `document.body` or old neon parts (`nl*` windows, `nw*` cards): build.py bans them.
- `CUE(t, kind)` next to its beat: `hit` big reveals and stamps, `err` problems, `tick` rows / list items, `pop` new parts, `chime` confirmations, `type` typed text, `whoosh` comes with NEXT.

## Checking (context budget)
- Look ONLY at contact sheets (`out/sheet_NN.png`, `out/fix_NN.png`, `out/motion_NN.png`), never single frames.
- Shorts: one `check.js` run (sheets every 1.5 s) + one fix sheet. Long: per batch of ~6 scenes `check.js --from --to`, then the whole video once.
