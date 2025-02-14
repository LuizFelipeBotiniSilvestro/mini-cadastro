// Carregar o nome do usuário no Dashboard
document.addEventListener("DOMContentLoaded", function () {
    carregarNomeUsuario();
    
    // Copiar e colar somente com letras maiúsculas (padrão para uniformidade do projeto)
    document.querySelectorAll("input:not([type='password']):not([type='email']), textarea")
    .forEach(input => {
        input.addEventListener("input", function () {
            this.value = this.value.toUpperCase();
        });
    });
});

// Verifica se o usuário está logado ANTES de carregar a página
(function verificarSessaoUsuario() {
    const usuario = sessionStorage.getItem('usuario');
    const paginaAtual = window.location.pathname;

    const paginasPublicas = [
        '/src/modules/auth/login.html',
        '/src/modules/auth/register.html'
    ];

    // Se o usuário não estiver logado e não estiver em uma página pública, redireciona para login
    if (!usuario && !paginasPublicas.some(pagina => paginaAtual.includes(pagina))) {
        window.location.href = '/src/modules/auth/login.html';
    }
})();

function carregarNomeUsuario() {
    const nomeUsuarioEl = document.getElementById('nomeUsuario');
    const usuario = sessionStorage.getItem('usuario');

    if (nomeUsuarioEl && usuario) {
        const usuarioObjeto = JSON.parse(usuario);
        nomeUsuarioEl.textContent = usuarioObjeto.nome;
    }
}

// Função para deslogar o usuário
function logout() {
    sessionStorage.removeItem('usuario');
    alert('Você saiu do sistema.');
    window.location.href = '/src/modules/auth/login.html';
}
