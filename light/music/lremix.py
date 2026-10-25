#!/usr/bin/env python3
"""Mix a video's own music.wav + sfx.wav into bgm.m4a (the track index.html plays) and preview_mix.m4a (voice + bgm, for the user to listen).
The music ducks under the voice (sidechain), so words stay clear when the track gets busy.
  python3 lremix.py index.html <voice audio> [music dB under the voice, default 14]
Run in the video folder after: lcheck.js (cues.json) -> a generator in music/ (music.wav) -> sfx.py (sfx.wav).
"""
import re, subprocess, sys
html, voice = sys.argv[1], sys.argv[2]; MU = float(sys.argv[3]) if len(sys.argv) > 3 else 14.0
HEAD = float(re.search(r'const HEAD=([\d.]+);', open(html, encoding='utf-8').read()).group(1))


def vol(fn, ss=None, t=None):
    o = subprocess.run(['ffmpeg', '-hide_banner'] + (['-ss', str(ss)] if ss is not None else []) + (['-t', str(t)] if t else []) + ['-i', fn, '-af', 'volumedetect', '-f', 'null', '-'],
                       capture_output=True, text=True).stderr
    return float(re.search(r'mean_volume: (-?[\d.]+)', o).group(1)), float(re.search(r'max_volume: (-?[\d.]+)', o).group(1))


vm, vp = vol(voice, 0, 60); mm, _ = vol('music.wav', HEAD, 60); _, sp = vol('sfx.wav')
gm, gs = round(vm - MU - mm, 1), round(vp - 10 - sp, 1)
ms = int(HEAD * 1000)
duck = (f'[0:a]volume={gm}dB[m];[2:a]aresample=44100,adelay={ms}|{ms},aformat=channel_layouts=stereo,apad[sc];'
        f'[m][sc]sidechaincompress=threshold=0.05:ratio=2:attack=20:release=350[md];[1:a]volume={gs}dB[s]')
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', 'music.wav', '-i', 'sfx.wav', '-i', voice, '-filter_complex',
                duck + ';[md][s]amix=inputs=2:normalize=0:duration=first[o]', '-map', '[o]', '-c:a', 'aac', '-b:a', '160k', 'bgm.m4a'], check=True)
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', 'bgm.m4a', '-i', voice, '-filter_complex',
                f'[1:a]aresample=44100,adelay={ms}|{ms},aformat=channel_layouts=stereo[v];[0:a][v]amix=inputs=2:normalize=0[o]', '-map', '[o]', '-c:a', 'aac', '-b:a', '160k', 'preview_mix.m4a'], check=True)
print(f'bgm.m4a + preview_mix.m4a written (music {gm:+} dB, ducked under the voice; sfx {gs:+} dB)')
