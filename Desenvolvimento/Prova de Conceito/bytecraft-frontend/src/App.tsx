import { useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Menu from "./pages/Menu/Menu";
import Nivel from "./pages/Nivel/Nivel";
import backgroundMusic from "./assets/sounds/backgroundMusic.mp3";
import LoginProfessor from "./pages/LoginProfessor/LoginProfessor";
import SalaProfessor from "./pages/SalaProfessor/SalaProfessor";
import Jogo from "./pages/Jogo/Jogo";

function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch((err) => {
        console.log("Autoplay bloqueado, aguardando interação do usuário", err);
      });
    }
  }, []);

  return (
    <Router>
      <audio ref={audioRef} src={backgroundMusic} loop />

      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/nivel" element={<Nivel />} />
        <Route path="/login-professor" element={<LoginProfessor />}/>
        <Route path="/sala-professor" element={<SalaProfessor />}/>
        <Route path="/jogo" element={<Jogo />}/>
      </Routes>
    </Router>
  );
}

export default App;
