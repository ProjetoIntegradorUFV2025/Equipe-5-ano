public class Professor{
    public string nomeDeUsuario;
    public string senha;
    public Sala sala;

    public string getNomeDeUsuario() {
        return nomeDeUsuario;
    }
    public void setNomeDeUsuario(string nomeDeUsuario) {
        this.nomeDeUsuario = nomeDeUsuario;
    }
    public string getSenha() {
        return senha;
    }
    public void setSenha(string senha) {
        this.senha = senha;
    }
    public Sala getSala() {
        return sala;
    }
    public void setSala(Sala sala) {
        this.sala = sala;
    }
}