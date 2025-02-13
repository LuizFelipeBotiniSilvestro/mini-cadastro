function verificarCPFExistente(cpf) {
    return alasql(`SELECT * FROM clientes WHERE cpf = ?`, [cpf]).length > 0;
}

function limparCPF(cpf) {
    return cpf.replace(/\D/g, '');  // Remove tudo que não for número
}

function cadastrarCliente(nome, cpf, nascimento, telefone, celular) {

    cpf = limparCPF(cpf); // Remove pontuação antes de salvar
    
    alasql(`INSERT INTO clientes (nome, cpf, nascimento, telefone, celular) VALUES (?, ?, ?, ?, ?)`, 
        [nome, cpf, nascimento, telefone, celular]);
}

function listarClientes() {
    return alasql(`SELECT * FROM clientes`);
}

function excluirCliente(id) {
    alasql(`DELETE FROM clientes WHERE id = ?`, [id]);
}
