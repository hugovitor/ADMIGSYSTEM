# Frontend - Sistema de Gerenciamento de Igreja

Frontend desenvolvido em React com TypeScript e Material UI.

## 🚀 Tecnologias

- React 18
- TypeScript
- Material UI
- React Router DOM
- Axios
- Vite

## 📋 Pré-requisitos

- Node.js 18+ e npm

## 🔧 Instalação

1. Instalar dependências:
```bash
npm install
```

2. Executar em modo de desenvolvimento:
```bash
npm run dev
```

3. Build para produção:
```bash
npm run build
```

A aplicação estará disponível em `http://localhost:3000`.

## 🔑 Credenciais de Acesso

- **Email**: admin@igreja.com
- **Senha**: Admin@123

## 🗂️ Estrutura

```
frontend/
├── src/
│   ├── components/        # Componentes reutilizáveis
│   │   ├── Layout.tsx     # Layout principal com menu
│   │   └── PrivateRoute.tsx # Proteção de rotas
│   ├── pages/             # Páginas da aplicação
│   │   ├── Login.tsx      # Página de login
│   │   ├── Dashboard.tsx  # Dashboard principal
│   │   ├── MusicSchool.tsx # Escola de Música
│   │   ├── JiuJitsu.tsx   # Escola de Jiu-Jitsu
│   │   ├── MensGroup.tsx  # Grupo de Homens
│   │   └── Users.tsx      # Gerenciamento de usuários (Admin)
│   ├── services/          # Serviços de API
│   │   ├── api.ts         # Configuração do Axios
│   │   ├── authService.ts # Serviço de autenticação
│   │   ├── musicSchoolService.ts
│   │   ├── jiuJitsuService.ts
│   │   ├── mensGroupService.ts
│   │   └── userService.ts
│   ├── App.tsx            # Componente principal
│   └── main.tsx           # Ponto de entrada
└── package.json
```

## 📱 Funcionalidades

### Autenticação
- Login com JWT
- Proteção de rotas
- Logout

### Dashboard
- Visão geral dos módulos
- Navegação fácil

### Escola de Música
- Listar alunos
- Adicionar novo aluno
- Editar aluno
- Excluir aluno
- Campos: Nome, Email, Telefone, Instrumento, Nível

### Escola de Jiu-Jitsu
- Listar alunos
- Adicionar novo aluno
- Editar aluno
- Excluir aluno
- Campos: Nome, Email, Telefone, Faixa

### Grupo de Homens
- Listar membros
- Adicionar novo membro
- Editar membro
- Excluir membro
- Campos: Nome, Email, Telefone, Função

### Usuários (Apenas Admin)
- Listar usuários
- Criar novo usuário
- Editar usuário
- Desativar usuário
- Campos: Nome, Email, Senha, Função (Admin/User)

## 🔐 Segurança

- Rotas protegidas com autenticação JWT
- Apenas administradores podem gerenciar usuários
- Token armazenado no localStorage
- Redirecionamento automático em caso de token inválido

## 🎨 Interface

- Design responsivo com Material UI
- Menu lateral com navegação
- Formulários modais para CRUD
- Feedback visual de ações
- Temas personalizáveis
