import React, { useState } from 'react';
import { api } from '../api/api';
import { ApiAluno, ApiProfessor } from '../api/api';

interface ProfessorPageProps {
  professor: ApiProfessor;
}

export const ProfessorPage: React.FC<ProfessorPageProps> = ({ professor }) => {
  const [ranking, setRanking] = useState<ApiAluno[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleVisualizarRanking = async () => {
    if (!professor.sala?.codigoUnico) {
      setErro("Professor não possui sala associada.");
      return;
    }
    try {
      setLoading(true);
      setErro(null);
      const data = await api.getRankingTurma(professor.sala.codigoUnico);
      setRanking(data);
    } catch (error: any) {
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">
        Bem-vindo, {professor.nomeDeUsuario}!
      </h1>

      <p className="mb-2">
        Sala associada: <strong>{professor.sala?.nomeTurma}</strong>
      </p>

      <button
        onClick={handleVisualizarRanking}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Carregando..." : "Visualizar Ranking"}
      </button>

      {erro && <p className="text-red-500 mt-3">{erro}</p>}

      {ranking.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Ranking da Turma</h2>
          <ul className="space-y-2">
            {ranking.map((aluno, index) => (
              <li
                key={index}
                className="border p-2 rounded flex justify-between items-center"
              >
                <span>
                  {index + 1}º — {aluno.apelido}
                </span>
                <span className="text-gray-600">
                  {aluno.nivel ? `-Pontos: ${aluno.pontuacao}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
