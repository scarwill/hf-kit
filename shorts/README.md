# shorts: Netlight ML YouTube Shorts

The `net-shorts` skill (`SKILL.md`): ideas -> scripts -> vertical 1080x1920 Shorts built with the LIGHT kit (`light/lbuild.py --short`).

| File | What |
|---|---|
| `sscout.py` | `python3 sscout.py --channel @handle [--out DIR]` -> `DIR/shorts_<date>.md` + `.json`: concepts ranked by Shorts demand (median views of the ML Shorts a YouTube search shows; off-topic Shorts are filtered out) + momentum (Hugging Face papers / trending models, Hacker News, from `../trends/scout.py`), the channel's existing Shorts (flag `MADE`) and latest long videos. `--yt "query" ...` checks only those searches. No API keys. |
| `CHANNEL.txt` | the channel handle |
| `SKILL.md` | the `net-shorts` skill |

LIGHT Short mode (`lbuild.py --short`): 810x1440 layout canvas scaled 4/3 to 1080x1920, orb top-right, no boot intro (HEAD 0.3 s), 2 s end card (`NL_END_TXT`), lcheck `SAFE` keeps parts out of the Shorts player UI (safe area x 40-690, y 300-1110 on the canvas).
