package com.bytecraft.service;

import com.bytecraft.model.Aluno;
import com.bytecraft.model.Sala;
import com.bytecraft.repository.SalaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Comparator;

@Service
@RequiredArgsConstructor
public class SalaService {

    private final SalaRepository salaRepository;
    private final AlunoService alunoService;

    // Gera código único entre 10 e 99, sem repetição
    private Byte geraCodigoUnico() {
        Byte codigo;
        do {
            codigo = (byte) (10 + (int) (Math.random() * 90));
        } while (salaRepository.buscarPorCodigo(codigo).isPresent());
        return codigo;
    }

    // Cria sala se não existir
    public Sala criaSala(String nomeTurma) {
        return salaRepository.buscarSala(nomeTurma)
                .orElseGet(() -> {
                    Sala nova = Sala.builder()
                            .nomeTurma(nomeTurma)
                            .codigoUnico(geraCodigoUnico())
                            .build();
                    return salaRepository.save(nova);
                });
    }

    // Busca sala por código
    public Optional<Sala> getSalaByCodigo(Byte codigo) {
        return salaRepository.buscarPorCodigo(codigo);
    }

    // Retorna todas as salas
    public List<Sala> getTodasSalas() {
        return salaRepository.findAll();
    }

    // Busca ID da sala pelo código único
    private Long getSalaID(Byte codigoUnico) {
        return salaRepository.buscarSalaID(codigoUnico);
    }

    // Retorna ranking da turma (alunos ordenados por pontuação)
    public Optional<List<Aluno>> getRankingTurma(Byte codigoUnico) {
        Long idSala = getSalaID(codigoUnico);

        if (idSala == null) {
            return Optional.empty();
        }

        Optional<List<Aluno>> alunosOpt = alunoService.getAlunosPorSala(idSala);

        if (alunosOpt.isEmpty()) {
            return Optional.empty();
        }

        List<Aluno> alunos = alunosOpt.get();

        // Ordena pela pontuação (maior primeiro)
        alunos.sort(Comparator.comparingInt(Aluno::getPontuacao).reversed());

        return Optional.of(alunos);
    }

    public Sala getSalaByProfessor(Long id){
        Sala sala = salaRepository.buscarPorProfessor(id);
        return sala;
    }
}
