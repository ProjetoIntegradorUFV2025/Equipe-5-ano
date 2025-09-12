public class Sala {
    byte codigoUnico;
    Aluno alunos;
 
    public byte getCodigoUnico() {
        return codigoUnico;
    }
    public void setCodigoUnico(byte codigounico) {
        this.codigoUnico = codigounico;
    }

    public Aluno getAluno() {
        return alunos;
    }
    public void setAluno(Aluno aluno) {
        this.alunos = aluno;
    }
}