package com.bytecraft.DTO;

import com.bytecraft.model.Professor;

public record ProfessorDTO(String nomeDeUsuario, SalaDTO sala) {

    public static ProfessorDTO fromEntity(Professor professor) {
        return new ProfessorDTO(
            professor.getNomeDeUsuario(),
            SalaDTO.fromEntity(professor.getSala())
        );
    }
}
