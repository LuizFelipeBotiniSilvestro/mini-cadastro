export function carregarClientes() {
    return alasql(`SELECT * FROM clientes`);
}

export function verificarEnderecoPrincipal(cliente_id) {
    return alasql(`SELECT * FROM enderecos WHERE cliente_id = ? AND principal = 1`, [cliente_id]).length > 0;
}

export function cadastrarEndereco(cliente_id, cep, rua, bairro, cidade, estado, pais, principal) {

    var liClienteId = Number(cliente_id); // Garante que o ID seja um número

    if (principal) {
        alasql(`UPDATE enderecos SET principal = 0 WHERE cliente_id = ?`, [liClienteId]);
    }

    alasql(`
        INSERT INTO enderecos (cliente_id, cep, rua, bairro, cidade, estado, pais, principal) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [liClienteId, cep, rua, bairro, cidade, estado, pais, principal]);
}

export function atualizarEndereco(id, cliente_id, cep, rua, bairro, cidade, estado, pais, principal) {

    var liClienteId = Number(cliente_id); // Garante que o ID seja um número
    var liId = Number(id); // Garante que o ID seja um número

    // Se o endereço for marcado como principal, desmarcar os outros do cliente
    if (principal) {
        alasql("UPDATE enderecos SET principal = 0 WHERE cliente_id = ?", [cliente_id]);
    }

    alasql(
        `UPDATE enderecos 
        SET cliente_id = ?, cep = ?, rua = ?, bairro = ?, cidade = ?, estado = ?, pais = ?, principal = ? 
        WHERE id = ?`,
        [liClienteId, cep, rua, bairro, cidade, estado, pais, principal, liId]
    );
}

export function listarEnderecos() {
    return alasql(`
        SELECT e.*, c.nome AS cliente_nome 
        FROM enderecos e 
        INNER JOIN clientes c ON e.cliente_id = c.id
    `);
}

export function excluirEndereco(id) {

    var liId = Number(id); // Garante que o ID seja um número

    alasql(`DELETE FROM enderecos WHERE id = ?`, [liId]);
}
