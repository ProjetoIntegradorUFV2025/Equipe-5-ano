import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNiveis, registrarNivel } from "../api/api";
import type { Aluno as AlunoType } from "../types";
import "./styles/Niveis.css";

const safeUrl = (relPath: string) => {
  try {
    return new URL(relPath, import.meta.url).href;
  } catch (err) {
    console.error("Erro ao resolver asset:", relPath, err);
    return "";
  }
};

const backgroundNiveis = safeUrl("../assets/backgrounds/background_niveis.png");
const voltarIcon = safeUrl("../assets/bottons/botao_voltar.png");

interface NiveisProps {
  aluno: AlunoType | null;
}

const Niveis: React.FC<NiveisProps> = ({ aluno }) => {
  const navigate = useNavigate();
  const [niveis, setNiveis] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPortrait, setIsPortrait] = useState(false);

  // Detecta orientação da tela
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

  const handleVoltar = () => {
    navigate("/aluno");
  };

  const selecionarNivel = async (nivel: string) => {
    try {
      if (!aluno?.apelido || !aluno?.codigoSala) {
        alert("Aluno ou código da sala não identificado. Faça login novamente.");
        navigate("/aluno");
        return;
      }

      setLoading(true);
      const atualizado = await registrarNivel(aluno.apelido, nivel, aluno.codigoSala!);

      // Salvar nível no localStorage
      localStorage.setItem("nivelSelecionado", nivel);

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
      return "niveis-btn-facil";
    } else if (nivel.includes("medio")) {
      return "niveis-btn-medio";
    } else if (nivel.includes("dificil")) {
      return "niveis-btn-dificil";
    }

    return "";
  };

  const formatarNivel = (nivel: string): string => {
    if (nivel.toLowerCase() === "facil") {
      return "FÁCIL";
    } else if (nivel.toLowerCase() === "medio") {
      return "MÉDIO";
    } else if (nivel.toLowerCase() === "dificil") {
      return "DIFÍCIL";
    }
    return nivel.charAt(0).toUpperCase() + nivel.slice(1);
  };

  if (loading) {
    return (
      <div
        className="niveis-isolated-container"
        style={{
          backgroundImage: backgroundNiveis ? `url(${backgroundNiveis})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Mensagem para modo retrato */}
        {isPortrait && (
          <div className="niveis-portrait-warning">
            <div className="niveis-portrait-message">
              <p>📱 Vire o telefone para a posição deitada! 🔄</p>
            </div>
          </div>
        )}

        <button className="niveis-btn-voltar" onClick={handleVoltar}>
          <img src={voltarIcon || undefined} alt="Voltar" />
        </button>
        <div className="niveis-button-group">
          <p>Carregando níveis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="niveis-isolated-container"
        style={{
          backgroundImage: backgroundNiveis ? `url(${backgroundNiveis})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Mensagem para modo retrato */}
        {isPortrait && (
          <div className="niveis-portrait-warning">
            <div className="niveis-portrait-message">
              <p>📱 Vire o telefone para a posição deitada! 🔄</p>
            </div>
          </div>
        )}

        <button className="niveis-btn-voltar" onClick={handleVoltar}>
          <img src={voltarIcon || undefined} alt="Voltar" />
        </button>
        <div className="niveis-button-group">
          <p style={{ color: 'red' }}>Erro: {error}</p>
          <button className="niveis-btn-facil" onClick={() => window.location.reload()}>
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="niveis-isolated-container"
      style={{
        backgroundImage: backgroundNiveis ? `url(${backgroundNiveis})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Mensagem para modo retrato */}
      {isPortrait && (
        <div className="niveis-portrait-warning">
          <div className="niveis-portrait-message">
            <p>📱 Vire o telefone para a posição deitada! 🔄</p>
          </div>
        </div>
      )}

      <button className="niveis-btn-voltar" onClick={handleVoltar}>
        <img src={voltarIcon || undefined} alt="Voltar" />
      </button>
      <div className="niveis-button-group">
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