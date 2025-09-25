package com.bytecraft.model;

import jakarta.persistence.*;
import lombok.*;

//Classe do Pedro Paulo adaptada
@Entity
@Table(name = "professores")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Professor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    
    @Column(name = "nome_de_usuario", nullable = false)
    private String nomeDeUsuario;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @Column(name = "senha", nullable = false)
    private String senha;

    @ManyToOne
    @JoinColumn(name = "sala_id", nullable = false)
    private Sala sala;
}
