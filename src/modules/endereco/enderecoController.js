import { carregarClientes, cadastrarEndereco, listarEnderecos, excluirEndereco } from "./enderecoService.js";


document.addEventListener('DOMContentLoaded', function () {

    const cepInput = document.getElementById("cep");

    // Aplica máscara ao CEP
    cepInput.addEventListener("input", function () {
        let cep = cepInput.value.replace(/\D/g, ""); // Remove tudo que não for número

        if (cep.length > 5) {
            cep = cep.substring(0, 5) + "-" + cep.substring(5, 8);
        }

        cepInput.value = cep;
    });
    
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

function listarEnderecosNaTabela() {
    let data = []; // Variável para armazenar os clientes
    data = listarEnderecos(); // Obtém os enderecos do banco
    atualizarTabela(data);
}

function atualizarTabela(enderecos) {
    const tabelaBody = document.getElementById('tabelaEnderecosBody');
    tabelaBody.innerHTML = ''; // Limpa a tabela antes de preencher

    enderecos.forEach(endereco => {
        const row = `
            <tr>
                <td>${endereco.cliente_nome}</td>
                <td>${endereco.cep}</td>
                <td>${endereco.rua}, ${endereco.bairro}, ${endereco.cidade}, ${endereco.estado}</td>
                <td>${endereco.principal ? '✔️' : ''}</td>
                 <td>
                    <button class="btn btn-danger btn-sm btn-excluir" data-id="${endereco.id}">
                        Excluir
                    </button>
                </td>
            </tr>
        `;
        tabelaBody.innerHTML += row;
    });

    // Adiciona evento de clique nos botões de exclusão
    document.querySelectorAll(".btn-excluir").forEach(button => {
        button.addEventListener("click", function () {
            const id = this.getAttribute("data-id");
            excluirEnderecoAction(id);
        });
    });
}

// Função para excluir endereço
function excluirEnderecoAction(id) {
    excluirEndereco(id);
    alert('Endereço excluído!');
    listarEnderecosNaTabela();
}
