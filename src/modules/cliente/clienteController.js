import { validarCPF, validarDataNascimento } from "../../shared/utils.js";
import { listarClientes, verificarCPFExistente, cadastrarCliente, excluirCliente } from './clienteService.js';

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

    // Validação do CPF
    if (!validarCPF(cpf)) {
        alert("CPF inválido! Verifique e tente novamente.");
      return;
    }

    // Validação da Data de Nascimento
    if (!validarDataNascimento(nascimento)) {
        alert("Data de nascimento inválida! Verifique e tente novamente.");
      return;
    }

    if (verificarCPFExistente(cpf)) {
        alert('CPF já cadastrado!');
        return;
    }

    cadastrarCliente(nome, cpf, nascimento, telefone, celular);
    alert('Cliente cadastrado com sucesso!');

    // Atualiza os dados e a tabela
    listarClientesNaTabela();
});

function listarClientesNaTabela() {
    let data = []; // Variável para armazenar os clientes
    data = listarClientes(); // Obtém os clientes do banco
    atualizarTabela(data);
}

function atualizarTabela(clientes) {
    const tabelaBody = document.getElementById('tabelaClientesBody');
    tabelaBody.innerHTML = ''; // Limpa a tabela antes de preencher

    clientes.forEach(cliente => {

        const cpfFormatado = formatarCPF(cliente.cpf);
        const telefoneFormatado = cliente.telefone ? formatarTelefone(cliente.telefone) : '.';
        const celularFormatado = formatarTelefone(cliente.celular);

        const row = `
            <tr>
                <td>${cliente.nome}</td>
                <td>${cpfFormatado}</td>
                <td>${telefoneFormatado}</td>
                <td>${celularFormatado}</td>
                <td>
                    <button class="btn btn-danger btn-sm btn-excluir" data-id="${cliente.id}">
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
            excluirClienteAction(id);
        });
    });
}

function excluirClienteAction(id) {
    excluirCliente(id);
    listarClientesNaTabela();
}

function formatarCPF(cpf) {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
}

function formatarTelefone(numero) {
    return numero.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
}
