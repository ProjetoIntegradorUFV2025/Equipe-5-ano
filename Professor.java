class Professor {
    String nomeDeUsuario;
    String senha;
    Sala sala;

    public String getNomeDeUsuario() {
        return nomeDeUsuario;
    }
    public String getSenha() {
        return senha;
    }
    public Sala getSala() {
        return sala;
    }

    public void setNomeDeUsuario(String nomeDeUsuario) {
        this.nomeDeUsuario = nomeDeUsuario;
    }
    public void setSenha(String senha) {
        this.senha = senha;
    }
    public void setSala(Sala sala) {
        this.sala = sala;
    }
}