// ===== APLICAÇÃO PRINCIPAL =====

class App {
    constructor() {
        this.currentPage = 'dashboard';
        this.data = {
            usuarios: [],
            setores: [],
            salas: [],
            dispositivos: [],
            consumo: [],
            enderecos: [],
            tiposDispositivos: [],
            vinculos: []
        };
        this.currentSearch = '';
        this.init();
    }

    init() {
        // Aguardar DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupEventListeners();
                this.loadMockData();
                this.loadDashboard();
            });
        } else {
            this.setupEventListeners();
            this.loadMockData();
            this.loadDashboard();
        }
    }

    setupEventListeners() {
        // Navegação
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.closest('.nav-link').dataset.page;
                this.navigateTo(page);
            });
        });

        // Modal
        const modal = document.getElementById('formModal');
        const closeBtn = document.querySelector('.close');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('show');
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });

        // Logout
        document.querySelector('.logout-btn')?.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja sair?')) {
                alert('Logout realizado com sucesso!');
                // Aqui você redirecionaria para a página de login
            }
        });
    }

    navigateTo(page) {
        this.currentPage = page;
        
        // Atualizar link ativo
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`)?.classList.add('active');

        // Carregar página
        switch(page) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'usuarios':
                this.loadUsuarios();
                break;
            case 'setores':
                this.loadSetores();
                break;
            case 'salas':
                this.loadSalas();
                break;
            case 'dispositivos':
                this.loadDispositivos();
                break;
            case 'consumo':
                this.loadConsumo();
                break;
            case 'relatorios':
                this.loadRelatorios();
                break;

            case 'tipos-dispositivos':
                this.loadTiposDispositivos();
                break;
            case 'vinculos':
                this.loadVinculos();
                break;
        }
    }

    loadMockData() {
        // Dados de exemplo

        this.data.tiposDispositivos = [
            { id: 1, nome: 'Máquina Industrial'},
            { id: 2, nome: 'Compressor'},
            { id: 3, nome: 'Ar Condicionado'}
        ];
        this.data.usuarios = [
            { id: 1, nome: 'João Silva', email: 'joao@empresa.com', role: 'Admin'},
            { id: 2, nome: 'Maria Santos', email: 'maria@empresa.com', role: 'Usuário'},
            { id: 3, nome: 'Pedro Costa', email: 'pedro@empresa.com', role: 'Usuário'}
        ];

        this.data.setores = [
            { id: 1, nome: 'Produção', descricao: 'Setor de produção'},
            { id: 2, nome: 'Administrativo', descricao: 'Setor administrativo'},
            { id: 3, nome: 'Almoxarifado', descricao: 'Setor de estoque'}
        ];

        this.data.salas = [
            { id: 1, nome: 'Sala 101', descricao: 'Sala de produção', setor: 'Produção'},
            { id: 2, nome: 'Sala 102', descricao: 'Sala de produção', setor: 'Produção'},
            { id: 3, nome: 'Sala 201', descricao: 'Sala administrativa', setor: 'Administrativo'}
        ];

        this.data.dispositivos = [
            { id: 1, nome: 'Máquina CNC 01', potencia: 5.5, tipo: 'Máquina Industrial'},
            { id: 2, nome: 'Compressor 01', potencia: 7.5, tipo: 'Compressor'},
            { id: 3, nome: 'Ar Condicionado 01', potencia: 2.5, tipo: 'Ar Condicionado'}
        ];

        this.data.consumo = [
            { id: 1, data: '2024-01-15', hora: '10:30', dispositivo: 'Máquina CNC 01', corrente: 15.5, tensao: 220, potenciaAtiva: 5.5 },
            { id: 2, data: '2024-01-15', hora: '11:00', dispositivo: 'Compressor 01', corrente: 22.5, tensao: 220, potenciaAtiva: 7.5 },
            { id: 3, data: '2024-01-15', hora: '11:30', dispositivo: 'Ar Condicionado 01', corrente: 10.2, tensao: 220, potenciaAtiva: 2.5 }
        ];

        this.data.vinculos = [
            { id: 1, apelido: 'CNC Sala 101', sala: 'Sala 101', dispositivo: 'Máquina CNC 01', tempoMedio: 8.5 },
            { id: 2, apelido: 'Compressor Sala 102', sala: 'Sala 102', dispositivo: 'Compressor 01', tempoMedio: 6.0 },
            { id: 3, apelido: 'AC Sala 201', sala: 'Sala 201', dispositivo: 'Ar Condicionado 01', tempoMedio: 24.0 }
        ];
    }

    loadDashboard() {
        const content = document.getElementById('page-content');
        content.innerHTML = `
            <div class="dashboard-page">
                <h2>Dashboard</h2>
                <div class="stats-row">
                    <div class="stat-card">
                        <div class="stat-card-icon"><i class="fas fa-bolt"></i></div>
                        <div class="stat-card-label">Consumo Total Hoje</div>
                        <div class="stat-card-value">1,245.5 kWh</div>
                        <div class="stat-card-change">↑ 5% vs ontem</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card-icon"><i class="fas fa-users"></i></div>
                        <div class="stat-card-label">Usuarios Ativos</div>
                        <div class="stat-card-value">${this.data.usuarios.length}</div>
                        <div class="stat-card-change">Gerenciadas</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card-icon"><i class="fas fa-plug"></i></div>
                        <div class="stat-card-label">Dispositivos Ativos</div>
                        <div class="stat-card-value">${this.data.dispositivos.length}</div>
                        <div class="stat-card-change">Monitorados</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card-icon"><i class="fas fa-chart-pie"></i></div>
                        <div class="stat-card-label">Custo Estimado</div>
                        <div class="stat-card-value">R$ 1.245,50</div>
                        <div class="stat-card-change">Mês atual</div>
                    </div>
                </div>

                <div class="charts-grid-2">
                    <div class="chart-container">
                        <div class="chart-header">
                            <h3 class="chart-title">Consumo por Hora</h3>
                            <div class="chart-controls">
                                <select id="chartPeriod1">
                                    <option>Hoje</option>
                                    <option>Esta Semana</option>
                                    <option>Este Mês</option>
                                </select>
                            </div>
                        </div>
                        <div class="chart-body">
                            <canvas id="consumoChart"></canvas>
                        </div>
                    </div>

                    <div class="chart-container">
                        <div class="chart-header">
                            <h3 class="chart-title">Consumo por Dispositivo</h3>
                        </div>
                        <div class="chart-body">
                            <canvas id="dispositivoChart"></canvas>
                        </div>
                    </div>
                </div>

                <div class="chart-container">
                    <div class="chart-header">
                        <h3 class="chart-title">Últimas Leituras</h3>
                    </div>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Data/Hora</th>
                                <th>Dispositivo</th>
                                <th>Corrente (A)</th>
                                <th>Tensão (V)</th>
                                <th>Potência Ativa (kW)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.data.consumo.map(c => `
                                <tr>
                                    <td>${c.data} ${c.hora}</td>
                                    <td>${c.dispositivo}</td>
                                    <td>${c.corrente}</td>
                                    <td>${c.tensao}</td>
                                    <td>${c.potenciaAtiva}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Renderizar gráficos
        this.renderConsumoChart();
        this.renderDispositivoChart();
    }

    renderConsumoChart() {
        const ctx = document.getElementById('consumoChart');
        if (ctx) {
            // Gerar dados de consumo por hora (24 horas)
            const hours = [];
            const consumoData = [];
            const avgData = [];
            const minData = [];
            const maxData = [];
            
            for (let i = 0; i < 24; i++) {
                hours.push(`${String(i).padStart(2, '0')}:00`);
                // Simular consumo com variação ao longo do dia
                const baseConsumo = 150 + Math.sin(i / 24 * Math.PI * 2) * 50 + Math.random() * 30;
                consumoData.push(baseConsumo.toFixed(2));
                avgData.push((baseConsumo * 0.85).toFixed(2));
                minData.push((baseConsumo * 0.7).toFixed(2));
                maxData.push((baseConsumo * 1.15).toFixed(2));
            }
            
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: hours,
                    datasets: [
                        {
                            label: 'Consumo (kWh)',
                            data: consumoData,
                            borderColor: '#ffb703',
                            backgroundColor: 'rgba(255, 183, 3, 0.1)',
                            borderWidth: 2,
                            fill: true,
                            tension: 0.4
                        },
                        {
                            label: 'Média',
                            data: avgData,
                            borderColor: '#219ebc',
                            borderWidth: 1,
                            borderDash: [5, 5],
                            fill: false,
                            tension: 0.4,
                            pointRadius: 0
                        },
                        {
                            label: 'Mínimo',
                            data: minData,
                            borderColor: '#06d6a0',
                            borderWidth: 1,
                            borderDash: [2, 2],
                            fill: false,
                            tension: 0.4,
                            pointRadius: 0
                        },
                        {
                            label: 'Máximo',
                            data: maxData,
                            borderColor: '#ef476f',
                            borderWidth: 1,
                            borderDash: [2, 2],
                            fill: false,
                            tension: 0.4,
                            pointRadius: 0
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return context.dataset.label + ': ' + context.parsed.y + ' kWh';
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Consumo (kWh)'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Hora do Dia'
                            }
                        }
                    }
                }
            });
        }
    }

    renderDispositivoChart() {
        const ctx = document.getElementById('dispositivoChart');
        if (ctx) {
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Máquina CNC 01', 'Compressor 01', 'Ar Condicionado 01'],
                    datasets: [{
                        data: [450, 320, 230],
                        backgroundColor: [
                            '#ffb703',
                            '#fb8500',
                            '#f77f00'
                        ],
                        borderColor: '#ffffff',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    }

    async loadUsuarios() {
        const content = document.getElementById('page-content');
        
        // Tenta carregar dados da API
        try {
            // Assumindo que o endpoint para usuários é '/usuarios'
            const usuarios = await callApi('/usuarios');
            this.data.usuarios = usuarios; // Atualiza os dados mockados com os dados da API
        } catch (error) {
            // Exibe o erro na tela se a chamada falhar
            exibirErro(`Erro ao carregar usuários: ${error.message}`);
            // Se falhar, usa os dados mockados existentes (ou deixa vazio se preferir)
        }

        content.innerHTML = `
            <div class="usuarios-page">
                <div class="card-header">
                    <h2>Gerenciar Usuários</h2>
                    <button class="btn btn-primary" onclick="app.openUsuarioForm()">+ Novo Usuário</button>
                </div>

                <div class="table-container">
                    <div class="table-header">
                        <h3>Lista de Usuários</h3>
                        <div class="table-search">
                            <input type="text" placeholder="Buscar usuário..." id="searchUsuarios">
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Perfil</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.data.usuarios.length === 0 ? `
                                <tr><td colspan="5" style="text-align: center;">Nenhum usuário encontrado.</td></tr>
                            ` : this.data.usuarios.map(u => `
                                <tr>
                                    <td>${u.nome}</td>
                                    <td>${u.email}</td>
                                    <td><span class="badge badge-primary">${u.role}</span></td>
                                        <td>
                                            <div class="cell-actions">
                                                <button class="action-btn action-btn-edit" 
                                                        onclick="app.editSetor('${s.id}')">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                                <button class="action-btn action-btn-delete" 
                                                        onclick="app.deleteSetor('${s.id}')">
                                                    <i class="fas fa-trash-alt"></i>
                                                </button>
                                            </div>
                                        </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        document.getElementById('searchUsuarios')?.addEventListener('keyup', (e) => {
            const search = e.target.value.toLowerCase();
            document.querySelectorAll('tbody tr').forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(search) ? '' : 'none';
            });
        });
    }

    openUsuarioForm(usuarioId = null) {
        const modal = document.getElementById('formModal');
        const form = document.getElementById('modal-form');
        const usuario = usuarioId ? this.data.usuarios.find(u => u.id === usuarioId) : null;
        
        form.innerHTML = `
            <div class="form-card">
                <div class="form-card-header">
                    <h2>${usuario ? 'Editar Usuário' : 'Novo Usuário'}</h2>
                    <p>${usuario ? 'Atualize os dados do usuário' : 'Preencha os dados do novo usuário'}</p>
                </div>
                <form id="usuarioForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Nome <span class="required">*</span></label>
                            <input type="text" name="nome" value="${usuario ? usuario.nome : ''}" required>
                        </div>
                        <div class="form-group">
                            <label>Email <span class="required">*</span></label>
                            <input type="email" name="email" value="${usuario ? usuario.email : ''}" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Perfil <span class="required">*</span></label>
                        <select name="role" required>
                            <option value="">Selecione um perfil</option>
                            <option value="Admin" ${usuario && usuario.role === 'Admin' ? 'selected' : ''}>Admin</option>
                            <option value="Usuário" ${usuario && usuario.role === 'Usuário' ? 'selected' : ''}>Usuário</option>
                            <option value="Visualizador" ${usuario && usuario.role === 'Visualizador' ? 'selected' : ''}>Visualizador</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Senha ${usuario ? '' : '<span class="required">*</span>'}</label>
                        <input type="password" name="senha" ${usuario ? '' : 'required'}>
                        ${usuario ? '<small>Deixe em branco para manter a senha atual</small>' : ''}
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline" onclick="document.getElementById('formModal').classList.remove('show')">Cancelar</button>
                        <button type="submit" class="btn btn-primary">${usuario ? 'Atualizar Usuário' : 'Salvar Usuário'}</button>
                    </div>
                </form>
            </div>
        `;
        modal.classList.add('show');

        document.getElementById('usuarioForm').addEventListener('submit', (e) => {
            e.preventDefault();
            alert(`Usuário ${usuario ? 'atualizado' : 'salvo'} com sucesso!`);
            modal.classList.remove('show');
        });
    }

    editUsuario(id) {
        this.openUsuarioForm(id);
    }

    deleteUsuario(id) {
        if (confirm('Tem certeza que deseja deletar este usuário?')) {
            alert(`Usuário ${id} deletado com sucesso!`);
        }
    }

    // =============================
    // 🔹 Função utilitária global
    // =============================
    debounce(fn, delay) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    async loadSetores(page = 0, name = '') {
        try {
            this.currentSearch = name;
            const size = 10;
            
            const query = new URLSearchParams({
                name: name || '',
                page,
                size
            }).toString();
            
            const response = await callApi(`/department?${query}`, { method: 'GET' });

            // Cria a paginação se ainda não existir
            if (!this.setoresPagination) {
                this.setoresPagination = new Pagination('setores', size);
                this.setoresPagination.setRemoteLoader((newPage) => {
                    const searchTerm = document.getElementById('searchSetores')?.value || '';
                    return this.loadSetores(newPage, searchTerm);
                });
            }

            // Atualiza dados da paginação
            this.setoresPagination.updateFromApiResponse(response);

            // Armazena os setores recebidos
            this.data = this.data || {};
            this.data.setores = response.content || [];

            // Renderiza a tabela
            this.renderSetoresTable();

        } catch (error) {
            console.error("Erro ao carregar setores:", error);
        }
    }

    renderSetoresTable() {
        const content = document.getElementById('page-content');
        const items = this.data?.setores || [];

        // Verifica se é a primeira renderização ou se precisa recriar tudo
        const isFirstRender = !document.getElementById('searchSetores');

        if (isFirstRender) {
            // Renderiza tudo pela primeira vez
            content.innerHTML = `
                <div class="setores-page">
                    <div class="card-header">
                        <h2>Gerenciar Setores</h2>
                        <button class="btn btn-primary" onclick="app.openSetorForm()">+ Novo Setor</button>
                    </div>

                    <div class="table-container">
                        <div class="table-header">
                            <h3>Lista de Setores</h3>
                            <div class="table-search">
                                <input type="text" placeholder="Buscar setor..." id="searchSetores" value="${this.currentSearch || ''}">
                            </div>
                        </div>

                        <table id="setoresTable">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Descrição</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody id="setoresTableBody">
                            </tbody>
                        </table>
                        <div class="pagination" id="setoresPagination">
                        </div>
                    </div>
                </div>
            `;

            // Adiciona o evento de busca apenas na primeira vez
            const input = document.getElementById('searchSetores');
            input.oninput = this.debounce(async (e) => {
                const searchTerm = e.target.value.trim();
                await this.loadSetores(0, searchTerm);
            }, 400);
        }

        // Atualiza apenas o tbody (não recria o input)
        const tbody = document.getElementById('setoresTableBody');
        tbody.innerHTML = items.length > 0 ? items.map(s => `
            <tr>
                <td>${s.name || '-'}</td>
                <td>${s.description || '-'}</td>
                <td>
                    <div class="cell-actions">
                        <button class="action-btn action-btn-edit" 
                                onclick="app.editSetor('${s.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn action-btn-delete" 
                                onclick="app.deleteSetor('${s.id}')">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('') : `
            <tr>
                <td colspan="3" style="text-align: center; padding: 40px; color: #999;">
                    Nenhum setor encontrado
                </td>
            </tr>
        `;

        // Atualiza apenas a paginação
        const paginationDiv = document.getElementById('setoresPagination');
        paginationDiv.innerHTML = this.setoresPagination.renderPaginationControls();
    }

    async openSetorForm(setorId = null) {
        const modal = document.getElementById('formModal');
        const form = document.getElementById('modal-form');
        let setor = null;

        // 🔹 Se for edição, busca o setor pelo ID
        if (setorId) {
            try {
                setor = await callApi(`/department/${setorId}`, { method: 'GET' });
            } catch (error) {
                console.error('Erro ao carregar setor:', error);
                return;
            }
        }

        form.innerHTML = `
            <div class="form-card">
                <div class="form-card-header">
                    <h2>${setor ? 'Editar Setor' : 'Novo Setor'}</h2>
                    <p>${setor ? 'Atualize os dados do setor' : 'Preencha os dados do novo setor'}</p>
                </div>
                <form id="setorForm">
                    <div class="form-group">
                        <label>Nome <span class="required">*</span></label>
                        <input type="text" name="name" value="${setor ? setor.name : ''}">
                    </div>
                    <div class="form-group">
                        <label>Descrição</label>
                        <textarea name="description">${setor ? setor.description || '' : ''}</textarea>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline" onclick="document.getElementById('formModal').classList.remove('show')">Cancelar</button>
                        <button type="submit" class="btn btn-primary">${setor ? 'Atualizar Setor' : 'Salvar Setor'}</button>
                    </div>
                </form>
            </div>
        `;

        modal.classList.add('show');

        // 🔹 Captura o envio do formulário
        document.getElementById('setorForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(e.target);
            const payload = Object.fromEntries(formData.entries());

            try {
                if (setorId) {
                    // Atualizar setor existente (PUT)
                    await callApi(`/department/${setorId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    exibirSucesso('Setor atualizado com sucesso!');
                } else {
                    // Criar novo setor (POST)
                    await callApi(`/department`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    exibirSucesso('Setor criado com sucesso!');
                }

                modal.classList.remove('show');
                await this.loadSetores(0);
            } catch (error) {
                console.error('Erro ao salvar setor:', error);
            }
        });
    }

    editSetor(id) {
        this.openSetorForm(id);
    }

    async deleteSetor(id) {
        exibirConfirmacao({
            title: 'Deletar Setor',
            message: 'Tem certeza que deseja deletar este setor? Esta ação não pode ser desfeita.',
            type: 'danger',
            confirmText: 'Sim, deletar',
            cancelText: 'Cancelar',
            onConfirm: async () => {
                try {
                    await callApi(`/department/${id}`, { method: 'DELETE' });
                    exibirSucesso('Setor deletado com sucesso!');
                    this.loadSetores();
                } catch (error) {
                    console.error('Erro ao deletar setor:', error);
                }
            }
        });
    }

    async loadSalas(page = 0, name = '', departmentId = '') {
        try {
            this.currentSearch = name;
            this.currentDepartmentFilter = departmentId;
            const size = 10;
            
            let response;
            
            if (departmentId) {
                const query = new URLSearchParams({
                    name: name || '',
                    page,
                    size
                }).toString();
                response = await callApi(`/department/${departmentId}/room?${query}`, { method: 'GET' });
            } else {
                const query = new URLSearchParams({
                    name: name || '',
                    page,
                    size
                }).toString();
                response = await callApi(`/room?${query}`, { method: 'GET' });
            }

            // Cria a paginação se ainda não existir
            if (!this.salasPagination) {
                this.salasPagination = new Pagination('salas', size);
                this.salasPagination.setRemoteLoader((newPage) => {
                    const searchTerm = document.getElementById('searchSalas')?.value || '';
                    const deptId = document.getElementById('filterDepartment')?.value || '';
                    return this.loadSalas(newPage, searchTerm, deptId);
                });
            }

            // Atualiza dados da paginação
            this.salasPagination.updateFromApiResponse(response);

            // Armazena as salas recebidas
            this.data = this.data || {};
            this.data.salas = response.content || [];

            // Renderiza a tabela
            this.renderSalasTable();

        } catch (error) {
            console.error("Erro ao carregar salas:", error);
        }
    }

    async renderSalasTable() {
        const content = document.getElementById('page-content');
        const items = this.data?.salas || [];

        const isFirstRender = !document.getElementById('searchSalas');

        if (isFirstRender) {
            let setores = [];
            try {
                const setoresResponse = await callApi('/department?page=0&size=1000', { method: 'GET' });
                setores = setoresResponse.content || [];
            } catch (error) {
                console.error('Erro ao carregar setores:', error);
            }

            content.innerHTML = `
                <div class="salas-page">
                    <div class="card-header">
                        <h2>Gerenciar Salas</h2>
                        <button class="btn btn-primary" onclick="app.openSalaForm()">+ Nova Sala</button>
                    </div>

                    <div class="table-container">
                        <div class="table-header">
                            <h3>Lista de Salas</h3>
                            <div class="table-search" style="display: flex; gap: 10px; align-items: center;">
                                <select id="filterDepartment" class="select2-search" style="min-width: 200px;">
                                    <option value="">Todos os setores</option>
                                    ${setores.map(s => `
                                        <option value="${s.id}" ${this.currentDepartmentFilter === s.id ? 'selected' : ''}>
                                            ${s.name}
                                        </option>
                                    `).join('')}
                                </select>
                                <input type="text" placeholder="Buscar sala..." id="searchSalas" value="${this.currentSearch || ''}">
                            </div>
                        </div>

                        <table id="salasTable">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Descrição</th>
                                    <th>Setor</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody id="salasTableBody">
                            </tbody>
                        </table>
                        <div class="pagination" id="salasPagination">
                        </div>
                    </div>
                </div>
            `;

            // Inicializa Select2 SEM AJAX (apenas com busca local)
            $('#filterDepartment').select2({
                placeholder: 'Todos os setores',
                allowClear: true,
                language: {
                    noResults: function() {
                        return "Nenhum setor encontrado";
                    },
                    searching: function() {
                        return "Buscando...";
                    }
                }
            });

            // Eventos
            const input = document.getElementById('searchSalas');
            input.oninput = this.debounce(async (e) => {
                const searchTerm = e.target.value.trim();
                const deptId = $('#filterDepartment').val() || '';
                await this.loadSalas(0, searchTerm, deptId);
            }, 400);

            $('#filterDepartment').on('change', async (e) => {
                const deptId = e.target.value;
                const searchTerm = document.getElementById('searchSalas')?.value || '';
                await this.loadSalas(0, searchTerm, deptId);
            });
        }

        // Restante do código...
        const tbody = document.getElementById('salasTableBody');
        tbody.innerHTML = items.length > 0 ? items.map(s => `
            <tr>
                <td>${s.name || '-'}</td>
                <td>${s.description || '-'}</td>
                <td>${s.department?.name || '-'}</td>
                <td>
                    <div class="cell-actions">
                        <button class="action-btn action-btn-edit" 
                                onclick="app.editSala('${s.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn action-btn-delete" 
                                onclick="app.deleteSala('${s.id}')">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('') : `
            <tr>
                <td colspan="4" style="text-align: center; padding: 40px; color: #999;">
                    Nenhuma sala encontrada
                </td>
            </tr>
        `;

        const paginationDiv = document.getElementById('salasPagination');
        paginationDiv.innerHTML = this.salasPagination.renderPaginationControls();
    }

    async openSalaForm(salaId = null) {
        const modal = document.getElementById('formModal');
        const form = document.getElementById('modal-form');
        let sala = null;

        // 🔹 Carrega os setores para o select
        let setores = [];
        try {
            const setoresResponse = await callApi('/department?page=0&size=1000', { method: 'GET' });
            setores = setoresResponse.content || [];
        } catch (error) {
            console.error('Erro ao carregar setores:', error);
        }

        // 🔹 Se for edição, busca a sala pelo ID
        if (salaId) {
            try {
                sala = await callApi(`/room/${salaId}`, { method: 'GET' });
            } catch (error) {
                console.error('Erro ao carregar sala:', error);
                return;
            }
        }

        form.innerHTML = `
            <div class="form-card">
                <div class="form-card-header">
                    <h2>${sala ? 'Editar Sala' : 'Nova Sala'}</h2>
                    <p>${sala ? 'Atualize os dados da sala' : 'Preencha os dados da nova sala'}</p>
                </div>
                <form id="salaForm">
                    <div class="form-group">
                        <label>Nome <span class="required">*</span></label>
                        <input type="text" name="name" value="${sala ? sala.name : ''}">
                    </div>
                    <div class="form-group">
                        <label>Descrição</label>
                        <textarea name="description">${sala ? sala.description || '' : ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Setor <span class="required">*</span></label>
                        <select name="departmentId" id="formDepartmentSelect" class="select2-search" ${sala ? 'disabled' : ''}>
                            <option value="">Selecione um setor</option>
                            ${setores.map(s => `
                                <option value="${s.id}" ${sala && sala.department?.id === s.id ? 'selected' : ''}>
                                    ${s.name}
                                </option>
                            `).join('')}
                        </select>
                        ${sala ? '<small style="color: #666; font-size: 12px; margin-top: 5px; display: block;">O setor não pode ser alterado</small>' : ''}
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline" onclick="document.getElementById('formModal').classList.remove('show')">Cancelar</button>
                        <button type="submit" class="btn btn-primary">${sala ? 'Atualizar Sala' : 'Salvar Sala'}</button>
                    </div>
                </form>
            </div>
        `;

        modal.classList.add('show');

        // Inicializa o Select2 no formulário
        if (!sala) {
            $('#formDepartmentSelect').select2({
                placeholder: 'Selecione um setor',
                dropdownParent: $('#formModal'),
                language: {
                    noResults: function() {
                        return "Nenhum setor encontrado";
                    },
                    searching: function() {
                        return "Buscando...";
                    }
                }
            });
        }

        // 🔹 Captura o envio do formulário
        document.getElementById('salaForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(e.target);
            const payload = Object.fromEntries(formData.entries());

            try {
                if (salaId) {
                    // Atualizar sala existente (PUT) - sem departmentId
                    const updatePayload = {
                        name: payload.name,
                        description: payload.description
                    };
                    await callApi(`/room/${salaId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatePayload)
                    });
                    exibirSucesso('Sala atualizada com sucesso!');
                } else {
                    // Criar nova sala (POST) - com departmentId
                    await callApi(`/room`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    exibirSucesso('Sala criada com sucesso!');
                }

                modal.classList.remove('show');
                await this.loadSalas(0);
            } catch (error) {
                console.error('Erro ao salvar sala:', error);
            }
        });
    }

    editSala(id) {
        this.openSalaForm(id);
    }

    async deleteSala(id) {
        exibirConfirmacao({
            title: 'Deletar Sala',
            message: 'Tem certeza que deseja deletar esta sala? Esta ação não pode ser desfeita.',
            type: 'danger',
            confirmText: 'Sim, deletar',
            cancelText: 'Cancelar',
            onConfirm: async () => {
                try {
                    await callApi(`/room/${id}`, { method: 'DELETE' });
                    exibirSucesso('Sala deletada com sucesso!');
                    await this.loadSalas(0);
                } catch (error) {
                    console.error('Erro ao deletar sala:', error);
                }
            }
        });
    }

    loadDispositivos() {
        if (!this.dispositivosPagination) {
            this.dispositivosPagination = new Pagination('dispositivos', 10);
            this.dispositivosPagination.setRenderCallback(() => this.renderDispositivosTable());
        }
        this.dispositivosPagination.setItems(this.data.dispositivos);
        window.currentPagination = this.dispositivosPagination;
        this.renderDispositivosTable();
    }
    
    renderDispositivosTable() {
        const content = document.getElementById('page-content');
        const currentItems = this.dispositivosPagination.getCurrentPageItems();
        
        content.innerHTML = `
            <div class="dispositivos-page">
                <div class="card-header">
                    <h2>Gerenciar Dispositivos</h2>
                    <button class="btn btn-primary" onclick="app.openDispositivoForm()">+ Novo Dispositivo</button>
                </div>

                <div class="table-container">
                    <div class="table-header">
                        <h3>Lista de Dispositivos</h3>
                        <div class="table-search">
                            <input type="text" placeholder="Buscar dispositivo..." id="searchDispositivos">
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Potência (kW)</th>
                                <th>Tipo</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${currentItems.length > 0 ? currentItems.map(d => `
                                <tr>
                                    <td>${d.nome}</td>
                                    <td>${d.potencia}</td>
                                    <td><span class="badge badge-info">${d.tipo}</span></td>
                                        <td>
                                            <div class="cell-actions">
                                                <button class="action-btn action-btn-edit" 
                                                        onclick="app.editSetor('${s.id}')">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                                <button class="action-btn action-btn-delete" 
                                                        onclick="app.deleteSetor('${s.id}')">
                                                    <i class="fas fa-trash-alt"></i>
                                                </button>
                                            </div>
                                        </td>
                                </tr>
                            `).join('') : `
                                <tr>
                                    <td colspan="5" style="text-align: center; padding: 40px; color: #999;">
                                        Nenhum dispositivo encontrado
                                    </td>
                                </tr>
                            `}
                        </tbody>
                    </table>
                    ${this.dispositivosPagination.renderPaginationControls()}
                </div>
            </div>
        `;

        document.getElementById('searchDispositivos')?.addEventListener('keyup', (e) => {
            const search = e.target.value;
            this.dispositivosPagination.filterItems(search);
            this.renderDispositivosTable();
        });
    }

    openDispositivoForm(dispositivoId = null) {
        const modal = document.getElementById('formModal');
        const form = document.getElementById('modal-form');
        const dispositivo = dispositivoId ? this.data.dispositivos.find(d => d.id === dispositivoId) : null;
        
        form.innerHTML = `
            <div class="form-card">
                <div class="form-card-header">
                    <h2>${dispositivo ? 'Editar Dispositivo' : 'Novo Dispositivo'}</h2>
                    <p>${dispositivo ? 'Atualize os dados do dispositivo' : 'Preencha os dados do novo dispositivo'}</p>
                </div>
                <form id="dispositivoForm">
                    <div class="form-group">
                        <label>Nome <span class="required">*</span></label>
                        <input type="text" name="nome" value="${dispositivo ? dispositivo.nome : ''}" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Potência (kW) <span class="required">*</span></label>
                            <input type="number" name="potencia" step="0.1" value="${dispositivo ? dispositivo.potencia : ''}" required>
                        </div>
                        <div class="form-group">
                            <label>Tipo <span class="required">*</span></label>
                            <select name="fk_tipo_dispositivo" required>
                                <option value="">Selecione um tipo</option>
                                ${this.data.tiposDispositivos.map(t => `<option value="${t.id}" ${dispositivo && dispositivo.tipo === t.nome ? 'selected' : ''}>${t.nome}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline" onclick="document.getElementById('formModal').classList.remove('show')">Cancelar</button>
                        <button type="submit" class="btn btn-primary">${dispositivo ? 'Atualizar Dispositivo' : 'Salvar Dispositivo'}</button>
                    </div>
                </form>
            </div>
        `;
        modal.classList.add('show');

        document.getElementById('dispositivoForm').addEventListener('submit', (e) => {
            e.preventDefault();
            alert(`Dispositivo ${dispositivo ? 'atualizado' : 'salvo'} com sucesso!`);
            modal.classList.remove('show');
        });
    }

    editDispositivo(id) {
        this.openDispositivoForm(id);
    }

    deleteDispositivo(id) {
        if (confirm('Tem certeza que deseja deletar este dispositivo?')) {
            alert(`Dispositivo ${id} deletado com sucesso!`);
        }
    }

    loadConsumo() {
        const content = document.getElementById('page-content');
        content.innerHTML = `
            <div class="consumo-page">
                <h2>Monitoramento de Consumo</h2>

                <div class="filter-section">
                    <h3 class="filter-title">Filtros</h3>
                    <div class="filter-row">
                        <div class="filter-group">
                            <label>Data Inicial</label>
                            <input type="date">
                        </div>
                        <div class="filter-group">
                            <label>Data Final</label>
                            <input type="date">
                        </div>
                        <div class="filter-group">
                            <label>Dispositivo</label>
                            <select>
                                <option>Todos</option>
                                ${this.data.dispositivos.map(d => `<option>${d.nome}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="filter-actions">
                        <button class="btn btn-outline">Limpar Filtros</button>
                        <button class="btn btn-primary">Aplicar Filtros</button>
                    </div>
                </div>

                <div class="charts-grid-full">
                    <div class="chart-container">
                        <div class="chart-header">
                            <h3 class="chart-title">Consumo por Dispositivo</h3>
                        </div>
                        <div class="chart-body">
                            <canvas id="consumoDispositivoChart"></canvas>
                        </div>
                    </div>
                </div>

                <div class="charts-grid-2">
                    <div class="chart-container">
                        <div class="chart-header">
                            <h3 class="chart-title">Corrente Elétrica</h3>
                        </div>
                        <div class="chart-body">
                            <canvas id="correnteChart"></canvas>
                        </div>
                    </div>

                    <div class="chart-container">
                        <div class="chart-header">
                            <h3 class="chart-title">Tensão Elétrica</h3>
                        </div>
                        <div class="chart-body">
                            <canvas id="tensaoChart"></canvas>
                        </div>
                    </div>
                </div>

                <div class="chart-container">
                    <div class="chart-header">
                        <h3 class="chart-title">Leituras Detalhadas</h3>
                    </div>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Data/Hora</th>
                                <th>Dispositivo</th>
                                <th>Corrente (A)</th>
                                <th>Tensão (V)</th>
                                <th>Potência Ativa (kW)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.data.consumo.map(c => `
                                <tr>
                                    <td>${c.data} ${c.hora}</td>
                                    <td>${c.dispositivo}</td>
                                    <td>${c.corrente}</td>
                                    <td>${c.tensao}</td>
                                    <td>${c.potenciaAtiva}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        this.renderConsumoDispositivoChart();
        this.renderCorrenteChart();
        this.renderTensaoChart();
    }

    renderConsumoDispositivoChart() {
        const ctx = document.getElementById('consumoDispositivoChart');
        if (ctx) {
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Máquina CNC 01', 'Compressor 01', 'Ar Condicionado 01'],
                    datasets: [{
                        label: 'Consumo (kWh)',
                        data: [450, 320, 230],
                        backgroundColor: '#ffb703',
                        borderColor: '#fb8500',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }

    renderCorrenteChart() {
        const ctx = document.getElementById('correnteChart');
        if (ctx) {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'],
                    datasets: [{
                        label: 'Corrente (A)',
                        data: [15.5, 16.2, 17.1, 16.8, 15.9, 16.5],
                        borderColor: '#fb8500',
                        backgroundColor: 'rgba(251, 133, 0, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    }

    renderTensaoChart() {
        const ctx = document.getElementById('tensaoChart');
        if (ctx) {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'],
                    datasets: [{
                        label: 'Tensão (V)',
                        data: [220, 220, 219.5, 220.2, 220, 219.8],
                        borderColor: '#f77f00',
                        backgroundColor: 'rgba(247, 127, 0, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    }

    loadRelatorios() {
        const content = document.getElementById('page-content');
        content.innerHTML = `
            <div class="relatorios-page">
                <div class="card-header">
                    <h2>Relatórios de Consumo Energético</h2>
                </div>

                <!-- Seletor de Tipo de Relatório -->
                <div class="filter-section" style="margin-bottom: 20px;">
                    <div class="filter-row">
                        <div class="filter-group">
                            <label>Tipo de Relatório</label>
                            <select id="tipoRelatorio" onchange="app.updateRelatorio()">
                                <option value="evolucao-setor">Evolução de Consumo - Setor</option>
                                <option value="evolucao-sala">Evolução de Consumo - Sala</option>
                                <option value="evolucao-vinculo">Evolução de Consumo - Vínculo</option>
                                <option value="rateio-setor">Rateio de Consumo - Setores</option>
                                <option value="rateio-sala">Rateio de Consumo - Salas</option>
                                <option value="rateio-vinculo">Rateio de Consumo - Vínculos</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Seletor de Período -->
                <div class="filter-section" style="margin-bottom: 20px;">
                    <h3 class="filter-title">Período de Análise</h3>
                    <div class="filter-row">
                        <div class="filter-group">
                            <label>Período Pré-definido</label>
                            <div class="btn-group" style="display: flex; gap: 10px; flex-wrap: wrap;">
                                <button class="btn btn-outline btn-sm" onclick="app.setPeriodo('hoje')">Hoje</button>
                                <button class="btn btn-outline btn-sm" onclick="app.setPeriodo('semana')">Esta Semana</button>
                                <button class="btn btn-outline btn-sm active" onclick="app.setPeriodo('mes')">Mês Atual</button>
                                <button class="btn btn-outline btn-sm" onclick="app.setPeriodo('mes-anterior')">Mês Anterior</button>
                                <button class="btn btn-outline btn-sm" onclick="app.setPeriodo('3meses')">Últimos 3 Meses</button>
                                <button class="btn btn-outline btn-sm" onclick="app.setPeriodo('6meses')">Últimos 6 Meses</button>
                                <button class="btn btn-outline btn-sm" onclick="app.setPeriodo('ano')">Este Ano</button>
                            </div>
                        </div>
                    </div>
                    <div class="filter-row" style="margin-top: 15px;">
                        <div class="filter-group">
                            <label>Período Personalizado</label>
                            <div style="display: flex; gap: 10px; align-items: center;">
                                <input type="date" id="dataInicio" class="form-control" style="flex: 1;">
                                <span>até</span>
                                <input type="date" id="dataFim" class="form-control" style="flex: 1;">
                                <button class="btn btn-primary" onclick="app.aplicarPeriodoPersonalizado()">Aplicar</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Container do Gráfico -->
                <div class="chart-container" style="margin-top: 20px;">
                    <div class="chart-header">
                        <h3 class="chart-title" id="chartTitle">Evolução de Consumo - Setor (Mês Atual)</h3>
                    </div>
                    <div class="chart-body" style="height: 400px;">
                        <canvas id="relatorioChart"></canvas>
                    </div>
                </div>

                <!-- Tabela de Dados -->
                <div class="table-container" style="margin-top: 20px;">
                    <div class="table-header">
                        <h3>Dados Detalhados</h3>
                    </div>
                    <div id="tabelaDados"></div>
                </div>
            </div>
        `;

        // Inicializar com período padrão (mês atual)
        this.periodoAtual = 'mes';
        this.tipoRelatorioAtual = 'evolucao-setor';
        this.renderRelatorioChart();
    }

    setPeriodo(periodo) {
        this.periodoAtual = periodo;
        
        // Atualizar botões ativos
        document.querySelectorAll('.btn-group .btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        // Limpar datas personalizadas
        document.getElementById('dataInicio').value = '';
        document.getElementById('dataFim').value = '';
        
        this.renderRelatorioChart();
    }

    aplicarPeriodoPersonalizado() {
        const dataInicio = document.getElementById('dataInicio').value;
        const dataFim = document.getElementById('dataFim').value;
        
        if (!dataInicio || !dataFim) {
            alert('Por favor, selecione ambas as datas');
            return;
        }
        
        if (new Date(dataInicio) > new Date(dataFim)) {
            alert('A data inicial deve ser anterior à data final');
            return;
        }
        
        this.periodoAtual = 'personalizado';
        this.dataInicioCustom = dataInicio;
        this.dataFimCustom = dataFim;
        
        // Remover active de todos os botões
        document.querySelectorAll('.btn-group .btn').forEach(btn => btn.classList.remove('active'));
        
        this.renderRelatorioChart();
    }

    updateRelatorio() {
        this.tipoRelatorioAtual = document.getElementById('tipoRelatorio').value;
        this.renderRelatorioChart();
    }

    renderRelatorioChart() {
        const canvas = document.getElementById('relatorioChart');
        if (!canvas) return;

        // Destruir gráfico anterior se existir
        if (this.currentChart) {
            this.currentChart.destroy();
        }

        const tipo = this.tipoRelatorioAtual;
        const periodo = this.periodoAtual;

        // Gerar dados baseado no tipo e período
        const dadosGrafico = this.gerarDadosRelatorio(tipo, periodo);
        
        // Atualizar título
        document.getElementById('chartTitle').textContent = dadosGrafico.titulo;

        // Configurar gráfico
        const config = {
            type: dadosGrafico.tipo,
            data: dadosGrafico.data,
            options: dadosGrafico.options
        };

        this.currentChart = new Chart(canvas, config);
        
        // Atualizar tabela de dados
        this.renderTabelaDados(dadosGrafico.tabelaDados);
    }

    gerarDadosRelatorio(tipo, periodo) {
        const periodoTexto = this.getPeriodoTexto(periodo);
        
        if (tipo.startsWith('evolucao')) {
            return this.gerarDadosEvolucao(tipo, periodo, periodoTexto);
        } else {
            return this.gerarDadosRateio(tipo, periodo, periodoTexto);
        }
    }

    getPeriodoTexto(periodo) {
        const textos = {
            'hoje': 'Hoje',
            'semana': 'Esta Semana',
            'mes': 'Mês Atual',
            'mes-anterior': 'Mês Anterior',
            '3meses': 'Últimos 3 Meses',
            '6meses': 'Últimos 6 Meses',
            'ano': 'Este Ano',
            'personalizado': 'Período Personalizado'
        };
        return textos[periodo] || 'Período';
    }

    gerarDadosEvolucao(tipo, periodo, periodoTexto) {
        let labels, datasets, titulo, entidade, tabelaDados;

        // Definir labels baseado no período
        if (periodo === 'hoje') {
            labels = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '23:59'];
        } else if (periodo === 'semana') {
            labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
        } else if (periodo === 'mes' || periodo === 'mes-anterior') {
            // Dividir mês em semanas
            labels = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'];
        } else if (periodo === '3meses') {
            const meses = ['Mês -2', 'Mês -1', 'Mês Atual'];
            labels = meses;
        } else if (periodo === '6meses') {
            const hoje = new Date();
            labels = [];
            for (let i = 5; i >= 0; i--) {
                const mes = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
                labels.push(mes.toLocaleDateString('pt-BR', { month: 'short' }));
            }
        } else if (periodo === 'ano') {
            labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        } else {
            // Personalizado - usar semanas
            labels = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'];
        }

        // Gerar datasets baseado no tipo
        if (tipo === 'evolucao-setor') {
            entidade = 'Setor';
            titulo = `Evolução de Consumo por Setor (${periodoTexto})`;
            datasets = [
                {
                    label: 'Produção',
                    data: this.gerarDadosAleatorios(labels.length, 300, 600),
                    borderColor: '#fb8500',
                    backgroundColor: 'rgba(251, 133, 0, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Administrativo',
                    data: this.gerarDadosAleatorios(labels.length, 150, 300),
                    borderColor: '#023047',
                    backgroundColor: 'rgba(2, 48, 71, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ];
            tabelaDados = this.gerarTabelaEvolucao(labels, datasets, 'Setor');
        } else if (tipo === 'evolucao-sala') {
            entidade = 'Sala';
            titulo = `Evolução de Consumo por Sala (${periodoTexto})`;
            datasets = [
                {
                    label: 'Sala 101',
                    data: this.gerarDadosAleatorios(labels.length, 100, 250),
                    borderColor: '#fb8500',
                    backgroundColor: 'rgba(251, 133, 0, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Sala 102',
                    data: this.gerarDadosAleatorios(labels.length, 80, 200),
                    borderColor: '#023047',
                    backgroundColor: 'rgba(2, 48, 71, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Sala 201',
                    data: this.gerarDadosAleatorios(labels.length, 120, 280),
                    borderColor: '#219ebc',
                    backgroundColor: 'rgba(33, 158, 188, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ];
            tabelaDados = this.gerarTabelaEvolucao(labels, datasets, 'Sala');
        } else {
            entidade = 'Vínculo';
            titulo = `Evolução de Consumo por Vínculo (${periodoTexto})`;
            datasets = [
                {
                    label: 'CNC Sala 101',
                    data: this.gerarDadosAleatorios(labels.length, 150, 300),
                    borderColor: '#fb8500',
                    backgroundColor: 'rgba(251, 133, 0, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Compressor Sala 102',
                    data: this.gerarDadosAleatorios(labels.length, 100, 220),
                    borderColor: '#023047',
                    backgroundColor: 'rgba(2, 48, 71, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'AC Sala 201',
                    data: this.gerarDadosAleatorios(labels.length, 180, 350),
                    borderColor: '#219ebc',
                    backgroundColor: 'rgba(33, 158, 188, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ];
            tabelaDados = this.gerarTabelaEvolucao(labels, datasets, 'Vínculo');
        }

        return {
            tipo: 'line',
            titulo: titulo,
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + ' kWh';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Consumo (kWh)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: this.getEixoXLabel(periodo)
                        }
                    }
                }
            },
            tabelaDados: tabelaDados
        };
    }

    gerarDadosRateio(tipo, periodo, periodoTexto) {
        let labels, data, titulo, backgroundColor, tabelaDados;

        if (tipo === 'rateio-setor') {
            titulo = `Rateio de Consumo por Setor (${periodoTexto})`;
            labels = ['Produção', 'Administrativo'];
            data = [65, 35];
            backgroundColor = ['#fb8500', '#023047'];
            tabelaDados = [
                { nome: 'Produção', consumo: 1245.5, percentual: 65 },
                { nome: 'Administrativo', consumo: 670.3, percentual: 35 }
            ];
        } else if (tipo === 'rateio-sala') {
            titulo = `Rateio de Consumo por Sala (${periodoTexto})`;
            labels = ['Sala 101', 'Sala 102', 'Sala 201'];
            data = [40, 30, 30];
            backgroundColor = ['#fb8500', '#023047', '#219ebc'];
            tabelaDados = [
                { nome: 'Sala 101', consumo: 766.3, percentual: 40 },
                { nome: 'Sala 102', consumo: 574.7, percentual: 30 },
                { nome: 'Sala 201', consumo: 574.7, percentual: 30 }
            ];
        } else {
            titulo = `Rateio de Consumo por Vínculo (${periodoTexto})`;
            labels = ['CNC Sala 101', 'Compressor Sala 102', 'AC Sala 201'];
            data = [45, 25, 30];
            backgroundColor = ['#fb8500', '#023047', '#219ebc'];
            tabelaDados = [
                { nome: 'CNC Sala 101', consumo: 862.1, percentual: 45 },
                { nome: 'Compressor Sala 102', consumo: 479.0, percentual: 25 },
                { nome: 'AC Sala 201', consumo: 574.7, percentual: 30 }
            ];
        }

        return {
            tipo: 'pie',
            titulo: titulo,
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColor,
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                return label + ': ' + value.toFixed(1) + '%';
                            }
                        }
                    }
                }
            },
            tabelaDados: tabelaDados
        };
    }

    getEixoXLabel(periodo) {
        const labels = {
            'hoje': 'Horário',
            'semana': 'Dia da Semana',
            'mes': 'Semana do Mês',
            'mes-anterior': 'Semana do Mês',
            '3meses': 'Mês',
            '6meses': 'Mês',
            'ano': 'Mês',
            'personalizado': 'Período'
        };
        return labels[periodo] || 'Período';
    }

    gerarDadosAleatorios(quantidade, min, max) {
        const dados = [];
        for (let i = 0; i < quantidade; i++) {
            dados.push(Math.random() * (max - min) + min);
        }
        return dados;
    }

    gerarTabelaEvolucao(labels, datasets, entidade) {
        const tabela = [];
        
        datasets.forEach(dataset => {
            const total = dataset.data.reduce((a, b) => a + b, 0);
            const media = total / dataset.data.length;
            const max = Math.max(...dataset.data);
            const min = Math.min(...dataset.data);
            
            tabela.push({
                nome: dataset.label,
                total: total.toFixed(2),
                media: media.toFixed(2),
                max: max.toFixed(2),
                min: min.toFixed(2)
            });
        });
        
        return tabela;
    }

    renderTabelaDados(dados) {
        const container = document.getElementById('tabelaDados');
        if (!container) return;

        if (Array.isArray(dados) && dados.length > 0) {
            // Verificar se é tabela de rateio ou evolução
            if (dados[0].percentual !== undefined) {
                // Tabela de rateio
                container.innerHTML = `
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Consumo (kWh)</th>
                                <th>Percentual (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${dados.map(item => `
                                <tr>
                                    <td><strong>${item.nome}</strong></td>
                                    <td>${item.consumo.toFixed(2)} kWh</td>
                                    <td>${item.percentual.toFixed(1)}%</td>
                                </tr>
                            `).join('')}
                            <tr style="background: #f8f9fa; font-weight: bold;">
                                <td>Total</td>
                                <td>${dados.reduce((a, b) => a + b.consumo, 0).toFixed(2)} kWh</td>
                                <td>100%</td>
                            </tr>
                        </tbody>
                    </table>
                `;
            } else {
                // Tabela de evolução
                container.innerHTML = `
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Total (kWh)</th>
                                <th>Média (kWh)</th>
                                <th>Máximo (kWh)</th>
                                <th>Mínimo (kWh)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${dados.map(item => `
                                <tr>
                                    <td><strong>${item.nome}</strong></td>
                                    <td>${item.total} kWh</td>
                                    <td>${item.media} kWh</td>
                                    <td>${item.max} kWh</td>
                                    <td>${item.min} kWh</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            }
        }
    }

    loadTiposDispositivos() {
        const content = document.getElementById('page-content');
        content.innerHTML = `
            <div class="tipos-dispositivos-page">
                <div class="card-header">
                    <h2>Gerenciar Tipos de Dispositivos</h2>
                    <button class="btn btn-primary" onclick="app.openTipoDispositivoForm()">+ Novo Tipo</button>
                </div>

                <div class="table-container">
                    <div class="table-header">
                        <h3>Lista de Tipos de Dispositivos</h3>
                        <div class="table-search">
                            <input type="text" placeholder="Buscar tipo..." id="searchTipos">
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Acoes</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.data.tiposDispositivos.length > 0 ? this.data.tiposDispositivos.map(t => `
                                <tr>
                                    <td>${t.nome}</td>
                                        <td>
                                            <div class="cell-actions">
                                                <button class="action-btn action-btn-edit" 
                                                        onclick="app.editSetor('${s.id}')">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                                <button class="action-btn action-btn-delete" 
                                                        onclick="app.deleteSetor('${s.id}')">
                                                    <i class="fas fa-trash-alt"></i>
                                                </button>
                                            </div>
                                        </td>
                                </tr>
                            `).join('') : '<tr><td colspan="2" style="text-align: center; padding: 40px;">Nenhum tipo cadastrado</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        document.getElementById('searchTipos')?.addEventListener('keyup', (e) => {
            const search = e.target.value.toLowerCase();
            document.querySelectorAll('tbody tr').forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(search) ? '' : 'none';
            });
        });
    }

    openTipoDispositivoForm(tipoId = null) {
        const modal = document.getElementById('formModal');
        const form = document.getElementById('modal-form');
        const tipo = tipoId ? this.data.tiposDispositivos.find(t => t.id === tipoId) : null;
        
        form.innerHTML = `
            <div class="form-card">
                <div class="form-card-header">
                    <h2>${tipo ? 'Editar Tipo de Dispositivo' : 'Novo Tipo de Dispositivo'}</h2>
                    <p>${tipo ? 'Atualize os dados do tipo' : 'Preencha os dados do novo tipo'}</p>
                </div>
                <form id="tipoForm">
                    <div class="form-group">
                        <label>Nome <span class="required">*</span></label>
                        <input type="text" name="nome" value="${tipo ? tipo.nome : ''}" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline" onclick="document.getElementById('formModal').classList.remove('show')">Cancelar</button>
                        <button type="submit" class="btn btn-primary">${tipo ? 'Atualizar Tipo' : 'Salvar Tipo'}</button>
                    </div>
                </form>
            </div>
        `;
        modal.classList.add('show');

        document.getElementById('tipoForm').addEventListener('submit', (e) => {
            e.preventDefault();
            alert(`Tipo de dispositivo ${tipo ? 'atualizado' : 'salvo'} com sucesso!`);
            modal.classList.remove('show');
        });
    }

    editTipoDispositivo(id) {
        this.openTipoDispositivoForm(id);
    }

    deleteTipoDispositivo(id) {
        if (confirm('Tem certeza que deseja deletar este tipo?')) {
            alert(`Tipo ${id} deletado com sucesso!`);
        }
    }

    loadVinculos() {
        const content = document.getElementById('page-content');
        content.innerHTML = `
            <div class="vinculos-page">
                <div class="card-header">
                    <h2>Vinculos de Dispositivos</h2>
                    <button class="btn btn-primary" onclick="app.openVinculoForm()"><i class="fas fa-plus"></i> Novo Vinculo</button>
                </div>

                <div class="table-container">
                    <div class="table-header">
                        <h3>Lista de Vinculos (Dispositivos em Salas)</h3>
                        <div class="table-search">
                            <input type="text" placeholder="Buscar vinculo..." id="searchVinculos">
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Apelido</th>
                                <th>Sala</th>
                                <th>Dispositivo</th>
                                <th>Tempo Medio (h)</th>
                                <th>Acoes</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.data.vinculos.length > 0 ? this.data.vinculos.map(v => `
                                <tr>
                                    <td><strong>${v.apelido}</strong></td>
                                    <td>${v.sala}</td>
                                    <td>${v.dispositivo}</td>
                                    <td>${v.tempoMedio}</td>
                                        <td>
                                            <div class="cell-actions">
                                                <button class="action-btn action-btn-edit" 
                                                        onclick="app.editSetor('${s.id}')">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                                <button class="action-btn action-btn-delete" 
                                                        onclick="app.deleteSetor('${s.id}')">
                                                    <i class="fas fa-trash-alt"></i>
                                                </button>
                                            </div>
                                        </td>
                                </tr>
                            `).join('') : '<tr><td colspan="5" style="text-align: center; padding: 40px;">Nenhum vinculo cadastrado</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        document.getElementById('searchVinculos')?.addEventListener('keyup', (e) => {
            const search = e.target.value.toLowerCase();
            document.querySelectorAll('tbody tr').forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(search) ? '' : 'none';
            });
        });
    }

    openVinculoForm(vinculoId = null) {
        const modal = document.getElementById('formModal');
        const form = document.getElementById('modal-form');
        const vinculo = vinculoId ? this.data.vinculos.find(v => v.id === vinculoId) : null;

        form.innerHTML = `
            <div class="form-card">
                <div class="form-card-header">
                    <h2>${vinculo ? 'Editar Vínculo' : 'Novo Vínculo de Dispositivo'}</h2>
                    <p>${vinculo ? 'Atualize os dados do vínculo' : 'Vincule um dispositivo a uma sala'}</p>
                </div>
                <form id="vinculoForm">
                    <div class="form-group">
                        <label>Apelido <span class="required">*</span></label>
                        <input type="text" name="apelido" value="${vinculo ? vinculo.apelido : ''}" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Sala <span class="required">*</span></label>
                            <select name="fk_sala" required>
                                <option value="">Selecione uma sala</option>
                                ${this.data.salas.map(s => `<option value="${s.id}" ${vinculo && vinculo.sala === s.nome ? 'selected' : ''}>${s.nome}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Dispositivo <span class="required">*</span></label>
                            <select name="fk_dispositivo" required>
                                <option value="">Selecione um dispositivo</option>
                                ${this.data.dispositivos.map(d => `<option value="${d.id}" ${vinculo && vinculo.dispositivo === d.nome ? 'selected' : ''}>${d.nome}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Tempo Médio de Funcionamento (horas)</label>
                        <input type="number" name="tempo_medio_hora" step="0.1" value="${vinculo ? vinculo.tempoMedio : ''}">
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline" onclick="document.getElementById('formModal').classList.remove('show')">Cancelar</button>
                        <button type="submit" class="btn btn-primary">${vinculo ? 'Atualizar Vínculo' : 'Criar Vínculo'}</button>
                    </div>
                </form>
            </div>
        `;
        modal.classList.add('show');

        document.getElementById('vinculoForm').addEventListener('submit', (e) => {
            e.preventDefault();
            alert(`Vinculo ${vinculo ? 'atualizado' : 'criado'} com sucesso!`);
            modal.classList.remove('show');
        });
    }

    editVinculo(id) {
        this.openVinculoForm(id);
    }

    deleteVinculo(id) {
        if (confirm('Tem certeza que deseja deletar este vinculo?')) {
            alert(`Vinculo ${id} deletado com sucesso!`);
        }
    }
}

// Inicializar aplicacao
const app = new App();
// ===== RELATÓRIOS COM FILTROS HIERÁRQUICOS =====

// Adicionar ao App class
App.prototype.loadRelatorios = function() {
    const content = document.getElementById('page-content');
    content.innerHTML = `
        <div class="relatorios-page">
            <h2>Relatórios de Consumo</h2>

            <!-- Seletor de Tipo de Relatório -->
            <div class="filter-section">
                <h3 class="filter-title">Tipo de Relatório</h3>
                <div class="filter-row">
                    <div class="filter-group" style="flex: 1;">
                        <label>Selecione o tipo de análise</label>
                        <select id="tipoRelatorio" onchange="app.updateRelatorio()">
                            <optgroup label="Evolução de Consumo">
                                <option value="evolucao-setor">Evolução - Por Setor</option>
                                <option value="evolucao-sala">Evolução - Por Sala</option>
                                <option value="evolucao-dispositivo">Evolução - Por Dispositivo (Vínculo)</option>
                            </optgroup>
                            <optgroup label="Rateio de Consumo">
                                <option value="rateio-setor">Rateio - Por Setor</option>
                                <option value="rateio-sala">Rateio - Por Sala</option>
                                <option value="rateio-dispositivo">Rateio - Por Dispositivo (Vínculo)</option>
                            </optgroup>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Filtros Hierárquicos (Setor > Sala) -->
            <div class="filter-section" id="filtrosHierarquicos">
                <h3 class="filter-title">Filtros Hierárquicos (Opcional)</h3>
                <div class="filter-row">
                    <div class="filter-group">
                        <label>Setor</label>
                        <select id="filtroSetor" onchange="app.updateFiltroSala()">
                            <option value="">Todos os Setores</option>
                            ${this.data.setores.map(s => `<option value="${s.id}">${s.nome}</option>`).join('')}
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Sala</label>
                        <select id="filtroSala" disabled>
                            <option value="">Todas as Salas</option>
                        </select>
                    </div>
                    <div class="filter-group" style="display: flex; align-items: flex-end;">
                        <button class="btn btn-outline" onclick="app.limparFiltrosHierarquicos()">
                            <i class="fas fa-times"></i> Limpar Filtros
                        </button>
                    </div>
                </div>
            </div>

            <!-- Seletor de Período -->
            <div class="filter-section">
                <h3 class="filter-title">Período de Análise</h3>
                <div class="filter-row">
                    <div class="filter-group" style="flex: 1;">
                        <label>Período Pré-definido</label>
                        <div class="btn-group" style="display: flex; gap: 10px; flex-wrap: wrap;">
                            <button class="btn btn-outline btn-sm" onclick="app.setPeriodo('dia')">Dia</button>
                            <button class="btn btn-outline btn-sm" onclick="app.setPeriodo('semana')">Semana</button>
                            <button class="btn btn-outline btn-sm active" onclick="app.setPeriodo('mes')">Mês</button>
                        </div>
                    </div>
                </div>
                <div class="filter-row" style="margin-top: 15px;">
                    <div class="filter-group" style="flex: 1;">
                        <label>Período Personalizado</label>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <input type="date" id="dataInicio" class="form-control" style="flex: 1;">
                            <span>até</span>
                            <input type="date" id="dataFim" class="form-control" style="flex: 1;">
                            <button class="btn btn-primary" onclick="app.aplicarPeriodoPersonalizado()">Aplicar</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Container dos Gráficos -->
            <div class="charts-grid-2" style="margin-top: 20px;">
                <!-- Gráfico de Evolução -->
                <div class="chart-container">
                    <div class="chart-header">
                        <h3 class="chart-title" id="chartTitleEvolucao">Evolução de Consumo</h3>
                    </div>
                    <div class="chart-body" style="height: 400px;">
                        <canvas id="relatorioChartEvolucao"></canvas>
                    </div>
                </div>

                <!-- Gráfico de Rateio -->
                <div class="chart-container">
                    <div class="chart-header">
                        <h3 class="chart-title" id="chartTitleRateio">Rateio de Consumo</h3>
                    </div>
                    <div class="chart-body" style="height: 400px;">
                        <canvas id="relatorioChartRateio"></canvas>
                    </div>
                </div>
            </div>

            <!-- Tabela de Dados -->
            <div class="table-container" style="margin-top: 20px;">
                <div class="table-header">
                    <h3>Dados Detalhados</h3>
                </div>
                <div id="tabelaDados"></div>
            </div>
        </div>
    `;

    // Inicializar estado
    this.periodoAtual = 'mes';
    this.tipoRelatorioAtual = 'evolucao-setor';
    this.filtroSetorAtual = '';
    this.filtroSalaAtual = '';
    
    this.renderRelatorioCharts();
};

App.prototype.updateFiltroSala = function() {
    const setorId = document.getElementById('filtroSetor').value;
    const salaSelect = document.getElementById('filtroSala');
    
    if (!setorId) {
        salaSelect.disabled = true;
        salaSelect.innerHTML = '<option value="">Todas as Salas</option>';
        this.filtroSetorAtual = '';
        this.filtroSalaAtual = '';
    } else {
        salaSelect.disabled = false;
        const salasDoSetor = this.data.salas.filter(s => {
            const setor = this.data.setores.find(st => st.id == setorId);
            return setor && s.setor === setor.nome;
        });
        
        salaSelect.innerHTML = '<option value="">Todas as Salas do Setor</option>' +
            salasDoSetor.map(s => `<option value="${s.id}">${s.nome}</option>`).join('');
        
        this.filtroSetorAtual = setorId;
        this.filtroSalaAtual = '';
    }
    
    this.renderRelatorioCharts();
};

App.prototype.limparFiltrosHierarquicos = function() {
    document.getElementById('filtroSetor').value = '';
    document.getElementById('filtroSala').value = '';
    document.getElementById('filtroSala').disabled = true;
    document.getElementById('filtroSala').innerHTML = '<option value="">Todas as Salas</option>';
    
    this.filtroSetorAtual = '';
    this.filtroSalaAtual = '';
    
    this.renderRelatorioCharts();
};

App.prototype.setPeriodo = function(periodo) {
    this.periodoAtual = periodo;
    
    // Atualizar botões ativos
    document.querySelectorAll('.btn-group .btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Limpar datas personalizadas
    document.getElementById('dataInicio').value = '';
    document.getElementById('dataFim').value = '';
    
    this.renderRelatorioCharts();
};

App.prototype.aplicarPeriodoPersonalizado = function() {
    const dataInicio = document.getElementById('dataInicio').value;
    const dataFim = document.getElementById('dataFim').value;
    
    if (!dataInicio || !dataFim) {
        alert('Por favor, selecione ambas as datas');
        return;
    }
    
    if (new Date(dataInicio) > new Date(dataFim)) {
        alert('A data inicial deve ser anterior à data final');
        return;
    }
    
    this.periodoAtual = 'personalizado';
    this.dataInicioCustom = dataInicio;
    this.dataFimCustom = dataFim;
    
    // Remover active de todos os botões
    document.querySelectorAll('.btn-group .btn').forEach(btn => btn.classList.remove('active'));
    
    this.renderRelatorioCharts();
};

App.prototype.updateRelatorio = function() {
    const tipoSelecionado = document.getElementById('tipoRelatorio').value;
    this.tipoRelatorioAtual = tipoSelecionado;
    
    // Atualizar seletor de sala quando mudar para dispositivo
    const salaSelect = document.getElementById('filtroSala');
    salaSelect.onchange = () => {
        this.filtroSalaAtual = salaSelect.value;
        this.renderRelatorioCharts();
    };
    
    this.renderRelatorioCharts();
};

App.prototype.renderRelatorioCharts = function() {
    const canvasEvolucao = document.getElementById('relatorioChartEvolucao');
    const canvasRateio = document.getElementById('relatorioChartRateio');
    
    if (!canvasEvolucao || !canvasRateio) return;

    // Destruir gráficos anteriores
    if (this.chartEvolucao) this.chartEvolucao.destroy();
    if (this.chartRateio) this.chartRateio.destroy();

    const tipo = this.tipoRelatorioAtual;
    const periodo = this.periodoAtual;

    // Gerar dados para evolução
    const dadosEvolucao = this.gerarDadosEvolucao(tipo, periodo);
    
    // Gerar dados para rateio
    const dadosRateio = this.gerarDadosRateio(tipo, periodo);
    
    // Atualizar títulos
    document.getElementById('chartTitleEvolucao').textContent = dadosEvolucao.titulo;
    document.getElementById('chartTitleRateio').textContent = dadosRateio.titulo;

    // Criar gráfico de evolução
    this.chartEvolucao = new Chart(canvasEvolucao, {
        type: 'line',
        data: dadosEvolucao.data,
        options: dadosEvolucao.options
    });

    // Criar gráfico de rateio
    this.chartRateio = new Chart(canvasRateio, {
        type: 'doughnut',
        data: dadosRateio.data,
        options: dadosRateio.options
    });
    
    // Atualizar tabela
    this.renderTabelaDados(dadosEvolucao.tabelaDados);
};

App.prototype.gerarDadosEvolucao = function(tipo, periodo) {
    const periodoTexto = this.getPeriodoTexto(periodo);
    let labels = this.getLabelsParaPeriodo(periodo);
    let datasets = [];
    let titulo = '';
    let tabelaDados = [];

    // Aplicar filtros hierárquicos
    let entidades = [];
    
    if (tipo.includes('setor')) {
        titulo = `Evolução de Consumo por Setor (${periodoTexto})`;
        if (this.filtroSetorAtual) {
            const setor = this.data.setores.find(s => s.id == this.filtroSetorAtual);
            entidades = setor ? [setor] : [];
            titulo += ` - ${setor.nome}`;
        } else {
            entidades = this.data.setores;
        }
    } else if (tipo.includes('sala')) {
        titulo = `Evolução de Consumo por Sala (${periodoTexto})`;
        if (this.filtroSalaAtual) {
            const sala = this.data.salas.find(s => s.id == this.filtroSalaAtual);
            entidades = sala ? [sala] : [];
            titulo += ` - ${sala.nome}`;
        } else if (this.filtroSetorAtual) {
            const setor = this.data.setores.find(s => s.id == this.filtroSetorAtual);
            entidades = this.data.salas.filter(s => s.setor === setor.nome);
            titulo += ` - Setor: ${setor.nome}`;
        } else {
            entidades = this.data.salas;
        }
    } else if (tipo.includes('dispositivo')) {
        titulo = `Evolução de Consumo por Dispositivo (${periodoTexto})`;
        if (this.filtroSalaAtual) {
            const sala = this.data.salas.find(s => s.id == this.filtroSalaAtual);
            entidades = this.data.vinculos.filter(v => v.sala === sala.nome);
            titulo += ` - Sala: ${sala.nome}`;
        } else if (this.filtroSetorAtual) {
            const setor = this.data.setores.find(s => s.id == this.filtroSetorAtual);
            const salasDoSetor = this.data.salas.filter(s => s.setor === setor.nome);
            entidades = this.data.vinculos.filter(v => 
                salasDoSetor.some(sala => sala.nome === v.sala)
            );
            titulo += ` - Setor: ${setor.nome}`;
        } else {
            entidades = this.data.vinculos;
        }
    }

    // Gerar datasets
    const cores = ['#fb8500', '#023047', '#219ebc', '#8ecae6', '#ffb703', '#06d6a0'];
    entidades.forEach((entidade, index) => {
        const nome = entidade.nome || entidade.apelido;
        const dados = this.gerarDadosAleatorios(labels.length, 100, 500);
        const media = dados.reduce((a, b) => a + b, 0) / dados.length;
        const min = Math.min(...dados);
        const max = Math.max(...dados);
        
        datasets.push({
            label: nome,
            data: dados,
            borderColor: cores[index % cores.length],
            backgroundColor: cores[index % cores.length] + '20',
            tension: 0.4,
            fill: true,
            borderWidth: 2
        });
        
        tabelaDados.push({
            nome: nome,
            total: dados.reduce((a, b) => a + b, 0).toFixed(2),
            media: media.toFixed(2),
            max: max.toFixed(2),
            min: min.toFixed(2)
        });
    });

    return {
        titulo,
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + ' kWh';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Consumo (kWh)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Período'
                    }
                }
            }
        },
        tabelaDados
    };
};

App.prototype.gerarDadosRateio = function(tipo, periodo) {
    const periodoTexto = this.getPeriodoTexto(periodo);
    let labels = [];
    let data = [];
    let titulo = '';

    // Aplicar filtros hierárquicos
    let entidades = [];
    
    if (tipo.includes('setor')) {
        titulo = `Rateio de Consumo por Setor (${periodoTexto})`;
        if (this.filtroSetorAtual) {
            const setor = this.data.setores.find(s => s.id == this.filtroSetorAtual);
            entidades = setor ? [setor] : [];
            titulo += ` - ${setor.nome}`;
        } else {
            entidades = this.data.setores;
        }
    } else if (tipo.includes('sala')) {
        titulo = `Rateio de Consumo por Sala (${periodoTexto})`;
        if (this.filtroSalaAtual) {
            const sala = this.data.salas.find(s => s.id == this.filtroSalaAtual);
            entidades = sala ? [sala] : [];
            titulo += ` - ${sala.nome}`;
        } else if (this.filtroSetorAtual) {
            const setor = this.data.setores.find(s => s.id == this.filtroSetorAtual);
            entidades = this.data.salas.filter(s => s.setor === setor.nome);
            titulo += ` - Setor: ${setor.nome}`;
        } else {
            entidades = this.data.salas;
        }
    } else if (tipo.includes('dispositivo')) {
        titulo = `Rateio de Consumo por Dispositivo (${periodoTexto})`;
        if (this.filtroSalaAtual) {
            const sala = this.data.salas.find(s => s.id == this.filtroSalaAtual);
            entidades = this.data.vinculos.filter(v => v.sala === sala.nome);
            titulo += ` - Sala: ${sala.nome}`;
        } else if (this.filtroSetorAtual) {
            const setor = this.data.setores.find(s => s.id == this.filtroSetorAtual);
            const salasDoSetor = this.data.salas.filter(s => s.setor === setor.nome);
            entidades = this.data.vinculos.filter(v => 
                salasDoSetor.some(sala => sala.nome === v.sala)
            );
            titulo += ` - Setor: ${setor.nome}`;
        } else {
            entidades = this.data.vinculos;
        }
    }

    // Gerar dados de rateio
    entidades.forEach(entidade => {
        labels.push(entidade.nome || entidade.apelido);
        data.push(Math.random() * 500 + 100);
    });

    const cores = ['#fb8500', '#023047', '#219ebc', '#8ecae6', '#ffb703', '#06d6a0', '#ef476f', '#06a77d'];

    return {
        titulo,
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: cores.slice(0, labels.length),
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentual = (context.parsed / total * 100).toFixed(1);
                            return context.label + ': ' + context.parsed.toFixed(2) + ' kWh (' + percentual + '%)';
                        }
                    }
                }
            }
        }
    };
};

App.prototype.getLabelsParaPeriodo = function(periodo) {
    if (periodo === 'dia') {
        const labels = [];
        for (let i = 0; i < 24; i++) {
            labels.push(`${String(i).padStart(2, '0')}:00`);
        }
        return labels;
    } else if (periodo === 'semana') {
        return ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    } else if (periodo === 'mes') {
        return ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'];
    } else {
        return ['Período 1', 'Período 2', 'Período 3', 'Período 4'];
    }
};

App.prototype.getPeriodoTexto = function(periodo) {
    const textos = {
        'dia': 'Dia',
        'semana': 'Semana',
        'mes': 'Mês',
        'personalizado': 'Período Personalizado'
    };
    return textos[periodo] || 'Período';
};

App.prototype.gerarDadosAleatorios = function(quantidade, min, max) {
    const dados = [];
    for (let i = 0; i < quantidade; i++) {
        dados.push(Math.random() * (max - min) + min);
    }
    return dados;
};

App.prototype.renderTabelaDados = function(dados) {
    const container = document.getElementById('tabelaDados');
    if (!container || !dados || dados.length === 0) return;

    container.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Total (kWh)</th>
                    <th>Média (kWh)</th>
                    <th>Máximo (kWh)</th>
                    <th>Mínimo (kWh)</th>
                </tr>
            </thead>
            <tbody>
                ${dados.map(item => `
                    <tr>
                        <td><strong>${item.nome}</strong></td>
                        <td>${item.total}</td>
                        <td>${item.media}</td>
                        <td>${item.max}</td>
                        <td>${item.min}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
};
// ===== ABA DE CONSUMO COM 3 GRÁFICOS =====

App.prototype.loadConsumo = function() {
    const content = document.getElementById('page-content');
    content.innerHTML = `
        <div class="consumo-page">
            <h2>Monitoramento de Consumo Detalhado</h2>

            <!-- Filtros -->
            <div class="filter-section">
                <h3 class="filter-title">Filtros</h3>
                <div class="filter-row">
                    <div class="filter-group">
                        <label>Dispositivo (Vínculo)</label>
                        <select id="filtroDispositivo" onchange="app.updateConsumoCharts()">
                            <option value="">Todos os Dispositivos</option>
                            ${this.data.vinculos.map(v => `<option value="${v.id}">${v.apelido} (${v.sala})</option>`).join('')}
                        </select>
                    </div>
                </div>
            </div>

            <!-- Seletor de Período -->
            <div class="filter-section">
                <h3 class="filter-title">Período de Análise</h3>
                <div class="filter-row">
                    <div class="filter-group" style="flex: 1;">
                        <label>Período Pré-definido</label>
                        <div class="btn-group" style="display: flex; gap: 10px; flex-wrap: wrap;">
                            <button class="btn btn-outline btn-sm active" onclick="app.setPeriodoConsumo('dia')">Dia</button>
                            <button class="btn btn-outline btn-sm" onclick="app.setPeriodoConsumo('semana')">Semana</button>
                            <button class="btn btn-outline btn-sm" onclick="app.setPeriodoConsumo('mes')">Mês</button>
                        </div>
                    </div>
                </div>
                <div class="filter-row" style="margin-top: 15px;">
                    <div class="filter-group" style="flex: 1;">
                        <label>Período Personalizado</label>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <input type="date" id="dataInicioConsumo" class="form-control" style="flex: 1;">
                            <span>até</span>
                            <input type="date" id="dataFimConsumo" class="form-control" style="flex: 1;">
                            <button class="btn btn-primary" onclick="app.aplicarPeriodoConsumoPersonalizado()">Aplicar</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Gráficos de Tensão, Corrente e Potência Ativa -->
            <div class="charts-grid-3" style="margin-top: 20px;">
                <!-- Gráfico de Tensão -->
                <div class="chart-container">
                    <div class="chart-header">
                        <h3 class="chart-title">Tensão (V)</h3>
                    </div>
                    <div class="chart-body" style="height: 300px;">
                        <canvas id="tensaoChart"></canvas>
                    </div>
                    <div class="chart-stats">
                        <div class="stat-item">
                            <span class="stat-label">Média:</span>
                            <span class="stat-value" id="tensaoMedia">-</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Mín:</span>
                            <span class="stat-value" id="tensaoMin">-</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Máx:</span>
                            <span class="stat-value" id="tensaoMax">-</span>
                        </div>
                    </div>
                </div>

                <!-- Gráfico de Corrente -->
                <div class="chart-container">
                    <div class="chart-header">
                        <h3 class="chart-title">Corrente (A)</h3>
                    </div>
                    <div class="chart-body" style="height: 300px;">
                        <canvas id="correnteChart"></canvas>
                    </div>
                    <div class="chart-stats">
                        <div class="stat-item">
                            <span class="stat-label">Média:</span>
                            <span class="stat-value" id="correnteMedia">-</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Mín:</span>
                            <span class="stat-value" id="correnteMin">-</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Máx:</span>
                            <span class="stat-value" id="correnteMax">-</span>
                        </div>
                    </div>
                </div>

                <!-- Gráfico de Potência Ativa -->
                <div class="chart-container">
                    <div class="chart-header">
                        <h3 class="chart-title">Potência Ativa (kW)</h3>
                    </div>
                    <div class="chart-body" style="height: 300px;">
                        <canvas id="potenciaChart"></canvas>
                    </div>
                    <div class="chart-stats">
                        <div class="stat-item">
                            <span class="stat-label">Média:</span>
                            <span class="stat-value" id="potenciaMedia">-</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Mín:</span>
                            <span class="stat-value" id="potenciaMin">-</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Máx:</span>
                            <span class="stat-value" id="potenciaMax">-</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tabela de Leituras Detalhadas -->
            <div class="table-container" style="margin-top: 20px;">
                <div class="table-header">
                    <h3>Leituras Detalhadas</h3>
                </div>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Data/Hora</th>
                            <th>Dispositivo</th>
                            <th>Tensão (V)</th>
                            <th>Corrente (A)</th>
                            <th>Potência Ativa (kW)</th>
                        </tr>
                    </thead>
                    <tbody id="tabelaConsumo">
                        ${this.data.consumo.map(c => `
                            <tr>
                                <td>${c.data} ${c.hora}</td>
                                <td>${c.dispositivo}</td>
                                <td>${c.tensao}</td>
                                <td>${c.corrente}</td>
                                <td>${c.potenciaAtiva}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    // Inicializar estado
    this.periodoConsumo = 'dia';
    this.dispositivoFiltrado = '';
    
    this.renderConsumoCharts();
};

App.prototype.setPeriodoConsumo = function(periodo) {
    this.periodoConsumo = periodo;
    
    // Atualizar botões ativos
    document.querySelectorAll('.btn-group .btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Limpar datas personalizadas
    document.getElementById('dataInicioConsumo').value = '';
    document.getElementById('dataFimConsumo').value = '';
    
    this.renderConsumoCharts();
};

App.prototype.aplicarPeriodoConsumoPersonalizado = function() {
    const dataInicio = document.getElementById('dataInicioConsumo').value;
    const dataFim = document.getElementById('dataFimConsumo').value;
    
    if (!dataInicio || !dataFim) {
        alert('Por favor, selecione ambas as datas');
        return;
    }
    
    if (new Date(dataInicio) > new Date(dataFim)) {
        alert('A data inicial deve ser anterior à data final');
        return;
    }
    
    this.periodoConsumo = 'personalizado';
    this.dataInicioConsumoCustom = dataInicio;
    this.dataFimConsumoCustom = dataFim;
    
    // Remover active de todos os botões
    document.querySelectorAll('.btn-group .btn').forEach(btn => btn.classList.remove('active'));
    
    this.renderConsumoCharts();
};

App.prototype.updateConsumoCharts = function() {
    this.dispositivoFiltrado = document.getElementById('filtroDispositivo').value;
    this.renderConsumoCharts();
};

App.prototype.renderConsumoCharts = function() {
    const canvasTensao = document.getElementById('tensaoChart');
    const canvasCorrente = document.getElementById('correnteChart');
    const canvasPotencia = document.getElementById('potenciaChart');
    
    if (!canvasTensao || !canvasCorrente || !canvasPotencia) return;

    // Destruir gráficos anteriores
    if (this.chartTensao) this.chartTensao.destroy();
    if (this.chartCorrente) this.chartCorrente.destroy();
    if (this.chartPotencia) this.chartPotencia.destroy();

    // Gerar labels baseado no período
    const labels = this.getLabelsParaPeriodo(this.periodoConsumo);
    
    // Gerar dados para cada gráfico
    const dadosTensao = this.gerarDadosAleatorios(labels.length, 210, 230);
    const dadosCorrente = this.gerarDadosAleatorios(labels.length, 10, 25);
    const dadosPotencia = this.gerarDadosAleatorios(labels.length, 2, 8);

    // Calcular estatísticas
    const calcularStats = (dados) => ({
        media: (dados.reduce((a, b) => a + b, 0) / dados.length).toFixed(2),
        min: Math.min(...dados).toFixed(2),
        max: Math.max(...dados).toFixed(2)
    });

    const statsTensao = calcularStats(dadosTensao);
    const statsCorrente = calcularStats(dadosCorrente);
    const statsPotencia = calcularStats(dadosPotencia);

    // Atualizar estatísticas na interface
    document.getElementById('tensaoMedia').textContent = statsTensao.media + ' V';
    document.getElementById('tensaoMin').textContent = statsTensao.min + ' V';
    document.getElementById('tensaoMax').textContent = statsTensao.max + ' V';
    
    document.getElementById('correnteMedia').textContent = statsCorrente.media + ' A';
    document.getElementById('correnteMin').textContent = statsCorrente.min + ' A';
    document.getElementById('correnteMax').textContent = statsCorrente.max + ' A';
    
    document.getElementById('potenciaMedia').textContent = statsPotencia.media + ' kW';
    document.getElementById('potenciaMin').textContent = statsPotencia.min + ' kW';
    document.getElementById('potenciaMax').textContent = statsPotencia.max + ' kW';

    // Configuração comum dos gráficos
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false
        },
        plugins: {
            legend: {
                display: true,
                position: 'top'
            }
        },
        scales: {
            y: {
                beginAtZero: false
            }
        }
    };

    // Criar gráfico de Tensão
    this.chartTensao = new Chart(canvasTensao, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Tensão',
                    data: dadosTensao,
                    borderColor: '#023047',
                    backgroundColor: 'rgba(2, 48, 71, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Média',
                    data: Array(labels.length).fill(parseFloat(statsTensao.media)),
                    borderColor: '#219ebc',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0
                },
                {
                    label: 'Mínimo',
                    data: Array(labels.length).fill(parseFloat(statsTensao.min)),
                    borderColor: '#06d6a0',
                    borderWidth: 1,
                    borderDash: [2, 2],
                    fill: false,
                    pointRadius: 0
                },
                {
                    label: 'Máximo',
                    data: Array(labels.length).fill(parseFloat(statsTensao.max)),
                    borderColor: '#ef476f',
                    borderWidth: 1,
                    borderDash: [2, 2],
                    fill: false,
                    pointRadius: 0
                }
            ]
        },
        options: {
            ...commonOptions,
            plugins: {
                ...commonOptions.plugins,
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + ' V';
                        }
                    }
                }
            },
            scales: {
                ...commonOptions.scales,
                y: {
                    ...commonOptions.scales.y,
                    title: {
                        display: true,
                        text: 'Tensão (V)'
                    }
                }
            }
        }
    });

    // Criar gráfico de Corrente
    this.chartCorrente = new Chart(canvasCorrente, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Corrente',
                    data: dadosCorrente,
                    borderColor: '#fb8500',
                    backgroundColor: 'rgba(251, 133, 0, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Média',
                    data: Array(labels.length).fill(parseFloat(statsCorrente.media)),
                    borderColor: '#219ebc',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0
                },
                {
                    label: 'Mínimo',
                    data: Array(labels.length).fill(parseFloat(statsCorrente.min)),
                    borderColor: '#06d6a0',
                    borderWidth: 1,
                    borderDash: [2, 2],
                    fill: false,
                    pointRadius: 0
                },
                {
                    label: 'Máximo',
                    data: Array(labels.length).fill(parseFloat(statsCorrente.max)),
                    borderColor: '#ef476f',
                    borderWidth: 1,
                    borderDash: [2, 2],
                    fill: false,
                    pointRadius: 0
                }
            ]
        },
        options: {
            ...commonOptions,
            plugins: {
                ...commonOptions.plugins,
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + ' A';
                        }
                    }
                }
            },
            scales: {
                ...commonOptions.scales,
                y: {
                    ...commonOptions.scales.y,
                    title: {
                        display: true,
                        text: 'Corrente (A)'
                    }
                }
            }
        }
    });

    // Criar gráfico de Potência Ativa
    this.chartPotencia = new Chart(canvasPotencia, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Potência Ativa',
                    data: dadosPotencia,
                    borderColor: '#ffb703',
                    backgroundColor: 'rgba(255, 183, 3, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Média',
                    data: Array(labels.length).fill(parseFloat(statsPotencia.media)),
                    borderColor: '#219ebc',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0
                },
                {
                    label: 'Mínimo',
                    data: Array(labels.length).fill(parseFloat(statsPotencia.min)),
                    borderColor: '#06d6a0',
                    borderWidth: 1,
                    borderDash: [2, 2],
                    fill: false,
                    pointRadius: 0
                },
                {
                    label: 'Máximo',
                    data: Array(labels.length).fill(parseFloat(statsPotencia.max)),
                    borderColor: '#ef476f',
                    borderWidth: 1,
                    borderDash: [2, 2],
                    fill: false,
                    pointRadius: 0
                }
            ]
        },
        options: {
            ...commonOptions,
            plugins: {
                ...commonOptions.plugins,
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + ' kW';
                        }
                    }
                }
            },
            scales: {
                ...commonOptions.scales,
                y: {
                    ...commonOptions.scales.y,
                    title: {
                        display: true,
                        text: 'Potência Ativa (kW)'
                    }
                }
            }
        }
    });
};
