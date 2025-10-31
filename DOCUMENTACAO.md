# Documentação Técnica - SAGE Dashboard

## 📋 Visão Geral

O SAGE (Sistema de Análise e Gerenciamento Energético) é um dashboard web desenvolvido em HTML5, CSS3 e JavaScript vanilla para monitoramento e gerenciamento de consumo energético em empresas.

## 🏗️ Arquitetura

### Estrutura de Arquivos

```
sage-dashboard/
├── index.html                 # Página principal (HTML)
├── css/
│   ├── style.css             # Estilos globais e variáveis CSS
│   ├── sidebar.css           # Estilos da navegação lateral
│   ├── forms.css             # Estilos de formulários
│   ├── tables.css            # Estilos de tabelas e listagens
│   └── charts.css            # Estilos de gráficos e visualizações
├── js/
│   ├── app.js                # Lógica principal da aplicação
│   ├── sidebar.js            # Funcionalidades adicionais da sidebar
│   ├── dashboard.js          # Lógica do dashboard
│   ├── empresas.js           # Lógica de gerenciamento de empresas
│   ├── usuarios.js           # Lógica de gerenciamento de usuários
│   ├── setores.js            # Lógica de gerenciamento de setores
│   ├── salas.js              # Lógica de gerenciamento de salas
│   ├── dispositivos.js       # Lógica de gerenciamento de dispositivos
│   ├── consumo.js            # Lógica de monitoramento de consumo
│   ├── relatorios.js         # Lógica de geração de relatórios
│   ├── enderecos.js          # Lógica de gerenciamento de endereços
│   └── tipos-dispositivos.js # Lógica de tipos de dispositivos
├── pages/                    # Páginas adicionais (se necessário)
├── assets/                   # Imagens e recursos estáticos
├── README.md                 # Guia de uso
├── DOCUMENTACAO.md          # Este arquivo
└── todo.md                  # Rastreamento de tarefas
```

## 🎨 Design System

### Paleta de Cores

| Variável | Cor | Uso |
|----------|-----|-----|
| `--color-primary` | #ffb703 | Botões, destaques, links |
| `--color-primary-dark` | #fb8500 | Hover de botões primários |
| `--color-primary-light` | #ffc300 | Backgrounds suaves |
| `--color-secondary` | #023e8a | Elementos secundários |
| `--color-success` | #06a77d | Mensagens de sucesso |
| `--color-warning` | #ff9500 | Avisos |
| `--color-danger` | #d62828 | Erros e ações destrutivas |
| `--color-info` | #0077b6 | Informações |

### Tipografia

- **Font Family**: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Tamanhos**: 12px (pequeno) a 28px (grande)
- **Pesos**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Espaçamento

- **Padding**: 10px, 12px, 15px, 20px, 25px, 30px
- **Margin**: 8px, 10px, 15px, 20px
- **Gap**: 8px, 10px, 15px, 20px

### Componentes

#### Botões
- `.btn` - Botão base
- `.btn-primary` - Botão primário (laranja)
- `.btn-secondary` - Botão secundário (azul)
- `.btn-success` - Botão de sucesso (verde)
- `.btn-danger` - Botão de perigo (vermelho)
- `.btn-outline` - Botão com borda
- `.btn-sm` - Botão pequeno
- `.btn-lg` - Botão grande

#### Cards
- `.card` - Card padrão
- `.stat-card` - Card de estatísticas
- `.form-card` - Card para formulários

#### Tabelas
- `.table-container` - Container de tabela
- `.table-header` - Header da tabela
- `.action-btn` - Botão de ação em tabela
- `.badge` - Badge de status

#### Gráficos
- `.chart-container` - Container de gráfico
- `.chart-header` - Header do gráfico
- `.chart-body` - Corpo do gráfico
- `.stats-row` - Linha de estatísticas

## 📊 Entidades de Dados

### Empresa
```javascript
{
    id: UUID,
    nome: String,
    razaoSocial: String,
    cnpj: String,
    telefone: String
}
```

### Usuário
```javascript
{
    id: UUID,
    nome: String,
    email: String,
    senha: String,
    role: String,
    fk_empresa: UUID
}
```

### Setor
```javascript
{
    id: UUID,
    nome: String,
    descricao: String,
    fk_empresa: UUID
}
```

### Sala
```javascript
{
    id: UUID,
    nome: String,
    descricao: String,
    fk_setor: UUID,
    fk_empresa: UUID
}
```

### Dispositivo
```javascript
{
    id: UUID,
    nome: String,
    potencia: Float,
    fk_tipo_dispositivo: UUID,
    fk_empresa: UUID
}
```

### Consumo
```javascript
{
    id: UUID,
    event_time: Timestamp,
    corrente: Float,
    tensao: Float,
    potencia_ativa: Float,
    fk_dispositivo: UUID
}
```

### Endereço
```javascript
{
    id: UUID,
    logradouro: String,
    numero: Integer,
    bairro: String,
    cep: String,
    cidade: String,
    uf: String,
    complemento: String,
    fk_empresa: UUID
}
```

### Tipo de Dispositivo
```javascript
{
    id: UUID,
    nome: String,
    fk_empresa: UUID
}
```

## 🔧 Funcionalidades Principais

### 1. Dashboard
- Exibição de estatísticas de consumo
- Gráficos de consumo por hora e dispositivo
- Últimas leituras de consumo
- Cards com informações resumidas

### 2. Gerenciamento de Empresas
- Cadastro de novas empresas
- Listagem com busca
- Edição e exclusão
- Validação de CNPJ único

### 3. Gerenciamento de Usuários
- Cadastro de usuários por empresa
- Atribuição de perfis (Admin, Usuário, Visualizador)
- Busca e filtros
- Edição e exclusão

### 4. Gerenciamento de Setores
- Cadastro de setores por empresa
- Descrição de setores
- Busca e filtros
- Edição e exclusão

### 5. Gerenciamento de Salas
- Cadastro de salas por setor
- Associação com setores
- Busca e filtros
- Edição e exclusão

### 6. Gerenciamento de Dispositivos
- Cadastro de dispositivos
- Especificação de potência
- Classificação por tipo
- Busca e filtros

### 7. Monitoramento de Consumo
- Visualização de corrente, tensão e potência
- Gráficos de tendências
- Filtros por período e dispositivo
- Tabela de leituras detalhadas

### 8. Relatórios
- Relatório de consumo
- Relatório de custos
- Relatório de eficiência
- Relatório comparativo
- Gráfico de resumo mensal

### 9. Gerenciamento de Endereços
- Cadastro de endereços por empresa
- Informações completas (CEP, bairro, etc.)
- Busca e filtros
- Edição e exclusão

### 10. Tipos de Dispositivos
- Cadastro de tipos de dispositivos
- Associação com empresas
- Busca e filtros
- Edição e exclusão

## 🎯 Fluxo de Navegação

```
Dashboard (Principal)
├── Empresas
│   ├── Novo Cadastro
│   ├── Editar
│   └── Deletar
├── Usuários
│   ├── Novo Cadastro
│   ├── Editar
│   └── Deletar
├── Setores
│   ├── Novo Cadastro
│   ├── Editar
│   └── Deletar
├── Salas
│   ├── Novo Cadastro
│   ├── Editar
│   └── Deletar
├── Dispositivos
│   ├── Novo Cadastro
│   ├── Editar
│   └── Deletar
├── Consumo
│   ├── Filtros
│   ├── Gráficos
│   └── Tabela de Leituras
├── Relatórios
│   ├── Consumo
│   ├── Custos
│   ├── Eficiência
│   └── Comparativo
├── Endereços
│   ├── Novo Cadastro
│   ├── Editar
│   └── Deletar
└── Tipos de Dispositivos
    ├── Novo Cadastro
    ├── Editar
    └── Deletar
```

## 📱 Responsividade

O dashboard é responsivo em três breakpoints principais:

| Breakpoint | Largura | Comportamento |
|-----------|---------|---------------|
| Mobile | < 768px | Sidebar colapsável, layout em coluna única |
| Tablet | 768px - 1024px | Sidebar normal, grid 2 colunas |
| Desktop | > 1024px | Layout completo, grid múltiplas colunas |

## 🔐 Segurança (Notas)

Este é um protótipo de interface. Para produção, implementar:

1. **Autenticação**: Sistema de login com JWT ou OAuth
2. **Autorização**: Controle de acesso baseado em perfis
3. **Validação**: Validação de dados no servidor
4. **Criptografia**: Senhas criptografadas com bcrypt
5. **HTTPS**: Comunicação segura
6. **CSRF Protection**: Tokens CSRF em formulários
7. **Rate Limiting**: Limite de requisições
8. **Logging**: Auditoria de ações

## 📈 Gráficos

O projeto utiliza **Chart.js** para visualizações:

- **Line Chart**: Consumo por hora, corrente, tensão
- **Doughnut Chart**: Distribuição de consumo por dispositivo
- **Bar Chart**: Consumo por dispositivo, resumo mensal

## 🚀 Próximos Passos

1. Integração com API backend
2. Persistência de dados em banco de dados
3. Sistema de autenticação
4. Exportação de relatórios (PDF, Excel)
5. Notificações em tempo real
6. Dark mode
7. Internacionalização (i18n)
8. Testes automatizados

## 📞 Suporte

Para dúvidas técnicas ou sugestões de melhorias, entre em contato com a equipe de desenvolvimento.
