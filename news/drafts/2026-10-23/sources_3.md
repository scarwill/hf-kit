# Short 3: WorldTUI, a fake terminal made by a 360M AI model (23 Oct 2026)

## Sources
1. simedw, "WorldTUI: I trained a 360M model to pretend to be a terminal", 21 Oct 2026. https://simedw.com/2026/10/21/world-model-terminal/ (primary, with in-browser demo)
   - "I fine-tuned a 360M-parameter language model to act as a terminal. There's no shell or filesystem behind it: every keypress goes in, and the model predicts how the screen changes."
   - "It can create files, run vim and tmux, play snake, and usually remembers what you wrote a few commands later."
   - Browser demo 208 MB (int4), WebGPU, all inference local in the tab. Best in desktop Chrome / Edge.
   - Base: Qwen2.5-Coder-0.5B (494M) shrunk to ~360M by dropping unused vocabulary.
   - Training data: 336k episodes (~2B tokens) of real sessions recorded in Docker. ~75 GPU-hours on an RTX 4090.
   - Caveat: "far from a reliable filesystem ... after echo green >> colors, running cat colors often doesn't show the appended line."
   - Inspired by Genie 3: "applications aren't written in code but learned".
2. Hacker News, "WorldTUI: I trained a 360M model to pretend to be a terminal", 22 Oct 2026, 588 points. https://news.ycombinator.com/item?id=50190363

Note: this is a personal project, so the only primary source is the author's post. HN is used for reach, not as an independent check. Every number comes from the author. We record the demo ourselves (desktop Chrome, WebGPU) for the video.

## Script line -> source
| line | source |
|---|---|
| fake terminal, every letter a guess, no shell / files | 1 |
| 360 million parameters | 1 |
| press a key, predicts screen change | 1 |
| vim, tmux, snake | 1 |
| 336 thousand real terminal sessions | 1 (336k episodes) |
| 208 MB, runs in your browser | 1 |
| add a line to a file, read it back, often forgets | 1 (echo >> / cat example) |
| apps learned instead of coded | 1 (Genie 3 paragraph), our analysis |
