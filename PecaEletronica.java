public class PecaEletronica extends Peca {
    private int tensao;

    public PecaEletronica(int id, String nome, int tensao) {
        super(id, nome);
        this.tensao = tensao;
    }

    public int getTensao() {
        return tensao;
    }

    public void setTensao(int tensao) {
        this.tensao = tensao;
    }

    @Override
    public void exibirDetalhes() {
        System.out.println("Peça Eletrônica: " + getNome() + " | Tensão: " + tensao + "V");
    }
}
