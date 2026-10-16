# free-decode a.raw with pocketsphinx in 30 s windows; compare distinctive words (5+ letters) with words.json
import numpy as np, pocketsphinx as ps, json, re, sys
x = np.fromfile('a.raw', dtype=np.int16); N = len(x) / 16000; d = ps.Decoder(samprate=16000); H = []; a = 0
while a < N:
    b = min(N, a + 30); d.start_utt(); d.process_raw(x[int(a * 16000):int(b * 16000)].tobytes(), full_utt=True); d.end_utt()
    for s in d.seg():
        w = re.sub(r'\(\d\)', '', s.word).replace("'", ''); t = a + s.start_frame / 100
        if w[:1] in '<[' or (a > 0 and t < a + 2): continue
        H.append((w, round(t, 2)))
    a += 26
json.dump(H, open('free.json', 'w'))
W = json.load(open('words.json')); seen = {}
for t, w in W:
    if len(w) < 5: continue
    c = [ht for hw, ht in H if hw == w and abs(ht - t) < 6]
    if not c: continue
    dt = min(c, key=lambda q: abs(q - t)) - t
    if abs(dt) > .45: print(f'{w:>14} words.json {t:7.2f}  heard {t + dt:7.2f}  diff {dt:+.2f}')
if len(sys.argv) > 2:
    a, b = map(float, sys.argv[1:3]); print(' '.join(f'{w}@{t}' for w, t in H if a <= t <= b))
