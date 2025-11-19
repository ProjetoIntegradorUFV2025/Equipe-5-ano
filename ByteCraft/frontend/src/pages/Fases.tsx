// Fases.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/api";
import {useSound} from "../hooks/useSounds";
import "./styles/Fases.css";

import backgroundFases from "../assets/backgrounds/background_fases.png";
import voltarIcon from "../assets/bottons/botao_voltar.png";
import historiaIcon from "../assets/bottons/botao_historia.png";
import quizIcon from "../assets/bottons/botao_quiz.png";

interface FasesProps {
  aluno: any;
}

const Fases: React.FC<FasesProps> = ({ aluno }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { playClick } = useSound();

  const getNivel = (): string | null => {
    const nivelFromState = location.state?.nivel;
    if (nivelFromState) {
      localStorage.setItem("nivelSelecionado", nivelFromState);
      return String(nivelFromState).toLowerCase();
    }
    
    const nivelFromAluno = aluno?.nivel;
    if (nivelFromAluno) {
      localStorage.setItem("nivelSelecionado", nivelFromAluno);
      return String(nivelFromAluno).toLowerCase();
    }
    
    const nivelFromStorage = localStorage.getItem("nivelSelecionado");
    if (nivelFromStorage) {
      return nivelFromStorage.toLowerCase();
    }
    
    return null;
  };

  const nivel = getNivel();

  const [modoHistoriaCompleto, setModoHistoriaCompleto] = useState(false);
  const [carregandoProgresso, setCarregandoProgresso] = useState(true);
  const [erroProgresso, setErroProgresso] = useState(false);

  const [showErroModal, setShowErroModal] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  const [isPortrait, setIsPortrait] = useState(false);

  const executarCarregarProgresso = async () => {
    try {
      setCarregandoProgresso(true);
      setErroProgresso(false);

      const apelido = aluno?.apelido || localStorage.getItem("apelido");
      const codigoSalaStr = aluno?.codigoSala || localStorage.getItem("codigoSala");
      const codigoSala = codigoSalaStr ? Number(codigoSalaStr) : null;

      if (!apelido || !codigoSala || isNaN(codigoSala)) {
        setModoHistoriaCompleto(false);
        setErroProgresso(true);
        setCarregandoProgresso(false);
        return;
      }
      
      const progresso = await api.obterProgresso(apelido, codigoSala);
      
      const historiaCompleta = Boolean(progresso.modoHistoriaCompleto);
      
      setModoHistoriaCompleto(historiaCompleta);
      setErroProgresso(false);

    } catch (error) {
      setErroProgresso(true);
      setModoHistoriaCompleto(false);
    } finally {
      setCarregandoProgresso(false);
    }
  };

  useEffect(() => {
    executarCarregarProgresso();
  }, [location.key]);

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
    playClick();
    navigate("/niveis");
  };

  const iniciarModoHistoria = () => {
    playClick();
    
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
    
    localStorage.setItem("nivelSelecionado", nivel);
    
    navigate("/montagem", {
      state: {
        nivel: nivel,
        aluno: {
          ...aluno,
          nivel: nivel
        }
      }
    });
  };

  const iniciarModoQuiz = () => {
    playClick();

    if (!modoHistoriaCompleto) {
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
    
    localStorage.setItem("nivelSelecionado", nivel);
    
    navigate("/quiz", {
      state: { 
        nivel, 
        aluno: {
          ...aluno,
          nivel: nivel
        }
      }
    });
  };

  const tentarNovamente = () => {
    playClick();
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
        </div>
      )}
    </div>
  );
};

export default Fases;