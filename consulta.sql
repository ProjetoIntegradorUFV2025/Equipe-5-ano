USE bytecraft;
CREATE TABLE alunos (
 id INT PRIMARY KEY AUTO_INCREMENT,
 apelido VARCHAR(50),
 sala VARCHAR(20),
 pontuacao INT
);

INSERT INTO alunos (apelido, sala, pontuacao) VALUES
('Lara', '5A', 23),
('Bernardo', '5B', 22),
('Bruno', '5A', 24),
('Taryc', '5C', 23),
('Pablo', '5C', 21),
('Pedro', '5B', 25),
('Aline', '5B', 24),
('Arthur', '5B', 20),
('Marcus', '5D', 25),
('Edgar', '5D', 21);

SELECT apelido 
FROM alunos 
ORDER BY apelido ASC;

