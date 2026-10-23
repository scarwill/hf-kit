#!/usr/bin/env python3
# Mix a custom music.wav (from music/*.py or a new generator) with sfx.wav into bgm.m4a, plus preview_mix.m4a (voice + bgm).
# Run in the video folder after: check.js (cues.json) -> nmix.py index.html <voice> <any mood> (writes sfx.wav) -> your generator (overwrites music.wav).
#   python3 ~/nkit/news/music/remix.py <voice audio> [music dB under voice mean, default 14]
import subprocess, re, sys
voice = sys.argv[1]; MU = float(sys.argv[2]) if len(sys.argv) > 2 else 14.0
def vol(f, ss=None, t=None):
    o = subprocess.run(['ffmpeg', '-hide_banner'] + (['-ss', str(ss)] if ss is not None else []) + (['-t', str(t)] if t else []) + ['-i', f, '-af', 'volumedetect', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(re.search(r'mean_volume: (-?[\d.]+)', o).group(1)), float(re.search(r'max_volume: (-?[\d.]+)', o).group(1))
vm, vp = vol(voice, 0, 60); mm, _ = vol('music.wav', .2, 60); _, sp = vol('sfx.wav')
gm = round(vm - MU - mm, 1); gs = round(vp - 10 - sp, 1)
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', 'music.wav', '-i', 'sfx.wav', '-filter_complex', f'[0:a]volume={gm}dB[m];[1:a]volume={gs}dB[s];[m][s]amix=inputs=2:normalize=0[o]', '-map', '[o]', '-c:a', 'aac', '-b:a', '160k', 'bgm.m4a'], check=True)
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', 'bgm.m4a', '-itsoffset', '0.2', '-i', voice, '-filter_complex', '[0:a][1:a]amix=inputs=2:normalize=0[o]', '-map', '[o]', '-c:a', 'aac', '-b:a', '160k', 'preview_mix.m4a'], check=True)
print(f'bgm.m4a + preview_mix.m4a written (music {gm:+} dB, sfx {gs:+} dB)')
