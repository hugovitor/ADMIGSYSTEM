# 🚀 Guia de Deploy para Produção

## Frontend (Vercel) ✅
O frontend já está configurado e funcionando no Vercel:
- URL: https://admigsystem.vercel.app
- Builds automáticos a cada push na main

## Backend (Necessário configurar) ⚠️

### Opção 1: Railway (Recomendado)
1. Acesse [railway.app](https://railway.app) e faça login com GitHub
2. Clique em "New Project" → "Deploy from GitHub repo"
3. Selecione este repositório
4. Configure as variáveis de ambiente:
   ```
   DATABASE_URL=postgresql://user:pass@host:port/db
   JwtSettings__SecretKey=sua-chave-secreta-muito-segura-com-pelo-menos-32-caracteres
   ```
5. O Railway detectará automaticamente o .NET 8 e fará o deploy

### Opção 2: Render
1. Acesse [render.com](https://render.com) e conecte com GitHub
2. Crie um novo "Web Service"
3. Selecione este repositório
4. Configure:
   - Build Command: `dotnet publish -c Release -o out`  
   - Start Command: `dotnet out/ChurchManagement.dll`
   - Pasta: `/backend`
5. Adicione as variáveis de ambiente necessárias

### Opção 3: Heroku
1. Instale o Heroku CLI
2. Faça login: `heroku login`
3. Crie app: `heroku create seu-app-name`
4. Configure buildpack: `heroku buildpacks:set heroku/dotnet`
5. Deploy: `git push heroku main`

## Após Deploy do Backend

1. Copie a URL do seu backend (ex: `https://seu-app.railway.app`)
2. Atualize o arquivo `frontend/.env.production`:
   ```
   VITE_API_BASE_URL=https://seu-app.railway.app/api
   ```
3. Faça commit e push para atualizar o Vercel

## Testando a Integração

1. Acesse https://admigsystem.vercel.app 
2. Faça login com:
   - Email: admin@igreja.com
   - Senha: Admin@123
3. Se tudo estiver funcionando, você verá o dashboard com dados em tempo real

## Solução Temporária (Desenvolvimento)

Se você só quiser testar localmente:
1. Mantenha o backend rodando: `dotnet run` na pasta backend
2. Acesse http://localhost:3000 em vez da URL do Vercel
3. Tudo funcionará normalmente

## Configurações de CORS ✅

O backend já está configurado para aceitar requisições de:
- https://admigsystem.vercel.app
- https://admigsystem-acxh1j6qt-hugovitors-projects.vercel.app
- localhost (desenvolvimento)

## Banco de Dados

- **Desenvolvimento**: SQLite (automático)
- **Produção**: PostgreSQL (configure DATABASE_URL no seu serviço de deploy)