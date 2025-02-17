import { limparCPF } from '../../shared/utils.js';

export async function hashSenha(senha) {
    const encoder = new TextEncoder();
    const data = encoder.encode(senha);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
                .map(byte => byte.toString(16).padStart(2, '0'))
                .join('');
}

export function verificarEmailExistente(email) {
    var lsEmail = email;
    var emailExiste = alasql(`SELECT * FROM usuarios WHERE email = ?`, [lsEmail]).length > 0;
    return emailExiste; //alasql(`SELECT * FROM usuarios WHERE email = ?`, [email]).length > 0;
}

export function cadastrarUsuario(nome, email, senhaHash) {
    alasql(`INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)`, [nome, email, senhaHash]);
}

export function importarBancoService(dados) {

    // Verifica se o arquivo tem a estrutura esperada
    if (!validarEstruturaBanco(dados)) {
        alert("O arquivo JSON não contém todos os dados esperados ou está mal formatado.");
        return;
    }

    // Mapas para conversão de IDs antigos para novos
    const mapaIDsClientes = {}; // { id_original: id_novo }

    // Importar Usuários
    if (dados.usuarios && Array.isArray(dados.usuarios)) {
        console.log('Importando usuários...');

        dados.usuarios.forEach(usuario => {
            console.log('Usuário', usuario);

            if (!verificarEmailExistente(usuario.email)) {
                console.log('inserindo usuário', usuario)
                alasql("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)", 
                    [usuario.nome, usuario.email, usuario.senha]);
            }
            else {
                console.log('Usuário já existe, pulando:', usuario.email);
            }
        });
    }

    // Importar clientes
    if (dados.clientes && Array.isArray(dados.clientes)) {
        console.log('Importando clientes... ');
        dados.clientes.forEach(cliente => {
            console.log('Cliente', cliente);
            if (!verificarCPFExistente(cliente.cpf)) {
                alasql("INSERT INTO clientes (nome, cpf, nascimento, telefone, celular) VALUES (?, ?, ?, ?, ?)", 
                    [cliente.nome, cliente.cpf, cliente.nascimento, cliente.telefone, cliente.celular]);

                // Obtém o ID recém-gerado
                const clienteNovo = alasql("SELECT id FROM clientes WHERE cpf = ?", [cliente.cpf])[0];

                if (clienteNovo) {
                    mapaIDsClientes[cliente.id] = clienteNovo.id; // Associa ID antigo ao novo
                }
            }
            else {
                console.log('Cliente já existe, pulando:', cliente.cpf);

                // Se o cliente já existe, obtemos seu ID existente
                const clienteExistente = alasql("SELECT id FROM clientes WHERE cpf = ?", [cliente.cpf])[0];
                if (clienteExistente) {
                    mapaIDsClientes[cliente.id] = clienteExistente.id;
                }
            }
        });
    }

    // Importar endereços
    if (dados.enderecos && Array.isArray(dados.enderecos)) {
        console.log('Importando endereços... ')
        dados.enderecos.forEach(endereco => {
            console.log('Endereço', endereco);

            const novoClienteID = Number(mapaIDsClientes[endereco.cliente_id]); // Busca novo ID do cliente pelo ID original

            if (novoClienteID) {
                alasql("INSERT INTO enderecos (cliente_id, cep, rua, bairro, cidade, estado, pais, principal) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
                [novoClienteID, endereco.cep, endereco.rua, endereco.bairro, endereco.cidade, endereco.estado, endereco.pais, endereco.principal]);
            }
            else {
                console.warn(`Cliente ID ${endereco.cliente_id} não encontrado na importação. Endereço ignorado.`);
            }
            
        });
    }
}

export function verificarCPFExistente(cpf) {
    var lsCpf = limparCPF(cpf); // Remove pontuação antes de salvar
    var cpfExiste = alasql(`SELECT * FROM clientes WHERE cpf = ?`, [lsCpf]).length > 0;
    return cpfExiste; //alasql(`SELECT * FROM clientes WHERE cpf = ?`, [cpf]).length > 0;
}

// Função para validar a estrutura do JSON, verificando apenas as chaves existentes
export function validarEstruturaBanco(dados) {
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