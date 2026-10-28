---
name: "net-thumb"
description: "Make YouTube thumbnails for a Netlight ML long video with hf-kit's thumb/nlthumb.js: 2-4 big words that make the same claim as the title, one visual (a real page, one huge number, or a plain contrast), the channel's neon look, plus a phone-feed preview and checks for acronyms, word count, cut text and claim match (built on light/analytics.md). Use when the user says net-thumb / 'thumbnail bana' / 'thumbnail de' for Netlight, or after the light skill delivers a video."
---

# NET-THUMB: thumbnails for Netlight ML

- Reply in Hinglish, short. The user is not technical: never ask them to run anything.
- **THIS SKILL ONLY** for thumbnails. The news channel (Merge Report) has its own thumbnails in the `news` skill.
- Ask before pushing anything to the repo.

## Setup
```bash
if [ -f /home/user/hf-kit/thumb/nlthumb.js ]; then ln -sfn /home/user/hf-kit ~/skit
elif [ ! -f ~/skit/thumb/nlthumb.js ]; then rm -rf ~/skit; git clone -q --depth 1 https://github.com/scarwill/hf-kit ~/skit; fi
export NODE_PATH=$(npm root -g); cat ~/skit/light/analytics.md
```

## Why (`light/analytics.md`)
- The two videos YouTube showed most (NCM 8.7k, RSI 3.2k impressions) got **0.4-0.8 %** clicks: acronyms, and a thumbnail that said something else than the title ("LLMs FAILED 86% SOLVED" on "This AI Doesn't Write Word by Word"; "SELF-IMPROVING AI BROKE THE LOOP" on "...Then Lied About It").
- "**19 NEURONS BEAT GIANT AI**" (plain claim + number, same as the title) got **3.8 %**.

## Rules
1. **One claim, three places.** Title, thumbnail text and the first spoken line say the same thing (the `net-script` package). The thumbnail is the shortest, strongest form of it, not the title word for word ("This AI Cheated Its Own Test" -> "IT FAKED ITS OWN TEST").
2. **2-4 big words.** The surprising part in the accent colour, the rest white. No acronym a new viewer does not know (NCM, RSI, REA, MCP...). AI, GPU, GB are fine.
3. **One visual** that proves the claim:
   - `image`: the real page / photo the video shows (the paper line, the repo header, the fake log), cropped to the part that matters, in a glow window with the site in the header;
   - `big`: one huge number ("55 GB", "100-0");
   - `vs`: a plain contrast ("19" vs "100,000", "PASS" vs "FAKE").
4. **Colour = meaning, like the video:** green `data`, blue `model`, yellow `out`, pink `err` (failure, fake, danger). Dark background, navy glow.
5. **Readable on a phone:** the `_feed.png` preview shows it at 360 px with the title under it. If the words do not read at a glance there, cut words.
6. True and shown in the video: no claim, number or face the video does not have.

## Workflow
1. Take the package (title + thumbnail claim) from the script. Make **3 different options** (different visual or angle, same claim), one spec each, in the video folder:
   ```json
   { "out": "thumb_A", "title": "<the video title>", "lines": ["IT FAKED", "ITS OWN TEST"], "hl": [0], "accent": "err",
     "visual": { "type": "vs", "a": "PASS", "b": "FAKE", "la": "the log said", "lb": "it never ran" } }
   ```
   `visual` = `{ "type": "image", "src": "assets/x.png", "head": "arxiv.org", "pos": "top left" }` | `{ "type": "big", "text": "55 GB", "c": "out" }` | `{ "type": "vs", "a": "..", "b": "..", "la": "..", "lb": "..", "ca": "data", "cb": "err" }`. Optional: `"tag"` (small chip under the words), `"side": "left"` (visual on the left), `"acronyms": [...]` (extra words to refuse). Real page images: `node ~/skit/light/webshot.js <url> assets/x.png 1`, then crop with PIL.
2. `node ~/skit/thumb/nlthumb.js thumb_A.json`. Fix every ERROR (WORDS, ACRONYM, CUT); read every WARN (CLAIM, SMALL).
3. Look at the three `_feed.png` previews and one full `thumb_X.png`. Pick your favourite and say why in one line.
4. Send the three `thumb_X.png` (+ the feed previews) with SendUserFile (`display: 'attach'`). Tell the user in one line: YouTube Studio -> the video -> Thumbnail -> **Test & compare** runs all three against each other.
5. When Studio shows the click rate a few days later, ask the user for it and add a row to `light/analytics.md` (ask before pushing).
