public class Peca {
    private int id;
    private String nome;

    //Método Construtor
    public Peca(int id, String nome){
        this.id = id;
        this.nome = nome;
    }

    //Métodos Getters
    public int getId(){
        return this.id;
    }
    public String getNome(){
        return this.nome;
    }

    //Métodos Setters
    public void setId(int id){
        this.id = id;
    }
    public void setNome(String nome){
        this.nome = nome;
    }

    public void exibirDetalhes(){ 
        System.out.println("Peça: " + nome + " (ID: " + id + ")"); 
    } 
}