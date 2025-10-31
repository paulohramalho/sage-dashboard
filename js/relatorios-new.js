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
