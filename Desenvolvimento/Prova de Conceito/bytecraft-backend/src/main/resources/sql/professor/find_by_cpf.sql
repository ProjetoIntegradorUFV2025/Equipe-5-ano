SELECT p.cpf, p.nome, p.senha, s.sala_id
FROM professor p
LEFT JOIN sala s ON s.cpf = p.cpf
WHERE p.cpf = ?;
