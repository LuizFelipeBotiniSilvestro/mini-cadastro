import { validarCPF, validarDataNascimento, formatarDataParaBr } from "../../shared/utils.js";
import { atualizarCliente, listarClientes, verificarCPFExistente, cadastrarCliente, excluirCliente } from './clienteService.js';

document.addEventListener('DOMContentLoaded', function () {
    listarClientesNaTabela();

    const nomeInput = document.getElementById("nome"); // Agora é definido antes
    nomeInput.addEventListener("input", atualizarCaracteresRestantes);

    atualizarCaracteresRestantes(); // Chama ao carregar a página para exibir (50) inicialmente
});

function atualizarCaracteresRestantes() {
    const nomeInput = document.getElementById("nome");
    const contadorNome = document.getElementById("contadorNome");
    const maxCaracteres = 50;

    const caracteresDigitados = nomeInput.value.length;
    const caracteresRestantes = maxCaracteres - caracteresDigitados;

    contadorNome.textContent = `(${caracteresRestantes})`;

    if (caracteresRestantes < 10) {
        contadorNome.classList.add("text-danger");
    } else {
        contadorNome.classList.remove("text-danger");
    }
}

document.getElementById('clienteForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const nascimento = document.getElementById('nascimento').value;
    const telefone = document.getElementById('telefone').value;
    const celular = document.getElementById('celular').value;

    // Verifica se é edição
    const clienteId = document.getElementById('clienteForm').getAttribute('data-editing-id');

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

    if (clienteId == null || clienteId == 0 || !clienteId) {
        if (verificarCPFExistente(cpf)) {
            alert('CPF já cadastrado!');
            return;
        }
    }

    // Se estiver editando um cliente, chama a função de atualização
    if (clienteId) {
        atualizarCliente(clienteId, nome, nascimento, telefone, celular);
        alert('Cliente atualizado com sucesso!');        
    } else {
        if (verificarCPFExistente(cpf)) {
            alert('CPF já cadastrado!');
            return;
        }
        cadastrarCliente(nome, cpf, nascimento, telefone, celular);
        alert('Cliente cadastrado com sucesso!');
    }

    // Atualiza os dados e a tabela
    listarClientesNaTabela();

    resetarFormulario();
});

function resetarFormulario() {
    document.getElementById('clienteForm').reset();
    document.getElementById('clienteForm').removeAttribute('data-editing-id');
    document.getElementById('cpf').removeAttribute("readonly"); // CPF volta a ser editável
    document.getElementById('btn-submit').textContent = "Cadastrar";
}

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
        const dataNascimento = formatarDataParaBr(cliente.nascimento);

        const row = `
            <tr>
                <td>${cliente.id}</td>
                <td>${cliente.nome}</td>
                <td>${cpfFormatado}</td>
                <td>${dataNascimento}</td>
                <td>${telefoneFormatado}</td>
                <td>${celularFormatado}</td>
                <td>
                    <button class="btn btn-warning btn-sm btn-editar" data-id="${cliente.id}">
                        Editar
                    </button>
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

    // Adiciona evento de clique nos botões de edição
    document.querySelectorAll(".btn-editar").forEach(button => {
        button.addEventListener("click", function () {
            const id = this.getAttribute("data-id");
            editarClienteAction(id);
        });
    });
}

function excluirClienteAction(id) {
    excluirCliente(id);
    listarClientesNaTabela();
}

function editarClienteAction(id) {
    const cliente = listarClientes().find(c => c.id == id);

    if (!cliente) {
        alert("Cliente não encontrado!");
        return;
    }

    document.getElementById('cpf').setAttribute("readonly", "true"); // Torna o CPF somente leitura

    // Preencher os campos com os dados do cliente
    document.getElementById('nome').value = cliente.nome;
    document.getElementById('cpf').value = formatarCPF(cliente.cpf);
    document.getElementById('nascimento').value = cliente.nascimento;
    document.getElementById('telefone').value = cliente.telefone;
    document.getElementById('celular').value = cliente.celular;
    
    // Salva o ID do cliente sendo editado
    document.getElementById('clienteForm').setAttribute('data-editing-id', id)

    document.getElementById('btn-submit').textContent = "Atualizar";

    atualizarCaracteresRestantes()
}

function formatarCPF(cpf) {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
}

function formatarTelefone(numero) {
    return numero.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
}
