#!/usr/bin/env python3
"""Captions for YouTube: captions.srt (and captions.vtt) on the VIDEO timeline (voice time + HEAD), from align.py's words.json + meta.json.
  python3 ~/hf-kit/light/lcaps.py [index.html]        run in the video folder after lbuild (HEAD is read from index.html)
Upload captions.srt in YouTube Studio -> Subtitles -> Upload file -> With timing. The words are the script's own words (case + punctuation).
Each cue is one sentence, or a part of it cut at a comma / every ~42 characters, at most 2 lines.
"""
import json, re, sys


def words_display(meta, n):
    """the script's own tokens (case, punctuation) in words.json order; None if they do not line up"""
    toks = [t for s in meta['sents'] for t in s[2].split() if re.sub(r'[^a-z0-9]', '', t.lower())]
    return toks if len(toks) == n else None


def chunks(words, maxc=42):
    """split one sentence (list of (t, word)) at commas / length into cues of <= 2 lines of maxc characters"""
    out, cur = [], []
    for w in words:
        cur.append(w)
        txt = ' '.join(x[1] for x in cur)
        if len(txt) > 2 * maxc - 6 or (w[1].endswith((',', ';', ':')) and len(txt) > maxc * .6):
            out.append(cur); cur = []
    if cur:
        if out and len(' '.join(x[1] for x in cur)) < 12:
            out[-1] += cur
        else:
            out.append(cur)
    return out


def two_lines(txt, maxc=42):
    if len(txt) <= maxc:
        return txt
    ws, best = txt.split(), None
    for i in range(1, len(ws)):
        a, b = ' '.join(ws[:i]), ' '.join(ws[i:])
        sc = max(len(a), len(b))
        if best is None or sc < best[0]:
            best = (sc, a + '\n' + b)
    return best[1]


def ts(t, sep=','):
    t = max(0, t); h, m = int(t // 3600), int(t % 3600 // 60); s = t % 60
    return f'{h:02d}:{m:02d}:{int(s):02d}{sep}{int(round((s - int(s)) * 1000)) % 1000:03d}'


def main():
    html = sys.argv[1] if len(sys.argv) > 1 else 'index.html'
    HEAD = float(re.search(r'const HEAD=([\d.]+);', open(html, encoding='utf-8').read()).group(1))
    W = json.load(open('words.json')); M = json.load(open('meta.json'))
    disp = words_display(M, len(W))
    if disp is None:
        sys.exit('lcaps: script words and words.json do not line up (re-run align.py with the same script.txt)')
    cues, k = [], 0
    for a, b, s in M['sents']:
        n = len([t for t in s.split() if re.sub(r'[^a-z0-9]', '', t.lower())])
        sw = [(W[k + i][0] + HEAD, disp[k + i]) for i in range(n)]; k += n
        for c in chunks(sw):
            cues.append([c[0][0], None, ' '.join(x[1] for x in c)])
        cues[-1][1] = b + HEAD + .25
    for i in range(len(cues) - 1):
        nxt = cues[i + 1][0] - .05
        cues[i][1] = min(cues[i][1], nxt) if cues[i][1] else nxt
    srt = ''.join(f'{i + 1}\n{ts(a)} --> {ts(b)}\n{two_lines(t)}\n\n' for i, (a, b, t) in enumerate(cues))
    open('captions.srt', 'w', encoding='utf-8').write(srt)
    open('captions.vtt', 'w', encoding='utf-8').write('WEBVTT\n\n' + ''.join(f'{ts(a, ".")} --> {ts(b, ".")}\n{two_lines(t)}\n\n' for a, b, t in cues))
    print(f'captions.srt + captions.vtt: {len(cues)} cues, HEAD {HEAD}s, {cues[0][0]:.2f}s - {cues[-1][1]:.2f}s')


if __name__ == '__main__':
    main()
