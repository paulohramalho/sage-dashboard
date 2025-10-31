# Mudanças Solicitadas para o Dashboard SAGE

## 1. Remover Cadastro de Empresa
- Remover menu "Empresas" da sidebar
- Remover página de empresas do app.js

## 2. Popular Dashboard Home com Gráficos de Consumo por Hora
- Adicionar gráfico de consumo por hora no dashboard principal
- Usar dados das views materializadas (consumo_hourly_*)
- Implementar filtros de período (dia, semana, mês)

## 3. Adicionar Busca e Paginação nas Visualizações
- Páginas afetadas: setores, salas, dispositivos, tipos-dispositivos, vinculos
- Adicionar caixa de busca por texto
- Implementar paginação

## 4. Filtros Hierárquicos nos Relatórios
- Estrutura: Setor > Sala > Dispositivo (vínculo)
- Filtros opcionais (usuário pode visualizar sem segmentação)
- Mostrar gráficos de:
  - Evolução de consumo
  - Rateio
- Filtros de intervalo de tempo personalizados + botões pré-definidos (dia, semana, mês)

## 5. Aba de Consumo
- 3 gráficos: Tensão, Corrente, Potência Ativa
- Filtros de intervalo de tempo + botões pré-definidos
- Mostrar média, mínimo e máximo em cada gráfico

## 6. Adicionar Média, Mínimo e Máximo em Todos os Gráficos
- Aplicar em todos os gráficos do sistema

## Estrutura do Banco de Dados

### Tabelas Principais
- usuario
- empresa
- endereco
- setor
- sala
- dispositivo
- dispositivo_sala (vínculo com apelido)
- consumo (hypertable TimescaleDB)
- tipo_dispositivo

### Views Materializadas
- consumo_hourly_device_room
- consumo_hourly_room
- consumo_hourly_department
- consumo_daily_device_room
- consumo_daily_room
- consumo_daily_department
- consumo_weekly_device_room
- consumo_weekly_room
- consumo_weekly_department
- consumo_monthly_device_room
- consumo_monthly_room
- consumo_monthly_department

### Observações Importantes
- O consumo é registrado no vínculo (dispositivo_sala), não no dispositivo
- O vínculo recebe um apelido que representa o dispositivo real
- Hierarquia: Empresa > Setor > Sala > Dispositivo_Sala (vínculo)
