---
name: "news"
description: "Run the user's AI + Dev news YouTube channel end to end: find today's AI / developer / Hugging Face / GitHub / cloud-security news (verified, scored), propose daily Shorts, a weekly 'This Week in Tech' long video and Big Story videos, write TTS-ready English scripts with sources, then build the video in the channel's light blue + black look (real screenshots with highlights, press photos, typed code, stamps, arrows, counters, own music + sound cues) as HyperFrames index.html + bgm.m4a synced to the user's TTS audio, plus thumbnails and YouTube text. Use when the user says news / news skill, 'aaj ka kya hai', asks for today's or this week's tech / AI news, a news Short, a weekly or Big Story video, or a news thumbnail."
---

# NEWS: the AI + Dev news channel (research -> script -> video)

The user runs a faceless AI + developer news channel for a US / UK audience. Voice = the user's English TTS. Talk to the user in Hinglish, short and clear.
Locked decisions live in `~/nkit/news/BRAND.md`: read it at the start of every session. If the user changes a decision, update BRAND.md (ask before pushing).

**THIS SKILL ONLY.** Do not also follow `light`, `netlightml`, `net-script`, `net-thumb`, `kurzgesagt-explainer-video` or other video skills.

## Never skip a stop
The user: "jab tak me na bolu banane mat lag jaana". Three stops, every time:
1. **News list** -> stop. The user picks.
2. **Script(s) + sources** -> stop. The user edits / approves and makes the TTS.
3. **Video** only after the TTS audio arrives.
Never start the next stage on your own, never build a video "to save time". Ask before changing the kit, other skills, or pushing.

## What the user says -> what they get
| User says | You do | Then stop with |
|---|---|---|
| "news", "aaj ka kya hai", "aaj ki news" | Step 1 research | the news table + your pick of 2-3 Shorts (+ 🔴 BIG STORY flag if any) |
| "1 aur 3 bana", "pehla short de" | Step 2 scripts | `script_N.txt` + `sources_N.md` per Short, a 1-line visual plan per line |
| uploads TTS audio | Step 3 build | `index.html` + `bgm.m4a` + `assets/*` + `youtube.txt` |
| "is hafte ka long video", "weekly" | weekly plan from the week's stories + `log.md` | plan (deep dive / stories you missed / updates), then script, then 3 thumbnails, then video |
| "big story bana" | Big Story long video plan | plan, script, 3 thumbnails, video (4-6 min) |
| "thumbnail de" | `thumb.js` | 2-3 options + phone-size previews |
| "dheema din hai" | 3 evergreen ideas | (explainer, free AI tool, week so far) |

## Step 0: setup (one block, once per session)
```bash
if [ -f /home/user/hf-kit/news/look.js ]; then ln -sfn /home/user/hf-kit ~/nkit
elif [ ! -f ~/nkit/news/look.js ]; then rm -rf ~/nkit; git clone -q --depth 1 https://github.com/scarwill/hf-kit ~/nkit
  [ -f ~/nkit/news/look.js ] || { rm -rf ~/nkit; git clone -q --depth 1 -b claude/blissful-goldberg-xohyde https://github.com/scarwill/hf-kit ~/nkit; }; fi
export NODE_PATH=$(npm root -g); pip install -q scipy pocketsphinx pillow
cat ~/nkit/news/BRAND.md; tail -20 ~/nkit/news/log.md
```
- Network access must be **Full** (news sites, Hugging Face, GitHub). If pages fail to load, tell the user: session title ⌄ -> Edit cloud environment -> Network access -> Full.
- WebFetch cannot resolve many hosts here: read pages with `curl -sL -A "<browser UA>"` through the proxy, or `pageshot.js` for a rendered page. WebSearch refuses some domains in `allowed_domains` (theverge.com, reuters.com, arstechnica.com): search without them or use the feeds.
- Playwright + Chromium are preinstalled; never run `playwright install`.

## Step 1: research (today's news)
1. `python3 ~/nkit/news/scan.py --hours 36` (Monday: `--hours 72`). It prints feed headlines (AI, dev, security, cloud, general tech), Hugging Face trending models + spaces, Hacker News top, GitHub trending. These are LEADS, not facts.
2. Keep only the channel's niche (BRAND.md): AI ~60 %, coding / dev tools ~30 %, cloud / security ~10 %. Skip gadgets unless AI / dev, crypto prices, politics, unconfirmed leaks, tiny updates, and anything already in `log.md`.
3. Open the 6-10 best leads (curl + text extraction) and verify each one: a primary source (company post, release notes, repo, model card, paper, official account, filing) + one independent reputable report, or two reputable reports. Note the exact numbers / names / quotes, and the publish date (inside the window).
4. Score each story 0-2 on: big name · impact on developers / viewers · something to show (screenshot, repo, demo, photo, number) · freshness · wow. Total /10.
5. **Big Story (9+/10):** major model launch, outage or hack that hits developers, huge deal, a viral open-source release everyone is talking about. Flag it at the top: `🔴 BIG STORY: Short now + its own long video today / tomorrow`, with why. At most 1-2 per week. The user decides.
6. Reply with ONE table: #, story in one line, category, score, what we can show, source links. Then your pick: Short 1 / Short 2 (/ Short 3), and which stories go to the weekend video. Slow day: 3 evergreen ideas instead of weak stories. Upload time reminder (BRAND.md). **Stop.**

## Step 2: scripts (TTS-ready, one per Short)
- Shorts: 30-45 s = about 95-135 words. One story. Big Story long: 4-6 min. Weekly long: 6-8 min (deep dive ~3 min, stories you missed ~3 min, updates ~1 min).
- Structure: **hook in the first 2 s** (the claim or the villain, no "hey guys") -> the story as a story (who, what, when) -> 1-2 proofs (number, quote, screenshot line) -> **the "but"** (catch / twist / honest caveat) -> **what it means for developers / you** (one line) -> short ending line that can loop.
- Plain spoken English, short sentences, one idea per line, numbers written as spoken ("three hundred and sixty two"), no emoji / URLs / markdown. One sentence per line in `script_N.txt`.
- Light humour is fine; no swearing, no jokes about groups of people, no other creator's catchphrases ("It is [date] and you're watching...").
- Honesty: say "reportedly" for anything unconfirmed, give the caveat in the script (internal test vs real product, test coins worth $0, rumour vs announced).
- `sources_N.md`: every URL with its date, every fact / number / quote next to its source, then "script line -> source". Unverified = `[CHECK]` and tell the user.
- Add a 1-line visual plan per script line in chat. Send the files with SendUserFile. **Stop** until the audio comes.

## Step 3: video
### 3a Align (per audio)
- `mkdir ~/<yyyy-mm-dd>-<slug> && cd` there; copy the audio (uploads live in `/root/.claude/uploads/<id>/`, never edit them in place) and the script as `script.txt`.
- `python3 ~/nkit/video/align.py <audio> script.txt` -> `python3 ~/nkit/news/realign.py` -> fix every CHECK with `realign.py fix '{"k":[start,end]}'` -> `python3 ~/nkit/news/nverify.py` until `sync ok`.
- Word times: `python3 -c "import json;W=json.load(open('words.json'));print(' '.join(f'{w}@{t+0.2:.2f}' for t,w in W))"` (video time = audio + HEAD 0.2).

### 3b Assets (real things)
- Screenshots: `node ~/nkit/news/pageshot.js <url> assets/<name> "exact phrase" ... --crop y0:y1` -> full page, phrase boxes, crops. Highlight on a crop: `px = (x - 110) * 2, py = (y - y0) * 2, pw = w * 2, ph = h * 2`. Read each crop once (combine several into one check image) to see it is styled and readable.
- Photos: official newsroom / press kit / the article's credited handout image, Wikimedia free-licence images. Credit them ("Photo: Tesla"). Never: ripped video, movie / meme images, redrawn logos, fake UI. Unstyled / blocked / login page -> ask the user for a screenshot (exact URL, part to capture, file name, desktop browser, zoom 100 %, PNG).
- Resize big photos to <= 2400 px wide.

### 3c Build (kit `~/nkit/news/look.js`, read `~/nkit/examples/news-short-demo.js` (Shorts) or `news-long-demo.js` (long) once)
- `cat ~/nkit/news/RULES.md` before writing (and before every batch of a long video).
- `video.js`: `const VIDEO = { theme: 'blue', scenes: [{ type: 'custom', build: (s) => { sSetup(s); ...parts...; return () => { sBegin(['#s1', ...]); ...beats...; sFinish(); }; } }] };`
- Scenes: `nlScene(s, 'sN', '')` (no titles in this look). Shorts: 6-9 scenes of 3-8 s. Long: scenes of 6-15 s, build in batches of ~6 scenes.
- **Parts (look.js)**, all `(par, id, ...)`; text parts are checked for the safe zone:
  - `sPill(par,id,x,y,txt)` source/date pill · `sHead(par,id,x,y,w,html,fs)` headline (`<b>` blue) · `sTag(par,id,x,y,txt)` section tag · `sSub(par,id,x,y,w,txt)` grey line · `sChip(par,id,x,y,html)` chip (`<b>` blue) · `sCard(par,id,x,y,w,h)` white card · `sBig(par,id,x,y,html,c)` huge number
  - `sPhoto(par,id,x,y,w,h,src,credit,pos)` + `KB(id,t,d,{s,x,y},{s,x,y})` slow zoom/pan (always move photos)
  - `sShot(par,id,x,y,w,src,url,nw,nh,vh)` screenshot card (nw/nh = image pixels, vh = visible height) -> `el.hl(hid,px,py,pw,ph)` + `SHL(hid,t)` highlight sweep, `SZOOM(id,t,d,s0,s1,y0,y1)`
  - `sStamp(par,id,cx,y,txt,c,rot,fs)` + `STAMP(id,t)` slam stamp (red for problems)
  - `sCode(par,id,x,y,w,lines,head)` dark code card + `TYPEL(id,t,k,dt)` types line k (returns end time)
  - `sTable(par,id,x,y,w,[[label,value,colour],...])` + `TABLE(id,t,dt)` · `sQuote(par,id,x,y,w,html with <mk>word</mk>,who)` + `SMARK(id,t)` · `sCount(par,id,x,y,['0','46','362'],c,fs)` + `COUNT(id,t,step)` (show the first value early with `tl.set('#id',{autoAlpha:1},t); tl.set('#idn0',{autoAlpha:1},t)`)
  - `sSvg(par)` frame-size svg -> `sArrow(v,id,x1,y1,x2,y2,c,bend)`, `sCircle(v,id,cx,cy,rx,ry,c)` + `sDraw(id,t,d)` hand-drawn
  - custom drawings: `nlBox(par,id,x,y,w,h)` -> `[div, svg]`, then `S('path', {...}, svg)`; a plain `D(par, html, css, id)` part needs `position:absolute` in its css
- **Beats (engine)**: `NEXT('#sN','first words')`, `W('phrase')`, `IN / POP / FADE / OUT / PULSE / SHAKE / TO / DRAW`, `CUE(t, kind)`. Every beat on its words, never raw seconds.
- Build: `python3 ~/nkit/news/build.py video.js <audio>` (Shorts) or `... --long`. Fix every ERROR; check AMBIGUOUS.
- Check: `node ~/nkit/news/check.js index.html` -> 0 warnings, 0 JS errors. Read its sheets (Shorts: 3-4 sheets; long: per batch with `--from --to`, then once whole). Fix -> `node ~/nkit/news/sheet.js index.html at t1 t2 ... --name fix`. Moving things: `sheet.js index.html range a b .1 --name motion`.
- Look for: hook visible at 0.4 s, no empty first frames, nothing cut or overlapping, highlights on the right words, stamps inside the frame, arrows hitting their target, safe zone, end card.
- Music: `python3 ~/nkit/news/nmix.py index.html <audio> upbeat` (`dark` for hacks / outages, `cinematic` for huge launches).

### 3d Deliver
- Copy `index.html`, `bgm.m4a`, `assets/*` to `~/<slug>-hyperframes/` and send with SendUserFile (`display: 'attach'`).
- `youtube.txt`: 3 honest titles, description (2-3 lines + **Sources** with every URL), hashtags (`#shorts` for Shorts, #ai #technews #programming ...), tags.
- Hinglish message: length, scene list (what is shown), what is illustrative, render steps:
  `mkdir assets` · copy the voice as `assets\<audio name>` (the exact name in index.html) · `bgm.m4a` and every image into `assets\` · `dir assets` (watch for `.m4a.m4a`) · `npx hyperframes render --output <name>.mp4`.
- Upload time (BRAND.md: ~8 pm IST, one hour later after 1 Nov).
- Add a line to `~/nkit/news/log.md`; ask before pushing it.

## Weekly long video ("This Week in Tech", weekend)
- Plan from the week's scans + `log.md`: deep dive on the biggest story (~3 min: why it happened, what's next, a demo or the real page), "stories you missed" (4-5 that had no Short, ~3 min), updates on the week's Shorts (~1 min). 6-8 min.
- Thumbnails: `node ~/nkit/news/thumb.js spec.json thumb_A.png` with layout `big3` (badge THIS WEEK IN TECH, the strongest story big, prefer stories that had no Short). Give 2-3 options + the `_feed.png` previews. Big Story videos: layout `single`, badge BIG STORY.
- Build in batches of ~6 scenes; `build.py ... --long`.

## Context budget
- Only contact sheets (`out/sheet_NN.png`, `fix_`, `motion_`), never single frames. Combine screenshot / photo checks into one image.
- Keep research notes in `sources_N.md`, not in long chat messages.
- Never paste kit code into video.js; build.py rejects redefinitions.

## Pitfalls
- A part without `position:absolute` flows in the page and lands in the wrong place (the s* parts already have it).
- Template classes can clash: do not invent class names like `ln`, `ch`, `tx`, `bar`; use an `s`-prefixed name.
- Big Ken Burns zooms move the photo, not the frame: keep important parts of the photo away from the edges.
- `SHL` boxes come from pageshot phrase boxes: if the page layout changes, re-run pageshot instead of guessing.
- The local preview uses fallback fonts; the real render loads Inter / Inter Tight / JetBrains Mono, so leave text some room.
