package com.bytecraft.controller;

import com.bytecraft.DTO.AlunoDTO;
import com.bytecraft.DTO.SalaDTO;
import com.bytecraft.model.Aluno;
import com.bytecraft.model.Sala;
import com.bytecraft.service.AlunoService;
import com.bytecraft.service.SalaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/salas")
@RequiredArgsConstructor
public class SalaController {

    private final SalaService salaService;
    private final AlunoService alunoService;

    // Criar sala
    @PostMapping("/criar")
    public ResponseEntity<?> criarSala(@RequestBody Map<String, String> payload) {
        String nomeTurma = payload.get("nomeTurma");
        if (nomeTurma == null || nomeTurma.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Nome da turma é obrigatório"));
        }
        Sala sala = salaService.criaSala(nomeTurma);
        SalaDTO salaDTO = salaService.toDTO(sala);
        return ResponseEntity.ok(salaDTO);
    }

    // Vincular aluno à sala
    @PostMapping("/vincular")
    public ResponseEntity<?> vincularAluno(@RequestBody Map<String, String> payload) {
        String apelido = payload.get("apelido");
        String codigoStr = payload.get("codigoSala");

        if (apelido == null || apelido.isBlank() || codigoStr == null || codigoStr.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Parâmetros inválidos"));
        }

        try {
            Byte codigo = Byte.parseByte(codigoStr);
            Aluno aluno = alunoService.vincularAlunoASala(apelido, codigo);
            AlunoDTO alunoDTO = alunoService.toDTO(aluno);
            return ResponseEntity.ok(alunoDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    // Verifica se há salas cadastradas
    @GetMapping("/existe")
    public ResponseEntity<Map<String, Object>> existeSala() {
        List<SalaDTO> salas = salaService.getTodasSalas().stream()
                .map(salaService::toDTO)
                .toList();
        boolean existe = !salas.isEmpty();
        return ResponseEntity.ok(Map.of(
                "existe", existe,
                "salas", salas
        ));
    }
}
