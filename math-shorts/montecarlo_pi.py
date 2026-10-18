#!/usr/bin/env python3
"""Pi from random dots (Monte Carlo) - YouTube Short, 1080x1920 @ 60 fps, synced to the TTS voice.

  python montecarlo_pi.py voice.m4a                     -> out/montecarlo_pi.mp4
  python montecarlo_pi.py voice.m4a stills 3 20 40      -> out/still_03.0.png ... (test frames)

Needs: numpy, pillow, pycairo + ffmpeg on PATH. Nothing else.
Maths is real: one million uniform points in the square [-1, 1]^2 (seed 271), a point is inside
when x^2 + y^2 <= 1, and the readout is always 4 * inside / N for the dots on screen.
Seed 271 gives 3.08 at 100 dots, 3.1440 at 10,000 and 3.14134 at 1,000,000.
"""
import math
import os
import re
import subprocess
import sys
import wave as wavfile
from multiprocessing import Pool

import cairo
import numpy as np
from PIL import Image, ImageFilter

NAME = "montecarlo_pi"
W, H, FPS = 1080, 1920, 60
OUT = "out"
SEED = 271
NMAX = 1_000_000
PI_STR = "3.14159265"

PHRASES = [
    "What if you could find pi",                                  # 0
    "just by throwing random dots?",                              # 1
    "Draw a square, two units wide.",                             # 2
    "Inside it, a circle that touches every side.",               # 3
    "Now drop dots in the square, at random.",                    # 4
    "Some land inside the circle.",                               # 5
    "Some land outside.",                                         # 6
    "The square has an area of four.",                            # 7
    "The circle has an area of pi.",                              # 8
    "So the share of dots inside",                                # 9
    "should be pi over four.",                                    # 10
    "Multiply that share by four, and watch.",                    # 11
    "A hundred dots give a rough guess.",                         # 12
    "Ten thousand dots, about three point one four.",             # 13
    "A million, and it creeps closer to pi.",                     # 14
    "No ruler, no formula, just randomness.",                     # 15
    "This is the Monte Carlo method.",                            # 16
    "Scientists use it to simulate atoms, markets and weather.",  # 17
    "So, how many dots would you need",                           # 18
    "for ten correct digits of pi?",                              # 19
]

# square / circle on screen: centre and half side (= radius 1) in px
CX, CY, HALF = 540, 870, 340
SIDE = 2 * HALF

CYAN = (0.20, 0.85, 1.00)
PINK = (1.00, 0.30, 0.65)
GOLD = (1.00, 0.80, 0.32)
TXT = (0.95, 0.96, 1.00)
LINE = (0.88, 0.93, 1.00)
DIM = (0.62, 0.68, 0.82)


def sm(x):
    x = min(1.0, max(0.0, x))
    return x * x * (3 - 2 * x)


def rp(t, a, b):
    return sm((t - a) / (b - a)) if b > a else float(t >= a)


def mix(c1, c2, u):
    return tuple(a + (b - a) * u for a, b in zip(c1, c2))


# ---------------------------------------------------------------- sync
def speech_chunks(path, dur, noise=-35):
    log = subprocess.run(["ffmpeg", "-hide_banner", "-i", path, "-af", f"silencedetect=n={noise}dB:d={dur}",
                          "-f", "null", "-"], capture_output=True, text=True).stderr
    hh, mm, ss = re.search(r"Duration: (\d+):(\d+):([\d.]+)", log).groups()
    total = 3600 * int(hh) + 60 * int(mm) + float(ss)
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", log)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]
    chunks, cur = [], 0.0
    for s, e in zip(starts, ends):
        if s - cur > 0.15:
            chunks.append((cur, s))
        cur = e
    if total - cur > 0.15:
        chunks.append((cur, total))
    return chunks, total


def find_sync(path):
    # the voice also pauses at commas (~0.3 s), phrase gaps are longer (~0.45 s): try long gaps first
    tried = []
    for d in (0.42, 0.45, 0.4, 0.38, 0.35, 0.5, 0.3, 0.25):
        chunks, total = speech_chunks(path, d)
        tried.append(f"d={d}: {len(chunks)}")
        if len(chunks) == len(PHRASES):
            fine, _ = speech_chunks(path, 0.2)
            return chunks, fine, total
    raise SystemExit(f"Script has {len(PHRASES)} phrases but the voice gives " + ", ".join(tried) +
                     " speech chunks. Tell Claude these numbers.")


# globals filled by init() (main process and every worker)
T, SUBS, LAST_END, DUR = [], [], 0.0, 0.0
BG = PTS_IDX = INS = CUM_IN = LAND = None
PI_SRC = PI_DST = PI_DEL = None
DSTATE = {}


def sub(i, k, default):
    """start of the k-th comma piece of phrase i (falls back to T[i] + default)."""
    return SUBS[i][k] if len(SUBS[i]) > k else T[i] + default


def init(t_list, subs, last_end, dur):
    global T, SUBS, LAST_END, DUR, BG, PTS_IDX, INS, CUM_IN, LAND, PI_SRC, PI_DST, PI_DEL
    T, SUBS, LAST_END, DUR = t_list, subs, last_end, dur
    BG = make_bg()
    p = np.random.default_rng(SEED).random((NMAX, 2), dtype=np.float32) * 2 - 1
    INS = (p[:, 0] ** 2 + p[:, 1] ** 2) <= 1
    CUM_IN = np.cumsum(INS)
    px = np.clip(((p[:, 0] + 1) / 2 * SIDE).astype(np.int32), 0, SIDE - 1)
    py = np.clip(((1 - p[:, 1]) / 2 * SIDE).astype(np.int32), 0, SIDE - 1)
    PTS_IDX = py * SIDE + px
    # time each of the first dots lands (for pops and ticks)
    ts = np.arange(0, dur, 0.001)
    ns = np.array([n_dots(x) for x in ts])
    LAND = ts[np.minimum(np.searchsorted(ns, np.arange(1, 3001)), len(ts) - 1)]
    PI_SRC, PI_DST, PI_DEL = pi_particles()
    DSTATE.clear()


# ---------------------------------------------------------------- timeline
def log_ramp(t, a, b, n0, n1):
    return n0 * (n1 / n0) ** rp(t, a, b)


def n_dots(t):
    """number of dots on screen at time t (float)."""
    s0, e0 = T[4] + 0.35, T[7] - 0.1
    if t < s0:
        return 0.0
    if t < e0:
        return 36 * ((t - s0) / (e0 - s0)) ** 1.25
    s1 = sub(11, 1, 1.7)
    e1 = max(s1 + 1.0, T[12] + 0.5)
    if t < s1:
        return 36.0
    if t < e1:
        return 36 + 64 * ((t - s1) / (e1 - s1)) ** 1.1
    s2, e2 = T[13] + 0.1, sub(13, 1, 1.1) + 0.2
    if t < s2:
        return 100.0
    if t < e2:
        return log_ramp(t, s2, e2, 100, 10_000)
    s3, e3 = T[14] + 0.1, min(T[15] - 0.1, T[14] + 2.2)
    if t < s3:
        return 10_000.0
    return log_ramp(t, s3, e3, 10_000, NMAX)


def ramp_times():
    return (T[13] + 0.1, sub(13, 1, 1.1) + 0.2, T[14] + 0.1, min(T[15] - 0.1, T[14] + 2.2))


# ---------------------------------------------------------------- drawing helpers
def make_bg():
    y = np.linspace(0, 1, H)[:, None, None]
    g = np.array([0.05, 0.06, 0.13]) * (1 - y) + np.array([0.012, 0.014, 0.035]) * y
    g = np.broadcast_to(g, (H, W, 3)).copy()
    xx = np.linspace(-1, 1, W)[None, :]
    yy = np.linspace(-1, 1, H)[:, None]
    g += np.exp(-(xx ** 2 + ((yy + 0.09) * 1.6) ** 2) / 0.35)[..., None] * np.array([0.05, 0.04, 0.10])
    rng = np.random.default_rng(1)
    for a, b, v in zip(rng.integers(0, W, 160), rng.integers(0, H, 160), rng.random(160) ** 3 * 0.45):
        g[b, a] += v
    g += (rng.random((H, W, 1)) - 0.5) / 255 * 1.5
    return np.clip(g, 0, 1).astype(np.float32)


def blur(img, fac, rad):
    small = img.reshape(H // fac, fac, W // fac, fac, 3).mean(axis=(1, 3))
    p = Image.fromarray(np.clip(small * 255, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(rad))
    return np.asarray(p.resize((W, H), Image.BILINEAR), np.float32) / 255


def font(c, size, face="Inter", wt=cairo.FONT_WEIGHT_BOLD):
    c.select_font_face(face, cairo.FONT_SLANT_NORMAL, wt)
    c.set_font_size(size)


def text(c, s, x, y, size, col, a=1.0, face="Inter", wt=cairo.FONT_WEIGHT_BOLD, align="c"):
    if a < 0.003:
        return 0
    font(c, size, face, wt)
    tw = c.text_extents(s).x_advance
    x0 = x - tw / 2 if align == "c" else (x if align == "l" else x - tw)
    for dx, dy, rgba in ((0, 4, (0, 0, 0, 0.6 * a)), (0, 0, (*col, a))):
        c.set_source_rgba(*rgba)
        c.move_to(x0 + dx, y + dy)
        c.show_text(s)
    return tw


def wrap(c, s, size, maxw):
    font(c, size)
    lines, cur = [], ""
    for w_ in s.split():
        tryl = (cur + " " + w_).strip()
        if c.text_extents(tryl).x_advance > maxw and cur:
            lines.append(cur)
            cur = w_
        else:
            cur = tryl
    return lines + [cur]


def frac(c, num, den, x, y, size, cn, cd, a):
    """stacked fraction centred on x, bar at y."""
    if a < 0.003:
        return
    font(c, size)
    w = max(c.text_extents(num).x_advance, c.text_extents(den).x_advance) + 20
    text(c, num, x, y - 16, size, cn, a)
    text(c, den, x, y + size + 6, size, cd, a)
    c.set_source_rgba(*TXT, a)
    c.set_line_width(4)
    c.move_to(x - w / 2, y)
    c.line_to(x + w / 2, y)
    c.stroke()


def pi_particles():
    """dots sampled from a big pi glyph (the hook) and random targets inside the square."""
    surf = cairo.ImageSurface(cairo.FORMAT_A8, W, H)
    c = cairo.Context(surf)
    font(c, 620, "Inter Display")
    e = c.text_extents("π")
    c.move_to(CX - e.x_bearing - e.width / 2, CY - e.y_bearing - e.height / 2)
    c.show_text("π")
    surf.flush()
    stride = surf.get_stride()
    m = np.ndarray((H, stride), np.uint8, surf.get_data())[:, :W]
    ys, xs = np.nonzero(m > 128)
    rng = np.random.default_rng(3)
    pick = rng.choice(len(xs), size=min(1400, len(xs)), replace=False)
    src = np.stack([xs[pick], ys[pick]], 1).astype(float)
    dst = np.stack([CX + (rng.random(len(pick)) * 2 - 1) * HALF * 0.96,
                    CY + (rng.random(len(pick)) * 2 - 1) * HALF * 0.96], 1)
    return src, dst, rng.random(len(pick)) * 0.45


def atom(c, x, y, s, col, a):
    c.set_source_rgba(*col, a)
    c.set_line_width(3)
    for k in range(3):
        c.save()
        c.translate(x, y)
        c.rotate(k * math.pi / 3)
        c.scale(1, 0.36)
        c.arc(0, 0, s, 0, 2 * math.pi)
        c.restore()
        c.stroke()
    c.arc(x, y, 5, 0, 2 * math.pi)
    c.fill()


def chart(c, x, y, s, col, a):
    c.set_source_rgba(*col, a)
    c.set_line_width(3)
    c.move_to(x - s, y - s)
    c.line_to(x - s, y + s)
    c.line_to(x + s, y + s)
    c.stroke()
    c.set_line_width(4)
    for k, (u, v) in enumerate(((-0.75, 0.5), (-0.3, -0.05), (0.05, 0.25), (0.45, -0.45), (0.85, -0.8))):
        (c.move_to if k == 0 else c.line_to)(x + u * s, y + v * s)
    c.stroke()


def cloud(c, x, y, s, col, a):
    c.set_source_rgba(*col, a * 0.9)
    for dx, dy, r in ((-0.45, 0.1, 0.42), (0.05, -0.2, 0.55), (0.5, 0.12, 0.38)):
        c.arc(x + dx * s, y + dy * s, r * s, 0, 2 * math.pi)
        c.fill()
    c.rectangle(x - 0.45 * s, y + 0.1 * s, 0.95 * s, 0.4 * s)
    c.fill()
    c.set_line_width(3)
    for dx in (-0.35, 0.0, 0.35):
        c.move_to(x + dx * s, y + 0.75 * s)
        c.line_to(x + dx * s - 6, y + 1.05 * s)
    c.stroke()


def partial_path(c, pts, u):
    """stroke the first u (0..1) of a closed polyline."""
    segs = list(zip(pts, pts[1:] + pts[:1]))
    lens = [math.dist(p, q) for p, q in segs]
    left = u * sum(lens)
    c.move_to(*pts[0])
    for (p, q), ln in zip(segs, lens):
        if left <= 0:
            break
        f = min(1.0, left / ln)
        c.line_to(p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f)
        left -= ln
    c.stroke()


# ---------------------------------------------------------------- frame
def dot_colours(t):
    cin = mix((1, 1, 1), CYAN, rp(t, T[5], T[5] + 0.4))
    cout = mix((1, 1, 1), PINK, rp(t, T[6], T[6] + 0.4))
    dim = 1 - 0.6 * rp(t, T[7], T[7] + 0.4) * (1 - rp(t, T[11], T[11] + 0.5))
    return cin, cout, dim


def draw_shape(c, t, n):
    # hook: a pi made of dots that scatters into the square
    pa = rp(t, 0, 0.3) * (1 - rp(t, T[2] - 0.1, T[2] + 0.6))
    if pa > 0:
        u = np.clip((t - (T[1] + 0.15 + PI_DEL)) / 0.9, 0, 1)
        u = u * u * (3 - 2 * u)
        pos = PI_SRC + (PI_DST - PI_SRC) * u[:, None]
        col = mix(GOLD, (1, 1, 1), float(u.mean()))
        c.set_source_rgba(*col, 0.9 * pa)
        for (x, y), uu in zip(pos, u):
            c.arc(x, y, 3.6 - 1.4 * uu, 0, 2 * math.pi)
            c.fill()

    sq = [(CX - HALF, CY - HALF), (CX + HALF, CY - HALF), (CX + HALF, CY + HALF), (CX - HALF, CY + HALF)]
    p7 = rp(t, T[7], T[7] + 0.3) * (1 - rp(t, T[8], T[8] + 0.4))
    p8 = rp(t, T[8], T[8] + 0.3) * (1 - rp(t, T[9], T[9] + 0.4))
    if p7 > 0:
        c.set_source_rgba(1, 1, 1, 0.10 * p7)
        c.rectangle(CX - HALF, CY - HALF, SIDE, SIDE)
        c.fill()
    if p8 > 0:
        c.set_source_rgba(*CYAN, 0.16 * p8)
        c.arc(CX, CY, HALF, 0, 2 * math.pi)
        c.fill()

    # square
    ps = rp(t, T[2] + 0.05, T[2] + 0.9)
    if ps > 0:
        glow6 = rp(t, T[6], T[6] + 0.2) * (1 - rp(t, T[6] + 0.8, T[7]))
        c.set_source_rgba(*mix(LINE, PINK, 0.7 * glow6), 0.9)
        c.set_line_width(5 + 3 * (p7 + glow6))
        partial_path(c, sq, ps)
    # width bracket
    s21 = sub(2, 1, 0.9)
    bw = rp(t, s21, s21 + 0.4) * (1 - rp(t, T[4], T[4] + 0.5))
    if bw > 0:
        yb = CY + HALF + 34
        c.set_source_rgba(*GOLD, bw)
        c.set_line_width(3)
        for x in (CX - HALF, CX + HALF):
            c.move_to(x, yb - 14)
            c.line_to(x, yb + 14)
        c.move_to(CX - HALF, yb)
        c.line_to(CX + HALF, yb)
        c.stroke()
    # circle
    s31 = sub(3, 1, 1.0)
    pc = rp(t, s31, s31 + 1.0)
    if pc > 0:
        glow5 = rp(t, T[5], T[5] + 0.2) * (1 - rp(t, T[5] + 0.9, T[6] + 0.2))
        c.set_source_rgba(*mix(LINE, CYAN, 0.5 + 0.5 * glow5), 0.95)
        c.set_line_width(5 + 3 * (p8 + glow5))
        c.arc(CX, CY, HALF, -math.pi / 2, -math.pi / 2 + 2 * math.pi * pc)
        c.stroke()
    # radius
    ra = rp(t, s31 + 1.0, s31 + 1.4) * (1 - rp(t, T[4], T[4] + 0.5))
    if ra > 0:
        c.set_source_rgba(*GOLD, ra)
        c.set_line_width(4)
        c.move_to(CX, CY)
        c.line_to(CX + HALF * rp(t, s31 + 1.0, s31 + 1.4), CY)
        c.stroke()
        c.arc(CX, CY, 7, 0, 2 * math.pi)
        c.fill()

    # single dots (the first few thousand), each pops in when it lands
    nn = int(n)
    if 0 < nn and nn < 3000:
        cin, cout, dim = dot_colours(t)
        ca = 1 - sm((nn - 1500) / 1500)
        r0 = 8.0 if nn <= 100 else 8.0 * (100 / nn) ** 0.3
        for i in range(nn):
            age = t - LAND[i]
            pop = math.exp(-max(age, 0) / 0.09)
            px = CX - HALF + (PTS_IDX[i] % SIDE) + 0.5
            py = CY - HALF + (PTS_IDX[i] // SIDE) + 0.5
            col = mix(cin if INS[i] else cout, (1, 1, 1), pop)
            c.set_source_rgba(*col, ca * dim)
            c.arc(px, py, r0 * (1 + 0.9 * pop), 0, 2 * math.pi)
            c.fill()

    # end of science phrase: atoms, markets, weather
    s171 = sub(17, 1, 2.7)
    out = rp(t, T[18], T[18] + 0.4)
    for k, (fn, t0, col) in enumerate(((atom, s171 - 0.6, CYAN), (chart, s171 + 0.05, GOLD),
                                       (cloud, s171 + 0.75, PINK))):
        a = rp(t, t0, t0 + 0.35) * (1 - out)
        if a > 0:
            fn(c, 120 + 320 * k, 1282, 30, col, a)


def blur3(img):
    for ax in (0, 1):
        img = (np.roll(img, 1, ax) + 2 * img + np.roll(img, -1, ax)) / 4
    return img


def dots_layer(t, n):
    """all dots as a density image (used from ~1500 dots on). returns HxWx3 or None."""
    nn = int(n)
    da = sm((nn - 1200) / 1300)
    if da <= 0:
        return None
    if DSTATE.get("n", 10 ** 9) > nn:
        DSTATE.update(n=0, cin=np.zeros(SIDE * SIDE), cout=np.zeros(SIDE * SIDE))
    n0 = DSTATE["n"]
    if nn > n0:
        idx, ins = PTS_IDX[n0:nn], INS[n0:nn]
        DSTATE["cin"] += np.bincount(idx[ins], minlength=SIDE * SIDE)
        DSTATE["cout"] += np.bincount(idx[~ins], minlength=SIDE * SIDE)
        DSTATE["n"] = nn
    k = min(4.8, 0.55 * SIDE * SIDE / nn)
    bi = 1 - np.exp(-k * blur3(DSTATE["cin"].reshape(SIDE, SIDE)))
    bo = 1 - np.exp(-k * blur3(DSTATE["cout"].reshape(SIDE, SIDE)))
    cin, cout, dim = dot_colours(t)
    lay = np.zeros((H, W, 3), np.float32)
    lay[CY - HALF:CY + HALF, CX - HALF:CX + HALF] = (bi[..., None] * np.array(cin) + bo[..., None] * np.array(cout)) * (
        0.62 * da * dim)
    return lay


def readout(c, t, n, y, size, a):
    nn = int(n)
    s = "–" if nn < 1 else f"{4 * CUM_IN[nn - 1] / nn:.4f}"
    good = 0
    while good < len(s) and good < len(PI_STR) and s[good] == PI_STR[good]:
        good += 1
    font(c, size, "Inter Display")
    x = W / 2 - c.text_extents(s).x_advance / 2
    for j, ch in enumerate(s):
        text(c, ch, x, y, size, GOLD if j < good else TXT, a, face="Inter Display", align="l")
        font(c, size, "Inter Display")
        x += c.text_extents(ch).x_advance


def draw_text(c, t, n):
    nn = int(n)
    end = rp(t, T[18], T[18] + 0.5)
    mc = rp(t, T[16], T[16] + 0.4)
    text(c, "Can random dots find π?", W / 2, 250, 72, TXT, 1 - mc)
    text(c, "MONTE CARLO METHOD", W / 2, 250, 80, GOLD, mc * (1 - end), face="Inter Display")

    # counters
    s2, e2, s3, e3 = ramp_times()
    lock = max(rp(t, e2, e2 + 0.1) * (1 - rp(t, e2 + 0.5, e2 + 1.0)),
               rp(t, e3, e3 + 0.1) * (1 - rp(t, e3 + 0.6, e3 + 1.2)),
               rp(t, T[12], T[12] + 0.1) * (1 - rp(t, T[12] + 0.5, T[12] + 1.0)))
    text(c, f"N = {nn:,}", W / 2, 400, 44, mix(TXT, GOLD, lock), rp(t, T[4], T[4] + 0.3) * (1 - end))
    nin = int(CUM_IN[nn - 1]) if nn else 0
    text(c, f"inside {nin:,}", 120, 470, 36, CYAN, rp(t, T[5], T[5] + 0.3) * (1 - end), align="l")
    text(c, f"outside {nn - nin:,}", W - 120, 470, 36, PINK, rp(t, T[6], T[6] + 0.3) * (1 - end), align="r")

    # label row under the square
    yl = 1305
    s21 = sub(2, 1, 0.9)
    text(c, "2 units", W / 2, CY + HALF + 90, 44, GOLD, rp(t, s21, s21 + 0.4) * (1 - rp(t, T[4], T[4] + 0.5)))
    s31 = sub(3, 1, 1.0)
    text(c, "r = 1", CX + HALF / 2, CY - 22, 40, GOLD, rp(t, s31 + 1.2, s31 + 1.6) * (1 - rp(t, T[4], T[4] + 0.5)))
    text(c, "Square area = 2 × 2 = 4", W / 2, yl, 50, TXT, rp(t, T[7], T[7] + 0.3) * (1 - rp(t, T[8], T[8] + 0.3)))
    text(c, "Circle area = π × 1² = π", W / 2, yl, 50, CYAN, rp(t, T[8], T[8] + 0.3) * (1 - rp(t, T[9], T[9] + 0.3)))
    fa = rp(t, T[9], T[9] + 0.3) * (1 - rp(t, T[11], T[11] + 0.4))
    frac(c, "inside", "total", 390, 1290, 46, CYAN, TXT, fa)
    fb = rp(t, T[10], T[10] + 0.3) * (1 - rp(t, T[11], T[11] + 0.4))
    text(c, "≈", 560, 1306, 64, TXT, fb)
    frac(c, "π", "4", 680, 1290, 52, GOLD, TXT, fb)

    # the estimate
    text(c, "4 × inside / total", W / 2, yl, 46, DIM, rp(t, T[11], T[11] + 0.4) * (1 - rp(t, T[15], T[15] + 0.3)))
    s111 = sub(11, 1, 1.7)
    readout(c, t, n, 1430, 116, rp(t, s111 - 0.2, s111 + 0.2))
    text(c, "π = 3.14159265…", W / 2, 1500, 38, DIM, rp(t, T[12], T[12] + 0.4))

    # no ruler, no formula, just randomness
    s151, s152 = sub(15, 1, 0.75), sub(15, 2, 2.0)
    out = rp(t, s152 - 0.1, s152 + 0.2)
    for x, lab, t0 in ((290, "no ruler", T[15]), (790, "no formula", s151)):
        a = rp(t, t0, t0 + 0.25) * (1 - out)
        w = text(c, lab, x, yl, 46, TXT, a)
        st = rp(t, t0 + 0.3, t0 + 0.6)
        if a > 0 and st > 0:
            c.set_source_rgba(*PINK, a)
            c.set_line_width(5)
            c.move_to(x - w / 2 - 8, yl - 16)
            c.line_to(x - w / 2 - 8 + (w + 16) * st, yl - 16)
            c.stroke()
    text(c, "just randomness", W / 2, yl, 54, GOLD, out * (1 - rp(t, T[16] + 0.3, T[16] + 0.7)))

    # science icon labels (icons are drawn with the glow pass)
    s171 = sub(17, 1, 2.7)
    oo = rp(t, T[18], T[18] + 0.4)
    for k, (lab, t0) in enumerate((("atoms", s171 - 0.6), ("markets", s171 + 0.05), ("weather", s171 + 0.75))):
        text(c, lab, 120 + 320 * k + 48, 1296, 38, TXT, rp(t, t0, t0 + 0.35) * (1 - oo), align="l")

    # end card
    text(c, "How many dots for", W / 2, 250, 72, TXT, end, face="Inter Display")
    text(c, "10 digits of π?", W / 2, 345, 80, GOLD, end, face="Inter Display")
    text(c, "Comment your guess", W / 2, 1660, 50, CYAN, rp(t, T[19] + 0.6, T[19] + 1.0))

    # captions
    k = max([i for i in range(len(T)) if T[i] <= t + 0.05], default=-1)
    if 0 <= k < 18:
        a = rp(t, T[k] - 0.05, T[k] + 0.15)
        for j, ln in enumerate(wrap(c, PHRASES[k], 54, 900)):
            text(c, ln, W / 2, 1640 + j * 70, 54, TXT, a)


def render(t):
    n = n_dots(t)
    surf = cairo.ImageSurface(cairo.FORMAT_ARGB32, W, H)
    c = cairo.Context(surf)
    c.set_line_cap(cairo.LINE_CAP_ROUND)
    draw_shape(c, t, n)
    surf.flush()
    L = np.ndarray((H, W, 4), np.uint8, surf.get_data()).astype(np.float32) / 255
    rgb, a = L[..., [2, 1, 0]], L[..., 3:4]
    lay = dots_layer(t, n)
    if lay is not None:
        rgb = rgb + lay
        a = np.maximum(a, np.clip(lay.max(axis=2, keepdims=True) * 1.5, 0, 1))
    fl = 0.0
    for tf in (T[16], ramp_times()[3]):
        if 0 <= t - tf < 1:
            fl += 0.05 * math.exp(-(t - tf) / 0.2)
    out = BG * (1 - a) + rgb + blur(rgb, 4, 5) * 0.5 + blur(rgb, 8, 10) * 0.45 + fl
    out = np.clip((1 - np.exp(-out * 1.15)) / (1 - math.exp(-1.15)), 0, 1)
    bgra = np.empty((H, W, 4), np.uint8)
    bgra[..., 0], bgra[..., 1], bgra[..., 2], bgra[..., 3] = out[..., 2] * 255, out[..., 1] * 255, out[..., 0] * 255, 255
    ts = cairo.ImageSurface.create_for_data(memoryview(bgra), cairo.FORMAT_ARGB32, W, H)
    draw_text(cairo.Context(ts), t, n)
    ts.flush()
    f = rp(t, 0, 0.3) * (1 - rp(t, DUR - 0.6, DUR))
    if f < 0.999:
        bgra[..., :3] = (bgra[..., :3] * f).astype(np.uint8)
    return bgra


def render_part(args):
    idx, f0, f1 = args
    path = os.path.join(OUT, f"part{idx}.mp4")
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgra", "-s", f"{W}x{H}", "-r",
                          str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt",
                          "yuv420p", path], stdin=subprocess.PIPE)
    for fi in range(f0, f1):
        p.stdin.write(render(fi / FPS).tobytes())
    p.stdin.close()
    p.wait()
    return path


# ---------------------------------------------------------------- sound bed (under the voice)
def make_sound(path):
    SR = 48000
    n = int(DUR * SR)
    rng = np.random.default_rng(5)
    mix_ = np.zeros((2, n))
    tt = np.arange(n) / SR
    for m, g in ((45, 1), (52, 0.8), (57, 0.6), (64, 0.35)):  # soft A minor pad
        f = 440 * 2 ** ((m - 69) / 12)
        for ch, d in ((0, -0.2), (1, 0.2)):
            mix_[ch] += g * np.sin(2 * math.pi * (f + d) * tt + rng.random() * 6)
    mix_ *= (0.7 + 0.3 * np.sin(2 * math.pi * 0.08 * tt)) * 0.02

    def put(sig, t0, gain, pan=0.0):
        i = int(t0 * SR)
        if i >= n:
            return
        sig = sig[: n - i] * gain
        mix_[0, i:i + len(sig)] += sig * math.cos((pan + 1) * math.pi / 4)
        mix_[1, i:i + len(sig)] += sig * math.sin((pan + 1) * math.pi / 4)

    def chime(f, ln=2.0):
        k = np.arange(int(ln * SR)) / SR
        return sum(a * np.sin(2 * math.pi * f * r * k) * np.exp(-k / d) for r, a, d in
                   ((1, 1, 0.9), (2.0, 0.4, 0.5), (2.76, 0.25, 0.3))) * np.minimum(1, k / 0.004)

    def tick(f):
        k = np.arange(int(0.08 * SR)) / SR
        return np.sin(2 * math.pi * f * k) * np.exp(-k / 0.018) * np.minimum(1, k / 0.002)

    def noise(ln, smooth=40):
        m = int(ln * SR)
        x = rng.standard_normal(m)
        x = np.convolve(x, np.ones(smooth) / smooth, "same")
        return x / np.abs(x).max()

    def whoosh(ln):
        m = int(ln * SR)
        return noise(ln) * np.sin(np.linspace(0, math.pi, m)) ** 2

    def hz(m):
        return 440 * 2 ** ((m - 69) / 12)

    # the pi dissolves
    put(whoosh(1.2), T[1] + 0.1, 0.10)
    # square and circle finish drawing
    put(chime(hz(76)), T[2] + 0.9, 0.09)
    s31 = sub(3, 1, 1.0)
    put(chime(hz(79)), s31 + 1.0, 0.09)
    # each of the first 100 dots lands with a tick (higher inside the circle)
    for i in range(100):
        if LAND[i] < DUR:
            x = (PTS_IDX[i] % SIDE) / SIDE * 2 - 1
            put(tick(1568 if INS[i] else 1047), LAND[i], 0.045, 0.6 * x)
    # readout appears
    put(chime(hz(81), 1.5), sub(11, 1, 1.7), 0.08)
    # dot rain during the two big ramps, then a lock-in chime
    s2, e2, s3, e3 = ramp_times()
    for a, b, g in ((s2, e2, 0.05), (s3, e3, 0.07)):
        ln = b - a + 0.4
        put(noise(ln, 6) * np.sin(np.linspace(0, math.pi, int(ln * SR))) ** 2, a, g)
        put(whoosh(ln), a, 0.06)
    put(chime(hz(84)), e2, 0.09)
    for m in (72, 76, 79, 84):
        put(chime(hz(m), 3.0), e3, 0.07)
    # Monte Carlo title, end question
    put(chime(hz(57), 3.0), T[16], 0.15)
    put(chime(hz(81), 2.5), T[19], 0.10)

    mix_ *= np.minimum(1, tt / 1.0) * np.minimum(1, (DUR - tt) / 1.0)
    pcm = (np.clip(mix_, -1, 1).T * 32767).astype(np.int16)
    with wavfile.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


# ---------------------------------------------------------------- main
def main():
    if len(sys.argv) < 2:
        raise SystemExit("usage: python montecarlo_pi.py voice.m4a [stills t1 t2 ...]")
    voice = sys.argv[1]
    os.makedirs(OUT, exist_ok=True)
    chunks, fine, total = find_sync(voice)
    t_list = [s for s, _ in chunks]
    ends = [s for s, _ in chunks[1:]] + [total]
    subs = [[s for s, _ in fine if a - 0.08 <= s < b] or [a] for a, b in zip(t_list, ends)]
    dur = total + 1.2
    args = (t_list, subs, chunks[-1][1], dur)

    if len(sys.argv) > 2 and sys.argv[2] == "stills":
        init(*args)
        for x in map(float, sys.argv[3:]):
            path = os.path.join(OUT, f"still_{x:04.1f}.png")
            Image.fromarray(render(x)[..., [2, 1, 0]]).save(path)
            print("saved", path)
        return

    init(*args)
    bed = os.path.join(OUT, "bed.wav")
    make_sound(bed)
    nfr = int(dur * FPS)
    parts = 4
    per = nfr // parts
    jobs = [(k, k * per, nfr if k == parts - 1 else (k + 1) * per) for k in range(parts)]
    with Pool(parts, initializer=init, initargs=args) as pool:
        files = pool.map(render_part, jobs)
    lst = os.path.join(OUT, "parts.txt")
    with open(lst, "w") as fh:
        for p in files:
            fh.write("file '" + os.path.abspath(p).replace("\\", "/") + "'\n")
    final = os.path.join(OUT, f"{NAME}.mp4")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-i", voice, "-i", bed,
                    "-filter_complex",
                    "[1:a]apad[v];[v][2:a]amix=inputs=2:duration=longest:normalize=0,loudnorm=I=-14:TP=-1.5[a]",
                    "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-t", f"{dur:.2f}",
                    "-movflags", "+faststart", final], check=True)
    for p in files + [lst, bed]:
        os.remove(p)
    print("done ->", final)


if __name__ == "__main__":
    main()
