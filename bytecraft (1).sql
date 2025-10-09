
-- Criação do banco de dados
CREATE DATABASE bytecraft;

-- Seleciona o banco para uso
USE bytecraft;

-- Criação da tabela alunos
CREATE TABLE alunos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    apelido VARCHAR(50),
    sala VARCHAR(20),
    pontuacao INT
);

-- Inserção de registros de teste
INSERT INTO alunos (apelido, sala, pontuacao)
VALUES
('Joca', 'A1', 0),
('Mari', 'A1', 0),
('Pedrinho', 'B2', 0),
('Aninha', 'B2', 0),
('Lucas', 'C3', 0),
('Bea', 'C3', 0);

-- Atualização da pontuação com base em apelido e sala
UPDATE alunos SET pontuacao = 10 WHERE apelido = 'Joca' AND sala = 'A1';
UPDATE alunos SET pontuacao = 20 WHERE apelido = 'Mari' AND sala = 'A1';
UPDATE alunos SET pontuacao = 15 WHERE apelido = 'Pedrinho' AND sala = 'B2';
UPDATE alunos SET pontuacao = 25 WHERE apelido = 'Aninha' AND sala = 'B2';
UPDATE alunos SET pontuacao = 30 WHERE apelido = 'Lucas' AND sala = 'C3';
UPDATE alunos SET pontuacao = 40 WHERE apelido = 'Bea' AND sala = 'C3';

-- Verificação final
SELECT * FROM alunos;
