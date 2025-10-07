package com.bytecraft.controller;

import com.bytecraft.DTO.SalaDTO;
import com.bytecraft.model.Sala;
import com.bytecraft.model.Aluno;
import com.bytecraft.DTO.AlunoDTO;
import com.bytecraft.service.SalaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/salas")
@RequiredArgsConstructor
public class SalaController {

    private final SalaService salaService;

    // Criar sala
    @PostMapping("/criar")
    public ResponseEntity<?> criarSala(@RequestBody Map<String, String> payload) {
        String nomeTurma = payload.get("nomeTurma");
        if (nomeTurma == null || nomeTurma.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Nome da turma é obrigatório"));
        }
        Sala sala = salaService.criaSala(nomeTurma);
        SalaDTO salaDTO = SalaDTO.fromEntity(sala);
        return ResponseEntity.ok(salaDTO);
    }
    
    // Verifica se há salas cadastradas
    @GetMapping("/existe")
    public ResponseEntity<Map<String, Object>> existeSala() {
        List<SalaDTO> salas = salaService.getTodasSalas().stream()
                .map(SalaDTO::fromEntity)
                .toList();
        boolean existe = !salas.isEmpty();
        return ResponseEntity.ok(Map.of(
                "existe", existe,
                "salas", salas
        ));
    }

    // Obter ranking da turma
    @GetMapping("/getRanking/{codigoUnico}")
    public ResponseEntity<?> getRankingTurma(@PathVariable Byte codigoUnico) {
        Optional<List<Aluno>> alunosOpt = salaService.getRankingTurma(codigoUnico);

        if (alunosOpt.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("erro", "Sala não encontrada ou sem alunos."));
        }

        // Converte cada Aluno para AlunoDTO
        List<AlunoDTO> ranking = alunosOpt.get().stream()
                .map(AlunoDTO::fromEntity)
                .toList();

        return ResponseEntity.ok(ranking);
    }
   
}    