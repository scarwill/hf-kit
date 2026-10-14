# Soothing focus / study / meditation music — v2: same composition, physically-modelled piano (more like a real piano).
# Soft felt piano (hand-written melody), slow broken-chord left hand, warm string pad, soft sub bass,
# a few celesta notes, deep reverb. D major, 66 BPM, chords Dmaj9 - Bm9 - Gmaj7 - A6sus (2 bars each).
#   pip install numpy scipy ; needs ffmpeg
#   python focus_piano.py          -> focus_piano.mp3 (about 3.5 min, the composed piece)
#   python focus_piano.py 60       -> about 60 min (same sections in a varied order, for long study sessions)
import sys, subprocess
import numpy as np
from scipy.signal import butter, lfilter, fftconvolve

SR = 44100
MIN = float(sys.argv[1]) if len(sys.argv) > 1 else 0
BEAT = 60 / 66; CYC = 32 * BEAT                       # one chord cycle = 8 bars of 4/4 = 29.1 s
rng = np.random.default_rng(3)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)

# ---------------- harmony ----------------
CHORDS = [  # (bass, arpeggio voicing)
    (38, [38, 45, 52, 54, 57, 61]),   # Dmaj9 : D A E F# A C#
    (35, [35, 42, 49, 50, 54, 57]),   # Bm9   : B F# C# D F# A
    (43, [43, 50, 54, 57, 59, 62]),   # Gmaj7 : G D F# A B D
    (45, [45, 52, 57, 59, 62, 66]),   # A6sus : A E A B D F#
]
ARP = [[0, 1, 2, 3, 4, 5, 4, 3, 0, 1, 2, 3, 4, 5, 4, 2], [0, 2, 1, 3, 2, 4, 3, 5, 0, 2, 1, 3, 2, 4, 5, 3]]

# ---------------- melody (hand-composed): (midi or None for rest, beats); 32 beats each ----------------
F4, G4, A4, B4, C5, D5, E5, Fs5, D4, E4, Fs4, Cs5 = 66, 67, 69, 71, 72, 74, 76, 78, 62, 64, 66, 73
MEL = {
 'A':  [(Fs4, 2), (E4, 1), (Fs4, 1), (A4, 3), (None, 1),   (D5, 2), (Cs5, 1), (A4, 1), (B4, 3), (None, 1),
        (A4, 2), (Fs4, 1), (E4, 1), (D4, 2), (E4, 1), (Fs4, 1),   (E4, 4), (None, 2), (A4, 2)],
 'A2': [(Fs4, 2), (E4, 1), (Fs4, 1), (A4, 3), (None, 1),   (D5, 2), (Cs5, 1), (A4, 1), (B4, 3), (None, 1),
        (A4, 1), (B4, 1), (A4, 1), (Fs4, 1), (E4, 3), (None, 1),   (Fs4, 2), (E4, 2), (D4, 4)],
 'B':  [(A4, 1), (D5, 1), (E5, 2), (Fs5, 3), (None, 1),    (E5, 2), (D5, 1), (Cs5, 1), (D5, 2), (B4, 2),
        (B4, 2), (A4, 1), (Fs4, 1), (A4, 3), (None, 1),    (E4, 2), (Fs4, 1), (E4, 1), (E4, 4)],
 'S':  [(None, 4), (A4, 4),  (None, 4), (Fs4, 4),  (None, 4), (D5, 4),  (None, 4), (Cs5, 4)],   # sparse, for long versions
}

# ---------------- instruments ----------------
def lp(x, fc): b, a = butter(2, fc / (SR / 2)); return lfilter(b, a, x)
def piano(m, vel, dur):
    """Physically-modelled piano note (modal synthesis of a struck, stiff, 3-string course):
    - string stiffness -> inharmonic partials  f_k = k f0 sqrt(1 + B k^2), B grows up the keyboard
    - hammer strikes at 1/7.5 of the string -> some partials weakened; harder hit -> shorter contact -> brighter
    - frequency-dependent losses: high partials die fast, low ones ring (T60 shrinks up the keyboard)
    - 3 slightly detuned unison strings + 2 polarisations -> beating and the piano's two-stage decay (prompt + aftersound)
    - damper falls at key-up: fast extra decay + a soft felt 'thud'; hammer/key knock at the start"""
    f0 = hz(m); n = int((dur + 4.0) * SR); t = np.arange(n) / SR
    B = float(np.clip(1e-4 * 10 ** ((m - 48) / 36), 4e-5, 2e-2))
    a0 = .32 * (f0 / 110) ** .62                                  # base loss rate (1/s), bigger for high notes
    x0 = 1 / 7.5; fc_h = f0 * (2.5 + 11 * vel)                     # strike point, hammer brightness
    kmax = int(min(40, 9000 / f0)); out = np.zeros(n)
    det = rng.normal(0, .55, 3)                                    # unison detune in cents
    for k in range(1, kmax + 1):
        fk = f0 * k * np.sqrt(1 + B * k * k)
        if fk > 9500: break
        amp = abs(np.sin(np.pi * k * x0)) / k ** .7 / (1 + (fk / fc_h) ** 2) * (.25 + .75 * vel)
        if amp < 2e-4: continue
        r = a0 + 2.2e-7 * fk * fk                                  # amplitude decay rate of this partial
        ph = rng.uniform(0, 6.283, 3)
        prompt = sum(np.sin(2 * np.pi * fk * 2 ** (d / 1200) * t + p) for d, p in zip(det, ph)) / 3
        after = np.sin(2 * np.pi * fk * 2 ** ((det[0] + .9) / 1200) * t + ph[1])
        out += amp * (.78 * np.exp(-r * t) * prompt + .22 * np.exp(-r * .28 * t) * after)
    out *= np.minimum(1, t / .0025)
    knock = lp(rng.standard_normal(n), 900) * np.exp(-t * 90) * .05 * vel + np.sin(2 * np.pi * 95 * t) * np.exp(-t * 35) * .03 * vel
    toff = dur + .15; damp = np.where(t < toff, 1.0, np.exp(-(t - toff) * 7.0))   # damper
    thud = np.zeros(n); i = int(toff * SR)
    if i < n: m_ = min(n - i, int(.08 * SR)); thud[i:i + m_] = lp(rng.standard_normal(m_), 250) * np.exp(-np.arange(m_) / SR * 60) * .012
    return (out * damp + knock + thud) * .06

def pad(chord, dur):
    n = int((dur + 3) * SR); t = np.arange(n) / SR; out = np.zeros(n)
    for m in chord[1:5]:
        for v, det in enumerate((-.08, 0, .07)):
            f = hz(m + 12) * 2 ** (det / 12) * (1 + .002 * np.sin(2 * np.pi * (.2 + v * .07) * t + v))
            ph = 2 * np.pi * np.cumsum(f) / SR
            for k in range(1, 8): out += np.sin(k * ph) / k ** 1.3
    e = np.minimum(1, t / 2.5) * np.clip((dur + 2.5 - t) / 2.5, 0, 1)
    return lp(out, 1500) * e * .0035

def sub(m, dur):
    n = int((dur + 1) * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * hz(m) * t) * np.minimum(1, t / .4) * np.clip((dur + .8 - t) / .8, 0, 1) * .035   # 62-98 Hz: audible, not a rumble

def celesta(m, vel):
    n = int(3 * SR); t = np.arange(n) / SR; f = hz(m + 12)
    x = (np.sin(2 * np.pi * f * t) + .35 * np.sin(2 * np.pi * f * 4.0 * t) * np.exp(-t * 6)) * np.exp(-t * 1.6)
    return x * np.minimum(1, t / .002) * vel * .02

# ---------------- arrangement ----------------
if MIN <= 0:
    PLAN = ['intro', 'A', 'A2', 'inter', 'B', 'A2', 'outro']
else:
    body = []
    pool = ['A', 'A2', 'inter', 'B', 'A2', 'S', 'A', 'inter', 'B', 'S']
    while (len(body) + 2) * CYC < MIN * 60: body.append(pool[len(body) % len(pool)])
    PLAN = ['intro'] + body + ['outro']
DUR = len(PLAN) * CYC + 8
N = int(DUR * SR); mix = np.zeros((N, 2))
def place(x, at, pan=.5, g=1.0):
    i0 = int(at * SR)
    if i0 >= N: return
    i1 = min(N, i0 + len(x)); x = x[:i1 - i0] * g
    mix[i0:i1, 0] += x * np.sqrt(1 - pan); mix[i0:i1, 1] += x * np.sqrt(pan)
PB = np.zeros((N, 2))
def placeP(x, at, pan=.5, g=1.0):
    i0 = int(at * SR)
    if i0 >= N: return
    i1 = min(N, i0 + len(x)); x = x[:i1 - i0] * g
    PB[i0:i1, 0] += x * np.sqrt(1 - pan); PB[i0:i1, 1] += x * np.sqrt(pan)
hum = lambda: rng.normal(0, .008)                      # tiny timing humanisation

for ci, sec in enumerate(PLAN):
    c0 = 1.0 + ci * CYC
    for k, (bass, voic) in enumerate(CHORDS):
        t0 = c0 + k * 8 * BEAT
        place(pad(voic, 8 * BEAT), t0, .5, .55 if sec in ('intro', 'outro') else 1.0)
        if sec != 'intro' or k > 0: place(sub(bass, 8 * BEAT), t0, .5, .8)
        pat = ARP[(ci + (sec == 'B')) % 2]
        for e, ix in enumerate(pat):                   # left-hand broken chord, eighth notes
            if sec == 'outro' and k == 3 and e > 7: break
            if sec in ('intro', 'outro') and e % 2: continue
            vel = (.32 if e % 4 == 0 else .22) * (.8 if sec in ('intro', 'outro') else 1) + rng.uniform(-.03, .03)
            placeP(piano(voic[ix] + 12, vel, BEAT * 1.6), t0 + e * BEAT / 2 + hum(), .38 + .05 * (ix % 3))
    if sec in MEL:                                     # right-hand melody
        b = 0
        for m, d in MEL[sec]:
            if m is not None:
                placeP(piano(m + 12, .55 + rng.uniform(-.05, .05), d * BEAT), c0 + b * BEAT + hum(), .58)
                if sec == 'B' and d >= 3: place(celesta(m, .8), c0 + b * BEAT, .65)
            b += d
    if sec == 'inter':                                 # interlude: a few celesta notes over the chords
        for b, m in [(4, 69), (10, 66), (16, 74), (22, 73), (28, 76)]: place(celesta(m, 1.0), c0 + b * BEAT, .62)
    if sec == 'outro':
        placeP(piano(62 + 12, .5, 8 * BEAT), c0 + 30 * BEAT, .55); placeP(piano(50 + 12, .35, 8 * BEAT), c0 + 30 * BEAT, .45)
        place(sub(38, 6), c0 + 30 * BEAT, .5)

# ---------------- piano body: soundboard + sympathetic strings (pedal down), then into the mix ----------------
sb_n = int(.25 * SR); ts = np.arange(sb_n) / SR; SB = np.zeros(sb_n)
for fm in np.geomspace(70, 5000, 160):                            # dense soundboard modes, short ring
    SB += np.sin(2 * np.pi * fm * rng.uniform(.97, 1.03) * ts + rng.uniform(0, 6.3)) * np.exp(-ts * (25 + fm * .02)) * rng.uniform(.3, 1) / np.sqrt(fm / 70)
SB /= np.sqrt((SB ** 2).sum()); SB[0] += 2.5                       # mostly direct sound + body colour
for c in (0, 1): PB[:, c] = fftconvolve(PB[:, c], SB)[:N] / 2.6
sym = np.zeros_like(PB)
for mm in [38, 45, 50, 52, 54, 57, 59, 61, 62, 64, 66, 69, 71, 73, 74, 76, 78, 81]:   # undamped strings of D major ring along
    w = 2 * np.pi * hz(mm) / SR; rr = .99993
    for c in (0, 1): sym[:, c] += lfilter([1 - rr], [1, -2 * rr * np.cos(w), rr * rr], PB[:, c])
mix += PB + sym * (np.sqrt(np.mean(PB ** 2)) / (np.sqrt(np.mean(sym ** 2)) + 1e-12)) * .12

# ---------------- reverb (dark hall, 3.8 s), level ----------------
ir_n = int(3.8 * SR); ti = np.arange(ir_n) / SR
for c in (0, 1):
    ir = lp(rng.standard_normal(ir_n), 4500) * np.exp(-ti * 1.8); ir /= np.sqrt((ir ** 2).sum())
    mix[:, c] = mix[:, c] * .78 + fftconvolve(mix[:, c], ir)[:N] * .32
hb, ha = butter(2, 35 / (SR / 2), 'high'); mix = lfilter(hb, ha, mix, axis=0)   # remove sub-audible rumble
tt = np.arange(N) / SR
mix *= (np.minimum(1, tt / 2) * np.clip((DUR - tt) / 6, 0, 1))[:, None]
mix *= 10 ** (-18 / 20) / np.sqrt(np.mean(mix ** 2)); mix = np.tanh(mix * 1.1) / 1.1
print(f'{DUR / 60:.1f} min, sections {PLAN}, peak {20 * np.log10(np.abs(mix).max()):.1f} dB')
OUT = 'focus_piano_v2.mp3' if MIN <= 0 else f'focus_piano_v2_{int(MIN)}min.mp3'
mix.astype(np.float32).tofile('fp.raw')
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', 'fp.raw', '-c:a', 'libmp3lame', '-b:a', '256k', OUT], check=True)
print('wrote', OUT)
