import React from "react";
import "./PainelPontuacao.css";

interface PainelPontuacaoProps {
  pontuacao: number;
  pecasRestantes: number;
  totalPecas: number;
}

const PainelPontuacao: React.FC<PainelPontuacaoProps> = ({ 
  pontuacao, 
  pecasRestantes,
  totalPecas
}) => {
  const pecasColocadas = totalPecas - pecasRestantes;

  return (
    <div className="painel-pontuacao-container">
      <div className="painel-pontuacao-item">
        <span className="painel-pontuacao-label">Pontuação:</span>
        <span className="painel-pontuacao-valor">{pontuacao}</span>
      </div>
      <div className="painel-pontuacao-item">
        <span className="painel-pontuacao-label">Progresso:</span>
        <span className="painel-pontuacao-valor">
          {pecasColocadas}/{totalPecas}
        </span>
      </div>
    </div>
  );
};

export default PainelPontuacao;