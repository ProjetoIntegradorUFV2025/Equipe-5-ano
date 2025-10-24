public class PecaMecanica extends Peca{
    private String material;

    PecaMecanica(int id,String nome,String material){

        super(id, nome);
        this.material=material;


    }
       @Override
   public void exibirDetalhes(){
     
    System.out.printf("Peça: %s (Material: %s)",getNome(),this.material);

   }

}
