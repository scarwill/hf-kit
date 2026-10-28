#!/usr/bin/env python3
# LIGHT build:  python3 ~/hf-kit/light/lbuild.py video.js <audio e.g. talk.m4a> [index.html] [--short] [--no-bgm] [--force]
# Run in the folder that has words.json + meta.json (align.py). LONG 1920x1080 (default) or --short = YouTube Short 1080x1920
# (VERT=true, 810x1440 layout canvas scaled 4/3, no boot intro: HEAD 0.3 s, end card TAIL 1.2 s, HOOK([...]) + nlCaptions() required).
# 1. LINT    banned helpers (other looks, nlOrb, nlCmd, ORB_LOOK, nlNext, house helpers pasted again) -> ERROR
#            SHOTPX (nlShotHL with pixel numbers) / NOBOXES (nlShot image without lfind.py OCR boxes) -> ERROR
# 2. PHRASES every go / NEXT / W phrase is checked against words.json scene by scene (NEXT knows the scene starts):
#            NOTFOUND, SCENE START NOT AFTER THE PREVIOUS ONE, OUTSIDE (W fires in a later scene) -> ERROR ; AMBIGUOUS (phrase occurs again in the scene) -> WARN
# 3. BUILD   premium.js + life.js + light.js + video.js + kit.js into template.html; adds the bgm track (assets/bgm.m4a) unless --no-bgm.
# Any ERROR = no index.html is written (unless --force). Fix the errors, run again.
# timeline = HEAD 2.6 s (Intro A, no voice) + audio + TAIL 3.6 s (Outro A) (SHORT: 0.3 + audio + 1.2). Word times are shifted by HEAD; END = HEAD + audio length.
import json, sys, os, re
K = os.path.dirname(os.path.abspath(__file__)); V = os.path.join(K, '..', 'video')
args = [a for a in sys.argv[1:] if not a.startswith('--')]; FORCE = '--force' in sys.argv; BGM = '--no-bgm' not in sys.argv; SHORT = '--short' in sys.argv
vid, aud = args[0], args[1]; out = args[2] if len(args) > 2 else 'index.html'
HEAD, TAIL = (0.3, 1.2) if SHORT else (2.6, 3.6)
M = json.load(open('meta.json')); AUD = M['END']; END = round(HEAD + AUD, 2)
WJ = json.load(open('words.json')); TW = [[round(t + HEAD, 2), w] for t, w in WJ]
# the script's own words (case + punctuation) in words.json order, for on-screen captions (nlCaptions); null when they do not line up
CAPW = [t for st in M.get('sents', []) for t in st[2].split() if re.sub(r'[^a-z0-9]', '', t.lower())]
CAPW = CAPW if len(CAPW) == len(TW) else None
V0 = open(vid, encoding='utf-8').read()
err, warn = [], []
E = lambda m: err.append(m); Wn = lambda m: warn.append(m)

# ---------------- 1. lint ----------------
BAN = {r'k[A-Z]\w*|chat|pill|card|bubble|charB|charP|botB|botP|person|wtext|useTheme|ic|ico': 'other looks (Kurz / Infographics) - Light uses nl* parts only',
       r'nlOrb': 'use cOrb(scene, id) - the orb is always in the bottom-right corner',
       r'nlCmd': 'no bottom-left narrator line in Light',
       r'ORB_LOOK': 'no free eye direction - the eyes rest up-left, the kit adds blinks and camera looks (ORB_CAM)',
       r'nlNext': "use NEXT('#sN', 'first words') - it adds the whoosh cue and the scene checks",
       r'nlInit|nlIntro|nlOutro': 'use nlSetup(s) once at the top of build',
       r'nlStart|nlIntroBeats|nlOutroBeats|houseBeats|houseEnd|houseStart': 'use nlBegin([...]) first and nlFinish() last in beats'}
REDEF = r'(?:const|let|var|function)\s+(OX|OY|OR|ORBS|cOrb|arw|CUES|CUE|NEXT|nlShot|SHOT_FOCUS|nlShotHL|nlCursor|CURSOR|CLICK|houseStart|houseBeats|houseEnd|D|NL|HERO|HOOK|TYPE|W|go|tl)\b'
code = []
for i, l in enumerate(V0.split('\n'), 1):
    l2 = re.sub(r'//.*$', '', l); code.append(l2)
    for pat, why in BAN.items():
        for m in re.finditer(r"(?<![\w.$'\"])(" + pat + r")\s*\(", l2): E(f'BANNED   line {i}: {m.group(1)}()  -> {why}')
    m = re.search(REDEF, l2)
    if m: E(f'REDEFINE line {i}: {m.group(1)} is already in the kit (house helpers live in light.js now) - delete it from video.js')
    if re.search(r"NL\.acc|#b48cff", l2, re.I): Wn(f'PURPLE   line {i}: purple accent outside a title (<b> in nlScene titles only)')
    if re.search(r'[\U0001F300-\U0001FAFF☀-➿]', l2): E(f'EMOJI    line {i}: no emoji / symbol glyphs in code (draw them in SVG)')
    for m in re.finditer(r"\b(?:PULSE)\(\s*'#(\w+)'", l2):
        if re.search(r"nlHero\(\s*'" + m.group(1) + "'", V0): E(f'HERO     line {i}: never PULSE the hero #{m.group(1)} (it jumps) - pulse a part inside it')
src = '\n'.join(code)
line_of = lambda pos: src.count('\n', 0, pos) + 1
# screenshots: highlights / cursors by phrase only (OCR boxes from lfind.py), never hand-typed pixels
for m in re.finditer(r"nlShotHL\(\s*'[^']*'\s*,\s*'[^']*'\s*,\s*-?\d", src): E(f"SHOTPX   line {line_of(m.start())}: nlShotHL with pixel numbers - give the phrase from the page: nlShotHL('shot', 'hl', 'phrase')")
for m in re.finditer(r"nlShot\([^)]*?'(assets/[^']+\.(?:png|jpg|jpeg|webp))'", src):
    bx = os.path.splitext(m.group(1))[0] + '.boxes.json'
    if not os.path.exists(bx): E(f"NOBOXES  line {line_of(m.start())}: {m.group(1)} has no OCR boxes - run: python3 ~/hf-kit/light/lfind.py {m.group(1)}")
if 'nlCaptions(' in V0 and CAPW is None: E('CAPTIONS nlCaptions() but the script words do not line up with words.json - re-run align.py with the same script.txt')
bpos = src.find('return () =>')
if 'nlCaptions(' in src and bpos >= 0 and src.rfind('nlCaptions(') > bpos: E('CAPTIONS nlCaptions() is in the beats - call it at the end of build, before `return () => {` (in the beats every caption shows at once)')
if SHORT and 'nlCaptions(' not in src: E('CAPTIONS a Short needs nlCaptions() at the end of build (many viewers watch without sound)')
for need, why in (('nlSetup(', 'first line of build'), ('nlBegin(', 'first line of beats'), ('nlFinish(', 'last line of beats')):
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
    if d > (9 if SHORT else 25): Wn(f'LONG     scene {nm} lasts {d:.1f}s - split it or make sure something new moves every {"2-3" if SHORT else "3-4"} s')
print(f'phrases checked: {len(starts)} scene starts, {nW} W()')
if SHORT:
    # Studio (light/analytics.md): the 60 s Short was watched 32 s on average -> Netlight Shorts are 30-40 s
    if AUD > 180: E(f'SHORT    the voice is {AUD:.0f}s - YouTube Shorts are 3 min at most')
    elif AUD > 50: E(f'SHORT    the voice is {AUD:.0f}s - Netlight Shorts are 30-40 s: cut the script to 75-100 words and record again')
    elif AUD > 42: Wn(f'SHORT    the voice is {AUD:.0f}s - Netlight Shorts are 30-40 s (75-100 words); shorter keeps more viewers')
    if not re.search(r'(?<![\w.$])HOOK\(', src): E("HOOK     --short needs HOOK(['#part', ...]) right after nlBegin: the hook visual must be on screen at frame 0 (a black first second makes viewers swipe)")

for m in warn: print('WARN ', m)
for m in err: print('ERROR', m)
if err and not FORCE: sys.exit(f'lbuild: {len(err)} errors, {len(warn)} warnings - index.html NOT written. Fix the errors and run again.')

# ---------------- 3. build ----------------
js_src = ''.join(open(os.path.join(V, f), encoding='utf-8').read() + '\n' for f in ('premium.js', 'life.js'))
js_src += open(os.path.join(K, 'light.js'), encoding='utf-8').read() + '\n' + V0
import glob
BOXES = {}
for bf in glob.glob('assets/*.boxes.json'):
    for ext in ('.png', '.jpg', '.jpeg', '.webp'):
        if os.path.exists(bf[:-11] + ext): BOXES[bf[:-11] + ext] = json.load(open(bf))
js = (f"const VERT={'true' if SHORT else 'false'};\nconst NLCAPW={json.dumps(CAPW, ensure_ascii=False)};\nconst NLBOXES={json.dumps(BOXES, separators=(',', ':'))};\nconst TW={json.dumps(TW, separators=(',', ':'))};\nconst HEAD={HEAD};\nconst END={END};\nconst TAIL={TAIL};\nconst TITLE={json.dumps(M.get('title'))};\n"
      + js_src + "\n" + open(os.path.join(V, 'kit.js'), encoding='utf-8').read())
h = open(os.path.join(V, 'template.html'), encoding='utf-8').read()
h = h.replace('family=Poppins:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700',
              'family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700;800')
DUR = round(END + TAIL, 2)
for a, b in (('%%DUR%%', str(DUR)), ('%%HEAD%%', str(HEAD)), ('%%AUD%%', str(AUD)), ('%%AUDIO%%', aud),
             ('%%TITLE%%', 'Netlight ML'), ('%%W%%', '1080' if SHORT else '1920'), ('%%H%%', '1920' if SHORT else '1080'), ('%%JS%%', js)):
    h = h.replace(a, b)
if BGM:
    tag = f'<audio id="bgm" data-start="0" data-duration="{DUR}" data-track-index="1" data-volume="1" src="assets/bgm.m4a"></audio>'
    h = re.sub(r'(<audio id="voiceover"[^>]*></audio>)', lambda m: m.group(1) + '\n  ' + tag, h, count=1)
open(out, 'w', encoding='utf-8').write(h)
print(out, len(h), 'SHORT 1080x1920' if SHORT else 'LONG 1920x1080', 'END', END, 'DUR', DUR, 'bgm' if BGM else 'no bgm', '(FORCED with errors)' if err else '')
