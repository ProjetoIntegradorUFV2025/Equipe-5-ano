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
('Bruno', '3', 0),
('Joao', '2', 0),
('Leandro', '5', 0);
