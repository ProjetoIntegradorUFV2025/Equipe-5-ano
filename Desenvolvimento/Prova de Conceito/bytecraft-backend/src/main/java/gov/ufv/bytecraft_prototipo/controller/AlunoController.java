package gov.ufv.bytecraft_prototipo.controller;

import gov.ufv.bytecraft_prototipo.aluno.Aluno;
import gov.ufv.bytecraft_prototipo.aluno.AlunoRepository;
import gov.ufv.bytecraft_prototipo.aluno.AlunoRequestDTO;
import gov.ufv.bytecraft_prototipo.aluno.AlunoResponseDTO;
import gov.ufv.bytecraft_prototipo.sala.Sala;
import gov.ufv.bytecraft_prototipo.sala.SalaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/aluno")
public class AlunoController {

    private final AlunoRepository alunoRepository;
    private final SalaRepository salaRepository;

    public AlunoController(AlunoRepository alunoRepository, SalaRepository salaRepository) {
        this.alunoRepository = alunoRepository;
        this.salaRepository = salaRepository;
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @PostMapping("/cadastrar")
    public ResponseEntity<AlunoResponseDTO> cadastrar(@RequestBody AlunoRequestDTO data) {
        Sala sala = salaRepository.findById(data.salaId());
        if (sala == null) {
            throw new RuntimeException("Sala não encontrada");
        }

        Aluno aluno = new Aluno(data.nome(), data.pontuacao(), sala);
        Aluno saved = alunoRepository.save(aluno);

        return ResponseEntity.ok(new AlunoResponseDTO(saved));
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping("/listar")
    public ResponseEntity<List<AlunoResponseDTO>> listar() {
        List<AlunoResponseDTO> alunos = alunoRepository.findAll()
                .stream()
                .map(AlunoResponseDTO::new)
                .toList();
        return ResponseEntity.ok(alunos);
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping("/sala/{salaId}")
    public ResponseEntity<List<AlunoResponseDTO>> listarPorSala(@PathVariable Long salaId) {
        List<AlunoResponseDTO> alunos = alunoRepository.findBySalaOrderByPontuacaoDesc(salaId)
                .stream()
                .map(AlunoResponseDTO::new)
                .toList();
        return ResponseEntity.ok(alunos);
    }
}

