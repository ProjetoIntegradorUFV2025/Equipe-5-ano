import java.util.AbstractMap.SimpleEntry;

public class Pergunta {
    private String enunciado;
    private SimpleEntry<String, Boolean> alternativaA;
    private SimpleEntry<String, Boolean> alternativaB;
    private SimpleEntry<String, Boolean> alternativaC;
    private SimpleEntry<String, Boolean> alternativaD;
    private NivelDificuldadeEnum nivelDificuldade;

    public Pergunta(String enunciado,
                    SimpleEntry<String, Boolean> alternativaA,
                    SimpleEntry<String, Boolean> alternativaB,
                    SimpleEntry<String, Boolean> alternativaC,
                    SimpleEntry<String, Boolean> alternativaD,
                    NivelDificuldadeEnum nivelDificuldade) {
        this.enunciado = enunciado;
        this.alternativaA = alternativaA;
        this.alternativaB = alternativaB;
        this.alternativaC = alternativaC;
        this.alternativaD = alternativaD;
        this.nivelDificuldade = nivelDificuldade;
    }
    
    public enum NivelDificuldadeEnum {
        FACIL,
        MEDIO,
        DIFICIL
    }

    public String getEnunciado() {
        return enunciado;
    }

    public void setEnunciado(String enunciado) {
        this.enunciado = enunciado;
    }

    public SimpleEntry<String, Boolean> getAlternativaA() {
        return alternativaA;
    }

    public void setAlternativaA(SimpleEntry<String, Boolean> alternativaA) {
        this.alternativaA = alternativaA;
    }

    public SimpleEntry<String, Boolean> getAlternativaB() {
        return alternativaB;
    }

    public void setAlternativaB(SimpleEntry<String, Boolean> alternativaB) {
        this.alternativaB = alternativaB;
    }

    public SimpleEntry<String, Boolean> getAlternativaC() {
        return alternativaC;
    }

    public void setAlternativaC(SimpleEntry<String, Boolean> alternativaC) {
        this.alternativaC = alternativaC;
    }

    public SimpleEntry<String, Boolean> getAlternativaD() {
        return alternativaD;
    }

    public void setAlternativaD(SimpleEntry<String, Boolean> alternativaD) {
        this.alternativaD = alternativaD;
    }

    public NivelDificuldadeEnum getNivelDificuldade() {
        return nivelDificuldade;
    }

    public void setNivelDificuldade(NivelDificuldadeEnum nivelDificuldade) {
        this.nivelDificuldade = nivelDificuldade;
    }

    public void exibirPergunta() {
        System.out.println("Pergunta: " + enunciado);
        System.out.println("A) " + alternativaA.getKey());
        System.out.println("B) " + alternativaB.getKey());
        System.out.println("C) " + alternativaC.getKey());
        System.out.println("D) " + alternativaD.getKey());
        System.out.println("Nível: " + nivelDificuldade);
    }

}