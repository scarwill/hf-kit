---
name: "net-shorts"
description: "Make YouTube Shorts for the Netlight ML channel end to end: find Short-able DS / ML / AI topics (Shorts views on YouTube, trend momentum, the channel's own Shorts so nothing repeats, its latest long videos to cut Shorts from), write 35-50 s TTS-ready English Short scripts, then build vertical 1080x1920 Shorts with the LIGHT kit (lbuild.py --short) synced to the user's TTS audio, plus title / description / Related video. Use when the user says net-shorts / shorts skill, or asks for a Netlight Short, 'aaj ka short', 'is hafte ke shorts', 'shorts bana'."
---

# NET-SHORTS: Netlight ML Shorts (ideas -> scripts -> vertical video)

The user's channel is **Netlight ML** (DS / ML / AI explainers, US / UK audience). Long videos come from `net-trends` -> `net-script` -> `light`.
This skill does the **Shorts**: about 5 a week, 35-50 s each, the same neon LIGHT look in 1080x1920.
- Reply in Hinglish, short and clear. Scripts are in English. The user is not technical: never ask them to run anything or open a site.
- **THIS SKILL ONLY** for Shorts. Do not also follow `light`, `net-script`, `net-trends` or `news` (you use the light kit FILES, with the Short rules below).
- Ask before pushing anything to the repo or changing the kit.

## Never skip a stop
1. **Ideas** (5 Shorts) -> stop. The user picks / swaps.
2. **Scripts** (all picked Shorts at once) -> stop. The user approves and makes the TTS audio (one file per Short).
3. **Videos** only after the audio arrives.

| User says | You do | Stop with |
|---|---|---|
| "net-shorts khol, aaj ka kya hai", "is hafte ke shorts", "shorts ideas" | Step 1 | 5 ideas |
| "1 2 4 bana", "sab bana", "ye 5 bana" | Step 2 | `short_N/script.txt` + `sources.md` each |
| uploads TTS audio | Step 3 | `index.html` + `bgm.m4a` + `youtube.txt` per Short |
| "is long video se shorts" + its script | Step 2 for 2 Shorts from that script | scripts |

## Why it works this way
- **YouTube Help:** Shorts help new viewers find a channel and "can't hurt your Video performance". The Shorts feed favours recent uploads and judges a Short by whether people watch or swipe in the first seconds. A **Related video** link on a Short sends viewers to the long video.
- **Monetization safety:** YouTube demonetizes "inauthentic", mass-produced channels. Every Short has its own topic, its own opening and its own visuals made for it, and real, sourced information. Never reuse one layout with new words.
- **No repeats without a memory file:** the channel's own Shorts tab is read every run (`--channel`), so a concept that already has a Short is flagged `MADE`.
- **Netlight Shorts are concepts, not news.** Product launches belong to Merge Report (`news` skill).
- **Real proof on screen, like the news skill** (the user: "jaisi news skill short me screenshots deti hai har cheez ka net-short ne bhi waisa hi karna chahiye"): every claim the voice makes about a real thing (a paper, its numbers, a repo, a model card, a benchmark table, a doc) is shown as the REAL page, cropped to the line, highlighted on the words the voice says. Drawings explain the idea; screenshots prove it.

## Step 0: setup (one block)
```bash
if [ -f /home/user/hf-kit/shorts/sscout.py ]; then ln -sfn /home/user/hf-kit ~/skit
elif [ ! -f ~/skit/shorts/sscout.py ]; then rm -rf ~/skit; git clone -q --depth 1 https://github.com/scarwill/hf-kit ~/skit
  [ -f ~/skit/shorts/sscout.py ] || { rm -rf ~/skit; git clone -q --depth 1 -b claude/gallant-bohr-ypvs89 https://github.com/scarwill/hf-kit ~/skit; }; fi
export NODE_PATH=$(npm root -g); pip install -q scipy pocketsphinx pillow pytesseract
grep -v '^#' ~/skit/shorts/CHANNEL.txt
```
- If the clone fails, the chat was started without the `scarwill/hf-kit` repo: tell the user in one line to start the chat with that repo selected.
- `CHANNEL.txt` holds the channel handle (`@...`). If it is empty, ask the user once for the channel link, use it, and offer to save it there (ask before pushing).
- Playwright + Chromium are preinstalled; never run `playwright install`.

## Step 1: ideas (about 4 min)
Tell the user one line ("Shorts ke ideas nikal raha hoon, 3-4 min"). Then:
```bash
mkdir -p ~/shorts-out && python3 -I ~/skit/shorts/sscout.py --channel @HANDLE --out ~/shorts-out > ~/shorts-out/last.md 2> ~/shorts-out/last.log; tail -2 ~/shorts-out/last.log
```
(Bash timeout 600000.) Read `~/shorts-out/last.md`: ranked concepts (score = 35% momentum + 65% median views of the ML Shorts a search shows), details, the channel's latest long videos and existing Shorts, and the fresh HF / HN list. `python3 -I ~/skit/shorts/sscout.py --yt "query"` checks any other search.

Pick **5 different Shorts**, a mix:
- **2 from the latest long videos** (the "Latest long videos" list): one sharp idea from each, linked back as Related video. You need what the long video says: if its script is not in this chat, ask the user to paste it (or use the title and only claims you can verify).
- **2 trending concepts** from the ranking (high Shorts views, not `MADE`).
- **1 myth / one-number Short** ("AI does not read words", "a 7B model = 14 GB in fp16") built on a concept from the report.

Drop: `MADE`; `IN` 30%+; pure news; noise (a best Short that is clearly not about the concept, e.g. a hairstyle under CLIP); topics that need a screen recording. Shorts numbers are noisy between runs: use them to compare, never as exact promises.

Give the user, in Hinglish:

| # | Short | Hook (first 1-2 s) | Kyun | LIGHT visual (vertical) | Screenshots (proof) | Title | Related video |
|---|---|---|---|---|---|---|---|

- **Hook**: the first spoken line, 8 words at most, a question or a surprising claim, and the visual that is on screen at second 0.
- **Kyun**: the evidence ("ML Shorts on this get ~16k median views, 5 HF papers this week").
- **Title**: English, 50 characters at most, the searched words first, no clickbait.
- **Screenshots (proof)**: the real pages this Short will show (paper abstract line, repo header + stars, model card, benchmark table).
Then: "Konse banau? Number bolo." and stop.

## Step 2: scripts
For each picked Short write `~/shorts-<date>/short_N/script.txt` (only the spoken lines, one sentence per line) and `sources.md` (links for every fact).
- **Length: 85-120 words = 35-50 s** of TTS. Count the words.
- **Shape:** hook line (the claim or question) -> 3-5 beats, one concrete idea each, each one a thing that can be drawn -> payoff (the answer, in short punchy words) -> last line: "Full breakdown in the video linked below." when there is a Related video, else a line that loops back to the hook.
- **Spoken English for TTS:** sentences of 5-10 words, one idea each; no symbols, emoji, brackets or abbreviations the voice cannot read ("K V cache" if the TTS spells it badly, write numbers the way they are said); end with a full sentence (a very short last word can be cut by the TTS).
- **Facts:** verify every number, name and claim (paper, official docs, repo). Nothing you cannot source. Note what is illustrative.
- Under each script, one line per sentence: the visual planned for it. Every sentence that states a fact about a real paper / repo / model / number gets its **screenshot** (URL + the exact phrase to highlight); at least 2 screenshots per Short when the topic has real sources.
- Before showing the scripts, fetch every source page and try its screenshot (Step 3, point 2), so missing ones can be asked for in the same message.
Show the user all scripts with the word count, then stop: "Theek hai to har Short ka TTS alag file mein bana ke bhej do."

## Step 3: build (after the audio arrives)
For each Short, in its own folder. The light kit's full part list and checks are in `~/skit/light/SKILL.md` (sections "Kit", "Real sources" and "Workflow") and `~/skit/light/RULES.md`: read both once; where they say LONG only, the Short rules here win.
1. **Align:** copy the audio in, put the script in `script.txt`, `python3 ~/skit/video/align.py <audio> script.txt`, `python3 ~/skit/light/realign.py`, fix every CHECK, then `python3 ~/skit/light/lverify.py` until `sync ok`.
2. **video.js** with the light kit parts (`nlSetup`, `nlScene`, `cOrb`, `nlBegin`, `NEXT`, `W`, `nlFinish`, nl* visuals), laid out for the Short:
   - **Canvas 810 x 1440** (the kit scales it to 1080x1920, every size reads 1/3 bigger on a phone). Title band at the top (y 110-250, left side), orb in the top-right corner (automatic with `cOrb`).
   - **Safe area for parts: x 40-690, y 300-1110.** Below y 1125 the Shorts caption covers the frame, right of x 705 below y 675 the like / comment buttons do. lcheck `SAFE` catches it.
   - **Hook at second 0:** the first scene's main visual is on screen when the voice starts (there is no intro). Something new moves every 2-3 s; 3-6 scenes of 4-9 s.
   - One main visual per scene, at most 2 chips; text 1-4 words; lcheck `TEXT` limit is 70 characters.
   - When the voice talks about a text, show that exact text (typed / code / highlighted row), as in the light rules.
   - **Screenshots (real pages), same workflow as the light skill's "Real sources":** `node ~/skit/light/webshot.js <url> assets/<name>.png 1 1 480` (last number = browser width: 480-640 makes the page wrap into a narrow column, so the crop fits the vertical window with big text), Read it once (must be fully styled), crop with PIL to the part the voice talks about, BETWEEN lines, then `python3 ~/skit/light/lfind.py assets/<name>.png "phrase" ...` (OCR boxes; `EDGE:` = crop cut words -> crop again).
     - **Vertical crop:** the shot window is at most ~650 px wide on the canvas, so crop a narrow column: the title line, one abstract sentence, one table row, the repo header. Page text must stay 9 px+ on screen (lcheck SMALLSHOT); never squeeze a whole page in.
     - Show it with `nlShot` in a browser window (URL in the header = the credit), `nlShotHL(shot, 'hlN', 'the exact words', colour)` on the words as the voice says them, `nlCursor` + `CURSOR_TO` + `CLICK` for a click. Highlights and the cursor go BY PHRASE (OCR), never by pixel numbers.
     - Then `node ~/skit/light/lshotcheck.js index.html` and read every `out/pages_NN.png`: each box on exactly the spoken words, nothing cut by the window edge.
     - Blocked / unstyled page (`node ~/skit/light/netlog.js <url>` finds the host; github.com pages often fail in a cloud session that was not started with that repo): ask the user once, in the scripts message, with a numbered list: exact URL, the part to capture, the file name, desktop browser, zoom 100 %, PNG, dark mode if the site has it. Keep building with a placeholder card meanwhile. Uploads land in `/root/.claude/uploads/...`: copy them into `assets/`.
     - Numbers that change (stars, downloads) get "as of <date>". No recreated logos or fake site UI.
   - End card: set `NL_END_TXT = '> full video below';` at the top of video.js when there is a Related video (default `'> follow for more'`).
   - Different opening and main visual for every Short of the batch.
3. **Build + check:** `python3 ~/skit/light/lbuild.py video.js <audio> --short`, fix every ERROR; `node ~/skit/light/lcheck.js index.html --every 2` -> 0 warnings (SAFE, ORBCORNER, EMPTY, OUT ...), 0 JS errors; read its sheet(s) (one or two per Short); motion sheet for moving dots (`node ~/skit/light/lsheet.js index.html range a b .25 --name motion`).
4. **Proof check:** every factual sentence has its real screenshot on screen while it is spoken (or the user was asked for it).
5. **Audio:** `python3 ~/skit/light/lmix.py index.html <audio> upbeat` (or `lofi` for calm topics); a Short uses about 15-30 cues.
6. **youtube.txt:** title (50 chars max), 2-3 line description with the sources, 3 hashtags (#shorts plus two topic tags), and the Related video to set (title + link) if any.

## Step 4: deliver
- Copy each Short's `index.html` + `bgm.m4a` + `assets/*.png` (the screenshots) + `youtube.txt` to `~/shorts-<date>-hyperframes/short_N/` and send them with SendUserFile (`display: 'attach'`).
- Short Hinglish message: the list (title + main visual), what is illustrative, and the setup per Short (same as the light skill):
  `mkdir assets` · `copy "<path>" assets\<name>.m4a` · `copy "<path>\bgm.m4a" assets\bgm.m4a` · every screenshot png into `assets\` with the same name · `dir assets` · `npx hyperframes render --output short_N.mp4`
- Upload: a vertical video under 3 minutes is a Short automatically. In YouTube Studio set the **Related video**, and **schedule** one Short per day so they post while the laptop is off.
- Ask the user to report glitches with the Short number and the time.

## Context budget
Five Shorts in one chat: read only 1-2 contact sheets per Short, never single frames, and re-read `~/skit/light/RULES.md` before each Short.

## Known limits (say them only if they matter)
- YouTube data (Shorts views, the channel tabs) comes from public pages, not an official API: it can break if YouTube changes the page.
- A brand-new channel has few Shorts, so `MADE` only knows what is public on the channel.
