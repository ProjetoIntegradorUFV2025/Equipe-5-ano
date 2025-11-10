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
  obterResumo: () => { pontuacaoBase: number; totalPecas: number; totalTentativas: number };
}

/**
 * ✅ CORREÇÃO: Hook de pontuação com tracking completo
 */
export function usePontuacao(): UsePontuacaoReturn {
  const [pontuacaoTotal, setPontuacaoTotal] = useState(0);
  const [tentativasPorPeca, setTentativasPorPeca] = useState<Record<string, number>>({});
  const [historicoTentativas, setHistoricoTentativas] = useState<TentativaPeca[]>([]);

  /**
   * ✅ Registra uma tentativa de encaixe de peça
   */
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

    console.log(`🎯 Tentativa registrada - Peça: ${pecaId}, Tentativa #${tentativasAtuais}, Acertou: ${acertou}`);

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

  /**
   * ✅ CORREÇÃO: Calcula pontuação final com bônus de tempo (RN22)
   * Esta função deve ser chamada APENAS uma vez ao final de TODO o jogo
   */
  const calcularPontuacaoFinalComBonus = (tempoEmSegundos: number): number => {
    console.log(`⏱️ Calculando pontuação final com tempo: ${tempoEmSegundos}s`);
    console.log(`📊 Pontuação base acumulada: ${pontuacaoTotal}`);
    
    const pontuacaoFinal = calcularPontuacaoFinal(pontuacaoTotal, tempoEmSegundos);
    
    console.log(`🎯 Pontuação final com bônus: ${pontuacaoFinal}`);
    
    return pontuacaoFinal;
  };

  /**
   * ✅ NOVO: Obtém resumo da pontuação para debug
   */
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
   * ✅ Resetar o estado (usado quando volta às fases)
   */
  const resetar = () => {
    console.log('🔄 Resetando pontuação...');
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
    obterResumo,
  };
}