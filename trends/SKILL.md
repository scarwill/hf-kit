---
name: "net-trends"
description: "Find what is rising in data science / ML / AI right now and turn it into ranked video topics for the Netlight ML channel (LIGHT explainers): proof links (Hugging Face, Hacker News, Wikipedia, PyPI), US/UK YouTube demand and competition, a LIGHT visual and a title per topic. Use when the user says net-trends / trends skill, or asks 'netlight ka topic', 'aaj kya banau', 'kya trending hai', 'aaj ka kya hai' together with net-trends / Netlight / DS / AIML. Not for Merge Report daily news (that is the news skill)."
---

# NET-TRENDS: what should the next Netlight ML video be about?

The user's channel is **Netlight ML**: long (1920x1080) DS / ML / AI explainers built with the `light` skill, for a US / UK audience.
- Reply in Hinglish, short and clear. The user is not technical: never ask them to run anything, open a site or take screenshots.
- The user's words: "jab bhi new chat me bolu ye skill khol or ky topic hai / aaj ka ky hai bolu to mujhe bas tu de". So: run, judge, give the list. One stop only.
- **THIS SKILL ONLY** for this request. Do not start `net-script`, `light` or `news` until the user picks a topic.
- Ask before pushing anything to the repo.

## Why it works this way
- "Trending" is not the same as "a good video". A new model is news for 3 days (that is Merge Report's job); the concept behind it ("Mixture of Experts explained") is searched for months. Netlight makes the concept.
- The script measures; you judge. `scout.py` collects numbers (momentum, YouTube demand, gap). Mapping news to a concept, checking LIGHT fit and writing titles is your job.
- Academic topics with many "in hindi / tamil / telugu" suggestions are Indian exam searches, not the US / UK audience (flag `IN`). Do not put them in the top picks.

## Step 0: setup (one block)
```bash
if [ -f /home/user/hf-kit/trends/scout.py ]; then ln -sfn /home/user/hf-kit ~/tkit
elif [ ! -f ~/tkit/trends/scout.py ]; then rm -rf ~/tkit; git clone -q --depth 1 https://github.com/scarwill/hf-kit ~/tkit
  [ -f ~/tkit/trends/scout.py ] || { rm -rf ~/tkit; git clone -q --depth 1 -b claude/gallant-bohr-ypvs89 https://github.com/scarwill/hf-kit ~/tkit; }; fi
ls ~/tkit/trends/scout.py
```
If the clone fails, the session was started without the `scarwill/hf-kit` repo: tell the user in one line to start the new chat with that repo selected. Never rewrite the kit by hand.

## Step 1: run (3-5 min)
First tell the user one line: "data nikal raha hoon, 3-5 min lagenge". Then:
```bash
mkdir -p ~/trends-out && python3 -I ~/tkit/trends/scout.py --out ~/trends-out > ~/trends-out/last.md 2> ~/trends-out/last.log; tail -3 ~/trends-out/last.log
```
(Bash timeout 600000.) Then Read `~/trends-out/last.md`. It has:
- **Ranked concepts**: score = 35% momentum + 40% US/UK YouTube demand + 25% gap, halved by the India-exam share. Flags `IN` (India-student) and `MADE` (already a video, from `trends/made.txt`).
- **Details (top 12)**: autocomplete, papers, trending models, HN posts, top YouTube videos with views and age.
- **Fresh this week**: top HF papers, trending HF models / spaces, HN AI stories, paper keywords that no concept matches.
- **Source notes** at the top: a source that failed. Mention it in one line; the rest is still valid.

## Step 2: judge
1. **Map the fresh list to concepts.** For each big model / paper / HN story ask "which concept would a viewer need to understand this?" (a new MoE model -> Mixture of experts; a new TTS model -> Text to speech; a looped-LM paper -> Looped language models). Pick at most 5 such concepts that are not already in the top of the ranking and check them:
   `python3 -I ~/tkit/trends/scout.py --yt "mixture of experts explained" "looped transformer explained"`
   Judge them with the same numbers (median views/day of the top 10, recent hits = videos under 90 days with 20k+ views, share older than 1 year, India share).
2. **Drop** a topic that is: `IN` 30%+; `MADE`; pure product news or a launch (Merge Report); a screen-recorded tool tutorial (n8n, "build an agent with ChatGPT", UI walkthroughs: LIGHT does not do that); no demand (median under ~50 views/day and no recent hits).
3. **Reading the numbers:**
   - High demand + many recent hits = people want it now and new videos still get pushed: best.
   - High demand + top results mostly 1-2 years old = a gap a fresh, better video can fill.
   - Demand fine but top videos all huge channels from the last month = hard; say so.
   - Strong momentum but almost no YouTube demand = early; fine as a later video, not the top pick.
4. **LIGHT fit:** every pick needs a concrete moving visual from the light kit menu (loop, net, curve, bowl, attention matrix, embedding space, matmul, bars, split screen, custom drawing). Use the concept's `visual idea` as a start and make it specific.
5. **Facts:** every number and name you write comes from the report or its links. Never invent views, dates or model names. Numbers that change get "as of <date>".
6. **New concepts:** if a keyword from "not in concepts.txt" keeps showing up and is a real explainable concept, suggest adding it to `trends/concepts.txt` (ask before pushing).

## Step 3: give the list (then stop)
In Hinglish, in this order:
1. One line: what was checked and when (sources, date), plus any source note.
2. A table of the **top 8**:

| # | Topic | Kyun abhi | US/UK demand | Competition | LIGHT visual | Title |
|---|---|---|---|---|---|---|

   - **Kyun abhi**: one line with real evidence ("DeepSeek-V4.1-Flash #1 on HF, 39 papers this week").
   - **US/UK demand**: median views/day + the best autocomplete hint ("'explained simply' suggested").
   - **Competition**: the top video's views and age, and whether recent videos still get views.
   - **Title**: English, under 60 characters, searched words first, no clickbait (YouTube: short, keyword first, accurate).
3. **Meri top 3**, one line each on why (demand, gap, how strong the LIGHT visual is).
4. **Skip / India wale**: one line each.
5. **Sources**: the links behind the top 3 (HF / paper / HN / top YouTube videos).
6. End with: "Konsa banau? Number bolo, fir `net-script` se script likhta hoon."

Then **stop**. When the user picks a topic, hand over to `net-script` (script) -> their TTS -> `light` (video) -> `net-thumb` (thumbnails). When a video is made, offer to add the concept name to `trends/made.txt` (ask before pushing).

## Files (`~/tkit/trends/`)
- `scout.py`: the scanner (no API keys). `--top N` changes how many concepts get the YouTube check (default 30). `--yt "q1" "q2"` checks only those searches.
- `concepts.txt`: about 110 evergreen DS / ML / AI concepts: name | Wikipedia title | YouTube search | match terms | visual idea.
- `made.txt`: concepts that already have a Netlight video.
- Output: `~/trends-out/report_<date>.md` + `.json` (not committed).

## Known limits (say them only if they matter)
- YouTube data comes from the public search page and autocomplete, not an official API: it can break if YouTube changes the page (then fix the parser in `yt_search`). Autocomplete gives what people search, not how many.
- Reddit and GitHub trending are not used: Reddit blocks servers without its API, and this cloud session can only reach the GitHub repos it was started with.
- Wikipedia sometimes rate-limits the server; the run then skips it after 3 refusals and notes it.
