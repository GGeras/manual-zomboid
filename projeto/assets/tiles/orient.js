// orient.js — DIREÇÃO de cada sprite do jogo (regra 4.4, 22/11). Conferido olhando os 4 desenhos de cada móvel (ver README).
// frente = para onde a frente do móvel aponta (S = para a câmera/esquerda, E = para a câmera/direita, N e W = de costas para a câmera)
// borda  = sprite de parede/cortina: em qual borda do ladrilho ele foi desenhado (N, W, S, E). Só pode ir em C.parede(<mesma borda>).
// encosta = móvel que no jogo fica com as costas na parede (fogão, geladeira, bancada, estante, cômoda, pia)
export default {
  appliances_cooking_01_12: { frente: 'E', encosta: 1 }, appliances_cooking_01_13: { frente: 'S', encosta: 1 }, appliances_cooking_01_14: { frente: 'W', encosta: 1 }, appliances_cooking_01_15: { frente: 'N', encosta: 1 },
  appliances_refrigeration_01_0: { frente: 'E', encosta: 1 }, appliances_refrigeration_01_1: { frente: 'S', encosta: 1 }, appliances_refrigeration_01_2: { frente: 'W', encosta: 1 }, appliances_refrigeration_01_3: { frente: 'N', encosta: 1 },
  appliances_television_01_0: { frente: 'E' }, appliances_television_01_1: { frente: 'S' }, appliances_television_01_2: { frente: 'W' }, appliances_television_01_3: { frente: 'N' },
  furniture_storage_01_12: { frente: 'E', encosta: 1 }, furniture_storage_01_13: { frente: 'S', encosta: 1 }, furniture_storage_01_14: { frente: 'W', encosta: 1 }, furniture_storage_01_15: { frente: 'N', encosta: 1 },
  furniture_shelving_01_40: { frente: 'S', encosta: 1 }, furniture_shelving_01_41: { frente: 'E', encosta: 1 }, furniture_shelving_01_42: { frente: 'N', encosta: 1 }, furniture_shelving_01_43: { frente: 'W', encosta: 1 },
  fixtures_counters_01_43: { frente: 'E', encosta: 1 }, fixtures_counters_01_45: { frente: 'S', encosta: 1 },
  fixtures_sinks_01_0: { frente: 'E' }, fixtures_sinks_01_1: { frente: 'S' }, fixtures_sinks_01_2: { frente: 'W' }, fixtures_sinks_01_3: { frente: 'N' },
  furniture_seating_indoor_01_8: { frente: 'E' }, furniture_seating_indoor_01_9: { frente: 'S' }, furniture_seating_indoor_01_10: { frente: 'W' }, furniture_seating_indoor_01_11: { frente: 'N' },
  furniture_seating_indoor_01_56: { frente: 'E' }, furniture_seating_indoor_01_57: { frente: 'S' }, furniture_seating_indoor_01_58: { frente: 'N' }, furniture_seating_indoor_01_59: { frente: 'W' },
  // cortinas: azul fechada 24–27, azul aberta 28–31, branca fechada 8–11, branca aberta 12–15 (W, E, N, S)
  fixtures_windows_curtains_01_24: { borda: 'W' }, fixtures_windows_curtains_01_25: { borda: 'E' }, fixtures_windows_curtains_01_26: { borda: 'N' }, fixtures_windows_curtains_01_27: { borda: 'S' },
  fixtures_windows_curtains_01_28: { borda: 'W' }, fixtures_windows_curtains_01_29: { borda: 'E' }, fixtures_windows_curtains_01_30: { borda: 'N' }, fixtures_windows_curtains_01_31: { borda: 'S' },
  fixtures_windows_curtains_01_8: { borda: 'W' }, fixtures_windows_curtains_01_9: { borda: 'E' }, fixtures_windows_curtains_01_10: { borda: 'N' }, fixtures_windows_curtains_01_11: { borda: 'S' },
  fixtures_windows_curtains_01_12: { borda: 'W' }, fixtures_windows_curtains_01_13: { borda: 'E' }, fixtures_windows_curtains_01_14: { borda: 'N' }, fixtures_windows_curtains_01_15: { borda: 'S' },
  // tábuas de barricada: pares = parede W, ímpares = parede N (carpentry_01_8–15); chapa 24/25, barras 52–55 (mesma regra)
  carpentry_01_8: { borda: 'W' }, carpentry_01_9: { borda: 'N' }, carpentry_01_10: { borda: 'W' }, carpentry_01_11: { borda: 'N' }, carpentry_01_12: { borda: 'W' }, carpentry_01_13: { borda: 'N' }, carpentry_01_14: { borda: 'W' }, carpentry_01_15: { borda: 'N' },
  constructedobjects_01_24: { borda: 'W' }, constructedobjects_01_25: { borda: 'N' }, constructedobjects_01_52: { borda: 'W' }, constructedobjects_01_53: { borda: 'N' },
  // regra 4.4 (23/11, EP19): poltrona de couro 44 S / 45 E / 46 N / 47 W; mesa de centro, bancadinha, quadros, relógio, rodapé, porta e batente
  furniture_seating_indoor_02_44: { frente: 'S' }, furniture_seating_indoor_02_45: { frente: 'E' }, furniture_seating_indoor_02_46: { frente: 'N' }, furniture_seating_indoor_02_47: { frente: 'W' },
  walls_decoration_01_40: { borda: 'W' }, walls_decoration_01_41: { borda: 'N' }, walls_decoration_01_52: { borda: 'W' }, walls_decoration_01_53: { borda: 'N' },
  walls_decoration_01_104: { borda: 'W' }, walls_decoration_01_105: { borda: 'N' },
  walls_interior_detailing_01_32: { borda: 'W' }, walls_interior_detailing_01_33: { borda: 'N' },
  walls_interior_house_01_46: { borda: 'W' }, walls_interior_house_01_47: { borda: 'N' },
  fixtures_doors_01_4: { borda: 'W' }, fixtures_doors_01_5: { borda: 'N' },
};
