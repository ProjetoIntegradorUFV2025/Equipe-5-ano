package com.bytecraft.service;

import com.bytecraft.enums.NivelDificuldadeEnum;
import com.bytecraft.model.Aluno;
import com.bytecraft.model.Sala;
import com.bytecraft.repository.AlunoRepository;
import com.bytecraft.repository.SalaRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AlunoService {

    private final AlunoRepository alunoRepository;
    private final SalaRepository salaRepository;

    //Vincula aluno à sala (cria se não existir)
    public Aluno vincularAlunoASala(String apelido, Byte codigoSala) {
        String apelidoTrim = apelido != null ? apelido.trim() : null;

        Sala sala = salaRepository.buscarPorCodigo(codigoSala)
                .orElseThrow(() -> new RuntimeException("Sala não encontrada"));

        Optional<Aluno> existente = alunoRepository.buscarPorApelidoESala(apelidoTrim, sala);
        if (existente.isPresent()) return existente.get();

        Aluno novo = new Aluno();
        novo.setApelido(apelidoTrim);
        novo.setSala(sala);
        novo.setPontuacao(0);
        return alunoRepository.save(novo);
    }

    @Transactional
    public boolean registraNivel(NivelDificuldadeEnum nivel, String apelido, Byte codigoSala) {
        String apelidoTrim = apelido != null ? apelido.trim() : null;

        Sala sala = salaRepository.buscarPorCodigo(codigoSala)
                .orElseThrow(() -> new RuntimeException("Sala não encontrada"));

        return alunoRepository.buscarPorApelidoESala(apelidoTrim, sala)
                .map(aluno -> {
                    aluno.setNivel(nivel);
                    alunoRepository.save(aluno);
                    return true;
                })
                .orElse(false);
    }

    //Busca aluno em uma sala
    public Aluno findAluno(String apelido, Byte codigoSala) {
        String apelidoTrim = apelido != null ? apelido.trim() : null;

        Sala sala = salaRepository.buscarPorCodigo(codigoSala)
                .orElseThrow(() -> new RuntimeException("Sala não encontrada"));

        return alunoRepository.buscarPorApelidoESala(apelidoTrim, sala)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
    }

    // Calcula pontuação com base no tempo (em segundos) e pontos recebidos do frontend
    public int calculaPontuacao(int pontos, int segundos) {
        if (pontos < 0) pontos = 0;  // Evita pontuação negativa
        if (segundos < 0) segundos = 0; // Evita valores negativos de tempo
    
        // Fórmula RN22: aplica bônus se T < 600s (10 minutos)
        double fatorTempo = Math.max(1.0, 2.0 - ((double) segundos / 600.0));
        double pontuacaoFinal = pontos * fatorTempo;
    
        return (int) Math.round(pontuacaoFinal);
    }
    
    @Transactional
    public boolean registraPontuacao(String apelido, int segundos, int pontuacao, Byte codigoSala) {
        try {
            // Busca o aluno
            Aluno aluno = findAluno(apelido, codigoSala);

            // Calcula pontuação
            int pontuacaoFinal = calculaPontuacao(pontuacao, segundos);

            // Atualiza pontuação usando o repositório
            int rowsUpdated = alunoRepository.atualizaPontuacao(aluno.getId(), pontuacaoFinal);

            return rowsUpdated > 0;
        } catch (Exception e) {
            System.err.println("Erro ao registrar pontuação: " + e.getMessage());
            return false;
        }
    }


    // Buscar alunos por sala
    public Optional<List<Aluno>> getAlunosPorSala(Long id){
        return alunoRepository.buscarPorSala(id);
    }
}
