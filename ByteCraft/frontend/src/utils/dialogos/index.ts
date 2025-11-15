import type { NivelDificuldade } from "../../types";
import { DIALOGOS_FACIL } from "./facil";
import { DIALOGOS_MEDIO } from "./medio";
import { DIALOGOS_DIFICIL } from "./dificil";

export interface DialogoHistoria {
  id: string;
  pecaId: string;
  titulo: string;
  texto: string;
}

type DialogosPorNivel = Record<NivelDificuldade, DialogoHistoria[]>;

export const DIALOGOS_HISTORIA: DialogosPorNivel = {
  facil: DIALOGOS_FACIL,
  medio: DIALOGOS_MEDIO,
  dificil: DIALOGOS_DIFICIL,
};
