"""Synthesize the whole soundtrack from the simulation events (numpy only)."""
import math
import os
import wave

import numpy as np

from sim import *  # noqa
import render  # for camera projection (pan from screen x)

SR = 48000
N = int(DUR * SR)
OUT = os.path.dirname(os.path.abspath(__file__)) + "/out"
rng = np.random.default_rng(3)
mix = np.zeros((2, N), np.float64)


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


PENTA = [0, 2, 4, 7, 9]


def penta_scale(root, n):
    return [root + 12 * (k // 5) + PENTA[k % 5] for k in range(n)]


def place(sig, t, pan=0.0, gain=1.0):
    i = int(t * SR)
    if i >= N:
        return
    sig = sig[: N - i] * gain
    l = math.cos((pan + 1) * math.pi / 4)
    r = math.sin((pan + 1) * math.pi / 4)
    mix[0, i:i + len(sig)] += sig * l
    mix[1, i:i + len(sig)] += sig * r


def env(n, attack, tau):
    t = np.arange(n) / SR
    e = np.exp(-t / tau)
    a = int(attack * SR)
    if a > 0:
        e[:a] *= np.linspace(0, 1, a)
    return e


def marimba(f, length=1.4):
    n = int(length * SR)
    t = np.arange(n) / SR
    tau = 0.55 * (220 / f) ** 0.35
    s = np.sin(2 * math.pi * f * t) * env(n, 0.002, tau)
    s += 0.35 * np.sin(2 * math.pi * f * 3.98 * t) * env(n, 0.001, tau * 0.18)
    s += 0.10 * np.sin(2 * math.pi * f * 9.9 * t) * env(n, 0.001, tau * 0.06)
    click = rng.standard_normal(n) * env(n, 0.0, 0.002) * 0.15
    return (s + click) * 0.9


def bell(f, length=2.6):
    n = int(length * SR)
    t = np.arange(n) / SR
    parts = [(1.0, 1.0, 1.4), (2.0, 0.45, 0.9), (2.76, 0.30, 0.55), (5.40, 0.12, 0.22), (1.003, 0.6, 1.5)]
    s = np.zeros(n)
    for ratio, amp, tau in parts:
        tau_f = tau * (330 / f) ** 0.3
        s += amp * np.sin(2 * math.pi * f * ratio * t + rng.random() * 6) * env(n, 0.003, tau_f)
    return s * 0.45


def pad(t0, t1, notes, gain):
    i0, i1 = int(t0 * SR), int(min(t1, DUR) * SR)
    t = np.arange(i1 - i0) / SR
    s = np.zeros((2, i1 - i0))
    for m in notes:
        f = midi(m)
        for ch, det in ((0, -0.15), (1, 0.15)):
            ph = rng.random() * 6
            s[ch] += np.sin(2 * math.pi * (f + det) * t + ph) + 0.25 * np.sin(2 * math.pi * 2 * (f + det) * t + ph)
    lfo = 0.75 + 0.25 * np.sin(2 * math.pi * 0.11 * t)
    fade = np.minimum(1, np.minimum(t / 1.5, (t[-1] - t) / 1.2))
    mix[:, i0:i1] += s * lfo * fade * gain


def noise_sweep(t0, length, f_lo, f_hi, gain, rising=True):
    """filtered noise whoosh/riser: band moves from f_lo to f_hi."""
    n = int(length * SR)
    out = np.zeros(n)
    hop = 1024
    win = np.hanning(hop * 2)
    for k in range(0, n - hop, hop):
        x = k / n
        fc = f_lo * (f_hi / f_lo) ** x
        seg = rng.standard_normal(hop * 2)
        sp = np.fft.rfft(seg)
        fr = np.fft.rfftfreq(hop * 2, 1 / SR)
        sp *= np.exp(-((np.log(fr + 1) - math.log(fc)) ** 2) / 0.35)
        out[k:k + hop * 2] += np.fft.irfft(sp)[: min(hop * 2, n - k)] * win[: min(hop * 2, n - k)]
    shape = np.linspace(0, 1, n) ** 2.2 if rising else np.sin(np.linspace(0, math.pi, n)) ** 2
    out *= shape / (np.abs(out).max() + 1e-9)
    place(out, t0, 0, gain)


def boom(t, gain):
    n = int(1.6 * SR)
    tt = np.arange(n) / SR
    f = 38 + 30 * np.exp(-tt / 0.12)
    ph = 2 * math.pi * np.cumsum(f) / SR
    place(np.sin(ph) * env(n, 0.004, 0.45), t, 0, gain)


# ---------- intro ----------
pad(0.0, 32.4, [36, 43, 48, 52], 0.030)       # C major warm drone
for k, m in enumerate([60, 64, 67, 72, 76]):
    place(bell(midi(m)), 0.45 + k * 0.09, -0.5 + k * 0.25, 0.20)
place(bell(midi(79)), 1.0, 0.3, 0.10)
place(marimba(midi(67)), 1.75, -0.4, 0.22)
place(marimba(midi(72)), 2.05, 0.4, 0.22)
noise_sweep(3.15, 1.2, 300, 6000, 0.10, rising=False)

# ---------- chapter 1: pendulum wave ----------
place(bell(midi(72)), CH1[0] + 0.05, 0, 0.16)
p_notes = penta_scale(48, NP)                # longest (slowest) pendulum = lowest note
for t, i in PEND_EVENTS:
    s = t - CH1_SIM
    xs, ys, zs = pend_world(s)
    sx = render.proj(xs[i:i + 1], ys[i:i + 1], zs[i:i + 1])[0][0]
    pan = float(np.clip((sx - W / 2) / (W / 2), -1, 1)) * 0.8
    g = 0.11 if min(abs(t - CH1_SIM), abs(t - CH1_SYNC)) < 1e-6 else 0.16
    place(marimba(midi(p_notes[i])), t, pan, g)
noise_sweep(CH1_SYNC - 2.2, 2.2, 400, 9000, 0.07)
boom(CH1_SYNC, 0.55)
for k, m in enumerate([48, 55, 60, 64, 67, 72]):
    place(bell(midi(m), 3.2), CH1_SYNC + 0.01 * k, -0.6 + 0.24 * k, 0.12)
noise_sweep(31.3, 1.3, 300, 6000, 0.09, rising=False)

# ---------- chapter 2: polyrhythm ----------
pad(32.0, 60.0, [41, 48, 53, 57], 0.028)      # F major drone
place(bell(midi(77)), CH2[0] + 0.05, 0, 0.16)
b_notes = penta_scale(53, NB)[::-1]           # inner (fastest) = highest
for t, i, side in BALL_EVENTS:
    pan = (1 if side == 0 else -1) * (0.25 + 0.6 * B_R[i] / B_R[-1])
    f = midi(b_notes[i])
    g = 0.13 * (440 / f) ** 0.25
    if t == CH2_SIM or abs(t - CH2_SYNC) < 1e-6:
        g *= 0.7
    place(bell(f, 2.2), t, pan, g)
noise_sweep(CH2_SYNC - 2.2, 2.2, 400, 9000, 0.07)
boom(CH2_SYNC, 0.55)
for k, m in enumerate([41, 53, 60, 65, 69, 72]):
    place(bell(midi(m), 3.0), CH2_SYNC + 0.01 * k, -0.6 + 0.24 * k, 0.12)

# ---------- reverb (FFT convolution with synthetic stereo room) ----------
ir_len = int(2.4 * SR)
tt = np.arange(ir_len) / SR
wet = np.zeros_like(mix)
L = 1 << int(math.ceil(math.log2(N + ir_len)))
for ch in range(2):
    ir = rng.standard_normal(ir_len) * np.exp(-tt / 0.55)
    ir[: int(0.018 * SR)] = 0
    ir /= np.sqrt((ir ** 2).sum())
    wet[ch] = np.fft.irfft(np.fft.rfft(mix[ch], L) * np.fft.rfft(ir, L), L)[:N]
out = mix * 0.85 + wet * 0.45

# master: gentle limiter + fades + normalize
pk = np.abs(out).max()
print("pre-limit peak", round(pk, 3), "rms", round(float(np.sqrt((out ** 2).mean())), 4))
out = out / (np.percentile(np.abs(out), 99.95) / 0.8)   # set level so only rare peaks reach the limiter
out = np.tanh(out)
fade_in = np.minimum(1, np.arange(N) / (0.3 * SR))
fade_out = np.minimum(1, (N - np.arange(N)) / (0.9 * SR))
out *= fade_in * fade_out
out /= np.abs(out).max() / 0.89
print('crest dB', round(20 * math.log10(np.abs(out).max() / np.sqrt((out ** 2).mean())), 1))
pcm = (out.T * 32767).astype(np.int16)
with wave.open(f"{OUT}/audio.wav", "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("audio ok", len(PEND_EVENTS), "pendulum notes,", len(BALL_EVENTS), "ball notes")
