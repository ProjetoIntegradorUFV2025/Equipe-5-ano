package com.bytecraft.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bytecraft.enums.NivelDificuldadeEnum;
import com.bytecraft.model.Pergunta;

@Repository
public interface PerguntaRepository extends JpaRepository<Pergunta, Long> {

    //Querry de
    @Query("")
    List<Pergunta> buscarPorNivel(@Param("nivel") NivelDificuldadeEnum nivel);

       
}
