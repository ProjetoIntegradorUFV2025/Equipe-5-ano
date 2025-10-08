CREATE DATABASE IF NOT EXISTS bytecraft;
USE bytecraft;

CREATE TABLE IF NOT EXISTS alunos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    apelido VARCHAR(50),
    sala VARCHAR(20),
    pontuacao INT
);

INSERT INTO alunos (apelido, sala, pontuacao) VALUES
('Joca', 'A1', 0),
('Mari', 'A1', 0),
('Pedrinho', 'B2', 0),
('Aninha', 'B2', 0);

UPDATE alunos
SET pontuacao = pontuacao + 5
WHERE apelido = 'Pedrinho' AND sala = 'B2';

SELECT * FROM alunos;