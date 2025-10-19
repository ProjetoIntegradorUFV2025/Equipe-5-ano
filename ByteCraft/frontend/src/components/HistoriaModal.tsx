import React from "react";
import "./HistoriaModal.css";
import RAMon from "../assets/graphics/RAMon.png";
import type { DialogoHistoria } from "../types";

interface HistoriaModalProps {
  isOpen: boolean;
  historia: DialogoHistoria | null;
  onContinuar: () => void;
}

const HistoriaModal: React.FC<HistoriaModalProps> = ({ isOpen, historia, onContinuar }) => {
  if (!isOpen || !historia) return null;

  return (
    <div className="historia-modal-topo">
      <div className="historia-modal-balao-topo">
        <img
          src={RAMon}
          alt="RAMon personagem"
          className="historia-modal-personagem-topo"
        />
        <div className="historia-modal-conteudo-topo">
          <h2 className="historia-modal-titulo">{historia.titulo}</h2>
          <p className="historia-modal-texto">{historia.texto}</p>
          <button
            className="historia-modal-btn-continuar"
            onClick={onContinuar}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoriaModal;
