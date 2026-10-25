#!/usr/bin/env python3
"""Music style "layers": a track that builds one layer per scene (muffled pad -> bass pulse -> arpeggio -> hats), drops on the reveal,
stops dead on the twist (only a ticking clock and a low drone stay), then resolves into a major chord for the ending.
Made for "coarse-to-fine" stories (first used: NCM Short, 25 Oct 2026). numpy + scipy, no samples.
  python3 layers.py <DUR> <HEAD> <END> <out.wav> --scenes t2,t3,... --drop T --stop T --resolve T [--bpm 112] [--root 57] [--seed 5]
Times are VIDEO seconds (the lbuild scene table / W() times): --drop = the reveal word, --stop = the twist ("but here is the catch"),
--resolve = the last scene start. --root = MIDI root of the key (57 = A, minor before the resolve, major after).
"""
import argparse, wave, numpy as np
from scipy.signal import butter, sosfilt

SR = 44100
ap = argparse.ArgumentParser()
ap.add_argument('dur', type=float); ap.add_argument('head', type=float); ap.add_argument('end', type=float); ap.add_argument('out')
ap.add_argument('--scenes', default=''); ap.add_argument('--drop', type=float, required=True); ap.add_argument('--stop', type=float, required=True)
ap.add_argument('--resolve', type=float, required=True); ap.add_argument('--bpm', type=float, default=112); ap.add_argument('--root', type=int, default=57)
ap.add_argument('--seed', type=int, default=5)
a = ap.parse_args()
rng = np.random.default_rng(a.seed)
f = lambda m: 440 * 2 ** ((m - 69) / 12)
lp = lambda x, fc, o=2: sosfilt(butter(o, fc, 'low', fs=SR, output='sos'), x)
hp = lambda x, fc, o=2: sosfilt(butter(o, fc, 'high', fs=SR, output='sos'), x)
bp = lambda x, lo, hi, o=2: sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
N = int(a.dur * SR); T = np.arange(N) / SR
R, bt = a.root, 60 / a.bpm; bar = 4 * bt
sc = sorted(float(x) for x in a.scenes.split(',') if x.strip())
# layer entry times: bass at the 1st scene change, arp at the 2nd, hats one bar before the drop
t_bass = sc[0] if sc else a.head + 2 * bar
t_arp = sc[1] if len(sc) > 1 else t_bass + 2 * bar
t_hat = max(t_arp, a.drop - bar)
MINOR = [[0, 3, 7], [-4, 0, 3], [3, 7, 10], [-2, 2, 5]]       # i VI III VII
MAJOR = [[0, 4, 7], [5, 9, 12], [-3, 0, 4], [7, 11, 14]]       # I IV vi V
chord_at = lambda t: (MAJOR if t >= a.resolve else MINOR)[int(max(0, t - a.head) // bar) % 4]
L, Rt = np.zeros(N), np.zeros(N)


def add(t, sig, g=1., pan=0.):
    i = int(t * SR); j = min(N, i + len(sig))
    if i < 0:
        sig, i = sig[-i:], 0
    if i < N and j > i:
        L[i:j] += sig[:j - i] * g * (1 - pan); Rt[i:j] += sig[:j - i] * g * (1 + pan)


tt = lambda d: np.arange(int(d * SR)) / SR
env = lambda t, att, dec: np.minimum(1, t / max(att, 1e-4)) * np.exp(-t * dec)

# ---- pad: one chord per bar, muffled at the start, opening up to the drop (coarse -> fine); low drone between stop and resolve
pad_d, pad_b = np.zeros(N), np.zeros(N)
t = 0.
while t < a.dur:
    ch = chord_at(t + .01); d = bar + .6; x = tt(d); e = np.minimum(1, x / .4) * np.clip((d - x) / .6, 0, 1)
    s = sum(np.sin(2 * np.pi * f(R + m) * (1 + c / 1200) * x + rng.random() * 6) for m in ch + [ch[0] - 12] for c in (-7, 7)) * e * .05
    i = int(t * SR); j = min(N, i + len(s)); pad_d[i:j] += s[:j - i]; pad_b[i:j] += s[:j - i]
    t += bar
pad_d, pad_b = lp(pad_d, 380), lp(pad_b, 3200)
p = np.clip((T - a.head) / max(a.drop - a.head, 1), 0, 1) ** 1.5
p = np.where(T >= a.drop, 1., p); p = np.where((T >= a.stop) & (T < a.resolve), 0., p)
pad = pad_d * (1 - p) + pad_b * p
pad *= np.where((T >= a.stop) & (T < a.resolve), .55, 1.)
add(0, pad, 1.)

# ---- 16th grid from the voice start
step = bt / 4; t = a.head; k = 0
tk = tt(.4); KICK = np.sin(2 * np.pi * (48 * tk + 70 * (1 - np.exp(-tk * 28)) / 28)) * env(tk, .002, 8)
th = tt(.05); HAT = hp(rng.standard_normal(len(th)), 8000) * env(th, .0005, 90)
tc = tt(.18); CLAP = sum(np.roll(bp(rng.standard_normal(len(tc)), 900, 2600) * env(tc, .001, 22), int(o * SR)) for o in (0, .012, .022)) * .6
tclk = tt(.03); CLOCK = bp(rng.standard_normal(len(tclk)), 2500, 5000) * env(tclk, .0005, 150)
while t < a.end + 1.5:
    b16 = k % 16; ch = chord_at(t + .001); groove = a.drop <= t < a.stop; tense = a.stop + .35 <= t < a.resolve; outro = t >= a.resolve
    if not tense and not outro and t >= t_bass and b16 % 2 == 0:                       # bass pulse (8ths)
        x = tt(step * 1.8); add(t, lp(np.sign(np.sin(2 * np.pi * f(R + ch[0] - 24) * x)), 500) * env(x, .004, 7) * (.16 if groove else .11))
    if not tense and t >= t_arp and (not outro or b16 % 2 == 0):                        # arpeggio (16ths; 8ths in the outro)
        m = R + 12 + ch[(k // (2 if outro else 1)) % 3] + (12 if b16 >= 8 and groove else 0); x = tt(.35)
        add(t, (np.sin(2 * np.pi * f(m) * x) + .3 * np.sin(4 * np.pi * f(m) * x)) * env(x, .002, 11 if not outro else 6), .07 if not outro else .09, .35 * np.sin(k * .7))
    if (groove or (t_hat <= t < a.drop)) and b16 % 2 == 1:                              # offbeat hats
        add(t, HAT, .05 if groove else .03, -.3)
    if groove and b16 % 4 == 0:                                                          # four on the floor after the drop
        add(t, KICK, .5)
    if groove and b16 in (4, 12):
        add(t, CLAP, .18)
    if not groove and not tense and not outro and t >= t_arp and b16 in (0, 8):         # half-time kick in the build
        add(t, KICK, .32)
    if tense and b16 % 4 == 0:                                                           # the clock ticks through the twist
        add(t, CLOCK, .12, .2 if (k // 4) % 2 else -.2)
    t += step; k += 1

# ---- riser into the drop, impact on it, a dead stop on the twist, sparkle on the end card
d = 2 * bar; x = tt(d); add(a.drop - d, bp(rng.standard_normal(len(x)), 500, 6000) * (x / d) ** 3 * .12)
x = tt(2.0); add(a.drop, np.sin(2 * np.pi * (36 * x + 44 * (1 - np.exp(-x * 9)) / 9)) * env(x, .003, 2.2) * .55 + lp(rng.standard_normal(len(x)), 5000) * env(x, .001, 9) * .12)
x = tt(1.2); add(a.stop - .02, np.sin(2 * np.pi * (60 * x - 25 * x * x)) * env(x, .002, 4) * .25)        # "tape stop" thud on the twist
for o, m in enumerate([24, 28, 31, 36]):
    x = tt(2.2); add(a.end + .05 + o * .09, (np.sin(2 * np.pi * f(R + m) * x) + .3 * np.sin(2 * np.pi * f(R + m) * 2.76 * x) * np.exp(-x * 5)) * env(x, .002, 2.2), .06, (o - 1.5) * .2)

# ---- gate: silence right after the stop word, gentle fade in / out
g = np.ones(N)
g = np.where((T >= a.stop) & (T < a.stop + .35), np.clip(1 - (T - a.stop) / .04, 0, 1), g)
g *= np.clip(T / .3, 0, 1) * np.clip((a.dur - T) / 1.2, 0, 1)
L *= g; Rt *= g
pk = max(np.abs(L).max(), np.abs(Rt).max(), 1e-9)
s = (np.clip(np.stack([L, Rt], 1) / pk * .7, -1, 1) * 32767).astype(np.int16)
w = wave.open(a.out, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(s.tobytes()); w.close()
print(f'{a.out}: layers, {a.bpm} bpm, root {R}, bass {t_bass:.1f}s arp {t_arp:.1f}s hats {t_hat:.1f}s drop {a.drop:.1f}s stop {a.stop:.1f}s resolve {a.resolve:.1f}s')
