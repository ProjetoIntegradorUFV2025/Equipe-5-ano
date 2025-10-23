CREATE DATABASE bytecraft; 

USE bytecraft;
 
CREATE TABLE alunos ( 
id INT PRIMARY KEY AUTO_INCREMENT, 
apelido VARCHAR(50), 
sala VARCHAR(20), 
pontuacao INT 
); 

INSERT INTO alunos (apelido, sala, pontuacao) VALUES

('Paulo', 'A1', 72),
('Ana', 'C1', 38),
('Pedro', 'B1', 19),
('Guilherme', 'A2', 45),
('Caio', 'D2', 93),
('Emanuel', 'A3', 100),
('Maria', 'B2', 81),
('Clara', 'B3', 19),
('Samantha', 'C2', 9),
('Robson', 'D3', 21);

SELECT apelido 
FROM alunos 
ORDER BY apelido ASC;