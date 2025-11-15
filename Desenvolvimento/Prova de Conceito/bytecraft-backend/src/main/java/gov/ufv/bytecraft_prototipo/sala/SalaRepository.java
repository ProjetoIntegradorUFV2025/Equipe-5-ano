package gov.ufv.bytecraft_prototipo.sala;

import gov.ufv.bytecraft_prototipo.professor.Professor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class SalaRepository {
    private final JdbcTemplate jdbcTemplate;
    private final ResourceLoader resourceLoader;

    @Autowired
    public SalaRepository(JdbcTemplate jdbcTemplate, ResourceLoader resourceLoader) {
        this.jdbcTemplate = jdbcTemplate;
        this.resourceLoader = resourceLoader;
    }

    public Sala save(Sala sala) {
        String sql = loadSql("classpath:sql/sala/insert_sala.sql");
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, sala.getProfessor().getCpf());
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        sala.setSalaId(key != null ? key.longValue() : null);

        return sala;
    }

    public List<Sala> findAll() {
        String sql = loadSql("classpath:sql/sala/find_all.sql");
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Sala sala = new Sala();
            sala.setSalaId(rs.getLong("sala_id"));

            Professor professor = new Professor();
            professor.setCpf(rs.getString("cpf"));
            professor.setNome(rs.getString("nome"));
            professor.setSenha(rs.getString("senha"));
            sala.setProfessor(professor);

            return sala;
        });
    }

    public Sala findByProfessorCpf(String cpf) {
        String sql = loadSql("classpath:sql/sala/find_by_professor_cpf.sql.sql");
        try {
            return jdbcTemplate.queryForObject(sql, new Object[]{cpf}, (rs, rowNum) -> {
                Sala sala = new Sala();
                sala.setSalaId(rs.getLong("sala_id"));

                Professor professor = new Professor();
                professor.setCpf(rs.getString("cpf"));
                professor.setNome(rs.getString("nome"));
                professor.setSenha(rs.getString("senha"));
                sala.setProfessor(professor);

                return sala;
            });
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public Sala findById(Long salaId) {
        String sql = "SELECT sala_id FROM sala WHERE sala_id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new Object[]{salaId}, (rs, rowNum) -> {
                Sala sala = new Sala();
                sala.setSalaId(rs.getLong("sala_id"));
                return sala;
            });
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    private String loadSql(String path) {
        try {
            Resource resource = resourceLoader.getResource(path);
            return new String(resource.getInputStream().readAllBytes());
        } catch (IOException e) {
            throw new RuntimeException("Erro ao carregar SQL: " + path, e);
        }
    }
}
