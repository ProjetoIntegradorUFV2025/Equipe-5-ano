package com.bytecraft.service;

import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.bytecraft.enums.NivelDificuldadeEnum;
import com.bytecraft.model.Pergunta;
import com.bytecraft.repository.PerguntaRepository;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class PerguntaService {

    @Autowired
    private PerguntaRepository perguntaRepository;

    /**
     * Retorna uma lista embaralhada de perguntas de um determinado nível,
     * limitada pela quantidade desejada.
     */
    public List<Pergunta> getPerguntasPorNivel(int quantidade, NivelDificuldadeEnum nivel) {
        List<Pergunta> perguntas = perguntaRepository.buscarPorNivel(nivel);

        // Remove duplicatas e embaralha
        List<Pergunta> perguntasUnicas = new ArrayList<>(perguntas.stream().distinct().toList());
        Collections.shuffle(perguntasUnicas);

        // Limita à quantidade solicitada
        return perguntasUnicas.stream()
                .limit(Math.min(quantidade, perguntasUnicas.size()))
                .toList();
    }

    /**
     * Importa perguntas a partir de um arquivo CSV.
     * Estrutura esperada:
     * ENUNCIADO | IMAGEM | ALT_A | ALT_B | ALT_C | ALT_D | ALT_CORRETA | NIVEL
     */
    public void importarCSV(MultipartFile arquivo) throws IOException, CsvValidationException {
        try (CSVReader csvReader = new CSVReader(
                new InputStreamReader(arquivo.getInputStream(), StandardCharsets.UTF_8))) {

            String[] colunas;
            boolean primeiraLinha = true;

            while ((colunas = csvReader.readNext()) != null) {
                if (primeiraLinha) {
                    primeiraLinha = false; // pula cabeçalho
                    continue;
                }

                // Limpa cada coluna
                for (int i = 0; i < colunas.length; i++) {
                    colunas[i] = colunas[i].trim();
                }

                // 🔹 Define nível de dificuldade (remove \r e outros caracteres)
                String nivelStr = colunas[7]
                        .toUpperCase()
                        .replaceAll("[^A-Z]", "");

                Pergunta pergunta = new Pergunta();
                pergunta.setEnunciado(colunas[0]);
                pergunta.setImagem(colunas[1].isEmpty() ? null : colunas[1]);
                pergunta.setAlternativaA(colunas[2]);
                pergunta.setAlternativaB(colunas[3]);
                pergunta.setAlternativaC(colunas[4]);
                pergunta.setAlternativaD(colunas[5]);
                pergunta.setAlternativaCorreta(colunas[6]);
                pergunta.setNivelDificuldade(NivelDificuldadeEnum.valueOf(nivelStr));

                perguntaRepository.save(pergunta);
            }
        }
    }
}
