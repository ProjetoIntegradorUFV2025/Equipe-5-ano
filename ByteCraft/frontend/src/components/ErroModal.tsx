import React from 'react';
import './ErroModal.css';

interface ErroModalProps {
  isOpen: boolean;
  onClose: () => void;
  mensagem: string;
}

const ErroModal: React.FC<ErroModalProps> = ({ isOpen, onClose, mensagem }) => {
  if (!isOpen) return null;

  return (
    <div className="erro-modal-overlay">
      <div className="erro-modal-content">
        <div className="erro-ramon-container">
          <div className="erro-ramon">⚠️</div>
        </div>

        <div className="erro-modal-texto">
          <h2 className="erro-modal-titulo">Tente Novamente</h2>
          <p>{mensagem}</p>
        </div>

        <button className="erro-modal-btn" onClick={onClose}>
          Tentar Novamente
        </button>
      </div>
    </div>
  );
};

export default ErroModal;