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
('Quanto é 8 * 7?','40', '48', '56', '63','C', 'FACIL'),
('Quando Dom Pedro Álvares Cabral chegou ao Brasil?', '1400', '1800', '1600', '1500', 'D', 'FACIL'),
('Quantos estados o Brasil tem?', '23', '26', '25', '22', 'B','FACIL'),
('Qual a origem do nome Brasil?', 'De uma árvore chamada pau-brasil', 'De um antigo povo indígena', 'De uma palavra em latim',
'De um explorador português', 'A', 'FACIL'),
('Antes de receber o nome Brasil, como o território era chamado pelos portugueses? ', 'Ilha de Vera Cruz', 'Terra dos Papagaios',
'Terra Nova', 'Nova Lusitânia', 'A', 'MEDIO'),
('O nome “Brasil” tem origem em uma palavra relacionada à cor vermelha. Qual é essa palavra?', 'Brasa', 'Bresil', 'Braza',
'Bracile', 'B', 'DIFICIL'); 

SELECT enunciado, alternativaA, alternativaB, alternativaC, alternativaD
FROM pergunta
WHERE nivelDificuldade = 'MEDIO';