import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import type { Aluno as AlunoType } from './types';
import Home from './pages/Home';
import AlunoPage from './pages/Aluno';
import Professor from './pages/Professor';
import ProfessorCadastro from './pages/ProfessorCadastro';
import Niveis from './pages/Niveis';
import Fases from './pages/Fases';
import Montagem from './pages/Montagem';
import MontagemInterna from "./pages/MontagemInterna";

function App() {
  const [aluno, setAluno] = useState<AlunoType | null>(null);

  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/aluno" 
            element={<AlunoPage setAluno={setAluno} />} 
          />
          <Route path="/professor" element={<Professor />} />
          <Route path="/professor-cadastro" element={<ProfessorCadastro />} />
          <Route 
            path="/niveis" 
            element={aluno ? <Niveis aluno={aluno as AlunoType} /> : <Home />} 
          />
          <Route 
            path="/fases" 
            element={aluno ? <Fases aluno={aluno as AlunoType} /> : <Home />} 
          />
          <Route path="/montagem" element={<Montagem />} />
          <Route path="/montagem-interna" element={<MontagemInterna />} />
        </Routes>
      </Router>
    </DndProvider>
  );
}

export default App;