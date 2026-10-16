# news/ — NEWS kit (daily tech news, neon-tech look, no mascot)

Used by the `news` skill. Built from the `light/` kit (same `nl*` parts and the same checks), with these changes:
- no mascot / orb anywhere (nbuild bans `nlOrb`, `cOrb`, `ORB_*`);
- no header, footer, progress bar or ticker (nbuild bans drawing on `stage` from video.js);
- intro "Signal" (broadcast emblem + typed channel name + date + story count) and outro "Sign-off" (`> subscribe --daily`), both from the kit;
- news parts: story opener dial, article card, post card, spec table, timeline, company badge, recap;
- guards for stories: numbered 1..n in order, source + date on every opener / card.

| file | what |
|---|---|
| `news.js` | theme + parts (`nl*`, `nw*`) + beats (CAPS) + house layer: `nwSetup(s, { channel, date })`, `NEXT`, `CUE`, `arw`, `nwBegin` / `nwFinish`, screenshot helpers (`nlShot`, `SHOT_FOCUS`, `nlShotHL`, `nlCursor`, `CURSOR`, `CLICK`). Guards print `NEWS: ...` errors. |
| `nbuild.py` | `python3 nbuild.py video.js <audio> [index.html] [--no-bgm] [--force]` — lint (banned helpers, mascot, overlays, house helpers pasted again, emoji, hero PULSE) + scene-aware phrase check (NOTFOUND / OUTSIDE / SCENE = error, AMBIGUOUS = warn) + scene table + build + bgm track. Errors = no index.html. |
| `ncheck.js` | `node ncheck.js index.html [--from A --to B] [--every 4] [--nosheet]` — EMPTY / TEXT / SMALL / OUT / OVERFLOW / OVERLAP / NOVISUAL / GAP + JS errors; writes `cues.json` and contact sheets `out/sheet_NN.png`. |
| `nsheet.js` | contact sheets (16 frames in one image): `every 4 [from] [to]`, `range A B step` (motion strip), `at t1 t2 ...`; `--name`, `--cols 3`. |
| `nmix.py` | `python3 nmix.py index.html <voice> <mood>` — music + cues (score.py), measured mix -> `bgm.m4a`, cue onset check. Default mood for news: `upbeat`. |
| `nverify.py` | pocketsphinx check of words.json against the real audio. |
| `realign.py` | sentence report + manual boundary fix. |
| `score.py` | self-made music (dark / lofi / upbeat / calm / cinematic) + sound cues. |
| `webshot.js`, `netlog.js` | real web page screenshots through the session proxy / which hosts are blocked. |
| `RULES.md` | the short rules card the skill re-reads before every batch of scenes. |
| `SKILL.md` | the `news` skill (upload it to claude.ai as a skill). |

News parts (each returns its element; ids are yours):

| part | beat | use |
|---|---|---|
| `nwStory(par, id, x, y, k, n, tag, source, date)` (520 x 520) | `STORY(id, t)` | first scene of every story: dial with one arc per story, big `02`, tag, source + date |
| `nwHead(par, id, x, y, w, source, date, headline, c)` | `MARK(id, t)` | the real headline word for word; `<b>1-4 words</b>` get a marker sweep |
| `nwPost(par, id, x, y, w, name, handle, date, text, c)` | `POST(id, t, dt)` | a real post / statement, revealed word by word (generic card, no platform UI) |
| `nwSpec(par, id, x, y, w, cols, rows, head)` | `SPEC(id, t, dt)` | A vs B / spec table; a row's extra item = winning column (lights up) |
| `nwTime(par, id, x, y, w, [[date, event], ...])` | `TIMELINE(id, t, dt)`, `TIME_GO(id, t, k)` | history / versions with a travelling marker |
| `nwCo(par, id, cx, y, name, c, sz)` | `POP` | company / project badge (initials, never a logo) |
| `nwRecap(par, id, x, y, w, items, head)` | `RECAP(id, t, dt)` | last scene: today's stories ticked off |

Example: `examples/news-demo.js` (2 real 2024 stories as a format demo: Python 3.13 free-threaded build, NumPy 2.0).
