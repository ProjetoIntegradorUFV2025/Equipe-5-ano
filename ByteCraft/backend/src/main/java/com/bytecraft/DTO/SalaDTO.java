// SalaDTO.java
package com.bytecraft.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import com.bytecraft.model.Sala;

@Data
@AllArgsConstructor
public class SalaDTO {
    private Long id;
    private String nomeTurma;
    private Byte codigoUnico;


    // Getters e setters ou Lombok @Getter/@Setter

    // Converte entidade para DTO
    public static SalaDTO fromEntity(Sala sala) {
        if (sala == null) return null;
        return new SalaDTO(
            sala.getId(),
            sala.getNomeTurma(),
            sala.getCodigoUnico()
        );
    }
}
