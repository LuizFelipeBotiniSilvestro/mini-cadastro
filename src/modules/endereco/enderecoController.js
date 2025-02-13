document.addEventListener('DOMContentLoaded', function () {
    preencherClientes();
    listarEnderecosNaTabela();
});

document.getElementById('enderecoForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const cliente_id = document.getElementById('cliente_id').value;
    const cep = document.getElementById('cep').value;
    const rua = document.getElementById('rua').value;
    const bairro = document.getElementById('bairro').value;
    const cidade = document.getElementById('cidade').value;
    const estado = document.getElementById('estado').value;
    const pais = document.getElementById('pais').value;
    const principal = document.getElementById('principal').checked ? 1 : 0;

    if (!cliente_id) {
        alert('Selecione um cliente!');
        return;
    }

    cadastrarEndereco(cliente_id, cep, rua, bairro, cidade, estado, pais, principal);
    alert('Endereço cadastrado com sucesso!');
    listarEnderecosNaTabela();
});

// Preencher dropdown de clientes
function preencherClientes() {
    const clientes = carregarClientes();
    const select = document.getElementById('cliente_id');

    select.innerHTML = `<option value="">Selecione um cliente</option>`;
    clientes.forEach(cliente => {
        select.innerHTML += `<option value="${cliente.id}">${cliente.nome}</option>`;
    });
}

// Listar endereços na tabela
function listarEnderecosNaTabela() {
    const enderecos = listarEnderecos();
    const tabela = document.getElementById('tabelaEnderecos');
    tabela.innerHTML = `<tr><th>Cliente</th><th>Endereço</th><th>Principal</th><th>Ações</th></tr>`;

    enderecos.forEach(endereco => {
        tabela.innerHTML += `
            <tr>
                <td>${endereco.cliente_nome}</td>
                <td>${endereco.rua}, ${endereco.bairro}, ${endereco.cidade}, ${endereco.estado}</td>
                <td>${endereco.principal ? '✔️' : ''}</td>
                <td>
                    <button onclick="excluirEnderecoAction(${endereco.id})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

// Função para excluir endereço
function excluirEnderecoAction(id) {
    excluirEndereco(id);
    alert('Endereço excluído!');
    listarEnderecosNaTabela();
}
