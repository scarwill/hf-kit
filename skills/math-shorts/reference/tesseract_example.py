"""4D cube (tesseract) explainer Short, synced to a TTS voiceover.
usage: python3 tesseract.py voice.m4a [stills t1 t2 ...]
Phrase timings come from the pauses in the voice track (PHRASES below = script, one entry per spoken chunk)."""
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
OUT = os.path.dirname(os.path.abspath(__file__)) + "/out_tess"
os.makedirs(OUT, exist_ok=True)
VOICE = sys.argv[1]

PHRASES = [
    "You can draw a cube.", "But can you draw a cube from the fourth dimension?", "Start with a single point.",
    "Drag it,", "and you get a line.", "Drag the line sideways,", "and you get a square.",
    "Drag the square upward,", "and you get a cube.", "Now drag the cube in a brand new direction,",
    "one that points away from all three.", "That's the fourth dimension.", "This is a tesseract.",
    "Its shadow in our world looks like a cube inside a cube.", "It has 16 corners,", "32 edges,", "24 squares,",
    "and 8 cubes.", "When it rotates in four dimensions,", "the inner cube seems to turn inside out.",
    "But nothing is bending.", "We only see its shadow.", "Just like your shadow is a flat picture of a 3D you.",
    "So,", "can you imagine the fifth dimension?",
]


def speech_chunks(path):
    log = subprocess.run(["ffmpeg", "-i", path, "-af", "silencedetect=n=-35dB:d=0.25", "-f", "null", "-"],
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


CH, VDUR = speech_chunks(VOICE)
assert len(CH) == len(PHRASES), f"{len(CH)} speech chunks vs {len(PHRASES)} phrases"
T = [c[0] for c in CH]   # phrase start times
DUR = VDUR + 1.2
NFR = int(DUR * FPS)

ACC = (0.37, 0.92, 0.83)
WARM = (1.0, 0.82, 0.40)
TXT = (0.95, 0.96, 1.0)
DIRC = [(1.0, 0.36, 0.42), (0.36, 0.95, 0.55), (0.35, 0.62, 1.0), (1.0, 0.78, 0.30)]  # x y z w


def sm(x):
    x = min(1.0, max(0.0, x))
    return x * x * (3 - 2 * x)


def rp(t, a, b):
    return sm((t - a) / (b - a))


# ---------- tesseract ----------
BITS = np.array([[(v >> i) & 1 for i in range(4)] for v in range(16)], float)
EDGES = [(a, b, i) for a in range(16) for i in range(4) for b in [a ^ (1 << i)] if a < b]
FACES = []
for i in range(4):
    for j in range(i + 1, 4):
        others = [k for k in range(4) if k not in (i, j)]
        for o0 in (0, 1):
            for o1 in (0, 1):
                base = (o0 << others[0]) | (o1 << others[1])
                FACES.append([base, base | 1 << i, base | 1 << i | 1 << j, base | 1 << j])


def state(t):
    """dimension scales s[4], 4D angle, view yaw/pitch."""
    collapse = rp(t, T[2], T[2] + 0.7)
    s = np.ones(4) * (1 - collapse)
    if t >= T[2] + 0.7:
        s = np.array([rp(t, T[3], T[3] + 1.2), rp(t, T[5], T[5] + 1.2), rp(t, T[7], T[7] + 1.2),
                      rp(t, T[9] + 0.6, T[11] + 0.3)])
    a4 = 0.55 * t * (1 - collapse)
    if t > T[18]:
        x = t - T[18]
        a4 = 0.6 * (x - 1.2 * (1 - math.exp(-x / 1.2)))  # eases in
    view = (1 - collapse) + rp(t, T[7], T[7] + 1.8) if t > T[2] else 1.0
    view = min(1.0, view)
    yaw = view * (0.6 + 0.12 * t)
    pitch = view * 0.42
    return s, a4, yaw, pitch


def project(t):
    s, a4, yaw, pitch = state(t)
    p = (BITS * 2 - 1) * s
    c, sn = math.cos(a4), math.sin(a4)
    x, w = p[:, 0] * c - p[:, 3] * sn, p[:, 0] * sn + p[:, 3] * c
    c2, s2 = math.cos(a4 * 0.45), math.sin(a4 * 0.45)
    y, w = p[:, 1] * c2 - w * s2, p[:, 1] * s2 + w * c2
    z = p[:, 2]
    k = 3.0 / (3.0 - w)                    # 4D -> 3D perspective
    x, y, z = x * k, y * k, z * k
    cy, sy = math.cos(yaw), math.sin(yaw)
    x, z = x * cy + z * sy, -x * sy + z * cy
    cp, spp = math.cos(pitch), math.sin(pitch)
    y, z = y * cp - z * spp, y * spp + z * cp
    f = 7.0 / (7.0 - z)                    # 3D -> screen
    return W / 2 + 150 * x * f, 880 - 150 * y * f, f


# ---------- drawing ----------
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


BG = None


def blur(img, fac, rad):
    small = img.reshape(H // fac, fac, W // fac, fac, 3).mean(axis=(1, 3))
    p = Image.fromarray(np.clip(small * 255, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(rad))
    return np.asarray(p.resize((W, H), Image.BILINEAR), np.float32) / 255


def text(c, s, x, y, size, col, a=1.0, face="Inter", wt=cairo.FONT_WEIGHT_BOLD):
    if a < 0.003:
        return
    c.select_font_face(face, cairo.FONT_SLANT_NORMAL, wt)
    c.set_font_size(size)
    tw = c.text_extents(s).x_advance
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


def draw_shape(c, t):
    X, Y, F = project(t)
    s = state(t)[0]
    # 24 squares flash
    fa = rp(t, T[16], T[16] + 0.3) * (1 - rp(t, T[17] + 0.3, T[17] + 1.0))
    if fa > 0:
        for q in FACES:
            c.set_source_rgba(0.55, 0.65, 1.0, 0.045 * fa)
            c.move_to(X[q[0]], Y[q[0]])
            for v in q[1:]:
                c.line_to(X[v], Y[v])
            c.close_path()
            c.fill()
    # 8 cubes: tint inner + outer cell
    ca = rp(t, T[17], T[17] + 0.3) * (1 - rp(t, T[18], T[18] + 0.6))
    eg = rp(t, T[15], T[15] + 0.2) * (1 - rp(t, T[16], T[16] + 0.6))  # 32 edges glow
    order = sorted(EDGES, key=lambda e: F[e[0]] + F[e[1]])
    for a, b, i in order:
        if s[i] < 0.002 and i != 0:
            continue
        col = DIRC[i]
        depth = (F[a] + F[b]) / 2
        al = min(1, 0.45 + 0.6 * (depth - 0.75)) + 0.4 * eg
        c.set_source_rgba(*col, min(1, al))
        c.set_line_width(4.5 * depth + 3 * eg)
        c.move_to(X[a], Y[a])
        c.line_to(X[b], Y[b])
        c.stroke()
    if ca > 0:
        for wbit in (0, 1):
            for a, b, i in EDGES:
                if i < 3 and BITS[a][3] == wbit:
                    c.set_source_rgba(1, 1, 1, 0.30 * ca)
                    c.set_line_width(7)
                    c.move_to(X[a], Y[a])
                    c.line_to(X[b], Y[b])
                    c.stroke()
    vp = rp(t, T[14], T[14] + 0.2) * (1 - rp(t, T[15], T[15] + 0.6))  # 16 corners pulse
    pt = rp(t, T[2], T[2] + 0.8) * (1 - rp(t, T[3], T[3] + 1.0))     # lone point glow
    for v in range(16):
        r = 6.5 * F[v] + 7 * vp + 12 * pt
        c.set_source_rgba(1, 1, 1, 0.95)
        c.arc(X[v], Y[v], r, 0, 2 * math.pi)
        c.fill()


def draw_text(c, t):
    end = rp(t, T[23], T[23] + 0.5)
    text(c, "What is a 4D cube?", W / 2, 250, 76, TXT, 1 - end)
    # direction legend (x y z w) as each dimension appears
    labels = [("1D", T[3]), ("2D", T[5]), ("3D", T[7]), ("4D", T[9] + 0.6)]
    for k, (lab, t0) in enumerate(labels):
        a = rp(t, t0, t0 + 0.4) * (1 - rp(t, T[12], T[12] + 0.5))
        text(c, lab, W / 2 - 240 + k * 160, 1430, 46, DIRC[k], a)
    ta = rp(t, T[12], T[12] + 0.4) * (1 - end)
    text(c, "TESSERACT", W / 2, 370, 50, WARM, ta, face="Inter Display")
    chips = [("16 corners", T[14]), ("32 edges", T[15]), ("24 squares", T[16]), ("8 cubes", T[17])]
    for k, (lab, t0) in enumerate(chips):
        a = rp(t, t0, t0 + 0.3) * (1 - rp(t, T[18] + 1.5, T[18] + 2.2))
        text(c, lab, W / 2 + (-230 if k % 2 == 0 else 230), 1420 + 75 * (k // 2), 50, ACC, a)
    # end card
    text(c, "Can you imagine", W / 2, 300, 74, TXT, end, face="Inter Display")
    text(c, "the 5th dimension?", W / 2, 390, 74, WARM, end, face="Inter Display")
    text(c, "Tell me in the comments", W / 2, 1450, 42, ACC, rp(t, T[24] + 0.6, T[24] + 1.1), wt=cairo.FONT_WEIGHT_NORMAL)
    # captions
    k = max([i for i in range(len(T)) if T[i] <= t + 0.05], default=-1)
    if k >= 0 and k < 23:
        a = rp(t, T[k] - 0.05, T[k] + 0.15) * (1 - rp(t, CH[-1][1], CH[-1][1] + 0.4))
        for j, ln in enumerate(wrap(c, PHRASES[k], 54, 900)):
            text(c, ln, W / 2, 1640 + j * 70, 54, TXT, a)


def render(t):
    surf = cairo.ImageSurface(cairo.FORMAT_ARGB32, W, H)
    c = cairo.Context(surf)
    c.set_line_cap(cairo.LINE_CAP_ROUND)
    draw_shape(c, t)
    surf.flush()
    L = np.ndarray((H, W, 4), np.uint8, surf.get_data()).astype(np.float32) / 255
    rgb, a = L[..., [2, 1, 0]], L[..., 3:4]
    fl = 0.0
    for tf in (T[11], T[12]):
        if 0 <= t - tf < 1:
            fl += 0.06 * math.exp(-(t - tf) / 0.2)
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


# ---------- sound bed (under the voice) ----------
def music():
    SR = 48000
    n = int(DUR * SR)
    rng = np.random.default_rng(5)
    mix = np.zeros((2, n))
    tt = np.arange(n) / SR
    for m, g in ((45, 1), (52, 0.8), (57, 0.6), (64, 0.35)):        # A minor-ish pad
        f = 440 * 2 ** ((m - 69) / 12)
        for ch, d in ((0, -0.2), (1, 0.2)):
            mix[ch] += g * np.sin(2 * math.pi * (f + d) * tt + rng.random() * 6)
    mix *= (0.7 + 0.3 * np.sin(2 * math.pi * 0.08 * tt)) * 0.02

    def put(sig, t0, gain, pan=0.0):
        i = int(t0 * SR)
        sig = sig[: n - i] * gain
        mix[0, i:i + len(sig)] += sig * math.cos((pan + 1) * math.pi / 4)
        mix[1, i:i + len(sig)] += sig * math.sin((pan + 1) * math.pi / 4)

    def chime(f, ln=2.0):
        k = np.arange(int(ln * SR)) / SR
        return sum(a * np.sin(2 * math.pi * f * r * k) * np.exp(-k / d) for r, a, d in
                   ((1, 1, 0.9), (2.0, 0.4, 0.5), (2.76, 0.25, 0.3))) * np.minimum(1, k / 0.004)

    def whoosh(ln):
        m = int(ln * SR)
        x = rng.standard_normal(m)
        x = np.convolve(x, np.ones(40) / 40, "same") * np.sin(np.linspace(0, math.pi, m)) ** 2
        return x / np.abs(x).max()

    for t0, m in ((T[3], 69), (T[5], 72), (T[7], 76), (T[9] + 0.6, 81)):
        put(whoosh(1.2), t0, 0.10)
        put(chime(440 * 2 ** ((m - 69) / 12)), t0 + 0.9, 0.10)
    for k, m in enumerate((76, 79, 81, 84)):
        put(chime(440 * 2 ** ((m - 69) / 12), 1.4), T[14 + k] + 0.05, 0.08, -0.4 + 0.27 * k)
    put(chime(440 * 2 ** ((57 - 69) / 12), 3.0), T[11], 0.16)
    put(whoosh(1.0), T[2], 0.08)
    put(chime(880, 2.5), T[24], 0.10)
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
                    "[1:a]adelay=0|0,apad[v];[v][2:a]amix=inputs=2:duration=longest:normalize=0,loudnorm=I=-14:TP=-1.5[a]",
                    "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-t", f"{DUR:.2f}",
                    "-movflags", "+faststart", f"{OUT}/tesseract_short.mp4"], check=True)
    print("done", DUR)
