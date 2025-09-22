package gov.ufv.bytecraft_prototipo.aluno;

import gov.ufv.bytecraft_prototipo.sala.Sala;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Testes de caixa branca para a classe Aluno
 * Validação dos padrões de codificação e estruturas internas
 */
class AlunoTest {

    private Aluno aluno;
    private Sala sala;

    @BeforeEach
    void configurarTeste() {
        sala = new Sala();
        sala.setSalaId(1L);
        aluno = new Aluno();
    }

    @Test
    @DisplayName("Teste de construtor com todos os parâmetros")
    void testeConstrutor() {
        // Teste do construtor alternativo
        Aluno alunoTeste = new Aluno("João Silva", 100, sala);
        
        assertNotNull(alunoTeste);
        assertEquals("João Silva", alunoTeste.getNome());
        assertEquals(100, alunoTeste.getPontuacao());
        assertEquals(sala, alunoTeste.getSala());
        assertNull(alunoTeste.getAlunoId()); // ID não definido no construtor
    }

    @Test
    @DisplayName("Teste de setters e getters - cobertura completa")
    void testeSettersGetters() {
        // Teste completo dos getters e setters
        Long idEsperado = 123L;
        String nomeEsperado = "Maria Santos";
        int pontuacaoEsperada = 85;

        aluno.setAlunoId(idEsperado);
        aluno.setNome(nomeEsperado);
        aluno.setPontuacao(pontuacaoEsperada);
        aluno.setSala(sala);

        assertEquals(idEsperado, aluno.getAlunoId());
        assertEquals(nomeEsperado, aluno.getNome());
        assertEquals(pontuacaoEsperada, aluno.getPontuacao());
        assertEquals(sala, aluno.getSala());
    }

    @Test
    @DisplayName("Teste de validação de nome - padrão camelCase")
    void testeValidacaoNome() {
        // Validação conforme padrão de codificação para variáveis
        String nomeValido = "carlosEduardo"; // Padrão camelCase
        aluno.setNome(nomeValido);
        
        assertEquals(nomeValido, aluno.getNome());
        assertNotNull(aluno.getNome());
    }

    @Test
    @DisplayName("Teste de pontuação - valores limite")
    void testePontuacaoValoresLimite() {
        // Teste de valores extremos para pontuação
        aluno.setPontuacao(0);
        assertEquals(0, aluno.getPontuacao());

        aluno.setPontuacao(Integer.MAX_VALUE);
        assertEquals(Integer.MAX_VALUE, aluno.getPontuacao());

        aluno.setPontuacao(-1);
        assertEquals(-1, aluno.getPontuacao());
    }

    @Test
    @DisplayName("Teste de equals e hashCode baseado em alunoId")
    void testeEqualsHashCode() {
        Aluno aluno1 = new Aluno();
        aluno1.setAlunoId(1L);
        aluno1.setNome("Teste1");

        Aluno aluno2 = new Aluno();
        aluno2.setAlunoId(1L);
        aluno2.setNome("Teste2");

        Aluno aluno3 = new Aluno();
        aluno3.setAlunoId(2L);
        aluno3.setNome("Teste1");

        // Validação do EqualsAndHashCode baseado apenas em alunoId
        assertEquals(aluno1, aluno2); // Mesmo ID, deve ser igual
        assertNotEquals(aluno1, aluno3); // IDs diferentes, deve ser diferente
        assertEquals(aluno1.hashCode(), aluno2.hashCode());
    }

    @Test
    @DisplayName("Teste de associação com Sala")
    void testeAssociacaoSala() {
        Sala novaSala = new Sala();
        novaSala.setSalaId(99L);

        aluno.setSala(novaSala);
        
        assertNotNull(aluno.getSala());
        assertEquals(99L, aluno.getSala().getSalaId());
        
        // Teste de associação nula
        aluno.setSala(null);
        assertNull(aluno.getSala());
    }

    @Test
    @DisplayName("Teste de estado inicial do objeto")
    void testeEstadoInicial() {
        Aluno alunoNovo = new Aluno();
        
        // Verificação do estado inicial seguindo padrão NoArgsConstructor
        assertNull(alunoNovo.getAlunoId());
        assertNull(alunoNovo.getNome());
        assertEquals(0, alunoNovo.getPontuacao()); // int tem valor padrão 0
        assertNull(alunoNovo.getSala());
    }
}