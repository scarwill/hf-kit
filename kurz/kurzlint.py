#!/usr/bin/env python3
"""kurzlint.py video.js  -> fails (exit 1) if a Kurz video uses Infographics-style helpers.
Run before build.py in every Kurzgesagt-style video. Fix every BANNED line; look at every WARN."""
import re, sys

BANNED = {
 # Infographics text widgets -> use kCallout / kSay / kBigNum
 'chat': 'kSay (<=4 words) or kCallout', 'pill': 'kCallout', 'bubble': 'kSay', 'say': 'kSay', 'thought': 'kSay',
 'card': 'kTablet / kScreen', 'docSheet': 'kTablet', 'stamp': 'kBigNum or a red kCallout', 'token': 'kCube(glyph) / kAttn', 'txt': 'kCallout',
 'tln': 'kTablet lines', 'codeCard': 'kCode', 'win': 'kScreen', 'wordC': 'kCube(glyph)',
 # flat icons -> draw the real object shaded (kBall/kBlob/kShade) or use kurz props
 'ic': 'a shaded real object (kBall/kBlob/kShade) or kCrystal/kCube/kMind', 'ico': 'a shaded real object',
 # Infographics rooms / themes / room props
 'scene': 'kWorld', 'useTheme': 'kWorld palette', 'room': 'kWorld', 'street': 'kWorld', 'skyline': 'kMountain/kWorld hills',
 'windowPane': 'kWorld', 'tower': 'kServer / kMountain', 'shelf': 'remove', 'plant': 'kTree/kGrass', 'clock': 'remove',
 'lamp': 'kGlow', 'crate': 'kCube', 'book': 'kTablet', 'bookPile': 'kTablet', 'heads': 'kFgRocks/kFgPlants', 'cone': 'kWorld rays',
 'fgHeads': 'kFgRocks/kFgPlants', 'fgLeaves': 'kFgPlants', 'fgBox': 'kFgRocks', 'moodLayer': 'OK only with dim/glow - allowed',
 # Infographics characters / robots
 'charB': 'kBean', 'botB': 'kMind (or kBot)', 'charP': 'kBean', 'botP': 'kMind (or kBot)',
 'person': 'kBean', 'kKid': 'kBean', 'kKidTalk': 'kTalk', 'kBlobby': 'kBean', 'kHuman': 'kBean (user: faces looked drunk)', 'kSlim': 'kBean (user: faces looked drunk)', 'kTurn': 'kGaze (front view only)',
 'kCore': 'kMind (planet-orb model was rejected)',
 # flat tech props -> kurz/tech.js
 'laptop': 'kScreen', 'server': 'kServer', 'gpu': 'kCube / kServer', 'phone': 'kPhone2', 'desktop': 'kScreen', 'chipM': 'kMind / kBox3D',
 'brainBox': 'kMind', 'block': 'kCube', 'funnelG': 'shaded custom drawing', 'okM': 'kCallout', 'noWifi': 'shaded custom drawing',
 'nnet': 'kNet / kStack', 'fire': 'kFIRE', 'encT': 'kVector', 'vecG': 'kVector', 'pixImg': 'shaded custom drawing', 'bulb': 'kGlow + kBall',
 'gearG': 'shaded custom drawing', 'ballG': 'kBall', 'liar': 'dim(t) + pink kCrystal',
 'eyeBig': 'kEye2 / kEyeFull', 'brainG': 'kBrain2', 'ghostG': 'shaded custom drawing', 'fakePaper': 'kTablet', 'treeG': 'kTree', 'sunG': 'kSun', 'flowerG': 'kGrass/kTree',
}
BANNED.pop('moodLayer')
src = open(sys.argv[1] if len(sys.argv) > 1 else 'video.js', encoding='utf-8').read()
lines = src.split('\n'); bad = warn = 0
for i, raw in enumerate(lines, 1):
    line = re.sub(r"//.*$", '', raw)
    for m in re.finditer(r"(?<![\w.$'\"])([A-Za-z_$][\w$]*)\s*\(", line):
        name = m.group(1)
        if name in BANNED and not re.search(r'function\s+' + re.escape(name) + r'\b', line):
            print(f'BANNED  line {i}: {name}()  -> use {BANNED[name]}'); bad += 1
    # outlines on shapes (Kurz look has no outlines); thin lines/arrows/rings are fine
    if re.search(r"S\('(rect|circle|ellipse|path)'[^)]*fill: *'#[0-9a-fA-F]{3,6}'[^)]*stroke: *'#", line) and 'stroke-width' in line:
        print(f'WARN    line {i}: filled shape with an outline stroke (Kurz look = no outlines, shade instead)'); warn += 1
    if re.search(r"fill: *'#(fff|ffffff|f8fafc|eef3ff)'", line, re.I) and re.search(r"S\('rect'", line):
        print(f'WARN    line {i}: white rect = paper/card look (use kTablet / a coloured shaded slab)'); warn += 1
    for t in re.findall(r"(?:wtext|kCallout|kSay)\([^;]*?'([^']{2,})'", line):
        if len(t.split()) > 4: print(f'WARN    line {i}: text "{t}" > 4 words (Kurz labels are 1-4 words)'); warn += 1
n_txt = len(re.findall(r'\bwtext\(', src)); n_area = len(re.findall(r'\bkWorld\(', src)) or 1
if n_txt > n_area * 2: print(f'WARN    {n_txt} wtext() for {n_area} areas (> 2 per area): too much text, show it instead'); warn += 1
print(f'kurzlint: {bad} banned, {warn} warnings'); sys.exit(1 if bad else 0)
