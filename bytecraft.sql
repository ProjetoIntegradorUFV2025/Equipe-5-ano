CREATE DATABASE ByteCraft;
USE ByteCraft;
CREATE TABLE alunos(
apelido VARCHAR(50) PRIMARY KEY,
sala SMALLINT
);

INSERT INTO alunos (apelido, sala) VALUES
('Bruno', 90),
('Luis', 85),
('Pedro', 102);