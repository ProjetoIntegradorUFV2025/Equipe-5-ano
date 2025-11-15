package com.bytecraft.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.bytecraft.enums.NivelDificuldadeEnum;
import com.bytecraft.model.Pergunta;
import com.bytecraft.service.PerguntaService;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/api/perguntas")
@RequiredArgsConstructor
public class PerguntaController {

    private final PerguntaService perguntaService;

    // DTO interno para o payload recebido no corpo da requisição
    @Data
    public static class PerguntaRequest {
        private int quantidade;
        private NivelDificuldadeEnum nivelDificuldade;
    }

    @PostMapping("/list")
    public ResponseEntity<List<Pergunta>> getListaPerguntas(@RequestBody PerguntaRequest request) {
        try {
            List<Pergunta> perguntas = perguntaService.getPerguntasPorNivel(
                request.getQuantidade(),
                request.getNivelDificuldade()
            );
            return ResponseEntity.ok(perguntas);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build(); // Enum inválido
        }
    }

    // Novo endpoint para importar CSV
    @PostMapping("/import")
    public ResponseEntity<String> importarCsv(@RequestParam("arquivos") List<MultipartFile> arquivos) {
        try {
            for (MultipartFile arquivo : arquivos) {
                perguntaService.importarCSV(arquivo);
            }
            return ResponseEntity.ok("Todos os CSVs foram importados com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao importar CSV: " + e.getMessage());
        }
    }
}
