#!/usr/bin/env python3
# NEWS build:  python3 ~/hf-kit/news/nbuild.py video.js <audio e.g. talk.m4a> [index.html] [--no-bgm] [--force]
# Run in the folder that has words.json + meta.json (align.py). LONG 1920x1080 only.
# 1. LINT    banned helpers (other looks, any mascot / orb, light-kit house helpers, drawing on `stage` = header / footer / progress bar, house helpers pasted again) -> ERROR
# 2. PHRASES every go / NEXT / W phrase is checked against words.json scene by scene (NEXT knows the scene starts):
#            NOTFOUND, SCENE START NOT AFTER THE PREVIOUS ONE, OUTSIDE (W fires in a later scene) -> ERROR ; AMBIGUOUS (phrase occurs again in the scene) -> WARN
# 3. BUILD   premium.js + life.js + news.js + video.js + kit.js into template.html; adds the bgm track (assets/bgm.m4a) unless --no-bgm.
# Any ERROR = no index.html is written (unless --force). Fix the errors, run again.
# timeline = HEAD 2.6 s (Intro A, no voice) + audio + TAIL 3.6 s (Outro A). Word times are shifted by HEAD; END = HEAD + audio length.
import json, sys, os, re
K = os.path.dirname(os.path.abspath(__file__)); V = os.path.join(K, '..', 'video')
args = [a for a in sys.argv[1:] if not a.startswith('--')]; FORCE = '--force' in sys.argv; BGM = '--no-bgm' not in sys.argv
vid, aud = args[0], args[1]; out = args[2] if len(args) > 2 else 'index.html'
HEAD, TAIL = 2.6, 3.6
M = json.load(open('meta.json')); AUD = M['END']; END = round(HEAD + AUD, 2)
WJ = json.load(open('words.json')); TW = [[round(t + HEAD, 2), w] for t, w in WJ]
V0 = open(vid, encoding='utf-8').read()
err, warn = [], []
E = lambda m: err.append(m); Wn = lambda m: warn.append(m)

# ---------------- 1. lint ----------------
BAN = {r'k[A-Z]\w*|chat|pill|card|bubble|charB|charP|botB|botP|person|wtext|useTheme|ic|ico': 'other looks (Kurz / Infographics) - news uses nl* + nw* parts only',
       r'nlOrb|cOrb|ORB_\w+': 'no mascot / orb in the news channel - the story visuals carry every scene',
       r'nlCmd': 'no bottom narrator line in news',
       r'nlNext': "use NEXT('#sN', 'first words') - it adds the whoosh cue and the scene checks",
       r'nlInit|nlIntro|nlOutro|nwIntro|nwOutro|nlSetup': "use nwSetup(s, { channel, date }) once at the top of build (nlSetup is the light kit)",
       r'nlStart|nlIntroBeats|nlOutroBeats|nwIntroBeats|nwOutroBeats|nlBegin|nlFinish|houseBeats|houseEnd|houseStart': 'use nwBegin([...]) first and nwFinish() last in beats'}
REDEF = r'(?:const|let|var|function)\s+(arw|CUES|CUE|NEXT|NWB|NWSTORY|nwSetup|nwBegin|nwFinish|nwStory|STORY|nwHead|MARK|nwPost|POST|nwSpec|SPEC|nwTime|TIMELINE|TIME_GO|nwCo|nwRecap|RECAP|nwSignal|nlShot|SHOT_FOCUS|nlShotHL|nlCursor|CURSOR|CLICK|houseStart|houseBeats|houseEnd|D|NL|HERO|TYPE|W|go|tl)\b'
code = []
for i, l in enumerate(V0.split('\n'), 1):
    l2 = re.sub(r'//.*$', '', l); code.append(l2)
    for pat, why in BAN.items():
        for m in re.finditer(r"(?<![\w.$'\"])(" + pat + r")\s*\(", l2): E(f'BANNED   line {i}: {m.group(1)}()  -> {why}')
    m = re.search(REDEF, l2)
    if m: E(f'REDEFINE line {i}: {m.group(1)} is already in the kit (news.js) - delete it from video.js')
    m = re.search(r'(?<![\w.$])(stage|nlInit\.top|document\.body)\b', re.sub(r"'[^']*'|\"[^\"]*\"|`[^`]*`", "''", l2))
    if m: E(f'OVERLAY  line {i}: {m.group(1)} - no header / footer / progress bar / overlay: put every part inside a scene (nlHero for the one gliding object)')
    if re.search(r"NL\.acc|#b48cff", l2, re.I): Wn(f'PURPLE   line {i}: purple accent outside a title (<b> in nlScene titles only)')
    if re.search(r'[\U0001F300-\U0001FAFF☀-➿]', l2): E(f'EMOJI    line {i}: no emoji / symbol glyphs in code (draw them in SVG)')
    for m in re.finditer(r"\b(?:PULSE)\(\s*'#(\w+)'", l2):
        if re.search(r"nlHero\(\s*'" + m.group(1) + "'", V0): E(f'HERO     line {i}: never PULSE the hero #{m.group(1)} (it jumps) - pulse a part inside it')
src = '\n'.join(code)
for need, why in (('nwSetup(', 'first line of build'), ('nwBegin(', 'first line of beats'), ('nwFinish(', 'last line of beats'), ('nwStory(', 'one story opener per story')):
    if need not in src: E(f'MISSING  {need}) - {why}')

# ---------------- 2. phrases, scene by scene ----------------
T = [t for t, _ in TW]; Wd = [w for _, w in TW]
norm = lambda p: [y for y in (re.sub(r'[^a-z0-9]', '', x.lower()) for x in p.split()) if y]
def occ(p, frm=-1):
    q = norm(p); return [T[i] for i in range(len(Wd) - len(q) + 1) if T[i] >= frm and Wd[i:i + len(q)] == q] if q else []
Q = lambda n: r"""(['"])((?:(?!\%d).)+)\%d""" % (n, n)      # quoted phrase; n = number of its quote group
calls = [(m.start(), 'go', m.group(2)) for m in re.finditer(r"\bgo\(\s*" + Q(1) + r"\s*\)", src)]
calls += [(m.start(), 'W', m.group(2)) for m in re.finditer(r"(?<![\w.$])W\(\s*" + Q(1) + r"\s*\)", src)]
calls += [(m.start(), 'NEXT', m.group(3), m.group(1)) for m in re.finditer(r"\bNEXT\(\s*['\"]([^'\"]+)['\"]\s*,\s*" + Q(2) + r"\s*\)", src)]
calls.sort(key=lambda c: c[0])
line = lambda pos: src.count('\n', 0, pos) + 1
# pass 1: scene starts (runtime: go/NEXT search from the current start - .06; not found -> start stays)
ST, starts = HEAD, []
for c in calls:
    if c[1] == 'W': continue
    o = occ(c[2], ST - .06)
    if not o: E(f"NOTFOUND line {line(c[0])}: {c[1]}('{c[2]}') - not in words.json after {ST:.2f}s (check spelling: words.json has no punctuation)"); continue
    if starts and o[0] <= ST + .05: E(f"SCENE    line {line(c[0])}: {c[1]}('{c[2]}') starts at {o[0]:.2f}s, not after the previous scene start {ST:.2f}s")
    ST = o[0]; starts.append((c[0], ST, c[3] if len(c) > 3 else c[2]))
# pass 2: W phrases inside their scene
SI = {p: j for j, (p, _, _) in enumerate(starts)}; ST, k, nW = HEAD, -1, 0
for c in calls:
    if c[1] != 'W':
        if c[0] in SI: k = SI[c[0]]; ST = starts[k][1]
        continue
    nW += 1; nxt = starts[k + 1][1] if k + 1 < len(starts) else END
    o = occ(c[2], ST - .06)
    if not o: E(f"NOTFOUND line {line(c[0])}: W('{c[2]}') - not in words.json after the scene start {ST:.2f}s"); continue
    if o[0] >= nxt: E(f"OUTSIDE  line {line(c[0])}: W('{c[2]}') fires at {o[0]:.2f}s, after this scene ends ({nxt:.2f}s) - wrong scene or wrong phrase")
    elif len([x for x in o if x < nxt]) > 1: Wn(f"AMBIGUOUS line {line(c[0])}: W('{c[2]}') fires at {o[0]:.2f}s; it is said again at {[round(x, 2) for x in o[1:] if x < nxt]} in this scene - longer phrase if you meant a later one")
# scene table
print('scene starts (video time):')
for j, (_, t, nm) in enumerate(starts):
    d = (starts[j + 1][1] if j + 1 < len(starts) else END) - t
    print(f'  {nm:<8} {int(t // 60)}:{t % 60:05.2f}  {d:5.1f}s')
    if d > 25: Wn(f'LONG     scene {nm} lasts {d:.1f}s - split it or make sure something new moves every 3-4 s')
print(f'phrases checked: {len(starts)} scene starts, {nW} W()')

for m in warn: print('WARN ', m)
for m in err: print('ERROR', m)
if err and not FORCE: sys.exit(f'lbuild: {len(err)} errors, {len(warn)} warnings - index.html NOT written. Fix the errors and run again.')

# ---------------- 3. build ----------------
js_src = ''.join(open(os.path.join(V, f), encoding='utf-8').read() + '\n' for f in ('premium.js', 'life.js'))
js_src += open(os.path.join(K, 'news.js'), encoding='utf-8').read() + '\n' + V0
js = (f"const VERT=false;\nconst TW={json.dumps(TW, separators=(',', ':'))};\nconst HEAD={HEAD};\nconst END={END};\nconst TAIL={TAIL};\nconst TITLE={json.dumps(M.get('title'))};\n"
      + js_src + "\n" + open(os.path.join(V, 'kit.js'), encoding='utf-8').read())
h = open(os.path.join(V, 'template.html'), encoding='utf-8').read()
h = h.replace('family=Poppins:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700',
              'family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700;800')
DUR = round(END + TAIL, 2)
m = re.search(r"channel\s*:\s*(['\"])(.+?)\1", src); CH = m.group(2) if m else 'Tech News'
for a, b in (('%%DUR%%', str(DUR)), ('%%HEAD%%', str(HEAD)), ('%%AUD%%', str(AUD)), ('%%AUDIO%%', aud),
             ('%%TITLE%%', CH), ('%%W%%', '1920'), ('%%H%%', '1080'), ('%%JS%%', js)):
    h = h.replace(a, b)
if BGM:
    tag = f'<audio id="bgm" data-start="0" data-duration="{DUR}" data-track-index="1" data-volume="1" src="assets/bgm.m4a"></audio>'
    h = re.sub(r'(<audio id="voiceover"[^>]*></audio>)', lambda m: m.group(1) + '\n  ' + tag, h, count=1)
open(out, 'w', encoding='utf-8').write(h)
print(out, len(h), 'END', END, 'DUR', DUR, 'bgm' if BGM else 'no bgm', '(FORCED with errors)' if err else '')
