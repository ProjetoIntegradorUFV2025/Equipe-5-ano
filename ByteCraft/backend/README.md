Criando o Banco de Dados "bytecraft" no MySQL (Apenas para Testes)

Este tutorial ensina como criar um banco de dados chamado `bytecraft`, criar um usuário dedicado, conceder permissões e testar a conexão no MySQL.

1️⃣ Acessar o MySQL

No Linux, você pode acessar de duas formas, dependendo da configuração do MySQL:

- Se o MySQL pedir senha para o root:

mysql -u root -p
Se o root do MySQL estiver vinculado ao root do sistema (com sudo):

sudo mysql -u root

2️⃣ Criar Banco de Dados e Usuário
Depois de entrar no console do MySQL, execute os seguintes comandos:

sql
Copiar código
CREATE DATABASE bytecraft CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'bytecraft_user'@'localhost' IDENTIFIED BY 'senha123';

GRANT ALL PRIVILEGES ON bytecraft.* TO 'bytecraft_user'@'localhost';

FLUSH PRIVILEGES;
3️⃣ Testar o Novo Usuário
Saia do MySQL:

bash
Copiar código
exit
Faça login com o novo usuário:

bash
Copiar código
mysql -u bytecraft_user -p
Digite a senha (senha123) quando solicitado.

Dentro do MySQL, confira se o banco foi criado:

sql
Copiar código
SHOW DATABASES;
Você deverá ver o banco bytecraft listado ✅

4️⃣ Resultado
Banco de dados: bytecraft

Usuário: bytecraft_user

Senha: senha123

Permissões: acesso total ao banco bytecraft
