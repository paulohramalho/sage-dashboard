// Configuração de cores do tema
const themeColors = {
    primary: '#ffb703',
    primaryBg: '#ffd966',
    secondary: '#001824',
    bg: '#222',
    text: '#f7f7f7',
    success: '#10b981',
    info: '#3b82f6'
};

// Paleta de cores para os gráficos
const chartColors = [
    themeColors.primary,
    themeColors.primaryBg,
    themeColors.secondary,
    themeColors.success,
    themeColors.info,
    '#e6a400',
    '#ff8500',
    '#0077be'
];

// Configurações padrão para todos os gráficos
Chart.defaults.font.family = 'Questrial, sans-serif';
Chart.defaults.font.size = 12;
Chart.defaults.color = themeColors.secondary;

document.addEventListener('DOMContentLoaded', function () {
    // Verificar se o Chart.js foi carregado
    if (typeof Chart === 'undefined') {
        console.error('Chart.js não foi carregado');
        return;
    }

    // Gráfico 1: Consumo Mensal por Setor (Gráfico de Barras)
    const ctxSetor = document.getElementById('consumoSetorChart');
    if (ctxSetor) {
        new Chart(ctxSetor, {
            type: 'bar',
            data: {
                labels: ['Administrativo', 'Produção', 'TI', 'Vendas', 'RH', 'Financeiro'],
                datasets: [{
                    label: 'Consumo (kWh)',
                    data: [1250, 3800, 950, 750, 400, 650],
                    backgroundColor: [
                        chartColors[0],
                        chartColors[1],
                        chartColors[2],
                        chartColors[3],
                        chartColors[4],
                        chartColors[5]
                    ],
                    borderColor: chartColors[0],
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
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
                        backgroundColor: 'rgba(0, 24, 36, 0.9)',
                        titleColor: themeColors.primary,
                        bodyColor: '#ffffff',
                        borderColor: themeColors.primary,
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            label: function (context) {
                                return context.parsed.y + ' kWh';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function (value) {
                                return value + ' kWh';
                            },
                            color: themeColors.secondary
                        },
                        grid: {
                            color: 'rgba(0, 24, 36, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: themeColors.secondary
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    // Gráfico 2: Evolução do Consumo Anual (Linha)
    const ctxEvolucao = document.getElementById('evolucaoConsumoChart');
    if (ctxEvolucao) {
        new Chart(ctxEvolucao, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                datasets: [{
                    label: '2024',
                    data: [8500, 7800, 8200, 7500, 8000, 9200, 9800, 10200, 9500, 8800, 8300, 7900],
                    borderColor: themeColors.primary,
                    backgroundColor: 'rgba(255, 183, 3, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: themeColors.primary,
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 3,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }, {
                    label: '2025',
                    data: [7800, 7200, 7600, 6900, 7300, 8400, 8800, 9100, 8600, 7900, 7500, 7100],
                    borderColor: themeColors.success,
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: themeColors.success,
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 3,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            color: themeColors.secondary,
                            font: {
                                weight: '600'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 24, 36, 0.9)',
                        titleColor: themeColors.primary,
                        bodyColor: '#ffffff',
                        borderColor: themeColors.primary,
                        borderWidth: 1,
                        cornerRadius: 8,
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
                        ticks: {
                            callback: function (value) {
                                return value + ' kWh';
                            },
                            color: themeColors.secondary
                        },
                        grid: {
                            color: 'rgba(0, 24, 36, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: themeColors.secondary
                        },
                        grid: {
                            color: 'rgba(0, 24, 36, 0.1)'
                        }
                    }
                },
                animation: {
                    duration: 2500,
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    // Gráfico 3: Distribuição de Custos por Dispositivo (Pizza)
    const ctxCustos = document.getElementById('custosDispositivoChart');
    if (ctxCustos) {
        new Chart(ctxCustos, {
            type: 'doughnut',
            data: {
                labels: ['Ar Condicionado', 'Computadores', 'Iluminação', 'Servidores', 'Impressoras', 'Outros'],
                datasets: [{
                    data: [40, 25, 15, 12, 5, 3],
                    backgroundColor: [
                        chartColors[0],
                        chartColors[1],
                        chartColors[2],
                        chartColors[3],
                        chartColors[4],
                        chartColors[5]
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 3,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            color: themeColors.secondary,
                            font: {
                                size: 11
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 24, 36, 0.9)',
                        titleColor: themeColors.primary,
                        bodyColor: '#ffffff',
                        borderColor: themeColors.primary,
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            label: function (context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    // Gráfico 4: Economia Alcançada (Gauge/Progress)
    const ctxEconomia = document.getElementById('economiaChart');
    if (ctxEconomia) {
        new Chart(ctxEconomia, {
            type: 'doughnut',
            data: {
                labels: ['Economia Alcançada', 'Potencial Restante'],
                datasets: [{
                    data: [23, 77],
                    backgroundColor: [
                        themeColors.success,
                        'rgba(0, 24, 36, 0.1)'
                    ],
                    borderColor: [
                        themeColors.success,
                        'rgba(0, 24, 36, 0.2)'
                    ],
                    borderWidth: 2,
                    cutout: '70%',
                    rotation: -90,
                    circumference: 180
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
                        backgroundColor: 'rgba(0, 24, 36, 0.9)',
                        titleColor: themeColors.primary,
                        bodyColor: '#ffffff',
                        borderColor: themeColors.primary,
                        borderWidth: 1,
                        cornerRadius: 8,
                        filter: function (tooltipItem) {
                            return tooltipItem.dataIndex === 0; // Mostrar tooltip apenas para economia
                        },
                        callbacks: {
                            label: function (context) {
                                if (context.dataIndex === 0) {
                                    return 'Economia: ' + context.parsed + '%';
                                }
                                return '';
                            }
                        }
                    }
                },
                animation: {
                    duration: 2500,
                    easing: 'easeOutQuart'
                }
            },
            plugins: [{
                id: 'centerText',
                beforeDraw: function (chart) {
                    const ctx = chart.ctx;
                    ctx.restore();
                    const fontSize = (chart.height / 100).toFixed(2);
                    ctx.font = `bold ${fontSize}em Questrial, sans-serif`;
                    ctx.textBaseline = "middle";
                    ctx.fillStyle = themeColors.success;

                    const text = "23%";
                    const textX = Math.round((chart.width - ctx.measureText(text).width) / 2);
                    const textY = chart.height / 2;

                    ctx.fillText(text, textX, textY);

                    // Texto menor abaixo
                    ctx.font = `${fontSize * 0.6}em Questrial, sans-serif`;
                    ctx.fillStyle = themeColors.secondary;
                    const subText = "Economia";
                    const subTextX = Math.round((chart.width - ctx.measureText(subText).width) / 2);
                    const subTextY = chart.height / 2 + 25;

                    ctx.fillText(subText, subTextX, subTextY);
                    ctx.save();
                }
            }]
        });
    }

    // Animação de entrada para os cards dos gráficos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Aplicar animação aos cards
    document.querySelectorAll('.chart-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});