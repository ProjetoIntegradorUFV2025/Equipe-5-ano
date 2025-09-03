public class HelloWorld {
    public static void main(String[] args) {
        int resultado = somar(5, 10);
        System.out.println("O resultado da soma é: " + resultado);  
    }


    public static int somar(int a, int b) {
        return a + b;
    }
}