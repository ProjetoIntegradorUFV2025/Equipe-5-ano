import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRankingTurma } from "../api/api";
import type { ApiAluno } from "../api/api";
import "./ConclusaoModal.css";

interface ConclusaoModalProps {
  isOpen: boolean;
  pontuacaoFinal: number; // Mantém para fallback
  tempo: number;
  codigoSala: number;
  alunoApelido: string;
  nivel?: string;
  onVoltarFases: () => void;
}

const ConclusaoModal: React.FC<ConclusaoModalProps> = ({
  isOpen,
  pontuacaoFinal,
  tempo,
  codigoSala,
  alunoApelido,
  nivel,
  onVoltarFases
}) => {
  const navigate = useNavigate();
  const [mostrarRanking, setMostrarRanking] = useState(false);
  const [ranking, setRanking] = useState<ApiAluno[]>([]);
  const [carregandoRanking, setCarregandoRanking] = useState(false);
  
  // ✅ NOVO: Estado para pontuação real do backend
  const [pontuacaoReal, setPontuacaoReal] = useState<number | null>(null);
  const [carregandoPontuacao, setCarregandoPontuacao] = useState(true);

  // ✅ NOVO: Buscar pontuação real ao abrir o modal
  useEffect(() => {
    if (isOpen && alunoApelido && codigoSala) {
      buscarPontuacaoReal();
    }
  }, [isOpen, alunoApelido, codigoSala]);

  const buscarPontuacaoReal = async () => {
    try {
      setCarregandoPontuacao(true);
      console.log("🔍 Buscando pontuação real do backend...");
      
      const dados = await getRankingTurma(codigoSala);
      const alunoAtual = dados.find(a => a.apelido === alunoApelido);
      
      if (alunoAtual && alunoAtual.pontuacao !== undefined) {
        setPontuacaoReal(alunoAtual.pontuacao);
        console.log(`✅ Pontuação real encontrada: ${alunoAtual.pontuacao}`);
      } else {
        console.warn("⚠️ Aluno não encontrado no ranking, usando pontuação local");
        setPontuacaoReal(pontuacaoFinal);
      }
    } catch (error) {
      console.error("❌ Erro ao buscar pontuação real:", error);
      setPontuacaoReal(pontuacaoFinal); // Fallback para pontuação local
    } finally {
      setCarregandoPontuacao(false);
    }
  };

  if (!isOpen) return null;

  const formatarTempo = (segundos: number): string => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVoltarFases = () => {
    console.log("🔄 Retornando para Fases...");
    console.log("📊 Dados:", { alunoApelido, codigoSala, nivel });
    
    navigate("/fases", {
      state: {
        aluno: {
          apelido: alunoApelido,
          codigoSala: codigoSala,
          nivel: nivel
        },
        nivel: nivel,
        recarregarProgresso: true
      },
      replace: true
    });
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

  // ✅ Usar pontuação real do backend ou fallback
  const pontuacaoExibir = pontuacaoReal !== null ? pontuacaoReal : pontuacaoFinal;

  return (
    <div className="conclusao-modal-overlay">
      <div className="conclusao-modal-content">
        {!mostrarRanking ? (
          <>
            <h2>🎉 Parabéns!</h2>
            <p className="conclusao-subtitulo">Você completou o Modo História!</p>
            
            {carregandoPontuacao ? (
              <div className="conclusao-carregando-pontuacao">
                <div className="spinner"></div>
                <p>Carregando sua pontuação final...</p>
              </div>
            ) : (
              <>
                <div className="conclusao-stats">
                  <div className="conclusao-stat">
                    <span className="conclusao-label">Pontuação Final</span>
                    <span className="conclusao-valor">{pontuacaoExibir}</span>
                    {pontuacaoReal !== null && pontuacaoReal !== pontuacaoFinal && (
                      <span className="conclusao-badge">✓ Verificada</span>
                    )}
                  </div>
                  
                  <div className="conclusao-stat">
                    <span className="conclusao-label">Tempo Total</span>
                    <span className="conclusao-valor">{formatarTempo(tempo)}</span>
                  </div>

                  <div className="conclusao-stat">
                    <span className="conclusao-label">Aluno</span>
                    <span className="conclusao-valor">{alunoApelido}</span>
                  </div>

                  {nivel && (
                    <div className="conclusao-stat">
                      <span className="conclusao-label">Nível</span>
                      <span className="conclusao-valor">{nivel.toUpperCase()}</span>
                    </div>
                  )}
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
                    className="conclusao-btn-voltar" 
                    onClick={handleVoltarFases}
                  >
                    Voltar para Fases
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="parabens-container">
              <div className="ranking-icon">🏆</div>
            </div>

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
                      <tr key={index} className={aluno.apelido === alunoApelido ? "aluno-destaque" : ""}>
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
              className="conclusao-btn-voltar" 
              onClick={handleVoltarFases}
            >
              Voltar para Fases
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ConclusaoModal;