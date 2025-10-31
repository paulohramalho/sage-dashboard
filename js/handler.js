// error-handler.js

/**
 * Função para exibir uma mensagem de erro em um box no canto inferior da tela.
 *
 * @param {string} message A mensagem de erro a ser exibida.
 * @param {number} duration Duração em milissegundos para a caixa de erro ficar visível (padrão: 5000ms).
 */
function exibirErro(message, duration = 5000) {
    // 1. Garante que o container existe no DOM
    let container = document.getElementById('error-box-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'error-box-container';
        document.body.appendChild(container);
    }

    // 2. Cria o elemento da mensagem de erro
    const errorBox = document.createElement('div');
    errorBox.className = 'error-message-box';
    errorBox.innerHTML = `
        <button type="button" class="close-button" aria-label="Close">&times;</button>
        ${message}
    `;

    // 3. Adiciona a caixa ao container
    // Adiciona no topo do container para que os novos erros apareçam por baixo
    container.prepend(errorBox);

    // 4. Força o reflow para garantir que a transição de entrada funcione
    // eslint-disable-next-line no-unused-vars
    const reflow = errorBox.offsetHeight;

    // 5. Inicia a transição de entrada
    setTimeout(() => {
        errorBox.classList.add('show');
    }, 10); // Pequeno delay para garantir o reflow

    // 6. Configura o fechamento automático
    let timeoutId = setTimeout(() => {
        closeErrorBox(errorBox);
    }, duration);

    // 7. Configura o botão de fechar
    const closeButton = errorBox.querySelector('.close-button');
    closeButton.onclick = () => {
        clearTimeout(timeoutId); // Cancela o fechamento automático
        closeErrorBox(errorBox);
    };

    /**
     * Função interna para fechar a caixa de erro com transição.
     * @param {HTMLElement} box O elemento da caixa de erro.
     */
    function closeErrorBox(box) {
        box.classList.remove('show');
        box.classList.add('hide');

        // Remove o elemento do DOM após a transição de saída (0.5s definido no CSS)
        setTimeout(() => {
            box.remove();
        }, 500);
    }
}

/**
 * Função para exibir uma mensagem de sucesso em um box no canto inferior da tela.
 *
 * @param {string} message A mensagem de sucesso a ser exibida.
 * @param {number} duration Duração em milissegundos para a caixa de sucesso ficar visível (padrão: 5000ms).
 */
function exibirSucesso(message, duration = 5000) {
    // 1. Garante que o container existe no DOM
    let container = document.getElementById('error-box-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'error-box-container';
        document.body.appendChild(container);
    }

    // 2. Cria o elemento da mensagem de sucesso
    const successBox = document.createElement('div');
    successBox.className = 'success-message-box';
    successBox.innerHTML = `
        <button type="button" class="close-button" aria-label="Close">&times;</button>
        ${message}
    `;

    // 3. Adiciona a caixa ao container
    container.prepend(successBox);

    // 4. Força o reflow para garantir que a transição de entrada funcione
    const reflow = successBox.offsetHeight;

    // 5. Inicia a transição de entrada
    setTimeout(() => {
        successBox.classList.add('show');
    }, 10);

    // 6. Configura o fechamento automático
    let timeoutId = setTimeout(() => {
        closeSuccessBox(successBox);
    }, duration);

    // 7. Configura o botão de fechar
    const closeButton = successBox.querySelector('.close-button');
    closeButton.onclick = () => {
        clearTimeout(timeoutId);
        closeSuccessBox(successBox);
    };

    /**
     * Função interna para fechar a caixa de sucesso com transição.
     * @param {HTMLElement} box O elemento da caixa de sucesso.
     */
    function closeSuccessBox(box) {
        box.classList.remove('show');
        box.classList.add('hide');

        setTimeout(() => {
            box.remove();
        }, 500);
    }
}

/**
 * Exibe um modal de confirmação
 * @param {Object} options - Opções de configuração
 * @param {string} options.title - Título do modal (padrão: "Confirmar ação")
 * @param {string} options.message - Mensagem a ser exibida
 * @param {string} options.type - Tipo: 'danger', 'warning', 'info' (padrão: 'danger')
 * @param {string} options.confirmText - Texto do botão confirmar (padrão: "Confirmar")
 * @param {string} options.cancelText - Texto do botão cancelar (padrão: "Cancelar")
 * @param {Function} options.onConfirm - Callback ao confirmar
 * @param {Function} options.onCancel - Callback ao cancelar (opcional)
 */
function exibirConfirmacao(options = {}) {
    const {
        title = 'Confirmar ação',
        message = 'Tem certeza que deseja continuar?',
        type = 'danger',
        confirmText = 'Confirmar',
        cancelText = 'Cancelar',
        onConfirm = () => {},
        onCancel = () => {}
    } = options;

    // Define o ícone baseado no tipo
    const icons = {
        danger: '<i class="fas fa-exclamation-triangle"></i>',
        warning: '<i class="fas fa-exclamation-circle"></i>',
        info: '<i class="fas fa-info-circle"></i>',
        success: '<i class="fas fa-check-circle"></i>',
        question: '<i class="fas fa-question-circle"></i>'
    };

    const icon = icons[type] || icons.danger;

    // Remove modal anterior se existir
    const existingModal = document.getElementById('confirmModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Cria o HTML do modal
    const modalHTML = `
        <div id="confirmModal" class="confirm-modal show">
            <div class="confirm-modal-content">
                <div class="confirm-modal-header">
                    <div class="confirm-modal-icon ${type}">
                        ${icon}
                    </div>
                    <h3 class="confirm-modal-title">${title}</h3>
                </div>
                <div class="confirm-modal-body">
                    <p class="confirm-modal-message">${message}</p>
                </div>
                <div class="confirm-modal-footer">
                    <button class="btn btn-outline" id="confirmCancelBtn">${cancelText}</button>
                    <button class="btn btn-${type}" id="confirmActionBtn">${confirmText}</button>
                </div>
            </div>
        </div>
    `;

    // Adiciona o modal ao body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('confirmModal');
    const confirmBtn = document.getElementById('confirmActionBtn');
    const cancelBtn = document.getElementById('confirmCancelBtn');

    // Fecha o modal
    const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    };

    // Evento do botão confirmar
    confirmBtn.onclick = () => {
        closeModal();
        onConfirm();
    };

    // Evento do botão cancelar
    cancelBtn.onclick = () => {
        closeModal();
        onCancel();
    };

    // Fecha ao clicar fora do modal
    modal.onclick = (e) => {
        if (e.target === modal) {
            closeModal();
            onCancel();
        }
    };

    // Fecha com ESC
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            onCancel();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}



// Torna as funções globalmente acessíveis
window.exibirErro = exibirErro;
window.exibirSucesso = exibirSucesso;
window.exibirConfirmacao = exibirConfirmacao;