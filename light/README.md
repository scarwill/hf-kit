# light/ — LIGHT kit (Netlight ML neon-tech look, fixed)

Used by the `light` skill. Same look and the same `nl*` parts as `netlight/` (which stays unchanged), but the rules are built into the kit and the checks catch the mistakes that broke long Netlight videos.

| file | what |
|---|---|
| `light.js` | theme + parts (`nl*`) + beats (CAPS) + the house layer: `nlSetup`, `cOrb` (fixed corner orb; blinks + camera looks added automatically by `nlOrbLife`, `ORB_CAM`), `NEXT`, `CUE`, `arw`, `nlBegin` / `nlFinish`, screenshot helpers (`nlShot`, `SHOT_FOCUS`, `nlShotHL`, `nlCursor`, `CURSOR`, `CLICK`). No grid, no `nlCmd`, no `ORB_LOOK`. Guards print `LIGHT: ...` errors (orb in the last scene, scene without orb, scene missing from nlBegin, scene start phrase not found). |
| `lbuild.py` | `python3 lbuild.py video.js <audio> [index.html] [--short] [--no-bgm] [--force]` — `--short` = YouTube Short 1080x1920 (810x1440 canvas scaled 4/3, orb top-right, no boot intro, 1.2 s end card, needs `HOOK([...])` + `nlCaptions()` in build, warns over 42 s and stops over 50 s; used by `net-shorts`) — lint (banned helpers, house helpers pasted again, emoji, hero PULSE) + scene-aware phrase check (NOTFOUND / OUTSIDE / SCENE = error, AMBIGUOUS = warn) + scene table + build + bgm track. Errors = no index.html. |
| `lcheck.js` | `node lcheck.js index.html [--from A --to B] [--every 4] [--nosheet]` — HOOK0 (Short: frame 0 / 0.5 s nearly empty) / EMPTY / TEXT / SMALL / OUT / OVERFLOW / OVERLAP / ORBCORNER / NOORB / NOVISUAL / GAP / CUTTEXT (screenshot word cut by a window edge or by the crop) / SMALLSHOT (page text < 9 px) / SVGOUT (drawing spills out of its box) / SAFE (Short only: part or caption under the Shorts player UI) / CAPTION (part under a visible caption) + JS errors; frame size from the page (LONG or SHORT); writes `cues.json` and contact sheets `out/sheet_NN.png`. |
| `lfind.py` | `python3 lfind.py assets/x.png ["phrase" ...]` — OCR (tesseract) every word once -> `assets/x.boxes.json` (embedded by lbuild); prints phrase boxes and `EDGE:` words cut by the crop. Highlights / cursors on screenshots are placed by phrase from these boxes. |
| `lshotcheck.js` | `node lshotcheck.js index.html [--from A --to B]` — full-size (1:1) crops of every screenshot moment (highlight on, cursor landed, zoom done) -> `out/pages_NN.png`. Read them all before delivery. |
| `lsheet.js` | contact sheets (16 frames in one image): `every 4 [from] [to]`, `range A B step` (motion strip), `at t1 t2 ...`; `--name`, `--cols 3`. |
| `lmix.py` | `python3 lmix.py index.html <voice> <mood>` — music + cues (score.py), measured mix (music -13 dB under the voice, cues -10 dB under its peak) -> `bgm.m4a`, cue onset check. |
| `lverify.py` | pocketsphinx check of words.json against the real audio (unique 5+ letter words, > 0.5 s off = CHECK). |
| `realign.py` | sentence report + manual boundary fix (fixed sentences show as `fixed`). |
| `score.py` | self-made music (moods dark / lofi / upbeat / calm / cinematic) + sound cues. |
| `webshot.js`, `netlog.js` | real web page screenshots through the session proxy / which hosts are blocked. |
| `RULES.md` | the short rules card the skill re-reads before every batch of scenes. |

Example: `examples/light-demo.js` (text -> tokens -> IDs -> vectors -> next token; laptop + cursor click, scissors cutting tokens, packet on the recap pipeline).
| `lcaps.py` | `python3 lcaps.py [index.html]` — `captions.srt` + `captions.vtt` for YouTube from words.json + meta.json, on the video timeline (voice + HEAD), the script's own words, 1 sentence or part of it per cue, max 2 lines of 42 chars. |
| `nlCaptions()` (light.js) | on-screen captions for Shorts: 2-3 script words at a time, the spoken word lit, band y 1012-1092 on the 810x1440 canvas inside the safe column (lbuild embeds the words as NLCAPW). |
| `music/` | the video's own music + sound cues (`music/README.md`); `lmix.py` / `score.py` are rejected. |
| `scriptcheck.py` | `python3 scriptcheck.py script.txt [--short] [--title ..] [--thumb ..] [--promise ..]` — the script mistakes from `analytics.md`: length, hook, early jargon / acronyms, old template lines, late title promise, title / thumbnail acronyms, phrases reused from `scripts/`. |
| `scripts/` | every published Netlight long-video script (Shorts are cut from these; scriptcheck compares with them). |
| `analytics.md` | the channel's YouTube Studio numbers + lessons (read by `light`, `net-shorts`, `net-trends`). |

Short example: `examples/light-short-demo.js` (HOOK at frame 0, safe column, captions at the end of build).
