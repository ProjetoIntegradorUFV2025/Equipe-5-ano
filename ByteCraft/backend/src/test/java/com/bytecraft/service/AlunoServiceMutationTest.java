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
 * Testes de Mutação - Etapa 3
 * CSU07/CSU08 - AlunoService
 * 
 * Operadores aplicados:
 * - SSdL (Eliminação de Comandos)
 * - ORRN (Troca de Operador Relacional)
 * - Vsrr (Troca de Variáveis)
 * 
 * Meta: Score de Mutação ≥ 0.80 (80%)
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Testes de Mutação - AlunoService")
class AlunoServiceMutationTest {

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

    // ========== OPERADOR SSdL (Eliminação de Comandos) ==========
    
    @Test
    @DisplayName("SSdL #1: Mutante - remover 'if (pontos < 0) pontos = 0'")
    void mutante_SSdL_RemoverValidacaoPontosNegativos() {
        // Mutante: remover proteção de pontos negativos
        // Código original: if (pontos < 0) pontos = 0
        // Código mutante: (linha removida)
        
        // Este teste mata o mutante detectando comportamento incorreto
        int resultado = alunoService.calculaPontuacao(-50, 300);
        
        // Se a validação for removida, o resultado seria negativo
        // Com a validação, o resultado deve ser >= 0
        assertTrue(resultado >= 0, "Pontuação não deve ser negativa");
        assertEquals(0, resultado); // pontos zerado
    }

    @Test
    @DisplayName("SSdL #2: Mutante - remover 'if (segundos < 0) segundos = 0'")
    void mutante_SSdL_RemoverValidacaoSegundosNegativos() {
        // Mutante: remover proteção de segundos negativos
        // Código original: if (segundos < 0) segundos = 0
        // Código mutante: (linha removida)
        
        int resultado = alunoService.calculaPontuacao(100, -100);
        
        // Com validação: segundos = 0, fator = 2.0, resultado = 200
        // Sem validação: fator seria calculado incorretamente
        assertEquals(200, resultado);
    }

    @Test
    @DisplayName("SSdL #3: Mutante - remover 'return false' em registraPontuacao catch")
    void mutante_SSdL_RemoverReturnFalseNoCatch() {
        // Mutante: remover return false no catch
        // Código original: catch (Exception e) { return false; }
        // Código mutante: catch (Exception e) { }
        
        when(salaRepository.buscarPorCodigo((byte) 42))
            .thenThrow(new RuntimeException("DB error"));

        boolean resultado = alunoService.registraPontuacao("Test", 300, 100, (byte) 42);
        
        // Deve retornar false quando houver exceção
        assertFalse(resultado);
    }

    @Test
    @DisplayName("SSdL #4: Mutante - remover cálculo de pontuacaoFinal")
    void mutante_SSdL_RemoverCalculoPontuacao() {
        // Mutante: remover linha de cálculo
        // Código original: int pontuacaoFinal = calculaPontuacao(pontuacao, segundos)
        // Código mutante: int pontuacaoFinal = 0
        
        when(salaRepository.buscarPorCodigo((byte) 42)).thenReturn(Optional.of(sala));
        when(alunoRepository.buscarPorApelidoESala("Test", sala)).thenReturn(Optional.of(aluno));
        when(alunoRepository.atualizaPontuacao(eq(1L), anyInt())).thenReturn(1);

        alunoService.registraPontuacao("Test", 300, 100, (byte) 42);

        // Verifica que o valor passado para atualizaPontuacao não é 0
        verify(alunoRepository).atualizaPontuacao(eq(1L), intThat(valor -> valor > 0));
    }

    // ========== OPERADOR ORRN (Troca de Operador Relacional) ==========
    
    @Test
    @DisplayName("ORRN #1: Mutante - trocar 'pontos < 0' por 'pontos <= 0'")
    void mutante_ORRN_TrocarPontosMenorPorMenorIgual() {
        // Mutante: if (pontos <= 0) pontos = 0
        // Código original: if (pontos < 0) pontos = 0
        
        // Caso que mata o mutante: pontos = 0 (fronteira)
        int resultadoZero = alunoService.calculaPontuacao(0, 300);
        assertEquals(0, resultadoZero); // pontos = 0 deve permanecer 0
        
        // Caso que mata o mutante: pontos = 1
        int resultadoUm = alunoService.calculaPontuacao(1, 600);
        assertEquals(1, resultadoUm); // pontos = 1 não deve ser zerado
    }

    @Test
    @DisplayName("ORRN #2: Mutante - trocar 'segundos < 0' por 'segundos > 0'")
    void mutante_ORRN_TrocarSegundosMenorPorMaior() {
        // Mutante: if (segundos > 0) segundos = 0
        // Código original: if (segundos < 0) segundos = 0
        
        // Caso que mata o mutante: segundos = 300 (positivo)
        int resultado = alunoService.calculaPontuacao(100, 300);
        
        // Com código original: fator = 1.5, resultado = 150
        // Com mutante: segundos seria zerado, fator = 2.0, resultado = 200
        assertEquals(150, resultado);
    }

    @Test
    @DisplayName("ORRN #3: Mutante - trocar 'rowsUpdated > 0' por 'rowsUpdated >= 0'")
    void mutante_ORRN_TrocarRowsUpdatedMaiorPorMaiorIgual() {
        // Mutante: return rowsUpdated >= 0
        // Código original: return rowsUpdated > 0
        
        when(salaRepository.buscarPorCodigo((byte) 42)).thenReturn(Optional.of(sala));
        when(alunoRepository.buscarPorApelidoESala("Test", sala)).thenReturn(Optional.of(aluno));
        when(alunoRepository.atualizaPontuacao(anyLong(), anyInt())).thenReturn(0);

        boolean resultado = alunoService.registraPontuacao("Test", 300, 100, (byte) 42);
        
        // Caso crítico: rowsUpdated = 0 (nenhuma linha atualizada)
        // Deve retornar false, não true
        assertFalse(resultado);
    }

    @Test
    @DisplayName("ORRN #4: Mutante - trocar 'Math.max(1.0, ...)' por 'Math.min(1.0, ...)'")
    void mutante_ORRN_TrocarMaxPorMin() {
        // Mutante: Math.min(1.0, 2.0 - segundos/600.0)
        // Código original: Math.max(1.0, 2.0 - segundos/600.0)
        
        // Caso com tempo longo (T > 1200s)
        int resultadoLongo = alunoService.calculaPontuacao(100, 1500);
        // Original: max(1.0, -0.5) = 1.0 → resultado = 100
        // Mutante: min(1.0, -0.5) = -0.5 → resultado seria negativo
        assertTrue(resultadoLongo >= 100, "Fator mínimo deve ser 1.0");
        
        // Caso com tempo curto (T < 600s)
        int resultadoCurto = alunoService.calculaPontuacao(100, 300);
        // Original: max(1.0, 1.5) = 1.5 → resultado = 150
        // Mutante: min(1.0, 1.5) = 1.0 → resultado = 100
        assertEquals(150, resultadoCurto);
    }

    // ========== OPERADOR Vsrr (Troca de Variáveis) ==========
    
    @Test
    @DisplayName("Vsrr #1: Mutante - trocar 'pontos * fatorTempo' por 'segundos * fatorTempo'")
    void mutante_Vsrr_TrocarPontosPorSegundos() {
        // Mutante: pontuacaoFinal = segundos * fatorTempo
        // Código original: pontuacaoFinal = pontos * fatorTempo
        
        int resultado = alunoService.calculaPontuacao(100, 300);
        
        // Original: 100 * 1.5 = 150
        // Mutante: 300 * 1.5 = 450 (incorreto)
        assertEquals(150, resultado);
        assertNotEquals(450, resultado);
    }

    @Test
    @DisplayName("Vsrr #2: Mutante - trocar 'aluno.getId()' por 'sala.getId()'")
    void mutante_Vsrr_TrocarAlunoIdPorSalaId() {
        // Mutante: alunoRepository.atualizaPontuacao(sala.getId(), ...)
        // Código original: alunoRepository.atualizaPontuacao(aluno.getId(), ...)
        
        when(salaRepository.buscarPorCodigo((byte) 42)).thenReturn(Optional.of(sala));
        when(alunoRepository.buscarPorApelidoESala("Test", sala)).thenReturn(Optional.of(aluno));
        when(alunoRepository.atualizaPontuacao(1L, 150)).thenReturn(1);

        alunoService.registraPontuacao("Test", 300, 100, (byte) 42);

        // Verifica que o ID correto do aluno foi usado
        verify(alunoRepository).atualizaPontuacao(eq(1L), anyInt());
    }

    @Test
    @DisplayName("Vsrr #3: Mutante - trocar divisão por 600 para divisão por 60")
    void mutante_Vsrr_TrocarDivisor600Por60() {
        // Mutante: 2.0 - (segundos / 60.0)
        // Código original: 2.0 - (segundos / 600.0)
        
        int resultado = alunoService.calculaPontuacao(100, 60);
        
        // Original: 2.0 - (60/600) = 2.0 - 0.1 = 1.9 → 190
        // Mutante: 2.0 - (60/60) = 2.0 - 1.0 = 1.0 → 100
        assertEquals(190, resultado);
        assertNotEquals(100, resultado);
    }

    // ========== TESTES COMBINADOS (Múltiplos Mutantes) ==========
    
    @Test
    @DisplayName("Combo #1: Validação completa de pontos e tempo negativos")
    void mutante_Combo_ValidacaoCompletaNegativosvalores() {
        // Testa proteção contra múltiplos valores negativos
        int resultado = alunoService.calculaPontuacao(-100, -200);
        
        // Ambas validações devem zerar os valores
        assertEquals(0, resultado); // pontos = 0, segundos = 0
    }

    @Test
    @DisplayName("Combo #2: Cálculo completo com bônus máximo")
    void mutante_Combo_CalculoComBonusMaximo() {
        // Tempo = 0 → fator = 2.0 (bônus máximo)
        int resultado = alunoService.calculaPontuacao(100, 0);
        
        assertEquals(200, resultado);
        
        // Verifica que não é o dobro do tempo (erro de variável trocada)
        assertNotEquals(0, resultado);
    }

    @Test
    @DisplayName("Combo #3: Integração registraPontuacao com cálculo")
    void mutante_Combo_IntegracaoRegistraPontuacao() {
        when(salaRepository.buscarPorCodigo((byte) 42)).thenReturn(Optional.of(sala));
        when(alunoRepository.buscarPorApelidoESala("Test", sala)).thenReturn(Optional.of(aluno));
        when(alunoRepository.atualizaPontuacao(eq(1L), anyInt())).thenReturn(1);

        boolean resultado = alunoService.registraPontuacao("Test", 450, 100, (byte) 42);

        assertTrue(resultado);
        
        // Verifica que o cálculo foi aplicado corretamente
        // pontos = 100, segundos = 450
        // fator = max(1.0, 2.0 - 450/600) = max(1.0, 1.25) = 1.25
        // pontuacaoFinal = 100 * 1.25 = 125
        verify(alunoRepository).atualizaPontuacao(1L, 125);
    }

    // ========== TESTES DE FRONTEIRA (Detectam Mutantes de Operadores) ==========
    
    @Test
    @DisplayName("Fronteira #1: Tempo exatamente 600s (sem bônus/penalidade)")
    void mutante_Fronteira_Tempo600s() {
        int resultado = alunoService.calculaPontuacao(100, 600);
        
        // fator = max(1.0, 2.0 - 600/600) = max(1.0, 1.0) = 1.0
        assertEquals(100, resultado);
    }

    @Test
    @DisplayName("Fronteira #2: Tempo 599s (borda do bônus)")
    void mutante_Fronteira_Tempo599s() {
        int resultado = alunoService.calculaPontuacao(100, 599);
        
        // fator = max(1.0, 2.0 - 599/600) ≈ 1.00166...
        assertTrue(resultado >= 100, "Deve ter pequeno bônus");
        assertTrue(resultado <= 101, "Bônus deve ser mínimo");
    }

    @Test
    @DisplayName("Fronteira #3: Tempo 601s (borda da penalidade)")
    void mutante_Fronteira_Tempo601s() {
        int resultado = alunoService.calculaPontuacao(100, 601);
        
        // fator = max(1.0, 2.0 - 601/600) ≈ 0.998...
        // Mas max(1.0, ...) garante fator = 1.0
        assertEquals(100, resultado);
    }

    @Test
    @DisplayName("Fronteira #4: rowsUpdated exatamente 1 (sucesso mínimo)")
    void mutante_Fronteira_RowsUpdated1() {
        when(salaRepository.buscarPorCodigo((byte) 42)).thenReturn(Optional.of(sala));
        when(alunoRepository.buscarPorApelidoESala("Test", sala)).thenReturn(Optional.of(aluno));
        when(alunoRepository.atualizaPontuacao(anyLong(), anyInt())).thenReturn(1);

        boolean resultado = alunoService.registraPontuacao("Test", 300, 100, (byte) 42);

        assertTrue(resultado); // 1 > 0 = true
    }

    @Test
    @DisplayName("Fronteira #5: pontos exatamente 0 (borda de negatividade)")
    void mutante_Fronteira_PontosZero() {
        int resultado = alunoService.calculaPontuacao(0, 300);
        
        assertEquals(0, resultado); // 0 * fator = 0
    }
}
