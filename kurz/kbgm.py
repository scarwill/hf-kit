#!/usr/bin/env python3
# usage (in the video folder, AFTER build.py):  python3 ~/hf-kit/kurz/kbgm.py index.html <voice audio> [mood] [--music -13]
#   mood: dark | lofi | upbeat | calm | cinematic (pick from the script's feel; default cinematic)
# Kurz audio = the voiceover + ONE background music track, NO sound effects (user rule).
# 1. makes the music with the kit's own generator light/score.py (no samples, no cues -> no SFX) for the whole timeline
# 2. measures voice and music loudness and sets the music --music dB under the voice mean (default -13), fade in 1.5 s, fade out at the end
# 3. writes bgm.m4a and puts <audio id="bgm" src="assets/bgm.m4a"> into index.html (replaces an old one; run it again after every build.py)
# Louder / softer later: change data-volume of <audio id="bgm"> or run again with --music -11 / -15.
import argparse, json, os, re, subprocess, sys
ap = argparse.ArgumentParser(); ap.add_argument('html'); ap.add_argument('voice'); ap.add_argument('mood', nargs='?', default='cinematic'); ap.add_argument('--music', type=float, default=-13.0)
A = ap.parse_args()
here = os.path.dirname(os.path.abspath(__file__))
score = next((c for c in [os.path.join(here, '..', 'light', 'score.py'), '/tmp/hfk/light/score.py', os.path.expanduser('~/hf-kit/light/score.py')] if os.path.exists(c)), None)
if not score: sys.exit('light/score.py not found: fresh-clone the kit to /tmp/hfk first (skill step 0)')
try: import scipy  # noqa: F401  (score.py needs it)
except ImportError: subprocess.run([sys.executable, '-m', 'pip', 'install', '-q', 'scipy'], check=True)
h = open(A.html, encoding='utf-8').read()
DUR = float(re.search(r'data-composition-id="main" data-start="0" data-duration="([\d.]+)"', h).group(1))
END = float(re.search(r'const END=([\d.]+);', h).group(1)); HEAD = float(re.search(r'const HEAD=([\d.]+);', h).group(1))
json.dump([], open('cues.json', 'w'))
subprocess.run([sys.executable, score, 'cues.json', str(DUR), str(HEAD), str(END), 'music.wav', 'sfx.wav', A.mood], check=True)
def mean(f, ss, t):
    o = subprocess.run(['ffmpeg', '-hide_banner', '-ss', str(ss), '-t', str(t), '-i', f, '-af', 'volumedetect', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(re.search(r'mean_volume: (-?[\d.]+) dB', o).group(1))
vlen = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', A.voice]).decode())
s0 = 30 if vlen > 100 else 0
vm, mm = mean(A.voice, s0, 60), mean('music.wav', s0 + HEAD, 60); g = round(vm + A.music - mm, 1)
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', 'music.wav', '-af', f'volume={g}dB,afade=t=in:st=0:d=1.5,afade=t=out:st={max(0, DUR - 2.5):.2f}:d=2.5',
                '-t', f'{DUR}', '-c:a', 'aac', '-b:a', '160k', 'bgm.m4a'], check=True)
tag = f'<audio id="bgm" data-start="0" data-duration="{DUR}" data-track-index="1" data-volume="1" src="assets/bgm.m4a"></audio>'
h = re.sub(r'<audio id="bgm"[^>]*></audio>\s*', '', h)
if '<audio id="voiceover"' not in h: sys.exit('no <audio id="voiceover"> in ' + A.html)
h = h.replace('<audio id="voiceover"', tag + '\n  <audio id="voiceover"', 1); open(A.html, 'w', encoding='utf-8').write(h)
for f in ('sfx.wav', 'cues.json'):
    if os.path.exists(f): os.remove(f)
print(f'bgm.m4a: mood {A.mood}, voice mean {vm} dB, music {mm} dB -> {g:+} dB (music {A.music} dB under the voice), {DUR} s; <audio id="bgm"> set in {A.html}')
