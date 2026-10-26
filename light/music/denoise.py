#!/usr/bin/env python3
"""Music style "denoise": an 80s synthwave track that starts buried in tape static and comes clean step by step, like a diffusion model.
Static + a crushed arp -> the static drops in steps until the arp is clean -> a stutter section (only every 3rd note plays, glitch on the
"wrong" word) -> half-time build + riser -> synthwave drop (gated snare, octave bass) -> dead stop on the twist, then a rising sub drone and
filtered noise that "fills up" -> resolve into the major key; the static swells once more on the callback word, then a clean sparkle.
Made for noise -> clean stories (first used: Short "How AI video generation works", 26 Oct 2026). numpy + scipy, no samples.
  python3 denoise.py <DUR> <HEAD> <END> <out.wav> --clean T0,T1 --glitch A,B --wrong T --drop T --stop T --resolve T [--static T]
                     [--bpm 96] [--root 50] [--seed 9]
Times are VIDEO seconds (lbuild scene table / W() times): --clean = static starts to drop .. fully clean, --glitch = the stutter section,
--wrong = the glitch word, --drop = the reveal word, --stop = the twist, --resolve = the last scene start, --static = the callback word.
--root = MIDI root of the key (50 = D; minor before the resolve, major after).
"""
import argparse, wave, numpy as np
from scipy.signal import butter, sosfilt

SR = 44100
ap = argparse.ArgumentParser()
ap.add_argument('dur', type=float); ap.add_argument('head', type=float); ap.add_argument('end', type=float); ap.add_argument('out')
ap.add_argument('--clean', required=True); ap.add_argument('--glitch', required=True); ap.add_argument('--wrong', type=float, required=True)
ap.add_argument('--drop', type=float, required=True); ap.add_argument('--stop', type=float, required=True); ap.add_argument('--resolve', type=float, required=True)
ap.add_argument('--static', type=float, default=None); ap.add_argument('--bpm', type=float, default=96); ap.add_argument('--root', type=int, default=50)
ap.add_argument('--seed', type=int, default=9)
a = ap.parse_args()
c0, c1 = map(float, a.clean.split(',')); g0, g1 = map(float, a.glitch.split(','))
rng = np.random.default_rng(a.seed)
f = lambda m: 440 * 2 ** ((m - 69) / 12)
lp = lambda x, fc, o=2: sosfilt(butter(o, fc, 'low', fs=SR, output='sos'), x)
hp = lambda x, fc, o=2: sosfilt(butter(o, fc, 'high', fs=SR, output='sos'), x)
bp = lambda x, lo, hi, o=2: sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
N = int(a.dur * SR); T = np.arange(N) / SR
R, bt = a.root, 60 / a.bpm; bar = 4 * bt
MINOR = [[0, 3, 7], [-4, 0, 3], [3, 7, 10], [-2, 2, 5]]       # i VI III VII  (Dm Bb F C)
MAJOR = [[0, 4, 7], [-2, 2, 5], [5, 9, 12], [7, 11, 14]]       # I bVII IV V
chord_at = lambda t: (MAJOR if t >= a.resolve else MINOR)[int(max(0, t) // bar) % 4]
L, Rt = np.zeros(N), np.zeros(N)
tt = lambda d: np.arange(int(d * SR)) / SR
env = lambda t, att, dec: np.minimum(1, t / max(att, 1e-4)) * np.exp(-t * dec)


def add(t, sig, g=1., pan=0.):
    i = int(t * SR); j = min(N, i + len(sig))
    if i < 0:
        sig, i = sig[-i:], 0
    if i < N and j > i:
        L[i:j] += sig[:j - i] * g * (1 - pan); Rt[i:j] += sig[:j - i] * g * (1 + pan)


# amount of static 0..1: full until c0, drops in 4 steps to 0 at c1, swells back on --static for ~1.4 s
steps = np.linspace(c0, c1, 5)
noise_amt = np.ones(N)
for k, ts in enumerate(steps[1:]):
    noise_amt = np.where(T >= ts, 1 - (k + 1) / 4, noise_amt)
noise_amt = np.where(T >= c1, 0., noise_amt)
if a.static:
    sw = np.clip(1 - np.abs(T - a.static - .4) / 1.0, 0, 1)
    noise_amt = np.maximum(noise_amt, sw * .9)
noise_amt = lp(noise_amt, 12)

# ---- tape static: hiss + crackle, gated by noise_amt
hiss = bp(rng.standard_normal(N), 300, 7000) * .05
crk = np.zeros(N); idx = rng.integers(0, N, int(a.dur * 45)); crk[idx] = rng.standard_normal(len(idx)) * .8; crk = hp(crk, 1500)
add(0, (hiss + crk * .12) * noise_amt, 1.)

# ---- pad: detuned saws, muffled under the static, opening up as it clears; quiet drone between stop and resolve
pad = np.zeros(N); t = 0.
while t < a.dur:
    ch = chord_at(t + .01); d = bar + .5; x = tt(d); e = np.minimum(1, x / .3) * np.clip((d - x) / .5, 0, 1)
    s = sum(((f(R + m) * (1 + c / 1200) * x + rng.random()) % 1 * 2 - 1) for m in ch + [ch[0] - 12] for c in (-9, 0, 9)) * e * .022
    i = int(t * SR); j = min(N, i + len(s)); pad[i:j] += s[:j - i]; t += bar
pad_m, pad_o = lp(pad, 500), lp(pad, 2600)
open_ = 1 - noise_amt
pad = pad_m * (1 - open_) + pad_o * open_
pad *= np.where((T >= a.stop) & (T < a.resolve), 0., 1.)
add(0, pad, 1.)

# ---- 16th grid
step = bt / 4; t = 0.; k = 0
tk = tt(.4); KICK = np.sin(2 * np.pi * (46 * tk + 80 * (1 - np.exp(-tk * 30)) / 30)) * env(tk, .002, 8)
ts_ = tt(.5); SNARE = (bp(rng.standard_normal(len(ts_)), 900, 5000) * np.where(ts_ < .32, 1., np.exp(-(ts_ - .32) * 60)) * np.exp(-ts_ * 3)
                       + np.sin(2 * np.pi * 190 * ts_) * env(ts_, .001, 30) * .5)            # 80s gated snare
th = tt(.04); HAT = hp(rng.standard_normal(len(th)), 9000) * env(th, .0005, 110)
while t < a.end + 1.5:
    b16 = k % 16; ch = chord_at(t + .001); pre = t < c0; glitch = g0 <= t < g1; groove = a.drop <= t < a.stop
    tense = a.stop + .3 <= t < a.resolve; outro = t >= a.resolve; build = g1 <= t < a.drop
    # arp: 16ths; crushed while static is up; in the glitch section only every 3rd note ("keyframes"), with stutter repeats
    if not tense and (not outro or b16 % 2 == 0):
        m = R + 12 + ch[(k // (2 if outro else 1)) % 3] + (12 if groove and b16 >= 8 else 0); x = tt(.3)
        sq = np.sign(np.sin(2 * np.pi * f(m) * x)) * .5 + np.sin(2 * np.pi * f(m) * x) * .5
        na = float(noise_amt[min(N - 1, int(t * SR))])
        if na > .05:
            q = 2 + int((1 - na) * 10); sq = np.round(sq * q) / q                                   # bit-crush while noisy
        play = (k % 3 == 0) if glitch else True
        if play:
            add(t, lp(sq, 4200) * env(x, .002, 10 if not outro else 6), (.05 if pre else .065) * (1.15 if groove else 1), .35 * np.sin(k * .6))
        elif glitch and k % 3 == 1:
            add(t, lp(sq[:int(.04 * SR)], 3000) * .5, .05, -.3)                                  # stutter ghost
    # bass: from the clean point, 8ths; octave bounce in the drop
    if c1 <= t and not tense and not outro and b16 % 2 == 0 and not glitch or (glitch and b16 % 4 == 0):
        x = tt(step * 1.7); m = R + ch[0] - 24 + (12 if groove and b16 % 4 == 2 else 0)
        add(t, lp(((f(m) * x) % 1 * 2 - 1), 700) * env(x, .004, 6), .14 if groove else .1)
    if outro and b16 % 8 == 0:
        x = tt(bt * 2); add(t, lp(((f(R + ch[0] - 24) * x) % 1 * 2 - 1), 500) * env(x, .01, 1.5), .1)
    if build and b16 in (0, 8):                                                               # half-time kick in the build
        add(t, KICK, .3)
    if build and b16 % 2 == 1 and t > a.drop - bar:
        add(t, HAT, .03)
    if groove:
        if b16 % 4 == 0: add(t, KICK, .5)
        if b16 in (4, 12): add(t, SNARE, .22)
        if b16 % 2 == 1: add(t, HAT, .045, -.3)
    if tense and b16 % 4 == 0:                                                                # heartbeat through the twist
        x = tt(.25); add(t, np.sin(2 * np.pi * 55 * x) * env(x, .005, 14), .25)
    t += step; k += 1

# ---- glitch on the "wrong" word: pitch-dive + gated hole
x = tt(.6); add(a.wrong, np.sign(np.sin(2 * np.pi * (700 * x - 520 * x * x))) * env(x, .002, 6) * .06, 1., .2)
# ---- riser into the drop and impact
d = 2 * bar; x = tt(d); add(a.drop - d, bp(rng.standard_normal(len(x)), 600, 7000) * (x / d) ** 3 * .1)
x = tt(2.0); add(a.drop, np.sin(2 * np.pi * (38 * x + 40 * (1 - np.exp(-x * 9)) / 9)) * env(x, .003, 2.4) * .5 + lp(rng.standard_normal(len(x)), 6000) * env(x, .001, 8) * .1)
# ---- the twist: tape stop, then a sub drone that rises and a filtered noise that "fills up" until the resolve
x = tt(1.0); add(a.stop - .02, np.sin(2 * np.pi * (70 * x - 30 * x * x)) * env(x, .002, 4) * .25)
d = max(.5, a.resolve - a.stop - .3); x = tt(d)
add(a.stop + .3, np.sin(2 * np.pi * (f(R - 24) * x + 6 * x * x / d)) * np.minimum(1, x / 1.5) * .05)
fill = bp(rng.standard_normal(len(x)), 200, 1800) * (x / d) ** 1.6 * .09
add(a.stop + .3, fill)
# ---- sparkle on the end card
for o, m in enumerate([24, 28, 31, 36]):
    x = tt(2.2); add(a.end + .05 + o * .09, (np.sin(2 * np.pi * f(R + m) * x) + .3 * np.sin(2 * np.pi * f(R + m) * 2.76 * x) * np.exp(-x * 5)) * env(x, .002, 2.2), .06, (o - 1.5) * .2)

g = np.ones(N)
g = np.where((T >= a.stop) & (T < a.stop + .3), np.clip(1 - (T - a.stop) / .04, 0, 1), g)
g *= np.clip(T / .2, 0, 1) * np.clip((a.dur - T) / 1.2, 0, 1)
L *= g; Rt *= g
pk = max(np.abs(L).max(), np.abs(Rt).max(), 1e-9)
s = (np.clip(np.stack([L, Rt], 1) / pk * .7, -1, 1) * 32767).astype(np.int16)
w = wave.open(a.out, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(s.tobytes()); w.close()
print(f'{a.out}: denoise, {a.bpm} bpm, root {R}, clean {c0:.1f}-{c1:.1f}s glitch {g0:.1f}-{g1:.1f}s drop {a.drop:.1f}s stop {a.stop:.1f}s resolve {a.resolve:.1f}s')
