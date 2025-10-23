public class PecaMecanica extends Peca {
    private String material;

    public PecaMecanica(int id, String nome, String material) {
        super(id, nome);
        this.material = material;
    }

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    @Override
    public void exibirDetalhes() {
        System.out.println("Peça Mecânica: " + getNome() + " | Material: " + material);
    }
}
