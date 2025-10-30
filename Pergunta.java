public class Pergunta {
    private String enunciado;
    private Alternativa AlternativaA;
    private Alternativa AlternativaB;
    private Alternativa AlternativaC;
    private Alternativa AlternativaD;
    private nivelDificuldadeEnum nivelDificuldade;

    public Pergunta(String enunciado, Alternativa alternativaA, Alternativa alternativaB,
                    Alternativa alternativaC, Alternativa alternativaD, nivelDificuldadeEnum nivelDificuldade) {
        this.enunciado = enunciado;
        AlternativaA = alternativaA;
        AlternativaB = alternativaB;
        AlternativaC = alternativaC;
        AlternativaD = alternativaD;
        this.nivelDificuldade = nivelDificuldade;
    }

    public String getEnunciado() {
        return enunciado;
    }

    public void setEnunciado(String enunciado) {
        this.enunciado = enunciado;
    }

    public Alternativa getAlternativaA() {
        return AlternativaA;
    }

    public void setAlternativaA(Alternativa alternativaA) {
        AlternativaA = alternativaA;
    }

    public Alternativa getAlternativaB() {
        return AlternativaB;
    }

    public void setAlternativaB(Alternativa alternativaB) {
        AlternativaB = alternativaB;
    }

    public Alternativa getAlternativaC() {
        return AlternativaC;
    }

    public void setAlternativaC(Alternativa alternativaC) {
        AlternativaC = alternativaC;
    }

    public Alternativa getAlternativaD() {
        return AlternativaD;
    }

    public void setAlternativaD(Alternativa alternativaD) {
        AlternativaD = alternativaD;
    }

    public nivelDificuldadeEnum getNivelDificuldade() {
        return nivelDificuldade;
    }

    public void setNivelDificuldade(nivelDificuldadeEnum nivelDificuldade) {
        this.nivelDificuldade = nivelDificuldade;
    }
}