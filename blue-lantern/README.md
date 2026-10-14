# Blue Lantern — calm / breathing / sleep / focus channel kit

Tested reference scripts for the Blue Lantern YouTube channel (UK audience). The `blue-lantern` skill reads this folder. For each new video, write a NEW script based on these examples. Don't re-upload or lightly reskin old output.

| file | what it makes | checked |
|---|---|---|
| `examples/short_breathing_1min.py` | 1-min guided breathing Short, 1080x1920 (4 in / 6 out, 5 breaths, cue text above the circle, countdown inside, progress line) | rendered + frames checked |
| `examples/long_breathing_10min.py` | 10-min guided breathing, 1920x1080, 3 techniques + chapters, thumbnail.png, multiprocessing frames, NVENC if available (`test` arg = first 40 s) | test render + all sections checked; audio -16 dBFS, peak -1.1 dB |
| `examples/meditation_music_long.py` | any-length meditation music (pad in D with random chord drift, bowls, ocean, binaural), streamed in 20 s blocks | 90 s + 3 min tests, -16 dBFS |
| `examples/rain_sound.py` | 60 s synthesised rain (wash, drops, drips, wind, distant thunder) | rendered |
| `examples/focus_piano.py` | focus/study piece: physically-modelled felt piano, Dmaj9-Bm9-Gmaj7-A6sus, pad, sub (62-98 Hz), celesta, hall (`60` arg = 60-min version) | rendered, -18 dBFS |
| `examples/youtube_pack_example.txt` | title / description with chapters / tags / pinned comment / upload settings | — |
| `brand/` | profile picture, banner (text inside the 1546x423 safe area), channel description, `make_brand.py` | checked |

Look: deep navy → teal gradient, slow aurora blobs, drifting light specks, glowing cyan breathing circle with a faint "full breath" guide ring, Inter font (fallback Segoe UI / Arial / DejaVu).
