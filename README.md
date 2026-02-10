# Sistema de Gerenciamento de Igreja

Sistema completo para gerenciamento de atividades da igreja, incluindo Escola de Música, Escola de Jiu-Jitsu e Grupo de Homens.

## 📂 Estrutura do Projeto

```
ADMIGSYSTEM/
├── backend/           # API .NET 8
│   ├── Controllers/   # Controladores da API
│   ├── Models/        # Modelos de dados
│   ├── DTOs/          # Data Transfer Objects
│   ├── Data/          # DbContext e inicialização
│   ├── Services/      # Serviços (JWT, etc.)
│   └── Program.cs     # Configuração principal
│
└── frontend/          # Aplicação React
    ├── src/
    │   ├── components/ # Componentes reutilizáveis
    │   ├── pages/      # Páginas da aplicação
    │   └── services/   # Serviços de API
    └── package.json
```

## 🚀 Como Executar

### Backend (.NET 8)

1. Navegue até a pasta do backend:
```bash
cd backend
```

2. Restaure as dependências:
```bash
dotnet restore
```

3. Execute as migrations:
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

4. Execute o projeto:
```bash
dotnet run
```

O backend estará disponível em `http://localhost:5000`.

### Frontend (React)

1. Navegue até a pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Execute em modo de desenvolvimento:
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:3000`.

## 🔑 Credenciais Padrão

- **Email**: admin@igreja.com
- **Senha**: Admin@123

## 📚 Documentação da API

Acesse [http://localhost:5000/swagger](http://localhost:5000/swagger) para visualizar a documentação interativa completa da API com Swagger.

### Recursos:
- Documentação detalhada de todos os endpoints
- Suporte a autenticação JWT integrado
- Testar requisições diretamente no navegador
- Exemplos de request/response para cada endpoint
- **Deep Linking** - links diretos para endpoints específicos
- Filtro de busca de endpoints
- Duração de requisições em tempo real

### Deep Linking:
Compartilhe links diretos para endpoints:
```
http://localhost:5000/swagger/index.html#/Auth/Auth_Login
http://localhost:5000/swagger/index.html#/MusicSchool/MusicSchool_GetStudents
```

## 🎯 Funcionalidades

### Backend
- ✅ Autenticação JWT
- ✅ Roles (Admin e User)
- ✅ API RESTful completa
- ✅ Entity Framework Core
- ✅ SQLite Database
- ✅ CORS configurado
- ✅ Swagger/OpenAPI

### Frontend
- ✅ Autenticação com JWT
- ✅ Rotas protegidas
- ✅ Dashboard intuitivo
- ✅ CRUD completo para todos os módulos
- ✅ Interface responsiva com Material UI
- ✅ Gerenciamento de usuários (Admin)

### Módulos
1. **Escola de Música** - Gerenciamento de alunos de música
2. **Escola de Jiu-Jitsu** - Gerenciamento de alunos de Jiu-Jitsu
3. **Grupo de Homens** - Gerenciamento de membros do grupo
4. **Usuários** - Gerenciamento de usuários do sistema (Admin apenas)

## 🔐 Segurança

- Apenas admins podem criar novos usuários
- Não existe endpoint público de registro
- JWT para autenticação e autorização
- Rotas protegidas no frontend e backend
- Soft delete para preservar dados

## 🛠️ Tecnologias Utilizadas

### Backend
- .NET 8
- Entity Framework Core
- SQLite
- JWT Bearer Authentication
- BCrypt.Net
- Swagger/OpenAPI

### Frontend
- React 18
- TypeScript
- Material UI
- React Router DOM
- Axios
- Vite

## 📖 Documentação da API

Acesse `http://localhost:5000/swagger` para visualizar a documentação completa da API.

## 🔄 Expansão Futura

O sistema foi desenvolvido com arquitetura modular, permitindo fácil adição de novos módulos:

1. Adicione um novo modelo em `backend/Models/`
2. Crie um controller em `backend/Controllers/`
3. Adicione um serviço em `frontend/src/services/`
4. Crie uma página em `frontend/src/pages/`
5. Atualize o menu em `frontend/src/components/Layout.tsx`

## 📝 Licença

Este projeto foi desenvolvido para uso interno da igreja.
