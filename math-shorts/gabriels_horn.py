#!/usr/bin/env python3
"""Gabriel's horn - YouTube Short (1080x1920 @ 60 fps), every animation synced to the TTS voice.

  python gabriels_horn.py voice.m4a                     -> out/gabriels_horn.mp4
  python gabriels_horn.py voice.m4a stills 3 10 20      -> out/still_03.0.png ... (test frames)

Needs: numpy, pillow, pycairo + ffmpeg on PATH. Nothing else.
Maths is real: horn r = 1/x for x >= 1, volume up to b = pi(1 - 1/b),
surface up to b = 2*pi * integral_0^ln(b) sqrt(1 + e^(-4u)) du  (grows like 2*pi*ln b).
"""
import math
import os
import re
import subprocess
import sys
import wave as wavfile
from multiprocessing import Pool

import numpy as np
import cairo
from PIL import Image, ImageFilter

NAME = "gabriels_horn"
W, H, FPS = 1080, 1920, 60
OUT = "out"
FONT = "Inter"
XMAX = 200.0                 # horn is drawn up to here and fades out long before it
TAU = 2 * math.pi

PHRASES = [
    "This horn goes on forever.",                            # 0
    "Its surface never ends.",                               # 1
    "Yet you could fill it with paint.",                     # 2
    "This is Gabriel's horn.",                               # 3
    "Take the curve,",                                       # 4
    "y equals one over x.",                                  # 5
    "Start at x equals one,",                                # 6
    "and spin it around the x axis.",                        # 7
    "The horn gets thinner and thinner,",                    # 8
    "but it never closes.",                                  # 9
    "First, its volume.",                                    # 10
    "Add up every thin slice inside.",                       # 11
    "The total is exactly pi.",                              # 12
    "Just over three cubic units.",                          # 13
    "Now, its surface area.",                                # 14
    "It grows slowly,",                                      # 15
    "but it never stops growing.",                           # 16
    "Infinite surface.",                                     # 17
    "Finite volume.",                                        # 18
    "You can fill it with paint,",                           # 19
    "but you can never paint its surface.",                  # 20
    "Torricelli found this nearly four hundred years ago,",  # 21
    "and it still feels impossible.",                        # 22
    "So, could you paint Gabriel's horn?",                   # 23
]

TITLES = [(0, "Can you paint the infinite?"), (3, "GABRIEL'S HORN"), (10, "VOLUME"),
          (14, "SURFACE AREA"), (17, "INFINITE vs FINITE"), (21, "TORRICELLI'S TRUMPET"),
          (23, "Could you paint it?")]

# colours
CYAN = (0.30, 0.88, 1.00)
VIOLET = (0.66, 0.45, 1.00)
PINK = (1.00, 0.36, 0.72)
GOLD = (1.00, 0.72, 0.25)
ORANGE = (1.00, 0.48, 0.16)
WHITE = (1.0, 1.0, 1.0)

# ----------------------------------------------------------------------------------------------
# timeline (filled from the voice file)
# ----------------------------------------------------------------------------------------------
T, TE, END = [], [], 0.0


def set_timeline(t_, te_, end_):
    global T, TE, END
    T, TE, END = list(t_), list(te_), float(end_)


def D(i):
    """length of phrase i incl. the pause after it"""
    return (T[i + 1] if i + 1 < len(T) else TE[-1] + 0.6) - T[i]


def audio_duration(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                        "-of", "csv=p=0", path], capture_output=True, text=True)
    return float(r.stdout.strip())


def speech_chunks(path, noise=-35, dur=0.25):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af",
                        f"silencedetect=n={noise}dB:d={dur}", "-f", "null", "-"],
                       capture_output=True, text=True)
    total = audio_duration(path)
    starts = [float(x) for x in re.findall(r"silence_start: (-?[\d.]+)", r.stderr)]
    ends = [float(x) for x in re.findall(r"silence_end: (-?[\d.]+)", r.stderr)]
    ends += [total] * (len(starts) - len(ends))
    chunks, cur = [], 0.0
    for s, e in zip(starts, ends):
        if s - cur > 0.05:
            chunks.append([cur, s])
        cur = e
    if total - cur > 0.15:
        chunks.append([cur, total])
    return chunks


def fit_chunks(chunks, n):
    """TTS often pauses at a comma ("Now, ..."). Merge the shortest pauses until counts match."""
    chunks = [list(c) for c in chunks]
    while len(chunks) > n:
        gaps = [chunks[i + 1][0] - chunks[i][1] for i in range(len(chunks) - 1)]
        i = int(np.argmin(gaps))
        print(f"  merging speech chunks {i + 1}+{i + 2} (pause only {gaps[i]:.2f} s, a comma)")
        chunks[i][1] = chunks[i + 1][1]
        del chunks[i + 1]
    assert len(chunks) == n, (
        f"Found {len(chunks)} speech chunks in the voice but the script has {n} phrases.\n"
        f"Tell Claude both numbers (and the chunk list printed above) to fix the sync.")
    return chunks


# ----------------------------------------------------------------------------------------------
# small maths helpers
# ----------------------------------------------------------------------------------------------
def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def smooth(x):
    x = clamp(x)
    return x * x * (3 - 2 * x)


def ease(t, t0, d):
    if d <= 0:
        return 1.0 if t >= t0 else 0.0
    return smooth((t - t0) / d)


def lerp(a, b, u):
    return a + (b - a) * u


def mix(c1, c2, u):
    return tuple(lerp(a, b, u) for a, b in zip(c1, c2))


def back_out(u):
    u = clamp(u)
    c1 = 1.70158
    return 1 + (c1 + 1) * (u - 1) ** 3 + c1 * (u - 1) ** 2


def pop(t, t0, d=0.35):
    """(scale, alpha) of something that pops in at t0"""
    u = clamp((t - t0) / d)
    return 0.7 + 0.3 * back_out(u), clamp(u * 2.5)


# surface area up to b, exact numeric integral (in u = ln x)
_U = np.linspace(0.0, 30.0, 60001)
_G = TAU * np.sqrt(1.0 + np.exp(-4.0 * _U))
_A = np.concatenate([[0.0], np.cumsum((_G[1:] + _G[:-1]) * 0.5 * (_U[1] - _U[0]))])


def area_upto(b):
    return float(np.interp(math.log(max(b, 1.0)), _U, _A))


def volume_upto(b):
    return math.pi * (1.0 - 1.0 / b)


# ----------------------------------------------------------------------------------------------
# camera / projection
# ----------------------------------------------------------------------------------------------
CAM_HERO = dict(cx=2.7, cy=0.0, cz=0.0, s=200.0, yaw=0.62, pitch=0.30, dist=14.0, sx=540.0, sy=960.0)


def cam(**kw):
    c = dict(CAM_HERO)
    c.update(kw)
    return c


CAM_GRAPH = cam(cx=4.1, cy=1.75, s=110.0, yaw=0.0, pitch=0.0, dist=400.0)
LOG_KEYS = ("s", "dist")


def blend(a, b, u):
    out = {}
    for k in a:
        if k in LOG_KEYS:
            out[k] = math.exp(lerp(math.log(a[k]), math.log(b[k]), u))
        else:
            out[k] = lerp(a[k], b[k], u)
    return out


def travel_u(t):      # phrase 8: camera + marker ride along the horn together
    return ease(t, T[8] + 0.1, 0.85 * D(8))


def camera(t):
    moves = [
        (0.0, T[4], cam(cx=3.4, s=185.0)),                                        # slow dolly in the hook
        (T[4], 0.9, CAM_GRAPH),                                                    # flat graph of 1/x
        (T[7] + 0.05, 0.6 * D(7) + 0.3, cam(cx=3.6, s=175.0)),                    # spin -> 3D
        (T[8] + 0.1, 0.85 * D(8), cam(cx=40.0, s=150.0, yaw=0.5, pitch=0.25, dist=30.0)),  # ride
        (T[9] + 0.05, 0.9 * D(9), cam(cx=40.0, s=4200.0, yaw=1.05, pitch=0.25, dist=30.0)),  # zoom
        (T[10], 1.0, cam()),                                                       # back out
        (T[17], 1.0, cam(cx=3.1, s=190.0)),
        (T[21], D(21) + D(22), cam(cx=3.0, yaw=0.80, pitch=0.36)),
        (T[23], D(23) + 1.0, cam(cx=2.8, yaw=0.62)),
    ]
    c = cam(cx=2.3, s=205.0)
    for t0, d, tgt in moves:
        u = ease(t, t0, d)
        if u <= 0:
            break
        c = blend(c, tgt, u)
    c["yaw"] += 0.03 * math.sin(0.35 * t)
    return c


def project(P, c):
    x = P[..., 0] - c["cx"]
    y = P[..., 1] - c["cy"]
    z = P[..., 2] - c["cz"]
    cy_, sy_ = math.cos(c["yaw"]), math.sin(c["yaw"])
    x1 = x * cy_ + z * sy_
    z1 = -x * sy_ + z * cy_
    cp, sp = math.cos(c["pitch"]), math.sin(c["pitch"])
    y2 = y * cp - z1 * sp
    z2 = y * sp + z1 * cp
    zc = c["dist"] - z2
    f = c["dist"] / np.maximum(zc, 1e-3)
    X = c["sx"] + c["s"] * x1 * f
    Y = c["sy"] - c["s"] * y2 * f
    ok = (zc > 0.3 * c["dist"]) & (np.abs(X) < 2e4) & (np.abs(Y) < 2e4)
    return X, Y, ok


def facing(th, c):
    """>0 when the surface normal at angle th points at the camera"""
    z1 = np.sin(th) * math.cos(c["yaw"])
    return np.cos(th) * math.sin(c["pitch"]) + z1 * math.cos(c["pitch"])


def ring_pts(x, th):
    r = 1.0 / x
    return np.stack([np.full_like(th, x), r * np.cos(th), r * np.sin(th)], -1)


def meridian_pts(xs, th):
    return np.stack([xs, np.cos(th) / xs, np.sin(th) / xs], -1)


# ----------------------------------------------------------------------------------------------
# what is on screen when (all from T[i])
# ----------------------------------------------------------------------------------------------
def sweep_window():
    return T[7] + 0.15, max(0.8, 0.9 * D(7))


def horn_state(t):
    """(alpha, visible length, swept angle, roll)"""
    if t < T[7]:
        xv = math.exp(lerp(math.log(1.5), math.log(XMAX), ease(t, 0.0, max(1.2, D(0)))))
        return 1.0 - ease(t, T[4], 0.5), xv, TAU, 0.22 * t
    s0, sd = sweep_window()
    phi = TAU * ease(t, s0, sd)
    xv = math.exp(lerp(math.log(8.0), math.log(XMAX), ease(t, T[8], 0.9)))
    roll = 0.22 * (t - T[8]) if t > T[8] else 0.0
    return 1.0, xv, phi, roll


def fade_start(t):
    return lerp(12.0, 70.0, ease(t, T[8], 0.8) * (1 - ease(t, T[10], 0.8)))


def xfade(x, t):
    x0 = fade_start(t)
    return 1.0 - smooth((math.log(x) - math.log(x0)) / (math.log(XMAX) - math.log(x0)))


def wave(x, t):
    """bright pulse running down the surface (phrase 1 white, phrase 14 pink)"""
    lx = math.log(x)
    for i, col in ((1, WHITE), (14, PINK)):
        if T[i] <= t < T[i] + D(i) + 0.4:
            pos = math.log(1.1) + math.log(60.0) * ease(t, T[i], D(i))
            k = 1 - ease(t, T[i] + D(i), 0.4)
            return math.exp(-((lx - pos) / 0.28) ** 2) * k, col
    return 0.0, WHITE


def fill_level(t):
    """(paint front x, alpha) of the paint INSIDE the horn"""
    if t < T[7]:
        a = ease(t, T[2] + 0.05, 0.3) * (1 - ease(t, T[4], 0.5))
        return math.exp(math.log(XMAX) * ease(t, T[2] + 0.1, 0.9 * D(2))), a
    a = ease(t, T[19], 0.3)
    return math.exp(math.log(XMAX) * ease(t, T[19] + 0.1, 0.9 * D(19))), a


def coat_level(t):
    """(painted-surface front x, alpha) of paint ON the surface"""
    if t < T[19] + 0.2:
        u = clamp((t - T[15] - 0.1) / max(0.5, T[17] - T[15] - 0.3))
        b = math.exp(math.log(1e12) * u ** 2.2)
        return min(b, XMAX), ease(t, T[15], 0.2) * (1 - ease(t, T[19], 0.5))
    u = clamp((t - T[20]) / max(1.0, END - T[20]))
    return math.exp(math.log(25.0) * (1 - math.exp(-3.0 * u))), ease(t, T[20], 0.25)


def counter_b(t):
    u = clamp((t - T[15] - 0.1) / max(0.5, T[17] - T[15] - 0.3))
    return math.exp(math.log(1e12) * u ** 2.2)


XSL = np.concatenate([np.arange(1.0, 7.0, 0.3), np.geomspace(7.6, 40.0, 8)])


def slice_time(i):
    return T[11] + 0.1 + i * (0.85 * D(11)) / len(XSL)


def marker_x(t):
    return lerp(2.0, 40.0, travel_u(t))


def cube_time(k):
    return T[13] + 0.15 + k * 0.3


# ----------------------------------------------------------------------------------------------
# drawing helpers
# ----------------------------------------------------------------------------------------------
def stroke_poly(ctx, X, Y, ok, rgb, a, lw):
    if a <= 0.004:
        return
    ctx.new_path()
    started = False
    for xx, yy, k in zip(X.tolist(), Y.tolist(), ok.tolist()):
        if k:
            if started:
                ctx.line_to(xx, yy)
            else:
                ctx.move_to(xx, yy)
                started = True
        else:
            started = False
    ctx.set_source_rgba(rgb[0], rgb[1], rgb[2], min(1.0, a))
    ctx.set_line_width(lw)
    ctx.stroke()


def hull(pts):
    pts = sorted(pts)
    if len(pts) < 3:
        return pts

    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

    lo, up = [], []
    for p in pts:
        while len(lo) >= 2 and cross(lo[-2], lo[-1], p) <= 0:
            lo.pop()
        lo.append(p)
    for p in reversed(pts):
        while len(up) >= 2 and cross(up[-2], up[-1], p) <= 0:
            up.pop()
        up.append(p)
    return lo[:-1] + up[:-1]


def horn_col(x):
    return mix(CYAN, VIOLET, clamp(math.log(x) / math.log(14.0)))


def draw_horn(ctx, c, t, xvis, phi, alpha, roll, tint=None, lw_m=2.2, lw_r=2.0, glow=1.0):
    if alpha <= 0.01 or xvis <= 1.0:
        return
    xs = XM[XM < xvis]
    xs = np.append(xs, xvis)
    # meridians (lines along the horn)
    for th0 in THM:
        if th0 > phi + 1e-6:
            continue
        th = th0 + roll
        X, Y, ok = project(meridian_pts(xs, np.full_like(xs, th)), c)
        af = 0.30 + 0.70 * clamp(0.5 + 0.9 * float(facing(th, c)))
        for k0 in range(0, len(xs) - 1, 24):
            k1 = min(k0 + 25, len(xs))
            xm = float(xs[(k0 + k1 - 1) // 2])
            w, wc = wave(xm, t)
            col = tint or horn_col(xm)
            col = mix(col, wc, w)
            a = alpha * af * xfade(xm, t) * glow * (0.75 + 1.2 * w)
            stroke_poly(ctx, X[k0:k1], Y[k0:k1], ok[k0:k1], col, a, lw_m)
    # rings (circles across the horn)
    n = max(3, int(72 * phi / TAU)) + 1
    th = np.linspace(0.0, phi, n) + roll
    fa = facing(th, c)
    front, backm = fa > -0.08, fa < 0.08
    for xr in XR[XR <= xvis]:
        X, Y, ok = project(ring_pts(float(xr), th), c)
        w, wc = wave(float(xr), t)
        col = mix(tint or horn_col(float(xr)), wc, w)
        a = alpha * xfade(float(xr), t) * glow * (1 + 1.5 * w)
        stroke_poly(ctx, X, Y, ok & front, col, 0.85 * a, lw_r)
        stroke_poly(ctx, X, Y, ok & backm, col, 0.28 * a, lw_r)
    # bright mouth rim
    X, Y, ok = project(ring_pts(1.0, th), c)
    stroke_poly(ctx, X, Y, ok, tint or WHITE, 0.95 * alpha * glow, 3.6)


def draw_solid(ctx, c, x0, x1, rgb0, rgb1, alpha, n=46):
    """filled inside of the horn from x0 to x1 (union of hulls of neighbouring rings)"""
    if alpha <= 0.01 or x1 <= x0 * 1.001:
        return
    xs = np.geomspace(x0, x1, n)
    th = np.linspace(0.0, TAU, 33)[:-1]
    ctx.push_group()
    prev = None
    for x in xs:
        X, Y, ok = project(ring_pts(float(x), th), c)
        pts = [(a, b) for a, b, k in zip(X.tolist(), Y.tolist(), ok.tolist()) if k]
        if prev and pts:
            hp = hull(prev + pts)
            if len(hp) >= 3:
                ctx.move_to(*hp[0])
                for p in hp[1:]:
                    ctx.line_to(*p)
                ctx.close_path()
                u = clamp(math.log(x / x0) / max(1e-6, math.log(x1 / x0)))
                col = mix(rgb0, rgb1, u)
                f = xfade(float(x), t_now)
                ctx.set_source_rgba(col[0] * f, col[1] * f, col[2] * f, 1.0)
                ctx.fill()
        prev = pts
    ctx.pop_group_to_source()
    ctx.paint_with_alpha(alpha)


def draw_ring(ctx, c, x, rgb, a, lw):
    th = np.linspace(0.0, TAU, 97)
    X, Y, ok = project(ring_pts(x, th), c)
    stroke_poly(ctx, X, Y, ok, rgb, a, lw)


def draw_disc(ctx, c, x, rgb, a_fill, a_edge, lw=2.5):
    th = np.linspace(0.0, TAU, 65)
    X, Y, ok = project(ring_pts(x, th), c)
    if not ok.all():
        return
    ctx.move_to(X[0], Y[0])
    for xx, yy in zip(X[1:].tolist(), Y[1:].tolist()):
        ctx.line_to(xx, yy)
    ctx.close_path()
    ctx.set_source_rgba(*rgb, a_fill)
    ctx.fill_preserve()
    ctx.set_source_rgba(*rgb, a_edge)
    ctx.set_line_width(lw)
    ctx.stroke()


def world_line(ctx, c, p0, p1, rgb, a, lw, n=40):
    P = np.linspace(np.array(p0, float), np.array(p1, float), n)
    X, Y, ok = project(P, c)
    stroke_poly(ctx, X, Y, ok, rgb, a, lw)


def to_screen(c, p):
    X, Y, ok = project(np.array([p], float), c)
    return float(X[0]), float(Y[0])


def set_font(ctx, size, bold=True):
    ctx.select_font_face(FONT, cairo.FONT_SLANT_NORMAL,
                         cairo.FONT_WEIGHT_BOLD if bold else cairo.FONT_WEIGHT_NORMAL)
    ctx.set_font_size(size)


def text(ctx, s, x, y, size, rgb, a, bold=True, shadow=0.6):
    """text centred on (x, y) (y = middle of the capital letters)"""
    if a <= 0.004:
        return
    set_font(ctx, size, bold)
    xb, yb, w, h, xa, ya = ctx.text_extents(s)
    px, py = x - (xb + w / 2), y + size * 0.36
    if shadow:
        for dx, dy, sa in ((0, 4, 0.5), (0, 2, 0.5), (2, 3, 0.3), (-2, 3, 0.3)):
            ctx.move_to(px + dx, py + dy)
            ctx.set_source_rgba(0, 0, 0, a * shadow * sa)
            ctx.show_text(s)
    ctx.move_to(px, py)
    ctx.set_source_rgba(rgb[0], rgb[1], rgb[2], a)
    ctx.show_text(s)


def wrap(ctx, s, size, maxw):
    set_font(ctx, size)
    lines, cur = [], ""
    for word in s.split():
        test = (cur + " " + word).strip()
        if cur and ctx.text_extents(test)[4] > maxw:
            lines.append(cur)
            cur = word
        else:
            cur = test
    if cur:
        lines.append(cur)
    return lines


def panel(ctx, cx, cy, w, h, rgb, a, r=28):
    if a <= 0.004:
        return
    x0, y0 = cx - w / 2, cy - h / 2
    ctx.new_sub_path()
    ctx.arc(x0 + w - r, y0 + r, r, -math.pi / 2, 0)
    ctx.arc(x0 + w - r, y0 + h - r, r, 0, math.pi / 2)
    ctx.arc(x0 + r, y0 + h - r, r, math.pi / 2, math.pi)
    ctx.arc(x0 + r, y0 + r, r, math.pi, 1.5 * math.pi)
    ctx.close_path()
    ctx.set_source_rgba(0.02, 0.04, 0.11, 0.70 * a)
    ctx.fill_preserve()
    ctx.set_source_rgba(rgb[0], rgb[1], rgb[2], 0.65 * a)
    ctx.set_line_width(2.5)
    ctx.stroke()


def box3d(ctx, sx, sy, size, depth_scale, rgb, a):
    """small glowing unit cube (or thin slab) drawn with its own little camera"""
    if a <= 0.004:
        return
    c = dict(cx=0.0, cy=0.0, cz=0.0, s=size, yaw=0.62, pitch=0.42, dist=1000.0, sx=sx, sy=sy)
    hx = 0.5 * depth_scale
    V = np.array([[x, y, z] for x in (-hx, hx) for y in (-0.5, 0.5) for z in (-0.5, 0.5)], float)
    X, Y, _ = project(V, c)
    faces = [((0, 1, 3, 2), (-1, 0, 0)), ((4, 5, 7, 6), (1, 0, 0)), ((0, 1, 5, 4), (0, -1, 0)),
             ((2, 3, 7, 6), (0, 1, 0)), ((0, 2, 6, 4), (0, 0, -1)), ((1, 3, 7, 5), (0, 0, 1))]
    cy_, sy_ = math.cos(c["yaw"]), math.sin(c["yaw"])
    cp, sp = math.cos(c["pitch"]), math.sin(c["pitch"])
    for idx, (nx, ny, nz) in faces:
        z1 = -nx * sy_ + nz * cy_
        if ny * sp + z1 * cp <= 0:
            continue
        ctx.move_to(X[idx[0]], Y[idx[0]])
        for k in idx[1:]:
            ctx.line_to(X[k], Y[k])
        ctx.close_path()
        shade = 0.30 if ny > 0 else 0.16
        ctx.set_source_rgba(*rgb, shade * a)
        ctx.fill_preserve()
        ctx.set_source_rgba(*rgb, 0.95 * a)
        ctx.set_line_width(3.0)
        ctx.stroke()


# static geometry
XM = np.geomspace(1.0, XMAX, 320)
THM = TAU * np.arange(20) / 20.0
XR = np.concatenate([np.linspace(1.0, 6.0, 21), np.geomspace(6.6, XMAX, 40)])
t_now = 0.0


# ----------------------------------------------------------------------------------------------
# background (static, once per process)
# ----------------------------------------------------------------------------------------------
_BG = None


def background():
    global _BG
    if _BG is None:
        yy = np.linspace(0.0, 1.0, H, dtype=np.float32)[:, None, None]
        top = np.array([0.030, 0.045, 0.110], np.float32)
        bot = np.array([0.008, 0.012, 0.040], np.float32)
        bg = top * (1 - yy) + bot * yy + np.zeros((H, W, 3), np.float32)
        gy, gx = np.mgrid[0:H, 0:W].astype(np.float32)
        glow = np.exp(-((gx - 540) ** 2 + (gy - 900) ** 2) / (2 * 520.0 ** 2))
        bg += glow[..., None] * np.array([0.02, 0.035, 0.08], np.float32)
        rng = np.random.default_rng(7)
        stars = np.zeros((H, W), np.float32)
        n = 320
        sx, sy = rng.integers(0, W, n), rng.integers(0, H, n)
        stars[sy, sx] = rng.uniform(0.25, 1.0, n)
        img = Image.fromarray((stars * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.1))
        st = np.asarray(img, np.float32) / 255.0 * 2.2
        bg += st[..., None] * np.array([0.55, 0.65, 0.9], np.float32)
        _BG = np.clip(bg, 0, 1)
    return _BG


# ----------------------------------------------------------------------------------------------
# scene layer (gets bloom)
# ----------------------------------------------------------------------------------------------
def draw_scene(ctx, t, c):
    ha, xvis, phi, roll = horn_state(t)
    gl = 1.0 + 0.5 * math.exp(-((t - (T[22] + 0.6)) / 0.6) ** 2)      # glow pulse, phrase 22

    # x axis (axis of revolution), dim in 3D
    if t >= T[7] or t < T[4]:
        a_ax = 0.22 * (ha if t < T[7] else 1.0)
        world_line(ctx, c, (0.0, 0, 0), (min(xvis, 60.0), 0, 0), WHITE, a_ax, 1.6)

    # --- flat graph of y = 1/x (phrases 4-7)
    ga = ease(t, T[4] + 0.2, 0.5) * (1 - ease(t, T[7] + 0.3, 0.8))
    if ga > 0.01:
        world_line(ctx, c, (-0.3, 0, 0), (8.6, 0, 0), WHITE, 0.75 * ga, 2.5)
        world_line(ctx, c, (0, -0.3, 0), (0, 5.4, 0), WHITE, 0.75 * ga, 2.5)
        for k in range(1, 9):
            world_line(ctx, c, (k, -0.07, 0), (k, 0.07, 0), WHITE, 0.6 * ga, 2.0, n=2)
        world_line(ctx, c, (-0.07, 1, 0), (0.07, 1, 0), WHITE, 0.6 * ga, 2.0, n=2)
        # the curve
        xd = lerp(0.2, 8.0, ease(t, T[4] + 0.3, D(4) + 0.6))
        left_a = (1 - 0.8 * ease(t, T[6] + 0.3, 0.6)) * (1 - ease(t, T[7], 0.4))
        if xd > 0.2:
            xs = np.geomspace(0.2, xd, 160)
            X, Y, ok = project(np.stack([xs, 1 / xs, 0 * xs], -1), c)
            m = xs <= 1.0
            stroke_poly(ctx, X, Y, ok & m, WHITE, ga * left_a, 5.0)
            stroke_poly(ctx, X, Y, ok & (xs >= 0.995), WHITE, ga, 5.0)
        # x = 1 marker
        sc, pa = pop(t, T[6] + 0.25)
        if t >= T[6] + 0.25:
            aa = pa * (1 - ease(t, T[7] + 0.6, 0.5))
            P = np.stack([np.ones(30), np.linspace(0, 1, 30), np.zeros(30)], -1)
            X, Y, ok = project(P, c)
            ok = ok & (np.arange(30) % 4 < 2)            # dashed
            stroke_poly(ctx, X, Y, ok, GOLD, 0.9 * aa, 3.0)
            x1, y1 = to_screen(c, (1.0, 1.0, 0.0))
            ctx.arc(x1, y1, 13 * sc, 0, TAU)
            ctx.set_source_rgba(*GOLD, aa)
            ctx.fill()

    # --- paint inside the horn
    xf, fa = fill_level(t)
    if fa > 0.01 and ha > 0.01:
        draw_solid(ctx, c, 1.0, min(xf, xvis), ORANGE, GOLD, 0.34 * fa * ha)
        if xf < XMAX * 0.95:
            draw_ring(ctx, c, xf, GOLD, 0.9 * fa * ha * xfade(xf, t), 3.5)

    # --- volume slices (phrases 11-13)
    sa = 1 - ease(t, T[14], 0.6)
    if t >= slice_time(0) and sa > 0.01:
        for i, x in enumerate(XSL):
            ti = slice_time(i)
            if t < ti:
                break
            u = clamp((t - ti) / 0.15)
            flash = math.exp(-(t - ti) / 0.25)
            col = mix(CYAN, WHITE, flash)
            f = xfade(float(x), t) * sa * u
            bright = 1.0 + 0.6 * math.exp(-((t - (T[12] + 0.3)) / 0.5) ** 2)
            draw_disc(ctx, c, float(x), col, 0.20 * f * bright, 0.9 * f, 2.5)

    # --- the horn itself
    draw_horn(ctx, c, t, xvis, phi, ha, roll, glow=gl)
    s0, sd = sweep_window()
    if s0 <= t < s0 + sd:                                 # bright sweeping curve
        th = phi + roll
        xs = XM[XM <= 8.0]
        X, Y, ok = project(meridian_pts(xs, np.full_like(xs, th)), c)
        stroke_poly(ctx, X, Y, ok, WHITE, 1.0, 5.0)
    if T[7] <= t < T[8] + 0.6:                            # the generating curve stays bright a moment
        xs = XM[XM <= 8.0]
        a = 1 - ease(t, T[8], 0.6)
        X, Y, ok = project(meridian_pts(xs, np.zeros_like(xs)), c)
        stroke_poly(ctx, X, Y, ok, WHITE, a, 4.5)

    # --- paint ON the surface (phrases 15-17, then the hopeless try from 20)
    cb, ca = coat_level(t)
    if ca > 0.01 and t >= T[7]:
        draw_solid(ctx, c, 1.0, cb, PINK, PINK, 0.12 * ca)
        draw_horn(ctx, c, t, cb, TAU, 0.9 * ca, roll, tint=PINK, lw_m=3.2, lw_r=3.0)
        if cb < XMAX * 0.95:
            draw_ring(ctx, c, cb, mix(PINK, WHITE, 0.5), ca * xfade(cb, t), 5.0)

    # --- marker ring riding to the thin end (phrases 8-9)
    ma = ease(t, T[8] + 0.1, 0.25) * (1 - ease(t, T[10], 0.5))
    if ma > 0.01:
        draw_ring(ctx, c, marker_x(t), mix(PINK, WHITE, 0.3), ma, 6.0)

    draw_glow_ui(ctx, t)


def draw_glow_ui(ctx, t):
    """panels and big glowing values (drawn in the bloom layer)"""
    # info panel at the top
    info = info_state(t)
    if info:
        a, sc, col, big, _small, big_size = info
        ctx.save()
        ctx.translate(540, 410)
        ctx.scale(sc, sc)
        panel(ctx, 0, 0, 660, 160, col, a)
        text(ctx, big, 0, -18, big_size, col, a, shadow=0.0)
        ctx.restore()

    # cubes: just over three cubic units (phrase 13)
    ca = 1 - ease(t, T[14], 0.5)
    for k, (x, ds) in enumerate(((360, 1.0), (500, 1.0), (640, 1.0), (745, 0.14159))):
        sc, pa = pop(t, cube_time(k))
        if t >= cube_time(k):
            box3d(ctx, x, 1360, 92 * sc, ds, CYAN if ds == 1.0 else GOLD, pa * ca)

    # infinite surface / finite volume (phrases 17-20)
    ea = 1 - ease(t, T[21], 0.5)
    for i, (x, col, sym) in ((17, (290, PINK, "∞")), (18, (790, CYAN, "π"))):
        if t >= T[i] + 0.1:
            sc, pa = pop(t, T[i] + 0.1)
            ctx.save()
            ctx.translate(x, 1390)
            ctx.scale(sc, sc)
            panel(ctx, 0, 0, 400, 200, col, pa * ea)
            text(ctx, sym, 0, 22, 108, col, pa * ea, shadow=0.0)
            ctx.restore()

    # Torricelli (phrases 21-22)
    if t >= T[21] + 0.2:
        sc, pa = pop(t, T[21] + 0.2)
        a = pa * (1 - ease(t, T[23], 0.5))
        ctx.save()
        ctx.translate(540, 1390)
        ctx.scale(sc, sc)
        panel(ctx, 0, 0, 760, 170, GOLD, a)
        ctx.restore()


def info_state(t):
    """(alpha, scale, colour, big text, small text, big size) of the top panel, or None"""
    out_a = lambda t0, t1: ease(t, t0, 0.25) * (1 - ease(t, t1, 0.3))
    if T[8] + 0.1 <= t < T[10] + 0.3:
        x = marker_x(t)
        sc, pa = pop(t, T[8] + 0.1)
        small = f"at x = {x:.0f}" if t < T[9] + 0.2 else "smaller, never zero"
        return pa * out_a(T[8], T[10]), sc, PINK, f"r = 1/x = {1 / x:.3f}", small, 60
    if slice_time(0) <= t < T[12] + 0.2:
        k = sum(1 for i in range(len(XSL)) if slice_time(i) <= t)
        b = float(XSL[k - 1]) + (0.3 if k <= 20 else 0.0)
        sc, pa = pop(t, slice_time(0))
        return pa * out_a(slice_time(0), T[12]), sc, CYAN, f"V = {volume_upto(b):.3f}", \
            f"slices up to x = {b:.1f}", 64
    if T[12] + 0.2 <= t < T[14] + 0.3:
        sc, pa = pop(t, T[12] + 0.2)
        small = "exactly" if t < T[13] else "≈ 3.14159 cubic units"
        return pa * out_a(T[12], T[14]), sc, CYAN, "V = π", small, 92
    if T[15] + 0.1 <= t < T[17] + 0.3:
        b = counter_b(t)
        sc, pa = pop(t, T[15] + 0.1)
        big = f"A = {area_upto(b):.1f}" if t < T[16] + 0.8 * D(16) else "A → ∞"
        return pa * out_a(T[15], T[17]), sc, PINK, big, f"painted up to x = {b:,.0f}", 64
    return None


# ----------------------------------------------------------------------------------------------
# crisp UI layer (no bloom): title, small labels, captions
# ----------------------------------------------------------------------------------------------
def draw_ui(ctx, t, c):
    # title
    for k, (i, s) in enumerate(TITLES):
        t0 = T[i]
        t1 = T[TITLES[k + 1][0]] if k + 1 < len(TITLES) else 1e9
        if t0 - 0.01 <= t < t1 + 0.35:
            a = (1.0 if i == 0 else ease(t, t0, 0.35)) * (1 - ease(t, t1, 0.35))
            sc, _ = pop(t, t0, 0.4) if i else (1.0, 1.0)
            lines = wrap(ctx, s, 66, 960)
            ctx.save()
            ctx.translate(540, 250)
            ctx.scale(sc, sc)
            for j, ln in enumerate(lines):
                text(ctx, ln, 0, (j - (len(lines) - 1) / 2) * 80, 66, WHITE, a)
            ctx.restore()

    # graph labels
    ga = ease(t, T[4] + 0.2, 0.5) * (1 - ease(t, T[7], 0.3))
    if ga > 0.01:
        for k in range(1, 9):
            x, y = to_screen(c, (k, -0.28, 0))
            text(ctx, str(k), x, y, 30, WHITE, 0.6 * ga, bold=False)
        x, y = to_screen(c, (-0.28, 1.0, 0))
        text(ctx, "1", x, y, 30, WHITE, 0.6 * ga, bold=False)
        x, y = to_screen(c, (8.6, -0.34, 0))
        text(ctx, "x", x, y, 40, WHITE, 0.8 * ga)
        x, y = to_screen(c, (0, 5.75, 0))
        text(ctx, "y", x, y, 40, WHITE, 0.8 * ga)
        if t >= T[5] + 0.1:
            sc, pa = pop(t, T[5] + 0.1)
            ctx.save()
            ctx.translate(740, 640)
            ctx.scale(sc, sc)
            panel(ctx, 0, 0, 330, 120, WHITE, pa * ga)
            text(ctx, "y = 1/x", 0, 0, 62, WHITE, pa * ga, shadow=0.0)
            ctx.restore()
        if t >= T[6] + 0.25:
            sc, pa = pop(t, T[6] + 0.25)
            x, y = to_screen(c, (1.0, 1.0, 0))
            text(ctx, "x = 1", x + 95, y - 45, 40, GOLD, pa * ga)

    # small line under the info panel value
    info = info_state(t)
    if info:
        a, sc, col, _big, small, _ = info
        ctx.save()
        ctx.translate(540, 410)
        ctx.scale(sc, sc)
        text(ctx, small, 0, 48, 32, (0.85, 0.9, 1.0), a, bold=False, shadow=0.0)
        ctx.restore()

    # labels of the infinite / finite panels
    ea = 1 - ease(t, T[21], 0.5)
    for i, x, s in ((17, 290, "SURFACE"), (18, 790, "VOLUME")):
        if t >= T[i] + 0.1:
            sc, pa = pop(t, T[i] + 0.1)
            ctx.save()
            ctx.translate(x, 1390)
            ctx.scale(sc, sc)
            text(ctx, s, 0, -62, 34, WHITE, pa * ea, shadow=0.0)
            ctx.restore()

    # Torricelli
    if t >= T[21] + 0.2:
        sc, pa = pop(t, T[21] + 0.2)
        a = pa * (1 - ease(t, T[23], 0.5))
        ctx.save()
        ctx.translate(540, 1390)
        ctx.scale(sc, sc)
        text(ctx, "Evangelista Torricelli", 0, -26, 52, WHITE, a, shadow=0.0)
        text(ctx, "Italy, 1640s", 0, 40, 36, GOLD, a, bold=False, shadow=0.0)
        ctx.restore()

    # cube label
    if t >= cube_time(3):
        _, pa = pop(t, cube_time(3))
        text(ctx, "3 cubes + 0.14159…", 540, 1478, 34, WHITE, pa * (1 - ease(t, T[14], 0.5)),
             bold=False)

    # caption of the current phrase
    i = max([k for k in range(len(T)) if T[k] - 0.05 <= t] or [0])
    a = ease(t, T[i] - 0.05, 0.15) * (1 - ease(t, END - 0.6, 0.5))
    lines = wrap(ctx, PHRASES[i], 56, 900)
    for j, ln in enumerate(lines):
        text(ctx, ln, 540, 1640 + (j - (len(lines) - 1) / 2) * 70, 56, WHITE, a, shadow=0.9)


# ----------------------------------------------------------------------------------------------
# frame = scene + bloom + UI
# ----------------------------------------------------------------------------------------------
def surface_rgba(surf):
    surf.flush()
    a = np.ndarray((H, surf.get_stride() // 4, 4), np.uint8, surf.get_data())[:, :W]
    rgb = a[..., [2, 1, 0]].astype(np.float32) / 255.0
    al = a[..., 3:4].astype(np.float32) / 255.0
    return rgb, al


def render_frame(t):
    global t_now
    t_now = t
    c = camera(t)

    surf = cairo.ImageSurface(cairo.FORMAT_ARGB32, W, H)
    ctx = cairo.Context(surf)
    ctx.set_line_cap(cairo.LINE_CAP_ROUND)
    ctx.set_line_join(cairo.LINE_JOIN_ROUND)
    draw_scene(ctx, t, c)
    S, A = surface_rgba(surf)

    small = S.reshape(H // 8, 8, W // 8, 8, 3).mean(axis=(1, 3))
    img = Image.fromarray((np.clip(small * 1.6, 0, 1) * 255).astype(np.uint8))
    b1 = np.asarray(img.filter(ImageFilter.GaussianBlur(2.0)).resize((W, H), Image.BILINEAR),
                    np.float32) / 255.0
    b2 = np.asarray(img.filter(ImageFilter.GaussianBlur(8.0)).resize((W, H), Image.BILINEAR),
                    np.float32) / 255.0
    col = background() * (1 - A) + S + 0.75 * b1 + 0.65 * b2
    knee = 0.78
    col = np.where(col < knee, col, knee + (1 - knee) * np.tanh((col - knee) / (1 - knee)))

    us = cairo.ImageSurface(cairo.FORMAT_ARGB32, W, H)
    uctx = cairo.Context(us)
    draw_ui(uctx, t, c)
    U, UA = surface_rgba(us)
    col = U + col * (1 - UA)

    fade = ease(t, 0.0, 0.25) * (1 - ease(t, END - 0.5, 0.5))
    return (np.clip(col * fade, 0, 1) * 255 + 0.5).astype(np.uint8)


# ----------------------------------------------------------------------------------------------
# sound bed (numpy only): soft pad + whooshes + chimes where something visibly lands
# ----------------------------------------------------------------------------------------------
SR = 48000


def make_bed(path):
    n = int((END + 0.5) * SR)
    L, R = np.zeros(n), np.zeros(n)
    tt = np.arange(n) / SR
    chords = {"Am": [110.0, 164.81, 220.0, 261.63, 329.63], "F": [87.31, 130.81, 174.61, 220.0, 261.63],
              "C": [130.81, 196.0, 261.63, 329.63, 392.0], "G": [98.0, 146.83, 196.0, 246.94, 293.66]}
    secs = [(0.0, "Am"), (T[4], "F"), (T[10], "C"), (T[14], "G"), (T[17], "Am"), (T[21], "F"),
            (T[23], "Am")]
    for k, (t0, ch) in enumerate(secs):
        t1 = secs[k + 1][0] if k + 1 < len(secs) else END + 1.0
        a, b = max(0.0, t0 - 0.8), min(n / SR, t1 + 0.8)
        i0, i1 = int(a * SR), int(b * SR)
        ts = tt[i0:i1]
        env = np.clip((ts - a) / 1.2, 0, 1) if k else np.clip(ts / 2.0, 0, 1)
        env = env * np.clip((b - ts) / 1.2, 0, 1)
        for j, f in enumerate(chords[ch]):
            lfo = 0.75 + 0.25 * np.sin(TAU * (0.07 + 0.03 * j) * ts + j)
            amp = 0.020 / (1 + 0.3 * j)
            L[i0:i1] += amp * env * lfo * np.sin(TAU * f * 1.0006 * ts + j)
            R[i0:i1] += amp * env * lfo * np.sin(TAU * f * 0.9994 * ts + 2 * j)

    rng = np.random.default_rng(3)

    def add(t0, sig, pan=0.0):
        i0 = int(t0 * SR)
        if i0 >= n:
            return
        sig = sig[: n - i0]
        L[i0:i0 + len(sig)] += sig * math.sqrt(0.5 * (1 - pan))
        R[i0:i0 + len(sig)] += sig * math.sqrt(0.5 * (1 + pan))

    def noise_band(m, f0, bw):
        spec = np.fft.rfft(rng.standard_normal(m))
        fr = np.fft.rfftfreq(m, 1 / SR)
        spec *= np.exp(-((fr - f0) / bw) ** 2)
        x = np.fft.irfft(spec, m)
        return x / (np.abs(x).max() + 1e-9)

    def whoosh(t0, d, amp=0.06):
        m = int(d * SR)
        u = np.linspace(0, 1, m)
        add(t0, amp * np.sin(np.pi * u) ** 2 * noise_band(m, 900, 1300))

    def pour(t0, d, amp=0.035):
        m = int(d * SR)
        u = np.linspace(0, 1, m)
        add(t0, amp * np.clip(u * 4, 0, 1) * (1 - u) ** 0.5 * noise_band(m, 350, 350))

    def chime(t0, f, amp=0.08, pan=0.0):
        m = int(2.6 * SR)
        ts = np.arange(m) / SR
        sig = sum(w * np.sin(TAU * f * p * ts) * np.exp(-ts * 2.6 * (1 + k))
                  for k, (p, w) in enumerate(((1, 1.0), (2, 0.35), (3, 0.12), (4.2, 0.05))))
        add(t0, amp * np.clip(ts / 0.004, 0, 1) * sig, pan)

    def pluck(t0, f, amp=0.05, pan=0.0):
        m = int(0.5 * SR)
        ts = np.arange(m) / SR
        sig = (np.sin(TAU * f * ts) + 0.3 * np.sin(TAU * 2 * f * ts)) * np.exp(-ts * 12)
        add(t0, amp * np.clip(ts / 0.003, 0, 1) * sig, pan)

    PENTA = [440.0, 523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51, 1567.98]
    pour(T[2] + 0.1, 0.9 * D(2))                        # paint pours in
    chime(T[3] + 0.0, 880.0, 0.10)                      # title pops
    whoosh(T[4] - 0.1, 1.0)                             # flat graph
    chime(T[5] + 0.1, 1046.5, 0.07, -0.2)               # y = 1/x chip
    chime(T[6] + 0.25, 1318.51, 0.07, -0.5)             # dot at x = 1
    s0, sd = sweep_window()
    whoosh(s0, sd, 0.07)                                # spin
    chime(s0 + sd, 659.25, 0.09)                        # surface closes
    whoosh(T[9] + 0.05, 0.9 * D(9), 0.06)               # zoom in
    whoosh(T[10] - 0.05, 1.0, 0.05)                     # zoom out
    for i in range(0, len(XSL), 3):                     # slices land
        pluck(slice_time(i), PENTA[min(i // 3, len(PENTA) - 1)], 0.045, 0.6 * math.sin(i))
    chime(T[12] + 0.2, 880.0, 0.11)                     # V = pi
    chime(T[12] + 0.2, 1318.51, 0.05)
    for k, f in enumerate((523.25, 659.25, 783.99, 1046.5)):   # cubes land
        pluck(cube_time(k), f, 0.06 if k < 3 else 0.04)
    chime(T[15] + 0.1, 587.33, 0.05)                    # area counter appears
    chime(T[17] + 0.1, 1174.66, 0.09, -0.4)             # infinity
    chime(T[18] + 0.1, 880.0, 0.09, 0.4)                # pi
    pour(T[19] + 0.1, 0.9 * D(19))
    chime(T[19] + 0.1 + 0.9 * D(19), 1046.5, 0.06)      # horn is full
    chime(T[21] + 0.2, 659.25, 0.07)                    # Torricelli card
    chime(T[23], 880.0, 0.08)                           # final question

    fade = np.clip((END - tt) / 1.0, 0, 1)
    st = np.stack([L * fade, R * fade], -1)
    st = np.clip(st, -1, 1)
    with wavfile.open(path, "wb") as wv:
        wv.setnchannels(2)
        wv.setsampwidth(2)
        wv.setframerate(SR)
        wv.writeframes((st * 32767).astype(np.int16).tobytes())


# ----------------------------------------------------------------------------------------------
# render
# ----------------------------------------------------------------------------------------------
def render_part(args):
    k, f0, f1, tl = args
    set_timeline(*tl)
    path = os.path.join(OUT, f"_part{k}.mp4")
    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
           "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "medium",
           "-crf", "19", "-pix_fmt", "yuv420p", path]
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for f in range(f0, f1):
        p.stdin.write(render_frame(f / FPS).tobytes())
        if (f - f0) % 300 == 0:
            print(f"  part {k}: {f - f0}/{f1 - f0} frames", flush=True)
    p.stdin.close()
    p.wait()
    return path


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    voice = sys.argv[1]
    os.makedirs(OUT, exist_ok=True)
    chunks = fit_chunks(speech_chunks(voice), len(PHRASES))
    t_, te_ = [a for a, _ in chunks], [b for _, b in chunks]
    end_ = audio_duration(voice) + 1.2
    set_timeline(t_, te_, end_)
    for i, (a, b) in enumerate(chunks):
        print(f"  {i + 1:2d}  {a:6.2f} - {b:6.2f}  {PHRASES[i]}")

    if len(sys.argv) > 2 and sys.argv[2] == "stills":
        for s in sys.argv[3:]:
            sec = float(s)
            fn = os.path.join(OUT, f"still_{sec:05.1f}.png")
            Image.fromarray(render_frame(sec)).save(fn)
            print("  wrote", fn)
        return

    nf = int(END * FPS)
    cuts = [round(nf * k / 4) for k in range(5)]
    jobs = [(k, cuts[k], cuts[k + 1], (t_, te_, end_)) for k in range(4)]
    print(f"rendering {nf} frames ({END:.1f} s) in 4 processes ...")
    with Pool(4) as pool:
        parts = pool.map(render_part, jobs)
    lst = os.path.join(OUT, "_parts.txt")
    with open(lst, "w") as fh:
        for p in parts:
            fh.write("file '" + os.path.abspath(p).replace("\\", "/") + "'\n")   # Windows-safe
    silent = os.path.join(OUT, "_video.mp4")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", lst,
                    "-c", "copy", silent], check=True)
    bed = os.path.join(OUT, "_bed.wav")
    make_bed(bed)
    final = os.path.join(OUT, f"{NAME}.mp4")
    fc = ("[1:a]aresample=48000,aformat=channel_layouts=stereo[v];"
          "[v][2:a]amix=inputs=2:duration=longest:normalize=0,"
          "loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[a]")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", silent, "-i", voice, "-i", bed,
                    "-filter_complex", fc, "-map", "0:v", "-map", "[a]", "-c:v", "copy",
                    "-c:a", "aac", "-b:a", "192k", "-t", f"{END:.3f}", "-movflags", "+faststart",
                    final], check=True)
    for p in parts + [lst, silent, bed]:
        os.remove(p)
    print("done ->", final)


if __name__ == "__main__":
    main()
