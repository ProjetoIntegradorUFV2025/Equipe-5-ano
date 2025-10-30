USE ByteCraft;

CREATE TABLE pergunta (
	id INT AUTO_INCREMENT,
    enunciado VARCHAR(255),
    alternativaA VARCHAR(255),
    alternativaB VARCHAR(255),
    alternativaC VARCHAR(255),
    alternativaD VARCHAR(255),
    correta CHAR(1),
    nivelDificuldade ENUM('FACIL', 'MEDIO', 'DIFICIL'),
    PRIMARY KEY (id)
);

INSERT INTO pergunta (enunciado, alternativaA, alternativaB, 
alternativaC, alternativaD, correta, nivelDificuldade)
VALUES
('Qual é o maior oceano do mundo?', 'Oceano Atlântico', 'Oceano Índico',
 'Oceano Pacífico', 'Oceano Ártico', 'C', 'FACIL'),
('Quanto é 7 multiplicado por 8?', '49', '56', '63', '72', 'B', 'FACIL'),
('Qual planeta do nosso sistema solar é conhecido como "Planeta Vermelho"?',
 'Vênus', 'Marte', 'Júpiter', 'Saturno', 'B', 'FACIL'),
('Qual das palavras abaixo é um antônimo (significado contrário)
 de "rápido"?', 'Veloz', 'Lento', 'Forte', 'Curto', 'B', 'FACIL'),
('Quantos lados tem um hexágono?', '4', '5', '6', '8', 'C', 'FACIL'),
('Em qual continente fica o Egito?', 'Ásia', 'Europa', 'América do Sul', 
'África', 'D', 'MEDIO'),
('Qual oceano banha a costa leste do Brasil?', 'Oceano Pacífico', 
'Oceano Índico', 'Oceano Atlântico', 'Oceano Ártico', 'C', 'DIFICIL'),
('Qual é o processo pelo qual as plantas usam a luz do sol para fazer seu próprio alimento?',
 'Respiração', 'Fotossíntese', 'Evaporação', 'Digestão', 'B', 'MEDIO'),
('Se uma pizza foi dividida em 8 pedaços e você comeu 3/4 dela, quantos pedaços sobraram?',
 '2 pedaços', '4 pedaços', '6 pedaços', '1 pedaço', 'A', 'DIFICIL'),
('Quem é conhecido por ter pintado a "Mona Lisa"?', 'Michelangelo',
 'Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'D', 'MEDIO');
 
 SELECT enunciado, alternativaA, alternativaB, 
alternativaC, alternativaD, correta
FROM pergunta
WHERE nivelDificuldade = 3
LIMIT 1;
