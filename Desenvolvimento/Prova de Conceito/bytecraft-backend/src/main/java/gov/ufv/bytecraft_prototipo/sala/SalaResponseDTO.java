package gov.ufv.bytecraft_prototipo.sala;

import gov.ufv.bytecraft_prototipo.aluno.Aluno;

import java.util.List;

public record SalaResponseDTO(
        Long salaId,
        String cpfProfessor,
        List<Aluno> alunos
) {
    public SalaResponseDTO(Sala sala) {
        this(
                sala.getSalaId(),
                sala.getProfessor().getCpf(),
                sala.getAlunos()
        );
    }
}
