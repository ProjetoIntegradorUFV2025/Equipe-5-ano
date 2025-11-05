package com.bytecraft.model;

import com.bytecraft.enums.NivelDificuldadeEnum;
import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

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
    private Long id;

    @Column(nullable = false)
    private String apelido;

    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private NivelDificuldadeEnum nivel;

    @ManyToOne
    @JoinColumn(name = "sala_id", nullable = false)
    @JsonBackReference
    private Sala sala;

    @Column(nullable = false)
    private int pontuacao;

    // ✅ NOVO CAMPO: Indica se o aluno completou o Modo História
    @Column(name = "modo_historia_completo", nullable = false)
    private Boolean modoHistoriaCompleto = false;
}