# self-made background score + sound cues (no samples).
# usage: score.py cues.json DUR HEAD END out_music.wav out_sfx.wav [mood]
# mood (pick from the script's topic/feel): dark (hacking, security, reverse engineering, mysteries) | lofi (calm explainers, study, tutorials)
#   | upbeat (news, launches, "this changes everything", fast lists) | calm (gentle, emotional, health, nature) | cinematic (history, big stakes, epic reveals)
import json, sys, wave, numpy as np
from scipy.signal import butter, sosfilt
cues = json.load(open(sys.argv[1])); DUR, HEAD, END = map(float, sys.argv[2:5]); MOOD = sys.argv[7] if len(sys.argv) > 7 else 'dark'
SR = 44100; n = int(DUR * SR); T = np.arange(n) / SR; rng = np.random.default_rng(11); f = lambda m: 440 * 2 ** ((m - 69) / 12)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def lpf(x, fc, o=2): return sosfilt(butter(o, fc, 'low', fs=SR, output='sos'), x)
def hpf(x, fc, o=2): return sosfilt(butter(o, fc, 'high', fs=SR, output='sos'), x)
def add(buf, a, sig, g=1.):
    a = int(a * SR); b = min(len(buf), a + len(sig))
    if a < len(buf) and b > a: buf[max(0, a):b] += g * sig[max(0, -a):b - a]
def saw(fr, t, nh=8): return sum(np.sin(2 * np.pi * fr * k * t) / k for k in range(1, nh + 1))
def tri(fr, t): return sum((-1) ** k * np.sin(2 * np.pi * fr * (2 * k + 1) * t) / (2 * k + 1) ** 2 for k in range(4))
# per mood: bpm, chords (midi), pad (saw|tri|sine), pad cutoff, kick 16th-steps, hat steps, rim steps, swing, pluck steps, pluck octave, sub, extra
P = {'dark':      dict(bpm=100, ch=[[50, 53, 57], [46, 50, 53], [43, 46, 50], [45, 49, 52]], pad='saw', cut=900, kick=[0, 8], hat=list(range(16)), rim=[4, 12], sw=0, plk=[3, 7, 10, 15], po=24, sub=1, extra=None),
     'lofi':      dict(bpm=80, ch=[[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60], [48, 52, 55, 59]], pad='tri', cut=1400, kick=[0, 7, 10], hat=[0, 2, 4, 6, 8, 10, 12, 14], rim=[4, 12], sw=.12, plk=[2, 6, 11], po=12, sub=0, extra='vinyl'),
     'upbeat':    dict(bpm=118, ch=[[48, 52, 55], [55, 59, 62], [57, 60, 64], [53, 57, 60]], pad='saw', cut=2400, kick=[0, 4, 8, 12], hat=[2, 6, 10, 14], rim=[4, 12], sw=0, plk=[0, 2, 3, 5, 6, 8, 10, 11, 13, 14], po=24, sub=1, extra=None),
     'calm':      dict(bpm=70, ch=[[50, 54, 57, 61], [47, 50, 54, 57], [43, 47, 50, 54], [45, 49, 52, 57]], pad='tri', cut=1800, kick=[], hat=[], rim=[], sw=0, plk=[0, 6, 10], po=24, sub=0, extra='bells'),
     'cinematic': dict(bpm=90, ch=[[45, 48, 52], [41, 45, 48], [48, 52, 55], [43, 47, 50]], pad='saw', cut=1100, kick=[0, 10], hat=[], rim=[], sw=0, plk=[], po=24, sub=1, extra='boom')}[MOOD]
bt = 60 / P['bpm']; bar = 4 * bt; CH = P['ch']
pad = np.zeros(n); k = 0; st = 0.
while st < DUR:
    ch = CH[k % 4]; L = 2 * bar + 1.5; tt = np.arange(int(L * SR)) / SR; env = np.minimum(1, tt / 1.2) * np.clip((L - tt) / 1.5, 0, 1)
    osc = {'saw': lambda fr, t: saw(fr, t), 'tri': tri, 'sine': lambda fr, t: np.sin(2 * np.pi * fr * t)}[P['pad']]
    sig = sum(osc(f(m) * 2 ** (d / 1200), tt + rng.random()) for m in ch + [ch[0] - 12] for d in (-8, 8)) * env * (.018 if P['pad'] == 'saw' else .03)
    if P['pad'] == 'tri': sig *= 1 + .15 * np.sin(2 * np.pi * 4.5 * tt)       # soft tremolo (keys feel)
    add(pad, st, sig); st += 2 * bar; k += 1
pad = lpf(pad, P['cut']); pad *= 1 + .25 * np.sin(2 * np.pi * T / (4 * bar))
kick = np.zeros(n); hat = np.zeros(n); rim = np.zeros(n); sub = np.zeros(n); plk = np.zeros(n); ext = np.zeros(n)
tk = np.arange(int(.45 * SR)) / SR; KICK = np.sin(2 * np.pi * (45 * tk + 60 * (1 - np.exp(-tk * 30)) / 30)) * np.exp(-tk * 7)
th = np.arange(int(.05 * SR)) / SR; HAT = hpf(rng.standard_normal(len(th)), 7000) * np.exp(-th * 80)
tr = np.arange(int(.12 * SR)) / SR; RIM = bp(rng.standard_normal(len(tr)), 1500, 3500) * np.exp(-tr * 40)
tb = np.arange(int(2.5 * SR)) / SR; BOOM = (np.sin(2 * np.pi * (38 * tb + 30 * (1 - np.exp(-tb * 6)) / 6)) * np.exp(-tb * 1.6) + lpf(rng.standard_normal(len(tb)), 400) * np.exp(-tb * 4) * .6)
i = 0; t = HEAD
while t < END - .05:
    b16 = i % 16; barn = int((t - HEAD) // bar); ch = CH[(barn // 2) % 4]; quiet = (barn % 16) in (14, 15)
    ts = t + (P['sw'] * bt / 2 if b16 % 2 == 1 else 0)
    if b16 in P['kick'] and not quiet: add(kick, ts, KICK)
    if b16 in P['rim'] and not quiet: add(rim, ts, RIM)
    if b16 in P['hat'] and not quiet: add(hat, ts, HAT, .55 if b16 % 4 == 2 else .3)
    if P['sub'] and b16 % 2 == 0:
        te = np.arange(int(bt / 2 * SR)) / SR; add(sub, t, np.sin(2 * np.pi * f(ch[0] - 24) * te) * np.minimum(1, te / .03) * np.exp(-te * 3) * (.5 if b16 in P['kick'] else 1))
    if b16 in P['plk'] and (barn % 2 == 1 or MOOD == 'upbeat'):
        m = ch[P['plk'].index(b16) % len(ch)] + P['po']; tp = np.arange(int(.9 * SR)) / SR
        add(plk, ts, (np.sin(2 * np.pi * f(m) * tp) + .3 * np.sin(4 * np.pi * f(m) * tp)) * np.exp(-tp * (8 if MOOD == 'upbeat' else 5)))
    if P['extra'] == 'boom' and b16 == 0 and barn % 2 == 0: add(ext, t, BOOM, .6)
    if P['extra'] == 'bells' and b16 == 0 and barn % 2 == 0:
        m = ch[-1] + 24; tp = np.arange(int(2.5 * SR)) / SR; add(ext, t, (np.sin(2 * np.pi * f(m) * tp) + .4 * np.sin(2 * np.pi * f(m) * 2.76 * tp)) * np.exp(-tp * 1.8), .25)
    t += bt / 4; i += 1
if P['extra'] == 'vinyl': ext += lpf(rng.standard_normal(n), 3000) * .006 + (rng.random(n) > .99985) * rng.standard_normal(n) * .08
plk = lpf(plk, 3000); pan = np.sin(2 * np.pi * T / 7) * .4
dl = int(bt * .75 * SR); echo = np.zeros(n); echo[dl:] = plk[:-dl] * .35
base = pad + kick * .55 + sub * .35 + rim * .12 + ext
musL = base + hat * .05 * (1 + pan) + plk * .07 * (1 - pan) + echo * .07
musR = base + hat * .05 * (1 - pan) + plk * .07 * (1 + pan) + np.roll(echo, int(.02 * SR)) * .07
tt = np.arange(int(2.2 * SR)) / SR; ris = bp(rng.standard_normal(len(tt)), 400, 4000) * (tt / 2.2) ** 2 * .05; add(musL, .3, ris); add(musR, .3, ris)
g = np.full(n, .3); up = lambda a, b, v0, v1: np.clip((T - a) / (b - a), 0, 1) * (v1 - v0) + v0
g = np.where(T < HEAD + .6, up(HEAD - .2, HEAD + .6, 2.6, .3), g); g = np.where(T > END - .5, up(END - .5, END + .5, .3, 2.2), g)
g *= np.clip(T / .8, 0, 1) * np.clip((DUR - T) / 1.8, 0, 1)
musL *= g; musR *= g
# ---------------- sound cues ----------------
sfL = np.zeros(n); sfR = np.zeros(n)
def both(a, s, g=1., p=0.): add(sfL, a, s, g * (1 - p)); add(sfR, a, s, g * (1 + p))
def env(L, att, dec): tt = np.arange(int(L * SR)) / SR; return tt, np.minimum(1, tt / att) * np.exp(-tt * dec)
# "Clean Glass" pack (picked 27 Oct 2026): soft, premium, quiet. No whoosh: scene changes are silent.
def nrm(x, g): return x / (np.abs(x).max() + 1e-9) * g
def nz(L): return rng.standard_normal(int(L * SR))
tt, e = env(.45, .002, 14); HIT = nrm(np.sin(2 * np.pi * (48 * tt + 40 * (1 - np.exp(-tt * 30)) / 30)) * e + lpf(nz(.45), 900) * np.exp(-tt * 60) * .35, .6)        # soft felt thud
tt, e = env(.18, .002, 26); POPS = nrm(np.sin(2 * np.pi * (620 * tt + 1500 * tt * tt)) * e * np.minimum(1, tt / .006), .3)                                             # glass bubble
tt, e = env(.22, .001, 30); BLP = nrm((np.sin(2 * np.pi * 2093 * tt) + .5 * np.sin(2 * np.pi * 2093 * 2.76 * tt) * np.exp(-tt * 40)) * e, .2)                           # glass tap
tt, e = env(.035, .0005, 140); TCK = nrm(bp(nz(.035), 2500, 5000) * e + .5 * np.sin(2 * np.pi * 1800 * tt) * e, .18)                                                  # wooden tick
def bell(fr, L=1.4): tt, e = env(L, .002, 3.2); return np.sin(2 * np.pi * fr * tt + 1.8 * np.exp(-tt * 4) * np.sin(2 * np.pi * fr * 3.5 * tt)) * e
CHM = np.zeros(int(1.6 * SR)); CHM[:int(1.4 * SR)] += bell(f(88)); b2 = bell(f(95)); CHM[int(.12 * SR):int(.12 * SR) + len(b2)] += .8 * b2; CHM = nrm(CHM, .2)               # two-note FM bell
tt, e = env(.16, .003, 22); k1 = lpf(np.sin(2 * np.pi * 233 * tt) + .3 * np.sin(2 * np.pi * 466 * tt), 1200) * e
tt, e = env(.3, .003, 12); k2 = lpf(np.sin(2 * np.pi * 175 * tt) + .3 * np.sin(2 * np.pi * 350 * tt), 1000) * e
ERR = np.zeros(int(.5 * SR)); ERR[:len(k1)] += k1; ERR[int(.14 * SR):int(.14 * SR) + len(k2)] += k2; ERR = nrm(ERR, .32)                                             # muted double "bonk"
tt, e = env(.7, .01, 4.5); DWN = nrm(lpf(np.sin(2 * np.pi * (700 * tt - 380 * tt * tt)), 1500) * e, .25)                                                             # soft glide down
tt, e = env(.05, .0008, 110); KEYS = [nrm(bp(nz(.05), 1400, 4200) * e + .4 * np.sin(2 * np.pi * 180 * tt) * np.exp(-tt * 90), .16) for _ in range(8)]                # soft laptop keys
for t, k, cnt, dt in cues:
    if k == 'hit': both(t, HIT)
    elif k == 'chime': both(t, CHM, 1, .1)
    elif k == 'blip': both(t, BLP)
    elif k == 'tick': both(t, TCK, 1, -.15)
    elif k == 'err': both(t, ERR)
    elif k == 'down': both(t, DWN)
    elif k == 'pop': both(t, POPS)
    elif k == 'type':
        for j in range(cnt): both(t + j * dt, KEYS[j % 8], .6 + .4 * rng.random(), (rng.random() - .5) * .3)
def wr(fn, L, R):
    s = np.stack([L, R], 1); s = (np.clip(s, -1, 1) * 32767).astype(np.int16); w = wave.open(fn, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(s.tobytes()); w.close()
pk = max(abs(musL).max(), abs(musR).max(), 1e-9); wr(sys.argv[5], musL / pk * .6, musR / pk * .6)
pk = max(abs(sfL).max(), abs(sfR).max(), 1e-9); wr(sys.argv[6], sfL / pk * .8, sfR / pk * .8)
print('ok', MOOD)
