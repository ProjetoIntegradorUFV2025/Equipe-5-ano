import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import "./styles/Professor.css";

const safeUrl = (relPath: string) => {
  try {
    return new URL(relPath, import.meta.url).href;
  } catch (err) {
    console.error("Erro ao resolver asset:", relPath, err);
    return "";
  }
};

// Ajuste os caminhos relativos conforme a posição deste arquivo
const backgroundProfessor = safeUrl("../assets/backgrounds/background_professor.png");
const voltarIcon = safeUrl("../assets/bottons/botao_voltar.png");

const Professor: React.FC = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
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
  console.log("backgroundProfessor =>", backgroundProfessor);
  console.log("voltarIcon =>", voltarIcon);

  const handleLogin = async () => {
    if (!nome || !senha) {
      alert('Preencha todos os campos!');
      return;
    }

    try {
      await api.loginProfessor(nome, senha);
      alert("Login bem-sucedido!");
      navigate("/professor/dashboard");
    } catch (error: any) {
      alert("Erro no login: " + (error.response?.data || error.message));
    }
  };

  const handleVoltar = () => {
    navigate("/");
  };

  const irParaCadastro = () => {
    navigate("/professor/cadastro");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div 
      className="professor-isolated-container"
      style={{
        backgroundImage: backgroundProfessor ? `url(${backgroundProfessor})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Mensagem para orientação vertical */}
      {isPortrait && (
        <div className="professor-portrait-warning">
          <div className="professor-portrait-message">
            <p>📱 Para melhor experiência, vire o telefone para a posição deitada! 🔄</p>
          </div>
        </div>
      )}

      <button className="professor-btn-voltar" onClick={handleVoltar} aria-label="Voltar">
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