// AlunoDTO.java
package com.bytecraft.DTO;

import com.bytecraft.model.Aluno;

public record AlunoDTO(String apelido, String nivel, int pontuacao, SalaDTO sala) {

    public static AlunoDTO fromEntity(Aluno aluno) {
        return new AlunoDTO(
            aluno.getApelido(),
            aluno.getNivel().name() !=null ? aluno.getNivel().name() : null,
            aluno.getPontuacao(),
            SalaDTO.fromEntity(aluno.getSala())
        );
    }
}
