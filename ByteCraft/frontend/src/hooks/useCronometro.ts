import { useState, useEffect, useRef } from 'react';

interface UseCronometroReturn {
  tempo: number;
  iniciar: () => void;
  pausar: () => void;
  resetar: () => void;
  estaAtivo: boolean;
}

export function useCronometro(): UseCronometroReturn {
  const [tempo, setTempo] = useState(0);
  const [estaAtivo, setEstaAtivo] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (estaAtivo) {
      intervalRef.current = window.setInterval(() => {
        setTempo((t) => t + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [estaAtivo]);

  const iniciar = () => setEstaAtivo(true);
  const pausar = () => setEstaAtivo(false);
  const resetar = () => {
    setEstaAtivo(false);
    setTempo(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return { tempo, iniciar, pausar, resetar, estaAtivo };
}