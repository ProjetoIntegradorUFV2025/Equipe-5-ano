public class Professor {

    private String nomeDeUsuario;
    private String senha;
    private Sala sala;

    public Professor(String nomeDeUsuario, String senha, Sala sala) {
        this.nomeDeUsuario = nomeDeUsuario;
        this.senha = senha;
        this.sala = sala;
    }

    public void setNomeDeUsuario(String nomeDeUsuario){
        this.nomeDeUsuario = nomeDeUsuario;
    }

    public String getNomeDeUsuario(){
        return nomeDeUsuario;
    }

    public void setSenha(String senha){
        this.senha = senha;
    }

    public String getSenha(){
        return senha;
    }

    public void setSala(Sala sala){
        this.sala = sala;
    }

    public Sala getSala(){
        return sala;
    }
    
}
