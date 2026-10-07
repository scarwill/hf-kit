# usage: python3 phrasecheck.py video.js   (run in the video folder, after align.py -> words.json; no rendering, < 1 s)
# Checks every go('..') / W('..') timing phrase: NOTFOUND, OUTSIDE AREA, or AMBIGUOUS = the phrase occurs more than once in its area,
# so W() fires on the FIRST one (bug: W('something') fired 6 s early). Areas = the go('..') phrases in source order.
import json, re, sys
src = open(sys.argv[1] if len(sys.argv) > 1 else 'video.js', encoding='utf-8').read()
w = json.load(open('words.json')); T = [t for t, _ in w]; Wd = [x for _, x in w]
norm = lambda p: [y for y in (re.sub(r'[^a-z0-9]', '', x.lower()) for x in p.split()) if y]
def occ(p):
    q = norm(p); return [T[i] for i in range(len(Wd) - len(q) + 1) if Wd[i:i + len(q)] == q]
calls = [(m.start(), m.group(1), m.group(2)) for m in re.finditer(r"\b(go|W)\('([^']+)'\)", src)]
starts = sorted({occ(p)[0] for _, f, p in calls if f == 'go' and occ(p)})
bad = 0; cur = 0.0
for pos, f, p in calls:
    o = occ(p)
    if not o: print('NOTFOUND', f, repr(p)); bad += 1; continue
    if f == 'go': cur = o[0]; continue
    nxt = min([s for s in starts if s > cur + .5] + [1e9]); inarea = [x for x in o if cur - .06 <= x < nxt]
    if not inarea: print(f'OUTSIDE AREA  W({p!r}) area @{cur:.1f} ends {nxt:.1f}'); bad += 1
    elif len(inarea) > 1: print(f'AMBIGUOUS  W({p!r}) in area @{cur:.1f}: fires at {inarea[0]:.2f}, also at {[round(x, 2) for x in inarea[1:]]} - use a longer phrase if you meant a later one'); bad += 1
print('phrasecheck:', 'all phrases unique in their area' if not bad else f'{bad} to look at')
