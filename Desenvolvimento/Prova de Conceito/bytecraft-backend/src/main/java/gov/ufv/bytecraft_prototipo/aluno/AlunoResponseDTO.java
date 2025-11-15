package gov.ufv.bytecraft_prototipo.aluno;

public record AlunoResponseDTO(
        Long alunoId,
        String nome,
        int pontuacao,
        Long salaId
) {
    public AlunoResponseDTO(Aluno aluno) {
        this(
                aluno.getAlunoId(),
                aluno.getNome(),
                aluno.getPontuacao(),
                aluno.getSala() != null ? aluno.getSala().getSalaId() : null
        );
    }
}
