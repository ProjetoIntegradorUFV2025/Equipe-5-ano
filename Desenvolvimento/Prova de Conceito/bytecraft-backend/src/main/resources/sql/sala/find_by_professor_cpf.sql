SELECT s.sala_id, p.cpf, p.nome, p.senha
FROM sala s
JOIN professor p ON s.cpf = p.cpf
WHERE p.cpf = ?;
