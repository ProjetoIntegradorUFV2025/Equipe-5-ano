package gov.ufv.bytecraft_prototipo.professor;

public record ProfessorResponseDTO(String cpf, String nome, Long salaId) {
    public ProfessorResponseDTO(Professor professor){
       this(professor.getCpf(),professor.getNome(), professor.getSala().getSalaId());
    }

}
