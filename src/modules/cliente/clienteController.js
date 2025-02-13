document.addEventListener('DOMContentLoaded', function () {
    listarClientesNaTabela();
});

document.getElementById('clienteForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const nascimento = document.getElementById('nascimento').value;
    const telefone = document.getElementById('telefone').value;
    const celular = document.getElementById('celular').value;

    if (verificarCPFExistente(cpf)) {
        alert('CPF já cadastrado!');
        return;
    }

    cadastrarCliente(nome, cpf, nascimento, telefone, celular);
    alert('Cliente cadastrado com sucesso!');
    listarClientesNaTabela();
});

function listarClientesNaTabela() {
    const clientes = listarClientes();
    const tabela = document.getElementById('tabelaClientes');
    tabela.innerHTML = `<tr><th>Nome</th><th>CPF</th><th>Ações</th></tr>`;

    clientes.forEach(cliente => {
        tabela.innerHTML += `
            <tr>
                <td>${cliente.nome}</td>
                <td>${cliente.cpf}</td>
                <td>
                    <button onclick="excluirClienteAction(${cliente.id})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

function excluirClienteAction(id) {
    excluirCliente(id);
    alert('Cliente excluído!');
    listarClientesNaTabela();
}
