import java.util.AbstractMap.SimpleEntry;


public class Pergunta {

   
    private String enunciado;
    private SimpleEntry<String, Boolean> alternativaA;
    private SimpleEntry<String, Boolean> alternativaB;
    private SimpleEntry<String, Boolean> alternativaC;
    private SimpleEntry<String, Boolean> alternativaD;
    private NivelDificuldade nivelDificuldade; 

   
    public Pergunta() {
    }

   
    public Pergunta(String enunciado,
                    SimpleEntry<String, Boolean> alternativaA,
                    SimpleEntry<String, Boolean> alternativaB,
                    SimpleEntry<String, Boolean> alternativaC,
                    SimpleEntry<String, Boolean> alternativaD,
                    NivelDificuldade nivelDificuldade) {
        this.enunciado = enunciado;
        this.alternativaA = alternativaA;
        this.alternativaB = alternativaB;
        this.alternativaC = alternativaC;
        this.alternativaD = alternativaD;
        this.nivelDificuldade = nivelDificuldade;
    }

    public String getEnunciado() {
        return enunciado;
    }

    public SimpleEntry<String, Boolean> getAlternativaA() {
        return alternativaA;
    }

    public SimpleEntry<String, Boolean> getAlternativaB() {
        return alternativaB;
    }

    public SimpleEntry<String, Boolean> getAlternativaC() {
        return alternativaC;
    }

    public SimpleEntry<String, Boolean> getAlternativaD() {
        return alternativaD;
    }

    public NivelDificuldade getNivelDificuldade() {
        return nivelDificuldade;
    }

    
    public void setEnunciado(String enunciado) {
        this.enunciado = enunciado;
    }

    public void setAlternativaA(SimpleEntry<String, Boolean> alternativaA) {
        this.alternativaA = alternativaA;
    }

    public void setAlternativaB(SimpleEntry<String, Boolean> alternativaB) {
        this.alternativaB = alternativaB;
    }

    public void setAlternativaC(SimpleEntry<String, Boolean> alternativaC) {
        this.alternativaC = alternativaC;
    }

    public void setAlternativaD(SimpleEntry<String, Boolean> alternativaD) {
        this.alternativaD = alternativaD;
    }

    public void setNivelDificuldade(NivelDificuldade nivelDificuldade) {
        this.nivelDificuldade = nivelDificuldade;
    }
}