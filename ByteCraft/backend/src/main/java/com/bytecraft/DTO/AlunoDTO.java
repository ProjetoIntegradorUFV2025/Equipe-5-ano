package com.bytecraft.DTO;

import com.bytecraft.model.Aluno;

public record AlunoDTO(String apelido, String nivel, int pontuacao, SalaDTO sala) {

    public static AlunoDTO fromEntity(Aluno aluno) {
        if (aluno == null) return null;

        String nivel = (aluno.getNivel() != null) ? aluno.getNivel().name() : null;

        return new AlunoDTO(
            aluno.getApelido(),
            nivel,
            aluno.getPontuacao(),
            SalaDTO.fromEntity(aluno.getSala())
        );
    }
}
