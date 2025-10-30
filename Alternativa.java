public class Alternativa {
    private String enunciado;
    private boolean correta

    public Alternativa(boolean correta, String enunciado) {
        this.correta = correta;
        this.enunciado = enunciado;
    }

    public boolean isCorreta() {
        return correta;
    }

    public void setCorreta(boolean correta) {
        this.correta = correta;
    }

    public String getEnunciado() {
        return enunciado;
    }

    public void setEnunciado(String enunciado) {
        this.enunciado = enunciado;
    }
}