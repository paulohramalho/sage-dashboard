# Guia de Uso - Dashboard SAGE

## Visão Geral

O Dashboard SAGE é um sistema de análise e gerenciamento energético que permite monitorar o consumo de energia em tempo real, gerar relatórios detalhados e visualizar estatísticas de consumo por diferentes níveis hierárquicos.

## Estrutura do Sistema

O sistema está organizado em uma hierarquia de 4 níveis:

**Empresa → Setor → Sala → Dispositivo (Vínculo)**

Cada dispositivo é vinculado a uma sala através de um **apelido** que representa o dispositivo real instalado naquele local.

## Funcionalidades Principais

### 1. Dashboard Principal

Ao acessar o sistema, você visualiza o dashboard principal com:

- **Cards de Resumo**: Consumo total, usuários ativos, dispositivos monitorados e custo estimado
- **Gráfico de Consumo por Hora**: Mostra o consumo ao longo de 24 horas com linhas de média, mínimo e máximo
- **Gráfico de Consumo por Dispositivo**: Visualização em rosca do rateio entre dispositivos
- **Últimas Leituras**: Tabela com as leituras mais recentes

### 2. Gerenciamento de Usuários

Acesse através do menu lateral "Usuários".

**Funcionalidades**:
- Visualizar lista de usuários
- Adicionar novo usuário
- Editar informações de usuário
- Deletar usuário

### 3. Gerenciamento de Setores

Acesse através do menu lateral "Setores".

**Funcionalidades**:
- Visualizar lista de setores com busca e paginação
- Adicionar novo setor
- Editar informações de setor
- Deletar setor

**Como usar a busca**:
1. Digite o termo desejado na caixa de busca
2. A lista será filtrada automaticamente
3. Use os controles de paginação para navegar entre páginas

### 4. Gerenciamento de Salas

Acesse através do menu lateral "Salas".

**Funcionalidades**:
- Visualizar lista de salas com busca e paginação
- Cada sala está vinculada a um setor
- Adicionar nova sala
- Editar informações de sala
- Deletar sala

### 5. Gerenciamento de Dispositivos

Acesse através do menu lateral "Dispositivos".

**Funcionalidades**:
- Visualizar lista de dispositivos com busca e paginação
- Cada dispositivo possui tipo e potência
- Adicionar novo dispositivo
- Editar informações de dispositivo
- Deletar dispositivo

**Observação**: Os dispositivos cadastrados aqui são modelos genéricos. Para monitorar o consumo, é necessário criar um **vínculo** na seção "Vínculos de Dispositivos".

### 6. Vínculos de Dispositivos

Acesse através do menu lateral "Vínculos de Dispositivos".

**O que são vínculos?**
Um vínculo representa um dispositivo real instalado em uma sala específica. Cada vínculo possui:
- **Apelido**: Nome descritivo do dispositivo naquela localização
- **Sala**: Local onde o dispositivo está instalado
- **Dispositivo**: Modelo do dispositivo
- **Tempo Médio**: Tempo médio de uso em horas

**Funcionalidades**:
- Visualizar lista de vínculos
- Criar novo vínculo
- Editar vínculo existente
- Deletar vínculo

### 7. Relatórios de Consumo

Acesse através do menu lateral "Relatórios".

Esta é uma das funcionalidades mais poderosas do sistema, permitindo análises detalhadas do consumo energético.

#### Tipos de Relatório

**Evolução de Consumo**:
- Por Setor: Mostra como o consumo de cada setor evolui ao longo do tempo
- Por Sala: Mostra como o consumo de cada sala evolui ao longo do tempo
- Por Dispositivo: Mostra como o consumo de cada vínculo evolui ao longo do tempo

**Rateio de Consumo**:
- Por Setor: Mostra a distribuição percentual do consumo entre setores
- Por Sala: Mostra a distribuição percentual do consumo entre salas
- Por Dispositivo: Mostra a distribuição percentual do consumo entre vínculos

#### Filtros Hierárquicos (Opcionais)

Os filtros permitem segmentar os dados:

**Sem filtros**: Visualiza todos os dados da empresa

**Filtro por Setor**: 
1. Selecione um setor no dropdown "Setor"
2. O sistema filtrará automaticamente os dados daquele setor
3. O dropdown "Sala" será habilitado com as salas do setor

**Filtro por Setor + Sala**:
1. Selecione um setor
2. Selecione uma sala do dropdown "Sala"
3. O sistema filtrará os dados apenas daquela sala

**Limpar Filtros**:
- Clique no botão "Limpar Filtros" para remover todos os filtros

#### Períodos de Análise

**Períodos Pré-definidos**:
- **Dia**: Análise por hora (24 pontos)
- **Semana**: Análise por dia da semana (7 pontos)
- **Mês**: Análise por semana (4 pontos)

**Período Personalizado**:
1. Selecione a data inicial
2. Selecione a data final
3. Clique em "Aplicar"

#### Visualização dos Dados

O sistema exibe **dois gráficos simultaneamente**:
- **Gráfico de Evolução**: Mostra a tendência ao longo do tempo
- **Gráfico de Rateio**: Mostra a distribuição percentual

Abaixo dos gráficos, uma **tabela de dados** apresenta:
- Nome da entidade
- Total consumido (kWh)
- Média de consumo (kWh)
- Máximo registrado (kWh)
- Mínimo registrado (kWh)

### 8. Monitoramento de Consumo

Acesse através do menu lateral "Consumo".

Esta seção oferece uma visão detalhada das grandezas elétricas monitoradas.

#### Três Gráficos Principais

**Tensão (V)**:
- Mostra a evolução da tensão elétrica ao longo do tempo
- Exibe média, mínimo e máximo

**Corrente (A)**:
- Mostra a evolução da corrente elétrica ao longo do tempo
- Exibe média, mínimo e máximo

**Potência Ativa (kW)**:
- Mostra a evolução da potência ativa ao longo do tempo
- Exibe média, mínimo e máximo

#### Filtros

**Dispositivo (Vínculo)**:
- Selecione um vínculo específico para visualizar seus dados
- Ou deixe em "Todos os Dispositivos" para ver a média geral

**Período**:
- **Dia**: Visualização hora a hora
- **Semana**: Visualização dia a dia
- **Mês**: Visualização semanal
- **Personalizado**: Selecione data inicial e final

#### Estatísticas

Abaixo de cada gráfico, você encontra:
- **Média**: Valor médio no período
- **Mín**: Valor mínimo registrado
- **Máx**: Valor máximo registrado

#### Tabela de Leituras

Na parte inferior, uma tabela mostra todas as leituras detalhadas com:
- Data e hora da leitura
- Dispositivo que gerou a leitura
- Tensão registrada
- Corrente registrada
- Potência ativa registrada

## Dicas de Uso

### Análise de Consumo por Setor

1. Acesse "Relatórios"
2. Selecione "Evolução - Por Setor"
3. Escolha o período desejado (ex: Mês)
4. Observe qual setor tem maior consumo
5. Use o gráfico de rateio para ver a distribuição percentual

### Identificar Picos de Consumo

1. Acesse "Dashboard"
2. Observe o gráfico de consumo por hora
3. Identifique os horários de pico (valores acima da média)
4. Compare com as linhas de máximo e mínimo

### Monitorar Dispositivo Específico

1. Acesse "Consumo"
2. Selecione o dispositivo desejado no filtro
3. Escolha o período de análise
4. Observe os três gráficos para identificar anomalias
5. Verifique se tensão e corrente estão dentro dos padrões

### Comparar Salas de um Setor

1. Acesse "Relatórios"
2. Selecione "Rateio - Por Sala"
3. No filtro hierárquico, selecione o setor desejado
4. O gráfico mostrará apenas as salas daquele setor
5. Identifique quais salas consomem mais

## Busca e Paginação

Nas páginas de listagem (Setores, Salas, Dispositivos), você pode:

**Buscar**:
1. Digite na caixa de busca
2. A lista é filtrada em tempo real
3. A paginação se ajusta automaticamente

**Navegar entre páginas**:
1. Use os botões "Anterior" e "Próxima"
2. Ou clique diretamente no número da página desejada
3. Veja quantos registros estão sendo exibidos no rodapé

## Interpretação dos Gráficos

### Linhas de Estatísticas

- **Linha sólida**: Dados reais medidos
- **Linha tracejada azul**: Média do período
- **Linha tracejada verde**: Valor mínimo registrado
- **Linha tracejada vermelha**: Valor máximo registrado

### Cores dos Gráficos

O sistema utiliza uma paleta de cores consistente:
- **Laranja (#fb8500)**: Dados principais, alertas
- **Azul escuro (#023047)**: Dados secundários, médias
- **Azul claro (#219ebc)**: Informações complementares
- **Verde (#06d6a0)**: Valores mínimos, status positivo
- **Vermelho (#ef476f)**: Valores máximos, alertas críticos
- **Amarelo (#ffb703)**: Destaques, potência

## Solução de Problemas

### Gráfico não aparece
- Verifique se há dados para o período selecionado
- Tente selecionar um período diferente
- Recarregue a página

### Busca não funciona
- Certifique-se de estar digitando na caixa de busca correta
- Limpe o campo e tente novamente
- Verifique se há dados cadastrados

### Filtros não aplicam
- Clique no botão "Aplicar" após selecionar as datas
- Verifique se a data inicial é anterior à final
- Use o botão "Limpar Filtros" e tente novamente

## Suporte

Para dúvidas ou problemas técnicos, consulte a documentação técnica em `DOCUMENTACAO.md` ou entre em contato com o suporte técnico.
