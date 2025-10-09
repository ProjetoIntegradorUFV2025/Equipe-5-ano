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
('Pablo', 'A1', 0),
('Lara', 'A1', 0),
('Pedro', 'B2', 0),
('Aninha', 'B2', 0),
('Carlos', 'C3', 0),
('Leandro', 'C3', 0);

UPDATE alunos 
SET pontuacao = 20
WHERE apelido = "Pablo" AND sala = "A1";

SELECT * FROM alunos