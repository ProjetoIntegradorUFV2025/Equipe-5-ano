import { useNavigate } from "react-router-dom";
import "./styles/Professor.css";

const Professor: React.FC = () => {
  const navigate = useNavigate();

  const handleVoltar = () => {
    navigate("/");
  };

  return (
    <div className="professor-isolated-container">
      <button className="professor-btn-voltar" onClick={handleVoltar}>
        <img src="src/assets/bottons/botao_voltar.png" alt="Voltar" />
      </button>
      <div className="professor-content">
        <div className="professor-options">
          {/* Opções serão adicionadas aqui posteriormente */}
        </div>
      </div>
    </div>
  );
};

export default Professor;