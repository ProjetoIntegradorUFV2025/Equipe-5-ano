// src/types/index.ts
export interface Aluno {
  id?: number;
  apelido: string;
  nivel?: string;
  turma?: string;
  codigoSala?: number;
  pontuacao?: number;
}

export type NivelDificuldade = 'facil' | 'medio' | 'dificil';

export interface PecaItem {
  id: string;
  label: string;
  imagem: string;
  color?: string;
  descricao?: string;
}

export interface Historia {
  id: string;
  pecaId: string;
  titulo: string;
  texto: string;
  imagem?: string;
}

export interface DialogoHistoria {
  id: string;
  pecaId: string;
  titulo: string;
  texto: string;
  imagem?: string;
}

export interface TentativaPeca {
  pecaId: string;
  numeroTentativas: number;
  acertou: boolean;
  pontuacaoObtida: number;
  feedback?: string;
}

export interface EstadoJogo {
  pecasColocadas: Set<string>;
  pontuacao: number;
  tentativas: Record<string, number>;
}

export interface ConfiguracaoNivel {
  facil: ConfigNivelDetalhes;
  medio: ConfigNivelDetalhes;
  dificil: ConfigNivelDetalhes;
}

export interface ConfigNivelDetalhes {
  tentativas: number[];
  penalidades: number[];
  ajudas: string[];
}

// Interfaces adicionais para completar o sistema
export interface ProgressoAluno {
  apelido: string;
  nivel: string;
  codigoSala: number;
  pontuacao: number;
  concluido: boolean;
  dataConclusao?: string;
}

export interface Sala {
  codigo: number;
  nome: string;
  alunos: Aluno[];
  professorId: string;
  dataCriacao: string;
}

export interface Professor {
  id: string;
  nome: string;
  email: string;
  salas: Sala[];
}

// Interface para o hook de pontuação
export interface PontuacaoState {
  pontuacaoTotal: number;
  registrarTentativa: (pecaId: string, acertou: boolean, nivel: NivelDificuldade) => number;
  calcularPontuacaoFinalComBonus: (tempo: number) => number;
  resetar: () => void;
}

// Interface para o hook do cronômetro
export interface CronometroState {
  tempo: number;
  iniciar: () => void;
  pausar: () => void;
  resetar: () => void;
}

// Interface para as configurações dos diálogos por nível
export interface DialogosPorNivel {
  facil: DialogoHistoria[];
  medio: DialogoHistoria[];
  dificil: DialogoHistoria[];
}


export interface Pergunta {
  id: number;
  enunciado: string;
  imagem?: string; // opcional
  alternativaA: string;
  alternativaB: string;
  alternativaC: string;
  alternativaD: string;
  alternativaCorreta: string; // novo campo
  nivelDificuldade: string;
}
