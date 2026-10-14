# Blue Lantern — channel profile picture (800x800) and banner (2560x1440, text inside YouTube's 1546x423 safe area)
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

INTER = '/usr/share/fonts/opentype/inter/'
def font(n, s): return ImageFont.truetype(INTER + n, s)
rng = np.random.default_rng(7)

def sky(w, h, cx, cy, glow_r):
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    top, bot = np.array([8, 12, 34]), np.array([12, 40, 60])
    img = top + (bot - top) * (yy / h)[..., None]
    d = np.hypot(xx - cx, yy - cy)
    img += np.exp(-(d / glow_r) ** 2)[..., None] * np.array([40, 110, 170]) * .9          # lantern light on the night
    for k in range(int(w * h / 9000)):                                                     # stars
        x, y = rng.uniform(0, w), rng.uniform(0, h); r = rng.uniform(.6, 2.0)
        m = np.exp(-((xx[int(max(0, y - 4)):int(y + 5), int(max(0, x - 4)):int(x + 5)] - x) ** 2 + (yy[int(max(0, y - 4)):int(y + 5), int(max(0, x - 4)):int(x + 5)] - y) ** 2) / (2 * r * r))
        img[int(max(0, y - 4)):int(y + 5), int(max(0, x - 4)):int(x + 5)] += m[..., None] * rng.uniform(60, 160)
    return Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).convert('RGBA')

def lantern(size):
    """Original lantern mark drawn at 4x and downsampled (smooth edges). Returns RGBA, transparent background."""
    S = size * 4; im = Image.new('RGBA', (S, S), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    cx = S / 2; metal = (205, 225, 245, 255); metal_d = (120, 150, 190, 255)
    bw, bh, by = S * .34, S * .44, S * .30                               # glass body
    # inner light (radial), drawn on its own layer then blurred
    glow = Image.new('RGBA', (S, S), (0, 0, 0, 0)); g = ImageDraw.Draw(glow)
    for i in range(40, 0, -1):
        r = S * .20 * i / 40; a = int(255 * (1 - i / 40) ** 1.6)
        g.ellipse([cx - r, by + bh * .55 - r * 1.25, cx + r, by + bh * .55 + r * 1.25], fill=(120, 210, 255, a))
    glow = glow.filter(ImageFilter.GaussianBlur(S * .02))
    # glass
    d.rounded_rectangle([cx - bw / 2, by, cx + bw / 2, by + bh], radius=bw * .42, fill=(40, 110, 170, 150))
    im.alpha_composite(glow)
    d = ImageDraw.Draw(im)
    # flame
    fx, fy = cx, by + bh * .58
    d.ellipse([fx - S * .045, fy - S * .085, fx + S * .045, fy + S * .03], fill=(170, 235, 255, 255))
    d.polygon([(fx - S * .045, fy - S * .03), (fx, fy - S * .15), (fx + S * .045, fy - S * .03)], fill=(170, 235, 255, 255))
    d.ellipse([fx - S * .022, fy - S * .05, fx + S * .022, fy + S * .015], fill=(245, 252, 255, 255))
    # frame bars
    lw = int(S * .018)
    d.rounded_rectangle([cx - bw / 2, by, cx + bw / 2, by + bh], radius=bw * .42, outline=metal, width=lw)
    d.line([cx, by + lw, cx, by + bh * .32], fill=metal_d, width=int(lw * .7)); d.line([cx, by + bh * .78, cx, by + bh - lw], fill=metal_d, width=int(lw * .7))
    # cap + roof + handle
    d.rounded_rectangle([cx - bw * .62, by - S * .05, cx + bw * .62, by + S * .012], radius=S * .02, fill=metal)
    d.polygon([(cx - bw * .42, by - S * .05), (cx, by - S * .13), (cx + bw * .42, by - S * .05)], fill=metal)
    d.ellipse([cx - S * .06, by - S * .23, cx + S * .06, by - S * .11], outline=metal, width=lw)
    # base
    d.rounded_rectangle([cx - bw * .62, by + bh - S * .012, cx + bw * .62, by + bh + S * .05], radius=S * .02, fill=metal)
    d.rounded_rectangle([cx - bw * .4, by + bh + S * .05, cx + bw * .4, by + bh + S * .075], radius=S * .012, fill=metal_d)
    return im.resize((size, size), Image.LANCZOS)

# ---------- profile picture (shown as a circle: keep everything in the middle) ----------
P = 800
dp = sky(P, P, P / 2, P * .52, P * .42)
lm = lantern(int(P * .86)); dp.alpha_composite(lm, (int(P / 2 - lm.width / 2), int(P * .53 - lm.height / 2)))
dp.convert('RGB').save('blue_lantern_dp.png')

# ---------- banner ----------
BW, BH = 2560, 1440
LS = 440; t1, t2, t3 = font('Inter-Medium.otf', 124), font('Inter-Light.otf', 48), font('Inter-Light.otf', 36)
tmp = ImageDraw.Draw(Image.new('RGB', (10, 10))); tw = max(tmp.textlength('Blue Lantern', font=t1), tmp.textlength('guided breathing & calm music', font=t3))
gx = BW / 2 - (LS * .55 + tw) / 2                                   # centre lantern + text as one group
lx = gx + LS * .25
bn = sky(BW, BH, lx, BH / 2, 500)
lm = lantern(LS); bn.alpha_composite(lm, (int(lx - LS / 2), int(BH / 2 - LS / 2 + 18)))
d = ImageDraw.Draw(bn); x0 = gx + LS * .55
d.text((x0, BH / 2 - 135), 'Blue Lantern', font=t1, fill=(236, 248, 255))
d.text((x0 + 4, BH / 2 + 20), 'breathe  ·  calm  ·  focus', font=t2, fill=(170, 220, 240))
d.text((x0 + 4, BH / 2 + 92), 'guided breathing & calm music', font=t3, fill=(140, 180, 205))
bn.convert('RGB').save('blue_lantern_banner.png')
# check: text block must fit inside the safe area (x 507..2053, y 508..931)
print('group x', round(lx - LS * .2), '..', round(x0 + tw), '(safe 507..2053)')
