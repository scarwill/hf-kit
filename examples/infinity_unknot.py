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

CYAN = (0.20, 0.90, 1.00)
MAGENTA = (1.00, 0.25, 0.85)
RED = (1.00, 0.25, 0.25)
GOLD = (1.00, 0.80, 0.30)
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
    # this voice has two short breaths inside phrases, so try a few gap lengths
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
    return x * x * (3 - 2 * x)


def ramp(t, a, b):
    return ease((t - a) / max(1e-6, b - a))


def mix(c1, c2, k):
    return tuple(a + (b - a) * k for a, b in zip(c1, c2))


# ---------------------------------------------------------------- geometry
NP = 520
TT = np.linspace(0, 2 * np.pi, NP, endpoint=False)
LEFT = np.cos(TT) < 0   # left half cyan, right half magenta (like the terminal version)


def curve(lift, u):
    """Gerono lemniscate x=cos t, y=1/2 sin 2t, lifted by z=h sin t, then
    isotoped to the circle (cos t, 0, sin t). For lift>0 it never self-intersects."""
    h = 0.35 * lift
    x = np.cos(TT)
    y = (1 - u) * 0.5 * np.sin(2 * TT)
    z = (h + (1 - h) * u) * np.sin(TT)
    return np.stack([x, y, z], 1)


def rot(pitch, yaw, roll):
    cx, sx = math.cos(pitch), math.sin(pitch)
    cy, sy = math.cos(yaw), math.sin(yaw)
    cz, sz = math.cos(roll), math.sin(roll)
    Rx = np.array([[1, 0, 0], [0, cx, -sx], [0, sx, cx]])
    Ry = np.array([[cy, 0, sy], [0, 1, 0], [-sy, 0, cy]])
    Rz = np.array([[cz, -sz, 0], [sz, cz, 0], [0, 0, 1]])
    return Rz @ Rx @ Ry


def project(P, R, cx, cy, scale, cam=6.0):
    Q = P @ R.T
    k = cam / (cam + Q[:, 2])
    return np.stack([cx + Q[:, 0] * scale * k, cy - Q[:, 1] * scale * k], 1), Q[:, 2], k


def trefoil(n=400):
    t = np.linspace(0, 2 * np.pi, n, endpoint=False)
    x = np.sin(t) + 2 * np.sin(2 * t)
    y = np.cos(t) - 2 * np.cos(2 * t)
    z = -np.sin(3 * t)
    return np.stack([x, y, z], 1) / 3.0


TREFOIL = trefoil()


def draw_tube(ctx, P2, depth, k, width, colors, alpha=1.0, pieces=26):
    """Closed tube split into pieces drawn far-to-near, so the near strand covers the far one."""
    n = len(P2)
    step = n // pieces
    order = sorted(range(pieces), key=lambda p: -depth[p * step:(p + 1) * step].mean())
    ctx.set_line_cap(cairo.LINE_CAP_ROUND)
    ctx.set_line_join(cairo.LINE_JOIN_ROUND)
    for p in order:
        ids = [(i % n) for i in range(p * step, (p + 1) * step + 1)]
        m = ids[len(ids) // 2]
        w = width * k[m]
        c = colors[m]
        shade = clamp(0.6 + 0.4 * (1 - depth[m]) / 2, 0.4, 1.0)
        for lw, col, a, off in ((w + 12 * k[m], (0.02, 0.03, 0.08), alpha, 0),   # dark rim = gap at crossings
                                (w, tuple(x * shade for x in c), alpha, 0),
                                (w * 0.25, (1, 1, 1), alpha * 0.5 * shade, -w * 0.18)):  # specular stripe
            ctx.set_source_rgba(*col, a)
            ctx.set_line_width(lw)
            ctx.move_to(P2[ids[0], 0] + off, P2[ids[0], 1] + off)
            for i in ids[1:]:
                ctx.line_to(P2[i, 0] + off, P2[i, 1] + off)
            ctx.stroke()
    # second pass: repaint short bits over each joint so the dark rim does not show as seams
    for p in order:
        j0 = p * step
        ids = [(i % n) for i in range(j0 - 3, j0 + 4)]
        m = j0 % n
        w = width * k[m]
        shade = clamp(0.6 + 0.4 * (1 - depth[m]) / 2, 0.4, 1.0)
        for lw, col, a, off in ((w, tuple(x * shade for x in colors[m]), alpha, 0),
                                (w * 0.25, (1, 1, 1), alpha * 0.5 * shade, -w * 0.18)):
            ctx.set_source_rgba(*col, a)
            ctx.set_line_width(lw)
            ctx.move_to(P2[ids[0], 0] + off, P2[ids[0], 1] + off)
            for i in ids[1:]:
                ctx.line_to(P2[i, 0] + off, P2[i, 1] + off)
            ctx.stroke()


# ---------------------------------------------------------------- background
def make_background():
    y = np.linspace(0, 1, H)[:, None]
    top, bot = np.array([0.03, 0.04, 0.12]), np.array([0.01, 0.01, 0.04])
    img = (top * (1 - y)[..., None] + bot * y[..., None]) * np.ones((1, W, 1))
    rng = np.random.default_rng(7)
    for _ in range(260):
        sx, sy = rng.integers(0, W), rng.integers(0, H)
        img[sy, sx] += rng.uniform(0.15, 0.5)
    return np.clip(img, 0, 1)


BG = None


# ---------------------------------------------------------------- text
def text_center(ctx, s, x, y, size, color=WHITE, alpha=1.0, bold=True):
    ctx.select_font_face("Inter", cairo.FONT_SLANT_NORMAL,
                         cairo.FONT_WEIGHT_BOLD if bold else cairo.FONT_WEIGHT_NORMAL)
    ctx.set_font_size(size)
    e = ctx.text_extents(s)
    px, py = x - e.width / 2 - e.x_bearing, y
    ctx.set_source_rgba(0, 0, 0, 0.7 * alpha)
    ctx.move_to(px + 3, py + 4); ctx.show_text(s)
    ctx.set_source_rgba(*color, alpha)
    ctx.move_to(px, py); ctx.show_text(s)


def wrap(ctx, s, size, maxw):
    ctx.select_font_face("Inter", cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
    ctx.set_font_size(size)
    lines, cur = [], ""
    for w in s.split():
        test = (cur + " " + w).strip()
        if ctx.text_extents(test).x_advance > maxw and cur:
            lines.append(cur); cur = w
        else:
            cur = test
    lines.append(cur)
    return lines


def chip(ctx, s, x, y, color, alpha):
    if alpha <= 0.01:
        return
    ctx.select_font_face("Inter", cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
    ctx.set_font_size(40)
    e = ctx.text_extents(s)
    w, h = e.x_advance + 56, 76
    x0, y0, r = x - w / 2, y - h / 2, 38
    ctx.new_sub_path()
    ctx.arc(x0 + w - r, y0 + r, r, -math.pi / 2, 0)
    ctx.arc(x0 + w - r, y0 + h - r, r, 0, math.pi / 2)
    ctx.arc(x0 + r, y0 + h - r, r, math.pi / 2, math.pi)
    ctx.arc(x0 + r, y0 + r, r, math.pi, 1.5 * math.pi)
    ctx.close_path()
    ctx.set_source_rgba(0.04, 0.06, 0.15, 0.85 * alpha); ctx.fill_preserve()
    ctx.set_source_rgba(*color, alpha); ctx.set_line_width(3); ctx.stroke()
    ctx.set_source_rgba(1, 1, 1, alpha)
    ctx.move_to(x - e.x_advance / 2, y + 14); ctx.show_text(s)


# ---------------------------------------------------------------- frame
def render_frame(t, T, chunks):
    surf = cairo.ImageSurface(cairo.FORMAT_ARGB32, W, H)
    ctx = cairo.Context(surf)
    ctx.set_source_rgba(0, 0, 0, 0); ctx.paint()

    cur = max([i for i in range(len(T)) if T[i] <= t] or [0])

    # ---- shape state, every change starts at a phrase start T[i]
    appear = ramp(t, T[0], T[0] + 1.2)
    lift = ramp(t, T[9] + 0.2, T[10] + 1.0)
    u = ramp(t, T[14], T[16] + 0.8) * (1 - ramp(t, T[20], T[20] + 1.6)) \
        + ramp(t, T[21] + 0.3, T[21] + 1.6)
    u = clamp(u)
    tilt = ramp(t, T[8], T[8] + 1.5)              # 2D -> 3D view
    face = ramp(t, T[14], T[16] + 0.8)            # turn to look at the circle face-on
    face_back = ramp(t, T[20], T[20] + 1.6) * (1 - ramp(t, T[21] + 0.3, T[21] + 1.6))
    face = clamp(face - face_back)
    pitch = tilt * (-0.75) * (1 - face) + face * (-math.pi / 2)
    wob = 0.35 * math.sin(0.6 * t) * tilt * (1 - face)
    roll = 0.25 * t * face
    R = rot(pitch, wob, roll)

    split = ramp(t, T[22], T[22] + 1.0)           # ending: infinity left, trefoil right
    cx = 540 - 250 * split
    cy = 900
    scale = 400 * (1 - 0.45 * split)
    zoom = ramp(t, T[7], T[7] + 0.8) * (1 - ramp(t, T[8], T[8] + 1.2))
    scale *= 1 + 0.35 * zoom

    P = curve(lift, u)
    P2, depth, k = project(P, R, cx, cy, scale)
    cols = [CYAN if LEFT[i] else MAGENTA for i in range(NP)]
    cols = [mix(c, (0.75, 0.6, 1.0), u * 0.6) for c in cols]

    # ghost circle (question in phrase 1, disguise in phrase 21)
    ghost = ramp(t, T[1], T[1] + 0.6) * (1 - ramp(t, T[2], T[2] + 0.6)) \
        + 0.8 * ramp(t, T[21], T[21] + 0.5) * (1 - ramp(t, T[22], T[22] + 0.6))
    if ghost > 0.01:
        ctx.set_source_rgba(1, 1, 1, 0.35 * ghost)
        ctx.set_dash([18, 14]); ctx.set_line_width(4)
        ctx.arc(cx, cy, scale * 0.98, 0, 2 * math.pi); ctx.stroke()
        ctx.set_dash([])

    draw_tube(ctx, P2, depth, k, 34, cols, alpha=appear)

    # crossing pulse: shown while the curve still crosses (phrases 6..10), gone at 11
    cross = ramp(t, T[6], T[6] + 0.4) * (1 - ramp(t, T[11], T[11] + 0.8))
    if cross > 0.01:
        c2, _, _ = project(np.array([[0.0, 0.0, 0.0]]), R, cx, cy, scale)
        pulse = 0.5 + 0.5 * math.sin(8 * (t - T[6]))
        ctx.set_source_rgba(*RED, cross * (0.5 + 0.4 * pulse))
        ctx.set_line_width(6)
        ctx.arc(c2[0, 0], c2[0, 1], 46 + 14 * pulse, 0, 2 * math.pi); ctx.stroke()
        ctx.arc(c2[0, 0], c2[0, 1], 12, 0, 2 * math.pi); ctx.fill()

    # trefoil: a knot that can never be untied
    if split > 0.01:
        Rt = rot(0.3 * math.sin(t), 0.6 * t, 0)
        Q2, dq, kq = project(TREFOIL, Rt, 800, 900, 230 * split)
        tcols = [GOLD] * len(TREFOIL)
        draw_tube(ctx, Q2, dq, kq, 26, tcols, alpha=split)

    # ---- chips (kept outside the object: object spans y ~ 600-1200)
    chip(ctx, "x = cos t ,  y = ½ sin 2t", 540, 470,
         CYAN, ramp(t, T[2], T[2] + 0.5) * (1 - ramp(t, T[5], T[5] + 0.5)))
    chip(ctx, "John Wallis · 1655", 540, 1340,
         GOLD, ramp(t, T[3], T[3] + 0.5) * (1 - ramp(t, T[5], T[5] + 0.5)))
    chip(ctx, "z = h · sin t", 540, 1340,
         MAGENTA, ramp(t, T[9], T[9] + 0.5) * (1 - ramp(t, T[12], T[12] + 0.5)))
    chip(ctx, "crossings: 0", 540, 1340,
         CYAN, ramp(t, T[11] + 0.6, T[11] + 1.0) * (1 - ramp(t, T[13], T[13] + 0.5)))
    chip(ctx, "no cutting, just bending", 540, 1340,
         WHITE, ramp(t, T[13], T[13] + 0.5) * (1 - ramp(t, T[17], T[17] + 0.5)))
    chip(ctx, "unknot  =  0 crossings", 540, 1340,
         GOLD, ramp(t, T[18], T[18] + 0.5) * (1 - ramp(t, T[20], T[20] + 0.5)))
    if split > 0.01:
        text_center(ctx, "unknot", 290, 1240, 44, CYAN, split)
        text_center(ctx, "trefoil", 800, 1240, 44, GOLD, split)

    # ---- title
    title = "INFINITY = CIRCLE?"
    if T[17] <= t < T[20]:
        title = "THE UNKNOT"
    elif t >= T[22]:
        title = "CAN IT BE UNTIED?"
    text_center(ctx, title, 540, 260, 78, WHITE, ramp(t, 0, 0.5))
    sub = {2: "lemniscate", 5: "flat space (2D)", 8: "three dimensions", 9: "three dimensions",
           10: "three dimensions", 11: "three dimensions", 12: "three dimensions"}.get(cur)
    if sub:
        text_center(ctx, sub, 540, 340, 42, CYAN, 0.85, bold=False)

    # ---- caption of the current phrase
    a = ramp(t, T[cur], T[cur] + 0.15)
    lines = wrap(ctx, PHRASES[cur], 58, 900)
    for n, line in enumerate(lines):
        text_center(ctx, line, 540, 1640 + n * 72, 58, WHITE, a)

    # ---- composite: background + layer + bloom
    buf = np.ndarray((H, W, 4), np.uint8, surf.get_data()).astype(np.float32) / 255.0
    rgb, al = buf[..., 2::-1], buf[..., 3:4]           # BGRA premultiplied -> RGB
    small = Image.fromarray((rgb * 255).astype(np.uint8)).resize((W // 4, H // 4), Image.BILINEAR)
    glow = np.asarray(small.filter(ImageFilter.GaussianBlur(10))
                      .resize((W, H), Image.BILINEAR), np.float32) / 255.0
    img = BG * (1 - al) + rgb + 0.9 * glow
    img = 1.25 * img / (1 + 0.25 * img)                   # soft tonemap
    return (np.clip(img, 0, 1) * 255).astype(np.uint8)


# ---------------------------------------------------------------- sound bed
def make_sound(T, total, path):
    sr = 44100
    n = int(total * sr) + sr
    t = np.arange(n) / sr
    out = np.zeros(n)
    for f, a in ((110, 0.05), (164.8, 0.035), (220, 0.025), (329.6, 0.012)):
        out += a * np.sin(2 * np.pi * f * t + np.sin(0.2 * t)) * (0.7 + 0.3 * np.sin(0.13 * t + f))
    out *= np.clip(t / 2, 0, 1) * np.clip((total + 0.5 - t) / 2, 0, 1)

    rng = np.random.default_rng(1)

    def whoosh(at, dur=1.4, amp=0.12):
        i, m = int(at * sr), int(dur * sr)
        noise = np.convolve(rng.standard_normal(m), np.ones(40) / 40, "same")
        env = np.sin(np.linspace(0, np.pi, m)) ** 2
        out[i:i + m] += amp * noise[: len(out[i:i + m])] * env[: len(out[i:i + m])] * 6

    def chime(at, f=880, amp=0.15):
        i, m = int(at * sr), int(2.5 * sr)
        tt = np.arange(m) / sr
        s = (np.sin(2 * np.pi * f * tt) + 0.4 * np.sin(2 * np.pi * 2 * f * tt)) * np.exp(-tt * 2.5)
        out[i:i + m] += amp * s[: len(out[i:i + m])]

    chime(T[7] + 0.1, 660, 0.10)        # crossing point lights up red
    whoosh(T[8])                         # tilt into 3D
    whoosh(T[9] + 0.2, 1.6, 0.08)        # lift
    whoosh(T[14], 2.5, 0.07)             # untwist
    chime(T[16] + 0.8, 880)              # circle closes
    chime(T[16] + 0.95, 1318.5, 0.08)
    whoosh(T[20], 1.6, 0.07)
    chime(T[22] + 1.0, 587, 0.10)        # trefoil lands

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
