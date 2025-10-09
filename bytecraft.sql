CREATE DATABASE IF NOT EXISTS bytecraft;

USE bytecraft;

CREATE TABLE IF NOT EXISTS alunos (
	id INT PRIMARY KEY AUTO_INCREMENT,
    apelido VARCHAR(50),
    sala VARCHAR(20),
    pontuacao INT
);

INSERT INTO alunos (apelido, sala, pontuacao) VALUES 
('Brunao', '99', 9),
('Pedro', '103', 8),
('Pablo', '27', 10),
('Nery', '3', 7);