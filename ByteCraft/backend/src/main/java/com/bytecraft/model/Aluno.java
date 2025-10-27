package com.bytecraft.model;

import com.bytecraft.enums.NivelDificuldadeEnum;
import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonBackReference;    // em Aluno

//Classe do Pablo
@Entity
@Table(
    name = "alunos",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"apelido", "sala_id"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Aluno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // PK técnica, não exposta para lógica de negócio

    @Column(nullable = false)
    private String apelido;  // Identificador dentro da sala

    @Enumerated(EnumType.STRING)
    @Column(nullable = true) // ou apenas remover nullable, que por padrão aceita null
    private NivelDificuldadeEnum nivel;


    @ManyToOne
    @JoinColumn(name = "sala_id", nullable = false)
    @JsonBackReference // não serializa essa referência
    private Sala sala;

    @Column(nullable = false)
    private int pontuacao;

}
