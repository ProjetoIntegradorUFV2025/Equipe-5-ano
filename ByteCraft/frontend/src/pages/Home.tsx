import { useNavigate } from "react-router-dom";
import "./styles/Home.css";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleAluno = () => {
    navigate("/aluno");
  };

  const handleProfessor = () => {
    navigate("/professor");
  };

  return (
    <div className="home-isolated-container">
      <div className="home-button-group">
        <button className="home-btn-professor" onClick={handleProfessor}>
          PROFESSOR
        </button>
        <button className="home-btn-aluno" onClick={handleAluno}>
          ALUNO
        </button>
      </div>
    </div>
  );
};

export default Home;