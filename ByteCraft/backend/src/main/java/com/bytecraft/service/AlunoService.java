package com.bytecraft.service;

import com.bytecraft.enums.NivelDificuldadeEnum;
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
        Sala sala = salaRepository.buscarPorCodigo(codigoSala)
                .orElseThrow(() -> new RuntimeException("Sala não encontrada"));

        Optional<Aluno> existente = alunoRepository.buscarPorApelidoESala(apelido, sala);
        if (existente.isPresent()) return existente.get();

        Aluno novo = new Aluno();
        novo.setApelido(apelido);
        novo.setSala(sala);
        return alunoRepository.save(novo);
    }

    @Transactional
    public boolean registraNivel(NivelDificuldadeEnum nivel, String apelido, Byte codigoSala) {
        // Primeiro busca a sala
        Sala sala = salaRepository.buscarPorCodigo(codigoSala)
                .orElseThrow(() -> new RuntimeException("Sala não encontrada"));

        // Busca o aluno pelo apelido e sala
        return alunoRepository.buscarPorApelidoESala(apelido, sala)
                .map(aluno -> {
                    aluno.setNivel(nivel);
                    alunoRepository.save(aluno); // persiste a alteração
                    return true; // sucesso
                })
                .orElse(false); // aluno não encontrado
    }

    // Busca aluno em uma sala
    public Aluno findAluno(String apelido, Byte codigoSala) {
        Sala sala = salaRepository.buscarPorCodigo(codigoSala)
                .orElseThrow(() -> new RuntimeException("Sala não encontrada"));

        return alunoRepository.buscarPorApelidoESala(apelido, sala)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
    }

}
