# News channel look (locked 17 Oct 2026)

Decided with the user. The `news` kit and skill must follow this; the old neon look in `news.js` is retired for this channel.

## Format
- **Shorts only for now:** 1080 x 1920, one story per Short, about 30-45 s of voice.
- Long videos (5-6 min, 1920 x 1080) come later, once the channel has subscribers and is monetized. Same look.

## Colours (light theme "Clean Blue + Fresh Teal")
| token | hex | use |
|---|---|---|
| bg | `#F5F8FA` | page background, with a soft glow: `#E3ECFF` top-right, `#DDF2EE` bottom-left |
| ink | `#0F172A` | headlines, main text |
| soft | `#5B6678` | labels, secondary text |
| card | `#FFFFFF` | cards, chips (2 px border `#E2E8F0`, soft shadow) |
| line | `#E2E8F0` | borders, row dividers |
| blue | `#2563EB` | primary accent: the key word in a headline, source/date pill (tint `#E3ECFF`), the main number |
| teal | `#0E9384` | secondary accent: numbers in chips, section tags ("THE CATCH"), quote highlight (`#BFE9E2`), quote card tint `#F3FBF9` |
| red | `#E11D48` | problems / risks only (not legal, failed, delayed) |

No neon, no glow lines, no dark backgrounds (dark photos are fine inside their rounded frames).

## Type
- Headlines: **Inter Tight** 800, tight tracking (-3 px at 112 px).
- Body, chips, tables: **Inter** 600-800.
- Shorts sizes: headline 100-120 px, chips 40 px, table rows 42-46 px, labels 32 px minimum.

## Layout (Shorts)
- Side margin 70 px. Content column x 70-940 wherever y > 900 (the right edge has the like / comment buttons).
- Nothing important below y 1590 (title, channel name and music bar sit there).
- Photos: rounded 36 px, 10 px white border, soft shadow, credit "Photo: <owner>" bottom-right, always moving slowly (Ken Burns).
- Pill on top with source + date, then the headline, then the photo, then 1-2 info chips.

## Content rules that stay
- Every fact from a checked source; source + date on screen.
- Photos from official press kits / newsrooms or free-licence libraries, credited. No ripped video, no redrawn logos.
