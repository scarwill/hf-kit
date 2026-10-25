---
name: "light"
description: "Build a Netlight ML neon-tech explainer video with the LIGHT kit (fixed version of netlightml for long videos): glowing UI windows, Model Orb in the corner, visuals drawn from the script's own objects, real papers / GitHub / web pages in a browser window, the video's own custom music + sound cues (never the old fixed moods), as one HyperFrames index.html + bgm.m4a (+ assets) synced to the user's script + audio. Builds in batches of scenes, checks with contact sheets and kit guards so 2-10 min videos stay correct. Use when the user says light / light skill, or asks for a Netlight / neon-tech DSML video and wants the light skill."
---

# LIGHT: Netlight ML neon-tech HyperFrames video (long-video safe)

The user's channel is **Netlight ML** (`netlight.ml`): data science, ML and AI explainers.
- Reply in Hinglish, short and clear.
- Deliver ONE `index.html` + ONE `bgm.m4a` (the video's own music and sound cues mixed) + `preview_mix.m4a`, plus any `assets/*.png` screenshots. Attach with SendUserFile (`display: 'attach'`). Paste code only if asked. Never zip.
- Runs in **Claude Code** (cloud session). Tools: Bash, Read/Write/Edit, WebSearch/WebFetch (load with ToolSearch first), SendUserFile, AskUserQuestion.
- **No preview MP4** unless the user asks. Check with lcheck + contact sheets.
- **Ask before doing anything beyond what was asked** (changing the kit, other skills, pushing). The user: "kuch bhi karne se pahele pucha kar".

**THIS SKILL ONLY.** When this skill is used, do NOT also follow `netlightml`, `kurzgesagt-explainer-video`, `hyperframes-explainer-video` or `finance-explainer-video`. Mixing looks broke a video before. LONG only (1920x1080). If the user wants a Short, say the kit is long-only for now and ask.

## Why this skill works the way it does
Netlight videos broke on long scripts for three reasons, and this skill removes all three. Keep it that way:
1. **The rules live in the kit, not in your memory.** The orb corner and its life (blinks, camera looks), no grid, sound cues and scene checks are built into `light.js`. `lbuild.py` refuses banned helpers, and `lcheck.js` reports `LIGHT:` guard errors. Never paste helpers into video.js and never work around a guard.
2. **Phrase errors block the build.** `lbuild.py` checks every `go` / `NEXT` / `W` phrase scene by scene against words.json. NOTFOUND, OUTSIDE and SCENE are errors. Fix them; never ignore them or `--force` a delivery.
3. **Context budget.** Every image you Read stays in context. Too many single screenshots fill it, and then rules get forgotten halfway through the video. So:
   - look ONLY at contact sheets (16 frames per image);
   - build in batches of about 6 scenes;
   - re-read `RULES.md` before every batch.

## Hard rules (full card: `~/lkit/light/RULES.md`)
- **SHOW, DON'T WRITE** (the user: "audience sirf text dekh ke bor ho jayegi"):
  - Every scene has a moving technical visual.
  - Text is 1-4 word labels, at most 2-3 chips per scene.
  - Never caption the narration.
- **When the script talks ABOUT a text, show that exact text** ("text ka kuch aaye to usme text dikhaya kar"):
  - This covers a prompt, chat message, command, search query, error, log line, string in a file, quote, headline, tweet, file/function/variable name, formula, URL, password example, or a word being tokenized or translated.
  - Type it in its window on the words that say it (`nlType` + `TYPE`), use `nlCode` for code, a highlighted row (`nlRow` + `nlRowHL`), or `nlBig` for a short quote or number.
  - Longer text goes in a window and gets highlighted part by part as the voice reaches it.
- **Text size:** body text 30 px or more, labels 24 px or more, titles 60 px Space Grotesk.
- **Colour = meaning, fixed all video:** DATA `NL.data` #34e0b0 · MODEL `NL.model` #6cc8ff · OUTPUT `NL.out` #ffcc4d · ERROR `NL.err` #ff6b81. Purple #b48cff appears ONLY as the `<b>word</b>` in a scene title.
- **Background:** #05070d + navy glow. No grid, vignette, particles, captions, header, footer or progress bar (the kit already does this).
- **Model Orb:**
  - `cOrb(scene, id)` in every scene except the last; it always sits in the same bottom-right corner ("beech beech me aayega dimag khayega").
  - It is alive on its own: the kit (`nlOrbLife`, called by `nlFinish`) makes it blink every ~3 s and look into the camera (`ORB_CAM`) once or twice per scene, eyes resting up-left in between ("kabhi camere ki taraf bhi dekhna chahiye, blink zyada"). Don't add your own blink loops.
  - Beats allowed on top: `ORB_ON`, `ORB_BLINK`, `ORB_THINK`, `ORB_WOW`, `ORB_BOUNCE`, `ORB_CAM`. Never `ORB_LOOK`.
  - "The model / the agent" as an object in the middle = `nlWin` + `nlNet`.
- **Intro A "Boot"** (HEAD 2.6 s) and **Outro A** (TAIL 3.6 s) come from the kit; never change their text.
- **Hook:** the strongest visual is on screen within 5 s of the voice starting. No frame is more than ~75 % empty.
- **Hero:** ONE `nlHero` = the story's main object, gliding between scenes with `HERO(...)`.
- **Sync:** every beat fires on its words via `W('unique phrase')`; something new moves every 3-4 s.
- **Wires and containers:**
  - Wires start at the centre of the source edge, end on the target edge, and get an arrowhead `arw` for flow.
  - Anything inside a frame fits fully inside it.
  - After moving or resizing a part, re-check everything connected to it.
- **Motion looks physical:** a ball, packet or dot never sits frozen; it moves continuously and lands on its word. A hit shows the hit.
- **Audio:** the video's own music + sound cues in every video (`music/README.md`), never the lmix.py moods.
- **Facts and code:**
  - Only real numbers and real, short, correct code. Verify numbers in Python.
  - Say in the delivery message what is illustrative.
  - Anything unverified (a link, a setup command) stays an obvious placeholder, and you tell the user.
- If the attached "script" is not a script, say so and ask for the right file.

## Visuals come from the script (different every video)
The user: "har cheez ke liye same hi cheez use karta hai; alag script ke liye alag cheeze".
- Read the script and list its concrete things per scene: objects, actions, numbers, comparisons, texts. **Draw those things** with `nlBox` + SVG (a brick-breaker game = bricks, ball, paddle; "the phone sends a request" = phone, server rack, packet).
- Pick the main visual by what the words describe:

  | Script talks about | Visual |
  |---|---|
  | a real object / device / game / place | custom drawing (nlBox + SVG) that moves |
  | data moving between parts, a pipeline | boxes + wires + packets travelling on them |
  | steps in order, a process | numbered flow / loop with a dot running through it |
  | before vs after, A vs B, wrong vs right | split screen, red X vs green check |
  | a number, growth, scale | big counter (`nlCount`), bars, a curve |
  | a list of kinds / targets / features | ring or grid of tags popping on their words |
  | time, history, versions | timeline with a moving marker |
  | probability, choice, ranking | bars (`nlBars`), ranking rows |
  | location, space, coverage | grid / map with cells lighting up |
  | how a model works | net, attention, embedding, matmul, loss curve |
  | a specific text, code, command, formula | the text itself, typed / highlighted |

- **Variety:**
  - Two scenes in a row never use the same main visual type.
  - Window + rows + chips is the main visual of at most 1 scene in 3.
  - At least 2-3 custom drawings per video.

## Real sources: papers, GitHub, websites, posts
When the script names a real paper, repo, site, post or doc, show the **real thing** ("aisa lagna chahiye ki maine effort lagaya ho").
1. **Find and verify:** WebSearch + WebFetch. For GitHub use `git clone --depth 1` or `raw.githubusercontent.com`. Note the exact title, authors, year, repo name and the exact lines the narration uses. Never invent.
2. **Screenshot:** `node ~/lkit/light/webshot.js <url> assets/<name>.png 1`.
   - Read the PNG once. It is usable only if the page is fully styled.
   - Unstyled (blue links, "Skip to content") means a blocked host: find it with `node ~/lkit/light/netlog.js <url>`.
   - Already allowed: `github.githubassets.com`, `*.githubusercontent.com`, `arxiv.org`, `*.wikipedia.org`, `upload.wikimedia.org`.
   - For another host, tell the user: session title caret ⌄ → **Edit cloud environment** → **Network access: Custom** → add the host under **Allowed domains** → keep **Also include default list of common package managers** ticked → **Save changes**.
   - **Crop it to the part the voice talks about** (a 2560 px page squeezed into an 800 px window is unreadable: lcheck SMALLSHOT). Crop BETWEEN rows/columns, never through text.
   - **OCR it:** `python3 ~/lkit/light/lfind.py assets/<name>.png "phrase" ...` writes `assets/<name>.boxes.json` and prints where each phrase is. `EDGE:` lines = the crop cut through words -> crop again. Run it again after every re-crop.
3. **No good screenshot:** ask the user once, right after the plan, with one numbered list ("tu khud hoke ss na le sake to mujhse manga kar"). For each screenshot give:
   - the exact URL, the part to capture, and the file name;
   - how to take it: desktop browser maximised, zoom 100 %, PNG, no bookmarks / personal info, dark mode if the site has it. A PDF is fine for a paper (`pdftoppm -png -r 200`).
   - Keep building with a Netlight-style card placeholder. Uploads land in `/root/.claude/uploads/...`; copy them into `assets/`.
4. **Show it with effort** - every highlight and cursor target is a PHRASE from the page, never pixel numbers you worked out (that is how boxes landed on the wrong row, on empty space, and the cursor missed the date):
   - `nlShot` in a browser window (the URL in the header = the credit);
   - `nlShotHL(shot, 'hlN', 'the words', colour)` on the words the voice says. A table row: `'E2D2..64'` (from the first cell to the last on that row). Phrase twice on the page: `{ n: 2 }`. OCR misread it ("ncm" -> "nem" on dark pages): the error shows what OCR read; pass `{ fuzzy: true }` only if that is the same text.
   - `nlCursor` + `CURSOR_TO(cur, shot, 'the words', t, d)` + `CLICK`. It knows the zoom/scroll at that moment; never `CURSOR(...)` with hand-computed pixels on a screenshot.
   - Prefer a good crop over zooming. If you zoom (`SHOT_FOCUS(shot, t, ...nlShotXY(shot, 'words'), s)`), lcheck CUTTEXT must stay clean: no word may be cut by the window edge.
   - Paper: title, then the one sentence / figure the voice uses. Repo: header + stars, README, then the exact code lines.
   - Numbers that change get a date ("as of Oct 2026") or are left out. No recreated site logos or fake site UI.
5. Images ship in `assets/` and are listed in the delivery setup. `nlShot` needs the real size: `python3 -c "from PIL import Image; print(Image.open('assets/x.png').size)"`.

## Kit (`~/lkit/light/light.js`), read `~/lkit/examples/light-demo.js` once before writing video.js
- **Scene flow:**
  - **build:** `nlSetup(s);` first, then `nlScene(s, 'sN', 'Plain words <b>key</b>')` per idea (about 6-15 s each), each with `cOrb(sN, 'oN')` except the last.
  - **beats:** `nlBegin(['#s1', ...]);` first, then `NEXT('#sN', 'first words of sN')` per scene, and `nlFinish();` last.
- **Basic parts:**
  - `nlWin(par,id,x,y,w,h,c,head)` makes a glow window.
  - `nlChip(par,id,x,y,txt,c,ico,fs)`, `nlLab(par,id,x,y,txt,c,center)`, `nlTag(par,id,cx,y,txt,c,fs)` (pill centred on cx).
  - `nlMark(par,id,x,y,c,ok)`, `nlUser`, `nlBig(par,id,y,txt,c,fs)`, `nlText`.
  - `nlRow(win,id,left,right,c)` + `nlRowHL(rowEl,id,c)` for a highlight frame inside a row.
  - `nlSvg(par)` + `nlWire(v,id,d,c,dash,w)` (returns the group; pass it to `arw(g,x,y,c,'r'|'l'|'u'|'d')`), revealed by `nlDraw(id,t)`.
  - `nlDocs(par,id,x,y,cols,rows,w,h,gap,c)` (show: `nlShow('#id',t)` + `FADE('.idd',t,{st:.01})`).
  - `nlBox(par,id,x,y,w,h)` returns `[div, svg]` for custom drawings.
- **Hero:** `nlHero(id,x,y,w,html,c,head)`. `HERO(id,t,x,y,scale)` glides it. Show it first with `IN` at its base position; re-show with `FADE`, hide with `OUT`.
- **Orb:** `cOrb(sc,id)`; beats `ORB_ON`, `ORB_BLINK`, `ORB_THINK(id,t,d)`, `ORB_WOW`, `ORB_BOUNCE`.
- **Caret:** `nlType(par,id,x,y,txt,fs,col)` + `TYPE(id,t,dt)` (returns the end time), `CARET(id,t,n)`. Only inside a window or for a typed math line. Plain ASCII.
- **ML visuals (part, then its beat):**
  - training loop: `nlLoop(par,id,cx,cy,R,epochs)` + `LOOP_RUN(id,t,laps,lap)`
  - neural net: `nlNet(par,id,x,y,w,h,[4,6,6,4])` + `NET_FWD(id,t,d)`
  - loss curve: `nlCurve(par,id,x,y,w,h,{pts,xl,yl,c,head})` + `CURVE(id,t,d)`
  - gradient descent: `nlBowl(par,id,x,y,w,h)` + `GD(id,t,steps)`
  - embedding space: `nlEmbed(par,id,x,y,w,h,head)`; `.pt(pid,fx,fy,c,label)` then `POP(['#pid','#pidL'],t)`; `.link(wid,a,b,c)` + `nlDraw`; `.ring(rid,fx,fy,rx,ry,c)`
  - attention: `nlAttn(par,id,x,y,tokens,matrix)` + `ATTN(id,t)`, `ATTN_ROW(id,t,r)`
  - decision boundary: `nlBound(par,id,x,y,w,h)` + `BOUND(id,t)`
  - confusion matrix: `nlConf(par,id,x,y,[[TP,FN],[FP,TN]],cs,labels)` + `POP('.idc',t,{st:.15})`
  - matrix x vector: `nlMatmul(par,id,x,y,A,v)` + `MATMUL(id,t,dt)`
  - code: `nlCode(par,id,x,y,w,lines,file,fs)` + `CODE(id,t,dt)`
  - probabilities: `nlBars(par,id,x,y,w,[[label,p],...],head)` + `BARS(id,t)`
  - tokens: `nlTokens(par,id,x,y,toks,c,fs,gap)` then `POP('#idt'+k, t)`; `el.cx(k)` is the centre of token k, `el.xs` = `[left,width]`
  - vector: `nlVec(par,id,x,y,vals,c,horiz,cs)` then `POP('.idv',t,{st:.08})`
  - equation: `nlEq(par,id,x,y,w,html,head,c,fs)`
  - big counter: `nlCount(par,id,x,y,['0','8B','52B'],c,fs)` + `COUNT(id,t,step)`
- **Real pages** (after `lfind.py`): `nlShot(par,id,x,y,w,h,src,url,nw,nh)`, `nlShotHL(id,hid,'phrase',c,{n,fuzzy,pad})`, `nlCursor(par,id,x,y)` (show it with `nlShow`), `CURSOR_TO(cur,shot,'phrase',t,d,{n,fuzzy})`, `CLICK(id,t)`, `SHOT_FOCUS(id,t,...nlShotXY(id,'phrase'),s,d)`. Highlights and the cursor ring are hidden at 0 automatically. Plain `CURSOR(id,t,x,y,d)` only for cursors over your own drawings.
- **Text-like lines in drawings** (a page, a document, an essay): `nlWords(g, x0, x1, y, h, seed, wmin, wvar, gap)`. Every bar ends before x1; never write your own word-bar loop (lines ran past the card before: lcheck SVGOUT).
- **Engine beats:** `go`, `W`, `B`, `IN`, `POP`, `FADE`, `OUT`, `PULSE`, `SHAKE`, `DRAW`, `TO`, `tl`, `findp(phrase, fromTime)`.
- **Sound cues:** put `CUE(t, kind)` next to its beat.
  - `hit` on the 4-6 biggest reveals, `chime` when something is confirmed right, `err` on every X / failure, `tick` on list items and rows, `pop` when an object appears, `blip` on small digital events.
  - `type` for every typed text: `CUE(start, 'type', nChars, dt)`. NEXT adds the whoosh; the intro and outro cues are in the kit.
  - About 80-110 cues for a 5-min video; a calm video uses fewer `hit`/`err`.

## Workflow
0. **Setup** (one block):
   ```bash
   if [ -f /home/user/hf-kit/light/light.js ]; then ln -sfn /home/user/hf-kit ~/lkit
   elif [ ! -f ~/lkit/light/light.js ]; then rm -rf ~/lkit; git clone -q --depth 1 https://github.com/scarwill/hf-kit ~/lkit
     [ -f ~/lkit/light/light.js ] || { rm -rf ~/lkit; git clone -q --depth 1 -b claude/wonderful-cannon-lnzyty https://github.com/scarwill/hf-kit ~/lkit; }; fi
   export NODE_PATH=$(npm root -g); pip install -q scipy pocketsphinx pillow pytesseract
   which tesseract >/dev/null || apt-get install -y -q tesseract-ocr >/dev/null 2>&1 || { apt-get update -q >/dev/null 2>&1; apt-get install -y -q tesseract-ocr >/dev/null 2>&1; }
   ```
   - If `light/` is still missing, tell the user the kit is not pushed; never rewrite the kit by hand.
   - Playwright + Chromium are preinstalled; never run `playwright install`.
1. **Align:**
   - `mkdir ~/<name>-video && cd` there, copy the audio (uploads are in `/root/.claude/uploads/<id>/`; never edit them in place), and put the script lines in `script.txt`.
   - If the user has word timestamps / an SRT from their TTS, convert them to `words.json` (`[[sec, "word"], ...]`, lowercase, no punctuation) + `meta.json` and skip align.py.
   - Otherwise run `python3 ~/lkit/video/align.py <audio> script.txt`, then `python3 ~/lkit/light/realign.py`.
   - **Every `CHECK` is must-fix** (a bad boundary drifts every later beat: "04:41 ke baad awaz pahele, cheze baad me"). Map each sentence to its speech run between silences and run `realign.py fix '{"76":[282.73,283.74]}'`. For a list sentence give one `[start,end]` per comma part: `'{"79":[[286.38,288.95],[289.57,290.55]]}'`.
   - Then `python3 ~/lkit/light/lverify.py` (pocketsphinx against the real audio). Repeat until it says `sync ok`.
2. **Plan** (short table, in chat):
   - Columns: scene, time range, title, main visual (type from the menu + what exactly is drawn), exact text shown, real source (URL), hero position, cues.
   - Scenes are about 6-15 s each. Group them into **batches of about 6 scenes** (about 60-90 s of audio) and number the batches.
   - Pick the music style for this story (`music/README.md`, different from the last line of `music/log.md`) and where its drop / stop / resolve land; say it in one line.
   - Right after the plan, fetch every real source, try the screenshots, and send ONE message listing the screenshots you still need.
3. **Build in batches.** For each batch, in order:
   1. `cat ~/lkit/light/RULES.md` (every batch, even if you think you remember it).
   2. Add the batch's scenes to `video.js` (build parts + beats). The video stays buildable after every batch.
   3. `python3 ~/lkit/light/lbuild.py video.js <audio>`. Fix every ERROR (NOTFOUND / OUTSIDE / SCENE / BANNED / REDEFINE). Check AMBIGUOUS lines: if you meant the later occurrence, use a longer phrase.
   4. `node ~/lkit/light/lcheck.js index.html --from <batch start> --to <batch end>`. Fix every warning and every `JS` line (EMPTY / TEXT / SMALL / OUT / OVERFLOW / OVERLAP / ORBCORNER / NOORB / NOVISUAL / GAP / CUTTEXT / SMALLSHOT / SVGOUT / LIGHT guards incl. HLMISS).
   5. Read its 1-2 `out/sheet_NN.png`. Check: orb in the corner, wires on the right parts with arrowheads, nothing cut by a frame or the edge, no label on a part, no empty frame, text shown where the voice talks about text.
   6. For every moving thing (ball, packet, dot, cursor), take one motion sheet: `node ~/lkit/light/lsheet.js index.html range <a> <b> .25 --name motion`. It must move in every frame and land on its word.
   7. If the batch has a screenshot: `node ~/lkit/light/lshotcheck.js index.html --from <a> --to <b>` and read EVERY `out/pages_NN.png` (full-size crops of each highlight / cursor / zoom moment). Each box must surround exactly the words the voice says, the cursor tip must sit on its target, no line cut by an edge.
   8. Fix, then re-check only the fixed moments: `node ~/lkit/light/lsheet.js index.html at <t1> <t2> ... --name fix`.
4. **Final check (whole video):** `lbuild` clean, then `node ~/lkit/light/lcheck.js index.html` → 0 warnings, 0 JS errors. Read every `out/sheet_NN.png` once (about one sheet per minute of video). Check the hook in the first 5 s and the intro/outro frames. Then `node ~/lkit/light/lshotcheck.js index.html` and read every `out/pages_NN.png`.
   - **0 warnings is NOT "done".** No tool checks these; look for them yourself in the sheets: a highlight that is on the right words but the wrong moment; a cursor body covering the text the voice reads; text you typed that differs from the source; a drawing that looks wrong but stays inside its box; anything the user complained about in an earlier video. Never send a video because the checker passed.
5. **Audio, made for THIS video** (`~/lkit/light/music/README.md`). The user rejected the `lmix.py` / `score.py` moods and cue sounds on 25 Oct 2026: never use them again.
   - Read `~/lkit/light/music/log.md` and pick a music style and an sfx palette different from the last entry.
   - Music: a generator in `~/lkit/light/music/` tied to the story (the build follows the scenes, a drop / hit on the reveal, a stop on the twist, a resolve on the ending), or write a new generator for a new style and add it to the README table.
   - Cues: `python3 ~/lkit/light/music/sfx.py cues.json <DUR> sfx.wav <palette> --root <key>` (palette and key matching the music).
   - Mix: `python3 ~/lkit/light/music/lremix.py index.html <audio>` -> `bgm.m4a` (music ducks under the voice) + `preview_mix.m4a`. Check the level shape, then add the line to `log.md`.
   - Send `preview_mix.m4a` with the delivery (we cannot listen; the user does). If the user dislikes it, make a different style, never just change the volume.

6. **Deliver:**
   - Copy `index.html` + `bgm.m4a` + `preview_mix.m4a` (+ `assets/*.png`) to `~/<name>-hyperframes/` and send them with SendUserFile.
   - Short Hinglish message: long + synced, the scene list (title + main visual), what is illustrative / placeholder, and the setup:
     - `mkdir assets`
     - `copy "<path>" assets\<name>.m4a`
     - `copy "<path>\bgm.m4a" assets\bgm.m4a`
     - every screenshot png into `assets\` with the same name
     - `dir assets` (watch for `.m4a.m4a` / `.png.png`)
     - `npx hyperframes render --output <name>.mp4`
   - Ask the user to play it once and report glitches with the time.
   - If a new visual would help later videos, ASK before adding it to `light.js`.

## Context budget (do not skip)
- Never Read single frames (`nl_test` grabs). Only sheets: `out/sheet_NN.png`, `out/motion_NN.png`, `out/fix_NN.png`, and the full-size screenshot sheets `out/pages_NN.png` (these are worth their size: the small sheets hide a box on the wrong row).
- Rough total for a 5-min video: about 5 sheets per batch x 4-5 batches + 5 final sheets + real-source screenshots + 6-12 pages sheets = 35-50 images. Never hundreds.
- Don't paste large kit files into chat. Read `light-demo.js` once; for a specific part, grep `light.js` for its line.
- Never paste house helpers or kit code into video.js; lbuild rejects it.

## Pitfalls
- Load order is fixed by lbuild: premium.js, life.js, light.js, video.js, kit.js. Don't define `D`, `NL`, `HERO`, `TYPE`, `W`, `CUE`, `NEXT`, `cOrb` in video.js.
- GSAP transforms override CSS `transform`. Position with left/top. Centred things use `nlTag` / `nlLab(...,true)`, never `translate(-50%)`.
- `fromTo` needs autoAlpha in both from and to. No colour tweens, no onUpdate, finite repeats only. Comments on their own line. No emoji.
- `POP` hides its target from frame 0 and overshoots its scale: use `FADE` for highlight frames inside rows/windows (POP made the window OVERFLOW).
- A child of a window shows with the window. To reveal it later, give it an id and FADE/POP it.
- **Never `PULSE` the hero** (a scaled hero jumps). **Never `IN` the hero after a `HERO` move** (IN resets x/y); use `FADE`. **Never `PULSE` a row inside a window.**
- A part whose container has no size (an `nlDocs` group) counts as tiny for coverage: show a sized sibling early.
- To fill a scene's first seconds, show the coming windows at `IN(..., { to: .3 })`, then `TO(..., { autoAlpha: 1 })` on the word.
- Typed text (`nlType`) is mono and plain ASCII, so the caret lands right after the last char.
- The local preview uses fallback fonts; the real render loads Space Grotesk, Inter and JetBrains Mono.
- Screenshot highlights / cursors: never hand-type or compute pixel positions (lbuild SHOTPX refuses numbers in nlShotHL). Phrase -> OCR box -> kit.
- The local shim only seeks forward cleanly. lsheet / lcheck sort their times; for your own grabs, seek in increasing order.
