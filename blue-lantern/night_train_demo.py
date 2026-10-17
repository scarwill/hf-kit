# Blue Lantern - Night Train (sleep journey) 60 s demo, 1920x1080 15 fps.
# Audio fully synthesised: low carriage rumble, rail-joint clacks (da-dum), soft cabin rattle, one distant whistle.
# Visual: dark carriage window, snow streaming past, hill silhouettes with parallax, passing trackside lamps.
import numpy as np, subprocess, os
from scipy.signal import butter, lfilter
from PIL import Image, ImageDraw, ImageFilter, ImageFont

SR, DUR, W, H, FPS = 44100, 60.0, 1920, 1080, 15
N = int(SR * DUR); t = np.arange(N) / SR
rng = np.random.default_rng(717)
OUT = os.path.dirname(os.path.abspath(__file__))

def filt(x, f, kind='low', o=2):
    b, a = butter(o, np.array(f) / (SR / 2), kind); return lfilter(b, a, x)

# ---------------- audio ----------------
out = np.zeros((2, N))
for c in range(2):  # 1. carriage rumble: brown-ish noise 45-220 Hz, slow sway
    r = filt(np.cumsum(rng.standard_normal(N)), [45, 220], 'band'); r /= np.std(r)
    sway = 1 + .15 * np.sin(2 * np.pi * t / 7.3 + c)
    hum = .25 * np.sin(2 * np.pi * 74 * t) + .12 * np.sin(2 * np.pi * 148 * t + c)  # motor hum, above 60 Hz
    out[c] += (r * .5 + hum * .4) * sway
def clack(g, f0):
    n = int(.14 * SR); tt = np.arange(n) / SR
    body = np.sin(2 * np.pi * f0 * tt) * np.exp(-tt * 38)
    hit = filt(rng.standard_normal(n), [700, 3500], 'band') * np.exp(-tt * 160) * .5
    return filt(body + hit, 2400) * g
period = 1.72; st = .4  # 2. rail joints: front bogie then rear bogie, 0.24 s apart
while st < DUR - 1.5:
    for dt, g in [(0, .55), (.24, .45), (.86, .5), (1.10, .4)]:
        i0 = int((st + dt + rng.normal(0, .004)) * SR); c_ = clack(g * (.85 + .3 * rng.random()), 110 + rng.random() * 40)
        out[0, i0:i0 + len(c_)] += c_ * .9; out[1, i0:i0 + len(c_)] += c_ * .8
    st += period * 2 * (1 + rng.normal(0, .01))
rat = filt(rng.standard_normal(N), [1500, 5000], 'band'); rat /= np.std(rat)  # 3. faint cabin rattle / air
out += rat * .025 * (1 + .5 * np.sin(2 * np.pi * t / 3.1)) ** 2
wt = t - 34; wh = np.where((wt > 0) & (wt < 4.5), 1, 0) * np.minimum(1, wt / .6).clip(0) * np.exp(-np.clip(wt, 0, None) / 2.2)
whistle = filt((np.sin(2 * np.pi * 523 * t) + np.sin(2 * np.pi * 659 * t) + .4 * np.sin(2 * np.pi * 1046 * t)) * wh, 1800)
out[0] += whistle * .05; out[1] += whistle * .09  # 4. distant whistle, right side
fade = np.minimum(1, t / 3) * np.minimum(1, (DUR - t) / 4)
m = filt(out, 38, 'high').T * fade[:, None]
m *= 10 ** (-17 / 20) / np.sqrt(np.mean(m ** 2)); m = np.tanh(m * 1.2) / 1.2
pk = np.abs(m).max(); lim = 10 ** (-1 / 20)
if pk > lim: m *= lim / pk
print(f'rms {20*np.log10(np.sqrt(np.mean(m**2))):.1f} dB  peak {20*np.log10(np.abs(m).max()):.1f} dB')
m.astype(np.float32).tofile('/tmp/nt.raw')

# ---------------- visual ----------------
def font(sz, bold=False):
    for f in ['Inter-Medium.ttf' if bold else 'Inter-Light.ttf', 'DejaVuSans.ttf']:
        for d in ['', '/usr/share/fonts/truetype/dejavu/']:
            try: return ImageFont.truetype(d + f, sz)
            except OSError: pass
    return ImageFont.load_default()
yy = np.linspace(0, 1, H)[:, None, None]
sky = (np.array([8, 12, 34]) * (1 - yy) + np.array([16, 40, 60]) * yy) * np.ones((1, W, 1))
def ridge(seed, base, amp):
    r = np.random.default_rng(seed); x = np.arange(W * 3)
    y = base + sum(amp / k * np.sin(2 * np.pi * x * k / (W * 3) * 3 + r.random() * 6) for k in range(1, 7))
    return y
R1, R2 = ridge(1, 720, 70), ridge(2, 830, 45)
NS = 260; sx, sy, ss = rng.random(NS) * W, rng.random(NS) * H, rng.random(NS)
frame_mask = Image.new('L', (W, H), 0); ImageDraw.Draw(frame_mask).rounded_rectangle([170, 110, W - 170, H - 150], 60, fill=255)
frame_mask = frame_mask.filter(ImageFilter.GaussianBlur(6))
cabin = Image.new('RGB', (W, H), (12, 16, 30))
cd = ImageDraw.Draw(cabin); cd.rectangle([0, H - 110, W, H], fill=(18, 22, 40))
glow = Image.new('RGB', (W, H), (0, 0, 0)); ImageDraw.Draw(glow).ellipse([W // 2 - 500, H - 220, W // 2 + 500, H + 200], fill=(60, 45, 25))
cabin = Image.fromarray(np.clip(np.asarray(cabin, float) + np.asarray(glow.filter(ImageFilter.GaussianBlur(120)), float), 0, 255).astype(np.uint8))
fT, fS = font(84), font(34)

def frame(i):
    tm = i / FPS; img = Image.fromarray(sky.astype(np.uint8)); d = ImageDraw.Draw(img)
    for R, spd, col in [(R1, 25, (14, 30, 48)), (R2, 90, (9, 18, 32))]:  # hills, parallax
        off = int(tm * spd) % (W * 2); ys = R[off:off + W]
        d.polygon([(0, H)] + [(x, ys[x]) for x in range(0, W, 8)] + [(W, H)], fill=col)
    lp = (tm * 520) % 1400 - 200  # trackside lamp every ~2.7 s, rushing left
    lx = W - lp
    lamp = Image.new('RGB', (W, H)); ImageDraw.Draw(lamp).ellipse([lx - 30, 560, lx + 30, 620], fill=(255, 190, 110))
    a = np.asarray(img, float) + np.asarray(lamp.filter(ImageFilter.GaussianBlur(28)), float) * .9
    d2 = ImageDraw.Draw(img := Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)))
    d2.line([lx, 590, lx, 900], fill=(20, 26, 40), width=6)
    x = (sx - tm * (280 + 500 * ss)) % W; y = (sy + tm * (60 + 90 * ss)) % H  # snow streams past
    for k in range(NS):
        r = 1.5 + 3 * ss[k]; v = int(140 + 110 * ss[k])
        d2.line([x[k], y[k], x[k] + 10 + 18 * ss[k], y[k] - 3], fill=(v, v + 5, v + 10), width=int(r))
    img = Image.composite(img, cabin, frame_mask)
    if tm < 7:  # title intro
        al = min(1, tm / 1.5, (7 - tm) / 1.5); txt = Image.new('RGBA', (W, H)); td = ImageDraw.Draw(txt)
        c = (235, 248, 250, int(255 * al))
        td.text((W // 2, H // 2 - 40), 'Night Train', font=fT, fill=c, anchor='mm')
        td.text((W // 2, H // 2 + 50), 'a slow journey through the snow  ·  rest now', font=fS, fill=(200, 225, 235, int(220 * al)), anchor='mm')
        img = Image.alpha_composite(img.convert('RGBA'), txt).convert('RGB')
    f = min(1, tm / 2, (DUR - tm) / 3)
    return (np.asarray(img, float) * f).astype(np.uint8)

import sys
if len(sys.argv) > 1 and sys.argv[1] == 'still':
    for s in [3, 15, 30, 45]: Image.fromarray(frame(int(s * FPS))).save(f'/tmp/nt_{s}.png')
    sys.exit()
p = subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                      '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '/tmp/nt.raw', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20',
                      '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart',
                      os.path.join(OUT, 'night_train_demo.mp4')], stdin=subprocess.PIPE)
for i in range(int(DUR * FPS)): p.stdin.write(frame(i).tobytes())
p.stdin.close(); p.wait(); print('done')
