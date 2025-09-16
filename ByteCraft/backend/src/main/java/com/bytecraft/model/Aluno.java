package com.bytecraft.model;

import com.bytecraft.enums.NivelDificuldadeEnum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


//Classe do Pablo já adaptada.
@Entity
@Getter
@Setter
public class Aluno {

    @Id
    private String apelido;

    @Enumerated(EnumType.STRING)
    private NivelDificuldadeEnum nivel;
}
