CREATE DATABASE IF NOT EXISTS ByteCraft;

USE ByteCraft;

CREATE TABLE IF NOT EXISTS alunos (
    apelido VARCHAR(20) NOT NULL PRIMARY KEY,
    sala INT
);

INSERT INTO alunos (apelido, sala) VALUES
('Guilherme', 1),
('Bruno', 5),
('Tulio', 2),
('Anderson', 3),
('Ricardo', 3),
('Josue', 2),
('Mateus', 1);