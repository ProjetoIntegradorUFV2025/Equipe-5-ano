public class PecaEletronica extends Peca {
    
      private int tensao;

      
    
      
    
    
    PecaEletronica(int id,String nome,int tensao){

        super(id, nome);
        this.tensao=tensao;
        


    }
    @Override
   public void exibirDetalhes(){
     
    System.out.printf("Peça: %s (tensao: %s)",getNome(),this.tensao);

   }
}
