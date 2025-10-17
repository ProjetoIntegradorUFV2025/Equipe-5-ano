const API_BASE_URL = "http://localhost:8080/api";

// ==== INTERFACES ====
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

// ==== FUNÇÃO AUXILIAR ====
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Erro HTTP: ${response.status}`);
  }
  return response.json();
}

// ==== ALUNO ====
export const loginAluno = async (apelido: string, codigoSala: string): Promise<ApiAluno> => {
  const response = await fetch(`${API_BASE_URL}/alunos/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apelido, codigoSala }),
  });
  return handleResponse<ApiAluno>(response);
};

export const getNiveis = async (): Promise<string[]> => {
  const response = await fetch(`${API_BASE_URL}/alunos/niveis`);
  const niveis: string[] = await handleResponse(response);
  return niveis.map((n) => n.toLowerCase());
};

export const registrarNivel = async (
  apelido: string,
  nivel: string,
  codigoSala: number
): Promise<ApiAluno> => {
  const response = await fetch(
    `${API_BASE_URL}/alunos/${encodeURIComponent(apelido)}/registrarNivel`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nivel: nivel.toUpperCase(),
        codigoSala,
      }),
    }
  );
  return handleResponse<ApiAluno>(response);
};

/**
 * Envia a pontuação final do aluno para o backend
 * @param apelido - Apelido do aluno
 * @param codigoSala - Código da sala do aluno
 * @param pontos - Pontuação final (com bônus de tempo já aplicado)
 * @param segundos - Tempo em segundos para completar a montagem
 * @throws Error se falhar ao salvar
 */
export const registraPontuacao = async (
  apelido: string,
  codigoSala: number,
  pontos: number,
  segundos: number
): Promise<{ atualizado: boolean }> => {
  const response = await fetch(`${API_BASE_URL}/alunos/setPontuacao`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apelido, codigoSala, pontos, segundos }),
  });
  return handleResponse<{ atualizado: boolean }>(response);
};

// ==== SALA ====
export const cadastrarSala = async (nomeTurma: string): Promise<ApiSala> => {
  const response = await fetch(`${API_BASE_URL}/salas/criar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nomeTurma }),
  });
  return handleResponse<ApiSala>(response);
};

export const listarSalas = async (): Promise<ApiSala[]> => {
  const response = await fetch(`${API_BASE_URL}/salas/listar`);
  return handleResponse<ApiSala[]>(response);
};

export const getRankingTurma = async (codigoUnico: number): Promise<ApiAluno[]> => {
  const response = await fetch(`${API_BASE_URL}/salas/getRanking/${codigoUnico}`);
  return handleResponse<ApiAluno[]>(response);
};

// ==== PROFESSOR ====
export const cadastrarProfessor = async (
  nomeDeUsuario: string,
  senha: string,
  nomeTurma: string
): Promise<ApiProfessor> => {
  const response = await fetch(`${API_BASE_URL}/professores/cadastrar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome: nomeDeUsuario, senha, nomeTurma }),
  });
  return handleResponse<ApiProfessor>(response);
};

export const loginProfessor = async (
  nomeDeUsuario: string,
  senha: string
): Promise<ApiProfessor> => {
  const response = await fetch(`${API_BASE_URL}/professores/autenticar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome: nomeDeUsuario, senha }),
  });
  return handleResponse<ApiProfessor>(response);
};

// ==== PROGRESSO ====
/**
 * Salva o progresso do aluno (marca modo história como concluído)
 */
export const salvarProgresso = async (
  apelido: string,
  codigoSala: number | string,
  modoHistoriaCompleto: boolean
): Promise<void> => {
  try {
    console.log("📤 Enviando progresso:", { apelido, codigoSala, modoHistoriaCompleto });

    const response = await fetch(`${API_BASE_URL}/alunos/progresso`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apelido,
        codigo: codigoSala, // 🔄 altera para 'codigo' (mais comum no backend)
        modoHistoriaCompleto,
      }),
    });

    const texto = await response.text();
    if (!response.ok) {
      console.error("❌ Erro ao salvar progresso:", response.status, texto);
      throw new Error(`Erro ao salvar progresso: ${texto}`);
    }

    console.log("✅ Progresso salvo com sucesso!");
  } catch (error) {
    console.error("⚠️ Falha na função salvarProgresso:", error);
    throw new Error("Erro ao salvar progresso");
  }
};

/**
 * Obtém o progresso do aluno
 */
export const obterProgresso = async (
  apelido: string,
  codigoSala: number
): Promise<{ modoHistoriaCompleto: boolean }> => {
  const response = await fetch(
    `${API_BASE_URL}/alunos/progresso/${encodeURIComponent(apelido)}/${codigoSala}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!response.ok) {
    throw new Error('Erro ao obter progresso');
  }

  return await response.json();
};

// ==== OBJETO EXPORTADO ====
export const api = {
  // Aluno
  loginAluno,
  getNiveis,
  registrarNivel,
  registraPontuacao,
  salvarProgresso,
  obterProgresso,

  // Sala
  listarSalas,
  cadastrarSala,
  getRankingTurma,

  // Professor
  cadastrarProfessor,
  loginProfessor,
};

// ==== EXPORT DEFAULT ====
export default api;