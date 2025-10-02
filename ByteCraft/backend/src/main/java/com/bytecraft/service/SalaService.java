package com.bytecraft.service;

import com.bytecraft.model.Sala;
import com.bytecraft.repository.SalaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SalaService {

    private final SalaRepository salaRepository;

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
}
