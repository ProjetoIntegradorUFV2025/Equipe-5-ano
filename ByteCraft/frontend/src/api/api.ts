const API_BASE_URL = 'http://localhost:8080/api'; // endereço do backend

export interface ApiAluno {
  apelido: string;
  nivel?: string;
  turma?: string;
  pontuacao?: number;
}

export interface ApiSala {
  id: number;
  nomeTurma: string;
  codigoUnico: number; 
}

export interface ApiProfessor {
  nomeDeUsuario: string;
  senha?: string;
  nomeTurma?: string;
  sala?: ApiSala;
}

// ===== ALUNO =====
export const loginAluno = async (apelido: string, codigoSala: string): Promise<ApiAluno> => {
  const response = await fetch(`${API_BASE_URL}/alunos/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apelido, codigoSala }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Erro no login: ${response.status}`);
  }

  return await response.json();
};

export const getNiveis = async (): Promise<string[]> => {
  const response = await fetch(`${API_BASE_URL}/alunos/niveis`);
  if (!response.ok) throw new Error(`Erro ao carregar níveis: ${response.status}`);
  const data = await response.json();
  return data.map((nivel: any) => nivel.toLowerCase());
};

export const registrarNivel = async (apelido: string, nivel: string, codigoSala: number): Promise<ApiAluno> => {
  const response = await fetch(`${API_BASE_URL}/alunos/${encodeURIComponent(apelido)}/registrarNivel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nivel: nivel.toUpperCase(),
      codigoSala: codigoSala.toString()
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Erro ao atualizar nível: ${response.status}`);
  }

  return await response.json();
};

export const registraPontuacao = async (
  apelido: string,
  codigoSala: number,
  pontos: number,
  segundos: number
): Promise<{ atualizado: boolean }> => {
  const response = await fetch(`${API_BASE_URL}/alunos/setPontuacao`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apelido, codigoSala: codigoSala.toString(), pontos: pontos.toString(), segundos: segundos.toString() }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Erro ao registrar pontuação: ${response.status}`);
  }

  return response.json(); // { atualizado: true/false }
};

// ===== SALA =====
export const cadastrarSala = async (nomeTurma: string): Promise<ApiSala> => {
  const response = await fetch(`${API_BASE_URL}/salas/criar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nomeTurma }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Erro ao cadastrar sala: ${response.status}`);
  }

  return await response.json();
};

export const listarSalas = async (): Promise<ApiSala[]> => {
  const response = await fetch(`${API_BASE_URL}/salas/listar`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Erro ao listar salas: ${response.status}`);
  }
  return await response.json();
};

export const getRankingTurma = async (codigoUnico: number): Promise<ApiAluno[]> => {
  const res = await fetch(`${API_BASE_URL}/salas/getRanking/${codigoUnico}`);
  if (!res.ok) throw new Error(await res.text() || `Erro ao buscar ranking: ${res.status}`);
  return res.json();
};

// ===== PROFESSOR =====
export const cadastrarProfessor = async (
  nomeDeUsuario: string,
  senha: string,
  nomeTurma: string
): Promise<ApiProfessor> => {
  const response = await fetch(`${API_BASE_URL}/professores/cadastrar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome: nomeDeUsuario, senha, nomeTurma }),
  });
  if (!response.ok) throw new Error(await response.text() || `Erro ao cadastrar professor: ${response.status}`);
  return await response.json();
};

export const loginProfessor = async (nomeDeUsuario: string, senha: string): Promise<ApiProfessor> => {
  const response = await fetch(`${API_BASE_URL}/professores/autenticar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome: nomeDeUsuario, senha }),
  });
  if (!response.ok) throw new Error(await response.text() || `Erro no login do professor: ${response.status}`);
  return await response.json();
};

// ==== objeto exportado ====
// Removido vincularAlunoASala
export const api = {
  // Alunos
  loginAluno,
  getNiveis,
  registrarNivel,
  registraPontuacao,

  // Salas
  listarSalas,
  cadastrarSala,
  getRankingTurma, 

  // Professores
  cadastrarProfessor,
  loginProfessor,
};
