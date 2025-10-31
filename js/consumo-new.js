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
