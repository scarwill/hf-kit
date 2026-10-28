---
name: "net-script"
description: "Write the script for a Netlight ML long video (5-8 min, TTS-ready English) together with its title and thumbnail text, built on the channel's own YouTube Studio numbers (light/analytics.md): title, thumbnail and first line make ONE claim without acronyms, the promised thing is shown in the first minute, one new word at a time, no template lines, checked by scriptcheck.py. Use after net-trends when the user picks a topic, or when the user says net-script / 'script likh' / 'is topic ka script' for Netlight. Shorts scripts are made by net-shorts."
---

# NET-SCRIPT: the long-video script for Netlight ML

The user's channel is **Netlight ML** (`@netlight-ml`): DS / ML / AI explainers for a US / UK audience. Flow: `net-trends` (topic) -> **net-script** (package + script) -> the user's TTS -> `light` (video) -> `net-thumb` (thumbnails).
- Reply in Hinglish, short and clear. The script itself is English. The user is not technical: never ask them to run anything.
- **THIS SKILL ONLY** for this request. Do not start `light` or `net-thumb` until the user sends the audio / asks.
- Ask before pushing anything to the repo.

## Setup (one block)
```bash
if [ -f /home/user/hf-kit/light/scriptcheck.py ]; then ln -sfn /home/user/hf-kit ~/skit
elif [ ! -f ~/skit/light/scriptcheck.py ]; then rm -rf ~/skit; git clone -q --depth 1 https://github.com/scarwill/hf-kit ~/skit; fi
cat ~/skit/light/analytics.md; ls ~/skit/light/scripts/
```
If the clone fails, the chat was started without the `scarwill/hf-kit` repo: tell the user in one line to start it with that repo selected.

## Why the script is built this way (`light/analytics.md`, read it every time)
- Viewers left at the **first background lecture after the hook**: NCM at 0:47 (tokens + diffusion), REA ~1:50 (MCP + disassembly), Mamba ~2:00 (history of older models), RSI ~2:00 (abstract 4-step loop).
- **The title's promise came minutes late**: RSI's "lied" at ~6:00, REA's "63 bytes" at ~4:00, NCM promised Sudoku and then translated German for 4 minutes.
- **Acronyms + a thumbnail that said something else** than the title: 0.4-0.8 % clicks on 3-9k impressions (NCM, RSI).
- The video that held people best (**19 Neurons**, 39 % watched, 3.8 % clicks) opened on a number + contrast ("Not 19 million, not 19 billion, 19"), explained the problem through things everyone knows (summer forest -> autumn, driving by day -> at night), gave every technical idea an everyday picture (ice vs water), and came back to its promise by the middle.
- **Every script repeated the same template lines.** Viewers who come back hear a formula.

## Step 1: research, package + outline (then stop)
1. **Research:** read the paper / docs / repo (WebSearch + WebFetch, `git clone --depth 1` for code). Write down the exact numbers, names, dates and the lines you will use, with links. Nothing you cannot source. Find the ONE moment of the story that makes people stop (a result, a failure, a number, a before / after): that is the promise.
2. **3 packages.** Each = title + thumbnail text + first spoken line, all making the **same claim**:

   | # | Title (<= 60 chars) | Thumbnail text (2-4 words) | First line (<= 14 words) | What is shown in the first minute |
   |---|---|---|---|---|

   - Plain words first. **No acronym a new viewer does not know** (NCM, RSI, REA, MCP...): say what it does. "(Mamba Explained)" at the END of a title is fine for search.
   - One number or one plain contrast in the title or thumbnail.
   - The claim is true and shown in the video. No clickbait the video does not pay.
3. **Outline:** the sections with a time budget (Step 2 shape), one line each: what happens, the one new word it adds, and what is on screen (from the `light` visual menu: custom drawing, flow with packets, split screen, counter, bars, real page screenshot...).
4. Your pick and why, in one line. End with "Konsa package? Ya badalna hai?" and **stop**.

## Step 2: the script
Write `~/<slug>-script/script.txt` (only the spoken lines, one sentence per line; `# Section` lines allowed) + `sources.md` (a link for every fact; what is illustrative).

**Shape (5-8 min = 750-1250 words, ~155 words a minute):**
1. **Hook, 0-15 s (<= 40 words).** The most surprising concrete thing, as the package says it. A number, a contrast or a moment, in the viewer's own world when possible. No method names, no acronyms, no history.
2. **The promise, shown, 15-60 s.** What the title promised happens now, concretely: the fake test log, the 63 bytes rebuilt, the board solved 86 vs 1. The viewer gets what they clicked for in the first minute; the rest explains HOW.
3. **How it works, in layers (most of the video).** Each section:
   - opens with the question the viewer has right now (in fresh words, never a stock line);
   - gives a concrete example or picture FIRST, the technical name after it;
   - adds **one new word at most**, explained in the same sentence with something from daily life ("a token, a piece of a word");
   - background / history only when the example needs it, **30 s at most**.
4. **A new surprise every 60-90 s:** a number, a failure, a twist, a "but". New words each time.
5. **Limits, <= 20 s:** honest and specific (model size, what was not tested, what still wins).
6. **Ending:** one line that answers the hook in 15 words or fewer. Then a question only THIS video could ask, or nothing. Never "see you in the next one".

**Banned lines** (the old template, in 3+ of the last 5 scripts; scriptcheck refuses them): "Stick with me", "Here's the twist", "Quick question for you", "To be clear", "This isn't magic", "Let's be honest", "So here's my question for you", "Tell me / drop your answer in the comments", "Then came the hard part", "See you in the next one", "By the end you'll...", "And the idea is spreading", "So remember the question from the start". Write those moments in new words, different in every video. "According to the paper" and "here's the catch" at most once.

**Spoken English for TTS:** 5-15 words a sentence, one idea each; numbers the way they are said if the TTS misreads them; no symbols, brackets or emoji; hard names get a pronunciation note in sources.md, not in the script.

**Facts:** every number, name and claim checked against the source. Numbers that change get "as of <month year>". Illustrative examples are marked in sources.md.

## Step 3: check, then show
```bash
python3 ~/skit/light/scriptcheck.py script.txt --title "<title>" --thumb "<thumbnail text>" --promise "<words that pay off the title>"
```
- Fix every ERROR (LENGTH, HOOK, JARGON, STOCK, PROMISE, TITLE, THUMB) and read every WARN. `PROMISE` later than 45 s = move the proof up. `REUSED` = a 5-word phrase that is also in 2+ earlier scripts (`light/scripts/`): rewrite it.
- Read the script once as a viewer who knows nothing: where would you scroll away? Fix that line.

Show the user: the chosen package, word count + minutes, the script, the scriptcheck result (0 errors). Then stop: "Theek hai to TTS bana ke bhej do, fir `light` se video banata hoon, aur `net-thumb` se thumbnail."

After the video is published: save the final script to `~/skit/light/scripts/<yyyy-mm-dd>-<slug>.txt` (first line `# <title> · <length> · <date>`), and ask before pushing.
