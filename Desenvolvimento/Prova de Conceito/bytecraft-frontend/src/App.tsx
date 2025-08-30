import React, { useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./pages/Menu/Menu";
import backgroundMusic from "./assets/sounds/backgroundMusic.mp3";

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
      </Routes>
    </Router>
  );
}

export default App;
