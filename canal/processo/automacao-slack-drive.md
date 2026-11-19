# Automação: Slack + Google Drive (regra obrigatória)

Toda prévia, todo vídeo final e toda atualização na `main` geram um aviso automático no Slack:
- os vídeos vão para o **Google Drive pessoal** de quem renderizou e ficam **públicos para quem tiver o link** (leitor);
- o link vai para o canal certo;
- o resumo das atualizações do GitHub vai para o canal de atualizações.
- **Quem faz:** o Claude de quem fez o trabalho, usando os conectores do Slack e do Google Drive.

| Evento | Canal | ID |
|---|---|---|
| prévia (rascunho) renderizada | `#links-rascunho` | `C0CKETABYPN` |
| vídeo final renderizado | `#links-final` | `C0CK9K17H3Q` |
| atualização na `main` (push ou PR aceito) e PR aberto | `#atualizações-projeto` | `C0CK9F72TFG` |

Os IDs também estão em `ferramentas/automacao.json`.

## Preparação (uma vez por pessoa)
1. **Conectores no seu Claude:** Slack e Google Drive conectados. No claude.ai: Configurações > Conectores.
2. **Envio do vídeo para o seu Drive.** Escolha um modo:
   - **A) Google Drive para computador** (recomendado). Instale o app e entre com a sua conta. Aparece a pasta `G:\Meu Drive`.
   - **B) rclone.** `winget install -e --id Rclone.Rclone`, depois `rclone config`: crie um remote do tipo `drive` com o nome `gdrive` e entre pelo navegador.
3. Registre a sua configuração (fica só no seu PC, em `ferramentas/automacao.local.json`):
   ```bash
   python ferramentas/publicar.py --configurar --pessoa jose     # ou --pessoa <seu-nome>; o modo é detectado
   ```
4. No Drive são criadas sozinhas: `Manual Zomboid/rascunhos/` e `Manual Zomboid/finais/`.

## Fluxo A: prévia (rascunho)
1. Rode `py3 pipeline/build.py NN rascunho`. Inspeção sem avisos.
2. Rode `python ferramentas/publicar.py NN previa`. Ele devolve um JSON com nome, `slack_canal` e `mensagem`.
   - Nome no Drive: `epNN-tema-previa-vK.mp4`. A versão `K` sobe sozinha.
3. **Link público:**
   - **modo rclone:** o link já vem no JSON.
   - **modo Drive para computador:**
     1. Espere a sincronização (~1–3 min).
     2. Conector Google Drive: `search_files` com `title = '<nome>' and owner = 'me' and trashed = false`.
     3. `share_file(fileId, role = "reader", permissionId = "anyoneWithLink")`.
     4. Use o `shareableLink` que voltar.
     - Arquivo ainda não apareceu? Espere 30 s e tente de novo, até ~5 min. Depois disso, avise a pessoa.
4. Troque `{LINK_VIDEO}`, `{RESUMO_1_LINHA}` e `{PONTO_DE_ATENCAO}` na mensagem e envie com `slack_send_message` no `#links-rascunho`.

## Fluxo B: vídeo final
1. Rode `py3 pipeline/build.py NN` e passe nos critérios de aceite.
2. Rode `python ferramentas/publicar.py NN final`. Ele envia o vídeo e a capa: `epNN-tema-final-vK.mp4` e `epNN-tema-capa-vK.jpg`.
3. Link público dos **dois** arquivos, como no fluxo A.
4. Envie com `slack_send_message` no `#links-final`.
5. Ponha o link do final na tabela de `videos/README.md` e mude o status do roteiro para `final`.
6. Faça commit `video(epNN): link do final`. Esse push dispara o fluxo C.

## Fluxo C: atualização no GitHub
1. **Antes do push:** guarde `BASE=$(git rev-parse origin/main)`.
2. Faça o push na `main`, ou aceite o PR e depois rode `git pull`.
3. Gere o texto com `python ferramentas/resumo_push.py $BASE..origin/main`.
4. Revise: no máximo 6 itens, 1 linha cada, no formato **o que — por quê**. Envie no `#atualizações-projeto`.
- **PR aberto:** `python ferramentas/resumo_push.py --pr <número>` gera o aviso curto, que vai no mesmo canal.
- O "por quê" sai da linha `Por quê: ...` do corpo de cada commit (`COLABORACAO.md`). Commit sem ela sai marcado.
- `ferramentas/automacao.json` → `"atualizacoes_via"`:
  - `"claude"` (padrão): o Claude posta;
  - `"action"`: o GitHub Action posta sozinho (modelo em `ferramentas/github-action-slack.yml`). **Nunca os dois.**

## Modelos de mensagem (o `publicar.py` já preenche)
```
🎬 **Rascunho EP16 — Animais** · v2 · por Jose
▶️ [Assistir prévia](LINK) · 1:08 · voz real (ElevenLabs)
• O que mudou: cena do galinheiro refeita, sons por fração
• Revisar: telas do cocho (painel simples, falta print)
```
```
✅ **Final EP16 — Animais** · v1 · por Jose
▶️ [Vídeo final](LINK) · 1:10 · 🖼️ [Capa](LINK)
• Título: Animais de fazenda: como não deixar morrer (B42) | Project Zomboid
• Checagens: inspeção 0 avisos · −14 LUFS · critérios de aceite ok
• Próximo passo: publicar quinta 18h
```
```
🔧 **Atualização no GitHub** · Jose · 2 commit(s) na main
• fato(animais): adiciona ani-cocho — _evita mostrar água no mesmo cocho da ração_
• roteiro(ep16): status validado — _todos os fatos em info-validada_
📁 info-validada 1 · roteiros 1 · [ver diferenças](LINK)
```

## Regras
- Link sempre **"qualquer pessoa com o link: leitor"**. Nunca "editor", nunca "pública na web".
  - Atenção: quem tiver o link assiste, inclusive prévias. Não poste fora dos 3 canais.
- Um aviso por evento. Re-render da mesma prévia = nova versão (`vK+1`) e novo aviso.
- Vídeo **publicado** não é reeditado nem reenviado.
- Os canais recebem só o que está nesta tabela. Comentário e discussão vão na thread da mensagem.
- Falhou (conector desconectado, Drive não sincroniza, rclone sem login)?
  - Diga à pessoa o que faltou, em uma linha. Não tente outro caminho por conta própria.
  - O vídeo continua salvo em `projeto/out/`.
- Nada de link, webhook ou token em arquivo do git: `automacao.local.json` e segredos ficam fora (`.gitignore`).
