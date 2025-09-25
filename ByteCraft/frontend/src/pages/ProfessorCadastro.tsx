// src/pages/ProfessorCadastro.tsx
import React, { useState, useEffect } from 'react';
import { api, ApiProfessor } from '../api/api';
import { useNavigate } from "react-router-dom";
import "./styles/ProfessorCadastro.css";

const safeUrl = (relPath: string) => {
  try {
    return new URL(relPath, import.meta.url).href;
  } catch (err) {
    console.error("Erro ao resolver asset:", relPath, err);
    return "";
  }
};

// Ajuste os caminhos relativos conforme a posição deste arquivo.
// Se este arquivo está em src/pages, então ../assets/... normalmente é correto.
const backgroundCadastro = safeUrl("../assets/backgrounds/background_cadastro.png");
const voltarIcon = safeUrl("../assets/bottons/botao_voltar.png");

const ProfessorCadastro: React.FC = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [nomeTurma, setNomeTurma] = useState('');
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
  console.log("backgroundCadastro =>", backgroundCadastro);
  console.log("voltarIcon =>", voltarIcon);

  const handleCadastro = async () => {
    if (!nome || !senha || !nomeTurma) {
      alert('Preencha todos os campos!');
      return;
    }
    
    try {
      setLoading(true);
      // Cadastro do professor (a sala será criada automaticamente no backend)
      const professor: ApiProfessor = await api.cadastrarProfessor(
        nome,
        senha,
        nomeTurma
      );
      
      const sala = professor.sala;
      alert(
        `Cadastro realizado!\nProfessor: ${professor.nomeDeUsuario}\n` +
        `Turma: ${sala?.nomeTurma}\nCódigo: ${sala?.codigo}`
      );
      
      // Limpa campos
      setNome('');
      setSenha('');
      setNomeTurma('');
      
      // Redireciona para a página de login após cadastro bem-sucedido
      navigate("/professor");
    } catch (error: any) {
      console.error(error);
      alert('Erro ao cadastrar: ' + (error.message || error));
    } finally {
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    navigate("/professor");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleCadastro();
    }
  };

  return (
    <div
      className="professor-cadastro-isolated-container"
      style={{
        backgroundImage: backgroundCadastro ? `url(${backgroundCadastro})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Mensagem para orientação vertical */}
      {isPortrait && (
        <div className="professor-cadastro-portrait-warning">
          <div className="professor-cadastro-portrait-message">
            <p>📱 Para melhor experiência, vire o telefone para a posição deitada! 🔄</p>
          </div>
        </div>
      )}

      <button className="professor-cadastro-btn-voltar" onClick={handleVoltar} aria-label="Voltar">
        <img src={voltarIcon || undefined} alt="Voltar" />
      </button>

      <div className="professor-cadastro-content">
        <div className="professor-cadastro-input-group">
          <label className="professor-cadastro-input-label">NOME</label>
          <input
            type="text"
            placeholder="Digite seu nome..."
            value={nome}
            onChange={e => setNome(e.target.value)}
            className="professor-cadastro-nome-input"
            onKeyPress={handleKeyPress}
            disabled={loading}
            maxLength={50}
          />
        </div>

        <div className="professor-cadastro-input-group">
          <label className="professor-cadastro-input-label">SENHA</label>
          <input
            type="password"
            placeholder="Digite sua senha..."
            value={senha}
            onChange={e => setSenha(e.target.value)}
            className="professor-cadastro-senha-input"
            onKeyPress={handleKeyPress}
            disabled={loading}
            maxLength={30}
          />
        </div>

        <div className="professor-cadastro-input-group">
          <label className="professor-cadastro-input-label">NOME DA TURMA</label>
          <input
            type="text"
            placeholder="Digite o nome da turma..."
            value={nomeTurma}
            onChange={e => setNomeTurma(e.target.value)}
            className="professor-cadastro-turma-input"
            onKeyPress={handleKeyPress}
            disabled={loading}
            maxLength={40}
          />
        </div>

        <button 
          className="professor-cadastro-btn-cadastrar" 
          onClick={handleCadastro} 
          disabled={loading}
          aria-label={loading ? 'Carregando...' : 'Cadastrar professor'}
        >
          {loading ? 'CARREGANDO...' : 'CADASTRAR'}
        </button>
      </div>
    </div>
  );
};

export default ProfessorCadastro;