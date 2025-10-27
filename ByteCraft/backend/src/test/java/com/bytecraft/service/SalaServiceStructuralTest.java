package com.bytecraft.service;

import com.bytecraft.enums.NivelDificuldadeEnum;
import com.bytecraft.model.Aluno;
import com.bytecraft.model.Sala;
import com.bytecraft.repository.SalaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Testes Estruturais - Etapa 2 (McCabe, Todos-Nós, Todas-Arestas, Fluxo de Dados)
 * CSU07/CSU08 - SalaService
 * 
 * Problemas identificados para validar:
 * - STR-001: IllegalArgumentException quando getSalaID retorna null
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Testes Estruturais - SalaService")
class SalaServiceStructuralTest {

    @Mock
    private SalaRepository salaRepository;

    @Mock
    private AlunoService alunoService;

    @InjectMocks
    private SalaService salaService;

    private Sala sala;
    private List<Aluno> alunos;

    @BeforeEach
    void setUp() {
        sala = new Sala();
        sala.setId(1L);
        sala.setNomeTurma("Turma A");
        sala.setCodigoUnico((byte) 42);

        alunos = new ArrayList<>();
        
        Aluno aluno1 = new Aluno();
        aluno1.setId(1L);
        aluno1.setApelido("Aluno1");
        aluno1.setSala(sala);
        aluno1.setNivel(NivelDificuldadeEnum.FACIL);
        aluno1.setPontuacao(150);
        alunos.add(aluno1);

        Aluno aluno2 = new Aluno();
        aluno2.setId(2L);
        aluno2.setApelido("Aluno2");
        aluno2.setSala(sala);
        aluno2.setNivel(NivelDificuldadeEnum.MEDIO);
        aluno2.setPontuacao(200);
        alunos.add(aluno2);

        Aluno aluno3 = new Aluno();
        aluno3.setId(3L);
        aluno3.setApelido("Aluno3");
        aluno3.setSala(sala);
        aluno3.setNivel(NivelDificuldadeEnum.DIFICIL);
        aluno3.setPontuacao(100);
        alunos.add(aluno3);
    }

    // ========== CRITÉRIO McCABE - getRankingTurma ==========
    // V(G) = 3: verificação Optional.isEmpty + ordenação
    
    @Test
    @DisplayName("McCabe #1: getRankingTurma - ranking com alunos (caminho sucesso)")
    void getRankingTurma_ComAlunos() {
        when(salaRepository.buscarSalaID((byte) 42)).thenReturn(1L);
        when(alunoService.getAlunosPorSala(1L)).thenReturn(Optional.of(new ArrayList<>(alunos)));

        Optional<List<Aluno>> resultado = salaService.getRankingTurma((byte) 42);

        assertTrue(resultado.isPresent());
        List<Aluno> ranking = resultado.get();
        assertEquals(3, ranking.size());
        // Verifica ordenação (maior pontuação primeiro)
        assertEquals(200, ranking.get(0).getPontuacao());
        assertEquals(150, ranking.get(1).getPontuacao());
        assertEquals(100, ranking.get(2).getPontuacao());
    }

    @Test
    @DisplayName("McCabe #2: getRankingTurma - sem alunos (Optional.empty)")
    void getRankingTurma_SemAlunos() {
        when(salaRepository.buscarSalaID((byte) 42)).thenReturn(1L);
        when(alunoService.getAlunosPorSala(1L)).thenReturn(Optional.empty());

        Optional<List<Aluno>> resultado = salaService.getRankingTurma((byte) 42);

        assertTrue(resultado.isEmpty());
        verify(alunoService).getAlunosPorSala(1L);
    }

    @Test
    @DisplayName("McCabe #3: getRankingTurma - lista vazia (caminho de ordenação)")
    void getRankingTurma_ListaVazia() {
        // DEF001: Este teste expõe o problema de ordenar lista vazia
        when(salaRepository.buscarSalaID((byte) 42)).thenReturn(1L);
        when(alunoService.getAlunosPorSala(1L)).thenReturn(Optional.of(new ArrayList<>()));

        Optional<List<Aluno>> resultado = salaService.getRankingTurma((byte) 42);

        assertTrue(resultado.isPresent());
        assertEquals(0, resultado.get().size());
        // Nota: ordenação de lista vazia é desnecessária mas não causa erro
    }

    // ========== CRITÉRIO TODOS-NÓS ==========
    
    @Test
    @DisplayName("Todos-Nós: criaSala - sala já existe")
    void todosNos_CriaSala_JaExiste() {
        when(salaRepository.buscarSala("Turma A")).thenReturn(Optional.of(sala));

        Sala resultado = salaService.criaSala("Turma A");

        assertEquals(sala, resultado);
        verify(salaRepository, never()).save(any());
    }

    @Test
    @DisplayName("Todos-Nós: criaSala - cria nova sala")
    void todosNos_CriaSala_NovaSala() {
        when(salaRepository.buscarSala("Turma Nova")).thenReturn(Optional.empty());
        when(salaRepository.buscarPorCodigo(any())).thenReturn(Optional.empty());
        when(salaRepository.save(any(Sala.class))).thenAnswer(inv -> inv.getArgument(0));

        Sala resultado = salaService.criaSala("Turma Nova");

        assertNotNull(resultado);
        assertEquals("Turma Nova", resultado.getNomeTurma());
        assertNotNull(resultado.getCodigoUnico());
        verify(salaRepository).save(any(Sala.class));
    }

    @Test
    @DisplayName("Todos-Nós: getSalaByCodigo")
    void todosNos_GetSalaByCodigo() {
        when(salaRepository.buscarPorCodigo((byte) 42)).thenReturn(Optional.of(sala));

        Optional<Sala> resultado = salaService.getSalaByCodigo((byte) 42);

        assertTrue(resultado.isPresent());
        assertEquals((byte) 42, resultado.get().getCodigoUnico());
    }

    @Test
    @DisplayName("Todos-Nós: getTodasSalas")
    void todosNos_GetTodasSalas() {
        List<Sala> salas = List.of(sala);
        when(salaRepository.findAll()).thenReturn(salas);

        List<Sala> resultado = salaService.getTodasSalas();

        assertEquals(1, resultado.size());
        verify(salaRepository).findAll();
    }

    // ========== CRITÉRIO TODAS-ARESTAS ==========
    
    @Test
    @DisplayName("Todas-Arestas: getRankingTurma - aresta isEmpty → true")
    void todasArestas_GetRankingTurma_IsEmptyTrue() {
        when(salaRepository.buscarSalaID((byte) 99)).thenReturn(99L);
        when(alunoService.getAlunosPorSala(99L)).thenReturn(Optional.empty());

        Optional<List<Aluno>> resultado = salaService.getRankingTurma((byte) 99);

        assertTrue(resultado.isEmpty());
        // Aresta: isEmpty() == true → return Optional.empty()
    }

    @Test
    @DisplayName("Todas-Arestas: getRankingTurma - aresta isEmpty → false")
    void todasArestas_GetRankingTurma_IsEmptyFalse() {
        when(salaRepository.buscarSalaID((byte) 42)).thenReturn(1L);
        when(alunoService.getAlunosPorSala(1L)).thenReturn(Optional.of(alunos));

        Optional<List<Aluno>> resultado = salaService.getRankingTurma((byte) 42);

        assertTrue(resultado.isPresent());
        // Aresta: isEmpty() == false → continua para ordenação
    }

    // ========== CRITÉRIO FLUXO DE DADOS (Todas-Definições) ==========
    
    @Test
    @DisplayName("Fluxo-Dados: definição de idSala em getRankingTurma")
    void fluxoDados_DefinicaoIdSala() {
        // def: idSala = getSalaID(codigoUnico)
        // uso: alunoService.getAlunosPorSala(idSala)
        when(salaRepository.buscarSalaID((byte) 42)).thenReturn(1L);
        when(alunoService.getAlunosPorSala(1L)).thenReturn(Optional.of(alunos));

        salaService.getRankingTurma((byte) 42);

        verify(salaRepository).buscarSalaID((byte) 42);
        verify(alunoService).getAlunosPorSala(1L);
    }

    @Test
    @DisplayName("Fluxo-Dados: definição de alunos em getRankingTurma")
    void fluxoDados_DefinicaoAlunos() {
        // def: alunos = alunosOpt.get()
        // uso: alunos.sort(...)
        when(salaRepository.buscarSalaID((byte) 42)).thenReturn(1L);
        when(alunoService.getAlunosPorSala(1L)).thenReturn(Optional.of(alunos));

        Optional<List<Aluno>> resultado = salaService.getRankingTurma((byte) 42);

        assertTrue(resultado.isPresent());
        // Verifica que a lista foi ordenada (maior → menor)
        assertEquals(200, resultado.get().get(0).getPontuacao());
    }

    // ========== VALIDAÇÃO PROBLEMA STR-001 ==========
    
    @Test
    @DisplayName("STR-001: Validação de sala inexistente (CORRIGIDO)")
    void validarProblemaSTR001_SalaInexistente() {
        // Cenário: código de sala não existe no banco
        when(salaRepository.buscarSalaID((byte) 99)).thenReturn(null);
        
        // ANTES DA CORREÇÃO: passava null para getAlunosPorSala
        // DEPOIS DA CORREÇÃO: retorna Optional.empty() antes
        Optional<List<Aluno>> resultado = salaService.getRankingTurma((byte) 99);
        
        assertTrue(resultado.isEmpty());
        
        // Verifica que getAlunosPorSala NÃO foi chamado (correção funcionou)
        verify(alunoService, never()).getAlunosPorSala(any());
        
        System.out.println("✓ CORREÇÃO STR-001 VALIDADA: Sala inexistente retorna empty antes de chamar repository");
    }

    @Test
    @DisplayName("STR-001 (Alternativo): Código de sala inválido retorna empty")
    void validarProblemaSTR001_DeveRetornarEmpty() {
        // Comportamento esperado: retornar Optional.empty() para sala inexistente
        when(salaRepository.buscarSalaID((byte) 99)).thenReturn(null);

        Optional<List<Aluno>> resultado = salaService.getRankingTurma((byte) 99);

        assertTrue(resultado.isEmpty());
        
        // Documenta que a validação foi adicionada
        System.out.println("✓ STR-001: Validação explícita de idSala == null implementada");
    }

    // ========== TESTE DE ORDENAÇÃO CORRETA ==========
    
    @Test
    @DisplayName("Validação: ranking ordenado corretamente (maior → menor)")
    void validarOrdenacaoRanking() {
        // Adiciona aluno com pontuação intermediária
        Aluno aluno4 = new Aluno();
        aluno4.setId(4L);
        aluno4.setApelido("Aluno4");
        aluno4.setSala(sala);
        aluno4.setNivel(NivelDificuldadeEnum.MEDIO);
        aluno4.setPontuacao(175);
        alunos.add(aluno4);

        when(salaRepository.buscarSalaID((byte) 42)).thenReturn(1L);
        when(alunoService.getAlunosPorSala(1L)).thenReturn(Optional.of(new ArrayList<>(alunos)));

        Optional<List<Aluno>> resultado = salaService.getRankingTurma((byte) 42);

        assertTrue(resultado.isPresent());
        List<Aluno> ranking = resultado.get();
        assertEquals(4, ranking.size());
        
        // Verifica ordenação completa
        assertEquals(200, ranking.get(0).getPontuacao()); // Aluno2
        assertEquals(175, ranking.get(1).getPontuacao()); // Aluno4
        assertEquals(150, ranking.get(2).getPontuacao()); // Aluno1
        assertEquals(100, ranking.get(3).getPontuacao()); // Aluno3
    }

    // ========== TESTE DE VALORES LIMITE ==========
    
    @Test
    @DisplayName("Valor-Limite: código de sala no limite inferior (10)")
    void valorLimite_CodigoSalaMinimo() {
        when(salaRepository.buscarSalaID((byte) 10)).thenReturn(10L);
        when(alunoService.getAlunosPorSala(10L)).thenReturn(Optional.of(alunos));

        Optional<List<Aluno>> resultado = salaService.getRankingTurma((byte) 10);

        assertTrue(resultado.isPresent());
    }

    @Test
    @DisplayName("Valor-Limite: código de sala no limite superior (99)")
    void valorLimite_CodigoSalaMaximo() {
        when(salaRepository.buscarSalaID((byte) 99)).thenReturn(99L);
        when(alunoService.getAlunosPorSala(99L)).thenReturn(Optional.of(alunos));

        Optional<List<Aluno>> resultado = salaService.getRankingTurma((byte) 99);

        assertTrue(resultado.isPresent());
    }

    @Test
    @DisplayName("Valor-Limite: um único aluno no ranking")
    void valorLimite_UmAlunoNoRanking() {
        List<Aluno> umAluno = new ArrayList<>();
        umAluno.add(alunos.get(0));
        
        when(salaRepository.buscarSalaID((byte) 42)).thenReturn(1L);
        when(alunoService.getAlunosPorSala(1L)).thenReturn(Optional.of(umAluno));

        Optional<List<Aluno>> resultado = salaService.getRankingTurma((byte) 42);

        assertTrue(resultado.isPresent());
        assertEquals(1, resultado.get().size());
    }
}
