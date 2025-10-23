public class PecaEletronica extends Peca {
    int tensao;

    public PecaEletronica(int id, String nome, int tensao) {
        super(id, nome);
        this.tensao = tensao;
    }

    @Override
    public void exibirDetalhes() {
        System.out.printf("(ID: %d) Peça: %s - Tensão: %d\n", id, nome, tensao);
    }
}