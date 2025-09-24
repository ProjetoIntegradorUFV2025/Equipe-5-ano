CREATE DATABASE ByteCraft;

USE ByteCraft;

CREATE TABLE IF NOT EXISTS alunos (
	apelido VARCHAR(20) PRIMARY KEY NOT NULL,
    sala INT
);

INSERT INTO alunos (apelido, sala) VALUES
('Pedro', 001),
('Nery', 002),
('Bruno', 003);