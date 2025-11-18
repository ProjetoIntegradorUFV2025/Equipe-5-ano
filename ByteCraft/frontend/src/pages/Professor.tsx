import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, ApiProfessor } from "../api/api";
import {useSound} from "../hooks/useSounds";
import "./styles/Professor.css";

const safeUrl = (relPath: string) => {
  try {
    return new URL(relPath, import.meta.url).href;
  } catch (err) {
    return "";
  }
};

const backgroundProfessor = safeUrl("../assets/backgrounds/background_professor.png");
const voltarIcon = safeUrl("../assets/bottons/botao_voltar.png");

const Professor: React.FC = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
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

  const handleLogin = async () => {
    playClick();
    if (!nome || !senha) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const professorLogado: ApiProfessor = await api.loginProfessor(nome, senha);

      localStorage.setItem("professor", JSON.stringify(professorLogado));

      alert("Login bem-sucedido!");

      navigate("/sala", { state: { professor: professorLogado } });
    } catch (error: any) {
      alert("Erro no login: " + (error.response?.data || error.message));
    }
  };

  const handleVoltar = () => {
    playClick();
    navigate("/");
  }

  const irParaCadastro = () =>{ 
    playClick();
    navigate("/professor/cadastro");
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div
      className="professor-isolated-container"
      style={{
        backgroundImage: backgroundProfessor
          ? `url(${backgroundProfessor})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {isPortrait && (
        <div className="professor-portrait-warning">
          <div className="professor-portrait-message">
            <p>📱 Vire o telefone para a posição deitada! 🔄</p>
          </div>
        </div>
      )}

      <button className="professor-btn-voltar" onClick={handleVoltar}>
        <img src={voltarIcon || undefined} alt="Voltar" />
      </button>

      <div className="professor-content">
        <div className="professor-input-group">
          <label className="professor-input-label">NOME</label>
          <input
            type="text"
            placeholder="Digite seu nome..."
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="professor-nome-input"
            onKeyPress={handleKeyPress}
            maxLength={50}
          />
        </div>

        <div className="professor-input-group">
          <label className="professor-input-label">SENHA</label>
          <input
            type="password"
            placeholder="Digite sua senha..."
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="professor-senha-input"
            onKeyPress={handleKeyPress}
            maxLength={30}
          />
        </div>

        <button
          className="professor-btn-entrar"
          onClick={handleLogin}
          aria-label="Entrar como professor"
        >
          ENTRAR
        </button>

        <button
          className="professor-btn-cadastrar"
          onClick={irParaCadastro}
          aria-label="Cadastrar novo professor"
        >
          CADASTRAR
        </button>
      </div>
    </div>
  );
};

export default Professor;