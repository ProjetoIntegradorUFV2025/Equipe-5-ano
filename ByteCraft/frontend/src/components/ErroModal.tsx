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
    <div className="modal-overlay">
      <div className="erro-modal">
        <div className="erro-icon">❌</div>
        <h2>Tente Novamente</h2>
        <p>{mensagem}</p>
        <button className="btn-tentar-novamente" onClick={onClose}>
          Tentar Novamente
        </button>
      </div>
    </div>
  );
};

export default ErroModal;