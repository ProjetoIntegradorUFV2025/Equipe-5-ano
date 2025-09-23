package com.bytecraft.repository;

import com.bytecraft.model.Sala;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SalaRepository extends JpaRepository<Sala, Long> {
    Optional<Sala> findByCodigoUnico(Byte codigoUnico);
    Optional<Sala> findByNomeTurma(String nomeTurma);
    List<Sala> findAll();
}
