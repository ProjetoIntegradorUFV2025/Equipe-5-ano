import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SalaProfessor.css"; 

interface Aluno {
  nome: string;
  pontuacao: number;
}

export default function SalaProfessor() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const salaId = localStorage.getItem("salaId");
    if (!salaId) return;

    axios
      .get(`http://localhost:8080/api/aluno/sala/${salaId}`)
      .then((res) => setAlunos(res.data))
      .catch(() => console.error("Erro ao buscar alunos"));
  }, []);

  return (
    <div className="sala-container">
      <div className="ranking-card">
        <h1 className="ranking-title">Ranking da Sala</h1>

        <table className="ranking-table">
          <thead>
            <tr>
              <th>Posição</th>
              <th>Nome</th>
              <th>Pontuação</th>
            </tr>
          </thead>
          <tbody>
            {alunos.map((aluno, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{aluno.nome}</td>
                <td>{aluno.pontuacao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={() => navigate("/")} className="btn-voltar">
        Voltar
      </button>
    </div>
  );
}
