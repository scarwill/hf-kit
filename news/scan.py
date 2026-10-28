#!/usr/bin/env python3
# SCAN: one command that lists the last N hours of AI + dev news candidates.
#   python3 ~/nkit/news/scan.py [--hours 36] [--no-gh]
# Prints, newest first: feed headlines (AI / dev / security / Bloomberg tech + markets) with time + link, then AI MARKETS / MONEY
# (Google News searches: AI bubble, AI stocks, funding, IPO, Reuters + CNBC AI; added 28 Oct 2026 after we missed China's AI selloff), then Hugging Face trending models + spaces,
# Hacker News top stories (score), and GitHub trending repos (headless browser). It is a LIST OF LEADS, not facts:
# open every story you shortlist and verify it (primary source + one independent report) before it goes in the table.
# Goes through the session proxy with curl (WebFetch cannot resolve many hosts here). A source that fails is reported and skipped.
import datetime, email.utils, html, json, re, subprocess, sys, os
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36'
HOURS = float(sys.argv[sys.argv.index('--hours') + 1]) if '--hours' in sys.argv else 36
FEEDS = {
    'techcrunch-ai': 'https://techcrunch.com/category/artificial-intelligence/feed/',
    'verge-ai': 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
    'ars-ai': 'https://arstechnica.com/ai/feed/',
    'register': 'https://www.theregister.com/headlines.atom',
    'github-blog': 'https://github.blog/feed/',
    'hf-blog': 'https://huggingface.co/blog/feed.xml',
    'openai': 'https://openai.com/news/rss.xml',
    'google-ai': 'https://blog.google/technology/ai/rss/',
    'deepmind': 'https://deepmind.google/blog/rss.xml',
    'aws': 'https://aws.amazon.com/about-aws/whats-new/recent/feed/',
    'bleeping': 'https://www.bleepingcomputer.com/feed/',
    'simonw': 'https://simonwillison.net/atom/everything/',
    'verge': 'https://www.theverge.com/rss/index.xml',
    'techcrunch': 'https://techcrunch.com/feed/',
    'bloomberg-tech': 'https://feeds.bloomberg.com/technology/news.rss',
    'bloomberg-mkts': 'https://feeds.bloomberg.com/markets/news.rss',
}
def get(url, t=25):
    r = subprocess.run(['curl', '-sL', '-m', str(t), '-A', UA, url], capture_output=True)
    return r.stdout.decode('utf-8', 'ignore') if r.returncode == 0 else ''
def when(s):
    s = (s or '').strip()
    for f in (email.utils.parsedate_to_datetime, lambda x: datetime.datetime.fromisoformat(x.replace('Z', '+00:00'))):
        try:
            d = f(s); return d.astimezone(datetime.timezone.utc) if d.tzinfo else d.replace(tzinfo=datetime.timezone.utc)
        except Exception: pass
    return None
now = datetime.datetime.now(datetime.timezone.utc); cut = now - datetime.timedelta(hours=HOURS)
rows, failed, seen = [], [], set()
for name, url in FEEDS.items():
    x = get(url)
    items = re.findall(r'<(?:item|entry)\b.*?</(?:item|entry)>', x, re.S)
    if not items: failed.append(name); continue
    for it in items:
        t = re.search(r'<title[^>]*>(.*?)</title>', it, re.S); d = re.search(r'<(?:pubDate|published|updated)>(.*?)</', it, re.S)
        l = re.search(r'<link>(.*?)</link>', it, re.S) or re.search(r'<link[^>]*href="([^"]+)"', it)
        title = ' '.join(html.unescape(re.sub(r'<!\[CDATA\[|\]\]>|<[^>]+>', '', t.group(1))).split()) if t else ''
        dt = when(d.group(1) if d else '')
        if not title or not dt or dt < cut: continue
        key = re.sub(r'\W+', '', title.lower())[:60]
        if key in seen: continue
        seen.add(key); rows.append((dt, name, title, html.unescape(l.group(1).strip()) if l else ''))
rows.sort(key=lambda r: r[0], reverse=True)
print(f'== FEEDS: last {HOURS:g} h ({len(rows)} items), now {now:%Y-%m-%d %H:%M} UTC')
for dt, n, t, l in rows: print(f'{dt:%m-%d %H:%M} {n:<13} | {t[:120]} | {l}')
if failed: print('   (no items from: ' + ', '.join(failed) + ')')
# AI MARKETS / MONEY: big AI market, funding and IPO stories that tech feeds often miss (Reuters / CNBC / Bloomberg via Google News)
MQ = ['AI bubble', 'AI stocks selloff OR rally', 'AI startup funding round', 'AI IPO', 'site:reuters.com artificial intelligence', 'site:cnbc.com artificial intelligence']
days = max(1, int(round(HOURS / 24)))
mseen = set(); print(f'== AI MARKETS / MONEY (Google News, last {days} d) - read this section every day')
for q in MQ:
    x = get('https://news.google.com/rss/search?q=' + q.replace(' ', '+') + f'+when:{days}d&hl=en-US&gl=US&ceid=US:en')
    items = re.findall(r'<item>.*?</item>', x, re.S)
    if not items: print(f'  [{q}] failed'); continue
    n = 0
    for it in items:
        t = re.search(r'<title>(.*?)</title>', it, re.S); src = re.search(r'<source[^>]*>(.*?)</source>', it, re.S)
        l = re.search(r'<link>(.*?)</link>', it, re.S); d = re.search(r'<pubDate>(.*?)</pubDate>', it, re.S)
        title = html.unescape(t.group(1)).strip() if t else ''; dt = when(d.group(1) if d else '')
        key = re.sub(r'\W+', '', title.lower())[:50]
        if not title or key in mseen or (dt and dt < cut): continue
        mseen.add(key); n += 1
        print(f"  [{q[:22]:<22}] {dt:%m-%d %H:%M} | {title[:115]} | {html.unescape(src.group(1)) if src else ''} | {l.group(1).strip() if l else ''}")
        if n >= 6: break
for kind in ('models', 'spaces'):
    try:
        d = json.loads(get(f'https://huggingface.co/api/{kind}?sort=trendingScore&limit=12') or '[]')
        print(f'== HUGGING FACE trending {kind}: ' + ', '.join(m.get('id', '?') for m in d))
    except Exception: print(f'== HUGGING FACE trending {kind}: failed')
try:
    ids = json.loads(get('https://hacker-news.firebaseio.com/v0/topstories.json') or '[]')[:25]
    print('== HACKER NEWS top')
    for i in ids:
        s = json.loads(get(f'https://hacker-news.firebaseio.com/v0/item/{i}.json', 10) or '{}')
        if s: print(f"  {s.get('score', 0):>5} pts | {s.get('title', '')[:110]} | {s.get('url', 'https://news.ycombinator.com/item?id=' + str(i))}")
except Exception: print('== HACKER NEWS: failed')
if '--no-gh' not in sys.argv:
    js = ("const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({userAgent:'" + UA + "'});"
          "await p.goto('https://github.com/trending',{waitUntil:'domcontentloaded',timeout:60000});"
          "const r=await p.evaluate(()=>[...document.querySelectorAll('article')].slice(0,15).map(a=>{const h=a.querySelector('h2 a');const d=a.querySelector('p');const s=[...a.querySelectorAll('span')].map(x=>x.textContent.trim()).find(x=>/stars today/.test(x));return (h?h.getAttribute('href'):'')+' | '+(s||'')+' | '+(d?d.textContent.trim().slice(0,90):'')}));"
          "console.log(r.join('\\n'));await b.close()})()")
    env = dict(os.environ); env['NODE_PATH'] = subprocess.run(['npm', 'root', '-g'], capture_output=True, text=True).stdout.strip()
    r = subprocess.run(['node', '-e', js], capture_output=True, text=True, env=env, timeout=120)
    print('== GITHUB trending (today)'); print('\n'.join('  ' + x for x in r.stdout.strip().splitlines()) or '  failed')
