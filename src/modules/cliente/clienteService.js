import { limparCPF } from '../../shared/utils.js';

export function verificarCPFExistente(cpf) {
    var lsCpf = limparCPF(cpf); // Remove pontuação antes de salvar
    var cpfExiste = alasql(`SELECT * FROM clientes WHERE cpf = ?`, [lsCpf]).length > 0;
    return cpfExiste; //alasql(`SELECT * FROM clientes WHERE cpf = ?`, [cpf]).length > 0;
}

export function cadastrarCliente(nome, cpf, nascimento, telefone, celular) {
    var lsCpf = limparCPF(cpf); // Remove pontuação antes de salvar
    alasql(`INSERT INTO clientes (nome, cpf, nascimento, telefone, celular) VALUES (?, ?, ?, ?, ?)`, 
        [nome, lsCpf, nascimento, telefone, celular]);
}

export function atualizarCliente(id, nome, nascimento, telefone, celular) {
    var liId = Number(id); // Garante que o ID seja um número

    alasql(`UPDATE clientes SET nome = ?, nascimento = ?, telefone = ?, celular = ? WHERE id = ?`, 
        [nome, nascimento, telefone, celular, liId]);
}

export function listarClientes() {
    return alasql(`SELECT * FROM clientes`);
}

export function excluirCliente(id) {

    var liId = Number(id); // Garante que o ID seja um número

    // Verifica se o ID realmente existe no banco
    const cliente = alasql("SELECT * FROM clientes WHERE id = ?", [liId]);

    if (cliente.length === 0) {
        alert("Erro: Cliente não encontrado!");
        return;
    }

    alasql(`DELETE FROM clientes WHERE id = ?`, [liId]);
    alert('Cliente excluído!');
    listarClientes();
}
