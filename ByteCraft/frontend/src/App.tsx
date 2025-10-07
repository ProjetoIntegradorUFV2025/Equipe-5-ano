import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Aluno from "./pages/Aluno";
import Professor from "./pages/Professor";
import ProfessorCadastro from "./pages/ProfessorCadastro";
import { ProfessorPage } from "./pages/Sala"; // <- seu componente da página de sala
import Niveis from "./pages/Niveis";
import Fases from "./pages/Fases";
import { useState } from "react";
import type { Aluno as AlunoType } from "./types";
import type { ApiProfessor } from "./api/api";

function App() {
  const [aluno, setAluno] = useState<AlunoType | null>(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aluno" element={<Aluno setAluno={setAluno} />} />
        <Route path="/professor" element={<Professor />} />
        <Route path="/professor/cadastro" element={<ProfessorCadastro />} />

        {/* Página da sala — usa o professor passado no navigate */}
        <Route
          path="/sala"
          element={<SalaWrapper />}
        />

        <Route
          path="/niveis"
          element={aluno ? <Niveis aluno={aluno} /> : <Aluno setAluno={setAluno} />}
        />
        <Route path="/fases" element={<Fases />} />
      </Routes>
    </Router>
  );
}

// Wrapper para recuperar o professor do localStorage ou state do navigate
function SalaWrapper() {
  const location = useLocation();
  const state = location.state as { professor?: ApiProfessor };
  const professor =
    state?.professor || JSON.parse(localStorage.getItem("professor") || "null");

  if (!professor) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Professor não autenticado.</p>;
  }

  return <ProfessorPage professor={professor} />;
}

export default App;
