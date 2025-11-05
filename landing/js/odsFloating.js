// Script para o botão flutuante ODS 7
document.addEventListener('DOMContentLoaded', function () {
    const odsFloatingBtn = document.getElementById('ods-floating-button');
    const impactoSection = document.getElementById('impacto');

    // Verificar se os elementos existem na página
    if (!odsFloatingBtn || !impactoSection) {
        return;
    }

    // Função para verificar se o botão deve ser mostrado
    function toggleFloatingButton() {
        const impactoRect = impactoSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Se a seção de impacto está visível na tela, esconder o botão flutuante
        if (impactoRect.top <= windowHeight && impactoRect.bottom >= 0) {
            odsFloatingBtn.style.opacity = '0';
            odsFloatingBtn.style.visibility = 'hidden';
        } else {
            odsFloatingBtn.style.opacity = '1';
            odsFloatingBtn.style.visibility = 'visible';
        }
    }

    // Adicionar evento de scroll
    window.addEventListener('scroll', toggleFloatingButton);

    // Verificar inicialmente
    toggleFloatingButton();

    // Click no botão flutuante
    odsFloatingBtn.addEventListener('click', function () {
        window.open('https://brasil.un.org/pt-br/sdgs/7', '_blank');
    });
});