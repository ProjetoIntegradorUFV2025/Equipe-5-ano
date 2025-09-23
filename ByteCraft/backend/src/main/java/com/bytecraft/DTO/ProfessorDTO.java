package com.bytecraft.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProfessorDTO {
    private String nomeDeUsuario;
    private SalaDTO sala; // referencia direta ao DTO da sala

    public ProfessorDTO() {} // construtor vazio, útil para frameworks
}
