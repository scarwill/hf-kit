"""Hourglass (Janssen effect / Beverloo law) Short, synced to a TTS voiceover.
usage: python3 hourglass.py voice.m4a [stills t1 t2 ...]"""
import math
import os
import subprocess
import sys
import wave
from multiprocessing import Pool

import cairo
import numpy as np
from PIL import Image, ImageFilter

W, H, FPS = 1080, 1920, 60
OUT = os.path.dirname(os.path.abspath(__file__)) + "/out_hour"
os.makedirs(OUT, exist_ok=True)
VOICE = sys.argv[1]

PHRASES = [
    "Why can an hourglass keep time?", "Water could not.", "Pour water through a small hole,",
    "and it slows down as the tank empties.", "Less water on top,", "less pressure,", "slower flow.",
    "But sand behaves differently.", "Sand grains lean on each other,", "and push sideways into the glass.",
    "The walls carry most of the weight.", "This is called the Janssen effect.",
    "So the grains at the neck feel almost the same push,", "whether the top is full,", "or nearly empty.",
    "The flow stays constant.", "Scientists found the flow depends only on the neck width,",
    "roughly to the power of two and a half.", "Not on how much sand is left.", "Double the neck,",
    "and the sand flows almost six times faster.", "So an hourglass is a clock made of friction.",
    "Would you trust it more than your phone?",
]


def speech_chunks(path):
    log = subprocess.run(["ffmpeg", "-i", path, "-af", "silencedetect=n=-35dB:d=0.25", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
                               capture_output=True, text=True).stdout)
    st = [float(l.split("silence_start: ")[1].split()[0]) for l in log.splitlines() if "silence_start" in l]
    en = [float(l.split("silence_end: ")[1].split()[0]) for l in log.splitlines() if "silence_end" in l]
    en += [dur] * (len(st) - len(en))
    chunks, cur = [], 0.0
    for s, e in zip(st, en):
        if s - cur > 0.15:
            chunks.append((cur, s))
        cur = e
    if dur - cur > 0.15:
        chunks.append((cur, dur))
    return chunks, dur


CH, VDUR = speech_chunks(VOICE)
assert len(CH) == len(PHRASES), f"{len(CH)} speech chunks vs {len(PHRASES)} phrases"
T = [c[0] for c in CH]
DUR = VDUR + 1.2
NFR = int(DUR * FPS)

ACC = (0.37, 0.92, 0.83)
WARM = (1.0, 0.80, 0.38)
SAND = (0.98, 0.78, 0.45)
WATER = (0.35, 0.68, 1.0)
TXT = (0.95, 0.96, 1.0)
RED = (1.0, 0.45, 0.45)
GREEN = (0.45, 0.95, 0.6)


def sm(x):
    x = min(1.0, max(0.0, x))
    return x * x * (3 - 2 * x)


def rp(t, a, b):
    return sm((t - a) / (b - a))


def hsh(k):
    return (np.sin(np.asarray(k, float) * 12.9898 + 78.233) * 43758.5453) % 1.0


# ---------------- geometry ----------------
CX = W / 2
Y_TOP, Y_NECK, Y_BOT = 430.0, 810.0, 1190.0
RMAX = 220.0
G_PX = 2600.0   # gravity in px/s^2


def neck_half(t):
    return 13 + 13 * rp(t, T[19], T[19] + 0.8) * (1 - rp(t, T[21], T[21] + 0.8))


def flow_factor(t):  # Beverloo: Q ~ D^2.5
    return (neck_half(t) / 13) ** 2.5


def half_width(u, n):
    """half width of the glass at distance u from the neck."""
    L = Y_NECK - Y_TOP
    x = np.clip(u / L, 0, 1)
    return n + (RMAX - n) * np.sin(np.minimum(1, x * 1.35) * math.pi / 2) ** 1.3


def glass_path(c, n):
    L = Y_NECK - Y_TOP
    us = np.linspace(0, L, 60)
    w = half_width(us, n)
    c.move_to(CX - w[-1], Y_NECK - us[-1])
    for u, ww in zip(us[::-1], w[::-1]):
        c.line_to(CX - ww, Y_NECK - u)
    for u, ww in zip(us, w):
        c.line_to(CX - ww, Y_NECK + u)
    for u, ww in zip(us[::-1], w[::-1]):
        c.line_to(CX + ww, Y_NECK + u)
    for u, ww in zip(us, w):
        c.line_to(CX + ww, Y_NECK - u)
    c.close_path()


# sand level in the top bulb: 1 = full, 0 = empty (distance from neck as a fraction)
def sand_level(t):
    if t < T[13]:
        base = 0.80 - 0.004 * max(0, t - T[7]) if t >= T[7] else 0.80
        return base
    if t < T[16]:
        return 0.92 - 0.82 * rp(t, T[13] + 0.2, T[15] - 0.1)          # fast-forward full -> nearly empty
    lv = 0.55
    lv -= 0.012 * max(0, min(t, T[21]) - T[16]) * 1.0
    lv -= 0.05 * max(0, min(t, T[21]) - T[19]) * 0.6                    # wide neck drains faster
    return max(0.08, lv)


# packed grains filling the top bulb (fixed lattice)
def make_grains():
    r = 9.5
    pts = []
    row = 0
    y = Y_NECK - 6
    while y > Y_TOP:
        off = r if row % 2 else 0
        u = Y_NECK - y
        w = half_width(u, 13) - r * 0.9
        x = CX - w + off
        while x < CX + w:
            pts.append((x + (hsh(len(pts)) - 0.5) * 2, y))
            x += 2 * r
        y -= r * 1.73
        row += 1
    return np.array(pts), r


GR, GRR = make_grains()
GCOL = hsh(np.arange(len(GR)) * 3.1)


# ---------------- water tank (Torricelli) ----------------
TK_X0, TK_X1, TK_Y0, TK_Y1 = 330.0, 750.0, 450.0, 1080.0


def water_h(t):
    """water height above the hole (px). Torricelli: sqrt(h) falls linearly in time."""
    h0 = TK_Y1 - TK_Y0 - 30
    dur = (T[7] - T[2]) + 0.8
    x = min(1.0, max(0.0, (t - T[2]) / dur))
    return h0 * (1 - 0.93 * x) ** 2


# ---------------- background / post ----------------
def make_bg():
    y = np.linspace(0, 1, H)[:, None, None]
    g = np.array([0.05, 0.055, 0.12]) * (1 - y) + np.array([0.012, 0.014, 0.035]) * y
    g = np.broadcast_to(g, (H, W, 3)).copy()
    xx = np.linspace(-1, 1, W)[None, :]
    yy = np.linspace(-1, 1, H)[:, None]
    g += np.exp(-(xx ** 2 + ((yy + 0.1) * 1.5) ** 2) / 0.35)[..., None] * np.array([0.06, 0.045, 0.08])
    rng = np.random.default_rng(2)
    for a, b, v in zip(rng.integers(0, W, 150), rng.integers(0, H, 150), rng.random(150) ** 3 * 0.4):
        g[b, a] += v
    g += (rng.random((H, W, 1)) - 0.5) / 255 * 1.5
    return np.clip(g, 0, 1).astype(np.float32)


BG = None


def blur(img, fac, rad):
    small = img.reshape(H // fac, fac, W // fac, fac, 3).mean(axis=(1, 3))
    p = Image.fromarray(np.clip(small * 255, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(rad))
    return np.asarray(p.resize((W, H), Image.BILINEAR), np.float32) / 255


def text(c, s, x, y, size, col, a=1.0, face="Inter", wt=cairo.FONT_WEIGHT_BOLD, align="c"):
    if a < 0.003:
        return 0
    c.select_font_face(face, cairo.FONT_SLANT_NORMAL, wt)
    c.set_font_size(size)
    tw = c.text_extents(s).x_advance
    x0 = x - tw / 2 if align == "c" else (x - tw if align == "r" else x)
    for dy, rgba in ((4, (0, 0, 0, 0.6 * a)), (0, (*col, a))):
        c.set_source_rgba(*rgba)
        c.move_to(x0, y + dy)
        c.show_text(s)
    return x0 + tw


def wrap(c, s, size, maxw):
    c.select_font_face("Inter", cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
    c.set_font_size(size)
    lines, cur = [], ""
    for w_ in s.split():
        tryl = (cur + " " + w_).strip()
        if c.text_extents(tryl).x_advance > maxw and cur:
            lines.append(cur)
            cur = w_
        else:
            cur = tryl
    return lines + [cur]


def arrow(c, x0, y0, x1, y1, col, a, wdt=5):
    if a < 0.01:
        return
    c.set_source_rgba(*col, a)
    c.set_line_width(wdt)
    c.move_to(x0, y0)
    c.line_to(x1, y1)
    c.stroke()
    ang = math.atan2(y1 - y0, x1 - x0)
    hl = 6 + wdt * 2.2
    c.move_to(x1, y1)
    c.line_to(x1 - hl * math.cos(ang - 0.45), y1 - hl * math.sin(ang - 0.45))
    c.line_to(x1 - hl * math.cos(ang + 0.45), y1 - hl * math.sin(ang + 0.45))
    c.close_path()
    c.fill()


def meter(c, x, y, frac, label, col, a):
    if a < 0.01:
        return
    c.set_source_rgba(1, 1, 1, 0.18 * a)
    c.rectangle(x, y, 150, 18)
    c.fill()
    c.set_source_rgba(*col, 0.95 * a)
    c.rectangle(x, y, 150 * max(0, min(1, frac)), 18)
    c.fill()
    text(c, label, x, y - 14, 26, TXT, a, wt=cairo.FONT_WEIGHT_NORMAL, align="l")


# ---------------- scenes ----------------
def water_alpha(t):
    return rp(t, T[1], T[1] + 0.4) * (1 - rp(t, T[7] - 0.15, T[7] + 0.35))


def draw_water(c, t, A):
    if A < 0.01:
        return
    h = water_h(t)
    ys = TK_Y1 - h
    # water body
    c.set_source_rgba(*WATER, 0.55 * A)
    c.move_to(TK_X0, TK_Y1)
    for x in np.linspace(TK_X0, TK_X1, 40):
        c.line_to(x, ys + 4 * math.sin(x * 0.03 + t * 3))
    c.line_to(TK_X1, TK_Y1)
    c.close_path()
    c.fill()
    hl = rp(t, T[4], T[4] + 0.3) * (1 - rp(t, T[5] + 0.2, T[5] + 0.6))   # "less water on top"
    if hl > 0:
        c.set_source_rgba(1, 1, 1, 0.25 * hl * A)
        c.rectangle(TK_X0, ys - 6, TK_X1 - TK_X0, 60)
        c.fill()
    # tank walls
    c.set_source_rgba(0.85, 0.9, 1.0, 0.85 * A)
    c.set_line_width(6)
    c.move_to(TK_X0, TK_Y0)
    c.line_to(TK_X0, TK_Y1)
    c.line_to(CX - 12, TK_Y1)
    c.move_to(CX + 12, TK_Y1)
    c.line_to(TK_X1, TK_Y1)
    c.line_to(TK_X1, TK_Y0)
    c.stroke()
    # jet: speed ~ sqrt(2 g h), drops spawn at a rate ~ flow
    if t > T[2]:
        v = math.sqrt(2 * G_PX * h) * 0.35
        q = math.sqrt(h / (TK_Y1 - TK_Y0))
        c.set_source_rgba(*WATER, 0.9 * A)
        wj = 4 + 9 * q
        c.rectangle(CX - wj / 2, TK_Y1, wj, 40)
        c.fill()
        k = np.arange(int((t - 1.0) * 90), int(t * 90) + 1)
        ts = k / 90
        k, ts = k[ts > T[2]], ts[ts > T[2]]
        dt = t - ts
        y = TK_Y1 + v * dt + 0.5 * G_PX * dt ** 2
        x = CX + (hsh(k) - 0.5) * wj
        m = y < 1250
        for xx, yy in zip(x[m], y[m]):
            c.arc(xx, yy, 3 + 3 * q, 0, 2 * math.pi)
            c.fill()
    # pressure meter at the hole
    pa = rp(t, T[5], T[5] + 0.3) * A
    meter(c, TK_X1 + 25, TK_Y1 - 10, h / (TK_Y1 - TK_Y0), "pressure", RED, pa)


def draw_hourglass(c, t, A):
    if A < 0.01:
        return
    n = neck_half(t)
    lvl = sand_level(t)
    ys = Y_NECK - lvl * (Y_NECK - Y_TOP)
    poured = 1 - lvl
    c.save()
    glass_path(c, n)
    c.clip()
    # top sand: grains below the surface with a small crater at the centre
    crater = 26 * (1 if t > T[0] else 0)
    gy_s = ys + crater * np.exp(-((GR[:, 0] - CX) / 70) ** 2)
    m = GR[:, 1] > gy_s
    dimg = 1 - 0.55 * rp(t, T[8], T[8] + 0.4) * (1 - rp(t, T[12], T[12] + 0.6))
    for (x, y), cc in zip(GR[m], GCOL[m]):
        c.set_source_rgba((SAND[0] - 0.12 * cc) * dimg, (SAND[1] - 0.14 * cc) * dimg, (SAND[2] - 0.12 * cc) * dimg, A)
        c.arc(x, y, GRR * 0.92, 0, 2 * math.pi)
        c.fill()
    # bottom pile (cone growing with poured sand)
    ph = 40 + 300 * poured ** 0.7
    c.set_source_rgba(SAND[0] * 0.9, SAND[1] * 0.85, SAND[2] * 0.8, A)
    c.move_to(CX - 300, Y_BOT + 5)
    for x in np.linspace(CX - 300, CX + 300, 50):
        c.line_to(x, Y_BOT - ph * max(0.15, 1 - abs(x - CX) / 260) ** 1.1)
    c.line_to(CX + 300, Y_BOT + 5)
    c.close_path()
    c.fill()
    # falling stream: constant rate (Beverloo), x5.7 when the neck is doubled
    rate = 140 * flow_factor(t)
    pile_top = Y_BOT - ph
    k = np.arange(int((t - 0.8) * 140 * 6), int(t * 140 * 6) + 1)
    ts = k / (140 * 6)
    keep = hsh(k * 7.7) < rate / (140 * 6)
    k, ts = k[keep], ts[keep]
    dt = t - ts
    y = Y_NECK + 60 * dt + 0.5 * G_PX * dt ** 2
    x = CX + (hsh(k) - 0.5) * 1.5 * n
    mm = (y < pile_top) & (dt >= 0)
    c.set_source_rgba(*SAND, A)
    for xx, yy in zip(x[mm], y[mm]):
        c.arc(xx, yy, 3.4, 0, 2 * math.pi)
        c.fill()
    c.restore()
    # force chains + sideways push (Janssen)
    fc = rp(t, T[8], T[8] + 0.4) * (1 - rp(t, T[12], T[12] + 0.6))
    if fc > 0:
        sel = np.where(m)[0]
        for i in sel[::3]:
            x, y = GR[i]
            for j in (i + 1, i - 1):
                if 0 <= j < len(GR) and m[j] and abs(GR[j][1] - y) < 25 and abs(GR[j][0] - x) < 25:
                    c.set_source_rgba(1, 1, 1, (0.35 + 0.6 * hsh(i)) * fc * A)
                    c.set_line_width(3.5)
                    c.move_to(x, y)
                    c.line_to(*GR[j])
                    c.stroke()
    sp = rp(t, T[9], T[9] + 0.4) * (1 - rp(t, T[12], T[12] + 0.6))
    wl = rp(t, T[10], T[10] + 0.4) * (1 - rp(t, T[12], T[12] + 0.6))
    for u in (170, 245, 315):
        y = Y_NECK - u
        if y < ys + 20:
            continue
        hw = float(half_width(u, n))
        for col_, wd_ in (((0.05, 0.02, 0.02), 15), ((1.0, 0.3, 0.25), 9)):
            arrow(c, CX - 25, y, CX - hw + 12, y, col_, sp * A, wd_)
            arrow(c, CX + 25, y, CX + hw - 12, y, col_, sp * A, wd_)
        arrow(c, CX - hw - 18, y + 35, CX - hw - 18, y - 35, GREEN, 0.95 * wl * A)
        arrow(c, CX + hw + 18, y + 35, CX + hw + 18, y - 35, GREEN, 0.95 * wl * A)
    # glass outline
    c.set_source_rgba(0.85, 0.9, 1.0, (0.75 + 0.25 * wl) * A)
    c.set_line_width(5 + 4 * wl)
    glass_path(c, n)
    c.stroke()
    # caps
    c.set_source_rgba(0.75, 0.62, 0.48, A)
    for yy in (Y_TOP - 22, Y_BOT + 4):
        c.rectangle(CX - RMAX - 40, yy, 2 * RMAX + 80, 20)
        c.fill()
    # neck push meter (constant)
    ma = rp(t, T[12], T[12] + 0.3) * (1 - rp(t, T[16], T[16] + 0.4)) * A
    meter(c, CX + 60, Y_NECK - 4, 0.62 + 0.01 * math.sin(t * 9), "push at neck", WARM, ma)
    # neck width marker
    da = rp(t, T[16], T[16] + 0.3) * (1 - rp(t, T[21], T[21] + 0.4)) * A
    if da > 0:
        arrow(c, CX, Y_NECK, CX - n, Y_NECK, ACC, da, 3)
        arrow(c, CX, Y_NECK, CX + n, Y_NECK, ACC, da, 3)
        text(c, "D", CX - n - 40, Y_NECK + 12, 38, ACC, da)
    hx = rp(t, T[18], T[18] + 0.3) * (1 - rp(t, T[19], T[19] + 0.4)) * A
    if hx > 0:
        x0 = CX + RMAX + 30
        arrow(c, x0, Y_NECK - 10, x0, ys + 5, RED, hx, 3)
        text(c, "H", x0 + 30, (Y_NECK + ys) / 2, 38, RED, hx)
        c.set_source_rgba(*RED, hx)
        c.set_line_width(5)
        c.move_to(x0 + 10, (Y_NECK + ys) / 2 - 40)
        c.line_to(x0 + 60, (Y_NECK + ys) / 2 + 10)
        c.stroke()


def draw_graph(c, t):
    a = rp(t, T[3], T[3] + 0.4) * (1 - rp(t, T[16], T[16] + 0.4))
    if a < 0.01:
        return
    x0, x1, y0, y1 = 170.0, 910.0, 1300.0, 1500.0
    c.set_source_rgba(1, 1, 1, 0.5 * a)
    c.set_line_width(2.5)
    c.move_to(x0, y0 - 10)
    c.line_to(x0, y1)
    c.line_to(x1, y1)
    c.stroke()
    text(c, "flow", x0 - 14, y0 + 6, 26, TXT, a, wt=cairo.FONT_WEIGHT_NORMAL, align="r")
    text(c, "time", x1, y1 + 38, 26, TXT, a, wt=cairo.FONT_WEIGHT_NORMAL, align="r")
    # water: flow ~ sqrt(h), plotted over the drain
    tw0, tw1 = T[2], T[7]
    tt = np.linspace(tw0, min(t, tw1), 80)
    if t > tw0:
        q = np.sqrt([water_h(v) / (TK_Y1 - TK_Y0) for v in tt])
        xs = x0 + (tt - tw0) / (tw1 - tw0) * (x1 - x0 - 20)
        c.set_source_rgba(*WATER, a)
        c.set_line_width(5)
        c.move_to(xs[0], y1 - q[0] * 170)
        for xx, qq in zip(xs, q):
            c.line_to(xx, y1 - qq * 170)
        c.stroke()
        text(c, "water", x0 + 20, y1 - 175, 28, WATER, a, align="l")
    # sand: flat line, drawn from T[7] to T[15]
    if t > T[7]:
        f = min(1, (t - T[7]) / (T[15] - T[7]))
        ys_ = y1 - 0.62 * 170
        c.set_source_rgba(*SAND, a)
        c.set_line_width(6)
        c.move_to(x0, ys_)
        c.line_to(x0 + f * (x1 - x0 - 20), ys_)
        c.stroke()
        text(c, "sand", x1 - 20, ys_ - 18, 28, SAND, a * min(1, f * 3), align="r")


def draw_text(c, t):
    end = rp(t, T[22], T[22] + 0.4)
    text(c, "Why can an hourglass", W / 2, 215, 62, TXT, 1 - end)
    text(c, "keep time?", W / 2, 290, 62, WARM, 1 - end)
    ja = rp(t, T[11], T[11] + 0.3) * (1 - rp(t, T[13], T[13] + 0.5))
    text(c, "JANSSEN EFFECT", W / 2, 370, 46, GREEN, ja, face="Inter Display")
    fa = rp(t, T[17], T[17] + 0.3) * (1 - rp(t, T[22], T[22] + 0.4))
    if fa > 0.01:
        xe = text(c, "flow  ∝  D", W / 2 - 30, 1400, 84, TXT, fa, face="DejaVu Sans")
        text(c, "2.5", xe + 6, 1352, 48, WARM, fa, face="DejaVu Sans", align="l")
    na = rp(t, T[18], T[18] + 0.3) * (1 - rp(t, T[19], T[19] + 0.3))
    text(c, "not H (sand left)", W / 2, 1480, 34, RED, na, wt=cairo.FONT_WEIGHT_NORMAL)
    xa = rp(t, T[20] + 0.6, T[20] + 1.0) * (1 - rp(t, T[21], T[21] + 0.4))
    text(c, "2× neck  →  5.7× flow", W / 2, 1490, 44, WARM, xa, face="DejaVu Sans")
    text(c, "Would you trust it", W / 2, 230, 66, TXT, end, face="Inter Display")
    text(c, "more than your phone?", W / 2, 315, 66, WARM, end, face="Inter Display")
    text(c, "Tell me in the comments", W / 2, 1470, 42, ACC, rp(t, T[22] + 0.8, T[22] + 1.3),
         wt=cairo.FONT_WEIGHT_NORMAL)
    k = max([i for i in range(len(T)) if T[i] <= t + 0.05], default=-1)
    if 0 <= k < 22:
        a = rp(t, T[k] - 0.05, T[k] + 0.15)
        for j, ln in enumerate(wrap(c, PHRASES[k], 52, 920)):
            text(c, ln, W / 2, 1640 + j * 68, 52, TXT, a)


def render(t):
    surf = cairo.ImageSurface(cairo.FORMAT_ARGB32, W, H)
    c = cairo.Context(surf)
    c.set_line_cap(cairo.LINE_CAP_ROUND)
    c.set_line_join(cairo.LINE_JOIN_ROUND)
    wa = water_alpha(t)
    draw_water(c, t, wa)
    draw_hourglass(c, t, 1 - wa)
    draw_graph(c, t)
    surf.flush()
    L = np.ndarray((H, W, 4), np.uint8, surf.get_data()).astype(np.float32) / 255
    rgb, a = L[..., [2, 1, 0]], L[..., 3:4]
    out = BG * (1 - a) + rgb + blur(rgb, 4, 5) * 0.35 + blur(rgb, 8, 10) * 0.35
    out = np.clip((1 - np.exp(-out * 1.1)) / (1 - math.exp(-1.1)), 0, 1)
    bgra = np.empty((H, W, 4), np.uint8)
    bgra[..., 0], bgra[..., 1], bgra[..., 2], bgra[..., 3] = out[..., 2] * 255, out[..., 1] * 255, out[..., 0] * 255, 255
    ts = cairo.ImageSurface.create_for_data(memoryview(bgra), cairo.FORMAT_ARGB32, W, H)
    draw_text(cairo.Context(ts), t)
    ts.flush()
    f = rp(t, 0, 0.3) * (1 - rp(t, DUR - 0.6, DUR))
    if f < 0.999:
        bgra[..., :3] = (bgra[..., :3] * f).astype(np.uint8)
    return bgra


def chunk(args):
    global BG
    idx, f0, f1 = args
    BG = make_bg()
    path = f"{OUT}/part{idx}.mp4"
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgra", "-s", f"{W}x{H}", "-r",
                          str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt",
                          "yuv420p", path], stdin=subprocess.PIPE)
    for fi in range(f0, f1):
        p.stdin.write(render(fi / FPS).tobytes())
    p.stdin.close()
    p.wait()
    return path


# ---------------- sound bed: pad + trickle/hiss that follow the real flow ----------------
def music():
    SR = 48000
    n = int(DUR * SR)
    rng = np.random.default_rng(5)
    tt = np.arange(n) / SR
    mix = np.zeros((2, n))
    for m, g in ((43, 1), (50, 0.8), (55, 0.6), (62, 0.3)):
        f = 440 * 2 ** ((m - 69) / 12)
        for ch, d in ((0, -0.2), (1, 0.2)):
            mix[ch] += g * np.sin(2 * math.pi * (f + d) * tt + rng.random() * 6)
    mix *= (0.7 + 0.3 * np.sin(2 * math.pi * 0.07 * tt)) * 0.018

    def band_noise(lo, hi):
        x = rng.standard_normal(n)
        sp = np.fft.rfft(x)
        fr = np.fft.rfftfreq(n, 1 / SR)
        sp[(fr < lo) | (fr > hi)] = 0
        y = np.fft.irfft(sp, n)
        return y / np.abs(y).max()

    frames = np.arange(0, DUR, 0.01)
    wa = np.array([water_alpha(v) for v in frames])
    wq = np.array([math.sqrt(water_h(v) / (TK_Y1 - TK_Y0)) if v > T[2] else 0 for v in frames])
    sa = np.array([(1 - water_alpha(v)) * flow_factor(v) ** 0.5 for v in frames])
    env_w = np.interp(tt, frames, wa * wq)
    env_s = np.interp(tt, frames, sa)
    water = band_noise(300, 2500) * (1 + 0.5 * np.sin(2 * math.pi * 7 * tt)) * env_w * 0.05
    sand = band_noise(2500, 9000) * env_s * 0.035
    mix += np.stack([water, water * 0.9]) + np.stack([sand * 0.9, sand])

    def put(sig, t0, gain):
        i = int(t0 * SR)
        sig = sig[: n - i] * gain
        mix[:, i:i + len(sig)] += sig

    def chime(f, ln=2.0):
        k = np.arange(int(ln * SR)) / SR
        return sum(a * np.sin(2 * math.pi * f * r * k) * np.exp(-k / d) for r, a, d in
                   ((1, 1, 0.9), (2.0, 0.4, 0.5), (2.76, 0.25, 0.3))) * np.minimum(1, k / 0.004)

    for t0, m in ((T[11], 76), (T[17], 79), (T[20] + 0.6, 84), (T[22], 81)):
        put(chime(440 * 2 ** ((m - 69) / 12)), t0, 0.10)
    mix *= np.minimum(1, tt / 1.0) * np.minimum(1, (DUR - tt) / 1.0)
    pcm = (np.clip(mix, -1, 1).T * 32767).astype(np.int16)
    with wave.open(f"{OUT}/bed.wav", "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


if __name__ == "__main__":
    if len(sys.argv) > 2 and sys.argv[2] == "stills":
        BG = make_bg()
        for tt in map(float, sys.argv[3:]):
            Image.fromarray(render(tt)[..., [2, 1, 0]]).save(f"{OUT}/still_{tt:05.1f}.png")
        sys.exit()
    music()
    per = NFR // 4
    with Pool(4) as pool:
        parts = pool.map(chunk, [(k, k * per, NFR if k == 3 else (k + 1) * per) for k in range(4)])
    with open(f"{OUT}/parts.txt", "w") as fh:
        fh.writelines(f"file '{p}'\n" for p in parts)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", f"{OUT}/parts.txt", "-i", VOICE,
                    "-i", f"{OUT}/bed.wav", "-filter_complex",
                    "[1:a]apad[v];[v][2:a]amix=inputs=2:duration=longest:normalize=0,loudnorm=I=-14:TP=-1.5[a]",
                    "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-t", f"{DUR:.2f}",
                    "-movflags", "+faststart", f"{OUT}/hourglass_short.mp4"], check=True)
    print("done", DUR)
