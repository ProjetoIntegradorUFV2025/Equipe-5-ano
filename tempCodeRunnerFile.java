public class Peca {

    //criando a classe
    private int id;
    private String nome;

    // construtor
    public Peca(int id, String nome) {
        this.id = id;
        this.nome = nome;
    }

    // getters e setters para id
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    // getters e setters para nome
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
