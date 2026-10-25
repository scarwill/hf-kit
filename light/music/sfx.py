#!/usr/bin/env python3
"""Sound cues made for ONE video: a palette that fits its music, tuned to the music's key (numpy + scipy, no samples).
  python3 sfx.py cues.json <DUR> <out_sfx.wav> <palette> [--root 57] [--seed 3] [--max 30]
cues.json comes from lcheck.js ([t, kind, n, dt] per CUE). Kinds: whoosh hit chime blip tick err pop down type.
Palettes (pick the one that matches the music, never the same as the last video, see log.md):
  glass   airy sine plinks, breathy whoosh, soft sub hit, crystal chime   -> clean / futuristic / research topics
  analog  wooden clicks, paper swish, felt-piano hit, tape-wobble error   -> warm / human / history / tutorials
  chip    8-bit squares and noise                                         -> games / retro / playful
  pulse   deep sub thumps, sonar pings, filtered clicks                    -> tension / security / mysteries
  string  pizzicato plucks, bowed swells, timpani hit                     -> epic / cinematic / big stakes
--root = MIDI note of the music's key (57 = A3): chimes, pops and plucks are tuned to it, so the cues sit inside the music.
--max = keep at most this many cues (the strongest kinds first: hit, err, chime, whoosh ...): a Short sounds busy above ~30.
The old score.py cue sounds are NOT a palette here (the user rejected them on 25 Oct 2026).
"""
import argparse, json, wave, numpy as np
from scipy.signal import butter, sosfilt

SR = 44100
ap = argparse.ArgumentParser()
ap.add_argument('cues'); ap.add_argument('dur', type=float); ap.add_argument('out'); ap.add_argument('palette')
ap.add_argument('--root', type=int, default=57); ap.add_argument('--seed', type=int, default=3); ap.add_argument('--max', type=int, default=30)
a = ap.parse_args()
rng = np.random.default_rng(a.seed)
f = lambda m: 440 * 2 ** ((m - 69) / 12)
R = a.root
lp = lambda x, fc, o=2: sosfilt(butter(o, fc, 'low', fs=SR, output='sos'), x)
hp = lambda x, fc, o=2: sosfilt(butter(o, fc, 'high', fs=SR, output='sos'), x)
bp = lambda x, lo, hi, o=2: sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
tt = lambda L: np.arange(int(L * SR)) / SR
env = lambda t, att, dec: np.minimum(1, t / max(att, 1e-4)) * np.exp(-t * dec)
noise = lambda L: rng.standard_normal(int(L * SR))
sq = lambda fr, t: np.sign(np.sin(2 * np.pi * fr * t))


def bell(m, L=1.2, dec=4.):
    t = tt(L); return (np.sin(2 * np.pi * f(m) * t) + .35 * np.sin(2 * np.pi * f(m) * 2.76 * t) * np.exp(-t * 6)) * env(t, .002, dec)


def swish(L, lo, hi, curve=2.):
    t = tt(L); sh = np.sin(np.pi * np.clip(t / L, 0, 1)) ** curve; x = noise(L)
    half = len(t) // 2; return np.concatenate([bp(x[:half], lo, hi * .5), bp(x[half:], lo * 2, hi)]) * sh


def glass():
    t = tt(1.4); hit = np.sin(2 * np.pi * (40 * t + 50 * (1 - np.exp(-t * 14)) / 14)) * env(t, .004, 3.2) + .25 * bell(R + 24, 1.4, 3)
    t2 = tt(.5); err = (np.sin(2 * np.pi * f(R + 1) * t2) + np.sin(2 * np.pi * f(R + 2) * t2)) * env(t2, .005, 7) * .5   # soft dissonant cluster
    t3 = tt(.25); pop = np.sin(2 * np.pi * (f(R + 19) * t3 - 900 * t3 * t3)) * env(t3, .002, 16)
    t4 = tt(1.0); down = np.sin(2 * np.pi * (f(R + 12) * t4 - 160 * t4 * t4)) * env(t4, .01, 3.5)
    return dict(whoosh=(swish(.6, 600, 6000, 3) * .5, .35), hit=(hit, .7), chime=((bell(R + 24) + .6 * bell(R + 31)) * .6, .25),
                blip=(bell(R + 36, .12, 30), .15), tick=(hp(noise(.02), 5000) * env(tt(.02), .0005, 220), .14), err=(err, .3),
                pop=(pop, .22), down=(down, .25), key=(hp(noise(.015), 3500) * env(tt(.015), .0005, 300), .12))


def analog():
    t = tt(1.2); hit = lp(noise(1.2), 900) * env(t, .002, 9) * .6 + sum(np.sin(2 * np.pi * f(R + d) * t) for d in (0, 7, 12)) * env(t, .003, 3) * .4
    t2 = tt(.35); err = np.sin(2 * np.pi * f(R - 5) * t2 * (1 + .03 * np.sin(2 * np.pi * 7 * t2))) * env(t2, .004, 8)   # wobbly low note
    wood = lambda m, L=.08: bp(noise(L), f(m) * 4, f(m) * 6) * env(tt(L), .0005, 70) + np.sin(2 * np.pi * f(m) * 2 * tt(L)) * env(tt(L), .0005, 50)
    return dict(whoosh=(swish(.55, 300, 3000, 2) * .6, .3), hit=(hit, .65), chime=(bell(R + 19, 1.0, 5) + .5 * bell(R + 24, 1.0, 5), .22),
                blip=(wood(R + 24), .2), tick=(wood(R + 31, .05), .18), err=(err, .32), pop=(wood(R + 12, .12), .28),
                down=(np.sin(2 * np.pi * (f(R) * tt(.8) - 60 * tt(.8) ** 2)) * env(tt(.8), .01, 4), .25), key=(wood(R + 36, .03), .14))


def chip():
    t = tt(.5); hit = (sq(f(R - 12), t) * .5 + lp(noise(.5), 3000) * .5) * env(t, .001, 7)
    arp = lambda ms, d=.05: np.concatenate([sq(f(m), tt(d)) * env(tt(d), .001, 20) for m in ms])
    return dict(whoosh=(lp(noise(.4), 4000) * np.linspace(0, 1, int(.4 * SR)) ** 2 * .4, .25), hit=(hit, .5), chime=(arp([R + 12, R + 16, R + 19, R + 24]) * .5, .2),
                blip=(sq(f(R + 31), tt(.05)) * env(tt(.05), .001, 30) * .4, .15), tick=(sq(f(R + 36), tt(.02)) * .3 * env(tt(.02), .001, 120), .12),
                err=(arp([R + 6, R + 5, R + 4, R + 3], .06) * .5, .28), pop=(arp([R + 12, R + 24], .04) * .5, .2),
                down=(arp([R + 24, R + 19, R + 16, R + 12, R + 7], .06) * .5, .22), key=(lp(noise(.012), 6000) * .4, .1))


def pulse():
    t = tt(1.6); hit = np.sin(2 * np.pi * (32 * t + 40 * (1 - np.exp(-t * 10)) / 10)) * env(t, .006, 2.4)
    t2 = tt(.9); ping = np.sin(2 * np.pi * f(R + 24) * t2) * env(t2, .002, 5); ping = ping + .4 * np.roll(ping, int(.18 * SR))
    return dict(whoosh=(lp(swish(.8, 120, 1500, 2), 1500) * .8, .32), hit=(hit, .75), chime=(ping, .2), blip=(np.sin(2 * np.pi * f(R + 31) * tt(.06)) * env(tt(.06), .001, 40), .14),
                tick=(bp(noise(.03), 1500, 3000) * env(tt(.03), .0005, 140), .16), err=(lp(sq(f(R - 11), tt(.3)), 700) * env(tt(.3), .004, 9) * .5, .3),
                pop=(np.sin(2 * np.pi * (f(R + 12) * tt(.2) + 300 * tt(.2) ** 2)) * env(tt(.2), .002, 18), .2),
                down=(np.sin(2 * np.pi * (f(R) * tt(1.2) - 70 * tt(1.2) ** 2)) * env(tt(1.2), .01, 2.5), .28), key=(bp(noise(.015), 2000, 5000) * env(tt(.015), .0005, 260), .1))


def string():
    pizz = lambda m, L=.4: (np.sin(2 * np.pi * f(m) * tt(L)) + .5 * np.sin(4 * np.pi * f(m) * tt(L)) + .2 * np.sin(6 * np.pi * f(m) * tt(L))) * env(tt(L), .002, 12)
    t = tt(1.8); timp = np.sin(2 * np.pi * (f(R - 24) * 1.0 * t)) * env(t, .003, 2.2) + lp(noise(1.8), 400) * env(t, .002, 12) * .5
    sw = tt(.9); bow = sum(np.sin(2 * np.pi * f(R + d) * sw) for d in (0, 7, 12)) * np.sin(np.pi * np.clip(sw / .9, 0, 1)) ** 2 * .4
    return dict(whoosh=(bow, .25), hit=(timp, .75), chime=(pizz(R + 19) + pizz(R + 24) * .7, .25), blip=(pizz(R + 31, .2), .18), tick=(pizz(R + 36, .12), .15),
                err=(sum(np.sin(2 * np.pi * f(R + d) * tt(.6)) for d in (0, 1)) * env(tt(.6), .02, 5) * .5, .28), pop=(pizz(R + 24, .25), .22),
                down=(pizz(R + 12, .5) + pizz(R + 7, .5) * .6, .25), key=(pizz(R + 36, .06) * .5, .1))


P = {'glass': glass, 'analog': analog, 'chip': chip, 'pulse': pulse, 'string': string}[a.palette]()
cues = json.load(open(a.cues))
# keep the strongest cues when there are too many (a Short with 45 cues sounds busy)
rank = {'hit': 0, 'err': 1, 'chime': 2, 'whoosh': 3, 'down': 4, 'pop': 5, 'type': 6, 'blip': 7, 'tick': 8}
if len(cues) > a.max:
    keep = sorted(range(len(cues)), key=lambda i: (rank.get(cues[i][1], 9), cues[i][0]))[:a.max]
    cues = [cues[i] for i in sorted(keep)]
n = int(a.dur * SR); L, Rr = np.zeros(n), np.zeros(n)


def add(t, sig, g, pan=0.):
    i = int(t * SR); j = min(n, i + len(sig))
    if 0 <= i < n and j > i:
        L[i:j] += sig[:j - i] * g * (1 - pan); Rr[i:j] += sig[:j - i] * g * (1 + pan)


last = {}
for t, k, cnt, dt in cues:
    if k == 'type':
        sig, g = P['key']
        for j in range(int(cnt)):
            add(t + j * dt, sig * (.7 + .3 * rng.random()), g, (rng.random() - .5) * .3)
        continue
    if k not in P:
        continue
    sig, g = P[k]
    if k == 'whoosh':
        t -= .35
    if t - last.get(k, -9) < .12:      # the same sound twice in 0.12 s smears: drop it
        continue
    last[k] = t
    add(t, sig, g, (rng.random() - .5) * .25)
pk = max(np.abs(L).max(), np.abs(Rr).max(), 1e-9)
s = (np.clip(np.stack([L, Rr], 1) / pk * .8, -1, 1) * 32767).astype(np.int16)
w = wave.open(a.out, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(s.tobytes()); w.close()
print(f'{a.out}: {len(cues)} cues, palette {a.palette}, root {a.root}')
