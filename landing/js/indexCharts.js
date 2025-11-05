// ========== CONFIGURAÇÕES GLOBAIS ==========
const CHART_COLORS = {
    primary: '#ffb703',
    secondary: '#001824',
    tertiary: '#e6a400',
    quaternary: '#2c3e50',
    quinary: '#34495e',
    senary: '#f39c12',
    gradient1: 'rgba(255, 183, 3, 0.6)',
    gradient2: 'rgba(0, 24, 36, 0.6)',
    success: '#10b981',
    info: '#3b82f6'
};

// ========== DADOS DOS GRÁFICOS ==========
let chartInstances = {};

// Dados para Distribuição de Custos por Dispositivo
let deviceData = {
    labels: ['Ar Condicionado', 'Iluminação LED', 'Computadores', 'Servidores', 'Impressoras', 'Refrigeração'],
    costs: [],
    colors: [CHART_COLORS.secondary, CHART_COLORS.primary, CHART_COLORS.tertiary, CHART_COLORS.quaternary, CHART_COLORS.quinary, CHART_COLORS.senary]
};

// Dados para Consumo Mensal por Setor
let sectorData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: {
        'Administrativo': [],
        'Produção': [],
        'TI': [],
        'Vendas': [],
        'RH': []
    }
};

// Dados para Economia Alcançada
let economyData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    values: []
};

// Dados para Evolução do Consumo Anual
let annualData = {
    labels: ['2020', '2021', '2022', '2023', '2024'],
    consumption: [],
    projection: []
};

// ========== TOOLTIPS EXPLICATIVOS ==========
const chartTooltips = {
    'consumoSetorChart': {
        bar: 'Gráfico de Barras: Ideal para comparar valores entre diferentes setores de forma clara e direta.',
        line: 'Gráfico de Linhas: Perfeito para visualizar tendências de consumo ao longo dos meses.',
        mixed: 'Gráfico Misto: Combina barras e linhas para análise completa de dados e tendências.'
    },
    'economiaChart': {
        line: 'Gráfico de Linhas: Mostra a evolução da economia energética ao longo do tempo.',
        area: 'Gráfico de Área: Destaca o progresso acumulado da economia energética.',
        bar: 'Gráfico de Barras: Compara a economia alcançada mês a mês de forma visual.'
    },
    'doughnutChart': {
        doughnut: 'Gráfico de Rosca: Exibe proporções de custos por dispositivo com destaque visual.',
        bar: 'Gráfico de Barras: Lista custos por dispositivo de forma ordenada e comparativa.',
        bubble: 'Gráfico de Bolhas: Relaciona custo, consumo e eficiência em uma única visualização.'
    },
    'evolucaoConsumoChart': {
        line: 'Gráfico de Linhas: Visualiza a evolução temporal do consumo energético.',
        area: 'Gráfico de Área: Enfatiza o volume total de consumo ao longo dos anos.',
        mixed: 'Gráfico Misto: Compara consumo real vs. projetado com diferentes tipos de visualização.'
    }
};

// ========== FUNÇÕES DE GERAÇÃO DE DADOS ==========
function generateRandomData() {
    // Dados de dispositivos
    deviceData.costs = deviceData.labels.map(() => Math.floor(Math.random() * 1000) + 100);
    
    // Dados de setores
    Object.keys(sectorData.datasets).forEach(sector => {
        sectorData.datasets[sector] = sectorData.labels.map(() => Math.floor(Math.random() * 500) + 100);
    });
    
    // Dados de economia
    economyData.values = economyData.labels.map((_, index) => Math.floor(Math.random() * 15) + 5 + (index * 2));
    
    // Dados anuais
    annualData.consumption = annualData.labels.map(() => Math.floor(Math.random() * 10000) + 5000);
    annualData.projection = annualData.labels.map(() => Math.floor(Math.random() * 12000) + 6000);
    
    updateAllCharts();
}

// ========== FUNÇÕES DE CRIAÇÃO DE GRÁFICOS ==========

// 1. CONSUMO MENSAL POR SETOR
function createConsumoSetorChart(type = 'bar') {
    const ctx = document.getElementById('consumoSetorChart').getContext('2d');
    
    if (chartInstances.consumoSetor) {
        chartInstances.consumoSetor.destroy();
    }
    
    let config = {
        data: {
            labels: sectorData.labels,
            datasets: Object.keys(sectorData.datasets).map((sector, index) => ({
                label: sector,
                data: sectorData.datasets[sector],
                backgroundColor: type === 'line' ? 'transparent' : Object.values(CHART_COLORS)[index],
                borderColor: Object.values(CHART_COLORS)[index],
                borderWidth: 2,
                fill: type === 'line' ? false : true
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y} kWh`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Consumo (kWh)' }
                }
            }
        }
    };
    
    if (type === 'mixed') {
        config.type = 'bar';
        config.data.datasets[0].type = 'line';
        config.data.datasets[1].type = 'line';
    } else {
        config.type = type;
    }
    
    chartInstances.consumoSetor = new Chart(ctx, config);
}

// 2. ECONOMIA ALCANÇADA
function createEconomiaChart(type = 'line') {
    const ctx = document.getElementById('economiaChart').getContext('2d');
    
    if (chartInstances.economia) {
        chartInstances.economia.destroy();
    }
    
    let config = {
        data: {
            labels: economyData.labels,
            datasets: [{
                label: 'Economia (%)',
                data: economyData.values,
                backgroundColor: type === 'area' ? CHART_COLORS.gradient1 : (type === 'bar' ? CHART_COLORS.success : 'transparent'),
                borderColor: CHART_COLORS.success,
                borderWidth: 3,
                fill: type === 'area' ? true : false,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Economia: ${context.parsed.y}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Economia (%)' }
                }
            }
        }
    };
    
    // Definir o tipo após a configuração
    if (type === 'area') {
        config.type = 'line';
    } else {
        config.type = type;
    }
    
    chartInstances.economia = new Chart(ctx, config);
}

// 3. DISTRIBUIÇÃO DE CUSTOS POR DISPOSITIVO
function createCustosDispositivoChart(type = 'doughnut') {
    const ctx = document.getElementById('doughnutChart').getContext('2d');
    
    if (chartInstances.custos) {
        chartInstances.custos.destroy();
    }
    
    let config = {
        data: {
            labels: deviceData.labels,
            datasets: [{
                data: deviceData.costs,
                backgroundColor: deviceData.colors,
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: R$ ${context.parsed.toLocaleString('pt-BR')} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    };
    
    if (type === 'bubble') {
        config.type = 'bubble';
        config.data.datasets = [{
            label: 'Dispositivos',
            data: deviceData.labels.map((label, index) => ({
                x: Math.random() * 100 + 10,
                y: deviceData.costs[index],
                r: Math.sqrt(deviceData.costs[index]) / 5
            })),
            backgroundColor: deviceData.colors
        }];
        config.options.scales = {
            x: { title: { display: true, text: 'Eficiência (%)' }},
            y: { title: { display: true, text: 'Custo (R$)' }}
        };
    } else if (type === 'bar') {
        config.type = 'bar';
        config.options.scales = {
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Custo (R$)' }
            }
        };
    } else {
        config.type = 'doughnut';
        config.data.datasets[0].cutout = '60%';
    }
    
    chartInstances.custos = new Chart(ctx, config);
}

// 4. EVOLUÇÃO DO CONSUMO ANUAL
function createEvolucaoConsumoChart(type = 'line') {
    const ctx = document.getElementById('evolucaoConsumoChart').getContext('2d');
    
    if (chartInstances.evolucao) {
        chartInstances.evolucao.destroy();
    }
    
    let config = {
        data: {
            labels: annualData.labels,
            datasets: [{
                label: 'Consumo Real',
                data: annualData.consumption,
                backgroundColor: type === 'area' ? CHART_COLORS.gradient2 : (type === 'bar' ? CHART_COLORS.primary : 'transparent'),
                borderColor: CHART_COLORS.primary,
                borderWidth: 3,
                fill: type === 'area' ? true : false,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y.toLocaleString('pt-BR')} kWh`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Consumo (kWh)' }
                }
            }
        }
    };
    
    if (type === 'mixed') {
        config.type = 'line';
        config.data.datasets.push({
            label: 'Projeção',
            data: annualData.projection,
            backgroundColor: 'transparent',
            borderColor: CHART_COLORS.info,
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            tension: 0.4,
            type: 'line'
        });
        config.data.datasets[0].type = 'bar';
        config.data.datasets[0].backgroundColor = CHART_COLORS.primary;
    } else if (type === 'area') {
        config.type = 'line';
    } else {
        config.type = type;
    }
    
    chartInstances.evolucao = new Chart(ctx, config);
}

// ========== FUNÇÕES DE CONTROLE ==========
function updateAllCharts() {
    // Recrear todos os gráficos com novos dados
    const activeButtons = document.querySelectorAll('.chart-type-btn.active');
    
    activeButtons.forEach(btn => {
        const chartId = btn.closest('.chart-card').querySelector('canvas').id;
        const type = btn.dataset.type;
        
        switch(chartId) {
            case 'consumoSetorChart':
                createConsumoSetorChart(type);
                break;
            case 'economiaChart':
                createEconomiaChart(type);
                break;
            case 'doughnutChart':
                createCustosDispositivoChart(type);
                break;
            case 'evolucaoConsumoChart':
                createEvolucaoConsumoChart(type);
                break;
        }
    });
}

function changeChartType(chartId, type) {
    switch(chartId) {
        case 'consumoSetorChart':
            createConsumoSetorChart(type);
            break;
        case 'economiaChart':
            createEconomiaChart(type);
            break;
        case 'doughnutChart':
            createCustosDispositivoChart(type);
            break;
        case 'evolucaoConsumoChart':
            createEvolucaoConsumoChart(type);
            break;
    }
    
    // Atualizar botões ativos
    updateActiveButton(chartId, type);
}

function updateActiveButton(chartId, activeType) {
    const container = document.querySelector(`#${chartId}`).closest('.chart-card');
    const buttons = container.querySelectorAll('.chart-type-btn');
    
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.type === activeType) {
            btn.classList.add('active');
        }
    });
}

// ========== TOOLTIPS EXPLICATIVOS ==========
function createTooltip(chartId, type) {
    // Remover tooltip existente
    const existingTooltip = document.querySelector('.chart-tooltip');
    if (existingTooltip) {
        existingTooltip.remove();
    }
    
    // Criar novo tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'chart-tooltip visible';
    tooltip.textContent = chartTooltips[chartId][type];
    
    // Adicionar ao body para ficar por cima de tudo
    document.body.appendChild(tooltip);
}

function hideTooltip(chartId) {
    const tooltip = document.querySelector('.chart-tooltip');
    if (tooltip) {
        tooltip.classList.remove('visible');
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        }, 300);
    }
}

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', function() {
    // Gerar dados iniciais
    generateRandomData();
    
    // Criar gráficos iniciais
    createConsumoSetorChart('bar');
    createEconomiaChart('line');
    createCustosDispositivoChart('doughnut');
    createEvolucaoConsumoChart('line');
    
    // Adicionar event listeners para tooltips
    document.querySelectorAll('canvas').forEach(canvas => {
        canvas.addEventListener('mouseenter', () => {
            const chartId = canvas.id;
            const container = canvas.closest('.chart-card');
            const activeBtn = container.querySelector('.chart-type-btn.active');
            if (activeBtn) {
                createTooltip(chartId, activeBtn.dataset.type);
            }
        });
        
        canvas.addEventListener('mouseleave', () => {
            hideTooltip(canvas.id);
        });
    });
    
    console.log('Sistema de gráficos SAGE iniciado com sucesso!');
});

// ========== EXPORTAÇÕES GLOBAIS ==========
window.generateRandomData = generateRandomData;
window.changeChartType = changeChartType;