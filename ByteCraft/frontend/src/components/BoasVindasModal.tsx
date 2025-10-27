import React from "react";
import "./BoasVindasModal.css";
import ramonImage from "../assets/graphics/RAMon.png";

interface BoasVindasModalProps {
  isOpen: boolean;
  onContinuar: () => void;
}

const BoasVindasModal: React.FC<BoasVindasModalProps> = ({ isOpen, onContinuar }) => {
  if (!isOpen) return null;

  return (
    <div className="boas-vindas-overlay">
      <div className="boas-vindas-content">
        <div className="ramon-container">
          <img src={ramonImage} alt="RAMon" className="ramon-saltando" />
        </div>

        <div className="boas-vindas-texto">
          <p>
            <br />
            Oiê, pequeno(a) montador(a) de computadores! Eu sou o RAMon, seu parceiro de bits e parafusos! 
            Agora você vai entrar no <strong>Modo História</strong>! Aqui, vamos montar um computador juntinhos, 
            peça por peça. Eu vou te mostrar onde cada parte vai, para que ela serve e como ela ajuda o computador 
            a funcionar direitinho! Então, mãos na placa... e vamos nessa!
          </p>
        </div>

        <button className="boas-vindas-btn" onClick={onContinuar}>
          Bora lá
        </button>
      </div>
    </div>
  );
};

export default BoasVindasModal;