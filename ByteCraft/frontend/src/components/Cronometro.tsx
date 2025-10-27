import React from "react";
import "./Cronometro.css";

interface CronometroProps {
  tempo: number;
}

const Cronometro: React.FC<CronometroProps> = ({ tempo }) => {
  const formatarTempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="cronometro-container">
      <span className="cronometro-icone">⏱️</span>
      <span className="cronometro-tempo">{formatarTempo(tempo)}</span>
    </div>
  );
};

export default Cronometro;