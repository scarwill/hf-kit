"""Infinity = circle? (unknot) - YouTube Short, 1080x1920 @ 60 fps, synced to the voice.

    python infinity_unknot.py voice.m4a                 -> out/infinity_unknot.mp4
    python infinity_unknot.py voice.m4a stills 3 20 30  -> out/still_3.png ...
Needs: pip install numpy pillow pycairo  + ffmpeg on PATH.
"""
import math, os, re, subprocess, sys, wave
from multiprocessing import Pool

import cairo
import numpy as np
from PIL import Image, ImageFilter

W, H, FPS = 1080, 1920, 60
OUT = "out"
NAME = "infinity_unknot"

PHRASES = [
    "This is the symbol for infinity.",
    "But is it secretly just a circle?",
    "Mathematicians call this curve a lemniscate.",
    "John Wallis first used it for infinity,",
    "back in sixteen fifty five.",
    "In flat space, it has a problem.",
    "The curve crosses itself,",
    "right here in the middle.",
    "But watch what happens in three D.",
    "Lift one half of the loop,",
    "just a little.",
    "Now the crossing is gone.",
    "One strand passes over the other.",
    "And because nothing is tied,",
    "we can slowly untwist it,",
    "and pull it open,",
    "into a perfect circle.",
    "In knot theory,",
    "this is called the unknot.",
    "The simplest knot of all.",
    "So infinity, in three D,",
    "is just a circle in disguise.",
    "Can you think of a shape that can never be untied?",
]

CYAN = np.array([0.15, 0.85, 1.00])
MAGENTA = np.array([1.00, 0.22, 0.80])
VIOLET = np.array([0.62, 0.45, 1.00])
GOLD = np.array([1.00, 0.76, 0.25])
RED = (1.00, 0.28, 0.30)
YELLOW = (1.00, 0.86, 0.30)
WHITE = (1, 1, 1)


# ---------------------------------------------------------------- sync
def speech_chunks(path, noise=-35, dur=0.25):
    log = subprocess.run(
        ["ffmpeg", "-hide_banner", "-i", path, "-af",
         f"silencedetect=n={noise}dB:d={dur}", "-f", "null", "-"],
        capture_output=True, text=True).stderr
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
    # a voice can breathe inside a phrase, so try a few gap lengths
    for d in (0.25, 0.3, 0.35, 0.4, 0.2):
        chunks, total = speech_chunks(path, -35, d)
        if len(chunks) == len(PHRASES):
            return chunks, total
    chunks, total = speech_chunks(path, -35, 0.3)
    raise SystemExit(f"Found {len(chunks)} speech chunks but script has {len(PHRASES)} phrases. "
                     "Send me both numbers and I will adjust.")


# ---------------------------------------------------------------- helpers
def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def ease(x):
    x = clamp(x)
    return x * x * x * (x * (6 * x - 15) + 10)


def ramp(t, a, b):
    return ease((t - a) / max(1e-6, b - a))


def pop(t, a, d=0.45):
    """0 -> overshoot -> 1, for things that land."""
    x = clamp((t - a) / d)
    return 1 + 2.2 * (x - 1) ** 3 + 1.2 * (x - 1) ** 2 if x < 1 else 1.0


def rot(pitch, yaw, roll):
    cx, sx = math.cos(pitch), math.sin(pitch)
    cy, sy = math.cos(yaw), math.sin(yaw)
    cz, sz = math.cos(roll), math.sin(roll)
    Rx = np.array([[1, 0, 0], [0, cx, -sx], [0, sx, cx]])
    Ry = np.array([[cy, 0, sy], [0, 1, 0], [-sy, 0, cy]])
    Rz = np.array([[cz, -sz, 0], [sz, cz, 0], [0, 0, 1]])
    return Rz @ Rx @ Ry


CAM = 5.5          # camera distance; camera looks along +z, so smaller z = nearer
LIGHT = np.array([-0.45, 0.65, -0.62]); LIGHT /= np.linalg.norm(LIGHT)
HALF = LIGHT + np.array([0, 0, -1.0]); HALF /= np.linalg.norm(HALF)


def project(Q, cx, cy, scale):
    k = CAM / (CAM + Q[..., 2])
    return cx + Q[..., 0] * scale * k, cy - Q[..., 1] * scale * k, k


# ---------------------------------------------------------------- geometry
# World: the curve lives in the x-y plane; "up" (towards the first camera) is -z.
NP, NR = 300, 18
TT = np.linspace(0, 2 * np.pi, NP, endpoint=False)


def lemniscate(lift, u):
    """Gerono lemniscate (cos t, 1/2 sin 2t), lifted by z = -h sin t, then bent into the
    circle (cos t, 0, -sin t). For lift > 0 the curve never touches itself: a real isotopy."""
    h = 0.42 * lift
    x = np.cos(TT)
    y = (1 - u) * 0.5 * np.sin(2 * TT)
    z = -(h + (1 - h) * u) * np.sin(TT)
    return np.stack([x, y, z], 1)


def trefoil_curve():
    t = np.linspace(0, 2 * np.pi, NP, endpoint=False)
    x = np.sin(t) + 2 * np.sin(2 * t)
    y = np.cos(t) - 2 * np.cos(2 * t)
    z = -np.sin(3 * t)
    return np.stack([x, y, z], 1) / 3.0


TREFOIL = trefoil_curve()


def frames_along(P):
    """Parallel-transport frame along a closed curve (no sudden flips like a fixed up-vector)."""
    n = len(P)
    T = np.roll(P, -1, 0) - np.roll(P, 1, 0)
    T /= np.linalg.norm(T, axis=1, keepdims=True) + 1e-9
    N = np.zeros_like(P)
    ref = np.array([0.0, 0.0, 1.0]) if abs(T[0, 2]) < 0.9 else np.array([1.0, 0.0, 0.0])
    N[0] = np.cross(np.cross(T[0], ref), T[0])
    N[0] /= np.linalg.norm(N[0])
    for i in range(1, n):
        v = N[i - 1] - T[i] * np.dot(N[i - 1], T[i])
        N[i] = v / (np.linalg.norm(v) + 1e-9)
    B = np.cross(T, N)
    return N, B


RING = np.linspace(0, 2 * np.pi, NR, endpoint=False)


def tube_mesh(P, radius):
    N, B = frames_along(P)
    c, s = np.cos(RING)[None, :, None], np.sin(RING)[None, :, None]
    nrm = c * N[:, None, :] + s * B[:, None, :]          # (NP, NR, 3)
    return P[:, None, :] + radius * nrm, nrm


def draw_tube(ctx, P, R, cx, cy, scale, radius, base, alpha=1.0, flow=None):
    """Shaded glossy tube: back-face culled quads, painted far to near."""
    if alpha <= 0.01:
        return
    V, Nn = tube_mesh(P, radius)
    Vc = V @ R.T
    Nc = Nn @ R.T
    sx, sy, _ = project(Vc, cx, cy, scale)
    i0 = np.arange(len(P)); i1 = (i0 + 1) % len(P)
    j0 = np.arange(NR); j1 = (j0 + 1) % NR
    I0, J0 = np.meshgrid(i0, j0, indexing="ij")
    I1, J1 = np.meshgrid(i1, j1, indexing="ij")
    n = (Nc[I0, J0] + Nc[I1, J1]) / 2
    n /= np.linalg.norm(n, axis=-1, keepdims=True)
    centre = (Vc[I0, J0] + Vc[I1, J1]) / 2
    view = centre + np.array([0, 0, CAM]); view /= np.linalg.norm(view, axis=-1, keepdims=True)
    facing = (n * view).sum(-1) < 0.05
    depth = centre[..., 2]

    diff = np.clip((n * LIGHT).sum(-1), 0, 1)
    spec = np.clip((n * HALF).sum(-1), 0, 1) ** 48
    rim = (1 - np.abs((n * view).sum(-1))) ** 2.2
    col = base[:, None, :] * (0.18 + 0.75 * diff[..., None]) + base[:, None, :] * 1.1 * rim[..., None]
    if flow is not None:                               # a light pulse running along the loop
        col = col * (1 + 1.4 * flow[:, None, None])
    col = col + 1.2 * spec[..., None]
    col = np.clip(col, 0, 1)

    sel = np.nonzero(facing)
    order = np.argsort(-depth[sel])
    a, b = sel[0][order], sel[1][order]
    ia, ib, ja, jb = I0[a, b], I1[a, b], J0[a, b], J1[a, b]
    qx = np.stack([sx[ia, ja], sx[ib, ja], sx[ib, jb], sx[ia, jb]], 1)
    qy = np.stack([sy[ia, ja], sy[ib, ja], sy[ib, jb], sy[ia, jb]], 1)
    cc = col[a, b]
    ctx.set_line_width(1.2)
    ctx.set_line_join(cairo.LINE_JOIN_ROUND)
    for q in range(len(a)):
        X, Y = qx[q], qy[q]
        ctx.move_to(X[0], Y[0]); ctx.line_to(X[1], Y[1]); ctx.line_to(X[2], Y[2]); ctx.line_to(X[3], Y[3])
        ctx.close_path()
        ctx.set_source_rgba(cc[q, 0], cc[q, 1], cc[q, 2], alpha)
        ctx.fill_preserve(); ctx.stroke()           # stroke hides hairline seams


def draw_shadow(ctx, P, R, cx, cy, scale, floor_z, alpha):
    """The curve's shadow on the floor = its knot diagram (crossings stay visible there)."""
    if alpha <= 0.01:
        return
    S = P.copy(); S[:, 2] = floor_z
    sx, sy, k = project(S @ R.T, cx, cy, scale)
    for w, a in ((34, 0.10), (18, 0.18), (8, 0.30)):
        ctx.set_line_width(w)
        ctx.set_source_rgba(0.0, 0.0, 0.0, a * alpha)
        ctx.move_to(sx[0], sy[0])
        for i in range(1, len(S)):
            ctx.line_to(sx[i], sy[i])
        ctx.close_path(); ctx.stroke()


def draw_floor(ctx, R, cx, cy, scale, floor_z, alpha, t):
    if alpha <= 0.01:
        return
    ctx.set_line_width(2)
    for g in np.linspace(-3, 3, 13):
        for horiz in (0, 1):
            pts = np.linspace(-3, 3, 40)
            P = np.stack([pts, np.full_like(pts, g), np.full_like(pts, floor_z)], 1) if horiz else \
                np.stack([np.full_like(pts, g), pts, np.full_like(pts, floor_z)], 1)
            sx, sy, _ = project(P @ R.T, cx, cy, scale)
            fade = np.clip(1 - np.hypot(P[:, 0], P[:, 1]) / 3.2, 0, 1) ** 1.5
            for i in range(len(pts) - 1):
                a = alpha * 0.22 * fade[i]
                if a < 0.01:
                    continue
                ctx.set_source_rgba(0.35, 0.45, 1.0, a)
                ctx.move_to(sx[i], sy[i]); ctx.line_to(sx[i + 1], sy[i + 1]); ctx.stroke()


def curve_colors(u):
    """Cyan on the left lobe, magenta on the right, blended smoothly, violet once it is a circle."""
    w = (1 + np.tanh(4 * np.cos(TT))) / 2           # 0 left, 1 right
    c = CYAN[None] * (1 - w[:, None]) + MAGENTA[None] * w[:, None]
    return c * (1 - 0.5 * u) + VIOLET[None] * 0.5 * u


# ---------------------------------------------------------------- background
def make_background():
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    top, bot = np.array([0.045, 0.035, 0.13]), np.array([0.008, 0.01, 0.035])
    g = (yy / H)[..., None]
    img = top * (1 - g) + bot * g
    halo = np.exp(-(((xx - 540) / 620) ** 2 + ((yy - 900) / 620) ** 2))[..., None]
    img = img + halo * np.array([0.05, 0.03, 0.12])
    vig = np.clip(1 - 0.55 * (((xx - 540) / 760) ** 2 + ((yy - 960) / 1250) ** 2), 0, 1)[..., None]
    return np.clip(img * vig, 0, 1).astype(np.float32)


rng0 = np.random.default_rng(3)
DUST = np.stack([rng0.uniform(0, W, 160), rng0.uniform(0, H, 160),
                 rng0.uniform(0.3, 1.0, 160), rng0.uniform(0, 6.28, 160)], 1)


def draw_dust(ctx, t):
    for x, y, z, ph in DUST:
        yy = (y - t * 14 * z) % H
        xx = x + 8 * math.sin(0.3 * t + ph)
        a = 0.25 + 0.35 * (0.5 + 0.5 * math.sin(1.7 * t + ph))
        ctx.set_source_rgba(0.7, 0.8, 1.0, a * z * 0.6)
        ctx.arc(xx, yy, 1.2 + 1.6 * z, 0, 2 * math.pi); ctx.fill()


BG = None


# ---------------------------------------------------------------- text
def font(ctx, size, bold=True):
    ctx.select_font_face("Inter", cairo.FONT_SLANT_NORMAL,
                         cairo.FONT_WEIGHT_BOLD if bold else cairo.FONT_WEIGHT_NORMAL)
    ctx.set_font_size(size)


def text_center(ctx, s, x, y, size, color=WHITE, alpha=1.0, bold=True, spacing=0):
    if alpha <= 0.01:
        return
    font(ctx, size, bold)
    widths = [ctx.text_extents(ch).x_advance + spacing for ch in s] if spacing else None
    total = sum(widths) - spacing if spacing else ctx.text_extents(s).x_advance
    for dx, dy, col, a in ((0, 5, (0, 0, 0), 0.75 * alpha), (0, 0, color, alpha)):
        ctx.set_source_rgba(*col, a)
        px = x - total / 2 + dx
        if spacing:
            for ch, w in zip(s, widths):
                ctx.move_to(px, y + dy); ctx.show_text(ch); px += w
        else:
            ctx.move_to(px, y + dy); ctx.show_text(s)


def panel(ctx, x0, y0, w, h, r, fill, stroke, alpha):
    ctx.new_sub_path()
    ctx.arc(x0 + w - r, y0 + r, r, -math.pi / 2, 0)
    ctx.arc(x0 + w - r, y0 + h - r, r, 0, math.pi / 2)
    ctx.arc(x0 + r, y0 + h - r, r, math.pi / 2, math.pi)
    ctx.arc(x0 + r, y0 + r, r, math.pi, 1.5 * math.pi)
    ctx.close_path()
    ctx.set_source_rgba(*fill, alpha); ctx.fill_preserve()
    ctx.set_source_rgba(*stroke, alpha); ctx.set_line_width(3); ctx.stroke()


def chip(ctx, s, x, y, color, t, t_in, t_out):
    a = ramp(t, t_in, t_in + 0.35) * (1 - ramp(t, t_out, t_out + 0.35))
    if a <= 0.01:
        return
    sc = 0.6 + 0.4 * pop(t, t_in)
    font(ctx, 42)
    e = ctx.text_extents(s)
    w, h = e.x_advance + 70, 84
    ctx.save()
    ctx.translate(x, y); ctx.scale(sc, sc)
    panel(ctx, -w / 2, -h / 2, w, h, 26, (0.05, 0.06, 0.16), tuple(color), 0.9 * a)
    ctx.set_source_rgba(1, 1, 1, a)
    ctx.move_to(-e.x_advance / 2, 15); ctx.show_text(s)
    ctx.restore()


def caption(ctx, t, i, chunk):
    """Karaoke caption: words light up across the phrase's real speech time."""
    words = PHRASES[i].split()
    s0, s1 = chunk
    lens = np.array([len(w) + 2 for w in words], float)
    starts = s0 + (s1 - s0) * np.concatenate([[0], np.cumsum(lens)[:-1]]) / lens.sum()
    font(ctx, 62)
    space = ctx.text_extents(" ").x_advance + 6
    lines, cur, cw = [], [], 0
    for k, w in enumerate(words):
        ww = ctx.text_extents(w).x_advance
        if cur and cw + ww > 900:
            lines.append((cur, cw - space)); cur, cw = [], 0
        cur.append((k, w, ww)); cw += ww + space
    lines.append((cur, cw - space))
    a = ramp(t, s0 - 0.05, s0 + 0.12)
    y = 1660 - 40 * (len(lines) - 1)
    for line, lw in lines:
        x = 540 - lw / 2
        for k, w, ww in line:
            on = t >= starts[k]
            sc = 0.8 + 0.2 * pop(t, starts[k], 0.25) if on else 1.0
            col = YELLOW if on and (k == len(words) - 1 or t < starts[k + 1]) else WHITE
            ctx.save()
            ctx.translate(x + ww / 2, y); ctx.scale(sc, sc)
            ctx.set_source_rgba(0, 0, 0, 0.8 * a); ctx.move_to(-ww / 2 + 3, 6); ctx.show_text(w)
            ctx.set_source_rgba(*col, a * (1.0 if on else 0.55)); ctx.move_to(-ww / 2, 0); ctx.show_text(w)
            ctx.restore()
            x += ww + space
        y += 82


# ---------------------------------------------------------------- frame
def render_frame(t, T, chunks):
    surf = cairo.ImageSurface(cairo.FORMAT_ARGB32, W, H)
    ctx = cairo.Context(surf)
    cur = max([i for i in range(len(T)) if T[i] <= t] or [0])

    # ---- state; every change starts at a phrase start T[i]
    appear = ramp(t, T[0], T[0] + 1.0)
    lift = ramp(t, T[9] + 0.2, T[10] + 0.9)
    u = clamp(ramp(t, T[14], T[16] + 0.9) * (1 - ramp(t, T[20], T[20] + 1.5))
              + ramp(t, T[21] + 0.2, T[21] + 1.5))
    tilt = ramp(t, T[8], T[8] + 1.6)
    face = clamp(ramp(t, T[14], T[16] + 0.9) - ramp(t, T[20], T[20] + 1.5) * (1 - ramp(t, T[21] + 0.2, T[21] + 1.5)))
    split = ramp(t, T[22], T[22] + 1.0)

    # camera: top view (flat) -> oblique 3D view -> face-on to the circle (circle lies in x-z)
    breathe = 0.04 * math.sin(0.9 * t) * (1 - tilt)
    pitch = breathe + tilt * 1.0 * (1 - face) + face * (math.pi / 2 - 0.12)
    yaw = (0.42 * math.sin(0.45 * (t - T[8]))) * tilt * (1 - face) + 0.15 * math.sin(0.5 * t) * face
    roll = 0.0
    R = rot(pitch, yaw, roll)

    cx = 540 - 250 * split
    cy = 930 + 40 * tilt * (1 - face)
    scale = 370 * (1 - 0.42 * split) * (0.92 + 0.08 * appear)
    zoom = ramp(t, T[7], T[7] + 0.7) * (1 - ramp(t, T[8], T[8] + 1.0))
    scale *= 1 + 0.25 * zoom

    P = lemniscate(lift, u)
    floor_z = 0.95
    draw_floor(ctx, R, cx, cy, scale, floor_z, tilt * (1 - 0.7 * face) * (1 - split), t)
    draw_dust(ctx, t)
    draw_shadow(ctx, P, R, cx, cy, scale, floor_z, tilt * (1 - face) * (1 - split))

    # ghost circle: "secretly a circle?" and "a circle in disguise"
    ghost = ramp(t, T[1], T[1] + 0.5) * (1 - ramp(t, T[2], T[2] + 0.5)) \
        + ramp(t, T[21], T[21] + 0.5) * (1 - ramp(t, T[22], T[22] + 0.5)) * (1 - u)
    if ghost > 0.01:
        ctx.set_dash([20, 16]); ctx.set_line_width(4)
        ctx.set_source_rgba(1, 1, 1, 0.4 * ghost)
        ctx.arc(cx, cy, scale * 1.02, 0, 2 * math.pi); ctx.stroke()
        ctx.set_dash([])

    flow = np.exp(-((np.angle(np.exp(1j * (TT - 1.6 * t)))) / 0.18) ** 2)
    draw_tube(ctx, P, R, cx, cy, scale, 0.085, curve_colors(u), appear, flow)

    # crossing marker (2D only): pulses while it crosses, bursts away when the crossing is gone
    cross = ramp(t, T[6], T[6] + 0.3) * (1 - ramp(t, T[11], T[11] + 0.5))
    if cross > 0.01:
        c = np.array([[0.0, 0.0, -0.42 * lift / 2]]) @ R.T
        px, py, _ = project(c, cx, cy, scale)
        pl = 0.5 + 0.5 * math.sin(7 * (t - T[6]))
        for rr, aa in ((70 + 18 * pl, 0.7), (100 + 30 * pl, 0.3)):
            ctx.set_source_rgba(*RED, cross * aa)
            ctx.set_line_width(6)
            ctx.arc(px[0], py[0], rr, 0, 2 * math.pi); ctx.stroke()
    burst = ramp(t, T[11], T[11] + 0.9)
    if 0 < burst < 1:
        c = np.array([[0.0, 0.0, -0.21]]) @ R.T
        px, py, _ = project(c, cx, cy, scale)
        ctx.set_source_rgba(1, 1, 1, 0.8 * (1 - burst)); ctx.set_line_width(5)
        ctx.arc(px[0], py[0], 60 + 260 * burst, 0, 2 * math.pi); ctx.stroke()

    if split > 0.01:
        Rt = rot(0.35 + 0.25 * math.sin(0.7 * t), 0.7 * t, 0)
        cols = np.repeat(GOLD[None], NP, 0)
        draw_tube(ctx, TREFOIL, Rt, 790, 930, 220 * split, 0.09, cols, split,
                  np.exp(-((np.angle(np.exp(1j * (TT - 1.6 * t)))) / 0.2) ** 2))
        text_center(ctx, "UNKNOT", 295, 1270, 46, (0.6, 0.85, 1.0), split, spacing=4)
        text_center(ctx, "TREFOIL", 790, 1270, 46, tuple(GOLD), split, spacing=4)
        text_center(ctx, "0 crossings", 295, 1325, 34, WHITE, 0.75 * split, bold=False)
        text_center(ctx, "3 crossings", 790, 1325, 34, WHITE, 0.75 * split, bold=False)

    # ---- chips (object sits at y ~ 600-1250, chips at 470 or 1360)
    chip(ctx, "x = cos t      y = ½ sin 2t", 540, 470, CYAN, t, T[2], T[5])
    chip(ctx, "John Wallis  ·  1655", 540, 1370, GOLD, t, T[3], T[5])
    chip(ctx, "1 crossing", 540, 1370, np.array(RED), t, T[6], T[9])
    chip(ctx, "lift:  z = h · sin t", 540, 1370, MAGENTA, t, T[9], T[11])
    chip(ctx, "0 crossings", 540, 1370, CYAN, t, T[11] + 0.3, T[13])
    chip(ctx, "no cuts, only bending", 540, 1370, VIOLET, t, T[13], T[17])
    chip(ctx, "unknot  =  0 crossings", 540, 1370, GOLD, t, T[18], T[20])

    # ---- title
    if t < T[17]:
        title, col = "INFINITY = CIRCLE?", WHITE
    elif t < T[20]:
        title, col = "THE UNKNOT", tuple(GOLD)
    elif t < T[22]:
        title, col = "INFINITY = CIRCLE", (0.6, 0.85, 1.0)
    else:
        title, col = "CAN IT BE UNTIED?", WHITE
    switch = max([T[i] for i in (0, 17, 20, 22) if T[i] <= t] or [0])
    ctx.save()
    ctx.translate(540, 255); sc = 0.7 + 0.3 * pop(t, switch); ctx.scale(sc, sc)
    text_center(ctx, title, 0, 0, 80, col, ramp(t, switch, switch + 0.25), spacing=2)
    ctx.restore()
    sub = "flat  ·  2D" if 5 <= cur <= 7 else "three dimensions" if 8 <= cur <= 13 else \
        "knot theory" if 17 <= cur <= 19 else None
    if sub:
        text_center(ctx, sub.upper(), 540, 335, 34, (0.55, 0.8, 1.0), 0.8, bold=False, spacing=6)

    caption(ctx, t, cur, chunks[cur])

    # ---- composite: background + layer + two-scale bloom + tonemap
    buf = np.ndarray((H, W, 4), np.uint8, surf.get_data()).astype(np.float32) / 255.0
    rgb, al = buf[..., 2::-1], buf[..., 3:4]           # BGRA premultiplied -> RGB
    bright = Image.fromarray((np.clip(rgb * 1.2 - 0.12, 0, 1) * 255).astype(np.uint8))
    small = bright.resize((W // 4, H // 4), Image.BILINEAR)
    g1 = np.asarray(small.filter(ImageFilter.GaussianBlur(5)).resize((W, H), Image.BILINEAR), np.float32)
    g2 = np.asarray(small.resize((W // 16, H // 16), Image.BILINEAR).filter(ImageFilter.GaussianBlur(5))
                    .resize((W, H), Image.BILINEAR), np.float32)
    img = BG * (1 - al) + rgb + (0.8 * g1 + 1.0 * g2) / 255.0
    img = 1.15 * img / (1 + 0.15 * img)
    return (np.clip(img, 0, 1) * 255).astype(np.uint8)


# ---------------------------------------------------------------- sound bed
def make_sound(T, total, path):
    sr = 44100
    n = int(total * sr) + sr
    t = np.arange(n) / sr
    out = np.zeros(n)
    for f, a in ((55, 0.05), (110, 0.04), (164.8, 0.03), (246.9, 0.015), (329.6, 0.01)):
        out += a * np.sin(2 * np.pi * f * t + 0.5 * np.sin(0.21 * t + f)) * (0.7 + 0.3 * np.sin(0.11 * t + f))
    out *= np.clip(t / 2, 0, 1) * np.clip((total + 0.5 - t) / 2, 0, 1)
    rng = np.random.default_rng(1)

    def add(i, s):
        m = min(len(s), n - i)
        out[i:i + m] += s[:m]

    def whoosh(at, dur=1.4, amp=0.10):
        m = int(dur * sr)
        noise = np.convolve(rng.standard_normal(m), np.ones(30) / 30, "same")
        add(int(at * sr), amp * 6 * noise * np.sin(np.linspace(0, np.pi, m)) ** 2)

    def chime(at, f=880, amp=0.14):
        m = int(2.5 * sr); tt = np.arange(m) / sr
        add(int(at * sr), amp * (np.sin(2 * np.pi * f * tt) + 0.35 * np.sin(2 * np.pi * 2.01 * f * tt))
            * np.exp(-tt * 2.4))

    chime(T[6] + 0.1, 660, 0.09)       # crossing marker lights up
    whoosh(T[8])                        # tilt into 3D
    whoosh(T[9] + 0.2, 1.6, 0.07)       # lift
    chime(T[11] + 0.05, 990, 0.09)      # crossing bursts away
    whoosh(T[14], 2.6, 0.06)            # untwist
    chime(T[16] + 0.9, 880)             # circle closes
    chime(T[16] + 1.05, 1318.5, 0.08)
    whoosh(T[20], 1.5, 0.06)
    chime(T[22] + 1.0, 587, 0.10)       # trefoil lands

    out = np.clip(out, -1, 1)
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((out * 32767).astype(np.int16).tobytes())


# ---------------------------------------------------------------- render
def init_worker():
    global BG
    BG = make_background()


def render_part(args):
    k, f0, f1, T, chunks = args
    path = os.path.join(OUT, f"part{k}.mp4")
    p = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
                          "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-c:v", "libx264",
                          "-crf", "19", "-preset", "medium", "-pix_fmt", "yuv420p", path],
                         stdin=subprocess.PIPE)
    for f in range(f0, f1):
        p.stdin.write(render_frame(f / FPS, T, chunks).tobytes())
        if k == 0 and f % 120 == 0:
            print(f"  part0: {f - f0}/{f1 - f0}", flush=True)
    p.stdin.close(); p.wait()
    return path


def main():
    global BG
    if len(sys.argv) < 2:
        raise SystemExit("usage: python infinity_unknot.py voice.m4a [stills 3 10 20]")
    voice = sys.argv[1]
    os.makedirs(OUT, exist_ok=True)
    chunks, total = find_sync(voice)
    T = [c[0] for c in chunks]
    print(f"{len(chunks)} phrases synced, {total:.1f} s")

    if len(sys.argv) > 2 and sys.argv[2] == "stills":
        BG = make_background()
        for s in sys.argv[3:]:
            img = render_frame(float(s), T, chunks)
            Image.fromarray(img).save(os.path.join(OUT, f"still_{s}.png"))
            print("saved", os.path.join(OUT, f"still_{s}.png"))
        return

    end = total + 1.0
    nf = int(end * FPS)
    parts = 4
    jobs = [(k, nf * k // parts, nf * (k + 1) // parts, T, chunks) for k in range(parts)]
    with Pool(parts, initializer=init_worker) as pool:
        files = pool.map(render_part, jobs)
    lst = os.path.join(OUT, "parts.txt")
    with open(lst, "w") as f:
        for p in files:
            f.write(f"file '{os.path.abspath(p)}'\n")
    silent = os.path.join(OUT, "silent.mp4")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0",
                    "-i", lst, "-c", "copy", silent], check=True)
    bed = os.path.join(OUT, "bed.wav")
    make_sound(T, end, bed)
    final = os.path.join(OUT, f"{NAME}.mp4")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", silent, "-i", voice, "-i", bed,
                    "-filter_complex",
                    "[2:a]volume=0.5[b];[1:a][b]amix=inputs=2:duration=first:normalize=0,"
                    "loudnorm=I=-14:TP=-1.5[a]",
                    "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
                    "-shortest", final], check=True)
    for p in files + [lst, silent, bed]:
        os.remove(p)
    print("done ->", final)


if __name__ == "__main__":
    main()
