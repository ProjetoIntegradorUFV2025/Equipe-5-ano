// src/hooks/usePontuacao.ts
import { useState } from 'react';
import { NivelDificuldade, TentativaPeca } from '../types';
import { calcularPontuacaoPeca, calcularPontuacaoFinal } from '../utils/pontuacaoCalculator';

interface UsePontuacaoReturn {
  pontuacaoTotal: number;
  tentativasPorPeca: Record<string, number>;
  historicoTentativas: TentativaPeca[];
  registrarTentativa: (pecaId: string, acertou: boolean, nivel: NivelDificuldade) => number;
  calcularPontuacaoFinalComBonus: (tempoEmSegundos: number) => number;
  resetar: () => void;
}

export function usePontuacao(): UsePontuacaoReturn {
  const [pontuacaoTotal, setPontuacaoTotal] = useState(0);
  const [tentativasPorPeca, setTentativasPorPeca] = useState<Record<string, number>>({});
  const [historicoTentativas, setHistoricoTentativas] = useState<TentativaPeca[]>([]);

  const registrarTentativa = (
    pecaId: string,
    acertou: boolean,
    nivel: NivelDificuldade
  ): number => {
    const tentativasAtuais = (tentativasPorPeca[pecaId] || 0) + 1;
    
    setTentativasPorPeca((prev) => ({
      ...prev,
      [pecaId]: tentativasAtuais,
    }));

    if (acertou) {
      // CORREÇÃO: calcularPontuacaoPeca retorna um objeto, não um número
      const { pontos, feedback } = calcularPontuacaoPeca(tentativasAtuais, nivel);
      setPontuacaoTotal((prev) => prev + pontos);

      const tentativa: TentativaPeca = {
        pecaId,
        numeroTentativas: tentativasAtuais,
        acertou: true,
        pontuacaoObtida: pontos,
        feedback 
      };
      
      setHistoricoTentativas((prev) => [...prev, tentativa]);
      
      return pontos;
    }

    return 0;
  };

  const calcularPontuacaoFinalComBonus = (tempoEmSegundos: number): number => {
    return calcularPontuacaoFinal(pontuacaoTotal, tempoEmSegundos);
  };

  const resetar = () => {
    setPontuacaoTotal(0);
    setTentativasPorPeca({});
    setHistoricoTentativas([]);
  };

  return {
    pontuacaoTotal,
    tentativasPorPeca,
    historicoTentativas,
    registrarTentativa,
    calcularPontuacaoFinalComBonus,
    resetar,
  };
}