// EP 26 — Animais Produção (B42.22) — ESQUELETO: tempos alinhados à voz ElevenLabs; cenas, ícones e sons a fazer (roteiros/ep26-animais-producao.md)
const LAB = 'PROJECT ZOMBOID · <b>ANIMAIS PRODUÇÃO</b>';
window.EP = {
  pz: true, versao: 'BUILD 42.22',
  itens: ["Item_Egg", "Item_Bucket_Milk", "Item_SheepShears", "Item_WoolRaw"],
  OFF: 1.3,
  T: [0.0, 4.38, 8.46, 13.88, 18.2, 24.62, 30.99, 36.99, 42.0, 46.73, 52.65, 58.28], END: 64.41,
  scenes: [{ at: 0 }, { at: 1, lab: LAB }, { at: 2, lab: LAB }, { at: 3, lab: LAB }, { at: 4, lab: LAB }, { at: 5, lab: LAB }, { at: 6, lab: LAB }, { at: 7, lab: LAB }, { at: 8, lab: LAB }, { at: 9, lab: LAB }, { at: 10, lab: LAB }, { at: 11, lab: LAB }],
  titles: [
    { i: 0, a: "Galinheiro", b: "sujo", aSize: 96, size: 110 },
    { i: 1, a: "Limpe", b: "", aSize: 96, size: 110 },
    { i: 2, a: "Área de", b: "animais", aSize: 96, size: 110 },
    { i: 3, a: "Dois", b: "cochos", aSize: 96, size: 110 },
    { i: 4, a: "Água no", b: "cocho", aSize: 96, size: 110 },
    { i: 5, a: "Um ovo", b: "por dia", aSize: 96, size: 110 },
    { i: 6, a: "Ovo", b: "fecundado", aSize: 96, size: 110 },
    { i: 7, a: "Leite", b: "", aSize: 96, size: 110 },
    { i: 8, a: "Sem ordenha:", b: "seca", aSize: 96, size: 110 },
    { i: 9, a: "Lã e", b: "cria", aSize: 96, size: 110 },
    { i: 10, a: "Estresse", b: "", aSize: 96, size: 110 },
    { i: 11, a: "Qual você", b: "criaria?", aSize: 96, size: 110 }
  ]
};
