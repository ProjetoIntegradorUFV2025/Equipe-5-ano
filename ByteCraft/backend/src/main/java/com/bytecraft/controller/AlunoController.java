package com.bytecraft.controller;

import com.bytecraft.DTO.AlunoDTO;
import com.bytecraft.enums.NivelDificuldadeEnum;
import com.bytecraft.model.Aluno;
import com.bytecraft.service.AlunoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alunos")
@RequiredArgsConstructor
public class AlunoController {

    private final AlunoService alunoService;

    // Login ou registro
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> payload) {
        Map<String, Object> resposta = new HashMap<>();
        try {
            String apelido = payload.get("apelido");
            String codigoSalaStr = payload.get("codigoSala");

            if (apelido == null || apelido.isBlank()) {
                resposta.put("erro", "Apelido é obrigatório");
                return ResponseEntity.badRequest().body(resposta);
            }
            if (codigoSalaStr == null || codigoSalaStr.isBlank()) {
                resposta.put("erro", "Código da sala é obrigatório");
                return ResponseEntity.badRequest().body(resposta);
            }

            Byte codigoSala = Byte.parseByte(codigoSalaStr);
            Aluno aluno = alunoService.vincularAlunoASala(apelido, codigoSala);

            resposta.put("apelido", aluno.getApelido());
            // verifica se nivel é nulo antes de chamar .name()
            resposta.put("nivel", aluno.getNivel() != null ? aluno.getNivel().name() : null);
            resposta.put("sala", Map.of(
                    "id", aluno.getSala().getId(),
                    "nomeTurma", aluno.getSala().getNomeTurma(),
                    "codigo", aluno.getSala().getCodigoUnico()
            ));

            return ResponseEntity.ok(resposta);

        } catch (Exception e) {
            resposta.put("erro", "Erro no login: " + e.getMessage());
            return ResponseEntity.badRequest().body(resposta);
        }
    }
    // Retorna níveis disponíveis
    @GetMapping("/niveis")
    public ResponseEntity<List<String>> getNiveis() {
        List<String> niveis = List.of(
                NivelDificuldadeEnum.FACIL.name(),
                NivelDificuldadeEnum.MEDIO.name(),
                NivelDificuldadeEnum.DIFICIL.name()
        );
        return ResponseEntity.ok(niveis);
    }

    // Atualiza nível do aluno
    @PostMapping("/{apelido}/registrarNivel")
    public ResponseEntity<?> registrarNivel(@PathVariable String apelido,
                                            @RequestBody Map<String, String> payload) {
        try {
            String codigoSalaStr = payload.get("codigoSala");
            String nivelStr = payload.get("nivel");

            if (codigoSalaStr == null || codigoSalaStr.isBlank())
                return ResponseEntity.badRequest().body(Map.of("erro", "Código da sala é obrigatório"));
            if (nivelStr == null || nivelStr.isBlank())
                return ResponseEntity.badRequest().body(Map.of("erro", "Nível é obrigatório"));

            Byte codigoSala = Byte.parseByte(codigoSalaStr);
            Aluno aluno = alunoService.findAluno(apelido, codigoSala);

            // Atualiza nível
            aluno.setNivel(NivelDificuldadeEnum.valueOf(nivelStr.toUpperCase()));
            alunoService.registraNivel(aluno);

            // Retorna DTO
            AlunoDTO alunoDTO = alunoService.toDTO(aluno);
            return ResponseEntity.ok(alunoDTO);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }
}
