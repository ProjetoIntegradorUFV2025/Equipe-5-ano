CREATE DATABASE IF NOT EXISTS ByteCraft;
USE ByteCraft;
DROP TABLE IF EXISTS alunos;

CREATE TABLE alunos (
    apelido VARCHAR(50) NOT NULL PRIMARY KEY,
    sala SMALLINT UNSIGNED NULL
);

INSERT INTO alunos (apelido, sala) VALUES
('Lara', 1),
('Bernardo', 2),
('Joao', 1),
('Pablo', 3),
('Aline', NULL),
('Arthur', 4);
SELECT * FROM alunos;
