# usage: python3 sheets.py [from_sec=0]  (after check.js) -> sh0.png, sh1.png ... 12 frames (every 2 s) per sheet, time-stamped
import glob,re,sys
from PIL import Image,ImageDraw
t0=float(sys.argv[1]) if len(sys.argv)>1 else 0
ts=sorted((float(m.group(1)),f) for f in glob.glob('out/f*.png') for m in [re.search(r'f(\d+\.\d+)\.png',f)] if m)
ts=[x for x in ts if x[0]>=t0]
for si in range(0,len(ts),12):
    ch=ts[si:si+12]; W,H=(640,360) if Image.open(ch[0][1]).width>Image.open(ch[0][1]).height else (270,480); im=Image.new('RGB',(W*3,H*4),'black'); d=ImageDraw.Draw(im)
    for k,(t,f) in enumerate(ch):
        im.paste(Image.open(f).convert('RGB').resize((W,H)),((k%3)*W,(k//3)*H)); d.text(((k%3)*W+8,(k//3)*H+6),str(t),fill='yellow')
    im.save(f'sh{si//12}.png'); print(f'sh{si//12}.png',ch[0][0],'-',ch[-1][0])
