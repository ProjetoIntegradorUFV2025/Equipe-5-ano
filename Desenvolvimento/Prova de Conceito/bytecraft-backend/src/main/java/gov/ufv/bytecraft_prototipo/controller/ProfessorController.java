package gov.ufv.bytecraft_prototipo.controller;

import gov.ufv.bytecraft_prototipo.professor.Professor;
import gov.ufv.bytecraft_prototipo.professor.ProfessorRepository;
import gov.ufv.bytecraft_prototipo.professor.ProfessorRequestDTO;
import gov.ufv.bytecraft_prototipo.professor.ProfessorResponseDTO;
import gov.ufv.bytecraft_prototipo.sala.Sala;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/professor")
public class ProfessorController {

    @Autowired
    private ProfessorRepository professorRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @PostMapping("/login")
    public ProfessorResponseDTO login(@RequestBody ProfessorRequestDTO dto) {
        Professor professor = professorRepository.findByCpf(dto.cpf())
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));

        if (!passwordEncoder.matches(dto.senha(), professor.getSenha())) {
            throw new RuntimeException("Senha inválida");
        }

        return new ProfessorResponseDTO(professor.getCpf(), professor.getNome(), professor.getSala().getSalaId());
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @PostMapping("/cadastrar")
    @Transactional
    public void cadastrar(@RequestBody ProfessorRequestDTO data) {
        String senhaCriptografada = passwordEncoder.encode(data.senha());
        Professor professor = new Professor(data, senhaCriptografada);
        professor.setSala(new Sala(professor));
        professorRepository.save(professor);
    }
}