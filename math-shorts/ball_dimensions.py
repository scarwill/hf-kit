#!/usr/bin/env python3
"""The radius-1 ball in higher dimensions - YouTube Short, 1080x1920 @ 60 fps, synced to the TTS voice.

  python ball_dimensions.py voice.m4a                     -> out/ball_dimensions.mp4
  python ball_dimensions.py voice.m4a stills 3 20 40      -> out/still_03.0.png ... (test frames)

Needs: numpy, pillow, pycairo + ffmpeg on PATH. Nothing else.
Maths is real: V(n) = pi^(n/2) / Gamma(n/2 + 1) for the unit ball (peak 5.264 at n = 5, 0.0258 at n = 20),
and the ball fills V(n) / 2^n of the cube that just holds it (78.5 %, 52.4 %, 0.25 % in 2D, 3D, 10D).
The 4D / 5D ball is drawn like the tesseract: slices of the hypersphere (smaller spheres pushed out along the
new axes) rotated in 4D / 5D and projected down with perspective. Its inner glow is proportional to V(n).
The 10D shell puts all 1024 corners of the 10-cube at their true distance sqrt(10) = 3.16 from the centre
(directions from a turning 10D -> 3D shadow), around the ball of radius 1.
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

CX, CY = 540, 860          # centre of the hero object

BALL = (0.30, 0.80, 1.00)  # the ordinary 3D ball
WCOL = (1.00, 0.78, 0.30)  # 4th direction (as in the tesseract)
VCOL = (1.00, 0.42, 0.75)  # 5th direction
RED = (1.00, 0.36, 0.42)
VIOLET = (0.62, 0.48, 1.00)
TEAL = (0.37, 0.92, 0.83)
GOLD = (1.00, 0.82, 0.40)
TXT = (0.95, 0.96, 1.00)
DIM = (0.62, 0.68, 0.82)
DIRC = [(1.0, 0.36, 0.42), (0.36, 0.95, 0.55), (0.35, 0.62, 1.0)]  # cube edges along x y z


def sm(x):
    x = min(1.0, max(0.0, x))
    return x * x * (3 - 2 * x)


def rp(t, a, b):
    return sm((t - a) / (b - a)) if b > a else float(t >= a)


def mix(c1, c2, u):
    return tuple(a + (b - a) * u for a, b in zip(c1, c2))


def vol(n):
    return math.pi ** (n / 2) / math.gamma(n / 2 + 1)


NMAX = 20
VOLS = {n: vol(n) for n in range(1, NMAX + 1)}
VPEAK = VOLS[5]


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


# ---------------------------------------------------------------- timeline
def dim_on(n):
    """time the readout switches to n dimensions"""
    fixed = {1: T[5] + 0.4, 2: T[5] + 0.4, 3: T[7] + 0.2, 4: T[9], 5: T[11], 6: T[14]}
    if n in fixed:
        return fixed[n]
    a, b = T[15] + 0.2, T[16] + 1.4                       # 7..20 cascade
    return a + (n - 7) / (NMAX - 7) * (b - a)


def dim_now(t):
    return max([n for n in range(2, NMAX + 1) if dim_on(n) <= t], default=0)


def vol_now(t):
    """volume shown by the inner glow, eased from one dimension to the next"""
    v = VOLS[3]
    for n in range(4, NMAX + 1):
        v += (VOLS[n] - VOLS[n - 1]) * rp(t, dim_on(n), dim_on(n) + 0.4)
    return v


def flat(t):
    """1 = full 3D, 0 = squashed flat (the 2D moments)"""
    return 1 - rp(t, T[3], T[3] + 0.7) + rp(t, T[6], T[6] + 1.0) - rp(t, T[21], T[21] + 0.7) + rp(t, T[23], T[23] + 0.9)


def s4(t):
    return rp(t, T[8], T[8] + 1.3) * (1 - rp(t, T[19], T[19] + 0.9))


def s5(t):
    return rp(t, T[10], T[10] + 1.3) * (1 - rp(t, T[19], T[19] + 0.9))


def ease_angle(x, rate, lag=1.2):
    return rate * (x - lag * (1 - math.exp(-x / lag))) if x > 0 else 0.0


def wrap(a):
    return (a + math.pi) % (2 * math.pi) - math.pi


def scale(t):
    return 260 - 135 * rp(t, T[25], T[25] + 1.3)          # camera pulls back for the 10D shell


def camera(t):
    v = flat(t)
    return v * (0.5 + 0.25 * t), v * 0.40                 # yaw, pitch (face-on when flat)


# ---------------------------------------------------------------- the n-ball wireframe
RING = np.linspace(0, 2 * math.pi, 65)
CT, ST = np.cos(RING), np.sin(RING)
LAT5 = [math.radians(a) for a in (-60, -30, 0, 30, 60)]
PHI4 = [math.radians(a) for a in (-58, -28, 28, 58)]       # slices along w
PSI5 = [math.radians(a) for a in (-42, 42)]                 # slices along v


def sphere(rho, w0, v0, lats, nlon, sq, col, a):
    out = []
    for la in lats:
        P = np.zeros((65, 5))
        P[:, 0], P[:, 1], P[:, 2] = rho * math.cos(la) * CT, rho * math.sin(la), rho * math.cos(la) * ST * sq
        P[:, 3], P[:, 4] = w0, v0
        out.append((P, col, a))
    for k in range(nlon):
        lo = math.pi * k / nlon * sq                      # meridians fan out of the flat circle
        P = np.zeros((65, 5))
        P[:, 0], P[:, 1], P[:, 2] = rho * CT * math.cos(lo), rho * ST, rho * CT * math.sin(lo)
        P[:, 3], P[:, 4] = w0, v0
        out.append((P, col, a))
    return out


def great_circle(i, j, amp, col, a):
    P = np.zeros((65, 5))
    P[:, i], P[:, j] = CT, ST * amp
    return [(P, col, a)]


def hyperball(t):
    sq, g4, g5 = flat(t), s4(t), s5(t)
    rings = sphere(1, 0, 0, LAT5, 6, sq, BALL, 1.0)
    if g4 > 0.002:
        for ph in PHI4:
            rings += sphere(math.cos(ph * g4), math.sin(ph * g4), 0, [0.0], 2, sq, WCOL, g4)
        rings += great_circle(0, 3, g4, WCOL, g4) + great_circle(1, 3, g4, WCOL, g4)
    if g5 > 0.002:
        for ps in PSI5:
            c, v0 = math.cos(ps * g5), math.sin(ps * g5)
            rings += sphere(c, 0, v0, [0.0], 2, sq, VCOL, g5)
        rings += great_circle(2, 4, g5, VCOL, g5) + great_circle(1, 4, g5, VCOL, g5)
    return rings


def project5(P, t):
    """5D -> 4D -> 3D (perspective) -> rotate view -> screen; P is (..., 5)"""
    x, y, z, w, v = (P[..., i] for i in range(5))
    a4 = wrap(ease_angle(t - T[8], 0.6) + ease_angle(t - T[13], 0.5)) * s4(t)
    a5 = wrap(ease_angle(t - T[10], 0.45) + ease_angle(t - T[13], 0.4)) * s5(t)
    c, s = math.cos(a5), math.sin(a5)
    z, v = z * c - v * s, z * s + v * c
    c, s = math.cos(a4), math.sin(a4)
    x, w = x * c - w * s, x * s + w * c
    c, s = math.cos(a4 * 0.45), math.sin(a4 * 0.45)
    y, w = y * c - w * s, y * s + w * c
    k5 = 4.0 / (4.0 - v)
    x, y, z, w = x * k5, y * k5, z * k5, w * k5
    k4 = 4.0 / (4.0 - w)
    x, y, z = x * k4, y * k4, z * k4
    return view3(x, y, z, t)


def view3(x, y, z, t, persp=True):
    yaw, pitch = camera(t)
    cy_, sy_ = math.cos(yaw), math.sin(yaw)
    x, z = x * cy_ + z * sy_, -x * sy_ + z * cy_
    cp, sp = math.cos(pitch), math.sin(pitch)
    y, z = y * cp - z * sp, y * sp + z * cp
    f = 7.0 / (7.0 - z) if persp else np.ones_like(z)
    S = scale(t)
    return CX + S * x * f, CY - S * y * f, f


def tint(t):
    """object colour drift: red once it starts shrinking, violet towards 20D, back to normal for the cube part"""
    back = 1 - rp(t, T[19], T[19] + 0.9)
    r = rp(t, T[13], T[13] + 0.7) * back
    vi = rp(t, T[15], T[16] + 1.4) * back
    return r, vi


def wire_alpha(t):
    """the wireframe thins out as the volume drops"""
    back = rp(t, T[19], T[19] + 0.9)
    a = 0.35 + 0.65 * min(1.0, vol_now(t) / VPEAK) if t > T[13] else 1.0
    return a * (1 - back) + back


def draw_hyperball(c, t, a=1.0):
    rings = hyperball(t)
    P = np.stack([r[0] for r in rings])
    X, Y, F = project5(P, t)
    r6, vi = tint(t)
    wa = wire_alpha(t) * a
    # inner glow = volume
    fill = rp(t, T[7], T[7] + 0.6) * (1 - rp(t, T[19], T[19] + 0.9)) * vol_now(t) / VPEAK
    fill += 0.55 * rp(t, T[19], T[19] + 0.9)
    peak = rp(t, T[12], T[12] + 0.3) * (1 - rp(t, T[13], T[13] + 0.8))
    if fill > 0.003:
        R = scale(t)
        col = mix(mix(mix(BALL, GOLD, peak), RED, r6), VIOLET, vi)
        g = cairo.RadialGradient(CX - 0.3 * R, CY - 0.3 * R, 0.05 * R, CX, CY, 1.1 * R)
        g.add_color_stop_rgba(0, *col, 0.65 * fill * a)
        g.add_color_stop_rgba(1, *col, 0.10 * fill * a)
        c.set_source(g)
        c.arc(CX, CY, 1.1 * R, 0, 2 * math.pi)
        c.fill()
    # area of the circle (2D moment)
    pie = rp(t, T[5], T[5] + 0.3) * (1 - rp(t, T[6], T[6] + 0.6))
    if pie > 0:
        R = scale(t)
        c.set_source_rgba(*TEAL, 0.38 * pie * a)
        c.move_to(CX, CY)
        c.arc(CX, CY, R, -math.pi / 2, -math.pi / 2 + 2 * math.pi * rp(t, T[5], T[5] + 0.9))
        c.close_path()
        c.fill()
    order = []
    for ri, (_, col, ra) in enumerate(rings):
        col = mix(mix(mix(col, GOLD, 0.6 * peak), RED, r6), VIOLET, vi)
        for s0 in range(0, 64, 8):
            depth = float(F[ri, s0:s0 + 9].mean())
            order.append((depth, ri, s0, col, ra))
    order.sort(key=lambda o: o[0])
    for depth, ri, s0, col, ra in order:
        al = min(1.0, 0.30 + 1.6 * (depth - 0.82)) * ra * wa
        if al < 0.01:
            continue
        c.set_source_rgba(*col, al)
        c.set_line_width(1.6 + 3.2 * (depth - 0.75))
        c.move_to(X[ri, s0], Y[ri, s0])
        for k in range(s0 + 1, s0 + 9):
            c.line_to(X[ri, k], Y[ri, k])
        c.stroke()


# ---------------------------------------------------------------- cube around the ball, and the 10D shell
BITS3 = np.array([[(v >> i) & 1 for i in range(3)] for v in range(8)], float) * 2 - 1
EDGES3 = [(a, a ^ (1 << i), i) for a in range(8) for i in range(3) if a < a ^ (1 << i)]
BITS10 = np.array([[(v >> i) & 1 for i in range(10)] for v in range(1024)], float) * 2 - 1
FRAME10 = np.linalg.qr(np.random.default_rng(7).standard_normal((10, 3)))[0]   # orthonormal 10D -> 3D
FILL = {2: vol(2) / 4, 3: vol(3) / 8, 10: vol(10) / 2 ** 10}


def cube_alpha(t):
    return rp(t, T[20], T[20] + 0.6) * (1 - rp(t, T[25], T[25] + 0.8))


def draw_cube(c, t):
    a = cube_alpha(t)
    if a < 0.003:
        return
    size = 1.0 + 0.45 * (1 - rp(t, T[20] + 0.2, T[20] + 1.5))     # closes in until it just holds the ball
    sq = flat(t)
    P = BITS3 * size
    X, Y, F = view3(P[:, 0], P[:, 1], P[:, 2] * sq, t)
    # 2D moment: tint the corners of the square that the circle misses
    ca = rp(t, T[22], T[22] + 0.4) * (1 - rp(t, T[23], T[23] + 0.4))
    if ca > 0:
        c.set_fill_rule(cairo.FILL_RULE_EVEN_ODD)
        c.set_source_rgba(*RED, 0.30 * ca * a)
        for v in (0, 1, 3, 2):
            c.line_to(X[v], Y[v])
        c.close_path()
        c.new_sub_path()
        c.arc(CX, CY, scale(t), 0, 2 * math.pi)
        c.fill()
        c.set_fill_rule(cairo.FILL_RULE_WINDING)
    for i0, j0, ax in sorted(EDGES3, key=lambda e: F[e[0]] + F[e[1]]):
        depth = (F[i0] + F[j0]) / 2
        c.set_source_rgba(*DIRC[ax], min(1.0, 0.45 + 1.4 * (depth - 0.8)) * a)
        c.set_line_width(2.5 + 6 * (depth - 0.75))
        c.move_to(X[i0], Y[i0])
        c.line_to(X[j0], Y[j0])
        c.stroke()
    c.set_source_rgba(1, 1, 1, 0.95 * a)
    for x, y, f in zip(X, Y, F):
        c.arc(x, y, 6.5 * f, 0, 2 * math.pi)
        c.fill()


def shell_frame(t):
    E = FRAME10.copy()
    for (i, j), w in (((0, 3), 0.21), ((2, 7), -0.17), ((4, 9), 0.13), ((1, 6), 0.09)):
        a = w * t
        g = np.eye(10)
        g[i, i] = g[j, j] = math.cos(a)
        g[i, j], g[j, i] = -math.sin(a), math.sin(a)
        E = g @ E
    return E


def draw_shell(c, t):
    a = rp(t, T[25] + 0.1, T[25] + 0.7)
    if a < 0.003:
        return
    glow = rp(t, T[27], T[27] + 0.6)
    d = BITS10 @ shell_frame(t)
    d /= np.linalg.norm(d, axis=1, keepdims=True) + 1e-9
    r = math.sqrt(10) * (0.15 + 0.85 * rp(t, T[25] + 0.1, T[25] + 1.4))   # corners burst out to sqrt(10)
    X, Y, _ = view3(d[:, 0] * r, d[:, 1] * r, d[:, 2] * r, t, persp=False)
    yaw, pitch = camera(t)
    zz = (-d[:, 0] * math.sin(yaw) + d[:, 2] * math.cos(yaw)) * math.cos(pitch) + d[:, 1] * math.sin(pitch)
    col = mix(BALL, GOLD, glow)
    for k in np.argsort(zz):
        front = (zz[k] + 1) / 2
        c.set_source_rgba(*col, (0.2 + 0.55 * front) * a)
        c.arc(X[k], Y[k], (1.8 + 2.6 * front) * (1 + 0.4 * glow), 0, 2 * math.pi)
        c.fill()
    if glow > 0:                                                     # distances: 1 to the ball, 3.16 to a corner
        S = scale(t)
        an = math.radians(35)
        c.set_line_width(4)
        c.set_source_rgba(*GOLD, glow * a)
        c.move_to(CX, CY)
        c.line_to(CX + math.sqrt(10) * S * math.cos(an), CY - math.sqrt(10) * S * math.sin(an))
        c.stroke()
        c.set_source_rgba(*TEAL, glow * a)
        c.move_to(CX, CY)
        c.line_to(CX - S, CY)
        c.stroke()


# ---------------------------------------------------------------- volume strip (small, under the object)
SX0, SBASE, SSLOT, SUNIT = 140, 1572, 40, 15


def strip_alpha(t):
    return rp(t, T[5] + 0.3, T[5] + 0.7) * (1 - rp(t, T[19], T[19] + 0.4))


def draw_strip(c, t):
    a = strip_alpha(t)
    if a < 0.003:
        return
    c.set_source_rgba(*DIM, 0.45 * a)
    c.set_line_width(2)
    c.move_to(SX0 - 6, SBASE)
    c.line_to(SX0 + NMAX * SSLOT + 6, SBASE)
    c.stroke()
    for n in range(1, NMAX + 1):
        g = rp(t, dim_on(n), dim_on(n) + 0.35)
        if g <= 0:
            continue
        h = VOLS[n] * SUNIT * g
        col = GOLD if n == 5 else (mix(RED, VIOLET, (n - 6) / (NMAX - 6)) if n >= 6 else BALL)
        c.set_source_rgba(*col, 0.9 * a)
        c.rectangle(SX0 + (n - 1) * SSLOT + 8, SBASE - h, SSLOT - 16, h)
        c.fill()
    tr = rp(t, T[17], T[17] + 1.2)                                  # trend through the bar tops
    if tr > 0:
        c.set_source_rgba(*GOLD, 0.9 * a)
        c.set_line_width(2.5)
        c.set_dash([8, 6])
        xs = np.linspace(0.6, 0.6 + (NMAX - 0.2) * tr, 120)
        for k, n in enumerate(xs):
            px, py = SX0 + (n - 0.5) * SSLOT, SBASE - vol(n) * SUNIT
            (c.move_to if k == 0 else c.line_to)(px, py)
        c.stroke()
        c.set_dash([])


def draw_shapes(c, t):
    draw_cube(c, t)
    draw_hyperball(c, t, 1 - 0.35 * rp(t, T[27], T[27] + 0.6))
    draw_shell(c, t)
    draw_strip(c, t)
    a = rp(t, T[0] + 0.2, T[0] + 0.8) * (1 - rp(t, T[3], T[3] + 0.5))          # radius line r = 1
    if a > 0:
        S = scale(t)
        c.set_source_rgba(*GOLD, a)
        c.set_line_width(5)
        c.move_to(CX, CY)
        c.line_to(CX + S * rp(t, T[0] + 0.2, T[0] + 0.9), CY)
        c.stroke()
        c.arc(CX, CY, 9, 0, 2 * math.pi)
        c.fill()


# ---------------------------------------------------------------- text
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
        c.set_font_size(size * maxw / tw)
        tw = maxw
    for dx, dy, rgba in ((0, 4, (0, 0, 0, 0.6 * a)), (0, 0, (*col, a))):
        c.set_source_rgba(*rgba)
        c.move_to(x - tw / 2 + dx, y + dy)
        c.show_text(s)


def wrap_lines(c, s, size, maxw):
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


def chip(c, s, t, t_on, t_off, col, y=1440, size=56):
    a = rp(t, t_on, t_on + 0.3) * (1 - rp(t, t_off, t_off + 0.3))
    pop = 1 + 0.12 * (1 - rp(t, t_on, t_on + 0.35))
    text(c, s, W / 2, y, size * pop, col, a)


def readout(c, t):
    """live 'nD  volume x' counter during the dimension climb"""
    n = dim_now(t)
    a = strip_alpha(t)
    if n < 2 or a < 0.003:
        return
    v = VOLS[n]
    num = f"{v:.3f}" if v < 0.1 else f"{v:.2f}"
    word = "area" if n == 2 else "volume"
    col = GOLD if n == 5 else (mix(RED, VIOLET, (n - 6) / (NMAX - 6)) if n >= 6 else TEAL)
    pop = 1 + 0.10 * (1 - rp(t, dim_on(n), dim_on(n) + 0.3))
    text(c, f"{n}D   {word}  {num}", W / 2, 1440, 58 * pop, col, a)


def meter(c, t, frac, t_on, t_off, label, col):
    a = rp(t, t_on, t_on + 0.3) * (1 - rp(t, t_off, t_off + 0.3))
    if a < 0.003:
        return
    f = frac * rp(t, t_on, t_on + 1.0)
    num = f"{100 * f:.2f}%" if frac < 0.01 else f"{100 * f:.0f}%"
    text(c, f"{label} {num}", W / 2, 1430, 56, col, a)
    x0, wd, y0, ht = W / 2 - 330, 660, 1470, 20
    c.set_source_rgba(1, 1, 1, 0.15 * a)
    c.rectangle(x0, y0, wd, ht)
    c.fill()
    c.set_source_rgba(*col, a)
    c.rectangle(x0, y0, max(3, wd * f), ht)                          # 0.25 % still shows a sliver
    c.fill()


def draw_text(c, t):
    end = rp(t, T[28], T[28] + 0.5)
    pa = 1 - rp(t, T[19], T[19] + 0.4)
    text(c, "Does a ball grow forever?", W / 2, 250, 70, TXT, pa)
    text(c, "Ball inside a cube", W / 2, 250, 70, TXT, rp(t, T[19] + 0.3, T[19] + 0.7) * (1 - end))
    # dimension tag under the title, like the tesseract labels
    tags = [("3D", T[0], T[3], BALL), ("2D", T[3] + 0.3, T[6], TEAL), ("3D", T[6] + 0.3, T[8], BALL),
            ("4D", T[8] + 0.3, T[10], WCOL), ("5D", T[10] + 0.3, T[13], VCOL)]
    for s, t0, t1, col in tags:
        chip(c, s, t, t0, t1 - 0.3, col, y=345, size=52)
    text(c, "r = 1", CX + scale(t) / 2, CY - 24, 50, GOLD, rp(t, T[0] + 0.5, T[0] + 0.9) * (1 - rp(t, T[3], T[3] + 0.5)))
    readout(c, t)
    pk = rp(t, T[12], T[12] + 0.25) * strip_alpha(t)
    text(c, "PEAK", SX0 + 4.5 * SSLOT, SBASE - VOLS[5] * SUNIT - 14, 26, GOLD, pk)
    # cube part
    meter(c, t, FILL[2], T[22], T[23] - 0.2, "circle fills", TEAL)
    meter(c, t, FILL[3], T[24], T[25] - 0.2, "sphere fills", TEAL)
    meter(c, t, FILL[10], T[26], T[28], "10D ball fills", GOLD)
    ca = rp(t, T[27] + 0.3, T[27] + 0.8) * (1 - end)
    S = scale(t)
    text(c, "1024 corners", W / 2, CY - S * math.sqrt(10) - 40, 46, GOLD, ca)
    text(c, "√10 ≈ 3.16", CX + 345, CY - S * math.sqrt(10) * 0.62 - 50, 42, GOLD, ca)
    text(c, "1", CX - S / 2, CY - 18, 44, TEAL, ca)
    # end card
    text(c, "Where would you hide", W / 2, 300, 72, TXT, end, face="Inter Display")
    text(c, "in the 10th dimension?", W / 2, 390, 72, GOLD, end, face="Inter Display")
    text(c, "Tell me in the comments", W / 2, 1450, 42, TEAL, rp(t, T[28] + 0.8, T[28] + 1.3),
         wt=cairo.FONT_WEIGHT_NORMAL)
    # captions
    k = max([i for i in range(len(T)) if T[i] <= t + 0.05], default=-1)
    if 0 <= k < 28:
        a = rp(t, T[k] - 0.05, T[k] + 0.15) * (1 - rp(t, SPEECH_END, SPEECH_END + 0.4))
        for j, ln in enumerate(wrap_lines(c, PHRASES[k], 54, 900)):
            text(c, ln, W / 2, 1650 + j * 70, 54, TXT, a)


def render(t):
    surf = cairo.ImageSurface(cairo.FORMAT_ARGB32, W, H)
    c = cairo.Context(surf)
    c.set_line_cap(cairo.LINE_CAP_ROUND)
    c.set_line_join(cairo.LINE_JOIN_ROUND)
    draw_shapes(c, t)
    surf.flush()
    L = np.ndarray((H, W, 4), np.uint8, surf.get_data()).astype(np.float32) / 255
    rgb, a = L[..., [2, 1, 0]], L[..., 3:4]
    fl = 0.0
    for tf in (T[8] + 0.6, T[10] + 0.6, T[12], T[25] + 0.4, T[27]):
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

    put(chime(hz(76)), T[0] + 0.9, 0.08)                             # radius line lands
    for t0 in (T[3], T[6], T[8], T[10], T[19], T[21], T[23]):        # flatten / inflate / sprout / collapse
        put(whoosh(1.2), t0, 0.09)
    put(chime(hz(79)), T[5] + 0.9, 0.09)                             # area filled
    for n_ in range(2, NMAX + 1):                                    # readout steps, pitch follows the volume
        m = 62 + 5 * VOLS[n_]
        if n_ <= 6:
            put(chime(hz(m), 1.5), dim_on(n_), 0.08, -0.5 + n_ / NMAX)
        else:
            put(tick(hz(m + 12)), dim_on(n_), 0.05, -0.5 + n_ / NMAX)
    put(chime(hz(57), 3.0), T[12], 0.15)                             # peak
    put(chime(hz(79), 1.6), T[20] + 1.5, 0.09)                       # cube touches the ball
    for t0, m in ((T[22] + 1.0, 79), (T[24] + 1.0, 76), (T[26] + 1.0, 72)):
        put(chime(hz(m), 1.6), t0, 0.08)                             # meters lock in
    put(whoosh(1.6), T[25], 0.12)                                    # corners burst out
    for m in (72, 76, 79, 84):
        put(chime(hz(m), 3.0), T[27] + 0.1, 0.06)                    # corners light up
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
