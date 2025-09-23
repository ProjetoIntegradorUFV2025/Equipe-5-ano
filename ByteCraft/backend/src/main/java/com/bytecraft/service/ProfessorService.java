package com.bytecraft.service;

import com.bytecraft.DTO.ProfessorDTO;
import com.bytecraft.DTO.SalaDTO;
import com.bytecraft.model.Professor;
import com.bytecraft.model.Sala;
import com.bytecraft.repository.ProfessorRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

public class ProfessorService {

    // Cadastra professor e cria sala se não existir
    public static boolean cadastrarProfessor(String nome, String senha, String nomeTurma,
                                            ProfessorRepository professorRepo,
                                            SalaService salaService,
                                            PasswordEncoder passwordEncoder) {

        // RN02: senha mínima 6 caracteres
        if (senha == null || senha.length() < 6) {
            throw new IllegalArgumentException("Senha deve ter no mínimo 6 caracteres");
        }

        // RN03: nome de usuário único
        if (professorRepo.buscarPorNome(nome) != null) {
            return false;
        }

        // Cria ou obtém sala
        Sala sala = salaService.criaSala(nomeTurma);

        // Cria professor com senha codificada
        Professor professor = new Professor();
        professor.setNomeDeUsuario(nome);
        professor.setSenha(passwordEncoder.encode(senha));
        professor.setSala(sala);

        // Salva professor no banco
        return professorRepo.salvaProfessor(professor) == 1;
    }

    // Autentica professor
    public static boolean autenticarProfessor(String nome, String senha,
                                              ProfessorRepository professorRepo,
                                              PasswordEncoder passwordEncoder) {
        Professor professor = professorRepo.buscarPorNome(nome);
        return professor != null && passwordEncoder.matches(senha, professor.getSenha());
    }

    // Converte Professor -> ProfessorDTO
    public static ProfessorDTO toDTO(Professor professor) {
        return new ProfessorDTO(
                professor.getNomeDeUsuario(),
                professor.getSala() != null ? SalaDTO.fromEntity(professor.getSala()) : null
        );
    }
}
