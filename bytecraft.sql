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
('Nery', '11', 2),
('Carlos', '103', 10),
('Abner', '69', 9),
('Luiz', '44', 6),
('Mauro', '99', 5),
('Aline', '11', 5),
('Paulo', '101', 4);

SELECT apelido 
FROM alunos
ORDER BY apelido ASC;