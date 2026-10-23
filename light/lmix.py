#!/usr/bin/env python3
# LIGHT audio in one command (run in the video folder AFTER lcheck.js, which writes cues.json):
#   python3 ~/hf-kit/light/lmix.py index.html <voice audio> <mood>        mood: dark | lofi | upbeat | calm | cinematic
# 1. score.py makes music.wav (mood track) + sfx.wav (the sound cues) for the whole timeline (DUR, HEAD, END read from index.html)
# 2. measures voice / music / sfx loudness and mixes: music about 13 dB under the voice mean, cue peaks about 10 dB under the voice peak
# 3. writes bgm.m4a and checks that the cues land on their beat times (±0.05 s)
# Louder / softer music later: change data-volume of <audio id="bgm"> in index.html, or --music -11 (dB under the voice, default -13).
import json, re, subprocess, sys, os
import numpy as np
K = os.path.dirname(os.path.abspath(__file__))
a = [x for x in sys.argv[1:] if not x.startswith('--')]
if len(a) < 3: sys.exit(__doc__ or 'usage: lmix.py index.html <voice audio> <mood>')
html, voice, mood = a[:3]
MU = float(sys.argv[sys.argv.index('--music') + 1]) if '--music' in sys.argv else -13.0
h = open(html, encoding='utf-8').read()
DUR = float(re.search(r'data-composition-id="main" data-start="0" data-duration="([\d.]+)"', h).group(1))
END = float(re.search(r'const END=([\d.]+);', h).group(1)); HEAD = float(re.search(r'const HEAD=([\d.]+);', h).group(1))
if not os.path.exists('cues.json'): sys.exit('cues.json missing: run node ~/hf-kit/light/lcheck.js index.html first')
cues = json.load(open('cues.json'))
subprocess.run([sys.executable, os.path.join(K, 'score.py'), 'cues.json', str(DUR), str(HEAD), str(END), 'music.wav', 'sfx.wav', mood], check=True)

def vol(f, ss=None, t=None):
    cmd = ['ffmpeg', '-hide_banner'] + (['-ss', str(ss)] if ss is not None else []) + (['-t', str(t)] if t else []) + ['-i', f, '-af', 'volumedetect', '-f', 'null', '-']
    o = subprocess.run(cmd, capture_output=True, text=True).stderr
    return float(re.search(r'mean_volume: (-?[\d.]+) dB', o).group(1)), float(re.search(r'max_volume: (-?[\d.]+) dB', o).group(1))
vlen = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', voice]).decode())
s0 = 30 if vlen > 100 else 0
vm, vp = vol(voice, s0, 60); mm, _ = vol('music.wav', s0 + HEAD, 60); _, sp = vol('sfx.wav')
gm = round(vm + MU - mm, 1); gs = round(vp - 10 - sp, 1)
print(f'voice mean {vm} peak {vp} | music mean {mm} -> {gm:+} dB | sfx peak {sp} -> {gs:+} dB')
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', 'music.wav', '-i', 'sfx.wav', '-filter_complex',
                f'[0:a]volume={gm}dB[m];[1:a]volume={gs}dB[s];[m][s]amix=inputs=2:normalize=0[o]', '-map', '[o]', '-c:a', 'aac', '-b:a', '160k', 'bgm.m4a'], check=True)

# cue onset check on sfx.wav: energy must jump within ±0.05 s of the cue time (hit / chime / err / pop / blip / tick)
import wave
w = wave.open('sfx.wav'); sr = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, 2).astype(float).mean(1); w.close()
env = np.convolve(np.abs(x), np.ones(int(sr * .005)) / int(sr * .005), 'same')
pick = [c for c in cues if c[1] in ('hit', 'chime', 'err', 'pop', 'blip', 'tick')]
pick = pick[::max(1, len(pick) // 8)][:8]; bad = 0
for t, k, *_ in pick:
    i0, i1 = int((t - .12) * sr), int((t - .06) * sr); base = np.median(env[max(0, i0):max(1, i1)]) if i1 > 0 else 0
    th = max(base * 1.8, env.max() * .002); win = env[max(0, int((t - .05) * sr)):int((t + .05) * sr)]
    on = np.argmax(win > th) / sr - .05 if len(win) and (win > th).any() else None
    ok = on is not None and abs(on) <= .05; bad += not ok
    print(f'  cue {k:<6} {t:7.2f}s  onset {"none" if on is None else f"{on:+.3f}s"}  {"ok" if ok else "CHECK"}')
print('bgm.m4a written,', len(cues), 'cues,', mood, '| cue check:', 'all ok' if not bad else f'{bad} to look at (a cue right after another cue can mask its onset)')
