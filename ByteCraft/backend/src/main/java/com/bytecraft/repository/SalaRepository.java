package com.bytecraft.repository;

import com.bytecraft.model.Sala;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SalaRepository extends JpaRepository<Sala, Long> {

    // Buscar sala pelo código único
    @Query("SELECT s FROM Sala s WHERE s.codigoUnico = :codigoUnico")
    Optional<Sala> buscarPorCodigo(Byte codigoUnico);

    // Buscar todas as salas
    @Query("SELECT s FROM Sala s")
    List<Sala> buscarSalas();

    // Buscar sala pelo nome da turma
    @Query("SELECT s FROM Sala s WHERE s.nomeTurma = :nomeTurma")
    Optional<Sala> buscarSala(String nomeTurma);

    // Buscar ID da sala pelo código único
    @Query("SELECT s.id FROM Sala s WHERE s.codigoUnico = :codigoUnico")
    Long buscarSalaID(@Param("codigoUnico") Byte codigoUnico);

    @Query("SELECT p.sala FROM Professor p WHERE p.id = :id")
    Sala buscarPorProfessor(@Param("id") Long id);

}
