# AI + Dev news channel: locked decisions (updated 19 Oct 2026)

Decided with the user. The `news` skill and kit follow this file.

## Channel
- **Niche:** AI news + developer news. About 60 % AI (new models from OpenAI / Google / Anthropic / Meta / xAI / DeepSeek..., Hugging Face trending and open models, AI agents, AI tools, AI failures and hacks), 30 % coding and dev tools (GitHub viral repos, languages, editors, open source), 10 % cloud and security (only big ones: AWS / Azure / GCP outages, price changes, big hacks that hit developers).
- **Not covered:** gadgets and phones unless the story is about AI or developers, crypto prices, politics / celebrity drama, unconfirmed leaks (or say "reportedly"), tiny updates.
- **Audience:** US / UK. Voice: English (the user's TTS). The user talks to Claude in Hinglish.
- **Angle that sets us apart:** every story says what it means for developers, and shows the real thing (repo, model page, docs, code, a demo run by us when possible).

## Format
- **Every day:** 2-3 Shorts (1080x1920, one story each, 30-45 s).
- **Every weekend:** 1 long video "This Week in Tech" (1920x1080, 6-8 min): a deep dive on the week's biggest story (~3 min), "stories you missed" that had no Short (~3 min), updates on the week's Shorts (~1 min).
- **Big Story rule:** a story that scores 9+/10 (major model launch, outage or hack that hits developers, huge deal, viral open-source release everyone talks about) gets a Short at once and its own long video (4-6 min) the same or next day, without waiting for the weekend. At most 1-2 Big Story long videos a week. The weekend video then gives it only a short update.
- **Slow day:** an evergreen Short (how X works, a free AI tool, the week so far) instead of a weak story.

## Upload times (India time, IST)
- Shorts and long videos: about **8 pm IST** (= US East morning, UK afternoon). Weekdays 7:30-9:30 pm, weekends 6:30-8:30 pm.
- After 1 Nov 2026 (US clock change): one hour later (weekdays 8:30-10:30 pm, weekends 7:30-9:30 pm). UK changes on 25 Oct.
- News beats perfect timing: never hold a fresh story for hours just to hit the slot.

## Look (light theme "Clean Blue": blue + black only)
| token | hex | use |
|---|---|---|
| bg | `#F5F8FA` | background, soft blue glow `#E3ECFF` top-right, `#EEF2F7` bottom-left |
| ink | `#0F172A` | headlines, values, everything that is not the accent |
| soft | `#5B6678` | labels, secondary text |
| card / line | `#FFFFFF` / `#E2E8F0` | cards, chips, borders, soft shadows |
| blue | `#2563EB` | the only accent: key word in a headline, pills, numbers, tags, highlights (`#C7D7FE`, tint `#E3ECFF`) |
| red | `#E11D48` | problems only: stamps like HACKED, "not for public roads", X marks |

- Fonts: headlines **Inter Tight** 800-900, body **Inter**, code **JetBrains Mono**.
- No neon, no mascot, no intro (the hook is on screen from frame 0), no header / footer / progress bar. End card: "New AI & dev news every day" + Follow (Shorts) / Subscribe (long).
- Shorts safe zone: text above y 1590, and left of x 940 below y 900. Long: 50 px from every edge.
- Fireship-style energy, own identity: something new every 1-1.5 s in Shorts (every 3-4 s in long videos), hand-drawn red arrows and circles, highlighter, slam stamps, real screenshots, typed code.

## Thumbnails (long videos)
- Weekly: "1 big + 2 small" (`thumb.js` layout `big3`): badge THIS WEEK IN TECH, the strongest story big with 2-5 words, two small numbered stories. Prefer stories that had no Short.
- Big Story: layout `single`, badge BIG STORY.
- Real photos / screenshots only, nothing the video does not deliver, a "?" when a claim is a rumour.

## Content rules
- Every fact from a checked source (primary source, or two reputable reports); sources listed in the description.
- Official press photos, official logo files, real page screenshots, credited. No ripped video clips, no movie / meme images, no redrawn logos or fake UI.
- Humour yes, swearing and jokes about groups of people no.
- Say what is illustrative, say "reportedly" for anything not confirmed, and give the honest caveat (for example "this happened in internal training, not in ChatGPT").
