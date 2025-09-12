import { useNavigate } from "react-router-dom";
import "./styles/Fases.css";

const Fases: React.FC = () => {
  const navigate = useNavigate();

  const handleVoltar = () => {
    navigate("/niveis");
  };

  return (
    <div className="fases-container">
      <button className="btn-voltar" onClick={handleVoltar}>
        Voltar
      </button>

      <div className="fases-content">
        {/* Conteúdo das fases será adicionado aqui */}
      </div>
    </div>
  );
};

export default Fases;