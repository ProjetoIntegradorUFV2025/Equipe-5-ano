public class Professor {
    private String nomeDeUsuario;
    private String senha;
    private Sala sala;

    public Professor(String nomeDeUsuario, String senha, Sala sala){
        this.nomeDeUsuario = nomeDeUsuario;
        this.senha = senha;
        this.sala = sala;

    }

    //getters
    public String getNomeDeUsuario(){
        return nomeDeUsuario;
    }
    public String getSenha(){
        return senha;
    }
    public Sala getSala(){
        return sala;
    }

    //setters
    public void setNomedeUsuario(String nomeDeUsuario){
        this.nomeDeUsuario = nomeDeUsuario;
    }
    public void setSenha(String senha){
        this.senha = senha;
    }
    public void setSala(Sala sala){
        this.sala = sala;
    }
}
