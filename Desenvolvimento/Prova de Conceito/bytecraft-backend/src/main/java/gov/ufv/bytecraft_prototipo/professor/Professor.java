package gov.ufv.bytecraft_prototipo.professor;

import gov.ufv.bytecraft_prototipo.sala.Sala;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "cpf")
public class Professor {
    private String cpf;
    private String nome;
    private String senha;
    private Sala sala;

    public  Professor(ProfessorRequestDTO data, String senhaCriptografada) {
        this.cpf = data.cpf();
        this.nome = data.nome();
        this.senha = senhaCriptografada;
        this.sala = data.sala();
    }

}
