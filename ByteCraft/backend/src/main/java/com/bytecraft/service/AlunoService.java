package com.bytecraft.service;

import com.bytecraft.DTO.AlunoDTO;
import com.bytecraft.DTO.SalaDTO;
import com.bytecraft.model.Aluno;
import com.bytecraft.model.Sala;
import com.bytecraft.repository.AlunoRepository;
import com.bytecraft.repository.SalaRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AlunoService {

    private final AlunoRepository alunoRepository;
    private final SalaRepository salaRepository;

    // Vincula aluno à sala
    public Aluno vincularAlunoASala(String apelido, Byte codigoSala) {
        Sala sala = salaRepository.findByCodigoUnico(codigoSala)
                .orElseThrow(() -> new RuntimeException("Sala não encontrada"));

        Optional<Aluno> existente = alunoRepository.findByApelidoAndSala(apelido, sala);
        if (existente.isPresent()) return existente.get();

        Aluno novo = new Aluno();
        novo.setApelido(apelido);
        novo.setSala(sala);
        return alunoRepository.save(novo);
    }

    // Atualiza nível do aluno
    @Transactional
    public void registraNivel(Aluno aluno) {
        alunoRepository.atualizaNivel(aluno.getNivel(), aluno.getApelido(), aluno.getSala());
    }

    // Busca aluno em uma sala
    public Aluno findAluno(String apelido, Byte codigoSala) {
        Sala sala = salaRepository.findByCodigoUnico(codigoSala)
                .orElseThrow(() -> new RuntimeException("Sala não encontrada"));

        return alunoRepository.findByApelidoAndSala(apelido, sala)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
    }

    public AlunoDTO toDTO(Aluno aluno) {
        Sala sala = aluno.getSala();
        SalaDTO salaDTO = new SalaDTO(sala.getId(), sala.getNomeTurma(), sala.getCodigoUnico());
        return new AlunoDTO(aluno.getApelido(), aluno.getNivel().name(), salaDTO);
    }
}
