import { cadastrarUsuario, verificarEmailExistente, hashSenha, importarBancoService } from "./authService.js";

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

// Adiciona um evento ao botão de upload para processar o arquivo quando clicado
document.getElementById("btnUpload")?.addEventListener("click", function () {
    const fileInput = document.getElementById("uploadDb");
    const file = fileInput.files[0];

    if (!file) {
        alert("Selecione um arquivo JSON antes de importar!");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        try {
            const dados = JSON.parse(event.target.result);
            console.log('dados', dados);

            // Chama o serviço para importar os dados (já validando o JSON)
            importarBancoService(dados);
            
            alert("Banco de dados importado com sucesso!");
            fileInput.value = ""; // Limpa o input após o upload
        } catch (error) {
            alert("Erro ao processar o arquivo. Verifique se é um JSON válido." + error);
        }        
    };

    reader.readAsText(file);
});

