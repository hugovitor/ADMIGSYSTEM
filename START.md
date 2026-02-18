# 🚀 Guia Rápido de Início

## Passo 1: Configurar e Executar o Backend

Abra um terminal PowerShell e execute:

```powershell
cd backend
dotnet restore
dotnet ef migrations add InitialCreate
dotnet ef database update
dotnet run
```

✅ O backend estará rodando em `http://localhost:5000`
✅ Swagger disponível em `http://localhost:5000/swagger`
✅ Usuário admin criado automaticamente

## Passo 2: Configurar e Executar o Frontend

Abra OUTRO terminal PowerShell e execute:

```powershell
cd frontend
npm install
npm run dev
```

✅ O frontend estará rodando em `http://localhost:3000`

## Passo 3: Acessar o Sistema

1. Abra seu navegador em `http://localhost:3000`
2. Faça login com:
   - **Email**: admin@igreja.com
   - **Senha**: Admin@123

## � Documentação da API

Acesse `http://localhost:5000/swagger` para:
- Ver documentação completa de todos os endpoints
- Testar a API diretamente no navegador
- Entender os modelos de dados e requisições

## �📌 Notas Importantes

### Backend
- Certifique-se de ter o .NET 8 SDK instalado
- O banco SQLite será criado automaticamente
- A API usa JWT para autenticação
- Porta padrão: 5000

### Frontend
- Certifique-se de ter Node.js 18+ instalado
- A aplicação se conecta automaticamente à API local
- Porta padrão: 3000

## 🔧 Comandos Úteis

### Backend
```powershell
# Restaurar dependências
dotnet restore

# Criar nova migration
dotnet ef migrations add NomeDaMigration

# Aplicar migrations
dotnet ef database update

# Executar em modo watch (recarrega automaticamente)
dotnet watch run
```

### Frontend
```powershell
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🌍 Configuração de Ambiente

### Desenvolvimento Local
O arquivo `frontend/.env` já está configurado para desenvolvimento:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### Produção
1. Configure o backend em um serviço de nuvem
2. Atualize `frontend/.env.production` com a URL real:
```
VITE_API_BASE_URL=https://sua-api-de-producao.com/api
```

## ⚠️ Solução de Problemas

### Backend não inicia
- Verifique se a porta 5000 está disponível
- Certifique-se de que o .NET 8 SDK está instalado: `dotnet --version`

### Frontend não conecta ao backend
- Verifique se o backend está rodando em http://localhost:5000
- Para desenvolvimento local, certifique-se que o arquivo `frontend/.env` existe
- Para produção, configure a variável VITE_API_BASE_URL com a URL do seu backend

### Configurando Backend para Produção
1. Faça deploy do backend para um serviço como Railway, Render ou Heroku
2. Atualize o arquivo `frontend/.env.production` com a URL do backend:
   ```
   VITE_API_BASE_URL=https://sua-api-url.herokuapp.com/api
   ```

### Erro de CORS
- Verifique se o CORS está configurado no backend (já está por padrão)
- Verifique se a URL do frontend está na lista de origens permitidas

### Erro ao fazer login
- Certifique-se de que o backend está rodando
- Verifique as credenciais: admin@igreja.com / Admin@123
- Verifique se o banco de dados foi criado corretamente

## 📚 Próximos Passos

1. ✅ Faça login como admin
2. ✅ Explore o dashboard
3. ✅ Teste os módulos (Música, Jiu-Jitsu, Grupo de Homens)
4. ✅ Crie novos usuários (apenas admin pode fazer isso)
5. ✅ Cadastre alunos/membros em cada módulo

## 🎯 Funcionalidades Principais

- ✨ Login seguro com JWT
- ✨ Dashboard intuitivo
- ✨ CRUD completo para todos os módulos
- ✨ Gerenciamento de usuários (Admin)
- ✨ Interface responsiva
- ✨ Proteção de rotas

## 📞 Suporte

Para adicionar novos módulos ou funcionalidades, consulte os READMEs específicos em cada pasta (backend/README.md e frontend/README.md).
