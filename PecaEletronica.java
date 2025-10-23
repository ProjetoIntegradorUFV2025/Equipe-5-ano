public class PecaEletronica extends Peca {
    private int tensao;

    public PecaEletronica(int id, String nome, int tensao) {
        super(id, nome);
        this.tensao = tensao;
    }

    @Override
    public void exibirDetalhes() {
        System.out.println("Peca Eletronica: " + getNome() + " | Tensao: " + tensao + "V");
    }
}
