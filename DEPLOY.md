# 🚀 Deploy da Aplicação Church Management System

## 📋 Pré-requisitos
- Conta no [Render](https://render.com) 
- Conta no [Vercel](https://vercel.com)
- Git configurado

## 🔧 Deploy do Backend (Render)

### 1. Configurar no Render:
1. Acesse [Render Dashboard](https://dashboard.render.com)
2. Clique em "New +" e selecione "Web Service"
3. Conecte seu repositório GitHub
4. Configure:
   - **Name**: `church-management-backend`
   - **Environment**: `Docker`
   - **Root Directory**: `backend`
   - **Dockerfile**: `Dockerfile` (já criado)

### 2. Variáveis de Ambiente no Render:
```bash
# Obrigatórias
DATABASE_URL=<seu_postgre_url_aqui>  # Render fornece automaticamente
ASPNETCORE_ENVIRONMENT=Production
PORT=10000

# JWT (obrigatorias - nao deixe no appsettings)
JwtSettings__SecretKey=KTJPv8jTQGKi8bgGyPYk1YqfOVg3jF3TtWgdcTmstZpFgWeRXLzSHOKlYMFgY2Ky
JwtSettings__Issuer=ChurchManagementAPI
JwtSettings__Audience=ChurchManagementUsers
```

### 3. Build Commands (Render):
- **Build Command**: `./build.sh`
- **Start Command**: `./start.sh`

## 🌐 Deploy do Frontend (Vercel)

### 1. Deploy via Vercel CLI ou Dashboard:

#### Via Dashboard:
1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Clique "New Project"
3. Conecte seu repositório GitHub  
4. Configure:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### Via CLI:
```bash
cd frontend
npx vercel --prod
```

### 2. Variáveis de Ambiente no Vercel:
```bash
VITE_API_URL=https://church-management-backend-7owp.onrender.com/api
```

## 🔗 Configuração Final

1. **Após o deploy do backend**, copie a URL do Render
2. **Atualize a variável `VITE_API_URL`** no Vercel com a URL real
3. **Atualize `AllowedOrigins`** no `appsettings.Production.json` com a URL do Vercel
4. **Redeployar o backend** no Render

## 📱 URLs Finais
- **Backend**: `https://church-management-backend-7owp.onrender.com`
- **Backend API**: `https://church-management-backend-7owp.onrender.com/api`
- **Formulário Público**: `https://church-management-backend-7owp.onrender.com/preregistration.html`
- **Swagger**: `https://church-management-backend-7owp.onrender.com/swagger`
- **Frontend**: `https://seu-app.vercel.app` (após deploy no Vercel)

## ⚠️ Notas Importantes
- **Render free tier**: Hiberna após 15min de inatividade
- **PostgreSQL**: Render oferece PostgreSQL gratuito com alguns limites
- **CORS**: Configurado automaticamente para desenvolvimento e produção
- **SSL**: Ambos Render e Vercel oferecem HTTPS automático

## 🔍 Troubleshooting
1. **API não conecta**: Verifique `VITE_API_URL` no Vercel
2. **CORS Error**: Atualize `AllowedOrigins` no backend
3. **Database Error**: Verifique `DATABASE_URL` no Render
4. **Build Error**: Confirme que todas as dependências estão no `package.json`
5. **Migration Error "no such table"**: 
   - Verifique se DATABASE_URL está configurada no Render
   - Se usar SQLite, delete e redesploy o serviço
   - Recomendado: Use PostgreSQL do Render (mais estável)

## 🐛 Erro Comum: "SQLite Error 1: 'no such table: Users'"

**Causa**: Migrações não aplicadas corretamente durante o deploy.

**Solução Rápida**:
1. No Render Dashboard, vá em seu serviço
2. Vá em "Environment" 
3. Adicione uma nova variável:
   - **Name**: `FORCE_DB_CREATE`
   - **Value**: `true`
4. Clique "Save Changes" e o serviço será redesployed
5. Após sucesso, **remova** essa variável

**Solução Recomendada** (PostgreSQL):
1. No Render Dashboard, clique "New +" → "PostgreSQL"
2. Crie um banco gratuito
3. Copie a **External Connection String**
4. No seu Web Service → Environment, adicione:
   - **Name**: `DATABASE_URL`
   - **Value**: `postgresql://user:password@hostname:port/database`
5. Redesploy o serviço