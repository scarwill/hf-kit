# Blue Lantern - Night Train Short (60 s, 1080x1920, 30 fps).
# Cosy carriage at night: curtains, a mug on the sill, frosted window corners, lamp reflection on the glass.
# Outside: moon + stars, three parallax layers (far hills, village lights, pine forest), telegraph poles with
# sagging wires, trackside lamps, three depths of snow. The carriage jolts gently on every rail-joint clack.
# Audio (all synthesised, fresh seed): rumble + 74 Hz motor hum, da-dum clacks, wind on the glass,
# slow warm pad (D - Bm - G - A - D), distant whistle at 6 s.  Run:  python night_train_short.py [still]
import numpy as np, subprocess, os, sys
from scipy.signal import butter, lfilter
from PIL import Image, ImageDraw, ImageFilter, ImageFont

SR, DUR, W, H, FPS = 44100, 60.0, 1080, 1920, 30
N = int(SR * DUR); t = np.arange(N) / SR
rng = np.random.default_rng(2610)
OUT = os.path.dirname(os.path.abspath(__file__))

def filt(x, f, kind='low', o=2):
    b, a = butter(o, np.array(f) / (SR / 2), kind); return lfilter(b, a, x)

# ---------------- rail-joint times (shared by audio clacks and visual jolts) ----------------
CT = []; st = .3
while st < DUR - 1.5:
    for dt, g in [(0, 1), (.22, .8), (.92, .9), (1.14, .7)]: CT.append((st + dt + rng.normal(0, .004), g))
    st += 3.3 * (1 + rng.normal(0, .01))

# ---------------- audio ----------------
out = np.zeros((2, N))
for c in range(2):  # rumble + motor hum (kept above 60 Hz)
    r = filt(np.cumsum(rng.standard_normal(N)), [50, 240], 'band'); r /= np.std(r)
    hum = .22 * np.sin(2 * np.pi * 74 * t) + .1 * np.sin(2 * np.pi * 148 * t + c) + .04 * np.sin(2 * np.pi * 222 * t)
    out[c] += (r * .5 + hum * .45) * (1 + .15 * np.sin(2 * np.pi * t / 7.3 + c))
def clack(g, f0):
    n = int(.15 * SR); tt = np.arange(n) / SR
    body = np.sin(2 * np.pi * f0 * tt) * np.exp(-tt * 40)
    hit = filt(rng.standard_normal(n), [600, 3200], 'band') * np.exp(-tt * 170) * .45
    return filt(body + hit, 2200) * g
for tc, g in CT:
    i0 = int(tc * SR); c_ = clack(.5 * g * (.85 + .3 * rng.random()), 105 + rng.random() * 35)
    out[0, i0:i0 + len(c_)] += c_ * .9; out[1, i0:i0 + len(c_)] += c_ * .8
for c in range(2):  # wind / air on the glass
    w = filt(rng.standard_normal(N), [300, 1400], 'band'); w /= np.std(w)
    out[c] += w * .06 * (.6 + .4 * np.sin(2 * np.pi * t / 11 + 2 * c)) ** 2
CH = [[146.83, 220, 277.18, 369.99], [123.47, 185, 220, 293.66], [98, 146.83, 185, 246.94],
      [110, 164.81, 246.94, 329.63], [146.83, 220, 277.18, 369.99]]
pad = np.zeros((2, N))
for k, ch in enumerate(CH):
    s, e = k * 12, k * 12 + 12
    env = np.clip(np.minimum((t - s + 2.5) / 5, (e + 2.5 - t) / 5), 0, 1); env = np.sin(env * np.pi / 2) ** 2
    if k == 0: env = np.where(t < s + 2.5, np.clip(t / 4, 0, 1), env)
    for f in ch:
        for c, det in enumerate([-.6, .6]):
            ph = rng.random() * 6
            v = sum(np.sin(2 * np.pi * f * h * (1 + det / 1200) * t + ph * h) / h ** 1.6 for h in (1, 2, 3))
            pad[c] += v * env
pad = filt(pad, 1400) * (.85 + .15 * np.sin(2 * np.pi * t / 9))
out += pad * .05
wt = t - 6.0  # distant whistle, right side, two soft tones
wh = ((wt > 0) & (wt < 5)) * np.clip(wt / .7, 0, 1) * np.exp(-np.clip(wt, 0, None) / 2.4)
whistle = filt((np.sin(2 * np.pi * 523.25 * t) + np.sin(2 * np.pi * 659.25 * t) + .3 * np.sin(2 * np.pi * 1046.5 * t)) * wh, 1700)
out[0] += whistle * .04; out[1] += whistle * .08
fade = np.minimum(1, t / 1.5) * np.minimum(1, (DUR - t) / 2.5)
m = filt(out, 38, 'high').T * fade[:, None]
m *= 10 ** (-16.5 / 20) / np.sqrt(np.mean(m ** 2)); m = np.tanh(m * 1.2) / 1.2
pk = np.abs(m).max(); lim = 10 ** (-1 / 20)
if pk > lim: m *= lim / pk
print(f'rms {20*np.log10(np.sqrt(np.mean(m**2))):.1f} dB  peak {20*np.log10(np.abs(m).max()):.1f} dB')
m.astype(np.float32).tofile('/tmp/nts.raw')

# ---------------- visual pre-render ----------------
def font(sz, w='Light'):
    for f in [f'/usr/share/fonts/opentype/inter/Inter-{w}.otf', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf']:
        try: return ImageFont.truetype(f, sz)
        except OSError: pass
    return ImageFont.load_default()
def glow_sprite(r, col, blur):
    s = int(r * 2 + blur * 4); im = Image.new('RGB', (s, s)); ImageDraw.Draw(im).ellipse([s / 2 - r, s / 2 - r, s / 2 + r, s / 2 + r], fill=col)
    return np.asarray(im.filter(ImageFilter.GaussianBlur(blur)), np.float32)
def add(arr, spr, cx, cy, g=1.):
    h, w = spr.shape[:2]; x0, y0 = int(cx - w / 2), int(cy - h / 2)
    xa, ya, xb, yb = max(0, x0), max(0, y0), min(W, x0 + w), min(H, y0 + h)
    if xa < xb and ya < yb: arr[ya:yb, xa:xb] += spr[ya - y0:yb - y0, xa - x0:xb - x0] * g

WX0, WY0, WX1, WY1 = 110, 430, 970, 1500           # window
yy = np.linspace(0, 1, H)[:, None, None]
SKY = (np.array([6, 9, 28]) * (1 - yy) + np.array([20, 46, 66]) * yy) * np.ones((1, W, 1))
SKY = SKY.astype(np.float32)
for _ in range(220):
    x, y = rng.integers(0, W), rng.integers(WY0, 1000); b = 60 + rng.random() ** 3 * 160; SKY[y, x] += b
add(SKY, glow_sprite(150, (70, 90, 110), 90), 760, 620, .8)          # moon halo
add(SKY, glow_sprite(46, (225, 232, 225), 2), 760, 620)              # moon disc

L = W * 4
def strip(seed, base, amp, col, cycles, trees=False, lights=False):
    r = np.random.default_rng(seed); x = np.arange(L)
    y = base + sum(amp / k * np.sin(2 * np.pi * x * cycles * k / L + r.random() * 6) for k in range(1, 6))
    im = Image.new('RGBA', (L, H)); d = ImageDraw.Draw(im)
    d.polygon([(0, H)] + [(i, y[i]) for i in range(0, L, 6)] + [(L - 1, y[-1]), (L - 1, H)], fill=col + (255,))
    if trees:
        for _ in range(260):
            tx = r.integers(0, L); th = 60 + r.random() * 150; ty = y[tx] + 12
            for k in range(4):
                ww = th * (.42 - k * .08); yt = ty - th * (k + 1) / 4
                d.polygon([(tx - ww, yt + th / 3), (tx + ww, yt + th / 3), (tx, yt - th / 6)], fill=col + (255,))
    a = np.asarray(im, np.float32)
    if lights:
        li = np.zeros((H, L, 3), np.float32)
        for _ in range(42):
            lx = r.integers(20, L - 20); ly = int(y[lx] + 15 + r.random() * 40)
            sp = glow_sprite(3, (255, 196, 120), 4)
            hh, ww_ = sp.shape[:2]; li[ly - hh // 2:ly - hh // 2 + hh, lx - ww_ // 2:lx - ww_ // 2 + ww_] += sp * 1.6
        a[..., :3] += li; a[..., 3] = np.maximum(a[..., 3], np.clip(li.max(-1), 0, 255))
    a = np.concatenate([a, a[:, :W]], 1)                                # wrap
    rows = np.where(a[..., 3].max(1) > 0)[0]; return a, rows.min()
FAR, fy = strip(11, 1060, 55, (17, 34, 54), 3)
MID, my = strip(12, 1180, 40, (12, 24, 40), 5, lights=True)
NEAR, ny = strip(13, 1380, 30, (6, 12, 22), 7, trees=True)
LAYERS = [(FAR, fy, 18), (MID, my, 60), (NEAR, ny, 260)]

cab = Image.new('RGB', (W, H), (13, 16, 30)); cd = ImageDraw.Draw(cab)
cd.rounded_rectangle([WX0 - 26, WY0 - 26, WX1 + 26, WY1 + 26], 70, fill=(22, 26, 44))            # window frame
cd.rectangle([0, WY1 + 40, W, WY1 + 110], fill=(30, 26, 32)); cd.rectangle([0, WY1 + 110, W, H], fill=(16, 16, 26))  # sill
for side in (0, 1):                                                   # curtains with folds
    for k in range(6):
        x0 = (20 + k * 30) if side == 0 else (W - 210 + k * 30); v = 26 + (k % 2) * 8
        cd.rectangle([x0, 330, x0 + 30, WY1 + 40], fill=(v + 10, v - 6, v + 4))
cd.rounded_rectangle([700, WY1 - 30, 820, WY1 + 60], 18, fill=(40, 34, 38))                       # mug
cd.ellipse([800, WY1 - 10, 860, WY1 + 40], outline=(40, 34, 38), width=14)
CAB = np.asarray(cab.filter(ImageFilter.GaussianBlur(1.5)), np.float32)
add(CAB, glow_sprite(320, (70, 48, 24), 200), 860, 1700)                                         # warm lamp in the carriage
rim = Image.new('L', (W, H)); ImageDraw.Draw(rim).line([(704, WY1 - 24), (704, WY1 + 54)], fill=150, width=3)
CAB += np.asarray(rim.filter(ImageFilter.GaussianBlur(2)), np.float32)[..., None] * np.array([1, .75, .45], np.float32)
mk = Image.new('L', (W, H)); ImageDraw.Draw(mk).rounded_rectangle([WX0, WY0, WX1, WY1], 54, fill=255)
MASK = (np.asarray(mk.filter(ImageFilter.GaussianBlur(3)), np.float32) / 255)[..., None]
GLASS = np.zeros((H, W, 3), np.float32)                                                           # reflection + frosted corners
add(GLASS, glow_sprite(200, (60, 42, 22), 140), 820, 1350, .5)
fr = np.asarray(Image.fromarray((rng.random((H // 4, W // 4)) * 255).astype(np.uint8)).resize((W, H)).filter(ImageFilter.GaussianBlur(4)), np.float32) / 255
Y, X = np.mgrid[0:H, 0:W]
cor = np.maximum(0, 1 - np.minimum(np.minimum(np.hypot(X - WX0, Y - WY0), np.hypot(X - WX1, Y - WY0)),
                                     np.minimum(np.hypot(X - WX0, Y - WY1), np.hypot(X - WX1, Y - WY1))) / 260) ** 1.5
GLASS += (cor * (.5 + .5 * fr) * 70)[..., None] * np.array([.9, 1, 1.05], np.float32)
del Y, X, fr, cor

txt = Image.new('RGBA', (W, H)); td = ImageDraw.Draw(txt)
td.text((W // 2, 215), 'Fall asleep on', font=font(78), fill=(235, 248, 250, 255), anchor='mm')
td.text((W // 2, 310), 'a night train', font=font(78, 'Medium'), fill=(235, 248, 250, 255), anchor='mm')
TXT = np.asarray(txt, np.float32)
sub = Image.new('RGBA', (W, H)); ImageDraw.Draw(sub).text((W // 2, 1640), 'close your eyes  ·  listen to the rails', font=font(38), fill=(200, 225, 235, 230), anchor='mm')
SUB = np.asarray(sub, np.float32)
LAMP = glow_sprite(14, (255, 190, 110), 26); LAMPC = glow_sprite(7, (255, 230, 190), 4)

NS = [(140, .25, 70, 1.5), (110, .55, 260, 2.5), (40, 1., 700, 5)]   # snow layers: count, size, speed, width
SNOW = [(rng.random(n) * W, rng.random(n) * H, rng.random(n), sp, wd, b) for n, b, sp, wd in NS]

def jolt(tm):
    return sum(g * 5 * np.exp(-(tm - tc) * 9) * np.sin(2 * np.pi * 6 * (tm - tc)) for tc, g in CT if 0 <= tm - tc < .6)

def frame(i):
    tm = i / FPS; o = SKY.copy()
    for A, y0, sp in LAYERS:
        off = int(tm * sp) % L; a = A[y0:, off:off + W]; al = a[..., 3:] / 255
        o[y0:] = o[y0:] * (1 - al) + a[..., :3] * al
    im = Image.fromarray(np.clip(o, 0, 255).astype(np.uint8)); d = ImageDraw.Draw(im)
    PS, PSP = 820, 620                                                 # telegraph poles + wires
    base = -(tm * PSP) % PS; poles = [base + k * PS - PS for k in range(4)]
    for k, px in enumerate(poles):
        d.line([px, 760, px, 1520], fill=(4, 8, 16), width=14); d.line([px - 50, 790, px + 50, 790], fill=(4, 8, 16), width=8)
        nx = px + PS; xs = np.linspace(px, nx, 30)
        for wy in (790, 820):
            ys = wy + 70 * (1 - ((xs - px) / PS * 2 - 1) ** 2); d.line(list(zip(xs, ys)), fill=(8, 12, 22), width=3)
    for sx, sy, ss, sp, wd, b in SNOW:
        x = (sx - tm * sp * (.8 + .4 * ss)) % W; y = (sy + tm * sp * .22) % H
        v = (120 + 120 * ss * b).astype(int)
        for k in range(len(sx)):
            ln = 4 + sp * .03 * (1 + ss[k]); d.line([x[k], y[k], x[k] + ln, y[k] - ln * .25], fill=(v[k], v[k] + 4, min(255, v[k] + 10)), width=max(1, int(wd * (.6 + .6 * ss[k]))))
    o = np.asarray(im, np.float32)
    lx = (-(tm * PSP) % (PS * 3)) - PS          # lamp on every 3rd pole
    add(o, LAMP, lx, 770, 1.2); add(o, LAMPC, lx, 770)
    dy = int(round(jolt(tm)))
    if dy: o = np.roll(o, dy, 0)
    f = o * MASK + CAB * (1 - MASK) + GLASS * MASK
    a = TXT[..., 3:] / 255 * min(1, tm / .6); f = f * (1 - a) + TXT[..., :3] * a
    sa = SUB[..., 3:] / 255 * np.clip(min((tm - 1.5) / 1, (10 - tm) / 1.5), 0, 1); f = f * (1 - sa) + SUB[..., :3] * sa
    return np.clip(f * min(1, tm / .8 + .25, (DUR - tm) / 2), 0, 255).astype(np.uint8)

if len(sys.argv) > 1 and sys.argv[1] == 'still':
    ims = [Image.fromarray(frame(int(s * FPS))).resize((360, 640)) for s in (2, 14, 30, 50)]
    sheet = Image.new('RGB', (1440, 640)); [sheet.paste(im, (k * 360, 0)) for k, im in enumerate(ims)]; sheet.save('/tmp/nts_sheet.png')
    Image.fromarray(frame(int(30 * FPS))).save('/tmp/nts_full.png'); sys.exit()
p = subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                      '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '/tmp/nts.raw', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19',
                      '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart',
                      os.path.join(OUT, 'night_train_short.mp4')], stdin=subprocess.PIPE)
for i in range(int(DUR * FPS)): p.stdin.write(frame(i).tobytes())
p.stdin.close(); p.wait(); print('done')
