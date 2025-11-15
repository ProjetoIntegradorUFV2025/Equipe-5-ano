import React from "react";
import { useNavigate} from "react-router"
import botaoVoltar from "../../assets/images/botao_voltar.png"
import "./Nivel.css";

const Nivel: React.FC = () => {
  const navigate = useNavigate();
  localStorage.removeItem("dificuldade");
  return (
    <div className="menu-nivel-container">
      <img
        src={botaoVoltar}
        alt="Voltar"
        className="botao-voltar"
        onClick={() => navigate("/")}
      />
      <div className="button-nivel-group">
        <button className="menu-button-facil" onClick={() => {navigate("/jogo"); localStorage.setItem("dificuldade", String("fácil"))}}>
          FÁCIL
        </button>
        <button className="menu-button-medio" onClick={() => {navigate("/jogo"); localStorage.setItem("dificuldade", String("médio"))}}>
          MÉDIO
        </button>
        <button className="menu-button-dificil" onClick={() => {navigate("/jogo"); localStorage.setItem("dificuldade", String("difícil"))}}>
          DIFÍCIL
        </button>
      </div>
    </div>
  );
};

export default Nivel;