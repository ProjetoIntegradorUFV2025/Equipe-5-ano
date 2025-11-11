// src/hooks/useSound.ts
import clickSound from "../assets/sounds/mouse_click_sfx.mp3";
import successSound from "../assets/sounds/faustao_acertou.mp3";
import errorSound from "../assets/sounds/faustao-errou.mp3";
import winnerSound from "../assets/sounds/esta-fera.mp3";

export function useSound() {
  const playSound = (src: string, volume = 0.5) => {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.play();
  };

  const playClick = () => playSound(clickSound, 0.6);
  const playSuccess = () => playSound(successSound, 0.5);
  const playError = () => playSound(errorSound, 0.5);
  const playWinner = () => playSound(winnerSound, 0.7);

  return { playClick, playSuccess, playError, playWinner};
}
