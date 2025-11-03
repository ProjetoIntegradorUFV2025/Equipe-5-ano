package com.bytecraft.model;

import com.bytecraft.enums.NivelDificuldadeEnum;
import jakarta.persistence.*;
import lombok.*;

//Classe da Lara adaptada
@Entity
@Table(name = "pergunta")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pergunta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "enunciado", nullable = false, length = 1000)
    private String enunciado;

    @Lob
    @Column(name = "imagem", columnDefinition = "LONGTEXT")
    private String imagem;

    @Column(name = "alternativa_a", nullable = false, length = 500)
    private String alternativaA;

    @Column(name = "alternativa_b", nullable = false, length = 500)
    private String alternativaB;

    @Column(name = "alternativa_c", nullable = false, length = 500)
    private String alternativaC;

    @Column(name = "alternativa_d", nullable = false, length = 500)
    private String alternativaD;

    @Column(name = "alternativa_correta", nullable = false, length = 500)
    private String alternativaCorreta; // ✅ nova propriedade

    @Enumerated(EnumType.STRING)
    @Column(name = "nivel_dificuldade", nullable = false)
    private NivelDificuldadeEnum nivelDificuldade;
}
