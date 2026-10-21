# Real photos for a video, from Wikimedia Commons, with license + credit. Only free licenses are accepted
# (public domain, CC0, CC BY, CC BY-SA); NC / ND / unknown licenses are refused.
#   search:  python3 photos.py --search "great pyramid of giza"         -> titles, size, license, author
#   fetch:   python3 photos.py pyr="File:Great Pyramid of Giza.jpg" grove="File:Methuselah Walk USA Ca.jpg" [--max 900]
#            -> photos.js  (const PH = { pyr: {w, h, src: data-URI, credit, license, url}, ... }  load it before video.js)
#            -> photo_credits.txt  (paste into the YouTube description: CC BY / BY-SA require it)
# Photos are embedded as JPEG data URIs, so index.html stays ONE file. Show them with kPhoto (kurz/props.js).
# Commons often answers 429 (too many requests) from shared IPs: every request is retried with a growing pause.
import sys, json, re, subprocess, time, base64, io, urllib.parse
UA = 'hf-kit-video/1.0 (https://github.com/scarwill/hf-kit)'
API = 'https://commons.wikimedia.org/w/api.php?'
OK = re.compile(r'^(public domain|pd\b|cc0|cc[ -]by( |-)(sa )?[\d.]+|cc[ -]by(-sa)?$|cc by(-sa)? [\d.]+)', re.I)

def get(url, binary=False):
    for k in range(7):
        r = subprocess.run(['curl', '-sS', '-m', '60', '-A', UA, url], capture_output=True)
        body = r.stdout
        if r.returncode == 0 and not body.startswith(b'You are making too many requests'):
            if binary:
                if body[:3] == b'\xff\xd8\xff' or body[:8] == b'\x89PNG\r\n\x1a\n': return body
            else:
                try: return json.loads(body.decode('utf-8', 'replace'))
                except ValueError: pass   # an HTML error page instead of JSON: retry
        time.sleep(4 + 6 * k)   # 429 / network: back off and retry
    sys.exit('Commons did not answer (rate limit). Try again in a minute.')

def clean(v): return re.sub(r'\s+', ' ', re.sub('<[^>]+>', '', v or '')).strip()

args = sys.argv[1:]
if args and args[0] == '--search':
    q = ' '.join(args[1:])
    d = get(API + urllib.parse.urlencode({'action': 'query', 'generator': 'search', 'gsrnamespace': 6, 'gsrsearch': q, 'gsrlimit': 15,
                                          'prop': 'imageinfo', 'iiprop': 'size|extmetadata', 'format': 'json'}))
    for p in sorted(d.get('query', {}).get('pages', {}).values(), key=lambda p: p.get('index', 0)):
        ii = p['imageinfo'][0]; m = ii['extmetadata']; lic = clean(m.get('LicenseShortName', {}).get('value'))
        print(('ok  ' if OK.match(lic) else 'NO  ') + p['title'], f"| {ii['width']}x{ii['height']} | {lic} | {clean(m.get('Artist', {}).get('value'))[:40]}")
        print('      ', clean(m.get('ImageDescription', {}).get('value'))[:150])
    sys.exit()

MAX = int(args[args.index('--max') + 1]) if '--max' in args else 900
pairs = [a.split('=', 1) for a in args if '=' in a and not a.startswith('--')]
titles = {k: t if t.startswith('File:') else 'File:' + t for k, t in pairs}
d = get(API + urllib.parse.urlencode({'action': 'query', 'titles': '|'.join(titles.values()), 'prop': 'imageinfo',
                                      'iiprop': 'url|size|extmetadata', 'iiurlwidth': 1280, 'format': 'json'}))
norm = {n['to']: n['from'] for n in d['query'].get('normalized', [])}
info = {}
for p in d['query']['pages'].values():
    if 'imageinfo' not in p: sys.exit('not found on Commons: ' + p['title'])
    info[norm.get(p['title'], p['title'])] = p
from PIL import Image   # after the network part, so --search works without Pillow
js = '// real photos (Wikimedia Commons), made by photos.py — credits: photo_credits.txt\nconst PH = {\n'; cred = ['Photo credits (Wikimedia Commons):', '']
for key, title in titles.items():
    p = info[title]; ii = p['imageinfo'][0]; m = ii['extmetadata']
    lic = clean(m.get('LicenseShortName', {}).get('value')); who = re.sub(r'\s*\(talk · contribs\)', '', clean(m.get('Artist', {}).get('value'))) or 'unknown author'
    if not OK.match(lic): sys.exit(f'{title}: license "{lic}" is not free enough (need PD / CC0 / CC BY / CC BY-SA)')
    raw = get(ii.get('thumburl') or ii['url'], binary=True)
    im = Image.open(io.BytesIO(raw)).convert('RGB')   # only JPEG/PNG bytes get here (checked in get)
    im.thumbnail((MAX, MAX)); b = io.BytesIO(); im.save(b, 'JPEG', quality=80, optimize=True, progressive=True)
    page = ii.get('descriptionurl') or 'https://commons.wikimedia.org/wiki/' + urllib.parse.quote(title.replace(' ', '_'))
    credit = f'{who} / {lic}'
    js += f"  {key}: {{ w: {im.size[0]}, h: {im.size[1]}, credit: {json.dumps(credit)}, src: 'data:image/jpeg;base64,{base64.b64encode(b.getvalue()).decode()}' }},\n"
    cred += [f'- {clean(m.get("ObjectName", {}).get("value")) or title[5:]} — {who}, {lic}', f'  {page}']
    print(f'{key:10s} {im.size[0]}x{im.size[1]} {len(b.getvalue()) // 1024} KB  {credit}')
js += '};\n'
cred += ['', 'Photos are shown resized/cropped inside animated frames.']
open('photos.js', 'w', encoding='utf-8').write(js); open('photo_credits.txt', 'w', encoding='utf-8').write('\n'.join(cred) + '\n')
print('-> photos.js, photo_credits.txt')
