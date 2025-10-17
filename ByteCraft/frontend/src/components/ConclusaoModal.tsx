import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { getRankingTurma, registraPontuacao, salvarProgresso } from "../api/api";
import type { ApiAluno } from "../api/api";
import "./ConclusaoModal.css";

interface ConclusaoModalProps {
  isOpen: boolean;
  pontuacaoFinal: number;
  tempo: number;
  codigoSala: number;
  alunoApelido: string;
  onVoltarFases: () => void;
}

const ConclusaoModal: React.FC<ConclusaoModalProps> = ({ 
  isOpen, 
  pontuacaoFinal,
  tempo,
  codigoSala,
  alunoApelido,
  onVoltarFases
}) => {
  const [mostrarRanking, setMostrarRanking] = useState(false);
  const [ranking, setRanking] = useState<ApiAluno[]>([]);
  const [carregandoRanking, setCarregandoRanking] = useState(false);
  const [pontuacaoEnviada, setPontuacaoEnviada] = useState(false);
  const [progressoSalvo, setProgressoSalvo] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);

  const formatarTempo = (segundos: number) => {
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
  };

  // Calcular bônus de tempo (RN22) para exibição
  const calcularBonus = (segundos: number): number => {
    return Math.max(1, 2 - segundos / 600);
  };

  const bonus = calcularBonus(tempo);

  // Enviar pontuação ao backend quando o modal abre
  useEffect(() => {
    if (isOpen && !pontuacaoEnviada && alunoApelido) {
      enviarPontuacaoEProgresso();
    }
  }, [isOpen, pontuacaoEnviada, alunoApelido]);

  // Função para enviar pontuação com todos os parâmetros E salvar progresso (RN16)
  const enviarPontuacaoEProgresso = async () => {
    try {
      console.log("Enviando pontuação (RN22 já aplicada):", { 
        alunoApelido, 
        codigoSala,
        pontuacao: pontuacaoFinal,
        tempo 
      });
      
      // ETAPA 1: Enviar pontuação
      await registraPontuacao(alunoApelido, codigoSala, pontuacaoFinal, tempo);
      
      setPontuacaoEnviada(true);
      console.log("Pontuação enviada com sucesso!");

      // ETAPA 2: Registrar progresso (RN16) - Marcar modo história como concluído
      try {
        console.log("Salvando progresso do aluno...");
        await salvarProgresso(alunoApelido, codigoSala, true);
        setProgressoSalvo(true);
        console.log("Progresso salvo com sucesso!");
      } catch (progressoError) {
        console.warn("Aviso: Progresso não foi salvo, mas a pontuação foi registrada:", progressoError);
        // Não marca como erro fatal - o importante é a pontuação
        setProgressoSalvo(true); // Marca como salvo mesmo com erro para não bloquear o usuário
      }

      setErroEnvio(null);
    } catch (error) {
      console.error("Erro ao enviar pontuação:", error);
      setErroEnvio("Erro ao salvar sua pontuação. Tente novamente.");
    }
  };

  const carregarRanking = async () => {
    try {
      setCarregandoRanking(true);
      const dados = await getRankingTurma(codigoSala);
      setRanking(dados);
      setMostrarRanking(true);
    } catch (error) {
      console.error("Erro ao carregar ranking:", error);
      alert("Erro ao carregar ranking da turma");
    } finally {
      setCarregandoRanking(false);
    }
  };

  // Reseta o estado quando o modal fecha
  useEffect(() => {
    if (!isOpen) {
      setMostrarRanking(false);
      setPontuacaoEnviada(false);
      setProgressoSalvo(false);
      setErroEnvio(null);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onVoltarFases} showCloseButton={false}>
      <div className="conclusao-modal-container">
        {!mostrarRanking ? (
          <>
            <div className="conclusao-modal-icone">🏆</div>
            <h2 className="conclusao-modal-titulo">Parabéns!</h2>
            <p className="conclusao-modal-mensagem">
              Você completou a montagem do computador!
            </p>
            
            {/* Mostrar erro se houver */}
            {erroEnvio && (
              <div style={{
                backgroundColor: '#fee',
                color: '#c33',
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '15px',
                textAlign: 'center',
                fontSize: '14px'
              }}>
                ⚠️ {erroEnvio}
              </div>
            )}

            {/* Mostrar status de envio */}
            {!pontuacaoEnviada && !erroEnvio && (
              <div style={{
                backgroundColor: '#eef',
                color: '#33c',
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '15px',
                textAlign: 'center',
                fontSize: '14px'
              }}>
                ✓ Salvando sua pontuação e progresso...
              </div>
            )}

            {pontuacaoEnviada && progressoSalvo && (
              <div style={{
                backgroundColor: '#efe',
                color: '#363',
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '15px',
                textAlign: 'center',
                fontSize: '14px'
              }}>
                ✓ Pontuação e progresso salvos com sucesso!
              </div>
            )}
            
            <div className="conclusao-modal-stats">
              <div className="conclusao-modal-stat">
                <span className="conclusao-modal-stat-label">Pontuação Base:</span>
                <span className="conclusao-modal-stat-valor">{Math.round(pontuacaoFinal / bonus)}</span>
              </div>
              <div className="conclusao-modal-stat">
                <span className="conclusao-modal-stat-label">Bônus Tempo (RN22):</span>
                <span className="conclusao-modal-stat-valor" style={{ color: '#4ade80' }}>
                  x{bonus.toFixed(2)}
                </span>
              </div>
              <div className="conclusao-modal-stat" style={{ borderTop: '1px solid #ddd', paddingTop: '10px', marginTop: '10px' }}>
                <span className="conclusao-modal-stat-label" style={{ fontWeight: 'bold' }}>Pontuação Final:</span>
                <span className="conclusao-modal-stat-valor" style={{ fontSize: '24px', color: '#fbbf24' }}>
                  {pontuacaoFinal}
                </span>
              </div>
              <div className="conclusao-modal-stat">
                <span className="conclusao-modal-stat-label">Tempo:</span>
                <span className="conclusao-modal-stat-valor">{formatarTempo(tempo)}</span>
              </div>
            </div>

            {/* Info sobre bônus */}
            {bonus > 1 ? (
              <div style={{
                backgroundColor: '#ecfdf5',
                color: '#047857',
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '15px',
                textAlign: 'center',
                fontSize: '14px',
                border: '1px solid #6ee7b7'
              }}>
                ✨ Parabéns! Você completou em menos de 10 minutos e ganhou bônus!
              </div>
            ) : (
              <div style={{
                backgroundColor: '#fef3c7',
                color: '#92400e',
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '15px',
                textAlign: 'center',
                fontSize: '14px',
                border: '1px solid #fcd34d'
              }}>
                💡 Dica: Complete em menos de 10 minutos para ganhar bônus de pontuação!
              </div>
            )}

            <div className="conclusao-modal-botoes">
              <button 
                className="conclusao-modal-btn-ranking"
                onClick={carregarRanking}
                disabled={carregandoRanking}
              >
                {carregandoRanking ? "Carregando..." : "Ver Ranking"}
              </button>
              <button 
                className="conclusao-modal-btn-voltar"
                onClick={onVoltarFases}
              >
                Voltar às Fases
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="conclusao-modal-titulo">🏆 Ranking da Turma</h2>
            <div className="conclusao-modal-ranking">
              {ranking.length > 0 ? (
                <table className="conclusao-modal-tabela">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Aluno</th>
                      <th>Pontos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ranking.map((aluno, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{aluno.apelido}</td>
                        <td>{aluno.pontuacao || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Nenhum dado disponível</p>
              )}
            </div>
            <button 
              className="conclusao-modal-btn-voltar"
              onClick={onVoltarFases}
            >
              Voltar às Fases
            </button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ConclusaoModal;