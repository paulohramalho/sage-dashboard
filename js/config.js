// config.js

/**
 * URL base da API.
 * @type {string}
 */
const API_URL = 'http://localhost:8080/api'; // Substitua pelo endereço real da sua API

/**
 * Função para buscar o token de autenticação do cookie.
 * @returns {string|null} O token Bearer ou null se não for encontrado.
 */
function getAuthToken() {
    // A função deve buscar o cookie chamado 'USER_TOKEN'
    const name = 'USER_TOKEN=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            // O token é o valor do cookie, sem o prefixo 'USER_TOKEN='
            return c.substring(name.length, c.length);
        }
    }
    return null;
}

/**
 * Função genérica para fazer chamadas à API com autenticação Bearer Token.
 *
 * @param {string} endpoint O endpoint específico da API (ex: '/usuarios', '/empresas/1').
 * @param {object} options Opções de requisição (method, headers, body, etc.).
 * @returns {Promise<object>} A resposta da API em formato JSON.
 * @throws {Error} Se a requisição falhar ou retornar um status de erro.
 */
async function callApi(endpoint, options = {}) {
    const token = getAuthToken();
    const url = `${API_URL}${endpoint}`;

    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            // Tenta capturar a resposta de erro da API
            const errorData = await response.json().catch(() => ({ 
                message: `Erro HTTP: ${response.status} ${response.statusText}` 
            }));
            
            // Processa a mensagem de erro
            let mensagemErro = errorData.message || `Erro na requisição: ${response.status} ${response.statusText}`;
            
            // 🔹 Trata erros de validação (campo: mensagem; campo: mensagem;)
            if (mensagemErro.includes(':') && mensagemErro.includes(';')) {
                // Separa as mensagens por ';'
                const erros = mensagemErro.split(';')
                    .map(erro => erro.trim())
                    .filter(erro => erro.length > 0);
                
                if (erros.length > 0) {
                    // Pega apenas a primeira mensagem e remove o nome do campo antes do ':'
                    const primeiroErro = erros[erros.length - 1];
                    const indexDoisPontos = primeiroErro.indexOf(':');
                    
                    if (indexDoisPontos !== -1) {
                        // Remove o nome do campo e mantém apenas a mensagem
                        mensagemErro = primeiroErro.substring(indexDoisPontos + 1).trim();
                    } else {
                        mensagemErro = primeiroErro;
                    }
                }
            }
            
            // Exibe o erro usando a função exibirErro
            if (typeof exibirErro === 'function') {
                exibirErro(mensagemErro);
            }
            
            // Cria um erro customizado com os dados da API
            const error = new Error(mensagemErro);
            error.status = response.status;
            error.data = errorData;
            throw error;
        }

        // Tenta retornar JSON. Se o corpo estiver vazio (ex: 204 No Content), retorna um objeto vazio.
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return await response.json();
        } else {
            return {};
        }

    } catch (error) {
        // Se o erro não tiver sido tratado ainda (ex: erro de rede), exibe também
        if (!error.status && typeof exibirErro === 'function') {
            exibirErro(error.message || 'Erro ao comunicar com o servidor');
        }
        
        // Propaga o erro para ser tratado pela função que chamou callApi (se necessário)
        throw error;
    }
}

// Exporta as funções e a constante para uso em outros arquivos JS
// Em um ambiente de módulos (como ES Modules), usaríamos `export`, mas
// para compatibilidade com um projeto que parece usar scripts tradicionais,
// vamos anexar ao objeto global ou a um namespace, ou simplesmente deixar
// as funções globais se o config.js for carregado antes dos outros scripts.
// Assumindo que o projeto usa scripts tradicionais e as funções serão globais:
// window.API_URL = API_URL;
// window.callApi = callApi;
// window.getAuthToken = getAuthToken;

// Para evitar poluir o escopo global, vamos usar um objeto global simples
// se o projeto não usar módulos, ou se for um projeto pequeno.
// No contexto de um dashboard, vamos assumir que as funções precisam ser acessíveis globalmente.
// Se o projeto for migrado para módulos, a exportação precisará ser ajustada.
// Por enquanto, vamos manter as funções globais para simplicidade.

// Se for um projeto que usa import/export:
// export { API_URL, callApi, getAuthToken };
// Para o escopo global:
// window.API_URL = API_URL;
// window.callApi = callApi;
// window.getAuthToken = getAuthToken;

// Para o propósito deste projeto, vamos usar o escopo global para que as funções sejam acessíveis
// nos outros arquivos JS (como dashboard.js, empresas.js, etc.)
// É uma prática comum em projetos legados ou que não usam bundlers.

// A constante API_URL não precisa estar no escopo global se for usada apenas dentro de callApi.
// Mas para fins de depuração ou acesso direto, pode ser útil.
// Vamos manter apenas as funções no escopo global para evitar conflito.
window.callApi = callApi;
window.getAuthToken = getAuthToken;
window.API_URL = API_URL; // Mantendo a URL global para referência.