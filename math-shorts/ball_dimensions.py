#!/usr/bin/env python3
"""The radius-1 ball in higher dimensions - YouTube Short, 1080x1920 @ 60 fps, synced to the TTS voice.

  python ball_dimensions.py voice.m4a                     -> out/ball_dimensions.mp4
  python ball_dimensions.py voice.m4a stills 3 20 40      -> out/still_03.0.png ... (test frames)

Needs: numpy, pillow, pycairo + ffmpeg on PATH. Nothing else.
Maths is real: V(n) = pi^(n/2) / Gamma(n/2 + 1) for the unit ball (peak 5.264 at n = 5, 0.0258 at n = 20),
and the ball fills V(n) / 2^n of the cube that just holds it (78.5 %, 52.4 %, 0.25 % in 2D, 3D, 10D).
The 2D and 3D pictures are true orthographic shadows of the square and cube around the radius-1 ball.
The 10D picture puts all 1024 corners at their true distance sqrt(10) = 3.16 from the centre (direction taken
from a turning shadow of the 10-cube), against the ball's radius of 1.
"""
import math
import os
import subprocess
import sys
import wave as wavfile
from multiprocessing import Pool

import cairo
import numpy as np
from PIL import Image, ImageFilter

NAME = "ball_dimensions"
W, H, FPS = 1080, 1920, 60
OUT = "out"

PHRASES = [
    "Take a ball with radius one.",                     # 0
    "Now add more dimensions.",                         # 1
    "Does it get bigger forever?",                      # 2
    "In two dimensions,",                               # 3
    "it is a circle.",                                  # 4
    "Its area is about three point one four.",          # 5
    "In three dimensions, a sphere.",                   # 6
    "Volume about four point one nine.",                # 7
    "In four dimensions,",                              # 8
    "four point nine three.",                           # 9
    "In five dimensions,",                              # 10
    "five point two six.",                              # 11
    "And then, something strange happens.",             # 12
    "In six dimensions,",                               # 13
    "it shrinks.",                                      # 14
    "By twenty dimensions,",                            # 15
    "its volume is just zero point zero two six.",      # 16
    "As dimensions grow,",                              # 17
    "it heads toward zero.",                            # 18
    "Here is why.",                                     # 19
    "Put the ball inside a cube that just holds it.",   # 20
    "In two dimensions,",                               # 21
    "the circle fills seventy nine percent.",           # 22
    "In three dimensions,",                             # 23
    "fifty two percent.",                               # 24
    "In ten dimensions,",                               # 25
    "a quarter of one percent.",                        # 26
    "Almost all the space hides in the corners.",       # 27
    "So, where would you hide in the tenth dimension?", # 28
]

CX, CY = 540, 880          # centre of the main object
R_BALL = 280               # radius 1 in px for the opening ball

CYAN = (0.20, 0.85, 1.00)
TEAL = (0.37, 0.92, 0.83)
GOLD = (1.00, 0.80, 0.32)
RED = (1.00, 0.36, 0.42)
VIOLET = (0.62, 0.48, 1.00)
TXT = (0.95, 0.96, 1.00)
DIM = (0.62, 0.68, 0.82)


def sm(x):
    x = min(1.0, max(0.0, x))
    return x * x * (3 - 2 * x)


def rp(t, a, b):
    return sm((t - a) / (b - a)) if b > a else float(t >= a)


def mix(c1, c2, u):
    return tuple(a + (b - a) * u for a, b in zip(c1, c2))


def vol(n):
    return math.pi ** (n / 2) / math.gamma(n / 2 + 1)


# ---------------------------------------------------------------- sync
def speech_chunks(path, noise=-35, gap=0.25):
    log = subprocess.run(["ffmpeg", "-i", path, "-af", f"silencedetect=n={noise}dB:d={gap}", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
                               capture_output=True, text=True).stdout)
    st = [float(l.split("silence_start: ")[1].split()[0]) for l in log.splitlines() if "silence_start" in l]
    en = [float(l.split("silence_end: ")[1].split()[0]) for l in log.splitlines() if "silence_end" in l]
    chunks, cur = [], 0.0
    for s, e in zip(st, en):
        if s - cur > 0.15:
            chunks.append((cur, s))
        cur = e
    if dur - cur > 0.15:
        chunks.append((cur, dur))
    return chunks, dur


# globals filled by init() (also inside every worker process)
T, SPEECH_END, DUR, BG = [], 0.0, 0.0, None


def init(t_list, speech_end, dur):
    global T, SPEECH_END, DUR, BG
    T, SPEECH_END, DUR = t_list, speech_end, dur
    BG = make_bg()


# ---------------------------------------------------------------- bar graph (volume vs dimension)
NMAX = 20
GX0, GX1, GBASE, GUNIT = 120, 1000, 1290, 112      # graph box, px per unit of volume
SLOT = (GX1 - GX0) / NMAX
VOLS = [vol(n) for n in range(1, NMAX + 1)]


def bar_x(n):
    return GX0 + (n - 0.5) * SLOT


def bar_on(n):
    """time each bar starts growing"""
    if n <= 3:
        return T[8] - 0.25 + 0.22 * (n - 1)
    if n == 4:
        return T[9]
    if n == 5:
        return T[11]
    if n == 6:
        return T[13] + 0.3
    a, b = T[15], T[16] + 1.4                             # 7..20 cascade
    return a + (n - 7) / (NMAX - 7) * (b - a)


def bar_col(n, t):
    if n == 5:
        return mix(TEAL, GOLD, rp(t, T[12], T[12] + 0.4))
    if n == 6:
        return mix(TEAL, RED, rp(t, T[14], T[14] + 0.4))
    if n > 6:
        return mix(RED, VIOLET, (n - 7) / (NMAX - 7))
    return TEAL


# ---------------------------------------------------------------- d-cube shadows
def cube_data(d):
    bits = np.array([[(v >> i) & 1 for i in range(d)] for v in range(2 ** d)], float) * 2 - 1
    edges = np.array([(a, a ^ (1 << i)) for a in range(2 ** d) for i in range(d) if a < a ^ (1 << i)])
    return bits, edges


CUBES = {d: cube_data(d) for d in (2, 3, 10)}


def basis(d, t):
    """d x 2 orthonormal projection (columns = screen x, screen y), slowly turning"""
    if d == 2:
        return np.eye(2)
    if d == 3:
        yaw, pitch = 0.55 + 0.35 * t, 0.45
        cy_, sy_ = math.cos(yaw), math.sin(yaw)
        cp, sp = math.cos(pitch), math.sin(pitch)
        ry = np.array([[cy_, 0, sy_], [0, 1, 0], [-sy_, 0, cy_]])
        rx = np.array([[1, 0, 0], [0, cp, -sp], [0, sp, cp]])
        return (rx @ ry)[:2].T
    th = math.pi * np.arange(d) / d
    b = np.stack([np.cos(th), np.sin(th)], 1) * math.sqrt(2 / d)    # Petrie-style shadow of the 10-cube
    rot = np.eye(d)
    for (i, j), w in (((0, 3), 0.21), ((2, 7), -0.17), ((4, 9), 0.13)):
        a = w * t
        g = np.eye(d)
        g[i, i] = g[j, j] = math.cos(a)
        g[i, j], g[j, i] = -math.sin(a), math.sin(a)
        rot = rot @ g
    return rot @ b


FILL = {2: vol(2) / 4, 3: vol(3) / 8, 10: vol(10) / 2 ** 10}
SCALE = {2: 300, 3: 255, 10: 125}


def draw_cube(c, d, t, a, glow):
    """shadow of the d-cube plus the radius-1 ball inside it"""
    if a < 0.003:
        return
    bits, edges = CUBES[d]
    s = SCALE[d]
    p = bits @ basis(d, t)
    X, Y = CX + s * p[:, 0], CY - s * p[:, 1]
    # ball (its shadow is a disc of radius 1 in every dimension)
    g = cairo.RadialGradient(CX - 0.35 * s, CY - 0.35 * s, 0.05 * s, CX, CY, s)
    g.add_color_stop_rgba(0, *TEAL, 0.55 * a * (1 - 0.6 * glow))
    g.add_color_stop_rgba(1, *mix(TEAL, (0.1, 0.3, 0.5), 0.6), 0.28 * a * (1 - 0.6 * glow))
    c.set_source(g)
    c.arc(CX, CY, s, 0, 2 * math.pi)
    c.fill()
    c.set_source_rgba(*TEAL, 0.9 * a * (1 - 0.5 * glow))
    c.set_line_width(4)
    c.arc(CX, CY, s, 0, 2 * math.pi)
    c.stroke()
    if d == 10:
        # 1024 corners at their true distance sqrt(10) from the centre, direction from the shadow above
        ang = np.arctan2(p[:, 1], p[:, 0])
        rr = math.sqrt(10) * s
        X, Y = CX + rr * np.cos(ang), CY - rr * np.sin(ang)
        c.set_source_rgba(*mix(CYAN, GOLD, glow), (0.25 + 0.2 * glow) * a)
        c.set_line_width(1.5)
        c.arc(CX, CY, rr, 0, 2 * math.pi)
        c.stroke()
        if glow > 0:                                                 # distances: 1 to the ball, 3.16 to a corner
            k = int(np.argmin(np.abs(ang - math.radians(35))))
            c.set_source_rgba(*GOLD, glow * a)
            c.set_line_width(4)
            c.move_to(CX, CY)
            c.line_to(X[k], Y[k])
            c.stroke()
            c.set_source_rgba(*TEAL, glow * a)
            c.move_to(CX, CY)
            c.line_to(CX - s, CY)
            c.stroke()
    else:
        c.set_source_rgba(*CYAN, 0.95 * a)
        c.set_line_width(4.5)
        for i, j in edges:
            c.move_to(X[i], Y[i])
            c.line_to(X[j], Y[j])
        c.stroke()
    # corners
    rad = 3.0 if d == 10 else 7.0
    c.set_source_rgba(*mix((1, 1, 1), GOLD, glow), (0.7 + 0.3 * glow) * a)
    for x, y in zip(X, Y):
        c.arc(x, y, rad + (1.5 if d == 10 else 5) * glow, 0, 2 * math.pi)
        c.fill()


def cube_scenes(t):
    """[(dim, alpha)] for the part after 'Here is why'"""
    a0 = rp(t, T[19] + 0.3, T[19] + 0.9)
    k3a = 1 - rp(t, T[21] - 0.1, T[21] + 0.4)          # first 3D (phrase 20)
    k2 = rp(t, T[21] - 0.1, T[21] + 0.4) * (1 - rp(t, T[23] - 0.1, T[23] + 0.4))
    k3b = rp(t, T[23] - 0.1, T[23] + 0.4) * (1 - rp(t, T[25] - 0.1, T[25] + 0.5))
    k10 = rp(t, T[25] - 0.1, T[25] + 0.5)
    return [(3, a0 * (k3a + k3b)), (2, a0 * k2), (10, a0 * k10)]


# ---------------------------------------------------------------- opening ball (wireframe sphere)
LAT = [math.radians(a) for a in (-60, -30, 0, 30, 60)]
LON = [math.pi * k / 6 for k in range(6)]
RING = np.linspace(0, 2 * math.pi, 97)


def draw_ball(c, t, a):
    if a < 0.003:
        return
    pulse = 1 + 0.035 * math.sin(2 * math.pi * 0.9 * (t - T[1])) * rp(t, T[1], T[1] + 0.4) * (1 - rp(t, T[3] - 0.3, T[3]))
    R = R_BALL * pulse
    wire = 1 - rp(t, T[3], T[3] + 0.6) + rp(t, T[6], T[6] + 0.7)      # 3D look off in phrase 3-5, back at 6
    disk = rp(t, T[5], T[5] + 0.6) * (1 - rp(t, T[6], T[6] + 0.6))
    shade = rp(t, T[7], T[7] + 0.6)
    if disk > 0:                                                     # area of the circle
        c.set_source_rgba(*TEAL, 0.35 * disk * a)
        c.move_to(CX, CY)
        c.arc(CX, CY, R, -math.pi / 2, -math.pi / 2 + 2 * math.pi * rp(t, T[5], T[5] + 0.9))
        c.close_path()
        c.fill()
    if shade > 0:                                                    # volume of the sphere
        g = cairo.RadialGradient(CX - 0.35 * R, CY - 0.35 * R, 0.05 * R, CX, CY, R)
        g.add_color_stop_rgba(0, *TEAL, 0.45 * shade * a)
        g.add_color_stop_rgba(1, 0.05, 0.25, 0.45, 0.25 * shade * a)
        c.set_source(g)
        c.arc(CX, CY, R, 0, 2 * math.pi)
        c.fill()
    if wire > 0.003:
        yaw, pitch = 0.35 * t, 0.38
        cy_, sy_, cp, sp = math.cos(yaw), math.sin(yaw), math.cos(pitch), math.sin(pitch)

        def proj(x, y, z):
            x, z = x * cy_ + z * sy_, -x * sy_ + z * cy_
            y, z = y * cp - z * sp, y * sp + z * cp
            return CX + R * x, CY - R * y, z

        rings = [(np.cos(la) * np.cos(RING), np.full_like(RING, np.sin(la)), np.cos(la) * np.sin(RING)) for la in LAT]
        rings += [(np.cos(RING) * np.cos(lo), np.sin(RING), np.cos(RING) * np.sin(lo)) for lo in LON]
        c.set_line_width(2.6)
        for x, y, z in rings:
            px, py, pz = proj(x, y, z)
            for k in range(len(RING) - 1):
                front = (pz[k] + pz[k + 1]) / 2
                c.set_source_rgba(*CYAN, (0.16 + 0.5 * max(0, front)) * wire * a)
                c.move_to(px[k], py[k])
                c.line_to(px[k + 1], py[k + 1])
                c.stroke()
    c.set_source_rgba(*CYAN, a)                                      # outline = the circle itself
    c.set_line_width(5)
    c.arc(CX, CY, R, 0, 2 * math.pi)
    c.stroke()
    ra = rp(t, T[0] + 0.2, T[0] + 0.8) * (1 - rp(t, T[3], T[3] + 0.5))   # radius line
    if ra > 0:
        c.set_source_rgba(*GOLD, ra * a)
        c.set_line_width(5)
        c.move_to(CX, CY)
        c.line_to(CX + R * rp(t, T[0] + 0.2, T[0] + 0.9), CY)
        c.stroke()
        c.arc(CX, CY, 9, 0, 2 * math.pi)
        c.fill()


def draw_graph(c, t, a):
    if a < 0.003:
        return
    c.set_source_rgba(*DIM, 0.6 * a)                                 # axes
    c.set_line_width(3)
    c.move_to(GX0 - 10, GBASE)
    c.line_to(GX1 + 10, GBASE)
    c.stroke()
    for n in range(1, NMAX + 1):
        g = rp(t, bar_on(n), bar_on(n) + 0.5)
        if g <= 0:
            continue
        h = VOLS[n - 1] * GUNIT * g
        x = bar_x(n)
        col = bar_col(n, t)
        c.set_source_rgba(*col, 0.9 * a)
        c.rectangle(x - SLOT * 0.34, GBASE - h, SLOT * 0.68, h)
        c.fill()
        c.set_source_rgba(1, 1, 1, 0.9 * a)
        c.rectangle(x - SLOT * 0.34, GBASE - h - 2, SLOT * 0.68, 4)
        c.fill()
    ca = rp(t, T[17], T[17] + 1.2)                                   # trend curve through the bar tops
    if ca > 0:
        xs = np.linspace(0.6, NMAX + 0.4, 200)
        ys = np.array([math.pi ** (n / 2) / math.gamma(n / 2 + 1) for n in xs])
        k_end = int(len(xs) * ca)
        c.set_source_rgba(*GOLD, 0.9 * a)
        c.set_line_width(4)
        c.set_dash([14, 10])
        for k in range(max(1, k_end)):
            px, py = GX0 + (xs[k] - 0.5) * SLOT, GBASE - ys[k] * GUNIT
            (c.move_to if k == 0 else c.line_to)(px, py)
        c.stroke()
        c.set_dash([])


# ---------------------------------------------------------------- drawing helpers
def make_bg():
    y = np.linspace(0, 1, H)[:, None, None]
    g = np.array([0.05, 0.06, 0.13]) * (1 - y) + np.array([0.012, 0.014, 0.035]) * y
    g = np.broadcast_to(g, (H, W, 3)).copy()
    xx = np.linspace(-1, 1, W)[None, :]
    yy = np.linspace(-1, 1, H)[:, None]
    g += np.exp(-((xx) ** 2 + ((yy + 0.06) * 1.6) ** 2) / 0.35)[..., None] * np.array([0.05, 0.04, 0.10])
    rng = np.random.default_rng(1)
    for a, b, v in zip(rng.integers(0, W, 160), rng.integers(0, H, 160), rng.random(160) ** 3 * 0.45):
        g[b, a] += v
    g += (rng.random((H, W, 1)) - 0.5) / 255 * 1.5
    return np.clip(g, 0, 1).astype(np.float32)


def blur(img, fac, rad):
    small = img.reshape(H // fac, fac, W // fac, fac, 3).mean(axis=(1, 3))
    p = Image.fromarray(np.clip(small * 255, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(rad))
    return np.asarray(p.resize((W, H), Image.BILINEAR), np.float32) / 255


def text(c, s, x, y, size, col, a=1.0, face="Inter", wt=cairo.FONT_WEIGHT_BOLD, maxw=980):
    if a < 0.003:
        return
    c.select_font_face(face, cairo.FONT_SLANT_NORMAL, wt)
    c.set_font_size(size)
    tw = c.text_extents(s).x_advance
    if tw > maxw:                                                    # never run off the screen
        size *= maxw / tw
        c.set_font_size(size)
        tw = maxw
    for dx, dy, rgba in ((0, 4, (0, 0, 0, 0.6 * a)), (0, 0, (*col, a))):
        c.set_source_rgba(*rgba)
        c.move_to(x - tw / 2 + dx, y + dy)
        c.show_text(s)


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


def chip(c, s, t, t_on, t_off, col, y=1450, size=58):
    a = rp(t, t_on, t_on + 0.3) * (1 - rp(t, t_off, t_off + 0.3))
    pop = 1 + 0.12 * (1 - rp(t, t_on, t_on + 0.35))
    text(c, s, W / 2, y, size * pop, col, a)


def meter(c, t, frac, t_on, t_off, label, col):
    a = rp(t, t_on, t_on + 0.3) * (1 - rp(t, t_off, t_off + 0.3))
    if a < 0.003:
        return
    f = frac * rp(t, t_on, t_on + 1.0)
    pct = 100 * f
    num = f"{pct:.2f}%" if frac < 0.01 else f"{pct:.0f}%"
    text(c, f"{label} {num}", W / 2, 1430, 56, col, a)
    x0, wd, y0, ht = W / 2 - 330, 660, 1470, 20
    c.set_source_rgba(1, 1, 1, 0.15 * a)
    c.rectangle(x0, y0, wd, ht)
    c.fill()
    c.set_source_rgba(*col, a)
    c.rectangle(x0, y0, max(3, wd * f), ht)                          # 0.25 % still shows a sliver
    c.fill()


def draw_shapes(c, t):
    ball_a = 1 - rp(t, T[8] - 0.4, T[8])
    draw_ball(c, t, ball_a)
    graph_a = rp(t, T[8] - 0.4, T[8]) * (1 - rp(t, T[19], T[19] + 0.4))
    draw_graph(c, t, graph_a)
    glow = rp(t, T[27], T[27] + 0.6)
    for d, a in cube_scenes(t):
        draw_cube(c, d, t, a, glow if d == 10 else 0.0)


def draw_text(c, t):
    end = rp(t, T[28], T[28] + 0.5)
    pa = 1 - rp(t, T[19], T[19] + 0.4)
    text(c, "Does a ball grow forever?", W / 2, 250, 70, TXT, pa)
    text(c, "volume of a radius 1 ball", W / 2, 330, 42, TEAL, rp(t, T[8] - 0.4, T[8]) * pa,
         wt=cairo.FONT_WEIGHT_NORMAL)
    text(c, "Ball inside a cube", W / 2, 250, 70, TXT, rp(t, T[19] + 0.3, T[19] + 0.7) * (1 - end))
    # opening ball
    text(c, "r = 1", CX + R_BALL / 2, CY - 24, 50, GOLD, rp(t, T[0] + 0.5, T[0] + 0.9) * (1 - rp(t, T[3], T[3] + 0.5)))
    chip(c, "2D circle", t, T[3] + 0.2, T[5] - 0.2, CYAN)
    chip(c, "Area ≈ 3.14", t, T[5] + 0.5, T[6] - 0.1, TEAL)
    chip(c, "3D sphere", t, T[6] + 0.1, T[7] - 0.1, CYAN)
    chip(c, "Volume ≈ 4.19", t, T[7] + 0.3, T[8] - 0.3, TEAL)
    # graph: axis labels, readouts, peak stamp
    ga = rp(t, T[8] - 0.4, T[8]) * (1 - rp(t, T[19], T[19] + 0.4))
    for n in (1, 5, 10, 15, 20):
        text(c, str(n), bar_x(n), GBASE + 42, 32, DIM, ga, wt=cairo.FONT_WEIGHT_NORMAL)
    text(c, "dimension", W / 2, GBASE + 86, 32, DIM, ga, wt=cairo.FONT_WEIGHT_NORMAL)
    chip(c, "4D  →  4.93", t, T[9], T[10] - 0.1, TEAL, y=1460)
    chip(c, "5D  →  5.26", t, T[11], T[13] - 0.1, GOLD, y=1460)
    chip(c, "6D  →  5.17", t, T[14], T[15] - 0.1, RED, y=1460)
    chip(c, "20D  →  0.026", t, T[16] + 0.6, T[17] - 0.1, VIOLET, y=1460)
    chip(c, "→ 0", t, T[18], T[19], GOLD, y=1460, size=70)
    pk = rp(t, T[12], T[12] + 0.25) * ga
    text(c, "PEAK", bar_x(5), GBASE - VOLS[4] * GUNIT - 36, 46 * (1 + 0.3 * (1 - pk)), GOLD, pk)
    # cube part: fill meters
    meter(c, t, FILL[2], T[22], T[23] - 0.2, "circle fills", TEAL)
    meter(c, t, FILL[3], T[24], T[25] - 0.2, "sphere fills", TEAL)
    meter(c, t, FILL[10], T[26], T[28], "10D ball fills", GOLD)
    ca = rp(t, T[27] + 0.3, T[27] + 0.8) * (1 - end)
    text(c, "1024 corners", W / 2, CY - SCALE[10] * math.sqrt(10) - 40, 46, GOLD, ca)
    text(c, "\u221a10 \u2248 3.16", CX + 255, CY - 20, 40, GOLD, ca)
    text(c, "1", CX - SCALE[10] / 2, CY - 18, 44, TEAL, ca)
    # end card
    text(c, "Where would you hide", W / 2, 300, 72, TXT, end, face="Inter Display")
    text(c, "in the 10th dimension?", W / 2, 390, 72, GOLD, end, face="Inter Display")
    text(c, "Tell me in the comments", W / 2, 1450, 42, TEAL, rp(t, T[28] + 0.8, T[28] + 1.3),
         wt=cairo.FONT_WEIGHT_NORMAL)
    # captions
    k = max([i for i in range(len(T)) if T[i] <= t + 0.05], default=-1)
    if 0 <= k < 28:
        a = rp(t, T[k] - 0.05, T[k] + 0.15) * (1 - rp(t, SPEECH_END, SPEECH_END + 0.4))
        for j, ln in enumerate(wrap(c, PHRASES[k], 54, 900)):
            text(c, ln, W / 2, 1640 + j * 70, 54, TXT, a)


def render(t):
    surf = cairo.ImageSurface(cairo.FORMAT_ARGB32, W, H)
    c = cairo.Context(surf)
    c.set_line_cap(cairo.LINE_CAP_ROUND)
    draw_shapes(c, t)
    surf.flush()
    L = np.ndarray((H, W, 4), np.uint8, surf.get_data()).astype(np.float32) / 255
    rgb, a = L[..., [2, 1, 0]], L[..., 3:4]
    fl = 0.0
    for tf in (T[12], T[27]):
        if 0 <= t - tf < 1:
            fl += 0.05 * math.exp(-(t - tf) / 0.2)
    out = BG * (1 - a) + rgb + blur(rgb, 4, 5) * 0.6 + blur(rgb, 8, 10) * 0.5 + fl
    out = np.clip((1 - np.exp(-out * 1.15)) / (1 - math.exp(-1.15)), 0, 1)
    bgra = np.empty((H, W, 4), np.uint8)
    bgra[..., 0], bgra[..., 1], bgra[..., 2], bgra[..., 3] = out[..., 2] * 255, out[..., 1] * 255, out[..., 0] * 255, 255
    ts = cairo.ImageSurface.create_for_data(memoryview(bgra), cairo.FORMAT_ARGB32, W, H)
    draw_text(cairo.Context(ts), t)
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

    def whoosh(ln):
        m = int(ln * SR)
        x = rng.standard_normal(m)
        x = np.convolve(x, np.ones(40) / 40, "same") * np.sin(np.linspace(0, math.pi, m)) ** 2
        return x / np.abs(x).max()

    def hz(m):
        return 440 * 2 ** ((m - 69) / 12)

    # opening: radius drawn, flatten to a circle, area fills, back to a sphere
    put(chime(hz(76)), T[0] + 0.9, 0.08)
    put(whoosh(1.0), T[3], 0.08)
    put(chime(hz(79)), T[5] + 0.9, 0.09)
    put(whoosh(1.0), T[6], 0.08)
    put(chime(hz(81)), T[7] + 0.4, 0.09)
    put(whoosh(1.0), T[8] - 0.5, 0.08)
    # bars land: pitch follows the bar height, the peak gets a big low chime
    for k in range(1, NMAX + 1):
        t0 = bar_on(k) + 0.5
        m = 64 + 5 * VOLS[k - 1]
        if k <= 6:
            put(chime(hz(m), 1.5), t0, 0.08, -0.6 + 1.2 * k / NMAX)
        else:
            put(tick(hz(m + 12)), t0, 0.05, -0.6 + 1.2 * k / NMAX)
    put(chime(hz(57), 3.0), T[12], 0.15)
    put(chime(hz(81), 1.5), T[16] + 0.6, 0.07)
    # cube part: meters lock in, corners light up, end question
    put(whoosh(1.0), T[19] + 0.3, 0.08)
    for t0, m in ((T[22] + 1.0, 79), (T[24] + 1.0, 76), (T[26] + 1.0, 72)):
        put(chime(hz(m), 1.6), t0, 0.08)
    put(whoosh(1.0), T[25] - 0.1, 0.08)
    for m in (72, 76, 79, 84):
        put(chime(hz(m), 3.0), T[27] + 0.1, 0.06)
    put(chime(hz(81), 2.5), T[28], 0.10)

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
        raise SystemExit("usage: python ball_dimensions.py voice.m4a [stills t1 t2 ...]")
    voice = sys.argv[1]
    os.makedirs(OUT, exist_ok=True)
    chunks, total = speech_chunks(voice)
    if len(chunks) != len(PHRASES):
        raise SystemExit(f"{len(chunks)} speech chunks vs {len(PHRASES)} phrases - "
                         "tell Claude both numbers so the pause threshold can be adjusted")
    dur = total + 1.2
    args = ([s for s, _ in chunks], chunks[-1][1], dur)

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
