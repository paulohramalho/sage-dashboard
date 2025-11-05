// Variável global para armazenar o ROLE do usuário
let USER_ROLE = null;

// Função auxiliar para decodificar o JWT
function decodeJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Erro ao decodificar JWT:", e);
        return null;
    }
}

// Função auxiliar para definir um cookie
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; Secure; SameSite=Lax";
}

// Função para exibir mensagens
function displayMessage(type, message) {
    const container = document.querySelector('.container');
    let messageDiv = document.querySelector('.message');
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        container.prepend(messageDiv);
    }
    messageDiv.className = 'message ' + type;
    messageDiv.textContent = message;

    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Multi-step form logic
let currentStep = 1;
const totalSteps = 3;

function updateStep(step) {
    currentStep = step;

    // Update progress bar
    const progressBar = document.querySelector('.progress-bar');
    progressBar.setAttribute('data-step', step);

    // Update progress steps
    document.querySelectorAll('.progress-step').forEach((stepEl, index) => {
        stepEl.classList.remove('active', 'completed');
        if (index + 1 < step) {
            stepEl.classList.add('completed');
        } else if (index + 1 === step) {
            stepEl.classList.add('active');
        }
    });

    // Update form steps
    document.querySelectorAll('.form-step').forEach((formStep) => {
        formStep.classList.remove('active');
        if (parseInt(formStep.getAttribute('data-step')) === step) {
            formStep.classList.add('active');
        }
    });
}

// Navigation buttons
document.getElementById('next-step-1').addEventListener('click', () => {
    if (validateStep(1)) {
        requirementsBox.classList.remove('show'); // Esconde a caixa ao avançar
        updateStep(2);
    }
});

document.getElementById('next-step-2').addEventListener('click', () => {
    if (validateStep(2)) updateStep(3);
});

document.getElementById('prev-step-2').addEventListener('click', () => updateStep(1));
document.getElementById('prev-step-3').addEventListener('click', () => updateStep(2));

function validateStep(step) {
    const formStep = document.querySelector(`.form-step[data-step="${step}"]`);
    const inputs = formStep.querySelectorAll('input[required]');
    let valid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.focus();
            valid = false;
            return false;
        }
    });

    // Validação especial para step 1 (senha)
    if (step === 1) {
        const password = document.getElementById('adminPassword').value;
        const confirmPassword = document.getElementById('adminPasswordConfirm').value;

        if (password == "") {
            displayMessage('error', 'A senha não pode ser vazia.');
            passwordInput.focus(); // Força o foco para exibir a caixa de requisitos
            return false;
        }

        if (!validatePassword(password)) {
            displayMessage('error', 'A senha não atende aos requisitos mínimos.');
            return false;
        }

        if (password !== confirmPassword) {
            displayMessage('error', 'As senhas não coincidem.');
            document.getElementById('adminPasswordConfirm').focus();
            return false;
        }
    }

    return valid;
}

// Password validation
function validatePassword(password) {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return minLength && hasUppercase && hasSpecial;
}

// Show/hide password requirements and validate in real-time
const passwordInput = document.getElementById('adminPassword');
const requirementsBox = document.getElementById('passwordRequirements');

passwordInput.addEventListener('focus', () => {
    requirementsBox.classList.add('show');
});

passwordInput.addEventListener('blur', () => {
    // Só esconde a caixa se o campo for válido (ou seja, não estiver vazio e atender ao minlength)
    // Isso evita que a caixa pisque e suma durante a validação de falha.
    if (passwordInput.value.trim() !== "") { // Esconde apenas se não estiver vazio
        setTimeout(() => {
            requirementsBox.classList.remove('show');
        }, 200);
    }
});

passwordInput.addEventListener('input', (e) => {
    const password = e.target.value;

    // Length requirement
    const reqLength = document.getElementById('req-length');
    if (password.length >= 8) {
        reqLength.classList.add('valid');
    } else {
        reqLength.classList.remove('valid');
    }

    // Uppercase requirement
    const reqUppercase = document.getElementById('req-uppercase');
    if (/[A-Z]/.test(password)) {
        reqUppercase.classList.add('valid');
    } else {
        reqUppercase.classList.remove('valid');
    }

    // Special character requirement
    const reqSpecial = document.getElementById('req-special');
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        reqSpecial.classList.add('valid');
    } else {
        reqSpecial.classList.remove('valid');
    }
});

// Login form
document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const btn = event.target.querySelector('.btn-primary');
    btn.classList.add('btn-loading');

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (email == "" || password == "") {
        btn.classList.remove('btn-loading');
        displayMessage('error', 'Preencha os campos e tente novamente.');
        return
    }

    try {
        const response = await fetch(API_URL + '/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        try {
            data = await response.json();
        } catch {
            data = {};
        }

        if (response.ok) {
            const token = data.token;
            setCookie('USER_TOKEN', token, 7);

            const payload = decodeJwt(token);
            if (payload && payload.ROLE) {
                USER_ROLE = payload.ROLE;
            }

            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        } else {
            if (response.status === 401) {
                displayMessage('error', "Usuário e/ou senha inválidos. Tente novamente.");
            } else {
                displayMessage('error', 'Erro ao fazer login.');
            }
        }
    } catch (error) {
        displayMessage('error', "Usuário e/ou senha inválidos. Tente novamente.");
    } finally {
        btn.classList.remove('btn-loading');
    }
});

// Register form
document.getElementById('register-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const btn = event.target.querySelector('button[type="submit"]');
    btn.classList.add('btn-loading');

    const form = event.target;
    const formData = {
        cnpj: form.cnpj.value,
        razaoSocial: form.razaoSocial.value,
        nomeFantasia: form.nomeFantasia.value,
        telefone: form.telefone.value,
        logradouro: form.logradouro.value,
        number: parseInt(form.number.value, 10),
        bairro: form.bairro.value,
        zipCode: form.zipCode.value,
        city: form.city.value,
        uf: form.uf.value,
        complemento: form.complemento.value,
        adminName: form.adminName.value,
        adminEmail: form.adminEmail.value,
        adminPassword: form.adminPassword.value
    };

    const response = await fetch(API_URL + '/company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });

    let data = {};

    try{
        data = await response.json();
    }catch{

    }

    if (response.ok) {
        displayMessage('success', 'Cadastro realizado! Faça login para continuar.');
        form.reset();
        updateStep(1);
        setTimeout(() => {
            document.getElementById('register-card').classList.add('hidden');
            document.getElementById('login-card').classList.remove('hidden');
            document.querySelector('.container').classList.remove('expanded');
        }, 2000);
    } else {
        console.log(data);
        displayMessage( 'Erro ao realizar cadastro.');
    }

    btn.classList.remove('btn-loading');
});

// Função para buscar endereço pelo CEP
async function fetchAddressByZipCode(zipCode) {
    const cleanZipCode = zipCode.replace(/\D/g, '');
    if (cleanZipCode.length !== 8) {
        return;
    }

    const url = `https://viacep.com.br/ws/${cleanZipCode}/json/`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data.erro) {
            document.getElementById('logradouro').value = data.logradouro || '';
            document.getElementById('bairro').value = data.bairro || '';
            document.getElementById('city').value = data.localidade || '';
            document.getElementById('uf').value = data.uf || '';
            document.getElementById('complemento').value = data.complemento || '';
            document.getElementById('number').focus(); // Foca no campo número
        } else {
            displayMessage('error', 'CEP não encontrado.');
        }
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        displayMessage('error', 'Erro ao buscar CEP. Tente novamente.');
    }
}

// Event listener para o campo CEP
document.getElementById('zipCode').addEventListener('blur', (e) => {
    fetchAddressByZipCode(e.target.value);
});

// Toggle forms
document.getElementById('show-register').addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('login-card').classList.add('hidden');
    document.getElementById('register-card').classList.remove('hidden');
    document.querySelector('.container').classList.add('expanded');
    updateStep(1);
});

document.getElementById('back-to-login').addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('register-card').classList.add('hidden');
    document.getElementById('login-card').classList.remove('hidden');
    document.querySelector('.container').classList.remove('expanded');
});

window.USER_ROLE = USER_ROLE