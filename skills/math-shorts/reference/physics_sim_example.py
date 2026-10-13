"""Render the demo frames with cairo + numpy bloom, encode in parallel chunks."""
import math
import os
import subprocess
import sys
from multiprocessing import Pool

import cairo
import numpy as np
from PIL import Image, ImageFilter

from sim import *  # noqa

OUT = os.path.dirname(os.path.abspath(__file__)) + "/out"
os.makedirs(OUT, exist_ok=True)

ACCENT = (0.37, 0.92, 0.83)      # teal
WARM = (1.0, 0.82, 0.40)
TXT = (0.94, 0.96, 1.0)
DIM = (0.60, 0.66, 0.80)
FONT = "Inter"


def smooth(x):
    x = min(1.0, max(0.0, x))
    return x * x * (3 - 2 * x)


def ramp(t, a, b):
    return smooth((t - a) / (b - a))


# ---------------- background ----------------
def make_bg():
    rng = np.random.default_rng(7)
    y = np.linspace(0, 1, H)[:, None]
    x = np.linspace(0, 1, W)[None, :]
    top = np.array([0.050, 0.070, 0.150])
    bot = np.array([0.012, 0.016, 0.040])
    g = top[None, None, :] * (1 - y[..., None]) + bot[None, None, :] * y[..., None]
    g = np.broadcast_to(g, (H, W, 3)).copy()
    # soft nebula blobs
    for cx, cy, r, c in [(0.22, 0.30, 0.35, (0.10, 0.05, 0.20)), (0.80, 0.65, 0.40, (0.02, 0.10, 0.16))]:
        d = ((x - cx) * 16 / 9) ** 2 + (y - cy) ** 2
        g += np.exp(-d / (r * r))[..., None] * np.array(c)[None, None, :] * 0.6
    # vignette
    d = ((x - 0.5) * 1.3) ** 2 + (y - 0.5) ** 2
    g *= (1 - 0.55 * d)[..., None]
    # stars
    n = 260
    sx = rng.integers(0, W, n)
    sy = rng.integers(0, H, n)
    sb = rng.random(n) ** 3 * 0.55 + 0.05
    for a, b, v in zip(sx, sy, sb):
        g[b, a] += v
        if v > 0.35:
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                if 0 <= a + dx < W and 0 <= b + dy < H:
                    g[b + dy, a + dx] += v * 0.35
    g += (rng.random((H, W, 1)) - 0.5) / 255.0 * 1.5  # dither against banding
    return np.clip(g, 0, 1).astype(np.float32)


BG = None


# ---------------- helpers ----------------
def new_layer():
    s = cairo.ImageSurface(cairo.FORMAT_ARGB32, W, H)
    c = cairo.Context(s)
    c.set_line_cap(cairo.LINE_CAP_ROUND)
    c.set_line_join(cairo.LINE_JOIN_ROUND)
    return s, c


def layer_np(s):
    s.flush()
    a = np.ndarray((H, W, 4), np.uint8, s.get_data()).astype(np.float32) / 255.0
    return a  # BGRA premultiplied


def blur(img, factor, radius):
    """img: HxWx3 float -> blurred float at full size."""
    h, w = H // factor, W // factor
    small = img.reshape(h, factor, w, factor, 3).mean(axis=(1, 3))
    p = Image.fromarray(np.clip(small * 255, 0, 255).astype(np.uint8))
    p = p.filter(ImageFilter.GaussianBlur(radius)).resize((W, H), Image.BILINEAR)
    return np.asarray(p, np.float32) / 255.0


def ball(c, x, y, r, col, glow=0.0):
    rr, gg, bb = col
    g = cairo.RadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r)
    g.add_color_stop_rgba(0, 1, 1, 1, 0.95)
    g.add_color_stop_rgba(0.3, min(1, rr + 0.12 + glow), min(1, gg + 0.12 + glow), min(1, bb + 0.12 + glow), 1)
    g.add_color_stop_rgba(1, rr * 0.6, gg * 0.6, bb * 0.6, 1)
    c.set_source(g)
    c.arc(x, y, r, 0, 2 * math.pi)
    c.fill()


def text(c, s, x, y, size, col, alpha=1.0, align="c", weight=cairo.FONT_WEIGHT_BOLD, face=FONT, spacing=0.0, shadow=True):
    if alpha <= 0.002:
        return
    c.select_font_face(face, cairo.FONT_SLANT_NORMAL, weight)
    c.set_font_size(size)
    if spacing:
        widths = [c.text_extents(ch).x_advance + spacing for ch in s]
        tw = sum(widths) - spacing
    else:
        tw = c.text_extents(s).x_advance
    x0 = x - tw / 2 if align == "c" else (x - tw if align == "r" else x)

    def draw(dx, dy, rgba):
        c.set_source_rgba(*rgba)
        if spacing:
            xx = x0 + dx
            for ch, w_ in zip(s, widths):
                c.move_to(xx, y + dy)
                c.show_text(ch)
                xx += w_
        else:
            c.move_to(x0 + dx, y + dy)
            c.show_text(s)
    if shadow:
        draw(0, 3, (0, 0, 0, 0.55 * alpha))
    draw(0, 0, (*col, alpha))


def last_event_age(events, t, key):
    """seconds since the latest event for item `key` (inf if none)."""
    best = math.inf
    for et, *rest in events:
        if et > t:
            break
        if rest[0] == key:
            best = t - et
    return best


# ---------------- intro ----------------
def draw_intro(c, t):
    # teaser ring of orbiting dots
    n = 24
    for i in range(n):
        for k in range(14):
            tt = t - k * 0.025
            a = tt * 0.9 + i * 2 * math.pi / n
            rad = 470 + 18 * math.sin(tt * 2 + i)
            x = W / 2 + rad * math.cos(a)
            y = H / 2 + rad * math.sin(a) * 0.82
            col = hue_color(i, n, h0=0.0, h1=0.85)
            al = ramp(t, 0.0, 1.0) * (1 - k / 14) * 0.9
            if k == 0:
                c.set_source_rgba(*col, al)
                c.arc(x, y, 7, 0, 2 * math.pi)
                c.fill()
            else:
                c.set_source_rgba(*col, al * 0.35)
                c.arc(x, y, 7 * (1 - k / 16), 0, 2 * math.pi)
                c.fill()


def draw_intro_text(c, t):
    a = ramp(t, 0.35, 1.0)
    text(c, "SATISFYING PHYSICS", W / 2, H / 2 - 30 + 20 * (1 - a), 96, TXT, a, face="Inter Display",
         weight=cairo.FONT_WEIGHT_BOLD, spacing=6)
    a2 = ramp(t, 0.9, 1.5)
    text(c, "Real simulations  ·  Real sound", W / 2, H / 2 + 40, 34, ACCENT, a2, weight=cairo.FONT_WEIGHT_NORMAL)
    a3 = ramp(t, 1.7, 2.2)
    a4 = ramp(t, 2.0, 2.5)
    text(c, "01  Pendulum Wave", W / 2 - 200, H / 2 + 130, 30, DIM, a3, weight=cairo.FONT_WEIGHT_NORMAL)
    text(c, "02  Polyrhythm", W / 2 + 200, H / 2 + 130, 30, DIM, a4, weight=cairo.FONT_WEIGHT_NORMAL)


# ---------------- chapter 1: pendulum wave (3D) ----------------
CAM = np.array([0.34, 0.16, -0.70])
TGT = np.array([0.0, -0.26, 0.30])
FOC = 1.0


def cam_basis():
    f = TGT - CAM
    f /= np.linalg.norm(f)
    r = np.cross(np.array([0, 1.0, 0]), f)
    r /= np.linalg.norm(r)
    u = np.cross(f, r)
    return r, u, f


CR, CU, CF = cam_basis()
SCR_CX, SCR_CY = 0.0, 0.0


def proj(x, y, z):
    p = np.stack([x, y, z], -1) - CAM
    xc = p @ CR
    yc = p @ CU
    zc = p @ CF
    return SCR_CX + FOC * xc / zc, SCR_CY - FOC * yc / zc, zc


def fit_camera():
    """scale + centre the 3D rig so the whole swing fits between y=215 and y=1010."""
    global FOC, SCR_CX, SCR_CY
    xs_, ys_ = [], []
    for ss in np.arange(0, CYCLE, 0.05):
        x, y, z = pend_world(ss)
        for X, Y in (proj(x, y, z)[:2], proj(0 * x, 0 * y, z)[:2]):
            xs_ += list(X)
            ys_ += list(Y)
    x0, x1, y0, y1 = min(xs_), max(xs_), min(ys_), max(ys_)
    k = min((1010 - 215) / (y1 - y0), 1500 / (x1 - x0))
    FOC = k
    SCR_CX = W / 2 - k * (x0 + x1) / 2
    SCR_CY = (215 + 1010) / 2 - k * (y0 + y1) / 2


fit_camera()


def draw_ch1(c, t):
    s = t - CH1_SIM
    x, y, z = pend_world(s)
    piv = proj(np.zeros(NP), np.zeros(NP), z)
    # bar
    e0 = proj(np.array([0.0]), np.array([0.0]), np.array([-0.04]))
    e1 = proj(np.array([0.0]), np.array([0.0]), np.array([(NP - 1) * P_DZ + 0.04]))
    c.set_source_rgba(0.75, 0.80, 0.95, 0.85)
    c.set_line_width(6)
    c.move_to(e0[0][0], e0[1][0])
    c.line_to(e1[0][0], e1[1][0])
    c.stroke()
    bob = proj(x, y, z)
    order = np.argsort(-bob[2])  # far first
    sync_age = t - CH1_SYNC
    for i in order:
        col = P_COL[i]
        px, py = piv[0][i], piv[1][i]
        bx, by, bz = bob[0][i], bob[1][i], bob[2][i]
        # trail
        if s > 0:
            pts = []
            for k in range(1, 18):
                xs, ys, zs = pend_world(s - k * 0.016)
                q = proj(xs[i:i + 1], ys[i:i + 1], zs[i:i + 1])
                pts.append((q[0][0], q[1][0]))
            prev = (bx, by)
            for k, p in enumerate(pts):
                c.set_source_rgba(*col, 0.45 * (1 - k / len(pts)))
                c.set_line_width(FOC * 0.016 / bz * (1 - k / len(pts)) * 1.6)
                c.move_to(*prev)
                c.line_to(*p)
                c.stroke()
                prev = p
        # string
        c.set_source_rgba(0.85, 0.88, 1.0, 0.45)
        c.set_line_width(1.6)
        c.move_to(px, py)
        c.line_to(bx, by)
        c.stroke()
        c.set_source_rgba(0.9, 0.92, 1.0, 0.9)
        c.arc(px, py, 3.5, 0, 2 * math.pi)
        c.fill()
        age = last_event_age(PEND_EVENTS, t, i)
        pulse = math.exp(-age / 0.18) if age < 2 else 0.0
        r = FOC * 0.017 / bz * (1 + 0.25 * pulse)
        ball(c, bx, by, r, col, glow=0.35 * pulse)
        if 0 <= sync_age < 1.2:
            c.set_source_rgba(*col, 0.8 * (1 - sync_age / 1.2))
            c.set_line_width(3)
            c.arc(bx, by, r + 10 + 110 * sync_age, 0, 2 * math.pi)
            c.stroke()


def draw_ch1_text(c, t):
    lt = t - CH1[0]
    s = t - CH1_SIM
    # chapter card
    a = ramp(lt, 0.0, 0.4) * (1 - ramp(lt, 1.1, 1.5))
    text(c, "CHAPTER 01", W / 2, H / 2 - 40, 30, ACCENT, a, spacing=8)
    text(c, "Pendulum Wave", W / 2, H / 2 + 40, 84, TXT, a, face="Inter Display")
    hud = ramp(lt, 1.3, 1.8)
    text(c, "01 · PENDULUM WAVE", 60, 70, 24, ACCENT, hud, align="l", spacing=3)
    q = ramp(lt, 1.5, 2.0) * (1 - ramp(t, CH1_SYNC - 0.05, CH1_SYNC + 0.12))
    text(c, "Will they ever line up again?", W / 2, 92, 54, TXT, q)
    text(c, "15 pendulums  ·  15 different lengths", W / 2, 140, 28, DIM, q, weight=cairo.FONT_WEIGHT_NORMAL)
    text(c, f"t = {max(0, min(s, 99)):05.2f} s", W - 60, 70, 28, TXT, hud, align="r", face="DejaVu Sans Mono",
         weight=cairo.FONT_WEIGHT_NORMAL)
    # halfway caption
    m = ramp(s, 11.9, 12.3) * (1 - ramp(s, 14.2, 14.7))
    text(c, "Halfway...", 360, H / 2 - 10, 44, WARM, m)
    text(c, "two perfect lines!", 360, H / 2 + 45, 44, WARM, m)
    # payoff
    p = ramp(t, CH1_SYNC + 0.12, CH1_SYNC + 0.4)
    text(c, "YES! All back in line.", W / 2, 96, 64, WARM, p, face="Inter Display")
    p2 = ramp(t, CH1_SYNC + 0.5, CH1_SYNC + 0.9)
    text(c, "Each pendulum swings a whole number of times in 24 s  (16, 17, 18 … 30)", W / 2, 146, 28, TXT, p2,
         weight=cairo.FONT_WEIGHT_NORMAL)


# ---------------- chapter 2: polyrhythm ----------------
def ball_xy(i, phi):
    return B_CX + B_R[i] * np.cos(phi), B_CY - B_R[i] * np.sin(phi)


def draw_ch2(c, t):
    s = t - CH2_SIM
    phi = ball_phi(np.full(NB, s))
    sync_age = t - CH2_SYNC
    # floor line
    c.set_source_rgba(0.85, 0.9, 1.0, 0.55)
    c.set_line_width(3)
    c.move_to(B_CX - B_R[-1] - 40, B_CY)
    c.line_to(B_CX + B_R[-1] + 40, B_CY)
    c.stroke()
    ages = {}
    for et, i, side in BALL_EVENTS:
        if et > t:
            break
        ages[i] = (t - et, side)
    for i in range(NB):
        col = B_COL[i]
        age, side = ages.get(i, (math.inf, 0))
        lit = math.exp(-age / 0.45) if age < 3 else 0.0
        c.set_source_rgba(*col, 0.22 + 0.7 * lit)
        c.set_line_width(2.2 + 2.5 * lit)
        c.arc_negative(B_CX, B_CY, B_R[i], 0, -math.pi)
        c.stroke()
        if lit > 0.02:
            hx = B_CX + (B_R[i] if side == 0 else -B_R[i])
            c.set_source_rgba(*col, 0.9 * lit)
            c.arc(hx, B_CY, 4 + 26 * (1 - lit), 0, 2 * math.pi)
            c.set_line_width(2.5)
            c.stroke()
    for i in range(NB):
        col = B_COL[i]
        # trail
        if s > 0:
            pts = []
            for k in range(0, 16):
                ph = ball_phi(np.full(NB, s - k * 0.018))[i]
                pts.append(ball_xy(i, ph))
            for k in range(1, len(pts)):
                c.set_source_rgba(*col, 0.5 * (1 - k / len(pts)))
                c.set_line_width(16 * (1 - k / len(pts)))
                c.move_to(*pts[k - 1])
                c.line_to(*pts[k])
                c.stroke()
        age, _ = ages.get(i, (math.inf, 0))
        pulse = math.exp(-age / 0.15) if age < 2 else 0.0
        x, y = ball_xy(i, phi[i])
        ball(c, x, y, 10 + 4 * pulse, col, glow=0.3 * pulse)
        if 0 <= sync_age < 1.2:
            c.set_source_rgba(*col, 0.8 * (1 - sync_age / 1.2))
            c.set_line_width(3)
            c.arc(x, y, 14 + 90 * sync_age, 0, 2 * math.pi)
            c.stroke()


def draw_ch2_text(c, t):
    lt = t - CH2[0]
    s = t - CH2_SIM
    a = ramp(lt, 0.0, 0.4) * (1 - ramp(lt, 1.1, 1.5))
    text(c, "CHAPTER 02", W / 2, H / 2 - 40, 30, ACCENT, a, spacing=8)
    text(c, "Polyrhythm", W / 2, H / 2 + 40, 84, TXT, a, face="Inter Display")
    hud = ramp(lt, 1.3, 1.8)
    text(c, "02 · POLYRHYTHM", 60, 70, 24, ACCENT, hud, align="l", spacing=3)
    q = ramp(lt, 1.5, 2.0) * (1 - ramp(t, CH2_SYNC - 0.05, CH2_SYNC + 0.12))
    text(c, "Will all 20 balls hit the line together again?", W / 2, 92, 54, TXT, q)
    text(c, "20 balls  ·  20 different speeds", W / 2, 140, 28, DIM, q, weight=cairo.FONT_WEIGHT_NORMAL)
    text(c, f"t = {max(0, min(s, 99)):05.2f} s", W - 60, 70, 28, TXT, hud, align="r", face="DejaVu Sans Mono",
         weight=cairo.FONT_WEIGHT_NORMAL)
    m = ramp(s, 11.9, 12.3) * (1 - ramp(s, 14.2, 14.7))
    text(c, "Halfway... every ball on the line!", W / 2, H - 50, 40, WARM, m)
    p = ramp(t, CH2_SYNC + 0.12, CH2_SYNC + 0.4)
    text(c, "YES! Perfect sync.", W / 2, 96, 64, WARM, p, face="Inter Display")
    p2 = ramp(t, CH2_SYNC + 0.5, CH2_SYNC + 0.9)
    text(c, "Inner ball: 20 round trips  ·  outer ball: 1  ·  all in exactly 24 s", W / 2, 146, 28, TXT, p2,
         weight=cairo.FONT_WEIGHT_NORMAL)


# ---------------- frame ----------------
def fade(t):
    f = 1.0
    f *= 1 - ramp(t, 3.6, 4.0) * (1 - ramp(t, 4.0, 4.35))
    f *= 1 - ramp(t, 31.6, 32.0) * (1 - ramp(t, 32.0, 32.35))
    f *= ramp(t, 0.0, 0.5) * (1 - ramp(t, 59.2, 60.0))
    if 3.99 < t < 4.0 or 31.99 < t < 32.0:
        f = 0
    return f


def flash(t):
    v = 0.0
    for ts in (CH1_SYNC, CH2_SYNC):
        if 0 <= t - ts < 1.0:
            v += 0.09 * math.exp(-(t - ts) / 0.18)
    for ts in (CH1_SIM + 12, CH2_SIM + 12):
        if 0 <= t - ts < 1.0:
            v += 0.035 * math.exp(-(t - ts) / 0.15)
    return v


def render(t):
    s, c = new_layer()
    if t < INTRO[1]:
        draw_intro(c, t)
    elif t < CH1[1]:
        draw_ch1(c, t)
    else:
        draw_ch2(c, t)
    L = layer_np(s)
    card = 0.0
    for c0 in (CH1[0], CH2[0]):
        if c0 <= t < c0 + 2:
            card = ramp(t - c0, 0.0, 0.3) * (1 - ramp(t - c0, 1.1, 1.6))
    if card > 0:
        L *= 1 - 0.75 * card
    rgb = L[..., [2, 1, 0]]
    a = L[..., 3:4]
    b1 = blur(rgb, 4, 5)
    b2 = blur(rgb, 8, 9)
    out = BG * (1 - a) + rgb + b1 * 0.55 + b2 * 0.45 + flash(t)
    out = 1 - np.exp(-out * 1.15)  # soft tonemap
    out = out / (1 - math.exp(-1.15))
    out = np.clip(out, 0, 1)
    bgra = np.empty((H, W, 4), np.uint8)
    bgra[..., 0] = out[..., 2] * 255
    bgra[..., 1] = out[..., 1] * 255
    bgra[..., 2] = out[..., 0] * 255
    bgra[..., 3] = 255
    ts = cairo.ImageSurface.create_for_data(memoryview(bgra), cairo.FORMAT_ARGB32, W, H)
    tc = cairo.Context(ts)
    if t < INTRO[1]:
        draw_intro_text(tc, t)
    elif t < CH1[1]:
        draw_ch1_text(tc, t)
    else:
        draw_ch2_text(tc, t)
    ts.flush()
    f = fade(t)
    if f < 0.999:
        bgra[..., :3] = (bgra[..., :3].astype(np.float32) * f).astype(np.uint8)
    return bgra


def init():
    global BG
    BG = make_bg()


def chunk(args):
    idx, f0, f1 = args
    init()
    path = f"{OUT}/part{idx:02d}.mp4"
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgra", "-s", f"{W}x{H}",
                          "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "17",
                          "-pix_fmt", "yuv420p", path], stdin=subprocess.PIPE)
    for fi in range(f0, f1):
        p.stdin.write(render(fi / FPS).tobytes())
    p.stdin.close()
    p.wait()
    return path


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "stills":
        init()
        for tt in map(float, sys.argv[2:]):
            Image.fromarray(render(tt)[..., [2, 1, 0]]).save(f"{OUT}/still_{tt:05.1f}.png")
        sys.exit()
    nw = 4
    per = NFRAMES // nw
    jobs = [(k, k * per, NFRAMES if k == nw - 1 else (k + 1) * per) for k in range(nw)]
    with Pool(nw) as pool:
        parts = pool.map(chunk, jobs)
    with open(f"{OUT}/parts.txt", "w") as fh:
        for p in parts:
            fh.write(f"file '{p}'\n")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", f"{OUT}/parts.txt",
                    "-c", "copy", f"{OUT}/video_noaudio.mp4"], check=True)
    print("done")
