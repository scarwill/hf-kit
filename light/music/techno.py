#!/usr/bin/env python3
"""Music style "techno": minimal techno for coding / build-it-yourself stories. Mechanical 16th clicks (like keys), a soft kick that
grows, an offbeat bass from the first scene change, a filtered saw stab chord that opens on the drop, an optional dead stop
(only the clicks stay), and a major stab + tail on the resolve. numpy + scipy, no samples. First used: Rust walkthrough test (31 Oct 2026).
  python3 techno.py <DUR> <HEAD> <END> <out.wav> --drop T [--scenes t2,t3] [--stop T] [--resolve T] [--bpm 124] [--root 50] [--seed 7]
Times are VIDEO seconds. --root = MIDI root (50 = D; minor, major after --resolve).
"""
import argparse, wave, numpy as np
from scipy.signal import butter, sosfilt
SR = 44100
ap = argparse.ArgumentParser()
ap.add_argument('dur', type=float); ap.add_argument('head', type=float); ap.add_argument('end', type=float); ap.add_argument('out')
ap.add_argument('--scenes', default=''); ap.add_argument('--drop', type=float, required=True); ap.add_argument('--stop', type=float, default=None)
ap.add_argument('--resolve', type=float, default=None); ap.add_argument('--bpm', type=float, default=124); ap.add_argument('--root', type=int, default=50)
ap.add_argument('--seed', type=int, default=7)
a = ap.parse_args(); rng = np.random.default_rng(a.seed)
f = lambda m: 440 * 2 ** ((m - 69) / 12)
lp = lambda x, fc, o=2: sosfilt(butter(o, fc, 'low', fs=SR, output='sos'), x)
hp = lambda x, fc, o=2: sosfilt(butter(o, fc, 'high', fs=SR, output='sos'), x)
N = int(a.dur * SR); out = np.zeros(N); bt = 60 / a.bpm; s16 = bt / 4; R = a.root
sc = sorted(float(x) for x in a.scenes.split(',') if x.strip()); t_bass = sc[0] if sc else a.head
res = a.resolve if a.resolve is not None else a.end
def add(sig, t, g=1.0):
    i = int(t * SR)
    if i >= N or i < 0: return
    n = min(len(sig), N - i); out[i:i + n] += g * sig[:n]
def env(n, at=.002, dec=.2):
    tt = np.arange(n) / SR; return np.minimum(1, tt / at) * np.exp(-tt / dec)
def kick():
    n = int(.35 * SR); tt = np.arange(n) / SR; fr = 48 + 110 * np.exp(-tt * 28); return np.sin(2 * np.pi * np.cumsum(fr) / SR) * env(n, .001, .13)
def click(bright):
    n = int(.04 * SR); return hp(rng.standard_normal(n), 3500 + 3000 * bright, 4) * env(n, .0005, .008)
def bass(m):
    n = int(s16 * 2 * SR); tt = np.arange(n) / SR; x = np.sign(np.sin(2 * np.pi * f(m) * tt)) * .5 + np.sin(2 * np.pi * f(m) * tt)
    return lp(x, 380) * env(n, .004, .09)
def stab(ms, open_):
    n = int(bt * 1.5 * SR); tt = np.arange(n) / SR; x = sum(2 * ((f(m) * tt) % 1) - 1 for m in ms) / len(ms)
    return lp(x, 700 + 3800 * open_, 2) * env(n, .003, .22)
def stopped(t): return a.stop is not None and a.stop <= t < a.stop + bt
MIN = [R, R + 3, R + 7, R + 10]; MAJ = [R, R + 4, R + 7, R + 12]
t = a.head * .5; k = 0
while t < a.end + 2.5:
    step = k % 16; prog = min(1, max(0, (t - a.head) / max(1, a.drop - a.head)))
    after = t >= a.drop; fade = 1 if t < a.end else max(0, 1 - (t - a.end) / 2.5)
    if not stopped(t):
        if step % 4 == 0 and t >= a.head: add(kick(), t, (.35 + .45 * prog if not after else .9) * fade)
        add(click(rng.random()), t, (.10 + .12 * (step % 4 == 2)) * (1 if t >= a.head else .5) * fade)
        if t >= t_bass and step % 4 == 2: add(bass((R - 12) + (0 if (k // 16) % 2 == 0 else -2)), t, .45 * fade)
        if after and step == 0 and t < res: add(stab([m + 12 for m in MIN], 1.0), t, .30 * fade)
        if not after and step == 0 and t >= a.head + 2 * bt: add(stab([m + 12 for m in MIN], .15 * prog), t, .16 * fade)
    t += s16; k += 1
add(stab([m + 12 for m in MIN], 1.0), a.drop, .5)
if a.resolve is not None: add(stab([m + 12 for m in MAJ], .8) * 1.0, a.resolve, .5)
# soft D drone under everything (glues the clicks together)
tt = np.arange(N) / SR; dr = lp(np.sin(2 * np.pi * f(R - 12) * tt) + .3 * np.sin(2 * np.pi * f(R - 5) * tt), 300)
dr *= np.clip((tt - .2) / 1.5, 0, 1) * np.clip((a.end + 2.5 - tt) / 2.5, 0, 1); out += .12 * dr
out = out / (np.abs(out).max() + 1e-9) * .85
st = np.stack([out, np.roll(out, int(.011 * SR)) * .97], 1)
with wave.open(a.out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype(np.int16).tobytes())
print(f'{a.out}: techno {a.bpm} bpm root {R}, drop {a.drop}, stop {a.stop}, resolve {a.resolve}')
