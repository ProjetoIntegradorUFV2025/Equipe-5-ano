public class PecaMecanica extends Peca {
    String material;

    public PecaMecanica(int id, String nome, String material) {
        super(id, nome);
        this.material = material;
    }

    @Override
    public void exibirDetalhes() {
        System.out.printf("(ID: %d) Peça: %s - Material: %s\n", id, nome, material);
    }
}