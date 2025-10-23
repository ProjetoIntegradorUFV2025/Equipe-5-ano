public class Peca {
    int id;
    String nome;

    public Peca(int id, String nome) {
        this.id = id;
        this.nome = nome;
    }

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }

    public void exibirDetalhes() {
        System.out.printf("(ID: %d) Peça: %s\n", id, nome);
    }
}