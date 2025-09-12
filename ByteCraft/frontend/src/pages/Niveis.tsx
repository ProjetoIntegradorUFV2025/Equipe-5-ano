import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNiveis, registrarNivel } from "../api/api";
import type { Aluno as AlunoType } from "../types";
import "./styles/Niveis.css";

interface NiveisProps {
  aluno: AlunoType | null;
}

const Niveis: React.FC<NiveisProps> = ({ aluno }) => {
  const navigate = useNavigate();
  const [niveis, setNiveis] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNiveis = async () => {
      try {
        setLoading(true);
        const data = await getNiveis();
        setNiveis(data);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
        console.error("Erro ao carregar níveis:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNiveis();
  }, []);

  const selecionarNivel = async (nivel: string) => {
    try {
      if (!aluno?.apelido) {
        alert("Aluno não identificado. Faça login novamente.");
        navigate("/aluno");
        return;
      }

      setLoading(true);
      const atualizado = await registrarNivel(aluno.apelido, nivel);
      
      // Atualiza o aluno localmente com o novo nível
      const alunoAtualizado = { ...aluno, nivel: atualizado.nivel };
      
      navigate("/fases", { 
        state: { 
          nivel,
          aluno: alunoAtualizado
        } 
      });
    } catch (err) {
      alert("Erro: " + (err as Error).message);
      console.error("Erro ao atualizar nível:", err);
    } finally {
      setLoading(false);
    }
  };

  const getClasseBotao = (nivel: string): string => {
    if (nivel.includes("facil")) {
      return "btn-facil";
    } else if (nivel.includes("medio")) {
      return "btn-medio";
    } else if (nivel.includes("dificil")) {
      return "btn-dificil";
    }
    
    return "";
  };

  const formatarNivel = (nivel: string): string => {
    return nivel.charAt(0).toUpperCase() + nivel.slice(1);
  };

  const handleVoltar = () => {
    navigate("/aluno");
  };

  if (loading) {
    return (
      <div className="niveis-container">
        <button className="btn-voltar" onClick={handleVoltar} disabled={loading}>
          Voltar
        </button>
        <div className="button-group">
          <p>Carregando níveis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="niveis-container">
        <button className="btn-voltar" onClick={handleVoltar}>
          Voltar
        </button>
        <div className="button-group">
          <p style={{ color: 'red' }}>Erro: {error}</p>
          <button onClick={() => window.location.reload()}>
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="niveis-container">
      <button className="btn-voltar" onClick={handleVoltar}>
        Voltar
      </button>

      <div className="button-group">
        {aluno && (
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '20px',
            color: '#555',
            fontSize: '1.2rem'
          }}>
            Olá, <strong>{aluno.apelido}</strong>!
            {aluno.turma && ` - Turma: ${aluno.turma}`}
          </div>
        )}
        
        {niveis.length > 0 ? (
          niveis.map((nivel) => (
            <button
              key={nivel}
              className={getClasseBotao(nivel)}
              onClick={() => selecionarNivel(nivel)}
              disabled={loading}
            >
              {formatarNivel(nivel)}
            </button>
          ))
        ) : (
          <p>Nenhum nível disponível</p>
        )}
      </div>
    </div>
  );
};

export default Niveis;