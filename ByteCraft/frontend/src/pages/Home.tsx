import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "./styles/Home.css";

const Home: React.FC = () => {
  const navigate = useNavigate();
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

  const handleAluno = () => {
    navigate("/aluno");
  };

  const handleProfessor = () => {
    navigate("/professor");
  };

  return (
    <div className="home-isolated-container">
      {/* Mensagem para orientação vertical */}
      {isPortrait && (
        <div className="home-portrait-warning">
          <div className="home-portrait-message">
            <p>📱 Para melhor experiência, vire o telefone para a posição deitada! 🔄</p>
          </div>
        </div>
      )}

      <div className="home-button-group">
        <button className="home-btn-professor" onClick={handleProfessor}>
          PROFESSOR
        </button>
        <button className="home-btn-aluno" onClick={handleAluno}>
          ALUNO
        </button>
      </div>
    </div>
  );
};

export default Home;