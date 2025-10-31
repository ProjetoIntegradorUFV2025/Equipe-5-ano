import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";
import type { Aluno, NivelDificuldade, Pergunta } from "../types";
import "./styles/Quiz.css";

interface LocationState {
  aluno: Aluno;
  nivel: NivelDificuldade;
}

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const aluno = state?.aluno;
  const nivel = state?.nivel;

  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [respostaSelecionada, setRespostaSelecionada] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [imagemRedimensionada, setImagemRedimensionada] = useState<string | null>(null);

  // Função para redimensionar Base64 mantendo proporção
  const resizeBase64Image = (base64: string, maxWidth: number, maxHeight: number) => {
    return new Promise<string>((resolve) => {
      const img = new Image();
      img.src = `data:image/png;base64,${base64}`;
      img.onload = () => {
        let { width, height } = img;

        // Ajusta mantendo proporção
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

        resolve(canvas.toDataURL("image/png").split(",")[1]); // retorna Base64 apenas
      };
    });
  };

  useEffect(() => {
    if (!nivel || !aluno) {
      alert("Nível ou aluno não definido. Retornando.");
      navigate("/fases");
      return;
    }

    const fetchPerguntas = async () => {
      try {
        const apiPerguntas = await api.getPerguntasPorNivel(10, nivel);
        console.log("✅ Perguntas recebidas:", apiPerguntas);
        setPerguntas(apiPerguntas);
      } catch (err) {
        console.error("Erro ao buscar perguntas:", err);
        alert("Erro ao carregar o quiz. Tente novamente.");
      }
    };

    fetchPerguntas();
  }, [nivel, aluno, navigate]);

  // Redimensiona a imagem da pergunta atual
  useEffect(() => {
    const carregarImagem = async () => {
      if (perguntas[indiceAtual]?.imagem) {
        const resized = await resizeBase64Image(perguntas[indiceAtual].imagem, 400, 250);
        setImagemRedimensionada(resized);
      } else {
        setImagemRedimensionada(null);
      }
    };

    carregarImagem();
  }, [perguntas, indiceAtual]);

  if (perguntas.length === 0) return <p>Carregando perguntas...</p>;
  if (indiceAtual >= perguntas.length) return <p>Quiz finalizado! ✅</p>;

  const perguntaAtual = perguntas[indiceAtual];

  const alternativas = [
    perguntaAtual.alternativaA,
    perguntaAtual.alternativaB,
    perguntaAtual.alternativaC,
    perguntaAtual.alternativaD,
  ];

  const handleResposta = (texto: string) => {
    const correta = texto === perguntaAtual.alternativaCorreta;
    setRespostaSelecionada(texto);
    setFeedback(correta ? "✅ Acertou!" : "❌ Errou!");

    setTimeout(() => {
      setIndiceAtual((prev) => prev + 1);
      setRespostaSelecionada(null);
      setFeedback(null);
    }, 1000);
  };

  return (
    <div className="quiz-container">
      <h2>
        Quiz - Pergunta {indiceAtual + 1} de {perguntas.length}
      </h2>

      <p className="quiz-enunciado">{perguntaAtual.enunciado}</p>

      {/* Exibe imagem redimensionada se existir */}
      {imagemRedimensionada && (
        <img
          src={`data:image/png;base64,${imagemRedimensionada}`}
          alt="Imagem da pergunta"
          style={{
            maxWidth: "100%",
            maxHeight: "250px",
            display: "block",
            margin: "0 auto 20px",
            objectFit: "contain",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        />
      )}

      <div className="quiz-alternativas">
        {alternativas.map((texto, idx) => (
          <button
            key={idx}
            onClick={() => handleResposta(texto)}
            className={
              respostaSelecionada === texto
                ? texto === perguntaAtual.alternativaCorreta
                  ? "acertou"
                  : "errou"
                : ""
            }
          >
            {texto}
          </button>
        ))}
      </div>

      {feedback && <p className="quiz-feedback">{feedback}</p>}
    </div>
  );
};

export default Quiz;
