CREATE DATABASE bytecraft;
USE bytecraft;
CREATE TABLE pergunta (
 id INT PRIMARY KEY AUTO_INCREMENT,
 enunciado VARCHAR(255),
 alternativaA VARCHAR(255),
 alternativaB VARCHAR(255),
 alternativaC VARCHAR(255),
 alternativaD VARCHAR(255),
 correta CHAR(1),
 nivelDificuldade ENUM('FACIL', 'MEDIO', 'DIFICIL')
); 
INSERT INTO pergunta (enunciado, alternativaA, alternativaB,
alternativaC, alternativaD, correta, nivelDificuldade)
VALUES
('Qual é a capital do Brasil?', 'São Paulo', 'Rio de Janeiro',
'Brasília', 'Salvador', 'C', 'FACIL'),
('Quanto é 5 * 6?', '10', '20', '30', '60', 'C', 'FACIL'),
('Quem escreveu Dom Casmurro?', 'Machado de Assis', 'José de Alencar',
'Clarice Lispector', 'Monteiro Lobato', 'A', 'MEDIO');
SELECT * FROM pergunta;
SELECT enunciado, alternativaA, alternativaB, alternativaC, alternativaD, correta
FROM pergunta
WHERE nivelDificuldade = 'FACIL';
SELECT enunciado, alternativaA, alternativaB, alternativaC, alternativaD, correta
FROM pergunta
WHERE nivelDificuldade = 'MEDIO';
SELECT enunciado, alternativaA, alternativaB, alternativaC, alternativaD, correta, nivelDificuldade
FROM pergunta
WHERE enunciado LIKE '%capital do Brasil%';
SELECT enunciado, alternativaA, alternativaB, alternativaC, alternativaD, correta
FROM pergunta
WHERE nivelDificuldade = 'FACIL'
ORDER BY RAND()
LIMIT 1;


