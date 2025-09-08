package gov.ufv.bytecraft_prototipo.aluno;

import gov.ufv.bytecraft_prototipo.sala.Sala;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class AlunoRepository {
    private final JdbcTemplate jdbcTemplate;
    private final ResourceLoader resourceLoader;

    @Autowired
    public AlunoRepository(JdbcTemplate jdbcTemplate, ResourceLoader resourceLoader) {
        this.jdbcTemplate = jdbcTemplate;
        this.resourceLoader = resourceLoader;
    }

    public Aluno save(Aluno aluno) {
        String sql = loadSql("classpath:sql/aluno/insert_aluno.sql");
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, aluno.getNome());
            ps.setInt(2, aluno.getPontuacao());
            ps.setLong(3, aluno.getSala().getSalaId());
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        aluno.setAlunoId(key != null ? key.longValue() : null);

        return aluno;
    }

    public List<Aluno> findAll() {
        String sql = loadSql("classpath:sql/aluno/find_all.sql");
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Aluno aluno = new Aluno();
            aluno.setAlunoId(rs.getLong("aluno_id"));
            aluno.setNome(rs.getString("nome"));
            aluno.setPontuacao(rs.getInt("pontuacao"));

            Sala sala = new Sala();
            sala.setSalaId(rs.getLong("sala_id"));
            aluno.setSala(sala);

            return aluno;
        });
    }

    public List<Aluno> findBySalaOrderByPontuacaoDesc(Long salaId) {
        String sql = loadSql("classpath:sql/aluno/find_by_sala_ordered.sql");
        return jdbcTemplate.query(sql, new Object[]{salaId}, (rs, rowNum) -> {
            Aluno aluno = new Aluno();
            aluno.setAlunoId(rs.getLong("aluno_id"));
            aluno.setNome(rs.getString("nome"));
            aluno.setPontuacao(rs.getInt("pontuacao"));

            Sala sala = new Sala();
            sala.setSalaId(rs.getLong("sala_id"));
            aluno.setSala(sala);

            return aluno;
        });
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
