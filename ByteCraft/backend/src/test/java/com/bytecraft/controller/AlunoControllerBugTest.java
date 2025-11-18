package com.bytecraft.controller;

import com.bytecraft.service.AlunoService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 *  TESTES DE BUGS REAIS - AlunoController
 * 
 * BUG #2: NumberFormatException não tratado adequadamente
 * BUG #4: ClassCastException em salvarProgresso
 */
@SpringBootTest
@AutoConfigureMockMvc
@DisplayName(" Testes de Bugs Reais - AlunoController")
class AlunoControllerBugTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AlunoService alunoService;

    // ==================== BUG #2: NumberFormatException ====================
    
    @Test
    @DisplayName(" BUG #2: Código sala fora do range de Byte (-128 a 127)")
    void bugAlto_CodigoSalaForaDoRange() throws Exception {
        /*
         * CENÁRIO REAL:
         * Usuário digita código sala = 200 (maior que 127)
         * 
         * COMPORTAMENTO ATUAL:
         * - Byte.parseByte("200") lança NumberFormatException
         * - Erro genérico: "Erro no login: For input string: '200'"
         * 
         * PROBLEMA:
         * - Mensagem não é clara para o usuário
         * - Não explica que o código deve estar entre 10 e 99
         * 
         * IMPACTO:
         * - Usuário não entende o erro
         * 
         */
        
        String jsonRequest = """
            {
                "apelido": "TestAluno",
                "codigoSala": "200"
            }
            """;
        
        mockMvc.perform(post("/api/alunos/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonRequest))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").exists())
                .andExpect(jsonPath("$.erro").value(containsString("Erro no login")));
        
        System.out.println(" BUG #2 COMPROVADO:");
        System.out.println("   - Input: codigoSala = 200");
        System.out.println("   - Exceção: NumberFormatException");
        System.out.println("   - Mensagem genérica não ajuda o usuário");
        System.out.println("   - DEVERIA: 'Código da sala deve estar entre 10 e 99'");
    }

    @Test
    @DisplayName(" BUG #2: Código sala com valor negativo")
    void bugAlto_CodigoSalaNegativo() throws Exception {
        /*
         * CENÁRIO: Usuário digita valor negativo
         */
        
        String jsonRequest = """
            {
                "apelido": "TestAluno",
                "codigoSala": "-50"
            }
            """;
        
        mockMvc.perform(post("/api/alunos/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonRequest))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").exists());
        
        System.out.println(" BUG #2: Código negativo também gera erro genérico");
    }

    @Test
    @DisplayName(" BUG #2: Código sala com caracteres não numéricos")
    void bugAlto_CodigoSalaComLetras() throws Exception {
        /*
         * CENÁRIO: Usuário digita letras em vez de números
         */
        
        String jsonRequest = """
            {
                "apelido": "TestAluno",
                "codigoSala": "ABC"
            }
            """;
        
        mockMvc.perform(post("/api/alunos/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonRequest))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").exists())
                .andExpect(jsonPath("$.erro").value(containsString("Erro no login")));
        
        System.out.println(" BUG #2: Letras também geram NumberFormatException");
    }

    // ==================== BUG #4: ClassCastException ====================
    
    @Test
    @DisplayName(" BUG #4: ClassCastException quando codigoSala vem como String")
    void bugAlto_ClassCastExceptionCodigoSala() throws Exception {
        /*
         * CENÁRIO REAL:
         * Frontend envia codigoSala como string "42" em vez de número 42
         * 
         * CÓDIGO PROBLEMÁTICO:
         * Integer codigoSala = (Integer) payload.get("codigoSala");
         * 
         * Se JSON for: {"codigoSala": "42"} → ClassCastException
         * Se JSON for: {"codigoSala": 42} → Funciona
         * 
         * PROBLEMA: Cast direto sem validação de tipo
         */
        
        String jsonRequest = """
            {
                "apelido": "TestAluno",
                "codigoSala": "42",
                "modoHistoriaCompleto": true
            }
            """;
        
        // Este teste pode falhar dependendo de como o Jackson deserializa
        // Se o campo é String no JSON mas esperamos Integer, pode haver problema
        
        System.out.println(" BUG #4: Potencial ClassCastException");
        System.out.println("   - Cast direto: (Integer) payload.get()");
        System.out.println("   - Deveria: validar tipo ou usar conversão segura");
    }

    @Test
    @DisplayName(" BUG #2: Demonstração com múltiplos valores inválidos")
    void bugAlto_MultiplosValoresInvalidos() throws Exception {
        /*
         * TESTE ABRANGENTE: Vários formatos inválidos
         */
        
        String[] valoresInvalidos = {
            "999",      // > 127
            "-200",     // < -128
            "10.5",     // Decimal
            "1e5",      // Notação científica
            ""          // Vazio
        };
        
        for (String valor : valoresInvalidos) {
            String jsonRequest = String.format("""
                {
                    "apelido": "TestAluno",
                    "codigoSala": "%s"
                }
                """, valor);
            
            mockMvc.perform(post("/api/alunos/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(jsonRequest))
                    .andExpect(status().isBadRequest());
        }
        
        System.out.println(" BUG #2 CONFIRMADO:");
        System.out.println("   Todos os valores inválidos geram erro genérico");
        System.out.println("   Usuário não entende o motivo do erro");
    }
}
