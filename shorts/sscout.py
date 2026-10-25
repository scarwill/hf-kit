#!/usr/bin/env python3
"""net-shorts scout: which DS / ML / AI concepts work as YouTube Shorts right now, for Netlight ML?

  python3 sscout.py --channel @handle            full run -> shorts-out/shorts_<date>.md + .json (prints the report)
  python3 sscout.py --yt "kv cache" "lora"        only check the Shorts views for these searches

Uses ../trends/scout.py (same concepts.txt and momentum sources: Hugging Face papers / trending models, Hacker News) and adds:
- Shorts demand: the Shorts shelf of a YouTube search for every concept (title + views of each Short),
- the channel's own Shorts tab (what was already made -> flag MADE, so ideas do not repeat) and its latest long videos
  (the "cut Shorts from these" list).
No API keys, no login.
"""
import argparse, importlib.util, json, math, os, re, statistics, sys, time, urllib.parse

HERE = os.path.dirname(os.path.abspath(__file__))
_spec = importlib.util.spec_from_file_location('scout', os.path.join(HERE, '..', 'trends', 'scout.py'))
sc = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(sc)

# a Short counts for a concept only when its title is about ML: an AI / ML word, or a multi-word concept term ("bayes theorem").
# Without this "dropout", "pca", "clip" or "distillation" pull in pageants, baseball, hairstyles and crude oil.
ML_CTX = re.compile(sc.AI_CTX.pattern[:-len(')(?![a-z])')] + r'|machine learning|deep learning|data science|datascience|statistics|algorithms?|'
                    r'python|computer vision|nlp|maths?|probability|ai)(?![a-z])', re.I)
HINGLISH = re.compile(r'(?<![a-z])(kaise|kya|hai|banaye|banaen|sikhe|seekhe|karo|kare)(?![a-z])', re.I)
VIEWS_RE = re.compile(r'^(.*), ([\d.,]+)\s*(thousand|million|billion)?\s*views?\b', re.S)
MULT = {None: 1, 'thousand': 1e3, 'million': 1e6, 'billion': 1e9}


def yt_data(url):
    h = sc.get(url)
    m = re.search(r'var ytInitialData = (\{.*?\});</script>', h or '', re.S)
    return json.loads(m.group(1)) if m else None


def find(o, key, out):
    if isinstance(o, dict):
        if key in o:
            out.append(o[key])
        for v in o.values():
            find(v, key, out)
    elif isinstance(o, list):
        for v in o:
            find(v, key, out)
    return out


def shorts_in(d):
    """every Short (shortsLockupViewModel) in a ytInitialData blob -> [{title, views, url}]"""
    out, seen = [], set()
    for s in find(d, 'shortsLockupViewModel', []):
        m = VIEWS_RE.match(s.get('accessibilityText') or '')
        vid = (((s.get('onTap') or {}).get('innertubeCommand') or {}).get('reelWatchEndpoint') or {}).get('videoId')
        if not m or vid in seen:
            continue
        seen.add(vid)
        out.append({'title': m.group(1).strip(), 'views': int(float(m.group(2).replace(',', '')) * MULT[m.group(3)]),
                    'url': f'https://www.youtube.com/shorts/{vid}'})
    return out


def relevant(c, title):
    t = title.lower()
    return bool(ML_CTX.search(title)) or any((' ' in x or '-' in x) and x in t for x in c['terms'])


def shorts_check(q, c=None):
    d = yt_data('https://www.youtube.com/results?' + urllib.parse.urlencode({'search_query': q, 'hl': 'en', 'gl': 'US'}))
    time.sleep(0.5)
    if d is None:
        return {'query': q, 'ok': False, 'n': 0, 'median': 0, 'max': 0, 'india_share': 0, 'shorts': []}
    s = shorts_in(d)
    if c is not None:
        s = [x for x in s if relevant(c, x['title'])]
    top = sorted(s, key=lambda x: -x['views'])
    v = [x['views'] for x in s[:12]]
    return {'query': q, 'ok': True, 'n': len(s), 'median': round(statistics.median(v)) if v else 0, 'max': top[0]['views'] if top else 0,
            'india_share': round(sum(bool(sc.INDIA_RE.search(x['title'].lower()) or HINGLISH.search(x['title'])) for x in s) / len(s), 2) if s else 0,
            'shorts': top[:5]}


def channel(handle):
    """the channel's Shorts (already made) and its latest long videos"""
    h = handle if handle.startswith('@') else '@' + handle
    made = shorts_in(yt_data(f'https://www.youtube.com/{h}/shorts?hl=en&gl=US') or {})
    longs = []
    for lv in find(yt_data(f'https://www.youtube.com/{h}/videos?hl=en&gl=US') or {}, 'lockupViewModel', []):
        md = ((lv.get('metadata') or {}).get('lockupMetadataViewModel') or {})
        parts = [p.get('accessibilityLabel') or (p.get('text') or {}).get('content', '')
                 for r in (find(md, 'metadataRows', []) or [[]])[0] for p in r.get('metadataParts', [])]
        longs.append({'title': (md.get('title') or {}).get('content', ''), 'meta': ' · '.join(parts),
                      'url': f"https://www.youtube.com/watch?v={lv.get('contentId')}"})
    if not made and not longs:
        sc.NOTES.append(f'channel {h}: nothing found (wrong handle, or YouTube changed the page)')
    return made, longs[:8]


def fmt(n):
    return sc.fmt_n(n)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--channel', help='YouTube handle of the channel, e.g. @netlightml')
    ap.add_argument('--out', default='shorts-out')
    ap.add_argument('--concepts', default=os.path.join(HERE, '..', 'trends', 'concepts.txt'))
    ap.add_argument('--yt', nargs='+', help='only check the Shorts views for these searches')
    a = ap.parse_args()
    if a.yt:
        for q in a.yt:
            r = shorts_check(q)
            print(f"\n## {q}: {r['n']} Shorts on the shelf · median {fmt(r['median'])} views · best {fmt(r['max'])} · India {int(r['india_share'] * 100)}%")
            for s in r['shorts']:
                print(f"   - {s['title'][:80]} | {fmt(s['views'])} views | {s['url']}")
        return

    t0 = time.time()
    log = lambda s: print(f'[{time.time() - t0:5.0f}s] {s}', file=sys.stderr, flush=True)
    C = sc.load_concepts(a.concepts); log(f'{len(C)} concepts')
    papers = sc.hf_papers(7); models = sc.hf_trending('models', 40); hn = sc.hn_ai(7); log('HF + HN done')
    hnc = sc.pmap(sc.hn_concept, C); log('HN per concept done')
    made, longs = channel(a.channel) if a.channel else ([], [])
    if a.channel:
        log(f'channel: {len(made)} Shorts, {len(longs)} long videos')

    rows = []
    for c, hp in zip(C, hnc):
        pap = [p for p in papers if c['re'].search(' '.join(p['keywords']) + ' ' + p['title'].lower())]
        mod = [m for m in models if c['re'].search(m['id'].lower().replace('-', ' ') + ' ' + ' '.join(m['tags']))]
        rows.append({'c': c, 'papers': pap, 'models': mod, 'hn_points_30d': hp, 'paper_score': sum(1 + p['upvotes'] for p in pap),
                     'made': [s['title'] for s in made if sc.hn_match(c, s['title'])]})
    R = {k: sc.pct_rank(v) for k, v in {'pap': [r['paper_score'] for r in rows], 'hn': [r['hn_points_30d'] for r in rows],
                                         'mod': [len(r['models']) for r in rows]}.items()}
    for i, r in enumerate(rows):
        r['momentum'] = sc.wavg([(R['pap'][i], .45), (R['hn'][i], .35), (R['mod'][i], .20)])

    log(f'Shorts shelf for {len(rows)} concepts ...')
    for r in rows:
        r['sh'] = shorts_check(r['c']['query'].replace(' explained', '').strip(), r['c'])
    log('Shorts done')
    bad = sum(1 for r in rows if not r['sh']['ok'])
    if bad:
        sc.NOTES.append(f'YouTube search failed for {bad} concepts')
    ok = [r for r in rows if r['sh']['ok'] and r['sh']['n'] >= 3]   # fewer than 3 ML Shorts on the shelf = no proof of demand
    dv = sc.pct_rank([math.log1p(r['sh']['median']) for r in ok])
    for r, d in zip(ok, dv):
        r['score'] = round(100 * (0.35 * r['momentum'] + 0.65 * d) * (1 - 0.5 * r['sh']['india_share']))
    ok.sort(key=lambda r: -r['score'])

    os.makedirs(a.out, exist_ok=True)
    md = report(ok, papers, models, hn, made, longs, a.channel)
    base = os.path.join(a.out, f'shorts_{sc.TODAY.isoformat()}')
    open(base + '.md', 'w', encoding='utf-8').write(md)
    json.dump({'date': sc.TODAY.isoformat(), 'notes': sc.NOTES, 'channel_shorts': made, 'channel_longs': longs,
               'concepts': [{'name': r['c']['name'], 'score': r.get('score'), 'momentum': round(r['momentum'], 2), 'shorts': r['sh'],
                             'made': r['made'], 'papers': [p['title'] for p in r['papers'][:5]]} for r in rows]},
              open(base + '.json', 'w', encoding='utf-8'), indent=1)
    log(f'wrote {base}.md / .json')
    print(md)


def report(ok, papers, models, hn, made, longs, handle):
    L = [f'# Netlight ML Shorts report · {sc.TODAY.isoformat()}', '']
    if sc.NOTES:
        L += ['**Source notes:** ' + '; '.join(sc.NOTES), '']
    L += ['Score = 35% momentum (HF papers / trending models, HN) + 65% Shorts demand (median views of the Shorts a YouTube search shows), '
          'halved by the share of India-language Shorts. Flags: MADE = the channel already has a Short on it, IN = India-language Shorts dominate.', '',
          '## Short-able concepts', '', '| # | Concept | Score | Shorts (median / best) | Evidence | Best Short now |', '|---|---|---|---|---|---|']
    for i, r in enumerate(ok[:30], 1):
        s = r['sh']
        flag = (' MADE' if r['made'] else '') + (f" IN {int(s['india_share'] * 100)}%" if s['india_share'] >= 0.3 else '')
        ev = ', '.join(x for x in [f"{len(r['papers'])} HF papers" if r['papers'] else '', f"{len(r['models'])} trending models" if r['models'] else '',
                                   f"HN {r['hn_points_30d']} pts/30d" if r['hn_points_30d'] else ''] if x)
        best = s['shorts'][0] if s['shorts'] else None
        L.append(f"| {i} | {r['c']['name']}{flag} | **{r['score']}** | {fmt(s['median'])} / {fmt(s['max'])} | {ev} | "
                 + (f"[{best['title'][:50]}]({best['url']}) {fmt(best['views'])}" if best else '-') + ' |')
    L += ['', '## Details (top 12, not MADE)', '']
    for r in [r for r in ok if not r['made']][:12]:
        L += [f"### {r['c']['name']} · score {r['score']}", f"- search: `{r['sh']['query']}` · visual idea: {r['c']['visual']}"]
        for s in r['sh']['shorts'][:3]:
            L.append(f"- Short: [{s['title'][:80]}]({s['url']}) · {fmt(s['views'])} views")
        for p in r['papers'][:2]:
            L.append(f"- paper ({p['upvotes']} upvotes): [{p['title'][:90]}]({p['url']})")
        for m in r['models'][:2]:
            L.append(f"- trending model: [{m['id']}]({m['url']})")
        L.append('')
    if handle:
        L += [f'## Channel {handle}', '', '**Latest long videos (cut 2 Shorts from each; link the Short to it as Related video)**', '']
        L += [f"- [{v['title']}]({v['url']}) · {v['meta']}" for v in longs] or ['- none found']
        L += ['', f'**Shorts already on the channel ({len(made)})**', '']
        L += [f"- {s['title'][:90]} · {fmt(s['views'])} views" for s in made[:25]] or ['- none yet']
    L += ['', '## Fresh this week (a new concept behind these can be a Short)', '', '**Top Hugging Face papers**', '']
    L += [f"- {p['upvotes']} upvotes · [{p['title'][:100]}]({p['url']})" for p in papers[:10]]
    L += ['', '**Trending Hugging Face models**', ''] + [f"- [{m['id']}]({m['url']}) · {m['pipeline'] or ''}" for m in models[:10]]
    L += ['', '**Hacker News AI stories**', ''] + [f"- {s['points']} pts · [{s['title'][:100]}]({s['hn']})" for s in hn[:10]]
    return '\n'.join(L) + '\n'


if __name__ == '__main__':
    main()
