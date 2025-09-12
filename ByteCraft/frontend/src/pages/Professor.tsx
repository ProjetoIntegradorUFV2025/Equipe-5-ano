import { useNavigate } from "react-router-dom";
import "./styles/Professor.css";

const Professor: React.FC = () => {
  const navigate = useNavigate();

  const handleVoltar = () => {
    navigate("/");
  };

  return (
    <div className="professor-container">
      <button className="btn-voltar" onClick={handleVoltar}>
        Voltar
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