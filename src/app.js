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

// Função para deslogar o usuário
function logout() {
    sessionStorage.removeItem('usuario');
    alert('Você saiu do sistema.');
    window.location.href = '/src/modules/auth/login.html';
}
