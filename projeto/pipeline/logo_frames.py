from PIL import Image, ImageEnhance
import os, math
L="assets/logo/"
W,H=1080,1920
def ease(t): return 1-(1-t)**3
def back(t,s=1.7): t-=1; return t*t*((s+1)*t+s)+1
em=Image.open(L+"logo-emblema-1x1.png").convert("RGBA")
hz=Image.open(L+"logo-horizontal-3x1.png").convert("RGBA")
ic=Image.open(L+"logo-icone-1x1.png").convert("RGBA").resize((132,132),Image.LANCZOS)
a=ic.split()[3].point(lambda v:int(v*.9)); ic.putalpha(a); ic.save("assets/logo/icone-132.png")
def seq(img,base_w,n,d,name,hold_out=None,dim=None):
  os.makedirs(name,exist_ok=True)
  for f in range(n):
    t=f/ (d-1) if f<d else 1
    s=back(min(t,1)); al=min(1,f/4)
    if hold_out and f>=n-hold_out: al*= (n-f)/hold_out
    c=Image.new("RGBA",(W,H),(0,0,0,0))
    if dim is not None:
      c=Image.new("RGBA",(W,H),(8,6,6,int(dim*min(1,f/8)*255)))
    w=max(2,int(base_w*(0.6+0.4*s))); h=int(img.height*w/img.width)
    im=img.resize((w,h),Image.LANCZOS)
    if al<1: im.putalpha(im.split()[3].point(lambda v:int(v*al)))
    c.alpha_composite(im,((W-w)//2,(H-h)//2-60))
    c.save(f"{name}/{f:03d}.png")
seq(em,640,16,9,"assets/logo/intro",hold_out=5)          # 0.53s sting
seq(hz,940,66,12,"assets/logo/outro",dim=.78)            # 2.2s end card
