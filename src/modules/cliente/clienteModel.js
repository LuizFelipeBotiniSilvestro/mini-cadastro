document.getElementById('clienteForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const nascimento = document.getElementById('nascimento').value;
    const telefone = document.getElementById('telefone').value;
    const celular = document.getElementById('celular').value;

    // Verifica se o CPF já existe
    const existeCPF = alasql(`SELECT * FROM clientes WHERE cpf = ?`, [cpf]);

    if (existeCPF.length > 0) {
        alert('CPF já cadastrado!');
    } else {
        alasql(`INSERT INTO clientes (nome, cpf, nascimento, telefone, celular) VALUES (?, ?, ?, ?, ?)`,
            [nome, cpf, nascimento, telefone, celular]);
        alert('Cliente cadastrado com sucesso!');
        location.reload();
    }
});

// Função para listar clientes na tabela
function listarClientes() {
    const clientes = alasql(`SELECT * FROM clientes`);
    const tabela = document.getElementById('tabelaClientes');
    tabela.innerHTML = `<tr><th>Nome</th><th>CPF</th><th>Ações</th></tr>`;

    clientes.forEach(cliente => {
        tabela.innerHTML += `
            <tr>
                <td>${cliente.nome}</td>
                <td>${cliente.cpf}</td>
                <td>
                    <button onclick="excluirCliente(${cliente.id})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

// Função para excluir um cliente
function excluirCliente(id) {
    alasql(`DELETE FROM clientes WHERE id = ?`, [id]);
    alert('Cliente excluído!');
    listarClientes();
}

// Chamar a listagem ao carregar a página
listarClientes();
