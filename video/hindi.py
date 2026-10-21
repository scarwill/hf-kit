# Devanagari -> plain a-z tokens, so Hindi scripts work with align.py / phrasecheck.py / W('...').
# Same rules as romanize() in kit.js (keep both in sync): consonant + inherent 'a', matras replace it, virama drops it,
# nukta ignored (ज़ -> j), anusvara/chandrabindu -> n, visarga -> h. Example: 'मेथुसेला' -> 'methuselaa', 'पिरामिड' -> 'piraamida'.
import re
V = {'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ii', 'उ': 'u', 'ऊ': 'uu', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'ऋ': 'ri', 'ऑ': 'o'}
M = {'ा': 'aa', 'ि': 'i', 'ी': 'ii', 'ु': 'u', 'ू': 'uu', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ृ': 'ri', 'ॉ': 'o', 'ॅ': 'e'}
C = dict(zip('कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह',
             'k kh g gh n ch chh j jh n t th d dh n t th d dh n p ph b bh m y r l v sh sh s h'.split()))
DEV = re.compile('[ऀ-ॿ]')

def romanize(w):
    o, i, w = '', 0, w.replace('़', '')
    while i < len(w):
        c = w[i]
        if c in C:
            o += C[c]; nx = w[i + 1] if i + 1 < len(w) else ''
            if nx in M: o += M[nx]; i += 1
            elif nx == '्': i += 1
            else: o += 'a'
        elif c in V: o += V[c]
        elif c in 'ंँ': o += 'n'
        elif c == 'ः': o += 'h'
        else: o += c
        i += 1
    return o

def tok(w):
    """one spoken word -> the token stored in words.json and matched by W()"""
    return re.sub(r'[^a-z0-9]', '', (romanize(w) if DEV.search(w) else w).lower())
