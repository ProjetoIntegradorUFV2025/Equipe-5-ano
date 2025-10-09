CREATE DATABASE IF NOT EXISTS bytecraft;

USE bytecraft;

CREATE TABLE IF NOT EXISTS alunos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    apelido VARCHAR(50),
    sala VARCHAR(20),
    pontuacao INT
);


INSERT INTO alunos (apelido, sala, pontuacao)
VALUES
('Jorge', '3', 0),
('Loide', '2', 0),
('Augusto', '5', 0);