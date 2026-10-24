#!/usr/bin/env python3
"""net-trends scout: what is rising in DS / ML / AI right now, and is it worth a Netlight ML video?

  python3 scout.py                     full run -> trends-out/report_<date>.md + .json (prints the report)
  python3 scout.py --top 40            YouTube-check the 40 best concepts instead of 30
  python3 scout.py --yt "moe explained" "rlhf explained"
                                       only YouTube-check these searches (use it for topics mapped from the fresh list)

No API keys, no login. Sources: Hugging Face (daily papers, trending models / spaces), Hacker News (Algolia),
Wikipedia pageviews, PyPI downloads, Google Trends daily RSS (US), YouTube autocomplete (US + UK) and YouTube search.
Every source is optional: if one fails the report says so and the rest still runs.
"""
import argparse, datetime as dt, json, math, os, re, statistics, sys, time, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
UA = 'NetlightTrends/0.1 (https://github.com/scarwill/hf-kit) python-urllib/3'
TODAY = dt.date.today()
NOTES = []   # source problems, printed at the top of the report
WIKI_BUDGET = 150   # seconds


def get(url, timeout=25, tries=3, parse_json=False):
    for k in range(tries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9'})
            with urllib.request.urlopen(req, timeout=timeout) as r:
                txt = r.read().decode('utf-8', 'ignore')
            return json.loads(txt) if parse_json else txt
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503, 504) and k < tries - 1:
                time.sleep((4 if e.code == 429 else 2) * (k + 1)); continue
            return None
        except Exception:
            if k < tries - 1:
                time.sleep(1.5 * (k + 1)); continue
            return None


def get_json(url, **kw):
    return get(url, parse_json=True, **kw)


def pmap(fn, items, workers=6):
    with ThreadPoolExecutor(workers) as ex:
        return list(ex.map(fn, items))


# ---------------------------------------------------------------- concepts
def load_concepts(path):
    out = []
    for line in open(path, encoding='utf-8'):
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        p = [x.strip() for x in line.split('|')]
        if len(p) < 5:
            continue
        terms = [t.strip().lower() for t in p[3].split(',') if t.strip()]
        out.append({'name': p[0], 'wiki': None if p[1] == '-' else p[1], 'query': p[2], 'terms': terms, 'visual': p[4],
                    're': re.compile(r'(?<![a-z0-9])(' + '|'.join(re.escape(t) for t in terms) + r')(?![a-z0-9])')})
    return out


# ---------------------------------------------------------------- momentum sources
def hf_papers(days=7):
    seen, out = set(), []
    for k in range(days):
        day = (TODAY - dt.timedelta(days=k)).isoformat()
        d = get_json(f'https://huggingface.co/api/daily_papers?date={day}&limit=100')
        for it in d or []:
            p = it.get('paper', {})
            if p.get('id') in seen:
                continue
            seen.add(p.get('id'))
            out.append({'id': p.get('id'), 'title': p.get('title', '').strip(), 'upvotes': p.get('upvotes', 0) or 0,
                        'keywords': [x.lower() for x in (p.get('ai_keywords') or [])], 'day': day,
                        'url': f"https://huggingface.co/papers/{p.get('id')}", 'github': p.get('githubRepo')})
    if not out:
        NOTES.append('Hugging Face daily papers: no data')
    return sorted(out, key=lambda x: -x['upvotes'])


def hf_trending(kind='models', n=40):
    d = get_json(f'https://huggingface.co/api/{kind}?sort=trendingScore&limit={n}')
    if not d:
        NOTES.append(f'Hugging Face trending {kind}: no data'); return []
    return [{'id': x.get('id'), 'score': x.get('trendingScore', 0), 'likes': x.get('likes', 0),
             'tags': [t.lower() for t in x.get('tags', [])], 'pipeline': x.get('pipeline_tag'),
             'url': f"https://huggingface.co/{'spaces/' if kind == 'spaces' else ''}{x.get('id')}"} for x in d]


HN_QUERIES = ['AI', 'LLM', 'GPT', 'model', 'agent', 'agents', 'neural', 'machine learning', 'OpenAI', 'Anthropic', 'Claude',
              'Gemini', 'DeepSeek', 'Qwen', 'Hugging Face', 'robot', 'transformer', 'diffusion', 'inference', 'training']


def hn_ai(days=7, min_points=60):
    since = int(time.time()) - days * 86400
    def one(q):
        u = 'https://hn.algolia.com/api/v1/search?' + urllib.parse.urlencode(
            {'query': q, 'tags': 'story', 'numericFilters': f'created_at_i>{since},points>{min_points}', 'hitsPerPage': 50})
        return (get_json(u) or {}).get('hits', [])
    seen, out = set(), []
    for hits in pmap(one, HN_QUERIES):
        for h in hits:
            if h['objectID'] in seen:
                continue
            seen.add(h['objectID'])
            if not AI_CTX.search(h.get('title') or ''):
                continue
            out.append({'title': h.get('title', ''), 'points': h.get('points', 0), 'comments': h.get('num_comments', 0),
                        'url': h.get('url') or '', 'hn': f"https://news.ycombinator.com/item?id={h['objectID']}"})
    if not out:
        NOTES.append('Hacker News: no data')
    return sorted(out, key=lambda x: -x['points'])


def hn_concept(c, days=30):
    since = int(time.time()) - days * 86400
    q = c['terms'][0]
    u = 'https://hn.algolia.com/api/v1/search?' + urllib.parse.urlencode(
        {'query': f'"{q}"', 'tags': 'story', 'numericFilters': f'created_at_i>{since}', 'hitsPerPage': 100, 'typoTolerance': 'false'})
    d = get_json(u)
    if d is None:
        return None
    return sum((h.get('points') or 0) for h in d.get('hits', []))


def wiki_views(title):
    if not title:
        return None
    end = TODAY - dt.timedelta(days=1)
    start = end - dt.timedelta(days=119)
    t = urllib.parse.quote(title.replace(' ', '_'), safe='')
    time.sleep(0.4)   # Wikimedia allows about 200 requests / minute
    d = get_json('https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/'
                 f'{t}/daily/{start:%Y%m%d}/{end:%Y%m%d}', tries=2)
    v = [x['views'] for x in (d or {}).get('items', [])]
    if len(v) < 60:
        return None
    recent, before = statistics.mean(v[-14:]), statistics.mean(v[:-14][-90:])
    return {'daily': round(recent), 'growth': round(recent / max(before, 1), 2)}


# PyPI packages whose download growth says something about a concept (concept name -> packages)
PYPI = {'AI agents': ['langgraph', 'crewai', 'openai-agents'], 'Model Context Protocol': ['mcp', 'fastmcp'],
        'RAG': ['llama-index', 'langchain'], 'Vector databases': ['chromadb', 'qdrant-client', 'faiss-cpu'],
        'LoRA': ['peft'], 'Fine-tuning': ['unsloth', 'trl'], 'RLHF': ['trl'], 'GRPO': ['verl'],
        'Quantization': ['bitsandbytes', 'llama-cpp-python'], 'Diffusion models': ['diffusers'],
        'Large language model': ['vllm', 'transformers'], 'Gradient boosting': ['xgboost', 'lightgbm'],
        'Speech recognition': ['openai-whisper', 'faster-whisper'], 'Text to speech': ['kokoro'],
        'Robot learning': ['lerobot'], 'Reinforcement learning': ['gymnasium', 'stable-baselines3']}


def pypi_growth(pkg):
    d = get_json(f'https://pypistats.org/api/packages/{pkg}/recent')
    if not d:
        return None
    r = d.get('data', {})
    w, m = r.get('last_week') or 0, r.get('last_month') or 0
    return round((w * 30 / 7) / m, 2) if m else None


AI_RE = re.compile(r'(?<![a-z])(ai|a\.i\.|chatgpt|openai|gpt|gemini|claude|anthropic|llm|deepseek|grok|copilot|nvidia|robot|'
                   r'machine learning|neural|sora|midjourney|hugging ?face|qwen|llama|mistral|perplexity|agi)(?![a-z])', re.I)


AI_CTX = re.compile(AI_RE.pattern[:-len(')(?![a-z])')] + r'|models?|llms?|inference|trained|training|neural|agentic|'
                    r'transformers?|diffusion|kimi|voxtral|mistral|embeddings?|benchmarks?|tokens?|gpu|cuda|ml|rag|mcp)(?![a-z])', re.I)
# words that also mean non-AI things on Hacker News; a match on these needs an AI word in the same title
GENERIC = {'agent', 'agents', 'memory', 'prompt', 'game', 'graph', 'robot', 'robotics', 'policy', 'reward', 'evaluation', 'eval',
           'benchmark', 'reasoning', 'retrieval', 'safety', 'temperature', 'sampling', 'distribution', 'simulation', 'thinking',
           'attention', 'transformer', 'transformers', 'diffusion', 'regression', 'experiment', 'features', 'detection', 'lora'}


def hn_match(c, title):
    t = title.lower()
    m = [x.group(1) for x in c['re'].finditer(t)]
    return bool(m) and (any(x not in GENERIC for x in m) or bool(AI_CTX.search(title)))


def gtrends_rss(geo='US'):
    x = get(f'https://trends.google.com/trending/rss?geo={geo}')
    if not x:
        NOTES.append('Google Trends RSS: no data'); return []
    out = []
    for item in re.findall(r'<item>(.*?)</item>', x, re.S):
        title = re.search(r'<title>(.*?)</title>', item, re.S)
        traffic = re.search(r'<ht:approx_traffic>(.*?)</ht:approx_traffic>', item)
        news = ' '.join(re.findall(r'<ht:news_item_title>(.*?)</ht:news_item_title>', item, re.S))
        t = (title.group(1) if title else '').replace('&apos;', "'").replace('&amp;', '&')
        if AI_RE.search(t + ' ' + news):
            out.append({'title': t, 'traffic': traffic.group(1) if traffic else ''})
    return out


# ---------------------------------------------------------------- YouTube
INDIA_RE = re.compile(r'(?<![a-z])(hindi|tamil|telugu|malayalam|kannada|bangla|bengali|marathi|urdu|gujarati|odia|punjabi|'
                      r'aktu|jntu|sppu|gate|ugc net|class \d+|semester|sem|bca|mca|btech|b\.tech|exam|campusx)(?![a-z])')
AGE_RE = re.compile(r'(\d+)\s*(seconds?|secs?|s|minutes?|mins?|hours?|hrs?|h|days?|d|weeks?|wks?|w|months?|mo|years?|yrs?|y)\s+ago')
AGE_DAYS = {'s': 1 / 86400, 'm': 1 / 1440, 'h': 1 / 24, 'd': 1, 'w': 7, 'mo': 30.4, 'y': 365}


def age_days(txt):
    m = AGE_RE.search((txt or '').lower())
    if not m:
        return None
    u = m.group(2)
    key = 'mo' if u.startswith('mo') else 'm' if u.startswith('min') else u[0]
    return int(m.group(1)) * AGE_DAYS[key]


def yt_suggest(q, gl):
    u = 'https://suggestqueries.google.com/complete/search?' + urllib.parse.urlencode(
        {'client': 'firefox', 'ds': 'yt', 'gl': gl, 'hl': 'en', 'q': q})
    d = get_json(u)
    return d[1] if isinstance(d, list) and len(d) > 1 else None


def yt_search(q, gl='US'):
    h = get('https://www.youtube.com/results?' + urllib.parse.urlencode({'search_query': q, 'hl': 'en', 'gl': gl}))
    m = re.search(r'var ytInitialData = (\{.*?\});</script>', h or '', re.S)
    if not m:
        return None
    out = []
    def walk(o):
        if isinstance(o, dict):
            v = o.get('videoRenderer')
            if v:
                views = re.sub(r'[^0-9]', '', (v.get('viewCountText') or {}).get('simpleText', '') or '')
                out.append({'title': ''.join(r.get('text', '') for r in (v.get('title') or {}).get('runs', [])),
                            'views': int(views) if views else 0,
                            'age': age_days((v.get('publishedTimeText') or {}).get('simpleText')),
                            'channel': ''.join(r.get('text', '') for r in (v.get('ownerText') or {}).get('runs', [])),
                            'url': f"https://www.youtube.com/watch?v={v.get('videoId')}"})
                return
            for x in o.values():
                walk(x)
        elif isinstance(o, list):
            for x in o:
                walk(x)
    walk(json.loads(m.group(1)))
    return out


def yt_check(q):
    us, gb = yt_suggest(q, 'US'), yt_suggest(q, 'GB')
    us2 = yt_suggest(q + ' explained', 'US') if not q.endswith('explained') else []
    sugg = list(dict.fromkeys((us or []) + (gb or []) + (us2 or [])))
    vids = yt_search(q) or []
    time.sleep(0.6)
    live = [v for v in vids if v['age'] is not None][:20]
    for v in live:
        v['vpd'] = round(v['views'] / max(v['age'], 1))
    top10 = live[:10]
    return {'query': q, 'ok': bool(live) and sugg is not None,
            'sugg_us': us or [], 'sugg_gb': gb or [], 'sugg_count': len(set((us or []) + (gb or []))),
            'india_share': round(sum(bool(INDIA_RE.search(s.lower())) for s in sugg) / len(sugg), 2) if sugg else 0,
            'median_vpd': round(statistics.median([v['vpd'] for v in top10])) if top10 else 0,
            'recent_hits': sum(1 for v in live if v['age'] <= 90 and v['views'] >= 20000),
            'old_share': round(sum(1 for v in top10 if v['age'] > 365) / len(top10), 2) if top10 else 0,
            'videos': live[:6]}


# ---------------------------------------------------------------- scoring
def pct_rank(vals):
    """value -> 0..1 rank among the non-None values (ties share the rank). None stays None."""
    xs = sorted(v for v in vals if v is not None)
    if not xs:
        return [None] * len(vals)
    n = len(xs)
    return [None if v is None else (sum(1 for x in xs if x < v) + 0.5 * (sum(1 for x in xs if x == v) - 1)) / max(n - 1, 1)
            for v in vals]


def wavg(pairs):
    pairs = [(v, w) for v, w in pairs if v is not None]
    return sum(v * w for v, w in pairs) / sum(w for _, w in pairs) if pairs else 0


def fmt_n(n):
    return f'{n / 1e6:.1f}M' if n >= 1e6 else f'{n / 1e3:.0f}k' if n >= 1e3 else str(n)


def fmt_age(d):
    return f'{d / 365:.1f}y' if d >= 365 else f'{d / 30.4:.0f}mo' if d >= 45 else f'{d:.0f}d'


def run_yt_only(queries):
    for q in queries:
        r = yt_check(q)
        flag = ' INDIA' if r['india_share'] >= 0.3 else ''
        print(f"\n## {q}{flag}\n  suggestions US: {' | '.join(r['sugg_us'])}\n  suggestions UK: {' | '.join(r['sugg_gb'])}")
        print(f"  top-10 median views/day {fmt_n(r['median_vpd'])} · recent hits (<90d, 20k+) {r['recent_hits']} · "
              f"older than 1y {int(r['old_share'] * 100)}% · India share {int(r['india_share'] * 100)}%")
        for v in r['videos']:
            print(f"   - {v['title'][:80]} | {fmt_n(v['views'])} views | {fmt_age(v['age'])} | {v['channel']} | {v['url']}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--top', type=int, default=30, help='how many concepts get the YouTube check')
    ap.add_argument('--out', default='trends-out')
    ap.add_argument('--concepts', default=os.path.join(HERE, 'concepts.txt'))
    ap.add_argument('--yt', nargs='+', help='only YouTube-check these searches')
    a = ap.parse_args()
    if a.yt:
        return run_yt_only(a.yt)

    t0 = time.time()
    C = load_concepts(a.concepts)
    made_f = os.path.join(HERE, 'made.txt')
    made = {l.split('#')[0].strip().lower() for l in open(made_f, encoding='utf-8')} - {''} if os.path.exists(made_f) else set()
    for c in C:
        c['made'] = c['name'].lower() in made
    log = lambda s: print(f'[{time.time() - t0:5.0f}s] {s}', file=sys.stderr, flush=True)
    log(f'{len(C)} concepts')

    papers = hf_papers(7); log(f'HF papers: {len(papers)}')
    models = hf_trending('models', 40); spaces = hf_trending('spaces', 30); log(f'HF trending: {len(models)} models, {len(spaces)} spaces')
    hn = hn_ai(7); log(f'HN AI stories: {len(hn)}')
    gtr = gtrends_rss('US'); log(f'Google Trends AI items: {len(gtr)}')
    # Wikipedia is slow when it rate-limits this IP: cache per day and stop after WIKI_BUDGET seconds
    cache_f = os.path.join(a.out, f'wiki_{TODAY.isoformat()}.json')
    os.makedirs(a.out, exist_ok=True)
    cache = json.load(open(cache_f)) if os.path.exists(cache_f) else {}
    w0, wiki, fails = time.time(), [], 0
    for c in C:
        if c['wiki'] and c['wiki'] not in cache and time.time() - w0 < WIKI_BUDGET and fails < 3:
            cache[c['wiki']] = wiki_views(c['wiki'])
            fails = 0 if cache[c['wiki']] else fails + 1
        wiki.append(cache.get(c['wiki']) if c['wiki'] else None)
    if fails >= 3:
        NOTES.append('Wikipedia is rate-limiting this server, skipped the rest (try again in an hour)')
    json.dump({k: v for k, v in cache.items() if v}, open(cache_f, 'w'))
    miss = sum(1 for c, w in zip(C, wiki) if c['wiki'] and not w)
    if miss:
        NOTES.append(f'Wikipedia: {miss} pages without data')
    log(f'Wikipedia done ({miss} missing)')
    hnc = pmap(hn_concept, C); log('HN per concept done')
    pkgs = sorted({p for ps in PYPI.values() for p in ps})
    pyg = dict(zip(pkgs, pmap(pypi_growth, pkgs, 4))); log('PyPI done')

    # momentum per concept
    rows = []
    for c, w, hp in zip(C, wiki, hnc):
        pap = [p for p in papers if c['re'].search(' '.join(p['keywords']) + ' ' + p['title'].lower())]
        mod = [m for m in models if c['re'].search(m['id'].lower().replace('-', ' ') + ' ' + ' '.join(m['tags']))]
        hns = [s for s in hn if hn_match(c, s['title'])]
        g = [pyg.get(p) for p in PYPI.get(c['name'], []) if pyg.get(p)]
        rows.append({'c': c, 'papers': pap, 'paper_score': sum(1 + p['upvotes'] for p in pap), 'models': mod,
                     'hn_week': hns, 'hn_points_30d': hp, 'wiki': w, 'pypi': round(statistics.mean(g), 2) if g else None})
    R = {k: pct_rank(v) for k, v in {
        'pap': [r['paper_score'] for r in rows], 'hn': [r['hn_points_30d'] for r in rows],
        'wg': [r['wiki']['growth'] if r['wiki'] else None for r in rows],
        'wl': [r['wiki']['daily'] if r['wiki'] else None for r in rows],
        'mod': [len(r['models']) for r in rows], 'py': [r['pypi'] for r in rows]}.items()}
    for i, r in enumerate(rows):
        r['momentum'] = wavg([(R['pap'][i], .30), (R['hn'][i], .25), (R['wg'][i], .25), (R['mod'][i], .10), (R['py'][i], .10)])
        r['interest'] = R['wl'][i]
        r['pre'] = 0.75 * r['momentum'] + 0.25 * (r['interest'] if r['interest'] is not None else 0.5)

    # YouTube check for the best ones
    pick = sorted(rows, key=lambda r: -r['pre'])[:a.top]
    log(f'YouTube check for {len(pick)} concepts ...')
    for k, r in enumerate(pick):
        r['yt'] = yt_check(r['c']['query'])
        if not r['yt']['ok']:
            NOTES.append(f"YouTube: no data for '{r['c']['query']}'")
    log('YouTube done')
    ok = [r for r in pick if r['yt']['ok']]
    dv = pct_rank([math.log1p(r['yt']['median_vpd']) for r in ok])
    for r, d in zip(ok, dv):
        y = r['yt']
        r['demand'] = 0.6 * d + 0.4 * min(y['sugg_count'], 20) / 20
        r['gap'] = 0.5 * y['old_share'] + 0.5 * min(y['recent_hits'], 5) / 5
        r['score'] = round(100 * (0.35 * r['momentum'] + 0.40 * r['demand'] + 0.25 * r['gap']) * (1 - 0.5 * y['india_share']))
    ok.sort(key=lambda r: -r['score'])

    # keywords from this week's papers that no concept matches = candidates for new concepts
    kw = {}
    for p in papers:
        for k in set(p['keywords']):
            n, up = kw.get(k, (0, 0))
            kw[k] = (n + 1, up + p['upvotes'])
    unmapped = [(k, f'{n} papers, {up} upvotes') for k, (n, up) in sorted(kw.items(), key=lambda x: (-x[1][0], -x[1][1]))
                if n >= 2 and not any(c['re'].search(k) for c in C)][:25]

    os.makedirs(a.out, exist_ok=True)
    md = report(ok, papers, models, spaces, hn, gtr, unmapped, rows)
    base = os.path.join(a.out, f'report_{TODAY.isoformat()}')
    open(base + '.md', 'w', encoding='utf-8').write(md)
    dump = [{'name': r['c']['name'], 'score': r.get('score'), 'momentum': round(r['momentum'], 2), 'yt': r.get('yt'),
             'wiki': r['wiki'], 'hn_points_30d': r['hn_points_30d'], 'pypi': r['pypi'],
             'papers': [p['title'] for p in r['papers'][:5]], 'models': [m['id'] for m in r['models'][:5]]} for r in rows]
    json.dump({'date': TODAY.isoformat(), 'notes': NOTES, 'concepts': dump, 'papers': papers[:60], 'models': models,
               'spaces': spaces, 'hn': hn[:60], 'google_trends': gtr, 'unmapped_keywords': unmapped},
              open(base + '.json', 'w', encoding='utf-8'), indent=1, default=str)
    log(f'wrote {base}.md / .json')
    print(md)


def report(ok, papers, models, spaces, hn, gtr, unmapped, rows):
    L = [f'# Netlight ML trend report · {TODAY.isoformat()}', '']
    if NOTES:
        L += ['**Source notes:** ' + '; '.join(NOTES), '']
    L += ['Score = 35% momentum (HF papers / models, HN, Wikipedia growth, PyPI) + 40% YouTube demand (US/UK autocomplete, '
          'views per day of the top videos) + 25% gap (stale top results, recent videos still getting views); '
          'halved by the share of India-exam suggestions. Flags: IN = India-student topic, MADE = already a Netlight video (made.txt).', '',
          '## Ranked concepts', '',
          '| # | Concept | Score | Mom. | Dem. | Gap | Evidence | YouTube (US) |', '|---|---|---|---|---|---|---|---|']
    for i, r in enumerate(ok, 1):
        y, w = r['yt'], r['wiki']
        ev = [f"{len(r['papers'])} HF papers" if r['papers'] else '', f"{len(r['models'])} trending models" if r['models'] else '',
              f"HN {r['hn_points_30d']} pts/30d" if r['hn_points_30d'] else '',
              f"wiki {w['daily']}/day x{w['growth']}" if w else '', f"PyPI x{r['pypi']}" if r['pypi'] else '']
        flag = (f" IN {int(y['india_share'] * 100)}%" if y['india_share'] >= 0.3 else '') + (' MADE' if r['c']['made'] else '')
        L.append(f"| {i} | {r['c']['name']}{flag} | **{r['score']}** | {r['momentum']:.2f} | {r['demand']:.2f} | {r['gap']:.2f} | "
                 f"{', '.join(e for e in ev if e)} | {fmt_n(y['median_vpd'])} views/day median, {y['recent_hits']} recent hits, "
                 f"{int(y['old_share'] * 100)}% >1y old |")
    L += ['', '## Details (top 12)', '']
    for i, r in enumerate(ok[:12], 1):
        y = r['yt']
        L += [f"### {i}. {r['c']['name']} · score {r['score']}", f"- search: `{y['query']}` · visual idea: {r['c']['visual']}",
              f"- autocomplete US: {' | '.join(y['sugg_us'][:8])}", f"- autocomplete UK: {' | '.join(y['sugg_gb'][:8])}"]
        for p in r['papers'][:3]:
            L.append(f"- paper ({p['upvotes']} upvotes): [{p['title'][:90]}]({p['url']})")
        for m in r['models'][:3]:
            L.append(f"- trending model: [{m['id']}]({m['url']})")
        for s in r['hn_week'][:2]:
            L.append(f"- HN ({s['points']} pts): [{s['title'][:90]}]({s['hn']})")
        for v in y['videos'][:4]:
            L.append(f"- YT: [{v['title'][:70]}]({v['url']}) · {fmt_n(v['views'])} views · {fmt_age(v['age'])} · {v['channel']}")
        L.append('')
    L += ['## Fresh this week (map these to concepts, then check with --yt)', '', '**Top Hugging Face papers (7 days)**', '']
    for p in papers[:15]:
        L.append(f"- {p['upvotes']} upvotes · [{p['title'][:100]}]({p['url']}) · {', '.join(p['keywords'][:6])}")
    L += ['', '**Trending Hugging Face models**', '']
    for m in models[:15]:
        L.append(f"- [{m['id']}]({m['url']}) · trend {m['score']} · {m['pipeline'] or ''}")
    L += ['', '**Trending Hugging Face spaces**', '']
    for s in spaces[:10]:
        L.append(f"- [{s['id']}]({s['url']}) · trend {s['score']}")
    L += ['', '**Hacker News AI stories (7 days)**', '']
    for s in hn[:15]:
        L.append(f"- {s['points']} pts · [{s['title'][:100]}]({s['hn']})")
    if gtr:
        L += ['', '**Google Trends US today (AI-related)**', '']
        L += [f"- {g['title']} ({g['traffic']})" for g in gtr]
    L += ['', '**Paper keywords not in concepts.txt (possible new concepts)**', '',
          ', '.join(f'{k} ({v})' for k, v in unmapped), '',
          '## Rising on Wikipedia (14-day avg vs 90 days before)', '']
    wr = sorted([r for r in rows if r['wiki'] and r['wiki']['daily'] >= 300], key=lambda r: -r['wiki']['growth'])[:10]
    L += [f"- {r['c']['name']}: x{r['wiki']['growth']} ({r['wiki']['daily']}/day)" for r in wr]
    return '\n'.join(L) + '\n'


if __name__ == '__main__':
    main()
