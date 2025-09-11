public class Sala {
    public byte codigoUnico;
    public Aluno[] alunos;

    public Sala(byte codigoUnico, Aluno[] alunos) {
        this.codigoUnico = codigoUnico;
        this.alunos = alunos;
    }

    public byte getCodigoUnico() {
        return codigoUnico;
    }

    public void setCodigoUnico(byte codigoUnico) {
        this.codigoUnico = codigoUnico;
    }

    public Aluno[] getAlunos() {
        return alunos;
    }

    public void setAlunos(Aluno[] alunos) {
        this.alunos = alunos;
    }
}
