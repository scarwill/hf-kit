# tracks: "Do You Recognize These Tracks?" ball Short

A ball hops pad to pad (top-down 3D, three.js); every landing plays one note of a melody.

```bash
cd tracks
npm i three@0.160.0 playwright
python3 music.py              # writes notes.js + audio.wav (edit TRACKS to change the songs)
node render.js frames 30      # renders 1080x1920 frames
ffmpeg -framerate 30 -i frames/f_%05d.jpg -i audio.wav -c:v libx264 -crf 19 -pix_fmt yuv420p -c:a aac -shortest out.mp4
```

Use public-domain melodies only (copyrighted songs get Content ID claims).
