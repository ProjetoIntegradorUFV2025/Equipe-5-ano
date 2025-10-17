package com.bytecraft.repository;

import com.bytecraft.enums.NivelDificuldadeEnum;
import com.bytecraft.model.Aluno;
import com.bytecraft.model.Sala;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import java.util.Optional;
import java.util.List;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {

    // Atualizar nível considerando apelido + sala
    @Modifying
    @Transactional
    @Query("UPDATE Aluno a SET a.nivel = :nivel WHERE a.apelido = :apelido AND a.sala = :sala")
    int atualizaNivel(NivelDificuldadeEnum nivel, String apelido, Sala sala);

    // Buscar aluno por apelido e sala (único por sala)
    @Query("SELECT a FROM Aluno a WHERE a.apelido = :apelido AND a.sala = :sala")
    Optional<Aluno> buscarPorApelidoESala(String apelido, Sala sala);

    // Buscar aluno só por apelido
    @Query("SELECT a FROM Aluno a WHERE a.apelido = :apelido")
    Optional<Aluno> buscarPorApelido(String apelido);
    
    // Atualizar pontuação considerando id do aluno
    @Modifying
    @Transactional
    @Query("UPDATE Aluno a SET a.pontuacao = :pontuacao WHERE a.id = :id")
    int atualizaPontuacao(@Param("id") Long id, @Param("pontuacao") int pontuacao);

    // Buscar alunos por sala
    @Query("SELECT a FROM Aluno a WHERE a.sala.id = :id")
    Optional<List<Aluno>> buscarPorSala(@Param("id") Long id);
}
