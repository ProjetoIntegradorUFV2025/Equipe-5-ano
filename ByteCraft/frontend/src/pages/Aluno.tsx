import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAluno } from "../api/api";
import type { Aluno as AlunoType } from "../types";
import "./styles/Aluno.css";

interface AlunoProps {
  setAluno: (aluno: AlunoType) => void;
}

const Aluno: React.FC<AlunoProps> = ({ setAluno }) => {
  const navigate = useNavigate();
  const [apelido, setApelido] = useState("");
  const [turma, setTurma] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVoltar = () => {
    navigate("/");
  };

  const handleComecar = async () => {
    try {
      setLoading(true);
      const apelidoParaEnviar = apelido.trim() || "Anônimo";
      
      const alunoData = await loginAluno(apelidoParaEnviar, turma.trim() || undefined);
      
      setAluno({
        apelido: alunoData.apelido,
        nivel: alunoData.nivel,
        turma: turma.trim() || undefined
      });
      
      navigate("/niveis");
    } catch (err) {
      alert("Erro no login: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleComecar();
    }
  };

  return (
    <div className="aluno-isolated-container">
      <button className="aluno-btn-voltar" onClick={handleVoltar}>
        <img src="src/assets/bottons/botao_voltar.png" alt="Voltar" />
      </button>
      <div className="aluno-content">
        
        <input
          type="text"
          placeholder="Seu apelido (opcional)..."
          value={apelido}
          onChange={(e) => setApelido(e.target.value)}
          className="aluno-apelido-input"
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        
        <input
          type="text"
          placeholder="Sua turma (opcional)..."
          value={turma}
          onChange={(e) => setTurma(e.target.value)}
          className="aluno-turma-input"
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        
        <button 
          className="aluno-btn-comecar" 
          onClick={handleComecar}
          disabled={loading}
        >
          {loading ? 'Carregando...' : 'Começar'}
        </button>
      </div>
    </div>
  );
};

export default Aluno;