# Netlight ML music + sound cues: made for each video (decided 25 Oct 2026)

The user (25 Oct 2026): "bgm or sfx bilkul psnd nahi aaye, dono video ke hisaab se hona chahiye, ye jo ab diya wo next time bilkul na aaye".
So, for every Netlight video (long `light` and `net-shorts`):
- **BANNED:** `lmix.py` / `score.py` (its five moods dark / lofi / upbeat / calm / cinematic AND its cue sounds). Never use them for a delivery again.
- **Music:** the video's OWN track from a generator in this folder, tied to its story: the build follows the scenes, a drop / hit on the reveal word, a stop / break on the twist, a resolve on the ending. Never the same style as the last video (check `log.md`). Reuse a generator only with a clearly different feel (other bpm, key, instruments), or write a new one.
- **Sound cues:** `sfx.py` with a palette that fits the music, tuned to its key (`--root`), never the same palette twice in a row. A Short keeps ~15-30 cues (`--max`): cues on the moments that matter, not on every token.
- **Preview:** always send `preview_mix.m4a` (voice + music + cues) with the delivery. We cannot listen; the user does.
- Add a line to `log.md` after every video (ask before pushing).

## Steps (in the video folder, after lbuild + lcheck so cues.json exists)
1. Pick the style for THIS story (table below + ideas) and the key; read the scene table from lbuild for the times.
2. Music: `python3 ~/hf-kit/light/music/<gen>.py <DUR> <HEAD> <END> music.wav ...` (each generator lists its own options; DUR / HEAD / END are in index.html).
3. Cues: `python3 ~/hf-kit/light/music/sfx.py cues.json <DUR> sfx.wav <palette> --root <key> --max 30`
4. Mix: `python3 ~/hf-kit/light/music/lremix.py index.html <voice audio>` -> `bgm.m4a` (music ducks under the voice) + `preview_mix.m4a`.
5. Check the level shape (no silent gaps where music is meant to play, nothing louder than the voice) before sending.

## Styles made so far
| file | style | story hooks | first used |
|---|---|---|---|
| layers.py | builds one layer per scene (muffled pad -> bass pulse -> arpeggio -> hats), drop on the reveal, dead stop + ticking clock on the twist, major resolve on the ending | `--scenes --drop --stop --resolve` | NCM Short (25 Oct 2026) |
| techno.py | minimal techno for coding / build-it stories: mechanical 16th key clicks, kick that grows, offbeat bass from the 1st scene change, saw stab opens on the drop, optional one-beat dead stop, major stab on the resolve | `--scenes --drop [--stop] [--resolve]` | Rust walkthrough test (31 Oct 2026) |

## Sound palettes (`sfx.py`)
glass (airy, clean, futuristic) · analog (wood, paper, warm) · chip (8-bit) · pulse (sub thumps, sonar) · string (pizzicato, timpani)

## Ideas for the next styles
lo-fi piano + vinyl crackle, synthwave arps, orchestral pizzicato, trap hats + 808, music box, minimal techno, tabla-tinged groove, ambient glass pads, acoustic guitar.
