package gov.ufv.bytecraft_prototipo.professor;

import gov.ufv.bytecraft_prototipo.sala.Sala;

public record ProfessorRequestDTO(String cpf, String nome, String senha, Sala sala) {

}
