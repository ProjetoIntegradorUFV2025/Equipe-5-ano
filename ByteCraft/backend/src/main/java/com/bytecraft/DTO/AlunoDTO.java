// AlunoDTO.java
package com.bytecraft.DTO;

import com.bytecraft.model.Aluno;

public record AlunoDTO(String apelido, String nivel, SalaDTO sala) {

    public static AlunoDTO fromEntity(Aluno aluno) {
        return new AlunoDTO(
            aluno.getApelido(),
            aluno.getNivel().name(),
            SalaDTO.fromEntity(aluno.getSala())
        );
    }
}
