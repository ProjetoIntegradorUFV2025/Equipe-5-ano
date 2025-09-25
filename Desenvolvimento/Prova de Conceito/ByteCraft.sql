CREATE DATABASE ByteCraft;

USE ByteCraft;

CREATE TABLE IF NOT EXISTS alunos (
	apelido VARCHAR(18) PRIMARY KEY NOT NULL,
    sala INT
);

INSERT INTO alunos (apelido, sala) VALUES
('BERNARD', 001),
('CUELLO', 002),
('ALAN', 003);