# Custom chiptune score for the WorldTUI Short: 8-bit square arps, triangle bass, noise drums,
# glitch stutter on the hook, a dreamy half-time break on "dream of a computer", resolve on the end card.
# usage: python3 chip.py DUR DREAM_START DREAM_END END out.wav
import sys, numpy as np, wave
from scipy.signal import butter, sosfilt
SR = 44100
DUR, D0, D1, END = map(float, sys.argv[1:5]); OUT = sys.argv[5]
N = int(DUR * SR); L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(3)
def f(m): return 440 * 2 ** ((m - 69) / 12)
def lpf(x, fc): return sosfilt(butter(2, fc, 'low', fs=SR, output='sos'), x)
def hpf(x, fc): return sosfilt(butter(2, fc, 'high', fs=SR, output='sos'), x)
def put(t, sig, g=1., pan=0.):
    i = int(t * SR)
    if i >= N: return
    s = sig[:N - i]; L[i:i + len(s)] += s * g * (1 - pan); R[i:i + len(s)] += s * g * (1 + pan)
def sq(m, d, duty=.25, dec=7.):
    t = np.arange(int(d * SR)) / SR; ph = (f(m) * t) % 1
    x = np.where(ph < duty, 1., -1.) * np.exp(-t * dec) * np.minimum(1, t / .003)
    return lpf(x, 5200)
def tri(m, d, dec=3.):
    t = np.arange(int(d * SR)) / SR; ph = (f(m) * t) % 1
    return (4 * np.abs(ph - .5) - 1) * np.exp(-t * dec) * np.minimum(1, t / .004)
def nkick():
    t = np.arange(int(.2 * SR)) / SR; ph = 2 * np.pi * np.cumsum(55 + 160 * np.exp(-t * 35)) / SR
    return np.sign(np.sin(ph)) * .5 * np.exp(-t * 14) + np.sin(ph) * .6 * np.exp(-t * 10)
def nsnare():
    t = np.arange(int(.16 * SR)) / SR; n = np.sign(rng.standard_normal(len(t)))
    return lpf(n, 6000) * np.exp(-t * 20) * .45
def nhat():
    t = np.arange(int(.03 * SR)) / SR
    return hpf(np.sign(rng.standard_normal(len(t))), 8000) * np.exp(-t * 120) * .25
def pad(ms, d):
    t = np.arange(int(d * SR)) / SR; x = sum(np.sin(2 * np.pi * f(m) * t * (1 + .003 * np.sin(2 * np.pi * .3 * t))) for m in ms)
    return lpf(x, 1400) * np.minimum(1, t / .8) * np.minimum(1, (d - t) / .8) * .18
BPM = 112; s16 = 60 / BPM / 4
PROG = [[57, 60, 64, 67], [53, 57, 60, 64], [48, 52, 55, 60], [55, 59, 62, 67]]   # Am7 Fmaj7 C G
BASS = [45, 41, 36, 43]
t = .2; k = 0
while t < END - .05:
    pos = k % 16; barn = k // 16; ch = PROG[barn % 4]
    dream = D0 - .1 <= t < D1
    if dream:
        if pos == 0: put(t, pad([m - 12 for m in ch] + [ch[0]], 16 * s16), 1.)
        if pos % 4 == 0: put(t, sq(ch[(pos // 4) % 4] + 12, .6, .5, 3), .12, .4)
    else:
        put(t, sq(ch[pos % 4] + (12 if pos % 8 >= 4 else 0), .16, .25, 14), .22, .35 if pos % 2 else -.35)
        if pos in (0, 6, 8, 14): put(t, tri(BASS[barn % 4] if pos < 8 else BASS[barn % 4] + 12 * (pos == 14), .32), .55)
        if pos in (0, 8) or (pos == 11 and barn % 2): put(t, nkick(), .7)
        if pos in (4, 12): put(t, nsnare(), .6, .1)
        if pos % 2 == 0 and barn >= 1: put(t, nhat(), .8, -.2)
        if barn >= 2 and pos in (2, 10): put(t, sq(ch[3] + 24, .25, .125, 8), .1, -.5)
    t += s16; k += 1
# hook glitch: stutter repeats of the first 1/16 around "fake" (~1.1 s)
i0 = int(1.05 * SR); seg = L[i0:i0 + int(s16 * SR / 2)].copy(), R[i0:i0 + int(s16 * SR / 2)].copy()
for j in range(6):
    a = i0 + j * len(seg[0]); L[a:a + len(seg[0])] = seg[0] * (1 - j * .1); R[a:a + len(seg[1])] = seg[1] * (1 - j * .1)
# end card: arpeggiated Am(add9) in squares, ring out
for i, m in enumerate([57, 60, 64, 71, 72, 76]): put(END + .05 + i * .06, sq(m, 1.2, .5, 2.5), .16, -.4 + i * .16)
put(END + .05, tri(33, 1.6, 1.5), .6)
mx = max(np.abs(L).max(), np.abs(R).max()); L /= mx; R /= mx
fl = int(.4 * SR); L[-fl:] *= np.linspace(1, 0, fl); R[-fl:] *= np.linspace(1, 0, fl)
w = wave.open(OUT, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((np.stack([L, R], 1) * .89 * 32767).astype(np.int16).tobytes()); w.close(); print('ok', OUT)
