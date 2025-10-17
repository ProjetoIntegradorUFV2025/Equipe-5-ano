import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

  // Obter nível do location.state ou do aluno
  const nivel = location.state?.nivel || aluno?.nivel;

  // Detecta orientação da tela
  const [isPortrait, setIsPortrait] = React.useState(false);

  React.useEffect(() => {
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

  const iniciarModoHistoria = () => {
    navigate("/montagem", {
      state: {
        nivel: nivel,
        aluno: aluno
      }
    });
  };

  const iniciarModoQuiz = () => {
    alert("Modo Quiz em desenvolvimento!");
  };

  // Verificar se o modo quiz está disponível (baseado na RN08)
  const modoQuizDisponivel = false;

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

      <button className="fases-btn-voltar" onClick={handleVoltar}>
        <img src={voltarIcon || undefined} alt="Voltar" />
      </button>

      <div className="fases-buttons-container">
        <button 
          className="fases-btn-historia"
          onClick={iniciarModoHistoria}
        >
          <img src={historiaIcon || undefined} alt="Modo História" />
        </button>

        <button 
          className={`fases-btn-quiz ${!modoQuizDisponivel ? 'bloqueado' : ''}`}
          onClick={modoQuizDisponivel ? iniciarModoQuiz : undefined}
          disabled={!modoQuizDisponivel}
        >
          <img 
            src={quizIcon || undefined} 
            alt="Modo Quiz" 
          />
          {!modoQuizDisponivel && (
            <div className="quiz-bloqueado-overlay">
              <span>BLOQUEADO</span>
            </div>
          )}
        </button>
      </div>

      {/* Informações do nível atual - discreta no canto */}
      {nivel && (
        <div className="fases-info-nivel">
          <p>Nível: <strong>{nivel}</strong></p>
        </div>
      )}
    </div>
  );
};

export default Fases;