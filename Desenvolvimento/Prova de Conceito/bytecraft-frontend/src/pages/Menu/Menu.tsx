import React from "react";
import { useNavigate} from "react-router-dom"
import "./Menu.css";

const Menu: React.FC = () => {
  const navigate = useNavigate();
  localStorage.clear();

  return (
    <div className="menu-container">
      <div className="button-menu-group">
        <button className="menu-button-aluno" onClick={() => navigate("/nivel")}>
          ALUNO
        </button>
        <button className="menu-button-professor" onClick={() => navigate("/")}>
          PROFESSOR
        </button>
      </div>
    </div>
  );
};

export default Menu;
