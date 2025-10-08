public class Peca{
    private int id;
    private String nome;

    public Peca(int id, String nome){
        this.id = id;
        this.nome = nome;
    }

    //Metodos Getters
    public int getId(){
        return id;
    }
    public String getNome(){
        return nome;
    }

    //Metodos setters
    public void setId(int id){
        this.id = id;
    }
    public void setNome(String nome){
        this.nome = nome;
    }
}