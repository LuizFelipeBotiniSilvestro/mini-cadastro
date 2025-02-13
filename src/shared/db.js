// Criando e inicializando o banco no LocalStorage
alasql(`
    CREATE LOCALSTORAGE DATABASE IF NOT EXISTS miniAppDB;
    ATTACH LOCALSTORAGE DATABASE miniAppDB;
    USE miniAppDB;
`);

// Criar tabela de usuários
alasql(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        email TEXT UNIQUE,
        senha TEXT
    );
`);

// Criar tabela de clientes
alasql(`
    CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        cpf TEXT UNIQUE,
        nascimento TEXT,
        telefone TEXT,
        celular TEXT
    );
`);

// Criar tabela de endereços
alasql(`
    CREATE TABLE IF NOT EXISTS enderecos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER,
        cep TEXT,
        rua TEXT,
        bairro TEXT,
        cidade TEXT,
        estado TEXT,
        pais TEXT,
        principal BOOLEAN DEFAULT 0,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    );
`);
