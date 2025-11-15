// src/pages/Sala.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api, ApiAluno, ApiProfessor, ApiSala } from "../api/api";
import { useSound } from "../hooks/useSounds";
import "./styles/Sala.css";

const safeUrl = (relPath: string) => {
  try {
    return new URL(relPath, import.meta.url).href;
  } catch (err) {
    console.error("Erro ao resolver asset:", relPath, err);
    return "";
  }
};

const voltarIcon = safeUrl("../assets/bottons/botao_voltar.png");

const Sala: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { playClick } = useSound();

  // Professor vindo da navegação OU persistido
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

  // Se não houver professor, volta ao login
  useEffect(() => {
    if (!professor) {
      alert("Acesso não autorizado. É necessário fazer login como professor.");
      navigate("/professor", { replace: true });
    }
  }, [professor, navigate]);

  // Completa dados da sala se estiver faltando
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
        console.error("Erro ao carregar dados do professor/sala:", err);
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

  // Carrega ranking quando tiver código da sala
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
        console.error("Erro ao carregar ranking:", err);
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