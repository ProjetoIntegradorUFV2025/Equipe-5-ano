CREATE DATABASE bytecraft;

USE bytecraft;

CREATE TABLE alunos( 
		id INT PRIMARY KEY AUTO_INCREMENT,
        apelido VARCHAR(50),
        sala VARCHAR (20),
        pontuacao INT 
        );
        

USE bytecraft;

INSERT INTO alunos (apelido, sala, pontuacao)
VALUES
('Bernardo', 'A1', 90),
('Bruno', 'A2', 85),
('Pedro', 'B1', 88),
('Lana', 'B2', 92),
('Pablo', 'C1', 75),
('Marcus Eduardo', 'C2', 80),
('Luana', 'A3', 94),
('Aline', 'B3', 70),
('Arthur', 'C3', 83),
('Alice', 'A4', 78);

SELECT apelido
FROM alunos
ORDER BY apelido ASC;

