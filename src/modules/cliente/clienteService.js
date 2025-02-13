function verificarCPFExistente(cpf) {
    return alasql(`SELECT * FROM clientes WHERE cpf = ?`, [cpf]).length > 0;
}

function cadastrarCliente(nome, cpf, nascimento, telefone, celular) {
    alasql(`INSERT INTO clientes (nome, cpf, nascimento, telefone, celular) VALUES (?, ?, ?, ?, ?)`, 
        [nome, cpf, nascimento, telefone, celular]);
}

function listarClientes() {
    return alasql(`SELECT * FROM clientes`);
}

function excluirCliente(id) {
    alasql(`DELETE FROM clientes WHERE id = ?`, [id]);
}
