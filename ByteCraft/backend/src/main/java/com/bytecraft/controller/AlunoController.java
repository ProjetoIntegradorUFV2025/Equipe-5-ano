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

            // === Normalização ===
            if (apelido != null) {
                apelido = apelido.trim().replaceAll("\\s+", " ");
            }
            if (codigoSalaStr != null) {
                codigoSalaStr = codigoSalaStr.trim();
            }

            // === Validação ===
            if (apelido == null || apelido.isEmpty()) {
                resposta.put("erro", "Apelido é obrigatório");
                return ResponseEntity.badRequest().body(resposta);
            }
            if (codigoSalaStr == null || codigoSalaStr.isEmpty()) {
                resposta.put("erro", "Código da sala é obrigatório");
                return ResponseEntity.badRequest().body(resposta);
            }

            Byte codigoSala = Byte.parseByte(codigoSalaStr);
            Aluno aluno = alunoService.vincularAlunoASala(apelido, codigoSala);

            resposta.put("apelido", aluno.getApelido());
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
            // Normaliza apelido e parâmetros
            apelido = apelido != null ? apelido.trim().replaceAll("\\s+", " ") : null;
            String codigoSalaStr = payload.get("codigoSala");
            String nivelStr = payload.get("nivel");

            if (codigoSalaStr != null) codigoSalaStr = codigoSalaStr.trim();
            if (nivelStr != null) nivelStr = nivelStr.trim();

            // Validação
            if (apelido == null || apelido.isEmpty())
                return ResponseEntity.badRequest().body(Map.of("erro", "Apelido é obrigatório"));
            if (codigoSalaStr == null || codigoSalaStr.isEmpty())
                return ResponseEntity.badRequest().body(Map.of("erro", "Código da sala é obrigatório"));
            if (nivelStr == null || nivelStr.isEmpty())
                return ResponseEntity.badRequest().body(Map.of("erro", "Nível é obrigatório"));

            Byte codigoSala = Byte.parseByte(codigoSalaStr);
            NivelDificuldadeEnum nivel = NivelDificuldadeEnum.valueOf(nivelStr.toUpperCase());

            boolean atualizado = alunoService.registraNivel(nivel, apelido, codigoSala);
            if (!atualizado)
                return ResponseEntity.badRequest().body(Map.of("erro", "Aluno não encontrado"));

            Aluno aluno = alunoService.findAluno(apelido, codigoSala);
            AlunoDTO alunoDTO = AlunoDTO.fromEntity(aluno);

            return ResponseEntity.ok(alunoDTO);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @PostMapping("/setPontuacao")
    public ResponseEntity<?> salvaPontuacao(@RequestBody Map<String, String> payload) {
        try {
            String apelido = payload.get("apelido");
            String codigoSalaStr = payload.get("codigoSala");
            String pontosStr = payload.get("pontos");
            String segundosStr = payload.get("segundos");

            if (apelido != null) apelido = apelido.trim().replaceAll("\\s+", " ");
            if (codigoSalaStr != null) codigoSalaStr = codigoSalaStr.trim();
            if (pontosStr != null) pontosStr = pontosStr.trim();
            if (segundosStr != null) segundosStr = segundosStr.trim();

            if (apelido == null || apelido.isEmpty())
                return ResponseEntity.badRequest().body(Map.of("erro", "Apelido é obrigatório"));
            if (codigoSalaStr == null || codigoSalaStr.isEmpty())
                return ResponseEntity.badRequest().body(Map.of("erro", "Código da sala é obrigatório"));
            if (pontosStr == null || pontosStr.isEmpty())
                return ResponseEntity.badRequest().body(Map.of("erro", "Pontos são obrigatórios"));
            if (segundosStr == null || segundosStr.isEmpty())
                return ResponseEntity.badRequest().body(Map.of("erro", "Tempo (segundos) é obrigatório"));

            Byte codigoSala = Byte.parseByte(codigoSalaStr);
            int pontos = Integer.parseInt(pontosStr);
            int segundos = Integer.parseInt(segundosStr);

            boolean atualizado = alunoService.registraPontuacao(apelido, segundos, pontos, codigoSala);

            return ResponseEntity.ok(Map.of("atualizado", atualizado));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Erro ao registrar pontuação: " + e.getMessage()));
        }
    }


}
