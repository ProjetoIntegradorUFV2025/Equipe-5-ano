package com.bytecraft.controller;

import com.bytecraft.enums.NivelDificuldadeEnum;
import com.bytecraft.model.Aluno;
import com.bytecraft.repository.AlunoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alunos")
public class AlunoController {

    private final AlunoRepository alunoRepository;

    @Autowired
    public AlunoController(AlunoRepository alunoRepository) {
        this.alunoRepository = alunoRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        try {
            String apelido = payload.get("apelido");
            if (apelido == null || apelido.isBlank()) {
                return ResponseEntity.badRequest().body("Apelido é obrigatório");
            }

            Aluno aluno = alunoRepository.findById(apelido)
                    .orElseGet(() -> {
                        Aluno novo = new Aluno();
                        novo.setApelido(apelido);
                        return alunoRepository.save(novo);
                    });

            return ResponseEntity.ok(aluno);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro no login: " + e.getMessage());
        }
    }

    // <<< Novo endpoint para retornar níveis
    @GetMapping("/niveis")
    public ResponseEntity<?> getNiveis() {
        return ResponseEntity.ok(List.of(
            NivelDificuldadeEnum.FACIL,
            NivelDificuldadeEnum.MEDIO,
            NivelDificuldadeEnum.DIFICIL
        ));
    }

    // Atualizar nível do aluno
    @PostMapping("/{apelido}/registrarNivel")
    public ResponseEntity<?> registrarNivel(@PathVariable String apelido, @RequestBody Map<String, String> payload) {
        try {
            String nivelStr = payload.get("nivel");
            if (nivelStr == null || nivelStr.isBlank()) {
                return ResponseEntity.badRequest().body("Nível é obrigatório");
            }

            NivelDificuldadeEnum nivel = NivelDificuldadeEnum.valueOf(nivelStr.toUpperCase());

            Aluno aluno = alunoRepository.findById(apelido)
                    .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

            aluno.setNivel(nivel);
            alunoRepository.save(aluno);

            return ResponseEntity.ok(aluno);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao atualizar nível: " + e.getMessage());
        }
    }

}
