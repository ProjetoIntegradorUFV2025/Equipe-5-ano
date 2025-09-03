package gov.ufv.bytecraft_prototipo.aluno;

public record AlunoRequestDTO(
        String nome,
        int pontuacao,
        Long salaId
) {}
