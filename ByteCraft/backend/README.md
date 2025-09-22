Criando o Banco de Dados "bytecraft" no MySQL (Apenas para Testes)

Criando um banco de dados chamado `bytecraft`, criar um usuário dedicado, conceder permissões e testar a conexão no MySQL.

Acessar o MySQL

No Linux, você pode acessar de duas formas, dependendo da configuração do MySQL:

- Se o MySQL pedir senha para o root:

mysql -u root -p

Geralmente é só dar enter quando pedir a senha.

Se o root do MySQL estiver vinculado ao root do sistema (com sudo):

sudo mysql -u root

Criar Banco de Dados e Usuário
Depois de entrar no console do MySQL, execute os seguintes comandos:


CREATE DATABASE bytecraft CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'bytecraft_user'@'localhost' IDENTIFIED BY 'senha123';

GRANT ALL PRIVILEGES ON bytecraft.* TO 'bytecraft_user'@'localhost';

FLUSH PRIVILEGES;


Testar o Novo Usuário
Saia do MySQL:

exit

Faça login com o novo usuário:

mysql -u bytecraft_user -p
Digite a senha (senha123) quando solicitado.

Dentro do MySQL, confira se o banco foi criado:

SHOW DATABASES;

Você deverá ver o banco bytecraft listado

Resultado
Banco de dados: bytecraft

Usuário: bytecraft_user

Senha: senha123

Permissões: acesso total ao banco bytecraft

Seguindo estes passos não será necessário alterar o application properties
