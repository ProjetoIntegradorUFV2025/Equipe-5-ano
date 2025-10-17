import React from 'react';
import './SucessoModal.css';

interface SucessoModalProps {
  isOpen: boolean;
  onClose: () => void;
  pontosGanhos: number;
  mensagem?: string;
}

const SucessoModal: React.FC<SucessoModalProps> = ({ 
  isOpen, 
  onClose, 
  pontosGanhos,
  mensagem = "Parabéns! Você acertou!"
}) => {
  if (!isOpen) return null;

  return (
    <div className="sucesso-modal-overlay">
      <div className="sucesso-modal-content">
        <div className="sucesso-ramon-container">
          <div className="sucesso-ramon">🎯</div>
        </div>

        <div className="sucesso-modal-texto">
          <h2 className="sucesso-modal-titulo">Sucesso!</h2>
          <p>{mensagem}</p>
          <p className="sucesso-pontos-ganhos">+{pontosGanhos} pontos</p>
        </div>

        <button className="sucesso-modal-btn" onClick={onClose}>
          Continuar
        </button>
      </div>
    </div>
  );
};

export default SucessoModal;