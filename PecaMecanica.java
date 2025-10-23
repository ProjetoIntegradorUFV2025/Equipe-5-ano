public class PecaMecanica extends Peca {
    private String material;

    public PecaMecanica(int id, String nome, String material){
        super(id, nome);
        this.material = material;
    }

    @Override

    public void exibirDetalhes(){
        System.out.println("Peca Mecanica: " + getNome() + "\n    Material: " + material);
    }
}