import java.util.Set;
import java.util.HashSet;

public class Sala {
    private byte codigoUnico;
    private Set<Aluno> alunos;

    public Sala(byte codigoUnico){
        this.codigoUnico = codigoUnico;
        this.alunos = new HashSet<>();
    }

    // Métodos getters
    public byte getCodigoUnico(){
        return codigoUnico;
    }
    public Set<Aluno> getAlunos(){
        return alunos;
    }

    // Métodos setters
    public void setCodigoUnico(byte codigoUnico){
        this.codigoUnico = codigoUnico;
    }
    public void setAlunos(Set<Aluno> alunos){
        this.alunos = alunos;
    }
}
