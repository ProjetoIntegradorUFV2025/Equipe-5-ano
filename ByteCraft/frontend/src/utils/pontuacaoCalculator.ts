import type { NivelDificuldade } from "../types";

/**
 * Define a pontuação base por peça
 * Total esperado: 4 peças × 100 = 400 pontos base
 */
const PONTUACAO_BASE_POR_PECA = 100;

/**
 * Tabela de penalidades por tentativa conforme RN10
 */
const PENALIDADES: Record<NivelDificuldade, Record<number, number>> = {
  facil: {
    1: 0,      // 100%
    2: 0,      // aviso, sem desconto
    3: 20,     // dica, -20%
    4: 50,     // ilumina, -50%
  },
  medio: {
    1: 0,      // 100%
    2: 5,      // -5%
    3: 10,     // -10%
    4: 20,     // aviso, -20%
    5: 30,     // dica, -30%
  },
  dificil: {
    1: 0,      // 100%
    2: 10,     // -10%
    3: 15,     // -15%
    4: 25,     // aviso, -25%
    5: 40,     // aviso, -40%
  },
};

/**
 * Feedback/ajuda para cada tentativa conforme RN10
 */
const FEEDBACK_TENTATIVA: Record<NivelDificuldade, Record<number, string>> = {
  facil: {
    1: "Parabéns! Primeira tentativa!",
    2: "⚠️ Aviso: Cuidado com a posição",
    3: "💡 Dica: Procure uma área com destaque especial",
    4: "✨ Área iluminada: É aqui!",
  },
  medio: {
    1: "Perfeito! Primeira tentativa!",
    2: "😊 Quase lá, tente de novo",
    3: "💡 Procure observar melhor a posição",
    4: "⚠️ Cuidado! Está ficando mais difícil",
    5: "💡 Dica: Observe o contorno no computador",
  },
  dificil: {
    1: "Excelente! Primeira tentativa!",
    2: "😊 Continue tentando",
    3: "💡 Observe a estrutura com atenção",
    4: "⚠️ Cuidado! Mais uma e você perde mais pontos",
    5: "⚠️ Última chance! Escolha com cuidado",
  },
};

/**
 * Calcula a pontuação de uma peça conforme RN10
 * 
 * @param numeroTentativas - Número da tentativa (1, 2, 3, etc)
 * @param nivel - Nível de dificuldade
 * @param pontosBase - Pontos base da peça (padrão: 100)
 * @returns Objeto com pontos e feedback
 */
export function calcularPontuacaoPeca(
  numeroTentativas: number,
  nivel: NivelDificuldade,
  pontosBase: number = PONTUACAO_BASE_POR_PECA
): { pontos: number; feedback: string; desconto: number } {
  // Pegar a penalidade da tabela (se não existir, retorna 0)
  const penalidade = PENALIDADES[nivel][numeroTentativas] ?? PENALIDADES[nivel][5] ?? 50;
  
  // Calcular desconto (pode ultrapassar 100% em casos extremos)
  const desconto = Math.min(penalidade, 100);
  
  // Calcular pontos finais
  const pontos = Math.max(0, pontosBase * (1 - desconto / 100));
  
  // Obter feedback
  const feedback = FEEDBACK_TENTATIVA[nivel][numeroTentativas] ?? 
                   FEEDBACK_TENTATIVA[nivel][5] ?? 
                   "Tente novamente!";
  
  return {
    pontos: Math.round(pontos),
    feedback,
    desconto
  };
}

/**
 * Calcula a pontuação final com bônus de tempo conforme RN22
 * 
 * Fórmula: X × max(1, (2 - T/600))
 * Onde:
 *   X = pontuação total (sem bônus)
 *   T = tempo em segundos
 * 
 * Ganha bônus se completar em menos de 10 minutos (600 segundos)
 * 
 * @param pontuacaoTotal - Pontuação total sem bônus
 * @param tempoSegundos - Tempo em segundos
 * @returns Pontuação final com bônus aplicado
 */
export function calcularPontuacaoFinal(
  pontuacaoTotal: number,
  tempoSegundos: number
): number {
  const bonus = Math.max(1, 2 - tempoSegundos / 600);
  const pontuacaoFinal = pontuacaoTotal * bonus;
  
  console.log(`Cálculo de pontuação RN22:
    Pontuação base: ${pontuacaoTotal}
    Tempo: ${tempoSegundos}s (${Math.floor(tempoSegundos / 60)}:${String(tempoSegundos % 60).padStart(2, '0')})
    Multiplicador: ${bonus.toFixed(2)}
    Pontuação final: ${Math.round(pontuacaoFinal)}`);
  
  return Math.round(pontuacaoFinal);
}

/**
 * Simula o cálculo de pontuação para múltiplas tentativas
 * Útil para testes e entendimento
 */
export function simularPontuacoes() {
  console.log("=== SIMULAÇÃO RN10 ===\n");
  
  (['facil', 'medio', 'dificil'] as NivelDificuldade[]).forEach(nivel => {
    console.log(`\n${nivel.toUpperCase()}:`);
    console.log("Tentativa | Pontos | Desconto | Feedback");
    console.log("----------|--------|----------|------------------");
    
    for (let i = 1; i <= 5; i++) {
      const { pontos, feedback, desconto } = calcularPontuacaoPeca(i, nivel);
      console.log(
        `${i}        | ${String(pontos).padStart(6)} | ${String(desconto).padStart(7)}% | ${feedback}`
      );
    }
  });
}