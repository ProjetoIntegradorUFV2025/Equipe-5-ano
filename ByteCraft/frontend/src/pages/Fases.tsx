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

  // ✅ CORREÇÃO: Recuperar nível do state com múltiplos fallbacks
  const getNivel = (): string | null => {
    // 1. Tentar pegar do location.state
    const nivelFromState = location.state?.nivel;
    if (nivelFromState) {
      console.log("✅ Nível recuperado do state:", nivelFromState);
      localStorage.setItem("nivelSelecionado", nivelFromState); // Salvar backup
      return String(nivelFromState).toLowerCase();
    }
    
    // 2. Tentar pegar do aluno
    const nivelFromAluno = aluno?.nivel;
    if (nivelFromAluno) {
      console.log("✅ Nível recuperado do aluno:", nivelFromAluno);
      localStorage.setItem("nivelSelecionado", nivelFromAluno);
      return String(nivelFromAluno).toLowerCase();
    }
    
    // 3. Tentar pegar do localStorage
    const nivelFromStorage = localStorage.getItem("nivelSelecionado");
    if (nivelFromStorage) {
      console.log("✅ Nível recuperado do localStorage:", nivelFromStorage);
      return nivelFromStorage.toLowerCase();
    }
    
    console.warn("⚠️ Nível não foi encontrado em nenhuma fonte!");
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

  // Função auxiliar para carregar progresso
  const executarCarregarProgresso = async () => {
    try {
      setCarregandoProgresso(true);
      setErroProgresso(false);

      // Validar dados do aluno
      const apelido = aluno?.apelido || localStorage.getItem("apelido");
      const codigoSalaStr = aluno?.codigoSala || localStorage.getItem("codigoSala");
      const codigoSala = codigoSalaStr ? Number(codigoSalaStr) : null;

      console.log("🔍 DEBUG - Dados do aluno:", { apelido, codigoSala });

      // Validação defensiva de dados
      if (!apelido || !codigoSala || isNaN(codigoSala)) {
        console.warn("❌ Dados do aluno inválidos ou ausentes:", { apelido, codigoSala });
        setModoHistoriaCompleto(false);
        setErroProgresso(true);
        setCarregandoProgresso(false);
        return;
      }

      console.log("🔥 Carregando progresso do aluno:", { apelido, codigoSala });
      
      const progresso = await api.obterProgresso(apelido, codigoSala);

      console.log("✅ Progresso carregado:", progresso);
      console.log("🔍 Modo História Completo?", progresso.modoHistoriaCompleto);
      
      // ✅ Garantir que seja booleano
      const historiaCompleta = Boolean(progresso.modoHistoriaCompleto);
      console.log("🔍 Convertido para booleano:", historiaCompleta);
      
      setModoHistoriaCompleto(historiaCompleta);
      setErroProgresso(false);

    } catch (error) {
      console.error("❌ Erro ao carregar progresso:", error);
      setErroProgresso(true);
      setModoHistoriaCompleto(false);
    } finally {
      setCarregandoProgresso(false);
    }
  };

  // ✅ CORREÇÃO CRÍTICA: Usar location.key para detectar navegação
  useEffect(() => {
    console.log("🔄 [EFFECT] Componente Fases montado/atualizado");
    console.log("🔄 Location key:", location.key);
    executarCarregarProgresso();
  }, [location.key]); // Dispara toda vez que a location mudar

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

  // ✅ CORREÇÃO: iniciarModoHistoria - Validar e enviar nível
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

    console.log("🎮 Iniciando Modo História com nível:", nivel);
    
    // ✅ CORREÇÃO: Salvar nível antes de navegar
    localStorage.setItem("nivelSelecionado", nivel);
    
    navigate("/montagem", {
      state: {
        nivel: nivel,
        aluno: {
          ...aluno,
          nivel: nivel // ✅ Incluir nível no objeto aluno
        }
      }
    });
  };

  // ✅ CORREÇÃO: iniciarModoQuiz - Validar e enviar nível
  const iniciarModoQuiz = () => {
    console.log("🎯 Tentando iniciar Modo Quiz...");
    console.log("📊 Estado atual:", {
      modoHistoriaCompleto,
      carregandoProgresso,
      nivel,
      aluno: aluno?.apelido
    });

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

    console.log("✅ Iniciando Modo Quiz com nível:", nivel);
    
    // ✅ CORREÇÃO: Salvar nível antes de navegar
    localStorage.setItem("nivelSelecionado", nivel);
    
    navigate("/quiz", {
      state: { 
        nivel, 
        aluno: {
          ...aluno,
          nivel: nivel // ✅ Incluir nível no objeto aluno
        }
      }
    });
  };

  const tentarNovamente = () => {
    console.log("🔄 Tentando novamente...");
    executarCarregarProgresso();
  };

  const modoQuizDisponivel = modoHistoriaCompleto;
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
            <p>📱 Vire o telefone para a posição deitada! 🔄</p>
          </div>
        </div>
      )}

      {carregandoProgresso && (
        <div className="fases-loading-overlay">
          <div className="fases-loading-content">
            <div className="fases-spinner"></div>
            <p>Carregando seu progresso...</p>
          </div>
        </div>
      )}

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
        <button 
          className="fases-btn-historia"
          onClick={iniciarModoHistoria}
          disabled={carregandoProgresso || !dadosValidos}
          title={!dadosValidos ? "Dados do aluno inválidos" : "Iniciar Modo História"}
        >
          <img src={historiaIcon || undefined} alt="Modo História" />
        </button>

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
          {!modoQuizDisponivel && (
            <div className="quiz-bloqueado-overlay">
              <span>🔒</span>
            </div>
          )}
        </button>
      </div>

      {dadosValidos && !carregandoProgresso && (
        <div className="fases-info-nivel">
          <p>Nível: <strong>{nivel?.charAt(0).toUpperCase()}{nivel?.slice(1)}</strong></p>
          <p className="fases-info-aluno">Aluno: <strong>{aluno.apelido}</strong></p>
          {modoHistoriaCompleto ? (
            <p className="fases-info-progresso" style={{ color: '#4caf50', fontWeight: 'bold' }}>
              ✓ Modo História Concluído - Quiz Disponível!
            </p>
          ) : (
            <p className="fases-info-progresso" style={{ color: '#ff9800' }}>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Fases;