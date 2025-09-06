package gov.ufv.bytecraft_prototipo.aluno;

import gov.ufv.bytecraft_prototipo.sala.Sala;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "alunoId")
public class Aluno {
    private Long alunoId;
    private String nome;
    private int pontuacao;
    private Sala sala;

    public Aluno(String nome, int pontuacao, Sala sala) {
        this.nome = nome;
        this.pontuacao = pontuacao;
        this.sala = sala;
    }
}
