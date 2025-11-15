// src/components/SoundButton.tsx
import { useSoundContext } from "../context/SoundContext";
import "./SoundButton.css";

export default function SoundButton() {
  const { isMuted, toggleMute } = useSoundContext();

  return (
    <button
      onClick={toggleMute}
      className={`sound-button ${isMuted ? "muted" : ""}`}
      title={isMuted ? "Ativar som" : "Silenciar som"}
    >
      <span className="icon">
        {isMuted ? "🔇" : "🔊"}
      </span>
    </button>
  );
}
