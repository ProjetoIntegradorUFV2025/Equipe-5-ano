CREATE DATABASE bytecraft;

USE bytecraft;

-- criando tabela alunos caso não exista
CREATE TABLE IF NOT EXISTS alunos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    apelido VARCHAR(50),
    sala VARCHAR(20),
    pontuacao INT
);

-- inicializando os valores dos alunos
INSERT INTO alunos (apelido, sala, pontuacao)
VALUES
    ('Joca', 'A1', 0),
    ('Mari', 'A1', 0),
    ('Pedrinho', 'B2', 0),
    ('Aninha', 'B2', 0);

-- desabilita o modo de safe updates por um curto periodo
SET SQL_SAFE_UPDATES = 0;

-- atualiza os alunos mudando valores de pontuação
UPDATE alunos
SET pontuacao = 10
WHERE apelido = 'Joca' AND sala = 'A1';

-- retorna o valor de safe updates para 1, voltando a como era antes do código rodar
SET SQL_SAFE_UPDATES = 1;
