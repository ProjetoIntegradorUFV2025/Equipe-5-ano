package gov.ufv.bytecraft_prototipo.sala;

import gov.ufv.bytecraft_prototipo.professor.Professor;
import gov.ufv.bytecraft_prototipo.aluno.Aluno;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "salaId")
public class Sala {

    private Long salaId;
    private Professor professor;
    private List<Aluno> alunos = new ArrayList<>();

    public Sala(Professor professor) {
        this.professor = professor;
    }
}

