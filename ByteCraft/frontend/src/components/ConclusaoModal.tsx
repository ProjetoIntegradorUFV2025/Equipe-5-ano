import React, { useState, useEffect } from "react";
import { getRankingTurma, registraPontuacao, salvarProgresso } from "../api/api";
import type { ApiAluno } from "../api/api";
import "./ConclusaoModal.css";
import parabensImage from "../assets/graphics/Parabens.png";

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

  useEffect(() => {
    if (isOpen && !pontuacaoEnviada && alunoApelido) {
      enviarPontuacaoEProgresso();
    }
  }, [isOpen, pontuacaoEnviada, alunoApelido]);

  const enviarPontuacaoEProgresso = async () => {
    try {
      console.log("Enviando pontuação:", { 
        alunoApelido, 
        codigoSala,
        pontuacao: pontuacaoFinal,
        tempo 
      });
      
      await registraPontuacao(alunoApelido, codigoSala, pontuacaoFinal, tempo);
      setPontuacaoEnviada(true);

      try {
        await salvarProgresso(alunoApelido, codigoSala, true);
        setProgressoSalvo(true);
      } catch (progressoError) {
        console.warn("Aviso: Progresso não foi salvo, mas a pontuação foi registrada:", progressoError);
        setProgressoSalvo(true);
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

  useEffect(() => {
    if (!isOpen) {
      setMostrarRanking(false);
      setPontuacaoEnviada(false);
      setProgressoSalvo(false);
      setErroEnvio(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="conclusao-modal-overlay">
      <div className="conclusao-modal-content">
        {!mostrarRanking ? (
          <>
            <div className="parabens-container">
              <img src={parabensImage} alt="Parabéns" className="parabens-image" />
            </div>

            <div className="conclusao-modal-texto">
              {erroEnvio && (
                <div className="conclusao-erro">
                  ⚠️ {erroEnvio}
                </div>
              )}

              {!pontuacaoEnviada && !erroEnvio && (
                <div className="conclusao-carregando">
                  ✓ Salvando sua pontuação e progresso...
                </div>
              )}

              {pontuacaoEnviada && progressoSalvo && (
                <div className="conclusao-sucesso">
                  ✓ Pontuação e progresso salvos com sucesso!
                </div>
              )}
              
              <div className="conclusao-modal-stats">
                <div className="conclusao-modal-stat final">
                  <span className="conclusao-modal-stat-label">Pontuação Final:</span>
                  <span className="conclusao-modal-stat-valor final">{pontuacaoFinal}</span>
                </div>
                <div className="conclusao-modal-stat">
                  <span className="conclusao-modal-stat-label">Tempo:</span>
                  <span className="conclusao-modal-stat-valor">{formatarTempo(tempo)}</span>
                </div>
              </div>

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
            </div>
          </>
        ) : (
          <>
            <div className="parabens-container">
              <div className="ranking-icon">🏆</div>
            </div>

            <div className="conclusao-modal-texto">
              <h2 className="ranking-titulo">RANKING DA TURMA</h2>
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
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConclusaoModal;