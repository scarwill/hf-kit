# light/ — LIGHT kit (Netlight ML neon-tech look, fixed)

Used by the `light` skill. Same look and the same `nl*` parts as `netlight/` (which stays unchanged), but the rules are built into the kit and the checks catch the mistakes that broke long Netlight videos.

| file | what |
|---|---|
| `light.js` | theme + parts (`nl*`) + beats (CAPS) + the house layer: `nlSetup`, `cOrb` (fixed corner orb, eyes fixed up-left), `NEXT`, `CUE`, `arw`, `nlBegin` / `nlFinish`, screenshot helpers (`nlShot`, `SHOT_FOCUS`, `nlShotHL`, `nlCursor`, `CURSOR`, `CLICK`). No grid, no `nlCmd`, no `ORB_LOOK`. Guards print `LIGHT: ...` errors (orb in the last scene, scene without orb, scene missing from nlBegin, scene start phrase not found). |
| `lbuild.py` | `python3 lbuild.py video.js <audio> [index.html] [--no-bgm] [--force]` — lint (banned helpers, house helpers pasted again, emoji, hero PULSE) + scene-aware phrase check (NOTFOUND / OUTSIDE / SCENE = error, AMBIGUOUS = warn) + scene table + build + bgm track. Errors = no index.html. |
| `lcheck.js` | `node lcheck.js index.html [--from A --to B] [--every 4] [--nosheet]` — EMPTY / TEXT / SMALL / OUT / OVERFLOW / OVERLAP / ORBCORNER / NOORB / NOVISUAL / GAP + JS errors; writes `cues.json` and contact sheets `out/sheet_NN.png`. |
| `lsheet.js` | contact sheets (16 frames in one image): `every 4 [from] [to]`, `range A B step` (motion strip), `at t1 t2 ...`; `--name`, `--cols 3`. |
| `lmix.py` | `python3 lmix.py index.html <voice> <mood>` — music + cues (score.py), measured mix (music -13 dB under the voice, cues -10 dB under its peak) -> `bgm.m4a`, cue onset check. |
| `lverify.py` | pocketsphinx check of words.json against the real audio (unique 5+ letter words, > 0.5 s off = CHECK). |
| `realign.py` | sentence report + manual boundary fix (fixed sentences show as `fixed`). |
| `score.py` | self-made music (moods dark / lofi / upbeat / calm / cinematic) + sound cues. |
| `webshot.js`, `netlog.js` | real web page screenshots through the session proxy / which hosts are blocked. |
| `RULES.md` | the short rules card the skill re-reads before every batch of scenes. |

Example: `examples/light-demo.js` (text -> tokens -> IDs -> vectors -> next token; laptop + cursor click, scissors cutting tokens, packet on the recap pipeline).
