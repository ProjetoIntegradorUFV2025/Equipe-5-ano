import { DndProvider } from 'react-dnd-multi-backend'
import { HTML5toTouch } from 'rdndmb-html5-to-touch'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import type { Aluno as AlunoType } from "./types";

import { SoundProvider } from "./context/SoundContext";
import SoundButton from "./components/SoundButton";

import Home from "./pages/Home";
import AlunoPage from "./pages/Aluno";
import Professor from "./pages/Professor";
import ProfessorCadastro from "./pages/ProfessorCadastro";
import Niveis from "./pages/Niveis";
import Fases from "./pages/Fases";
import Montagem from "./pages/Montagem";
import MontagemInterna from "./pages/MontagemInterna";
import Quiz from "./pages/Quiz";
import { ProfessorPage } from "./pages/Sala";

function App() {
  const [aluno, setAluno] = useState<AlunoType | null>(null);

  return (
    <SoundProvider>
      <DndProvider options={HTML5toTouch}>
        {/* BASENAME DEVE TER "/" NO FINAL */}
        <Router basename="/bytecraft/">

          <SoundButton />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/aluno" element={<AlunoPage setAluno={setAluno} />} />
            <Route path="/professor" element={<Professor />} />
            <Route path="/professor/cadastro" element={<ProfessorCadastro />} />
            <Route path="/sala" element={<ProfessorPage />} />

            <Route
              path="/niveis"
              element={aluno ? <Niveis aluno={aluno} /> : <Home />}
            />
            <Route
              path="/fases"
              element={aluno ? <Fases aluno={aluno} /> : <Home />}
            />

            <Route path="/montagem" element={<Montagem />} />
            <Route path="/montagem-interna" element={<MontagemInterna />} />
            <Route path="/quiz" element={<Quiz />} />
          </Routes>

        </Router>
      </DndProvider>
    </SoundProvider>
  );
}

export default App;
