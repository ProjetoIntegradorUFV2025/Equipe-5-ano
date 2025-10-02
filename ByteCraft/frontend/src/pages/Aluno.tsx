import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Aluno as AlunoType } from "../types";
import "./styles/Aluno.css";

const API_BASE_URL = "http://localhost:8080/api";

const safeUrl = (relPath: string) => {
  try {
    return new URL(relPath, import.meta.url).href;
  } catch (err) {
    console.error("Erro ao resolver asset:", relPath, err);
    return "";
  }
};

// Ajuste os caminhos relativos conforme a posição deste arquivo
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

  // Verificar orientação da tela
  useEffect(() => {
    const checkOrientation = () => {
      const isMobile = window.innerWidth <= 768;
      setIsPortrait(isMobile && window.innerHeight > window.innerWidth);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', () => {
      // Pequeno delay para aguardar a mudança completa da orientação
      setTimeout(checkOrientation, 100);
    });
    
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  // DEBUG: veja no console a URL resolvida
  console.log("backgroundAluno =>", backgroundAluno);
  console.log("voltarIcon =>", voltarIcon);

  const handleVoltar = () => navigate("/");

  const handleComecar = async () => {
    if (!nome.trim()) return alert("Apelido é obrigatório");
    if (!nomeTurma.trim()) return alert("Código da sala é obrigatório");

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/alunos/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apelido: nome.trim(), codigoSala: nomeTurma.trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        const msg = data?.erro || JSON.stringify(data) || `Erro no login: ${response.status}`;
        throw new Error(msg);
      }

      setAluno({
        apelido: data.apelido,
        nivel: data.nivel || "INDEFINIDO",
        turma: data.sala?.nomeTurma || nomeTurma.trim(),
        codigoSala: data.sala?.codigo || 0
      });

      navigate("/niveis");
    } catch (err) {
      alert("Erro no login ou vinculação: " + (err as Error).message);
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
      {/* Mensagem para orientação vertical */}
      {isPortrait && (
        <div className="aluno-portrait-warning">
          <div className="aluno-portrait-message">
            <p>📱 Para melhor experiência, vire o telefone para a posição deitada! 🔄</p>
          </div>
        </div>
      )}

      <button className="aluno-btn-voltar" onClick={handleVoltar} aria-label="Voltar">
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
          <label className="aluno-input-label">NOME DA TURMA</label>
          <input
            type="text"
            placeholder="Digite o nome da turma..."
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
          aria-label={loading ? 'Carregando...' : 'Começar'}
        >
          {loading ? "Carregando..." : "COMEÇAR"}
        </button>
      </div>
    </div>
  );
};

export default Aluno;