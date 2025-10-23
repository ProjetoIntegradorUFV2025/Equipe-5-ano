import java.util.ArrayList;
public class Main {
    public static void main(String[] args) {
        ArrayList<Peca> pecas = new ArrayList<>();
        pecas.add(new PecaMecanica(1, "Parafuso", "Aço")); //Exemplos
        pecas.add(new PecaEletronica(2, "Sensor", 5));
        for (Peca p : pecas) {
            p.exibirDetalhes(); // Polimorfismo
        }
    }
}
