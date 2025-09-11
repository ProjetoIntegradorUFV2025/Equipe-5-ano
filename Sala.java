import java.util.Set;

public class Sala {
    private byte codigoUnico;
    private Set<Aluno> alunos;

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
