// Aluno.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Aluno as AlunoType } from "../types";
import { useSound } from "../hooks/useSounds";
import "./styles/Aluno.css";

const API_BASE_URL = "http://localhost:8080/api";

const safeUrl = (relPath: string) => {
  try {
    return new URL(relPath, import.meta.url).href;
  } catch (err) {
    return "";
  }
};

const backgroundAluno = safeUrl("../assets/backgrounds/background_aluno.png");
const voltarIcon = safeUrl("../assets/bottons/botao_voltar.png");

interface AlunoProps {
  setAluno: (aluno: AlunoType) => void;
}

const Aluno: React.FC<AlunoProps> = ({ setAluno }) => {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [nomeTurma, setNomeTurma] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);

  const { playClick } = useSound();

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
    navigate("/");
  };

  const handleComecar = async () => {
    playClick();
    if (!nome.trim()) return alert("Apelido é obrigatório");
    if (!nomeTurma.trim()) return alert("Código da sala é obrigatório");

    const codigoSala = parseInt(nomeTurma.trim(), 10);
    if (isNaN(codigoSala) || codigoSala < 0 || codigoSala > 127) {
      return alert("Sala não encontrada");
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/alunos/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apelido: nome.trim(), codigoSala: nomeTurma.trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Sala não encontrada");
      }

      setAluno({
        apelido: data.apelido,
        nivel: data.nivel || "INDEFINIDO",
        turma: data.sala?.nomeTurma || nomeTurma.trim(),
        codigoSala: data.sala?.codigo || 0
      });

      navigate("/niveis");
    } catch (err) {
      alert("Sala não encontrada");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) handleComecar();
  };

  return (
    <div
      className="aluno-isolated-container"
      style={{
        backgroundImage: backgroundAluno ? `url(${backgroundAluno})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {isPortrait && (
        <div className="aluno-portrait-warning">
          <div className="aluno-portrait-message">
            <p>📱 Vire o telefone para a posição deitada! 🔄</p>
          </div>
        </div>
      )}

      <button
        className="aluno-btn-voltar"
        onClick={handleVoltar}
        aria-label="Voltar"
      >
        <img src={voltarIcon || undefined} alt="Voltar" />
      </button>

      <div className="aluno-content">
        <div className="aluno-input-group">
          <label className="aluno-input-label">NOME</label>
          <input
            type="text"
            placeholder="Digite seu nome..."
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="aluno-nome-input"
            onKeyPress={handleKeyPress}
            disabled={loading}
            maxLength={50}
          />
        </div>

        <div className="aluno-input-group">
          <label className="aluno-input-label">CÓDIGO DA TURMA</label>
          <input
            type="text"
            placeholder="Digite o código da turma..."
            value={nomeTurma}
            onChange={(e) => setNomeTurma(e.target.value)}
            className="aluno-turma-input"
            onKeyPress={handleKeyPress}
            disabled={loading}
            maxLength={40}
          />
        </div>

        <button
          className="aluno-btn-comecar"
          onClick={handleComecar}
          disabled={loading}
          aria-label={loading ? "Carregando..." : "Começar"}
        >
          {loading ? "Carregando..." : "COMEÇAR"}
        </button>
      </div>
    </div>
  );
};

export default Aluno;