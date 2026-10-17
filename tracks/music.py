# Builds the note list (notes.js) and the synth audio (audio.wav) for the 4-tracks short.
import json, numpy as np, wave

# (midi, duration) ; duration in units of `unit` seconds
FUR_ELISE = dict(name="Fur Elise", unit=0.135, notes=[
 (76,1),(75,1),
 (76,1),(75,1),(76,1),(71,1),(74,1),(72,1),
 (69,3),(60,1),(64,1),(69,1),
 (71,3),(64,1),(68,1),(71,1),
 (72,3),(64,1),(76,1),(75,1),
 (76,1),(75,1),(76,1),(71,1),(74,1),(72,1),
 (69,3),(60,1),(64,1),(69,1),
 (71,3),(64,1),(72,1),(71,1),
 (69,5)])
ODE_TO_JOY = dict(name="Ode to Joy", unit=0.36, notes=[
 (76,1),(76,1),(77,1),(79,1),(79,1),(77,1),(76,1),(74,1),
 (72,1),(72,1),(74,1),(76,1),(76,1.5),(74,.5),(74,2)])
TWINKLE = dict(name="Twinkle Twinkle", unit=0.36, notes=[
 (72,1),(72,1),(79,1),(79,1),(81,1),(81,1),(79,2),
 (77,1),(77,1),(76,1),(76,1),(74,1),(74,1),(72,2)])
MOUNTAIN_KING = dict(name="Hall of the Mountain King", unit=0.2, notes=[
 (71,1),(73,1),(74,1),(76,1),(78,1),(74,1),(78,2),
 (77,1),(73,1),(77,2),(76,1),(72,1),(76,2),
 (71,1),(73,1),(74,1),(76,1),(78,1),(74,1),(78,1),(83,1),
 (81,1),(78,1),(74,1),(78,1),(81,3)])
TRACKS = [FUR_ELISE, ODE_TO_JOY, TWINKLE, MOUNTAIN_KING]

START, GAP, SR = 1.2, 0.75, 44100
notes, sections, t = [], [], START
for k, tr in enumerate(TRACKS):
    t0 = t
    for i, (m, d) in enumerate(tr["notes"]):
        notes.append(dict(t=round(t, 4), m=m, k=k))
        t += d * tr["unit"]
    # the last note rings; the next track starts after a short gap
    sections.append(dict(k=k, start=round(t0, 3), end=round(t, 3)))
    t += GAP
END = t - GAP + 0.3
DUR = 30.0
assert END < DUR - 1.5, END

with open("notes.js", "w") as f:
    f.write("window.NOTES=" + json.dumps(notes) + ";\nwindow.SECTIONS=" + json.dumps(sections)
            + ";\nwindow.DUR=" + str(DUR) + ";\n")

# marimba / bell-like voice: decaying harmonics + soft thud of the ball
out = np.zeros(int(SR * (DUR + 1)))
for n in notes:
    f0 = 440 * 2 ** ((n["m"] - 69) / 12)
    L = int(SR * 1.6); x = np.arange(L) / SR
    tone = (np.sin(2*np.pi*f0*x) * np.exp(-x*3.2)
            + 0.35*np.sin(2*np.pi*2*f0*x) * np.exp(-x*6)
            + 0.12*np.sin(2*np.pi*4.02*f0*x) * np.exp(-x*12)
            + 0.08*np.sin(2*np.pi*3*f0*x) * np.exp(-x*9))
    tone *= np.minimum(1, x / 0.004)
    thud = 0.35 * np.sin(2*np.pi*95*x) * np.exp(-x*40)
    s = int(n["t"] * SR)
    out[s:s+L] += 0.28 * tone + thud
# small room reverb (feedback delays)
rev = out.copy()
for dl, g in [(0.031, .35), (0.047, .3), (0.071, .25), (0.113, .2)]:
    d = int(dl * SR); y = out.copy()
    for _ in range(6):
        y = np.concatenate([np.zeros(d), y[:-d]]) * g; rev += y
out = rev[:int(SR*DUR)]
out = out / np.max(np.abs(out)) * 0.85
fade = int(SR*1.0); out[-fade:] *= np.linspace(1, 0, fade)
pcm = (out * 32767).astype(np.int16)
with wave.open("audio.wav", "w") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print(len(notes), "notes, music ends", round(END, 2), "s", sections)
