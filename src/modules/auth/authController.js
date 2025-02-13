// Lógica do Login
document.getElementById('loginForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const senhaHash = await hashSenha(senha);

    const usuario = alasql(`SELECT * FROM usuarios WHERE email = ? AND senha = ?`, [email, senhaHash]);

    if (usuario.length > 0) {
        sessionStorage.setItem('usuario', JSON.stringify(usuario[0]));
        window.location.href = '/src/modules/dashboard/dashboard.html';
    } else {
        alert('Credenciais inválidas.');
    }
});

// Lógica de Cadastro
document.getElementById('registerForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return;
    }

    if (verificarEmailExistente(email)) {
        alert('Este email já está cadastrado.');
        return;
    }

    const senhaHash = await hashSenha(senha);
    cadastrarUsuario(nome, email, senhaHash);

    alert('Usuário cadastrado com sucesso!');
    window.location.href = 'login.html';
});
