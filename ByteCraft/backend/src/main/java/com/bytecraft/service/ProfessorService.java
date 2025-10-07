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
    public ProfessorDTO cadastrarProfessor(String nome, String senha, String nomeTurma) {
        // Normaliza entradas
        String nomeTrim = nome != null ? nome.trim() : null;
        String senhaTrim = senha != null ? senha.trim() : null; // opcional, mas evita espaços no início/fim
        String nomeTurmaTrim = nomeTurma != null ? nomeTurma.trim() : null;

        // Validações básicas
        if (nomeTrim == null || nomeTrim.isEmpty() || senhaTrim == null || senhaTrim.isEmpty() || nomeTurmaTrim == null || nomeTurmaTrim.isEmpty()) {
            throw new IllegalArgumentException("Nome, senha e nome da turma são obrigatórios");
        }
        if (senhaTrim.length() < 6) {
            throw new IllegalArgumentException("Senha deve ter no mínimo 6 caracteres");
        }

        // Verifica duplicidade
        if (professorRepository.buscarPorNome(nomeTrim) != null) {
            throw new IllegalStateException("Nome de usuário já existe");
        }

        // Cria sala associada
        Sala sala = salaService.criaSala(nomeTurmaTrim);

        // Cria e persiste professor
        Professor professor = new Professor();
        professor.setNomeDeUsuario(nomeTrim);
        professor.setSenha(passwordEncoder.encode(senhaTrim));
        professor.setSala(sala);

        professorRepository.salvaProfessor(professor);

        // Retorna DTO garantindo que o código da sala esteja presente
        return new ProfessorDTO(professor.getNomeDeUsuario(), SalaDTO.fromEntity(sala));
    }

    public Professor autenticarProfessor(String nome, String senha) {
        String nomeTrim = nome != null ? nome.trim() : null;
        String senhaTrim = senha != null ? senha.trim() : null;

        if (nomeTrim == null || nomeTrim.isEmpty() || senhaTrim == null || senhaTrim.isEmpty()) {
            throw new IllegalArgumentException("Nome e senha são obrigatórios");
        }

        Professor professor = professorRepository.buscarPorNome(nomeTrim);
        if (professor != null && passwordEncoder.matches(senhaTrim, professor.getSenha())) {
            return professor;
        }
        return null;
    }
}
