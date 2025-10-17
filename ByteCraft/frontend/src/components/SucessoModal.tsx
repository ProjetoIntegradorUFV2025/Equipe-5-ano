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
    <div className="modal-overlay">
      <div className="sucesso-modal">
        <div className="sucesso-icon">✅</div>
        <h2>Sucesso!</h2>
        <p>{mensagem}</p>
        <p className="pontos-ganhos">+{pontosGanhos} pontos</p>
        <button className="btn-continuar" onClick={onClose}>
          Continuar
        </button>
      </div>
    </div>
  );
};

export default SucessoModal;