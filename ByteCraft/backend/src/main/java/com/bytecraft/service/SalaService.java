package com.bytecraft.service;

import com.bytecraft.DTO.SalaDTO;
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

    private Byte geraCodigoUnico() {
        // Gera um número aleatório entre 10 e 99
        return (byte) (10 + (int)(Math.random() * 90));
    }

    public Sala criaSala(String nomeTurma) {
        return salaRepository.findByNomeTurma(nomeTurma)
                .orElseGet(() -> {
                    Sala nova = Sala.builder()
                            .nomeTurma(nomeTurma)
                            .codigoUnico(geraCodigoUnico()) // <- Preenche antes de salvar
                            .build();
                    return salaRepository.save(nova);
                });
            }

    public Optional<Sala> getSalaByCodigo(Byte codigo) {
        return salaRepository.findByCodigoUnico(codigo);
    }

    public List<Sala> getTodasSalas() {
        return salaRepository.findAll();
    }

    public SalaDTO toDTO(Sala sala) {
        return new SalaDTO(sala.getId(), sala.getNomeTurma(), sala.getCodigoUnico());
    }
}
