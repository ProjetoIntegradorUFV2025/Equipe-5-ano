CREATE DATABASE bytecraft;

USE bytecraft;

CREATE TABLE alunos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    apelido VARCHAR(50),
    sala VARCHAR(20),
    pontuacao INT
);

INSERT INTO alunos (apelido, sala, pontuacao) VALUES
('Bruno', 'A1', 85),
('Ana', 'B2', 90),
('Carlos', 'A1', 78),
('Renan', 'C3', 92),
('Pedro', 'B2', 88),
('Lucas', 'A1', 76),
('Julia', 'C3', 95),
('Mateus', 'B2', 80),
('Laura', 'A1', 89),
('Rafael', 'C3', 91);


SELECT apelido FROM alunos ORDER BY apelido ASC;