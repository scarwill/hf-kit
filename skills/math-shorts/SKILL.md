---
name: math-shorts
description: Make maths/physics visual explainer videos (YouTube Shorts 1080x1920 or long 1920x1080) rendered by pure Python on the user's own computer, voiced by the user's own TTS. Use when the user gives a maths, physics, geometry, topology, probability or simulation topic and wants a video, a script for TTS, or the video code. Two steps - first the TTS script, then (after the user has the audio) one Python file that renders the video synced to that audio.
---

# Math / Physics Shorts (script -> user's TTS -> Python video code)

The user (Hindi/Hinglish speaker) runs a faceless maths & physics channel. Talk to them in simple Hinglish.
Videos are in **English** (global audience = higher RPM). The user renders on their own Windows PC.
Never copy another channel's script, title or watermark; topics are free, wording and look are ours.

## The workflow (always in this order)

### Step 1 - script only (no code yet)
When the user gives a topic (or asks for ideas), reply with:
1. **TTS script** in one code block, English, 100-130 words (~45-55 s at normal TTS speed).
   - Each phrase on its own line, **blank line between phrases**. Short phrases (2-12 words). Split long
     sentences at commas into separate phrases. This makes the TTS pause between phrases, and the video
     code finds the phrases from those pauses.
   - Line 1-2 = hook question ("You can draw a cube. But can you draw one from the fourth dimension?").
   - Build up step by step, one idea per phrase, one visual per phrase.
   - Numbers/facts must be correct (check them).
   - Last phrase = a question for comments ("So, can you imagine the fifth dimension?").
   - No emojis, no symbols TTS reads badly; write "four D" or "4D" consistently.
2. **Scene list** (not for TTS): phrase number -> what appears on screen.
3. Tell the user: make TTS in one voice, one file (mp3/m4a/wav), keep the natural pause between phrases,
   then come back and say the audio is ready (attach it if they can - not required).
Then STOP and wait. Do not write video code in step 1.

### Step 2 - video code (after the user has the audio)
Write ONE standalone Python file `<topic>.py`, run as `python <topic>.py voice.m4a` (and
`python <topic>.py voice.m4a stills 3 10 20` for test frames). Follow `reference/tesseract_example.py`
closely - it is a proven, finished example. Required parts:
- `PHRASES` = the exact script phrases in order.
- Sync: `speech_chunks()` runs ffmpeg `silencedetect` (n=-35dB, d=0.25) on the voice and returns speech
  chunks; `assert len(chunks) == len(PHRASES)` with a clear message (if it fails, the user tells you the
  counts and you adjust the threshold/duration or merge phrases). `T[i]` = start of phrase i. EVERY
  animation starts at a `T[i]` (+ small offset) - never hard-code seconds.
- Drawing: pycairo on an ARGB surface + numpy bloom (downsample, Pillow GaussianBlur, add back, soft
  tonemap), dark navy gradient background with faint stars, bright neon colors, white dots/edges.
  3D: own projection with numpy (rotation matrices + perspective). 4D: project 4D->3D->2D.
- Text: title/question at top (y~250 on 1080x1920), captions of the current phrase at the bottom
  (y~1640, wrapped at 900 px, white bold with shadow), keep the main object between y 450-1350,
  labels/chips must not overlap the object. Font "Inter" (fallback is fine).
- Sound bed made with numpy only (soft pad + whooshes + chimes at key `T[i]`), quiet under the voice;
  final mix with ffmpeg `amix` + `loudnorm=I=-14:TP=-1.5`. No copyrighted music.
- Render with multiprocessing (4 chunks -> libx264 crf 19 yuv420p -> concat), 1080x1920 @ 60 fps for
  Shorts (1920x1080 for long videos). Output into `out/<topic>.mp4`.
- Only numpy, pillow, pycairo + ffmpeg. No Blender/manim/moviepy unless the user asks.
Before sending, re-read the code for errors: every name defined, every phrase index used exists,
reshape sizes divide (H and W divisible by 8), no overlap of text and object.

After the code, give short run steps:
```
pip install numpy pillow pycairo      (once; plus ffmpeg: winget install ffmpeg)
python <topic>.py voice.m4a stills 5 20 40    -> check a few frames in out/
python <topic>.py voice.m4a                   -> full video in out/
```
Rendering on a normal PC can take 5-20 min; that is fine.

## Rules learned so far (keep them)
- Script first, video after. TTS speed differs between voices, so animation is synced to the real audio.
- Sound must have a visible reason: a note/ding only when something visibly hits, lands or lights up.
  (A pendulum that hits nothing should not "ding" - give it something to strike, or no note.)
- Simulations must be real maths/physics (e.g. pendulum lengths from T = 2*pi*sqrt(L/g)), not faked.
- Hook in the first 2 s, a payoff/"aha" near the end, a comment question at the end.
- Shorts give low RPM; long videos (8+ min compilations, English text) earn more. Offer both when relevant.
- Avoid repetitive template videos (YouTube "inauthentic content"): each video a new idea or real twist.

## Video ideas that fit this format
4D cube, Klein bottle, Mobius strip, torus, fractals (Koch, Sierpinski, Mandelbrot zoom), Fourier circles
drawing a shape, Hilbert's hotel, sphere eversion, Pythagoras visual proof, pi from random dots, Galton
board bell curve, birthday paradox, Monty Hall, pendulum wave, polyrhythm, double-pendulum chaos,
orbits with equal periods, three-body problem, golden ratio spiral, prime spirals, Collatz.

## Reference files
- `reference/tesseract_example.py` - finished Short: TTS-synced 4D cube (pattern for step 2).
- `reference/physics_sim_example.py` - finished long-form simulation renderer (pendulum wave + polyrhythm,
  needs the sim.py timeline it imported; use as a style/technique reference only).
