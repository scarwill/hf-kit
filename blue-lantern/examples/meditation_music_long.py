# 1-hour meditation track (60 min, MP3). Fully synthesised in Python, no samples.
# Warm drone pad in D that slowly drifts through chords (never the same order twice), singing-bowl strikes,
# soft wind / ocean bed, gentle 10 s "breathing" swell, very quiet 4 Hz binaural shimmer (best on headphones), rare high chimes.
#
# Needs: Python 3, numpy, scipy, and ffmpeg on PATH.
#   pip install numpy scipy
#   python meditation_1hour.py                 -> meditation_1hour.mp3 (60 min)
#   python meditation_1hour.py 10              -> 10 min test version
#   python meditation_1hour.py 60 7            -> 60 min, different random seed = a different-sounding track
# The audio is made in 20 s blocks and streamed straight into ffmpeg, so it uses little memory and no big temp files.
import sys, subprocess
import numpy as np
from scipy.signal import butter, lfilter, lfilter_zi

MIN = float(sys.argv[1]) if len(sys.argv) > 1 else 60.0
SEED = int(sys.argv[2]) if len(sys.argv) > 2 else 11
OUT = f'meditation_{int(MIN)}min.mp3' if MIN != 60 else 'meditation_1hour.mp3'
SR, DUR, BLK = 44100, MIN * 60.0, 20.0
rng = np.random.default_rng(SEED)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)

# ---------- plan the whole hour first (so blocks join seamlessly) ----------
CHORDS = [[50, 57, 62, 66, 69], [50, 54, 59, 62, 66], [50, 55, 59, 62, 67], [50, 55, 59, 64, 67],
          [50, 57, 62, 64, 69], [50, 54, 57, 62, 64], [50, 57, 61, 64, 69]]          # D, Bm/D, G/D, Em/D, Dadd9, D6/9, A/D
XF = 10.0                                                                              # chord crossfade (s)
segs, t0, last = [], 0.0, -1
while t0 < DUR + XF:
    c = rng.integers(len(CHORDS))
    while c == last: c = rng.integers(len(CHORDS))
    ln = rng.uniform(30, 48); segs.append((t0, t0 + ln, CHORDS[c])); t0 += ln; last = c

def seg_weight(t, a, b):                       # 1 inside the segment, raised-cosine in/out over XF
    up = np.clip((t - (a - XF / 2)) / XF, 0, 1); dn = np.clip(((b + XF / 2) - t) / XF, 0, 1)
    return (0.5 - 0.5 * np.cos(np.pi * up)) * (0.5 - 0.5 * np.cos(np.pi * dn))

def chord_at(tt):
    for a, b, ch in segs:
        if a <= tt < b: return ch
    return CHORDS[0]

bowls, tt = [], 0.4                             # singing bowls every 20-40 s, note from the current chord
while tt < DUR - 10:
    bowls.append((tt, hz(rng.choice(chord_at(tt)[1:]) - (12 if rng.random() < .35 else 0)), rng.uniform(.25, .75), rng.uniform(.05, .08)))
    tt += rng.uniform(20, 40)
chimes, tt = [], 8.0                            # quiet high chimes every 12-30 s
while tt < DUR - 6:
    chimes.append((tt, hz(rng.choice([74, 78, 81, 86, 83])), rng.random())); tt += rng.uniform(12, 30)

def bowl(f, tt):                                # tt = seconds since the strike (array)
    s = sum(a * np.sin(2 * np.pi * f * m * tt) * (1 + .15 * np.sin(2 * np.pi * bt * tt)) * np.exp(-tt * d)
            for m, a, d, bt in [(1, 1, .45, .8), (2.71, .5, .7, 1.3), (5.05, .22, 1.2, 2.1), (7.9, .08, 2, 3)])
    return s * np.minimum(1, tt / .01)
def chime(f, tt):
    return (np.sin(2 * np.pi * f * tt) + .3 * np.sin(2 * np.pi * f * 3.01 * tt) * np.exp(-tt * 3)) * np.exp(-tt * 1.1) * np.minimum(1, tt / .003)

class Filt:                                     # IIR filter that keeps its state across blocks (no clicks at block joins)
    def __init__(s, b, a): s.b, s.a, s.z = b, a, None
    def __call__(s, x):
        if s.z is None: s.z = lfilter_zi(s.b, s.a) * x[0]
        y, s.z = lfilter(s.b, s.a, x, zi=s.z); return y
lp = lambda fc: Filt(*butter(2, fc / (SR / 2)))
bp = lambda f1, f2: Filt(*butter(2, [f1 / (SR / 2), f2 / (SR / 2)], 'band'))
F = dict(padL=lp(1800), padR=lp(1800), wL=lp(500), wR=lp(520), hL=bp(1500, 4000), hR=bp(1500, 4000))

GAIN = 12.0                                     # calm level (~ -16 dBFS RMS); a soft limiter below keeps peaks safe
ff = subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', 'pipe:0',
                       '-c:a', 'libmp3lame', '-b:a', '192k', OUT], stdin=subprocess.PIPE)
nblk = int(np.ceil(DUR / BLK)); sq = 0.0; ns = 0
for k in range(nblk):
    a = k * BLK; n = int(round(min(BLK, DUR - a) * SR)); t = a + np.arange(n) / SR
    L = np.zeros(n); R = np.zeros(n)
    breath = .78 + .22 * np.sin(2 * np.pi * t / 10 - np.pi / 2)              # 6 slow breaths per minute
    drift = .85 + .15 * np.sin(2 * np.pi * t / 240)                         # 4-minute swell of the whole pad
    # drone pad: every chord segment that overlaps this block, soft detuned sines + 2 harmonics
    for sa, sb, ch in segs:
        if sb + XF / 2 < a or sa - XF / 2 > a + BLK: continue
        w = seg_weight(t, sa, sb)
        for j, m in enumerate(ch):
            f = hz(m)
            for det, pan in ((-.06, .35), (.05, .65)):
                ph = 2 * np.pi * f * 2 ** (det / 12) * t + j * 1.7
                v = (np.sin(ph) + .25 * np.sin(2 * ph) + .08 * np.sin(3 * ph)) * w * (.9 if j == 0 else .5)
                L += v * (1 - pan); R += v * pan
    L = F['padL'](L) * .022 * breath * drift; R = F['padR'](R) * .022 * breath * drift
    # binaural shimmer 200 / 204 Hz
    L += np.sin(2 * np.pi * 200 * t) * .010 * breath; R += np.sin(2 * np.pi * 204 * t) * .010 * breath
    # wind / ocean bed with slow surges (8.5 s waves + a 3-minute tide)
    nz = rng.standard_normal((2, n)); surge = (.5 + .5 * np.sin(2 * np.pi * t / 8.5 + 1) ** 2) * (.8 + .2 * np.sin(2 * np.pi * t / 180))
    L += F['wL'](nz[0]) * .035 * surge; R += F['wR'](nz[1]) * .035 * surge
    L += F['hL'](nz[1]) * .004 * surge; R += F['hR'](nz[0]) * .004 * surge
    # singing bowls and chimes that sound during this block (they may have started in an earlier block)
    for st, f, pan, g in bowls:
        if st > a + BLK or st + 9 < a: continue
        tt = t - st; m = tt >= 0; s = np.zeros(n); s[m] = bowl(f, tt[m]) * g * (tt[m] < 9)
        L += s * (1.2 - pan); R += s * (.2 + pan)
    for st, f, p in chimes:
        if st > a + BLK or st + 4 < a: continue
        tt = t - st; m = tt >= 0; s = np.zeros(n); s[m] = chime(f, tt[m]) * .018 * (tt[m] < 4)
        L += s * (1 - p); R += s * p
    # fades (10 s in, 20 s out), level, soft limiter
    fade = np.minimum(1, t / 10) * np.minimum(1, (DUR - t) / 20)
    blk = np.stack([L, R], 1) * fade[:, None] * GAIN
    blk = np.tanh(blk * 1.1) / 1.1
    sq += float((blk ** 2).sum()); ns += blk.size
    ff.stdin.write(blk.astype(np.float32).tobytes())
    print(f'\r{min(100, (k + 1) * 100 // nblk):3d}%  ({(a + n / SR) / 60:5.1f} / {MIN:.0f} min)', end='', flush=True)
ff.stdin.close(); ff.wait()
print(f'\nwrote {OUT}   avg level {10 * np.log10(sq / ns):.1f} dBFS')
