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
