# Custom "tension pulse" score for the eMudhra Short: low sidechained pulse, sonar pings, glassy plucks,
# hits on given times, resolve on the end card. usage: python3 pulse.py DUR END out.wav HIT1 HIT2 ...
import sys, numpy as np, wave
from scipy.signal import butter, sosfilt
SR = 44100
DUR, END = float(sys.argv[1]), float(sys.argv[2]); OUT = sys.argv[3]; HITS = [float(x) for x in sys.argv[4:]]
N = int(DUR * SR); L = np.zeros(N); R = np.zeros(N); rng = np.random.default_rng(11)
def f(m): return 440 * 2 ** ((m - 69) / 12)
def lpf(x, fc): return sosfilt(butter(2, fc, 'low', fs=SR, output='sos'), x)
def hpf(x, fc): return sosfilt(butter(2, fc, 'high', fs=SR, output='sos'), x)
def put(t, sig, g=1., pan=0.):
    i = int(t * SR)
    if i >= N: return
    s = sig[:N - i]; L[i:i + len(s)] += s * g * (1 - pan); R[i:i + len(s)] += s * g * (1 + pan)
def ping(m, d=1.4):
    t = np.arange(int(d * SR)) / SR; fr = f(m)
    return (np.sin(2 * np.pi * fr * t) + .4 * np.sin(2 * np.pi * fr * 2.76 * t) * np.exp(-t * 6)) * np.exp(-t * 3.2) * np.minimum(1, t / .002)
def glass(m, d=.5):
    t = np.arange(int(d * SR)) / SR; fr = f(m)
    return (np.sin(2 * np.pi * fr * t) + .5 * np.sin(2 * np.pi * fr * 3 * t) * np.exp(-t * 20)) * np.exp(-t * 9)
def kick(g=1.):
    t = np.arange(int(.4 * SR)) / SR; ph = 2 * np.pi * np.cumsum(42 + 70 * np.exp(-t * 25)) / SR
    return np.sin(ph) * np.exp(-t * 7) * g
def tick():
    t = np.arange(int(.03 * SR)) / SR
    return hpf(rng.standard_normal(len(t)), 6000) * np.exp(-t * 150) * .3
def hit():
    t = np.arange(int(2.5 * SR)) / SR; ph = 2 * np.pi * np.cumsum(30 + 80 * np.exp(-t * 8)) / SR
    return np.sin(ph) * np.exp(-t * 1.5) * 1.3 + lpf(rng.standard_normal(len(t)), 1800) * np.exp(-t * 6) * .6
BPM = 96; b8 = 60 / BPM / 2
ROOT = [38, 38, 41, 36]   # D, D, F, C (minor, tense)
# sidechained sub pulse on 8ths
t = .2; k = 0
while t < END - .05:
    barn = k // 8; pos = k % 8; m = ROOT[barn % 4]
    d = b8; tt = np.arange(int(d * SR)) / SR
    duck = np.minimum(1, tt / (d * .55)) ** 2
    sub = (np.sin(2 * np.pi * f(m) * tt) + .35 * np.sin(2 * np.pi * f(m + 12) * tt)) * duck
    put(t, lpf(sub, 500), .55)
    if pos in (0, 4) and barn >= 1: put(t, kick(), .75)
    if pos % 2 == 1: put(t, tick(), .7, .4 if pos % 4 == 1 else -.4)
    if pos in (3, 6) and barn >= 2: put(t, glass([62, 65, 69, 72][(barn + pos) % 4] + 12), .12, .5 if pos == 3 else -.5)
    if pos == 0 and barn % 2 == 0: put(t, ping(74 if barn % 4 == 0 else 77), .16, -.3)
    t += b8; k += 1
for h in HITS:
    i0 = int((h - .25) * SR); i1 = int((h + .02) * SR); L[i0:i1] *= .2; R[i0:i1] *= .2
    put(h, hit(), 1.)
for i, m in enumerate([50, 57, 62, 65, 69]): put(END + .05 + i * .08, ping(m, 2.0), .22, -.4 + i * .2)
put(END + .05, kick(1.2), .8)
mx = max(np.abs(L).max(), np.abs(R).max()); L /= mx; R /= mx
fl = int(.4 * SR); L[-fl:] *= np.linspace(1, 0, fl); R[-fl:] *= np.linspace(1, 0, fl)
w = wave.open(OUT, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((np.stack([L, R], 1) * .89 * 32767).astype(np.int16).tobytes()); w.close(); print('ok', OUT)
