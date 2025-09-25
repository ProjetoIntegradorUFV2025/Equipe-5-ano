import java.util.Set;
import java.util.HashSet;

public class Sala {
    
    private byte codigoUnico;
    private Set<Aluno> alunos;

    public Sala() {
        this.alunos = new HashSet<>();
    }

    public Sala(byte codigoUnico, Set<Aluno> alunos) {
        this.codigoUnico = codigoUnico;
        this.alunos = alunos;
    }

    public byte getCodigoUnico() {
        return codigoUnico;
    }

    public void setCodigoUnico(byte codigoUnico) {
        this.codigoUnico = codigoUnico;
    }

    public Set<Aluno> getAlunos() {
        return alunos;
    }

    public void setAlunos(Set<Aluno> alunos) {
        this.alunos = alunos;
    }

}