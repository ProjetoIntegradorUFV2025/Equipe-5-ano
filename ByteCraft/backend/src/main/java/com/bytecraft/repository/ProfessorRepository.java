package com.bytecraft.repository;

import com.bytecraft.model.Professor;
import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

@Repository
public class ProfessorRepository {

    @PersistenceContext
    private EntityManager em;

    @Transactional
    public int salvaProfessor(Professor professor) {
        try {
            em.persist(professor);
            return 1; // sucesso
        } catch (Exception e) {
            e.printStackTrace();
            return 0; // falha
        }
    }

    public Professor buscarPorNome(String nomeDeUsuario) {
        try {
            return em.createQuery(
                            "SELECT p FROM Professor p WHERE p.nomeDeUsuario = :nome", Professor.class)
                    .setParameter("nome", nomeDeUsuario)
                    .getSingleResult();
        } catch (Exception e) {
            return null; // caso não encontre
        }
    }
}
