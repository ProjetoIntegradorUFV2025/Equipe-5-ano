CREATE DATABASE bytecraft;
USE bytecraft;
CREATE TABLE alunos (
 id INT PRIMARY KEY AUTO_INCREMENT,
 apelido VARCHAR(50),
 sala VARCHAR(20),
 pontuacao INT
);

INSERT INTO alunos (apelido, sala, pontuacao)
VALUES
('Joca', 'A1', 0),
('Mari', 'A1', 0),
('Pedrinho', 'B2', 0),
('Aninha', 'B2', 0);

UPDATE alunos 
SET pontuacao = 15
WHERE apelido = "Joca" AND sala = "A1";

SELECT * FROM alunos


