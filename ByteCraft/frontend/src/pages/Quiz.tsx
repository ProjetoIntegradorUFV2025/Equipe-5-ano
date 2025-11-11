import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";
import type { Aluno, NivelDificuldade, Pergunta } from "../types";
import {useSound} from "../hooks/useSounds";
import "./styles/Quiz.css";
import ramonImage from "../assets/graphics/RAMon.png";

interface LocationState {
  aluno: Aluno;
  nivel: NivelDificuldade;
}

// ========== ENUMS DE ESTADO ==========
enum EstadoQuiz {
  VERIFICANDO_PROGRESSO = "verificando",
  TELA_INICIAL = "inicial",
  JOGANDO = "jogando",
  FINALIZADO = "finalizado",
}

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const aluno = state?.aluno;
  const nivel = state?.nivel;

  const {playClick} = useSound();
  const {playSuccess} = useSound();
  const {playWinner} = useSound();
  const {playError} = useSound();

  // ========== ESTADOS PRINCIPAIS ==========
  const [estadoAtual, setEstadoAtual] = useState<EstadoQuiz>(
    EstadoQuiz.VERIFICANDO_PROGRESSO
  );
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [respostaSelecionada, setRespostaSelecionada] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [acertos, setAcertos] = useState(0);
  const [imagemRedimensionada, setImagemRedimensionada] = useState<string | null>(null);

  // ========== ESTADOS DE TEMPO (RN17) ==========
  const [horaInicio, setHoraInicio] = useState<Date | null>(null);
  const [horaFim, setHoraFim] = useState<Date | null>(null);

  // ========== ESTADOS DE ERRO ==========
  const [erroCarregamento, setErroCarregamento] = useState<string | null>(null);

  // ========== CSU09 - PRECONDIÇÃO 3: VERIFICAR MODO HISTÓRIA ==========
  useEffect(() => {
    const verificarPrecondicoes = async () => {
      if (!nivel || !aluno || !aluno.apelido || !aluno.codigoSala) {
        alert("Dados inválidos. Retornando à tela de fases.");
        navigate("/fases");
        return;
      }

      try {
        console.log("🔍 Verificando se Modo História foi concluído...");
        
        const progresso = await api.obterProgresso(aluno.apelido, aluno.codigoSala);

        if (!progresso.modoHistoriaCompleto) {
          alert("⚠️ Você precisa completar o Modo História antes de acessar o Quiz!");
          navigate("/fases");
          return;
        }

        console.log("✅ Modo História concluído! Carregando perguntas...");

        const apiPerguntas = await api.getPerguntasPorNivel(10, nivel.toUpperCase());
        
        if (!apiPerguntas || apiPerguntas.length === 0) {
          throw new Error("Nenhuma pergunta disponível para este nível.");
        }

        console.log("✅ Perguntas carregadas:", apiPerguntas.length);
        setPerguntas(apiPerguntas);
        setEstadoAtual(EstadoQuiz.TELA_INICIAL);

      } catch (err) {
        console.error("❌ Erro ao verificar precondições:", err);
        setErroCarregamento(
          err instanceof Error ? err.message : "Erro ao carregar o quiz."
        );
      }
    };

    verificarPrecondicoes();
  }, [nivel, aluno, navigate]);

  // ========== REDIMENSIONAR IMAGEM ==========
  const resizeBase64Image = (base64: string, maxWidth: number, maxHeight: number) => {
    return new Promise<string>((resolve) => {
      const img = new Image();
      img.src = `data:image/png;base64,${base64}`;
      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL("image/png").split(",")[1]);
      };
    });
  };

  useEffect(() => {
    const carregarImagem = async () => {
      if (perguntas[indiceAtual]?.imagem) {
        const resized = await resizeBase64Image(perguntas[indiceAtual].imagem, 400, 180);
        setImagemRedimensionada(resized);
      } else {
        setImagemRedimensionada(null);
      }
    };

    if (estadoAtual === EstadoQuiz.JOGANDO) {
      carregarImagem();
    }
  }, [perguntas, indiceAtual, estadoAtual]);

  // ========== CSU09 - PASSO 3: COMEÇAR QUIZ ==========
  const handleComecar = () => {
    playClick();
    console.log("🎮 Iniciando Quiz...");
    setHoraInicio(new Date());
    setEstadoAtual(EstadoQuiz.JOGANDO);
  };

  // ========== CSU09 - PASSO 5 E 6: SELECIONAR E AVANÇAR ==========
  const handleSelecionarResposta = (texto: string) => {
    if (feedback) return;
    setRespostaSelecionada(texto);
  };

  const handleAvancar = () => {
    if (!respostaSelecionada) {
      alert("⚠️ Por favor, selecione uma alternativa antes de avançar!");
      return;
    }

    const perguntaAtual = perguntas[indiceAtual];
    const correta = respostaSelecionada === perguntaAtual.alternativaCorreta;
    
    setFeedback(correta ? "✅ Acertou!" : "❌ Errou!");

    if (correta) {
      playSuccess();
      setAcertos((prev) => prev + 1);
    }

    if (!correta) {
      playError();
    }
    setTimeout(() => {
      if (indiceAtual + 1 >= perguntas.length) {
        finalizarQuiz();
      } else {
        setIndiceAtual((prev) => prev + 1);
        setRespostaSelecionada(null);
        setFeedback(null);
      }
    }, 1500);

  
  };

  // ========== CSU09 - PASSO 8: CALCULAR E EXIBIR NOTA FINAL ==========
  const finalizarQuiz = async () => {
    playWinner();
    const fim = new Date();
    setHoraFim(fim);
    
    const tempoTotal = horaInicio ? Math.floor((fim.getTime() - horaInicio.getTime()) / 1000) : 0;
    const pontuacao = acertos * 10;
    
    console.log("🏁 Quiz Finalizado!");
    console.log("📊 Estatísticas:", {
      acertos,
      total: perguntas.length,
      pontuacao,
      tempoTotal: `${tempoTotal}s`,
      horaInicio: horaInicio?.toLocaleString(),
      horaFim: fim.toLocaleString(),
    });

    setEstadoAtual(EstadoQuiz.FINALIZADO);
  };

  // ========== CSU09 - PASSO 9: VOLTAR PARA FASES ==========
  const handleVoltarFases = () => {
    playClick();
    console.log("🔄 Voltando para Fases com nível preservado:", nivel);
    
    navigate("/fases", { 
      state: { 
        aluno,
        nivel: nivel,
        recarregarProgresso: true
      } 
    });
  };

  // ========== RENDERIZAÇÃO CONDICIONAL ==========

  // ERRO DE CARREGAMENTO
  if (erroCarregamento) {
    return (
      <div className="quiz-container">
        <div className="quiz-content">
          <h2 className="quiz-title-error">❌ Erro ao Carregar Quiz</h2>
          <p className="quiz-error-text">{erroCarregamento}</p>
          <button className="quiz-btn quiz-btn-voltar" onClick={handleVoltarFases}>
            Voltar para Fases
          </button>
        </div>
      </div>
    );
  }

  // VERIFICANDO PROGRESSO
  if (estadoAtual === EstadoQuiz.VERIFICANDO_PROGRESSO) {
    return (
      <div className="quiz-container">
        <div className="quiz-content">
          <div className="quiz-spinner"></div>
          <p className="quiz-loading-text">Verificando seu progresso...</p>
        </div>
      </div>
    );
  }

  // TELA INICIAL - INSPIRADA NO BOASVINDASMODAL
  if (estadoAtual === EstadoQuiz.TELA_INICIAL) {
    return (
      <div className="quiz-container">
        <div className="quiz-welcome-wrapper">
          <div className="quiz-welcome-content">
            <div className="quiz-ramon-container">
              <img src={ramonImage} alt="RAMon" className="quiz-ramon-saltando" />
            </div>

            <div className="quiz-welcome-texto">
              <h1 className="quiz-welcome-title">🎯 Modo Quiz</h1>
              <p>
                Olá de novo, <strong>{aluno.apelido}</strong>! 👋
                <br /><br />
                Agora você vai jogar o <strong>Modo Quiz</strong> no nível <strong>{nivel.toUpperCase()}</strong>! 🎯
                <br /><br />
                São <strong>{perguntas.length} perguntas</strong> para testar tudo que você aprendeu no Modo História. 
                Mostre seu conhecimento e boa sorte! 🚀
              </p>
            </div>

            <button className="quiz-welcome-btn" onClick={handleComecar}>
              COMEÇAR
            </button>
          </div>
        </div>
      </div>
    );
  }

  // TELA DE NOTA FINAL - INSPIRADA NO BOASVINDASMODAL
  if (estadoAtual === EstadoQuiz.FINALIZADO) {
    const notaFinal = (acertos / perguntas.length) * 100;
    const tempoTotal = horaInicio && horaFim 
      ? Math.floor((horaFim.getTime() - horaInicio.getTime()) / 1000) 
      : 0;

    return (
      <div className="quiz-container">
        <div className="quiz-resultado-wrapper">
          <div className="quiz-resultado-content">
            <div className="quiz-ramon-container">
              <img src={ramonImage} alt="RAMon" className="quiz-ramon-saltando" />
            </div>

            <div className="quiz-resultado-texto">
              <h1 className="quiz-resultado-title">🎉 Quiz Finalizado!</h1>
              
              <div className="quiz-nota-display">
                <span className="quiz-nota-label">Nota Final</span>
                <span className="quiz-nota-valor">{notaFinal.toFixed(1)}%</span>
              </div>

              <div className="quiz-stats-grid">
                <p>✅ Acertos: <strong>{acertos}</strong> de {perguntas.length}</p>
                <p>⏱️ Tempo: <strong>{Math.floor(tempoTotal / 60)}:{(tempoTotal % 60).toString().padStart(2, '0')}</strong></p>
                <p>📅 <strong>{horaFim?.toLocaleString()}</strong></p>
              </div>

              <div className="quiz-mensagem-final">
                {notaFinal >= 80 && <p>🌟 Excelente! Você domina o conteúdo!</p>}
                {notaFinal >= 60 && notaFinal < 80 && <p>👍 Muito bem! Continue praticando!</p>}
                {notaFinal < 60 && <p>💪 Não desista! Revise o conteúdo!</p>}
              </div>
            </div>

            <button className="quiz-resultado-btn" onClick={handleVoltarFases}>
              VOLTAR PARA FASES
            </button>
          </div>
        </div>
      </div>
    );
  }

  // TELA DE PERGUNTAS
  if (estadoAtual === EstadoQuiz.JOGANDO && perguntas.length > 0) {
    const perguntaAtual = perguntas[indiceAtual];
    const alternativas = [
      perguntaAtual.alternativaA,
      perguntaAtual.alternativaB,
      perguntaAtual.alternativaC,
      perguntaAtual.alternativaD,
    ];

    const isUltimaPergunta = indiceAtual + 1 === perguntas.length;

    return (
      <div className="quiz-container">
        <div className="quiz-content">
          {/* Header com progresso */}
          <div className="quiz-header">
            <h2 className="quiz-pergunta-numero">
              Pergunta {indiceAtual + 1} de {perguntas.length}
            </h2>
            <div className="quiz-progress-bar">
              <div 
                className="quiz-progress-fill"
                style={{ width: `${((indiceAtual + 1) / perguntas.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Container com mesma largura para enunciado e alternativas */}
          <div className="quiz-perguntas-wrapper">
            {/* Enunciado */}
            <div className="quiz-enunciado-box">
              <p className="quiz-enunciado">{perguntaAtual.enunciado}</p>
            </div>

            {/* Imagem (se existir) */}
            {imagemRedimensionada && (
              <img
                src={`data:image/png;base64,${imagemRedimensionada}`}
                alt="Imagem da pergunta"
                className="quiz-imagem"
              />
            )}

            {/* Alternativas */}
            <div className="quiz-alternativas">
              {alternativas.map((texto, idx) => {
                const isSelected = respostaSelecionada === texto;
                const isCorrect = texto === perguntaAtual.alternativaCorreta;
                
                let className = "quiz-alternativa";
                if (feedback && isSelected) {
                  className += isCorrect ? " acertou" : " errou";
                } else if (isSelected) {
                  className += " selecionada";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelecionarResposta(texto)}
                    className={className}
                    disabled={!!feedback}
                  >
                    <span className="quiz-alternativa-letra">{String.fromCharCode(65 + idx)}</span>
                    <span className="quiz-alternativa-texto">{texto}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback */}
          {feedback && <p className="quiz-feedback">{feedback}</p>}

          {/* Botão Avançar */}
          {!feedback && (
            <button 
              className="quiz-btn quiz-btn-avancar" 
              onClick={handleAvancar}
              disabled={!!feedback}
            >
              {isUltimaPergunta ? "VER NOTA FINAL" : "AVANÇAR ➡️"}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div className="quiz-container">
      <div className="quiz-content">
        <p className="quiz-loading-text">Carregando...</p>
      </div>
    </div>
  );
};

export default Quiz;