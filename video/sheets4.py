# usage: python3 sheets4.py   (after check.js) -> rev01.png, rev02.png ... = one frame every 4 s, 16 per sheet (4x4)
# Look at EVERY rev sheet before delivering: props covering labels/meters, things cut at the frame edge, overlaps, empty frames.
import glob, re
from PIL import Image, ImageDraw
fs = {float(re.search(r'f([\d.]+)\.png', f).group(1)): f for f in glob.glob('out/f*.png')}
ts = sorted(t for t in fs if abs(t - round(t)) < .01 and int(round(t)) % 4 == 1)
W, H = (480, 270) if Image.open(fs[ts[0]]).width > Image.open(fs[ts[0]]).height else (200, 356)
for k in range(0, len(ts), 16):
    g = ts[k:k + 16]; sh = Image.new('RGB', (W * 4, H * ((len(g) + 3) // 4)))
    for i, t in enumerate(g):
        im = Image.open(fs[t]).resize((W, H)); ImageDraw.Draw(im).text((6, 6), f'{int(t // 60)}:{int(t % 60):02d}', fill='yellow'); sh.paste(im, ((i % 4) * W, (i // 4) * H))
    sh.save(f'rev{k // 16 + 1:02d}.png'); print('sheet', f'rev{k // 16 + 1:02d}.png', g[0], '-', g[-1])
