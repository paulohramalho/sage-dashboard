# SAGE - Sistema de Análise e Gerenciamento Energético

Um dashboard completo para análise e gerenciamento de consumo energético com coleta de dados via medidores IOT.

## 📋 Características

- **Dashboard Principal**: Visualização em tempo real do consumo energético
- **Gerenciamento de Empresas**: Cadastro e gestão de múltiplas empresas
- **Gerenciamento de Usuários**: Controle de acesso e perfis de usuários
- **Gerenciamento de Setores**: Organização de setores dentro das empresas
- **Gerenciamento de Salas**: Cadastro de salas e sua associação com setores
- **Gerenciamento de Dispositivos**: Registro de dispositivos e sua potência
- **Monitoramento de Consumo**: Acompanhamento de corrente, tensão e potência ativa
- **Relatórios**: Geração de relatórios de consumo, custos e eficiência
- **Gráficos Interativos**: Visualizações de dados com Chart.js

## 🎨 Design

- **Paleta de Cores**: Laranja (#ffb703) como cor primária
- **Tema**: Fundo branco com interface limpa e moderna
- **Responsividade**: Adaptado para desktop, tablet e mobile
- **Componentes**: Sidebar colapsável, formulários, tabelas, gráficos

## 📁 Estrutura de Arquivos

```
sage-dashboard/
├── index.html              # Arquivo HTML principal
├── css/
│   ├── style.css          # Estilos globais
│   ├── sidebar.css        # Estilos da sidebar
│   ├── forms.css          # Estilos de formulários
│   ├── tables.css         # Estilos de tabelas
│   └── charts.css         # Estilos de gráficos
├── js/
│   ├── app.js             # Lógica principal da aplicação
│   ├── sidebar.js         # Funcionalidades da sidebar
│   ├── dashboard.js       # Lógica do dashboard
│   ├── empresas.js        # Lógica de empresas
│   ├── usuarios.js        # Lógica de usuários
│   ├── setores.js         # Lógica de setores
│   ├── salas.js           # Lógica de salas
│   ├── dispositivos.js    # Lógica de dispositivos
│   ├── consumo.js         # Lógica de consumo
│   └── relatorios.js      # Lógica de relatórios
├── pages/                 # Páginas adicionais
├── assets/                # Imagens e recursos
└── README.md             # Este arquivo
```

## 🚀 Como Usar

1. Abra o arquivo `index.html` em um navegador web
2. Navegue pelos menus laterais para acessar diferentes seções
3. Use os botões para criar, editar ou deletar registros
4. Visualize gráficos e relatórios de consumo energético

## 📊 Banco de Dados

O sistema trabalha com as seguintes entidades:

- **Empresa**: Informações da empresa (nome, CNPJ, telefone)
- **Usuário**: Dados de acesso (nome, email, perfil)
- **Setor**: Divisões dentro da empresa
- **Sala**: Ambientes dentro dos setores
- **Dispositivo**: Equipamentos que consomem energia
- **Tipo de Dispositivo**: Categorias de dispositivos
- **Dispositivo Sala**: Associação de dispositivos com salas
- **Consumo**: Leituras de corrente, tensão e potência

## 🔧 Tecnologias

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos e responsividade
- **JavaScript Vanilla**: Lógica da aplicação
- **Chart.js**: Gráficos interativos

## 📱 Responsividade

O dashboard é totalmente responsivo e se adapta a:
- Desktops (1920px e acima)
- Tablets (768px a 1024px)
- Smartphones (até 768px)

## 🎯 Funcionalidades Principais

### Dashboard
- Estatísticas de consumo
- Gráficos de consumo por hora e dispositivo
- Últimas leituras de consumo

### Cadastros
- Formulários intuitivos com validação
- Modais para criação e edição
- Busca e filtros em tabelas

### Gráficos
- Gráficos de linha para tendências
- Gráficos de barra para comparações
- Gráficos de rosca para distribuição

### Relatórios
- Relatório de consumo
- Relatório de custos
- Relatório de eficiência
- Relatório comparativo

## 💾 Dados de Exemplo

O sistema vem com dados de exemplo para demonstração:
- 2 empresas
- 3 usuários
- 3 setores
- 3 salas
- 3 dispositivos
- 3 leituras de consumo

## 🔐 Segurança

Nota: Este é um protótipo de interface. Para produção, implemente:
- Autenticação e autorização
- Validação de dados no servidor
- Criptografia de senhas
- HTTPS
- Proteção contra CSRF

## 📝 Licença

Todos os direitos reservados.

## 👥 Suporte

Para dúvidas ou sugestões, entre em contato com a equipe de desenvolvimento.
