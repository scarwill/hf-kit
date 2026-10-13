"""Shared timeline + physics for the 1-min long-form demo (visuals and audio both read this)."""
import math
import colorsys
import numpy as np

W, H, FPS, DUR = 1920, 1080, 60, 60.0
NFRAMES = int(DUR * FPS)
CYCLE = 24.0  # seconds until everything realigns

# ---------------- timeline ----------------
INTRO = (0.0, 4.0)
CH1 = (4.0, 32.0)
CH1_SIM = 5.5            # pendulums released
CH2 = (32.0, 60.0)
CH2_SIM = 33.5           # balls start
CH1_SYNC = CH1_SIM + CYCLE   # 29.5
CH2_SYNC = CH2_SIM + CYCLE   # 57.5


def hue_color(k, n, sat=0.62, val=1.0, h0=0.0, h1=0.82):
    h = h0 + (h1 - h0) * (k / max(1, n - 1))
    return colorsys.hsv_to_rgb(h, sat, val)


# ---------------- chapter 1: pendulum wave ----------------
G = 9.81
NP = 15
P_BASE = 16                                # pendulum i swings (16+i) times in 24 s
P_T = np.array([CYCLE / (P_BASE + i) for i in range(NP)])
P_L = G * P_T ** 2 / (4 * math.pi ** 2)     # real lengths (m) for those periods
P_DZ = 0.055                               # spacing along the bar (m)
P_TH0 = 0.30                               # release angle (rad)
P_COL = [hue_color(i, NP, h0=0.0, h1=0.78) for i in range(NP)]


def pend_theta(s):
    """angles of all pendulums at sim time s (s<0 -> held at release)."""
    s = max(0.0, s)
    return P_TH0 * np.cos(2 * math.pi * s / P_T)


def pend_world(s):
    th = pend_theta(s)
    x = P_L * np.sin(th)
    y = -P_L * np.cos(th)
    z = np.arange(NP) * P_DZ
    return x, y, z


def pend_events(t_end):
    """note events: pendulum i reaches its release side every period."""
    ev = []
    for i in range(NP):
        k = 0
        while True:
            s = k * P_T[i]
            t = CH1_SIM + s
            if t > t_end:
                break
            ev.append((t, i))
            k += 1
    return sorted(ev)


# ---------------- chapter 2: polyrhythm ----------------
NB = 20
B_LOOPS = np.array([NB - i for i in range(NB)])   # inner ball: 20 round trips, outer: 1
B_R = np.array([112 + i * 33 for i in range(NB)], dtype=float)
B_CX, B_CY = W / 2, 935.0
B_COL = [hue_color(i, NB, h0=0.80, h1=0.0) for i in range(NB)]


def tri(x):
    return 2 * np.abs(x - np.floor(x + 0.5))


def ball_phi(s):
    s = np.maximum(0.0, s)
    return math.pi * tri(B_LOOPS * s / CYCLE)


def ball_events(t_end):
    """ball i touches the floor line every CYCLE/(2*loops) s; side = 0 right, 1 left."""
    ev = []
    for i in range(NB):
        dt = CYCLE / (2 * B_LOOPS[i])
        k = 0
        while True:
            t = CH2_SIM + k * dt
            if t > t_end:
                break
            ev.append((t, i, k % 2))
            k += 1
    return sorted(ev)


PEND_EVENTS = pend_events(CH1[1] - 0.05)
BALL_EVENTS = ball_events(CH2[1] - 0.05)
