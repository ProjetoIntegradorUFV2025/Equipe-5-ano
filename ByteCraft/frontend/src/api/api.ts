const API_BASE_URL = '/api';

export interface ApiAluno {
  apelido: string;
  nivel?: string;
}

export const loginAluno = async (apelido: string, turma?: string): Promise<ApiAluno> => {
  try {
    const response = await fetch(`${API_BASE_URL}/alunos/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ apelido }), // Backend só recebe apelido
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Erro no login: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Falha na conexão com o servidor');
  }
};

export const getNiveis = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/alunos/niveis`);
    
    if (!response.ok) {
      throw new Error(`Erro ao carregar níveis: ${response.status}`);
    }

    const data = await response.json();
    return data.map((nivel: any) => nivel.toLowerCase()); // Converte para minúsculo
  } catch (error) {
    throw new Error('Falha ao carregar níveis');
  }
};

export const registrarNivel = async (apelido: string, nivel: string): Promise<ApiAluno> => {
  try {
    const response = await fetch(`${API_BASE_URL}/alunos/${apelido}/registrarNivel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nivel: nivel.toUpperCase() }), // Backend espera uppercase
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Erro ao atualizar nível: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error('Falha ao atualizar nível');
  }
};