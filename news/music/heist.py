# Custom "heist" score for the PHP leak Short: plucked spy bass, ticking clock, marimba arp,
# stop + boom on the twist, double-time section after, resolve on the end card.
# usage: python3 heist.py DUR TWIST END out.wav
import sys, numpy as np, wave
from scipy.signal import butter, sosfilt
SR = 44100
DUR, TWIST, END = map(float, sys.argv[1:4]); OUT = sys.argv[4]
N = int(DUR * SR); L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(7)
def f(m): return 440 * 2 ** ((m - 69) / 12)
def lpf(x, fc): return sosfilt(butter(2, fc, 'low', fs=SR, output='sos'), x)
def hpf(x, fc): return sosfilt(butter(2, fc, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], 'band', fs=SR, output='sos'), x)
def put(t, sig, g=1., pan=0.):
    i = int(t * SR)
    if i >= N or i + len(sig) <= 0: return
    s = sig[:N - i] if i >= 0 else sig[-i:N - i]; i = max(i, 0)
    L[i:i + len(s)] += s * g * (1 - pan); R[i:i + len(s)] += s * g * (1 + pan)
def pluck(m, d=.5, bright=1., dec=6.):
    t = np.arange(int(d * SR)) / SR; fr = f(m); x = np.zeros_like(t)
    for k in range(1, 9):
        x += np.sin(2 * np.pi * fr * k * t * (1 + .0007 * k * k)) / k ** (1.6 - .5 * bright) * np.exp(-t * dec * (1 + .55 * k))
    return x * np.minimum(1, t / .002)
def marimba(m, d=.7):
    t = np.arange(int(d * SR)) / SR; fr = f(m)
    x = np.sin(2 * np.pi * fr * t) * np.exp(-t * 5) + .35 * np.sin(2 * np.pi * fr * 3.93 * t) * np.exp(-t * 18) + .12 * np.sin(2 * np.pi * fr * 9.2 * t) * np.exp(-t * 40)
    return x * np.minimum(1, t / .001)
def kick(g=1.):
    t = np.arange(int(.35 * SR)) / SR; ph = 2 * np.pi * np.cumsum(48 + 90 * np.exp(-t * 28)) / SR
    return np.sin(ph) * np.exp(-t * 9) * g
def clap():
    t = np.arange(int(.22 * SR)) / SR; n = bp(rng.standard_normal(len(t)), 900, 4000)
    e = np.exp(-t * 22) * (1 + .6 * np.exp(-((t - .012) / .003) ** 2) + .5 * np.exp(-((t - .024) / .003) ** 2))
    return n * e * .5
def tick(hi=True):
    t = np.arange(int(.05 * SR)) / SR; fr = 2600 if hi else 1900
    return (np.sin(2 * np.pi * fr * t) * .7 + hpf(rng.standard_normal(len(t)), 5000) * .25) * np.exp(-t * 140)
def hat(open_=False):
    t = np.arange(int((.18 if open_ else .04) * SR)) / SR
    return hpf(rng.standard_normal(len(t)), 7500) * np.exp(-t * (18 if open_ else 110)) * .35
def boom():
    t = np.arange(int(2.2 * SR)) / SR; ph = 2 * np.pi * np.cumsum(32 + 70 * np.exp(-t * 6)) / SR
    return np.sin(ph) * np.exp(-t * 1.6) * 1.4 + lpf(rng.standard_normal(len(t)), 400) * np.exp(-t * 4) * .5
def riser(d):
    t = np.arange(int(d * SR)) / SR; n = rng.standard_normal(len(t)); out = np.zeros_like(t); seg = int(.05 * SR)
    for i in range(0, len(t), seg):
        fc = 300 + 7000 * (i / len(t)) ** 2; out[i:i + seg] = bp(n[i:i + seg + 2000], fc * .7, fc * 1.3)[:len(out[i:i + seg])]
    return out * (t / d) ** 2 * .6
def drone(d, ms):
    t = np.arange(int(d * SR)) / SR; x = np.zeros_like(t)
    for m in ms:
        for dt in (-.08, 0, .07): x += np.sin(2 * np.pi * f(m) * (1 + dt / 100) * t + 2 * np.sin(2 * np.pi * 5.2 * t) * .002)
    x = lpf(x, 1600); env = np.minimum(1, t / 1.2) * np.minimum(1, (d - t) / .6)
    return x * env * .12
BPM = 124; b8 = 60 / BPM / 2; bar = 8 * b8
# bass ostinato in E minor (spy line), two variants
BA = [40, 40, 43, 40, 45, 40, 43, 42]; BB = [40, 52, 40, 50, 40, 47, 40, 46]
ARP = [[64, 67, 71, 74], [64, 67, 72, 76], [62, 66, 69, 74], [63, 66, 71, 75]]
t0 = .2; t = t0; k = 0
while t < END - .05:
    sec = 'A' if t < TWIST - 1.0 else ('GAP' if t < TWIST + .05 else ('B' if t < 33.0 else 'C'))
    pos = k % 8; barn = k // 8
    if sec == 'A':
        put(t, pluck(BA[pos], .45, .6, 7), .55, -.1)
        put(t, tick(pos % 2 == 0), .22, .5)
        if pos in (0, 4): put(t, kick(.8), .8)
        if pos in (2, 6) and barn >= 1: put(t, clap(), .35, .1)
        if barn >= 2 and pos % 2 == 1: put(t, marimba(ARP[barn % 4][(pos // 2) % 4], .6), .28, .3)
    elif sec in ('B', 'C'):
        g = 1. if sec == 'B' else .8
        put(t, pluck(BB[pos], .4, .9, 8), .6 * g, -.1)
        put(t, tick(True), .2, .5); put(t + b8 / 2, tick(False), .12, -.5)
        if pos % 2 == 0: put(t, kick(1.), .9 * g)
        if pos in (2, 6): put(t, clap(), .45 * g, .1)
        put(t + b8 / 2, hat(pos == 7), .5 * g, -.3)
        put(t, marimba(ARP[barn % 4][pos % 4] + (12 if sec == 'B' and pos % 4 == 3 else 0), .5), .26 * g, .3 if pos % 2 else -.3)
    t += b8; k += 1
# tension drone through A, darker drone through B/C
put(t0, drone(TWIST - 1.0 - t0, [28, 40, 47]), .9)
put(TWIST + .05, drone(END - TWIST - .05, [28, 35, 40, 43]), 1.1)
# the twist: riser into a short silence, then boom
put(TWIST - 1.0, riser(.95), .9)
put(TWIST + .02, boom(), 1.)
# end card resolve: Em(add9) marimba roll + low pluck, ring out
for i, m in enumerate([52, 59, 64, 66, 67, 71]): put(END + .05 + i * .07, marimba(m, 1.6), .3, -.4 + i * .16)
put(END + .05, pluck(28, 1.8, .4, 1.6), .7)
# master: gentle glue + fade
mx = np.maximum(np.abs(L).max(), np.abs(R).max()); L /= mx; R /= mx
fade = np.ones(N); fl = int(.4 * SR); fade[-fl:] = np.linspace(1, 0, fl); L *= fade * .89; R *= fade * .89
w = wave.open(OUT, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((np.stack([L, R], 1) * 32767).astype(np.int16).tobytes()); w.close(); print('ok', OUT, round(DUR, 2))
