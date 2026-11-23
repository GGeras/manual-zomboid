import sys,json,re,subprocess,math,wave
import numpy as np
from scipy.signal import find_peaks
def syl(t):
    t=t.lower(); t=re.sub(r'[^a-záéíóúâêôãõàç ]',' ',t)
    return max(1,len(re.findall(r'[aeiouáéíóúâêôãõà]+',t)))
def segs(mp3):
    out=subprocess.run(['ffmpeg','-i',mp3,'-af','silencedetect=n=-38dB:d=0.16','-f','null','-'],capture_output=True,text=True).stderr
    ev=re.findall(r'silence_(start|end): ([\d.]+)',out)
    dur=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',mp3]))
    S=[];E=[];cur=0.0;insil=False
    # build speech segments
    t0=0.0
    for k,v in ev:
        v=float(v)
        if k=='start':
            if v-t0>0.08: S.append(t0);E.append(v)
        else: t0=v
    if dur-t0>0.08: S.append(t0);E.append(dur)
    return S,E,dur
def peaks(mp3):
    subprocess.run(['ffmpeg','-v','error','-y','-i',mp3,'-ac','1','-ar','16000','/tmp/claude-0/a16.wav'])
    w=wave.open('/tmp/claude-0/a16.wav');x=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(float)/32768
    hop=160;win=400;fr=np.lib.stride_tricks.sliding_window_view(x,win)[::hop]*np.hanning(win)
    sp=np.abs(np.fft.rfft(fr,axis=1));f=np.fft.rfftfreq(win,1/16000)
    e=sp[:,(f>300)&(f<2500)].sum(1);e=np.convolve(e,np.ones(5)/5,'same');e/=e.max()
    pk,_=find_peaks(e,prominence=0.06,distance=9);return pk*hop/16000
def align(mp3,sents):
    S,E,dur=segs(mp3);t=peaks(mp3)
    cnt=[int(((t>=s)&(t<=e)).sum()) for s,e in zip(S,E)]
    exp=[syl(s) for s in sents];n=len(S);m=len(sents)
    rate=sum(cnt)/sum(exp)
    INF=1e18;dp=[[INF]*(n+1) for _ in range(m+1)];bk=[[0]*(n+1) for _ in range(m+1)];dp[0][0]=0
    for i in range(1,m+1):
        for j in range(1,n+1):
            for a in range(max(0,j-14),j):   # até 14 trechos por frase (vozes com muitas pausas curtas, ex. EP18 ElevenLabs)
                if dp[i-1][a]>=INF: continue
                c=sum(cnt[a:j]); cost=math.log((c+1)/(exp[i-1]*rate+1))**2
                if dp[i-1][a]+cost<dp[i][j]: dp[i][j]=dp[i-1][a]+cost;bk[i][j]=a
    j=n;res=[]
    for i in range(m,0,-1):
        a=bk[i][j];res.append((S[a],E[j-1],sum(cnt[a:j]),exp[i-1]));j=a
    res=res[::-1]
    gaps=[res[i+1][0]-res[i][1] for i in range(m-1)]
    return dict(cost=round(dp[m][n],3),dur=dur,starts=[round(r[0],2) for r in res],ends=[round(r[1],2) for r in res],detail=res,maxgap=round(max(gaps),2),lead=round(res[0][0],2))
if __name__=='__main__':
    sents=json.load(open(sys.argv[2]))
    r=align(sys.argv[1],sents)
    print(json.dumps({k:r[k] for k in ['cost','dur','maxgap','lead']}))
    for s,(a,b,c,e) in zip(sents,r['detail']): print(f"{a:6.2f}-{b:6.2f} det={c:2d} exp={e:2d} {s}")
    json.dump(r['starts']+[r['ends'][-1]],open(sys.argv[1]+'.align.json','w'))
