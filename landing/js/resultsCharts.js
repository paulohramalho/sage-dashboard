// ========== GRÁFICOS DA SEÇÃO DE RESULTADOS ==========

const RESULTS_COLORS = {
    before: '#dc3545',
    after: '#10b981',
    primary: '#ffb703',
    secondary: '#001824',
    sectors: ['#ffb703', '#e6a400', '#ff8500', '#0077be', '#10b981']
};

document.addEventListener('DOMContentLoaded', function () {
    // Verificar se Chart.js está carregado
    if (typeof Chart === 'undefined') {
        console.error('Chart.js não foi carregado');
        return;
    }

    // Criar os três gráficos
    createEvolutionChart();
    createSavingsChart();
    createReductionChart();

    console.log('Gráficos de resultados criados com sucesso!');
});

// ========== GRÁFICO 1: EVOLUÇÃO DO CUSTO MENSAL (LINHAS) ==========
function createEvolutionChart() {
    const ctx = document.getElementById('evolutionChart');
    if (!ctx) return;

    // Dados realistas: empresa começou com custo maior e reduziu gradualmente
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    const beforeSage = [15800, 16200, 15900, 16500, 16100, 16300]; // Custos antes (mais altos e instáveis)
    const afterSage = [15800, 14900, 14200, 13600, 13100, 12950];  // Custos depois (redução gradual de ~18%)

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Antes do SAGE',
                data: beforeSage,
                borderColor: RESULTS_COLORS.before,
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: RESULTS_COLORS.before,
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }, {
                label: 'Depois do SAGE',
                data: afterSage,
                borderColor: RESULTS_COLORS.after,
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: RESULTS_COLORS.after,
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 13,
                            weight: '600'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 24, 36, 0.95)',
                    titleColor: '#ffb703',
                    bodyColor: '#ffffff',
                    borderColor: '#ffb703',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12,
                    callbacks: {
                        label: function (context) {
                            return context.dataset.label + ': R$ ' + context.parsed.y.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
                        },
                        afterLabel: function (context) {
                            if (context.datasetIndex === 1 && context.dataIndex > 0) {
                                const reduction = beforeSage[context.dataIndex] - afterSage[context.dataIndex];
                                const percentage = ((reduction / beforeSage[context.dataIndex]) * 100).toFixed(1);
                                return `Economia: R$ ${reduction.toFixed(2)} (${percentage}%)`;
                            }
                            return '';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 12000,
                    max: 17000,
                    ticks: {
                        callback: function (value) {
                            return 'R$ ' + value.toLocaleString('pt-BR');
                        },
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        color: 'rgba(0, 24, 36, 0.08)'
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false
            }
        }
    });
}

// ========== GRÁFICO 2: ECONOMIA POR SETOR (BARRAS) ==========
function createSavingsChart() {
    const ctx = document.getElementById('savingsChart');
    if (!ctx) return;

    // Economia mensal por setor (valores realistas)
    const sectors = ['Produção', 'Administrativo', 'TI', 'Vendas', 'Logística'];
    const savings = [1245, 687, 423, 312, 180]; // Total: R$ 2.847/mês

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sectors,
            datasets: [{
                label: 'Economia Mensal (R$)',
                data: savings,
                backgroundColor: RESULTS_COLORS.sectors,
                borderColor: RESULTS_COLORS.sectors.map(color => color),
                borderWidth: 2,
                borderRadius: 10,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 24, 36, 0.95)',
                    titleColor: '#ffb703',
                    bodyColor: '#ffffff',
                    borderColor: '#ffb703',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12,
                    callbacks: {
                        label: function (context) {
                            const total = savings.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed.y / total) * 100).toFixed(1);
                            return [
                                `Economia: R$ ${context.parsed.y.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                                `${percentage}% do total`
                            ];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return 'R$ ' + value.toLocaleString('pt-BR');
                        },
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        color: 'rgba(0, 24, 36, 0.08)'
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 11,
                            weight: '500'
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// ========== GRÁFICO 3: ORIGEM DA ECONOMIA (ROSCA) ==========
function createReductionChart() {
    const ctx = document.getElementById('reductionChart');
    if (!ctx) return;

    // Distribuição das fontes de economia (%)
    const sources = [
        'Ar Condicionado',
        'Iluminação',
        'Equipamentos',
        'Standby',
        'Outros'
    ];
    const percentages = [42, 28, 18, 8, 4]; // Total: 100%

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: sources,
            datasets: [{
                data: percentages,
                backgroundColor: [
                    '#ffb703',
                    '#10b981',
                    '#3b82f6',
                    '#ff8500',
                    '#6c757d'
                ],
                borderColor: '#ffffff',
                borderWidth: 3,
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: {
                            size: 12,
                            weight: '500'
                        },
                        generateLabels: function (chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    const value = data.datasets[0].data[i];
                                    return {
                                        text: `${label}: ${value}%`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 24, 36, 0.95)',
                    titleColor: '#ffb703',
                    bodyColor: '#ffffff',
                    borderColor: '#ffb703',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12,
                    callbacks: {
                        label: function (context) {
                            return [
                                `${context.label}`,
                                `${context.parsed}% da economia total`,
                                `Principal fonte de redução`
                            ];
                        }
                    }
                }
            },
            cutout: '65%'
        }
    });
}