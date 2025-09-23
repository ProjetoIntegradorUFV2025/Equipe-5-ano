
CREATE DATABASE bytecraft;
USE bytecraft;
CREATE TABLE alunos (
    apelido VARCHAR(50) PRIMARY KEY, 
    sala TINYINT                      
);
INSERT INTO alunos (apelido, sala) VALUES
('Joaozinho', 1),
('Maria', 2),
('Carla', 1),
('Pedro', 3),
('Ana', 2);
