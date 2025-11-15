// src/hooks/usePontuacao.ts
import { useState } from 'react';
import { NivelDificuldade, TentativaPeca } from '../types';
import { calcularPontuacaoPeca, calcularPontuacaoFinal } from '../utils/pontuacaoCalculator';

interface UsePontuacaoReturn {
  pontuacaoTotal: number;
  tentativasPorPeca: Record<string, number>;
  historicoTentativas: TentativaPeca[];
  registrarTentativa: (pecaId: string, acertou: boolean, nivel: NivelDificuldade) => number;
  calcularPontuacaoFinalComBonus: (tempoEmSegundos: number, pontuacaoBase?: number) => number;
  resetar: () => void;
  obterResumo: () => { pontuacaoBase: number; totalPecas: number; totalTentativas: number };
  setPontuacaoInicial: (pontuacao: number) => void; // ✅ NOVO
}

/**
 * ✅ CORREÇÃO: Aceita pontuação inicial como parâmetro
 */
export function usePontuacao(pontuacaoInicial: number = 0): UsePontuacaoReturn {
  const [pontuacaoTotal, setPontuacaoTotal] = useState(pontuacaoInicial);
  const [tentativasPorPeca, setTentativasPorPeca] = useState<Record<string, number>>({});
  const [historicoTentativas, setHistoricoTentativas] = useState<TentativaPeca[]>([]);

  const registrarTentativa = (
    pecaId: string,
    acertou: boolean,
    nivel: NivelDificuldade
  ): number => {
    const tentativasAtuais = (tentativasPorPeca[pecaId] || 0) + 1;
    
    // Atualizar contador de tentativas
    setTentativasPorPeca((prev) => ({
      ...prev,
      [pecaId]: tentativasAtuais,
    }));

    if (acertou) {
      // Calcular pontuação da peça
      const { pontos, feedback, desconto } = calcularPontuacaoPeca(tentativasAtuais, nivel);
      
      // Acumular pontuação
      setPontuacaoTotal((prev) => {
        const novaPontuacao = prev + pontos;
        console.log(`💰 Pontuação atualizada: ${prev} + ${pontos} = ${novaPontuacao}`);
        return novaPontuacao;
      });

      // Registrar no histórico
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

  const calcularPontuacaoFinalComBonus = (
    tempoEmSegundos: number, 
    pontuacaoBase?: number
  ): number => {
    const pontuacaoParaCalculo = pontuacaoBase !== undefined ? pontuacaoBase : pontuacaoTotal;
    
    console.log(`Calculando pontuação final com tempo: ${tempoEmSegundos}s`);
    console.log(`Pontuação base para cálculo: ${pontuacaoParaCalculo}`);
    
    const pontuacaoFinal = calcularPontuacaoFinal(pontuacaoParaCalculo, tempoEmSegundos);
    
    console.log(`Pontuação final com bônus: ${pontuacaoFinal}`);
    
    return pontuacaoFinal;
  };

  const obterResumo = () => {
    const totalPecas = Object.keys(tentativasPorPeca).length;
    const totalTentativas = Object.values(tentativasPorPeca).reduce((sum, t) => sum + t, 0);
    
    return {
      pontuacaoBase: pontuacaoTotal,
      totalPecas,
      totalTentativas
    };
  };

  /**
   * ✅ NOVO: Define pontuação inicial (útil para continuar de onde parou)
   */
  const setPontuacaoInicial = (pontuacao: number) => {
    console.log(`🔄 Definindo pontuação inicial: ${pontuacao}`);
    setPontuacaoTotal(pontuacao);
  };

  const resetar = () => {
    console.log('Resetando pontuação...');
    setPontuacaoTotal(pontuacaoInicial); // ✅ Volta para inicial, não zero
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
    obterResumo,
    setPontuacaoInicial, // ✅ NOVO
  };
}