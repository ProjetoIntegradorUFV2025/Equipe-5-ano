import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Aluno from "./pages/Aluno";
import Professor from "./pages/Professor";
import Niveis from "./pages/Niveis";
import Fases from "./pages/Fases";
import type { Aluno as AlunoType } from "./types";

function App() {
  const [aluno, setAluno] = useState<AlunoType | null>(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aluno" element={<Aluno setAluno={setAluno} />} />
        <Route path="/professor" element={<Professor />} />
        <Route path="/niveis" element={<Niveis aluno={aluno} />} />
        <Route path="/fases" element={<Fases />} />
      </Routes>
    </Router>
  );
}

export default App;