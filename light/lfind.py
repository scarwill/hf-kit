#!/usr/bin/env python3
# LIGHT lfind: OCR every word of a screenshot ONCE, so highlights and cursors are placed by phrase, never by hand-typed pixels.
#   python3 ~/hf-kit/light/lfind.py assets/paper.png ["phrase" ...]
# Writes assets/paper.boxes.json  {"w": W, "h": H, "words": [[text, x, y, w, h, line_key], ...]}  (original image pixels).
# lbuild.py embeds every assets/*.boxes.json into the page; nlShotHL(shot, id, 'phrase') and CURSOR_TO(cur, shot, 'phrase', t)
# look the phrase up there. Optional phrases on the command line are looked up right away (same rules as the kit) and printed.
# Needs tesseract:  apt-get install -y tesseract-ocr && pip install pytesseract
import sys, json, re, os
import pytesseract
from PIL import Image, ImageOps

S = 2   # OCR on a 2x upscale: small UI text is read far more reliably


def ocr(path):
    im = Image.open(path).convert('RGB'); big = im.resize((im.width * S, im.height * S))
    words = []
    # 4 passes: normal + inverted (dark pages), page layout (keeps lines together) + sparse text (finds labels in figures)
    for pi, img in enumerate((big, ImageOps.invert(big))):
        for pj, psm in enumerate((3, 11)):
            d = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT, config=f'--psm {psm}')
            for i, t in enumerate(d['text']):
                t = t.strip()
                if not t or float(d['conf'][i]) < 20: continue
                key = (pi * 2 + pj) * 1000000 + d['block_num'][i] * 10000 + d['par_num'][i] * 100 + d['line_num'][i]
                words.append([t, round(d['left'][i] / S, 1), round(d['top'][i] / S, 1), round(d['width'][i] / S, 1), round(d['height'][i] / S, 1), key])
    return im.size, words


nz = lambda s: re.sub(r'[^a-z0-9.%]', '', s.lower())


def lev(a, b):
    if abs(len(a) - len(b)) > 2: return 9
    p = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        c = [i]
        for j, cb in enumerate(b, 1): c.append(min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (ca != cb)))
        p = c
    return p[-1]


def same(w, q, fuzzy):
    # exact, or (fuzzy pass) 1 wrong letter for words of 3+ chars, 2 for 8+ chars (OCR reads 'ncm' as 'nem' on dark pages)
    return w == q or (fuzzy and len(q) >= 3 and lev(w, q) <= (2 if len(q) >= 8 else 1))


def hits(words, phrase, fuzzy=None):
    # same matching as nlFindBox in light.js: consecutive words on one OCR line; 'A..B' = from A to B on the same row
    if fuzzy is None:
        h = hits(words, phrase, False)
        return h if h else [b + ('fuzzy',) for b in hits(words, phrase, True)]
    if '..' in phrase:
        a, b = [p.strip() for p in phrase.split('..', 1)]; out = []
        for ha in hits(words, a, fuzzy):
            cands = [hb for hb in hits(words, b, fuzzy) if hb[0] > ha[0] and abs((ha[1] + ha[3] / 2) - (hb[1] + hb[3] / 2)) < max(ha[3], hb[3]) * .6]
            if cands:
                hb = min(cands, key=lambda h: h[0]); x0, y0 = min(ha[0], hb[0]), min(ha[1], hb[1])
                out.append((x0, y0, max(ha[0] + ha[2], hb[0] + hb[2]) - x0, max(ha[1] + ha[3], hb[1] + hb[3]) - y0))
        return dedup(out)
    q = [w for w in (nz(x) for x in phrase.split()) if w]; out = []
    for i in range(len(words)):
        if not same(nz(words[i][0]), q[0], fuzzy): continue
        seq, j = [words[i]], i + 1
        while len(seq) < len(q) and j < len(words) and words[j][5] == words[i][5]:
            n = nz(words[j][0])
            if same(n, q[len(seq)], fuzzy): seq.append(words[j])
            elif n: break
            j += 1
        if len(seq) == len(q):
            x0, y0 = min(s[1] for s in seq), min(s[2] for s in seq)
            out.append((x0, y0, max(s[1] + s[3] for s in seq) - x0, max(s[2] + s[4] for s in seq) - y0))
    return dedup(out)


def dedup(bs):
    out = []
    for b in bs:
        if not any(iou(b, o) > .5 for o in out): out.append(b)
    return sorted(out, key=lambda b: (round(b[1] / 8), b[0]))


def iou(a, b):
    ix = max(0, min(a[0] + a[2], b[0] + b[2]) - max(a[0], b[0])); iy = max(0, min(a[1] + a[3], b[1] + b[3]) - max(a[1], b[1]))
    u = a[2] * a[3] + b[2] * b[3] - ix * iy
    return ix * iy / u if u else 0


if __name__ == '__main__':
    if len(sys.argv) < 2: sys.exit(__doc__ or 'usage: lfind.py image.png ["phrase" ...]')
    path = sys.argv[1]; out = os.path.splitext(path)[0] + '.boxes.json'
    if os.path.exists(out) and os.path.getmtime(out) >= os.path.getmtime(path):
        J = json.load(open(out)); size, words = (J['w'], J['h']), J['words']
    else:
        size, words = ocr(path); json.dump({'w': size[0], 'h': size[1], 'words': words}, open(out, 'w'))
    hs = sorted(w[4] for w in words); med = hs[len(hs) // 2] if hs else 0
    print(f'{out}: {len(words)} words, image {size[0]}x{size[1]}, median word height {med:.0f} px')
    # a word touching the image border = the crop cut through text (half a row / half a tab label) -> crop again between rows
    edge = sorted({(w[0], round(w[1]), round(w[2])) for w in words if len(re.sub(r'[^A-Za-z0-9]', '', w[0])) >= 2 and (w[1] <= 3 or w[2] <= 3 or w[1] + w[3] >= size[0] - 3 or w[2] + w[4] >= size[1] - 3)})
    if edge: print(f'  EDGE: {len(edge)} word(s) touch the image border (cut by the crop) - crop between rows/columns: ' + ', '.join(f'"{t}" x{x} y{y}' for t, x, y in edge[:8]))
    for ph in sys.argv[2:]:
        h = hits(words, ph)
        print(f'  {ph!r}: ' + ('NOT FOUND' if not h else '  '.join(f'#{k + 1} x{b[0]:.0f} y{b[1]:.0f} w{b[2]:.0f} h{b[3]:.0f}' + (' (fuzzy: check it)' if len(b) > 4 else '') for k, b in enumerate(h))))
