// Remove qualquer caractere não numérico do CPF
export function limparCPF(cpf) {
    return cpf.replace(/\D/g, ''); // Remove tudo que não for número
}

// Verifica se um email é válido
export function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Função para formatar um número de telefone (XX) XXXXX-XXXX
export function formatarTelefone(numero) {
    numero = numero.replace(/\D/g, ""); // Remove não numéricos
    if (numero.length === 11) {
        return `(${numero.slice(0, 2)}) ${numero.slice(2, 7)}-${numero.slice(7)}`;
    } else if (numero.length === 10) {
        return `(${numero.slice(0, 2)}) ${numero.slice(2, 6)}-${numero.slice(6)}`;
    }
    return numero; // Retorna sem alteração se não for válido
}

// Valida se o CPF é válido
export function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, ''); // Remove tudo que não for número

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false; // Verifica se tem 11 dígitos e se não são todos iguais

    let soma = 0, resto;

    for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[10])) return false;

    return true; // CPF válido
}

// Valida se a data de nascimento é válida e está dentro de um intervalo aceitável
export function validarDataNascimento(dataNascimento) {
    const nascimento = new Date(dataNascimento);

    // Verifica se a data é inválida (exemplo: "32/02/2023" ou "20000-08-03")
    if (isNaN(nascimento.getTime())) {
        return false;
    }

    const anoAtual = new Date().getFullYear();
    const anoNascimento = nascimento.getFullYear();

    // Verifica se o ano de nascimento está dentro de um intervalo lógico (ex: entre 1900 e o ano atual)
    if (anoNascimento < 1900 || anoNascimento > anoAtual) {
        return false;
    }

    return true;
}

export function formatarDataParaBr(dataIso) {
    if (!dataIso) return ""; // Retorna vazio se a data for inválida

    const partes = dataIso.split("-");
    if (partes.length !== 3) return ""; // Valida se está no formato correto

    return `${partes[2]}-${partes[1]}-${partes[0]}`; // Retorna no formato dd-mm-yyyy
}






