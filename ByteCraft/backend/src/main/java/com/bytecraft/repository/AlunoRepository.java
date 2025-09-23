package com.bytecraft.repository;

import com.bytecraft.enums.NivelDificuldadeEnum;
import com.bytecraft.model.Aluno;
import com.bytecraft.model.Sala;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import java.util.Optional;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {

    // Buscar aluno por apelido e sala (único por sala)
    Optional<Aluno> findByApelidoAndSala(String apelido, Sala sala);

    // Buscar aluno só por apelido
    Optional<Aluno> findByApelido(String apelido);

    // Atualizar nível considerando apelido + sala
    @Modifying
    @Transactional
    @Query("UPDATE Aluno a SET a.nivel = :nivel WHERE a.apelido = :apelido AND a.sala = :sala")
    int atualizaNivel(NivelDificuldadeEnum nivel, String apelido, Sala sala);
}
