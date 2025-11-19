import React, { useState, useEffect } from 'react';
import { api, ApiProfessor } from '../api/api';
import { useNavigate } from "react-router-dom";
import {useSound} from "../hooks/useSounds";
import "./styles/ProfessorCadastro.css";

import backgroundCadastro from "../assets/backgrounds/background_cadastro.png";
import voltarIcon from "../assets/bottons/botao_voltar.png";

const ProfessorCadastro: React.FC = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [nomeTurma, setNomeTurma] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const { playClick } = useSound();

  useEffect(() => {
    const checkOrientation = () => {
      const isMobile = window.innerWidth <= 768;
      setIsPortrait(isMobile && window.innerHeight > window.innerWidth);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', () => {
      setTimeout(checkOrientation, 100);
    });
    
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  const handleCadastro = async () => {
    playClick();
    if (!nome || !senha || !nomeTurma) {
      alert('Preencha todos os campos!');
      return;
    }
    
    try {
      setLoading(true);
      const professor: ApiProfessor = await api.cadastrarProfessor(
        nome,
        senha,
        nomeTurma
      );
      
      const sala = professor.sala;
      alert(
        `Cadastro realizado!\nProfessor: ${professor.nomeDeUsuario}\n` +
        `Turma: ${sala?.nomeTurma}\nCódigo: ${sala?.codigoUnico}`
      );
      
      setNome('');
      setSenha('');
      setNomeTurma('');
      
      navigate("/professor");
    } catch (error: any) {
      alert('Erro ao cadastrar: ' + (error.message || error));
    } finally {
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    playClick();
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