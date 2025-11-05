// JavaScript para FAQ
document.addEventListener('DOMContentLoaded', function () {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('i');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Fechar todos os itens
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('i').style.transform = 'rotate(0deg)';
            });

            // Abrir o item clicado se não estava ativo
            if (!isActive) {
                item.classList.add('active');
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });
});