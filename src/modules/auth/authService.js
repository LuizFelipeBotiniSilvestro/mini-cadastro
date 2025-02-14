async function hashSenha(senha) {
    const encoder = new TextEncoder();
    const data = encoder.encode(senha);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
                .map(byte => byte.toString(16).padStart(2, '0'))
                .join('');
}

function verificarEmailExistente(email) {
    return alasql(`SELECT * FROM usuarios WHERE email = ?`, [email]).length > 0;
}

function cadastrarUsuario(nome, email, senhaHash) {
    console.log('Cadastrar usuário')
    alasql(`INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)`, [nome, email, senhaHash]);
}

function importarBancoService(dados) {

    // Verifica se o arquivo tem a estrutura esperada
    if (!validarEstruturaBanco(dados)) {
        alert("O arquivo JSON não contém todos os dados esperados ou está mal formatado.");
        return;
    }

    // Importar Usuários
    if (dados.usuarios && Array.isArray(dados.usuarios)) {
        dados.usuarios.forEach(usuario => {
            if (!verificarEmailExistente(usuario.email)) {
                alasql("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)", 
                    [usuario.nome, usuario.email, usuario.senha]);
            }
        });
    }

    // Importar clientes
    if (dados.clientes && Array.isArray(dados.clientes)) {
        dados.clientes.forEach(cliente => {
            if (!verificarCPFExistente(cliente.cpf)) {
                alasql("INSERT INTO clientes (nome, cpf, nascimento, telefone, celular) VALUES (?, ?, ?, ?, ?)", 
                    [cliente.nome, cliente.cpf, cliente.nascimento, cliente.telefone, cliente.celular]);
            }
        });
    }

    // Importar endereços
    if (dados.enderecos && Array.isArray(dados.enderecos)) {
        dados.enderecos.forEach(endereco => {
            alasql("INSERT INTO enderecos (cliente_id, cep, rua, bairro, cidade, estado, pais, principal) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
                [endereco.cliente_id, endereco.cep, endereco.rua, endereco.bairro, endereco.cidade, endereco.estado, endereco.pais, endereco.principal]);
        });
    }
}

function verificarEmailExistente(email) {
    return alasql("SELECT * FROM usuarios WHERE email = ?", [email]).length > 0;
}

function verificarCPFExistente(cpf) {
    return alasql("SELECT * FROM clientes WHERE cpf = ?", [cpf]).length > 0;
}

// Função para validar a estrutura do JSON, verificando apenas as chaves existentes
function validarEstruturaBanco(dados) {
    if (!dados || typeof dados !== "object") return false;

    // Se houver "usuarios", valida os campos obrigatórios
    if (dados.usuarios) {
        if (!Array.isArray(dados.usuarios)) {
            console.error("Erro: 'usuarios' deve ser um array.");
            return false;
        }
        for (let usuario of dados.usuarios) {
            if (!usuario.nome || !usuario.email || !usuario.senha) {
                console.error("Erro: Usuário com campos ausentes.", usuario);
                return false;
            }
        }
    }

    // Se houver "clientes", valida os campos obrigatórios
    if (dados.clientes) {
        if (!Array.isArray(dados.clientes)) {
            console.error("Erro: 'clientes' deve ser um array.");
            return false;
        }
        for (let cliente of dados.clientes) {
            if (!cliente.nome || !cliente.cpf || !cliente.nascimento) {
                console.error("Erro: Cliente com campos ausentes.", cliente);
                return false;
            }
        }
    }

    // Se houver "enderecos", valida os campos obrigatórios
    if (dados.enderecos) {
        if (!Array.isArray(dados.enderecos)) {
            console.error("Erro: 'enderecos' deve ser um array.");
            return false;
        }
        for (let endereco of dados.enderecos) {
            if (!endereco.cliente_id || !endereco.cep || !endereco.rua || !endereco.bairro || 
                !endereco.cidade || !endereco.estado || !endereco.pais) {
                console.error("Erro: Endereço com campos ausentes.", endereco);
                return false;
            }
        }
    }

    return true; 
}