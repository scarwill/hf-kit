# usage: python3 align.py <audio> <script.txt>   -> words.json, meta.json (END, title or None, sentences)
import numpy as np, re, json, sys, subprocess
aud, scr = sys.argv[1], sys.argv[2]
END = float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',aud]).decode())
subprocess.run(['ffmpeg','-loglevel','error','-y','-i',aud,'-ac','1','-ar','16000','-f','s16le','a.raw'],check=True)
x=np.fromfile('a.raw',dtype=np.int16).astype(np.float64)/32768
hop=160;n=len(x)//hop
db=20*np.log10(np.sqrt((x[:n*hop].reshape(n,hop)**2).mean(1))+1e-9)
speech=np.convolve(db,np.ones(5)/5,'same')>-45
runs=[];i=0
while i<n:
    if not speech[i]:
        j=i
        while j<n and not speech[j]: j+=1
        runs.append((i/100,j/100)); i=j
    else: i+=1
fs=np.argmax(speech)/100; ls=(n-np.argmax(speech[::-1]))/100
cs=np.concatenate([[0],np.cumsum(speech)])/100
sp=lambda a,b: cs[min(n,int(round(b*100)))]-cs[min(n,int(round(a*100)))]
paras=[l.strip() for l in open(scr,encoding='utf-8') if l.strip()]
# line 1 is a spoken TITLE only if it is short and has no sentence ending; otherwise it is a normal sentence
_w=paras[0].split(); TITLE=len(paras)>1 and len(_w)<=12 and not paras[0].rstrip().endswith('.') and sum(w[:1].isupper() or not w[:1].isalpha() for w in _w)>=0.6*len(_w)
sents=[]
for k,p in enumerate(paras):
    ss=[p] if (k==0 and TITLE) else [s.strip() for s in re.findall(r'[^.?!]+[.?!]+["”]?|[^.?!]+$',p) if s.strip()]
    sents+=ss
w=lambda t:1+len(t)/10
L=np.array([sum(w(t) for t in s.split()) for s in sents])
big=[(a,b) for a,b in runs if b-a>=0.3 and a>fs and b<ls]
B=[(fs,fs)]+big+[(ls,ls)];K=len(B);M=len(sents)
rate=sp(fs,ls)/L.sum();INF=1e18
dp=np.full((M+1,K),INF);bk=np.zeros((M+1,K),int);dp[0][0]=0
for m in range(1,M+1):
    for k in range(1,K):
        if m==M and k!=K-1: continue
        sk=0
        for j in range(k-1,-1,-1):
            if j<k-1: sk+=min(B[j+1][1]-B[j+1][0],1)
            if dp[m-1][j]>=INF: continue
            d=sp(B[j][1],B[k][0]); e=rate*L[m-1]
            if d>e*3+4: break
            c=dp[m-1][j]+(d-e)**2/(e+.3)+4*sk
            if c<dp[m][k]: dp[m][k]=c;bk[m][k]=j
idx=[K-1];k=K-1
for m in range(M,0,-1): k=bk[m][k]; idx.append(k)
idx=idx[::-1]
st=[(B[idx[m]][1],B[idx[m+1]][0]) for m in range(M)]
gaps=[st[i+1][0]-st[i][1] for i in range(M-1)]
print(f'END={END:.2f} sentences={M} gap min/max={min(gaps):.2f}/{max(gaps):.2f} (expect ~0.3-0.8)')
for (a,b),s,e in zip(st,sents,L*rate):
    if abs((b-a)-e)>max(1.5,0.5*e): print(f'  check {a:7.2f}-{b:7.2f} d={b-a:.2f} e={e:.2f} {s[:60]}')
def wt(t): return len(re.sub(r'[^A-Za-z0-9]','',t))+1.5
TW=[]
for (a,b),s in zip(st,sents):
    parts=[p for p in re.split(r'(?<=[,;:?])\s+',s) if p.strip()]
    inner=[(p,q) for p,q in runs if p>a+0.15 and q<b-0.15 and q-p>=0.1]
    W=[sum(wt(t) for t in p.split()) for p in parts]; tot=sum(W); tsp=max(sp(a,b),1e-6)
    bounds=[];used=-1;cum=0
    for kk in range(len(parts)-1):
        cum+=W[kk]; fr=cum/tot; best=None
        c=[(ix,r) for ix,r in enumerate(inner) if ix>used]
        if c:
            ix,r=min(c,key=lambda q: abs(sp(a,q[1][0])/tsp-fr))
            if abs(sp(a,r[0])/tsp-fr)<0.12: best=r;used=ix
        if best is None:
            t=a
            while t<b and sp(a,t)<fr*tsp: t+=0.01
            best=(t,t)
        bounds.append(best)
    segs=[];s0=a
    for p,q in bounds: segs.append((s0,p)); s0=q
    segs.append((s0,b))
    for part,(c0,c1) in zip(parts,segs):
        ws=part.split(); tw=sum(wt(t) for t in ws); acc=0; tot2=sp(c0,c1)
        for t_ in ws:
            t=c0
            while t<c1 and sp(c0,t)<acc/tw*tot2: t+=0.01
            while t<c1 and not speech[min(int(t*100),n-1)]: t+=0.01
            TW.append([round(t,2),re.sub(r'[^a-z0-9]','',t_.lower())]); acc+=wt(t_)
json.dump(TW,open('words.json','w'))
json.dump({'END':round(END,2),'title':paras[0] if TITLE else None,'sents':[[round(a,2),round(b,2),s] for (a,b),s in zip(st,sents)]},open('meta.json','w'))
print('words',len(TW),'title:',paras[0] if TITLE else None)
