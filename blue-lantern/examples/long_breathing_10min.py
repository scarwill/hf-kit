# 10-Minute Guided Breathing for Calm & Focus — full video generator (1920x1080, 30 fps, ~10 min).
# Original music (drone that swells with the breath, singing bowls, soft cue chime, faint ocean) + original visual
# (breathing circle, guide ring, drifting light, cues, countdown, chapter progress bar). Also writes thumbnail.png.
#
# Sections (these are the chapters for the YouTube description):
#   0:00 Intro | 0:15 Relaxed breathing 4-6 | 3:15 Box breathing 4-4-4-4 | 6:27 Deep calm 5-7 | 9:27 Rest & finish
#
# Setup (once):  pip install numpy scipy pillow      + ffmpeg on PATH
# Run:           python make_breathing_10min.py          -> breathing_10min.mp4 + thumbnail.png
#                python make_breathing_10min.py test     -> first 40 s only (quick check)
# Speed: frames are drawn on all CPU cores in parallel; if your NVIDIA GPU + ffmpeg support NVENC it is used for encoding.
import sys, os, subprocess, shutil, multiprocessing as mp
import numpy as np
from scipy.signal import butter, lfilter, fftconvolve
from PIL import Image, ImageDraw, ImageFont

W, H, FPS, SR = 1920, 1080, 30, 44100
TEST = len(sys.argv) > 1 and sys.argv[1] == 'test'
CHIME_EVERY_BREATH = True                 # set False for only section chimes

# ---------------- breathing plan ----------------
INTRO = 15.0
SECTIONS = [  # (name, label, phases [(cue, seconds, level_from, level_to)], cycles)
    ('Relaxed breathing', '4 in · 6 out', [('Breathe in', 4, 0, 1), ('Breathe out', 6, 1, 0)], 18),
    ('Box breathing', '4 in · 4 hold · 4 out · 4 hold', [('Breathe in', 4, 0, 1), ('Hold', 4, 1, 1), ('Breathe out', 4, 1, 0), ('Hold', 4, 0, 0)], 12),
    ('Deep calm', '5 in · 7 out', [('Breathe in', 5, 0, 1), ('Breathe out', 7, 1, 0)], 15),
]
PH = []                                    # flat list: (t0, t1, cue, a, b, section index, cycle, cycles)
t = INTRO; SEC_T = []
for si, (name, lab, phases, cyc) in enumerate(SECTIONS):
    SEC_T.append(t)
    for c in range(cyc):
        for cue, d, a, b in phases: PH.append((t, t + d, cue, a, b, si, c, cyc)); t += d
BREATH_END = t; OUTRO = 33.0; FULL = BREATH_END + OUTRO          # 600 s
DUR = 40.0 if TEST else FULL
PT0 = np.array([p[0] for p in PH]); PT1 = np.array([p[1] for p in PH])
PA = np.array([p[3] for p in PH], float); PB = np.array([p[4] for p in PH], float)

def breath(tt):                            # lung level 0..1 for scalar or array time
    tt = np.asarray(tt, float); i = np.clip(np.searchsorted(PT0, tt, 'right') - 1, 0, len(PH) - 1)
    u = np.clip((tt - PT0[i]) / (PT1[i] - PT0[i]), 0, 1); e = .5 - .5 * np.cos(np.pi * u)
    v = PA[i] + (PB[i] - PA[i]) * e
    return np.where((tt >= INTRO) & (tt < BREATH_END), v, 0.0)
def phase_at(tt):
    if tt < INTRO or tt >= BREATH_END: return None
    i = int(np.clip(np.searchsorted(PT0, tt, 'right') - 1, 0, len(PH) - 1)); return PH[i]
def fmt(s): return f'{int(s // 60)}:{int(s % 60):02d}'

# ======================= AUDIO =======================
def make_audio(path):
    rng = np.random.default_rng(12)
    N = int(DUR * SR); tt = np.arange(N) / SR; L = np.zeros(N); R = np.zeros(N)
    hz = lambda m: 440 * 2 ** ((m - 69) / 12)
    def lp(x, fc): b, a = butter(2, fc / (SR / 2)); return lfilter(b, a, x)
    br = breath(tt)
    # drone pad: chord changes every ~30 s (crossfaded), dark layer always, bright layer opens with the in-breath
    CH = [[50, 57, 62, 64, 69], [50, 55, 59, 62, 66], [47, 54, 59, 62, 66], [45, 52, 57, 62, 64],
          [43, 50, 55, 59, 62], [50, 57, 62, 66, 69], [47, 54, 57, 62, 66], [45, 52, 57, 61, 64]]
    SEG, XF = 30.0, 8.0
    for s in range(int(np.ceil(DUR / SEG)) + 1):
        a0, a1 = s * SEG - XF, (s + 1) * SEG + XF; i0, i1 = max(0, int(a0 * SR)), min(N, int(a1 * SR))
        if i0 >= i1: continue
        t_ = tt[i0:i1]; up = np.clip((t_ - a0) / (2 * XF), 0, 1); dn = np.clip((a1 - t_) / (2 * XF), 0, 1)
        w = (.5 - .5 * np.cos(np.pi * up)) * (.5 - .5 * np.cos(np.pi * dn)); b_ = br[i0:i1]
        for j, m in enumerate(CH[s % len(CH)]):
            for det, pan in ((-.05, .3), (.05, .7)):
                ph = 2 * np.pi * hz(m) * 2 ** (det / 12) * t_ + j
                v = (np.sin(ph) + .2 * np.sin(2 * ph) + (.35 * np.sin(3 * ph) + .2 * np.sin(4 * ph) + .1 * np.sin(5 * ph)) * b_) * w * (.9 if j == 0 else .45)
                L[i0:i1] += v * (1 - pan); R[i0:i1] += v * pan
    g = .017 * (.75 + .25 * br); L = lp(L, 2400) * g; R = lp(R, 2400) * g
    nz = rng.standard_normal((2, N)).astype(np.float32)
    air = np.clip(np.gradient(br) * SR, 0, None) * .5 + br * .3                 # breath air on the in-breath
    L += lp(nz[0], 900) * .012 * air; R += lp(nz[1], 950) * .012 * air
    surge = .6 + .4 * np.sin(2 * np.pi * tt / 9 + 1) ** 2                         # faint ocean
    L += lp(nz[1], 420) * .02 * surge; R += lp(nz[0], 440) * .02 * surge
    del nz
    def add(x, at, pan):
        i0 = int(at * SR)
        if i0 >= N: return
        i1 = min(N, i0 + len(x)); L[i0:i1] += x[:i1 - i0] * (1.1 - pan); R[i0:i1] += x[:i1 - i0] * (.1 + pan)
    def bowl(f, g):
        n = int(12 * SR); t_ = np.arange(n) / SR; s = np.zeros(n)
        for ratio, a, d in ((1, 1, .35), (2.76, .55, .6), (5.40, .25, 1.1), (8.93, .1, 1.8)):
            for db in (-.6, .6): s += a * np.sin(2 * np.pi * (f * ratio + db * ratio ** .5) * t_ + rng.uniform(0, 6)) * np.exp(-t_ * d)
        return s * np.minimum(1, t_ / .008) * g
    for at, m in [(.3, 62)] + [(st - .2, [57, 59, 55][k]) for k, st in enumerate(SEC_T)] + [(BREATH_END + .3, 62), (FULL - 9, 57)]:
        add(bowl(hz(m), .045), at, .45)
    n = int(2.5 * SR); t_ = np.arange(n) / SR
    for k, p in enumerate(PH):
        if p[2] != 'Breathe in' or not (CHIME_EVERY_BREATH or p[6] == 0): continue
        f = hz(81 if k % 2 == 0 else 78)
        add((np.sin(2 * np.pi * f * t_) + .25 * np.sin(2 * np.pi * f * 2.99 * t_) * np.exp(-t_ * 4)) * np.exp(-t_ * 1.8) * np.minimum(1, t_ / .004) * .009, p[0], .4)
    m = np.stack([L, R], 1); del L, R
    ir_n = int(4 * SR); ti = np.arange(ir_n) / SR
    for c in (0, 1):
        ir = lp(rng.standard_normal(ir_n), 5000) * np.exp(-ti * 1.6); ir /= np.sqrt((ir ** 2).sum())
        m[:, c] = m[:, c] * .8 + fftconvolve(m[:, c], ir)[:N] * .35
    m *= (np.minimum(1, tt / 2) * np.clip((DUR - tt) / 6, 0, 1))[:, None]
    hb, ha = butter(2, 40 / (SR / 2), 'high'); m = lfilter(hb, ha, m, axis=0)
    m *= 10 ** (-16 / 20) / np.sqrt(np.mean(m ** 2)); m = np.tanh(m * 1.05) / 1.05
    m.astype(np.float32).tofile(path)
    print(f'audio ready ({DUR / 60:.1f} min, peak {20 * np.log10(np.abs(m).max()):.1f} dB)')

# ======================= VIDEO =======================
def find_font(names, size):
    dirs = ['', '/usr/share/fonts/opentype/inter/', '/usr/share/fonts/truetype/dejavu/', 'C:/Windows/Fonts/', '/Library/Fonts/', '/System/Library/Fonts/', os.path.expanduser('~/.fonts/')]
    for n in names:
        for d in dirs:
            try: return ImageFont.truetype(d + n, size)
            except OSError: pass
    return ImageFont.load_default(size)
LIGHT = ['Inter-Light.otf', 'segoeuil.ttf', 'HelveticaNeue.ttc', 'Arial.ttf', 'arial.ttf', 'DejaVuSans.ttf']
MED = ['Inter-Medium.otf', 'segoeuisb.ttf', 'seguisb.ttf', 'Arial Bold.ttf', 'arialbd.ttf', 'DejaVuSans-Bold.ttf']
F = {}
def fonts():
    if not F:
        F.update(big=find_font(LIGHT, 84), mid=find_font(LIGHT, 46), small=find_font(LIGHT, 32), title=find_font(MED, 78), sec=find_font(MED, 34))
    return F
CX, CY = W / 2, H * .545
YY, XX = np.mgrid[0:H // 2, 0:W // 2].astype(np.float32) * 2
DD = np.hypot(XX - CX, YY - CY)
TOP, BOT = np.array([10, 14, 38], np.float32), np.array([14, 52, 66], np.float32)
GRAD = TOP[None, None] + (BOT - TOP)[None, None] * (YY / H)[..., None]
PART = np.random.default_rng(5).uniform(0, 1, (110, 4))
def sm(a, b, x): x = np.clip((x - a) / (b - a), 0, 1); return x * x * (3 - 2 * x)
RMIN, RMAX = 115, 300

def frame(tf, clean=False):
    fo = fonts(); b = float(breath(tf)); r = RMIN + (RMAX - RMIN) * b
    img = GRAD.copy()
    for k, (bx, by, col) in enumerate(((.25, .3, (40, 90, 140)), (.78, .62, (60, 50, 120)), (.45, .85, (30, 110, 120)))):
        px = W * (bx + .07 * np.sin(tf * .05 + k * 2)); py = H * (by + .06 * np.cos(tf * .04 + k))
        img += (np.exp(-((XX - px) ** 2 + (YY - py) ** 2) / (2 * 420 ** 2)) * .35)[..., None] * np.array(col, np.float32)
    fill = sm(r + 6, r - 6, DD) * (.10 + .10 * b); rim = np.exp(-((DD - r) / 6.5) ** 2) * (.55 + .35 * b)
    halo = np.exp(-np.clip(DD - r, 0, None) / (36 + 55 * b)) * (DD > r) * (.18 + .22 * b)
    guide = np.exp(-((DD - (RMAX + 12)) / 2.3) ** 2) * .12
    img += (fill + rim + halo + guide)[..., None] * np.array([150, 230, 235], np.float32)
    im = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).resize((W, H), Image.BILINEAR).convert('RGBA')
    ov = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
    for x, y, sp, ph in PART:
        py = (y * H - tf * (8 + 18 * sp)) % H; px = x * W + 14 * np.sin(tf * .3 + ph * 6)
        a = int(55 + 90 * (.5 + .5 * np.sin(tf * (.6 + sp) + ph * 6))); s = 1.5 + 2.5 * sp
        d.ellipse([px - s, py - s, px + s, py + s], fill=(220, 245, 255, a))
    def text(s, y, font, alpha, x=None):
        if alpha <= .01: return
        w = d.textlength(s, font=font); d.text((W / 2 - w / 2 if x is None else x, y), s, font=font, fill=(235, 248, 250, int(255 * min(1, alpha))))
    if clean: return Image.alpha_composite(im, ov).convert('RGB').tobytes()
    # intro
    a = sm(.4, 1.4, tf) * (1 - sm(INTRO - 1.2, INTRO - .2, tf))
    text('10 Minute Breathing', H * .12, fo['title'], a); text('for calm & focus', H * .12 + 100, fo['mid'], a * .85)
    text('Sit comfortably. Follow the circle.', H * .86, fo['small'], a * .8 * sm(3, 4, tf))
    if INTRO - 4 <= tf < INTRO: text(str(int(INTRO - tf) + 1), CY - 28, fo['mid'], .75 * sm(INTRO - 4, INTRO - 3.6, tf))
    # breathing cues
    p = phase_at(tf)
    if p:
        t0, t1, cue, _, _, si, c, cyc = p; u = tf - t0; dur = t1 - t0
        ac = sm(0, .45, u) * (1 - sm(dur - .45, dur, u))
        text(cue, H * .10, fo['big'], ac)
        text(str(int(dur - u) + 1), CY - 28, fo['mid'], ac * .7)
        st = SEC_T[si]; asec = sm(st, st + 1.5, tf)
        text(SECTIONS[si][0], 70, fo['sec'], .75 * asec, x=80); text(SECTIONS[si][1], 116, fo['small'], .55 * asec, x=80)
        text(f'breath {c + 1} of {cyc}', H * .88, fo['small'], .5 * asec)
        if tf - st < 6:                                             # section banner when a new technique starts
            ab = sm(0, .8, tf - st) * (1 - sm(4.5, 6, tf - st)); text(SECTIONS[si][1], H * .10 + 100, fo['mid'], ab * .9)
    # outro
    ao = sm(BREATH_END + .5, BREATH_END + 2, tf) * (1 - sm(BREATH_END + 14, BREATH_END + 16, tf))
    text('Breathe naturally', H * .12, fo['big'], ao); text('notice how calm you feel', H * .12 + 100, fo['mid'], ao * .8)
    ae = sm(BREATH_END + 16.5, BREATH_END + 18, tf) * (1 - sm(FULL - 2, FULL - .5, tf))
    text('Well done.', H * .12, fo['big'], ae); text('Take this calm with you', H * .12 + 100, fo['mid'], ae * .85)
    # progress bar with chapter ticks
    x0, x1, yb = W * .3, W * .7, H * .94
    d.rounded_rectangle([x0, yb, x1, yb + 4], 2, fill=(255, 255, 255, 38))
    d.rounded_rectangle([x0, yb, x0 + (x1 - x0) * min(1, tf / FULL), yb + 4], 2, fill=(160, 235, 240, 140))
    for st in SEC_T + [BREATH_END]:
        xt = x0 + (x1 - x0) * st / FULL; d.ellipse([xt - 4, yb - 2, xt + 4, yb + 6], fill=(220, 245, 250, 110))
    return Image.alpha_composite(im, ov).convert('RGB').tobytes()

def thumbnail(path):
    global RMIN
    im = Image.frombytes('RGB', (W, H), frame(INTRO + 4.0, clean=True)).resize((1280, 720))   # circle at full breath
    ov = Image.new('RGBA', (1280, 720), (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
    big, mid = find_font(MED, 150), find_font(LIGHT, 64)
    def ctext(s, y, f, a=255):
        w = d.textlength(s, font=f); d.text((640 - w / 2 + 3, y + 4), s, font=f, fill=(0, 10, 25, 140)); d.text((640 - w / 2, y), s, font=f, fill=(240, 252, 255, a))
    d.rectangle([0, 0, 1280, 720], fill=(0, 0, 0, 70))
    ctext('10 MIN', 210, big); ctext('BREATHE', 380, find_font(LIGHT, 96)); ctext('calm  •  focus  •  sleep', 520, mid, 220)
    Image.alpha_composite(im.convert('RGBA'), ov).convert('RGB').save(path, quality=95)
    print('wrote', path)

def encoder():
    if shutil.which('ffmpeg') is None: sys.exit('ffmpeg not found on PATH')
    try:
        ok = subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-f', 'lavfi', '-i', 'color=c=black:s=256x256:d=0.2',
                             '-c:v', 'h264_nvenc', '-f', 'null', '-'], capture_output=True).returncode == 0
    except Exception: ok = False
    if ok: print('encoder: NVIDIA GPU (h264_nvenc)'); return ['-c:v', 'h264_nvenc', '-preset', 'p5', '-cq', '19', '-b:v', '0']
    print('encoder: CPU (libx264)'); return ['-c:v', 'libx264', '-preset', 'medium', '-crf', '18']

if __name__ == '__main__':
    print(f'sections start at {[fmt(s) for s in SEC_T]}, breathing ends {fmt(BREATH_END)}, total {fmt(FULL)}')
    make_audio('audio.raw')
    thumbnail('thumbnail.png')
    out = 'breathing_10min_test.mp4' if TEST else 'breathing_10min.mp4'
    ff = subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', 'pipe:0',
                           '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', 'audio.raw'] + encoder() +
                          ['-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out], stdin=subprocess.PIPE)
    NF = int(DUR * FPS); times = [i / FPS for i in range(NF)]
    with mp.Pool(max(1, (os.cpu_count() or 2) - 1)) as pool:
        for i, fb in enumerate(pool.imap(frame, times, chunksize=8)):
            ff.stdin.write(fb)
            if i % 300 == 0: print(f'\rvideo {i * 100 // NF:3d}%  ({fmt(i / FPS)} / {fmt(DUR)})', end='', flush=True)
    ff.stdin.close(); ff.wait(); os.remove('audio.raw')
    print(f'\nwrote {out}')
