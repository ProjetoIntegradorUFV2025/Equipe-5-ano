package com.bytecraft.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.bytecraft.model.Sala;
import com.bytecraft.model.Aluno;

import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SalaDTO {
    private Long id;
    private String nomeTurma;
    private Byte codigoUnico;
    private List<String> nomesAlunos; // lista de nomes dos alunos

    // Converte entidade para DTO e já popula a lista de nomes dos alunos
    public static SalaDTO fromEntity(Sala sala) {
        if (sala == null) return null;

        List<String> nomes = null;
        if (sala.getAlunos() != null) {
            nomes = sala.getAlunos().stream()
                        .map(Aluno::getApelido)
                        .collect(Collectors.toList());
        }

        return new SalaDTO(
            sala.getId(),
            sala.getNomeTurma(),
            sala.getCodigoUnico(),
            nomes
        );
    }
}
