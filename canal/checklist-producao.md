# 04 Checklist de Producao

_(convertido de `00 Referencias/10 Roteiro, Voz e Publicacao/04 Checklist de Producao.txt`)_

```text
CHECKLIST DE PRODUÇÃO — por vídeo (v3, do 11 em diante)

1. ROTEIRO (Claude)
  [ ] Fatos tirados da base do canal (fatos.json) ou conferidos em fonte build 42.20+
  [ ] Nenhum fato contradiz vídeo anterior (lista "não usar" da base)
  [ ] Gancho -> base -> exemplo -> armadilhas -> fecho/CTA | duração que a explicação pedir | tags de emoção

2. VOZ (Jose)
  [ ] 2 versões no ElevenLabs, enviadas
  [ ] Claude roda a checagem da voz: tag lida em voz alta, frase repetida, pausa longa

3. RASCUNHO (Claude, ~10 min) — antes de gastar 25 min de render
  [ ] Inspeção automática sem avisos: texto sobreposto, texto na área dos botões do app,
      personagem fora do quadro ou escondido, trecho parado mais de 3 s
  [ ] Folha de quadros de cada ação conferida (golpe, beber, abastecer...)
  [ ] Lista de sons: cada som cai numa ação visível, nenhum som atravessa a troca de cena
  [ ] PRÉVIA enviada ao Jose -> APROVADA

4. FINAL (automático)
  [ ] video.mp4 (versão anterior guardada em "versoes", nunca sobrescrita)
  [ ] capa.jpg (v5) | instrucoes.txt (YouTube, Reels, TikTok) | legendas.srt

5. ANTES DE POSTAR (Jose)
  [ ] Assistir com som (Claude não ouve): volume da música, sons no tempo certo
  [ ] Escolher a capa | Subir legendas.srt no YouTube e TikTok
  [ ] Vídeo já publicado: nunca substituir o arquivo; correção vira "video_v2"
```

## Pedido de revisão

Uma mensagem só, com todos os pontos: `EPNN · tempo · o que está errado · como deve ficar` (print quando der).

## Antes de entregar o final

1. Voz final recebida e tempos refeitos.
2. Cada ponto da revisão conferido em foto.
3. Antes do render final: rodar a inspeção e ler `inspecao/relatorio.txt`.
4. Depois do render: olhar os trechos revisados no `video.mp4`.

## Economia nos ajustes

1. Um chat por episódio.
2. Voz final antes de polir animação.
3. Fotos só dos trechos citados, com `projeto/pipeline/shot.mjs`, no máximo 2 rodadas.
4. O Claude lê só os trechos necessários e não lista pastas grandes.
