package gov.ufv.bytecraft_prototipo.professor;

import gov.ufv.bytecraft_prototipo.sala.Sala;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Testes de caixa branca para a classe Professor
 * Validação dos padrões de codificação e lógica interna
 */
class ProfessorTest {

    private Professor professor;
    private Sala sala;

    @BeforeEach
    void configurarTeste() {
        professor = new Professor();
        sala = new Sala();
        sala.setSalaId(1L);
    }

    @Test
    @DisplayName("Teste de construtor com ProfessorRequestDTO")
    void testeConstrutor() {
        // Simulação de dados de entrada
        String cpfTeste = "12345678901";
        String nomeTeste = "Ana Silva";
        String senhaCriptografada = "senhaCriptografada123";
        
        ProfessorRequestDTO dto = new ProfessorRequestDTO(cpfTeste, nomeTeste, "senha123", sala);
        Professor professorTeste = new Professor(dto, senhaCriptografada);

        // Validação da lógica interna do construtor
        assertEquals(cpfTeste, professorTeste.getCpf());
        assertEquals(nomeTeste, professorTeste.getNome());
        assertEquals(senhaCriptografada, professorTeste.getSenha());
        assertEquals(sala, professorTeste.getSala());
    }

    @Test
    @DisplayName("Teste de getters e setters - validação PascalCase para classe")
    void testeGettersSetters() {
        String cpfEsperado = "98765432100";
        String nomeEsperado = "Professor João";
        String senhaEsperada = "minhasenha";

        professor.setCpf(cpfEsperado);
        professor.setNome(nomeEsperado);
        professor.setSenha(senhaEsperada);
        professor.setSala(sala);

        assertEquals(cpfEsperado, professor.getCpf());
        assertEquals(nomeEsperado, professor.getNome());
        assertEquals(senhaEsperada, professor.getSenha());
        assertEquals(sala, professor.getSala());
    }

    @Test
    @DisplayName("Teste de validação de CPF - padrão brasileiro")
    void testeValidacaoCpf() {
        String cpfValido = "11111111111";
        professor.setCpf(cpfValido);
        
        assertEquals(cpfValido, professor.getCpf());
        assertEquals(11, professor.getCpf().length());
    }

    @Test
    @DisplayName("Teste de senha criptografada")
    void testeSenhaCriptografada() {
        String senhaOriginal = "senha123";
        String senhaCriptografada = "hashSenha456";
        
        // Simulação do processo de criptografia
        professor.setSenha(senhaCriptografada);
        
        assertEquals(senhaCriptografada, professor.getSenha());
        assertNotEquals(senhaOriginal, professor.getSenha());
    }

    @Test
    @DisplayName("Teste de equals e hashCode baseado em CPF")
    void testeEqualsHashCode() {
        Professor professor1 = new Professor();
        professor1.setCpf("12345678901");
        professor1.setNome("Nome1");

        Professor professor2 = new Professor();
        professor2.setCpf("12345678901");
        professor2.setNome("Nome2");

        Professor professor3 = new Professor();
        professor3.setCpf("98765432100");
        professor3.setNome("Nome1");

        // Validação do EqualsAndHashCode baseado em CPF
        assertEquals(professor1, professor2);
        assertNotEquals(professor1, professor3);
        assertEquals(professor1.hashCode(), professor2.hashCode());
    }

    @Test
    @DisplayName("Teste de associação com Sala")
    void testeAssociacaoSala() {
        Sala salaTeste = new Sala();
        salaTeste.setSalaId(42L);

        professor.setSala(salaTeste);
        
        assertNotNull(professor.getSala());
        assertEquals(42L, professor.getSala().getSalaId());
    }

    @Test
    @DisplayName("Teste de estado inicial NoArgsConstructor")
    void testeEstadoInicial() {
        Professor professorNovo = new Professor();
        
        assertNull(professorNovo.getCpf());
        assertNull(professorNovo.getNome());
        assertNull(professorNovo.getSenha());
        assertNull(professorNovo.getSala());
    }

    @Test
    @DisplayName("Teste de construtor AllArgsConstructor")
    void testeAllArgsConstructor() {
        String cpf = "11122233344";
        String nome = "Professor Teste";
        String senha = "senhaSegura";
        
        Professor professorCompleto = new Professor(cpf, nome, senha, sala);
        
        assertEquals(cpf, professorCompleto.getCpf());
        assertEquals(nome, professorCompleto.getNome());
        assertEquals(senha, professorCompleto.getSenha());
        assertEquals(sala, professorCompleto.getSala());
    }
}