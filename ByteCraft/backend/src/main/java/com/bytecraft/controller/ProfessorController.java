package com.bytecraft.controller;

import com.bytecraft.DTO.ProfessorDTO;
import com.bytecraft.model.Professor;
import com.bytecraft.service.ProfessorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/professores")
@RequiredArgsConstructor
public class ProfessorController {

    private final ProfessorService professorService;

    // Cadastro do professor + criação de sala automática
    @PostMapping("/cadastrar")
    public ResponseEntity<?> cadastrar(@RequestBody Map<String, String> payload) {
        String nome = payload.get("nome");
        String senha = payload.get("senha");
        String nomeTurma = payload.get("nomeTurma");

        try {
            ProfessorDTO professorDTO = professorService.cadastrarProfessor(nome, senha, nomeTurma);
            return ResponseEntity.ok(professorDTO);
        } catch (IllegalArgumentException | IllegalStateException e) {
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

        Professor professor = professorService.autenticarProfessor(nome, senha);
        if (professor != null) {
            ProfessorDTO professorDTO = ProfessorDTO.fromEntity(professor);
            return ResponseEntity.ok(professorDTO);
        } else {
            return ResponseEntity.status(401).body(Map.of("erro", "Nome de usuário ou senha inválidos."));
        }
    }
}
