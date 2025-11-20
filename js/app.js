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
                this.loadDashboard();
            });
        } else {
            this.setupEventListeners();
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
            exibirConfirmacao({
                title: 'Deseja sair?',
                message: 'Você será desconectado da sua conta. Deseja continuar?',
                type: 'question',
                confirmText: 'Sim, sair agora',
                cancelText: 'Não, continuar logado(a)',
                onConfirm: () => {
                    document.cookie = "USER_TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    window.location = "/login"
                }
            });
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
        switch (page) {
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

    async loadDashboard() {
        // Usar dados mockados ao invés da API
        this.dashboardData = this.getMockDashboardData();

        const content = document.getElementById('page-content');
        content.innerHTML = `
            <div class="dashboard-page">
                <h2>Dashboard</h2>
                <div class="stats-row">
                    <div class="stat-card">
                        <div class="stat-card-icon"><i class="fas fa-bolt"></i></div>
                        <div class="stat-card-label">Consumo Total Hoje</div>
                        <div class="stat-card-value">${this.dashboardData.consumoHoje.toLocaleString('pt-BR')} kWh</div>
                        <div class="stat-card-change">↑ ${this.dashboardData.consumoHojeVariacao}% vs ontem</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card-icon"><i class="fas fa-calendar-alt"></i></div>
                        <div class="stat-card-label">Consumo Mensal</div>
                        <div class="stat-card-value">${this.dashboardData.consumoMensal.toLocaleString('pt-BR')} kWh</div>
                        <div class="stat-card-change">Até o momento</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card-icon"><i class="fas fa-plug"></i></div>
                        <div class="stat-card-label">Dispositivos Ativos</div>
                        <div class="stat-card-value">${this.dashboardData.dispositivosAtivos}</div>
                        <div class="stat-card-change">Monitorados</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card-icon"><i class="fas fa-chart-pie"></i></div>
                        <div class="stat-card-label">Custo Estimado</div>
                        <div class="stat-card-value">R$ ${this.dashboardData.custoEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                        <div class="stat-card-change">Mês atual</div>
                    </div>
                </div>

                <!-- Gráfico de Consumo por Hora (largura total) -->
                <div class="charts-grid-full">
                    <div class="chart-container">
                        <div class="chart-header">
                            <h3 class="chart-title">Consumo por Hora</h3>
                            <div class="chart-controls">
                                <select id="chartPeriodConsumo">
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
                </div>

                <!-- Dois gráficos lado a lado: Top Dispositivos e Setores -->
                <div class="charts-grid-2">
                    <div class="chart-container">
                        <div class="chart-header">
                            <h3 class="chart-title">Top 5 Dispositivos Consumidores</h3>
                            <div class="chart-controls">
                                <select id="chartPeriodDispositivos">
                                    <option>Hoje</option>
                                    <option>Esta Semana</option>
                                    <option>Este Mês</option>
                                </select>
                            </div>
                        </div>
                        <div class="chart-body">
                            <canvas id="topDispositivosChart"></canvas>
                        </div>
                    </div>

                    <div class="chart-container">
                        <div class="chart-header">
                            <h3 class="chart-title">Consumo por Setor</h3>
                            <div class="chart-controls">
                                <select id="chartPeriodSetor">
                                    <option>Hoje</option>
                                    <option>Esta Semana</option>
                                    <option>Este Mês</option>
                                </select>
                            </div>
                        </div>
                        <div class="chart-body">
                            <canvas id="setorChart"></canvas>
                        </div>
                    </div>
                </div>

                <!-- Tabela de Leituras -->
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
                            ${this.dashboardData.ultimasLeituras.map(c => `
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

        // Destruir gráficos anteriores
        if (this.chartConsumo) {
            this.chartConsumo.destroy();
            this.chartConsumo = null;
        }
        if (this.chartTopDispositivos) {
            this.chartTopDispositivos.destroy();
            this.chartTopDispositivos = null;
        }
        if (this.chartSetor) {
            this.chartSetor.destroy();
            this.chartSetor = null;
        }

        // Renderizar gráficos com delay
        setTimeout(() => {
            this.renderConsumoChart();
            this.renderTopDispositivosChart();
            this.renderSetorChart();

            // Adicionar eventos aos selects
            document.getElementById('chartPeriodConsumo')?.addEventListener('change', () => {
                this.renderConsumoChart();
            });

            document.getElementById('chartPeriodDispositivos')?.addEventListener('change', () => {
                this.renderTopDispositivosChart();
            });

            document.getElementById('chartPeriodSetor')?.addEventListener('change', () => {
                this.renderSetorChart();
            });
        }, 100);
    }

    getMockDashboardData() {
        return {
            consumoHoje: 1245.5,
            consumoHojeVariacao: 5,
            consumoMensal: 37842,
            dispositivosAtivos: 8,
            custoEstimado: 1245.50,

            consumoPorHora: [
                { hora: '00:00', consumo: 98.5, media: 85.2, minimo: 72.5, maximo: 105.3 },
                { hora: '01:00', consumo: 92.3, media: 80.1, minimo: 68.2, maximo: 98.7 },
                { hora: '02:00', consumo: 88.1, media: 76.5, minimo: 65.1, maximo: 94.2 },
                { hora: '03:00', consumo: 85.7, media: 74.3, minimo: 63.2, maximo: 91.6 },
                { hora: '04:00', consumo: 84.2, media: 73.0, minimo: 62.1, maximo: 89.9 },
                { hora: '05:00', consumo: 86.5, media: 75.0, minimo: 63.8, maximo: 92.5 },
                { hora: '06:00', consumo: 95.8, media: 83.1, minimo: 70.7, maximo: 102.4 },
                { hora: '07:00', consumo: 125.4, media: 108.7, minimo: 92.5, maximo: 134.0 },
                { hora: '08:00', consumo: 168.9, media: 146.4, minimo: 124.6, maximo: 180.5 },
                { hora: '09:00', consumo: 185.2, media: 160.6, minimo: 136.7, maximo: 197.9 },
                { hora: '10:00', consumo: 192.5, media: 166.9, minimo: 142.0, maximo: 205.7 },
                { hora: '11:00', consumo: 188.3, media: 163.2, minimo: 138.9, maximo: 201.2 },
                { hora: '12:00', consumo: 156.7, media: 135.8, minimo: 115.6, maximo: 167.5 },
                { hora: '13:00', consumo: 175.2, media: 151.9, minimo: 129.3, maximo: 187.2 },
                { hora: '14:00', consumo: 194.8, media: 168.9, minimo: 143.6, maximo: 208.1 },
                { hora: '15:00', consumo: 198.5, media: 172.0, minimo: 146.4, maximo: 212.1 },
                { hora: '16:00', consumo: 189.7, media: 164.4, minimo: 139.9, maximo: 202.7 },
                { hora: '17:00', consumo: 172.4, media: 149.4, minimo: 127.1, maximo: 184.2 },
                { hora: '18:00', consumo: 145.8, media: 126.4, minimo: 107.5, maximo: 155.8 },
                { hora: '19:00', consumo: 128.5, media: 111.4, minimo: 94.8, maximo: 137.3 },
                { hora: '20:00', consumo: 118.2, media: 102.5, minimo: 87.2, maximo: 126.3 },
                { hora: '21:00', consumo: 112.7, media: 97.7, minimo: 83.1, maximo: 120.4 },
                { hora: '22:00', consumo: 105.3, media: 91.3, minimo: 77.7, maximo: 112.5 },
                { hora: '23:00', consumo: 101.2, media: 87.7, minimo: 74.6, maximo: 108.2 }
            ],

            topDispositivos: [
                { nome: 'Máquina CNC 01', consumo: 1250 },
                { nome: 'Compressor 02', consumo: 980 },
                { nome: 'Ar Condicionado 03', consumo: 750 },
                { nome: 'Forno Industrial', consumo: 620 },
                { nome: 'Esteira Transportadora', consumo: 480 }
            ],

            consumoPorSetor: [
                { setor: 'Produção', consumo: 1250 },
                { setor: 'Administrativo', consumo: 320 },
                { setor: 'Logística', consumo: 580 },
                { setor: 'Manutenção', consumo: 450 },
                { setor: 'TI', consumo: 180 }
            ],

            ultimasLeituras: [
                {
                    data: '01/11/2025',
                    hora: '14:35:22',
                    dispositivo: 'Máquina CNC 01',
                    corrente: 68.2,
                    tensao: 220.3,
                    potenciaAtiva: 15.01
                },
                {
                    data: '01/11/2025',
                    hora: '14:35:18',
                    dispositivo: 'Forno Industrial',
                    corrente: 96.8,
                    tensao: 219.8,
                    potenciaAtiva: 21.28
                },
                {
                    data: '01/11/2025',
                    hora: '14:35:15',
                    dispositivo: 'Compressor 02',
                    corrente: 49.3,
                    tensao: 220.1,
                    potenciaAtiva: 10.85
                },
                {
                    data: '01/11/2025',
                    hora: '14:35:12',
                    dispositivo: 'Ar Condicionado 03',
                    corrente: 37.4,
                    tensao: 220.5,
                    potenciaAtiva: 8.24
                },
                {
                    data: '01/11/2025',
                    hora: '14:35:08',
                    dispositivo: 'Esteira Transportadora',
                    corrente: 24.2,
                    tensao: 219.9,
                    potenciaAtiva: 5.32
                },
                {
                    data: '01/11/2025',
                    hora: '14:35:05',
                    dispositivo: 'Servidor TI',
                    corrente: 21.1,
                    tensao: 220.2,
                    potenciaAtiva: 4.64
                },
                {
                    data: '01/11/2025',
                    hora: '14:35:02',
                    dispositivo: 'Iluminação Galpão',
                    corrente: 14.1,
                    tensao: 220.4,
                    potenciaAtiva: 3.10
                },
                {
                    data: '01/11/2025',
                    hora: '14:34:58',
                    dispositivo: 'Máquina CNC 01',
                    corrente: 67.9,
                    tensao: 220.1,
                    potenciaAtiva: 14.94
                }
            ]
        };
    }

    renderConsumoChart() {
        const ctx = document.getElementById('consumoChart');
        if (!ctx) return;

        // Destruir gráfico anterior
        if (this.chartConsumo) {
            this.chartConsumo.destroy();
        }

        // Pegar período selecionado
        const periodo = document.getElementById('chartPeriodConsumo')?.value || 'Hoje';

        // Usar dados mockados
        const dados = this.dashboardData.consumoPorHora;
        const hours = dados.map(d => d.hora);
        const consumoData = dados.map(d => d.consumo);
        const avgData = dados.map(d => d.media);
        const minData = dados.map(d => d.minimo);
        const maxData = dados.map(d => d.maximo);

        this.chartConsumo = new Chart(ctx, {
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
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart'
                },
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
                            label: function (context) {
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

    renderTopDispositivosChart() {
        const ctx = document.getElementById('topDispositivosChart');
        if (!ctx) return;

        // Destruir gráfico anterior
        if (this.chartTopDispositivos) {
            this.chartTopDispositivos.destroy();
        }

        // Pegar período selecionado
        const periodo = document.getElementById('chartPeriodDispositivos')?.value || 'Hoje';

        // Usar dados mockados
        const dados = this.dashboardData.topDispositivos;
        const dispositivos = dados.map(d => d.nome);
        const consumoDispositivos = dados.map(d => d.consumo);

        this.chartTopDispositivos = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: dispositivos,
                datasets: [{
                    data: consumoDispositivos,
                    backgroundColor: [
                        '#ef476f',
                        '#fb8500',
                        '#ffb703',
                        '#219ebc',
                        '#023047'
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart'
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            padding: 10,
                            font: {
                                size: 11
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} kWh (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    renderSetorChart() {
        const ctx = document.getElementById('setorChart');
        if (!ctx) return;

        // Destruir gráfico anterior
        if (this.chartSetor) {
            this.chartSetor.destroy();
        }

        // Pegar período selecionado
        const periodo = document.getElementById('chartPeriodSetor')?.value || 'Hoje';

        // Usar dados mockados
        const dados = this.dashboardData.consumoPorSetor;
        const setores = dados.map(d => d.setor);
        const consumoSetores = dados.map(d => d.consumo);

        this.chartSetor = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: setores,
                datasets: [{
                    data: consumoSetores,
                    backgroundColor: [
                        '#ffb703',
                        '#fb8500',
                        '#f77f00',
                        '#219ebc',
                        '#023047'
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart'
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            padding: 10,
                            font: {
                                size: 11
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} kWh (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
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
                            <input type="text" name="nome" value="${usuario ? usuario.nome : ''}">
                        </div>
                        <div class="form-group">
                            <label>Email <span class="required">*</span></label>
                            <input type="email" name="email" value="${usuario ? usuario.email : ''}">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Perfil <span class="required">*</span></label>
                        <select name="role">
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
                <td><strong>${s.name || '-'}</strong></td>
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
                        <button type="submit" class="btn btn-primary">${setor ? 'Atualizar' : 'Salvar'}</button>
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
                    noResults: function () {
                        return "Nenhum setor encontrado";
                    },
                    searching: function () {
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
                <td><strong>${s.name || '-'}</strong></td>
                <td>${s.description || '-'}</td>
                <td><span class="badge badge-info">${s.department?.name || '-'}</span></td>
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
                        <button type="submit" class="btn btn-primary">${sala ? 'Atualizar' : 'Salvar'}</button>
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
                    noResults: function () {
                        return "Nenhum setor encontrado";
                    },
                    searching: function () {
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

    async loadDispositivos(page = 0, name = '', deviceTypeId = '') {
        try {
            this.currentSearch = name;
            this.currentDeviceTypeFilter = deviceTypeId;
            const size = 10;

            let response;

            // Se tem filtro de tipo de dispositivo, usa o endpoint específico
            if (deviceTypeId) {
                const query = new URLSearchParams({
                    name: name || '',
                    page,
                    size
                }).toString();
                response = await callApi(`/device-type/${deviceTypeId}/device?${query}`, { method: 'GET' });
            } else {
                // Senão, usa o endpoint geral
                const query = new URLSearchParams({
                    name: name || '',
                    page,
                    size
                }).toString();
                response = await callApi(`/device?${query}`, { method: 'GET' });
            }

            // Cria a paginação se ainda não existir
            if (!this.dispositivosPagination) {
                this.dispositivosPagination = new Pagination('dispositivos', size);
                this.dispositivosPagination.setRemoteLoader((newPage) => {
                    const searchTerm = document.getElementById('searchDispositivos')?.value || '';
                    const typeId = document.getElementById('filterDeviceType')?.value || '';
                    return this.loadDispositivos(newPage, searchTerm, typeId);
                });
            }

            // Atualiza dados da paginação
            this.dispositivosPagination.updateFromApiResponse(response);

            // Armazena os dispositivos recebidos
            this.data = this.data || {};
            this.data.dispositivos = response.content || [];

            // Renderiza a tabela
            this.renderDispositivosTable();

        } catch (error) {
            console.error("Erro ao carregar dispositivos:", error);
        }
    }

    async renderDispositivosTable() {
        const content = document.getElementById('page-content');
        const items = this.data?.dispositivos || [];

        const isFirstRender = !document.getElementById('searchDispositivos');

        if (isFirstRender) {
            // Carrega os tipos de dispositivos para o filtro
            let tiposDispositivos = [];
            try {
                const tiposResponse = await callApi('/device-type?page=0&size=1000', { method: 'GET' });
                tiposDispositivos = tiposResponse.content || [];
            } catch (error) {
                console.error('Erro ao carregar tipos de dispositivos:', error);
            }

            content.innerHTML = `
                <div class="dispositivos-page">
                    <div class="card-header">
                        <h2>Gerenciar Dispositivos</h2>
                        <button class="btn btn-primary" onclick="app.openDispositivoForm()">+ Novo Dispositivo</button>
                    </div>

                    <div class="table-container">
                        <div class="table-header">
                            <h3>Lista de Dispositivos</h3>
                            <div class="table-search" style="display: flex; gap: 10px; align-items: center;">
                                <select id="filterDeviceType" class="select2-search" style="min-width: 200px;">
                                    <option value="">Todos os tipos</option>
                                    ${tiposDispositivos.map(t => `
                                        <option value="${t.id}" ${this.currentDeviceTypeFilter === t.id ? 'selected' : ''}>
                                            ${t.name}
                                        </option>
                                    `).join('')}
                                </select>
                                <input type="text" placeholder="Buscar dispositivo..." id="searchDispositivos" value="${this.currentSearch || ''}">
                            </div>
                        </div>

                        <div class="table-wrapper">
                            <table id="dispositivosTable">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Potência (W)</th>
                                        <th>Tipo</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody id="dispositivosTableBody">
                                </tbody>
                            </table>
                        </div>
                        <div class="pagination" id="dispositivosPagination">
                        </div>
                    </div>
                </div>
            `;

            // Inicializa Select2 SEM AJAX (apenas com busca local)
            $('#filterDeviceType').select2({
                placeholder: 'Todos os tipos',
                allowClear: true,
                language: {
                    noResults: function () {
                        return "Nenhum tipo encontrado";
                    },
                    searching: function () {
                        return "Buscando...";
                    }
                }
            });

            // Eventos
            const input = document.getElementById('searchDispositivos');
            input.oninput = this.debounce(async (e) => {
                const searchTerm = e.target.value.trim();
                const typeId = $('#filterDeviceType').val() || '';
                await this.loadDispositivos(0, searchTerm, typeId);
            }, 400);

            $('#filterDeviceType').on('change', async (e) => {
                const typeId = e.target.value;
                const searchTerm = document.getElementById('searchDispositivos')?.value || '';
                await this.loadDispositivos(0, searchTerm, typeId);
            });
        }

        // Atualiza apenas o tbody
        const tbody = document.getElementById('dispositivosTableBody');
        tbody.innerHTML = items.length > 0 ? items.map(d => `
            <tr>
                <td><strong>${d.name || '-'}</strong></td>
                <td>${d.power ? d.power.toFixed(2) : '-'}</td>
                <td><span class="badge badge-info">${d.deviceType?.name || '-'}</span></td>
                <td>
                    <div class="cell-actions">
                        <button class="action-btn action-btn-edit" 
                                onclick="app.editDispositivo('${d.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn action-btn-delete" 
                                onclick="app.deleteDispositivo('${d.id}')">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('') : `
            <tr>
                <td colspan="4" style="text-align: center; padding: 40px; color: #999;">
                    Nenhum dispositivo encontrado
                </td>
            </tr>
        `;

        const paginationDiv = document.getElementById('dispositivosPagination');
        paginationDiv.innerHTML = this.dispositivosPagination.renderPaginationControls();
    }

    async openDispositivoForm(dispositivoId = null) {
        const modal = document.getElementById('formModal');
        const form = document.getElementById('modal-form');
        let dispositivo = null;

        // Carrega os tipos de dispositivos para o select
        let tiposDispositivos = [];
        try {
            const tiposResponse = await callApi('/device-type?page=0&size=1000', { method: 'GET' });
            tiposDispositivos = tiposResponse.content || [];
        } catch (error) {
            console.error('Erro ao carregar tipos de dispositivos:', error);
        }

        // Se for edição, busca o dispositivo pelo ID
        if (dispositivoId) {
            try {
                dispositivo = await callApi(`/device/${dispositivoId}`, { method: 'GET' });
            } catch (error) {
                console.error('Erro ao carregar dispositivo:', error);
                return;
            }
        }

        form.innerHTML = `
            <div class="form-card">
                <div class="form-card-header">
                    <h2>${dispositivo ? 'Editar Dispositivo' : 'Novo Dispositivo'}</h2>
                    <p>${dispositivo ? 'Atualize os dados do dispositivo' : 'Preencha os dados do novo dispositivo'}</p>
                </div>
                <form id="dispositivoForm">
                    <div class="form-group">
                        <label>Nome <span class="required">*</span></label>
                        <input type="text" name="name" value="${dispositivo ? dispositivo.name : ''}">
                    </div>
                    <div class="form-group">
                        <label>Potência (W) <span class="required">*</span></label>
                        <input type="number" name="power" step="0.01" value="${dispositivo ? dispositivo.power : ''}">
                    </div>
                    <div class="form-group">
                        <label>Tipo de Dispositivo <span class="required">*</span></label>
                        <select name="deviceTypeId" id="formDeviceTypeSelect" class="select2-search" ${dispositivo ? 'disabled' : ''}>
                            <option value="">Selecione um tipo</option>
                            ${tiposDispositivos.map(t => `
                                <option value="${t.id}" ${dispositivo && dispositivo.deviceType?.id === t.id ? 'selected' : ''}>
                                    ${t.name}
                                </option>
                            `).join('')}
                        </select>
                        ${dispositivo ? '<small style="color: #666; font-size: 12px; margin-top: 5px; display: block;">O tipo não pode ser alterado</small>' : ''}
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline" onclick="document.getElementById('formModal').classList.remove('show')">Cancelar</button>
                        <button type="submit" class="btn btn-primary">${dispositivo ? 'Atualizar' : 'Salvar'}</button>
                    </div>
                </form>
            </div>
        `;

        modal.classList.add('show');

        // Inicializa o Select2 no formulário (apenas se for novo dispositivo)
        if (!dispositivo) {
            $('#formDeviceTypeSelect').select2({
                placeholder: 'Selecione um tipo',
                dropdownParent: $('#formModal'),
                language: {
                    noResults: function () {
                        return "Nenhum tipo encontrado";
                    },
                    searching: function () {
                        return "Buscando...";
                    }
                }
            });
        }

        // Captura o envio do formulário
        document.getElementById('dispositivoForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(e.target);
            const payload = Object.fromEntries(formData.entries());

            try {
                if (dispositivoId) {
                    // Atualizar dispositivo existente (PUT) - sem deviceTypeId
                    const updatePayload = {
                        name: payload.name,
                        power: parseFloat(payload.power)
                    };
                    await callApi(`/device/${dispositivoId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatePayload)
                    });
                    exibirSucesso('Dispositivo atualizado com sucesso!');
                } else {
                    // Criar novo dispositivo (POST) - com deviceTypeId
                    const createPayload = {
                        name: payload.name,
                        power: parseFloat(payload.power),
                        deviceTypeId: payload.deviceTypeId
                    };
                    await callApi(`/device`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(createPayload)
                    });
                    exibirSucesso('Dispositivo criado com sucesso!');
                }

                modal.classList.remove('show');
                await this.loadDispositivos(0);
            } catch (error) {
                console.error('Erro ao salvar dispositivo:', error);
            }
        });
    }

    editDispositivo(id) {
        this.openDispositivoForm(id);
    }

    async deleteDispositivo(id) {
        exibirConfirmacao({
            title: 'Deletar Dispositivo',
            message: 'Tem certeza que deseja deletar este dispositivo? Esta ação não pode ser desfeita.',
            type: 'danger',
            confirmText: 'Sim, deletar',
            cancelText: 'Cancelar',
            onConfirm: async () => {
                try {
                    await callApi(`/device/${id}`, { method: 'DELETE' });
                    exibirSucesso('Dispositivo deletado com sucesso!');
                    await this.loadDispositivos(0);
                } catch (error) {
                    console.error('Erro ao deletar dispositivo:', error);
                }
            }
        });
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
                                <option value="rateio-setor">Comparação de Consumo - Setores</option>
                                <option value="rateio-sala">Comparação de Consumo - Salas</option>
                                <option value="rateio-vinculo">Comparação de Consumo - Vínculos</option>
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
                            label: function (context) {
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
                            label: function (context) {
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

    async loadTiposDispositivos(page = 0, name = '') {
        try {
            this.currentSearch = name;
            const size = 10;

            const query = new URLSearchParams({
                name: name || '',
                page,
                size
            }).toString();

            const response = await callApi(`/device-type?${query}`, { method: 'GET' });

            // Cria a paginação se ainda não existir
            if (!this.tiposDispositivosPagination) {
                this.tiposDispositivosPagination = new Pagination('tipos-dispositivos', size);
                this.tiposDispositivosPagination.setRemoteLoader((newPage) => {
                    const searchTerm = document.getElementById('searchTipos')?.value || '';
                    return this.loadTiposDispositivos(newPage, searchTerm);
                });
            }

            // Atualiza dados da paginação
            this.tiposDispositivosPagination.updateFromApiResponse(response);

            // Armazena os tipos recebidos
            this.data = this.data || {};
            this.data.tiposDispositivos = response.content || [];

            // Renderiza a tabela
            this.renderTiposDispositivosTable();

        } catch (error) {
            console.error("Erro ao carregar tipos de dispositivos:", error);
        }
    }

    renderTiposDispositivosTable() {
        const content = document.getElementById('page-content');
        const items = this.data?.tiposDispositivos || [];

        // Verifica se é a primeira renderização
        const isFirstRender = !document.getElementById('searchTipos');

        if (isFirstRender) {
            // Renderiza tudo pela primeira vez
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
                                <input type="text" placeholder="Buscar tipo..." id="searchTipos" value="${this.currentSearch || ''}">
                            </div>
                        </div>

                        <div class="table-wrapper">
                            <table id="tiposDispositivosTable">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody id="tiposDispositivosTableBody">
                                </tbody>
                            </table>
                        </div>
                        <div class="pagination" id="tiposDispositivosPagination">
                        </div>
                    </div>
                </div>
            `;

            // Adiciona o evento de busca apenas na primeira vez
            const input = document.getElementById('searchTipos');
            input.oninput = this.debounce(async (e) => {
                const searchTerm = e.target.value.trim();
                await this.loadTiposDispositivos(0, searchTerm);
            }, 400);
        }

        // Atualiza apenas o tbody
        const tbody = document.getElementById('tiposDispositivosTableBody');
        tbody.innerHTML = items.length > 0 ? items.map(t => `
            <tr>
                <td><strong>${t.name || '-'}</strong></td>
                <td>
                    <div class="cell-actions">
                        <button class="action-btn action-btn-edit" 
                                onclick="app.editTipoDispositivo('${t.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn action-btn-delete" 
                                onclick="app.deleteTipoDispositivo('${t.id}')">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('') : `
            <tr>
                <td colspan="2" style="text-align: center; padding: 40px; color: #999;">
                    Nenhum tipo de dispositivo encontrado
                </td>
            </tr>
        `;

        // Atualiza apenas a paginação
        const paginationDiv = document.getElementById('tiposDispositivosPagination');
        paginationDiv.innerHTML = this.tiposDispositivosPagination.renderPaginationControls();
    }

    async openTipoDispositivoForm(tipoId = null) {
        const modal = document.getElementById('formModal');
        const form = document.getElementById('modal-form');
        let tipo = null;

        // Se for edição, busca o tipo pelo ID
        if (tipoId) {
            try {
                tipo = await callApi(`/device-type/${tipoId}`, { method: 'GET' });
            } catch (error) {
                console.error('Erro ao carregar tipo de dispositivo:', error);
                return;
            }
        }

        form.innerHTML = `
            <div class="form-card">
                <div class="form-card-header">
                    <h2>${tipo ? 'Editar Tipo de Dispositivo' : 'Novo Tipo de Dispositivo'}</h2>
                    <p>${tipo ? 'Atualize os dados do tipo' : 'Preencha os dados do novo tipo'}</p>
                </div>
                <form id="tipoDispositivoForm">
                    <div class="form-group">
                        <label>Nome <span class="required">*</span></label>
                        <input type="text" name="name" value="${tipo ? tipo.name : ''}">
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline" onclick="document.getElementById('formModal').classList.remove('show')">Cancelar</button>
                        <button type="submit" class="btn btn-primary">${tipo ? 'Atualizar' : 'Salvar'}</button>
                    </div>
                </form>
            </div>
        `;

        modal.classList.add('show');

        // Captura o envio do formulário
        document.getElementById('tipoDispositivoForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(e.target);
            const payload = Object.fromEntries(formData.entries());

            try {
                if (tipoId) {
                    // Atualizar tipo existente (PUT)
                    await callApi(`/device-type/${tipoId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    exibirSucesso('Tipo atualizado com sucesso!');
                } else {
                    // Criar novo tipo (POST)
                    await callApi(`/device-type`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    exibirSucesso('Tipo criado com sucesso!');
                }

                modal.classList.remove('show');
                await this.loadTiposDispositivos(0);
            } catch (error) {
                console.error('Erro ao salvar tipo de dispositivo:', error);
            }
        });
    }

    editTipoDispositivo(id) {
        this.openTipoDispositivoForm(id);
    }

    async deleteTipoDispositivo(id) {
        exibirConfirmacao({
            title: 'Deletar Tipo de Dispositivo',
            message: 'Tem certeza que deseja deletar este tipo de dispositivo? Esta ação não pode ser desfeita.',
            type: 'danger',
            confirmText: 'Sim, deletar',
            cancelText: 'Cancelar',
            onConfirm: async () => {
                try {
                    await callApi(`/device-type/${id}`, { method: 'DELETE' });
                    exibirSucesso('Tipo de dispositivo deletado com sucesso!');
                    await this.loadTiposDispositivos(0);
                } catch (error) {
                    console.error('Erro ao deletar tipo de dispositivo:', error);
                }
            }
        });
    }


    async loadVinculos(page = 0, alias = '', deviceId = '', roomId = '', departmentId = '') {
        try {
            this.currentAliasSearch = alias;
            this.currentDeviceFilter = deviceId;
            this.currentRoomFilter = roomId;
            this.currentDepartmentFilterVinculo = departmentId;
            const size = 10;

            // Se tem departmentId, usa a rota específica do departamento
            let response;
            if (departmentId) {
                const query = new URLSearchParams({
                    alias: alias || '',
                    page,
                    size
                }).toString();
                response = await callApi(`/department/${departmentId}/device?${query}`, { method: 'GET' });

                // Se tem roomId, filtra os resultados pelo roomId
                if (roomId && response.content) {
                    response.content = response.content.filter(v => v.room?.id === roomId);
                }

                // Se tem deviceId, filtra os resultados pelo deviceId
                if (deviceId && response.content) {
                    response.content = response.content.filter(v => v.device?.id === deviceId);
                }
            } else {
                // Usa a rota geral se não tem departmentId
                const query = new URLSearchParams({
                    alias: alias || '',
                    deviceId: deviceId || '',
                    roomId: roomId || '',
                    page,
                    size
                }).toString();
                response = await callApi(`/device-room?${query}`, { method: 'GET' });
            }

            if (!this.vinculosPagination) {
                this.vinculosPagination = new Pagination('vinculos', size);
                this.vinculosPagination.setRemoteLoader((newPage) => {
                    const searchAlias = document.getElementById('searchVinculos')?.value || '';
                    const devId = $('#filterDevice').val() || '';
                    const deptId = $('#filterDepartmentVinculo').val() || '';
                    const rmId = $('#filterRoomVinculo').val() || '';
                    return this.loadVinculos(newPage, searchAlias, devId, rmId, deptId);
                });
            }

            this.vinculosPagination.updateFromApiResponse(response);
            this.data = this.data || {};
            this.data.vinculos = response.content || [];
            this.renderVinculosTable();

        } catch (error) {
            console.error("Erro ao carregar vínculos:", error);
        }
    }

    async renderVinculosTable() {
        const content = document.getElementById('page-content');
        const items = this.data?.vinculos || [];
        const isFirstRender = !document.getElementById('searchVinculos');

        if (isFirstRender) {
            let dispositivos = [];
            let setores = [];

            try {
                const [dispositivosResponse, setoresResponse] = await Promise.all([
                    callApi('/device?name=&page=0&size=1000', { method: 'GET' }),
                    callApi('/department?name=&page=0&size=1000', { method: 'GET' })
                ]);
                dispositivos = dispositivosResponse.content || [];
                setores = setoresResponse.content || [];
            } catch (error) {
                console.error('Erro ao carregar filtros:', error);
            }

            content.innerHTML = `
                <div class="vinculos-page">
                    <div class="card-header">
                        <h2>Vínculos de Dispositivos</h2>
                        <button class="btn btn-primary" onclick="app.openVinculoForm()">+ Novo Vínculo</button>
                    </div>

                    <div class="table-container">
                        <div class="table-header">
                            <h3>Lista de Vínculos (Dispositivos em Salas)</h3>
                            <div class="table-search">
                                <select id="filterDepartmentVinculo" class="select2-search" style="min-width: 200px;">
                                    <option value="">Todos os setores</option>
                                    ${setores.map(s => `
                                        <option value="${s.id}" ${this.currentDepartmentFilterVinculo === s.id ? 'selected' : ''}>
                                            ${s.name}
                                        </option>
                                    `).join('')}
                                </select>
                                <select id="filterRoomVinculo" class="select2-search" style="min-width: 200px;" disabled>
                                    <option value="">Selecione um setor primeiro</option>
                                </select>
                                <select id="filterDevice" class="select2-search" style="min-width: 200px;">
                                    <option value="">Todos os dispositivos</option>
                                    ${dispositivos.map(d => `
                                        <option value="${d.id}" ${this.currentDeviceFilter === d.id ? 'selected' : ''}>
                                            ${d.name} (${d.deviceType?.name || '-'})
                                        </option>
                                    `).join('')}
                                </select>
                                <input type="text" placeholder="Buscar por apelido..." id="searchVinculos" value="${this.currentAliasSearch || ''}">
                            </div>
                        </div>

                        <table id="vinculosTable">
                            <thead>
                                <tr>
                                    <th>Apelido</th>
                                    <th>Sala</th>
                                    <th>Setor</th>
                                    <th>Dispositivo</th>
                                    <th>Tipo</th>
                                    <th>Tempo Médio (h)</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody id="vinculosTableBody">
                            </tbody>
                        </table>
                        <div class="pagination" id="vinculosPagination">
                        </div>
                    </div>
                </div>
            `;

            $('#filterDepartmentVinculo').select2({
                placeholder: 'Todos os setores',
                allowClear: true,
                language: {
                    noResults: function () { return "Nenhum setor encontrado"; },
                    searching: function () { return "Buscando..."; }
                }
            });

            $('#filterRoomVinculo').select2({
                placeholder: 'Selecione um setor primeiro',
                allowClear: true,
                language: {
                    noResults: function () { return "Nenhuma sala encontrada"; },
                    searching: function () { return "Buscando..."; }
                }
            });

            $('#filterDevice').select2({
                placeholder: 'Todos os dispositivos',
                allowClear: true,
                language: {
                    noResults: function () { return "Nenhum dispositivo encontrado"; },
                    searching: function () { return "Buscando..."; }
                }
            });

            // EVENTO PARA FILTRAR SALAS E DISPOSITIVOS QUANDO SELECIONAR SETOR
            $('#filterDepartmentVinculo').on('change', async function () {
                const deptId = $(this).val();
                const roomSelect = $('#filterRoomVinculo');
                const deviceSelect = $('#filterDevice');

                if (deptId) {
                    try {
                        // Busca as salas do setor
                        const salasResponse = await callApi(`/department/${deptId}/room?name=&page=0&size=1000`, { method: 'GET' });
                        const salasDoSetor = salasResponse.content || [];

                        roomSelect.empty();
                        roomSelect.append('<option value="">Todas as salas do setor</option>');
                        salasDoSetor.forEach(s => {
                            roomSelect.append(`<option value="${s.id}">${s.name}</option>`);
                        });

                        roomSelect.prop('disabled', false);
                        roomSelect.select2('destroy');
                        roomSelect.select2({
                            placeholder: 'Todas as salas do setor',
                            allowClear: true,
                            language: {
                                noResults: function () { return "Nenhuma sala encontrada"; },
                                searching: function () { return "Buscando..."; }
                            }
                        });

                        // Busca os dispositivos vinculados ao setor (distinct)
                        const vinculosResponse = await callApi(`/department/${deptId}/device?name=&page=0&size=1000`, { method: 'GET' });
                        const vinculos = vinculosResponse.content || [];

                        // Extrai dispositivos únicos
                        const dispositivosUnicos = [];
                        const dispositivosIds = new Set();

                        vinculos.forEach(v => {
                            if (v.device && !dispositivosIds.has(v.device.id)) {
                                dispositivosIds.add(v.device.id);
                                dispositivosUnicos.push(v.device);
                            }
                        });

                        deviceSelect.empty();
                        deviceSelect.append('<option value="">Todos os dispositivos do setor</option>');
                        dispositivosUnicos.forEach(d => {
                            deviceSelect.append(`<option value="${d.id}">${d.name} (${d.deviceType?.name || '-'})</option>`);
                        });

                        deviceSelect.select2('destroy');
                        deviceSelect.select2({
                            placeholder: 'Todos os dispositivos do setor',
                            allowClear: true,
                            language: {
                                noResults: function () { return "Nenhum dispositivo encontrado"; },
                                searching: function () { return "Buscando..."; }
                            }
                        });

                    } catch (error) {
                        console.error('Erro ao carregar dados do setor:', error);
                    }
                } else {
                    // Reset salas
                    roomSelect.empty();
                    roomSelect.append('<option value="">Selecione um setor primeiro</option>');
                    roomSelect.prop('disabled', true);
                    roomSelect.val('').trigger('change');
                    roomSelect.select2('destroy');
                    roomSelect.select2({
                        placeholder: 'Selecione um setor primeiro',
                        allowClear: true
                    });

                    // Reset dispositivos para todos
                    try {
                        const dispositivosResponse = await callApi('/device?name=&page=0&size=1000', { method: 'GET' });
                        const todosDispositivos = dispositivosResponse.content || [];

                        deviceSelect.empty();
                        deviceSelect.append('<option value="">Todos os dispositivos</option>');
                        todosDispositivos.forEach(d => {
                            deviceSelect.append(`<option value="${d.id}">${d.name} (${d.deviceType?.name || '-'})</option>`);
                        });

                        deviceSelect.select2('destroy');
                        deviceSelect.select2({
                            placeholder: 'Todos os dispositivos',
                            allowClear: true,
                            language: {
                                noResults: function () { return "Nenhum dispositivo encontrado"; },
                                searching: function () { return "Buscando..."; }
                            }
                        });
                    } catch (error) {
                        console.error('Erro ao carregar dispositivos:', error);
                    }
                }

                // Recarregar dados
                const searchAlias = document.getElementById('searchVinculos')?.value || '';
                const devId = $('#filterDevice').val() || '';
                const rmId = $('#filterRoomVinculo').val() || '';
                await app.loadVinculos(0, searchAlias, devId, rmId, deptId);
            });

            // EVENTO PARA FILTRAR DISPOSITIVOS QUANDO SELECIONAR SALA
            $('#filterRoomVinculo').on('change', async (e) => {
                const rmId = e.target.value;
                const deptId = $('#filterDepartmentVinculo').val() || '';
                const deviceSelect = $('#filterDevice');

                if (rmId) {
                    try {
                        // Busca os dispositivos vinculados à sala
                        const vinculosResponse = await callApi(`/room/${rmId}/device?name=&page=0&size=1000`, { method: 'GET' });
                        const vinculos = vinculosResponse.content || [];

                        // Extrai dispositivos únicos
                        const dispositivosUnicos = [];
                        const dispositivosIds = new Set();

                        vinculos.forEach(v => {
                            if (v.device && !dispositivosIds.has(v.device.id)) {
                                dispositivosIds.add(v.device.id);
                                dispositivosUnicos.push(v.device);
                            }
                        });

                        deviceSelect.empty();
                        deviceSelect.append('<option value="">Todos os dispositivos da sala</option>');
                        dispositivosUnicos.forEach(d => {
                            deviceSelect.append(`<option value="${d.id}">${d.name} (${d.deviceType?.name || '-'})</option>`);
                        });

                        deviceSelect.select2('destroy');
                        deviceSelect.select2({
                            placeholder: 'Todos os dispositivos da sala',
                            allowClear: true,
                            language: {
                                noResults: function () { return "Nenhum dispositivo encontrado"; },
                                searching: function () { return "Buscando..."; }
                            }
                        });
                    } catch (error) {
                        console.error('Erro ao carregar dispositivos da sala:', error);
                    }
                } else if (deptId) {
                    // Se limpou a sala mas tem setor, volta para dispositivos do setor
                    try {
                        const vinculosResponse = await callApi(`/department/${deptId}/device?name=&page=0&size=1000`, { method: 'GET' });
                        const vinculos = vinculosResponse.content || [];

                        const dispositivosUnicos = [];
                        const dispositivosIds = new Set();

                        vinculos.forEach(v => {
                            if (v.device && !dispositivosIds.has(v.device.id)) {
                                dispositivosIds.add(v.device.id);
                                dispositivosUnicos.push(v.device);
                            }
                        });

                        deviceSelect.empty();
                        deviceSelect.append('<option value="">Todos os dispositivos do setor</option>');
                        dispositivosUnicos.forEach(d => {
                            deviceSelect.append(`<option value="${d.id}">${d.name} (${d.deviceType?.name || '-'})</option>`);
                        });

                        deviceSelect.select2('destroy');
                        deviceSelect.select2({
                            placeholder: 'Todos os dispositivos do setor',
                            allowClear: true,
                            language: {
                                noResults: function () { return "Nenhum dispositivo encontrado"; },
                                searching: function () { return "Buscando..."; }
                            }
                        });
                    } catch (error) {
                        console.error('Erro ao carregar dispositivos do setor:', error);
                    }
                }

                const searchAlias = document.getElementById('searchVinculos')?.value || '';
                const devId = $('#filterDevice').val() || '';
                await app.loadVinculos(0, searchAlias, devId, rmId, deptId);
            });

            const input = document.getElementById('searchVinculos');
            input.oninput = this.debounce(async (e) => {
                const searchAlias = e.target.value.trim();
                const devId = $('#filterDevice').val() || '';
                const deptId = $('#filterDepartmentVinculo').val() || '';
                const rmId = $('#filterRoomVinculo').val() || '';
                await this.loadVinculos(0, searchAlias, devId, rmId, deptId);
            }, 400);

            $('#filterDevice').on('change', async (e) => {
                const devId = e.target.value;
                const searchAlias = document.getElementById('searchVinculos')?.value || '';
                const deptId = $('#filterDepartmentVinculo').val() || '';
                const rmId = $('#filterRoomVinculo').val() || '';
                await this.loadVinculos(0, searchAlias, devId, rmId, deptId);
            });
        }

        const tbody = document.getElementById('vinculosTableBody');
        tbody.innerHTML = items.length > 0 ? items.map(v => `
            <tr>
                <td><strong>${v.alias || '-'}</strong></td>
                <td><span class="badge badge-indigo">${v.room?.name || '-'}</span></td>
                <td><span class="badge badge-info">${v.room?.department?.name || '-'}</span></td>
                <td><span class="badge badge-purple">${v.device?.name || '-'}</span></td>
                <td><span class="badge badge-secondary">${v.device?.deviceType?.name || '-'}</span></td>
                <td>${v.averageTimeHour ? v.averageTimeHour.toFixed(1) : '-'}</td>
                <td>
                ${v.online
                ? '<span class="badge badge-success">Online</span>'
                : '<span class="badge badge-danger">Offline</span>'}
                </td>
                <td>
                    <div class="cell-actions">
                        <button class="action-btn action-btn-edit" onclick="app.editVinculo('${v.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn action-btn-delete" onclick="app.deleteVinculo('${v.id}')">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('') : `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px; color: #999;">
                    Nenhum vínculo encontrado
                </td>
            </tr>
        `;

        const paginationDiv = document.getElementById('vinculosPagination');
        paginationDiv.innerHTML = this.vinculosPagination.renderPaginationControls();
    }

    async openVinculoForm(vinculoId = null) {
        const modal = document.getElementById('formModal');
        const form = document.getElementById('modal-form');
        let vinculo = null;

        // Carrega dados apenas se for novo vínculo
        let dispositivos = [];
        let setores = [];

        if (!vinculoId) {
            try {
                const [dispositivosResponse, setoresResponse] = await Promise.all([
                    callApi('/device?name=&page=0&size=1000', { method: 'GET' }),
                    callApi('/department?name=&page=0&size=1000', { method: 'GET' })
                ]);
                dispositivos = dispositivosResponse.content || [];
                setores = setoresResponse.content || [];
            } catch (error) {
                console.error('Erro ao carregar dados para formulário:', error);
            }
        } else {
            // Se está editando, carrega o vínculo
            try {
                vinculo = await callApi(`/device-room/${vinculoId}`, { method: 'GET' });
            } catch (error) {
                console.error('Erro ao carregar vínculo:', error);
                return;
            }
        }

        form.innerHTML = `
            <div class="form-card">
                <div class="form-card-header">
                    <h2>${vinculo ? 'Editar Vínculo' : 'Novo Vínculo'}</h2>
                    <p>${vinculo ? 'Atualize os dados do vínculo' : 'Vincule um dispositivo a uma sala'}</p>
                </div>
                <form id="vinculoForm">
                    <div class="form-group">
                        <label>Apelido <span class="required">*</span></label>
                        <input type="text" name="alias" value="${vinculo ? vinculo.alias : ''}" placeholder="Ex: Ar Sala Reunião">
                    </div>
                    
                    <div class="form-group">
                        <label>Setor <span class="required">*</span></label>
                        ${vinculo ? `
                            <input type="text" value="${vinculo.room?.department?.name || '-'}" disabled>
                            <small style="color: #666; font-size: 12px; margin-top: 5px; display: block;">O setor não pode ser alterado</small>
                        ` : `
                            <select id="formDepartmentSelect" class="select2-search">
                                <option value="">Selecione um setor</option>
                                ${setores.map(s => `
                                    <option value="${s.id}">
                                        ${s.name}
                                    </option>
                                `).join('')}
                            </select>
                        `}
                    </div>

                    <div class="form-group">
                        <label>Sala <span class="required">*</span></label>
                        ${vinculo ? `
                            <input type="text" value="${vinculo.room?.name || '-'}" disabled>
                            <small style="color: #666; font-size: 12px; margin-top: 5px; display: block;">A sala não pode ser alterada</small>
                        ` : `
                            <select name="roomId" id="formRoomSelect" class="select2-search" disabled>
                                <option value="">Selecione um setor primeiro</option>
                            </select>
                        `}
                    </div>

                    <div class="form-group">
                        <label>Dispositivo <span class="required">*</span></label>
                        ${vinculo ? `
                            <input type="text" value="${vinculo.device?.name || '-'} (${vinculo.device?.deviceType?.name || '-'}) - ${vinculo.device?.power}W" disabled>
                            <small style="color: #666; font-size: 12px; margin-top: 5px; display: block;">O dispositivo não pode ser alterado</small>
                        ` : `
                            <select name="deviceId" id="formDeviceSelect" class="select2-search">
                                <option value="">Selecione um dispositivo</option>
                                ${dispositivos.map(d => `
                                    <option value="${d.id}">
                                        ${d.name} (${d.deviceType?.name || '-'}) - ${d.power}W
                                    </option>
                                `).join('')}
                            </select>
                        `}
                    </div>

                    <div class="form-group">
                        <label>Tempo Médio de Funcionamento (horas)</label>
                        <input type="number" name="averageTimeHour" step="0.1" min="0" value="${vinculo ? vinculo.averageTimeHour || '' : ''}" placeholder="Ex: 8.5">
                        <small style="color: #666; font-size: 12px; margin-top: 5px; display: block;">Tempo médio de uso diário em horas</small>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline" onclick="document.getElementById('formModal').classList.remove('show')">Cancelar</button>
                        <button type="submit" class="btn btn-primary">${vinculo ? 'Atualizar' : 'Salvar'}</button>
                    </div>
                </form>
            </div>
        `;

        modal.classList.add('show');

        // Inicializa select2 apenas para novos vínculos
        if (!vinculo) {
            $('#formDepartmentSelect').select2({
                placeholder: 'Selecione um setor',
                dropdownParent: $('#formModal'),
                allowClear: true,
                width: '100%',
                language: {
                    noResults: function () { return "Nenhum setor encontrado"; },
                    searching: function () { return "Buscando..."; }
                }
            });

            $('#formRoomSelect').select2({
                placeholder: 'Selecione um setor primeiro',
                dropdownParent: $('#formModal'),
                width: '100%',
                language: {
                    noResults: function () { return "Nenhuma sala encontrada"; },
                    searching: function () { return "Buscando..."; }
                }
            });

            $('#formDeviceSelect').select2({
                placeholder: 'Selecione um dispositivo',
                dropdownParent: $('#formModal'),
                width: '100%',
                language: {
                    noResults: function () { return "Nenhum dispositivo encontrado"; },
                    searching: function () { return "Buscando..."; }
                }
            });

            // EVENTO PARA FILTRAR SALAS QUANDO SELECIONAR SETOR (mesma lógica da visualização)
            $('#formDepartmentSelect').on('change', async function () {
                const setorId = $(this).val();
                const roomSelect = $('#formRoomSelect');

                if (setorId) {
                    try {
                        // Busca as salas do setor
                        const salasResponse = await callApi(`/department/${setorId}/room?name=&page=0&size=1000`, { method: 'GET' });
                        const salasDoSetor = salasResponse.content || [];

                        roomSelect.empty();
                        roomSelect.append('<option value="">Selecione uma sala</option>');
                        salasDoSetor.forEach(s => {
                            roomSelect.append(`<option value="${s.id}">${s.name}</option>`);
                        });

                        roomSelect.prop('disabled', false);
                        roomSelect.select2('destroy');
                        roomSelect.select2({
                            placeholder: 'Selecione uma sala',
                            dropdownParent: $('#formModal'),
                            language: {
                                noResults: function () { return "Nenhuma sala encontrada"; },
                                searching: function () { return "Buscando..."; }
                            }
                        });
                    } catch (error) {
                        console.error('Erro ao carregar salas do setor:', error);
                    }
                } else {
                    roomSelect.empty();
                    roomSelect.append('<option value="">Selecione um setor primeiro</option>');
                    roomSelect.prop('disabled', true);
                    roomSelect.select2('destroy');
                    roomSelect.select2({
                        placeholder: 'Selecione um setor primeiro',
                        dropdownParent: $('#formModal')
                    });
                }
            });
        }

        document.getElementById('vinculoForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(e.target);
            const payload = Object.fromEntries(formData.entries());

            if (payload.averageTimeHour) {
                payload.averageTimeHour = parseFloat(payload.averageTimeHour);
            }

            try {
                if (vinculoId) {
                    const updatePayload = {
                        alias: payload.alias,
                        averageTimeHour: payload.averageTimeHour || null
                    };
                    await callApi(`/device-room/${vinculoId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatePayload)
                    });
                    exibirSucesso('Vínculo atualizado com sucesso!');
                } else {
                    await callApi(`/device-room`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    exibirSucesso('Vínculo criado com sucesso!');
                }

                modal.classList.remove('show');
                await this.loadVinculos(0);
            } catch (error) {
                console.error('Erro ao salvar vínculo:', error);
            }
        });
    }

    editVinculo(id) {
        this.openVinculoForm(id);
    }

    async deleteVinculo(id) {
        exibirConfirmacao({
            title: 'Deletar Vínculo',
            message: 'Tem certeza que deseja deletar este vínculo? Esta ação não pode ser desfeita.',
            type: 'danger',
            confirmText: 'Sim, deletar',
            cancelText: 'Cancelar',
            onConfirm: async () => {
                try {
                    await callApi(`/device-room/${id}`, { method: 'DELETE' });
                    exibirSucesso('Vínculo deletado com sucesso!');
                    await this.loadVinculos(0);
                } catch (error) {
                    console.error('Erro ao deletar vínculo:', error);
                }
            }
        });
    }
}

// Inicializar aplicacao
const app = new App();
// ===== RELATÓRIOS COM FILTROS HIERÁRQUICOS =====

// Adicionar ao App class
App.prototype.loadRelatorios = async function () {
    const content = document.getElementById("page-content");

    let setores = [];
    try {
        const setoresResponse = await callApi("/department?page=0&size=1000", { method: "GET" });
        setores = setoresResponse.content || [];
    } catch (error) {
        console.error("Erro ao carregar setores:", error);
    }

    this.data.setores = setores;

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
                            <option value="evolucao-setor">Por Setor</option>
                            <option value="evolucao-sala">Por Sala</option>
                            <option value="evolucao-vinculo">Por Vínculo (Dispositivo)</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Filtros Hierárquicos (Setor > Sala) -->
            <div class="filter-section" id="filtrosHierarquicos">
                <h3 class="filter-title">Filtros</h3>
                <div class="filter-row">
                    <div class="filter-group" id="filtroSetorContainer">
                        <label>Setor</label>
                        <select id="filtroSetor" onchange="app.updateFiltroSalaRelatorio()">
                            <option value="">Selecione um setor</option>
                            ${setores.map(s => `
                                <option value="${s.id}">
                                    ${s.name}
                                </option>
                            `).join("")}
                        </select>
                    </div>
                    <div class="filter-group" id="filtroSalaContainer">
                        <label>Sala</label>
                        <select id="filtroSala" disabled onchange="app.handleSalaChange()">
                            <option value="">Selecione uma sala</option>
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
                <div class="filter-row" style="gap: 10px; margin-bottom: 10px;">
                    <button class="btn btn-outline" onclick="app.aplicarPeriodoHoje()">
                        <i class="fas fa-calendar-day"></i> Hoje
                    </button>
                    <button class="btn btn-outline" onclick="app.aplicarPeriodoSemana()">
                        <i class="fas fa-calendar-week"></i> 7 últimos dias
                    </button>
                    <button class="btn btn-outline" onclick="app.aplicarPeriodoMes()">
                        <i class="fas fa-calendar-alt"></i> 30 últimos dias
                    </button>
                </div>
                <div class="filter-row">
                    <div class="filter-group" style="flex: 1;">
                        <label>Período Personalizado</label>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <input type="datetime-local" id="dataInicio" class="form-control" style="flex: 1;">
                            <span>até</span>
                            <input type="datetime-local" id="dataFim" class="form-control" style="flex: 1;">
                            <button class="btn btn-primary" onclick="app.aplicarPeriodoPersonalizado()">Aplicar</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Container dos Gráficos (Evolução + Rateio) -->
            <div class="charts-grid-2" style="margin-top: 20px;">
                <!-- Gráfico de Evolução -->
                <div class="chart-container">
                    <div class="chart-header">
                        <h3 class="chart-title" id="chartTitleEvolucao">Evolução de Consumo</h3>
                    </div>
                    <div class="chart-body" style="height: 400px; position: relative;">
                        <canvas id="relatorioChartEvolucao"></canvas>
                        <div id="mensagemEvolucao" class="chart-message" style="display: none;">
                            Selecione um período para visualizar os dados.
                        </div>
                    </div>
                </div>

                <!-- Gráfico de Rateio -->
                <div class="chart-container">
                    <div class="chart-header">
                        <h3 class="chart-title" id="chartTitleRateio">Rateio de Consumo</h3>
                    </div>
                    <div class="chart-body" style="height: 400px; position: relative;">
                        <canvas id="relatorioChartRateio"></canvas>
                        <div id="mensagemRateio" class="chart-message" style="display: none;">
                            Selecione um período para visualizar os dados.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Inicializar select2
    $("#filtroSetor").select2({ placeholder: "Selecione um setor", allowClear: true });
    $("#filtroSala").select2({ placeholder: "Selecione uma sala", allowClear: true });

    // Inicializar estado
    this.tipoRelatorioAtual = "evolucao-setor";
    this.filtroSetorAtual = "";
    this.filtroSalaAtual = "";
    this.periodoSelecionado = false; // ADICIONADO

    // Chamar updateRelatorio para configurar o estado inicial dos filtros
    this.updateRelatorio();
};

// Função auxiliar para formatar data para datetime-local
App.prototype.formatDateTimeLocal = function(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Atualizar filtro de sala quando setor for selecionado
App.prototype.updateFiltroSalaRelatorio = async function () {
    const setorId = document.getElementById("filtroSetor").value;
    const salaSelect = document.getElementById("filtroSala");
    const tipo = this.tipoRelatorioAtual;
    
    this.filtroSetorAtual = setorId;
    this.filtroSalaAtual = ""; // Reseta a sala ao mudar o setor
    
    // Apenas para Evolução por Vínculo a sala deve ser habilitada
    if (tipo === "evolucao-vinculo") {
        if (!setorId) {
            salaSelect.disabled = true;
            salaSelect.innerHTML = "<option value=''>Selecione uma sala</option>";
            $("#filtroSala").val(null).trigger("change.select2");
            
            // Atualiza o placeholder
            $('#filtroSala').select2('destroy');
            $('#filtroSala').select2({
                placeholder: 'Selecione um setor primeiro',
                allowClear: true
            });
        } else {
            try {
                const salasResponse = await callApi(`/department/${setorId}/room?name=&page=0&size=1000`, { method: "GET" });
                const salas = salasResponse.content || [];

                salaSelect.disabled = false;
                salaSelect.innerHTML = "<option value=''>Todas as salas do setor</option>" +
                    salas.map(s => `<option value="${s.id}">${s.name}</option>`).join("");

                $("#filtroSala").val(null).trigger("change.select2");
                
                // Atualiza o placeholder
                $('#filtroSala').select2('destroy');
                $('#filtroSala').select2({
                    placeholder: 'Todas as salas do setor',
                    allowClear: true
                });
            } catch (error) {
                console.error("Erro ao carregar salas do setor:", error);
            }
        }
    } else {
        // Para evolucao-sala, a sala deve permanecer desabilitada
        salaSelect.disabled = true;
        salaSelect.innerHTML = "<option value=''>-</option>";
        $("#filtroSala").val(null).trigger("change.select2");
        
        // Atualiza o placeholder
        $('#filtroSala').select2('destroy');
        $('#filtroSala').select2({
            placeholder: '-',
            allowClear: true
        });
    }

    this.renderRelatorioCharts();
};

// Lida com a mudança da sala
App.prototype.handleSalaChange = function() {
    this.filtroSalaAtual = document.getElementById("filtroSala").value;
    this.renderRelatorioCharts();
};

// Limpar filtros hierárquicos
App.prototype.limparFiltrosHierarquicos = function () {
    $("#filtroSetor").val(null).trigger("change");
    this.updateFiltroSalaRelatorio(); // Isso vai resetar a sala e renderizar os gráficos
};

App.prototype.aplicarPeriodoHoje = function () {
    const agora = new Date();
    const ontem = new Date(agora);
    ontem.setDate(ontem.getDate() - 1);
    
    document.getElementById("dataInicio").value = this.formatDateTimeLocal(ontem);
    document.getElementById("dataFim").value = this.formatDateTimeLocal(agora);
    
    this.periodoSelecionado = true;
    this.renderRelatorioCharts();
};

App.prototype.aplicarPeriodoSemana = function () {
    const agora = new Date();
    const seteDiasAtras = new Date(agora);
    seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
    
    document.getElementById("dataInicio").value = this.formatDateTimeLocal(seteDiasAtras);
    document.getElementById("dataFim").value = this.formatDateTimeLocal(agora);
    
    this.periodoSelecionado = true;
    this.renderRelatorioCharts();
};

App.prototype.aplicarPeriodoMes = function () {
    const agora = new Date();
    const trintaDiasAtras = new Date(agora);
    trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);
    
    document.getElementById("dataInicio").value = this.formatDateTimeLocal(trintaDiasAtras);
    document.getElementById("dataFim").value = this.formatDateTimeLocal(agora);
    
    this.periodoSelecionado = true;
    this.renderRelatorioCharts();
};

// Aplicar período personalizado
App.prototype.aplicarPeriodoPersonalizado = function () {
    const dataInicio = document.getElementById("dataInicio").value;
    const dataFim = document.getElementById("dataFim").value;

    if (!dataInicio || !dataFim) {
        alert("Por favor, selecione ambas as datas");
        return;
    }

    if (new Date(dataInicio) > new Date(dataFim)) {
        alert("A data inicial deve ser anterior à data final");
        return;
    }

    this.periodoSelecionado = true; // ADICIONADO
    this.renderRelatorioCharts();
};

// Atualizar tipo de relatório
App.prototype.updateRelatorio = function () {
    const tipoSelecionado = document.getElementById("tipoRelatorio").value;
    this.tipoRelatorioAtual = tipoSelecionado;

    const setorSelect = $("#filtroSetor");
    const salaSelect = $("#filtroSala");

    // Resetar filtros
    setorSelect.val(null).trigger("change.select2");
    salaSelect.val(null).trigger("change.select2");
    this.filtroSetorAtual = "";
    this.filtroSalaAtual = "";

    // 1. Evolução por Setor: Desabilita ambos os filtros
    if (tipoSelecionado === "evolucao-setor") {
        setorSelect.prop("disabled", true);
        salaSelect.prop("disabled", true);
    // 2. Evolução por Sala: Habilita Setor, desabilita Sala
    } else if (tipoSelecionado === "evolucao-sala") {
        setorSelect.prop("disabled", false);
        salaSelect.prop("disabled", true);
        
        // Atualiza o placeholder da Sala para indicar que está desabilitada
        $('#filtroSala').select2('destroy');
        $('#filtroSala').select2({
            placeholder: '-',
            allowClear: true
        });
    // 3. Evolução por Vínculo: Habilita ambos (Sala é habilitada após selecionar Setor)
    } else if (tipoSelecionado === "evolucao-vinculo") {
        setorSelect.prop("disabled", false);
        salaSelect.prop("disabled", true);
    }

    this.renderRelatorioCharts();
};

// Renderizar AMBOS os gráficos (evolução + rateio) com dados da API
App.prototype.renderRelatorioCharts = async function () {
    const canvasEvolucao = document.getElementById("relatorioChartEvolucao");
    const canvasRateio = document.getElementById("relatorioChartRateio");
    const msgEvolucao = document.getElementById("mensagemEvolucao");
    const msgRateio = document.getElementById("mensagemRateio");

    if (!canvasEvolucao || !canvasRateio) return;

    const tipo = this.tipoRelatorioAtual;
    const dataInicio = document.getElementById("dataInicio").value;
    const dataFim = document.getElementById("dataFim").value;

    // Função auxiliar para mostrar mensagem e ocultar canvas
    const mostrarMensagem = (canvas, mensagem, texto) => {
        canvas.style.display = "none";
        mensagem.style.display = "flex";
        mensagem.textContent = texto;
    };

    // Função auxiliar para mostrar canvas e ocultar mensagem
    const mostrarCanvas = (canvas, mensagem) => {
        canvas.style.display = "block";
        mensagem.style.display = "none";
    };

    // Função auxiliar para destruir gráficos de forma segura
    const destruirGraficos = () => {
        if (this.chartEvolucao) {
            this.chartEvolucao.destroy();
            this.chartEvolucao = null;
        }
        if (this.chartRateio) {
            this.chartRateio.destroy();
            this.chartRateio = null;
        }
    };

    // Verificar se um período foi selecionado
    if (!this.periodoSelecionado) {
        destruirGraficos();
        mostrarMensagem(canvasEvolucao, msgEvolucao, "Selecione um período para visualizar os dados.");
        mostrarMensagem(canvasRateio, msgRateio, "Selecione um período para visualizar os dados.");
        return;
    }

    if (!dataInicio || !dataFim) {
        return;
    }
    
    // Verificar se precisa selecionar Setor (para Sala)
    if (tipo === "evolucao-sala" && !this.filtroSetorAtual) {
        destruirGraficos();
        mostrarMensagem(canvasEvolucao, msgEvolucao, "Selecione um Setor para visualizar a evolução por Sala.");
        mostrarMensagem(canvasRateio, msgRateio, "Selecione um Setor para visualizar o rateio por Sala.");
        return;
    }
    
    // Verificar se precisa selecionar Sala (para Vínculo)
    if (tipo === "evolucao-vinculo" && !this.filtroSalaAtual) {
        destruirGraficos();
        mostrarMensagem(canvasEvolucao, msgEvolucao, "Selecione uma Sala para visualizar a evolução por Vínculo.");
        mostrarMensagem(canvasRateio, msgRateio, "Selecione uma Sala para visualizar o rateio por Vínculo.");
        return;
    }

    // Destruir gráficos anteriores SEMPRE antes de buscar novos dados
    destruirGraficos();

    // Buscar dados de AMBOS os endpoints em paralelo
    try {
        const [dadosEvolucao, dadosRateio] = await Promise.all([
            this.buscarDadosConsumptionEvolution(tipo, dataInicio, dataFim),
            this.buscarDadosConsumptionRatio(tipo, dataInicio, dataFim)
        ]);

        // Verificar se houve erro na API
        if (!dadosEvolucao || !dadosRateio) {
            console.error("Nenhum dado retornado da API");
            mostrarMensagem(canvasEvolucao, msgEvolucao, "Erro ao carregar dados. Tente novamente.");
            mostrarMensagem(canvasRateio, msgRateio, "Erro ao carregar dados. Tente novamente.");
            return;
        }

        // Verificar se há dados no gráfico de evolução
        const temDadosEvolucao = dadosEvolucao.data && 
                                 dadosEvolucao.data.datasets && 
                                 dadosEvolucao.data.datasets.length > 0 &&
                                 dadosEvolucao.data.datasets.some(ds => ds.data && ds.data.length > 0);

        // Verificar se há dados no gráfico de rateio
        const temDadosRateio = dadosRateio.data && 
                               dadosRateio.data.datasets && 
                               dadosRateio.data.datasets.length > 0 &&
                               dadosRateio.data.datasets.some(ds => ds.data && ds.data.length > 0 && ds.data.some(v => v > 0));

        // Atualizar títulos
        document.getElementById("chartTitleEvolucao").textContent = dadosEvolucao.titulo;
        document.getElementById("chartTitleRateio").textContent = dadosRateio.titulo;

        // Renderizar ou mostrar mensagem para EVOLUÇÃO
        if (temDadosEvolucao) {
            mostrarCanvas(canvasEvolucao, msgEvolucao);
            
            // Garantir que não há gráfico anterior neste canvas
            if (this.chartEvolucao) {
                this.chartEvolucao.destroy();
                this.chartEvolucao = null;
            }
            
            this.chartEvolucao = new Chart(canvasEvolucao, {
                type: "line",
                data: dadosEvolucao.data,
                options: dadosEvolucao.options
            });
        } else {
            mostrarMensagem(canvasEvolucao, msgEvolucao, "Não há dados disponíveis para o período selecionado.");
        }

        // Renderizar ou mostrar mensagem para RATEIO
        if (temDadosRateio) {
            mostrarCanvas(canvasRateio, msgRateio);
            
            // Garantir que não há gráfico anterior neste canvas
            if (this.chartRateio) {
                this.chartRateio.destroy();
                this.chartRateio = null;
            }
            
            this.chartRateio = new Chart(canvasRateio, {
                type: "doughnut",
                data: dadosRateio.data,
                options: dadosRateio.options
            });
        } else {
            mostrarMensagem(canvasRateio, msgRateio, "Não há dados disponíveis para o período selecionado.");
        }

    } catch (error) {
        console.error("Erro ao renderizar gráficos:", error);
        mostrarMensagem(canvasEvolucao, msgEvolucao, "Erro ao carregar dados. Tente novamente.");
        mostrarMensagem(canvasRateio, msgRateio, "Erro ao carregar dados. Tente novamente.");
    }
};

// Buscar dados do endpoint /api/consumption/evolution
App.prototype.buscarDadosConsumptionEvolution = async function (tipo, dataInicio, dataFim) {
    let resource = "";
    let departmentId = null;
    let roomId = null;
    let titulo = "";

    // Determinar o tipo de recurso e filtros
    if (tipo === "evolucao-setor") {
        resource = "DEPARTMENT";
        titulo = "Evolução de Consumo por Setor";
    } else if (tipo === "evolucao-sala") {
        resource = "ROOM";
        departmentId = this.filtroSetorAtual || null; // Passa departmentId se houver filtro de setor
        
        if (departmentId) {
            const setor = this.data.setores.find(s => s.id === departmentId);
            titulo = `Evolução de Consumo por Sala - Setor: ${setor?.name || ""}`;
        } else {
            titulo = "Evolução de Consumo por Sala (Todos os Setores)";
        }
    } else if (tipo === "evolucao-vinculo") {
        resource = "DEVICE_ROOM";
        roomId = this.filtroSalaAtual || null; // Passa roomId se houver filtro de sala
        
        if (roomId) {
            try {
                const salaResponse = await callApi(`/room/${roomId}`, { method: "GET" });
                titulo = `Evolução de Consumo por Vínculo - Sala: ${salaResponse.name || ""}`;
            } catch (error) {
                titulo = "Evolução de Consumo por Vínculo";
            }
        } else {
            // Não deve acontecer devido à guarda no renderRelatorioCharts
            titulo = "Selecione uma sala";
        }
    }
    

    // Construir URL da API
    const params = new URLSearchParams({
        resource: resource,
        start: dataInicio,
        end: dataFim
    });

    if (departmentId) {
        params.append("departmentId", departmentId);
    }

    if (roomId) {
        params.append("roomId", roomId);
    }

    try {
        const response = await callApi(`/consumption/evolution?${params.toString()}`, { method: "GET" });
        return this.processarDadosConsumptionEvolution(response, titulo);
    } catch (error) {
        console.error("Erro ao buscar dados de consumption/evolution:", error);
        return null;
    }
};

// Buscar dados do endpoint /api/consumption/ratio
App.prototype.buscarDadosConsumptionRatio = async function (tipo, dataInicio, dataFim) {
    let resource = "";
    let departmentId = null;
    let roomId = null;
    let titulo = "";

    // Determinar o tipo de recurso e filtros (mesma lógica do evolution)
    if (tipo === "evolucao-setor") {
        resource = "DEPARTMENT";
        titulo = "Rateio de Consumo por Setor";
    } else if (tipo === "evolucao-sala") {
        resource = "ROOM";
        departmentId = this.filtroSetorAtual || null; // Passa departmentId se houver filtro de setor
        
        if (departmentId) {
            const setor = this.data.setores.find(s => s.id === departmentId);
            titulo = `Rateio de Consumo por Sala - Setor: ${setor?.name || ""}`;
        } else {
            titulo = "Rateio de Consumo por Sala (Todos os Setores)";
        }
    } else if (tipo === "evolucao-vinculo") {
        resource = "DEVICE_ROOM";
        roomId = this.filtroSalaAtual || null; // Passa roomId se houver filtro de sala
        
        if (roomId) {
            try {
                const salaResponse = await callApi(`/room/${roomId}`, { method: "GET" });
                titulo = `Rateio de Consumo por Vínculo - Sala: ${salaResponse.name || ""}`;
            } catch (error) {
                titulo = "Rateio de Consumo por Vínculo";
            }
        } else {
            titulo = "Selecione uma sala";
        }
    }

    // Construir URL da API
    const params = new URLSearchParams({
        resource: resource,
        start: dataInicio,
        end: dataFim
    });

    if (departmentId) {
        params.append("departmentId", departmentId);
    }

    if (roomId) {
        params.append("roomId", roomId);
    }

    try {
        const response = await callApi(`/consumption/ratio?${params.toString()}`, { method: "GET" });
        return this.processarDadosConsumptionRatio(response, titulo);
    } catch (error) {
        console.error("Erro ao buscar dados de consumption/ratio:", error);
        return null;
    }
};

// Processar dados retornados da API /consumption/evolution
App.prototype.processarDadosConsumptionEvolution = function (apiResponse, titulo) {
    if (!apiResponse || !apiResponse.series || apiResponse.series.length === 0) {
        return { titulo, data: { labels: [], datasets: [] }, options: {}, tabelaDados: [] };
    }

    const labels = [];
    const datasets = [];
    const tabelaDados = [];
    const cores = ["#fb8500", "#023047", "#219ebc", "#8ecae6", "#ffb703", "#06d6a0", "#ef476f", "#06a77d", "#118ab2", "#073b4c"];

    // Extrair labels (timestamps)
    if (apiResponse.series.length > 0 && apiResponse.series[0].points) {
        apiResponse.series[0].points.forEach(point => {
            const timestamp = new Date(point.timestamp);
            let label = "";
            if (apiResponse.granularity === "HOURLY") {
                label = timestamp.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
            } else if (apiResponse.granularity === "DAILY") {
                label = timestamp.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
            } else if (apiResponse.granularity === "WEEKLY") {
                label = `Semana ${timestamp.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}`;
            } else if (apiResponse.granularity === "MONTHLY") {
                label = timestamp.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
            } else {
                label = timestamp.toLocaleDateString("pt-BR");
            }
            labels.push(label);
        });
    }

    // Processar cada série
    apiResponse.series.forEach((serie, index) => {
        const dados = serie.points.map(point => point.avgPotencia / 1000); // Converter para kW

        datasets.push({
            label: serie.name,
            data: dados,
            borderColor: cores[index % cores.length],
            backgroundColor: cores[index % cores.length] + "20",
            tension: 0.4,
            fill: true,
            borderWidth: 2
        });

        // Adicionar à tabela
        tabelaDados.push({
            nome: serie.name,
            total: (serie.statistics.totalConsumption / 1000).toFixed(2),
            media: (serie.statistics.avgConsumption / 1000).toFixed(2),
            max: (serie.statistics.maxConsumption / 1000).toFixed(2),
            min: (serie.statistics.minConsumption / 1000).toFixed(2),
            leituras: serie.statistics.totalReadings
        });
    });

    return {
        titulo,
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: "index",
                intersect: false
            },
            plugins: {
                legend: {
                    display: true,
                    position: "top"
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return context.dataset.label + ": " + context.parsed.y.toFixed(2) + " kW";
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Potência Média (kW)"
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: "Período"
                    }
                }
            }
        },
        tabelaDados
    };
};

// Processar dados retornados da API /consumption/ratio
App.prototype.processarDadosConsumptionRatio = function (apiResponse, titulo) {
    if (!apiResponse || !apiResponse.data || apiResponse.data.length === 0) {
        return { titulo, data: { labels: [], datasets: [] }, options: {} };
    }

    const labels = [];
    const data = [];
    const percentages = [];
    const cores = ["#fb8500", "#023047", "#219ebc", "#8ecae6", "#ffb703", "#06d6a0", "#ef476f", "#06a77d", "#118ab2", "#073b4c"];

    // Processar dados de rateio
    apiResponse.data.forEach(item => {
        labels.push(item.name);
        data.push(item.consumption / 1000); // Converter para kW
        percentages.push(item.percentage);
    });

    return {
        titulo,
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: cores.slice(0, labels.length),
                borderColor: "#ffffff",
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: "bottom"
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const percentage = percentages[context.dataIndex];
                            return context.label + ": " + context.parsed.toFixed(2) + " kW (" + percentage.toFixed(1) + "%)";
                        }
                    }
                }
            }
        },
        totalConsumption: apiResponse.totalConsumption / 1000 // kW
    };
};
// ===== ABA DE CONSUMO COM 3 GRÁFICOS =====

App.prototype.loadConsumo = async function () {
    const content = document.getElementById('page-content');
    
    // Buscar setores da API
    let setores = [];
    try {
        const setoresResponse = await callApi("/department?page=0&size=1000", { method: "GET" });
        setores = setoresResponse.content || [];
    } catch (error) {
        console.error("Erro ao carregar setores:", error);
    }

    content.innerHTML = `
        <div class="consumo-page">
            <h2>Monitoramento de Consumo Detalhado</h2>

            <!-- Filtros Hierárquicos (Setor > Sala > Dispositivo) -->
            <div class="filter-section">
                <h3 class="filter-title">Filtros Hierárquicos</h3>
                <div class="filter-row">
                    <div class="filter-group">
                        <label>Setor</label>
                        <select id="filtroSetorConsumo" onchange="app.updateFiltroSalaConsumo()">
                            <option value="">Todos os Setores</option>
                            ${setores.map(s => `
                                <option value="${s.id}">${s.name}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Sala</label>
                        <select id="filtroSalaConsumo" disabled onchange="app.updateFiltroDispositivoConsumo()">
                            <option value="">Selecione uma sala</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Dispositivo (Vínculo)</label>
                        <select id="filtroDispositivo" disabled onchange="app.updateConsumoCharts()">
                            <option value="">Selecione um dispositivo</option>
                        </select>
                    </div>
                    <div class="filter-group" style="display: flex; align-items: flex-end;">
                        <button class="btn btn-outline" onclick="app.limparFiltrosConsumo()">
                            <i class="fas fa-times"></i> Limpar Filtros
                        </button>
                    </div>
                </div>
            </div>

            <!-- Seletor de Período -->
            <div class="filter-section">
                <h3 class="filter-title">Período de Análise</h3>
                <div class="filter-row" style="gap: 10px; margin-bottom: 10px;">
                    <button class="btn btn-outline" onclick="app.aplicarPeriodoConsumoHoje()">
                        <i class="fas fa-calendar-day"></i> Hoje
                    </button>
                    <button class="btn btn-outline" onclick="app.aplicarPeriodoConsumoSemana()">
                        <i class="fas fa-calendar-week"></i> 7 últimos dias
                    </button>
                    <button class="btn btn-outline" onclick="app.aplicarPeriodoConsumoMes()">
                        <i class="fas fa-calendar-alt"></i> 30 últimos dias
                    </button>
                </div>
                <div class="filter-row">
                    <div class="filter-group" style="flex: 1;">
                        <label>Período Personalizado</label>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <input type="datetime-local" id="dataInicioConsumo" class="form-control" style="flex: 1;">
                            <span>até</span>
                            <input type="datetime-local" id="dataFimConsumo" class="form-control" style="flex: 1;">
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
                    <div class="chart-body" style="height: 300px; position: relative;">
                        <canvas id="tensaoChart"></canvas>
                        <div id="mensagemTensao" class="chart-message" style="display: none;">
                            Selecione um dispositivo e período para visualizar os dados.
                        </div>
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
                    <div class="chart-body" style="height: 300px; position: relative;">
                        <canvas id="correnteChart"></canvas>
                        <div id="mensagemCorrente" class="chart-message" style="display: none;">
                            Selecione um dispositivo e período para visualizar os dados.
                        </div>
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
                    <div class="chart-body" style="height: 300px; position: relative;">
                        <canvas id="potenciaChart"></canvas>
                        <div id="mensagemPotencia" class="chart-message" style="display: none;">
                            Selecione um dispositivo e período para visualizar os dados.
                        </div>
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
        </div>
    `;

    // Inicializar estado
    this.filtroSetorConsumo = '';
    this.filtroSalaConsumo = '';
    this.dispositivoFiltrado = '';
    this.periodoConsumoSelecionado = false;

    // Mostrar mensagens iniciais
    this.mostrarMensagemConsumo('tensaoChart', 'mensagemTensao', 'Selecione um dispositivo e período para visualizar os dados.');
    this.mostrarMensagemConsumo('correnteChart', 'mensagemCorrente', 'Selecione um dispositivo e período para visualizar os dados.');
    this.mostrarMensagemConsumo('potenciaChart', 'mensagemPotencia', 'Selecione um dispositivo e período para visualizar os dados.');
};

// Função auxiliar para formatar data para datetime-local
App.prototype.formatDateTimeLocal = function(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Aplicar período pré-definidos
App.prototype.aplicarPeriodoConsumoHoje = function () {
    const agora = new Date();
    const ontem = new Date(agora);
    ontem.setDate(ontem.getDate() - 1);
    
    document.getElementById("dataInicioConsumo").value = this.formatDateTimeLocal(ontem);
    document.getElementById("dataFimConsumo").value = this.formatDateTimeLocal(agora);
    
    this.periodoConsumoSelecionado = true;
    this.renderConsumoCharts();
};

App.prototype.aplicarPeriodoConsumoSemana = function () {
    const agora = new Date();
    const seteDiasAtras = new Date(agora);
    seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
    
    document.getElementById("dataInicioConsumo").value = this.formatDateTimeLocal(seteDiasAtras);
    document.getElementById("dataFimConsumo").value = this.formatDateTimeLocal(agora);
    
    this.periodoConsumoSelecionado = true;
    this.renderConsumoCharts();
};

App.prototype.aplicarPeriodoConsumoMes = function () {
    const agora = new Date();
    const trintaDiasAtras = new Date(agora);
    trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);
    
    document.getElementById("dataInicioConsumo").value = this.formatDateTimeLocal(trintaDiasAtras);
    document.getElementById("dataFimConsumo").value = this.formatDateTimeLocal(agora);
    
    this.periodoConsumoSelecionado = true;
    this.renderConsumoCharts();
};

App.prototype.aplicarPeriodoConsumoPersonalizado = function () {
    const dataInicio = document.getElementById("dataInicioConsumo").value;
    const dataFim = document.getElementById("dataFimConsumo").value;

    if (!dataInicio || !dataFim) {
        alert("Por favor, selecione ambas as datas");
        return;
    }

    if (new Date(dataInicio) > new Date(dataFim)) {
        alert("A data inicial deve ser anterior à data final");
        return;
    }

    this.periodoConsumoSelecionado = true;
    this.renderConsumoCharts();
};

// Atualizar filtro de Sala baseado no Setor selecionado
App.prototype.updateFiltroSalaConsumo = async function () {
    const setorId = document.getElementById('filtroSetorConsumo').value;
    const salaSelect = document.getElementById('filtroSalaConsumo');
    const dispositivoSelect = document.getElementById('filtroDispositivo');

    this.filtroSetorConsumo = setorId;

    if (!setorId) {
        salaSelect.innerHTML = '<option value="">Selecione uma sala</option>';
        salaSelect.disabled = true;
        dispositivoSelect.innerHTML = '<option value="">Selecione um dispositivo</option>';
        dispositivoSelect.disabled = true;
        this.filtroSalaConsumo = '';
        this.dispositivoFiltrado = '';
        return;
    }

    try {
        const salasResponse = await callApi(`/department/${setorId}/room?name=&page=0&size=1000`, { method: "GET" });
        const salas = salasResponse.content || [];

        salaSelect.innerHTML = `
            <option value="">Todas as Salas</option>
            ${salas.map(sala => `
                <option value="${sala.id}">${sala.name}</option>
            `).join('')}
        `;
        salaSelect.disabled = false;

        dispositivoSelect.innerHTML = '<option value="">Selecione um dispositivo</option>';
        dispositivoSelect.disabled = true;
        this.filtroSalaConsumo = '';
        this.dispositivoFiltrado = '';

    } catch (error) {
        console.error("Erro ao carregar salas:", error);
        salaSelect.innerHTML = '<option value="">Erro ao carregar salas</option>';
        salaSelect.disabled = true;
    }
};

// Atualizar filtro de Dispositivo baseado na Sala selecionada
App.prototype.updateFiltroDispositivoConsumo = async function () {
    const salaId = document.getElementById('filtroSalaConsumo').value;
    const dispositivoSelect = document.getElementById('filtroDispositivo');

    this.filtroSalaConsumo = salaId;

    if (!salaId) {
        dispositivoSelect.innerHTML = '<option value="">Selecione um dispositivo</option>';
        dispositivoSelect.disabled = true;
        this.dispositivoFiltrado = '';
        return;
    }

    try {
        const vinculosResponse = await callApi(`/device-room?roomId=${salaId}&page=0&size=1000`, { method: "GET" });
        const vinculos = vinculosResponse.content || [];

        dispositivoSelect.innerHTML = `
            <option value="">Selecione um dispositivo</option>
            ${vinculos.map(vinculo => `
                <option value="${vinculo.id}">${vinculo.alias}</option>
            `).join('')}
        `;
        dispositivoSelect.disabled = false;

        this.dispositivoFiltrado = '';
    } catch (error) {
        console.error("Erro ao carregar dispositivos:", error);
        dispositivoSelect.innerHTML = '<option value="">Erro ao carregar dispositivos</option>';
        dispositivoSelect.disabled = true;
    }
};

// Limpar todos os filtros hierárquicos
App.prototype.limparFiltrosConsumo = function () {
    document.getElementById('filtroSetorConsumo').value = '';
    document.getElementById('filtroSalaConsumo').innerHTML = '<option value="">Selecione uma sala</option>';
    document.getElementById('filtroSalaConsumo').disabled = true;
    document.getElementById('filtroDispositivo').innerHTML = '<option value="">Selecione um dispositivo</option>';
    document.getElementById('filtroDispositivo').disabled = true;

    this.filtroSetorConsumo = '';
    this.filtroSalaConsumo = '';
    this.dispositivoFiltrado = '';

    this.renderConsumoCharts();
};

// Atualizar gráficos quando o dispositivo é selecionado
App.prototype.updateConsumoCharts = function () {
    this.dispositivoFiltrado = document.getElementById('filtroDispositivo').value;
    this.renderConsumoCharts();
};

// Função auxiliar para mostrar mensagem
App.prototype.mostrarMensagemConsumo = function (canvasId, mensagemId, texto) {
    const canvas = document.getElementById(canvasId);
    const mensagem = document.getElementById(mensagemId);
    
    if (canvas && mensagem) {
        canvas.style.display = "none";
        mensagem.style.display = "flex";
        mensagem.textContent = texto;
    }
};

// Função auxiliar para mostrar canvas
App.prototype.mostrarCanvasConsumo = function (canvasId, mensagemId) {
    const canvas = document.getElementById(canvasId);
    const mensagem = document.getElementById(mensagemId);
    
    if (canvas && mensagem) {
        canvas.style.display = "block";
        mensagem.style.display = "none";
    }
};

// Renderizar gráficos
App.prototype.renderConsumoCharts = async function () {
    const canvasTensao = document.getElementById('tensaoChart');
    const canvasCorrente = document.getElementById('correnteChart');
    const canvasPotencia = document.getElementById('potenciaChart');

    if (!canvasTensao || !canvasCorrente || !canvasPotencia) return;

    const dataInicio = document.getElementById('dataInicioConsumo').value;
    const dataFim = document.getElementById('dataFimConsumo').value;
    const dispositivoId = this.dispositivoFiltrado;

    // Destruir gráficos anteriores
    if (this.chartTensao) {
        this.chartTensao.destroy();
        this.chartTensao = null;
    }
    if (this.chartCorrente) {
        this.chartCorrente.destroy();
        this.chartCorrente = null;
    }
    if (this.chartPotencia) {
        this.chartPotencia.destroy();
        this.chartPotencia = null;
    }

    // Verificar se período foi selecionado
    if (!this.periodoConsumoSelecionado || !dataInicio || !dataFim) {
        this.mostrarMensagemConsumo('tensaoChart', 'mensagemTensao', 'Selecione um período para visualizar os dados.');
        this.mostrarMensagemConsumo('correnteChart', 'mensagemCorrente', 'Selecione um período para visualizar os dados.');
        this.mostrarMensagemConsumo('potenciaChart', 'mensagemPotencia', 'Selecione um período para visualizar os dados.');
        return;
    }

    // Verificar se dispositivo foi selecionado
    if (!dispositivoId) {
        this.mostrarMensagemConsumo('tensaoChart', 'mensagemTensao', 'Selecione um dispositivo para visualizar os dados.');
        this.mostrarMensagemConsumo('correnteChart', 'mensagemCorrente', 'Selecione um dispositivo para visualizar os dados.');
        this.mostrarMensagemConsumo('potenciaChart', 'mensagemPotencia', 'Selecione um dispositivo para visualizar os dados.');
        return;
    }

    try {
        // Buscar dados da API
        const params = new URLSearchParams({
            deviceRoomId: dispositivoId,
            start: dataInicio,
            end: dataFim
        });

        const response = await callApi(`/consumption/device/detail?${params.toString()}`, { method: "GET" });

        if (!response) {
            throw new Error("Nenhum dado retornado da API");
        }

        // Processar dados de Tensão
        if (response.voltage && response.voltage.points && response.voltage.points.length > 0) {
            this.mostrarCanvasConsumo('tensaoChart', 'mensagemTensao');
            this.renderGraficoTensao(response.voltage, response.granularity);
        } else {
            this.mostrarMensagemConsumo('tensaoChart', 'mensagemTensao', 'Não há dados de tensão disponíveis para o período selecionado.');
        }

        // Processar dados de Corrente
        if (response.current && response.current.points && response.current.points.length > 0) {
            this.mostrarCanvasConsumo('correnteChart', 'mensagemCorrente');
            this.renderGraficoCorrente(response.current, response.granularity);
        } else {
            this.mostrarMensagemConsumo('correnteChart', 'mensagemCorrente', 'Não há dados de corrente disponíveis para o período selecionado.');
        }

        // Processar dados de Potência
        if (response.power && response.power.points && response.power.points.length > 0) {
            this.mostrarCanvasConsumo('potenciaChart', 'mensagemPotencia');
            this.renderGraficoPotencia(response.power, response.granularity);
        } else {
            this.mostrarMensagemConsumo('potenciaChart', 'mensagemPotencia', 'Não há dados de potência disponíveis para o período selecionado.');
        }

    } catch (error) {
        console.error("Erro ao renderizar gráficos de consumo:", error);
        this.mostrarMensagemConsumo('tensaoChart', 'mensagemTensao', 'Erro ao carregar dados. Tente novamente.');
        this.mostrarMensagemConsumo('correnteChart', 'mensagemCorrente', 'Erro ao carregar dados. Tente novamente.');
        this.mostrarMensagemConsumo('potenciaChart', 'mensagemPotencia', 'Erro ao carregar dados. Tente novamente.');
    }
};

// Renderizar gráfico de Tensão
App.prototype.renderGraficoTensao = function (voltageData, granularity) {
    const canvas = document.getElementById('tensaoChart');
    const labels = this.formatarLabelsConsumo(voltageData.points, granularity);
    const dados = voltageData.points.map(p => p.avg);
    const dadosMax = voltageData.points.map(p => p.max);
    const dadosMin = voltageData.points.map(p => p.min);

    // Atualizar estatísticas
    const stats = voltageData.statistics;
    document.getElementById('tensaoMedia').textContent = stats.average.toFixed(2) + ' V';
    document.getElementById('tensaoMin').textContent = stats.minimum.toFixed(2) + ' V';
    document.getElementById('tensaoMax').textContent = stats.maximum.toFixed(2) + ' V';

    this.chartTensao = new Chart(canvas, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Tensão Média',
                    data: dados,
                    borderColor: '#023047',
                    backgroundColor: 'rgba(2, 48, 71, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Máximo',
                    data: dadosMax,
                    borderColor: '#ef476f',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0
                },
                {
                    label: 'Mínimo',
                    data: dadosMin,
                    borderColor: '#06d6a0',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0
                }
            ]
        },
        options: this.getChartOptions('Tensão (V)', 'V')
    });
};

// Renderizar gráfico de Corrente
App.prototype.renderGraficoCorrente = function (currentData, granularity) {
    const canvas = document.getElementById('correnteChart');
    const labels = this.formatarLabelsConsumo(currentData.points, granularity);
    const dados = currentData.points.map(p => p.avg);
    const dadosMax = currentData.points.map(p => p.max);
    const dadosMin = currentData.points.map(p => p.min);

    // Atualizar estatísticas
    const stats = currentData.statistics;
    document.getElementById('correnteMedia').textContent = stats.average.toFixed(2) + ' A';
    document.getElementById('correnteMin').textContent = stats.minimum.toFixed(2) + ' A';
    document.getElementById('correnteMax').textContent = stats.maximum.toFixed(2) + ' A';

    this.chartCorrente = new Chart(canvas, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Corrente Média',
                    data: dados,
                    borderColor: '#fb8500',
                    backgroundColor: 'rgba(251, 133, 0, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Máximo',
                    data: dadosMax,
                    borderColor: '#ef476f',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0
                },
                {
                    label: 'Mínimo',
                    data: dadosMin,
                    borderColor: '#06d6a0',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0
                }
            ]
        },
        options: this.getChartOptions('Corrente (A)', 'A')
    });
};

// Renderizar gráfico de Potência
App.prototype.renderGraficoPotencia = function (powerData, granularity) {
    const canvas = document.getElementById('potenciaChart');
    const labels = this.formatarLabelsConsumo(powerData.points, granularity);
    const dados = powerData.points.map(p => p.avg / 1000); // Converter para kW
    const dadosMax = powerData.points.map(p => p.max / 1000);
    const dadosMin = powerData.points.map(p => p.min / 1000);

    // Atualizar estatísticas
    const stats = powerData.statistics;
    document.getElementById('potenciaMedia').textContent = (stats.average / 1000).toFixed(2) + ' kW';
    document.getElementById('potenciaMin').textContent = (stats.minimum / 1000).toFixed(2) + ' kW';
    document.getElementById('potenciaMax').textContent = (stats.maximum / 1000).toFixed(2) + ' kW';

    this.chartPotencia = new Chart(canvas, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Potência Média',
                    data: dados,
                    borderColor: '#ffb703',
                    backgroundColor: 'rgba(255, 183, 3, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Máximo',
                    data: dadosMax,
                    borderColor: '#ef476f',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0
                },
                {
                    label: 'Mínimo',
                    data: dadosMin,
                    borderColor: '#06d6a0',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0
                }
            ]
        },
        options: this.getChartOptions('Potência Ativa (kW)', 'kW')
    });
};

// Formatar labels baseado na granularidade
App.prototype.formatarLabelsConsumo = function (points, granularity) {
    return points.map(point => {
        const timestamp = new Date(point.timestamp);
        
        if (granularity === "HOURLY") {
            return timestamp.toLocaleString("pt-BR", { 
                day: "2-digit", 
                month: "2-digit", 
                hour: "2-digit", 
                minute: "2-digit" 
            });
        } else if (granularity === "DAILY") {
            return timestamp.toLocaleDateString("pt-BR", { 
                day: "2-digit", 
                month: "2-digit", 
                year: "numeric" 
            });
        } else if (granularity === "WEEKLY") {
            return `Semana ${timestamp.toLocaleDateString("pt-BR", { 
                day: "2-digit", 
                month: "2-digit" 
            })}`;
        } else if (granularity === "MONTHLY") {
            return timestamp.toLocaleDateString("pt-BR", { 
                month: "short", 
                year: "numeric" 
            });
        } else {
            return timestamp.toLocaleDateString("pt-BR");
        }
    });
};

// Obter opções comuns dos gráficos
App.prototype.getChartOptions = function (yAxisLabel, unit) {
    return {
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
                    label: function (context) {
                        return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + ' ' + unit;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                title: {
                    display: true,
                    text: yAxisLabel
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Período'
                }
            }
        }
    };
};