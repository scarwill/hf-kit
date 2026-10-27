# usage (in the video folder, after align.py): python3 ~/hf-kit/news/realign.py   -> report: every sentence, its time, expected length, silences around flagged ones
#        python3 ~/hf-kit/news/realign.py fix '{"91":[284.0,284.55]}'  -> set sentence boundaries by index, re-spread its words, rewrite words.json + meta.json
import json, sys, re, numpy as np
x = np.fromfile('a.raw', dtype=np.int16).astype(float) / 32768; hop = 160; n = len(x) // hop
db = 20 * np.log10(np.sqrt((x[:n * hop].reshape(n, hop) ** 2).mean(1)) + 1e-9); sp = np.convolve(db, np.ones(5) / 5, 'same') > -45
W = json.load(open('words.json')); M = json.load(open('meta.json')); S = M['sents']
wt = lambda t: len(re.sub(r'[^A-Za-z0-9]', '', t)) + 1.5
L = np.array([sum(wt(t) for t in s.split()) for _, _, s in S]); rate = sum(b - a for a, b, _ in S) / L.sum()
def sil(a, b):
    out = []; i = max(0, int(a * 100))
    while i < min(n, int(b * 100)):
        if not sp[i]:
            j = i
            while j < n and not sp[j]: j += 1
            if j - i >= 12: out.append((i / 100, j / 100))
            i = j
        else: i += 1
    return out
if len(sys.argv) < 3:
    for k, (a, b, s) in enumerate(S):
        e = rate * L[k]; fx = k in M.get('fixed', []); bad = abs((b - a) - e) > max(1.2, .45 * e) and not fx
        print(f"{'CHECK' if bad else 'fixed' if fx else '     '} #{k:3d} {a:7.2f}-{b:7.2f} d={b - a:5.2f} exp={e:5.2f}  {s[:60]}")
        if bad:
            print('        silences (start,end) nearby:', sil(S[max(0, k - 3)][0] - .5, S[min(len(S) - 1, k + 2)][1] + .5))
            for j in range(max(0, k - 3), min(len(S), k + 3)): print(f'          neighbour #{j}: {S[j][0]:7.2f}-{S[j][1]:7.2f} exp={rate * L[j]:5.2f}  {S[j][2][:50]}')
    sys.exit()
OV = {int(k): v for k, v in json.loads(sys.argv[2]).items()}
i = 0
for k, (a, b, s) in enumerate(S):
    toks = s.split(); m = len(toks)
    if k in OV:
        v = OV[k]; parts = [p.split() for p in re.split(r'(?<=[,;:])\s+', s) if p.strip()]
        rng = v if isinstance(v[0], list) else [v]          # one [start,end] for the sentence, or one per comma part
        if len(rng) > 1: assert len(rng) == len(parts), f'#{k} has {len(parts)} comma parts'
        else: parts = [toks]
        S[k][0], S[k][1] = rng[0][0], rng[-1][1]; j0 = i
        spk = lambda u, v: sp[int(u * 100):int(v * 100)].sum() / 100
        for ws, (a, b) in zip(parts, rng):
            tot = sum(wt(t) for t in ws); acc = 0; T = max(spk(a, b), .01)
            for t_ in ws:
                t = a
                while t < b and spk(a, t) < acc / tot * T: t += .01
                while t < b and not sp[min(int(t * 100), n - 1)]: t += .01
                W[j0][0] = round(t, 2); acc += wt(t_); j0 += 1
    i += m
assert i == len(W), 'token count mismatch'
assert all(W[j][0] <= W[j + 1][0] for j in range(len(W) - 1)), 'words not in order: fix the neighbouring sentences too'
M['fixed'] = sorted(set(M.get('fixed', [])) | set(OV)); json.dump(W, open('words.json', 'w')); json.dump(M, open('meta.json', 'w')); print('fixed', sorted(OV), '- these show as fixed in the report; run nverify.py to confirm')
