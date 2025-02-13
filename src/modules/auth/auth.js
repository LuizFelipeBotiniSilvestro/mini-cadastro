document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const senhaHash = await hashSenha(senha);

    const usuario = alasql(`SELECT * FROM usuarios WHERE email = ? AND senha = ?`, [email, senhaHash]);

    if (usuario.length > 0) {
        alert('Login bem-sucedido!');
        sessionStorage.setItem('usuario', JSON.stringify(usuario[0]));
        window.location.href = 'clientes.html';
    } else {
        alert('Credenciais inválidas.');
    }
});

document.getElementById('cadastroUsuarioForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const senhaHash = await hashSenha(senha);

    const existeUsuario = alasql(`SELECT * FROM usuarios WHERE email = ?`, [email]);

    if (existeUsuario.length > 0) {
        alert('Este email já está cadastrado.');
    } else {
        alasql(`INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)`, [nome, email, senhaHash]);
        alert('Usuário cadastrado com sucesso!');
        window.location.href = 'login.html';
    }
});

