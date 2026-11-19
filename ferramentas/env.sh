# Manual Zomboid — ambiente para o Git Bash (Claude Code no Windows).
# Uso (em todo comando novo):  source ferramentas/env.sh   (a partir da raiz do repo)
# Depois disso:  py3 pipeline/build.py 16 rascunho   |   node "$SKILL/scripts/render.mjs" ...
R="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
command -v cygpath >/dev/null 2>&1 && R="$(cygpath -m "$R")"
export SKILL="$R/ferramentas/motionmaxxing" PZ_GPU=1 PYTHONUTF8=1 PYTHONIOENCODING=utf-8
export RENDER_JOBS="${RENDER_JOBS:-6}"
for c in "C:/Program Files/Google/Chrome/Application/chrome.exe" "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe" \
         "$(cygpath -m "$LOCALAPPDATA" 2>/dev/null)/Google/Chrome/Application/chrome.exe"; do
  [ -f "$c" ] && { export CHROME_PATH="$c" PZ_CHROME="$c"; break; }
done
[ -z "$CHROME_PATH" ] && echo "AVISO: Chrome não encontrado — rode instalar.bat"
py3() { if command -v py >/dev/null 2>&1; then py -3 "$@"; else python "$@"; fi; }
cd "$R/projeto"
echo "ok: SKILL=$SKILL  CHROME=$CHROME_PATH  JOBS=$RENDER_JOBS  (pasta: projeto)"
