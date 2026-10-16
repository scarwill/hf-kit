---
name: "news"
description: "Make a daily tech news video for the user's YouTube channel with the NEWS kit: research today's tech news on the web (verified, with sources), write a TTS-ready script, then build a neon-tech HyperFrames video (no mascot, no header / footer / progress bar) with a story opener per story, real article / repo / post screenshots, headline and post cards, timelines, counters, music + sound cues, as one index.html + bgm.m4a (+ assets) synced to the user's audio. Builds in batches with contact sheets and kit guards. Use when the user says news / news skill, or asks for today's tech news video, a tech news episode, or a news script for their channel."
---

# NEWS: daily tech news video (research -> script -> HyperFrames video)

The user runs a daily tech news YouTube channel. Their own style, not a copy of any other channel.
- Reply in Hinglish, short and clear.
- Deliver ONE `index.html` + ONE `bgm.m4a` (music and sound cues mixed), plus any `assets/*.png` screenshots. Attach with SendUserFile (`display: 'attach'`). Paste code only if asked. Never zip.
- Runs in **Claude Code** (cloud session). Tools: Bash, Read/Write/Edit, WebSearch/WebFetch (load with ToolSearch first), SendUserFile, AskUserQuestion.
- **No preview MP4** unless the user asks. Check with ncheck + contact sheets.
- **Ask before doing anything beyond what was asked** (changing the kit, other skills, pushing). The user: "kuch bhi karne se pahele pucha kar".
- Channel name: ask once if you don't know it (it is typed in the intro; plain ASCII, at most 24 characters). Voice language: English unless the user says otherwise.

**THIS SKILL ONLY.** When this skill is used, do NOT also follow `light`, `netlightml`, `net-script`, `kurzgesagt-explainer-video` or any other video skill. Mixing looks broke videos before. LONG only (1920x1080). If the user wants a Short, say the kit is long-only for now and ask.

**No mascot. No header, footer, progress bar, ticker or "story 2/5" bar.** The story opener dial inside the scene shows which story it is. nbuild blocks the rest.

## The whole flow (four stops where the user acts)
1. **Research** -> you send a shortlist; the user picks stories (or says "tu hi chun").
2. **Script** -> you send `script.txt` + `sources.md`; the user makes the TTS audio and uploads it.
3. **Video** -> you build, check and send `index.html` + `bgm.m4a` (+ screenshots) + the YouTube text.
4. The user renders (`npx hyperframes render`) and reports glitches with the time.

## Step 1: Research (fresh, verified, with sources)
- **Window:** the last 24 hours by default (or since the last episode / "is hafte" if the user says so). Today's date is in your context; write it down and check every story's publish date against it.
- **Search wide, in parallel** (one turn, several WebSearch calls). Generic queries ("tech news today") return junk, so search by beat and by source:
  - beats: AI models and labs, big tech (Apple, Google, Microsoft, Meta, Amazon, Nvidia), chips, phones / gadgets, open source and dev tools, security / outages, startups and funding, policy / courts, space and science-tech;
  - sources: use `allowed_domains` with reputable outlets (e.g. theverge.com, techcrunch.com, arstechnica.com, reuters.com, apnews.com, bloomberg.com, wired.com, engadget.com, 9to5mac.com, 9to5google.com, tomshardware.com, bleepingcomputer.com) and primary sources (company blogs and newsrooms, GitHub releases, arXiv, official X / Bluesky accounts, filings);
  - use `mode: "extended"` for the last 24 h and for anything that looks thin or outdated.
- **Verify every story before it goes on the list:**
  - one primary source (the company's own post, release notes, repo, paper, filing, official account) + one independent reputable report, OR two independent reputable reports;
  - publish date inside the window; the exact numbers, names and quotes you will use, copied from the source;
  - rumours / leaks: skip, or keep only if the user wants them and the script says "reported by X";
  - WebFetch the pages you will use. If a host is blocked (`ENOTFOUND` / 403), say which host and how to allow it (see Real sources), and use another source meanwhile. Never fill a gap with a guess.
- **Shortlist (in chat):** 6-8 candidates as a short table: #, story in one line, why viewers care, primary source URL, date. Mark your top pick for the opening. Ask how many to use (default 4-5 stories = about 4-6 min).

## Step 2: Script (TTS-ready, original voice)
- Structure:
  - **Cold open** (5-8 s): the biggest story in one punchy line. No "welcome back to my channel" before it.
  - **Each story** (about 40-80 s): a signpost the voice says ("story two", "next up", "and finally") -> what happened (who, what, when) -> the one number / quote / feature that matters, exactly as in the source -> why it matters to the viewer -> the catch or what to watch, if any.
  - **Recap + sign-off** (8-12 s): the stories in one line each, then a short sign-off.
- Style: plain spoken English, short sentences, one idea per sentence, light humour only where it is honest. Your own phrasing and structure, not another creator's catchphrases or format.
- TTS-ready: numbers, versions, prices and dates written the way they should be spoken ("three point one three", "two hundred and twelve", "October seventh"); no emoji, no markdown, no URLs in the voice; one sentence per line in `script.txt`.
- `sources.md`: per story, the URLs, publish dates and every fact / number / quote the script uses next to its source line. Write unverified items as `[CHECK]` and tell the user.
- Length: what the stories need. The kit is tested up to about 10 min; above that, say it takes long to build and ask.
- Send `script.txt` + `sources.md` with SendUserFile and wait for the audio. If the user edits the script, use their version.

## Step 3: Video (kit `~/nkit/news/news.js`; read `~/nkit/examples/news-demo.js` once before writing video.js)

### Hard rules (full card: `~/nkit/news/RULES.md`)
- **SHOW, DON'T WRITE:** every scene has a moving visual; text is 1-4 word labels, at most 2-3 chips per scene; never caption the narration.
- **When the script talks ABOUT a text, show that exact text:** a headline (`nwHead` + `MARK`), a post or statement (`nwPost` + `POST`), a command, query or error (`nlType` + `TYPE` inside a window), code (`nlCode`), a short quote or number (`nlBig`).
- **Text size:** body text 30 px or more, labels 24 px or more, titles 60 px Space Grotesk.
- **Colour = meaning, fixed all video:** NEW / GOOD `NL.data` #34e0b0 · COMPANY / PRODUCT `NL.model` #6cc8ff · KEY NUMBER / FACT `NL.out` #ffcc4d · PROBLEM / RISK `NL.err` #ff6b81. Purple #b48cff appears ONLY as the `<b>word</b>` in a scene title.
- **Background:** #05070d + navy glow. No mascot, grid, vignette, particles, captions, header, footer, progress bar or ticker (the kit already does this).
- **Intro "Signal"** (HEAD 2.6 s: emblem, typed channel name, date, story count) and **Outro "Sign-off"** (TAIL 3.6 s) come from the kit; never change their text.
- **Stories:** story k of n starts with `nwStory(...)` + `STORY(id, t)` in its first scene, on the signpost words. Numbered 1..n in order.
- **Hook:** the strongest visual is on screen within 5 s of the voice starting. No frame is more than ~75 % empty.
- **Sync:** every beat fires on its words via `W('unique phrase')`; something new moves every 3-4 s.
- **Wires and containers:** wires start at the centre of the source edge, end on the target edge, and get an arrowhead `arw` for flow; anything inside a frame fits fully inside it; after moving a part, re-check everything connected to it.
- **Motion looks physical:** a ball, packet, marker or dot never sits frozen; it moves continuously and lands on its word.
- **Audio:** music (mood from the episode, `upbeat` by default) + sound cues in every video.
- **Facts:** only what is in `sources.md`. Numbers that change get a date ("as of Oct 2026"). Say in the delivery message what is illustrative.
- **Copyright:** show real pages as screenshots with commentary and the URL in the window header. Never download or embed someone else's video, audio or photo as a clip, never redraw a logo or a site's UI. Companies = `nwCo` badges or their real page.
- If the attached "script" or audio does not match the script you wrote, say so and ask.

### Visuals come from the story (different every video)
- List each story's concrete things per scene: objects, actions, numbers, comparisons, texts. **Draw those things** with `nlBox` + SVG (a satellite, a phone, a chip, a data centre rack, a court gavel, a car...).
- Pick the main visual by what the words describe:

  | Story talks about | Visual |
  |---|---|
  | a launch / announcement | story opener + the real announcement page (`nlShot`) or `nwHead` |
  | a real object / device / place | custom drawing (nlBox + SVG) that moves |
  | a post / statement / quote | the real post (`nlShot`) or `nwPost` word by word |
  | A vs B, old vs new, specs | `nwSpec` table, or split screen with red X vs green check |
  | money, users, scale, benchmark | `nlCount` big counter, `nlBars` (say who measured it), `nlCurve` |
  | history, versions, "since 2019" | `nwTime` timeline with the marker |
  | companies dealing (buys, sues, partners) | `nwCo` badges + a wire / packet between them |
  | data moving, a pipeline, an outage | boxes + wires + packets; red X where it breaks |
  | steps in order | numbered flow with a dot running through it |
  | a list of features / countries / models | tags popping on their words |
  | code, command, setting, error text | the text itself, typed / highlighted |
  | an AI model's insides | `nlNet`, `nlAttn`, `nlEmbed`, `nlTokens` |

- **Variety:** two scenes in a row never use the same main visual type; window + rows + chips is the main visual of at most 1 scene in 3; at least 2-3 custom drawings per video.

### Real sources: articles, posts, GitHub, papers
When the script names a real page, show the **real thing** ("aisa lagna chahiye ki maine effort lagaya ho").
1. **Screenshot:** `node ~/nkit/news/webshot.js <url> assets/<name>.png 1`.
   - Read the PNG once. It is usable only if the page is fully styled, with no cookie wall or paywall over the part you need.
   - Unstyled (blue links, "Skip to content") means a blocked host: find it with `node ~/nkit/news/netlog.js <url>`.
   - Already allowed: `github.githubassets.com`, `*.githubusercontent.com`, `arxiv.org`, `*.wikipedia.org`, `upload.wikimedia.org`.
   - For another host, tell the user once, listing the hosts: session title caret ⌄ -> **Edit cloud environment** -> **Network access** -> a broader access level, or add the hosts under **Allowed domains** (keep the package managers box ticked) -> **Save changes**. Docs: https://code.claude.com/docs/en/cloud-environments#network-access
2. **No good screenshot** (blocked, login wall like X, paywall): ask the user once, right after the plan, with one numbered list ("tu khud hoke ss na le sake to mujhse manga kar"). For each: the exact URL, the part to capture, the file name; desktop browser maximised, zoom 100 %, PNG, no bookmarks / personal info, dark mode if the site has it. Keep building with `nwHead` / `nwPost` in its place. Uploads land in `/root/.claude/uploads/...`; copy them into `assets/`.
3. **Show it with effort:** `nlShot` in a browser window (the URL in the header = the credit), `nlCursor` + `CURSOR` + `CLICK`, `SHOT_FOCUS` on the words that mention it, plus `nlShotHL`. Article: headline, then the one paragraph / number the voice uses. Repo: header + stars, README, then the exact lines. Post: the post itself.
4. `nlShot` needs the real size: `python3 -c "from PIL import Image; print(Image.open('assets/x.png').size)"`. Images ship in `assets/` and are listed in the delivery setup.

### Kit (`~/nkit/news/news.js`)
- **Scene flow:**
  - **build:** `nwSetup(s, { channel: '<name>', date: '16 Oct 2026' });` first, then `nlScene(s, 'sN', 'Plain words <b>key</b>')` per idea (about 6-15 s each). No mascot call anywhere.
  - **beats:** `nwBegin(['#s1', ...]);` first, then `NEXT('#sN', 'first words of sN')` per scene, and `nwFinish();` last.
- **News parts:**
  - `nwStory(par,id,x,y,k,n,tag,source,date)` (520 x 520 box) + `STORY(id,t)`: story opener dial, big number, tag, source + date.
  - `nwHead(par,id,x,y,w,source,date,headline,c)` + `MARK(id,t)`: the real headline; `<b>1-4 words</b>` get a marker sweep. Max 140 characters.
  - `nwPost(par,id,x,y,w,name,handle,date,text,c)` + `POST(id,t,dt)` (returns the end time): a real post / statement, word by word. `CUE(t,'type',nWords,dt)`.
  - `nwSpec(par,id,x,y,w,cols,rows,head)` + `SPEC(id,t,dt)`: `cols = ['', 'A', 'B']`, `rows = [['label','a','b', winnerCol], ...]`.
  - `nwTime(par,id,x,y,w,[[date,event],...])` + `TIMELINE(id,t,dt)` or `TIME_GO(id,t,k,d)`: 2-6 events, travelling marker.
  - `nwCo(par,id,cx,y,name,c,sz)`: company badge (initials). Show with `POP`.
  - `nwRecap(par,id,x,y,w,items,head)` + `RECAP(id,t,dt)`: the last scene, stories ticked off.
- **Basic parts:**
  - `nlWin(par,id,x,y,w,h,c,head)` makes a glow window.
  - `nlChip(par,id,x,y,txt,c,ico,fs)`, `nlLab(par,id,x,y,txt,c,center)`, `nlTag(par,id,cx,y,txt,c,fs)` (pill centred on cx).
  - `nlMark(par,id,x,y,c,ok)`, `nlUser`, `nlBig(par,id,y,txt,c,fs)`, `nlText`.
  - `nlRow(win,id,left,right,c)` + `nlRowHL(rowEl,id,c)` for a highlight frame inside a row.
  - `nlSvg(par)` + `nlWire(v,id,d,c,dash,w)` (returns the group; pass it to `arw(g,x,y,c,'r'|'l'|'u'|'d')`), revealed by `nlDraw(id,t)`.
  - `nlDocs(par,id,x,y,cols,rows,w,h,gap,c)` (show: `nlShow('#id',t)` + `FADE('.idd',t,{st:.01})`); put it inside a window so the scene is not counted as empty.
  - `nlBox(par,id,x,y,w,h)` returns `[div, svg]` for custom drawings.
- **Hero (optional):** `nlHero(id,x,y,w,html,c,head)`. `HERO(id,t,x,y,scale)` glides it. Show it first with `IN` at its base position; re-show with `FADE`, hide with `OUT`.
- **Caret:** `nlType(par,id,x,y,txt,fs,col)` + `TYPE(id,t,dt)` (returns the end time), `CARET(id,t,n)`. Only inside a window. Plain ASCII.
- **Numbers and data:** `nlCount(par,id,x,y,['0','8B','52B'],c,fs)` + `COUNT(id,t,step)`; `nlBars(par,id,x,y,w,[[label,p],...],head)` + `BARS(id,t)`; `nlCurve(par,id,x,y,w,h,{pts,xl,yl,c,head})` + `CURVE(id,t,d)`.
- **AI insides (when a story needs them):** `nlNet` + `NET_FWD`, `nlAttn` + `ATTN`, `nlEmbed`, `nlTokens`, `nlVec`, `nlMatmul` + `MATMUL`, `nlLoop` + `LOOP_RUN`, `nlBowl` + `GD`, `nlBound` + `BOUND`, `nlConf`, `nlEq`, `nlCode` + `CODE`.
- **Real pages:** `nlShot(par,id,x,y,w,h,src,url,nw,nh)`, `SHOT_FOCUS(id,t,px,py,s,d)`, `nlShotHL(id,hid,px,py,w,h,c)`, `nlCursor(par,id,x,y)` (show it with `nlShow`), `CURSOR(id,t,x,y,d)`, `CLICK(id,t)`. Highlights and the cursor ring are hidden at 0 automatically.
- **Engine beats:** `go`, `W`, `B`, `IN`, `POP`, `FADE`, `OUT`, `PULSE`, `SHAKE`, `DRAW`, `TO`, `tl`, `findp(phrase, fromTime)`.
- **Sound cues:** put `CUE(t, kind)` next to its beat.
  - `hit` on every story opener and the 2-4 biggest reveals, `chime` when something is confirmed, `err` on every X / failure, `tick` on list items and rows, `pop` when an object appears, `blip` on small digital events.
  - `type` for every typed text: `CUE(start, 'type', nChars, dt)`. NEXT adds the whoosh; the intro and outro cues are in the kit.
  - About 80-110 cues for a 5-min video.

### Workflow
0. **Setup** (one block):
   ```bash
   if [ -f /home/user/hf-kit/news/news.js ]; then ln -sfn /home/user/hf-kit ~/nkit
   elif [ ! -f ~/nkit/news/news.js ]; then rm -rf ~/nkit; git clone -q --depth 1 https://github.com/scarwill/hf-kit ~/nkit
     [ -f ~/nkit/news/news.js ] || { rm -rf ~/nkit; git clone -q --depth 1 -b claude/blissful-goldberg-xohyde https://github.com/scarwill/hf-kit ~/nkit; }; fi
   export NODE_PATH=$(npm root -g); pip install -q scipy pocketsphinx pillow
   ```
   - If `news/` is still missing, tell the user the kit is not pushed; never rewrite the kit by hand.
   - Playwright + Chromium are preinstalled; never run `playwright install`.
1. **Align:**
   - `mkdir ~/<yyyy-mm-dd>-news && cd` there, copy the audio (uploads are in `/root/.claude/uploads/<id>/`; never edit them in place), and put the script lines in `script.txt`.
   - If the user has word timestamps / an SRT from their TTS, convert them to `words.json` (`[[sec, "word"], ...]`, lowercase, no punctuation) + `meta.json` and skip align.py.
   - Otherwise run `python3 ~/nkit/video/align.py <audio> script.txt`, then `python3 ~/nkit/news/realign.py`.
   - **Every `CHECK` is must-fix** (a bad boundary drifts every later beat). Map each sentence to its speech run between silences and run `realign.py fix '{"76":[282.73,283.74]}'`. For a list sentence give one `[start,end]` per comma part: `'{"79":[[286.38,288.95],[289.57,290.55]]}'`.
   - Then `python3 ~/nkit/news/nverify.py` (pocketsphinx against the real audio). Repeat until it says `sync ok`.
2. **Plan** (short table, in chat):
   - Columns: scene, time range, story, title, main visual (type from the menu + what exactly is drawn), exact text shown, real source (URL), cues.
   - Scenes are about 6-15 s each. Group them into **batches of about 6 scenes** (about 60-90 s of audio) and number the batches.
   - Pick the music mood (default `upbeat`) and say why in one line.
   - Right after the plan, try every screenshot and send ONE message listing the screenshots you still need.
3. **Build in batches.** For each batch, in order:
   1. `cat ~/nkit/news/RULES.md` (every batch, even if you think you remember it).
   2. Add the batch's scenes to `video.js` (build parts + beats). The video stays buildable after every batch.
   3. `python3 ~/nkit/news/nbuild.py video.js <audio>`. Fix every ERROR (NOTFOUND / OUTSIDE / SCENE / BANNED / OVERLAY / REDEFINE). Check AMBIGUOUS lines: if you meant the later occurrence, use a longer phrase.
   4. `node ~/nkit/news/ncheck.js index.html --from <batch start> --to <batch end>`. Fix every warning and every `JS` line (EMPTY / TEXT / SMALL / OUT / OVERFLOW / OVERLAP / NOVISUAL / GAP / NEWS guards).
   5. Read its 1-2 `out/sheet_NN.png`. Check: story opener on its signpost, wires on the right parts with arrowheads, nothing cut by a frame or the edge, no empty frame, the exact text shown where the voice talks about text, source + date visible for each story.
   6. For every moving thing (marker, packet, dot, cursor), take one motion sheet: `node ~/nkit/news/nsheet.js index.html range <a> <b> .25 --name motion`. It must move in every frame and land on its word.
   7. Fix, then re-check only the fixed moments: `node ~/nkit/news/nsheet.js index.html at <t1> <t2> ... --name fix`.
4. **Final check (whole video):** `nbuild` clean, then `node ~/nkit/news/ncheck.js index.html` -> 0 warnings, 0 JS errors. Read every `out/sheet_NN.png` once. Check the hook in the first 5 s and the intro/outro frames (channel name and date right).
5. **Audio:** `python3 ~/nkit/news/nmix.py index.html <audio> <mood>` (uses `cues.json` from ncheck) -> `bgm.m4a` + cue onset check.

   | mood | use for |
   |---|---|
   | `upbeat` | the default: launches, roundups, fast news days |
   | `dark` | security breaches, hacks, outages, lawsuits |
   | `cinematic` | huge stakes, "the race to build X", big deals |
   | `lofi` | calm, slow news day, tutorials inside the news |
   | `calm` | sad / reflective news (layoffs, a death in tech) |

   - If the user dislikes it, switch mood; don't just change the volume. Louder / softer music: `--music -11` (dB under the voice; default -13).
6. **Deliver:**
   - Copy `index.html` + `bgm.m4a` (+ `assets/*.png`) to `~/<yyyy-mm-dd>-news-hyperframes/` and send them with SendUserFile.
   - Short Hinglish message: length + synced, the scene list (story, title, main visual), what is illustrative / placeholder, and the setup:
     - `mkdir assets`
     - `copy "<path>" assets\<name>.m4a`
     - `copy "<path>\bgm.m4a" assets\bgm.m4a`
     - every screenshot png into `assets\` with the same name
     - `dir assets` (watch for `.m4a.m4a` / `.png.png`)
     - `npx hyperframes render --output <name>.mp4`
   - **YouTube text** (in the same message or as `youtube.txt`): 3 title options (no clickbait that the video does not deliver), a description with one line per story, chapters (`0:00 Intro`, then each story's first scene start from nbuild's scene table, which is already in video time), and a **Sources** list with every URL from `sources.md`; 10-15 tags.
   - Ask the user to play it once and report glitches with the time.
   - If a new visual would help later episodes, ASK before adding it to `news.js`.

## Context budget (do not skip)
- Never Read single frames (`shot_*.png`, `nl_test` grabs). Only sheets: `out/sheet_NN.png`, `out/motion_NN.png`, `out/fix_NN.png`.
- Rough total for a 5-min video: about 5 sheets per batch x 4-5 batches + 5 final sheets + source screenshots = 25-35 images. Never hundreds.
- Research: keep the notes in `sources.md`, not in long chat messages.
- Don't paste large kit files into chat. Read `news-demo.js` once; for a specific part, grep `news.js` for its line.
- Never paste house helpers or kit code into video.js; nbuild rejects it.

## Pitfalls
- Load order is fixed by nbuild: premium.js, life.js, news.js, video.js, kit.js. Don't define `D`, `NL`, `HERO`, `TYPE`, `W`, `CUE`, `NEXT`, `STORY`, `MARK`, `POST`, `SPEC`, `TIMELINE`, `RECAP` in video.js.
- Never use `stage`, `document.body` or `nlInit.top` in video.js (OVERLAY error): those are header / footer / progress bar territory.
- GSAP transforms override CSS `transform`. Position with left/top. Centred things use `nlTag` / `nlLab(...,true)` / `nwCo`, never `translate(-50%)`.
- `fromTo` needs autoAlpha in both from and to. No colour tweens, no onUpdate, finite repeats only. Comments on their own line. No emoji.
- `POP` hides its target from frame 0 and overshoots its scale: use `FADE` for highlight frames inside rows/windows.
- A child of a window shows with the window. To reveal it later, give it an id and FADE/POP it.
- **Never `PULSE` the hero** (a scaled hero jumps). **Never `IN` the hero after a `HERO` move** (IN resets x/y); use `FADE`. **Never `PULSE` a row inside a window.**
- A part whose container has no size (an `nlDocs` group) counts as tiny for coverage: put it in a window or show a sized sibling early.
- To fill a scene's first seconds, show the coming windows at `IN(..., { to: .3 })`, then `TO(..., { autoAlpha: 1 })` on the word.
- Typed text (`nlType`) is mono and plain ASCII, so the caret lands right after the last char.
- The local preview uses fallback fonts; the real render loads Space Grotesk, Inter and JetBrains Mono.
- The local shim only seeks forward cleanly. nsheet / ncheck sort their times; for your own grabs, seek in increasing order.
