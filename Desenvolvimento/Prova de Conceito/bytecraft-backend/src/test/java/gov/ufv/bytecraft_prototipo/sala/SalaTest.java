package gov.ufv.bytecraft_prototipo.sala;

import gov.ufv.bytecraft_prototipo.professor.Professor;
import gov.ufv.bytecraft_prototipo.aluno.Aluno;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;
import java.util.List;

/**
 * Testes de caixa branca para a classe Sala
 * Validação da estrutura interna e relacionamentos
 */
class SalaTest {

    private Sala sala;
    private Professor professor;

    @BeforeEach
    void configurarTeste() {
        sala = new Sala();
        professor = new Professor();
        professor.setCpf("12345678901");
        professor.setNome("Professor Teste");
    }

    @Test
    @DisplayName("Teste de construtor com Professor")
    void testeConstrutor() {
        Sala salaTeste = new Sala(professor);
        
        assertEquals(professor, salaTeste.getProfessor());
        assertNotNull(salaTeste.getAlunos());
        assertTrue(salaTeste.getAlunos().isEmpty());
    }

    @Test
    @DisplayName("Teste de inicialização da lista de alunos")
    void testeInicializacaoListaAlunos() {
        // Validação da inicialização automática da lista
        assertNotNull(sala.getAlunos());
        assertTrue(sala.getAlunos().isEmpty());
        assertEquals(0, sala.getAlunos().size());
    }

    @Test
    @DisplayName("Teste de getters e setters")
    void testeGettersSetters() {
        Long salaIdEsperado = 100L;
        
        sala.setSalaId(salaIdEsperado);
        sala.setProfessor(professor);
        
        assertEquals(salaIdEsperado, sala.getSalaId());
        assertEquals(professor, sala.getProfessor());
    }

    @Test
    @DisplayName("Teste de adição de alunos na lista")
    void testeAdicaoAlunos() {
        Aluno aluno1 = new Aluno();
        aluno1.setNome("Aluno 1");
        aluno1.setAlunoId(1L);
        
        Aluno aluno2 = new Aluno();
        aluno2.setNome("Aluno 2");
        aluno2.setAlunoId(2L);
        
        // Teste da funcionalidade interna da lista
        sala.getAlunos().add(aluno1);
        sala.getAlunos().add(aluno2);
        
        assertEquals(2, sala.getAlunos().size());
        assertTrue(sala.getAlunos().contains(aluno1));
        assertTrue(sala.getAlunos().contains(aluno2));
    }

    @Test
    @DisplayName("Teste de equals e hashCode baseado em salaId")
    void testeEqualsHashCode() {
        Sala sala1 = new Sala();
        sala1.setSalaId(1L);
        
        Sala sala2 = new Sala();
        sala2.setSalaId(1L);
        
        Sala sala3 = new Sala();
        sala3.setSalaId(2L);
        
        // Validação do EqualsAndHashCode baseado em salaId
        assertEquals(sala1, sala2);
        assertNotEquals(sala1, sala3);
        assertEquals(sala1.hashCode(), sala2.hashCode());
    }

    @Test
    @DisplayName("Teste de estado inicial NoArgsConstructor")
    void testeEstadoInicial() {
        Sala salaNova = new Sala();
        
        assertNull(salaNova.getSalaId());
        assertNull(salaNova.getProfessor());
        assertNotNull(salaNova.getAlunos()); // Lista inicializada automaticamente
        assertTrue(salaNova.getAlunos().isEmpty());
    }

    @Test
    @DisplayName("Teste de construtor AllArgsConstructor")
    void testeAllArgsConstructor() {
        Long salaId = 50L;
        List<Aluno> listaAlunos = List.of(new Aluno(), new Aluno());
        
        Sala salaCompleta = new Sala(salaId, professor, listaAlunos);
        
        assertEquals(salaId, salaCompleta.getSalaId());
        assertEquals(professor, salaCompleta.getProfessor());
        assertEquals(listaAlunos, salaCompleta.getAlunos());
        assertEquals(2, salaCompleta.getAlunos().size());
    }

    @Test
    @DisplayName("Teste de relacionamento bidirecional Professor-Sala")
    void testeRelacionamentoProfessorSala() {
        professor.setSala(sala);
        sala.setProfessor(professor);
        
        assertEquals(sala, professor.getSala());
        assertEquals(professor, sala.getProfessor());
        
        // Validação da consistência do relacionamento
        assertSame(sala.getProfessor().getSala(), sala);
    }

    @Test
    @DisplayName("Teste de manipulação da lista de alunos")
    void testeManipulacaoListaAlunos() {
        Aluno aluno = new Aluno();
        aluno.setNome("Teste Aluno");
        
        // Teste de adição
        sala.getAlunos().add(aluno);
        assertEquals(1, sala.getAlunos().size());
        
        // Teste de remoção
        sala.getAlunos().remove(aluno);
        assertEquals(0, sala.getAlunos().size());
        
        // Teste de limpeza
        sala.getAlunos().add(aluno);
        sala.getAlunos().clear();
        assertTrue(sala.getAlunos().isEmpty());
    }
}