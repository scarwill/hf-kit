#!/usr/bin/env python3
# Netlight ML build:  python3 ~/hf-kit/netlight/nlbuild.py video.js <audio e.g. talk.m4a> [index.html]
# Run in the folder that has words.json + meta.json (from ~/hf-kit/video/align.py). LONG 1920x1080 only.
# timeline = HEAD 2.6 s (Intro A, no voice) + audio + TAIL 3.6 s (Outro A). Word times are shifted by HEAD; END = HEAD + audio length.
import json, sys, os
K = os.path.dirname(os.path.abspath(__file__)); V = os.path.join(K, '..', 'video')
vid, aud = sys.argv[1], sys.argv[2]; out = sys.argv[3] if len(sys.argv) > 3 else 'index.html'
HEAD, TAIL = 2.6, 3.6
M = json.load(open('meta.json')); AUD = M['END']; END = round(HEAD + AUD, 2)
TW = [[round(t + HEAD, 2), w] for t, w in json.load(open('words.json'))]
import re
V0 = open(vid, encoding='utf-8').read(); bad = 0
for i, l in enumerate(V0.split('\n'), 1):
    l2 = re.sub(r'//.*$', '', l)
    for m in re.finditer(r"(?<![\w.$'\"])(k[A-Z]\w*|chat|pill|card|bubble|charB|charP|botB|botP|person|wtext|useTheme|ic|ico)\s*\(", l2):
        print(f'BANNED  line {i}: {m.group(1)}()  -> Netlight uses nl* parts only (no Kurz k*, no Infographics helpers)'); bad += 1
    if re.search(r"NL\.acc|#b48cff", l2, re.I): print(f'WARN    line {i}: purple accent outside a title (<b> in nlScene titles only)')
if bad: sys.exit('nlbuild: fix the BANNED lines first')
src = ''.join(open(os.path.join(V, f), encoding='utf-8').read() + '\n' for f in ('premium.js', 'life.js'))
src += open(os.path.join(K, 'netlight.js'), encoding='utf-8').read() + '\n' + open(vid, encoding='utf-8').read()
js = (f"const VERT=false;\nconst TW={json.dumps(TW, separators=(',', ':'))};\nconst HEAD={HEAD};\nconst END={END};\nconst TAIL={TAIL};\nconst TITLE={json.dumps(M.get('title'))};\n"
      + src + "\n" + open(os.path.join(V, 'kit.js'), encoding='utf-8').read())
h = open(os.path.join(V, 'template.html'), encoding='utf-8').read()
h = h.replace('family=Poppins:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700',
              'family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700;800')
for a, b in (('%%DUR%%', str(round(END + TAIL, 2))), ('%%HEAD%%', str(HEAD)), ('%%AUD%%', str(AUD)), ('%%AUDIO%%', aud),
             ('%%TITLE%%', 'Netlight ML'), ('%%W%%', '1920'), ('%%H%%', '1080'), ('%%JS%%', js)):
    h = h.replace(a, b)
open(out, 'w', encoding='utf-8').write(h)
print(out, len(h), 'END', END, 'DUR', round(END + TAIL, 2))
