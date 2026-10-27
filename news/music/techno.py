# Custom "minimal techno" score for the Cloudflare KV cache Short: four-on-the-floor kick, offbeat hats, rolling sub bass,
# random "memory read" data blips, filter-opening pad; riser + full stop before the twist, drop on it, resolve on the end card.
# usage: python3 techno.py DUR END out.wav STOP DROP     (STOP = silence starts, DROP = everything comes back, video times)
import sys, numpy as np, wave
from scipy.signal import butter, sosfilt
SR = 44100
DUR, END = float(sys.argv[1]), float(sys.argv[2]); OUT = sys.argv[3]; STOP, DROP = float(sys.argv[4]), float(sys.argv[5])
N = int(DUR * SR); L = np.zeros(N); R = np.zeros(N); rng = np.random.default_rng(23); T = np.arange(N) / SR
def f(m): return 440 * 2 ** ((m - 69) / 12)
def lpf(x, fc): return sosfilt(butter(2, fc, 'low', fs=SR, output='sos'), x)
def hpf(x, fc): return sosfilt(butter(2, fc, 'high', fs=SR, output='sos'), x)
def put(t, sig, g=1., pan=0.):
    i = int(t * SR)
    if i >= N or i < 0: return
    s = sig[:N - i]; L[i:i + len(s)] += s * g * (1 - pan); R[i:i + len(s)] += s * g * (1 + pan)
def tt(d): return np.arange(int(d * SR)) / SR
def kick():
    t = tt(.35); return np.sin(2 * np.pi * np.cumsum(46 + 90 * np.exp(-t * 32)) / SR) * np.exp(-t * 9)
def hat(op=False):
    t = tt(.18 if op else .04); return hpf(rng.standard_normal(len(t)), 7500) * np.exp(-t * (22 if op else 120))
def clap():
    t = tt(.2); z = sosfilt(butter(2, [900, 2600], 'band', fs=SR, output='sos'), rng.standard_normal(len(t)))
    return z * (np.exp(-t * 30) + .6 * np.exp(-np.maximum(0, t - .012) * 30) * (t > .012))
def bass(m, d):
    t = tt(d); fr = f(m); s = np.sin(2 * np.pi * fr * t) + .25 * np.sin(4 * np.pi * fr * t)
    return s * np.minimum(1, t / .005) * np.exp(-t * 7)
def blip(m):
    t = tt(.09); return np.sin(2 * np.pi * f(m) * t) * np.exp(-t * 45) * np.minimum(1, t / .002)
def bell(m, d=3.):
    t = tt(d); fr = f(m); return (np.sin(2 * np.pi * fr * t) + .35 * np.sin(2 * np.pi * fr * 2.76 * t) * np.exp(-t * 3)) * np.exp(-t * 1.4)

BPM = 122; bt = 60 / BPM; s16 = bt / 4; HEAD = .2
CH = [[57, 60, 64], [53, 57, 60], [55, 59, 62], [52, 55, 59]]          # Am F G Em
BL = [45, 41, 43, 40]
quiet = lambda t: STOP - .02 <= t < DROP - .02
# pad: saw-ish chords, low-pass opens over the video
pad = np.zeros(N); bar = 4 * bt
for k in range(int(DUR / (2 * bar)) + 2):
    st = HEAD + k * 2 * bar; ch = CH[k % 4]; t = tt(2 * bar + .6)
    sig = sum(sum(np.sin(2 * np.pi * f(m) * h * t * (1 + d)) / h for h in (1, 2, 3)) for m in ch for d in (-.002, .002))
    sig *= np.minimum(1, t / .4) * np.clip((2 * bar + .6 - t) / .6, 0, 1) * .05
    i = int(st * SR)
    if i >= N: break
    j = min(N, i + len(sig)); pad[i:j] += sig[:j - i]
half = N // 2; pad = np.concatenate([lpf(pad[:half], 700), lpf(pad[half:], 1300)])
pad *= np.where((T >= STOP) & (T < DROP), .2, 1.); pad = lpf(pad, 3000)
L += pad; R += pad
i = 0; t = HEAD
while t < END - .05:
    b16 = i % 16; bn = int((t - HEAD) // bar); hot = t >= DROP
    if not quiet(t):
        if b16 % 4 == 0: put(t, kick(), .9)
        if b16 in (4, 12) and (hot or bn % 2 == 1): put(t, clap(), .22)
        if b16 % 4 == 2: put(t, hat(True), .1, .2)
        elif hot or b16 % 2 == 1: put(t, hat(), .06, -.25)
        if b16 in (2, 3, 6, 10, 11, 14): put(t, bass(BL[(bn // 2) % 4] + (12 if b16 in (3, 11) else 0), s16 * 1.6), .32)
        if rng.random() < (.5 if hot else .28) and b16 % 2 == 0:
            m = CH[(bn // 2) % 4][rng.integers(3)] + 24 + 12 * rng.integers(2); put(t, blip(m), .07, rng.uniform(-.6, .6))
    t += s16; i += 1
# riser into the stop, sub drop on the twist
rs = STOP - 1.8; t = tt(1.8); z = hpf(rng.standard_normal(len(t)), 2000) * (t / 1.8) ** 2
put(rs, z * .18); put(rs, np.sin(2 * np.pi * np.cumsum(200 + 900 * (t / 1.8) ** 2) / SR) * (t / 1.8) ** 2 * .05)
t = tt(1.4); put(DROP - .02, np.sin(2 * np.pi * np.cumsum(30 + 60 * np.exp(-t * 4)) / SR) * np.exp(-t * 2) * .9)
put(DROP - .02, hpf(rng.standard_normal(int(.6 * SR)), 3000) * np.exp(-tt(.6) * 6) * .2)
# end card: kick stops, Am resolve with bells
for k, m in enumerate([69, 72, 76, 81]): put(END + .05 + k * .12, bell(m), .12, (k - 1.5) * .2)
for m in (45, 57): put(END + .05, bass(m, 2.5) * np.exp(-tt(2.5) * -6.5)[:int(2.5 * SR)], .25)
fade = np.clip(T / .3, 0, 1) * np.clip((DUR - T) / 1.5, 0, 1); L *= fade; R *= fade
s = np.stack([L, R], 1); s = s / (np.abs(s).max() + 1e-9) * .85
w = wave.open(OUT, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((s * 32767).astype(np.int16).tobytes()); w.close()
print('ok techno', OUT)
