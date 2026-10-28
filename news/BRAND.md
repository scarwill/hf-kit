# Merge Report: locked decisions for the AI + Dev news channel (updated 28 Oct 2026, lessons from analytics)

Decided with the user. The `news` skill and kit follow this file.

## Channel
- **Name:** Merge Report (handle @mergereport, or the closest free one). Profile picture: `brand/dp.png` (white MR on blue). Banner: `brand/banner.png` (2560x1440, text inside the phone-safe centre 1546x423). Sources of both: `brand/*.html`.
- **Channel keywords** (YouTube Studio > Settings > Channel > Keywords, 433 / 500 chars): `brand/channel_keywords.txt`.
- **Niche:** AI news + developer news. About 60 % AI (new models from OpenAI / Google / Anthropic / Meta / xAI / DeepSeek..., Hugging Face trending and open models, AI agents, AI tools, AI failures and hacks), 30 % coding and dev tools (GitHub viral repos, languages, editors, open source), 10 % cloud and security (only big ones: AWS / Azure / GCP outages, price changes, big hacks that hit developers).
- **Not covered:** gadgets and phones unless the story is about AI or developers, crypto prices, politics / celebrity drama, unconfirmed leaks (or say "reportedly"), tiny updates.
- **Audience:** US / UK. Voice: English TTS from Clipchamp, the same voice and speed in every video. The user talks to Claude in Hinglish.
- **Angle that sets us apart:** every story says what it means for developers, and shows the real thing (repo, model page, docs, code, a demo run by us when possible).

## Format
- **Every day:** 2-3 Shorts (1080x1920, one story each, 30-45 s = about 120 words max with the Clipchamp voice; 137 words came out at 51 s).
- **No weekly / weekend video** (decided 23 Oct 2026). Long videos are made only on the day a story feels big enough, when the user decides it is (see Big Story rule).
- **Big Story rule:** a story that scores 9+/10 (major model launch, outage or hack that hits developers, huge deal, viral open-source release everyone talks about) gets a Short at once and its own long video (4-6 min) the same or next day. Claude may flag a candidate; the user decides which stories get a long video. At most 1-2 Big Story long videos a week.
- **Slow day:** an evergreen Short (how X works, a free AI tool, the week so far) instead of a weak story.

## Upload times (India time, IST)
- Shorts and long videos: about **8 pm IST** (= US East morning, UK afternoon). Weekdays 7:30-9:30 pm, weekends 6:30-8:30 pm.
- After 1 Nov 2026 (US clock change): one hour later (weekdays 8:30-10:30 pm, weekends 7:30-9:30 pm). UK changes on 25 Oct.
- News beats perfect timing: never hold a fresh story for hours just to hit the slot.

## Lessons from YouTube analytics (28 Oct 2026, from the real transcripts + views of 11 Shorts; data in analytics.md). These override older word counts.
- What did NOT decide views: the hook wording. Low Shorts had good plain-English hooks too ("Developers went to bed on Friday night. Their AI bills did not." = 29 views).
- Topic decided most: the 3 best Shorts were one strange, instantly clear fact (fake terminal 768, a secret key that was the number 4: 282, a secret date leaked 3 times: 419). 5 of the 7 lowest were breach / outage / "rotate your keys" advisories (LiteLLM 16, OpenCode 29, Google Cloud 41, Cloudflare 49, Railway 55).
- Length: the 3 longest Shorts (50-53 s) are all in the bottom 4. The top 3 are 40-43 s.
- The low ones pack product names and versions in the middle (PyPI, 1.107, Docker, SSH, 1.106.2 / Europe West 2B, Cloud Run, Kubernetes Engine, App Engine / Workers AI, GLM 5.3, SGLang, 200 OK).

Script rules (Shorts), with a checklist shown next to every script:
1. Topic: lead with a strange / surprising fact or a wow demo. A breach / outage / advisory story is a Short only with a strange-fact angle (like "the key was the number four"), and at most 1 per day.
2. 90-110 words, under 45 s.
3. Max 2 product / version names besides the main subject; explain each in plain words.
4. Hook: one concrete surprising fact a non-developer gets in 2 s.
5. Caveat in 1-2 short lines. End on the fact or a question, not only on an instruction.
Missing data: swipe rate (stayed vs swiped) is known only for 2 low Shorts. Ask the user for the Engagement tab of the top 3 to confirm the first-seconds story.

## Look (dark theme "Night Blue", decided 23 Oct 2026; replaces the light "Clean Blue")
| token | hex | use |
|---|---|---|
| bg | `#070B14` | background (navy-black), soft blue glow `#13244A` top-right, `#0E1626` bottom-left |
| ink | `#F1F5F9` | headlines, values, everything that is not the accent |
| soft | `#94A3B8` | labels, secondary text |
| card / line | `#111A2B` / `#24324A` | cards, chips, captions, code, borders, deep shadows |
| blue / acc | `#3B82F6` / `#60A5FA` | the only accent. `blue` for fills, highlights, buttons, numbers; `acc` (lighter) for accent TEXT on the dark bg: key word in a headline, tags, chip words, the spoken caption word. Pills: text `#93B4FF` on `#13244A`. Highlight `rgba(59,130,246,.35)`, tint `#1B2B4D` |
| red | `#E11D48` | problems only: stamps like HACKED, "not for public roads", X marks |
| dark | `#0F172A` | text drawn on white things (labels on white shapes) |

- Real screenshots stay as they are (white pages in a dark browser card); photos get a thin `#1B2740` frame.
- Fonts: headlines **Inter Tight** 800-900, body **Inter**, code **JetBrains Mono**.
- No neon, no mascot, no intro (the hook is on screen from frame 0), no header / footer / progress bar. End card: "New AI & dev news every day" + Follow (Shorts) / Subscribe (long).
- Shorts safe zone: text above y 1590, and left of x 940 below y 900. Long: 50 px from every edge.
- Fireship-style energy, own identity: something new every 1-1.5 s in Shorts (every 3-4 s in long videos), hand-drawn red arrows and circles, highlighter, slam stamps, real screenshots, typed code.

## Less text, more drawing (decided 21 Oct 2026)
- Every scene has one big visual metaphor we draw ourselves (server racks going dark, a key flying off, a padlock closing, a clock spinning, a rocket vs a pile of reports, a tap dripping $). Text supports the drawing, never the other way round.
- Screenshots: crop to the one line the voice talks about, highlight it, show it big. No full paragraphs.
- Long videos: a "breather" scene about every 45 s with almost no text (a big number, a drawing, one line).
- Big Story: the Short goes out first, the long video the next day; pin the long video's link in the Short's comments.

## Music (decided 23 Oct 2026)
- Every video gets its own custom BGM made for that story (generators and steps in `music/README.md`). Never the plain nmix.py moods, never the same style twice in a row. Hit / stop / drop on the story's twist, resolve on the end card. Always send a voice + music preview with the delivery.

## Sound cues (decided 27 Oct 2026)
- "Clean Glass" pack in `score.py` (picked from 3 options): soft felt thud for stamps, glass bubble pop, glass tap blip, wooden tick, two-note bell chime, muted double bonk for errors, soft glide down, soft laptop keys.
- **No whoosh**: scene changes are silent (`NEXT` still writes the cue, `score.py` ignores it). Do not add a whoosh back without asking.

## Captions (decided 21 Oct 2026)
- Shorts have word-by-word captions: 2-4 words at a time, the word being spoken turns blue, Inter Tight 800, light text on a dark navy rounded card (`#111A2B`, border `#24324A`). Place them in a fixed band (about y 1380-1540), inside the safe zone; scene layouts keep that band free.
- Long videos: no captions for now (ask the user before adding them).

## Thumbnails (long videos)
- Dark "Night Blue" like the videos (since 23 Oct 2026): navy-black bg with a blue glow, white headline with the key word in light blue `#60A5FA`, blue badge, photos in a thin `#2A3B5C` frame.
- Big Story: layout `single`, badge BIG STORY.
- Real photos / screenshots only, nothing the video does not deliver, a "?" when a claim is a rumour.

## Content rules
- Every fact from a checked source (primary source, or two reputable reports); sources listed in the description.
- Official press photos, official logo files, real page screenshots, credited. No ripped video clips, no movie / meme images, no redrawn logos or fake UI.
- Humour yes, swearing and jokes about groups of people no.
- Say what is illustrative, say "reportedly" for anything not confirmed, and give the honest caveat (for example "this happened in internal training, not in ChatGPT").

## Monetization safety (YouTube "inauthentic content" = mass-produced / templated, judged across the channel)
- Faceless + TTS is allowed, but every video must clearly be made with care: own research, own script, own analysis ("what it means for developers"), visuals built for that story.
- Never the same layout twice in a row: change the opening visual, scene order and parts from video to video. No fixed "template" Short.
- One consistent, natural voice for the channel (the user's own voice is best). Never a voice that imitates a real person.
- Quality over quantity: 2 strong Shorts beat 3 rushed ones. Big Story long videos (when the user picks one) show a real channel, not a Shorts factory.
- Sources in every description. No reused clips. Label realistic synthetic media if we ever use it (our drawings and TTS narration are not that).
