import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginProfessor.css";
import botaoVoltar from "../../assets/images/botao_voltar.png";
import axios from "axios";

const LoginProfessor: React.FC = () => {
  const navigate = useNavigate();
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  localStorage.clear();

  const handleLogin = async (event: React.FormEvent) => {
  event.preventDefault();
  try {
    const response = await axios.post("http://localhost:8080/api/professor/login", {
      cpf: cpf,
      senha: senha
    });
    if (response.status === 200) {
      localStorage.setItem("salaId", String(response.data.salaId));
      alert("Login realizado com sucesso!");
      navigate("/sala-professor");
    }
  } catch (err) {
    setErro("CPF ou senha inválidos!");
  }
};
 
  return (
    <div
      className="professor-container"
    >
      <img
        src={botaoVoltar}
        alt="Voltar"
        className="botao-voltar"
        onClick={() => navigate("/")}
      />
      <div className="professor-form-wraper">
          {erro && <p style={{color: "red"}}>{erro}</p>}
        <form className="professor-form" name="form-login" onSubmit={handleLogin}>
          <input
            type="tel" 
            pattern="[0-9]{11}"
            placeholder="CPF"
            className="input-field"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            className="input-field"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <button type="submit" className="professor-button-entrar">Entrar</button>
        </form>
          <button className="professor-button-cadastrar">Cadastrar</button>
      </div>
    </div>
  );
};

export default LoginProfessor;
