# Custom "dark trap" score for the macOS git / eMudhra Short (28 Oct 2026): 140 bpm (half-time feel), sliding 808 bass,
# rolling hi-hats with triplet rolls, clap on 3, dark minor bell stabs. Hit on the hook, drop when the twist starts
# ("But Apple's own support page"), full stop before the update twist, back with only 808 + hats, resolve on the end card.
# usage: python3 trap.py DUR END out.wav HIT DROP STOP BACK   (video times)
import sys, numpy as np, wave
from scipy.signal import butter, sosfilt
SR = 44100
DUR, END = float(sys.argv[1]), float(sys.argv[2]); OUT = sys.argv[3]
HIT, DROP, STOP, BACK = map(float, sys.argv[4:8])
N = int(DUR * SR); L = np.zeros(N); R = np.zeros(N); rng = np.random.default_rng(11); T = np.arange(N) / SR
def f(m): return 440 * 2 ** ((m - 69) / 12)
def lpf(x, fc): return sosfilt(butter(2, fc, 'low', fs=SR, output='sos'), x)
def hpf(x, fc): return sosfilt(butter(2, fc, 'high', fs=SR, output='sos'), x)
def tt(d): return np.arange(int(d * SR)) / SR
def put(t, sig, g=1., pan=0.):
    i = int(t * SR)
    if i >= N or i < 0: return
    s = sig[:N - i]; L[i:i + len(s)] += s * g * (1 - pan); R[i:i + len(s)] += s * g * (1 + pan)
def b808(m, d, slide=0):
    t = tt(d); fr = f(m) * (1 + slide * np.clip(t / .12, 0, 1) * 0)
    fr = f(m) + (f(m + slide) - f(m)) * np.clip(t / .15, 0, 1) if slide else np.full(len(t), f(m))
    s = np.sin(2 * np.pi * np.cumsum(fr) / SR); s = np.tanh(2.2 * s)
    return lpf(s, 400) * np.minimum(1, t / .004) * np.exp(-t * 1.1) * np.clip((d - t) / .05, 0, 1)
def kick():
    t = tt(.35); return np.sin(2 * np.pi * np.cumsum(45 + 110 * np.exp(-t * 35)) / SR) * np.exp(-t * 9)
def clap():
    t = tt(.3); z = hpf(rng.standard_normal(len(t)), 1100)
    env = sum(np.exp(-np.clip(t - o, 0, None) * 60) * (t >= o) for o in (0, .012, .024)) * np.exp(-t * 8)
    return lpf(z * env, 6000)
def hat(d=.04):
    t = tt(d); return hpf(rng.standard_normal(len(t)), 8500) * np.exp(-t * 110)
def bell(m, d=1.2):
    t = tt(d); fr = f(m); return (np.sin(2 * np.pi * fr * t) + .5 * np.sin(2 * np.pi * fr * 2.01 * t) * np.exp(-t * 4) + .25 * np.sin(2 * np.pi * fr * 3.9 * t) * np.exp(-t * 9)) * np.exp(-t * 2.6)
def boom():
    t = tt(1.6); return np.tanh(2 * np.sin(2 * np.pi * np.cumsum(32 + 70 * np.exp(-t * 14)) / SR)) * np.exp(-t * 2.2)
def riser(d):
    t = tt(d); z = rng.standard_normal(len(t)); lo, hi = hpf(z, 1200), hpf(z, 6000); x = t / d
    return (lo * (1 - x) + hi * x) * x ** 2.5

BPM = 140; bt = 60 / BPM; s16 = bt / 4; bar = 4 * bt; HEAD = .2
ROOT = [40, 40, 43, 38]          # E E G D (E minor, dark)
STAB = [[64, 67, 71], [64, 67, 71], [67, 71, 74], [62, 66, 69]]
off = lambda t: STOP - .02 <= t < BACK - .02
lite = lambda t: t < HIT                       # intro: hats + bells only
thin = lambda t: t >= BACK                     # after the stop: 808 + hats
i = 0; t = HEAD
while t < END - .05:
    b16 = i % 16; bn = int((t - HEAD) // bar); r = ROOT[bn % 4]; big = t >= DROP
    if not off(t):
        # hats: 8ths, 16ths after the drop, triplet roll on the last beat of every 2nd bar
        if big and bn % 2 == 1 and b16 >= 12:
            for k in range(3): put(t + k * s16 / 3, hat(.025), .06, .25)
        elif b16 % (1 if big else 2) == 0: put(t, hat(), .07 if b16 % 4 == 0 else .045, .25)
        if not lite(t):
            if b16 in (0, 10) or (big and b16 == 7): put(t, kick(), .55)
            if b16 == 8 and not thin(t): put(t, clap(), .3, -.1)
            if b16 == 0: put(t, b808(r, bar * .55, slide=(12 if bn % 4 == 3 else 0)), .5)
            if b16 == 10: put(t, b808(r + (3 if bn % 2 else 0), bar * .3), .4)
        if b16 in (0, 6) and not thin(t):
            for k, m in enumerate(STAB[bn % 4]): put(t + k * .012, bell(m), .045 if not big else .055, (k - 1) * .3)
    t += s16; i += 1
put(HIT - .02, boom(), .55)
put(DROP - 1.2, riser(1.2), .08); put(DROP - .02, boom(), .5)
put(STOP - 1.0, riser(1.0), .06)
put(BACK, b808(40, 1.6), .5)
# resolve: E minor -> E major-ish bell + long 808
for k, m in enumerate([64, 68, 71, 76]): put(END + .05 + k * .08, bell(m, 2.4), .08, (k - 1.5) * .25)
put(END + .05, b808(40, 2.4), .5)
gate = 1 - .94 * np.clip(np.minimum((T - STOP) / .03, (BACK - T) / .03), 0, 1)
fade = np.clip(T / .2, 0, 1) * np.clip((DUR - T) / 1.4, 0, 1) * gate; L *= fade; R *= fade
s = np.stack([L, R], 1); s = s / (np.abs(s).max() + 1e-9) * .85
w = wave.open(OUT, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((s * 32767).astype(np.int16).tobytes()); w.close()
print('ok trap', OUT)
