# Original background music, synthesized from scratch (no samples) -> copyright-free. One track, no sound effects.
# usage: python3 bgm.py <voice-audio> [out=bgm.m4a] [--mood mystery|calm|hopeful] [--bells 11.5-45] [--rumble 45.6-51] [--seed 7]
#   length = the voice length (ends on the last word: quick fade-in at 0, fade-out over the last 1.4 s)
#   level  = ~14 dB under the voice (measured with ffmpeg ebur128), so build.py --bgm can use volume 1
#   --bells  a-b : soft bell arpeggio in that time range (time passing, wonder)
#   --rumble a-b : low filtered-noise swell (storm, danger)
# Needs numpy + ffmpeg. Made for the Methuselah short (mood mystery, bells 11.5-45, rumble 45.6-51).
import numpy as np, wave, sys, subprocess, re, os
args = sys.argv[1:]
def opt(k, d=None):
    if k in args: i = args.index(k); v = args[i + 1]; del args[i:i + 2]; return v
    return d
MOOD, BELLS, RUMB, SEED = opt('--mood', 'mystery'), opt('--bells'), opt('--rumble'), int(opt('--seed', '7'))
voice = args[0]; out = args[1] if len(args) > 1 else 'bgm.m4a'
rng_ = lambda s: [float(x) for x in s.split('-')] if s else None
DUR = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', voice]).decode())
def lufs(f):
    o = subprocess.run(['ffmpeg', '-hide_banner', '-i', f, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', o)[-1])
TARGET = lufs(voice) - 14

SR = 44100; N = int(SR * DUR); rng = np.random.default_rng(SEED)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)
# 8 chords + a final resolving chord, spread over the whole length (MIDI notes, root first)
MOODS = {
  'mystery': [[50, 57, 62, 65], [46, 53, 58, 62], [41, 53, 57, 60], [48, 55, 60, 64], [50, 57, 62, 65], [46, 53, 58, 65], [43, 55, 58, 62], [45, 52, 57, 61], [50, 57, 62, 69]],
  'calm':    [[48, 55, 60, 64], [45, 52, 57, 60], [41, 53, 57, 60], [43, 55, 59, 62], [48, 55, 60, 64], [45, 52, 57, 64], [41, 53, 57, 62], [43, 55, 59, 62], [48, 55, 60, 67]],
  'hopeful': [[43, 55, 59, 62], [40, 52, 55, 59], [36, 52, 55, 60], [38, 54, 57, 62], [43, 55, 59, 62], [40, 52, 55, 62], [36, 52, 55, 60], [38, 54, 57, 62], [43, 55, 62, 67]],
}
CH = MOODS[MOOD]; out2 = np.zeros((2, N))

def env(n, a, r):
    e = np.ones(n); a = min(int(a * SR), n // 2); r = min(int(r * SR), n // 2)
    e[:a] = np.sin(np.linspace(0, np.pi / 2, a)) ** 2; e[n - r:] = np.cos(np.linspace(0, np.pi / 2, r)) ** 2; return e
def pad(f, n):   # 3 slightly detuned voices with soft harmonics -> warm pad, no buzz
    x = np.arange(n) / SR; s = np.zeros(n)
    for det in (-0.12, 0, 0.11):
        for h, a in ((1, 1), (2, .35), (3, .16), (4, .07)): s += a * np.sin(2 * np.pi * f * 2 ** (det / 12) * h * x + rng.uniform(0, 6.28))
    return s / 6

L = DUR / 8.0
for i, ch in enumerate(CH):
    st = max(0, int((i * L - .6) * SR)); en = min(N, int(((i + 1) * L + 1.4) * SR)) if i < 8 else N
    if i == 8: st = int(max(0, DUR - 3.2) * SR)
    n = en - st
    if n <= 0: continue
    e = env(n, .25 if i == 0 else 1.6, 1.8 if i < 8 else 1.0)
    for k, m in enumerate(ch):
        s = pad(hz(m), n) * e * (.55 if k == 0 else .32); pan = .5 + (k - 1.5) * .12
        out2[0, st:en] += s * (1 - pan); out2[1, st:en] += s * pan
    out2[:, st:en] += .25 * np.sin(2 * np.pi * hz(ch[0] - 12) * np.arange(n) / SR) * e   # soft sub bass on the root
b = rng_(BELLS)
if b:   # gentle bell arpeggio
    tt, k = b[0], 0
    while tt < b[1]:
        ch = CH[min(8, int(tt / L))]; m = ch[1:][k % 3] + 12; st = int(tt * SR); n = min(int(2.2 * SR), N - st); x = np.arange(n) / SR
        s = (np.sin(2 * np.pi * hz(m) * x) + .3 * np.sin(2 * np.pi * hz(m) * 2.01 * x)) * np.exp(-x * 2.2) * .10 * (1 if k % 4 else 1.3)
        pan = .3 + .4 * ((k * 7) % 5) / 4; out2[0, st:st + n] += s * (1 - pan); out2[1, st:st + n] += s * pan; tt += .82; k += 1
r = rng_(RUMB)
if r:   # low storm rumble
    st, en = int(r[0] * SR), min(N, int(r[1] * SR)); n = en - st; z = rng.standard_normal(n); k_ = int(SR / 120)
    z = np.convolve(z, np.ones(k_) / k_, 'same'); z *= env(n, 1.2, 2.2) * .9 / (np.abs(z).max() + 1e-9); out2[:, st:en] += z * .35

# reverb: convolve with a 2.4 s decaying-noise impulse
ir_n = int(2.4 * SR); ir = rng.standard_normal((2, ir_n)) * np.exp(-np.arange(ir_n) / SR * 2.6); ir[:, 0] = 0
def fconv(a, b):
    m = len(a) + len(b) - 1; F = 1 << (m - 1).bit_length(); return np.fft.irfft(np.fft.rfft(a, F) * np.fft.rfft(b, F), F)[:len(a)]
wet = np.stack([fconv(out2[c], ir[c]) for c in range(2)]); wet /= np.abs(wet).max() + 1e-9
mix = .6 * out2 / (np.abs(out2).max() + 1e-9) + .5 * wet
mix *= env(N, .3, 1.4); mix = mix / np.abs(mix).max() * 10 ** (-3 / 20)
tmp = out + '.tmp.wav'
with wave.open(tmp, 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix.T * 32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', tmp, '-af', f'loudnorm=I={TARGET:.1f}:TP=-9:LRA=11,atrim=0:{DUR:.3f}', '-ar', '44100', '-c:a', 'aac', '-b:a', '160k', out], check=True)
os.remove(tmp); print(out, f'{DUR:.2f}s', 'mood', MOOD, f'voice {TARGET + 14:.1f} LUFS -> bgm {lufs(out):.1f} LUFS')
