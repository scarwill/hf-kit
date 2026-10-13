# physics/ — satisfying physics simulation videos (pure Python)

Long-form 16:9 demo: intro + Chapter 1 Pendulum Wave + Chapter 2 Polyrhythm (60 s, 1920x1080, 60 fps).
Real physics drives both picture and sound: every note fires on an actual simulation event.

- `sim.py` — timeline + physics (pendulum lengths from T = 24/(16+i), ball round trips), event lists shared by video and audio
- `render.py` — cairo drawing + numpy bloom, renders 4 chunks in parallel and concatenates (`python3 render.py stills 8.0 40.0` for test frames)
- `audio.py` — numpy synthesis (marimba, bells, drone, riser, boom, FFT reverb), panned by screen position -> `out/audio.wav`

Needs: numpy, pillow, pycairo (`pip install pycairo`), ffmpeg.

```bash
cd physics && python3 render.py && python3 audio.py
ffmpeg -i out/video_noaudio.mp4 -i out/audio.wav -af volume=-2.3dB -c:v copy -c:a aac -b:a 192k -shortest out/final.mp4
```
(-2.3 dB brings the mix to about -14 LUFS.)
