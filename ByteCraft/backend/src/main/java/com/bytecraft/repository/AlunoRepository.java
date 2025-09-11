package com.bytecraft.repository;

import com.bytecraft.model.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, String> {

    @Modifying
    @Transactional
    @Query("UPDATE Aluno a SET a.nivel = :#{#aluno.nivel} WHERE a.apelido = :#{#aluno.apelido}")
    int atualizaNivel(Aluno aluno);
}
