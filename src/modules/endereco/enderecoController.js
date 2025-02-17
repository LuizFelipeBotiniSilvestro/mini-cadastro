import { carregarClientes, cadastrarEndereco, listarEnderecos, atualizarEndereco, excluirEndereco } from "./enderecoService.js";


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

    const enderecoId = document.getElementById("enderecoForm").getAttribute("data-editing-id");

    if (!cliente_id) {
        alert('Selecione um cliente!');
        return;
    }

    if (enderecoId) {
        // Atualizar endereço
        atualizarEndereco(enderecoId, cliente_id, cep, rua, bairro, cidade, estado, pais, principal);
        alert("Endereço atualizado com sucesso!");
    } else {
        // Cadastrar novo endereço
        cadastrarEndereco(cliente_id, cep, rua, bairro, cidade, estado, pais, principal);
        alert("Endereço cadastrado com sucesso!");
    }

    listarEnderecosNaTabela();
    resetarFormulario();
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
                <td>${endereco.cliente_id}</td>
                <td>${endereco.cliente_nome}</td>
                <td>${endereco.cep}</td>
                <td>${endereco.rua}, ${endereco.bairro}, ${endereco.cidade}, ${endereco.estado}</td>
                <td>${endereco.principal ? '✔️' : ''}</td>
                 <td>
                    <button class="btn btn-warning btn-sm btn-editar" data-id="${endereco.id}">
                        Editar
                    </button>
                    <button class="btn btn-danger btn-sm btn-excluir" data-id="${endereco.id}">
                        Excluir
                    </button>
                </td>
            </tr>
        `;
        tabelaBody.innerHTML += row;
    });

    // Adiciona o evento de edição
    document.querySelectorAll(".btn-editar").forEach(button => {
        button.addEventListener("click", function () {
            const id = this.getAttribute("data-id");
            editarEndereco(id);
        });
    });

    // Adiciona evento de clique nos botões de exclusão
    document.querySelectorAll(".btn-excluir").forEach(button => {
        button.addEventListener("click", function () {
            const id = this.getAttribute("data-id");
            excluirEnderecoAction(id);
        });
    });
}

// Função para editar um endereço
function editarEndereco(id) {

    var liId = Number(id); // Garante que o ID seja um número

    const endereco = listarEnderecos().find(e => e.id == liId);

    if (!endereco) {
        alert("Endereço não encontrado!");
        return;
    }

    document.getElementById("cliente_id").value = endereco.cliente_id;
    document.getElementById("cep").value = endereco.cep;
    document.getElementById("rua").value = endereco.rua;
    document.getElementById("bairro").value = endereco.bairro;
    document.getElementById("cidade").value = endereco.cidade;
    document.getElementById("estado").value = endereco.estado;
    document.getElementById("pais").value = endereco.pais;
    document.getElementById("principal").checked = endereco.principal === 1;

    document.getElementById('cliente_id').setAttribute("disabled", "true"); // Torna o cliente do endereço somente leitura

    document.getElementById('btn-submit').textContent = "Atualizar";

    // Armazena o ID do endereço que está sendo editado
    document.getElementById("enderecoForm").setAttribute("data-editing-id", id);
}

// Função para excluir endereço
function excluirEnderecoAction(id) {
    excluirEndereco(id);
    alert('Endereço excluído!');
    listarEnderecosNaTabela();
}

document.getElementById("cep").addEventListener("blur", async function () {
    const cep = this.value.replace(/\D/g, ""); // Remove caracteres não numéricos

    if (cep.length !== 8) {
        alert("CEP inválido! Digite um CEP com 8 números.");
        return;
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            alert("CEP não encontrado! Verifique e tente novamente.");
            limparCamposEndereco();
            return;
        }

        // Preenchendo os campos automaticamente
        document.getElementById("rua").value = data.logradouro || "";
        document.getElementById("bairro").value = data.bairro || "";
        document.getElementById("cidade").value = data.localidade || "";
        document.getElementById("estado").value = data.uf || "";
        document.getElementById("pais").value = "Brasil"; // Mantém fixo
    } catch (error) {
        alert("Erro ao buscar CEP. Tente novamente.");
        console.error("Erro na API do ViaCEP:", error);
    }
});

// Função para resetar o formulário e liberar campos bloqueados
function resetarFormulario() {
    document.getElementById("enderecoForm").reset();
    document.getElementById("enderecoForm").removeAttribute("data-editing-id");
    document.getElementById('cliente_id').removeAttribute("disabled"); // Cliente do endereço volta a ser editável
    document.getElementById('btn-submit').textContent = "Cadastrar";
}