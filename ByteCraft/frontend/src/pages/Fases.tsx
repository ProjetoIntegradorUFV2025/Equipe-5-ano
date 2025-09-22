import { useNavigate } from "react-router-dom";
import "./styles/Fases.css";

const Fases: React.FC = () => {
  const navigate = useNavigate();

  const handleVoltar = () => {
    navigate("/niveis");
  };

  return (
    <div className="fases-isolated-container">
      <button className="fases-btn-voltar" onClick={handleVoltar}>
        <img src="src/assets/bottons/botao_voltar.png" alt="Voltar" />
      </button>
      <div className="fases-content">
        {/* Conteúdo das fases será adicionado aqui */}
      </div>
    </div>
  );
};

export default Fases;