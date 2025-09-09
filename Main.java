public class Main {
    public static void main(String[] args) {
        Aluno aluno1 = new Aluno("João");
        Aluno aluno2 = new Aluno("Maria");

        Sala sala = new Sala((byte) 1);
        sala.getAlunos().add(aluno1);
        sala.getAlunos().add(aluno2);

        System.out.println("Código da sala: " + sala.getCodigoUnico());
        for (Aluno a : sala.getAlunos()) {
            System.out.println("Aluno: " + a.getApelido());
        }
    }
}
