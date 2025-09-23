public class Professor {
    private String nome;
    private String senha;
    private int sala;

    public Professor(String nome, String senha, int sala) {
        setNome(nome);
        setSenha(senha);
        setSala(sala);
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        if (nome == null || nome.trim().isEmpty()) {
            throw new IllegalArgumentException("O nome não pode ser vazio!");
        }
        this.nome = nome;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        if (senha == null || senha.length() < 4) {
            throw new IllegalArgumentException("A senha deve ter pelo menos 4 caracteres!");
        }
        this.senha = senha;
    }

    public int getSala() {
        return sala;
    }

    public void setSala(int sala) {
        if (sala <= 0) {
            throw new IllegalArgumentException("O número da sala deve ser um número positivo!");
        }
        this.sala = sala;
    }

    @Override
    public String toString() {
        return "Professor{" +
                "nome='" + nome + '\'' +
                ", sala=" + sala +
                '}';
    }
}
