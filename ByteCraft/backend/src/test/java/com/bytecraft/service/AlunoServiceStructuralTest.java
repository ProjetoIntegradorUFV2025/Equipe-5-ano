package com.bytecraft.service;

import com.bytecraft.enums.NivelDificuldadeEnum;
import com.bytecraft.model.Aluno;
import com.bytecraft.model.Sala;
import com.bytecraft.repository.AlunoRepository;
import com.bytecraft.repository.SalaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Testes Estruturais - Etapa 2 (McCabe, Todos-Nós, Todas-Arestas, Fluxo de Dados)
 * CSU07/CSU08 - AlunoService
 * 
 * Problemas identificados para validar:
 * - STR-002: NullPointerException quando aluno.getNivel() == null
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Testes Estruturais - AlunoService")
class AlunoServiceStructuralTest {

    @Mock
    private AlunoRepository alunoRepository;

    @Mock
    private SalaRepository salaRepository;

    @InjectMocks
    private AlunoService alunoService;

    private Sala sala;
    private Aluno aluno;

    @BeforeEach
    void setUp() {
        sala = new Sala();
        sala.setId(1L);
        sala.setNomeTurma("Turma A");
        sala.setCodigoUnico((byte) 42);

        aluno = new Aluno();
        aluno.setId(1L);
        aluno.setApelido("TestAluno");
        aluno.setSala(sala);
        aluno.setNivel(NivelDificuldadeEnum.MEDIO);
        aluno.setPontuacao(0);
    }

    // ========== CRITÉRIO McCABE - calculaPontuacao ==========
    // V(G) = 4: 4 caminhos independentes
    
    @Test
    @DisplayName("McCabe #1: pontos >= 0 e segundos >= 0 (caminho normal)")
    void calculaPontuacao_CaminhoNormal() {
        // Caminho: entrada válida, sem penalidade/bônus
        int resultado = alunoService.calculaPontuacao(100, 600);
        assertEquals(100, resultado); // Tempo = 600s, fator = 1.0
    }

    @Test
    @DisplayName("McCabe #2: pontos < 0 (proteção contra negativo)")
    void calculaPontuacao_PontosNegativos() {
        // Caminho: pontos < 0 → pontos = 0
        int resultado = alunoService.calculaPontuacao(-50, 300);
        assertEquals(0, resultado); // pontos zerado, sem bônus aplicado
    }

    @Test
    @DisplayName("McCabe #3: segundos < 0 (proteção contra negativo)")
    void calculaPontuacao_SegundosNegativos() {
        // Caminho: segundos < 0 → segundos = 0
        int resultado = alunoService.calculaPontuacao(100, -100);
        assertEquals(200, resultado); // segundos = 0, fator = 2.0 (bônus máximo)
    }

    @Test
    @DisplayName("McCabe #4: T < 600s (bônus de tempo)")
    void calculaPontuacao_ComBonus() {
        // Caminho: tempo rápido, aplica bônus
        int resultado = alunoService.calculaPontuacao(100, 300);
        // fator = max(1.0, 2.0 - 300/600) = max(1.0, 1.5) = 1.5
        assertEquals(150, resultado);
    }

    // ========== CRITÉRIO McCABE - registraPontuacao ==========
    // V(G) = 3: try-catch + validações internas
    
    @Test
    @DisplayName("McCabe #5: registraPontuacao sucesso")
    void registraPontuacao_Sucesso() {
        when(salaRepository.buscarPorCodigo((byte) 42)).thenReturn(Optional.of(sala));
        when(alunoRepository.buscarPorApelidoESala("TestAluno", sala)).thenReturn(Optional.of(aluno));
        when(alunoRepository.atualizaPontuacao(1L, 150)).thenReturn(1);

        boolean resultado = alunoService.registraPontuacao("TestAluno", 300, 100, (byte) 42);

        assertTrue(resultado);
        verify(alunoRepository).atualizaPontuacao(1L, 150);
    }

    @Test
    @DisplayName("McCabe #6: registraPontuacao - aluno não encontrado")
    void registraPontuacao_AlunoNaoEncontrado() {
        when(salaRepository.buscarPorCodigo((byte) 42)).thenReturn(Optional.of(sala));
        when(alunoRepository.buscarPorApelidoESala("TestAluno", sala)).thenReturn(Optional.empty());

        // O método atual captura RuntimeException e retorna false
        boolean resultado = alunoService.registraPontuacao("TestAluno", 300, 100, (byte) 42);
        
        assertFalse(resultado); // Erro capturado no catch
    }

    @Test
    @DisplayName("McCabe #7: registraPontuacao - falha na atualização")
    void registraPontuacao_FalhaAtualizacao() {
        when(salaRepository.buscarPorCodigo((byte) 42)).thenReturn(Optional.of(sala));
        when(alunoRepository.buscarPorApelidoESala("TestAluno", sala)).thenReturn(Optional.of(aluno));
        when(alunoRepository.atualizaPontuacao(anyLong(), anyInt())).thenReturn(0);

        boolean resultado = alunoService.registraPontuacao("TestAluno", 300, 100, (byte) 42);

        assertFalse(resultado); // rowsUpdated == 0
    }

    // ========== CRITÉRIO TODOS-NÓS ==========
    
    @Test
    @DisplayName("Todos-Nós: getAlunosPorSala")
    void todosNos_GetAlunosPorSala() {
        when(alunoRepository.buscarPorSala(1L)).thenReturn(Optional.empty());

        Optional<?> resultado = alunoService.getAlunosPorSala(1L);

        assertTrue(resultado.isEmpty());
        verify(alunoRepository).buscarPorSala(1L);
    }

    // ========== CRITÉRIO TODAS-ARESTAS ==========
    
    @Test
    @DisplayName("Todas-Arestas: calculaPontuacao com T > 1200s (penalidade)")
    void todasArestas_CalculaPontuacaoComPenalidade() {
        // Tempo > 1200s: fator = max(1.0, 2.0 - 1500/600) = max(1.0, -0.5) = 1.0
        int resultado = alunoService.calculaPontuacao(100, 1500);
        assertEquals(100, resultado); // Fator mínimo = 1.0
    }

    @Test
    @DisplayName("Todas-Arestas: registraPontuacao com exceção genérica")
    void todasArestas_RegistraPontuacaoComExcecao() {
        when(salaRepository.buscarPorCodigo((byte) 42)).thenThrow(new RuntimeException("DB error"));

        boolean resultado = alunoService.registraPontuacao("TestAluno", 300, 100, (byte) 42);

        assertFalse(resultado); // Catch captura exceção
    }

    // ========== CRITÉRIO FLUXO DE DADOS (Todas-Definições) ==========
    
    @Test
    @DisplayName("Fluxo-Dados: definição de pontuacaoFinal em calculaPontuacao")
    void fluxoDados_DefinicaoPontuacaoFinal() {
        // def: pontuacaoFinal = pontos * fatorTempo
        // uso: return (int) Math.round(pontuacaoFinal)
        int resultado = alunoService.calculaPontuacao(100, 450);
        // fator = max(1.0, 2.0 - 450/600) = 1.25
        assertEquals(125, resultado);
    }

    @Test
    @DisplayName("Fluxo-Dados: definição de rowsUpdated em registraPontuacao")
    void fluxoDados_DefinicaoRowsUpdated() {
        // def: rowsUpdated = alunoRepository.atualizaPontuacao(...)
        // uso: return rowsUpdated > 0
        when(salaRepository.buscarPorCodigo((byte) 42)).thenReturn(Optional.of(sala));
        when(alunoRepository.buscarPorApelidoESala("TestAluno", sala)).thenReturn(Optional.of(aluno));
        when(alunoRepository.atualizaPontuacao(1L, 100)).thenReturn(1);

        boolean resultado = alunoService.registraPontuacao("TestAluno", 600, 100, (byte) 42);

        assertTrue(resultado); // rowsUpdated = 1 > 0
    }

    // ========== VALIDAÇÃO PROBLEMA STR-002 ==========
    
    @Test
    @DisplayName("STR-002: Validação de aluno sem nível definido")
    void validarProblemaSTR002_AlunoSemNivel() {
        // Cenário: aluno recém-vinculado sem nível
        Aluno alunoSemNivel = new Aluno();
        alunoSemNivel.setId(2L);
        alunoSemNivel.setApelido("NovoAluno");
        alunoSemNivel.setSala(sala);
        alunoSemNivel.setNivel(null); // ← Problema relatado
        alunoSemNivel.setPontuacao(50);

        when(salaRepository.buscarPorCodigo((byte) 42)).thenReturn(Optional.of(sala));
        when(alunoRepository.buscarPorApelidoESala("NovoAluno", sala)).thenReturn(Optional.of(alunoSemNivel));
        when(alunoRepository.atualizaPontuacao(2L, 50)).thenReturn(1);

        // Deve funcionar sem NullPointerException
        boolean resultado = alunoService.registraPontuacao("NovoAluno", 600, 50, (byte) 42);

        assertTrue(resultado);
        // Nota: AlunoDTO.fromEntity irá lançar NPE se nivel == null
        // Este teste valida que o SERVICE funciona, mas o DTO precisa correção
    }

    // ========== TESTES DE VALORES LIMITE ==========
    
    @Test
    @DisplayName("Valor-Limite: tempo exatamente 600s (fronteira de bônus)")
    void valorLimite_Tempo600s() {
        int resultado = alunoService.calculaPontuacao(100, 600);
        assertEquals(100, resultado); // fator = 1.0 (sem bônus/penalidade)
    }

    @Test
    @DisplayName("Valor-Limite: pontos = 0")
    void valorLimite_PontosZero() {
        int resultado = alunoService.calculaPontuacao(0, 300);
        assertEquals(0, resultado);
    }

    @Test
    @DisplayName("Valor-Limite: tempo = 0 (bônus máximo)")
    void valorLimite_TempoZero() {
        int resultado = alunoService.calculaPontuacao(100, 0);
        assertEquals(200, resultado); // fator = 2.0
    }
}
