// JavaScript para o botão de voltar
document.addEventListener('DOMContentLoaded', function () {
    const backButton = document.querySelector('.back-button');

    // Adicionar classe ao body para ativar os estilos do navbar
    document.body.classList.add('has-back-button');

    if (backButton) {
        // Verificar se há histórico disponível
        if (window.history.length <= 1) {
            // Se não há histórico, redirecionar para a página inicial
            backButton.addEventListener('click', function (e) {
                e.preventDefault();
                window.location.href = 'index.html';
            });
        } else {
            // Se há histórico, usar history.back()
            backButton.addEventListener('click', function (e) {
                e.preventDefault();
                window.history.back();
            });
        }

        // Animação de entrada do botão
        setTimeout(() => {
            backButton.style.opacity = '1';
            backButton.style.transform = 'translateX(0)';
        }, 300);

        // Inicialmente escondido para animação
        backButton.style.opacity = '0';
        backButton.style.transform = 'translateX(-20px)';
        backButton.style.transition = 'all 0.3s ease';
    }
});