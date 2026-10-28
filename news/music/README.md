# Custom BGM per video (decided 23 Oct 2026)

Every video gets its OWN music track, made for that story. Never the plain nmix.py moods (dark / lofi / upbeat / calm / cinematic), and never the same style twice in a row.
Check log.md for the last styles used and pick something different.

Styles made so far (generators in this folder, numpy only):
| file | style | used for |
|---|---|---|
| heist.py | spy / heist: plucked bass ostinato, clock ticks, marimba, riser + stop + boom on the twist, double-time after | PHP2Shell leak (23 Oct), Gemini 4 Carbon (29 Oct, twist at 'Because it's scary good at hacking') |
| chip.py | 8-bit chiptune: square arps, triangle bass, noise drums, glitch stutter on the hook, dreamy break | WorldTUI (23 Oct) |
| pulse.py | tension pulse: sidechained sub, sonar pings, glassy plucks, hits on chosen times | eMudhra (23 Oct) |
| techno.py | minimal techno 122 bpm: four-on-the-floor kick, offbeat hats, rolling sub bass, random data blips, full stop before the twist + sub drop, bell resolve | Cloudflare KV cache leak (27 Oct) |
| synthwave.py | synthwave 100 bpm: filtered saw arpeggio, detuned pad, eighth-note bass, gated snare; full stop before the twist, back in half-time (calmer caveat), bell resolve | Qwen to Beijing (27 Oct) |
| puzzle.py | curious puzzle: 96 bpm pizzicato ostinato, music-box melody, soft clock ticks, felt bass; boom on the hook claim, lift when the 2nd lab arrives, true silence before the caveat, sparse ticks after, D-major music-box resolve | ETH, two labs (28 Oct) |
| trap.py | dark trap 140 bpm (half-time): sliding 808, rolling hats with triplet rolls, clap, E-minor bell stabs; boom on the hook, riser + drop on the twist, true silence before the 2nd twist, resolve | macOS git / eMudhra (28 Oct) |

Ideas for next ones: lo-fi piano + vinyl, trap hats + 808, orchestral pizzicato, tabla / sitar-tinged groove (Indian viewers), acoustic guitar folk, music-box.

Steps: check.js -> nmix.py index.html <voice> <any mood> (only to get sfx.wav) -> python3 music/<gen>.py ... music.wav -> python3 music/remix.py <voice>.
Tie the music to the script: a drop / stop / hit on the twist word, a resolve on the end card. Send preview_mix.m4a with the delivery (we cannot listen; the user checks it).
