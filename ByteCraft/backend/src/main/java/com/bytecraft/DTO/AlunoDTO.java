// AlunoDTO.java
package com.bytecraft.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AlunoDTO {
    private String apelido;
    private String nivel;
    private SalaDTO sala;
}
