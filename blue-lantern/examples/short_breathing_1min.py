# "1 Minute Calm — breathe with the circle": a guided breathing meditation Short (1080x1920, 60 s).
# Original music (drone pad that swells with the breath, singing bowl, soft cue chime, faint ocean) +
# original visual (breathing circle that grows on the in-breath, shrinks on the out-breath, drifting light, text cues).
# Breathing: 4 s in, 6 s out (6 breaths a minute, a slow relaxed pace).
#   pip install numpy scipy pillow ; needs ffmpeg   ->   python make_calm_breath.py   ->   calm_breath_1min.mp4
import subprocess, os
import numpy as np
from scipy.signal import butter, lfilter, fftconvolve
from PIL import Image, ImageDraw, ImageFont, ImageFilter

SR, DUR, FPS, W, H = 44100, 60.0, 30, 1080, 1920
T_IN, T_OUT = 4.0, 6.0; CYCLE = T_IN + T_OUT
B0, NB = 4.0, 5                                    # breathing starts at 4 s, 5 cycles -> ends at 54 s
rng = np.random.default_rng(12)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)

def breath(t):                                     # 0 (empty) .. 1 (full lungs), smooth
    t = np.asarray(t, float); u = (t - B0) % CYCLE; inside = (t >= B0) & (t < B0 + NB * CYCLE)
    up = .5 - .5 * np.cos(np.pi * np.clip(u / T_IN, 0, 1)); dn = .5 + .5 * np.cos(np.pi * np.clip((u - T_IN) / T_OUT, 0, 1))
    b = np.where(u < T_IN, up, dn)
    pre = .5 - .5 * np.cos(np.pi * np.clip(t / B0, 0, 1)) * 0          # before start: resting
    return np.where(inside, b, 0.0)

# ======================= AUDIO =======================
N = int(DUR * SR); t = np.arange(N) / SR; L = np.zeros(N); R = np.zeros(N)
def lp(x, fc): b, a = butter(2, fc / (SR / 2)); return lfilter(b, a, x)
br = breath(t)
# drone pad: one chord per breath, crossfaded; a dark layer always + a bright layer that opens on the in-breath
CH = [[50, 57, 62, 64, 69], [50, 55, 59, 62, 66], [47, 54, 59, 62, 66], [45, 52, 57, 62, 64], [50, 57, 62, 64, 69], [50, 57, 62, 66, 69]]
for i, ch in enumerate(CH):
    c = (B0 - CYCLE if i == 0 else B0 + (i - 1) * CYCLE) + CYCLE / 2       # chord centres
    w = np.clip(1 - np.abs(t - c) / (CYCLE * .85), 0, 1) ** 1.2
    if i == 0: w = np.where(t < c, 1, w)
    if i == len(CH) - 1: w = np.where(t > c, 1, w)
    for j, m in enumerate(ch):
        for det, pan in ((-.05, .3), (.05, .7)):
            ph = 2 * np.pi * hz(m) * 2 ** (det / 12) * t + j
            dark = np.sin(ph) + .2 * np.sin(2 * ph); bright = .35 * np.sin(3 * ph) + .2 * np.sin(4 * ph) + .1 * np.sin(5 * ph)
            v = (dark + bright * br) * w * (.9 if j == 0 else .45)
            L += v * (1 - pan); R += v * pan
g = .017 * (.75 + .25 * br)
L = lp(L, 2400) * g; R = lp(R, 2400) * g
# breath air: soft filtered noise that rises on the in-breath and falls away on the out-breath
nz = rng.standard_normal((2, N)); air = np.gradient(br) * SR; air = np.clip(air, 0, None) * .5 + br * .3
L += lp(nz[0], 900) * .012 * air; R += lp(nz[1], 950) * .012 * air
# faint ocean bed
surge = .6 + .4 * np.sin(2 * np.pi * t / 9 + 1) ** 2
L += lp(nz[1], 420) * .02 * surge; R += lp(nz[0], 440) * .02 * surge
# singing bowl (pairs of close modes -> slow beating) at the start and at the end
def bowl(f, n_s, g):
    n = int(n_s * SR); tt = np.arange(n) / SR; s = np.zeros(n)
    for ratio, a, d in ((1, 1, .35), (2.76, .55, .6), (5.40, .25, 1.1), (8.93, .1, 1.8)):
        for db in (-.6, .6):
            s += a * np.sin(2 * np.pi * (f * ratio + db * ratio ** .5) * tt + rng.uniform(0, 6)) * np.exp(-tt * d)
    return s * np.minimum(1, tt / .008) * g
for st, f, pan in ((.3, hz(62), .45), (54.3, hz(57), .55)):
    b = bowl(f, 12, .045); i0 = int(st * SR); i1 = min(N, i0 + len(b))
    L[i0:i1] += b[:i1 - i0] * (1.1 - pan); R[i0:i1] += b[:i1 - i0] * (.1 + pan)
# soft cue chime at the start of every in-breath
for k in range(NB):
    n = int(2.5 * SR); tt = np.arange(n) / SR; f = hz(81 if k % 2 == 0 else 78)
    c = (np.sin(2 * np.pi * f * tt) + .25 * np.sin(2 * np.pi * f * 2.99 * tt) * np.exp(-tt * 4)) * np.exp(-tt * 1.8) * np.minimum(1, tt / .004) * .012
    i0 = int((B0 + k * CYCLE) * SR); i1 = min(N, i0 + n); L[i0:i1] += c[:i1 - i0] * .6; R[i0:i1] += c[:i1 - i0] * .4
# hall reverb, fades, level (about -16 dBFS, peaks under -1 dB)
m = np.stack([L, R], 1); ir_n = int(4 * SR); ti = np.arange(ir_n) / SR
for c in (0, 1):
    ir = lp(rng.standard_normal(ir_n), 5000) * np.exp(-ti * 1.6); ir /= np.sqrt((ir ** 2).sum())
    m[:, c] = m[:, c] * .8 + fftconvolve(m[:, c], ir)[:N] * .35
m *= (np.minimum(1, t / 1.5) * np.clip((DUR - t) / 4, 0, 1))[:, None]
hb, ha = butter(2, 40 / (SR / 2), 'high'); m = lfilter(hb, ha, m, axis=0)
m *= 10 ** (-16 / 20) / np.sqrt(np.mean(m ** 2)); m = np.tanh(m * 1.05) / 1.05
m.astype(np.float32).tofile('audio.raw')
print(f'audio ok, peak {20 * np.log10(np.abs(m).max()):.1f} dB')

# ======================= VIDEO =======================
FONT = '/usr/share/fonts/opentype/inter/Inter-Light.otf'
FONTB = '/usr/share/fonts/opentype/inter/Inter-Medium.otf'
if not os.path.exists(FONT): FONT = FONTB = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
f_big = ImageFont.truetype(FONT, 92); f_mid = ImageFont.truetype(FONT, 54); f_small = ImageFont.truetype(FONT, 40); f_title = ImageFont.truetype(FONTB, 84)
CX, CY = W / 2, H * .47
yy, xx = np.mgrid[0:H // 2, 0:W // 2].astype(np.float32) * 2                 # half-res fields, upscaled later
D = np.hypot(xx - CX, yy - CY)
top, bot = np.array([10, 14, 38], np.float32), np.array([14, 52, 66], np.float32)
GRAD = (top[None, None] + (bot - top)[None, None] * (yy / H)[..., None])
P = rng.uniform(0, 1, (70, 4))                                              # particles: x, y, speed, phase
def smooth(a, b, x): x = np.clip((x - a) / (b - a), 0, 1); return x * x * (3 - 2 * x)

def frame(tf):
    b = float(breath(tf)); r = 170 + 200 * b
    # aurora blobs drifting slowly
    img = GRAD.copy()
    for k, (bx, by, col) in enumerate(((.3, .3, (40, 90, 140)), (.75, .65, (60, 50, 120)), (.4, .8, (30, 110, 120)))):
        px = W * (bx + .08 * np.sin(tf * .05 + k * 2)); py = H * (by + .05 * np.cos(tf * .04 + k))
        blob = np.exp(-((xx - px) ** 2 + (yy - py) ** 2) / (2 * (380 ** 2))) * .35
        img += blob[..., None] * np.array(col, np.float32)
    # breathing circle: soft filled disc + glowing rim + outer halo that widens with the breath
    fill = smooth(r + 6, r - 6, D) * (.10 + .10 * b)
    rim = np.exp(-((D - r) / 7) ** 2) * (.55 + .35 * b)
    halo = np.exp(-np.clip(D - r, 0, None) / (40 + 60 * b)) * (D > r) * (.18 + .22 * b)
    guide = np.exp(-((D - 370) / 2.5) ** 2) * .12                         # faint ring = "full breath" target
    col = np.array([150, 230, 235], np.float32)
    img += (fill + rim + halo + guide)[..., None] * col
    im = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).resize((W, H), Image.BILINEAR).convert('RGBA')
    ov = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
    for x, y, sp, ph in P:                                                 # drifting light specks
        py = (y * H - tf * (8 + 18 * sp)) % H; px = x * W + 12 * np.sin(tf * .3 + ph * 6)
        a = int(60 + 90 * (.5 + .5 * np.sin(tf * (.6 + sp) + ph * 6))); s = 1.5 + 2.5 * sp
        d.ellipse([px - s, py - s, px + s, py + s], fill=(220, 245, 255, a))
    def text(s, y, font, alpha, fill=(235, 248, 250)):
        if alpha <= 0.01: return
        w = d.textlength(s, font=font); d.text((W / 2 - w / 2, y), s, font=font, fill=fill + (int(255 * alpha),))
    # title (0-4 s), cues during the breathing, ending
    a_title = smooth(.3, 1.3, tf) * (1 - smooth(3.2, 4.2, tf))
    text('1 Minute Calm', H * .16, f_title, a_title); text('breathe with the circle', H * .16 + 110, f_mid, a_title * .85)
    if B0 <= tf < B0 + NB * CYCLE:
        u = (tf - B0) % CYCLE; k = int((tf - B0) // CYCLE)
        if u < T_IN: s, a, n = 'Breathe in', smooth(0, .5, u) * (1 - smooth(T_IN - .5, T_IN, u)), int(T_IN - u) + 1
        else: s, a, n = 'Breathe out', smooth(T_IN, T_IN + .5, u) * (1 - smooth(CYCLE - .5, CYCLE, u)), int(CYCLE - u) + 1
        text(s, H * .20, f_big, a)                                     # cue above the circle (never crosses the ring)
        text(str(n), CY - 34, f_mid, a * .7)                            # seconds left, inside the circle
        text(f'breath {k + 1} of {NB}', H * .80, f_small, .55 * smooth(B0, B0 + 1, tf))
    a_end = smooth(54.5, 55.8, tf) * (1 - smooth(58.8, 59.9, tf))
    text('Well done.', H * .16, f_big, a_end); text('Take this calm with you', H * .16 + 115, f_mid, a_end * .85)
    # thin progress line at the bottom
    d.rounded_rectangle([W * .2, H * .87, W * .8, H * .87 + 4], 2, fill=(255, 255, 255, 40))
    d.rounded_rectangle([W * .2, H * .87, W * .2 + W * .6 * min(1, tf / DUR), H * .87 + 4], 2, fill=(160, 235, 240, 140))
    return np.asarray(Image.alpha_composite(im, ov).convert('RGB'))

for tf in (2.0, 6.0, 12.0, 56.5): Image.fromarray(frame(tf)).save(f'preview_{tf:04.1f}.png')
ff = subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', 'pipe:0',
                       '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', 'audio.raw',
                       '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k',
                       '-shortest', '-movflags', '+faststart', 'calm_breath_1min.mp4'], stdin=subprocess.PIPE)
NF = int(DUR * FPS)
for i in range(NF):
    ff.stdin.write(frame(i / FPS).tobytes())
    if i % 150 == 0: print(f'\rvideo {i * 100 // NF}%', end='', flush=True)
ff.stdin.close(); ff.wait(); os.remove('audio.raw')
print('\nwrote calm_breath_1min.mp4')
