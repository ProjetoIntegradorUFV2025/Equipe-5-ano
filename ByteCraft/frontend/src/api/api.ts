const API_BASE_URL = "http://localhost:8080/api";

// ==== INTERFACES ====
export interface ApiAluno {
  apelido: string;
  nivel?: string;
  turma?: string;
  pontuacao?: number;
  modoHistoriaCompleto?: boolean;
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

export const getDetalhesSala = async (codigoUnico: number): Promise<ApiSala & { nomesAlunos: string[] }> => {
  const response = await fetch(`${API_BASE_URL}/salas/${codigoUnico}/detalhes`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  return handleResponse<ApiSala & { nomesAlunos: string[] }>(response);
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

export const getSalaDoProfessor = async (nomeProfessor: string): Promise<ApiSala> => {
  const response = await fetch(`${API_BASE_URL}/professores/${encodeURIComponent(nomeProfessor)}/sala`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  return handleResponse<ApiSala>(response);
};

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
        codigoSala: Number(codigoSala),
        modoHistoriaCompleto,
      }),
    });

    if (!response.ok) {
      const texto = await response.text();
      console.error("❌ Erro ao salvar progresso:", response.status, texto);
      throw new Error(`Erro ao salvar progresso: ${texto}`);
    }

    console.log("✅ Progresso salvo com sucesso!");
  } catch (error) {
    console.error("⚠️ Falha na função salvarProgresso:", error);
    throw new Error("Erro ao salvar progresso");
  }
};

export const obterProgresso = async (
  apelido: string,
  codigoSala: number
): Promise<{ modoHistoriaCompleto: boolean }> => {
  try {
    console.log("📥 Tentando obter progresso via endpoint dedicado...");
    
    // OPÇÃO 1: Endpoint dedicado de progresso (PREFERENCIAL)
    try {
      const response = await fetch(
        `${API_BASE_URL}/alunos/progresso/${encodeURIComponent(apelido)}/${codigoSala}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Progresso obtido (endpoint dedicado):", data);
        return {
          modoHistoriaCompleto: data.modoHistoriaCompleto || false
        };
      }
    } catch (err) {
      console.warn("⚠️ Endpoint de progresso não disponível, tentando alternativa...");
    }

    // OPÇÃO 2: Buscar dados do aluno completo
    console.log("📥 Tentando obter progresso via dados do aluno...");
    try {
      const response = await fetch(
        `${API_BASE_URL}/alunos/${encodeURIComponent(apelido)}?codigoSala=${codigoSala}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const aluno: ApiAluno = await response.json();
        console.log("✅ Dados do aluno obtidos:", aluno);
        return {
          modoHistoriaCompleto: aluno.modoHistoriaCompleto || false
        };
      }
    } catch (err) {
      console.warn("⚠️ Endpoint de aluno não disponível, tentando localStorage...");
    }

    // OPÇÃO 3: Fallback - Verificar localStorage
    console.log("📥 Verificando progresso no localStorage...");
    const progressoLocal = localStorage.getItem(`progresso_${apelido}_${codigoSala}`);
    
    if (progressoLocal) {
      const data = JSON.parse(progressoLocal);
      console.log("✅ Progresso obtido do localStorage:", data);
      return {
        modoHistoriaCompleto: data.modoHistoriaCompleto || false
      };
    }

    // OPÇÃO 4: Primeira vez - retorna false
    console.log("ℹ️ Nenhum progresso encontrado. Primeira vez do aluno.");
    return {
      modoHistoriaCompleto: false
    };

  } catch (error) {
    console.error("❌ Erro ao obter progresso:", error);
    
    // Em caso de erro total, retorna false (bloqueia Quiz por segurança)
    return {
      modoHistoriaCompleto: false
    };
  }
};

//===PERGUNTAS===

export interface PerguntaRequest {
  quantidade: number;
  nivelDificuldade: string; // FACIL, MEDIO, DIFICIL
}

export const getPerguntasPorNivel = async (
  quantidade: number,
  nivelDificuldade: string
): Promise<Pergunta[]> => {
  const body: PerguntaRequest = { 
    quantidade, 
    nivelDificuldade: nivelDificuldade.toUpperCase() 
  };

  const response = await fetch(`${API_BASE_URL}/perguntas/list`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return handleResponse<Pergunta[]>(response);
};

export const importarPerguntasCSV = async (arquivos: File[]): Promise<string> => {
  const formData = new FormData();

  arquivos.forEach((file) => {
    formData.append("arquivos", file); // mesmo nome do @RequestParam no backend
  });

  const response = await fetch(`${API_BASE_URL}/perguntas/import`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Erro ao importar CSV");
  }

  return response.text();
};

// ✅ Nova interface Pergunta compatível com o backend refatorado
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
  getDetalhesSala,

  // Professor
  cadastrarProfessor,
  loginProfessor,
  getSalaDoProfessor,

  // Perguntas
  getPerguntasPorNivel,
  importarPerguntasCSV,
};

// ==== EXPORT DEFAULT ====
export default api;