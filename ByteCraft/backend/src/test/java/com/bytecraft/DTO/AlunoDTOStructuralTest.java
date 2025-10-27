package com.bytecraft.DTO;

import com.bytecraft.enums.NivelDificuldadeEnum;
import com.bytecraft.model.Aluno;
import com.bytecraft.model.Sala;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Testes Estruturais - AlunoDTO
 * CSU07/CSU08
 * 
 * PROBLEMA STR-002: NullPointerException quando aluno.getNivel() == null
 * Este teste valida o problema identificado no relatório sucinto.
 */
@DisplayName("Testes Estruturais - AlunoDTO (Problema STR-002)")
class AlunoDTOStructuralTest {

    @Test
    @DisplayName("STR-002: fromEntity com aluno SEM nível definido (CORRIGIDO)")
    void validarProblemaSTR002_AlunoSemNivel_ThrowsNPE() {
        // Arrange: aluno recém-vinculado sem nível
        Sala sala = new Sala();
        sala.setId(1L);
        sala.setNomeTurma("Turma A");
        sala.setCodigoUnico((byte) 42);

        Aluno aluno = new Aluno();
        aluno.setId(1L);
        aluno.setApelido("NovoAluno");
        aluno.setSala(sala);
        aluno.setNivel(null); // ← Aluno ainda não escolheu nível
        aluno.setPontuacao(50);

        // Act & Assert
        // ANTES DA CORREÇÃO: lançava NullPointerException
        // DEPOIS DA CORREÇÃO: deve retornar DTO com nivel = null
        
        AlunoDTO dto = AlunoDTO.fromEntity(aluno);
        
        // Valida que a correção funcionou
        assertNotNull(dto);
        assertEquals("NovoAluno", dto.apelido());
        assertNull(dto.nivel()); // ✓ Agora aceita null
        assertEquals(50, dto.pontuacao());
        
        System.out.println("✓ CORREÇÃO STR-002 VALIDADA: AlunoDTO aceita nivel == null");
        System.out.println("  → Antes: NullPointerException");
        System.out.println("  → Depois: nivel = null (tratado corretamente)");
    }

    @Test
    @DisplayName("STR-002: fromEntity com aluno COM nível definido (sucesso)")
    void validarProblemaSTR002_AlunoComNivel_Sucesso() {
        // Arrange: aluno com nível definido
        Sala sala = new Sala();
        sala.setId(1L);
        sala.setNomeTurma("Turma A");
        sala.setCodigoUnico((byte) 42);

        Aluno aluno = new Aluno();
        aluno.setId(1L);
        aluno.setApelido("AlunoCompleto");
        aluno.setSala(sala);
        aluno.setNivel(NivelDificuldadeEnum.MEDIO); // ← Nível definido
        aluno.setPontuacao(100);

        // Act
        AlunoDTO dto = AlunoDTO.fromEntity(aluno);

        // Assert
        assertNotNull(dto);
        assertEquals("AlunoCompleto", dto.apelido());
        assertEquals("MEDIO", dto.nivel());
        assertEquals(100, dto.pontuacao());
        assertNotNull(dto.sala());
    }

    @Test
    @DisplayName("STR-002 (Solução Proposta): Tratamento seguro de nível null")
    void solucaoPropostaSTR002_TratamentoSeguro() {
        // Este teste documenta a solução proposta
        Sala sala = new Sala();
        sala.setId(1L);
        sala.setNomeTurma("Turma A");
        sala.setCodigoUnico((byte) 42);

        Aluno aluno = new Aluno();
        aluno.setId(1L);
        aluno.setApelido("NovoAluno");
        aluno.setSala(sala);
        aluno.setNivel(null);
        aluno.setPontuacao(0);

        // Solução proposta: modificar AlunoDTO.fromEntity para:
        // String nivel = aluno.getNivel() != null ? aluno.getNivel().name() : "NAO_DEFINIDO";
        // ou
        // String nivel = aluno.getNivel() != null ? aluno.getNivel().name() : null;

        System.out.println("=== SOLUÇÃO PROPOSTA PARA STR-002 ===");
        System.out.println("Modificar AlunoDTO.fromEntity:");
        System.out.println("  return new AlunoDTO(");
        System.out.println("      aluno.getApelido(),");
        System.out.println("      aluno.getNivel() != null ? aluno.getNivel().name() : null,");
        System.out.println("      aluno.getPontuacao(),");
        System.out.println("      SalaDTO.fromEntity(aluno.getSala())");
        System.out.println("  );");
    }

    @Test
    @DisplayName("Validação: Conversão completa de entidade para DTO")
    void validarConversaoCompletaDTO() {
        // Arrange
        Sala sala = new Sala();
        sala.setId(1L);
        sala.setNomeTurma("Turma Teste");
        sala.setCodigoUnico((byte) 55);

        Aluno aluno = new Aluno();
        aluno.setId(10L);
        aluno.setApelido("AlunoTeste");
        aluno.setSala(sala);
        aluno.setNivel(NivelDificuldadeEnum.DIFICIL);
        aluno.setPontuacao(250);

        // Act
        AlunoDTO dto = AlunoDTO.fromEntity(aluno);

        // Assert - verifica todos os campos
        assertEquals("AlunoTeste", dto.apelido());
        assertEquals("DIFICIL", dto.nivel());
        assertEquals(250, dto.pontuacao());
        assertNotNull(dto.sala());
        assertEquals("Turma Teste", dto.sala().getNomeTurma());
        assertEquals((byte) 55, dto.sala().getCodigoUnico());
    }

    @Test
    @DisplayName("Validação: Todos os níveis de dificuldade")
    void validarTodosNiveisDificuldade() {
        Sala sala = new Sala();
        sala.setId(1L);
        sala.setNomeTurma("Turma A");
        sala.setCodigoUnico((byte) 42);

        // Testa FACIL
        Aluno alunoFacil = new Aluno();
        alunoFacil.setApelido("Facil");
        alunoFacil.setSala(sala);
        alunoFacil.setNivel(NivelDificuldadeEnum.FACIL);
        alunoFacil.setPontuacao(100);
        assertEquals("FACIL", AlunoDTO.fromEntity(alunoFacil).nivel());

        // Testa MEDIO
        Aluno alunoMedio = new Aluno();
        alunoMedio.setApelido("Medio");
        alunoMedio.setSala(sala);
        alunoMedio.setNivel(NivelDificuldadeEnum.MEDIO);
        alunoMedio.setPontuacao(150);
        assertEquals("MEDIO", AlunoDTO.fromEntity(alunoMedio).nivel());

        // Testa DIFICIL
        Aluno alunoDificil = new Aluno();
        alunoDificil.setApelido("Dificil");
        alunoDificil.setSala(sala);
        alunoDificil.setNivel(NivelDificuldadeEnum.DIFICIL);
        alunoDificil.setPontuacao(200);
        assertEquals("DIFICIL", AlunoDTO.fromEntity(alunoDificil).nivel());
    }
}
