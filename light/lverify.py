#!/usr/bin/env python3
# LIGHT sync verify (run in the video folder after align.py / realign.py; needs a.raw + words.json + meta.json):
#   python3 ~/hf-kit/light/lverify.py
# Free-decodes the audio with pocketsphinx (pip install pocketsphinx; English model ships inside) in 30 s windows and compares
# every heard 5+ letter word that occurs ONCE in the script with its time in words.json.
# A word more than 0.5 s off = a bad sentence boundary -> it prints CHECK #k with the heard time; fix with realign.py fix, run again.
import json, re, sys
import numpy as np
from pocketsphinx import Decoder
x = np.fromfile('a.raw', dtype=np.int16); SR = 16000
W = json.load(open('words.json')); S = json.load(open('meta.json'))['sents']
cnt = {}
for _, w in W: cnt[w] = cnt.get(w, 0) + 1
where = {w: t for t, w in W if cnt[w] == 1 and len(w) >= 5}
sent_of = lambda t: max([k for k, (a, b, _) in enumerate(S) if a <= t + .05] or [0])
dec = Decoder(samprate=SR, logfn='/dev/null'); heard = []
for a in range(0, len(x), 30 * SR):
    b = min(len(x), a + 31 * SR); dec.start_utt(); dec.process_raw(x[a:b].tobytes(), full_utt=True); dec.end_utt()
    for sg in dec.seg():
        w = re.sub(r'\(\d+\)$', '', sg.word).lower()
        if w in where: heard.append((a / SR + sg.start_frame / 100, w))
off, ok, seen = {}, 0, set()
for t, w in heard:
    if w in seen: continue
    seen.add(w); d = t - where[w]
    if abs(d) > 8: continue                              # a far match is a mis-heard word, not a boundary error
    if abs(d) <= .5: ok += 1; continue
    k = sent_of(where[w]); off.setdefault(k, []).append((w, where[w], t, d))
print(f'pocketsphinx: {len(heard)} unique script words heard, {ok} within 0.5 s, {sum(len(v) for v in off.values())} off')
for k in sorted(off):
    a, b, s = S[k]
    print(f'CHECK #{k:3d} {a:7.2f}-{b:7.2f}  {s[:60]}')
    for w, tw, th, d in off[k]: print(f'        "{w}": words.json {tw:7.2f}  heard {th:7.2f}  ({d:+.2f} s)')
if off: print('fix: python3 ~/hf-kit/light/realign.py   (see the silences around these sentences), then realign.py fix \'{"k":[start,end]}\', then run lverify again')
else: print('lverify: sync ok')
