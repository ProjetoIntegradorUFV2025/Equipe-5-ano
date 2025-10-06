package com.bytecraft.validation;

import com.bytecraft.service.ProfessorService;
import com.bytecraft.service.AlunoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Testes de validacao de entrada nos Controllers HTTP
 * 
 * @author Matheus Junio da Silva
 */
@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
@DisplayName("Testes de Validacao - Controllers HTTP")
class ValidacaoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProfessorService professorService;

    @MockBean
    private AlunoService alunoService;

    @Test
    @DisplayName("Teste 01: Cadastro de professor com caracteres especiais no nome")
    void testCadastroProfessorComCaracteresEspeciais() throws Exception {
        Map<String, String> payload = new HashMap<>();
        payload.put("nome", "Prof@#$%^&*()");
        payload.put("senha", "senha123");
        payload.put("nomeTurma", "Turma 5A");

        mockMvc.perform(post("/api/professores/cadastrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload))
                .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("Nome so pode conter letras, numeros, _ e -"));
    }

    @Test
    @DisplayName("Teste 02: Cadastro com HTML/XSS no nome da turma")
    void testCadastroComXSSNoNomeTurma() throws Exception {
        Map<String, String> payload = new HashMap<>();
        payload.put("nome", "Professor");
        payload.put("senha", "senha123");
        payload.put("nomeTurma", "<script>alert('XSS')</script>");

        mockMvc.perform(post("/api/professores/cadastrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload))
                .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").exists());
    }

    @Test
    @DisplayName("Teste 03: Vincular aluno com emojis no apelido")
    void testVincularAlunoComEmojis() throws Exception {
        Map<String, String> payload = new HashMap<>();
        payload.put("apelido", "João😀🎓");
        payload.put("codigoSala", "123456");
        payload.put("nivel", "FACIL");

        mockMvc.perform(post("/api/alunos/vincular")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload))
                .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("Apelido so pode conter letras, numeros e espacos"));
    }

    @Test
    @DisplayName("Teste 04: Codigo de sala com letras")
    void testVincularComCodigoInvalido() throws Exception {
        Map<String, String> payload = new HashMap<>();
        payload.put("apelido", "Maria");
        payload.put("codigoSala", "ABC123");
        payload.put("nivel", "MEDIO");

        mockMvc.perform(post("/api/alunos/vincular")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload))
                .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("Codigo deve ter exatamente 6 digitos"));
    }

    @Test
    @DisplayName("Teste 05: Nome de professor com 1 caractere")
    void testCadastroNomeMuitoCurto() throws Exception {
        Map<String, String> payload = new HashMap<>();
        payload.put("nome", "A");
        payload.put("senha", "senha123");
        payload.put("nomeTurma", "Turma 5A");

        mockMvc.perform(post("/api/professores/cadastrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload))
                .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("Nome deve ter entre 3 e 50 caracteres"));
    }

    @Test
    @DisplayName("Teste 06: Nome com 500 caracteres")
    void testCadastroNomeGigante() throws Exception {
        String nomeGigante = "A".repeat(500);
        Map<String, String> payload = new HashMap<>();
        payload.put("nome", nomeGigante);
        payload.put("senha", "senha123");
        payload.put("nomeTurma", "Turma");

        mockMvc.perform(post("/api/professores/cadastrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload))
                .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("Nome deve ter entre 3 e 50 caracteres"));
    }

    @Test
    @DisplayName("Teste 07: Apelido com 100 caracteres")
    void testVincularApelidoMuitoLongo() throws Exception {
        String apelidoLongo = "SuperMegaUltraHiperAlunoComNomeExtremamenteLongoQueNuncaDeveria" +
                              "SerAceitoNoSistemaDeGerenciamento";
        Map<String, String> payload = new HashMap<>();
        payload.put("apelido", apelidoLongo);
        payload.put("codigoSala", "123456");
        payload.put("nivel", "FACIL");

        mockMvc.perform(post("/api/alunos/vincular")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload))
                .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("Apelido deve ter entre 2 e 30 caracteres"));
    }

    @Test
    @DisplayName("Teste 08: String de 10000 caracteres")
    void testCadastroStringGiganteDoS() throws Exception {
        String stringGigante = "Z".repeat(10000);
        Map<String, String> payload = new HashMap<>();
        payload.put("nome", stringGigante);
        payload.put("senha", stringGigante);
        payload.put("nomeTurma", stringGigante);

        mockMvc.perform(post("/api/professores/cadastrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload))
                .with(csrf()))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Teste 09: Nome vazio")
    void testCadastroNomeVazio() throws Exception {
        Map<String, String> payload = new HashMap<>();
        payload.put("nome", "");
        payload.put("senha", "senha123");
        payload.put("nomeTurma", "Turma 5A");

        mockMvc.perform(post("/api/professores/cadastrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload))
                .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("Nome e obrigatorio"));
    }

    @Test
    @DisplayName("Teste 10: Campo null")
    void testCadastroSemNome() throws Exception {
        Map<String, String> payload = new HashMap<>();
        payload.put("senha", "senha123");
        payload.put("nomeTurma", "Turma 5A");

        mockMvc.perform(post("/api/professores/cadastrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload))
                .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("Nome e obrigatorio"));
    }

    @Test
    @DisplayName("Teste 11: Senha com apenas espacos")
    void testCadastroSenhaApenasEspacos() throws Exception {
        Map<String, String> payload = new HashMap<>();
        payload.put("nome", "Professor");
        payload.put("senha", "      ");
        payload.put("nomeTurma", "Turma");

        mockMvc.perform(post("/api/professores/cadastrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload))
                .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("Senha nao pode conter apenas espacos"));
    }

    @Test
    @DisplayName("Teste 12: Todos os campos vazios")
    void testCadastroTodosCamposVazios() throws Exception {
        Map<String, String> payload = new HashMap<>();
        payload.put("nome", "");
        payload.put("senha", "");
        payload.put("nomeTurma", "");

        mockMvc.perform(post("/api/professores/cadastrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload))
                .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").exists());
    }

    @Test
    @DisplayName("Teste 13: Nome com quebras de linha")
    void testCadastroNomeComQuebraDeLinha() throws Exception {
        Map<String, String> payload = new HashMap<>();
        payload.put("nome", "Prof\nTeste");
        payload.put("senha", "senha123");
        payload.put("nomeTurma", "Turma");

        mockMvc.perform(post("/api/professores/cadastrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload))
                .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("Nome nao pode conter caracteres de controle"));
    }

    @Test
    @DisplayName("Teste 14: Nome com tabulacao")
    void testCadastroNomeComTabulacao() throws Exception {
        Map<String, String> payload = new HashMap<>();
        payload.put("nome", "Prof\tTeste");
        payload.put("senha", "senha123");
        payload.put("nomeTurma", "Turma");

        mockMvc.perform(post("/api/professores/cadastrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload))
                .with(csrf()))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Teste 15: Nome com caractere unicode malicioso")
    void testCadastroNomeComUnicodeMalicioso() throws Exception {
        Map<String, String> payload = new HashMap<>();
        payload.put("nome", "Prof\u202eTeste");
        payload.put("senha", "senha123");
        payload.put("nomeTurma", "Turma");

        mockMvc.perform(post("/api/professores/cadastrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload))
                .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("Nome contem caracteres invalidos"));
    }

    @Test
    @DisplayName("Teste 16: Nome com SQL injection simulado")
    void testCadastroComSQLInjection() throws Exception {
        Map<String, String> payload = new HashMap<>();
        payload.put("nome", "'; DROP TABLE professores; --");
        payload.put("senha", "senha123");
        payload.put("nomeTurma", "Turma");

        mockMvc.perform(post("/api/professores/cadastrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload))
                .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("Nome contem caracteres nao permitidos"));
    }

    @Test
    @DisplayName("Teste 17: Nome de turma com img tag XSS")
    void testCadastroComImgXSS() throws Exception {
        Map<String, String> payload = new HashMap<>();
        payload.put("nome", "Professor");
        payload.put("senha", "senha123");
        payload.put("nomeTurma", "Turma<img src=x onerror='alert(1)'>");

        mockMvc.perform(post("/api/professores/cadastrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload))
                .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("Nome da turma nao pode conter HTML"));
    }

    @Test
    @DisplayName("Teste 18: Codigo com 5 digitos")
    void testVincularCodigoTamanhoIncorreto() throws Exception {
        Map<String, String> payload = new HashMap<>();
        payload.put("apelido", "Pedro");
        payload.put("codigoSala", "12345");
        payload.put("nivel", "DIFICIL");

        mockMvc.perform(post("/api/alunos/vincular")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload))
                .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("Codigo deve ter exatamente 6 digitos"));
    }

    @Test
    @DisplayName("Teste 19: Nivel invalido")
    void testVincularNivelInvalido() throws Exception {
        Map<String, String> payload = new HashMap<>();
        payload.put("apelido", "Ana");
        payload.put("codigoSala", "123456");
        payload.put("nivel", "SUPER_DIFICIL");

        mockMvc.perform(post("/api/alunos/vincular")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload))
                .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("Nivel deve ser FACIL, MEDIO ou DIFICIL"));
    }

    @Test
    @DisplayName("Teste 20: Payload JSON malformado")
    void testCadastroPayloadInvalido() throws Exception {
        String jsonInvalido = "{nome: 'Professor', senha: senha123}";

        mockMvc.perform(post("/api/professores/cadastrar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonInvalido)
                .with(csrf()))
                .andExpect(status().isBadRequest());
    }
}
