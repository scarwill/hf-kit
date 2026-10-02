# usage: python3 check.py   (after check.js) -> prints problems, writes scenes*.png sheets (one frame per scene, at its end)
import json,glob,numpy as np
from PIL import Image,ImageDraw
d=json.load(open('info.json')); end=d['end']
print('timeline dur',d['dur'],'END',end); [print('LOG',l) for l in d['logs']]
b=sorted(set(d['beats']+[s[1] for s in d['scn']]))
print('beat gaps>4s:',[(b[i],b[i+1]) for i in range(len(b)-1) if b[i+1]-b[i]>4] or 'none')
fs={float(f[5:-4]):f for f in glob.glob('out/f*.png')}
ims={t:np.asarray(Image.open(f).convert('L').resize((480,270))).astype(float) for t,f in fs.items()}
for t in sorted(ims):
    if abs(t-round(t))>.01 or int(round(t))%2==0: continue
    c=(ims[t]>95).mean()*100; p=ims.get(round(t-4,1)); df=np.abs(ims[t]-p).mean() if p is not None else 99
    if c<0.3 or df<0.6: print(f'  {t:6.1f} content={c:.2f}% diff4s={df:.2f}', 'EMPTY' if c<0.3 else 'STATIC')
sc=[s[1] for s in d['scn']]; ts=[round((sc[i+1] if i+1<len(sc) else end)-.6,1) for i in range(len(sc))]
W,H=640,360
for k in range(0,len(ts),9):
    g=ts[k:k+9]; sh=Image.new('RGB',(W*3,H*((len(g)+2)//3)))
    for i,t in enumerate(g):
        im=Image.open(fs[min(fs,key=lambda x:abs(x-t))]).resize((W,H)); ImageDraw.Draw(im).text((8,8),f'scene {k+i+1} @{t}',fill='yellow'); sh.paste(im,((i%3)*W,(i//3)*H))
    sh.save(f'scenes{k//9+1}.png'); print('sheet',f'scenes{k//9+1}.png',g[0],'-',g[-1])
