package gov.ufv.bytecraft_prototipo.professor;

import gov.ufv.bytecraft_prototipo.sala.Sala;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.util.Optional;

@Repository
public class ProfessorRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public ProfessorRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Autowired
    private ResourceLoader resourceLoader;

    public Optional<Professor> findByCpf(String cpf) {
        try {
            String sql = loadSql("classpath:sql/professor/find_by_cpf.sql");
            Professor professor = jdbcTemplate.queryForObject(sql, new Object[]{cpf}, (rs, rowNum) -> {
                Professor p = new Professor();
                p.setCpf(rs.getString("cpf"));
                p.setNome(rs.getString("nome"));
                p.setSenha(rs.getString("senha"));

                Sala sala = new Sala();
                sala.setSalaId(rs.getLong("sala_id"));
                sala.setProfessor(p);
                p.setSala(sala);

                return p;
            });
            return Optional.ofNullable(professor);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public void save(Professor professor) {
        String sqlProfessor = loadSql("classpath:sql/professor/insert_professor.sql");
        jdbcTemplate.update(sqlProfessor,
                professor.getCpf(),
                professor.getNome(),
                professor.getSenha());

        String sqlSala = loadSql("classpath:sql/sala/insert_sala.sql");
        jdbcTemplate.update(sqlSala,
                professor.getCpf());
    }

    private String loadSql(String path) {
        try {
            Resource resource = resourceLoader.getResource(path);
            return new String(resource.getInputStream().readAllBytes());
        } catch (IOException e) {
            throw new RuntimeException("Erro ao carregar SQL do caminho: " + path, e);
        }
    }
}
