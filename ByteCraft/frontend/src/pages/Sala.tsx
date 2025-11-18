import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api, ApiAluno, ApiProfessor, ApiSala } from "../api/api";
import { useSound } from "../hooks/useSounds";
import "./styles/Sala.css";

const safeUrl = (relPath: string) => {
  try {
    return new URL(relPath, import.meta.url).href;
  } catch (err) {
    return "";
  }
};

const voltarIcon = safeUrl("../assets/bottons/botao_voltar.png");

const Sala: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { playClick } = useSound();

  const professorFromState = location.state?.professor as ApiProfessor | undefined;
  const professorFromStorage = useMemo(() => {
    try {
      const raw = localStorage.getItem("professor");
      return raw ? (JSON.parse(raw) as ApiProfessor) : undefined;
    } catch {
      return undefined;
    }
  }, []);

  const [professor, setProfessor] = useState<ApiProfessor | undefined>(
    professorFromState || professorFromStorage
  );
  const [sala, setSala] = useState<ApiSala | undefined>(professor?.sala);
  const [ranking, setRanking] = useState<ApiAluno[]>([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!professor) {
      alert("Acesso não autorizado. É necessário fazer login como professor.");
      navigate("/professor", { replace: true });
    }
  }, [professor, navigate]);

  useEffect(() => {
    const preencherSalaSeNecessario = async () => {
      if (!professor) return;

      if (professor.sala?.codigoUnico) {
        setSala(professor.sala);
        return;
      }

      try {
        setCarregando(true);
        const nomeQuery =
          (professor as any).nomeDeUsuario ||
          (professor as any).nome ||
          "";

        if (!nomeQuery) {
          throw new Error(
            "Objeto de professor sem nomeDeUsuario/nome para buscar a sala."
          );
        }

        const salaDoProfessor = await api.getSalaDoProfessor(nomeQuery);
        setSala(salaDoProfessor);

        const atualizado: ApiProfessor = { ...professor, sala: salaDoProfessor };
        setProfessor(atualizado);
        localStorage.setItem("professor", JSON.stringify(atualizado));
      } catch (err: any) {
        alert(
          "Erro ao carregar dados da sala do professor.\n" +
            (err?.message || JSON.stringify(err))
        );
      } finally {
        setCarregando(false);
      }
    };

    preencherSalaSeNecessario();
  }, [professor]);

  useEffect(() => {
    const carregarRanking = async () => {
      if (!sala?.codigoUnico) return;
      try {
        setCarregando(true);
        const dados = await api.getRankingTurma(sala.codigoUnico);
        const ordenado = [...dados].sort(
          (a, b) => (b.pontuacao || 0) - (a.pontuacao || 0)
        );
        setRanking(ordenado);
      } catch (err: any) {
        alert(
          "Erro ao carregar ranking da turma.\n" +
            (err?.message || JSON.stringify(err))
        );
      } finally {
        setCarregando(false);
      }
    };

    carregarRanking();
  }, [sala?.codigoUnico]);

  const handleVoltar = () => {
    playClick();
    navigate("/professor");
  };

  return (
    <div className="sala-container">
      <button className="sala-btn-voltar" onClick={handleVoltar}>
        <img src={voltarIcon || undefined} alt="Voltar" />
      </button>

      <div className="sala-content">
        <div className="sala-header">
          <h1>Sala: {sala?.nomeTurma ?? "—"}</h1>
          <p>
            <strong>Código:</strong> {sala?.codigoUnico ?? "—"}
          </p>
        </div>

        <div className="sala-ranking">
          <h2>Ranking de Alunos</h2>
          {!sala?.codigoUnico ? (
            <p>Carregando dados da sala...</p>
          ) : ranking.length > 0 ? (
            <div>
              <table className="sala-tabela">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Aluno</th>
                    <th>Pontuação</th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.map((aluno, index) => (
                    <tr key={`${aluno.apelido}-${index}`}>
                      <td>{index + 1}</td>
                      <td>{aluno.apelido}</td>
                      <td>{aluno.pontuacao ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Nenhum aluno registrado nesta turma.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sala;
export const ProfessorPage = Sala;