#!/usr/bin/env bash
# restaurar.sh — monta o projeto numa sessão nova a partir dos 2 zips do PC do Jose.
# Uso: bash restaurar.sh <pasta-com-os-zips>   (ex.: /mnt/user-data/uploads/04 Arquivos de Projeto)
# Ordem: v2 (base: assets, sons, músicas, áudios, runtime), depois v3-codigo POR CIMA (código atual) e v4-jogo (modelos e ícones do jogo).
set -e
Z="${1:?informe a pasta com projeto-manual-zomboid-v2.zip e projeto-manual-zomboid-v3-codigo.zip}"
D=/home/claude/eps; mkdir -p "$D"; cd "$D"
unzip -q -o "$Z/projeto-manual-zomboid-v2.zip" -d "$D"
unzip -q -o "$Z/projeto-manual-zomboid-v3-codigo.zip" -d "$D"
[ -f "$Z/projeto-manual-zomboid-v4-jogo.zip" ] && unzip -q -o "$Z/projeto-manual-zomboid-v4-jogo.zip" -d "$D" || echo "AVISO: sem projeto-manual-zomboid-v4-jogo.zip (modelos do jogo) — vídeos com pz: true não funcionam"
[ -d assets/logo/intro ] || python3 pipeline/logo_frames.py
for f in ep[0-9][0-9].js; do n=${f:2:2}; [ -f ep$n.html ] || python3 mkhtml.py $n; done
echo "--- conferência ---"
ok=1; for c in node ffmpeg ffprobe python3; do command -v $c >/dev/null || { echo "FALTA: $c"; ok=0; }; done
node -e "require('playwright')" 2>/dev/null || echo "aviso: playwright não encontrado pelo node (inspeção usa o do sistema)"
for f in engine.js pz.js assets/pz/models.js assets/pz/tex.js assets/items/index.json sets.js ep3d.js ep-core.js pipeline/build.py pipeline/inspect.mjs pipeline/fatos.json assets/music/aprovadas.json; do [ -f "$f" ] || { echo "FALTA: $f"; ok=0; }; done
echo "sons: $(find assets/sfx -name '*.ogg' -o -name '*.wav' -o -name '*.mp3' | wc -l) | músicas: $(ls assets/music | wc -l) | episódios: $(ls ep[0-9][0-9].js | tr '\n' ' ')"
[ $ok = 1 ] && echo "PRONTO. Próximo: carregar a skill motionmaxxing e seguir README.md (fluxo v3)." || echo "Restauração incompleta: ver FALTA acima."
