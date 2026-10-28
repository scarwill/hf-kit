#!/usr/bin/env python3
# SCRIPTCHECK (decided 28 Oct 2026, from analytics.md): run on every script BEFORE sending it; paste the result under the script.
#   python3 ~/nkit/news/scriptcheck.py script_N.txt          (Short)
#   python3 ~/nkit/news/scriptcheck.py script.txt --long     (Big Story long video)
# Short rules (BRAND.md "Click + watch rules"), tested on our 11 real Shorts (28 Oct 2026): under 45 s (~135 words at the user's
# Clipchamp speed, 110 words = 37.5 s), max 2 jargon names besides the main subject (versions, CamelCase names, acronyms).
# Word count < 135, numbers and first-sentence length did NOT separate our best from our worst Shorts, so they are info / WARN only.
# Topic (the main factor) is flagged as WARN for breach / outage / advisory words: such a Short needs a strange-fact angle.
# Long rules: the story starts in the first ~55 words (no "First, what is X?" intro), 600-1000 words.
# Exit code 1 = FAIL (fix the script before sending it). WARN = look again, may be fine.
import re, sys, collections
LONG = '--long' in sys.argv
path = [a for a in sys.argv[1:] if not a.startswith('--')][0]
text = open(path, encoding='utf-8').read().strip()
lines = [l.strip() for l in text.splitlines() if l.strip()]
words = re.findall(r"[A-Za-z0-9][A-Za-z0-9.'$%-]*", text)
sents = [s.strip() for s in re.split(r'(?<=[.?!])\s+', ' '.join(lines)) if s.strip()]
WPS = 110 / 37.5        # Clipchamp voice as measured 28 Oct 2026 (110 words = 37.5 s, 119 = 38.4 s)
fails, warns, info = [], [], []

# spoken numbers: a run of number words / digits counts as one number ("nineteen ninety nine" = 1)
NUMW = set('two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty thirty forty fifty sixty seventy eighty ninety hundred hundreds thousand thousands million millions billion billions trillion percent half'.split())
nums, run = [], []
for w in re.findall(r"[A-Za-z0-9.$%,'-]+", text):
    lw = w.lower().strip(".,'")
    isnum = lw in NUMW or bool(re.search(r'\d', lw)) or (lw in ('one', 'a', 'and', 'point') and run)
    if isnum: run.append(lw)
    else:
        if run and any(x not in ('one', 'a', 'and', 'point') for x in run): nums.append(' '.join(run))
        run = []
if run and any(x not in ('one', 'a', 'and', 'point') for x in run): nums.append(' '.join(run))

# jargon names: versions (letters+digits, dotted numbers), CamelCase (GitHub, macOS, SGLang), acronyms of 3+ caps (GPU, SSH, CVE)
ALLOW = {'AI', 'OK', 'US', 'UK', 'ID', 'CEO', 'TV', 'PC'}
jar = collections.Counter()
for w in re.findall(r"[A-Za-z0-9][A-Za-z0-9.+-]*[A-Za-z0-9]", text):
    w2 = re.sub(r"'s$", '', w)
    if w2 in ALLOW: continue
    if (re.search(r'[A-Za-z]', w2) and re.search(r'\d', w2)) or re.fullmatch(r'\d+\.\d+(\.\d+)*', w2) \
       or re.search(r'[a-z][A-Z]', w2) or re.fullmatch(r'[A-Z]{3,}', w2): jar[w2] += 1
main = jar.most_common(1)[0][0] if jar else None
extra = [w for w in jar if w != main]

HEDGE = re.compile(r"\b(but|the catch|however|only|not yet|reportedly|no sign|no proof|unconfirmed|nobody has|to be fair|caveat)\b", re.I)
hedges = [s for s in sents if HEDGE.search(s)]

n = len(words); secs = n / WPS
if not LONG:
    if secs > 45: fails.append(f'~{secs:.0f} s ({n} words): keep under 45 s (~135 words). Our 3 longest Shorts (50-53 s) were in the bottom 4.')
    elif n < 80: warns.append(f'words {n}: short, check the story is complete')
    first = sents[0] if sents else ''; fw = len(first.split())
    if fw > 16: warns.append(f'first sentence {fw} words: long (our best hooks were 4-14 words)')
    if len(nums) > 5: warns.append(f'{len(nums)} spoken numbers: a lot ({", ".join(nums)})')
    if len(extra) > 2: fails.append(f'{len(extra)} jargon names besides "{main}": max 2 ({", ".join(extra)}). Our best 3 Shorts had none.')
    ADV = re.compile(r"\b(hack(ed|ers)?|breach(ed)?|outage|went down|rotate|patch|vulnerab\w*|CVE|malware|backdoor|leak(ed)?|stole|update today)\b", re.I)
    adv = sorted({m.group(0).lower() for m in ADV.finditer(text)})
    if adv: warns.append(f'breach / outage / advisory story ({", ".join(adv)}): our weakest type unless it has a strange fact (key = 4, leaked 3 times). Max 1 a day.')
    if len(hedges) > 3: warns.append(f'{len(hedges)} caveat / hedge sentences: aim for 1-2 short lines')
    last = sents[-1] if sents else ''
    if re.match(r"(?i)(update|rotate|run|check|delete|put|turn|install|patch|sandbox|use)\b", last):
        warns.append(f'ends on an instruction ("{last[:50]}"): end on the fact or a question that loops to the hook')
else:
    head = ' '.join(words[:120]).lower()
    if re.search(r'\bfirst,? what is\b|\bbefore we (start|begin)\b|\blet me explain\b', head):
        fails.append('slow intro in the first ~45 s ("First, what is X?" / "before we start"): start the story, explain later')
    if n < 600 or n > 1000: warns.append(f'words {n} (~{secs / 60:.1f} min): Big Story long = 4-6 min (~650-970 words)')
    per100 = len(jar) * 100 / max(n, 1)
    if per100 > 3: warns.append(f'{len(jar)} distinct jargon names ({per100:.1f} per 100 words): explain or cut some')

info.append(f'words {n} (~{secs:.0f} s) | first sentence {len(sents[0].split()) if sents else 0} words | numbers {len(nums)}: {", ".join(nums) or "-"} | jargon: {", ".join(f"{k}x{v}" for k, v in jar.most_common()) or "-"} (main: {main or "-"}) | hedge sentences {len(hedges)}')
print('SCRIPTCHECK ' + ('FAIL' if fails else 'PASS') + f'  {path}' + ('  (long)' if LONG else ''))
for x in info: print('  ' + x)
for x in fails: print('  FAIL  ' + x)
for x in warns: print('  WARN  ' + x)
sys.exit(1 if fails else 0)
