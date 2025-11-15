import React from "react";
import "./HistoriaModal.css";
import RAMon from "../assets/graphics/RAMon.png";
import type { DialogoHistoria } from "../types";

interface HistoriaModalProps {
  isOpen: boolean;
  historia: DialogoHistoria | null;
}

const HistoriaModal: React.FC<HistoriaModalProps> = ({ isOpen, historia }) => {
  if (!isOpen || !historia) return null;

  return (
    <div className="historia-modal-overlay-nao-bloqueante">
      <div className="historia-modal-container">
        <div className="historia-modal-personagem-wrapper">
          <img
            src={RAMon}
            alt="RAMon personagem"
            className="historia-modal-personagem"
          />
        </div>
        <div className="historia-modal-balao">
          <h2 className="historia-modal-titulo">{historia.titulo}</h2>
          <p className="historia-modal-texto">{historia.texto}</p>
        </div>
      </div>
    </div>
  );
};

export default HistoriaModal;