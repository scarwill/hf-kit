# usage: python3 build.py video.js <audio-file-name e.g. mamba.m4a> [out=index.html] [--short] [--no-head] [--bgm bgm.m4a] [--bgm-vol 1]
#   --short   = YouTube Short, 1080x1920 vertical (sets VERT=true; areas are 1080x1920 rooms, AO pitch 1500x2400)
#   --no-head = no silent intro and no outro tail (HEAD = TAIL = 0): frame 0 = first word, last frame = last word (Kurz Shorts always use it)
#   --bgm F   = add ONE background-music track (assets/F) under the voice, same length as the audio; --bgm-vol scales it (default 1;
#               bgm.py already mixes it ~14 dB under the voice). Only voice + this one track: no sound effects.
# timeline = HEAD s silent intro + audio + TAIL s outro. Word times are shifted by HEAD, so END = HEAD + audio length.
import json,sys
args=sys.argv[1:]; VERT='--short' in args; NOHEAD='--no-head' in args
def opt(k, d=None):
    if k in args: i=args.index(k); v=args[i+1]; del args[i:i+2]; return v
    return d
BGM=opt('--bgm'); BGMV=opt('--bgm-vol','1')
A=[a for a in args if a not in ('--short','--no-head')]
vid,aud=A[0],A[1]; out=A[2] if len(A)>2 else 'index.html'; FW,FH=(1080,1920) if VERT else (1920,1080)
HEAD,TAIL=(0,0) if NOHEAD else (1.5,3.1)
M=json.load(open('meta.json')); AUD=M['END']; END=round(HEAD+AUD,2)
TW=[[round(t+HEAD,2),w] for t,w in json.load(open('words.json'))]
v=open(vid,encoding='utf-8').read()
js=f"const VERT={'true' if VERT else 'false'};\nconst TW={json.dumps(TW,separators=(',',':'))};\nconst HEAD={HEAD};\nconst END={END};\nconst TAIL={TAIL};\nconst TITLE={json.dumps(M.get('title'))};\n"+v+"\n"+open(__file__.replace('build.py','kit.js')).read()
bgm=f'  <audio id="bgm" data-start="{HEAD}" data-duration="{AUD}" data-track-index="1" data-volume="{BGMV}" src="assets/{BGM}"></audio>\n' if BGM else ''
h=open(__file__.replace('build.py','template.html')).read().replace('%%DUR%%',str(round(END+TAIL,2))).replace('%%HEAD%%',str(HEAD)).replace('%%AUD%%',str(AUD)).replace('%%AUDIO%%',aud).replace('%%BGM%%',bgm).replace('%%TITLE%%','Explainer').replace('%%W%%',str(FW)).replace('%%H%%',str(FH)).replace('%%JS%%',js)
open(out,'w',encoding='utf-8').write(h); print(out,len(h),'END',END,'DUR',round(END+TAIL,2),'title',M.get('title'),'| no-head' if NOHEAD else '','| bgm '+BGM if BGM else '')
