# usage: python3 build.py video.js <audio-file-name e.g. mamba.m4a> [out=index.html]
# timeline = HEAD s silent intro + audio + TAIL s outro. Word times are shifted by HEAD, so END = HEAD + audio length.
import json,sys
vid,aud=sys.argv[1],sys.argv[2]; out=sys.argv[3] if len(sys.argv)>3 else 'index.html'
HEAD,TAIL=1.5,3.1
M=json.load(open('meta.json')); AUD=M['END']; END=round(HEAD+AUD,2)
TW=[[round(t+HEAD,2),w] for t,w in json.load(open('words.json'))]
v=open(vid,encoding='utf-8').read()
js=f"const TW={json.dumps(TW,separators=(',',':'))};\nconst HEAD={HEAD};\nconst END={END};\nconst TAIL={TAIL};\nconst TITLE={json.dumps(M.get('title'))};\n"+v+"\n"+open(__file__.replace('build.py','kit.js')).read()
h=open(__file__.replace('build.py','template.html')).read().replace('%%DUR%%',str(round(END+TAIL,2))).replace('%%HEAD%%',str(HEAD)).replace('%%AUD%%',str(AUD)).replace('%%AUDIO%%',aud).replace('%%TITLE%%','Explainer').replace('%%JS%%',js)
open(out,'w',encoding='utf-8').write(h); print(out,len(h),'END',END,'DUR',round(END+TAIL,2),'title',M.get('title'))
