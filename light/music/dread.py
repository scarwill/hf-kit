#!/usr/bin/env python3
"""Music style "dread": eerie music box + low drone for 'something goes wrong quietly' stories (AI safety, bugs that spread).
A detuned music-box motif carries the hook, a heartbeat kick enters on the 1st scene change, a pulsing bass on the 2nd,
a noise riser pulls into the DROP (impact + dark pad + 16th ticks), a dead STOP on the twist leaves only the drone and
single bell notes, and the ending lands on a low minor chord with a sub boom (the story does not end happy).
First used: emergent misalignment Short (6 Nov 2026). numpy + scipy, no samples.
  python3 dread.py <DUR> <HEAD> <END> <out.wav> --scenes t2,t3,... --drop T --stop T --resolve T [--bpm 84] [--root 50] [--seed 7]
Times are VIDEO seconds. --root = MIDI root (50 = D, minor all the way).
"""
import argparse, wave, numpy as np
from scipy.signal import butter, sosfilt

SR = 44100
ap = argparse.ArgumentParser()
ap.add_argument('dur', type=float); ap.add_argument('head', type=float); ap.add_argument('end', type=float); ap.add_argument('out')
ap.add_argument('--scenes', default=''); ap.add_argument('--drop', type=float, required=True); ap.add_argument('--stop', type=float, required=True)
ap.add_argument('--resolve', type=float, required=True); ap.add_argument('--bpm', type=float, default=84); ap.add_argument('--root', type=int, default=50)
ap.add_argument('--seed', type=int, default=7)
a = ap.parse_args()
rng = np.random.default_rng(a.seed)
f = lambda m: 440 * 2 ** ((m - 69) / 12)
N = int(a.dur * SR); L = np.zeros(N); R = np.zeros(N)
sc = [float(x) for x in a.scenes.split(',') if x]
beat = 60 / a.bpm
lp = lambda x, hz: sosfilt(butter(2, hz, 'low', fs=SR, output='sos'), x)
hp = lambda x, hz: sosfilt(butter(2, hz, 'high', fs=SR, output='sos'), x)


def add(t, sig, g=1., pan=0.):
    i = int(t * SR)
    if i >= N or i + len(sig) <= 0: return
    if i < 0: sig = sig[-i:]; i = 0
    sig = sig[:N - i]; L[i:i + len(sig)] += sig * g * (1 - pan) ** .5; R[i:i + len(sig)] += sig * g * (1 + pan) ** .5


def tt(d): return np.arange(int(d * SR)) / SR


def bell(m, d=1.6):
    t = tt(d); hz = f(m) * (1 + rng.normal(0, .002))
    s = np.sin(2 * np.pi * hz * t) + .45 * np.sin(2 * np.pi * hz * 2.76 * t) * np.exp(-t * 6) + .25 * np.sin(2 * np.pi * hz * 5.4 * t) * np.exp(-t * 11)
    return s * np.exp(-t * 2.6) * np.minimum(1, t / .004)


def kick(d=.35, f0=95, f1=42):
    t = tt(d); ph = 2 * np.pi * np.cumsum(f1 + (f0 - f1) * np.exp(-t * 28)) / SR
    return np.sin(ph) * np.exp(-t * 9)


def saw(hz, d):
    t = tt(d); return 2 * ((t * hz) % 1) - 1


def env(d, at=.01, rel=.2):
    n = int(d * SR); e = np.ones(n); a_ = max(1, int(at * SR)); r_ = max(1, int(rel * SR))
    e[:a_] = np.linspace(0, 1, a_); e[-r_:] *= np.linspace(1, 0, r_); return e


r = a.root
motif = [r + 24, r + 27, r + 31, r + 30, r + 24, r + 27, r + 34, r + 31]   # D F A G# D F C A: minor with a sour note
# drone: D + A, swelling over the scenes, quiet in the stop
t = tt(a.dur)
dr = lp(saw(f(r - 12), a.dur) + saw(f(r - 5) * 1.003, a.dur) * .7, 380)
lvl = np.interp(t, [0, a.head, sc[0] if sc else 8, a.drop, a.drop + .01, a.stop, a.stop + .05, a.resolve, a.dur],
                [.0, .25, .35, .55, .7, .7, .22, .22, .0])
L += dr * lvl * .5; R += dr * lvl * .5
# music box: whole track except the drop section, sparse in the stop
k = 0; tb = a.head
while tb < a.dur - 1.5:
    if tb < a.drop - 2.0 or (a.stop <= tb < a.resolve and k % 2 == 0):
        add(tb, bell(motif[k % 8]), .32 if tb < a.drop else .25, pan=(-.4 if k % 2 else .4))
    k += 1; tb += beat
# heartbeat kick (lub-dub) from the 1st scene change to the stop
s1 = sc[0] if sc else a.head + 8
tb = s1
while tb < a.stop - .1:
    g = .55 if tb < a.drop else .8
    add(tb, kick(), g); add(tb + .22, kick(.25, 80, 40), g * .6); tb += beat * 2 if tb < a.drop else beat
# pulsing bass on 8ths from the 2nd scene change to the stop
s2 = sc[1] if len(sc) > 1 else a.head + 18
tb = s2; prog = [0, 0, 3, -2]; j = 0
while tb < a.stop - .1:
    m = r - 12 + prog[int((tb - s2) / (beat * 4)) % 4]
    add(tb, lp(saw(f(m), beat / 2), 300 if tb < a.drop else 700) * env(beat / 2, .005, .08), .22); tb += beat / 2; j += 1
# riser into the drop
rd = 2.0; rn = rng.normal(0, 1, int(rd * SR)); rt = tt(rd)
riser = hp(rn, 1500) * (rt / rd) ** 2
add(a.drop - rd, riser, .18)
# drop: impact + dark pad (D minor add b9) + 16th ticks until the stop
imp = kick(1.2, 120, 30) * 1.0 + lp(rng.normal(0, 1, int(1.2 * SR)), 900) * np.exp(-tt(1.2) * 5) * .4
add(a.drop, imp, .9)
pd = a.stop - a.drop
pad = sum(lp(saw(f(m) * (1 + d), pd), 1200) for m in [r, r + 3, r + 7, r + 15] for d in (-.004, .004)) / 8
add(a.drop, pad * env(pd, .3, .15), .5)
tb = a.drop
while tb < a.stop - .05:
    add(tb, hp(rng.normal(0, 1, int(.03 * SR)), 7000) * np.exp(-tt(.03) * 120), .12, pan=.3); tb += beat / 4
# stop: one low tone hit on the twist
add(a.stop, lp(saw(f(r - 24), 1.5), 200) * env(1.5, .01, 1.2), .35)
# resolve: sub boom + low minor chord to the end
rd2 = a.dur - a.resolve
add(a.resolve, kick(1.6, 70, 28), 1.0)
ch = sum(lp(saw(f(m), rd2), 700) for m in [r - 12, r, r + 3, r + 7]) / 4
add(a.resolve, ch * env(rd2, .4, rd2 * .6), .55)
add(a.resolve, bell(r + 24, 2.5), .3)
s = np.stack([L, R], 1); s = s / (np.abs(s).max() + 1e-9) * .89
s = (s * 32767).astype(np.int16)
w = wave.open(a.out, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(s.tobytes()); w.close()
print(f'{a.out}: {a.dur:.1f}s dread {a.bpm:.0f} bpm root {r}, drop {a.drop}, stop {a.stop}, resolve {a.resolve}')
