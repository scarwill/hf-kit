# Custom "synthwave" score for the Qwen-to-Beijing Short: 100 bpm, filtered saw arpeggio, wide detuned pad, eighth-note bass,
# gated retro snare; full stop before the twist, comes back in half-time (calmer: the caveat), bell resolve on the end card.
# usage: python3 synthwave.py DUR END out.wav STOP BACK     (STOP = silence starts, BACK = half-time groove starts, video times)
import sys, numpy as np, wave
from scipy.signal import butter, sosfilt
SR = 44100
DUR, END = float(sys.argv[1]), float(sys.argv[2]); OUT = sys.argv[3]; STOP, BACK = float(sys.argv[4]), float(sys.argv[5])
N = int(DUR * SR); L = np.zeros(N); R = np.zeros(N); rng = np.random.default_rng(31); T = np.arange(N) / SR
def f(m): return 440 * 2 ** ((m - 69) / 12)
def lpf(x, fc): return sosfilt(butter(2, fc, 'low', fs=SR, output='sos'), x)
def hpf(x, fc): return sosfilt(butter(2, fc, 'high', fs=SR, output='sos'), x)
def tt(d): return np.arange(int(d * SR)) / SR
def put(t, sig, g=1., pan=0.):
    i = int(t * SR)
    if i >= N or i < 0: return
    s = sig[:N - i]; L[i:i + len(s)] += s * g * (1 - pan); R[i:i + len(s)] += s * g * (1 + pan)
def saw(fr, t, nh=10): return sum(np.sin(2 * np.pi * fr * k * t) / k for k in range(1, nh + 1))
def kick():
    t = tt(.4); return np.sin(2 * np.pi * np.cumsum(48 + 80 * np.exp(-t * 28)) / SR) * np.exp(-t * 7)
def snare():
    t = tt(.35); z = hpf(rng.standard_normal(len(t)), 1200) * np.exp(-t * 9) * (t < .22) + np.sin(2 * np.pi * 190 * t) * np.exp(-t * 25) * .6
    return z
def hat():
    t = tt(.05); return hpf(rng.standard_normal(len(t)), 8000) * np.exp(-t * 90)
def arp(m, d):
    t = tt(d); return lpf(saw(f(m), t, 6), 2600) * np.minimum(1, t / .004) * np.exp(-t * 9)
def bassn(m, d):
    t = tt(d); return lpf(saw(f(m), t, 5), 500) * np.minimum(1, t / .006) * np.clip((d - t) / .03, 0, 1)
def bell(m, d=3.):
    t = tt(d); fr = f(m); return (np.sin(2 * np.pi * fr * t) + .35 * np.sin(2 * np.pi * fr * 2.76 * t) * np.exp(-t * 3)) * np.exp(-t * 1.3)

BPM = 100; bt = 60 / BPM; s16 = bt / 4; bar = 4 * bt; HEAD = .2
CH = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]     # Am F C G
BS = [45, 41, 36, 43]
stop = lambda t: STOP - .02 <= t < BACK - .02
pad = np.zeros(N)
for k in range(int(DUR / bar) + 2):
    st = HEAD + k * bar; ch = CH[k % 4]; t = tt(bar + .5)
    sig = sum(saw(f(m) * (1 + d), t, 6) for m in ch for d in (-.004, 0, .004)) * np.minimum(1, t / .3) * np.clip((bar + .5 - t) / .5, 0, 1) * .025
    i = int(st * SR)
    if i >= N: break
    j = min(N, i + len(sig)); pad[i:j] += sig[:j - i]
pad = lpf(pad, 1500) * np.where((T >= STOP) & (T < BACK), .15, 1.)
L += pad * 1.05; R += pad * .95
i = 0; t = HEAD
while t < END - .05:
    b16 = i % 16; bn = int((t - HEAD) // bar); ch = CH[bn % 4]; half = t >= BACK
    if not stop(t):
        if (b16 in (0, 8) and not half) or (half and b16 == 0): put(t, kick(), .8)
        if (b16 in (4, 12) and not half) or (half and b16 == 8): put(t, snare(), .22)
        if b16 % 2 == 0 and not half: put(t, hat(), .05, .3)
        if b16 % 2 == 0: put(t, bassn(BS[bn % 4] + (12 if b16 % 4 == 2 else 0), s16 * 1.8), .22)
        if not half or b16 % 2 == 0:
            m = (ch + [ch[0] + 12])[(b16 // (2 if half else 1)) % 4] + 12; put(t, arp(m, s16 * 1.5), .07, .35 if b16 % 2 else -.35)
    t += s16; i += 1
# stop hit + soft reverse swell into BACK, resolve on the end card
t = tt(1.0); put(BACK - 1.0, lpf(rng.standard_normal(len(t)), 1800) * (t / 1.0) ** 3 * .12)
for k, m in enumerate([57, 64, 69, 72]): put(END + .05 + k * .1, bell(m + 12), .1, (k - 1.5) * .25)
put(END + .05, bassn(45, 2.0) * np.exp(-tt(2.0) * 1.5), .25)
fade = np.clip(T / .3, 0, 1) * np.clip((DUR - T) / 1.5, 0, 1); L *= fade; R *= fade
s = np.stack([L, R], 1); s = s / (np.abs(s).max() + 1e-9) * .85
w = wave.open(OUT, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((s * 32767).astype(np.int16).tobytes()); w.close()
print('ok synthwave', OUT)
