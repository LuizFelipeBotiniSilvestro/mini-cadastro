// Remove qualquer caractere não numérico do CPF
function limparCPF(cpf) {
    return cpf.replace(/\D/g, ''); // Remove tudo que não for número
}

// Verifica se um email é válido
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Função para formatar um número de telefone (XX) XXXXX-XXXX
function formatarTelefone(numero) {
    numero = numero.replace(/\D/g, ""); // Remove não numéricos
    if (numero.length === 11) {
        return `(${numero.slice(0, 2)}) ${numero.slice(2, 7)}-${numero.slice(7)}`;
    } else if (numero.length === 10) {
        return `(${numero.slice(0, 2)}) ${numero.slice(2, 6)}-${numero.slice(6)}`;
    }
    return numero; // Retorna sem alteração se não for válido
}

// Exporta as funções para que possam ser usadas em outros arquivos
export { limparCPF, validarEmail, formatarTelefone };
