package com.bytecraft.validation;

import com.bytecraft.model.Aluno;
import com.bytecraft.model.Professor;
import com.bytecraft.model.Sala;
import com.bytecraft.enums.NivelDificuldadeEnum;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.HashSet;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Testes de validacao de entrada de dados
 * Verifica se o sistema aceita caracteres especiais, tamanhos invalidos e dados malformados
 * 
 * @author Matheus Junio da Silva
 */
@DisplayName("Testes de Validacao de Entrada")
class ProvaAusenciaValidacaoTest {

    @Test
    @DisplayName("Teste 01: Caracteres especiais no nome do professor")
    void testCaracteresEspeciaisNomeProfessor() {
        Professor professor = new Professor();
        professor.setId(1L);
        professor.setNomeDeUsuario("Prof@#$%^&*()");
        professor.setSenha("senha123");
        
        assertEquals("Prof@#$%^&*()", professor.getNomeDeUsuario());
    }

    @Test
    @DisplayName("Teste 02: Emojis no apelido do aluno")
    void testEmojisApelido() {
        Aluno aluno = new Aluno();
        aluno.setId(1L);
        aluno.setApelido("João😀🎓🔒");
        aluno.setNivel(NivelDificuldadeEnum.FACIL);
        
        assertTrue(aluno.getApelido().contains("😀"));
    }

    @Test
    @DisplayName("Teste 03: HTML e scripts no nome da turma")
    void testHTMLXSSNomeTurma() {
        Sala sala = new Sala();
        sala.setId(1L);
        sala.setNomeTurma("<script>alert('XSS')</script>");
        sala.setCodigoUnico((byte) 1);
        sala.setAlunos(new HashSet<>());
        
        assertTrue(sala.getNomeTurma().contains("<script>"));
    }

    @Test
    @DisplayName("Teste 04: SQL injection no nome")
    void testSQLInjection() {
        Professor professor = new Professor();
        professor.setId(1L);
        professor.setNomeDeUsuario("'; DROP TABLE professores; --");
        professor.setSenha("senha123");
        
        assertEquals("'; DROP TABLE professores; --", professor.getNomeDeUsuario());
    }

    @Test
    @DisplayName("Teste 05: Nome com um caractere")
    void testNomeMuitoCurto() {
        Professor professor = new Professor();
        professor.setId(1L);
        professor.setNomeDeUsuario("A");
        professor.setSenha("senha123");
        
        assertEquals(1, professor.getNomeDeUsuario().length());
    }

    @Test
    @DisplayName("Teste 06: Nome com 500 caracteres")
    void testNomeGigante() {
        String nomeLongo = "A".repeat(500);
        Professor professor = new Professor();
        professor.setId(1L);
        professor.setNomeDeUsuario(nomeLongo);
        professor.setSenha("senha123");
        
        assertEquals(500, professor.getNomeDeUsuario().length());
    }

    @Test
    @DisplayName("Teste 07: String de 10000 caracteres")
    void testDoSStringGigante() {
        String stringGigante = "Z".repeat(10000);
        Professor professor = new Professor();
        professor.setId(1L);
        professor.setNomeDeUsuario(stringGigante);
        professor.setSenha("senha123");
        
        assertEquals(10000, professor.getNomeDeUsuario().length());
    }

    @Test
    @DisplayName("Teste 08: Apelido com 100 caracteres")
    void testApelidoMuitoLongo() {
        String apelidoLongo = "SuperMegaUltraHiperAlunoComNomeExtremamenteLongo" +
                              "QueNuncaDeveSerAceitoNoSistema";
        Aluno aluno = new Aluno();
        aluno.setId(1L);
        aluno.setApelido(apelidoLongo);
        aluno.setNivel(NivelDificuldadeEnum.MEDIO);
        
        assertTrue(aluno.getApelido().length() > 50);
    }

    @Test
    @DisplayName("Teste 09: Nome vazio")
    void testNomeVazio() {
        Professor professor = new Professor();
        professor.setId(1L);
        professor.setNomeDeUsuario("");
        professor.setSenha("senha123");
        
        assertEquals("", professor.getNomeDeUsuario());
    }

    @Test
    @DisplayName("Teste 10: Senha com apenas espacos")
    void testSenhaApenasEspacos() {
        Professor professor = new Professor();
        professor.setId(1L);
        professor.setNomeDeUsuario("Professor");
        professor.setSenha("      ");
        
        assertEquals("      ", professor.getSenha());
    }

    @Test
    @DisplayName("Teste 11: Apelido com espacos no inicio e fim")
    void testApelidoComEspacos() {
        Aluno aluno = new Aluno();
        aluno.setId(1L);
        aluno.setApelido("   João   ");
        aluno.setNivel(NivelDificuldadeEnum.DIFICIL);
        
        assertEquals("   João   ", aluno.getApelido());
    }

    @Test
    @DisplayName("Teste 12: Quebra de linha no nome")
    void testQuebraDeLinha() {
        Professor professor = new Professor();
        professor.setId(1L);
        professor.setNomeDeUsuario("Prof\nTeste");
        professor.setSenha("senha123");
        
        assertTrue(professor.getNomeDeUsuario().contains("\n"));
    }

    @Test
    @DisplayName("Teste 13: Tabulacao no nome")
    void testTabulacao() {
        Professor professor = new Professor();
        professor.setId(1L);
        professor.setNomeDeUsuario("Prof\tTeste");
        professor.setSenha("senha123");
        
        assertTrue(professor.getNomeDeUsuario().contains("\t"));
    }

    @Test
    @DisplayName("Teste 14: Null byte no nome")
    void testNullByte() {
        Professor professor = new Professor();
        professor.setId(1L);
        professor.setNomeDeUsuario("Prof\u0000Teste");
        professor.setSenha("senha123");
        
        assertTrue(professor.getNomeDeUsuario().contains("\u0000"));
    }

    @Test
    @DisplayName("Teste 15: Unicode malicioso no nome")
    void testUnicodeMalicioso() {
        Professor professor = new Professor();
        professor.setId(1L);
        professor.setNomeDeUsuario("Prof\u202eTeste");
        professor.setSenha("senha123");
        
        assertTrue(professor.getNomeDeUsuario().contains("\u202e"));
    }

    @Test
    @DisplayName("Teste 16: Nivel nulo no aluno")
    void testNivelNull() {
        Aluno aluno = new Aluno();
        aluno.setId(1L);
        aluno.setApelido("Maria");
        aluno.setNivel(null);
        
        assertNull(aluno.getNivel());
    }

    @Test
    @DisplayName("Teste 17: Codigo unico nulo")
    void testCodigoNull() {
        Sala sala = new Sala();
        sala.setId(1L);
        sala.setNomeTurma("Turma A");
        sala.setCodigoUnico(null);
        sala.setAlunos(new HashSet<>());
        
        assertNull(sala.getCodigoUnico());
    }

    @Test
    @DisplayName("Teste 18: Todos os campos vazios")
    void testTodosCamposInvalidos() {
        Professor professor = new Professor();
        professor.setNomeDeUsuario("");
        professor.setSenha("");
        professor.setSala(null);
        
        assertAll(
            () -> assertEquals("", professor.getNomeDeUsuario()),
            () -> assertEquals("", professor.getSenha()),
            () -> assertNull(professor.getSala())
        );
    }

    @Test
    @DisplayName("Teste 19: Pontuacao SQL perigosa")
    void testPontuacaoPerigosa() {
        Professor professor = new Professor();
        professor.setId(1L);
        professor.setNomeDeUsuario("Prof';--");
        professor.setSenha("senha123");
        
        assertTrue(professor.getNomeDeUsuario().contains("';--"));
    }

    @Test
    @DisplayName("Teste 20: URL encoding no nome")
    void testURLEncoding() {
        Professor professor = new Professor();
        professor.setId(1L);
        professor.setNomeDeUsuario("Prof%20%3Cscript%3E");
        professor.setSenha("senha123");
        
        assertTrue(professor.getNomeDeUsuario().contains("%"));
    }
}
