# trends: what to make next for Netlight ML

`scout.py` checks what is rising in DS / ML / AI and whether people on YouTube (US / UK) want a video on it.
The `net-trends` skill (`SKILL.md`) runs it, judges the result and gives ranked video topics.

| File | What |
|---|---|
| `scout.py` | `python3 scout.py [--out DIR] [--top 30]` -> `DIR/report_<date>.md` + `.json`. `python3 scout.py --yt "query" ...` YouTube-checks only those searches. No API keys. |
| `concepts.txt` | ~110 evergreen concepts: `name \| Wikipedia title \| YouTube search \| match terms \| visual idea` |
| `made.txt` | concepts that already have a Netlight video (flagged `MADE`) |
| `SKILL.md` | the `net-trends` skill |

**Sources:** Hugging Face daily papers (7 days, with `ai_keywords`) and trending models / spaces, Hacker News (Algolia),
Wikipedia pageviews (14-day vs 90-day average), PyPI recent downloads, Google Trends daily RSS (US, AI items only),
YouTube autocomplete (US + UK) and YouTube search results (views, age, channel).

**Score** (0-100) = 35% momentum (HF papers / models, HN points, Wikipedia growth, PyPI growth; percentile ranks)
+ 40% demand (median views/day of the top 10 YouTube results, number of US / UK autocomplete suggestions)
+ 25% gap (share of top results older than 1 year, recent videos under 90 days with 20k+ views),
multiplied by `1 - 0.5 x` the share of India-exam suggestions ("in hindi / tamil / telugu", "aktu", "semester" ...).
