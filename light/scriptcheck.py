#!/usr/bin/env python3
"""Netlight script check: catches the script mistakes the channel's own Studio numbers showed (Oct 2026, light/analytics.md).

  python3 ~/skit/light/scriptcheck.py script.txt [--short] [--title "..."] [--thumb "..."] [--promise "fake log, tests passed"]

script.txt = only the spoken lines (one sentence per line is best; lines starting with '#' are ignored).
--title   the planned video title       -> length, acronyms, whether its words are said early
--thumb   the planned thumbnail text    -> word count, acronyms, same claim as the title
--promise words that pay off the title (the title says "lied", the script says "fake log") -> when they are first spoken
--past    folder of earlier scripts (default: light/scripts) -> 5-word phrases this script shares with 2+ of them

ERROR = fix before the user records the TTS. WARN = look at it and decide. Exit code 1 when there is an ERROR.
"""
import argparse, glob, os, re, sys

WPM = 155   # the user's TTS speaks about 150-160 words a minute
# lines that were in 3+ of the last 5 long scripts: viewers who come back hear the same template
STOCK = ["stick with me", "here's the twist", "here is the twist", "quick question for you", "to be clear",
         "this isn't magic", "this is not magic", "let's be honest", "let us be honest", "so here's my question for you",
         "so here is my question for you", "tell me in the comments", "drop your answer in the comments",
         "drop your guess in the comments", "then came the hard part", "see you in the next one", "by the end, you'll",
         "by the end you'll", "and the idea is spreading", "so remember the question from the start", "so remember that"]
# allowed once per video: they work, but not every video
ONCE = ["according to the paper", "here's the catch", "here is the catch", "but here's the part", "now watch"]
# words a new viewer does not know. Each one in the first minute (or anywhere in a Short) counts.
JARGON = {"token", "tokens", "transformer", "transformers", "diffusion", "parameter", "parameters", "vector", "vectors",
          "embedding", "embeddings", "gradient", "gradients", "latent", "codebook", "decoder", "encoder", "attention",
          "recurrent", "inference", "benchmark", "benchmarks", "quantization", "quantized", "backpropagation", "logits",
          "softmax", "residual", "autoregressive", "pseudo", "disassembly", "decompiler", "decompilation", "assembly",
          "binary", "binaries", "protocol", "architecture", "registry", "provider", "providers", "deterministic",
          "fine-tuning", "finetuning", "pretraining", "reinforcement", "heuristic", "convolutional", "manifold",
          "distribution", "regression", "classifier", "optimizer", "epoch", "epochs", "weights", "neuron", "neurons"}
KNOWN = {"AI", "GPU", "GPUs", "CPU", "CPUs", "USA", "US", "UK", "OK", "TV", "PC", "DNA", "ID", "IDs", "URL", "PDF", "API",
         "GB", "MB", "TB", "KB", "VS", "X", "AM", "PM", "GPT", "CEO", "NASA", "MIT", "IBM", "PS", "VR", "LED", "I"}
STOP = set("a an the of to in on for and or but is are was were be been it its this that these those with without by as at from "
           "how why what who when where which your you i we they he she my our their just not no yes so if then than vs versus "
           "explained explain inside new real actually here there can could will would does do did doesn't don't".split())
TSTOP = set("isn't here's about works work does really actually inside secret way".split())


def words(s):
    return re.findall(r"[A-Za-z0-9][A-Za-z0-9'\-]*", s)


def acronyms(s):
    return [w for w in re.findall(r"\b[A-Z][A-Z0-9]{1,6}s?\b", s) if w not in KNOWN and not w.isdigit() and not re.fullmatch(r"\d+[A-Z]?", w)]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('script'); ap.add_argument('--short', action='store_true')
    ap.add_argument('--title', default=''); ap.add_argument('--thumb', default=''); ap.add_argument('--promise', default='')
    ap.add_argument('--past', default=os.path.join(os.path.dirname(os.path.abspath(__file__)), 'scripts'))
    a = ap.parse_args()
    raw = [l.strip() for l in open(a.script, encoding='utf-8') if l.strip() and not l.strip().startswith('#')]
    text = ' '.join(raw)
    sents = [s.strip() for s in re.split(r'(?<=[.!?])\s+', text) if s.strip()]
    W = words(text); n = len(W); low = [w.lower() for w in W]
    sec = lambda i: i * 60 / WPM
    E, Wn, I = [], [], []
    I.append(f'{n} words, about {n * 60 / WPM:.0f} s of TTS ({len(sents)} sentences)')

    # length
    if a.short:
        if n > 110: E.append(f'LENGTH   {n} words: a Short is 75-100 words (30-40 s). Cut beats the payoff does not need.')
        elif n > 100: Wn.append(f'LENGTH   {n} words: aim for 75-100 (30-40 s); the 188-word Short was watched 32 of 57 s')
        elif n < 65: Wn.append(f'LENGTH   {n} words: short for a Short (75-100)')
    else:
        if n < 600: Wn.append(f'LENGTH   {n} words: about {n * 60 / WPM / 60:.1f} min; long videos are 5-8 min (750-1250 words)')
        if n > 1400: Wn.append(f'LENGTH   {n} words: about {n * 60 / WPM / 60:.1f} min; past 8 min only if every minute pays off')

    # hook
    first = words(sents[0]) if sents else []
    lim = 8 if a.short else 14
    if len(first) > lim: Wn.append(f'HOOK     first sentence has {len(first)} words (<= {lim}): "{sents[0][:80]}"')
    two = ' '.join(sents[:2]).lower()
    if not re.search(r'\d|\b(one|two|three|four|five|six|seven|eight|nine|ten|hundred|thousand|million|billion|percent|times)\b', two) \
            and not re.search(r'\bnot\b|\bbut\b|\?|\bvs\b|\bthan\b', two):
        Wn.append('HOOK     the first two sentences have no number, no contrast and no question - the hooks that held viewers had one ("19 neurons. Not 19 million.")')
    if acronyms(' '.join(sents[:2])): E.append(f'HOOK     acronym in the first two sentences: {sorted(set(acronyms(" ".join(sents[:2]))))} - say what it does instead')

    # jargon early
    span = n if a.short else min(n, WPM)          # Short: everywhere; long: the first minute
    jw = [W[i] for i in range(span) if low[i] in JARGON or W[i] in acronyms(W[i])]
    lim = 1 if a.short else 2
    allj = sorted(set(w.lower() for w in jw))
    if len(allj) > lim:
        where = 'in the Short' if a.short else 'in the first minute'
        (E if len(allj) > lim + 2 else Wn).append(f'JARGON   {len(allj)} technical words {where} ({", ".join(allj)}): at most {lim}, each explained in the same sentence')

    # stock lines
    tl = text.lower().replace('’', "'")
    for p in STOCK:
        c = tl.count(p)
        if c: E.append(f'STOCK    "{p}" x{c} - a line from the old template (in 3+ of the last 5 videos). Write this moment in new words.')
    for p in ONCE:
        c = tl.count(p)
        if c > 1: Wn.append(f'REPEAT   "{p}" x{c} - once per video at most')

    # TTS
    for s in sents:
        if len(words(s)) > 20: Wn.append(f'TTS      long sentence ({len(words(s))} words): "{s[:70]}..."')
        if re.search(r'[%&/()\[\]<>=+*#@]', s): Wn.append(f'TTS      symbol the voice may misread: "{s[:70]}"')

    # title + promise
    def first_said(term):
        t = [w.lower() for w in words(term)]
        if not t: return None
        for i in range(n - len(t) + 1):
            if all(low[i + k].startswith(t[k][:max(4, len(t[k]) - 2)]) for k in range(len(t))): return i
        return None
    lim_s = 10 if a.short else 45
    if a.title:
        if len(a.title) > (50 if a.short else 60): Wn.append(f'TITLE    {len(a.title)} characters (<= {50 if a.short else 60})')
        acr = acronyms(re.sub(r'\(.*?\)', '', a.title))
        if acr: E.append(f'TITLE    acronym {acr} outside brackets - NCM / RSI titles got 0.4-0.8% clicks. Plain words first, "(XYZ Explained)" at the end is fine')
        keys = [w for w in words(re.sub(r'\(.*?\)', '', a.title)) if w.lower() not in STOP and w.lower() not in TSTOP and not w.isupper() and len(w) > 2]
        said = {k: first_said(k) for k in keys}
        for k, i in said.items(): I.append(f'title word "{k}" ' + ('never said' if i is None else f'first said at ~{sec(i):.0f} s'))
        if keys and not [k for k, i in said.items() if i is not None and sec(i) <= lim_s]:
            Wn.append(f'PROMISE  none of the title words ({", ".join(keys)}) is said in the first {lim_s} s - the first lines must make the claim of the title (or give --promise)')
        if not a.promise: Wn.append('PROMISE  no --promise given: name the words that pay off the title (the RSI title said "lied", the fake log came at ~6 min)')
    for p in [x.strip() for x in a.promise.split(',') if x.strip()]:
        i = first_said(p)
        if i is None: E.append(f'PROMISE  "{p}" is never said')
        elif sec(i) > lim_s: (E if sec(i) > 120 else Wn).append(f'PROMISE  "{p}" first said at ~{sec(i):.0f} s - show the promised thing in the first {lim_s} s, explain how after')
        else: I.append(f'promise "{p}" first said at ~{sec(i):.0f} s')
    if a.thumb:
        tw = words(a.thumb)
        if len(tw) > 5: E.append(f'THUMB    {len(tw)} words - 2-4 big words read on a phone')
        elif len(tw) > 4: Wn.append(f'THUMB    {len(tw)} words - 2-4 read best')
        caps = {c.upper() for c in set(acronyms(text)) | set(acronyms(a.title))}
        tac = [w for w in tw if w.upper() in caps or (len(w) >= 2 and w.isupper() and w not in KNOWN and not re.search(r'[AEIOUY]', w) and not w.isdigit())]
        if a.thumb != a.thumb.upper(): tac += acronyms(a.thumb)
        if tac: E.append(f'THUMB    acronym {sorted(set(tac))} - nobody in the feed knows it yet')
        if a.title and not set(w.lower() for w in tw) & set(w.lower() for w in words(a.title)) and not re.search(r'\d', a.thumb):
            Wn.append('THUMB    shares no word or number with the title - title, thumbnail and first line must make the SAME claim')

    # phrases reused from earlier scripts (the template problem, measured)
    grams = lambda ws: {' '.join(ws[i:i + 5]) for i in range(len(ws) - 4)}
    norm = lambda t: [w.lower().replace('’', "'") for w in words(t)]
    mine = grams(norm(text)); seen = {}
    for f in sorted(glob.glob(os.path.join(a.past, '*.txt'))):
        if os.path.abspath(f) == os.path.abspath(a.script): continue
        for g in mine & grams(norm(open(f, encoding='utf-8').read())): seen[g] = seen.get(g, 0) + 1
    reused = sorted(g for g, c in seen.items() if c >= 2)
    if reused: Wn.append(f'REUSED   {len(reused)} phrase(s) also in 2+ earlier scripts: ' + ' | '.join(reused[:8]) + ' - write them new')

    for m in I: print('INFO ', m)
    for m in Wn: print('WARN ', m)
    for m in E: print('ERROR', m)
    print(f'scriptcheck: {len(E)} errors, {len(Wn)} warnings')
    sys.exit(1 if E else 0)


if __name__ == '__main__':
    main()
