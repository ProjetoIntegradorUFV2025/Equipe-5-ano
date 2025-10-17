import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/api";
import "./styles/Fases.css";

const safeUrl = (relPath: string) => {
  try {
    return new URL(relPath, import.meta.url).href;
  } catch (err) {
    console.error("Erro ao resolver asset:", relPath, err);
    return "";
  }
};

const backgroundFases = safeUrl("../assets/backgrounds/background_fases.png");
const voltarIcon = safeUrl("../assets/bottons/botao_voltar.png");
const historiaIcon = safeUrl("../assets/bottons/botao_historia.png");
const quizIcon = safeUrl("../assets/bottons/botao_quiz.png");

interface FasesProps {
  aluno: any;
}

const Fases: React.FC<FasesProps> = ({ aluno }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Validação e obtenção do nível com fallback
  const getNivel = (): string | null => {
    const nivelFromState = location.state?.nivel;
    const nivelFromAluno = aluno?.nivel;
    
    if (nivelFromState) return String(nivelFromState).toLowerCase();
    if (nivelFromAluno) return String(nivelFromAluno).toLowerCase();
    
    console.warn("Nível não foi encontrado. Bloqueando navegação por segurança.");
    return null;
  };

  const nivel = getNivel();

  // Estados de progresso (CSU07 - RN09)
  const [modoHistoriaCompleto, setModoHistoriaCompleto] = useState(false);
  const [carregandoProgresso, setCarregandoProgresso] = useState(true);
  const [erroProgresso, setErroProgresso] = useState(false);

  // Estados de modais/mensagens (CSU07 - RN10, RN11)
  const [showErroModal, setShowErroModal] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  // Detecta orientação da tela
  const [isPortrait, setIsPortrait] = useState(false);

  // Controla se deve recarregar progresso (para quando voltar de Modo História ou Quiz)
  const [shouldReloadProgress, setShouldReloadProgress] = useState(true);

  // Função auxiliar para carregar progresso
  const executarCarregarProgresso = async () => {
    try {
      setCarregandoProgresso(true);
      setErroProgresso(false);

      // Validar dados do aluno
      const apelido = aluno?.apelido || localStorage.getItem("apelido");
      const codigoSalaStr = aluno?.codigoSala || localStorage.getItem("codigoSala");
      const codigoSala = codigoSalaStr ? Number(codigoSalaStr) : null;

      // Validação defensiva de dados
      if (!apelido || !codigoSala || isNaN(codigoSala)) {
        console.warn("Dados do aluno inválidos ou ausentes:", { apelido, codigoSala });
        setModoHistoriaCompleto(false);
        setErroProgresso(true);
        setCarregandoProgresso(false);
        return;
      }

      // CSU07 - Passo 2: Carregar dados de progresso
      console.log("📥 Carregando progresso do aluno:", { apelido, codigoSala });
      const progresso = await api.obterProgresso(apelido, codigoSala);

      console.log("✅ Progresso carregado:", progresso);
      setModoHistoriaCompleto(progresso.modoHistoriaCompleto || false);
      setErroProgresso(false);

    } catch (error) {
      // CSU07 - Fluxo Alternativo (2): Erro ao carregar progresso
      console.error("❌ Erro ao carregar progresso:", error);
      setErroProgresso(true);
      setModoHistoriaCompleto(false); // Por segurança, bloqueia o Quiz
    } finally {
      setCarregandoProgresso(false);
    }
  };

  // CSU07 - Fluxo Principal (1, 2): Carregar progresso ao montar
  // CSU07 #5: Recarregar progresso quando voltar de Modo História ou Quiz
  useEffect(() => {
    if (shouldReloadProgress) {
      executarCarregarProgresso();
      setShouldReloadProgress(false);
    }
  }, [shouldReloadProgress, aluno]);

  // Recarregar progresso quando a página for desmontada e remontada (volta de Modo História/Quiz)
  useEffect(() => {
    const handleFocus = () => {
      console.log("📍 Página de Fases voltou ao foco. Recarregando progresso...");
      setShouldReloadProgress(true);
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // Detectar orientação
  useEffect(() => {
    const checkOrientation = () => {
      const isMobile = window.innerWidth <= 768;
      setIsPortrait(isMobile && window.innerHeight > window.innerWidth);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", () => {
      setTimeout(checkOrientation, 100);
    });

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  const handleVoltar = () => {
    navigate("/niveis");
  };

  // CSU07 - Fluxo Principal (3, 4): Iniciar Modo História
  const iniciarModoHistoria = () => {
    if (!nivel) {
      setMensagemErro("Nível não foi selecionado corretamente. Retorne e tente novamente.");
      setShowErroModal(true);
      return;
    }

    if (!aluno || !aluno.apelido) {
      setMensagemErro("Dados do aluno inválidos. Faça login novamente.");
      setShowErroModal(true);
      return;
    }

    console.log("🎮 Iniciando Modo História...");
    navigate("/montagem", {
      state: {
        nivel: nivel,
        aluno: aluno
      }
    });
  };

  // CSU07 - Fluxo Principal (6, 7) e Fluxo Alternativo (3, 5, 6): Iniciar Modo Quiz
  // Fluxo Alternativo (3): Se modoHistoriaCompleto for true, quiz está disponível
  const iniciarModoQuiz = () => {
    // CSU07 - RN10: Validar se pode acessar o Quiz
    if (!modoHistoriaCompleto) {
      console.warn("⚠️ Quiz bloqueado: Modo História não concluído");
      setMensagemErro("Você precisa concluir o Modo História antes de acessar o Modo Quiz.");
      setShowErroModal(true);
      return;
    }

    if (!nivel) {
      setMensagemErro("Nível não foi selecionado corretamente.");
      setShowErroModal(true);
      return;
    }

    if (!aluno || !aluno.apelido) {
      setMensagemErro("Dados do aluno inválidos.");
      setShowErroModal(true);
      return;
    }

    // CSU07 - Passo 7: Sistema inicia o Modo Quiz
    console.log("🎯 Iniciando Modo Quiz...");
    navigate("/quiz", {
      state: { nivel, aluno }
    });
  };

  // Tentar novamente carregar progresso (melhorado)
  const tentarNovamente = () => {
    setShouldReloadProgress(true);
  };

  // CSU07 - RN08: Determinar disponibilidade do Quiz
  // CSU07 - Fluxo Alternativo (3): Quiz ativo se modoHistoriaCompleto for true
  const modoQuizDisponivel = modoHistoriaCompleto;

  // Validação de dados críticos
  const dadosValidos = aluno && aluno.apelido && nivel;

  return (
    <div 
      className="fases-isolated-container"
      style={{
        backgroundImage: backgroundFases ? `url(${backgroundFases})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Mensagem para modo retrato */}
      {isPortrait && (
        <div className="fases-portrait-warning">
          <div className="fases-portrait-message">
            <p>📱 Vire o telefone para a posição deitada! 📄</p>
          </div>
        </div>
      )}

      {/* CSU07 - Loading durante carregamento de progresso */}
      {carregandoProgresso && (
        <div className="fases-loading-overlay">
          <div className="fases-loading-content">
            <div className="fases-spinner"></div>
            <p>Carregando seu progresso...</p>
          </div>
        </div>
      )}

      {/* CSU07 - Fluxo Alternativo (2): Erro ao carregar progresso (RN11) */}
      {erroProgresso && !carregandoProgresso && (
        <div className="fases-erro-overlay">
          <div className="fases-erro-content">
            <h3>⚠️ Erro</h3>
            <p>Não foi possível carregar seu progresso. Tente novamente mais tarde.</p>
            <button className="fases-btn-tentar" onClick={tentarNovamente}>
              Tentar Novamente
            </button>
          </div>
        </div>
      )}

      {/* CSU07 - Modal de erro genérico (RN10) */}
      {showErroModal && (
        <div className="fases-modal-overlay" onClick={() => setShowErroModal(false)}>
          <div className="fases-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>⚠️ Atenção</h3>
            <p>{mensagemErro}</p>
            <button className="fases-btn-modal-ok" onClick={() => setShowErroModal(false)}>
              OK
            </button>
          </div>
        </div>
      )}

      <button className="fases-btn-voltar" onClick={handleVoltar}>
        <img src={voltarIcon || undefined} alt="Voltar" />
      </button>

      <div className="fases-buttons-container">
        {/* CSU07 - Fluxo Principal (3): Botão Modo História */}
        <button 
          className="fases-btn-historia"
          onClick={iniciarModoHistoria}
          disabled={carregandoProgresso || !dadosValidos}
          title={!dadosValidos ? "Dados do aluno inválidos" : "Iniciar Modo História"}
        >
          <img src={historiaIcon || undefined} alt="Modo História" />
        </button>

        {/* CSU07 - Fluxo Principal (6) e Alternativo (3, 5, 6): Botão Modo Quiz */}
        <button 
          className={`fases-btn-quiz ${!modoQuizDisponivel ? 'bloqueado' : ''}`}
          onClick={iniciarModoQuiz}
          disabled={!modoQuizDisponivel || carregandoProgresso || !dadosValidos}
          title={!modoQuizDisponivel ? "Complete o Modo História primeiro" : "Iniciar Modo Quiz"}
        >
          <img 
            src={quizIcon || undefined} 
            alt="Modo Quiz" 
          />
          {/* CSU07 - RN08: Indicador visual de bloqueio */}
          {!modoQuizDisponivel && (
            <div className="quiz-bloqueado-overlay">
              <span>🔒</span>
            </div>
          )}
        </button>
      </div>

      {/* Informações do nível atual e progresso */}
      {dadosValidos && (
        <div className="fases-info-nivel">
          <p>Nível: <strong>{nivel.charAt(0).toUpperCase() + nivel.slice(1)}</strong></p>
          <p className="fases-info-aluno">Aluno: <strong>{aluno.apelido}</strong></p>
          {modoHistoriaCompleto && (
            <p className="fases-info-progresso">✓ Modo História Concluído</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Fases;