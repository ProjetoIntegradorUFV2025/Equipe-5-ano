package gov.ufv.bytecraft_prototipo.controller;

import gov.ufv.bytecraft_prototipo.professor.Professor;
import gov.ufv.bytecraft_prototipo.professor.ProfessorRepository;
import gov.ufv.bytecraft_prototipo.sala.Sala;
import gov.ufv.bytecraft_prototipo.sala.SalaRepository;
import gov.ufv.bytecraft_prototipo.sala.SalaRequestDTO;
import gov.ufv.bytecraft_prototipo.sala.SalaResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/sala")
public class SalaController {

    private final SalaRepository salaRepository;
    private final ProfessorRepository professorRepository;

    public SalaController(SalaRepository salaRepository, ProfessorRepository professorRepository) {
        this.salaRepository = salaRepository;
        this.professorRepository = professorRepository;
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @PostMapping("/cadastrar")
    public ResponseEntity<SalaResponseDTO> cadastrar(@RequestBody SalaRequestDTO data) {
        Professor professor = professorRepository.findByCpf(data.cpfProfessor())
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));

        Sala sala = new Sala(professor);
        professor.setSala(sala);

        Sala saved = salaRepository.save(sala);

        return ResponseEntity.ok(new SalaResponseDTO(saved));
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping("/listar")
    public ResponseEntity<List<SalaResponseDTO>> listar() {
        List<SalaResponseDTO> salas = salaRepository.findAll()
                .stream()
                .map(SalaResponseDTO::new)
                .toList();

        return ResponseEntity.ok(salas);
    }

    @CrossOrigin(origins = "*", allowedHeaders = "*")
    @GetMapping("/professor/{cpf}")
    public ResponseEntity<SalaResponseDTO> buscarPorProfessor(@PathVariable String cpf) {
        Sala sala = salaRepository.findByProfessorCpf(cpf);
        if (sala == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new SalaResponseDTO(sala));
    }
}

