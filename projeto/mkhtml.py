import sys
for ep in sys.argv[1:] or ['02','03','04']:
    open(f'ep{ep}.html','w').write(f'''<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><title>Episódio {ep}</title>
<meta name="viewport" content="width=1080, height=1920">
<link rel="stylesheet" href="./runtime/fonts.css"><link rel="stylesheet" href="./ep.css"></head>
<body><div id="main"><canvas id="gl" width="1080" height="1920"></canvas><div id="shade"></div></div>
<script src="./runtime/vendor/gsap.min.js"></script><script src="./runtime/motion.js"></script>
<script src="./ep{ep}.cfg.js"></script><script src="./ep-core.js"></script>
<script type="module" src="./ep{ep}.js"></script></body></html>''')
