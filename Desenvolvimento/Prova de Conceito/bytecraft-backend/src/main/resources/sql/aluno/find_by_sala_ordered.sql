SELECT aluno_id, nome, pontuacao, sala_id
FROM aluno
WHERE sala_id = ?
ORDER BY pontuacao DESC;
