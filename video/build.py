# usage: python3 build.py video.js <audio-file-name e.g. mamba.m4a> [out=index.html] [--short]
#   --short = YouTube Short, 1080x1920 vertical (sets VERT=true; areas are 1080x1920 rooms, AO pitch 1500x2400)
# timeline = HEAD s silent intro + audio + TAIL s outro. Word times are shifted by HEAD, so END = HEAD + audio length.
import json,sys
VERT='--short' in sys.argv; A=[a for a in sys.argv[1:] if a!='--short']
vid,aud=A[0],A[1]; out=A[2] if len(A)>2 else 'index.html'; FW,FH=(1080,1920) if VERT else (1920,1080)
HEAD,TAIL=1.5,3.1
M=json.load(open('meta.json')); AUD=M['END']; END=round(HEAD+AUD,2)
TW=[[round(t+HEAD,2),w] for t,w in json.load(open('words.json'))]
v=open(vid,encoding='utf-8').read()
js=f"const VERT={'true' if VERT else 'false'};\nconst TW={json.dumps(TW,separators=(',',':'))};\nconst HEAD={HEAD};\nconst END={END};\nconst TAIL={TAIL};\nconst TITLE={json.dumps(M.get('title'))};\n"+v+"\n"+open(__file__.replace('build.py','kit.js')).read()
h=open(__file__.replace('build.py','template.html')).read().replace('%%DUR%%',str(round(END+TAIL,2))).replace('%%HEAD%%',str(HEAD)).replace('%%AUD%%',str(AUD)).replace('%%AUDIO%%',aud).replace('%%TITLE%%','Explainer').replace('%%W%%',str(FW)).replace('%%H%%',str(FH)).replace('%%JS%%',js)
open(out,'w',encoding='utf-8').write(h); print(out,len(h),'END',END,'DUR',round(END+TAIL,2),'title',M.get('title'))
