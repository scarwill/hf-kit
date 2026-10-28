# Custom "puzzle" score for the ETH Short (28 Oct 2026): 96 bpm, pizzicato strings + music-box melody + soft clock ticks + felt bass.
# Curious, "thinking" feel. Hit on the hook claim, lift when the second lab arrives, full stop before the caveat, back sparse
# (music box + ticks only) for the caveat, warm resolve on the end card.
# usage: python3 puzzle.py DUR END out.wav HIT LIFT STOP BACK   (video times: HIT = hook hit, LIFT = 2nd lab, STOP/BACK = silence)
import sys, numpy as np, wave
from scipy.signal import butter, sosfilt
SR = 44100
DUR, END = float(sys.argv[1]), float(sys.argv[2]); OUT = sys.argv[3]
HIT, LIFT, STOP, BACK = map(float, sys.argv[4:8])
N = int(DUR * SR); L = np.zeros(N); R = np.zeros(N); rng = np.random.default_rng(7); T = np.arange(N) / SR
def f(m): return 440 * 2 ** ((m - 69) / 12)
def lpf(x, fc): return sosfilt(butter(2, fc, 'low', fs=SR, output='sos'), x)
def hpf(x, fc): return sosfilt(butter(2, fc, 'high', fs=SR, output='sos'), x)
def tt(d): return np.arange(int(d * SR)) / SR
def put(t, sig, g=1., pan=0.):
    i = int(t * SR)
    if i >= N or i < 0: return
    s = sig[:N - i]; L[i:i + len(s)] += s * g * (1 - pan); R[i:i + len(s)] += s * g * (1 + pan)
def pizz(m, d=.6):
    # plucked string: Karplus-Strong-ish decaying harmonics + a short noise attack
    t = tt(d); fr = f(m)
    s = sum(np.sin(2 * np.pi * fr * k * t) * np.exp(-t * (6 + 5 * k)) / k for k in range(1, 7))
    return lpf(s + hpf(rng.standard_normal(len(t)), 2000) * np.exp(-t * 120) * .15, 4500)
def mbox(m, d=1.6):
    t = tt(d); fr = f(m)
    return (np.sin(2 * np.pi * fr * t) + .4 * np.sin(2 * np.pi * fr * 3.01 * t) * np.exp(-t * 6) + .2 * np.sin(2 * np.pi * fr * 5.4 * t) * np.exp(-t * 12)) * np.exp(-t * 3.2) * np.minimum(1, t / .002)
def tick(hi=True):
    t = tt(.04); return hpf(rng.standard_normal(len(t)), 5000 if hi else 2500) * np.exp(-t * 160)
def fbass(m, d):
    t = tt(d); return lpf(np.sin(2 * np.pi * f(m) * t) + .3 * np.sin(2 * np.pi * f(m) * 2 * t), 300) * np.minimum(1, t / .01) * np.exp(-t * 2.2)
def boom():
    t = tt(1.4); return np.sin(2 * np.pi * np.cumsum(38 + 60 * np.exp(-t * 18)) / SR) * np.exp(-t * 3) + lpf(rng.standard_normal(len(t)), 900) * np.exp(-t * 9) * .3
def pad(ms, d):
    t = tt(d); s = sum(np.sin(2 * np.pi * f(m) * (1 + dt) * t) for m in ms for dt in (-.003, .003))
    return lpf(s, 1800) * np.minimum(1, t / .6) * np.clip((d - t) / .8, 0, 1)

BPM = 96; bt = 60 / BPM; e8 = bt / 2; bar = 4 * bt; HEAD = .2
CH = [[50, 53, 57], [46, 50, 53], [48, 52, 55], [45, 49, 52]]   # Dm Bb C A
BS = [38, 34, 36, 33]
MEL = [74, 77, 76, 74, 72, 74, 69, None, 74, 77, 79, 77, 76, 72, 73, None]   # music box line over 2 bars
quiet = lambda t: STOP - .02 <= t < BACK - .02
sparse = lambda t: t >= BACK
# pads (only after the lift, and soft in the caveat)
for k in range(int(DUR / bar) + 1):
    st = HEAD + k * bar
    if st >= END: break
    g = .0 if st + bar < LIFT else .035
    if sparse(st): g = .02
    if g: put(st, pad([m + 12 for m in CH[k % 4]], bar + .6), g)
i = 0; t = HEAD
while t < END - .05:
    b8 = i % 8; bn = int((t - HEAD) // bar); ch = CH[bn % 4]
    if not quiet(t):
        if not sparse(t):
            # pizzicato ostinato: root-fifth-third pattern, louder after the lift
            m = [ch[0], ch[2], ch[1] + 12, ch[2], ch[0] + 12, ch[2], ch[1] + 12, ch[2]][b8]
            put(t, pizz(m + 12), .16 if t >= LIFT else .12, .3 if b8 % 2 else -.3)
            if b8 in (0, 4): put(t, fbass(BS[bn % 4], bar / 2), .2)
            put(t, tick(b8 % 2 == 0), .05 if b8 % 2 == 0 else .03, .5)
        else:
            if b8 % 2 == 0: put(t, tick(True), .04, .5)
            if b8 == 0: put(t, fbass(BS[bn % 4], bar), .12)
        mi = (i // 2) % 16
        if i % 2 == 0 and MEL[mi] is not None and (t >= HIT or sparse(t)): put(t, mbox(MEL[mi]), .07 if not sparse(t) else .09, -.2)
    t += e8; i += 1
put(HIT - .02, boom(), .5)
put(LIFT - .02, boom(), .3)
for k, m in enumerate([62, 69, 74]): put(LIFT + k * .07, mbox(m + 12), .06, (k - 1) * .3)
# swell into the stop, silence, then the caveat comes back on a single low note
t2 = tt(.8); put(STOP - .8, lpf(rng.standard_normal(len(t2)), 1500) * (t2 / .8) ** 3 * .1)
put(BACK, fbass(38, 2.5), .18)
# resolve on the end card: D major chord on music box + bass
for k, m in enumerate([62, 66, 69, 74, 78]): put(END + .05 + k * .09, mbox(m + 12, 2.4), .09, (k - 2) * .2)
put(END + .05, fbass(38, 2.6), .25)
gate = 1 - .92 * np.clip(np.minimum((T - STOP) / .04, (BACK - T) / .04), 0, 1)
fade = np.clip(T / .3, 0, 1) * np.clip((DUR - T) / 1.4, 0, 1) * gate; L *= fade; R *= fade
s = np.stack([L, R], 1); s = s / (np.abs(s).max() + 1e-9) * .85
w = wave.open(OUT, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((s * 32767).astype(np.int16).tobytes()); w.close()
print('ok puzzle', OUT)
