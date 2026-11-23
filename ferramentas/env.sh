# Manual Zomboid — ambiente para o Git Bash (Claude Code no Windows).
# Uso (em todo comando novo):  source ferramentas/env.sh   (a partir da raiz do repo)
# Depois disso:  py3 pipeline/build.py 16 rascunho   |   node "$SKILL/scripts/render.mjs" ...
R="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
command -v cygpath >/dev/null 2>&1 && R="$(cygpath -m "$R")"
export SKILL="$R/ferramentas/motionmaxxing" PYTHONUTF8=1 PYTHONIOENCODING=utf-8
# Placa de vídeo: detecta sozinho (funciona no PC com ou sem placa dedicada).
# Forçar: PZ_GPU=1 (usa a placa) ou PZ_GPU=0 (só processador) antes do source. RENDER_JOBS = renders em paralelo.
PLACA=""
if command -v powershell.exe >/dev/null 2>&1; then
  PLACA="$(powershell.exe -NoProfile -Command "(Get-CimInstance Win32_VideoController | Select-Object -ExpandProperty Name) -join ' + '" 2>/dev/null | tr -d '\r')"
elif command -v nvidia-smi >/dev/null 2>&1; then
  PLACA="$(nvidia-smi --query-gpu=name --format=csv,noheader 2>/dev/null | head -1)"
fi
NUC="$(nproc 2>/dev/null || echo "${NUMBER_OF_PROCESSORS:-2}")"; JOBS_AUTO=$(( NUC / 2 )); [ "$JOBS_AUTO" -lt 1 ] && JOBS_AUTO=1
MODO="processador"
if [ -z "${PZ_GPU+x}" ]; then
  if echo "$PLACA" | grep -qiE 'NVIDIA|AMD|Radeon|Arc'; then PZ_GPU=1; MODO="placa dedicada"; JOBS_AUTO=6
  elif echo "$PLACA" | grep -qiE 'Intel|Iris|UHD'; then PZ_GPU=1; MODO="placa integrada"; JOBS_AUTO=3; fi
elif [ "$PZ_GPU" != "0" ]; then MODO="placa (forçado)"; fi
if [ "${PZ_GPU:-0}" = "0" ]; then unset PZ_GPU; MODO="processador"; else export PZ_GPU=1; fi
export RENDER_JOBS="${RENDER_JOBS:-$JOBS_AUTO}"
for c in "C:/Program Files/Google/Chrome/Application/chrome.exe" "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe" \
         "$(cygpath -m "$LOCALAPPDATA" 2>/dev/null)/Google/Chrome/Application/chrome.exe"; do
  [ -f "$c" ] && { export CHROME_PATH="$c" PZ_CHROME="$c"; break; }
done
[ -z "$CHROME_PATH" ] && echo "AVISO: Chrome não encontrado — rode instalar.bat"
py3() { if command -v py >/dev/null 2>&1; then py -3 "$@"; else python "$@"; fi; }
cd "$R/projeto"
echo "ok: render=$MODO ($PLACA)  JOBS=$RENDER_JOBS  CHROME=$CHROME_PATH  (pasta: projeto)"
