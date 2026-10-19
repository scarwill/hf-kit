# news/ — kit for the AI + Dev news channel (`news` skill)

Light "Clean Blue" look (blue + black), Shorts 1080x1920 and long videos 1920x1080, real screenshots and press photos, Fireship-style pace.
Decisions: `BRAND.md`. Rules card: `RULES.md`. Skill: `SKILL.md` (upload it to claude.ai as the `news` skill). Covered stories: `log.md`.

| file | what |
|---|---|
| `scan.py` | `python3 scan.py [--hours 36] [--no-gh]`: leads for the day: AI / dev / security feeds, Hugging Face trending models + spaces, Hacker News top, GitHub trending |
| `pageshot.js` | `node pageshot.js <url> <out> "phrase" ... [--crop y0:y1]`: full-page screenshot, exact phrase boxes, crops (for `sShot` + highlights) |
| `look.js` | the look + parts (`s*`), scene cut (hard cut + punch-in), end card. Works for Shorts and long |
| `news.js` | engine only (D, nlScene, NEXT, CUE, nlBox, TYPE, COUNT...). Its old neon parts are banned by build.py |
| `build.py` | `python3 build.py video.js <audio> [--long]`: lint + phrase check against words.json + build `index.html` (+ bgm track) |
| `check.js` | `node check.js index.html [--from A --to B] [--every s] [--nosheet]`: EMPTY / TEXT / SMALL / OUT / OVERFLOW / SAFE / NOVISUAL / GAP + JS errors, `cues.json`, contact sheets |
| `sheet.js` | contact sheets: `every s [from] [to]`, `range A B step`, `at t1 t2 ...`, `--name x` |
| `nmix.py` | `python3 nmix.py index.html <voice> <mood>`: own music + sound cues -> `bgm.m4a` |
| `realign.py`, `nverify.py` | sentence report / boundary fix, pocketsphinx sync check (after `../video/align.py`) |
| `thumb.js` | `node thumb.js spec.json out.png`: thumbnail (layouts `big3`, `single`) + phone-feed preview |
| `score.py`, `webshot.js`, `netlog.js` | music + cue synth, simple screenshot, blocked-host finder |

Examples: `examples/news-short-demo.js` (OpenAI misalignment Short, 1080x1920), `examples/news-long-demo.js` (Tesla Roadster, 1920x1080). Both: 0 check warnings.
