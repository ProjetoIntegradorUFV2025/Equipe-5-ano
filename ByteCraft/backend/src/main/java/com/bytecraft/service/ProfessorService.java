package com.bytecraft.service;

import com.bytecraft.model.Professor;
import com.bytecraft.model.Sala;
import com.bytecraft.DTO.ProfessorDTO;
import com.bytecraft.DTO.SalaDTO;
import com.bytecraft.repository.ProfessorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class ProfessorService {

    private final ProfessorRepository professorRepository;
    private final SalaService salaService;
    private final PasswordEncoder passwordEncoder;

    // Cadastra professor e cria sala se não existir
    // Retorna Professor para ser convertido no Controller
    public ProfessorDTO cadastrarProfessor(String nome, String senha, String nomeTurma) {
        if (senha == null || senha.length() < 6) {
            throw new IllegalArgumentException("Senha deve ter no mínimo 6 caracteres");
        }
        if (professorRepository.buscarPorNome(nome) != null) {
            throw new IllegalStateException("Nome de usuário já existe");
        }
    
        Sala sala = salaService.criaSala(nomeTurma);
    
        Professor professor = new Professor();
        professor.setNomeDeUsuario(nome);
        professor.setSenha(passwordEncoder.encode(senha));
        professor.setSala(sala);
    
        professorRepository.salvaProfessor(professor);
    
        // Retorna DTO garantindo que o código da sala esteja presente
        return new ProfessorDTO(professor.getNomeDeUsuario(), SalaDTO.fromEntity(sala));
    }

    public Professor autenticarProfessor(String nome, String senha) {
        Professor professor = professorRepository.buscarPorNome(nome);
        if (professor != null && passwordEncoder.matches(senha, professor.getSenha())) {
            return professor;
        }
        return null;
    }

}
