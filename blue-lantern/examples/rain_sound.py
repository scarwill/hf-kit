# 60 s rain, fully synthesised (no samples): steady rain wash + thousands of tiny drops + bubbly bigger drops
# + drips on a hard surface + gentle wind gusts + two distant thunder rolls. Stereo, intensity breathes slowly.
import numpy as np, subprocess
from scipy.signal import butter, lfilter, fftconvolve

SR, DUR = 44100, 60.0
N = int(SR * DUR); t = np.arange(N) / SR
rng = np.random.default_rng(23)

def filt(x, f, kind='low', o=2):
    w = np.array(f) / (SR / 2); b, a = butter(o, w, kind); return lfilter(b, a, x)
def pink(n):  # 1/f noise via FFT shaping
    X = np.fft.rfft(rng.standard_normal(n)); fr = np.fft.rfftfreq(n, 1 / SR); fr[0] = 1
    return np.fft.irfft(X / np.sqrt(fr), n)

inten = .75 + .25 * np.sin(2 * np.pi * t / 23 + .5) * np.sin(2 * np.pi * t / 9.7)     # rain gets heavier / lighter

out = np.zeros((2, N))
# 1. rain wash: pink noise, band-limited, slightly different per ear
for c in range(2):
    w = pink(N); w = filt(w, [300, 9000], 'band'); w /= np.std(w)
    hiss = filt(rng.standard_normal(N), 5000, 'high'); hiss /= np.std(hiss)
    out[c] += (w * .22 + hiss * .05) * inten

# 2. dense tiny drops: random impulse train convolved with a short bright "tick"
k = np.arange(int(.006 * SR)) / SR
for c in range(2):
    imp = np.zeros(N); n = int(DUR * 900)
    pos = rng.integers(0, N, n); amp = rng.random(n) ** 3 * (.6 + .4 * inten[pos])
    np.add.at(imp, pos, amp * rng.choice([-1, 1], n))
    grp = rng.integers(0, 8, N)                      # 8 drop "sizes" -> no fixed pitch (avoids a whistle tone)
    d = sum(fftconvolve(imp * (grp == g), np.sin(2 * np.pi * f * k + rng.random() * 6) * np.exp(-k * (600 + f * .1)))[:N]
            for g, f in enumerate(rng.uniform(1600, 7000, 8)))
    d = filt(d, 1200, 'high')
    out[c] += d / (np.std(d) + 1e-9) * .09

# 3. bigger drops: "plink" bubble with a quick upward chirp (the classic water-drop sound)
def plink(f0, g):
    n = int(.09 * SR); tt = np.arange(n) / SR
    f = f0 * (1 + 2.2 * tt / tt[-1]); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-tt * 55) * np.minimum(1, tt / .0015) * g
for _ in range(int(DUR * 11)):
    st = rng.random() * (DUR - .1); i0 = int(st * SR); p = plink(900 + rng.random() * 2600, .05 + rng.random() ** 2 * .12) * inten[i0]
    pan = rng.random(); out[0, i0:i0 + len(p)] += p * (1 - pan); out[1, i0:i0 + len(p)] += p * pan

# 4. drips on a hard surface / leaf (low wooden thud + click), slow irregular rhythm, one side then the other
def drip(g):
    n = int(.12 * SR); tt = np.arange(n) / SR
    body = np.sin(2 * np.pi * (420 * np.exp(-tt * 30) + 180) * tt) * np.exp(-tt * 45)
    click = filt(rng.standard_normal(n), 2500, 'high') * np.exp(-tt * 300) * .5
    return (body + click) * g
tt0 = .8
while tt0 < DUR - .2:
    i0 = int(tt0 * SR); d = drip(.10 + rng.random() * .06); side = 0 if rng.random() < .55 else 1
    out[side, i0:i0 + len(d)] += d * .9; out[1 - side, i0:i0 + len(d)] += d * .25
    tt0 += .45 + rng.random() * 1.4

# 5. wind gusts: low band noise with slow swells
gust = np.clip(np.sin(2 * np.pi * t / 17 + 2) * 1.3 - .3, 0, None) ** 2
for c in range(2):
    wnd = filt(rng.standard_normal(N), [120, 700], 'band'); wnd /= np.std(wnd)
    out[c] += wnd * gust * .08

# 6. distant thunder: deep rumble, slow attack, long tail (two rolls)
def thunder(d, g):
    n = int(d * SR); tt = np.arange(n) / SR; x = filt(rng.standard_normal(n), 110, 'low', 4); x /= np.std(x)
    crack = filt(rng.standard_normal(n), [200, 900], 'band') * np.exp(-((tt - .6) / .25) ** 2) * .4
    env = np.minimum(1, tt / .9) * np.exp(-tt / (d * .32)) * (1 + .5 * np.sin(2 * np.pi * 1.3 * tt) ** 2)
    return (x + crack) * env * g
for st, d, g, pan in [(17.5, 7, .55, .35), (44, 8, .7, .65)]:
    th = thunder(d, g); i0 = int(st * SR); i1 = min(N, i0 + len(th))
    out[0, i0:i1] += th[:i1 - i0] * (1.1 - pan); out[1, i0:i1] += th[:i1 - i0] * (.1 + pan)

# fade in 2 s / out 3 s, level ~ -18 dBFS RMS, peak <= -1 dB
fade = np.minimum(1, t / 2) * np.minimum(1, (DUR - t) / 3)
m = (out * fade).T
m *= 10 ** (-18 / 20) / np.sqrt(np.mean(m ** 2))
pk = np.abs(m).max(); lim = 10 ** (-1 / 20)
if pk > lim: m *= lim / pk
print(f'rms {20*np.log10(np.sqrt(np.mean(m**2))):.1f} dB  peak {20*np.log10(np.abs(m).max()):.1f} dB')
m.astype(np.float32).tofile('rain.raw')
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', 'rain.raw', '-c:a', 'libmp3lame', '-b:a', '256k', 'rain_1min.mp3'], check=True)
print('wrote rain_1min.mp3')
