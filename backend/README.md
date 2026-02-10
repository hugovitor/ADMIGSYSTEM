# Backend - Sistema de Gerenciamento de Igreja

Backend desenvolvido em .NET 8 com Entity Framework Core e SQLite.

## 🚀 Tecnologias

- .NET 8
- Entity Framework Core
- SQLite
- JWT Authentication
- Swagger/OpenAPI

## 📋 Pré-requisitos

- .NET 8 SDK

## 🔧 Instalação

1. Restaurar dependências:
```bash
dotnet restore
```

2. Aplicar migrations (criar banco de dados):
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

3. Executar o projeto:
```bash
dotnet run
```

O servidor estará disponível em `http://localhost:5000` (ou `https://localhost:5001`).

## � Documentação da API (Swagger)

Acesse `http://localhost:5000/swagger` para visualizar a documentação interativa completa da API.

### Recursos do Swagger:
- 📖 Documentação completa de todos os endpoints
- 🔐 Suporte a autenticação JWT integrado
- 🧪 Testar endpoints diretamente no navegador
- 📝 Exemplos de requisições e respostas- 🔗 **Deep Linking** - Links diretos para endpoints específicos
- ⏱️ Duração de requisições exibida
- 🔍 Filtro de busca de endpoints

### Como usar Deep Linking:
Você pode compartilhar links diretos para endpoints específicos:
- `http://localhost:5000/swagger/index.html#/Auth/Auth_Login`
- `http://localhost:5000/swagger/index.html#/MusicSchool/MusicSchool_GetStudents`
- `http://localhost:5000/swagger/index.html#/Users/Users_CreateUser`

Basta clicar em qualquer endpoint e a URL será atualizada automaticamente para esse endpoint específico!
### Como usar autenticação no Swagger:
1. Faça login através do endpoint `/api/auth/login`
2. Copie o token retornado
3. Clique no botão "Authorize" no topo da página
4. Cole o token no formato: `Bearer seu-token-aqui`
5. Agora você pode testar endpoints protegidos

## �🔑 Credenciais Padrão

- **Email**: admin@igreja.com
- **Senha**: Admin@123

> **Nota**: Não existe endpoint público de registro. Apenas administradores podem criar novos usuários.

## 📚 Documentação da API

Acesse `http://localhost:5000/swagger` para visualizar a documentação completa da API.

## 🗂️ Estrutura

```
backend/
├── Controllers/        # Controladores da API
├── Models/            # Modelos de dados
├── DTOs/              # Data Transfer Objects
├── Data/              # DbContext e inicialização
├── Services/          # Serviços (JWT, etc.)
└── Program.cs         # Configuração principal
```

## 🔐 Endpoints Principais

### Autenticação
- `POST /api/auth/login` - Login de usuário

### Usuários (Admin apenas)
- `GET /api/users` - Listar usuários
- `POST /api/users` - Criar novo usuário
- `PUT /api/users/{id}` - Atualizar usuário
- `DELETE /api/users/{id}` - Desativar usuário

### Escola de Música
- `GET /api/musicschool` - Listar alunos
- `POST /api/musicschool` - Criar aluno
- `PUT /api/musicschool/{id}` - Atualizar aluno
- `DELETE /api/musicschool/{id}` - Excluir aluno

### Escola de Jiu-Jitsu
- `GET /api/jiujitsu` - Listar alunos
- `POST /api/jiujitsu` - Criar aluno
- `PUT /api/jiujitsu/{id}` - Atualizar aluno
- `DELETE /api/jiujitsu/{id}` - Excluir aluno

### Grupo de Homens
- `GET /api/mensgroup` - Listar membros
- `POST /api/mensgroup` - Criar membro
- `PUT /api/mensgroup/{id}` - Atualizar membro
- `DELETE /api/mensgroup/{id}` - Excluir membro
