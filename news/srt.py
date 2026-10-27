#!/usr/bin/env python3
# YouTube subtitles from the aligned words (run in the video folder, after align / realign):
#   python3 ~/nkit/news/srt.py <slug>.srt shown.txt
# shown.txt = the script as it should read on screen, one sentence per line, numbers as digits; 'GPT-6{2}' shows one token for 2 spoken words
# (same syntax as sCaptions). Times are video time (audio + HEAD 0.2). Cues <= 42 characters, never across a sentence.
import json, re, sys
HEAD, MAXC = .2, 42
out, shown = sys.argv[1], sys.argv[2]
W = json.load(open('words.json'))
lines = [l.strip() for l in open(shown, encoding='utf-8') if l.strip()]
toks = []
for li, l in enumerate(lines):
    for t in l.split():
        m = re.match(r'^(.*?)\{(\d+)\}(.*)$', t)
        toks.append((li, m.group(1) + m.group(3) if m else t, int(m.group(2)) if m else 1))
n = sum(k for _, _, k in toks)
if n != len(W): sys.exit(f'srt: shown.txt has {n} spoken words, words.json has {len(W)}')
i, timed = 0, []
for li, txt, k in toks:
    timed.append((li, txt, W[i][0] + HEAD, (W[i + k][0] if i + k < len(W) else W[-1][0] + .6) + HEAD)); i += k
L = lambda ws: len(' '.join(x[1] for x in ws))
def split(ws):
    # balanced split (no one-word orphans), a break after a comma counts as 6 characters shorter
    if L(ws) <= MAXC or len(ws) < 2: return [ws]
    best = min(range(1, len(ws)), key=lambda k: max(L(ws[:k]), L(ws[k:])) - (6 if ws[k - 1][1].endswith(',') else 0))
    return split(ws[:best]) + split(ws[best:])
cues = []
for li in range(len(lines)): cues += split([w for w in timed if w[0] == li])
def ts(t): t = max(0, t); h, r = divmod(t, 3600); m, s = divmod(r, 60); return f'{int(h):02}:{int(m):02}:{int(s):02},{int(round((s - int(s)) * 1000)):03}'.replace(',1000', ',999')
with open(out, 'w', encoding='utf-8') as f:
    for j, c in enumerate(cues):
        a = c[0][2]; b = min(c[-1][3], cues[j + 1][0][2] - .02) if j + 1 < len(cues) else c[-1][3]
        f.write(f'{j + 1}\n{ts(a)} --> {ts(max(b, a + .5))}\n{" ".join(x[1] for x in c)}\n\n')
print(f'{out}: {len(cues)} cues')
