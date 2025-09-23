package com.bytecraft.controller;

import com.bytecraft.model.Sala;
import com.bytecraft.repository.ProfessorRepository;
import com.bytecraft.service.ProfessorService;
import com.bytecraft.service.SalaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/professores")
@RequiredArgsConstructor
public class ProfessorController {

    private final ProfessorRepository professorRepository;
    private final SalaService salaService;
    private final PasswordEncoder passwordEncoder;

    // Cadastro do professor + criação de sala automática
    @PostMapping("/cadastrar")
    public ResponseEntity<Map<String, Object>> cadastrar(@RequestBody Map<String, String> payload) {
        String nome = payload.get("nome");
        String senha = payload.get("senha");
        String nomeTurma = payload.get("nomeTurma");

        try {
            // Cadastra professor e cria sala, já retorna verdadeiro/falso
            boolean sucesso = ProfessorService.cadastrarProfessor(
                    nome,
                    senha,
                    nomeTurma,
                    professorRepository,
                    salaService,
                    passwordEncoder
            );

            if (sucesso) {
                // Obtém o professor recém-criado do banco
                var professor = professorRepository.buscarPorNome(nome);

                // Garante que a sala associada vem com código preenchido
                Sala sala = professor.getSala();

                // Monta a resposta
                Map<String, Object> resposta = new HashMap<>();
                resposta.put("nomeDeUsuario", professor.getNomeDeUsuario());
                resposta.put("nomeTurma", sala.getNomeTurma());
                resposta.put("sala", Map.of(
                    "id", sala.getId(),
                    "nomeTurma", sala.getNomeTurma(),
                    "codigo", sala.getCodigoUnico() // agora sempre preenchido
                ));

                return ResponseEntity.ok(resposta);
            } else {
                return ResponseEntity.badRequest().body(Map.of("erro", "Nome de usuário já existe"));
            }
        } catch (IllegalArgumentException e) {
            // Captura erro de senha mínima (RN02)
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }
    // Autenticação do professor
    @PostMapping("/autenticar")
    public ResponseEntity<?> autenticar(@RequestBody Map<String, String> payload) {
        String nome = payload.get("nome");
        String senha = payload.get("senha");

        if (nome == null || senha == null) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Nome e senha são obrigatórios."));
        }

        boolean autenticado = ProfessorService.autenticarProfessor(
                nome,
                senha,
                professorRepository,
                passwordEncoder
        );

        if (autenticado) {
            var professor = professorRepository.buscarPorNome(nome);
            Sala sala = professor.getSala();
            Map<String, Object> resposta = Map.of(
                    "nomeDeUsuario", professor.getNomeDeUsuario(),
                    "nomeTurma", sala.getNomeTurma(),
                    "sala", Map.of(
                            "id", sala.getId(),
                            "nomeTurma", sala.getNomeTurma(),
                            "codigo", sala.getCodigoUnico()
                    )
            );
            return ResponseEntity.ok(resposta);
        } else {
            return ResponseEntity.status(401).body(Map.of("erro", "Nome de usuário ou senha inválidos."));
        }
    }
}
