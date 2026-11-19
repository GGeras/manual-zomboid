# 00 Padrao de Edicao - Video Gravado

_(convertido de `00 Referencias/12 Padrao Video Gravado/00 Padrao de Edicao - Video Gravado.txt`)_

```text
PADRÃO DE EDIÇÃO — VÍDEO GRAVADO (gameplay)  ·  Manual Zomboid  ·  v1, 15/11/2026
Referência aprovada: video-referencia-bases01.mp4 (Bases 01 — Quartel de Bombeiros de Rosewood, B42)
Vale para todo vídeo feito com GRAVAÇÃO DE TELA do jogo (não para os vídeos animados/gerados).

=== FLUXO ===
1. Jose grava a tela (1080p, 30 fps). Esconder o cursor. Cada cômodo/lugar com pelo menos 4 s, andando devagar.
2. Claude faz o CORTE primeiro (sem voz) e manda prévia + mapa de tempos (o que aparece em cada segundo).
3. Jose aprova o corte → Claude escreve o roteiro e o prompt do ElevenLabs feitos PARA o vídeo (a voz se adapta ao vídeo, nunca o contrário).
4. Jose gera a voz (2 versões) → Claude escolhe a que tem as pausas certas, encaixa cada frase no seu trecho e monta o final.
5. Ajustes finos → entrega em Final\<Série NN - Nome>\ (video.mp4, legendas.srt, instrucoes.txt). Versão anterior vai para versoes\.

=== FORMATO E RECORTE ===
- 1080x1920 (9:16), 30 fps, H.264, áudio -14 LUFS. Duração livre (a referência tem 1:40).
- Recorte central 562x1000 do 1920x1080, com x=679 (a câmera do jogo segue o personagem; o recorte tira a hotbar).
- Janela de loot aberta: deslocar o recorte para a esquerda (x=630) para a janela aparecer INTEIRA, sempre em 1x.
- Close de algo pequeno (ex.: o peixe): recorte apertado 340x604 no personagem + zoom lento.
- Abertura e "vista": zoom lento (Ken Burns, +6%).

=== RITMO ===
- Velocidade padrão 1x. Caminhar/subir: 1,5x–2x. Espera longa (pesca): 2,5x. Nunca mais rápido que isso.
- Cada lugar fica pelo menos ~4 s na tela (exceção: quando a gravação não tem mais).
- Troca de lugar: fusão de 0,3 s. Dentro do mesmo lugar: corte seco.
- Cortar: teto preto piscando, câmera atrás de parede, trechos repetidos, o que confunde (ex.: pescar no asfalto).
- Momentos de ação (loot, beber, queda, peixe) sempre em 1x.

=== SOM ===
- Som do jogo da gravação em 15% (é ambiente, não pode competir com a voz).
- Música da trilha do jogo (07 Musicas Ambiente) em volume baixo, abaixando sozinha quando a voz fala (ducking).
- Abertura: susto do canal (sfx-susto-abertura.mp3).
- Efeitos pontuais sincronizados no quadro exato (ex.: gole no bebedouro; som cartoon na queda — pedido do Jose:
  acelerado 1,7x, golpe no quadro do impacto, cauda cortada ~1,2 s depois).
- Fala pode ser dividida em partes para casar com o take (ex.: "Quartos com armário..." / "...e cozinha completa").

=== TELA (camadas, de cima para baixo) ===
- Topo esquerdo: ícone do canal 132 px (some quando a janela de loot está aberta).
- Topo direito: moodles REAIS do jogo quando fizer sentido (sede no bebedouro; fratura + dor na queda).
- Meio-baixo esquerda: chips com o ÍCONE ORIGINAL do item (zip v4, assets/items) entrando quando a voz fala o item.
- Legenda dinâmica (base em y≈1470): Inter Black 76, MAIÚSCULAS, bege #EFE5CF com contorno preto,
  palavra falada em vermelho #FF3D55, até ~15 letras por vez, "pop" a cada grupo, sem vírgula/ponto.
  Some no título de abertura e quando os chips de item estão na tela (eles já mostram a palavra).
- Rótulo do lugar (y=1600): caixa preta #111 com texto bege. Cores especiais: perigo = vermelho #C8102E,
  água/pesca = verde #2E7D32, dica certa = verde #8FE04A (texto preto), humor/destaque = amarelo #FFB020 (texto preto).
  Rótulo temporário tem duração máxima (ex.: "O PEIXE TROFÉU" 4,5 s).
- Base: barra de progresso vermelha fina (10 px).

=== ELEMENTOS DE RETENÇÃO (sem ficar forçado) ===
- Abertura: emblema + susto (1,2 s) → título em 2 linhas (linha 2 vermelha).
- Punch-zoom curto (8%, 0,6 s) em palavras-chave e no impacto ("ENORME", "fisgou", "monstro").
- Impacto (queda): tremida + flash vermelho 0,12 s + moodles.
- Fim: "VEREDITO DO MANUAL" — 3 pontos ✓ verdes + 1 ✗ vermelho, um por vez, durante o convite para comentar.
- Cartão final 2,2 s com o logo horizontal sobre o último quadro escurecido.

=== ROTEIRO ===
- Só fatos confirmados (o que aparece no vídeo ou está na PZwiki). Na dúvida, falar só do que a imagem mostra.
- Humor leve do Jose é bem-vindo ("paizão", "jogar no Vasco", "peixe troféu").
- Fim: convite para comentar qual o próximo (ex.: "Comenta qual base você quer no próximo: a mais pedida, eu trago").
- Voz: Jhony Tygas – Natural Mature, Eleven v4, vel 1.00, estab 40, simil 75, [pausa longa] entre trechos.

=== ARQUIVOS ===
- video-referencia-bases01.mp4 ...... o vídeo aprovado (copiar o estilo dele)
- quadros-referencia.jpg ............ 10 quadros mostrando cada elemento
- 04 Arquivos de Projeto\projeto-video-gravado.zip ... código (edit2.py, ovl.py, captions.py) + efeitos + PNGs
```
